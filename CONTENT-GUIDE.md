# Adding Content to Beautiful Blog

A practical guide for adding and editing content on the site — no framework knowledge required beyond editing text files and running one terminal command. If you get stuck, `npm run dev` and watch the page reload as you save.

---

## Before you start

- **Preview locally:** `npm run dev`, then open the URL it prints. Every save updates the page automatically.
- **Where things live:**
  - `src/content/posts/` — one `.mdx` file per entry (a post)
  - `public/photos/` — every photo file, referenced from posts by path
  - `src/pages/about/index.astro` — the About page
  - `src/components/Header.astro` — the site's nav links
- Nothing needs to be "published" separately — save the file, and (once you deploy) it's live.

---

## 0. The fast way: `npm run ingest`

If you've already exported a set of photos from Lightroom into one folder, you don't have to do Step 1 by hand. Run:

```
npm run ingest -- /path/to/your/exported/photos your-post-slug
```

This does the mechanical parts of Step 1 for you: it copies the photos into `public/photos/`, figures out each photo's orientation from its own file data, picks the first photo (by filename) as the cover, and writes a new `.mdx` file — as a **draft**, so it stays invisible on the site until you're ready.

What it does NOT do — you still write these by hand, same as always:
- The title, excerpt, and tag
- Every photo's `alt` text (a real description of what's in it — the ingest tool leaves `"TODO"` as a placeholder)
- Any captions or the body writing between/around the photos

**Order matters before you run it:** the ingest tool uses filename order to decide both the order photos appear in and which one becomes the cover (whichever sorts first). Rename the files in your export folder first if you want a different order — `1-first.jpg`, `2-second.jpg`, etc. works well.

**Once it's done:** open the new `.mdx` file in `src/content/posts/`, fill in the fields above (see Step 3 for what each one means), and preview with `npm run dev` — same as any other post. When it's ready, remove the `draft: true` line.

**One safety net:** `./push.sh` refuses to push if any post anywhere still has `draft: true` or leftover `"TODO"` alt text — it'll tell you exactly which file and field. This is what stops a half-finished post from accidentally going live.

If the ingest tool errors out (bad slug, an already-used slug, an empty folder, a non-JPEG file in the mix), it explains what's wrong and doesn't touch any files — just fix the folder or the slug and run it again.

---

## 1. Adding a new page (a photo entry) — the manual way

Every entry on the site — what shows up in the home grid — is one `.mdx` file in `src/content/posts/`. `.mdx` is Markdown with one extra ability: you can drop in a `<Photo />` tag anywhere in your writing, which is how photos and text get mixed together.

### Step 1: Add your photo(s)

Drop the image file(s) into `public/photos/`. Use a short, descriptive filename (`low-tide-tofino.jpg`, not `IMG_4821.jpg`) — it makes the next step easier to read later.

A sensible size to export at: **around 1400px on the long edge for landscape photos, 1000px for portrait**. That's what the current demo photos use — big enough to look sharp in the fullscreen viewer, small enough to keep the site fast.

### Step 2: Create the entry file

Create a new file: `src/content/posts/your-entry-slug.mdx`

The filename (the "slug") becomes the URL — `a-walk-worth-writing-down.mdx` becomes `/posts/a-walk-worth-writing-down/`. Use lowercase words separated by hyphens, no spaces or punctuation.

### Step 3: Fill in the frontmatter

Every entry starts with a frontmatter block (between the `---` lines). Unlike the photos themselves, this block only needs to describe the **cover photo** — the one representative image shown on the home grid tile. Here's the template:

```markdown
---
title: "A Walk Worth Writing Down"
excerpt: "Nothing happened, which is exactly why I wanted to write it down."
date: 2026-08-07
tag: "Field Log"
cover:
  src: "/photos/your-photo.jpg"
  alt: "A short, literal description of what's in the photo."
  orientation: landscape
---

Your writing and photos go here — see Step 4.
```

**Field by field:**

| Field | What it does |
|---|---|
| `title` | The entry's headline. Shows on the grid tile and the entry page. |
| `excerpt` | Currently unused on-page (a holdover field), but keep it filled in — it's a short one-line summary, good for your own reference and for if it's wired into an RSS feed or search later. |
| `date` | Controls sort order — entries show newest-first everywhere. Format: `YYYY-MM-DD`. |
| `tag` | A short category label, shown next to the date (e.g. `Landscape`, `Portrait`, `Travel`, `Details`). Free text — reuse existing tags to keep the vocabulary small, or introduce a new one; there's no fixed list to register it in. |
| `cover` | The grid-tile photo: `src`, `alt`, and `orientation` (`landscape` or `portrait`). This should match whichever photo you consider the entry's lead image — normally the first one in your writing (see Step 4). |
| `draft` | Optional. Add `draft: true` to keep an entry out of the site while you're still working on it — it won't build/show anywhere until you remove that line or set it to `false`. |

### Step 4: Write your entry — text and photos, in any order

Everything below the closing `---` is a mix of ordinary Markdown paragraphs and `<Photo />` tags, in whatever order you want them to appear:

```mdx
A short line to open with.

<Photo
  src="/photos/your-photo.jpg"
  alt="A short, literal description of what's in the photo."
  orientation="landscape"
  credit="Your Name"
  creditUrl="https://your-site-or-portfolio.example"
/>

A paragraph about that photo, or about anything else. Leave a
blank line between paragraphs — that's what starts a new one.

<Photo
  src="/photos/another-photo.jpg"
  alt="Another literal description."
  orientation="portrait"
  credit="Your Name"
  creditUrl="https://your-site-or-portfolio.example"
  caption="A small line shown right under this photo, in the fullscreen view too."
/>

A closing paragraph.
```

**Every `<Photo />` needs five things**, written as `name="value"`:

- **`src`** — the path, always starting with `/photos/` and matching the filename you put in `public/photos/`.
- **`alt`** — a plain description of what's in the photo, for screen readers and search engines. Describe the content, not your feelings about it ("A pier extending into calm water at dusk," not "A peaceful evening").
- **`orientation`** — `landscape` or `portrait`, matching the actual shape of the image. This controls how wide the photo displays on the entry page and in the fullscreen viewer, so get it right.
- **`credit`** — whoever took the photo. For your own work, your own name.
- **`creditUrl`** — a link that goes with the credit. For your own photos, link to your own site, portfolio, or Instagram — anywhere that makes sense. This must be a real URL (even if it just points back to your own About page or homepage).

**One optional sixth thing:**

- **`caption`** — a short line of description or commentary shown directly under that photo, and also shown in the fullscreen viewer when someone clicks through. Leave it off entirely if a photo doesn't need one — most won't. It's for a quick note ("Midday, no plan beyond being outside"), not a full paragraph; use ordinary body text before/after the photo for anything longer.

**Order is simply the order you write things in** — photos and paragraphs render top to bottom exactly as they appear in the file. Put a paragraph between two photos, or two photos back to back with nothing between them, however suits the entry.

A `<Photo />` tag is self-contained: always close it with `/>` at the end, and always keep a blank line before and after it, same as a paragraph.

One photo makes a normal entry. Two or more make a "photo essay" — the home grid tile automatically shows a small "N photos" badge, and all of them are viewable in the fullscreen slideshow, in the order they appear in the file.

That's it — save the file, and the entry appears on the home grid automatically (no other file needs updating).

### A worked example

```mdx
---
title: "What the Rain Left"
excerpt: "A short walk after three days of rain."
date: 2026-08-07
tag: "Landscape"
cover:
  src: "/photos/waterfall.jpg"
  alt: "A waterfall cascading over dark rocks in a forested gorge."
  orientation: landscape
---

Three days of rain and the falls actually looked like something.

<Photo
  src="/photos/waterfall.jpg"
  alt="A waterfall cascading over dark rocks in a forested gorge."
  orientation="landscape"
  credit="Your Name"
  creditUrl="https://your-site.example"
  caption="Loud the whole way up, for once."
/>

Lower down, the same water spreads out and goes quiet again.

<Photo
  src="/photos/stream.jpg"
  alt="A shallow forest stream running over rocks."
  orientation="landscape"
  credit="Your Name"
  creditUrl="https://your-site.example"
/>

I like that better, honestly.
```

This produces: an opening line, the waterfall photo (with its small caption), a paragraph, the stream photo (no caption — that's fine), then a closing line.

---

## 2. Adding a new section (a new top-level page)

"Sections" here means a new page that lives in the site's main navigation, alongside "Index" and "About" — for example a "Contact" or "Prints" page. This does require touching two small code files, but neither requires understanding the framework.

### Step 1: Create the page

Make a new folder and file: `src/pages/your-section/index.astro`

The easiest way is to copy `src/pages/about/index.astro` as a starting point and edit it — it already has the right layout, header, and footer wired in. At minimum, change:

- The `<BaseLayout title="..." description="...">` line, to your new page's title
- The `<h1>` and the body content inside `<div class="about__body">` (you can rename that class if you like, but it's not required to)

Delete the `<figure class="about__portrait">` image block if the new page doesn't need a photo.

### Step 2: Add it to the navigation

Open `src/components/Header.astro` and find this near the top:

```js
const links = [
  { href: '/', label: 'Index' },
  { href: '/about/', label: 'About' },
];
```

Add a line for your new page:

```js
const links = [
  { href: '/', label: 'Index' },
  { href: '/about/', label: 'About' },
  { href: '/your-section/', label: 'Your Label' },
];
```

The `href` must match the folder name you created in Step 1 (with slashes on both sides). Save, and the new link appears in the header on every page.

---

## 3. Editing the About page

File: `src/pages/about/index.astro`

### Changing the portrait photo

Near the top of the file:

```js
const portrait = {
  src: '/photos/30-91.jpg',
  alt: 'A photographer in black and white, looking down while holding an old camera.',
  credit: 'Jennifer Trovato',
  creditUrl: 'https://unsplash.com/photos/baRYCsjO6z4',
};
```

Replace all four values the same way you would for a post photo (see §1, Step 4 above — same fields, just written as a JS object here instead of a `<Photo />` tag) — put your new image in `public/photos/`, update `src` to match, write a real `alt` description, and update `credit`/`creditUrl` to yourself. You can also delete the whole `<figure class="about__portrait">...</figure>` block further down if you'd rather not have a photo on this page at all.

### Editing the bio text

Further down, inside `<div class="about__body">`, each `<p>...</p>` is one paragraph. Edit the text directly between the tags — it's plain HTML at this point, not Markdown, so avoid pasting in Markdown syntax like `**bold**`, it won't render.

### Removing the placeholder note

The last paragraph, styled in italics with a line above it:

```html
<p class="about__note">
  This page — and every photo on this site right now — is placeholder content...
</p>
```

Delete this whole `<p>` once you've replaced the demo photos and bio with your own — it exists only to flag that the current content is a placeholder.

---

## Quick reference

| I want to... | Do this |
|---|---|
| Add a new photo entry from a Lightroom export folder | `npm run ingest -- /path/to/folder your-slug` (see §0), then fill in the text by hand |
| Add a new photo entry from scratch | New `.mdx` file in `src/content/posts/`, photos in `public/photos/` |
| Put text between two photos | Just write it between their `<Photo />` tags, in the order you want |
| Give one photo a small description | Add `caption="..."` to that `<Photo />` tag — it shows on the page and in the fullscreen viewer |
| Hide an entry temporarily | Add `draft: true` to its frontmatter |
| Reorder entries | Change the `date` field — sort is always newest-first |
| Change what's on the home tile | Edit `title`, `tag`, or the `cover` object in frontmatter |
| Add a new nav page | New folder in `src/pages/`, then add it to `Header.astro`'s `links` |
| Edit the bio | `src/pages/about/index.astro`, inside `.about__body` |
| Preview changes | `npm run dev` |
| Build for deployment | `npm run build` |
