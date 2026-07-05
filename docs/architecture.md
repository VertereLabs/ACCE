# ACCE Tutors — Architecture

> The website as it currently stands (`acce-nextjs/`). Generated 2026-07-04 (deep scan).

## 1. Executive summary

ACCE Tutors is a **Next.js 16 App Router** website rendered as static/server content with
**no backend of its own**. It is best understood as two content surfaces sharing one
design system:

- a **single-page marketing site** at `/` (11 stacked section components), and
- a **static study-guide library** under `/guides` (an index + 17 hand-authored article pages).

All user actions that "do something" are **outbound links** — WhatsApp, `mailto:`,
`tel:`, and LinkedIn. There is no form submission, no auth, no database, and no API layer
(`src/app/api/` exists but is empty).

## 2. Technology stack & justification

| Layer | Choice | Why it's here |
|-------|--------|---------------|
| Framework | Next.js 16 App Router, `output: 'standalone'` | File-system routing for the guide tree; standalone build for self-hosted Coolify/VPS deploy |
| Rendering | Server Components by default; `"use client"` only where interactivity is needed | Most pages are static content → shipped as HTML with minimal JS |
| React 19 + React Compiler | `reactCompiler: true` | Auto-memoization; components written without manual `useMemo`/`useCallback` |
| Styling | Tailwind 3 + CSS-variable design tokens | Utility-first with a centrally themed dark palette |
| Components | shadcn/ui (Radix + `class-variance-authority`) | Accessible primitives; only a subset actually used |
| Metadata/SEO | Next Metadata API + file-based `sitemap.ts`/`robots.ts`/`manifest.ts` + `opengraph-image`/`twitter-image` route handlers | Per-route canonical URLs, OG/Twitter cards, JSON-LD |
| Analytics | Self-hosted Umami script in root layout | Privacy-friendly, first-party |

**Architecture pattern:** component-based, layered presentation. There is no service or
data layer — "data" is inline constant arrays inside components/pages.

## 3. Rendering & routing model

```
src/app/layout.tsx            Root layout: <html>, fonts (via globals.css @import),
                              Umami <Script>, JSON-LD structured data, global metadata,
                              wraps children in <Providers>, mounts <Toaster>/<Sonner>
  └─ providers.tsx  ("use client")  QueryClientProvider + next-themes ThemeProvider
                                    (defaultTheme="dark") + Radix TooltipProvider
  ├─ page.tsx                 "/" — composes 11 section components + Navbar/Footer
  ├─ not-found.tsx            404
  └─ guides/
     ├─ layout.tsx            thin wrapper <div class="guides-shell">
     ├─ page.tsx              "/guides" index (reads isGuidePublished())
     ├─ ifrs-16/page.tsx + part-1..5/page.tsx
     ├─ ifrs-15/page.tsx + part-1..5/page.tsx
     └─ groups/page.tsx + part-1..7/page.tsx
```

- **Server Components:** all `guides/**` pages and most homepage sections (they are pure
  content). They export per-route `metadata` with canonical URLs.
- **Client Components (`"use client"`):** `Navbar` (mobile menu state), `Hero` (visual),
  `providers.tsx`. shadcn/ui primitives are client components where their Radix base requires it.
- **SEO route handlers:** each route group has `opengraph-image.tsx` / `twitter-image.tsx`
  (dynamically generated OG images) alongside `sitemap.ts`, `robots.ts`, `manifest.ts`,
  `icon.tsx`, `apple-icon.tsx` at the app root.

## 4. Content architecture (important)

Guide content is **not** stored in markdown, a CMS, or MDX. Each part is a `page.tsx`
that renders the article as **hand-written JSX** using Tailwind + lucide icons and the
Tailwind Typography `prose prose-invert` classes. Marketing-section content is likewise
**inline constant arrays** (e.g. `services`, `milestones`, `steps`, `valueProps`,
`plans`, `blogPosts`) mapped to cards inside each component.

Implication: editing site copy = editing TSX. There is no content/code separation. The
`config/guides.ts` publish flags are the only content-control abstraction.

## 5. Publish-gating logic

`src/config/guides.ts`:

```ts
GUIDE_PUBLISH_STATUS = { groups: false, "ifrs-15": false, "ifrs-16": false }
isGuidePublished(id) => isDev ? true : (GUIDE_PUBLISH_STATUS[id] ?? false)
```

- In `next dev`, **all guides are visible** (so you can author/preview).
- In a production build, guides flip to **"Coming Soon"** on `/guides` until their flag is `true`.
- The guide **detail pages themselves are always built and routable** (they're in
  `sitemap.ts`); the flag only changes the index card's CTA. There is no redirect/404 guard
  on the individual part pages.

## 6. Design system

- **Tokens** in `src/app/globals.css` as HSL CSS variables (`--primary`, `--accent`,
  `--background`, gradients `--gradient-hero/-accent/-card/-text`, shadows
  `--shadow-soft/-elevated/-glow`). Exposed to Tailwind via `tailwind.config.ts` `theme.extend.colors`.
- **Look:** dark navy background with a fixed `--gradient-hero` body background, warm
  orange `--accent`, frosted-glass cards (`bg-white/10 backdrop-blur-md border-white/20`),
  `Playfair Display` display font + `DM Sans` body font.
- **Custom button variant `hero`** (`gradient-accent … hover:shadow-glow hover:scale-105`)
  is the primary CTA style used across the site.
- Theme is dark-first (`next-themes` `defaultTheme="dark"`, `enableSystem`), though the
  palette is authored primarily for dark.

## 7. Security & headers

`next.config.ts` sets strong global headers on every route: a **Content-Security-Policy**
(allows self + the Umami stats host for scripts), `Strict-Transport-Security`,
`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`. Guide PDFs additionally get a
canonical `Link` header. `images.unoptimized: true` (no Next image optimization server).

## 8. Data architecture

**None.** No database, ORM, migrations, or persistent store. No API contracts. No
server-side data fetching. `@tanstack/react-query` is provider-mounted but no query is
issued anywhere in the app. (These docs therefore omit `data-models.md` / `api-contracts.md`.)

## 9. Known inconsistencies (current state)

These are real, present in the code today — worth knowing before editing:

1. ~~**Resources vs. publish flags mismatch.**~~ **FIXED 2026-07-04.**
   `components/Resources.tsx` now derives each card's badge and link behavior from
   `isGuidePublished()` (the same source `/guides` uses), so the homepage and guide index
   can no longer disagree. Unpublished guides show "Coming Soon" and don't deep-link.
   Covered by `tests/unit/render-smoke.test.tsx` and `tests/e2e/smoke.spec.ts`.
2. **Pricing placeholders.** All `Pricing.tsx` plans show `price: "TBD"`.
3. **Blog is non-functional.** `Blog.tsx` renders 3 placeholder posts ("Coming Soon");
   there are no `/blog` routes.
4. **Stale README.** `acce-nextjs/README.md` is the untouched `create-next-app` template
   (mentions Geist/Vercel) and does not describe this project.
5. **Navbar "Contact" links to `/#contact`** which resolves to the `CTA` section
   (`id="contact"`) — correct, but the anchor lives in `CTA.tsx`, not an obvious "Contact" component.

## 10. Cross-project notes (Vertere Labs conventions)

- Matches the house Next.js pattern: App Router, `output: 'standalone'`, Tailwind,
  Coolify deploy. Consistent with MercDialer/AutomationArchitect styling choices (Tailwind + shadcn).
- No axios (good — aligns with the native-`fetch` lesson); in fact no HTTP client at all.
- Unlike the Prisma-based projects, there's no `db.ts` singleton concern here (no DB).
