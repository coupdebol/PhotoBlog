# Adding Content to Beautiful Blog

A practical guide for adding and editing content on the site — no framework knowledge required beyond editing text files and running one terminal command. If you get stuck, `npm run dev` and watch the page reload as you save.

---

## Before you start

- **Preview locally:** `npm run dev`, then open the URL it prints. Every save updates the page automatically.
- **Where things live:**
  - `src/content/posts/` — one Markdown file per entry (a post)
  - `public/photos/` — every photo file, referenced from posts by path
  - `src/pages/about/index.astro` — the About page
  - `src/components/Header.astro` — the site's nav links
- Nothing needs to be "published" separately — save the file, and (once you deploy) it's live.

---

## 1. Adding a new page (a photo entry)

Every entry on the site — what shows up in the home grid — is one Markdown file in `src/content/posts/`.

### Step 1: Add your photo(s)

Drop the image file(s) into `public/photos/`. Use a short, descriptive filename (`low-tide-tofino.jpg`, not `IMG_4821.jpg`) — it makes the next step easier to read later.

A sensible size to export at: **around 1400px on the long edge for landscape photos, 1000px for portrait**. That's what the current demo photos use — big enough to look sharp in the fullscreen viewer, small enough to keep the site fast.

### Step 2: Create the entry file

Create a new file: `src/content/posts/your-entry-slug.md`

The filename (the "slug") becomes the URL — `a-walk-worth-writing-down.md` becomes `/posts/a-walk-worth-writing-down/`. Use lowercase words separated by hyphens, no spaces or punctuation.

### Step 3: Fill in the frontmatter

Every entry starts with a frontmatter block (between the `---` lines) followed by your writing. Here's the template:

```markdown
---
title: "A Walk Worth Writing Down"
excerpt: "Nothing happened, which is exactly why I wanted to write it down."
date: 2026-08-07
tag: "Field Log"
photos:
  - src: "/photos/your-photo.jpg"
    alt: "A short, literal description of what's in the photo."
    orientation: landscape
    credit: "Your Name"
    creditUrl: "https://your-site-or-portfolio.example"
---

Your writing goes here, in ordinary paragraphs.
```

**Field by field:**

| Field | What it does |
|---|---|
| `title` | The entry's headline. Shows on the grid tile and the entry page. |
| `excerpt` | Currently unused on-page (a holdover field), but keep it filled in — it's a short one-line summary, good for your own reference and for if it's wired into an RSS feed or search later. |
| `date` | Controls sort order — entries show newest-first everywhere. Format: `YYYY-MM-DD`. |
| `tag` | A short category label, shown next to the date (e.g. `Landscape`, `Portrait`, `Travel`, `Details`). Free text — reuse existing tags to keep the vocabulary small, or introduce a new one; there's no fixed list to register it in. |
| `photos` | A list of one or more photos (see below). |
| `draft` | Optional. Add `draft: true` to keep an entry out of the site while you're still working on it — it won't build/show anywhere until you remove that line or set it to `false`. |

### Step 4: The `photos` list

Each photo needs five things:

- **`src`** — the path, always starting with `/photos/` and matching the filename you put in `public/photos/`.
- **`alt`** — a plain description of what's in the photo, for screen readers and search engines. Describe the content, not your feelings about it ("A pier extending into calm water at dusk," not "A peaceful evening").
- **`orientation`** — `landscape` or `portrait`, matching the actual shape of the image. This controls how wide the photo displays on the entry page and in the fullscreen viewer, so get it right.
- **`credit`** — whoever took the photo. For your own work, your own name.
- **`creditUrl`** — a link that goes with the credit. For your own photos, link to your own site, portfolio, or Instagram — anywhere that makes sense. This field is required and must be a real URL (even if it just points back to your own About page or homepage).

**Order matters:** photos display in exactly the order you list them, top to bottom. The **first photo in the list is also the cover image** shown on the home grid tile, so put your strongest single image first.

One photo makes a normal entry. Two or more make a "photo essay" — the home grid tile automatically shows a small "N photos" badge, and all of them are viewable in the fullscreen slideshow.

### Step 5: Write the text

Everything below the closing `---` is your writing, in plain Markdown:

```markdown
First paragraph. Leave a blank line between paragraphs — that's
what starts a new one.

Second paragraph.

- Bullet points work too
- Like this
```

**Important layout fact:** all the photos in your `photos` list render first, as a block, followed by all of your writing below them. There's currently no way to place a paragraph *between* two photos, or a photo in the middle of your text — text always comes after every photo. If you want that later, it's a small template change, not something you can do from the content file alone — just ask.

That's it — save the file, and the entry appears on the home grid automatically (no other file needs updating).

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

Replace all four values the same way you would for a post photo (see §1, Step 4 above) — put your new image in `public/photos/`, update `src` to match, write a real `alt` description, and update `credit`/`creditUrl` to yourself. You can also delete the whole `<figure class="about__portrait">...</figure>` block further down if you'd rather not have a photo on this page at all.

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
| Add a new photo entry | New file in `src/content/posts/`, photos in `public/photos/` |
| Hide an entry temporarily | Add `draft: true` to its frontmatter |
| Reorder entries | Change the `date` field — sort is always newest-first |
| Change what's on the home tile | Edit `title`, `tag`, or reorder `photos` (first = cover) |
| Add a new nav page | New folder in `src/pages/`, then add it to `Header.astro`'s `links` |
| Edit the bio | `src/pages/about/index.astro`, inside `.about__body` |
| Preview changes | `npm run dev` |
| Build for deployment | `npm run build` |
