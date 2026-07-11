---
baseline_commit: ea951b998464b36a3a201a3a32b0198297eedb90
---

# Story 1.6: PGDA qualification hub (`/pgda-tutor`)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student searching "pgda tutor",
I want a dedicated PGDA page covering the Postgraduate Diploma in Accounting and its pathway to CA(SA),
so that I understand how ACCE supports the diploma year and where it leads, instead of landing on the generic homepage or the CTA page.

## Acceptance Criteria

1. **(AC1 — route, structure, single H1)** In a production (non-preview) build, visiting `/pgda-tutor` renders a **server component** that mirrors the DONE `/cta-tutor` sibling shell: `<div className="min-h-screen bg-background"> <Navbar/> <main className="pt-32 pb-24"> <div className="container mx-auto px-6"> …content… </div> </main> <Footer/> </div>`. The page has **exactly one `<h1>`** reading **"PGDA Tutoring (Postgraduate Diploma in Accounting)"** (from CAP-7 / epic AC). All other headings are `<h2>`/`<h3>` with no level skips.

2. **(AC2 — metadata)** The page exports `metadata: Metadata` mirroring the `/cta-tutor` / homepage `metadata` shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`), with:
   - `title`: `PGDA Tutor — Postgraduate Diploma in Accounting | ACCE` (from CAP-7, pinned **verbatim**; this string contains **one em dash** which is the **single sanctioned em-dash exception** for this page — see Dev Note "Title em-dash: the single sanctioned exception"). **54 chars** (≤ ~60).
   - `description`: `PGDA tutoring for the Postgraduate Diploma in Accounting: Accounting, Tax, MAF and Auditing support to help you convert to CTA and CA(SA). ACCE Tutors.` (the CAP-7 catalog meta with its single em dash replaced by a **colon** to satisfy NFR6 — see Dev Note "Meta description: em dash replaced with a colon"; every other word preserved). **~150 chars** (≤ ~155).
   - `alternates.canonical`: `"/pgda-tutor/"` (relative path; `metadataBase` is set globally in `layout.tsx`).
   - `openGraph` and `twitter` blocks with `title`/`description` (mirror the `/cta-tutor` page / homepage `metadata`; the OG/Twitter `title` mirrors the sanctioned em-dash `title` identically — this is expected, not a violation, per Story 1.1/1.4 precedent).

3. **(AC3 — differentiated content, 700–900 words)** The page contains **700–900 words** of genuinely differentiated content (NFR1 anti-doorway) across these H2 sections (from CAP-7):
   - **What PGDA is** — what the Postgraduate Diploma in Accounting is, who it is for, entry from an accredited degree (or bridging), and how the diploma year is structured. **This is the primary differentiator vs `/cta-tutor`** (see the TOP-RISK Dev Note): frame PGDA as *the qualification*, not the exam.
   - **Subjects we cover** — the four core subjects, each name a `<Link>` to its spoke; presented as brief link-out cards, NOT re-explained in depth (avoids duplicating spoke content).
   - **The PGDA → CTA → CA(SA) pathway** — how the diploma leads into the CTA / ITC and ultimately the CA(SA) designation. This H2 is the counterpart to `/cta-tutor`'s "ITC/board-exam prep" H2 and must read distinctly (pathway/progression framing, not exam-technique framing).
   - **How it works** (1:1, group, online across SA).
   - **Why ACCE** (E-E-A-T: Priyanka's CA(SA) pathway experience, results-first mentorship).
   - **FAQ**.
   The copy targets the **CAP-7 secondary keywords** (postgraduate diploma in accounting tutor, pgda accounting tutor, unisa pgda tutor — weave "UNISA" naturally into the distance/entry context, do not keyword-stuff) and weaves South African context (CA(SA), SAICA, PGDA, CTA, ITC/APC, UNISA/UCT/Wits/UJ/UP/Stellenbosch) for E-E-A-T (NFR3). It contains **zero em-dash (`—`) characters** anywhere in the rendered body copy, the FAQ, and the meta description (NFR6). En dashes in numeric ranges (e.g. `24–48h`, `700–900`) are allowed but not needed.

4. **(AC4 — structured data)** Valid **`Course` + `FAQPage`** JSON-LD is injected via `<Script id="…" type="application/ld+json">{JSON.stringify(DATA)}</Script>` (import `Script` from `next/script`), matching the layout's and `/cta-tutor`'s injection pattern. `Course.provider` references the Organization by `@id` (`{"@id":"https://accetutors.co.za/#organization"}`). The `FAQPage.mainEntity` questions/answers must be generated from the **same `FAQ_ITEMS` const** that renders the on-page FAQ (single source of truth — guarantees the JSON-LD matches the visible FAQ, per the 1.1–1.5 pattern).

5. **(AC5 — outbound links)** The page links out to **all four subject spokes** (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`) and to **`/cta-tutor`**, using `next/link` `<Link>`. (Per CAP-7 "Links out: all 4 subject spokes, `/cta-tutor`" — note this hub links to the OTHER qualification hub `/cta-tutor`, NOT to itself.) All five sibling routes already exist and are DONE, so no unbuilt-link concern remains for this story.

6. **(AC6 — dual-mode + design system reuse)** The page reuses only the existing navy+gold design tokens and shadcn/`Button` components in **both dark (default) and light** modes, with **no new palette or components**. Gold is accent-only (`text-accent` / `accent-ink` for gold text, never a raw `--accent` fill for text). Exactly **one gold `variant="hero"` conversion CTA per view group**. Every interactive element has a **visible focus ring** and ≥44px touch target. The footer stays dark navy in both modes (inherent to `<Footer/>`, do not alter).

7. **(AC7 — smoke coverage / no regressions)** The new page is additive only: no homepage section, existing route, `next.config.ts` header, or `middleware.ts` behavior is changed. The unit render-smoke suite (`tests/unit/render-smoke.test.tsx`) is extended with a `PgdaTutorPage` `describe` that renders the page and asserts (a) the single H1 via `getByRole("heading", { name: /PGDA Tutoring/i, level: 1 })`, (b) a representative outbound link (`a[href="/cta-tutor"]` is not null), and (c) the primary WhatsApp CTA (`a[href="https://wa.me/27713255295"]` count > 0). The existing suite stays green. **Do NOT edit `sitemap.ts`** — sitemap registration and the e2e route-200 coverage land in **Story 1.8**.

## Tasks / Subtasks

- [x] **Task 1 — Create the route file** (AC: 1, 2, 6)
  - [x] Create `acce-nextjs/src/app/pgda-tutor/page.tsx` as a server component (no `"use client"`).
  - [x] Use **4-space indentation** (match `/cta-tutor/page.tsx` and the guide pages, not the 2-space root `layout.tsx`/`page.tsx`). See project-context "Indentation is inconsistent".
  - [x] Import `Metadata` from `next`, `Script` from `next/script`, `Link` from `next/link`, `Navbar` from `@/components/Navbar`, `Footer` from `@/components/Footer`, `Button` from `@/components/ui/button`, and any `lucide-react` icons used (decorative icons get `aria-hidden="true"`).
  - [x] Render the shell exactly per AC1 (`min-h-screen bg-background` → `Navbar` → `main pt-32 pb-24` → `container mx-auto px-6` → content → `Footer`). Mirror the `/cta-tutor` hero (badge pills "Postgraduate" / "CA(SA) Pathway" are appropriate here too).
  - [x] Export `metadata` per AC2: `title` pinned verbatim WITH its em dash; `description` = colon variant (NOT the em dash); OG/Twitter mirror the title/description; canonical `"/pgda-tutor/"`.
- [x] **Task 2 — Author the differentiated content** (AC: 3, 5, 6)
  - [x] Single `<h1>`: "PGDA Tutoring (Postgraduate Diploma in Accounting)". All other headings `<h2>`/`<h3>`.
  - [x] Write 700–900 words across the six H2 sections in AC3. Hand-authored JSX + inline `const` arrays (no CMS/MDX/markdown). Voice: first-person, Priyanka's voice (results-first, been-there mentorship); plain terms (PGDA, CTA, CA(SA), IFRS); no corporate "we", no hype, no exam-fear-mongering (UX-DR6).
  - [x] **NFR1 differentiation (TOP RISK):** lead with PGDA-as-*qualification* (the postgraduate diploma, entry/admission, distance/UNISA context), and make the "PGDA → CTA → CA(SA) pathway" H2 a progression narrative. Do NOT re-tell the `/cta-tutor` ITC/exam-technique story. Present the four subjects as short link-out cards, not deep re-explanations. See the TOP-RISK Dev Note.
  - [x] In "Subjects we cover", each subject name is a `<Link>` to its spoke (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`). Add a `<Link>` to `/cta-tutor` (in the pathway copy or a "related qualification" mention) — this hub links to the CTA hub, not to itself.
  - [x] Conversion CTA: exactly one `<Button asChild variant="hero">` per view group, wrapping the WhatsApp link `<a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">`. Secondary actions use `default`/`ghost`/`heroOutline`.
  - [x] **Zero em dashes** in all rendered body copy, FAQ, and meta description. En dashes in numeric ranges are allowed but not needed.
- [x] **Task 3 — Inject Course + FAQPage JSON-LD** (AC: 4)
  - [x] Define a `FAQ_ITEMS` const (array of `{question, answer}`) and render both the on-page FAQ and the `FAQPage.mainEntity` from it (single source of truth).
  - [x] `COURSE_DATA`: `@context: "https://schema.org"`, `@type: "Course"`, `name` (e.g. "PGDA Tutoring (Postgraduate Diploma in Accounting)"), `description`, `provider: {"@id":"https://accetutors.co.za/#organization"}`.
  - [x] Inject as two `<Script id="pgda-tutor-jsonld-course" …>` / `<Script id="pgda-tutor-jsonld-faq" …>` blocks (mirror `/cta-tutor/page.tsx`; CSP already permits this inline pattern).
- [x] **Task 4 — Extend the unit render-smoke test** (AC: 7)
  - [x] In `acce-nextjs/tests/unit/render-smoke.test.tsx`, `import PgdaTutorPage from "@/app/pgda-tutor/page";` (add next to the other tutor-page imports) and add a `describe("PgdaTutorPage renders", …)` with the three assertions in AC7 (H1 level 1 `/PGDA Tutoring/i`, `a[href="/cta-tutor"]` not null, WhatsApp count > 0).
  - [x] Do NOT touch `sitemap.ts` (Story 1.8) and do NOT add an e2e test here (the e2e smoke auto-covers the route once it is in the sitemap in Story 1.8).
- [x] **Task 5 — Verify** (AC: all)
  - [x] Run `npx tsc --noEmit` (or the project's typecheck) — no NEW errors in the new page or the test (pre-existing `.next/types` stale-cache errors are unrelated; see 1.1 Debug Log).
  - [x] Run the vitest unit suite (`npm test` / `vitest run`) — all green including the new `PgdaTutorPage` assertions.
  - [x] Manually confirm word count is in the 700–900 spirit (real, differentiated PGDA content; do not pad or trim genuine content purely to hit a number — the 1.2/1.3 review dismissed the upper-bound overrun) and grep the new file for `—` to confirm the **only** em dash in the file is the sanctioned `title` string (+ its OG/Twitter mirrors); body, FAQ, and meta description must have zero em dashes.

## Dev Notes

### Source tree — files to touch
- **NEW:** `acce-nextjs/src/app/pgda-tutor/page.tsx` — the PGDA qualification hub (server component). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-7]
- **UPDATE:** `acce-nextjs/tests/unit/render-smoke.test.tsx` — add a render + H1 + outbound-link + WhatsApp assertion for the new page. [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- **DO NOT TOUCH this story:** `src/app/sitemap.ts` (Story 1.8), `src/components/Navbar.tsx` (Story 2.1), `src/components/Services.tsx` / homepage (Story 2.2), `next.config.ts`, `src/middleware.ts`, `src/config/guides.ts`, the sibling `/cta-tutor` and spoke pages (all DONE — do not modify).

### The template to mirror (read this first)
- **`/cta-tutor` page (Story 1.1, DONE)** — `acce-nextjs/src/app/cta-tutor/page.tsx` is the **direct template** for this story: it is the other qualification hub, with the identical schema contract (**Course + FAQPage**, NOT the spokes' Service+FAQPage), the same 5-outbound-link shape, the same hero (badge pills + intro + hero CTA), the same six-H2 skeleton, the `FAQ_ITEMS` single-source-of-truth pattern, and the sanctioned em-dash title. Copy its structure and conventions; change the CONTENT to PGDA framing and flip the self-link (CTA hub links to `/pgda-tutor`; this PGDA hub links to `/cta-tutor`). [Source: acce-nextjs/src/app/cta-tutor/page.tsx]
- **Metadata shape** — `src/app/page.tsx` and `/cta-tutor/page.tsx` show the exact `Metadata` object shape (`title`/`description`/`alternates.canonical`/`openGraph`/`twitter`). `metadataBase` is global in `layout.tsx`, so `canonical` is a **relative** path. [Source: acce-nextjs/src/app/cta-tutor/page.tsx#metadata]
- **JSON-LD injection** — `/cta-tutor/page.tsx` (Course + FAQPage as two `<Script>` blocks) is the exact pattern to replicate. [Source: acce-nextjs/src/app/cta-tutor/page.tsx#COURSE_DATA,#FAQPAGE_DATA]
- **Button variants** — `variant="hero"` = gradient gold (the single conversion CTA per view group); `default` = navy; `ghost`/`heroOutline`/`outline` = secondary. Wrap links with `<Button asChild>`. [Source: acce-nextjs/src/components/ui/button.tsx]
- **Subject naming → spoke mapping** — Financial Accounting → `/accounting-tutor`, Management Accounting and Finance (MAF) → `/financial-management-tutor`, Taxation → `/tax-tutor`, Auditing → `/auditing-tutor`. [Source: acce-nextjs/src/app/cta-tutor/page.tsx (four-subjects grid)]

### NFR1 differentiation (TOP RISK — read before writing copy)
PGDA and CTA are effectively the **same qualification**: the Certificate in Theory of Accounting (CTA) *is* the Postgraduate Diploma in Accounting (PGDA). `/cta-tutor` already exists and is DONE. Two hubs on the same qualification risk near-duplicate/doorway content (NFR1) and self-cannibalisation. To pass NFR1 and coexist cleanly:
- **`/pgda-tutor` = the qualification framing.** Lead with what the *postgraduate diploma* is: who it is for, entry from an accredited undergraduate accounting degree (or a bridging/CTA-stream route), the distance-learning angle (UNISA — this hits the "unisa pgda tutor" secondary kw), how the diploma year is structured, and what a tutor adds to the diploma year.
- **`/cta-tutor` = the exam framing** (already DONE): ITC/APC board-exam prep, integration technique, exam pass-rate. **Do NOT retell that story here.**
- The **"PGDA → CTA → CA(SA) pathway"** H2 is the differentiator: write it as a *progression narrative* (diploma → theory-of-accounting exam route → SAICA CA(SA)), not as exam technique.
- Present the four subjects as **short link-out cards** (name + one line), NOT deep re-explanations — the spoke pages own the depth, and re-explaining them would duplicate spoke content.
- Flagged as this story's top risk so both dev and code-review weigh differentiation explicitly (same treatment 1.2–1.5 received). [Source: _bmad-output/planning-artifacts/epics.md#Story 1.6; #Epic 1 NFR1]

### Title em-dash: the single sanctioned exception (NFR6)
Project rule NFR6 forbids em dashes in rendered copy and metadata. The **one** sanctioned exception on this page is the AC2 `title` string `PGDA Tutor — Postgraduate Diploma in Accounting | ACCE`, pinned **verbatim** in CAP-7 and the epic AC. Use it exactly. Its OG/Twitter `title` mirrors are expected to carry the same em dash (Story 1.1/1.4 precedent — dismissed as noise in review). **Everywhere else** (H1, all body, FAQ, meta `description`, OG/Twitter `description`, all JSON-LD) uses **zero em dashes**. Grep the finished file for `—`: the only hits should be the three `title` fields (main + OG + Twitter). [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-7; _bmad-output/implementation-artifacts/1-1-cta-qualification-hub-page-cta-tutor-flagship.md#Em-dash exception; 1-4-tax-subject-spoke-tax-tutor.md#Title em-dash]

### Meta description: em dash replaced with a colon (NFR6)
The CAP-7 catalog meta is `PGDA tutoring for the Postgraduate Diploma in Accounting — Accounting, Tax, MAF and Auditing support to help you convert to CTA and CA(SA). ACCE Tutors.`. That em dash violates NFR6, so replace it with a **colon**, preserving every other word: `PGDA tutoring for the Postgraduate Diploma in Accounting: Accounting, Tax, MAF and Auditing support to help you convert to CTA and CA(SA). ACCE Tutors.` (~150 chars, ≤ ~155). This is the exact house rule applied in Stories 1.2/1.3/1.4/1.5 (title keeps its pinned em dash where the catalog specifies one; meta and body do not). [Source: _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md#Meta description: em dash replaced with a colon]

### Design-system guardrails (NFR5 / UX-DR1–7)
- Consume tokens via Tailwind classes (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-accent`, `text-accent`, `bg-accent/10`, `bg-accent/20`, `bg-muted`) which map to `hsl(var(--token))`. No new hue, no third accent, no hardcoded colors. [Source: _bmad-output/project-context.md#Design system]
- Must render correctly in **both** dark (default) and light modes. Rely on tokens so both modes work. [Source: _bmad-output/project-context.md#Design system]
- Content max-width ~1160px; use `container mx-auto px-6` and `max-w-4xl` blocks; grids collapse to one column under `md`. [Source: _bmad-output/project-context.md#Design system]
- React 19 + React Compiler is on (`reactCompiler: true`) — do **NOT** hand-write `useMemo`/`useCallback`. This is a server component with no client state anyway. [Source: _bmad-output/project-context.md#Technology Stack]
- WhatsApp CTA convention across the site: `https://wa.me/27713255295` (`target="_blank" rel="noopener noreferrer"`). [Source: acce-nextjs/src/app/cta-tutor/page.tsx]

### SEO floor (NFR2)
Exactly one `<h1>`; `title` ≤ ~60 chars (54); meta `description` ≤ ~155 chars (~150); page-appropriate JSON-LD present and valid (**Course + FAQPage**). Correct heading hierarchy (h1 → h2 → h3, no skips). [Source: _bmad-output/planning-artifacts/epics.md#Epic 1 NFR/UX constraints]

### Testing standards
- Vitest 3 + Testing Library (`acce-nextjs/tests/unit`); Playwright (`tests/e2e`). [Source: _bmad-output/project-context.md#Technology Stack]
- The **unit** render-smoke is the cheap net for RSC render-time 500s (a green type-check and logic tests will NOT catch a render throw). Rendering the composed page here is required. Follow the existing `CtaTutorPage`/`AuditingTutorPage` describe blocks as the template (note `AuditingTutorPage` uses `level: 1` on the H1 assertion — do the same to avoid matching an H2 that also contains "PGDA"). [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]
- The **e2e** route-200 smoke is driven off `sitemap()`, so `/pgda-tutor` is auto-covered once Story 1.8 registers it. No e2e change in this story. Playwright uses dedicated port 3100 with `reuseExistingServer: false`. [Source: acce-nextjs/tests/e2e/smoke.spec.ts; _bmad-output/project-context.md#Testing]

### Previous-story intelligence (1.1–1.5, all DONE)
- Every prior Epic-1 page used the **`FAQ_ITEMS` single-source-of-truth** pattern for FAQ + FAQPage JSON-LD — reviewers verified AC4 by confirming the two derive from one array. Do the same. [Source: 1-1…1-5 Completion Notes]
- Reviews **dismissed word-count upper-bound overruns** (real content > padding) and the **OG/Twitter em-dash title mirror** as noise. Expect the same here; do not trim genuine content to hit exactly 900. [Source: 1-2/1-3/1-4 Review Findings]
- The `sitemap.test.ts` failure for a newly-added route is **by-design deferred to Story 1.8** — it is not a regression for this story. [Source: sprint-status.yaml notes; 1-1…1-5]
- `tsc --noEmit` surfaces **pre-existing** `.next/types/validator.ts` errors from stale build cache — unrelated to this story; only NEW errors in the new page/test count. [Source: 1-1 Debug Log References]

### Project Structure Notes
- Route lives at `acce-nextjs/src/app/pgda-tutor/page.tsx` per App-Router convention and the CAP-7 route list. Path alias `@/* → ./src/*`. [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Next.js implementation notes]
- Additive-only / no-regression: do not remove or restructure homepage sections; do not change `next.config.ts` security headers or `output: 'standalone'`; do not modify the DONE sibling pages. [Source: _bmad-output/project-context.md#Additive-only]
- **Optional (out of scope):** the catalog suggests a shared marketing `layout.tsx`. Do NOT introduce it here — keep mirroring the per-page Navbar/Footer pattern (lowest-risk, matches all five DONE Epic-1 pages). [Source: acce-nextjs/src/app/cta-tutor/page.tsx (Story 1.1 Dev Note)]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.6: PGDA qualification hub (`/pgda-tutor`); #FR7]
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#CAP-7 · /pgda-tutor — PGDA hub]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: acce-nextjs/src/app/cta-tutor/page.tsx] (direct template: qualification hub, Course+FAQPage, em-dash title, FAQ_ITEMS pattern)
- [Source: acce-nextjs/src/app/layout.tsx] (JSON-LD `<Script>` pattern, metadataBase, Organization `@id`)
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] (render-smoke pattern to extend)
- [Source: _bmad-output/implementation-artifacts/1-4-tax-subject-spoke-tax-tutor.md] (em-dash title/meta house rule)
- [Source: docs/architecture.md#Metadata/SEO] (per-route metadata + JSON-LD; Server Components by default)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Pre-existing `.next/types/validator.ts` errors from stale build cache (admin/portal routes absent in this branch) — not related to this story; zero new errors in pgda-tutor/page.tsx or render-smoke.test.tsx. Same pattern as Stories 1.1-1.5.
- sitemap.test.ts 3 failures — pre-existing by-design failures for all new Epic-1 routes (/pgda-tutor now added to the list); deferred to Story 1.8 per AC7.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Implemented `/pgda-tutor` as a server component mirroring the DONE `/cta-tutor` flagship template (Course+FAQPage JSON-LD, 5 outbound links, em-dash-sanctioned title, colon-variant meta description).
- Content strategy: PGDA-as-qualification framing throughout. "What PGDA is" explains entry requirements, UNISA distance angle, and how the diploma year is structured. "Subjects we cover" presents the 4 subjects as link-out cards only. "PGDA to CTA to CA(SA) pathway" is a progression narrative (ITC -> training contract -> APC), distinct from /cta-tutor's exam-technique framing. "Why ACCE" uses Priyanka's first-person CA(SA)-pathway experience. FAQ focuses on diploma-entry, UNISA modules, and pathway clarity questions (not ITC pass-rate questions like /cta-tutor).
- NFR1 differentiation satisfied: no shared paragraphs with /cta-tutor; "PGDA as qualification" vs "CTA as exam" split is the spine of the distinction.
- Em-dash check: grep shows exactly 3 hits (title + OG title + Twitter title), all the sanctioned exception per CAP-7. Body, FAQ, meta description, and JSON-LD are 100% em-dash-free.
- All 7 ACs verified: AC1 (server component shell + single H1), AC2 (metadata title 54ch with sanctioned em dash, description ~150ch colon variant, canonical /pgda-tutor/, OG+twitter blocks), AC3 (differentiated PGDA content across 6 H2 sections with SA E-E-A-T: SAICA, UNISA FAC4861/TAX4862/AUE4862/MNG4863, UCT/Wits/UP/UJ/Stellenbosch, ITC/APC/TOPP/TIPP), AC4 (Course+FAQPage JSON-LD injected via two Script blocks, FAQ_ITEMS single source of truth, provider @id correct), AC5 (all 4 spoke links + /cta-tutor link present), AC6 (design tokens only, no new palette/components, aria-hidden icons, 3 hero CTAs across 3 distinct view groups, CTA target=_blank rel=noopener), AC7 (render-smoke extended with 3 assertions, 36/36 render-smoke tests pass, sitemap.ts untouched per story spec).
- vitest run: 36 passed, 3 failed (all sitemap.test.ts, pre-existing by-design deferred to Story 1.8).

### File List

- acce-nextjs/src/app/pgda-tutor/page.tsx (NEW)
- acce-nextjs/tests/unit/render-smoke.test.tsx (UPDATED — +import PgdaTutorPage, +1 describe block with 3 assertions)

### Change Log

- 2026-07-11: Story 1.6 implemented. Created /pgda-tutor server component (Course+FAQPage JSON-LD, differentiated PGDA-as-qualification content, 5 outbound links). Extended render-smoke test with PgdaTutorPage describe block. Status set to review.
