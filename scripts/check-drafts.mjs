#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { ALT_PLACEHOLDER } from './ingest.mjs';

// Scans every post in src/content/posts/ (deliberately repo-wide, not scoped
// to files changed in this push — see the design doc's Open Questions for
// why that's a stated tradeoff, not an oversight).
export async function findFlaggedPosts(postsDir) {
  let entries;
  try {
    entries = await readdir(postsDir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const flagged = [];
  for (const filename of entries.filter((f) => f.endsWith('.mdx'))) {
    const filePath = path.join(postsDir, filename);
    const raw = await readFile(filePath, 'utf8');
    const parsed = matter(raw);
    const reasons = [];

    if (parsed.data.draft === true) {
      reasons.push('draft: true');
    }
    if (parsed.data.cover?.alt === ALT_PLACEHOLDER) {
      reasons.push('cover.alt is still the placeholder');
    }
    if (new RegExp(`alt="${ALT_PLACEHOLDER}"`).test(parsed.content)) {
      reasons.push('one or more <Photo /> tags still have alt="TODO"');
    }

    if (reasons.length > 0) {
      flagged.push({ filename, reasons });
    }
  }
  return flagged;
}

async function main() {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const flagged = await findFlaggedPosts(postsDir);

  if (flagged.length === 0) {
    console.log('check-drafts: clean — no drafts or placeholder alt text found.');
    return;
  }

  console.error('check-drafts: found unfinished posts —');
  for (const { filename, reasons } of flagged) {
    console.error(`  ${filename}: ${reasons.join('; ')}`);
  }
  process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
