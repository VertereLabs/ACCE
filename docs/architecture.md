# ACCE Tutors — Architecture

> The website as it currently stands (`acce-nextjs/`). Generated 2026-07-04 (deep scan).
> Sections 5 and 6 refreshed 2026-07-11 to reflect the shipped navy+gold Stage-1 rebrand
> and the middleware-based guide/PDF gating (both landed after the original scan).

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

Guide visibility is controlled by **one flag map, enforced in two layers**.

`src/config/guides.ts` (source of truth for the UI):

```ts
GUIDE_PUBLISH_STATUS = { groups: false, "ifrs-15": false, "ifrs-16": false }
isDev            = NODE_ENV === "development"
isGuidesPreview  = NEXT_PUBLIC_GUIDES_PREVIEW === "true"
isGuidePublished(id) => (isDev || isGuidesPreview) ? true : (GUIDE_PUBLISH_STATUS[id] ?? false)
anyGuidePublished()  => some guide isGuidePublished
```

Two deploy paths from one codebase:

- **PUBLIC (default)** — normal `npm run build` / deploy. Only guides flagged `true` are live;
  the rest render **"Coming Soon"** on `/guides` and the homepage Resources section.
- **REVIEW** — `NEXT_PUBLIC_GUIDES_PREVIEW=true` (dev, or a private preview deploy). **All**
  guides + PDFs unlock so content can be reviewed before release, without exposing them publicly.

`src/middleware.ts` (Edge runtime — **enforces** the gate for real):

- It **cannot import** `config/guides.ts`, so it **duplicates** `GUIDE_PUBLISH_STATUS` and adds a
  `PDF_TO_GUIDE` filename→id map. These copies **must be kept in sync** with the config by hand.
- In dev or REVIEW mode it is a no-op. In a public build it actively **redirects**:
  - `/guides/<id>/...` for an unpublished `<id>` → `redirect("/guides")`.
  - `/pdfs/<file>.pdf` whose guide is unpublished → `redirect("/guides")`.
- `matcher: ["/guides/:path+", "/pdfs/:path*"]`.

So — unlike the original scan noted — the **detail/part pages and PDFs are guarded**: an
unpublished guide page no longer merely shows a "Coming Soon" card, it is redirected away in
public builds. `sitemap.ts` filters guide URLs on `isGuidePublished`, so unpublished guides are
absent from the sitemap; PDFs are never in the sitemap.

> **Known limitation (target of the SEO-architecture work):** today this single `GUIDE_PUBLISH_STATUS`
> gates *both* the page and its PDF. The planned work splits it into independent page-published and
> PDF-published states (adding `GUIDE_PDF_PUBLISH_STATUS` / `isGuidePdfPublished`) in both files, so a
> guide page can be public while its PDF stays blocked. Not yet implemented.

## 6. Design system

Stage-1 "fresh look" rebrand (navy + gold, two-mode) has **shipped**. The authoritative spec is
`_bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md`; the code matches it.

- **Palette — navy + gold, two modes.** `src/app/globals.css` defines a full HSL token set in both
  `:root` (light — "Warm Scholar", warm ivory base) and `.dark` (**default** — "Deep Authority",
  ink-navy base): `--primary` (navy in light, inverts to off-white in dark), `--accent` (brand gold),
  plus non-native tokens `--accent-ink` (readable gold for text/icons on the base), `--primary-ink`
  (tag text), and `--footer-bg`/`--footer-fg` (footer stays dark navy in **both** modes — does not
  invert). Gradients (`--gradient-hero/-accent/-text`) and shadows (`--shadow-*`, incl. `--shadow-glow`)
  remain. Exposed to Tailwind via `tailwind.config.ts`.
- **Typography — Playfair Display + Inter.** Loaded via `next/font/google` in `layout.tsx` as
  `--font-display` (Playfair) and `--font-body` (Inter), wired on `<html class="{playfair} {inter}">`.
  (Supersedes the old Playfair **+ DM Sans** pairing — DM Sans is gone.)
- **Surfaces:** solid `bg-card` on `border-border` with `shadow-elevated`, radius `0.625rem`
  (pills `999px`). The old translucent "frosted-glass" cards (`bg-white/10 backdrop-blur`) are
  retired for content cards; the sticky Navbar still uses a translucent `bg-background/80 backdrop-blur`.
- **Buttons** (`components/ui/button.tsx`): `default` (navy `--primary`), `hero`
  (`gradient-accent` gold — the **conversion CTA**, one gold per view group), `heroOutline`, `ghost`,
  plus stock `outline`/`secondary`/`destructive`/`link`. Gold is accent-only; gold *text/icons* use
  `accent-ink`, never raw `--accent`.
- **Theme:** `next-themes` with `defaultTheme="dark"`; first paint honors the stored choice with no
  flash (`suppressHydrationWarning` + inline script). A navbar sun/moon toggle switches dark ⇄ light;
  only colors cross-fade (type, radius, layout, and logo intent are identical across modes).

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
