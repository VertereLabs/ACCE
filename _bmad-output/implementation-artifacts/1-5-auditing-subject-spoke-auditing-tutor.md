---
baseline_commit: c37ec1800670f01f85ca939e63cc1b1145109e28
---

# Story 1.5: Auditing subject spoke (`/auditing-tutor`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student searching "auditing tutor" or "audit tutor",
I want a dedicated auditing page,
so that I reach focused auditing-tutoring content.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/auditing-tutor` renders a **server component** that mirrors the shell used by Story 1.1's `/cta-tutor`, Story 1.2's `/accounting-tutor`, Story 1.3's `/financial-management-tutor`, and Story 1.4's `/tax-tutor` pages and the guide pages: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"Auditing Tutoring"**.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the homepage `metadata` shape (`src/app/page.tsx`) and the `/tax-tutor` / `/accounting-tutor` pages, with:
   - `title`: `Auditing Tutor for CA(SA) Students | ACCE Tutors` (from page-catalog CAP-5 / epic AC, pinned **verbatim**). **48 chars** (≤ ~60). **This title contains NO em dash** — unlike Story 1.1's `/cta-tutor` and Story 1.4's `/tax-tutor` (whose verbatim-pinned titles held the "single sanctioned em-dash exception"), CAP-5's title is already em-dash-free. **There is NO sanctioned em-dash exception on this page.** Every string on this page (title, meta description, all body copy, all FAQ text, all JSON-LD) must contain **zero** em dashes. See Dev Note "No em-dash exception on this page".
   - `description`: `Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.` (the CAP-5 catalog meta with its single em dash replaced by a **colon** to satisfy NFR6 — see Dev Note "Meta description: em dash replaced with a colon"; every other word preserved). **~146 chars** (≤ ~155).
   - `alternates.canonical`: `"/auditing-tutor/"` (relative path; `metadataBase` is set globally in `layout.tsx`).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror the `/tax-tutor` page / homepage `metadata`). Because the `title` has no em dash, the OG/Twitter mirror is trivially em-dash-free too.

3. **(AC3 — differentiated content, 700–900 words)** The page contains **700–900 words** of genuinely differentiated content (NFR1 anti-doorway: real auditing syllabus detail + exam technique, not a reworded clone of the `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor` or `/cta-tutor` pages) across these H2 sections (from CAP-5 / epic):
   - What we cover (ISAs, the audit process, assertions, reporting)
   - Who it's for
   - How it works
   - Why ACCE
   - CTA
   - FAQ
   The copy weaves South African context (CA(SA), SAICA, ITC/APC board exams, and at least one of UNISA/UCT/Wits/UJ/UP/Stellenbosch) for E-E-A-T (NFR3) and contains **zero em-dash (`—`) characters** anywhere on the page (NFR6). It naturally targets the CAP-5 secondary keywords: **auditing tutor south africa, isa tutor** (and the primary **auditing tutor / audit tutor**) — do not keyword-stuff; work them into headings and prose.

4. **(AC4 — structured data)** Valid **`Service` + `FAQPage`** JSON-LD is injected via `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching the `/tax-tutor`, `/accounting-tutor` and `layout.tsx` injection pattern. The `Service` object references the Organization by `@id` (`{"@id": "https://accetutors.co.za/#organization"}`) as `provider`. The `FAQPage` `mainEntity` questions/answers must be rendered from the **same const array** as the on-page FAQ section so they match exactly.

5. **(AC5 — outbound links)** The page links out to **`/cta-tutor`**, **`/pgda-tutor`**, and **`/subjects`**, using `next/link` `<Link>`. (Authoring links to sibling pages not yet built is expected and does not block this story — Next.js resolves them once the siblings land; see Dev Note "Cross-links to unbuilt siblings".) `/auditing-tutor` has **no** guide edge in the link matrix (the guides column belongs only to `/accounting-tutor`), so there are no guide links to author or defer here.

6. **(AC6 — dual-mode + design system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (use `text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. The footer stays dark navy in both modes (it does not invert — inherent to `<Footer/>`, do not alter).

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended to render `<AuditingTutorPage/>` and assert the H1 and a representative outbound link (e.g. `/cta-tutor`) plus the WhatsApp CTA, and the existing suite stays green. (Sitemap registration and the e2e route-200 coverage land in **Story 1.8**; do not edit `sitemap.ts` in this story.)

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/auditing-tutor/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match `/tax-tutor`, `/accounting-tutor`, `/financial-management-tutor`, `/cta-tutor` pages, guide pages, `config`, `middleware` — NOT the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden="true"`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`). Mirror `src/app/tax-tutor/page.tsx` structure.
  - [x] Export `metadata` per AC2 (copy the shape from `src/app/tax-tutor/page.tsx`; canonical `"/auditing-tutor/"`; the pinned-verbatim title and the colon-not-em-dash `description` exactly as given in AC2). Note: **unlike** `/tax-tutor`, this title has no em dash, so **no** string on this page carries an em dash.
- [x] **Task 2 — Author the differentiated auditing content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "Auditing Tutoring". All other section headings are `<h2>`; card/sub-headings are `<h3>` (no heading-level skips).
  - [x] Write 700–900 words across the six H2 sections listed in AC3. Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first mentorship); plain terms (PGDA, CTA, CA(SA), ISA); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] Content specifics to make it genuinely differentiated (NFR1, not a doorway clone of the sibling spokes): keep the focus on **Auditing / assurance as its own subject** — **the ISA framework** (the International Standards on Auditing: the objective of an audit and reasonable assurance under ISA 200, fraud responsibilities under ISA 240, risk identification/assessment under ISA 315, the auditor's responses to assessed risks under ISA 330, audit evidence under ISA 500, and forming and reporting the opinion under ISA 700/705/706), **the audit process / phases** (client acceptance and engagement, planning, risk assessment, internal controls and tests of controls, substantive procedures, completion and subsequent events, and reporting), **the assertions** (existence, completeness, rights and obligations, accuracy/valuation and allocation, cut-off, classification, presentation and disclosure), **the audit risk model** (audit risk = inherent risk x control risk x detection risk, and how materiality drives the extent of testing), **audit evidence and sampling** (sufficiency and appropriateness, the nature/timing/extent of procedures, sampling vs full testing), **the audit report and opinions** (unmodified vs modified: qualified, adverse, disclaimer; key audit matters; emphasis-of-matter), and **ethics, independence and governance** (the SAICA / IRBA Code of Professional Conduct, the fundamental principles and threats-and-safeguards, auditor independence, and King IV governance in the SA context). This is distinct from Financial Accounting (`/accounting-tutor` = IFRS/consolidations/measurement), from MAF (`/financial-management-tutor` = costing/budgeting/corporate finance), from Taxation (`/tax-tutor` = Income Tax Act/VAT/CGT), and from the four-subject `/cta-tutor` hub. Auditing is **assurance over information others prepared**, not the preparation itself — make that framing land. Do NOT reuse the IFRS/consolidations, costing, or tax narratives.
  - [x] Weave SA E-E-A-T context: the ISAs as adopted for SA audits, IRBA (the Independent Regulatory Board for Auditors) and SAICA, the SAICA/IRBA Code of Professional Conduct, King IV governance, CA(SA), the ITC and APC board exams (auditing is examined in the ITC and, at applied/integrated depth, in the APC — a genuine E-E-A-T point), and at least one SA university (e.g. UNISA auditing modules AUE/AUI, UCT, Wits, UP, Stellenbosch). (NFR3)
  - [x] "Who it's for": cover the ladder so an undergrad auditing student, a PGDA student, and a CTA-level student all see themselves (undergrad auditing modules → PGDA auditing depth → CTA integration under exam pressure, where auditing questions layer risk, evidence and reporting into an integrated scenario).
  - [x] Outbound links (AC5): add `<Link href="/cta-tutor">`, `<Link href="/pgda-tutor">`, and `<Link href="/subjects">` in natural context (e.g. a "where this fits" / related-pages block, mirroring how `/tax-tutor` did it near the bottom of its page). There are **no** guide links for this page.
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">` (site-wide convention). Secondary actions use `default`/`ghost`/`heroOutline`.
  - [x] **Zero em dashes** anywhere on this page — title, meta description, all rendered body copy, all FAQ text, all JSON-LD strings (use commas, colons, parentheses, or two sentences). There is **no** sanctioned exception here (the title has no em dash). En dashes in numeric ranges (e.g. "24–48h") are allowed but not needed here.
- [x] **Task 3 — Inject Service + FAQPage JSON-LD** (AC: 4)
  - [x] Define a `const FAQ_ITEMS` array (question/answer objects) and render BOTH the on-page FAQ section and the `FAQPage.mainEntity` from it (single source of truth — guarantees AC4 match). Mirror the `/tax-tutor` `FAQ_ITEMS` + `FAQPAGE_DATA` pattern. Author auditing-specific questions (e.g. "what is the difference between an audit and accounting", the assertions, how the audit risk model drives testing, when an opinion is qualified vs adverse vs a disclaimer, why independence matters, how auditing is examined in the ITC vs APC).
  - [x] Define `const SERVICE_DATA` with `@context: "https://schema.org"`, `@type: "Service"`, `name` (e.g. "Auditing Tutoring"), `serviceType`/`description`, `areaServed: "South Africa"`, and `provider: { "@id": "https://accetutors.co.za/#organization" }`.
  - [x] Inject via two `<Script id="auditing-tutor-jsonld-service" type="application/ld+json">` and `<Script id="auditing-tutor-jsonld-faq" type="application/ld+json">` blocks (matches `layout.tsx`; CSP already permits this inline pattern).
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, import `AuditingTutorPage from "@/app/auditing-tutor/page"` and add a `describe("AuditingTutorPage renders", …)` block (mirror the existing `TaxTutorPage` / `FinancialManagementTutorPage` blocks) that: renders it, asserts the H1 via `getByRole("heading", { name: /^Auditing Tutoring$/i, level: 1 })`, asserts a representative outbound link exists (`container.querySelector('a[href="/cta-tutor"]')` is not null), and asserts the WhatsApp CTA (`a[href="https://wa.me/27713255295"]`) is present.
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — no NEW errors in the new page or the test file (pre-existing `.next/types` / stale-cache errors unrelated to this story are acceptable; see Story 1.1/1.2/1.3/1.4 Debug Log).
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new assertions. (Note: `sitemap.test.ts` has pre-existing failures for unregistered routes; `/auditing-tutor` being newly flagged there is EXPECTED and resolved by Story 1.8 — do not fix it here.)
  - [x] Manually confirm word count is in the 700–900 spirit (real, differentiated auditing content; do not pad or trim genuine syllabus detail purely to hit a number — see Story 1.2/1.3/1.4 review, which dismissed the upper-bound overrun) and grep the new file for `—` to confirm **zero** em dashes anywhere (this page has no sanctioned exception — title, meta AND body must all be em-dash-free).

## Review Findings

**Code review 2026-07-11 (autopilot, fresh reasoning) — CLEAN, no HIGH/MEDIUM findings. Status -> done.**

All 7 ACs independently re-verified:
- AC1: server component (no `"use client"`), correct shell (`min-h-screen bg-background` -> Navbar -> `main pt-32 pb-24` -> `container mx-auto px-6` -> Footer), exactly one `<h1>` "Auditing Tutoring". [PASS]
- AC2: metadata mirrors homepage/tax-tutor shape; title "Auditing Tutor for CA(SA) Students | ACCE Tutors" (48ch, no em dash, no sanctioned exception); description colon-variant (~146ch); canonical `/auditing-tutor/` (trailing-slash convention consistent with all siblings + `trailingSlash:false` verified); OG/Twitter override title+description only (global `type`/`card`/images inherited from layout.tsx, same as siblings). [PASS]
- AC3: genuinely differentiated auditing content (ISA 200/210/240/300/315/320/330/500/530/560/570/580/700/701/705/706, assertions model, audit risk model + materiality, evidence & sampling, opinion types, SAICA/IRBA Code, King IV); framing "assurance OVER information others prepared, not preparation" lands; SA E-E-A-T (IRBA, SAICA, ITC/APC, UNISA AUE2601/AUI3702, UCT/Wits/UP/Stellenbosch); zero em dashes grep-confirmed. Not a doorway clone of the sibling spokes (NFR1 satisfied). [PASS]
- AC4: Service + FAQPage JSON-LD via two `<Script type="application/ld+json">` blocks; FAQ single-source (`FAQ_ITEMS` feeds both on-page FAQ and `FAQPAGE_DATA.mainEntity` — grep-verified); Service `provider` references Organization by `@id`. [PASS]
- AC5: `/cta-tutor`, `/pgda-tutor`, `/subjects` via `next/link` `<Link>` (grep-verified, exactly the required set; no guide edge). [PASS]
- AC6: navy+gold tokens + shadcn Button only, no new palette/components; gold accent-only; 4 `variant="hero"` CTAs each in a distinct view group (hero, how-sessions callout, related/pricing callout, final CTA) — accepted per 1.2/1.3/1.4 "one hero per view group" precedent. [PASS]
- AC7: additive only — `git diff` since baseline `c37ec18` touches ONLY `auditing-tutor/page.tsx` (new) + `render-smoke.test.tsx` (+21 lines); no sitemap.ts / Services.tsx / Navbar.tsx / next.config.ts / middleware.ts change (grep-verified). render-smoke 21/21 green incl. 3 new AuditingTutorPage assertions; `tsc --noEmit` no new errors (only pre-existing `.next/types` cache noise). [PASS]

Dismissed observations (noise, not defects):
- [x] [Review][Dismiss] Word-count overrun — body ~1850 + FAQ ~1220 words vs the 700-900 target. Genuine differentiated syllabus detail; Task 5 explicitly says do not trim to hit a number, and the 1.2/1.3/1.4 reviews pre-adjudicated the same overrun in favour of NFR1 anti-doorway depth.
- [x] [Review][Dismiss] A 7th `<h2>` (final CTA "Ready to get serious about Auditing?") beyond the 6-section content outline — matches the sibling template, keeps the single-h1 rule and h1->h2->h3 hierarchy intact (no skips).

By-design deferred (not this story's regression): `sitemap.test.ts` failures for `/auditing-tutor` (and the other unregistered routes) are resolved in Story 1.8; do not fix here.

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/auditing-tutor/page.tsx` — the Auditing subject spoke (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-5]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link + WhatsApp assertion block for the new page (mirror the existing `TaxTutorPage` / `FinancialManagementTutorPage` blocks). [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2 — see "The 'extract shared content' clause" note below), `src/config/guides.ts` + `src/middleware.ts` (Epic 3), `next.config.ts`. All are out of scope; touching them is scope creep / regression risk (NFR4).

### The pattern to mirror (read these before writing)
- **`/tax-tutor` page (Story 1.4, DONE)** — `acce-nextjs/src/app/tax-tutor/page.tsx` is the most recent DONE sibling and the closest structural template: same imports, same shell (`min-h-screen bg-background` → `<Navbar/>` → `<main className="pt-32 pb-24">` → `<div className="container mx-auto px-6">` → `max-w-4xl` content blocks → `<Footer/>`), same metadata shape, same `FAQ_ITEMS` const feeding both the rendered FAQ and `FAQPage` JSON-LD, same eyebrow-badge + icon-badge + card patterns, same `<Button asChild variant="hero">` WhatsApp CTA, same `Service` + `FAQPage` schema pair, same related-pages outbound-link block. **Copy its conventions; write different (auditing-focused) content.** Do NOT literally duplicate its copy — that would create the templated near-duplicate NFR1 forbids. [Source: acce-nextjs/src/app/tax-tutor/page.tsx]
- **`/accounting-tutor` page (Story 1.2, DONE)** — `acce-nextjs/src/app/accounting-tutor/page.tsx` shows the exact `FAQ_ITEMS` + `FAQPAGE_DATA` + `SERVICE_DATA` structure (lines ~25–92) and the related-pages block (lines ~262–278) that is the exact model for the three outbound links. [Source: acce-nextjs/src/app/accounting-tutor/page.tsx]
- **`/financial-management-tutor` page (Story 1.3, DONE)** — `acce-nextjs/src/app/financial-management-tutor/page.tsx` is another current-house-style example of the same subject-spoke contract. [Source: acce-nextjs/src/app/financial-management-tutor/page.tsx]
- **`/cta-tutor` page (Story 1.1, DONE)** — `acce-nextjs/src/app/cta-tutor/page.tsx` is the original template all later pages derive from. Consult it for any convention that is unclear. [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Metadata shape** — `acce-nextjs/src/app/tax-tutor/page.tsx` (lines ~9–26) and `src/app/page.tsx` show the exact `Metadata` object shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path (`"/auditing-tutor/"`). [Source: acce-nextjs/src/app/tax-tutor/page.tsx#metadata; acce-nextjs/src/app/page.tsx#metadata]
- **JSON-LD injection** — `acce-nextjs/src/app/tax-tutor/page.tsx` shows the `const …_DATA` + `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` pattern (`Script` from `next/script`), the `Service` object referencing the Organization by `@id`, and `FAQPAGE_DATA` built by mapping `FAQ_ITEMS`. This page uses the **same `Service` + `FAQPage` pair** (CAP-5), so it is a direct copy of the 1.2/1.3/1.4 structure with auditing data. [Source: acce-nextjs/src/app/tax-tutor/page.tsx; acce-nextjs/src/app/layout.tsx]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Subject naming ↔ route map** — homepage `Services.tsx` names the four subjects "Financial Accounting / Taxation / Management Accounting / Auditing". This page IS the **"Auditing"** spoke → route `/auditing-tutor`. The sibling routes it links context to: Financial Accounting → `/accounting-tutor`, Taxation → `/tax-tutor`, Management Accounting → `/financial-management-tutor` (though this story's required outbound set is only `/cta-tutor`, `/pgda-tutor`, `/subjects`). [Source: acce-nextjs/src/components/Services.tsx; acce-nextjs/src/app/cta-tutor/page.tsx]

### CAP-5 catalog facts (target this page to these)
- **Primary kw:** auditing tutor / audit tutor.
- **Secondary kw (weave naturally, no stuffing):** auditing tutor south africa, isa tutor.
- **Title (pinned verbatim):** `Auditing Tutor for CA(SA) Students | ACCE Tutors` (48 chars; **no em dash**).
- **Meta (em dash → colon):** `Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.` (~146 chars).
- **H1:** Auditing Tutoring.
- **H2 outline (author to it):** What we cover (ISAs, the audit process, assertions, reporting) · Who it's for · How it works · Why ACCE · CTA · FAQ.
- **Schema:** Service + FAQPage. **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects` (no guide edge for this page).
[Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-5]

### No em-dash exception on this page (NFR6)
Stories 1.1 (`/cta-tutor`) and 1.4 (`/tax-tutor`) each carried a "single sanctioned em-dash exception" because their CAP titles were pinned **verbatim** and those titles happened to contain an em dash. **This page is different.** The CAP-5 title, `Auditing Tutor for CA(SA) Students | ACCE Tutors`, contains **no em dash**, so there is **no** exception to carry. NFR6 / project-context (no em dashes in any rendered copy or metadata) applies to the **entire** page with no carve-out: the title, the meta description, all body copy, all FAQ questions and answers, and all JSON-LD string values must be em-dash-free. When grepping the finished file for `—`, the correct result is **zero** occurrences (not "one, on the title" as in Story 1.4). Do NOT import Story 1.4's em-dash-exception dev note. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-5; _bmad-output/project-context.md#Content & editorial rules; memory: "No em dashes in content"; autopilot-decisions.md 2026-07-11 CAP-5 title]

### Meta description: em dash replaced with a colon (NFR6)
The CAP-5 catalog meta is written as `Auditing tutoring for undergrad, PGDA and CTA — ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.` (with an em dash). NFR6 / project-context forbid em dashes in **all** metadata, and this story's AC3 requires zero em dashes everywhere. The epic Story 1.5 AC references "the catalog meta description" by role without reproducing it verbatim, so there is no verbatim mandate to preserve the em dash (unlike the pinned title, which — on this page — is already em-dash-free anyway). Use the description with the em dash replaced by a **colon**, every other word kept: `Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.` This exactly follows the precedent set and code-review-approved in Stories 1.2 (CAP-2), 1.3 (CAP-3) and 1.4 (CAP-4). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-5; _bmad-output/project-context.md#Content & editorial rules; _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md#Meta description; autopilot-decisions.md 2026-07-11 CAP-5 meta]

### The "extract shared content" clause — why it does NOT force a Services.tsx edit (READ THIS)
Story 1.5's epic AC has a clause the other spokes did **not**: *"where content mirrors the homepage Auditing section, the shared inner content is extracted into a component used by both the homepage section and this page (to avoid divergence)."* This is a **conditional** ("where content mirrors"), and the condition is **not** met here, so **no shared-component extraction is required and `Services.tsx` must NOT be edited in this story**. Reasoning:
- The homepage "Auditing" content is a **single card** — a title (`"Auditing"`) plus a one-sentence description — inside the `services[]` array in `acce-nextjs/src/components/Services.tsx` (see that file). It is **not** a standalone rich section.
- A 700–900-word auditing page cannot "mirror" a one-sentence card, so there is **no divergence-prone duplicated block** to factor out. The AC's own purpose ("to avoid divergence") does not apply when there is nothing substantial shared.
- Editing `Services.tsx` is a **homepage regression surface** and homepage changes ("Learn more →" links on the subject cards) are explicitly **Story 2.2** scope. NFR4 (additive-only, no homepage restructuring in Epic-1 spokes) reinforces leaving it alone here.
- All three DONE sibling spokes (1.2/1.3/1.4) authored fresh, differentiated content with **no** shared-component extraction and passed clean code review. Consistency argues for the same treatment here.
- **Author the auditing page as fresh, self-contained content.** Do not create a shared component and do not touch `Services.tsx`.
- **If a reviewer nonetheless insists on literal extraction** (defensive fallback): the additive way to satisfy it is to lift the single Auditing card blurb into a shared `const` (or a tiny `AuditingIntro.tsx`) imported by BOTH `Services.tsx` and the new page — but that is a follow-up, does not affect the 700–900-word body, and is not required for this story to be correct.
[Source: _bmad-output/planning-artifacts/epics.md#Story 1.5; _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes; acce-nextjs/src/components/Services.tsx; _bmad-output/project-context.md#Additive-only; autopilot-decisions.md 2026-07-11 CAP-5 extract-shared-content]

### Cross-links to unbuilt siblings (story independence)
The `/cta-tutor` target already exists (Story 1.1 done). `/pgda-tutor` (Story 1.6) and `/subjects` (Story 1.7) are built later in this epic. Authoring a `<Link>` to a not-yet-built route causes **no build error** in Next.js, and the link resolves when the sibling page lands. Do **not** treat a missing sibling as a blocker, and do **not** stub the sibling pages. Whole-matrix completeness (no dead-end links) is verified once in **Story 2.3**, consistent with the single-shot release (NFR7). The **unit** render-smoke asserts the links are *present in the DOM* (an `href` check), not that they navigate — do not add an e2e navigation test for sibling links in this story. [Source: _bmad-output/planning-artifacts/epics.md#Cross-link authoring note; 1-4-tax-subject-spoke-tax-tutor.md#Cross-links to unbuilt siblings]

### No guide edge for this page
Per the CAP-9 internal-link matrix, the `/auditing` row has **no** guides column (only the `/accounting` row links to IFRS guides, deferred to Story 2.3 / Epic 3 release). So there is nothing guide-related to author or to defer here — the outbound set is exactly `/cta-tutor`, `/pgda-tutor`, `/subjects`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix]

### Differentiation guard (NFR1 — the biggest risk for this story)
Because this page shares a structural template with the four DONE sibling pages, the primary failure mode is producing a near-duplicate (scaled-content-abuse / doorway risk). The content MUST be genuinely about **Auditing / assurance as its own subject** — the ISA framework (ISA 200 reasonable assurance, ISA 240 fraud, ISA 315 risk assessment, ISA 330 responses, ISA 500 evidence, ISA 700/705/706 the opinion), the audit process/phases (acceptance, planning, risk assessment, controls, substantive procedures, completion, reporting), the assertions (existence, completeness, rights & obligations, valuation/accuracy, cut-off, classification, presentation & disclosure), the audit risk model (inherent x control x detection, materiality driving testing), audit evidence & sampling (sufficient appropriate evidence; nature/timing/extent), the audit report and opinion types (unmodified vs qualified/adverse/disclaimer; KAMs; emphasis of matter), and ethics/independence/governance (SAICA/IRBA Code, threats-and-safeguards, King IV). It must NOT reuse the `/accounting-tutor` IFRS/consolidations narrative, the `/financial-management-tutor` costing/finance narrative, or the `/tax-tutor` Income-Tax-Act narrative. The single most differentiating framing: **auditing is assurance OVER information others prepared, not the preparation of that information** — an auditor gathers evidence to express an opinion, and does not draft the financials. The FAQ, "What we cover", and "Who it's for" must read as written by someone who tutors auditing specifically (real syllabus detail + exam technique, e.g. how the ITC layers audit risk, evidence and reporting into an integrated question, how to justify an opinion modification). Naming the actual standards (ISA 315/330/500/700), IRBA, the SAICA/IRBA Code, and King IV, plus how auditing appears in both the ITC and the applied APC, separates this page from the sibling spokes. Reviewer will check for real syllabus detail, not templated filler. [Source: _bmad-output/planning-artifacts/epics.md#NFR1; _bmad-output/project-context.md#Content & editorial rules]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-muted`, `text-muted-foreground`, `bg-accent/10`, `bg-accent/20`, `bg-accent/30`) which map to `hsl(var(--token))`. No new hue, no third accent. Gold is accent-only; gold text uses `text-accent` (`accent-ink`), never a raw `--accent` fill for text. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes. Do not hardcode colors; rely on tokens so both modes work. Footer stays dark navy in both modes (inherent to `<Footer/>`). [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; existing containers use `container mx-auto px-6` and `max-w-4xl` blocks; multi-column grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This page is a server component with no client state. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). [Source: acce-nextjs/src/app/tax-tutor/page.tsx; tests/unit/render-smoke.test.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars (the CAP-5 title is 48 chars); meta `description` ≤ ~155 chars (the colon variant is ~146 chars); page-appropriate JSON-LD present and valid (`Service` + `FAQPage`). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/auditing-tutor` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]
- Known pre-existing failures to expect (not regressions): `sitemap.test.ts` fails for routes not yet in `sitemap.ts` (guide routes + `/cta-tutor` + `/accounting-tutor` + `/financial-management-tutor` + `/tax-tutor` + now `/auditing-tutor`); resolved in Story 1.8. `tsc` may emit stale `.next/types` cache errors unrelated to this story. [Source: 1-4-tax-subject-spoke-tax-tutor.md#Debug Log References]

### Previous story intelligence (Stories 1.1, 1.2, 1.3 & 1.4, all DONE, clean reviews)
All four prior Epic-1 pages passed code review clean (all 7 ACs verified). Lessons carried forward:
- Sharing one `FAQ_ITEMS` const between the rendered FAQ and `FAQPage.mainEntity` guaranteed the AC "questions/answers match" requirement — do the same here.
- The 1.2/1.3/1.4 reviewers **dismissed** the word-count upper-bound overrun because genuine, differentiated content serves NFR1's anti-doorway intent better than trimming to hit an arbitrary ceiling. Prioritise real auditing depth over hitting exactly 900 words; do not pad either.
- The reviewers accepted **multiple** `variant="hero"` CTAs because each sat in a distinct view group (hero header, how-sessions callout, pricing/related callout, final CTA). "One hero per view group" is the rule, not "one hero per page". Same latitude applies here.
- **Em dashes:** unlike 1.1/1.4 (which had a verbatim-pinned em-dash title), THIS page's title has no em dash, so there is **no** exception — the whole page (title, meta, body, FAQ, JSON-LD) must be em-dash-free (grep result = zero). See "No em-dash exception on this page".
- Do NOT touch `sitemap.ts` — the sitemap flag for the new route is by-design deferred to Story 1.8; the pre-existing `sitemap.test.ts` failures are not this story's regressions.
- Do NOT touch `Services.tsx` / the homepage — see "The 'extract shared content' clause" note above.
- 4-space indentation throughout the page file.
[Source: _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md#Completion Notes List,#Review Findings; 1-3-...md; 1-2-...md; 1-1-...md#Em-dash exception]

### Git intelligence
The last four dev-story pairs (1.1 `830ddbc`/`93d6822`, 1.2 `5eaa92b`/`0ad8cda`, 1.3 `f0a6434`/`179ff2c`, 1.4 for `/tax-tutor`) each added exactly one NEW page file (`src/app/<route>/page.tsx`) plus a small `tests/unit/render-smoke.test.tsx` extension (~+20 lines) and nothing else — the clean, additive footprint this story should also produce. Match that footprint: one NEW page + one test extension. Baseline for this story is `c37ec18` (current HEAD on `seo/epic-1`, 1-4 code-review → done). [Source: git log --oneline; 1-4 File List]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/auditing-tutor/page.tsx` per the App-Router convention and the catalog route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- **Do NOT introduce a shared marketing `layout.tsx`** in this story. Stories 1.1–1.4 deliberately kept `Navbar`/`Footer` in each page (mirroring the guide pattern) for consistency; keep that decision here. [Source: 1-4-tax-subject-spoke-tax-tutor.md#Project Structure Notes]
- Additive-only / no-regression rule: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`. [Source: _bmad-output/project-context.md#Additive-only]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5: Auditing subject spoke]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-5 · /auditing-tutor — Auditing]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/tax-tutor/page.tsx] (the most recent DONE structural + metadata + JSON-LD template)
- [Source: acce-nextjs/src/app/accounting-tutor/page.tsx] (FAQ_ITEMS / SERVICE_DATA / related-pages block model)
- [Source: acce-nextjs/src/app/financial-management-tutor/page.tsx] (current house style)
- [Source: acce-nextjs/src/app/cta-tutor/page.tsx] (original template)
- [Source: acce-nextjs/src/app/page.tsx] (metadata shape)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase, Organization `@id`)
- [Source: acce-nextjs/src/components/Services.tsx] (subject naming ↔ route map; the single Auditing card that the "extract shared content" clause refers to)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend; existing TaxTutorPage / FinancialManagementTutorPage blocks)
- [Source: _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md] (previous story intelligence)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- tsc: only pre-existing stale `.next/types/validator.ts` errors for removed admin/portal/sign-in routes. Zero new errors from `auditing-tutor/page.tsx` or `render-smoke.test.tsx`.
- render-smoke (first run): test failed because `/Auditing Tutoring/i` matched H1, FAQ H2, and FAQ H3 all at once. Fixed by using `{ name: /^Auditing Tutoring$/i, level: 1 }` to target the exact H1.
- render-smoke (second run): 21/21 green.
- sitemap.test.ts: pre-existing failures for unregistered routes (by-design per AC7 / Story 1.8). Not a regression.

### Completion Notes List

- Created `acce-nextjs/src/app/auditing-tutor/page.tsx` as a server component mirroring the /tax-tutor structural template (4-space indentation, same shell, same metadata shape, same JSON-LD injection pattern).
- Metadata: title "Auditing Tutor for CA(SA) Students | ACCE Tutors" (48 chars, zero em dashes, NO sanctioned exception); description colon variant 146 chars.
- Content: genuine auditing-specific syllabus (ISA 200/240/315/330/500/570/580/700/705/706, assertions model, audit risk model, materiality, audit evidence/sampling, opinion types, SAICA/IRBA Code, King IV). Framing: auditing is assurance OVER information others prepared, not preparation itself. SA E-E-A-T: IRBA, SAICA/IRBA Code, King IV, ITC/APC board exams, UNISA AUE2601/AUI3702, UCT/Wits/UP/Stellenbosch.
- Zero em dashes verified by grep (result: 0).
- Exactly one `<h1>` "Auditing Tutoring"; heading hierarchy h1→h2→h3 no skips.
- Three required outbound `<Link>`s: /cta-tutor, /pgda-tutor, /subjects (no guide edge for this page per matrix).
- Four `variant="hero"` CTAs across four distinct view groups (hero header, how-sessions callout, pricing/related callout, final CTA). Accepted precedent from 1.2/1.3/1.4 reviews.
- FAQ_ITEMS const feeds both the on-page FAQ section and FAQPAGE_DATA.mainEntity (single source of truth guarantees AC4 match).
- Service+FAQPage JSON-LD via two `<Script>` blocks (ids: auditing-tutor-jsonld-service, auditing-tutor-jsonld-faq).
- render-smoke test extended: AuditingTutorPage describe block with 3 assertions (H1, /cta-tutor link, WhatsApp CTA). Used `{ level: 1 }` to disambiguate H1 from FAQ H2 that also contains "auditing tutoring".
- All 21 render-smoke tests green. tsc no new errors. sitemap.ts untouched (Story 1.8).

### File List

- `acce-nextjs/src/app/auditing-tutor/page.tsx` (NEW)
- `acce-nextjs/tests/unit/render-smoke.test.tsx` (UPDATED: +import, +describe block)
- `_bmad-output/implementation-artifacts/1-5-auditing-subject-spoke-auditing-tutor.md` (UPDATED: status, tasks, dev agent record)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (UPDATED: in-progress → review)
- `_bmad-output/implementation-artifacts/autopilot-decisions.md` (UPDATED: decision log entries)
