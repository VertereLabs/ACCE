---
project_name: 'ACCE'
user_name: 'Luke'
date: '2026-07-11'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'content_rules', 'gating_rules', 'regression_rules', 'testing_workflow_rules']
status: 'complete'
rule_count: 32
optimized_for_llm: true
existing_patterns_found: 9
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Next.js 16.1.1** — App Router, `output: 'standalone'`, `images.unoptimized: true`. Server Components by default; `"use client"` only for interactivity (Navbar mobile menu, Hero, providers, theme toggle).
- **React 19.2.3 + React Compiler** (`reactCompiler: true`) — auto-memoization. Do NOT hand-write `useMemo`/`useCallback`.
- **TypeScript 5**, strict. Path alias `@/* → ./src/*`. `moduleResolution: "bundler"`.
- **Tailwind 3.4** + CSS-variable tokens (navy+gold, two-mode) + `@tailwindcss/typography` (`prose prose-invert` for guides).
- **shadcn/ui** (Radix + `class-variance-authority`), **lucide-react** icons, **next-themes** (`defaultTheme="dark"`).
- Fonts: **Playfair Display** (`--font-display`, headings) + **Inter** (`--font-body`).
- Testing: **Vitest 3** + Testing Library (`tests/unit`), **Playwright** (`tests/e2e`).
- **No backend**: no DB, no API, no data fetching. `@tanstack/react-query` is mounted but unused. No HTTP client — use native `fetch()` if ever needed (no axios).
- App lives under `acce-nextjs/`. Deploy: standalone build via Coolify, base dir `/acce-nextjs`, served with `node .next/standalone/server.js`.

## Critical Implementation Rules

### New marketing/SEO pages (App Router)

- Each new route is a **server component** at `src/app/<route>/page.tsx` rendering `<Navbar/> → <main className="pt-32 pb-24"> content → <Footer/>` (mirror the guide pages). Consider a shared marketing `layout.tsx` so Navbar/Footer aren't repeated.
- Export `metadata` mirroring `src/app/page.tsx`: `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`. `metadataBase` is set globally in `layout.tsx`, so `canonical` is a **relative path** (e.g. `"/cta-tutor/"`).
- Exactly **one `<h1>`** per page. Title ≤ ~60 chars, meta description ≤ ~155 chars.
- **Per-page JSON-LD**: inject with `<Script type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching `layout.tsx`. The layout already emits the global `Organization`/`WebSite` graph; pages add `Service`/`Course`/`FAQPage`/`BreadcrumbList` as assigned.
- **Register every new route in `src/app/sitemap.ts`** (add to the `ROUTES` array; `BASE_URL` = `https://accetutors.co.za`). This is additive; guide-URL filtering there stays untouched.

### Design system (reuse only — no new palette/components)

- Consume tokens via Tailwind classes (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, etc.), which map to `hsl(var(--token))`. No new hue or third accent.
- **Gold is accent-only.** Gold text/icons use `accent-ink` (`text-accent`), never raw `--accent`. `--accent` is for fills/buttons/borders.
- **Button**: `variant="hero"` (gradient gold) is the **single conversion CTA per view group**; `default` = navy, `ghost`/`heroOutline`/`outline` for secondary. Use `<Button asChild>` to wrap `<Link>`/`<a>`.
- Must render correctly in **both dark (default) and light** modes; footer stays dark navy in both (does not invert). Visible focus ring on every interactive element; ≥44px touch targets.
- Content max-width ~1160px (existing containers use `container mx-auto px-6` / `max-w-4xl`); grids collapse to one column under `md`.

### Content & editorial rules

- Content is **hand-authored JSX + inline `const` arrays** — no CMS/MDX/markdown. Editing copy = editing TSX.
- Where a new page mirrors a homepage section (e.g. Auditing), **extract the shared inner content into one component** used by both, to avoid divergence.
- **No em dashes (`—`)** anywhere in rendered copy or metadata. Use commas, colons, parentheses, or two sentences. En dashes in numeric ranges (`24–48h`, `700–900 words`) are fine — leave them.
- **Voice**: first-person, Priyanka's voice (results-first mentorship). Plain terms (PGDA, CTA, CA(SA), IFRS). No corporate "we", no hype, no exam-fear-mongering. Weave SA context (CA(SA), SAICA, ITC/APC, UNISA/UCT/Wits/UJ/UP/Stellenbosch) for E-E-A-T.

### Guide publish-gating (keep two files in sync)

- `GUIDE_PUBLISH_STATUS` is **duplicated** in `src/config/guides.ts` AND `src/middleware.ts` (Edge runtime can't import config). Any change must be mirrored in both by hand.
- The SEO work **decouples** page-gating from PDF-gating: add `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished(id)` in `config/guides.ts`, and mirror both maps (plus `PDF_TO_GUIDE`) in `middleware.ts`. Page check reads page state; `/pdfs/<file>.pdf` check reads PDF state.
- `sitemap.ts` filters guide URLs on `isGuidePublished` — flipping a page live needs **no sitemap edit**. PDFs are never in the sitemap.
- `NEXT_PUBLIC_GUIDES_PREVIEW=true` (or dev) unlocks everything for review; public build enforces the gate.

### Additive-only / no regressions

- Do NOT remove or restructure homepage sections, or change `next.config.ts` global security headers (CSP/HSTS/X-Frame-Options), `output: 'standalone'`, or existing routes. All SEO work is additive.
- Single-shot release (NFR7): at release time **no internal `<Link>` may point at an unbuilt page**. (Authoring a `<Link>` to a not-yet-built route is fine mid-sprint — it resolves when the sibling lands.)

### Testing & workflow

- New public routes should be covered by the smoke tests (`tests/unit/render-smoke.test.tsx`, `tests/e2e/smoke.spec.ts`) — assert each returns 200 / renders. A green unit suite does not catch RSC render-time 500s; the e2e smoke does.
- Playwright uses a dedicated port (3100) with `reuseExistingServer: false` — don't let it attach to a stray dev server.
- Branch: `feat/seo-page-architecture` (cut from `main`). The guide-gating changes must also be applied to `main`'s `middleware.ts` (only `middleware.ts` differs from the portal branch).
- **Indentation is inconsistent**: `src/app/*/page.tsx` (guides), `config/`, `middleware.ts` use **4-space**; root `layout.tsx`/`page.tsx` use **2-space**. Match the file you're editing.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code in this project.
- Follow ALL rules exactly as documented. When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge during implementation.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when the technology stack or design system changes.
- Review periodically and remove rules that become obvious over time.

Last Updated: 2026-07-11
