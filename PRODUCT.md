# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro with Markdown content collections. User was open to Hugo or another recommendation; Astro was chosen because it pairs simple Markdown-based posts with full component-level control over the HTML/CSS, which suits a hand-crafted, non-templated visual design better than adapting an existing Hugo theme. Static output, deployable anywhere.

## Users

The site owner, writing for themselves — a personal blog. Readers are friends, family, and anyone who follows the owner's writing; no specific niche or professional audience is assumed.

## Product Purpose

A personal photography blog. Entries are built around one or more photos — a single image or a short photo essay — with a brief, informal reflection alongside them. Success is a space that's pleasant to look at and pleasant to post to, not a portfolio pitch or a monetization vehicle.

## Positioning

A photography-led personal blog, not a text-first journal with occasional images: the photo is the primary content of every entry, the writing is a short caption/reflection in support of it, not the other way around. Register is everyday and observational (travel snapshots, landscapes, small details noticed in passing) rather than a technical gear-review or professional-portfolio register. No fixed subject niche beyond "photos worth keeping."

## Operating Context

Content is authored as Markdown files (frontmatter carries one or more photos per entry — path, alt text, orientation, credit) built to static output. No CMS, no backend, no comments/auth system implied unless the owner asks for one later.

## Capabilities and Constraints

- Every entry requires at least one photo; the schema supports multiple photos per entry for photo-essay-style posts.
- Photos in the current demo build are placeholder/example imagery (see Evidence on Hand) — real posts should replace them with the owner's own photography, at which point the demo credit metadata no longer applies and should be removed or replaced.
- No topic, tone, or name has been decided for the blog itself beyond "photography."

## Evidence on Hand

The demo build uses 32 real, freely-licensed photographs sourced from Lorem Picsum (Unsplash-licensed stock imagery) as placeholder content, downloaded into `public/photos/`. ~27 of them are used across ~20 sample entries (a few unused desk/laptop shots were excluded as off-subject for a photography blog); each entry credits its photographer by name with a link to the source Unsplash photo, since these are real photographers' work even though free to use. This is demonstration content only — none of it is the blog owner's own photography, and it must be swapped for real photos (with demo credits removed) before this is used as an actual personal blog.

## Brand Commitments

The owner rejected an initial concept-driven visual world (a "library card catalog" archive metaphor) and chose the standing conventional-blog direction instead: a clean, confident, no-metaphor editorial layout, played straight rather than built around a decorative concept. Craft bar named explicitly: Stripe Press / Stratechery register — confident editorial typography, generous line-length, minimal chrome, serif-forward reading experience. This preference is binding for future visual work on this site: default to restrained editorial execution, not a fresh concept exercise, unless the owner asks for one again.

## Product Principles

1. Personal-first: the design should feel like an individual's voice, not a corporate/brand publication or professional portfolio.
2. The photo leads: layout and typography serve the image first, the caption/reflection second — text stays short and never competes with the picture for attention.
3. Low ceremony: no CMS/backend complexity beyond what a Markdown-based static blog needs.
4. Leave room for the owner's real photography and voice to define the site over time, rather than baking in a fixed subject niche.
5. Credit real photographers' work honestly wherever demo/placeholder imagery is used; never present it as the blog owner's own.
