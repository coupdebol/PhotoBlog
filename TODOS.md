# TODOS

## Photo Ingest

### Claude-assisted alt-text drafting

**What:** After the mechanical ingest, an optional pass where Claude looks at each photo and drafts literal alt text for review/edit — not captions or body prose.

**Why:** Alt text is the one field the safety rail (`check-drafts`) exists specifically to catch when forgotten. Automating a draft of it removes the most tedious, most-skipped field entirely.

**Context:** This is Approach C from the `/office-hours` session that produced the ingest tool's design doc (`~/.gstack/projects/coupdebol-PhotoBlog/jantony-main-design-20260808-094044.md`). It's compatible with the chosen Approach B and layers on top without conflict — needs a clear UX line so drafted alt text is never mistaken for a finished caption, since `PRODUCT.md`'s personal-voice principle covers captions/body but not literal alt-text descriptions.

**Effort:** M
**Priority:** P3
**Depends on:** The base ingest tool (this design doc) shipping first.

## Infrastructure

### Cloudflare R2 + Pages migration

**What:** Move photo storage from `public/photos/` to Cloudflare R2 and deploy via Cloudflare Pages, once a domain is chosen.

**Why:** Stated future intent for this project — the current build is explicitly a proof of concept meant to transition to that hosting setup.

**Context:** Named directly in the original project brief: the site could be hosted on Cloudflare Pages with the domain also on Cloudflare, but the domain name isn't chosen yet and this is "really just only an idea" for now. The ingest tool's design intentionally avoids coupling to local-file assumptions in ways that would make this migration harder later.

**Effort:** L
**Priority:** P4
**Depends on:** Domain selection (external decision, not a code task).
