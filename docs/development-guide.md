# ACCE Tutors — Development Guide

> Generated 2026-07-04. All commands run from `acce-nextjs/`.

## Prerequisites

- **Node.js 20+** (React 19 / Next 16). `@types/node` pinned to `^20`.
- npm (a `package-lock.json` is committed).
- No `.env` required — the app has no server secrets, database, or API keys. The only
  external service is the Umami analytics script, hard-coded in `src/app/layout.tsx`.

## Install & run

```bash
cd acce-nextjs
npm install
npm run dev        # http://localhost:3000
```

### Scripts (`package.json`)

| Script | Command | Notes |
|--------|---------|-------|
| `dev` | `next dev` | Local dev. **All guides visible** here regardless of publish flags. |
| `build` | `next build` | Produces the standalone server (`output: 'standalone'`). |
| `start` | `next start` | Serves a production build locally. |
| `lint` | `eslint` | Uses `eslint.config.mjs` (eslint-config-next flat config). |
| `export` | `next build` | Alias of build (note: not a true `next export`; output is standalone). |

## Key config files

| File | Controls |
|------|----------|
| `next.config.ts` | Standalone output, React Compiler, security headers (CSP/HSTS/etc.), unoptimized images, PDF canonical headers |
| `tailwind.config.ts` | Maps CSS-variable tokens to Tailwind, fonts, container widths |
| `src/app/globals.css` | The actual design tokens (HSL vars), gradients, base styles, font `@import` |
| `tsconfig.json` | Strict TS; `@/*` → `./src/*` |
| `src/config/guides.ts` | Which guides are live in production |

## Common tasks

### Edit site copy
Marketing copy lives **inline in the section components** (`src/components/*.tsx`) as
constant arrays (e.g. `services`, `plans`, `valueProps`). Guide article copy lives inside
each `src/app/guides/**/page.tsx` as JSX. There is no CMS — copy changes are code changes.

### Publish a study guide
Edit `src/config/guides.ts` and flip the guide's flag to `true`:
```ts
export const GUIDE_PUBLISH_STATUS = { groups: false, "ifrs-15": false, "ifrs-16": true };
```
Then rebuild. In dev all guides are always visible, so preview with `npm run dev`.
⚠ Note the homepage `Resources.tsx` badges are **not** wired to these flags (they're
hard-coded "Available") — update both if you want them consistent.

### Add a new guide part
1. Create `src/app/guides/<series>/part-N/page.tsx` (copy an existing part as a template —
   they share the Navbar/Footer/back-link/PDF/`prose` structure).
2. Add the route to `ROUTES` in `src/app/sitemap.ts`.
3. Add the part to the `parts` array in that series' overview `page.tsx`.
4. Export `metadata` with a canonical URL.

### Update the founder image / PDFs
Replace `public/images/priyanka.png` or the files in `public/pdfs/`. PDF canonical-link
headers are declared per-file in `next.config.ts` — add a new block if you add a PDF.

### Set pricing
Replace `price: "TBD"` in `src/components/Pricing.tsx`.

## Testing

A baseline test suite is in place (added 2026-07-04), using the house stack: **Vitest**
for unit/integration + render smoke, **Playwright** for e2e route smoke.

| Command | What it runs |
|---------|--------------|
| `npm test` | Vitest once (`tests/unit/**`) — 21 tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright (`tests/e2e/**`) — builds prod, serves on **:3100**, hits every route |

Config: `vitest.config.ts` (jsdom + `@` alias + `tests/setup.ts` which mocks
`next/link`/`next/image`), `playwright.config.ts` (own production server on port 3100 so
it never collides with a dev server on 3000). First-time e2e needs the browser:
`npx playwright install chromium`.

### What's covered (the baseline)

- **`tests/unit/guides-config.test.ts`** — the publish gate (`isGuidePublished`): prod
  flag behavior, unknown-id safe default, and the dev-mode "everything visible" branch.
- **`tests/unit/utils.test.ts`** — `cn()` Tailwind-merge conflict resolution.
- **`tests/unit/sitemap.test.ts`** — sitemap ↔ filesystem consistency in both directions
  (catches "added a guide part but forgot the sitemap"), part counts, priorities.
- **`tests/unit/render-smoke.test.tsx`** — homepage, guides index, and a guide article
  render without throwing (RSC-500 safety net) + regression guard for the Resources fix.
- **`tests/e2e/smoke.spec.ts`** — every sitemap route returns 200, WhatsApp CTA present,
  guides gated as "Coming Soon" in production, unknown route → 404.

### Extending it

Add unit/integration specs under `tests/unit/` (`*.test.ts[x]`) and e2e under
`tests/e2e/` (`*.spec.ts`). The sitemap-driven e2e loop covers new routes automatically
once they're added to `src/app/sitemap.ts`.

## Gotchas

- **README is misleading** — `acce-nextjs/README.md` is the stock create-next-app template
  and describes Geist/Vercel, none of which applies. Use *these* docs instead.
- **Guides always build** even when unpublished; the flag only changes the `/guides` index
  card CTA, not routability of the part pages.
- **React Compiler is on** — write plain components; don't hand-add `useMemo`/`useCallback`.
- **`out/` and `deploy/` are build artifacts**, not source. The real deploy target is the
  standalone server, not the static `out/` export.
