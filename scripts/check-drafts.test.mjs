import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { findFlaggedPosts } from './check-drafts.mjs';

const CLEAN_POST = `---
title: "A Walk"
excerpt: "Nothing happened."
date: 2026-08-08
tag: "Field Log"
cover:
  src: "/photos/walk.jpg"
  alt: "A gravel path through tall grass."
  orientation: landscape
draft: false
---

<Photo src="/photos/walk.jpg" alt="A gravel path through tall grass." orientation="landscape" credit="A" creditUrl="https://a.example" />

Some real writing.
`;

const DRAFT_POST = `---
title: "Untitled"
excerpt: ""
date: 2026-08-08
tag: ""
cover:
  src: "/photos/untitled-1.jpg"
  alt: "A gravel path through tall grass."
  orientation: landscape
draft: true
---

<Photo src="/photos/untitled-1.jpg" alt="A gravel path through tall grass." orientation="landscape" credit="A" creditUrl="https://a.example" />
`;

const PLACEHOLDER_COVER_ALT_POST = `---
title: "Untitled 2"
excerpt: ""
date: 2026-08-08
tag: ""
cover:
  src: "/photos/untitled2-1.jpg"
  alt: "TODO"
  orientation: landscape
draft: false
---

<Photo src="/photos/untitled2-1.jpg" alt="A real description." orientation="landscape" credit="A" creditUrl="https://a.example" />
`;

const PLACEHOLDER_BODY_ALT_POST = `---
title: "Untitled 3"
excerpt: ""
date: 2026-08-08
tag: ""
cover:
  src: "/photos/untitled3-1.jpg"
  alt: "A real description."
  orientation: landscape
draft: false
---

<Photo src="/photos/untitled3-1.jpg" alt="TODO" orientation="landscape" credit="A" creditUrl="https://a.example" />
`;

describe('findFlaggedPosts', () => {
  let dir;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'check-drafts-test-'));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns nothing for an empty posts directory', async () => {
    expect(await findFlaggedPosts(dir)).toEqual([]);
  });

  it('returns nothing when the posts directory does not exist', async () => {
    expect(await findFlaggedPosts(path.join(dir, 'nope'))).toEqual([]);
  });

  it('does not flag a clean, finished post', async () => {
    await writeFile(path.join(dir, 'a-walk.mdx'), CLEAN_POST);
    expect(await findFlaggedPosts(dir)).toEqual([]);
  });

  it('flags draft: true', async () => {
    await writeFile(path.join(dir, 'untitled.mdx'), DRAFT_POST);
    const flagged = await findFlaggedPosts(dir);
    expect(flagged).toHaveLength(1);
    expect(flagged[0].filename).toBe('untitled.mdx');
    expect(flagged[0].reasons).toContain('draft: true');
  });

  it('flags a placeholder cover.alt', async () => {
    await writeFile(path.join(dir, 'untitled2.mdx'), PLACEHOLDER_COVER_ALT_POST);
    const flagged = await findFlaggedPosts(dir);
    expect(flagged).toHaveLength(1);
    expect(flagged[0].reasons).toContain('cover.alt is still the placeholder');
  });

  it('flags a placeholder body <Photo alt="TODO">', async () => {
    await writeFile(path.join(dir, 'untitled3.mdx'), PLACEHOLDER_BODY_ALT_POST);
    const flagged = await findFlaggedPosts(dir);
    expect(flagged).toHaveLength(1);
    expect(flagged[0].reasons).toContain('one or more <Photo /> tags still have alt="TODO"');
  });

  it('flags multiple posts independently, each with its own reasons', async () => {
    await writeFile(path.join(dir, 'a-walk.mdx'), CLEAN_POST);
    await writeFile(path.join(dir, 'untitled.mdx'), DRAFT_POST);
    await writeFile(path.join(dir, 'untitled2.mdx'), PLACEHOLDER_COVER_ALT_POST);
    const flagged = await findFlaggedPosts(dir);
    expect(flagged.map((f) => f.filename).sort()).toEqual(['untitled.mdx', 'untitled2.mdx']);
  });

  it('collects multiple reasons on the same post', async () => {
    const both = DRAFT_POST.replace('alt: "A gravel path through tall grass."', 'alt: "TODO"');
    await writeFile(path.join(dir, 'untitled.mdx'), both);
    const flagged = await findFlaggedPosts(dir);
    expect(flagged[0].reasons.length).toBeGreaterThanOrEqual(2);
  });
});
