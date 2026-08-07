---
name: Beautiful Blog
description: A restrained editorial reading surface, extended for photo-led entries — warm paper, near-black ink, a single reserved ink-blue accent, the photo carrying each entry.
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

Beautiful Blog remains a conventional blog done well, on purpose — no concept metaphor, no card chrome, no ornamental system beyond hairline rules and type. This build extends that same world to carry photography as the primary content rather than text: home is now a masonry grid of photo covers, and every post leads with its image(s) before its writing. The extension took the "extend an existing surface" path explicitly — same palette, same three-role type system, same flat/hairline elevation model — with only the composition changing to put the photo first and the caption second.

The system stays deliberately under-designed relative to a typical photo-blog theme: no rounded image corners, no drop shadows or card frames around photos in the flowing page. A photo's own edge is its only boundary there. The one addition earned by the photo grid is a small dark overlay badge for multi-photo entries ("N photos") — the system's only pill-shaped element — and a wider container (`.container-wide`, 1180px) that photos and chrome-bearing sections now use, alongside the original narrow `.container` (760px) which is reserved for reading text.

A click-to-fullscreen photo viewer (`Lightbox.astro`) was added on top of this, one interactive layer above the flat page: clicking any photo (`img.lightbox-trigger`) opens it full-viewport over a solid, theme-invariant near-black scrim (`--lightbox-bg: #0c0b08`, a Constant-Overlay Rule token — see Colors), with prev/next navigation and, on pages with more than one photo, a "Play slideshow" auto-advance toggle. Controls are authored SVG line icons (never Unicode glyphs or emoji) on a small `--scrim`/blur legibility chip identical in spirit to the grid's multi-photo badge — so the one place this system does introduce chrome, it reuses the chrome device the system already owns rather than inventing a new one. This lives only in the fullscreen overlay; the flowing page itself still carries no lightbox chrome, no filmstrip, no gallery frame.

This build went through two finish-review rounds. The first (photo-grid extension) had three corrections: a caption-alignment bug on the home grid (wrapped titles orphaning date/tag beside only the first line) was fixed by stacking title above meta rather than a baseline-aligned row; a credit-caption alignment inconsistency between the post page (was right-aligned) and About (left-aligned) was standardized to left-aligned everywhere; and post-page photo widths were widened from 900px/560px to 1100px/640px (landscape/portrait) on ceiling suggestion. The second (lightbox feature) corrected: Unicode glyph icons replaced with authored SVGs; lightbox controls given the missing scrim/blur legibility backdrop; a Space-key handler that hijacked native button activation when a control other than Play had focus; the focus trap excluding the full-viewport scrim button from its Tab boundary; and the rest of the page marked `inert` while the dialog is open. Final verdict on both rounds was ship.

**Key Characteristics:**
- Warm paper ground, near-black ink, single reserved ink-blue accent — unchanged from the text-blog era, no new hues introduced for photography
- Fraunces (display) / Newsreader (body) / IBM Plex Mono (meta only) — same three-role, no-overlap type system
- Home is a `column-count` masonry grid of photo covers; no card chrome — the photo's own edge is the only boundary
- Every entry caption stacks title above meta (never a baseline row), and every photo credit caption is left-aligned, mono, ink-faint
- Two container widths now in active use: `.container` (760px, reading text) and `.container-wide` (1180px, photo grid, masthead, footer, full-width post photos)

## Colors

A two-value ground (paper/ink) carries the entire page; color is otherwise reserved for exactly one accent role. No color tokens changed in the photography extension.

### Primary
- **Ink-Blue** (`#2f3f74` light / `#94a4dd` dark): the single reserved accent. Used only for hyperlinks (`a` color), the mono `.tag` label, and photo-credit link hover state. Never used for backgrounds, buttons, borders, or decorative fills — including on the new photo grid, where hover feedback comes from a subtle image scale rather than an accent wash. A soft translucent tint of the same hue (`#2f3f7414` light / `#94a4dd1f` dark) is used only for text selection highlight (`::selection`).

### Neutral
- **Paper** (`#f6f4ee` light / `#171611` dark): the page background (`body`).
- **Paper Raised** (`#efece2` light / `#201f19` dark): still defined as a token but not applied to any visible surface — reserved, not active.
- **Ink** (`#1c1b17` light / `#ece7d9` dark): primary text color — headings, body copy, site mark, grid-item titles.
- **Ink Soft** (`#55524a` light / `#b7b1a0` dark): secondary text — nav links at rest, hero dek, "back to index" link.
- **Ink Faint** (`#666257` light / `#a89f8c` dark): tertiary text — mono metadata (dates), photo-credit captions, the About page's closing note. This is the WCAG-corrected accessibility floor for text on this palette.
- **Rule** (`rgba(28,27,23,0.14)` light / `rgba(236,231,217,0.14)` dark) and **Rule Soft** (`rgba(28,27,23,0.08)` light / `rgba(236,231,217,0.08)` dark): hairline divider color and the photo-frame placeholder background (`.item__frame` uses rule-soft while an image loads), both derived from ink at low opacity rather than independent grays.
- **Scrim** (`rgba(20, 19, 15, 0.55)`) and **Scrim Text** (`#f6f4ee`): the multi-photo count badge's overlay background and label color, also reused unchanged for the lightbox's four control chips and its caption text. Unlike every other neutral/accent token, these two are theme-invariant — they are declared once in `:root` and intentionally not overridden in the dark-theme block, because they sit on top of a photo's own pixels, not on page chrome, so they don't need to track light/dark paper.
- **Lightbox Bg** (`#0c0b08`): the fullscreen lightbox's scrim background, a third theme-invariant token in the same family as Scrim/Scrim Text — solid near-black rather than translucent, since it must fully occlude the page behind it rather than let paper show through. Declared once in `:root`, not overridden in the dark-theme block.

### Named Rules
**The One Accent Rule.** Ink-blue appears only on links, the mono tag label, and photo-credit hover. It never appears as a background, a button fill, an image border, or a badge fill. Its scarcity is what makes it read as a considered edit.

**The No-Gray-Palette Rule.** All neutral steps are derived from the two anchor hues (paper, ink) via opacity or a single adjacent warm value — never an unrelated gray scale.

**The Constant-Overlay Rule.** `--scrim`, `--scrim-text`, and `--lightbox-bg` are the deliberate exceptions to theme-tracking: overlay chrome painted on top of a photo (the multi-photo count badge, the lightbox's control chips and scrim) stays a fixed dark-on-light pair in both themes, because it reads against the photo's own pixels, not against `--paper`. No other token gets this exemption — a token only qualifies if it sits on photo content, not page background.

## Typography

**Display Font:** Fraunces (with Iowan Old Style, Georgia, serif fallback)
**Body Font:** Newsreader (with Iowan Old Style, Georgia, serif fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace fallback)

**Character:** Unchanged by the photography extension — a quiet, high-craft serif pairing, with mono confined strictly to metadata and photo credits so it reads as a system label, never as body voice.

### Hierarchy
- **Display** (weight 600, `clamp(1.9rem, 4vw, 2.5rem)`, line-height 1.15): home hero `h1`, article `h1`, page `h1` (About). Fraunces, tight tracking (-0.01em).
- **Headline** (weight 600, 1.5rem, line-height 1.15): unchanged token, still used for the display scale's sibling step (article `h1` on post pages actually renders at a slightly reduced clamp, `clamp(1.7rem, 3.4vw, 2.2rem)` — a post-specific variant of Display, not a new role).
- **Grid item title** (weight 600, 1.05rem, line-height 1.25, Fraunces, tracking -0.005em): `PhotoGridItem`'s `.item__title` — one step below Headline, sized for a caption sitting under a photo rather than leading a text list.
- **Site mark** (weight 600, 1.15rem): the header wordmark, Fraunces.
- **Body** (weight 400, 1.1rem, line-height 1.65): article body copy and About prose (Newsreader), bound to `--measure` (36.5em).
- **Label** (weight 400, 0.78rem, letter-spacing 0.02em, IBM Plex Mono): the `.meta` class — dates, nav links, back-link, and photo-credit captions ("Photo: {credit}").
- **Tag** (weight 400, 0.72rem, letter-spacing 0.06em, uppercase, ink-blue, IBM Plex Mono): the `.tag` class — the only uppercase, only-colored text role.
- **Badge label** (weight 400, 0.68rem, letter-spacing 0.03em, IBM Plex Mono, white-on-dark-overlay): the multi-photo count badge ("N photos") on grid covers — a scaled-down Tag-adjacent size used nowhere else.

### Named Rules
**The Byline-Not-Kicker Rule.** Date and tag metadata sit directly beneath the element they describe — the article heading, or (in the photo grid) the entry title — styled small and quiet. They never sit above as a preceding kicker/eyebrow line. On the home grid this now also means: title always renders on its own line(s) first, meta stacks directly beneath as a second row, never sharing a baseline with a wrapped multi-line title. This stacked-caption structure is what replaced the finish-review caption-alignment defect; any new template must keep meta trailing, and stacked beneath, the text it describes.

**The Three-Role Rule.** Fraunces is headings/titles only, Newsreader is reading body only, IBM Plex Mono is metadata/credits/badges only. No role borrows another's typeface, and no fourth typeface is introduced.

## Layout

Two container widths are both now in active use, unlike the prior text-only build where the wide container was defined but unused. `.container` (`min(760px, 100% - 2.5rem)`) holds reading text: post title/meta, post body, and the About page. `.container-wide` (`min(1180px, 100% - 2.5rem)`) holds the masthead, footer, the home masonry grid, and the full-width photo blocks on a post page. Long-form reading content is further bounded by `--measure: 36.5em` inside `.container`, so prose never approaches the container's own width; photos, conversely, run to the wide container's fuller width since the photo is the content being served.

Home is a CSS `column-count` masonry grid (`.grid`, 1 column under 640px, 2 at 640px+, 3 at 1000px+, `column-gap: 1.75rem`), not a fixed-row grid — cover images keep their natural aspect ratio and items reflow into the shortest column (`break-inside: avoid` on each item). This is the system's only true grid; every other page remains the single flowing column from the text-blog era.

On a post page, photos render at up to 1100px (landscape) or 640px (portrait) inside `.container-wide`, centered via `margin-inline: auto`, stacked vertically with `2.6rem` gaps between multiple photos in a photo essay — full-bleed relative to the reading column, never boxed to the narrow `.container`.

Vertical rhythm otherwise carries over unchanged: grid items separate with `2.2rem` bottom margin, sections close with `4rem` bottom padding before the footer, and masthead/footer are bracketed by the same hairline-rule-plus-meta unit. Responsive behavior stays fluid rather than breakpoint-driven for typography (`clamp()`), with breakpoints reserved specifically for the masonry column count.

## Elevation & Depth

Still flat by design — no shadow token anywhere, no `box-shadow` on any component including the new photo grid and photo blocks. Depth comes from ink-color stepping and the hairline rule, exactly as before. The one addition is the multi-photo count badge's `backdrop-filter: blur(2px)` over a semi-opaque dark overlay (`--scrim` / `--scrim-text`) — a legibility device for white-on-photo text, not a shadow or elevation cue, and it appears only on that one badge.

### Named Rules
**The No-Shadow, No-Card Rule.** Nothing in this system is elevated, including photos. A photo sits directly on the page with no frame, border, or shadow beyond its own edge; separation between grid items, photos in a photo essay, or page sections is achieved only through whitespace and the hairline rule.

## Shapes

Corner radius is used only on small interactive/overlay elements: the theme toggle button (`3px`), the `:focus-visible` outline (`1px`), and now the photo-count badge (`2px`) — the system's only near-square rounding, applied to UI chrome, never to photos or content blocks. Photos render as unbroken rectangles with no radius, no clipping beyond `overflow: hidden` on the grid frame (which crops nothing visually since images are `width: 100%; height: auto`), and no masking.

## Components

### Navigation (Header)
- **Style:** plain-text wordmark (Fraunces, 1.15rem, weight 600) at left, mono nav (`Index`, `About`) plus theme toggle at right, now inside `.container-wide` (widened from `.container` to match the masthead spanning the same width as the grid below it), followed by a hairline rule.
- **Default / hover / active:** nav links sit at ink-soft, move to full ink on hover or `aria-current="page"` — no underline, no background, no accent color.
- **Theme toggle:** bordered mono button (`1px solid var(--rule)`, `3px` radius, ink-soft text), label swaps "Dark"/"Light"; border darkens to ink-faint on hover. The only bordered control in the system.
- **Mobile:** flexbox wrap, no distinct mobile nav pattern.

### Photo grid item (PhotoGridItem, home)
- **Structure:** a single anchor wraps a photo frame and a caption. The frame (`.item__frame`) holds the cover image at natural aspect ratio on a `rule-soft` placeholder background, with an optional dark-overlay "N photos" badge bottom-right for multi-photo entries. The caption below is a flex column: title (Fraunces) on its own line(s) first, then a meta row (mono date + mono uppercase accent tag) stacked directly beneath — never a side-by-side baseline row, regardless of how many lines the title wraps to.
- **Hover / focus:** the cover image scales to 1.02x (`transform`, 0.5s cubic-bezier ease) — the grid's only microinteraction. No color change, no overlay, no shadow.
- **No card chrome:** no border, background, radius, or shadow around the item; the photo's own edge and the whitespace between grid entries are the only boundaries.

### Post page
- **Structure:** back-link row, then title + byline (date + tag) in narrow `.container`, then all of the entry's photos full-width in `.container-wide` (each an individually captioned `<figure>`), then body copy back in narrow `.container` at the `--measure` width, closed by a hairline rule and a "← Back to the index" link.
- **Photo block:** each photo is centered up to 1100px (landscape) or 640px (portrait) wide, with a left-aligned mono credit caption directly beneath reading "Photo: {credit}" as a link to the source. Multiple photos in a photo-essay entry stack with `2.6rem` gaps, each individually captioned — there is no shared/single caption for a photo set.
- **Body typography:** paragraphs use `1.4em` bottom margin; no blockquote, pull-quote, or figure style beyond the photo-credit figure — don't invent one without new evidence.

### About page
- Same heading/measure/body pattern as the post page, plus a portrait photo (max 22rem wide) with the identical left-aligned "Photo: {credit}" caption pattern used on posts — the credit-caption treatment is now one consistent component used everywhere a photo appears, not page-specific. Closes with an italic ink-faint note set off by a hairline top rule.

### Footer
- A hairline rule (now inside `.container-wide`, matching the masthead width) followed by a single mono `.meta` line. No links, no columns, no secondary nav.

### Photo-credit caption (signature component)
- **Style:** `.meta`-styled ("Photo: " prefix in plain ink-faint mono text) with the credit name wrapped in a link; link color is ink-faint at rest, ink-blue on hover. Always left-aligned, always directly beneath the photo it credits, never overlaid on the image itself.
- **Used:** on every photo on the site — post-page photos, the About portrait, and nowhere else (grid covers on home carry no credit caption; only the entry title/meta).

### Lightbox (signature component)
- **Structure:** a single globally-included overlay (`Lightbox.astro`, mounted once in `BaseLayout.astro`) that scans the page on load for every `img.lightbox-trigger` and builds its slide sequence from them in DOM order — currently post-page photos and the About portrait. `role="dialog" aria-modal="true"` wraps a full-viewport scrim button, a `<figure>` (active image + caption), and four `.lightbox__ctrl` chips (close, prev, next, play/pause).
- **Background:** `--lightbox-bg` (`#0c0b08`), a solid theme-invariant near-black — see Colors, Constant-Overlay Rule. Deliberately solid rather than translucent, since it must fully occlude the page, unlike the semi-opaque `--scrim`.
- **Controls:** each `.lightbox__ctrl` is a `--scrim`-background, `--scrim-text`-color chip with `backdrop-filter: blur(2px)` and `2px` radius (`{rounded.badge}`) — the same overlay-legibility device as the home grid's multi-photo count badge, not a new chrome vocabulary. Close/prev/next are authored inline SVG line icons (never Unicode glyphs or emoji, per the system's icon rule); play/pause is a mono text label (`Play slideshow` / `Pause slideshow`) sized like the Tag/Badge role.
- **Caption:** reuses the Photo-credit caption pattern ("Photo: {credit}" as a link) plus an "N / total" counter, both in `--scrim-text` at reduced opacity (0.85) — left-aligned, directly beneath the image, consistent with the photo-credit caption used elsewhere on the site.
- **Visibility by page:** multi-photo pages show prev/next/play/counter; single-photo pages (`data-single="true"` on the root) hide all four, leaving only close and the caption.
- **Behavior:** click or Enter/Space on a trigger opens the dialog full-viewport; Escape closes, ArrowLeft/ArrowRight navigate, Space toggles play/pause (suppressed when focus is already on one of the dialog's own buttons, so native button activation isn't hijacked). Tab is trapped to the credit link plus the four control buttons in true DOM order; the scrim button is `tabindex="-1"` and permanently excluded. Every direct child of `<body>` outside the lightbox gets `inert` while open. Focus returns to the exact thumbnail that opened the dialog on close. A "Play slideshow" toggle auto-advances every 3.8s and loops.
- **Scope:** this is the one interactive layer above the otherwise flat page — see the Do's and Don'ts exception for the concept-metaphor prohibition. It never appears inline in the flowing page; it is overlay-only.

## Do's and Don'ts

### Do:
- **Do** keep the accent (`#2f3f74` / `#94a4dd`) confined to links, the `.tag` label, and photo-credit hover — never a photo border, badge fill, or grid-item background.
- **Do** stack a grid item's title above its meta row, never side-by-side, so a wrapped multi-line title never orphans its date/tag beside only the first line.
- **Do** left-align every photo-credit caption ("Photo: {credit}"), on every page, directly beneath the photo it describes.
- **Do** use `.container-wide` (1180px) for photo grids, full-width post photos, masthead, and footer; keep `.container` (760px) and `--measure` (36.5em) for reading text only.
- **Do** hold post-page photos to 1100px landscape / 640px portrait max width, centered in `.container-wide`.
- **Do** use the hairline rule (`1px solid var(--rule)`) as the only divider device between sections, list entries, and grid rows.
- **Do** keep Fraunces to headings/titles, Newsreader to body prose, and IBM Plex Mono to dates/tags/nav/credits/badge — no crossover.

### Don't:
- **Don't** add cards, shadows, borders, or rounded corners around photos — a photo's own edge is its only boundary; even the frame's `overflow: hidden` crops nothing, it just contains.
- **Don't** reintroduce a kicker/eyebrow (tag or date set above a heading or title) anywhere, including the photo grid — meta always trails and stacks beneath the text it describes.
- **Don't** add a second accent color or expand the accent's role beyond links, the `.tag` label, and credit-link hover.
- **Don't** widen the reading measure back toward 40em; 36.5em is the corrected, shipped value for text content.
- **Don't** introduce a concept metaphor (card catalog, notebook, corkboard, gallery-chrome) into the flowing page's layout or component styling — this extension explicitly took the "extend an existing surface" path, not a new concept tournament. The fullscreen lightbox is the one sanctioned exception: it is interaction chrome for an overlay layer outside the flowing page, built from the system's own existing overlay device (`--scrim`/blur), not a new concept.
- **Don't** use Unicode glyphs or emoji as icons anywhere, including inside the lightbox — author flat SVG line icons in one consistent stroke weight.
- **Don't** right-align, overlay, or omit a photo's credit caption — left-aligned "Photo: {credit}" beneath the image is the one standardized pattern after the post/About inconsistency was corrected.
