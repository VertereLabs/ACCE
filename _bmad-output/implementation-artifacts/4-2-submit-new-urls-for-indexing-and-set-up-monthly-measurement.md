---
baseline_commit: 20fc7f7ab39238e3565ddbde4eebdb6fcc049be2
---

# Story 4.2: Submit new URLs for indexing and set up monthly measurement

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the site owner,
I want each new URL submitted for indexing and its primary query tracked monthly,
so that I can tell whether the new architecture is moving rankings against the 2026-07-11 baseline.

## Context: what kind of story this is

This is an **operations / documentation story, not a code story.** The whole deliverable is a single new **measurement runbook** markdown doc committed to the repo. It touches **zero application code** (additive-only, NFR4).

Two of the acceptance actions, actually clicking "Request Indexing" in Google Search Console and running the live ClaudeSEO GSC snapshot, are **manual human actions** that require GSC credentials and the live production site (`https://accetutors.co.za`). A dev agent working in the repo cannot perform them. The story's job is therefore to produce the runbook that **drives** those human actions: the exact URL-submission checklist, the monthly measurement procedure (queries, baselines, snapshot source), and the first-snapshot record template. Luke ticks off the GSC clicks against that checklist and pastes the first live snapshot into the template.

The epics DoD makes this split explicit (see below): the **discrete/completable** part is the runbook authored + submission checklist in place + first-snapshot structure ready; the **recurring** month-over-month tracking and the "cta tutors ≤3" watch are "out of this story's closure".

## Acceptance Criteria

1. **A committed measurement runbook exists.** A new markdown runbook (recommended path `acce-nextjs/docs/seo-measurement-runbook.md`) is created and committed. It is the single source of truth for the SEO measurement process and is self-contained (a human with GSC access can run the whole monthly cycle from it with no other context).

2. **URL-submission checklist for every new URL.** The runbook lists **every new URL** to submit via GSC **URL Inspection → Request Indexing**, as an actionable checklist (one tickable line per URL). The set is exactly: `/subjects`, `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/cta-tutor`, `/pgda-tutor`, and each **released** guide page `/guides/groups`, `/guides/ifrs-15`, `/guides/ifrs-16` (page-published this epic; PDFs stay held, so **no** `/pdfs/*.pdf` and **no** guide **part** pages are in the submit list). Each is expressed as its absolute canonical URL (`https://accetutors.co.za` + path).

3. **Post-submission indexing-check procedure.** The runbook documents how to confirm each submitted URL is indexed and serving its **unique** title / H1 / schema: a `site:accetutors.co.za/<path>` check and/or GSC URL Inspection "URL is on Google" status, cross-referenced against the per-page expected title/H1/schema table (built from the page catalog, included in the runbook so the checker does not need the source).

4. **Monthly measurement runbook (queries, baselines, snapshot source).** The runbook documents the recurring monthly procedure: which primary query each page is tracked on, the **2026-07-11 baseline positions**, the snapshot source (the ClaudeSEO GSC snapshot pipeline), and how to read the GSC **"Top Pages by Search"** table to watch it grow from today's 2 URLs toward the full new-page set. Baselines that MUST appear verbatim: **accounting tutor = position 34**, **financial management tutor = position 27**, **cta tutors = position 3**.

5. **Flagship defend-and-expand watch.** The runbook names the flagship query **"cta tutors"** and states the standing goal explicitly: monthly position must **hold at ≤3 or improve** (defend-and-expand). It is called out as the one query that must never regress.

6. **First snapshot recorded (template + baseline row).** The runbook contains a dated **snapshot log** whose first row is the **2026-07-11 baseline snapshot** (the three baseline positions above, plus a note that the live GSC snapshot for the current month is to be pasted in by the owner). The template makes each future month a copy-the-row-and-fill-it operation. Recording the *live* current-month GSC numbers is a manual owner action (needs GSC access); the runbook's first row is the baseline and clearly marks where the live pull goes.

7. **Additive-only, house style.** No application code, config, route, sitemap, or dependency changes (NFR4). The runbook is em-dash-free per house style (NFR6: commas / colons / parentheses / two sentences; en dashes in numeric ranges like `24–48h` are fine). The existing vitest suite stays green (77 pass baseline) with zero app files touched.

## Tasks / Subtasks

- [ ] Task 1: Create the runbook file (AC: 1, 7)
  - [ ] Create `acce-nextjs/docs/seo-measurement-runbook.md` (create the `acce-nextjs/docs/` dir if only `acce-nextjs/docs/planning` exists today; it does).
  - [ ] Title it clearly (e.g. `# SEO Measurement Runbook: ACCE`, colon not em dash, since the runbook is em-dash-free per AC7) and add a one-paragraph purpose line: submit new URLs for indexing on release, then track each page's primary query monthly against the 2026-07-11 baseline.
  - [ ] Author the whole doc em-dash-free (NFR6). Use the `site:` / canonical URL forms as plain text.

- [ ] Task 2: URL-submission checklist section (AC: 2)
  - [ ] Add a "## One-time: submit new URLs for indexing (on release)" section.
  - [ ] Add a checkbox line per URL (`- [ ] https://accetutors.co.za/subjects`, etc.) for all 7 marketing pages + the 3 released guide index pages (exact list in Dev Notes). State the submission path: GSC → URL Inspection → paste URL → Request Indexing.
  - [ ] Add an explicit "NOT submitted" note: guide **PDFs** (`/pdfs/*.pdf`) and guide **part** pages are out (PDFs held this epic; sitemap advertises only guide index pages, part pages are crawl-reachable via internal links and do not need manual submission).

- [ ] Task 3: Indexing-check procedure + expected title/H1/schema table (AC: 3)
  - [ ] Add a "## Confirm each URL is indexed" section: for each submitted URL, run `site:accetutors.co.za/<path>` and/or GSC URL Inspection and confirm "URL is on Google".
  - [ ] Include the per-page expected **title / H1 / schema** table (values in Dev Notes, sourced from the page catalog and the live pages) so the checker can verify each URL serves its UNIQUE title/H1/schema (guards against duplicate-content / wrong-page-served).

- [ ] Task 4: Monthly measurement section (AC: 4, 5)
  - [ ] Add a "## Monthly measurement" section documenting: the tracked primary query per page (table in Dev Notes), the snapshot source = **ClaudeSEO GSC snapshot** pipeline, and the 3 verbatim baselines (accounting tutor 34, financial management tutor 27, cta tutors 3).
  - [ ] Document reading the GSC **"Top Pages by Search"** table and the growth target: from today's **2 URLs** toward the full new-page set (each new page earning its own impressions).
  - [ ] Call out the flagship watch: **"cta tutors" must hold ≤3 or improve** (defend-and-expand); flag it as the never-regress query.

- [ ] Task 5: Snapshot log with the first (baseline) row (AC: 6)
  - [ ] Add a "## Snapshot log" section with a dated table: columns = date, cta tutors pos, accounting tutor pos, financial management tutor pos, notes (+ a Top-Pages-count column).
  - [ ] First row = **2026-07-11** baseline: `cta tutors 3 · accounting tutor 34 · financial management tutor 27`, notes "baseline (pre-release positions); Top Pages = 2 URLs". Add a clearly-marked placeholder row/line for the owner to paste the current live GSC pull.
  - [ ] Add a short "how to add next month's row" instruction (copy the row, set the date, fill from the ClaudeSEO snapshot).

- [ ] Task 6: Verify (AC: 1, 6, 7)
  - [ ] `git status` shows exactly one new file under `acce-nextjs/docs/` and **zero** changes to `src/`, `tests/`, config, or `package.json`.
  - [ ] `grep -c $'—' acce-nextjs/docs/seo-measurement-runbook.md` returns 0 (no em dashes).
  - [ ] Re-run `npm run test` (from `acce-nextjs/`) to confirm the app suite is still green (77 pass) and untouched. `npx tsc --noEmit` unchanged. (These only prove no regression, since the story adds no code.)

## Dev Notes

### The exact URL set (AC2) — copy this into the checklist

All 7 marketing pages are live (Epic 1) and registered in `src/app/sitemap.ts` (`ROUTES`). The 3 guide **index** pages are page-published this epic (Story 3.3: `groups`, `ifrs-15`, `ifrs-16` = `true` in `GUIDE_PUBLISH_STATUS`, PDFs held). Submit exactly these 10 canonical URLs:

```
https://accetutors.co.za/subjects
https://accetutors.co.za/accounting-tutor
https://accetutors.co.za/financial-management-tutor
https://accetutors.co.za/tax-tutor
https://accetutors.co.za/auditing-tutor
https://accetutors.co.za/cta-tutor
https://accetutors.co.za/pgda-tutor
https://accetutors.co.za/guides/groups
https://accetutors.co.za/guides/ifrs-15
https://accetutors.co.za/guides/ifrs-16
```

- **BASE_URL** is `https://accetutors.co.za` (from `src/app/sitemap.ts` L4). Site canonicals in page metadata use a **trailing slash** (e.g. `/cta-tutor/`) while `sitemap.ts` entries have **no** trailing slash. For GSC URL Inspection either resolves to the same page; list them without a trailing slash to match the sitemap, and note in the runbook that the canonical is the trailing-slash form.
- **Do NOT submit**: `/pdfs/*.pdf` (PDFs held, middleware still 302s them), guide **part** pages (`/guides/*/part-N`, not individually critical to submit; they are in the sitemap and crawl-reachable). The story's URL set is the marketing pages + the 3 guide index pages, matching the epics DoD wording ("`/subjects`, the four spokes, `/cta-tutor`, `/pgda-tutor`, and each released guide page").

### Per-page: primary query + baseline + expected title/H1/schema (AC3, AC4)

Source: `_bmad-output/specs/spec-seo-page-architecture/page-catalog.md` (primary kw + title + H1 + schema per page) and the live page files under `acce-nextjs/src/app/*/page.tsx`. Note the **three tutor-page titles were cleaned in Story 4.1** (em dash → colon), so use the current colon-variant titles below, not the page-catalog's older em-dash form.

| URL | Primary query | 2026-07-11 baseline | Title (current, post-4.1) | H1 | Schema |
|---|---|---|---|---|---|
| `/accounting-tutor` | accounting tutor | **position 34** | `Accounting Tutor for CA(SA), PGDA & CTA \| ACCE Tutors` | Accounting Tutoring for CA(SA) Students | Service + FAQPage |
| `/financial-management-tutor` | financial management tutor | **position 27** | `Financial Management & Management Accounting Tutor \| ACCE` | Management Accounting & Finance Tutoring | Service + FAQPage |
| `/cta-tutor` | cta tutors | **position 3** (flagship) | `CTA Tutor: Certificate in Theory of Accounting \| ACCE` | CTA Tutoring (Certificate in Theory of Accounting) | Course + FAQPage |
| `/tax-tutor` | tax tutor | (no GSC baseline given) | `Tax Tutor: Taxation for PGDA & CTA \| ACCE Tutors` | Taxation Tutoring for PGDA & CTA | Service + FAQPage |
| `/auditing-tutor` | auditing tutor / audit tutor | (no GSC baseline given) | `Auditing Tutor for CA(SA) Students \| ACCE Tutors` | Auditing Tutoring | Service + FAQPage |
| `/pgda-tutor` | pgda tutor | (no GSC baseline given) | `PGDA Tutor: Postgraduate Diploma in Accounting \| ACCE` | PGDA Tutoring (Postgraduate Diploma in Accounting) | Course + FAQPage |
| `/subjects` | accounting subjects tutoring | (no GSC baseline given) | `Subjects We Tutor — Accounting, Tax, Audit & FM \| ACCE` *(verify on the live page: `/subjects` was authored colon/em-dash-free in Story 1.7, confirm the exact rendered title before pasting)* | Subjects We Tutor | BreadcrumbList |
| `/guides/groups` | (guide, no ranking baseline) | n/a | (from the guide page) | (guide H1) | guide schema |
| `/guides/ifrs-15` | (guide) | n/a | (from the guide page) | (guide H1) | guide schema |
| `/guides/ifrs-16` | (guide) | n/a | (from the guide page) | (guide H1) | guide schema |

- **Only three queries have a numeric GSC baseline** (accounting tutor 34, financial management tutor 27, cta tutors 3). Those are the three the epics/spec call out and the three the snapshot log's first row records. The other pages are tracked qualitatively (do they appear in Top Pages, are they indexed) until they earn a ranking position, then add them to the snapshot log.
- To fill the guide-page title/H1 cells, read the three guide index pages: `acce-nextjs/src/app/guides/groups/page.tsx`, `.../guides/ifrs-15/page.tsx`, `.../guides/ifrs-16/page.tsx` (grab the `<h1>` and the exported `metadata.title`). Verify `/subjects`' exact rendered title from `acce-nextjs/src/app/subjects/page.tsx` before pasting (do not trust the page-catalog string, which may predate edits).

### Snapshot source: the "ClaudeSEO GSC snapshot"

CAP-11 (spec + epics FR17) names the tracking pipeline as the **ClaudeSEO GSC snapshot**. Treat this as an **existing, external, manually-run** measurement pipeline (a GSC data pull the owner already runs, not something to build here). The runbook's job is to point the reader at it as the snapshot source and record its numbers monthly. Do **not** build a GSC API client, add a service account, or add any dependency: that is not this story (and the Google Indexing API is not even valid for these page types). If the pipeline's exact invocation is unknown to the dev agent, describe it as "run the ClaudeSEO GSC snapshot for the property `accetutors.co.za` and read the position for each tracked query" and leave the concrete command as an owner detail. Log any such assumption as a decision.

### Definition of Done split (from epics.md) — what closes this story

- **Done when (discrete/completable):** every new URL has a submission checklist entry (AC2); the indexing-check procedure + expected title/H1/schema table exist (AC3); the monthly runbook is documented with queries, baselines, and snapshot source (AC4/AC5); and the **first** snapshot (the 2026-07-11 baseline row) is recorded (AC6). Authoring the runbook to this completeness **closes the story** even though the physical GSC "Request Indexing" clicks and the live current-month snapshot are owner actions performed against the checklist.
- **Out of this story's closure (recurring ops):** the month-over-month tracking and the ongoing "cta tutors ≤3" watch continue after release; they are a runbook the owner runs, not a gate on closing 4.2.

> Interpretation note (logged, medium): the submission clicks and live snapshot need GSC credentials + the live site, which a repo dev agent lacks. The committable deliverable is the runbook that makes those human actions a rote checklist. This is the minimal-reasonable reading of an ops story per the autopilot contract, not a BLOCKED condition (no credential is *missing* for the deliverable, which is a markdown doc). See `autopilot-decisions.md` 2026-07-11T16:34:00Z.

### File location + house rules

- **Path:** `acce-nextjs/docs/seo-measurement-runbook.md`. `acce-nextjs/docs/` currently holds only `planning/`; add the file at that level (co-located with the app it measures). Root `docs/` is legacy BMAD/brand material; `_bmad-output/` is planning, not living ops. This is a low-risk placement decision (see log 2026-07-11T16:34:30Z); moving the file later is trivial.
- **Markdown only.** No frontmatter is required. Keep it scannable: `##` section headers, checkbox lists for the one-time submission, tables for the per-page data and the snapshot log.
- **Em-dash-free (NFR6):** commas / colons / parentheses / two sentences. En dashes in numeric ranges are fine. The new `tests/unit/no-em-dash.test.ts` guard (Story 4.1) scans **app source**, not `docs/`, so it will not police this file; keep it clean by hand.
- **Indentation:** not applicable (markdown). No app-code files are edited, so the 4-space/2-space source convention does not come up.

### Additive-only / no regressions (NFR4)

- Touch **only** the one new markdown file. Do NOT edit `src/app/sitemap.ts` (all routes already registered, Story 1.8), any `page.tsx`, `middleware.ts`, `config/guides.ts`, or `package.json`. There is no code deliverable.
- The existing `render-smoke`, `internal-link-matrix`, `sitemap`, `guides-config`, and `no-em-dash` tests must remain green and **unchanged**. This story adds no test (a docs-only artifact has nothing for vitest to assert; see log 2026-07-11T16:35:00Z). Verification is the AC checklist itself (all URLs present, baselines verbatim, snapshot source named, first row recorded).

### Testing standards

- No new automated test. Run the existing suite once (`npm run test` from `acce-nextjs/`) purely to confirm no regression: baseline is **77 pass / 0 fail / 0 todo** (Story 4.1 close). `npx tsc --noEmit`: no new errors (pre-existing stale `.next/types` errors, if any, are unrelated).
- Acceptance is verified by reading the runbook against ACs 2 to 6: is every one of the 10 URLs listed, are the three baselines present verbatim (34 / 27 / 3), is the snapshot source named, is "cta tutors ≤3" stated, is the 2026-07-11 first row present.

### Project Structure Notes

- App lives under `acce-nextjs/` (monorepo). The runbook goes under `acce-nextjs/docs/`. Run any `npm`/`grep`/`tsc` from inside `acce-nextjs/`.
- This is the **second and final build story of Epic 4** (SEO Hygiene & Measurement). Story 4.1 (site-wide em-dash cleanup) is `done`. After 4.2, epic-4 has an optional retrospective.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2: Submit new URLs for indexing and set up monthly measurement] — ACs + the DoD split (discrete deliverable vs. recurring ops)
- [Source: _bmad-output/planning-artifacts/epics.md#FR17] — "on publish, each new URL is submitted for indexing (URL Inspection → Request Indexing); each page's primary query is tracked monthly via the ClaudeSEO GSC snapshot against the 2026-07-11 baselines (accounting tutor 34, financial management tutor 27, cta tutors 3)"
- [Source: _bmad-output/specs/spec-seo-page-architecture/SPEC.md#CAP-11] — Measurement via the GSC pipeline; success = each URL submitted, primary queries tracked against baselines, new URLs appear in GSC "Top Pages by Search"
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md] — per-page primary keyword, title, H1, schema (note: tutor-page titles updated in Story 4.1 to colon form)
- [Source: acce-nextjs/src/app/sitemap.ts] — BASE_URL `https://accetutors.co.za`; the ROUTES list (all 7 marketing pages + guide URLs) confirming the live/registered set
- [Source: acce-nextjs/src/config/guides.ts] — `GUIDE_PUBLISH_STATUS` groups/ifrs-15/ifrs-16 = true (pages live), `GUIDE_PDF_PUBLISH_STATUS` all false (PDFs held) → the 3 guide index pages are submittable, no PDFs
- [Source: _bmad-output/implementation-artifacts/4-1-site-wide-em-dash-cleanup.md] — the three tutor-page titles' current colon form (post-cleanup), so the indexing-check table uses the right titles
- [Source: _bmad-output/project-context.md#Content & editorial rules] — no em dashes; en dashes in numeric ranges are fine

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (Sonnet 4.6)

### Debug Log References

- Em-dash check: `grep -c $'—' acce-nextjs/docs/seo-measurement-runbook.md` returned 0.
- Git status confirmed: only `acce-nextjs/docs/seo-measurement-runbook.md` created; zero src/app, tests/, config, or package.json changes.
- Vitest: 77 pass / 0 fail (baseline unchanged, no app files touched).
- All 6 tasks completed per story spec.

### Completion Notes List

- All 10 canonical URLs listed in the submission checklist (7 marketing pages + 3 released guide index pages).
- Three verbatim baselines present: accounting tutor = 34, financial management tutor = 27, cta tutors = 3.
- "cta tutors" flagship watch explicitly stated as hold at <=3 or improve.
- 2026-07-11 baseline row is the first entry in the snapshot log.
- Guide pages confirmed to have no JSON-LD schema; noted as "none (guide index page)" in the table.
- ClaudeSEO GSC snapshot named as the snapshot source (manual/external pipeline per CAP-11 / FR17).

### File List

- acce-nextjs/docs/seo-measurement-runbook.md (new)

## Review Findings

Code review (2026-07-11, autopilot, FRESH adversarial reasoning; did not trust the dev step): **CLEAN, resolved to `done`.** Zero HIGH/MEDIUM findings. Every AC re-verified against the actual source files, not the dev's word:

- **AC2:** All 10 canonical URLs present (7 marketing + 3 released guide index pages), no `/pdfs/*.pdf`, no guide part pages. Confirmed `GUIDE_PUBLISH_STATUS` groups/ifrs-15/ifrs-16 = `true` and `GUIDE_PDF_PUBLISH_STATUS` all `false` in `src/config/guides.ts`.
- **AC3:** Per-page title/H1/schema table checked cell-by-cell against live `page.tsx` files. All 7 tutor titles + H1s match byte-for-byte (post-4.1 colon form); 3 guide titles + H1s match; `/subjects` correctly uses the LIVE colon title (`Subjects We Tutor: ...`), NOT the page-catalog em-dash trap. Schema types grep-verified (Service+FAQPage / Course+FAQPage / BreadcrumbList / guides 0 JSON-LD = "none"). Canonical trailing-slash note accurate (`canonical: "/cta-tutor/"` vs sitemap no-slash).
- **AC4/AC5:** Three baselines verbatim (34 / 27 / 3); ClaudeSEO GSC snapshot named as source; Top-Pages-grows-from-2-URLs documented; flagship "cta tutors" hold-at-3-or-better / never-regress stated. Primary queries match `page-catalog.md` exactly.
- **AC6:** Snapshot log first row = 2026-07-11 baseline (3 / 34 / 27, Top Pages = 2) + clearly-marked OWNER placeholder row + copy-the-row instructions.
- **AC7:** Em-dash grep = 0, en-dash grep = 0. `git diff` touches only the runbook + planning artifacts, zero `src/`/`tests/`/config/`package.json`. Vitest 77 pass / 0 fail unchanged.

1 LOW observation dismissed as noise: runbook says middleware "returns 302" for `/pdfs/*` (actual `NextResponse.redirect` default is 307); it is a parenthetical rationale, the exclusion instruction is correct regardless, no owner action changes. No patches applied.
