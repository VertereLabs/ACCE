# ACCE Tutors — Project Documentation Index

> Generated 2026-07-04 by BMad Document-Project (deep scan). Primary entry point for
> AI-assisted development. Documents the website **as it currently stands** (`acce-nextjs/`).

## Project overview

- **Name:** ACCE Tutors — CA(SA)/CTA accounting tutoring website (accetutors.co.za)
- **Type:** Monolith — single Next.js web app
- **Primary language:** TypeScript / TSX
- **Architecture:** Component-based, statically-rendered Next.js App Router site with **no backend**
- **Purpose:** Marketing landing page (converts to WhatsApp/email enquiries) + static IFRS study-guide library

## Quick reference

| | |
|---|---|
| **App location** | `acce-nextjs/` (repo-root siblings are working material, not the app) |
| **Framework** | Next.js 16.1.1, App Router, `output: 'standalone'` |
| **UI** | React 19.2.3 (+ React Compiler), Tailwind 3, shadcn/ui (Radix + CVA) |
| **Fonts** | Playfair Display (display) + DM Sans (body) |
| **Entry points** | `src/app/layout.tsx` → `providers.tsx`; homepage `src/app/page.tsx`; guides `src/app/guides/page.tsx` |
| **Data/API/DB** | None — no API routes (`src/app/api/` empty), no database, no forms |
| **Routes** | 23 (`/`, `/guides`, 3 guide overviews, 17 guide parts, 404) |
| **Analytics** | Self-hosted Umami (`stats.verterelabs.co.za`) |
| **Deploy** | Coolify/Nixpacks standalone (`node .next/standalone/server.js`), port 3000 |

## Content surfaces

1. **Homepage `/`** — 11 stacked sections: Navbar, Hero, Services, About, HowItWorks,
   WhyChoose, Pricing, Resources, Blog, CTA, Footer. Copy lives inline in each component.
2. **Study guides `/guides`** — index + 3 series: **IFRS 16** (5 parts), **IFRS 15**
   (5 parts), **Groups & Business Combinations** (7 parts). Each part is hand-authored JSX.
   Publish gating via `src/config/guides.ts` (all currently `false` → "Coming Soon" in prod).

## Generated documentation

- [Project Overview](./project-overview.md) — what it is, stack, site map, current-state facts
- [Architecture](./architecture.md) — rendering model, content architecture, design system, security, **known inconsistencies**
- [Source Tree Analysis](./source-tree-analysis.md) — annotated file/folder tree
- [Component Inventory](./component-inventory.md) — the 11 sections, guide pages, shadcn primitives, hooks
- [Development Guide](./development-guide.md) — setup, scripts, common tasks, gotchas
- [Deployment Guide](./deployment-guide.md) — standalone build, Coolify/Nixpacks, legacy `deploy.ps1`, headers

> Not generated (intentionally N/A for this project): **API Contracts** and **Data Models** —
> the site has no API layer and no database.

## Existing (pre-scan) material in this folder

These predate the scan and are strategy/content notes, **not** app documentation:
`STRATEGY.md`, `PHASE-1A-PLAN.md`, `Idea.md`, `For-Priyanka.md`, `Conversation with PG.md`.

## Current-state flags worth knowing

- Guides gated to **Coming Soon** in production (`config/guides.ts`). The homepage
  `Resources` section now derives availability from the same config (fixed 2026-07-04), so
  homepage and index stay in sync.
- **Pricing = "TBD"** on all three plans.
- **Blog** section is placeholder-only; no blog routes.
- `acce-nextjs/README.md` is the **stock create-next-app template** — ignore it; use this index.
- **Test baseline in place** (Vitest + Playwright): `npm test` (21 unit) and
  `npm run test:e2e` (26 route/e2e). See [development-guide.md](./development-guide.md#testing).

## Getting started

```bash
cd acce-nextjs
npm install
npm run dev     # http://localhost:3000 — all guides visible in dev
```

See [development-guide.md](./development-guide.md) for common tasks (publishing a guide,
adding a guide part, editing copy) and [deployment-guide.md](./deployment-guide.md) to ship.
