#!/usr/bin/env node
import { readdir, mkdir, copyFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import exifr from 'exifr';
import { ownerName, ownerUrl } from './ingest.config.mjs';

export const ALT_PLACEHOLDER = 'TODO';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg']);

export function validateSlug(slug) {
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Invalid slug "${slug}" — slugs must be lowercase letters, digits, and hyphens only (e.g. "low-tide-tofino").`
    );
  }
}

export async function checkSlugCollision(slug, postsDir) {
  const target = path.join(postsDir, `${slug}.mdx`);
  try {
    await access(target, fsConstants.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  throw new Error(`A post already exists at ${target} — pick a different slug or remove it first.`);
}

export async function readSourceFolder(folder) {
  let entries;
  try {
    entries = await readdir(folder, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Source folder not found: ${folder}`);
    }
    throw err;
  }
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  if (files.length === 0) {
    throw new Error(`No files found in ${folder}.`);
  }
  const nonImages = files.filter((name) => !IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()));
  if (nonImages.length > 0) {
    throw new Error(
      `Non-JPEG file(s) found in ${folder}: ${nonImages.join(', ')}. Only .jpg/.jpeg exports are supported.`
    );
  }
  return files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

// EXIF orientation tags 5-8 mean the image is rotated 90°, which swaps which
// raw dimension is "wide" vs "tall" — naive width/height comparison alone
// misclassifies these. Pure function: takes already-extracted values so it's
// testable without real image fixtures.
export function computeOrientation({ orientationTag, width, height }) {
  if (!width || !height) {
    return { orientation: 'landscape', fallback: true };
  }
  if (!orientationTag) {
    return { orientation: width >= height ? 'landscape' : 'portrait', fallback: true };
  }
  const swapped = orientationTag >= 5 && orientationTag <= 8;
  const effectiveWidth = swapped ? height : width;
  const effectiveHeight = swapped ? width : height;
  return { orientation: effectiveWidth >= effectiveHeight ? 'landscape' : 'portrait', fallback: false };
}

export async function readPhotoOrientation(filePath) {
  // translateValues: false — exifr otherwise returns Orientation as a
  // human-readable string ("Horizontal (normal)") instead of the numeric
  // 1-8 tag computeOrientation expects.
  const data = await exifr
    .parse(filePath, {
      pick: ['Orientation', 'ExifImageWidth', 'ExifImageHeight', 'ImageWidth', 'ImageHeight'],
      translateValues: false,
    })
    .catch(() => null);
  const width = data?.ExifImageWidth ?? data?.ImageWidth;
  const height = data?.ExifImageHeight ?? data?.ImageHeight;
  return computeOrientation({ orientationTag: data?.Orientation, width, height });
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildFrontmatter({ photos, today = todayISODate() }) {
  const cover = photos[0];
  const data = {
    title: '',
    excerpt: '',
    date: today,
    tag: '',
    cover: {
      src: `/photos/${cover.publicName}`,
      alt: ALT_PLACEHOLDER,
      orientation: cover.orientation,
    },
    draft: true,
  };
  const body = photos
    .map(
      (p) =>
        `<Photo src="/photos/${p.publicName}" alt="${ALT_PLACEHOLDER}" orientation="${p.orientation}" credit="${ownerName}" creditUrl="${ownerUrl}" />`
    )
    .join('\n\n');
  return matter.stringify(`\n${body}\n`, data);
}

// Validation phase (slug, collision, folder/file checks) and orientation
// reads all happen before any filesystem write — the write phase below is
// only reached once every prior step has succeeded. A failure here leaves
// nothing behind to clean up; a failure during the write phase is recovered
// the same way as any other uncommitted change in this git-tracked repo
// (git status / git checkout --), so no custom rollback is implemented.
export async function ingest({ folder, slug, postsDir, photosDir }) {
  validateSlug(slug);
  await checkSlugCollision(slug, postsDir);
  const files = await readSourceFolder(folder);

  let orientationFallbackUsed = false;
  const photos = [];
  for (const [index, filename] of files.entries()) {
    const sourcePath = path.join(folder, filename);
    const { orientation, fallback } = await readPhotoOrientation(sourcePath);
    if (fallback) orientationFallbackUsed = true;
    const publicName = `${slug}-${index + 1}${path.extname(filename).toLowerCase()}`;
    photos.push({ sourcePath, publicName, orientation });
  }

  await mkdir(photosDir, { recursive: true });
  await mkdir(postsDir, { recursive: true });
  for (const photo of photos) {
    await copyFile(photo.sourcePath, path.join(photosDir, photo.publicName));
  }
  const mdxPath = path.join(postsDir, `${slug}.mdx`);
  await writeFile(mdxPath, buildFrontmatter({ photos }), 'utf8');

  return { slug, photoCount: photos.length, orientationFallbackUsed, mdxPath };
}

async function main() {
  const [, , folder, slug] = process.argv;
  if (!folder || !slug) {
    console.error('Usage: npm run ingest -- <folder> <slug>');
    process.exitCode = 1;
    return;
  }
  const repoRoot = process.cwd();
  const postsDir = path.join(repoRoot, 'src/content/posts');
  const photosDir = path.join(repoRoot, 'public/photos');
  try {
    const result = await ingest({ folder: path.resolve(folder), slug, postsDir, photosDir });
    console.log(`Ingested ${result.photoCount} photo(s) into ${result.mdxPath} (draft: true).`);
    if (result.orientationFallbackUsed) {
      console.log(
        'Note: at least one photo had no usable EXIF orientation tag — its orientation was guessed from raw dimensions. Double-check it.'
      );
    }
    console.log('Next: edit the title, excerpt, tag, alt text, and captions, then remove draft: true when ready.');
  } catch (err) {
    console.error(`Ingest failed: ${err.message}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
