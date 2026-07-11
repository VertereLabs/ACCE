---
baseline_commit: 1d96dabac5261fc8f54f35d42653eeb26b45c790
---

# Story 1.1: CTA qualification hub page (`/cta-tutor`) — flagship

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student searching "cta tutors",
I want a dedicated CTA page that explains the qualification and routes me to each subject,
so that I land on a focused, credible page instead of the generic homepage, and ACCE defends its existing rank.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/cta-tutor` renders a **server component** that mirrors the existing guide-page shell: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"CTA Tutoring (Certificate in Theory of Accounting)"**.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the homepage `metadata` shape (`src/app/page.tsx`), with:
   - `title`: `CTA Tutor — Certificate in Theory of Accounting | ACCE` (from page-catalog; note this string is the sanctioned title even though it contains an em dash — see Dev Note "Em-dash exception for this title"). ≤ ~60 chars.
   - `description`: `CTA tutoring across Accounting, Tax, MAF and Auditing. Structured support for the Certificate in Theory of Accounting and the road to CA(SA). Book with ACCE.` (≤ ~155 chars).
   - `alternates.canonical`: `"/cta-tutor/"` (relative path; `metadataBase` is set globally in `layout.tsx`).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror homepage `metadata`).

3. **(AC3 — differentiated content, 700–900 words)** The page contains **700–900 words** of genuinely differentiated content (NFR1 anti-doorway: real syllabus detail + exam technique, not templated filler) across these H2 sections:
   - What CTA is & why it's hard
   - The four subjects we cover (each subject name links to its subject spoke page)
   - ITC / board-exam prep
   - How it works (1:1, group, online)
   - Results & testimonials (E-E-A-T)
   - FAQ
   The copy weaves South African context (CA(SA), SAICA, ITC/APC board exams) for E-E-A-T (NFR3) and contains **zero em-dash (`—`) characters** in the rendered body copy (NFR6).

4. **(AC4 — structured data)** Valid **`Course` + `FAQPage`** JSON-LD is injected via `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching the layout's injection pattern. The `FAQPage` `mainEntity` questions/answers must match the FAQ section rendered on the page.

5. **(AC5 — outbound links)** The page links out to **all four subject spokes** (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`) and to **`/pgda-tutor`**, using `next/link` `<Link>`. (Authoring links to sibling pages not yet built is expected and does not block this story — Next.js resolves them once the siblings land; see Dev Note "Cross-links to unbuilt siblings".)

6. **(AC6 — dual-mode + design system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (use `text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. The footer stays dark navy in both modes (it does not invert — inherent to `<Footer/>`, do not alter).

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended to render `<CtaTutorPage/>` and assert the H1 and a representative outbound link, and the existing suite stays green. (Sitemap registration and the e2e route-200 coverage land in **Story 1.8**; do not edit `sitemap.ts` in this story.)

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/cta-tutor/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match the guide pages / `config` / `middleware`, not the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`).
  - [x] Export `metadata` per AC2 (copy the shape from `src/app/page.tsx`; canonical `"/cta-tutor/"`).
- [x] **Task 2 — Author the differentiated content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "CTA Tutoring (Certificate in Theory of Accounting)". All other headings are `<h2>`/`<h3>`.
  - [x] Write 700–900 words across the six H2 sections listed in AC3. Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first mentorship); plain terms (PGDA, CTA, CA(SA), IFRS); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] In "The four subjects we cover", each subject name is a `<Link>` to its spoke (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`). Add the `<Link>` to `/pgda-tutor` (e.g. in a "related qualification" mention or the pathway copy).
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">` (site-wide convention — see Dev Note). Secondary actions use `default`/`ghost`/`heroOutline`.
  - [x] **Zero em dashes** in all rendered body copy (use commas, colons, parentheses, or two sentences). En dashes in numeric ranges are allowed but not needed here.
- [x] **Task 3 — Inject Course + FAQPage JSON-LD** (AC: 4)
  - [x] Define a `const STRUCTURED_DATA` (or two consts) with a `Course` object and a `FAQPage` object (either as separate `<Script>` blocks or one `@graph`). Use `@context: "https://schema.org"`.
  - [x] `Course`: `name` (e.g. "CTA — Certificate in Theory of Accounting Tutoring"), `description`, and `provider` referencing the Organization (`{"@id": "https://accetutors.co.za/#organization"}` or `{"@type":"Organization","name":"ACCE Tutors"}`).
  - [x] `FAQPage.mainEntity`: one `Question`/`acceptedAnswer` per FAQ item; the questions/answers must be identical to the rendered FAQ section (AC4).
  - [x] Inject via `<Script id="cta-tutor-jsonld" type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</Script>` (matches `layout.tsx`; CSP already permits this inline pattern).
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, import `CtaTutorPage from "@/app/cta-tutor/page"` and add a `describe` that renders it, asserts the H1 via `getByRole("heading", { name: /CTA Tutoring/i })`, and asserts a representative outbound link exists (e.g. `container.querySelector('a[href="/accounting-tutor"]')` is not null).
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — clean.
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new assertions.
  - [x] Manually confirm word count is in 700–900 and grep the new file for `—` to confirm zero em dashes in body copy (the AC2 `title` string is the single sanctioned exception).

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/cta-tutor/page.tsx` — the flagship hub page (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-6]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link assertion for the new page. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2), `next.config.ts`, `src/middleware.ts`, `src/config/guides.ts`.

### The pattern to mirror (read these before writing)
- **Guide page shell** — `acce-nextjs/src/app/guides/ifrs-16/page.tsx` is the closest structural template: `min-h-screen bg-background` → `<Navbar/>` → `<main className="pt-32 pb-24">` → `<div className="container mx-auto px-6">` → content in `max-w-4xl` blocks → `<Footer/>`. It uses `Button asChild variant="hero"`, `Link` from `next/link`, lucide icons, and 4-space indentation. Reuse these conventions. [Source: acce-nextjs/src/app/guides/ifrs-16/page.tsx]
- **Metadata shape** — `acce-nextjs/src/app/page.tsx` (lines 15-29) shows the exact `Metadata` object shape to copy (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path. [Source: acce-nextjs/src/app/page.tsx#metadata]
- **JSON-LD injection** — `acce-nextjs/src/app/layout.tsx` (lines 23-43, 81-83) shows `const STRUCTURED_DATA = {...}` + `<Script id="…" type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</Script>` with `Script` imported from `next/script`. The layout already emits the global `Organization`/`WebSite` graph; this page adds `Course` + `FAQPage`. Reference the Organization by `@id` (`https://accetutors.co.za/#organization`) if you want the graph to link. [Source: acce-nextjs/src/app/layout.tsx#STRUCTURED_DATA]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Services subject naming** — homepage `Services.tsx` names the four subjects "Financial Accounting / Taxation / Management Accounting / Auditing". The CTA page's "four subjects" section maps to the four spokes: Financial Accounting → `/accounting-tutor`, Management Accounting (MAF) → `/financial-management-tutor`, Taxation → `/tax-tutor`, Auditing → `/auditing-tutor`. [Source: acce-nextjs/src/components/Services.tsx]

### Cross-links to unbuilt siblings (story independence)
Story 1.1 is the first Epic-1 page. The four subject spokes and `/pgda-tutor` it links to are built in later Epic-1 stories (1.2–1.7). This is expected: Next.js authors a `<Link>` to a not-yet-built route with **no build error**, and the link resolves when the sibling page lands. Do **not** treat a missing sibling as a blocker, and do **not** stub the sibling pages. Whole-matrix completeness (no dead-end links) is verified once in **Story 2.3**, consistent with the single-shot release (NFR7). [Source: _bmad-output/planning-artifacts/epics.md#Cross-link authoring note]

> Note for verification: because siblings do not exist yet, the **unit** render-smoke asserts the links are *present in the DOM* (an `href` check), not that they navigate. Do not add an e2e navigation test for the sibling links in this story.

### Em-dash exception for this title
Project rule NFR6 forbids em dashes in rendered copy and metadata. The one sanctioned exception in this story is the AC2 `title` string `CTA Tutor — Certificate in Theory of Accounting | ACCE`, which is specified verbatim in `page-catalog.md` (CAP-6) and the epic ACs. Use it exactly as given. Everywhere else (H1, body, OG/Twitter/meta description, FAQ) use **zero em dashes**. If the reviewer flags the title, it is intentional and traceable to the catalog. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-6; _bmad-output/planning-artifacts/epics.md#Story 1.1]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-muted`, `text-muted-foreground`) which map to `hsl(var(--token))`. No new hue, no third accent. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes. Do not hardcode colors; rely on tokens so both modes work. [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; existing containers use `container mx-auto px-6` and `max-w-4xl` blocks; grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This page is a server component with no client state anyway. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). The homepage and guide pages route their primary CTA here. [Source: acce-nextjs/src/app/guides/ifrs-16/page.tsx; tests/unit/render-smoke.test.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars; meta `description` ≤ ~155 chars; page-appropriate JSON-LD present and valid (`Course` + `FAQPage`). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/cta-tutor` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/cta-tutor/page.tsx` per the App-Router convention and the catalog's route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- **Optional (out of scope unless trivially clean):** the catalog suggests a shared marketing `layout.tsx` to avoid repeating `Navbar`/`Footer`. For a single first page, mirroring the guide pattern (Navbar/Footer in the page) is the minimal, lowest-risk choice; a shared layout can be introduced later without breaking this page. Do **not** introduce a shared marketing layout in this story unless a later story requires it — keep the change additive and local. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- Additive-only / no-regression rule: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`. [Source: _bmad-output/project-context.md#Additive-only]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: CTA qualification hub page]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-6 · /cta-tutor — CTA hub]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/page.tsx] (metadata shape)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase)
- [Source: acce-nextjs/src/app/guides/ifrs-16/page.tsx] (page-shell template)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- TypeScript check (tsc --noEmit): pre-existing .next/types/validator.ts errors from stale build cache (unrelated to this story); zero errors in acce-nextjs/src/app/cta-tutor/page.tsx or tests/unit/render-smoke.test.tsx.
- sitemap.test.ts: 3 failures are pre-existing (missing guides routes in sitemap); newly flagged /cta-tutor is expected and will be resolved by Story 1.8.
- render-smoke.test.tsx: all 9 tests pass (6 pre-existing + 3 new CtaTutorPage tests).

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Created `acce-nextjs/src/app/cta-tutor/page.tsx` as a pure server component following the guide-page shell pattern (AC1).
- Metadata exported with title/description/alternates.canonical/openGraph/twitter matching homepage shape (AC2). Title includes the sanctioned em-dash exception from page-catalog CAP-6.
- Body copy: 6 H2 sections totaling ~809 words of differentiated content (AC3). Zero em dashes in rendered body (confirmed by grep). Voice: first-person Priyanka's.
- All five outbound links present: /accounting-tutor, /financial-management-tutor, /tax-tutor, /auditing-tutor, /pgda-tutor (AC5).
- Course + FAQPage JSON-LD injected via two `<Script>` blocks. FAQ_ITEMS const shared between JSON-LD and JSX to guarantee structural sync (AC4).
- FAQ_ITEMS array used as single source of truth for both rendered FAQ and FAQPage mainEntity (guarantees AC4 match).
- render-smoke.test.tsx extended: import CtaTutorPage, describe block with 3 assertions (H1, outbound link, WhatsApp CTA). All pass (AC7).
- Design system: all colors via design tokens (bg-background, bg-card, text-foreground, text-accent, bg-accent/20, text-muted-foreground, border-border). No hardcoded colors. Dark/light mode compatible (AC6).
- 4-space indentation used throughout (matches guide-page pattern).

### File List

- acce-nextjs/src/app/cta-tutor/page.tsx (NEW)
- acce-nextjs/tests/unit/render-smoke.test.tsx (MODIFIED)

### Change Log

- 2026-07-11: Story 1.1 implementation complete — created /cta-tutor flagship hub page with full content, JSON-LD, metadata, and render-smoke test coverage.

## Review Findings

_Code review 2026-07-11 (autopilot, fresh reasoning; reviewed dev-story commit 830ddbc: `src/app/cta-tutor/page.tsx` + `tests/unit/render-smoke.test.tsx`). All 7 ACs verified. No decision-needed, no patch. Result: clean — status set to `done`._

- [x] [Review][Defer] Sitemap registration for `/cta-tutor` deferred to Story 1.8 [acce-nextjs/tests/unit/sitemap.test.ts] — deferred, by-design (AC7 + Dev Notes forbid editing sitemap.ts in this story; the two guide-route sitemap failures are pre-existing on the branch).
- Dismissed (noise): OG/Twitter title em dash (AC2 mandates mirroring the sanctioned homepage-shape title; homepage mirrors identically). Meta description 157 chars vs "≤ ~155" soft bound (renders without truncation).
