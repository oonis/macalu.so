# Homepage Redesign

## Problem

`macalu.so`'s root URL (`/`) currently renders `content/docs/index.mdx` through the
fumadocs `DocsLayout` — same sidebar/chrome as every wiki page. There's no real
"front door": no intro, no personality, just a docs page that happens to sit at `/`.

## Goals

- A real homepage at `/`: bio-led, photo, short intro, links into the two wiki
  sections (Apps, Best in Slot), no docs sidebar.
- "Warm Paper" visual style: cream background, serif headline, terracotta accent —
  distinct from the stock fumadocs neutral theme used on wiki pages.
- A "Currently recommending" slot on the homepage that surfaces the most recently
  updated wiki entry automatically, rather than being hardcoded.
- Fix `apps` being absent from the wiki sidebar nav (pre-existing bug, unrelated
  to the redesign but touched while in this area).

## Non-goals

- No changes to wiki page URLs, content, or the fumadocs docs experience itself.
- No CMS / admin UI for the "currently recommending" slot — it's derived from
  frontmatter already in the repo.
- No redesign of `/best-in-slot/*` or `/apps/*` pages — they keep the existing
  fumadocs theme/layout.

## Design

### Routing

Today, `app/(docs)/[[...slug]]/page.tsx` is an **optional** catch-all
(`[[...slug]]`), so it matches both `/` and every wiki path, and
`app/(docs)/layout.tsx` wraps all of it in fumadocs' `DocsLayout`.

Change: make the docs route a **required** catch-all (`[...slug]`, not
`[[...slug]]`). A required catch-all does not match `/`, which frees up `/` for
a sibling route with its own layout:

- `app/(docs)/[...slug]/page.tsx` — unchanged page logic, still wrapped in
  `DocsLayout`, still mounted via `source` with `baseUrl: "/"`. `/best-in-slot/*`
  and `/apps/*` continue to resolve exactly as they do today.
- `app/page.tsx` (new, outside the `(docs)` route group) — the homepage. Own
  layout: shared top nav (same links as today: Wiki/GitHub/CV) but no fumadocs
  sidebar.

`content/docs/index.mdx` is deleted. Its "About me" and "About this site"
paragraphs move into the new homepage component as plain copy. Remove `"index"`
from `content/docs/meta.json`'s `pages` array accordingly.

### Homepage layout & style

Single column, max-width container, cream background (`#faf6f0`), serif
headings (system serif stack), terracotta accent (`#c1543c`):

1. **Nav** — "sam macaluso" wordmark + Wiki / GitHub / CV links (reuse
   `baseOptions` from `layout.config.tsx` for link targets).
2. **Bio block** — circular avatar (`public/avatar.jpg`, already cropped to the
   dog's face) + "Hey, I'm Sam." + one-line bio.
3. **Currently recommending** — see Data below. Omitted entirely if no dated
   page exists yet.
4. **Section links** — two cards, "Apps →" and "Best in Slot →", linking to
   `/apps` and `/best-in-slot`.
5. Existing `<Footer />` stays as-is underneath.

### "Currently recommending" data

Add an optional `date` field to the docs frontmatter schema (extend the zod
schema passed to `defineDocs` in `source.config.ts`). Pages opt in by adding
`date: YYYY-MM-DD` to their frontmatter; pages without it are ignored for this
feature (no error).

Homepage logic: call `source.getPages()`, filter to pages with a `date`, sort
descending, take the first. Render its `title` + `description` + link. If the
filtered list is empty, render nothing — no placeholder, no error.

**Before first deploy**, at least one existing page needs a `date:` added
manually (e.g. `apps/flighty.mdx`), otherwise the slot stays empty on launch.

### Nav fix

`content/docs/meta.json` currently lists `"pages": ["index", "best-in-slot"]`,
omitting `"apps"`. Update to `["best-in-slot", "apps"]` (dropping `index` per
the routing change above) so the Apps section shows in the wiki sidebar.

### Avatar asset

Already done as part of this design session: `public/avatar.jpg` (600×600,
square-cropped to the dog's face) is in place. The original uncropped photo
(which included a second, non-consenting person's face) was deleted rather
than kept in `public/`, since anything under `public/` is publicly servable at
its literal path regardless of whether it's linked from a page.

## Testing

- `npm run dev`: confirm `/` renders the new homepage with no sidebar, and
  `/best-in-slot`, `/apps`, `/apps/flighty` still render normally with the
  existing docs chrome.
- Add a `date` to one page, confirm it surfaces in "Currently recommending";
  remove it, confirm the slot disappears cleanly.
- Confirm `/apps` now appears in the wiki sidebar nav.
- `npm run build` to confirm the required-catch-all routing change doesn't
  break static generation (`generateStaticParams`).
