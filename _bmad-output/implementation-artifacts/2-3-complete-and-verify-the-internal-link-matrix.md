---
baseline_commit: cd1c63ffe622d77dd98a7ed897f42a4511e7b748
---

# Story 2.3: Complete and verify the internal-link matrix

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the site owner,
I want every new page to satisfy its in/out link edges from the directed matrix,
so that ranking authority is routed correctly and no internal link dead-ends at release.

## Acceptance Criteria

1. **Given** the directed link matrix in `page-catalog.md` (CAP-9), **When** each new page and the homepage are audited, **Then** every new page carries its required 2-4 internal links in and out per the matrix: each **subject spoke** (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`) links out to both qualification hubs (`/cta-tutor`, `/pgda-tutor`) and back to `/subjects`; each **qualification hub** (`/cta-tutor`, `/pgda-tutor`) links out to all four subject spokes and the sibling hub; **`/subjects`** links out to all four spokes and both hubs; and the **homepage** edges from Story 2.2 (four Services "Learn more" links to the spokes + a Qualifications mention linking both hubs) are present. This full edge set is asserted by a new machine-enforceable regression test (a manual audit alone is not sufficient).

2. **Given** the release state (NFR7, single-shot release), **When** the audit runs, **Then** no internal link points at an unbuilt or publish-gated page: all seven marketing pages exist on disk (Epic 1) and are ungated, so every asserted edge resolves to a live page. The `/accounting-tutor` -> IFRS-guides edge is a special case: the guide **pages** (`groups`, `ifrs-15`, `ifrs-16`) are still `GUIDE_PUBLISH_STATUS: false` (Epic 3 has not released them), so per the matrix note this edge is **recorded as a pending edge** in `deferred-work.md` and is **NOT wired in this story** (wiring it now would create a public-build link to a page that redirects to "Coming Soon", violating NFR7). It is wired on guide release (Epic 3, Story 3.3).

3. **Given** the audit finds the hub<->spoke matrix already fully wired by Epic 1 and Story 2.2, **When** this story ships, **Then** it is **additive-only**: no existing `src/app/*/page.tsx` spoke/hub page body, `src/components/Services.tsx`, `src/components/Navbar.tsx`, `src/app/page.tsx`, `next.config.ts`, or `src/app/sitemap.ts` is modified. The only production-adjacent change is a new test file (`tests/unit/internal-link-matrix.test.tsx`) plus the `deferred-work.md` pending-edge record. (If, contrary to the create-story audit, any required non-guide edge is genuinely missing, add it minimally in place using the established `next/link` + `text-accent hover:underline` convention, and only then touch that one page.)

4. **Given** NFR6 (no em dashes), **When** the added test file and the pending-edge note are inspected, **Then** they contain zero em-dash (`—`) characters. (Grep before finishing.)

5. **Given** the unit suite, **When** it runs from `acce-nextjs/`, **Then** the new matrix test passes and the suite does not regress the baseline: **43 pass / 3 pre-existing guide-route sitemap failures** (Epic 3 scope, `/guides/*` unpublished). No NEW failures; the new matrix test adds passing assertions on top of that baseline. `npx tsc --noEmit` shows no NEW type errors (pre-existing stale `.next/types` cache errors are acceptable).

## Tasks / Subtasks

- [x] Task 1: Re-confirm the current outbound-link state of every new page against the matrix (AC: #1, #2)
  - [x] Read the CAP-9 matrix in `_bmad-output/specs/spec-seo-page-architecture/page-catalog.md` (the "Internal-link matrix" table + the four bullet rules below it) as the authority.
  - [x] Confirm each subject spoke's outbound set. `grep -n 'href="/cta-tutor"\|href="/pgda-tutor"\|href="/subjects"'` in each of `src/app/{accounting-tutor,financial-management-tutor,tax-tutor,auditing-tutor}/page.tsx`. Each must have all three. (Create-story verified all four already do.)
  - [x] Confirm each qualification hub's outbound set: `/cta-tutor/page.tsx` links all 4 spokes + `/pgda-tutor`; `/pgda-tutor/page.tsx` links all 4 spokes + `/cta-tutor`. Note: the four spoke links on the hub pages are rendered from a data array with a templated `href` (e.g. `href="/accounting-tutor"` literal in `cta-tutor`/`pgda-tutor`), and the sibling-hub link is a plain `<Link href="/pgda-tutor">` / `<Link href="/cta-tutor">`. (Create-story verified both hubs are complete.)
  - [x] Confirm `/subjects/page.tsx` links all four spokes and both hubs. IMPORTANT: these are rendered via the `SUBJECTS` and `QUALIFICATIONS` `const` arrays with `<Link href={subject.href}>` / `<Link href={qual.href}>`, so a grep for a literal `href="/accounting-tutor"` string will NOT find them; render the component (as the test does) or read the array `href` values. All six targets are present (`/accounting-tutor`, `/tax-tutor`, `/financial-management-tutor`, `/auditing-tutor`, `/cta-tutor`, `/pgda-tutor`).
  - [x] Confirm the homepage edges from Story 2.2 are present in `src/components/Services.tsx` (four Learn-more spoke links + a Qualifications mention linking both hubs). Already guarded by the `describe("Services homepage links")` block in `render-smoke.test.tsx`.
  - [x] If (contrary to the above) any required NON-guide edge is genuinely missing, add it minimally in place on that one page using `<Link href="/…" className="text-accent hover:underline">` (the Epic 1 convention), and record a decision. Otherwise change no page body (AC3). All edges confirmed present; no page.tsx changes required.

- [x] Task 2: Add the machine-enforceable full-matrix regression test (AC: #1, #3, #4, #5)
  - [x] Create `acce-nextjs/tests/unit/internal-link-matrix.test.tsx`. Import `render` from `@testing-library/react`, `describe`/`it`/`expect` from `vitest`, and the seven page components + `HomePage` (mirror the imports already in `render-smoke.test.tsx`).
  - [x] Encode the required outbound edge set as data and assert each edge with `container.querySelector('a[href="…"]')` `.not.toBeNull()`:
    - `HomePage` (renders `<Services/>`): `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/cta-tutor`, `/pgda-tutor`.
    - `SubjectsPage`: `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/cta-tutor`, `/pgda-tutor`.
    - `AccountingTutorPage`: `/cta-tutor`, `/pgda-tutor`, `/subjects`.
    - `FinancialManagementTutorPage`: `/cta-tutor`, `/pgda-tutor`, `/subjects`.
    - `TaxTutorPage`: `/cta-tutor`, `/pgda-tutor`, `/subjects`.
    - `AuditingTutorPage`: `/cta-tutor`, `/pgda-tutor`, `/subjects`.
    - `CtaTutorPage`: `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/pgda-tutor`.
    - `PgdaTutorPage`: `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/cta-tutor`.
  - [x] A data-driven loop (e.g. an array of `{ name, Component, edges: string[] }` iterated with `it.each` or a `for` loop generating `it(...)` per page) is cleaner than repeating blocks; keep it readable. Assert no self-link is required (a page need not link to itself).
  - [x] Do NOT assert the `/accounting-tutor` -> `/guides/*` edge (Epic-3 pending, AC2). Optionally add a single skipped/`it.todo("accounting-tutor links to relevant IFRS guides once Epic 3 releases them")` marker so the pending edge is visible in the test file, but do not make it a failing assertion.
  - [x] Do NOT weaken or delete any existing test in `render-smoke.test.tsx`; this is a new, additive file.
  - [x] Grep the new test file for `—` (em dash): must be 0 (AC4). Use ASCII `->` in any comment describing an edge, never an em dash. Confirmed: 0 em dashes.

- [x] Task 3: Record the pending `/accounting-tutor` -> IFRS-guides edge (AC: #2)
  - [x] Append an entry to `_bmad-output/implementation-artifacts/deferred-work.md` under a new heading `## Deferred from: create-story of 2-3-complete-and-verify-the-internal-link-matrix (2026-07-11)`, stating: the CAP-9 matrix requires `/accounting-tutor` to link to the relevant IFRS guides (`/guides/ifrs-15`, `/guides/ifrs-16`); those guide pages are `GUIDE_PUBLISH_STATUS: false` (Epic 3 not yet released); per AC2/NFR7 the edge is intentionally NOT wired now; it is wired by **Story 3.3 (release the reviewed guide pages)** when the guide page flags flip to `true`, by adding two `<Link>`s to `src/app/accounting-tutor/page.tsx` and extending `internal-link-matrix.test.tsx` with those edges. No em dashes in the entry (AC4).

- [x] Task 4: Regression + no-em-dash verification (AC: #3, #4, #5)
  - [x] Confirm no production file body changed (unless Task 1 found a real gap): `git status` should show only the new test file, the story file, `deferred-work.md`, and `autopilot-decisions.md` (plus `sprint-status.yaml` at finalize). No `page.tsx`/`Services.tsx`/`Navbar.tsx`/`sitemap.ts`/`next.config.ts` diff. Confirmed: git status shows only test file + story file + deferred-work.md + autopilot-decisions.md + sprint-status.yaml.
  - [x] Run the unit suite from `acce-nextjs/`: `npx vitest run`. Expect the new matrix test to pass and the total to be **prior 43 pass + the new matrix assertions, / 3 pre-existing guide-route sitemap failures unchanged**. No NEW failures. Result: 51 pass (43+8) / 3 pre-existing guide-route failures / 1 todo. No new failures.
  - [x] Run `npx tsc --noEmit` from `acce-nextjs/`; confirm no NEW type errors (only pre-existing stale `.next/types` cache errors acceptable). Confirmed: no new type errors.
  - [x] Grep the new test file + the `deferred-work.md` addition for `—`: 0 matches (AC4). Confirmed: 0 em dashes in new content.

## Dev Notes

### What this story is

Third and final build story of **Epic 2 (Navigation & Internal-Link Matrix)**. Story 2.1 (done) repointed the **navbar**; Story 2.2 (done) wired the **homepage** Services "Learn more" links + Qualifications mention. This story **completes and verifies** the whole hub<->spoke internal-link matrix and handles the one Epic-3-gated pending edge.

**Critical finding from the create-story audit (READ THIS):** The hub<->spoke matrix is **already fully wired**. Epic 1 authored each page's outbound links in place (per the cross-link authoring note in `epics.md`), and Story 2.2 added the homepage edges. So this is a **verification-and-guard** story, NOT a new-authoring story:

- **Existing coverage is thin.** `tests/unit/render-smoke.test.tsx` asserts only ONE representative outbound edge per page (e.g. each spoke asserts a link to `/cta-tutor`, but NOT `/pgda-tutor` or `/subjects`; each hub asserts only `/accounting-tutor` or `/cta-tutor`). A future edit could silently drop a required edge and the suite would stay green.
- **The deliverable** is a single new `tests/unit/internal-link-matrix.test.tsx` that asserts the FULL required outbound edge set for all 7 pages + the homepage, making the matrix a durable regression contract, plus a recorded pending edge for the Epic-3-gated `/accounting-tutor` -> IFRS-guides link.
- **Do NOT invent scope.** Do not re-touch the reviewed/done spoke/hub `page.tsx` bodies to "complete" links that are already present. That would risk regressions on 7 done pages and violate additive-only (NFR4). Only add a link if Task 1 proves one is genuinely missing (create-story found none missing among the non-guide edges).

### The matrix (authoritative): required OUTBOUND edges

Source: `_bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)`.

| Page | Required outbound edges |
|---|---|
| homepage (Services.tsx) | 4 spokes (Learn-more) + `/cta-tutor` + `/pgda-tutor` (mention) |
| `/subjects` | 4 spokes + `/cta-tutor` + `/pgda-tutor` |
| `/accounting-tutor` | `/cta-tutor`, `/pgda-tutor`, `/subjects` (+ IFRS guides = PENDING, Epic 3) |
| `/financial-management-tutor` | `/cta-tutor`, `/pgda-tutor`, `/subjects` |
| `/tax-tutor` | `/cta-tutor`, `/pgda-tutor`, `/subjects` |
| `/auditing-tutor` | `/cta-tutor`, `/pgda-tutor`, `/subjects` |
| `/cta-tutor` | 4 spokes + `/pgda-tutor` |
| `/pgda-tutor` | 4 spokes + `/cta-tutor` |

Where "4 spokes" = `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`. No page links to itself. The matrix's "links in" are the mirror of these "links out" (e.g. `/subjects` receives an in-link from every spoke); asserting every page's outbound set covers all directed edges, so in-links need no separate assertion.

### Verified current state (create-story audit, 2026-07-11)

Confirmed on disk (grep + reading each file):

- **/accounting-tutor** (page.tsx ~L265-273): `/cta-tutor`, `/pgda-tutor`, `/subjects` present. (IFRS-guides edge absent = expected, pending.)
- **/financial-management-tutor** (~L265-273): `/cta-tutor`, `/pgda-tutor`, `/subjects` present.
- **/tax-tutor** (~L271-279): `/cta-tutor`, `/pgda-tutor`, `/subjects` present.
- **/auditing-tutor** (~L278-286): `/cta-tutor`, `/pgda-tutor`, `/subjects` present.
- **/cta-tutor** (~L154-207): all 4 spokes (data-array literal `href`) + `/pgda-tutor` present.
- **/pgda-tutor** (~L158-230): all 4 spokes (data-array literal `href`) + `/cta-tutor` present.
- **/subjects** (page.tsx `SUBJECTS`/`QUALIFICATIONS` arrays, rendered ~L137-188): all 4 spokes + `/cta-tutor` + `/pgda-tutor` present. NOTE: these use `<Link href={x.href}>`, so a literal-string grep misses them: render the page (as the test will) to verify.
- **homepage** (`Services.tsx`, Story 2.2, done): 4 spoke Learn-more links + Qualifications mention to both hubs present. Already guarded by `describe("Services homepage links")`.

Result: every required NON-guide edge is present. Only the guides edge is pending.

### The pending edge: /accounting-tutor -> IFRS guides (AC2, do NOT wire now)

The CAP-9 matrix says `/accounting-tutor` "additionally links to relevant IFRS guides (once CAP-8 releases them)". The guide pages `groups`, `ifrs-15`, `ifrs-16` are all `GUIDE_PUBLISH_STATUS: false` in `src/config/guides.ts` (Epic 3 has not run). In a **public (non-preview) build** the middleware redirects an unpublished `/guides/<id>` to the "Coming Soon" gate, so a live `<Link>` to it would dead-end: exactly what NFR7 forbids. Per AC2, **record it as pending and wire it on guide release (Story 3.3)**. Do not add the links in this story.

- `isGuidePublished(id)` gate lives in `src/config/guides.ts`; the guide-URL filter in `sitemap.ts` already keys off it (guide pages are absent from the sitemap while unpublished: this is why 3 sitemap.test failures are expected).
- When Epic 3 flips the flags: add `<Link href="/guides/ifrs-15" …>` + `<Link href="/guides/ifrs-16" …>` to `/accounting-tutor/page.tsx` and extend `internal-link-matrix.test.tsx` with those edges.

### The test to add (primary deliverable)

`acce-nextjs/tests/unit/internal-link-matrix.test.tsx`: a new, additive Vitest + Testing Library file:

- Mirror the import style of `render-smoke.test.tsx` (path alias `@/app/...`). Render each page component and assert its full required outbound edge set with `container.querySelector('a[href="<target>"]')` `.not.toBeNull()`.
- Prefer a data-driven structure: an array of `{ name, Component, edges }` and one `it` per page (or `it.each`). This makes the matrix the single source of truth in the test and gives a clear failure message naming the missing edge/page.
- HomePage and SubjectsPage each require the 6-edge set; the four spokes require 3 edges each; the two hubs require 5 edges each. Do not assert self-links. Do not assert the guides edge.
- This mounts the same components the render-smoke already mounts, so it inherits the RSC-render-500 safety net for free, but its job is edge completeness, not just "renders".

### Testing standards

- Vitest 3 + Testing Library; unit tests in `tests/unit/`. Run `npx vitest run` from `acce-nextjs/`.
- **Baseline to hold:** 43 pass / 3 pre-existing guide-route sitemap failures (Epic 3, `/guides/*` unpublished). The 3 failures are the `sitemap.test.ts` "pages missing from sitemap" assertion for the guide routes: expected and unrelated. Do NOT regress; the new matrix test adds passing assertions on top.
- Do NOT weaken any existing test. This is additive.
- e2e (`tests/e2e/smoke.spec.ts`) needs no change (no new routes; matrix targets all registered in Story 1.8). Playwright uses dedicated port 3100 with `reuseExistingServer: false` if run.

### Editorial rule (NFR6): no em dashes

Zero em dashes (`—`) in the new test file and the `deferred-work.md` addition (including comments). Use `->` (ASCII arrow) when describing an edge in a comment. Grep both before finishing (`grep -c ":"` = 0). No rendered marketing copy is added by this story, so the site-copy em-dash rule is not otherwise engaged here.

### Indentation

`tests/unit/*.tsx` currently use **2-space** indentation (see `render-smoke.test.tsx`). Match 2-space for the new test file. `deferred-work.md` is prose markdown.

### Project Structure Notes

- **New file:** `acce-nextjs/tests/unit/internal-link-matrix.test.tsx` (the matrix regression guard).
- **Edited:** `_bmad-output/implementation-artifacts/deferred-work.md` (pending-edge record).
- **Do NOT edit** (additive-only, AC3/NFR4): any `src/app/*/page.tsx` spoke/hub body, `src/components/Services.tsx`, `src/components/Navbar.tsx`, `src/app/page.tsx`, `src/app/sitemap.ts`, `src/config/guides.ts`, `src/middleware.ts`, `next.config.ts`. The only exception is if Task 1 finds a genuinely missing NON-guide edge (create-story found none), in which case add that one link minimally in place with a logged decision.
- No new route dirs, no new dependency, no new env var, no new config key, no new UI component.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3: Complete and verify the internal-link matrix]: the two AC groups: audit every new page's 2-4 in/out edges against the matrix; no dead links at release (NFR7); `/accounting-tutor` -> IFRS-guides recorded pending and wired on Epic 3 release.
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)]: the authoritative directed edge table + the four bullet rules (each spoke -> both hubs + `/subjects`; each hub -> 4 spokes + sibling hub; `/subjects` -> 4 spokes + both hubs; homepage Learn-more + Qualifications mention; `/accounting-tutor` -> IFRS guides once released).
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx]: the import pattern for all 7 page components + `HomePage`, the existing one-edge-per-page assertions (thin coverage this story hardens), the `describe("Services homepage links")` homepage-edge guard from Story 2.2, and the 43-pass / 3-pre-existing-fail baseline to hold. 2-space indentation to match.
- [Source: acce-nextjs/src/app/subjects/page.tsx]: `SUBJECTS`/`QUALIFICATIONS` arrays render outbound links via `href={x.href}` (all 4 spokes + both hubs); a literal-string grep misses them, render to verify.
- [Source: acce-nextjs/src/app/{cta-tutor,pgda-tutor}/page.tsx]: hubs render the 4 spoke links from a data array (literal `href="/accounting-tutor"` etc.) plus a `<Link>` to the sibling hub; full outbound set present.
- [Source: acce-nextjs/src/app/{accounting-tutor,financial-management-tutor,tax-tutor,auditing-tutor}/page.tsx (~L265-286)]: each spoke's `<Link href="/cta-tutor|/pgda-tutor|/subjects" className="text-accent hover:underline">` cross-links (the Epic 1 convention to mirror if a real gap needs filling).
- [Source: acce-nextjs/src/config/guides.ts]: `GUIDE_PUBLISH_STATUS` (groups/ifrs-15/ifrs-16 all false) + `isGuidePublished`; why the `/accounting-tutor` -> IFRS-guides edge is pending (Epic 3 gate) and must not be wired now (NFR7).
- [Source: _bmad-output/implementation-artifacts/2-2-add-homepage-links-into-the-new-pages.md]: sibling story (homepage edges, done); the scope split (2.1 navbar, 2.2 homepage, 2.3 full-matrix verify) and the reuse/no-em-dash/additive-only rules for Epic 2.
- [Source: _bmad-output/project-context.md#Additive-only / Testing]: additive-only (do not remove/restructure homepage or existing routes), single-shot release (no `<Link>` to an unbuilt/gated page at release), new routes covered by render smoke, no em dashes, match the edited file's indentation.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- autopilot-decisions.md entries 2026-07-11T14:59:45Z (story scoped as verification-and-guard, not new authoring; `/accounting-tutor` -> IFRS-guides handled as a pending edge)
- autopilot-decisions.md entries 2026-07-11T15:04:10Z (all edges re-verified on disk; data-driven test structure chosen)

### Completion Notes List

- Re-verified all required non-guide outbound edges on disk: all 4 spokes carry /cta-tutor + /pgda-tutor + /subjects; both hubs carry all 4 spokes + sibling hub; /subjects carries all 4 spokes + both hubs via SUBJECTS/QUALIFICATIONS data arrays; homepage carries all 4 spoke Learn-more links + both hub links via Services.tsx. No page.tsx edits required (AC3 satisfied).
- Created `acce-nextjs/tests/unit/internal-link-matrix.test.tsx` with a data-driven MATRIX array of 8 page specs (HomePage, SubjectsPage, 4 spokes, 2 hubs) asserting the full required outbound edge set. 8 tests pass, 1 it.todo marks the pending /accounting-tutor -> IFRS-guides edge (Epic 3 gate).
- Appended the `/accounting-tutor` -> IFRS-guides pending edge record to `deferred-work.md` (no em dashes in the new entry, AC4).
- Full suite result: 51 pass (43 baseline + 8 new matrix tests) / 3 pre-existing guide-route sitemap failures (Epic 3, unchanged) / 1 todo. No regressions. tsc: no new type errors.
- Additive-only: only new test file + deferred-work.md addition + story/sprint/decisions tracking files changed.

### File List

- acce-nextjs/tests/unit/internal-link-matrix.test.tsx (new)
- _bmad-output/implementation-artifacts/deferred-work.md (appended pending edge record)
- _bmad-output/implementation-artifacts/2-3-complete-and-verify-the-internal-link-matrix.md (story file)
- _bmad-output/implementation-artifacts/sprint-status.yaml (status updates)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (decision log entries)

## Change Log

- 2026-07-11: Story 2.3 implemented (dev-story, autopilot). Additive-only: created full internal-link matrix regression test asserting complete outbound edge set for all 8 pages/components; recorded /accounting-tutor -> IFRS-guides as deferred pending Epic 3 guide release. 51 unit tests pass, 3 pre-existing guide-route failures unchanged.

## Senior Developer Review (code-review, autopilot, 2026-07-11)

Adversarial review with FRESH reasoning (did not assume the dev step was correct). Outcome: **1 MEDIUM finding, fixed in-review -> done.**

### Findings

- **[MEDIUM, FIXED] Spoke `/subjects` edge was Navbar-satisfied (false-green risk).** Every page component renders `<Navbar/>`, whose desktop nav always emits `<a href="/subjects">`. The matrix test asserted edges with an unscoped `container.querySelector('a[href="..."]')`, so the four spoke pages' required `/subjects` edge was satisfied by the Navbar even if the in-body cross-link were dropped -- exactly the "a dropped edge stays green" failure AC1 exists to prevent (probed: AccountingTutorPage renders 2 `/subjects` anchors, only 1 in-body). The Radix Qualifications dropdown links (`/cta-tutor`,`/pgda-tutor`) are portal-lazy and absent from the initial render, and the Footer emits no matrix targets, so `/subjects` on spokes was the sole affected edge. Fix: added a `bodyEdgeCount(container, href)` helper that excludes anchors inside `nav`/`footer` and asserts `> 0` per edge, so every assertion now enforces the real page-body matrix edge (future-proof against any later chrome collision). Test-only change; additive-only (AC3/NFR4) preserved.

### AC verification (independent, on-disk)

- **AC1 (matrix enforced by machine test):** PASS after fix. All four spoke bodies genuinely carry `/cta-tutor`+`/pgda-tutor`+`/subjects` (grep-confirmed L265-286); both hubs carry 4 spokes + sibling hub; `/subjects` and homepage carry their 6-edge sets. Test now enforces each on the page body.
- **AC2 (pending IFRS-guides edge):** PASS. Not wired; recorded in `deferred-work.md` with the Story 3.3 wiring recipe.
- **AC3 (additive-only):** PASS. `git diff` vs baseline shows zero `src/`/`Services`/`Navbar`/`sitemap`/`next.config` changes; only the new test file + `deferred-work.md` + tracking files.
- **AC4 (no em dashes):** PASS. 0 em dashes in the new test file and in the added `deferred-work.md` lines (the one em dash in `deferred-work.md` is a pre-existing Story 1.1 entry, out of scope).
- **AC5 (baseline held):** PASS. `npx vitest run` = 51 pass / 3 pre-existing guide-route sitemap fails (Epic 3) / 1 todo. `npx tsc --noEmit` = no non-`.next/types` errors.

### Files changed by this review

- acce-nextjs/tests/unit/internal-link-matrix.test.tsx (hardened edge assertions to exclude Navbar/Footer chrome)
