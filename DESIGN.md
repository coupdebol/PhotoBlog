---
name: Beautiful Blog
description: A restrained editorial reading surface, extended for photo-led entries — warm paper, near-black ink, a single reserved ink-blue accent, photos and prose interleaved in authored order.
colors:
  paper: "#f6f4ee"
  paper-raised: "#efece2"
  ink: "#1c1b17"
  ink-soft: "#55524a"
  ink-faint: "#666257"
  rule: "rgba(28, 27, 23, 0.14)"
  rule-soft: "rgba(28, 27, 23, 0.08)"
  accent: "#2f3f74"
  accent-soft: "#2f3f7414"
  paper-dark: "#171611"
  paper-raised-dark: "#201f19"
  ink-dark: "#ece7d9"
  ink-soft-dark: "#b7b1a0"
  ink-faint-dark: "#a89f8c"
  rule-dark: "rgba(236, 231, 217, 0.14)"
  rule-soft-dark: "rgba(236, 231, 217, 0.08)"
  accent-dark: "#94a4dd"
  accent-soft-dark: "#94a4dd1f"
  scrim: "rgba(20, 19, 15, 0.55)"
  scrim-text: "#f6f4ee"
  lightbox-bg: "#0c0b08"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.9rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Newsreader, Iowan Old Style, Georgia, serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Newsreader, Iowan Old Style, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    fontStyle: "italic"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    letterSpacing: "0.02em"
  tag:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.06em"
rounded:
  sm: "1px"
  control: "3px"
  badge: "2px"
spacing:
  entry-block: "1.9rem"
  section-block: "4rem"
  container-gutter: "1.25rem"
  container-wide-gutter: "2.5rem"
  photo-block: "2.4rem"
components:
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  entry-title-link:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.3rem 0.6rem"
  photo-count-badge:
    backgroundColor: "{colors.scrim}"
    textColor: "{colors.scrim-text}"
    typography: "{typography.tag}"
    rounded: "{rounded.badge}"
    padding: "0.22rem 0.5rem"
  lightbox-ctrl:
    backgroundColor: "{colors.scrim}"
    textColor: "{colors.scrim-text}"
    typography: "{typography.tag}"
    rounded: "{rounded.badge}"
    padding: "0.55rem"
---

# Design System: Beautiful Blog

## Overview

**Creative North Star: "The Standing Convention, Photo-Led"**

Beautiful Blog remains a conventional blog done well, on purpose — no concept metaphor, no card chrome, no ornamental system beyond hairline rules and type. The photography extension carries through in a second form now: entries are authored in `.mdx`, and photos are placed inline in the body via a `<Photo />` component wherever the author puts them — before a paragraph, after one, two photos back-to-back with no text between, a photo closing the piece. There is no longer a fixed "all photos, then all text" block; the authored order in the MDX source *is* the render order. Frontmatter carries only a `cover` object (`src`/`alt`/`orientation`) for the home-grid tile — the actual photo set for an entry lives entirely in the body, and the home grid's "N photos" count is derived by scanning the raw MDX source for `<Photo` tags rather than read from a frontmatter array.

The system stays deliberately under-designed relative to a typical photo-blog theme: no rounded image corners, no drop shadows or card frames around photos in the flowing page. A photo's own edge is its only boundary there. An inline `<Photo />` sits inside the same narrow reading column as the surrounding prose but visually escapes it — a full-bleed technique (`width: 100vw` plus a negative-margin recentering trick) lets a photo run up to the same wide caps the site already used for photos (1100px landscape / 640px portrait) without needing a separate wide-container wrapper around every image, and confirmed to introduce zero horizontal page overflow on desktop and mobile. The home grid still carries its own small dark overlay badge for multi-photo entries ("N photos") — the system's only pill-shaped element — and `.container-wide` (1180px) is still used for grid, masthead, and footer chrome, with `.container` (760px) reserved for reading text and now for the body column an inline photo temporarily escapes.

A click-to-fullscreen photo viewer (`Lightbox.astro`) sits one interactive layer above the flat page: clicking any photo (`img.lightbox-trigger`) opens it full-viewport over a solid, theme-invariant near-black scrim (`--lightbox-bg: #0c0b08`, a Constant-Overlay Rule token — see Colors), with prev/next navigation and, on pages with more than one photo, a "Play slideshow" auto-advance toggle. Controls are authored SVG line icons (never Unicode glyphs or emoji) on a small `--scrim`/blur legibility chip identical in spirit to the grid's multi-photo badge. A photo's optional short italic caption — carried by `<Photo />`'s `caption` prop — now surfaces in both places it can appear: directly under the photo in the flowing page, and, when present, above the credit/count row in the fullscreen lightbox (hidden via `:empty` when a photo has none). This lives only in the fullscreen overlay and inline photo blocks; the flowing page itself still carries no separate gallery frame or filmstrip.

This build's content-model change went through finish review with two findings, both resolved before ship: the worked example demonstrating the new capability (`a-different-kind-of-green.mdx`) needed genuinely varied pacing rather than mechanical photo/text alternation, and the home grid's photo-count logic needed hardening against MDX comments and a silent zero-count (it now strips comments before counting and warns at build time if an entry has no `<Photo />` tags at all). Verdict: ship.

**Key Characteristics:**
- Warm paper ground, near-black ink, single reserved ink-blue accent — unchanged across every content-model revision
- Fraunces (display) / Newsreader (body + photo caption) / IBM Plex Mono (meta only) — same three-role type system, with caption borrowing the body serif rather than adding a fourth face
- Photos are authored inline in the MDX body in any order relative to text — not a fixed photos-then-text block; the author's placement is the render order
- Every photo carries a left-aligned mono credit line beneath it, and optionally a short italic caption above that credit line — both patterns now shared verbatim between the flowing page and the lightbox
- Two container widths remain in active use: `.container` (760px, reading text and the column an inline photo escapes from) and `.container-wide` (1180px, photo grid, masthead, footer)

## Colors

A two-value ground (paper/ink) carries the entire page; color is otherwise reserved for exactly one accent role. No color tokens changed with the MDX/inline-photo migration.

### Primary
- **Ink-Blue** (`#2f3f74` light / `#94a4dd` dark): the single reserved accent. Used only for hyperlinks (`a` color), the mono `.tag` label, and photo-credit link hover state. Never used for backgrounds, buttons, borders, or decorative fills. A soft translucent tint of the same hue (`#2f3f7414` light / `#94a4dd1f` dark) is used only for text selection highlight (`::selection`).

### Neutral
- **Paper** (`#f6f4ee` light / `#171611` dark): the page background (`body`).
- **Paper Raised** (`#efece2` light / `#201f19` dark): still defined as a token but not applied to any visible surface — reserved, not active.
- **Ink** (`#1c1b17` light / `#ece7d9` dark): primary text color — headings, body copy, site mark, grid-item titles.
- **Ink Soft** (`#55524a` light / `#b7b1a0` dark): secondary text — nav links at rest, hero dek, "back to index" link, and a photo's italic caption text (`.photo__caption`).
- **Ink Faint** (`#666257` light / `#a89f8c` dark): tertiary text — mono metadata (dates), photo-credit captions, the About page's closing note.
- **Rule** (`rgba(28,27,23,0.14)` light / `rgba(236,231,217,0.14)` dark) and **Rule Soft** (`rgba(28,27,23,0.08)` light / `rgba(236,231,217,0.08)` dark): hairline divider color and the photo-frame placeholder background, both derived from ink at low opacity rather than independent grays.
- **Scrim** (`rgba(20, 19, 15, 0.55)`) and **Scrim Text** (`#f6f4ee`): the multi-photo count badge's overlay background and label color, also reused unchanged for the lightbox's four control chips and its caption/description text. Theme-invariant — declared once in `:root`, not overridden in the dark-theme block, because they sit on top of a photo's own pixels, not on page chrome.
- **Lightbox Bg** (`#0c0b08`): the fullscreen lightbox's scrim background, a third theme-invariant token in the same family as Scrim/Scrim Text — solid rather than translucent, since it must fully occlude the page behind it.

### Named Rules
**The One Accent Rule.** Ink-blue appears only on links, the mono tag label, and photo-credit hover. It never appears as a background, a button fill, an image border, or a badge fill.

**The No-Gray-Palette Rule.** All neutral steps are derived from the two anchor hues (paper, ink) via opacity or a single adjacent warm value — never an unrelated gray scale.

**The Constant-Overlay Rule.** `--scrim`, `--scrim-text`, and `--lightbox-bg` are the deliberate exceptions to theme-tracking: overlay chrome painted on top of a photo (the multi-photo count badge, the lightbox's control chips, scrim, and caption text) stays a fixed dark-on-light pair in both themes, because it reads against the photo's own pixels, not against `--paper`. No other token gets this exemption.

## Typography

**Display Font:** Fraunces (with Iowan Old Style, Georgia, serif fallback)
**Body Font:** Newsreader (with Iowan Old Style, Georgia, serif fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace fallback)

**Character:** A quiet, high-craft serif pairing, with mono confined strictly to metadata and photo credits so it reads as a system label, never as body voice. A photo's caption borrows the body serif in italic rather than getting a new face — it reads as authorial commentary, not a UI label.

### Hierarchy
- **Display** (weight 600, `clamp(1.9rem, 4vw, 2.5rem)`, line-height 1.15): home hero `h1`, article `h1`, page `h1` (About). Fraunces, tight tracking (-0.01em).
- **Headline** (weight 600, 1.5rem, line-height 1.15): the display scale's sibling step (article `h1` on post pages actually renders at a slightly reduced clamp, `clamp(1.7rem, 3.4vw, 2.2rem)` — a post-specific variant of Display, not a new role).
- **Grid item title** (weight 600, 1.05rem, line-height 1.25, Fraunces, tracking -0.005em): `PhotoGridItem`'s `.item__title` — one step below Headline, sized for a caption sitting under a photo rather than leading a text list.
- **Site mark** (weight 600, 1.15rem): the header wordmark, Fraunces.
- **Body** (weight 400, 1.1rem, line-height 1.65): article body copy and About prose (Newsreader), bound to `--measure` (36.5em). MDX paragraphs and `<Photo />` tags share this measure-bound column in whatever order the author places them.
- **Photo caption** (weight 400, 1rem, italic, Newsreader, ink-soft): `.photo__caption` — the optional short descriptive/commentary line a `<Photo />` can carry, rendered directly above its credit line. Present on some photos, omitted on others (an intentional per-photo authoring choice, not a bug when absent). The same text and style reappears in the lightbox as `.lightbox__desc`, in `--scrim-text` at slightly reduced size, hidden via `:empty` when a photo has no caption.
- **Label** (weight 400, 0.78rem, letter-spacing 0.02em, IBM Plex Mono): the `.meta` class — dates, nav links, back-link, and photo-credit captions ("Photo: {credit}").
- **Tag** (weight 400, 0.72rem, letter-spacing 0.06em, uppercase, ink-blue, IBM Plex Mono): the `.tag` class — the only uppercase, only-colored text role.
- **Badge label** (weight 400, 0.68rem, letter-spacing 0.03em, IBM Plex Mono, white-on-dark-overlay): the multi-photo count badge ("N photos") on grid covers.

### Named Rules
**The Byline-Not-Kicker Rule.** Date and tag metadata sit directly beneath the element they describe — the article heading, or (in the photo grid) the entry title — styled small and quiet. They never sit above as a preceding kicker/eyebrow line. On the home grid this also means title always renders on its own line(s) first, meta stacks directly beneath as a second row, never sharing a baseline with a wrapped multi-line title.

**The Three-Role-Plus-Caption Rule.** Fraunces is headings/titles only, Newsreader is reading body and photo captions, IBM Plex Mono is metadata/credits/badges only. A photo's italic caption is a styled variant of the Body role (same family, italic, ink-soft), not a fourth typeface — no role otherwise borrows another's typeface.

**The Optional-Caption Rule.** `caption` is the one optional prop on `<Photo />`. Its absence is not an authoring gap: a photo with only a credit line is a complete, correct photo block. Never pad a caption-less photo with an invented line to make the rhythm look "more finished" — see Do's and Don'ts.

## Layout

Two container widths are both in active use. `.container` (`min(760px, 100% - 2.5rem)`) holds reading text: post title/meta, MDX body prose, and the About page. `.container-wide` (`min(1180px, 100% - 2.5rem)`) holds the masthead, footer, and the home masonry grid. Long-form reading content is further bounded by `--measure: 36.5em` inside `.container`, so prose never approaches the container's own width.

Post bodies are no longer split into a separate photos-block and text-block: `[id]/index.astro` renders the entire MDX `<Content />` inside a single `.container` column, passing `Photo` as the only custom component the body can use. Each `<Photo />` is itself full-bleed — it escapes the 760px column via `width: 100vw; position: relative; left: 50%; margin-left: -50vw` (and the portrait/landscape mirror on the right) rather than living in a separate wide wrapper — so it can render up to 1100px (landscape) or 640px (portrait) even though it's declared inside the narrow reading column. This is the mechanism, not a value change: the photo width caps themselves (1100px/640px) are unchanged from the prior block-based build. Confirmed zero horizontal page overflow from this technique on desktop and mobile.

Home is a CSS `column-count` masonry grid (`.grid`, 1 column under 640px, 2 at 640px+, 3 at 1000px+, `column-gap: 1.75rem`), driven by each entry's `cover` frontmatter object, not by anything in the body — cover images keep their natural aspect ratio and items reflow into the shortest column (`break-inside: avoid` on each item).

Vertical rhythm: inline photos carry `2.4rem` block margin from their own `.photo` wrapper (replacing the former fixed `2.6rem` stack gap, since photos are no longer a uniform stack — text can separate them); grid items separate with `2.2rem` bottom margin; sections close with `4rem` bottom padding before the footer; masthead/footer are bracketed by the same hairline-rule-plus-meta unit. Responsive behavior stays fluid rather than breakpoint-driven for typography (`clamp()`), with breakpoints reserved specifically for the masonry column count.

## Elevation & Depth

Still flat by design — no shadow token anywhere, no `box-shadow` on any component including inline photos and the photo grid. Depth comes from ink-color stepping and the hairline rule. The one addition is the multi-photo count badge's `backdrop-filter: blur(2px)` over a semi-opaque dark overlay (`--scrim`/`--scrim-text`) — a legibility device for white-on-photo text, reused identically for the lightbox's controls and caption/description text.

### Named Rules
**The No-Shadow, No-Card Rule.** Nothing in this system is elevated, including photos. A photo sits directly on the page with no frame, border, or shadow beyond its own edge; separation between grid items, inline photos, surrounding prose, or page sections is achieved only through whitespace and the hairline rule.

## Shapes

Corner radius is used only on small interactive/overlay elements: the theme toggle button (`3px`), the `:focus-visible` outline (`1px`), and the photo-count badge (`2px`) — the system's only near-square rounding, applied to UI chrome, never to photos or content blocks. Photos render as unbroken rectangles with no radius, no clipping beyond `overflow: hidden` on the grid frame (which crops nothing visually since images are `width: 100%; height: auto`), and no masking.

## Components

### Navigation (Header)
- **Style:** plain-text wordmark (Fraunces, 1.15rem, weight 600) at left, mono nav (`Index`, `About`) plus theme toggle at right, inside `.container-wide`, followed by a hairline rule.
- **Default / hover / active:** nav links sit at ink-soft, move to full ink on hover or `aria-current="page"` — no underline, no background, no accent color.
- **Theme toggle:** bordered mono button (`1px solid var(--rule)`, `3px` radius, ink-soft text), label swaps "Dark"/"Light"; border darkens to ink-faint on hover. The only bordered control in the system.
- **Mobile:** flexbox wrap, no distinct mobile nav pattern.

### Photo grid item (PhotoGridItem, home)
- **Structure:** a single anchor wraps a photo frame and a caption. The frame (`.item__frame`) holds the entry's `cover` image at natural aspect ratio on a `rule-soft` placeholder background, with an optional dark-overlay "N photos" badge bottom-right for multi-photo entries — the count is computed by scanning the raw MDX body for `<Photo` tags, not read from frontmatter. The caption below is a flex column: title (Fraunces) on its own line(s) first, then a meta row (mono date + mono uppercase accent tag) stacked directly beneath.
- **Hover / focus:** the cover image scales to 1.02x (`transform`, 0.5s cubic-bezier ease) — the grid's only microinteraction.
- **No card chrome:** no border, background, radius, or shadow around the item; the photo's own edge and the whitespace between grid entries are the only boundaries.

### Inline Photo (signature component)
- **Structure:** `Photo.astro`, an MDX-body component (`<Photo src alt orientation credit creditUrl caption? />`) an author places directly in the post's prose, in any order relative to surrounding paragraphs and other photos. Renders a `<figure>` containing the image and a `<figcaption>`: an optional italic `.photo__caption` line, then the always-present `.photo__credit` line ("Photo: {credit}", left-aligned mono, linked).
- **Full-bleed mechanism:** the figure is `width: 100vw` with `position: relative; left: 50%; margin-left: -50vw` (mirrored on the right), letting it escape the 760px `.container` it's declared inside and render its image up to 1100px (landscape) / 640px (portrait), centered. Confirmed no horizontal page overflow.
- **Caption:** optional per-photo. When present it's a short italic line in `--ink-soft`, sitting above the credit line. When absent, nothing is rendered in its place — the credit line alone is a complete, correct block (see Optional-Caption Rule).
- **Placement:** the composition device that replaced the old fixed photo-block. Text and photos interleave in whatever order the author writes them — a paragraph, a photo, another photo with no text between, a closing paragraph, all valid.

### Post page
- **Structure:** back-link row, then title + byline (date + tag) in narrow `.container`, then the entire MDX `<Content />` rendered in that same `.container` column — paragraphs and inline `<Photo />` blocks in authored order — closed by a hairline rule and a "← Back to the index" link. There is no longer a separate all-photos-first block; `[id]/index.astro` passes `Photo` as the sole custom MDX component and lets the body control composition.
- **Body typography:** paragraphs use `1.4em` bottom margin; no blockquote, pull-quote, or figure style beyond the inline Photo figure — don't invent one without new evidence.

### About page
- Same heading/measure/body pattern as the post page, plus a portrait photo (max 22rem wide) with the identical left-aligned "Photo: {credit}" caption pattern used on inline post photos — the credit-caption treatment is one consistent component used everywhere a photo appears. Closes with an italic ink-faint note set off by a hairline top rule.

### Footer
- A hairline rule (inside `.container-wide`, matching the masthead width) followed by a single mono `.meta` line. No links, no columns, no secondary nav.

### Lightbox (signature component)
- **Structure:** a single globally-included overlay (`Lightbox.astro`, mounted once in `BaseLayout.astro`) that scans the page on load for every `img.lightbox-trigger` and builds its slide sequence from them in DOM order — now driven by wherever inline `<Photo />` tags land in each post, plus the About portrait. `role="dialog" aria-modal="true"` wraps a full-viewport scrim button, a `<figure>` (active image + caption block), and four `.lightbox__ctrl` chips (close, prev, next, play/pause).
- **Background:** `--lightbox-bg` (`#0c0b08`), a solid theme-invariant near-black — see Colors, Constant-Overlay Rule.
- **Controls:** each `.lightbox__ctrl` is a `--scrim`-background, `--scrim-text`-color chip with `backdrop-filter: blur(2px)` and `2px` radius (`{rounded.badge}`) — the same overlay-legibility device as the home grid's multi-photo count badge. Close/prev/next are authored inline SVG line icons; play/pause is a mono text label (`Play slideshow` / `Pause slideshow`).
- **Caption block:** each `img.lightbox-trigger` now carries a `data-caption` attribute sourced from `Photo.astro`'s `caption` prop. The lightbox surfaces it as `.lightbox__desc` — an italic line in `--scrim-text`, matching `.photo__caption`'s voice — positioned above the existing credit/count row (`.lightbox__meta-row`), and hidden entirely via `:empty` when the active photo has no caption. Credit ("Photo: {credit}") and an "N / total" counter remain in `--scrim-text` at reduced opacity (0.85), left-aligned/centered beneath the image, consistent with the inline photo-credit pattern.
- **Visibility by page:** multi-photo pages show prev/next/play/counter; single-photo pages (`data-single="true"` on the root) hide all four, leaving only close and the caption block.
- **Behavior:** click or Enter/Space on a trigger opens the dialog full-viewport; Escape closes, ArrowLeft/ArrowRight navigate, Space toggles play/pause (suppressed when focus is already on one of the dialog's own buttons). Tab is trapped to the credit link plus the four control buttons in true DOM order; the scrim button is `tabindex="-1"` and permanently excluded. Every direct child of `<body>` outside the lightbox gets `inert` while open. Focus returns to the exact thumbnail that opened the dialog on close. A "Play slideshow" toggle auto-advances every 3.8s and loops.
- **Scope:** the one interactive layer above the otherwise flat page — see the Do's and Don'ts exception for the concept-metaphor prohibition. It never appears inline in the flowing page; it is overlay-only.

## Do's and Don'ts

### Do:
- **Do** keep the accent (`#2f3f74` / `#94a4dd`) confined to links, the `.tag` label, and photo-credit hover — never a photo border, badge fill, or grid-item background.
- **Do** let authors place `<Photo />` and prose in any order in a post's MDX body — back-to-back photos, text between photos, a photo closing the piece are all valid compositions; don't force a fixed photos-then-text template.
- **Do** treat a photo's `caption` as genuinely optional — a credit-only photo is complete. Only add a caption when there's something real to say about that specific photo.
- **Do** left-align every photo-credit caption ("Photo: {credit}"), on every page, directly beneath the photo it describes, with any italic `.photo__caption` line sitting above it.
- **Do** use `.container-wide` (1180px) for the photo grid, masthead, and footer; keep `.container` (760px) and `--measure` (36.5em) for reading text, letting individual `<Photo />` components escape it via the full-bleed technique rather than wrapping the whole body in a wide container.
- **Do** hold inline post photos to 1100px landscape / 640px portrait max width, centered.
- **Do** use the hairline rule (`1px solid var(--rule)`) as the only divider device between sections, list entries, and grid rows.
- **Do** keep Fraunces to headings/titles, Newsreader to body prose and photo captions, and IBM Plex Mono to dates/tags/nav/credits/badges — no crossover.
- **Do** count photos for the grid badge by scanning the MDX source for `<Photo` tags (with comments stripped), and treat a zero count as a build-time warning worth investigating, not a silently accepted state.

### Don't:
- **Don't** add cards, shadows, borders, or rounded corners around photos — a photo's own edge is its only boundary.
- **Don't** reintroduce a kicker/eyebrow (tag or date set above a heading or title) anywhere, including the photo grid — meta always trails and stacks beneath the text it describes.
- **Don't** add a second accent color or expand the accent's role beyond links, the `.tag` label, and credit-link hover.
- **Don't** widen the reading measure back toward 40em; 36.5em is the corrected, shipped value for text content.
- **Don't** reintroduce a frontmatter `photos` array or a hard-coded photos-block composition — inline `<Photo />` placement in the MDX body is now the only source of truth for a post's photo set and its position relative to text.
- **Don't** invent a caption for a photo that wasn't given one just to make photo pacing look more uniform — an uncaptioned photo next to captioned ones is a legitimate, observed pattern (see `a-different-kind-of-green.mdx`), not a gap to fill.
- **Don't** introduce a concept metaphor (card catalog, notebook, corkboard, gallery-chrome) into the flowing page's layout or component styling. The fullscreen lightbox is the one sanctioned exception: interaction chrome for an overlay layer outside the flowing page, built from the system's own existing overlay device (`--scrim`/blur), not a new concept.
- **Don't** use Unicode glyphs or emoji as icons anywhere, including inside the lightbox — author flat SVG line icons in one consistent stroke weight.
- **Don't** right-align, overlay, or omit a photo's credit caption — left-aligned "Photo: {credit}" beneath the image is the one standardized pattern.
