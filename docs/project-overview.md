# ACCE Tutors — Project Overview

> Documentation of the website as it currently stands. Generated 2026-07-04 (deep scan).

## What this is

**ACCE Tutors** (production domain **accetutors.co.za**) is the marketing and
study-resource website for a one-person CA(SA)/CTA accounting tutoring business run by
**Priyanka Govender**. The site does two jobs:

1. **Convert visitors into tutoring enquiries** — a single-page marketing landing page
   whose every call-to-action routes to WhatsApp (`wa.me/27713255295`) or email.
2. **Publish exam-focused IFRS study guides** — three multi-part guide series aimed at
   CA(SA), CTA and PGDA students.

There is **no backend, database, auth, or API** — it is a statically-rendered content
site. All "conversion" happens through outbound links (WhatsApp / email / LinkedIn).

## Where the code lives

The actual website is the **`acce-nextjs/`** folder at the repo root. Everything else in
the repo (`contentfiles/`, `zdocs/`, `zSEO/`, `zdeploy/`, `design-artifacts/`, `docs/`) is
supporting material — source content, strategy notes, SEO working files and planning
artifacts — **not** part of the deployed app.

## Tech stack summary

| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Framework | Next.js (App Router) | 16.1.1 | `output: 'standalone'` Node server |
| UI runtime | React + React DOM | 19.2.3 | React Compiler enabled (`reactCompiler: true`) |
| Language | TypeScript | ^5 | strict mode |
| Styling | Tailwind CSS | ^3.4.17 | HSL CSS-variable design tokens, dark-first |
| Component library | shadcn/ui (Radix primitives + CVA) | — | 49 primitives under `src/components/ui/` |
| Data/state libs | @tanstack/react-query, react-hook-form, zod | 5.x / 7.x / 4.x | present/wired but not exercised by any live feature |
| Icons | lucide-react | ^0.562 | used throughout |
| Fonts | Playfair Display (display), DM Sans (body) | — | loaded via Google Fonts `@import` |
| Analytics | Umami (self-hosted) | — | `stats.verterelabs.co.za`, site id `6c7e46f6…` |
| Build tooling | ESLint 9, PostCSS, Autoprefixer, babel-plugin-react-compiler | — | |

## Site map (23 routes)

- `/` — one-page marketing site (11 stacked sections)
- `/guides` — study-guide index (3 cards)
- `/guides/ifrs-16` + `/part-1` … `/part-5` — IFRS 16: Leases (5 parts)
- `/guides/ifrs-15` + `/part-1` … `/part-5` — IFRS 15: Revenue (5 parts)
- `/guides/groups` + `/part-1` … `/part-7` — Groups & Business Combinations (7 parts)
- `404` (`not-found.tsx`), plus generated `sitemap.xml`, `robots.txt`, `manifest.webmanifest`

**17 guide parts total.** Guide **content is hand-authored JSX** inside each
`page.tsx` (not markdown/CMS-driven) — roughly 4,900 lines of guide article markup.

## Notable current-state facts

- **Guides are gated to "coming soon" in production.** `src/config/guides.ts` sets
  `groups`, `ifrs-15`, `ifrs-16` all to `published: false`. In `next dev` everything is
  visible; in a production build the guide index shows them as *Coming Soon*. (Note the
  homepage `Resources` section still hard-codes an "Available" badge — see
  [architecture.md](./architecture.md#known-inconsistencies).)
- **Pricing is unpriced.** All three plans in `Pricing.tsx` show `price: "TBD"`.
- **Blog is placeholder.** `Blog.tsx` lists 3 posts all dated "Coming Soon"; no blog routes exist.
- **Single hero image** (`/images/priyanka.png`) is the only real content image.
- Downloadable PDFs exist for each guide series under `public/pdfs/` with canonical-link headers.

## Repository classification

- **Type:** Monolith (single deployable web app)
- **Primary language:** TypeScript / TSX
- **Architecture:** Component-based, statically-rendered App Router site — see
  [architecture.md](./architecture.md).

## Key links

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
