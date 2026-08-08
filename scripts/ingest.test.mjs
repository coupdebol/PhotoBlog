import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile, readdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import {
  validateSlug,
  checkSlugCollision,
  readSourceFolder,
  computeOrientation,
  readPhotoOrientation,
  buildFrontmatter,
  ingest,
  ALT_PLACEHOLDER,
} from './ingest.mjs';

const FIXTURES = path.join(import.meta.dirname, '__fixtures__');
const LANDSCAPE_FIXTURE = path.join(FIXTURES, 'a-landscape.jpg');
const PORTRAIT_FIXTURE = path.join(FIXTURES, 'b-portrait.jpg');

describe('validateSlug', () => {
  it('accepts lowercase letters, digits, and hyphens', () => {
    expect(() => validateSlug('low-tide-tofino-2')).not.toThrow();
  });

  it('rejects a slug containing a slash (path traversal shape)', () => {
    expect(() => validateSlug('../etc/passwd')).toThrow(/Invalid slug/);
  });

  it('rejects uppercase letters', () => {
    expect(() => validateSlug('LowTide')).toThrow(/Invalid slug/);
  });

  it('rejects spaces', () => {
    expect(() => validateSlug('low tide')).toThrow(/Invalid slug/);
  });

  it('rejects an empty string', () => {
    expect(() => validateSlug('')).toThrow(/Invalid slug/);
  });
});

describe('checkSlugCollision', () => {
  let dir;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'ingest-test-'));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('passes when no post exists at the slug', async () => {
    await expect(checkSlugCollision('new-post', dir)).resolves.toBeUndefined();
  });

  it('throws when a post already exists at the slug', async () => {
    await writeFile(path.join(dir, 'existing-post.mdx'), '---\ntitle: x\n---\n');
    await expect(checkSlugCollision('existing-post', dir)).rejects.toThrow(/already exists/);
  });
});

describe('readSourceFolder', () => {
  let dir;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'ingest-test-'));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns JPEG files sorted by filename', async () => {
    await writeFile(path.join(dir, '10.jpg'), '');
    await writeFile(path.join(dir, '2.jpg'), '');
    await writeFile(path.join(dir, '1.jpg'), '');
    const files = await readSourceFolder(dir);
    expect(files).toEqual(['1.jpg', '2.jpg', '10.jpg']);
  });

  it('throws on an empty folder', async () => {
    await expect(readSourceFolder(dir)).rejects.toThrow(/No files found/);
  });

  it('throws when a non-JPEG file is present', async () => {
    await writeFile(path.join(dir, '1.jpg'), '');
    await writeFile(path.join(dir, 'notes.png'), '');
    await expect(readSourceFolder(dir)).rejects.toThrow(/Non-JPEG file/);
  });

  it('throws on a nonexistent folder', async () => {
    await expect(readSourceFolder(path.join(dir, 'nope'))).rejects.toThrow(/not found/);
  });
});

describe('computeOrientation', () => {
  it('normal tag (1), wide image → landscape', () => {
    expect(computeOrientation({ orientationTag: 1, width: 1400, height: 933 })).toEqual({
      orientation: 'landscape',
      fallback: false,
    });
  });

  it('normal tag (1), tall image → portrait', () => {
    expect(computeOrientation({ orientationTag: 1, width: 1000, height: 1334 })).toEqual({
      orientation: 'portrait',
      fallback: false,
    });
  });

  it('rotated tag (6), raw-tall dimensions → landscape after swap', () => {
    // A camera photographed in landscape but stored rotated 90° CW: raw
    // pixel dimensions are tall, but the true displayed orientation is wide.
    expect(computeOrientation({ orientationTag: 6, width: 933, height: 1400 })).toEqual({
      orientation: 'landscape',
      fallback: false,
    });
  });

  it('rotated tag (8), raw-tall dimensions → landscape after swap', () => {
    expect(computeOrientation({ orientationTag: 8, width: 933, height: 1400 })).toEqual({
      orientation: 'landscape',
      fallback: false,
    });
  });

  it('no orientation tag, rectangular image → falls back to raw dimensions, flagged', () => {
    expect(computeOrientation({ orientationTag: undefined, width: 1400, height: 933 })).toEqual({
      orientation: 'landscape',
      fallback: true,
    });
  });

  it('no orientation tag, square image → defaults to landscape, flagged', () => {
    expect(computeOrientation({ orientationTag: undefined, width: 1000, height: 1000 })).toEqual({
      orientation: 'landscape',
      fallback: true,
    });
  });

  it('no width/height at all → defaults to landscape, flagged', () => {
    expect(computeOrientation({ orientationTag: 1, width: undefined, height: undefined })).toEqual({
      orientation: 'landscape',
      fallback: true,
    });
  });
});

describe('readPhotoOrientation (real EXIF smoke test)', () => {
  it('reads a real landscape photo correctly', async () => {
    const result = await readPhotoOrientation(LANDSCAPE_FIXTURE);
    expect(result).toEqual({ orientation: 'landscape', fallback: false });
  });

  it('reads a real portrait photo correctly', async () => {
    const result = await readPhotoOrientation(PORTRAIT_FIXTURE);
    expect(result).toEqual({ orientation: 'portrait', fallback: false });
  });
});

describe('buildFrontmatter', () => {
  it('writes date, draft:true, and TODO sentinels for cover and body alt', () => {
    const photos = [
      { publicName: 'my-post-1.jpg', orientation: 'landscape' },
      { publicName: 'my-post-2.jpg', orientation: 'portrait' },
    ];
    const mdx = buildFrontmatter({ photos, today: '2026-08-08' });
    const parsed = matter(mdx);

    expect(parsed.data.date).toBe('2026-08-08');
    expect(parsed.data.draft).toBe(true);
    expect(parsed.data.title).toBe('');
    expect(parsed.data.excerpt).toBe('');
    expect(parsed.data.tag).toBe('');
    expect(parsed.data.cover).toEqual({
      src: '/photos/my-post-1.jpg',
      alt: ALT_PLACEHOLDER,
      orientation: 'landscape',
    });
    expect(parsed.content).toContain(`<Photo src="/photos/my-post-1.jpg" alt="${ALT_PLACEHOLDER}"`);
    expect(parsed.content).toContain(`<Photo src="/photos/my-post-2.jpg" alt="${ALT_PLACEHOLDER}"`);
  });
});

describe('ingest (end-to-end)', () => {
  let sourceDir;
  let repoDir;
  let postsDir;
  let photosDir;

  beforeEach(async () => {
    sourceDir = await mkdtemp(path.join(tmpdir(), 'ingest-source-'));
    repoDir = await mkdtemp(path.join(tmpdir(), 'ingest-repo-'));
    postsDir = path.join(repoDir, 'src/content/posts');
    photosDir = path.join(repoDir, 'public/photos');
    await writeFile(path.join(sourceDir, '1-first.jpg'), await readFile(LANDSCAPE_FIXTURE));
    await writeFile(path.join(sourceDir, '2-second.jpg'), await readFile(PORTRAIT_FIXTURE));
  });

  afterEach(async () => {
    await rm(sourceDir, { recursive: true, force: true });
    await rm(repoDir, { recursive: true, force: true });
  });

  it('copies photos, renames them by slug+index, and writes a draft .mdx', async () => {
    const result = await ingest({ folder: sourceDir, slug: 'my-test-post', postsDir, photosDir });

    expect(result.photoCount).toBe(2);
    expect(result.orientationFallbackUsed).toBe(false);

    const mdx = await readFile(result.mdxPath, 'utf8');
    const parsed = matter(mdx);
    expect(parsed.data.cover.src).toBe('/photos/my-test-post-1.jpg');
    expect(parsed.data.draft).toBe(true);

    const photoFiles = await readdir(photosDir);
    expect(photoFiles.sort()).toEqual(['my-test-post-1.jpg', 'my-test-post-2.jpg']);
  });

  it('validates before writing: a slug collision leaves no photos copied and the existing post untouched', async () => {
    await mkdir(postsDir, { recursive: true });
    await writeFile(path.join(postsDir, 'my-test-post.mdx'), '---\ntitle: existing\n---\n');

    await expect(ingest({ folder: sourceDir, slug: 'my-test-post', postsDir, photosDir })).rejects.toThrow(
      /already exists/
    );

    // No photos directory was ever created — collision was caught before any write.
    await expect(access(photosDir)).rejects.toThrow();
    const existing = await readFile(path.join(postsDir, 'my-test-post.mdx'), 'utf8');
    expect(existing).toBe('---\ntitle: existing\n---\n');
  });
});
