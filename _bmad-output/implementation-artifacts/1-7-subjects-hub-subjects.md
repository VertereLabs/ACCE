---
baseline_commit: ea951b998464b36a3a201a3a32b0198297eedb90
---

# Story 1.7: Subjects hub (`/subjects`)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor or crawler,
I want one indexable hub that introduces the four subjects and two qualifications and routes to each dedicated page,
so that there is a single entry point that distributes visitors and ranking authority to the spokes and hubs.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/subjects` renders a **server component** that mirrors the DONE sibling shell exactly: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"Subjects We Tutor"** (from CAP-1 / epic AC). All other headings are `<h2>`/`<h3>` with no level skips.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the `/cta-tutor` / homepage `metadata` shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`), with:
   - `title`: `Subjects We Tutor — Accounting, Tax, Audit & FM | ACCE` (from CAP-1). **NOTE: this title contains ONE em dash.** Unlike the CAP-6/CAP-7 qualification-hub titles, this em dash is **NOT a sanctioned exception** — see Dev Note "Title em dash: replace with a colon (no sanctioned exception here)". Use the **colon variant**: `Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE` (~52 chars, ≤ ~60). The whole page is em-dash-free.
   - `description`: the CAP-1 catalog meta with its single em dash replaced by a **colon** to satisfy NFR6 (see Dev Note "Meta description: em dash replaced with a colon"): `Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing: for undergrad, PGDA and CTA students.` (~140 chars, ≤ ~155). Every other word preserved.
   - `alternates.canonical`: `"/subjects/"` (relative path; `metadataBase` is set globally in `layout.tsx`, so canonical stays relative — do NOT make it absolute).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror the `/cta-tutor` page / homepage `metadata`; OG/Twitter `title` uses the SAME colon variant — there is NO em dash anywhere on this page).

3. **(AC3 — substantive hub content, NOT a thin index)** The page follows the CAP-1 outline and reads as **substantive hub content, not a bare link list**, across these H2 sections:
   - **Intro / who we help** — a short lead paragraph on who ACCE helps (undergrad → PGDA → CTA students across South Africa) and what this page is (the single entry point to every subject and qualification). This is the H1 hero copy + intro.
   - **The four subjects we tutor** — a four-card grid; each card names the subject as a `<Link>` to its spoke and gives a **one-line** description (NOT a deep re-explanation — the spoke pages own the depth). Financial Accounting → `/accounting-tutor`, Taxation → `/tax-tutor`, Management Accounting & Finance (MAF) → `/financial-management-tutor`, Auditing → `/auditing-tutor`.
   - **The qualifications we support** — a short section routing to the two qualification hubs: CTA (`/cta-tutor`) and PGDA (`/pgda-tutor`), framed as "which qualification are you studying toward" (the hub-level counterpart to the subject cards). Each links out.
   - **Group vs 1:1 (how it works)** — the CAP-1 "group vs 1:1" beat: a short comparison of one-on-one and small-group sessions, all online across SA.
   - **CTA (final)** — a WhatsApp/book call to action.
   - **(Optional) FAQ** — a short FAQ is NOT required by CAP-1 for this page; if authored, it is em-dash-free. It is **not** an AC requirement (unlike the spoke/hub stories) — do not add one purely to inflate length.
   **Content-depth target:** aim for **~450–650 words** of genuine hub-level copy (intro + qualifications framing + group-vs-1:1 + CTA); the four subject cards are one-line link-outs. Do NOT pad toward 900 words by re-explaining each subject in depth — that would duplicate spoke content and create the exact near-duplicate/doorway risk NFR1 forbids (see Dev Note "Content depth: substantive, not thin, but not a doorway"). It weaves South African context (CA(SA), SAICA, PGDA, CTA, undergrad → PGDA → CTA pathway; UNISA/UCT/Wits/UJ/UP/Stellenbosch where natural) for E-E-A-T (NFR3). It contains **zero em-dash (`—`) characters** anywhere (title, meta, H1, body, any FAQ, JSON-LD). En dashes in numeric ranges (e.g. `24–48h`) are allowed but not needed.

4. **(AC4 — structured data: BreadcrumbList)** Valid **`BreadcrumbList`** JSON-LD is injected via `<Script id="subjects-jsonld-breadcrumb" type="application/ld+json">{JSON.stringify(BREADCRUMB_DATA)}</Script>` (import `Script` from `next/script`), matching the layout's and siblings' injection pattern. **This is the ONLY schema for this page** (CAP-1 assigns BreadcrumbList only — NOT Course, NOT Service, NOT FAQPage). Shape (see Dev Note "BreadcrumbList JSON-LD: exact shape"):
   ```
   { "@context": "https://schema.org", "@type": "BreadcrumbList",
     "itemListElement": [
       { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://accetutors.co.za/" },
       { "@type": "ListItem", "position": 2, "name": "Subjects", "item": "https://accetutors.co.za/subjects/" }
     ] }
   ```
   BreadcrumbList `item` URLs are **absolute** (schema.org requirement for breadcrumb items — this differs from `alternates.canonical`, which stays relative). Use the same origin `https://accetutors.co.za` already hard-coded in `layout.tsx`'s Organization/@id graph.

5. **(AC5 — outbound links)** The page links out to **all four subject spokes** (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`) **and both qualification hubs** (`/cta-tutor`, `/pgda-tutor`), using `next/link` `<Link>`. Per CAP-1 "Links out: all 4 subject spokes, `/cta-tutor`, `/pgda-tutor`" and the internal-link matrix (`/subjects` row: all four spokes + both hubs). All six sibling routes already exist and are DONE, so there is no unbuilt-link concern. `/subjects` does NOT link to itself.

6. **(AC6 — dual-mode + design-system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (`text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. Decorative icons carry `aria-hidden="true"`. The footer stays dark navy in both modes (inherent to `<Footer/>`, do not alter). Content max-width ~1160px (`container mx-auto px-6`, `max-w-4xl` blocks); grids collapse to one column under `md`.

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended with a `SubjectsPage` `describe` that renders the page and asserts (a) the single H1 via `getByRole("heading", { name: /^Subjects We Tutor$/i, level: 1 })` (use `level: 1` and an anchored regex so it does not match an H2/H3 that also contains "Subjects"), (b) a representative outbound link to a spoke (`a[href="/accounting-tutor"]` is not null), and (c) the primary WhatsApp CTA (`a[href="https://wa.me/27713255295"]` count > 0). The existing suite stays green. **Do NOT edit `sitemap.ts`** — sitemap registration and the e2e route-200 coverage land in **Story 1.8**.

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/subjects/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match `/cta-tutor/page.tsx` and the DONE sibling pages, not the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden="true"`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`). Mirror the `/cta-tutor` hero pattern (a badge pill or two is fine, e.g. "CA(SA) Tutoring" / "Undergrad → CTA").
  - [x] Export `metadata` per AC2: `title` = **colon variant** (NO em dash — this page has no sanctioned exception), `description` = colon variant, OG/Twitter mirror the colon-variant title/description, canonical `"/subjects/"` (relative).
- [x] **Task 2 — Author the substantive hub content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "Subjects We Tutor". All other headings `<h2>`/`<h3>`.
  - [x] Write ~450–650 words of genuine hub-level copy across the CAP-1 outline (intro/who-we-help → four subject cards → qualifications we support → group vs 1:1 → final CTA). Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first, been-there mentorship); plain terms (PGDA, CTA, CA(SA), IFRS); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] **Four subject cards**: each subject name is a `<Link>` to its spoke with a ONE-LINE description only (Financial Accounting → `/accounting-tutor`, Taxation → `/tax-tutor`, Management Accounting & Finance (MAF) → `/financial-management-tutor`, Auditing → `/auditing-tutor`). Consider a `const SUBJECTS = [{name, href, blurb}, …]` inline array mapped into the card grid (mirrors the sibling card-grid pattern; keeps content in one place).
  - [x] **Qualifications section**: link out to both hubs — CTA (`/cta-tutor`) and PGDA (`/pgda-tutor`) — with a one-line framing each ("studying toward the CTA / PGDA"). This satisfies the two-hub half of AC5.
  - [x] **Group vs 1:1**: a short comparison (1:1 personalised vs small-group shared-topic, all online across SA).
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">`. Secondary actions use `default`/`ghost`/`heroOutline`/`outline`.
  - [x] **Zero em dashes** anywhere in the file (title, meta, H1, body, any FAQ, JSON-LD). En dashes in numeric ranges are allowed but not needed.
- [x] **Task 3 — Inject BreadcrumbList JSON-LD** (AC: 4)
  - [x] Define `const BREADCRUMB_DATA` exactly per AC4 (Home → Subjects, absolute `item` URLs, origin `https://accetutors.co.za`).
  - [x] Inject as ONE `<Script id="subjects-jsonld-breadcrumb" type="application/ld+json">{JSON.stringify(BREADCRUMB_DATA)}</Script>` block (mirror the `/cta-tutor/page.tsx` Script pattern; CSP already permits this inline pattern). **Do NOT add Course/Service/FAQPage JSON-LD** — CAP-1 assigns BreadcrumbList only.
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, `import SubjectsPage from "@/app/subjects/page";` (add next to the other tutor-page imports) and add a `describe("SubjectsPage renders", …)` with the three assertions in AC7: H1 `getByRole("heading", { name: /^Subjects We Tutor$/i, level: 1 })`, `a[href="/accounting-tutor"]` not null, WhatsApp count > 0.
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — no NEW errors in the new page or the test (pre-existing `.next/types/validator.ts` stale-cache errors are unrelated; see 1.1–1.6 Debug Log).
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new `SubjectsPage` assertions. The `sitemap.test.ts` failures for the new-and-existing Epic-1 routes are **pre-existing by-design failures deferred to Story 1.8** — not a regression for this story.
  - [x] Grep the new file for `—` (em dash): the result must be **ZERO** hits (this page has no sanctioned exception, unlike `/cta-tutor`, `/tax-tutor`, `/pgda-tutor`). Confirm word count reads substantive (~450–650) without re-explaining spoke content.

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/subjects/page.tsx` — the Subjects hub (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-1]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link + WhatsApp assertion for the new page. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2), `next.config.ts`, `src/middleware.ts`, `src/config/guides.ts`, the DONE sibling `/cta-tutor`, `/pgda-tutor`, and four spoke pages (do not modify).

### The template to mirror (read this first)
- **`/cta-tutor` page (Story 1.1, DONE)** — `acce-nextjs/src/app/cta-tutor/page.tsx` is the **direct structural template** for this story: the same shell (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → `Footer`), the same hero (badge pills + intro + hero CTA), the same four-subject card grid with `<Link>` per subject, the same `variant="hero"` WhatsApp CTA convention, and the same `<Script type="application/ld+json">` injection pattern. Copy its STRUCTURE; change the SCHEMA to **BreadcrumbList** (single block, not Course+FAQPage) and the CONTENT to hub framing (route-to-subjects-and-qualifications, not a qualification deep-dive). [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Metadata shape** — `src/app/page.tsx` and `/cta-tutor/page.tsx` show the exact `Metadata` object shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path (`"/subjects/"`). [Source: acce-nextjs/src/app/cta-tutor/page.tsx#metadata; acce-nextjs/src/app/layout.tsx (metadataBase)]
- **JSON-LD injection** — `/cta-tutor/page.tsx` shows the `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` pattern to replicate (this page needs exactly ONE such block for BreadcrumbList). [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Subject naming → spoke mapping** — Financial Accounting → `/accounting-tutor`, Management Accounting and Finance (MAF) → `/financial-management-tutor`, Taxation → `/tax-tutor`, Auditing → `/auditing-tutor`. [Source: acce-nextjs/src/app/cta-tutor/page.tsx (four-subjects grid); page-catalog.md#CAP-1]

### BreadcrumbList JSON-LD: exact shape (this page's distinctive requirement)
This is the **first BreadcrumbList schema on the site** — there is no in-repo precedent (the `src/components/ui/breadcrumb.tsx` component is an unrelated visual UI primitive, NOT structured data). Author the schema exactly as in AC4: a two-item trail, Home (`/`) → Subjects (`/subjects/`), with **absolute** `item` URLs at origin `https://accetutors.co.za`. schema.org requires BreadcrumbList `item` URLs to be absolute; this deliberately differs from `alternates.canonical`, which stays relative because `metadataBase` resolves it. Only ONE `<Script>` block. Do not add Course/Service/FAQPage. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-1; schema.org/BreadcrumbList; acce-nextjs/src/app/layout.tsx (origin already hard-coded)]

### Content depth: substantive, not thin, but not a doorway (NFR1)
CAP-1 deliberately does NOT pin the 700–900-word floor to `/subjects` (that floor is stated per-page for the six spokes/hubs; the CAP-1 row lists an outline only and the epic AC says "reads as substantive, not a thin index"). A hub's job is **distribution**, not depth: the four spoke pages and two hub pages own the deep content, and re-explaining them here would create near-duplicate/doorway content (the exact NFR1 scaled-content risk). Target **~450–650 words** of genuine hub-level framing (who we help, qualifications routing, group-vs-1:1, CTA), with the four subjects as ONE-LINE link-out cards. Do not pad toward 900 by duplicating spoke prose. "Substantive not thin" is satisfied by real hub framing well under 900 words. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-1; _bmad-output/planning-artifacts/epics.md#Story 1.7; #Epic 1 NFR1]

### Title em dash: replace with a colon (NO sanctioned exception here) (NFR6)
The CAP-1 title `Subjects We Tutor — Accounting, Tax, Audit & FM | ACCE` contains one em dash. **Unlike** the CAP-6 (`/cta-tutor`) and CAP-7 (`/pgda-tutor`) qualification-hub titles — which were pinned VERBATIM with their em dash as the single sanctioned exception per page — `/subjects` has **no sanctioned em-dash exception**. Follow the `/auditing-tutor` (Story 1.5) treatment: the WHOLE page is em-dash-free. Replace the title em dash with a **colon**: `Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE` (~52 chars). Grep the finished file for `—`: expected result is **ZERO** hits (title + OG + Twitter titles all use the colon variant, and body/meta/JSON-LD carry none). [Source: _bmad-output/implementation-artifacts/1-5-auditing-subject-spoke-auditing-tutor.md#Title (no sanctioned exception); _bmad-output/project-context.md#Content & editorial rules; sprint-status.yaml 1-5 note]

### Meta description: em dash replaced with a colon (NFR6)
The CAP-1 catalog meta is `Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing — for undergrad, PGDA and CTA students.`. Replace the single em dash with a **colon**, preserving every other word: `Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing: for undergrad, PGDA and CTA students.` (~140 chars, ≤ ~155). Same house rule applied in Stories 1.2–1.6. Note the `&` in "Management Accounting & Finance" is an ampersand, not an em dash, and is fine. [Source: _bmad-output/implementation-artifacts/1-6-pgda-qualification-hub-pgda-tutor.md#Meta description; _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-1]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-accent/10`, `bg-accent/20`, `bg-accent/30`, `bg-muted`) which map to `hsl(var(--token))`. No new hue, no third accent, no hardcoded colors. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes — rely on tokens so both modes work. [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; use `container mx-auto px-6` and `max-w-4xl` blocks; grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This is a server component with no client state anyway. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). Exactly one gold `variant="hero"` CTA per view group. [Source: acce-nextjs/src/app/cta-tutor/page.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars (~52); meta `description` ≤ ~155 chars (~140); page-appropriate JSON-LD present and valid (**BreadcrumbList only**). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. Follow the existing `CtaTutorPage`/`PgdaTutorPage` describe blocks as the template; use `level: 1` and an anchored regex `/^Subjects We Tutor$/i` on the H1 assertion so it does not match an H2/H3 that also contains "Subjects" (mirrors the `AuditingTutorPage`/`PgdaTutorPage` pattern). [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/subjects` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]

### Previous-story intelligence (1.1–1.6, all DONE)
- Every prior Epic-1 page mirrors the `/cta-tutor` shell exactly and injects JSON-LD via `<Script type="application/ld+json">`. This page follows the same shell but with a **single BreadcrumbList block** instead of Course/Service+FAQPage. [Source: 1-1…1-6 Completion Notes]
- The em-dash house rule is settled: titles with a pinned catalog em dash on the two QUALIFICATION hubs (CAP-6/CAP-7) keep it as the single sanctioned exception; every other page (including subject spokes and THIS subjects hub) is fully em-dash-free with catalog em dashes swapped to colons. `/subjects` is a fully-clean page like `/auditing-tutor`. [Source: 1-2…1-6 Dev Notes; sprint-status.yaml 1-5 note]
- Reviews **dismissed word-count observations** where genuine content over/under a target was real (not padding). For this hub the target is intentionally lower (~450–650) — a substantive hub, not a 900-word doorway. [Source: 1-2/1-3/1-4 Review Findings; this story Dev Note "Content depth"]
- The `sitemap.test.ts` failure for a newly-added route is **by-design deferred to Story 1.8** — not a regression for this story. [Source: sprint-status.yaml notes; 1-1…1-6]
- `tsc --noEmit` surfaces **pre-existing** `.next/types/validator.ts` errors from stale build cache — unrelated; only NEW errors in the new page/test count. [Source: 1-1 Debug Log References]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/subjects/page.tsx` per App-Router convention and the CAP-1 route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- Additive-only / no-regression: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`; do not modify the DONE sibling pages. [Source: _bmad-output/project-context.md#Additive-only]
- **Optional (out of scope):** the catalog suggests a shared marketing `layout.tsx`. Do NOT introduce it here — keep mirroring the per-page Navbar/Footer pattern (lowest-risk, matches all six DONE Epic-1 pages). [Source: acce-nextjs/src/app/cta-tutor/page.tsx (Story 1.1 Dev Note)]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.7: Subjects hub (`/subjects`); #FR1]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-1 · /subjects — Subjects hub; #Internal-link matrix (CAP-9)]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/cta-tutor/page.tsx] (direct structural template: shell, card grid, hero CTA, Script injection)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase, absolute origin `https://accetutors.co.za`)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend; `level: 1` anchored-regex H1 assertion)
- [Source: _bmad-output/implementation-artifacts/1-6-pgda-qualification-hub-pgda-tutor.md] (previous story; em-dash house rule, hub link-out pattern)
- [Source: _bmad-output/implementation-artifacts/1-5-auditing-subject-spoke-auditing-tutor.md] (fully em-dash-free page precedent, no sanctioned exception)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `tsc --noEmit`: no new errors in subjects/page.tsx or render-smoke.test.tsx. Pre-existing `.next/types/validator.ts` stale-cache errors are unrelated (documented in 1.1-1.6 Debug Logs).
- `vitest run`: 27/27 render-smoke green; sitemap.test.ts 3 failures are pre-existing by-design (deferred to Story 1.8); 39/42 total green (3 sitemap failures expected).
- Em-dash grep: 0 hits in subjects/page.tsx (no sanctioned exception; fully clean page like /auditing-tutor).
- Word count: ~459 prose words (hero intro + four-subject cards intro + qualifications framing + group-vs-1:1 + CTAs). Within ~450-650 hub target. No subject depth re-explained (spokes own depth).
- BreadcrumbList JSON-LD: single Script block, two-item trail (Home/Subjects), absolute item URLs at https://accetutors.co.za.
- Outbound links: all 4 spokes + both hubs confirmed via grep (hrefs in SUBJECTS and QUALIFICATIONS const arrays).

### Completion Notes List

- All 5 tasks complete. Implemented `acce-nextjs/src/app/subjects/page.tsx` as a server component following the /cta-tutor structural template (same shell, hero badge pattern, card grid, conversion CTA).
- Schema: BreadcrumbList ONLY (first BreadcrumbList on the site; not Course/Service/FAQPage). Two-item trail: Home (`https://accetutors.co.za/`) → Subjects (`https://accetutors.co.za/subjects/`). Absolute item URLs per schema.org requirement.
- Title: colon variant `Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE` (52 chars, no em dash, no sanctioned exception). OG/Twitter mirror identical colon variant. Whole page em-dash-free (grep 0).
- Content: ~459 prose words of genuine hub-level framing (intro/who-we-help, four subject cards as one-line link-outs, qualifications routing, group-vs-1:1, CTAs). No FAQ section (optional per AC3; not needed). No spoke content re-explained.
- `const SUBJECTS` and `const QUALIFICATIONS` arrays map all 6 outbound links (4 spokes + 2 hubs) into card grids.
- Render-smoke extended with `describe("SubjectsPage renders")`: 3 assertions (H1 level:1 anchored regex, `/accounting-tutor` link, WhatsApp CTA count).

### File List

- acce-nextjs/src/app/subjects/page.tsx (NEW)
- acce-nextjs/tests/unit/render-smoke.test.tsx (UPDATED: +import SubjectsPage, +3 assertions)
- _bmad-output/implementation-artifacts/1-7-subjects-hub-subjects.md (UPDATED: tasks, status, dev record)
- _bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED: 1-7 status → review)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (UPDATED: dev-story decisions appended)

## Change Log

- 2026-07-11: Implemented `/subjects` hub page. Created `acce-nextjs/src/app/subjects/page.tsx` (server component, BreadcrumbList JSON-LD, 4-subject + 2-qualification card grids, group-vs-1:1 section, WhatsApp CTAs). Extended render-smoke suite with 3 SubjectsPage assertions. All 27 render-smoke tests green; 0 em dashes; zero sitemap.ts changes (deferred to Story 1.8).
