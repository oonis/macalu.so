# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/` its own bio-led homepage (Warm Paper style, catalog-index signature detail) outside the fumadocs docs sidebar, fix the Apps section missing from the wiki nav, and surface a "Currently recommending" pick automatically from content frontmatter.

**Architecture:** `/` becomes a standalone route (`app/page.tsx`) using fumadocs' `HomeLayout` (shared nav, no sidebar), re-themed to a cream/serif/terracotta palette by scoping Tailwind's `--color-fd-*` CSS variables to `#nd-home-layout`. The docs catch-all moves from optional (`[[...slug]]`, which used to also match `/`) to required (`[...slug]`), freeing `/` for the new route while leaving every existing `/best-in-slot/*` and `/apps/*` URL untouched. The frontmatter schema gains an optional `date` field; the homepage reads `source.getPages()`, picks the newest dated page, and renders it.

**Tech Stack:** Next.js 16 (App Router), fumadocs-core/fumadocs-ui/fumadocs-mdx, Tailwind CSS v4, TypeScript (strict), zod v4 (transitive dep of fumadocs-mdx, already resolvable from `node_modules/zod`).

## Global Constraints

- This repo has no automated test framework (no jest/vitest/playwright, no `test` script in `package.json`). Verification throughout this plan is `npm run build` (typecheck + production build), `npm run lint`, and manual checks via `npm run dev` — follow this existing repo convention, do not introduce a new test framework.
- TypeScript `strict: true` (`tsconfig.json`) — all new code must typecheck with no `any`.
- Use the `@/` path alias for repo-root imports (e.g. `@/lib/source`), matching existing files.
- Tailwind v4: this codebase's only real runtime CSS custom properties for the fumadocs palette are `--color-fd-*` (defined via `@theme` in `fumadocs-ui/css/lib/default-colors.css`), which power utility classes like `bg-fd-background`/`text-fd-foreground`/`border-fd-border`. There is **no** `--fd-background`-style (no `color-` prefix) variable actually defined anywhere despite `app/global.css`'s pre-existing `.site-footer` rule referencing `var(--fd-border)` — that's a latent pre-existing bug, out of scope here. Do not copy that pattern; always use the `--color-fd-*`-backed Tailwind utility classes instead.
- Do not change any existing `/best-in-slot/*` or `/apps/*` URL or page content beyond what's specified in Task 2.
- Run `npx fumadocs-mdx` (regenerates `.source/`) after any change to `source.config.ts`, before relying on the new types.

---

### Task 1: Add optional `date` frontmatter field

**Files:**
- Modify: `source.config.ts`

**Interfaces:**
- Produces: doc pages may now carry an optional `data.date: string` (ISO `YYYY-MM-DD`), readable via `source.getPage(...)`/`source.getPages()` from `lib/source.ts`. Task 2 and Task 3 depend on this field existing in the type.

- [ ] **Step 1: Extend the frontmatter schema**

Replace the full contents of `source.config.ts` with:

```ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.string().date().optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
})
```

`z.string().date()` validates an ISO `YYYY-MM-DD` string (zod v4, installed at `node_modules/zod@4.3.6`, resolvable without adding it to `package.json` since it's already a transitive dependency of `fumadocs-mdx`).

- [ ] **Step 2: Regenerate generated types**

Run: `npx fumadocs-mdx`
Expected: command exits 0, no error output. `.source/` files are regenerated (check via `git status` that `.source/` shows no tracked changes — it's gitignored, this just confirms generation ran without throwing).

- [ ] **Step 3: Verify the schema change builds cleanly**

Run: `npm run build`
Expected: build completes successfully (exit 0), same as before this change — nothing yet consumes `date`, so this only confirms the schema extension itself is valid.

- [ ] **Step 4: Commit**

```bash
git add source.config.ts
git commit -m "Add optional date frontmatter field to docs schema"
```

---

### Task 2: Fix Apps nav + seed a recommending date

**Files:**
- Create: `content/docs/apps/meta.json`
- Modify: `content/docs/meta.json`
- Modify: `content/docs/apps/flighty.mdx` (frontmatter only)

**Interfaces:**
- Consumes: the `date` field added in Task 1.
- Produces: `content/docs/apps/flighty.mdx` now has `data.date = "2026-06-30"`, the only dated page until more are added — Task 3's "Currently recommending" logic will resolve to this page.

- [ ] **Step 1: Add the missing apps section meta**

Create `content/docs/apps/meta.json`:

```json
{
  "title": "Apps",
  "pages": ["index", "flighty"]
}
```

- [ ] **Step 2: Add `apps` to the root nav and drop `index`**

Replace the full contents of `content/docs/meta.json`:

```json
{
  "title": "Wiki",
  "pages": ["best-in-slot", "apps"]
}
```

(Dropping `"index"` here is safe even though `content/docs/index.mdx` and the route that served it still exist at this point in the plan — Task 3 removes both. Leaving `"index"` out of `pages` just means it's no longer in the sidebar, which is correct either way.)

- [ ] **Step 3: Seed a `date` on the Flighty entry**

In `content/docs/apps/flighty.mdx`, change the frontmatter from:

```
---
title: Flighty
description: Flight tracking app
---
```

to:

```
---
title: Flighty
description: Flight tracking app
date: 2026-06-30
---
```

- [ ] **Step 4: Verify in the dev server**

Run: `npm run dev`, visit `http://localhost:3000/apps` and `http://localhost:3000/apps/flighty`.
Expected: the left sidebar now shows an "Apps" section (containing "Flighty") alongside "Best in Slot" — previously Apps was reachable only by direct URL, not from the sidebar. The Flighty page itself renders unchanged. Stop the dev server (Ctrl-C) once confirmed.

- [ ] **Step 5: Commit**

```bash
git add content/docs/apps/meta.json content/docs/meta.json content/docs/apps/flighty.mdx
git commit -m "Add apps section to wiki nav, seed a recommending date"
```

---

### Task 3: Build the homepage route

**Files:**
- Create: `app/page.tsx`
- Modify: `app/global.css` (append cream theme scope)
- Move: `app/(docs)/[[...slug]]/page.tsx` → `app/(docs)/[...slug]/page.tsx` (no content change, required catch-all instead of optional)
- Delete: `content/docs/index.mdx`

**Interfaces:**
- Consumes: `source` from `@/lib/source` (`source.getPages(): Page[]`, each `Page` has `slugs: string[]`, `url: string`, `data: { title: string; description?: string; date?: string }`); `baseOptions` from `./layout.config` (`{ nav: { title: string }, links: Array<{ text: string; url: string; external?: boolean }> }`); `HomeLayout` from `fumadocs-ui/layouts/home`.
- Produces: `/` renders the new homepage. No other route's behavior changes.

- [ ] **Step 1: Move the docs catch-all to a required pattern**

```bash
mkdir -p "app/(docs)/[...slug]"
git mv "app/(docs)/[[...slug]]/page.tsx" "app/(docs)/[...slug]/page.tsx"
rmdir "app/(docs)/[[...slug]]"
```

No edits needed inside the moved file — `app/(docs)/[...slug]/page.tsx` keeps using `source.getPage(params.slug)`, `generateStaticParams`, and `generateMetadata` exactly as before. The only change is that Next.js no longer routes `/` (zero path segments) into this file, because `[...slug]` (required) needs at least one segment, unlike the old `[[...slug]]` (optional).

- [ ] **Step 2: Verify docs pages still 404 correctly and `/` is now unhandled**

Run: `npm run dev`, visit `http://localhost:3000/best-in-slot/office`.
Expected: renders exactly as before. Visit `http://localhost:3000/`.
Expected: Next.js 404 page (expected at this point — `app/page.tsx` doesn't exist yet). Stop the dev server.

- [ ] **Step 3: Scope the cream theme to the homepage**

Append to `app/global.css`:

```css
/* Homepage cream theme — scoped to fumadocs' HomeLayout root, leaves docs pages on the default neutral theme */
#nd-home-layout {
  --color-fd-background: #faf6f0;
  --color-fd-foreground: #2b2622;
  --color-fd-muted-foreground: #8a7a68;
  --color-fd-border: #e8ddd0;
  --color-fd-card: #ffffff;
  --color-fd-card-foreground: #2b2622;
  --color-fd-accent: #c1543c;
  --color-fd-accent-foreground: #faf6f0;
}
```

- [ ] **Step 4: Write the homepage component**

Create `app/page.tsx`:

```tsx
import Image from "next/image"
import Link from "next/link"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "./layout.config"
import { source } from "@/lib/source"

type DocPage = ReturnType<typeof source.getPages>[number]

function hasDate(page: DocPage): page is DocPage & { data: { date: string } } {
  return typeof page.data.date === "string"
}

function sectionCount(pages: DocPage[], section: string) {
  return pages.filter(
    (page) => page.slugs[0] === section && page.slugs.length > 1,
  ).length
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export default function HomePage() {
  const pages = source.getPages()

  const appsCount = sectionCount(pages, "apps")
  const bestInSlotCount = sectionCount(pages, "best-in-slot")
  const totalEntries = appsCount + bestInSlotCount

  const recommending = pages
    .filter(hasDate)
    .sort((a, b) => (a.data.date < b.data.date ? 1 : -1))[0]

  return (
    <HomeLayout {...baseOptions} className="bg-fd-background text-fd-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.jpg"
            alt="A close-up of Sam's dog"
            width={64}
            height={64}
            priority
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="font-serif text-2xl">Hey, I&apos;m Sam.</h1>
            <p className="text-sm text-fd-muted-foreground">
              A software developer who researches way too much into mundane
              things.
            </p>
          </div>
        </div>

        {recommending ? (
          <div className="rounded-lg border border-fd-border bg-fd-card p-4">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-fd-muted-foreground">
              <span className="font-mono">
                No. {String(totalEntries).padStart(3, "0")}
              </span>
              <span>Currently recommending</span>
            </div>
            <Link
              href={recommending.url}
              className="font-serif text-lg text-fd-foreground hover:text-fd-accent"
            >
              {recommending.data.title}
            </Link>
            {recommending.data.description ? (
              <p className="mt-1 text-sm text-fd-muted-foreground">
                {recommending.data.description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/apps"
            className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-accent"
          >
            <span className="font-serif text-lg">Apps →</span>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              {appsCount} {pluralize(appsCount, "entry", "entries")}
            </p>
          </Link>
          <Link
            href="/best-in-slot"
            className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-accent"
          >
            <span className="font-serif text-lg">Best in Slot →</span>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              {bestInSlotCount}{" "}
              {pluralize(bestInSlotCount, "category", "categories")}
            </p>
          </Link>
        </div>

        <div className="space-y-3 text-sm text-fd-muted-foreground">
          <p>
            This site is my second brain: a place where I document the things
            I&apos;ve found, use, and recommend.
          </p>
          <p>
            Built with{" "}
            <a href="https://nextjs.org" className="underline">
              Next.js
            </a>{" "}
            and{" "}
            <a href="https://fumadocs.vercel.app" className="underline">
              Fumadocs
            </a>
            , deployed on{" "}
            <a href="https://vercel.com" className="underline">
              Vercel
            </a>
            . Source on{" "}
            <a
              href="https://github.com/oonis/macalu.so"
              className="underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </HomeLayout>
  )
}
```

- [ ] **Step 5: Remove the now-redundant docs index page**

```bash
git rm content/docs/index.mdx
```

(Its "About me"/"About this site" copy is already folded into `app/page.tsx` above. `"index"` was already dropped from `content/docs/meta.json`'s `pages` array in Task 2, so this doesn't change the sidebar.)

- [ ] **Step 6: Verify the homepage and docs pages together**

Run: `npm run dev`, visit `http://localhost:3000/`.
Expected: cream-background homepage renders — avatar circle, "Hey, I'm Sam.", a "Currently recommending" card showing "No. 001 — Currently recommending — Flighty — Flight tracking app" (linking to `/apps/flighty`), two link cards "Apps → / 1 entry" and "Best in Slot → / 4 categories", no sidebar, no docs chrome.
Visit `http://localhost:3000/best-in-slot` and `http://localhost:3000/apps/flighty`.
Expected: both render exactly as before (default neutral fumadocs theme, sidebar present, unaffected by the homepage's cream CSS scope). Stop the dev server.

- [ ] **Step 7: Full build and lint check**

Run: `npm run build`
Expected: exit 0, no type errors, static params generate for all docs pages (no entry for `/` since it's no longer part of the docs source).

Run: `npm run lint`
Expected: exit 0, no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add bio-led homepage at / with catalog-index recommending slot"
```

---

## Self-Review Notes

- **Spec coverage:** Routing change (Task 3 Step 1), Warm Paper visual style (Task 3 Step 3+4), bio block with avatar (Task 3 Step 4 — `public/avatar.jpg` itself was already created during brainstorming), catalog index-card signature + section entry counts (Task 3 Step 4), "Currently recommending" data logic + date frontmatter (Task 1, Task 2 Step 3, Task 3 Step 4), nav fix for `apps` (Task 2 Steps 1–2), `content/docs/index.mdx` retirement (Task 3 Step 5). All covered.
- **Type consistency:** `DocPage`, `hasDate`, `sectionCount`, `pluralize` are defined once in Task 3 Step 4 and used only there — no cross-task naming drift to check.
- **No placeholders:** all code blocks are complete and copy-pasteable.
