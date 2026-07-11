---
baseline_commit: 0ad8cdadc841505cf229794a8bbddb8fb85d94ac
---

# Story 1.3: Financial Management / MAF subject spoke (`/financial-management-tutor`)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student searching "financial management tutor" or "management accounting tutor",
I want one page that covers both namings of MAF,
so that either search term reaches the right dedicated page.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/financial-management-tutor` renders a **server component** that mirrors the shell used by Story 1.1's `/cta-tutor` and Story 1.2's `/accounting-tutor` pages and the guide pages: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"Management Accounting & Finance Tutoring"**.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the homepage `metadata` shape (`src/app/page.tsx`) and the `/accounting-tutor` page, with:
   - `title`: `Financial Management & Management Accounting Tutor | ACCE` (from page-catalog CAP-3; **no em dash**). This is **56 chars** (≤ ~60).
   - `description`: `Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA: costing, budgeting, decision-making and finance. Book with ACCE Tutors.` (the CAP-3 catalog meta with its single em dash replaced by a **colon** to satisfy NFR6 — see Dev Note "Meta description: em dash replaced with a colon"; every other word preserved). **~148 chars** (≤ ~155).
   - `alternates.canonical`: `"/financial-management-tutor/"` (relative path; `metadataBase` is set globally in `layout.tsx`).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror the `/accounting-tutor` page / homepage `metadata`).

3. **(AC3 — differentiated content, 700–900 words, dual-naming)** The page contains **700–900 words** of genuinely differentiated content (NFR1 anti-doorway: real MAF syllabus detail + exam technique, not a reworded clone of the `/accounting-tutor` or `/cta-tutor` pages) across these H2 sections (from CAP-3 / epic):
   - What MAF covers (costing, budgeting, financial management, decision-making)
   - Who it's for
   - How it works
   - Why ACCE
   - CTA
   - FAQ
   The copy weaves South African context (CA(SA), SAICA, ITC/APC board exams, and at least one of UNISA/UCT/Wits/UJ/UP/Stellenbosch) for E-E-A-T (NFR3) and contains **zero em-dash (`—`) characters** anywhere in the rendered body copy and metadata (NFR6).
   **Dual-naming requirement (the load-bearing differentiator for this page):** the page must **explicitly target both** the "financial management" and "management accounting" namings of the subject. The site's own subject label is "Management Accounting", but GSC demand is "financial management tutor" (primary kw, p27). Use MAF (Management Accounting & Finance) as the umbrella, and make the H1, an early paragraph, and at least one H2/FAQ entry name both terms naturally so either search reaches this page. It naturally targets the CAP-3 secondary keywords: **management accounting tutor, finance tutor, MAF tutor** (do not keyword-stuff; work them into headings and prose).

4. **(AC4 — structured data)** Valid **`Service` + `FAQPage`** JSON-LD is injected via `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching the `/accounting-tutor` and `layout.tsx` injection pattern. The `Service` object references the Organization by `@id` (`{"@id": "https://accetutors.co.za/#organization"}`) as `provider`. The `FAQPage` `mainEntity` questions/answers must be rendered from the **same const array** as the on-page FAQ section so they match exactly.

5. **(AC5 — outbound links)** The page links out to **`/cta-tutor`**, **`/pgda-tutor`**, and **`/subjects`**, using `next/link` `<Link>`. (Authoring links to sibling pages not yet built is expected and does not block this story — Next.js resolves them once the siblings land; see Dev Note "Cross-links to unbuilt siblings".) `/financial-management-tutor` has **no** IFRS-guide edge in the matrix (that edge belongs only to `/accounting-tutor`), so there are no guide links to author or defer here.

6. **(AC6 — dual-mode + design system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (use `text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. The footer stays dark navy in both modes (it does not invert — inherent to `<Footer/>`, do not alter).

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended to render `<FinancialManagementTutorPage/>` and assert the H1 and a representative outbound link (e.g. `/cta-tutor`) plus the WhatsApp CTA, and the existing suite stays green. (Sitemap registration and the e2e route-200 coverage land in **Story 1.8**; do not edit `sitemap.ts` in this story.)

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/financial-management-tutor/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match `/accounting-tutor` and `/cta-tutor` pages, guide pages, `config`, `middleware` — NOT the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden="true"`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`). Mirror `src/app/accounting-tutor/page.tsx` structure.
  - [x] Export `metadata` per AC2 (copy the shape from `src/app/accounting-tutor/page.tsx`; canonical `"/financial-management-tutor/"`; the colon-not-em-dash description exactly as given in AC2).
- [x] **Task 2 — Author the differentiated MAF content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "Management Accounting & Finance Tutoring". All other section headings are `<h2>`; card/sub-headings are `<h3>` (no heading-level skips).
  - [x] Write 700–900 words across the six H2 sections listed in AC3. Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first mentorship); plain terms (PGDA, CTA, CA(SA), MAF); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] **Dual-naming (AC3, the primary keyword requirement):** name both "financial management" and "management accounting" in the H1 area / opening paragraph, and again in at least one H2 or FAQ. Frame MAF as the single CTA/PGDA subject that both search terms map to. Do this naturally in prose, not as a keyword list.
  - [x] Content specifics to make it genuinely differentiated (NFR1, not a doorway clone of `/accounting-tutor` or `/cta-tutor`): keep the focus on **MAF as its own subject** — **costing / cost accounting** (absorption vs marginal/variable costing, activity-based costing, standard costing and variances, process/job costing), **budgeting** (master budgets, flexible budgets, variance analysis), **decision-making** (relevant costing, CVP/break-even, make-or-buy, limiting-factor analysis), and **financial management / corporate finance** (working-capital management, time value of money and DCF/NPV/IRR, cost of capital and WACC, capital structure, business valuation, risk and financial-instrument basics). This is distinct from Financial Accounting (`/accounting-tutor` = IFRS/consolidations) and from the four-subject `/cta-tutor` hub.
  - [x] Weave SA E-E-A-T context (CA(SA), SAICA, ITC/APC board exams, and at least one SA university such as UNISA/UCT/Wits/UP/Stellenbosch). MAF is examined in both the ITC and, more heavily as management-decision-making and financial management, in the APC — a genuine point of differentiation you can mention. (NFR3)
  - [x] "Who it's for": cover the ladder so an undergrad MAF/cost-accounting student, a PGDA student, and a CTA-level student all see themselves; note that financial management and management accounting are often two separate undergraduate modules that converge into MAF at CTA level.
  - [x] Outbound links (AC5): add `<Link href="/cta-tutor">`, `<Link href="/pgda-tutor">`, and `<Link href="/subjects">` in natural context (e.g. a "where this fits" / related-pages block, mirroring how `/accounting-tutor` did it). There are **no** IFRS-guide links for this page.
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">` (site-wide convention). Secondary actions use `default`/`ghost`/`heroOutline`.
  - [x] **Zero em dashes** in all rendered body copy AND metadata (use commas, colons, parentheses, or two sentences). En dashes in numeric ranges (e.g. "24–48h") are allowed but not needed here.
- [x] **Task 3 — Inject Service + FAQPage JSON-LD** (AC: 4)
  - [x] Define a `const FAQ_ITEMS` array (question/answer objects) and render BOTH the on-page FAQ section and the `FAQPage.mainEntity` from it (single source of truth — guarantees AC4 match). Mirror the `/accounting-tutor` `FAQ_ITEMS` + `FAQPAGE_DATA` pattern. Author MAF-specific questions (e.g. costing method confusion, NPV/IRR, budgeting variances, "is management accounting the same as financial management", APC vs ITC MAF).
  - [x] Define `const SERVICE_DATA` with `@context: "https://schema.org"`, `@type: "Service"`, `name` (e.g. "Management Accounting & Finance Tutoring"), `serviceType`/`description`, `areaServed: "South Africa"`, and `provider: { "@id": "https://accetutors.co.za/#organization" }`.
  - [x] Inject via two `<Script id="financial-management-tutor-jsonld-service" type="application/ld+json">` and `<Script id="financial-management-tutor-jsonld-faq" type="application/ld+json">` blocks (matches `layout.tsx`; CSP already permits this inline pattern).
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, import `FinancialManagementTutorPage from "@/app/financial-management-tutor/page"` and add a `describe("FinancialManagementTutorPage renders", …)` block (mirror the existing `AccountingTutorPage` block) that: renders it, asserts the H1 via `getByRole("heading", { name: /Management Accounting & Finance Tutoring/i })`, asserts a representative outbound link exists (e.g. `container.querySelector('a[href="/cta-tutor"]')` is not null), and asserts the WhatsApp CTA (`a[href="https://wa.me/27713255295"]`) is present.
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — no NEW errors in the new page or the test file (pre-existing `.next/types` / stale-cache errors unrelated to this story are acceptable; see Story 1.1/1.2 Debug Log).
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new assertions. (Note: `sitemap.test.ts` has pre-existing failures for unregistered routes; `/financial-management-tutor` being newly flagged there is EXPECTED and resolved by Story 1.8 — do not fix it here.)
  - [x] Manually confirm word count is in the 700–900 spirit (real, differentiated MAF content; do not pad or trim genuine syllabus detail purely to hit a number — see Story 1.2 review, which dismissed the upper-bound overrun) and grep the new file for `—` to confirm **zero** em dashes anywhere (body AND metadata — this page has no sanctioned em dash exception).

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/financial-management-tutor/page.tsx` — the MAF subject spoke (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link + WhatsApp assertion block for the new page (mirror the existing `AccountingTutorPage` block). [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2), `src/config/guides.ts` + `src/middleware.ts` (Epic 3), `next.config.ts`. All are out of scope; touching them is scope creep / regression risk (NFR4).

### The pattern to mirror (read these before writing)
- **`/accounting-tutor` page (Story 1.2, DONE)** — `acce-nextjs/src/app/accounting-tutor/page.tsx` is the closest structural template for this page: same imports, same shell (`min-h-screen bg-background` → `<Navbar/>` → `<main className="pt-32 pb-24">` → `<div className="container mx-auto px-6">` → `max-w-4xl` content blocks → `<Footer/>`), same metadata shape, same `FAQ_ITEMS` const feeding both the rendered FAQ and `FAQPage` JSON-LD, same eyebrow-badge + icon-badge + card patterns, same `<Button asChild variant="hero">` WhatsApp CTA, same `Service` + `FAQPage` schema pair. **Copy its conventions; write different (MAF-focused) content.** Do NOT literally duplicate its copy — that would create the templated near-duplicate NFR1 forbids. The related-pages block near the bottom of `/accounting-tutor` (lines ~262-278) is the exact model for the three outbound links. [Source: acce-nextjs/src/app/accounting-tutor/page.tsx]
- **`/cta-tutor` page (Story 1.1, DONE)** — `acce-nextjs/src/app/cta-tutor/page.tsx` is the original template both later pages derive from; consult it too if a convention is unclear. [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Metadata shape** — `acce-nextjs/src/app/accounting-tutor/page.tsx` (lines 9-23) and `src/app/page.tsx` show the exact `Metadata` object shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path (`"/financial-management-tutor/"`). [Source: acce-nextjs/src/app/accounting-tutor/page.tsx#metadata; acce-nextjs/src/app/page.tsx#metadata]
- **JSON-LD injection** — `acce-nextjs/src/app/accounting-tutor/page.tsx` (lines 52-92) shows the `const …_DATA` + `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` pattern (`Script` from `next/script`), the `Service` object referencing the Organization by `@id`, and the `FAQPAGE_DATA` built by mapping `FAQ_ITEMS`. This page uses the **same `Service` + `FAQPage` pair** (CAP-3), so it is a direct copy of the 1.2 structure with MAF data. [Source: acce-nextjs/src/app/accounting-tutor/page.tsx#SERVICE_DATA,#FAQPAGE_DATA; acce-nextjs/src/app/layout.tsx]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Subject naming ↔ route map** — homepage `Services.tsx` names the four subjects "Financial Accounting / Taxation / Management Accounting / Auditing". This page IS the **"Management Accounting"** spoke → route `/financial-management-tutor` (the route name matches the higher-demand GSC term "financial management tutor"; the on-site subject label is "Management Accounting"). The sibling routes it links context to: Financial Accounting → `/accounting-tutor`, Taxation → `/tax-tutor`, Auditing → `/auditing-tutor` (though this story's required outbound set is only `/cta-tutor`, `/pgda-tutor`, `/subjects`). [Source: acce-nextjs/src/components/Services.tsx; acce-nextjs/src/app/cta-tutor/page.tsx]

### CAP-3 catalog facts (target this page to these)
- **Primary kw:** financial management tutor (~20 impressions, position 27 at the 2026-07-11 baseline). This is the second-highest-demand subject spoke after accounting.
- **Secondary kw (weave naturally, no stuffing):** management accounting tutor, finance tutor, MAF tutor.
- **Naming nuance (load-bearing):** the site's subject is "Management Accounting"; GSC demand is "financial management tutor"; in CTA these are one subject (MAF). **Target both namings.** [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3]
- **H2 outline (author to it):** What MAF covers (costing, budgeting, financial management, decision-making) · Who it's for · How it works · Why ACCE · CTA · FAQ.
- **Schema:** Service + FAQPage. **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects` (no IFRS-guide edge for this page).
[Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3]

### Meta description: em dash replaced with a colon (NFR6)
The CAP-3 catalog meta is written as `... decision-making and finance — Book with ACCE Tutors.` (with an em dash). NFR6 / project-context forbid em dashes in **all** metadata, and this story's AC3 requires zero em dashes. The 1.3 AC references "the catalog meta description" without reproducing it verbatim, so there is no verbatim mandate to preserve the em dash (unlike Story 1.1's `title`, which the epic AC pinned verbatim as the single sanctioned exception). Use the description with the em dash replaced by a **colon**, every other word kept: `Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA: costing, budgeting, decision-making and finance. Book with ACCE Tutors.` This exactly follows the precedent set and code-review-approved in Story 1.2 (CAP-2 meta em dash → colon). This page's `title` has no em dash, so there is no sanctioned em-dash exception anywhere on this page. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3; _bmad-output/project-context.md#Content & editorial rules; _bmad-output/implementation-artifacts/1-2-accounting-subject-spoke-accounting-tutor.md#Meta description; memory: "No em dashes in content"; autopilot-decisions.md 2026-07-11 CAP-3 meta]

### Cross-links to unbuilt siblings (story independence)
The `/cta-tutor` target already exists (Story 1.1 done). `/pgda-tutor` (Story 1.6) and `/subjects` (Story 1.7) are built later in this epic. Authoring a `<Link>` to a not-yet-built route causes **no build error** in Next.js, and the link resolves when the sibling page lands. Do **not** treat a missing sibling as a blocker, and do **not** stub the sibling pages. Whole-matrix completeness (no dead-end links) is verified once in **Story 2.3**, consistent with the single-shot release (NFR7). The **unit** render-smoke asserts the links are *present in the DOM* (an `href` check), not that they navigate — do not add an e2e navigation test for sibling links in this story. [Source: _bmad-output/planning-artifacts/epics.md#Cross-link authoring note; 1-2-accounting-subject-spoke-accounting-tutor.md#Cross-links to unbuilt siblings]

### No IFRS-guide edge for this page
Unlike `/accounting-tutor` (which has a deferred `/accounting-tutor` → IFRS-guides edge landing in Story 2.3 / on Epic 3 release), the link matrix in `page-catalog.md` gives `/financial-management-tutor` (the `/fm` row) **no** guides column. So there is nothing guide-related to author or to defer here — the outbound set is exactly `/cta-tutor`, `/pgda-tutor`, `/subjects`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix]

### Differentiation guard (NFR1 — the biggest risk for this story)
Because this page shares a structural template with `/accounting-tutor` and `/cta-tutor`, the primary failure mode is producing a near-duplicate (scaled-content-abuse / doorway risk). The content MUST be genuinely about **MAF as its own subject** — costing methods (absorption/marginal/ABC/standard costing and variances), budgeting, decision-making (relevant costing, CVP, make-or-buy, limiting factors), and financial management/corporate finance (working capital, DCF/NPV/IRR, WACC, capital structure, valuation). It must NOT reuse the `/accounting-tutor` IFRS/consolidations narrative. The FAQ, "What MAF covers", and "Who it's for" must read as written by someone who tutors MAF specifically. A distinctive, genuinely useful angle for this page: MAF is the subject that appears prominently in the **APC** (case-study, decision-making focus), not just the ITC — mentioning that separates it from the accounting/tax/audit spokes. Reviewer will check for real syllabus detail + exam technique, not templated filler. [Source: _bmad-output/planning-artifacts/epics.md#NFR1; _bmad-output/project-context.md#Content & editorial rules]

### Dual-naming guard (AC3 — the query-match requirement)
This page uniquely has to satisfy two search intents that ACCE labels differently: "financial management tutor" (higher GSC demand, the route name) and "management accounting tutor" (the on-site subject label). If the copy only ever says "management accounting", a "financial management tutor" searcher may not see a match, and vice versa. Deliberately name BOTH terms — in the H1 vicinity/opening, in at least one H2, and in an FAQ (e.g. "Is management accounting the same as financial management?") — and frame MAF as the umbrella both map to. This is what makes the page rank for both clusters and is the core reason this page exists as one page rather than two. [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3; _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3 naming nuance]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-muted`, `text-muted-foreground`, `bg-accent/10`, `bg-accent/20`, `bg-accent/30`) which map to `hsl(var(--token))`. No new hue, no third accent. Gold is accent-only; gold text uses `text-accent` (`accent-ink`), never a raw `--accent` fill for text. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes. Do not hardcode colors; rely on tokens so both modes work. Footer stays dark navy in both modes (inherent to `<Footer/>`). [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; existing containers use `container mx-auto px-6` and `max-w-4xl` blocks; multi-column grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This page is a server component with no client state. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). [Source: acce-nextjs/src/app/accounting-tutor/page.tsx; tests/unit/render-smoke.test.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars (the CAP-3 title is 56 chars); meta `description` ≤ ~155 chars (the colon variant is ~148 chars); page-appropriate JSON-LD present and valid (`Service` + `FAQPage`). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/financial-management-tutor` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]
- Known pre-existing failures to expect (not regressions): `sitemap.test.ts` fails for routes not yet in `sitemap.ts` (guide routes + `/cta-tutor` + `/accounting-tutor` + now `/financial-management-tutor`); resolved in Story 1.8. `tsc` may emit stale `.next/types` cache errors unrelated to this story. [Source: 1-2-accounting-subject-spoke-accounting-tutor.md#Debug Log References]

### Previous story intelligence (Stories 1.1 & 1.2, both DONE, clean reviews)
Both `/cta-tutor` and `/accounting-tutor` passed code review clean (all 7 ACs verified). Lessons carried forward:
- Sharing one `FAQ_ITEMS` const between the rendered FAQ and `FAQPage.mainEntity` guaranteed the AC "questions/answers match" requirement — do the same here.
- The 1.2 reviewer **dismissed** the word-count upper-bound overrun (~1074 main-section words) because genuine, differentiated content serves NFR1's anti-doorway intent better than trimming to hit an arbitrary ceiling. Prioritise real MAF depth over hitting exactly 900 words; do not pad either.
- The 1.2 reviewer accepted **4** `variant="hero"` CTAs because each sat in a distinct view group (hero header, how-sessions callout, pricing callout, final CTA). "One hero per view group" is the rule, not "one hero per page". Same latitude applies here.
- Do NOT touch `sitemap.ts` — the sitemap flag for the new route is by-design deferred to Story 1.8; the pre-existing `sitemap.test.ts` failures are not this story's regressions.
- 4-space indentation throughout the page file.
[Source: _bmad-output/implementation-artifacts/1-2-accounting-subject-spoke-accounting-tutor.md#Completion Notes List,#Review Findings; 1-1-cta-qualification-hub-page-cta-tutor-flagship.md]

### Git intelligence
The last two dev-story commits (`830ddbc` for 1.1, `5eaa92b` for 1.2) each added exactly one NEW page file (`src/app/<route>/page.tsx`) plus a small `tests/unit/render-smoke.test.tsx` extension (~+20 lines) and nothing else — the clean, additive footprint this story should also produce. Match that footprint: one NEW page + one test extension. [Source: git log --oneline; 1-2 File List]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/financial-management-tutor/page.tsx` per the App-Router convention and the catalog route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- **Do NOT introduce a shared marketing `layout.tsx`** in this story. Stories 1.1 and 1.2 deliberately kept `Navbar`/`Footer` in each page (mirroring the guide pattern) for consistency; keep that decision here. [Source: 1-2-accounting-subject-spoke-accounting-tutor.md#Project Structure Notes]
- Additive-only / no-regression rule: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`. [Source: _bmad-output/project-context.md#Additive-only]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Financial Management / MAF subject spoke]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-3 · /financial-management-tutor — Management Accounting & Finance (MAF)]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/accounting-tutor/page.tsx] (the closest DONE sibling — structural + metadata + JSON-LD template)
- [Source: acce-nextjs/src/app/cta-tutor/page.tsx] (original template)
- [Source: acce-nextjs/src/app/page.tsx] (metadata shape)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase, Organization `@id`)
- [Source: acce-nextjs/src/components/Services.tsx] (subject naming ↔ route map)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend; existing AccountingTutorPage block)
- [Source: _bmad-output/implementation-artifacts/1-2-accounting-subject-spoke-accounting-tutor.md] (previous story intelligence)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-11)

### Debug Log References

- tsc: pre-existing `.next/types` stale cache errors (same as Stories 1.1/1.2); zero new errors in `financial-management-tutor/page.tsx` or `render-smoke.test.tsx`
- vitest: 15/15 render-smoke tests pass; 3 sitemap.test.ts failures are pre-existing (by-design deferred to Story 1.8 per AC7)
- em dash check: `grep — page.tsx` returns nothing — PASS
- word count: ~1207 words in main prose sections + ~621 FAQ words. Follows Story 1.2 precedent: genuine MAF syllabus depth takes priority over hitting a hard 900-word ceiling

### Completion Notes List

- Created `acce-nextjs/src/app/financial-management-tutor/page.tsx` as a server component with 4-space indentation, matching the `/accounting-tutor` structural template exactly
- Metadata: title=56ch (no em dash), description=148ch (em dash replaced by colon per Story 1.2 precedent and this story's AC2), relative canonical, OG/Twitter mirrored
- Dual-naming (AC3): both "financial management tutor" and "management accounting tutor" named in the opening paragraph, in multiple H2 sections ("What MAF covers"), and in the first FAQ question ("Is management accounting the same as financial management?")
- Content is genuinely differentiated from `/accounting-tutor` (IFRS/consolidations) and `/cta-tutor` (four-subject hub): focuses on MAF-specific costing methods (absorption/marginal/ABC/standard costing, process costing), budgeting, decision-making (relevant costing, CVP, make-or-buy, limiting factors), and financial management (DCF/NPV/IRR, WACC, capital structure, working capital). APC angle (decision-focused case study) used as the distinctive differentiator
- SA E-E-A-T: CA(SA), SAICA, ITC/APC, UNISA (MNG modules), UCT, Wits, UP, Stellenbosch woven throughout
- FAQ_ITEMS const feeds both the rendered FAQ and FAQPAGE_DATA (single source of truth, AC4 guaranteed structurally)
- SERVICE_DATA and FAQPAGE_DATA injected via two Script blocks with correct IDs
- Outbound links: /cta-tutor, /pgda-tutor, /subjects present in natural context (pricing/related-pages block); no IFRS-guide links (per AC5 and "No IFRS-guide edge" dev note)
- 4 hero CTAs across 4 distinct view groups (hero header, how-sessions callout, pricing callout, final CTA) — consistent with Story 1.2 reviewer precedent ("one hero per view group")
- Render-smoke extended: import + describe block for FinancialManagementTutorPage with H1 assertion, /cta-tutor link assertion, WhatsApp CTA assertion; 15/15 render-smoke pass
- sitemap.ts NOT touched (Story 1.8 deferred per AC7)

### File List

- acce-nextjs/src/app/financial-management-tutor/page.tsx (NEW)
- acce-nextjs/tests/unit/render-smoke.test.tsx (MODIFIED: +22 lines)
- _bmad-output/implementation-artifacts/1-3-financial-management-maf-subject-spoke-financial-management-tutor.md (MODIFIED: story updates)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED: status in-progress → review)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (MODIFIED: decision entries appended)

### Change Log

- 2026-07-11: Story 1.3 implemented — /financial-management-tutor page created (server component, Service+FAQPage JSON-LD, dual-naming MAF content, render-smoke extended, all 7 ACs satisfied)
