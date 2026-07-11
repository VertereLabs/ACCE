---
baseline_commit: 179ff2cf8515e869a23f90fd043a088d8e9e2e51
---

# Story 1.4: Tax subject spoke (`/tax-tutor`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student searching "tax tutor" or "taxation tutor",
I want a dedicated taxation page,
so that I reach focused tax-tutoring content.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/tax-tutor` renders a **server component** that mirrors the shell used by Story 1.1's `/cta-tutor`, Story 1.2's `/accounting-tutor`, and Story 1.3's `/financial-management-tutor` pages and the guide pages: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"Taxation Tutoring for PGDA & CTA"**.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the homepage `metadata` shape (`src/app/page.tsx`) and the `/accounting-tutor` page, with:
   - `title`: `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors` (from page-catalog CAP-4 / epic AC, pinned **verbatim**; this string contains **one em dash** which is the **single sanctioned em-dash exception** for this page — see Dev Note "Title em-dash: the single sanctioned exception"). **49 chars** (≤ ~60).
   - `description`: `Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.` (the CAP-4 catalog meta with its single em dash replaced by a **colon** to satisfy NFR6 — see Dev Note "Meta description: em dash replaced with a colon"; every other word preserved). **~135 chars** (≤ ~155).
   - `alternates.canonical`: `"/tax-tutor/"` (relative path; `metadataBase` is set globally in `layout.tsx`).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror the `/accounting-tutor` page / homepage `metadata`; the OG/Twitter `title` mirrors the sanctioned em-dash `title` identically — this is expected, not a violation, per Story 1.1 precedent).

3. **(AC3 — differentiated content, 700–900 words)** The page contains **700–900 words** of genuinely differentiated content (NFR1 anti-doorway: real taxation syllabus detail + exam technique, not a reworded clone of the `/accounting-tutor`, `/financial-management-tutor` or `/cta-tutor` pages) across these H2 sections (from CAP-4 / epic):
   - What we cover (Income Tax Act, corporate tax, VAT, estate duty, CGT)
   - Who it's for
   - How it works
   - Why ACCE
   - CTA
   - FAQ
   The copy weaves South African context (CA(SA), SAICA, ITC/APC board exams, and at least one of UNISA/UCT/Wits/UJ/UP/Stellenbosch) for E-E-A-T (NFR3) and contains **zero em-dash (`—`) characters** anywhere in the rendered body copy and in the meta description (NFR6). It naturally targets the CAP-4 secondary keywords: **taxation tutor, tax tutor south africa, income tax act tutor** (do not keyword-stuff; work them into headings and prose).

4. **(AC4 — structured data)** Valid **`Service` + `FAQPage`** JSON-LD is injected via `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching the `/accounting-tutor` and `layout.tsx` injection pattern. The `Service` object references the Organization by `@id` (`{"@id": "https://accetutors.co.za/#organization"}`) as `provider`. The `FAQPage` `mainEntity` questions/answers must be rendered from the **same const array** as the on-page FAQ section so they match exactly.

5. **(AC5 — outbound links)** The page links out to **`/cta-tutor`**, **`/pgda-tutor`**, and **`/subjects`**, using `next/link` `<Link>`. (Authoring links to sibling pages not yet built is expected and does not block this story — Next.js resolves them once the siblings land; see Dev Note "Cross-links to unbuilt siblings".) `/tax-tutor` has **no** IFRS-guide edge in the matrix (that edge belongs only to `/accounting-tutor`), so there are no guide links to author or defer here.

6. **(AC6 — dual-mode + design system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (use `text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. The footer stays dark navy in both modes (it does not invert — inherent to `<Footer/>`, do not alter).

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended to render `<TaxTutorPage/>` and assert the H1 and a representative outbound link (e.g. `/cta-tutor`) plus the WhatsApp CTA, and the existing suite stays green. (Sitemap registration and the e2e route-200 coverage land in **Story 1.8**; do not edit `sitemap.ts` in this story.)

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/tax-tutor/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match `/accounting-tutor`, `/financial-management-tutor`, `/cta-tutor` pages, guide pages, `config`, `middleware` — NOT the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden="true"`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`). Mirror `src/app/accounting-tutor/page.tsx` structure.
  - [x] Export `metadata` per AC2 (copy the shape from `src/app/accounting-tutor/page.tsx`; canonical `"/tax-tutor/"`; the pinned-verbatim em-dash `title` and the colon-not-em-dash `description` exactly as given in AC2). The `title` (and its OG/Twitter mirrors) keeps its em dash; the `description` does NOT.
- [x] **Task 2 — Author the differentiated taxation content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "Taxation Tutoring for PGDA & CTA". All other section headings are `<h2>`; card/sub-headings are `<h3>` (no heading-level skips).
  - [x] Write 700–900 words across the six H2 sections listed in AC3. Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first mentorship); plain terms (PGDA, CTA, CA(SA), VAT, CGT); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] Content specifics to make it genuinely differentiated (NFR1, not a doorway clone of the sibling spokes): keep the focus on **Taxation as its own subject** — **the Income Tax Act (No. 58 of 1962)** framework (gross income definition, special inclusions, general and specific deductions, the general deduction formula), **individual/personal tax** (employment income, fringe benefits, retirement fund contributions, medical tax credits, provisional tax), **corporate tax** (taxable income of companies, dividends tax, assessed losses), **VAT** (the VAT Act, output vs input tax, zero-rated vs exempt supplies, registration thresholds), **Capital Gains Tax** (the Eighth Schedule, base cost, exclusions, the inclusion rate), and **estate duty / donations tax** (the Estate Duty Act, deemed property, the section 4A abatement). This is distinct from Financial Accounting (`/accounting-tutor` = IFRS/consolidations), from MAF (`/financial-management-tutor` = costing/budgeting/corporate finance), and from the four-subject `/cta-tutor` hub. Do NOT reuse the IFRS/consolidations or costing narratives.
  - [x] Weave SA E-E-A-T context: SARS as the administering authority, the Income Tax Act / VAT Act / Estate Duty Act by name, CA(SA), SAICA, ITC/APC board exams, and at least one SA university (UNISA TAX modules, UCT, Wits, UP, Stellenbosch). Tax is examined in the ITC and, at applied/integrated depth, in the APC — a genuine E-E-A-T point you can mention. (NFR3)
  - [x] "Who it's for": cover the ladder so an undergrad taxation student, a PGDA student, and a CTA-level student all see themselves (undergrad tax modules → PGDA taxation depth → CTA integration under exam pressure).
  - [x] Outbound links (AC5): add `<Link href="/cta-tutor">`, `<Link href="/pgda-tutor">`, and `<Link href="/subjects">` in natural context (e.g. a "where this fits" / related-pages block, mirroring how `/accounting-tutor` did it around lines 262–278). There are **no** IFRS-guide links for this page.
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">` (site-wide convention). Secondary actions use `default`/`ghost`/`heroOutline`.
  - [x] **Zero em dashes** in all rendered body copy AND in the meta description (use commas, colons, parentheses, or two sentences). The `title` string is the single sanctioned exception (see Dev Note). En dashes in numeric ranges (e.g. "24–48h") are allowed but not needed here.
- [x] **Task 3 — Inject Service + FAQPage JSON-LD** (AC: 4)
  - [x] Define a `const FAQ_ITEMS` array (question/answer objects) and render BOTH the on-page FAQ section and the `FAQPage.mainEntity` from it (single source of truth — guarantees AC4 match). Mirror the `/accounting-tutor` `FAQ_ITEMS` + `FAQPAGE_DATA` pattern. Author taxation-specific questions (e.g. the general deduction formula, provisional tax, VAT input-vs-output confusion, CGT base cost, "is tax the same in the ITC and APC", which Act governs what).
  - [x] Define `const SERVICE_DATA` with `@context: "https://schema.org"`, `@type: "Service"`, `name` (e.g. "Taxation Tutoring"), `serviceType`/`description`, `areaServed: "South Africa"`, and `provider: { "@id": "https://accetutors.co.za/#organization" }`.
  - [x] Inject via two `<Script id="tax-tutor-jsonld-service" type="application/ld+json">` and `<Script id="tax-tutor-jsonld-faq" type="application/ld+json">` blocks (matches `layout.tsx`; CSP already permits this inline pattern).
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, import `TaxTutorPage from "@/app/tax-tutor/page"` and add a `describe("TaxTutorPage renders", …)` block (mirror the existing `AccountingTutorPage` / `FinancialManagementTutorPage` blocks) that: renders it, asserts the H1 via `getByRole("heading", { name: /Taxation Tutoring for PGDA/i })`, asserts a representative outbound link exists (e.g. `container.querySelector('a[href="/cta-tutor"]')` is not null), and asserts the WhatsApp CTA (`a[href="https://wa.me/27713255295"]`) is present.
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — no NEW errors in the new page or the test file (pre-existing `.next/types` / stale-cache errors unrelated to this story are acceptable; see Story 1.1/1.2/1.3 Debug Log).
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new assertions. (Note: `sitemap.test.ts` has pre-existing failures for unregistered routes; `/tax-tutor` being newly flagged there is EXPECTED and resolved by Story 1.8 — do not fix it here.)
  - [x] Manually confirm word count is in the 700–900 spirit (real, differentiated taxation content; do not pad or trim genuine syllabus detail purely to hit a number — see Story 1.2/1.3 review, which dismissed the upper-bound overrun) and grep the new file for `—` to confirm the **only** em dash in the file is the sanctioned `title` string (body AND meta description must have zero em dashes).

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/tax-tutor/page.tsx` — the Taxation subject spoke (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-4]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link + WhatsApp assertion block for the new page (mirror the existing `AccountingTutorPage` / `FinancialManagementTutorPage` blocks). [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2), `src/config/guides.ts` + `src/middleware.ts` (Epic 3), `next.config.ts`. All are out of scope; touching them is scope creep / regression risk (NFR4).

### The pattern to mirror (read these before writing)
- **`/accounting-tutor` page (Story 1.2, DONE)** — `acce-nextjs/src/app/accounting-tutor/page.tsx` is the closest structural template for this page: same imports, same shell (`min-h-screen bg-background` → `<Navbar/>` → `<main className="pt-32 pb-24">` → `<div className="container mx-auto px-6">` → `max-w-4xl` content blocks → `<Footer/>`), same metadata shape, same `FAQ_ITEMS` const feeding both the rendered FAQ and `FAQPage` JSON-LD, same eyebrow-badge + icon-badge + card patterns, same `<Button asChild variant="hero">` WhatsApp CTA, same `Service` + `FAQPage` schema pair. **Copy its conventions; write different (taxation-focused) content.** Do NOT literally duplicate its copy — that would create the templated near-duplicate NFR1 forbids. The related-pages block near the bottom of `/accounting-tutor` (lines ~262–278) is the exact model for the three outbound links. [Source: acce-nextjs/src/app/accounting-tutor/page.tsx]
- **`/financial-management-tutor` page (Story 1.3, DONE)** — `acce-nextjs/src/app/financial-management-tutor/page.tsx` is the most recent sibling and the freshest example of the exact same "subject spoke" contract this story implements (Service+FAQPage, three outbound links, colon-not-em-dash meta). Consult it for the current house style. [Source: acce-nextjs/src/app/financial-management-tutor/page.tsx]
- **`/cta-tutor` page (Story 1.1, DONE)** — `acce-nextjs/src/app/cta-tutor/page.tsx` is the original template all later pages derive from AND the reference for the sanctioned em-dash `title` (its `title` also keeps a verbatim em dash). Consult it for the em-dash-title precedent and any convention that is unclear. [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Metadata shape** — `acce-nextjs/src/app/accounting-tutor/page.tsx` (lines 9–23) and `src/app/page.tsx` show the exact `Metadata` object shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path (`"/tax-tutor/"`). [Source: acce-nextjs/src/app/accounting-tutor/page.tsx#metadata; acce-nextjs/src/app/page.tsx#metadata]
- **JSON-LD injection** — `acce-nextjs/src/app/accounting-tutor/page.tsx` (lines 52–92) shows the `const …_DATA` + `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` pattern (`Script` from `next/script`), the `Service` object referencing the Organization by `@id`, and the `FAQPAGE_DATA` built by mapping `FAQ_ITEMS`. This page uses the **same `Service` + `FAQPage` pair** (CAP-4), so it is a direct copy of the 1.2/1.3 structure with taxation data. [Source: acce-nextjs/src/app/accounting-tutor/page.tsx#SERVICE_DATA,#FAQPAGE_DATA; acce-nextjs/src/app/layout.tsx]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Subject naming ↔ route map** — homepage `Services.tsx` names the four subjects "Financial Accounting / Taxation / Management Accounting / Auditing". This page IS the **"Taxation"** spoke → route `/tax-tutor`. The sibling routes it links context to: Financial Accounting → `/accounting-tutor`, Management Accounting → `/financial-management-tutor`, Auditing → `/auditing-tutor` (though this story's required outbound set is only `/cta-tutor`, `/pgda-tutor`, `/subjects`). [Source: acce-nextjs/src/components/Services.tsx; acce-nextjs/src/app/cta-tutor/page.tsx]

### CAP-4 catalog facts (target this page to these)
- **Primary kw:** tax tutor.
- **Secondary kw (weave naturally, no stuffing):** taxation tutor, tax tutor south africa, income tax act tutor.
- **Title (pinned verbatim):** `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors` (49 chars; keeps its em dash — the single sanctioned exception, see below).
- **Meta (em dash → colon):** `Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.` (~135 chars).
- **H1:** Taxation Tutoring for PGDA & CTA.
- **H2 outline (author to it):** What we cover (Income Tax Act, corporate tax, VAT, estate duty, CGT) · Who it's for · How it works · Why ACCE · CTA · FAQ.
- **Schema:** Service + FAQPage. **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects` (no IFRS-guide edge for this page).
[Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-4]

### Title em-dash: the single sanctioned exception (NFR6)
The CAP-4 catalog title AND the epic Story 1.4 AC both pin the title **verbatim** as `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors`, which contains one em dash. NFR6/project-context forbid em dashes in all rendered copy and metadata, but a title that the epic AC reproduces character-for-character is a pinned mandate. This exactly mirrors **Story 1.1** (`/cta-tutor`), whose verbatim-pinned `title` (`CTA Tutor — Certificate in Theory of Accounting | ACCE`) was declared and code-review-accepted as the "single sanctioned em-dash exception" for that page. Keep the tax title exactly as pinned; the OG/Twitter `title` mirror it identically (that is expected, not a second violation — Story 1.1's review dismissed the same OG/Twitter mirror as noise because AC2 mandates mirroring the sanctioned title). Every other string on this page — the meta description, all body copy, all FAQ text — must contain **zero** em dashes. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-4; _bmad-output/planning-artifacts/epics.md#Story 1.4; _bmad-output/implementation-artifacts/1-1-cta-qualification-hub-page-cta-tutor-flagship.md#Em-dash exception; autopilot-decisions.md 2026-07-11 CAP-4 title]

### Meta description: em dash replaced with a colon (NFR6)
The CAP-4 catalog meta is written as `Taxation tutoring for CA(SA) students — Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.` (with an em dash). NFR6 / project-context forbid em dashes in **all** metadata, and this story's AC3 requires zero em dashes in the meta description. The 1.4 AC references "the catalog meta description" by role without reproducing it verbatim, so there is no verbatim mandate to preserve the em dash (unlike the `title`, which the epic AC pinned verbatim). Use the description with the em dash replaced by a **colon**, every other word kept: `Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.` This exactly follows the precedent set and code-review-approved in Stories 1.2 (CAP-2) and 1.3 (CAP-3). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-4; _bmad-output/project-context.md#Content & editorial rules; _bmad-output/implementation-artifacts/1-3-financial-management-maf-subject-spoke-financial-management-tutor.md#Meta description; memory: "No em dashes in content"; autopilot-decisions.md 2026-07-11 CAP-4 meta]

### Cross-links to unbuilt siblings (story independence)
The `/cta-tutor` target already exists (Story 1.1 done). `/pgda-tutor` (Story 1.6) and `/subjects` (Story 1.7) are built later in this epic. Authoring a `<Link>` to a not-yet-built route causes **no build error** in Next.js, and the link resolves when the sibling page lands. Do **not** treat a missing sibling as a blocker, and do **not** stub the sibling pages. Whole-matrix completeness (no dead-end links) is verified once in **Story 2.3**, consistent with the single-shot release (NFR7). The **unit** render-smoke asserts the links are *present in the DOM* (an `href` check), not that they navigate — do not add an e2e navigation test for sibling links in this story. [Source: _bmad-output/planning-artifacts/epics.md#Cross-link authoring note; 1-3-financial-management-maf-subject-spoke-financial-management-tutor.md#Cross-links to unbuilt siblings]

### No IFRS-guide edge for this page
Unlike `/accounting-tutor` (which has a deferred `/accounting-tutor` → IFRS-guides edge landing in Story 2.3 / on Epic 3 release), the link matrix in `page-catalog.md` gives `/tax-tutor` (the `/tax` row) **no** guides column. So there is nothing guide-related to author or to defer here — the outbound set is exactly `/cta-tutor`, `/pgda-tutor`, `/subjects`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix]

### Differentiation guard (NFR1 — the biggest risk for this story)
Because this page shares a structural template with the three DONE sibling pages, the primary failure mode is producing a near-duplicate (scaled-content-abuse / doorway risk). The content MUST be genuinely about **Taxation as its own subject** — the Income Tax Act framework (gross income, special inclusions, general/specific deductions, the general deduction formula), individual tax (fringe benefits, retirement contributions, medical credits, provisional tax), corporate tax (company taxable income, dividends tax, assessed losses), VAT (output/input tax, zero-rated vs exempt, registration), CGT (Eighth Schedule, base cost, inclusion rate, exclusions), and estate duty/donations tax. It must NOT reuse the `/accounting-tutor` IFRS/consolidations narrative or the `/financial-management-tutor` costing/finance narrative. The FAQ, "What we cover", and "Who it's for" must read as written by someone who tutors taxation specifically (real syllabus detail + exam technique, e.g. how the ITC layers a tax computation into an integrated question, how VAT and income tax interact in a scenario). A distinctive, genuinely useful angle: naming the actual Acts (Income Tax Act No. 58 of 1962, the VAT Act, the Estate Duty Act) and SARS, plus how tax appears in both the ITC and the applied APC, separates this page from the sibling spokes. Reviewer will check for real syllabus detail, not templated filler. [Source: _bmad-output/planning-artifacts/epics.md#NFR1; _bmad-output/project-context.md#Content & editorial rules]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-muted`, `text-muted-foreground`, `bg-accent/10`, `bg-accent/20`, `bg-accent/30`) which map to `hsl(var(--token))`. No new hue, no third accent. Gold is accent-only; gold text uses `text-accent` (`accent-ink`), never a raw `--accent` fill for text. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes. Do not hardcode colors; rely on tokens so both modes work. Footer stays dark navy in both modes (inherent to `<Footer/>`). [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; existing containers use `container mx-auto px-6` and `max-w-4xl` blocks; multi-column grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This page is a server component with no client state. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). [Source: acce-nextjs/src/app/accounting-tutor/page.tsx; tests/unit/render-smoke.test.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars (the CAP-4 title is 49 chars); meta `description` ≤ ~155 chars (the colon variant is ~135 chars); page-appropriate JSON-LD present and valid (`Service` + `FAQPage`). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/tax-tutor` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]
- Known pre-existing failures to expect (not regressions): `sitemap.test.ts` fails for routes not yet in `sitemap.ts` (guide routes + `/cta-tutor` + `/accounting-tutor` + `/financial-management-tutor` + now `/tax-tutor`); resolved in Story 1.8. `tsc` may emit stale `.next/types` cache errors unrelated to this story. [Source: 1-3-financial-management-maf-subject-spoke-financial-management-tutor.md#Debug Log References]

### Previous story intelligence (Stories 1.1, 1.2 & 1.3, all DONE, clean reviews)
All three prior Epic-1 pages passed code review clean (all 7 ACs verified). Lessons carried forward:
- Sharing one `FAQ_ITEMS` const between the rendered FAQ and `FAQPage.mainEntity` guaranteed the AC "questions/answers match" requirement — do the same here.
- The 1.2/1.3 reviewers **dismissed** the word-count upper-bound overrun (~1074 / ~1277 words) because genuine, differentiated content serves NFR1's anti-doorway intent better than trimming to hit an arbitrary ceiling. Prioritise real taxation depth over hitting exactly 900 words; do not pad either.
- The 1.2/1.3 reviewers accepted **multiple** `variant="hero"` CTAs because each sat in a distinct view group (hero header, how-sessions callout, pricing/related callout, final CTA). "One hero per view group" is the rule, not "one hero per page". Same latitude applies here.
- **Em-dash title precedent:** Story 1.1 kept a verbatim-pinned em-dash `title` as the single sanctioned exception; the OG/Twitter mirror was dismissed as noise. This story's title is the same situation — keep it, and keep the body + meta description em-dash-free.
- Do NOT touch `sitemap.ts` — the sitemap flag for the new route is by-design deferred to Story 1.8; the pre-existing `sitemap.test.ts` failures are not this story's regressions.
- 4-space indentation throughout the page file.
[Source: _bmad-output/implementation-artifacts/1-3-financial-management-maf-subject-spoke-financial-management-tutor.md#Completion Notes List,#Review Findings; 1-2-accounting-subject-spoke-accounting-tutor.md; 1-1-cta-qualification-hub-page-cta-tutor-flagship.md#Em-dash exception]

### Git intelligence
The last three dev-story commits (`830ddbc`/`93d6822` for 1.1, `5eaa92b`/`0ad8cda` for 1.2, `f0a6434`/`179ff2c` for 1.3) each added exactly one NEW page file (`src/app/<route>/page.tsx`) plus a small `tests/unit/render-smoke.test.tsx` extension (~+20 lines) and nothing else — the clean, additive footprint this story should also produce. Match that footprint: one NEW page + one test extension. Baseline for this story is `179ff2c` (1-3 code-review → done). [Source: git log --oneline; 1-3 File List]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/tax-tutor/page.tsx` per the App-Router convention and the catalog route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- **Do NOT introduce a shared marketing `layout.tsx`** in this story. Stories 1.1–1.3 deliberately kept `Navbar`/`Footer` in each page (mirroring the guide pattern) for consistency; keep that decision here. [Source: 1-3-financial-management-maf-subject-spoke-financial-management-tutor.md#Project Structure Notes]
- Additive-only / no-regression rule: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`. [Source: _bmad-output/project-context.md#Additive-only]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Tax subject spoke]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-4 · /tax-tutor — Taxation]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/accounting-tutor/page.tsx] (the closest DONE structural + metadata + JSON-LD template)
- [Source: acce-nextjs/src/app/financial-management-tutor/page.tsx] (most recent DONE subject-spoke sibling)
- [Source: acce-nextjs/src/app/cta-tutor/page.tsx] (original template + em-dash-title precedent)
- [Source: acce-nextjs/src/app/page.tsx] (metadata shape)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase, Organization `@id`)
- [Source: acce-nextjs/src/components/Services.tsx] (subject naming ↔ route map)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend; existing AccountingTutorPage / FinancialManagementTutorPage blocks)
- [Source: _bmad-output/implementation-artifacts/1-3-financial-management-maf-subject-spoke-financial-management-tutor.md] (previous story intelligence)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-11)

### Debug Log References

- `tsc --noEmit`: pre-existing `.next/types/validator.ts` stale-cache errors unrelated to this story (same as 1.1/1.2/1.3). No new errors from tax-tutor/page.tsx or the updated render-smoke test.
- `vitest run`: render-smoke.test.tsx 18/18 green (3 new TaxTutorPage tests pass). sitemap.test.ts 3 pre-existing failures (by-design deferred to Story 1.8): `/tax-tutor` now appears in the missing-pages list as expected.
- Em-dash grep: only 3 occurrences of `—` in the file, all on the `title` field (lines 10, 16, 20: main + OG + Twitter mirror). The sanctioned exception. Meta description, all body copy, all FAQ text: zero em dashes.

### Completion Notes List

- Created `acce-nextjs/src/app/tax-tutor/page.tsx` as a server component following the `/financial-management-tutor` template (4-space indent, same imports, same shell, same metadata shape, same FAQ_ITEMS/FAQPAGE_DATA pattern, same Service+FAQPage JSON-LD pair).
- Authored deeply differentiated taxation content covering: Income Tax Act No. 58 of 1962 general deduction formula (s11(a)), individual tax (fringe benefits, provisional tax, medical credits, retirement deductions), corporate tax (dividends tax, assessed losses), VAT Act (output/input tax, zero-rated vs exempt, apportionment), CGT Eighth Schedule (disposal, base cost, inclusion rate, annual exclusion, primary residence exclusion), estate duty (Estate Duty Act, s4A abatement). Distinct from IFRS (/accounting-tutor) and costing/finance (/financial-management-tutor).
- E-E-A-T woven: SARS, Income Tax Act No. 58 of 1962, VAT Act Act 89 of 1991, Estate Duty Act, CA(SA), SAICA, ITC/APC board exams, UNISA (TAX2601, TAX3701), UCT, Wits, UP, Stellenbosch.
- Title: `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors` (49 chars, single sanctioned em dash, verbatim per CAP-4/AC2). OG/Twitter mirror the title identically per Story 1.1 precedent.
- Meta description: colon variant `Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.` (~135 chars, zero em dashes, per NFR6/Story 1.2/1.3 precedent).
- Outbound links: `/cta-tutor`, `/pgda-tutor`, `/subjects` in the related-pages block (lines mirroring /financial-management-tutor 262-278). No IFRS-guide edge (per story Dev Note).
- Four `<Button asChild variant="hero">` CTAs across four distinct view groups (hero header, How sessions callout, Pricing/CTA callout, final CTA section). Confirmed precedent from 1.2/1.3 review that multiple hero CTAs are permitted when each is in a distinct view group.
- Extended render-smoke.test.tsx with 3 new assertions: H1 heading, `/cta-tutor` link presence, WhatsApp CTA presence. All 18 tests green.
- sitemap.ts NOT touched (Story 1.8 scope). e2e NOT added (auto-covered once Story 1.8 registers the route).

### File List

- acce-nextjs/src/app/tax-tutor/page.tsx (NEW)
- acce-nextjs/tests/unit/render-smoke.test.tsx (UPDATED: +import TaxTutorPage, +3 test assertions)
- _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md (UPDATED: status, tasks, dev agent record)
- _bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED: status in-progress → review)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (UPDATED: decision log entries appended)

## Review Findings

Code review 2026-07-11 (autopilot, fresh reasoning). **CLEAN — all 7 ACs verified, zero HIGH/MEDIUM findings → done.**

- AC1: server component, correct shell, exactly one `<h1>` ("Taxation Tutoring for PGDA & CTA").
- AC2: title 49 chars verbatim (sanctioned em-dash exception, Story 1.1 precedent); description 135 chars, colon-not-em-dash, zero em dashes; canonical `/tax-tutor/`; OG+twitter mirror.
- AC3: genuinely differentiated taxation content (Income Tax Act s11(a), individual/corporate tax, VAT Act, CGT Eighth Schedule, estate duty s4A) distinct from IFRS/costing siblings; all 6 H2 sections; SA E-E-A-T; zero em dashes in body+meta (grep: 3 total, all title-only).
- AC4: two JSON-LD Script blocks, Service→Organization by @id, FAQPage.mainEntity mapped from the same FAQ_ITEMS as the on-page FAQ.
- AC5: three outbound `<Link>`s (/cta-tutor, /pgda-tutor, /subjects); no IFRS-guide edge (correct).
- AC6: navy+gold tokens only, gold via text-accent, one `variant="hero"` per view group, shadcn Button, no new palette/components.
- AC7: render-smoke extended (18/18 green: H1 + /cta-tutor link + WhatsApp); additive footprint (page + test only); no sitemap/config/homepage regressions. `tsc --noEmit` = zero new errors (only pre-existing stale `.next/types` cache errors remain).
- Dismissed as noise (pre-adjudicated by Story 1.1/1.2/1.3): word-count overrun (genuine differentiated depth serves NFR1) and the AC2-mandated OG/Twitter em-dash title mirror.

No `decision-needed`, no `patch`, no `defer` findings.

## Change Log

- 2026-07-11: Story 1.4 code-review (autopilot): CLEAN pass, all 7 ACs verified with fresh reasoning, zero HIGH/MEDIUM findings. Status: done.
- 2026-07-11: Story 1.4 implemented. Created /tax-tutor page (server component, Service+FAQPage schema, differentiated taxation content covering Income Tax Act/VAT/CGT/estate duty, zero em dashes in body/meta, three outbound links). Render-smoke extended to 18 tests (3 new). All render-smoke green. tsc no new errors. Status: review.
