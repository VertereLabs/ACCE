---
baseline_commit: 15fb19d
---

# Story 3.3: Release the three reviewed guide pages (PDFs held)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the site owner,
I want the three reviewed guide pages (`groups`, `ifrs-15`, `ifrs-16`) public and indexed while their PDFs stay blocked,
so that real expert content becomes an E-E-A-T and internal-link asset without exposing PDFs still under review.

## Acceptance Criteria

1. **The three reviewed guide PAGES flip to page-published, in both mirrored maps.**
   Given the three guides Luke reviewed (`groups`, `ifrs-15`, `ifrs-16`), when the gating config is set, then `GUIDE_PUBLISH_STATUS[id]` is `true` for all three in **both** `src/config/guides.ts` **and** the mirrored `GUIDE_PUBLISH_STATUS` in `src/middleware.ts` (Edge runtime cannot import the config, so both copies must agree). In a public (non-preview) build the middleware no longer redirects `/guides/groups`, `/guides/ifrs-15`, `/guides/ifrs-16` (or their part pages) to the `/guides` Coming-Soon gate.

2. **The guide PDFs stay held.**
   Given `GUIDE_PDF_PUBLISH_STATUS` remains `false` for all three guides in **both** files (untouched), when I request any `/pdfs/<file>.pdf` for a released guide, then the middleware still redirects it to `/guides`, and each guide page's Download-PDF affordance stays hidden (the Story 3.2 `isGuidePdfPublished` guard). PDFs are not in the sitemap.

3. **Released guide URLs appear in the sitemap with no sitemap edit.**
   Given `src/app/sitemap.ts` already filters guide URLs on `isGuidePublished` / `anyGuidePublished`, when the page flags flip to `true`, then `/guides`, the three guide index routes, and their 17 part routes all appear in the generated sitemap. `sitemap.ts` is **not** edited (additive-by-config, NFR4). This also clears the three pre-existing `sitemap.test.ts` guide-route failures that have been red since Story 1.8.

4. **The `/accounting-tutor -> IFRS guides` matrix edge is wired (the pending Story 2.3 edge this release unblocks).**
   Given the `ifrs-15` and `ifrs-16` guide pages are now live (no longer redirecting in a public build), when `/accounting-tutor` renders, then it carries in-body `<Link href="/guides/ifrs-15">` and `<Link href="/guides/ifrs-16">` cross-links, and the `it.todo` in `tests/unit/internal-link-matrix.test.tsx` is fulfilled (the `AccountingTutorPage` edges array now includes `/guides/ifrs-15` and `/guides/ifrs-16`, and the `it.todo` marker is removed/replaced). No internal link points at an unbuilt or gated page at release (NFR7).

5. **Superseded "all guides hidden" test assertions are updated to the new release contract; the rest of the suite is unchanged.**
   Given the flip changes the vitest production-branch behavior (`NODE_ENV="test"` reads the maps directly), when the suite runs, then exactly the assertions that encode the OLD all-hidden state are updated to the new "three pages published, PDFs held" state (see Task 3 for the precise list), every other test is unchanged, and the full suite is GREEN (including the three formerly-failing sitemap guide-route assertions, which now pass). PDF-guard tests (render-smoke PDF arm, `isGuidePdfPublished` blocks) stay green untouched because PDF flags remain `false`.

6. **Reuse-only, additive, zero em dashes.**
   Given dark and light modes, when the changes ship, then no new palette/hue/component is introduced, no page section is removed or restructured, the two new `/accounting-tutor` links reuse the existing `text-accent hover:underline` cross-link style, indentation matches each edited file (4-space in `guides.ts`/`middleware.ts`/`accounting-tutor/page.tsx`; the test files follow their own 2-space style), and zero em-dash (`—`) characters are added.

## Tasks / Subtasks

- [x] **Task 1: Flip the three guide PAGE flags live in both mirrored files (AC: #1, #2, #3)**
  - [x] In `src/config/guides.ts`, set `GUIDE_PUBLISH_STATUS` to `{ groups: true, "ifrs-15": true, "ifrs-16": true }`. Leave `GUIDE_PDF_PUBLISH_STATUS` exactly as-is (all `false`).
  - [x] In `src/middleware.ts`, set the mirrored `const GUIDE_PUBLISH_STATUS` (L9-13) to the same three `true` values. Leave the mirrored `GUIDE_PDF_PUBLISH_STATUS` (L20-24) and `PDF_TO_GUIDE` untouched. The two `GUIDE_PUBLISH_STATUS` copies MUST match exactly (project-context "keep two files in sync" rule).
  - [x] Do NOT touch `sitemap.ts`, `isGuidePublished`/`isGuidePdfPublished` helper bodies, the middleware match/redirect logic, or `next.config.ts`. This is a data-only flag flip.

- [x] **Task 2: Wire the pending `/accounting-tutor -> IFRS guides` matrix edge (AC: #4, #6)**
  - [x] In `src/app/accounting-tutor/page.tsx`, add two in-body cross-links to the released IFRS guides. The natural home is the existing related-links card at ~L262-277 (the `<div className="bg-card rounded-xl border border-border p-6 mb-6">` that already links `/cta-tutor`, `/pgda-tutor`, `/subjects`). Add a sentence there linking `IFRS 15` -> `/guides/ifrs-15` and `IFRS 16` -> `/guides/ifrs-16`, using the SAME `<Link href="..." className="text-accent hover:underline">...</Link>` pattern already used in that card. `Link` is already imported (L3).
  - [x] Keep the copy natural and in Priyanka's first-person voice (e.g. a sentence like: "For the IFRS standards Accounting leans on most, see my " + IFRS 15 link + " and " + IFRS 16 link + " study guides."). No em dashes; use commas/parentheses.
  - [x] These two guide pages are now page-published (Task 1), so the links resolve in a public build and do NOT dead-end (NFR7 satisfied). Do NOT add a `/guides/groups` link (the matrix edge is only ifrs-15 + ifrs-16 per `page-catalog.md` / deferred-work.md).

- [x] **Task 3: Update the superseded test assertions to the release contract (AC: #4, #5)**
  - [x] **`tests/unit/internal-link-matrix.test.tsx`**: in the `MATRIX` array, extended the `AccountingTutorPage` entry's `edges` to also include `"/guides/ifrs-15"` and `"/guides/ifrs-16"`. Removed the `it.todo("accounting-tutor links to relevant IFRS guides once Epic 3 releases them")` block and its explanatory comment.
  - [x] **`tests/unit/guides-config.test.ts`**: updated `it("hides guides whose flag is false (current shipped state)")` to `it("publishes the three reviewed guides (released state)")`, setting all three flags to true in the test body and asserting `toBe(true)`. Left `afterEach` flag-reset intact; other `isGuidePublished` tests unchanged. No `isGuidePdfPublished` tests touched.
  - [x] **`tests/unit/render-smoke.test.tsx`** Resources block: updated both assertions and the describe-block doc-comment to reflect the released state: 3 Available badges (0 Coming Soon), deep-links present for groups and ifrs-16, index link still present. PDF arm (L60-85) unchanged.
  - [x] Do NOT change the render-smoke PDF arm (L60-85): unchanged, PDF flags remain false.

- [x] **Task 4: Verify the full suite is green and nothing else moved (AC: all)**
  - [x] Run unit suite: 61 pass / 0 fail / 0 todo. Three previously-failing sitemap.test.ts guide-route assertions now PASS with no sitemap edit. All updated tests pass.
  - [x] `tsc --noEmit`: no NEW type errors in touched files; only pre-existing stale `.next/types/validator.ts` admin/portal-route cache errors (unchanged baseline).
  - [x] Em-dash grep on touched files: 0 added (two pre-existing em dashes in guides-config.test.ts at describe block titles L19/57 are outside the diff and untouched).
  - [x] Sanity-check: `isGuidePublished` returns true for groups/ifrs-15/ifrs-16; `isGuidePdfPublished` returns false for all three (AC1-independence test still green).

## Dev Notes

### What this story is (and is not)
- **Is:** the RELEASE story. Flip the three reviewed guide PAGE flags to `true` in the two mirrored gating maps (`config/guides.ts` + `middleware.ts`), keep all PDF flags `false`, wire the one pending `/accounting-tutor -> IFRS-guides` matrix edge that this release unblocks, and update the handful of existing test assertions that encoded the pre-release "all guides hidden" state. Net effect: three real expert guide pages (17 part pages included) go public and indexable; every PDF stays gated.
- **Is NOT:** flipping any PDF flag (PDFs stay held by design, FR9/AC2), editing `sitemap.ts` (it filters on `isGuidePublished` already, AC3), re-implementing any helper, touching `next.config.ts`/security headers/`output: 'standalone'`, restructuring any page, adding a component/hue, or switching branches to backport `main`'s middleware (that is a release-time step, see below).

### The gating model (already built by Stories 3.1/3.2 — you only flip data)
- `src/config/guides.ts` holds two independent maps + helpers: `GUIDE_PUBLISH_STATUS` (page gate) and `GUIDE_PDF_PUBLISH_STATUS` (PDF gate), each with `isGuidePublished(id)` / `isGuidePdfPublished(id)`. Both helpers return `true` under dev or `NEXT_PUBLIC_GUIDES_PREVIEW=true`, else read the map with a safe `?? false` default.
- `src/middleware.ts` (Edge runtime) hand-mirrors BOTH maps plus `PDF_TO_GUIDE`. The `/guides/<id>` branch (L49-56) reads `GUIDE_PUBLISH_STATUS`; the `/pdfs/<file>.pdf` branch (L59-65) reads `GUIDE_PDF_PUBLISH_STATUS` via `PDF_TO_GUIDE`. **This is why the page flip must be applied in the middleware copy too** — otherwise the public build serves the page from Next but the middleware still 302s it to `/guides`.
- Story 3.2 already gated every on-page `/pdfs/<file>.pdf` download affordance (3 top-level cards + 17 part-page header links) behind `isGuidePdfPublished(id)`. Since PDF flags stay `false`, all those affordances remain HIDDEN after this release — a released page shows its content with NO download button. Correct and intended (AC2).

### Files being MODIFIED (read before editing; current state documented)

**`src/config/guides.ts` (L18-22)** — `GUIDE_PUBLISH_STATUS = { groups:false, "ifrs-15":false, "ifrs-16":false }`. Flip all three to `true`. `GUIDE_PDF_PUBLISH_STATUS` (L24-28) stays all-`false`. 4-space indent.

**`src/middleware.ts` (L9-13)** — mirrored `const GUIDE_PUBLISH_STATUS = { groups:false, "ifrs-15":false, "ifrs-16":false }`. Flip all three to `true` to match `guides.ts`. Mirrored `GUIDE_PDF_PUBLISH_STATUS` (L20-24) and `PDF_TO_GUIDE` (L27-31) stay untouched. 4-space indent.

**`src/app/accounting-tutor/page.tsx`** — server component; `Link` imported L3. Existing related-links card at ~L262-277 already renders `/cta-tutor`, `/pgda-tutor`, `/subjects` with `text-accent hover:underline`. Add the two IFRS-guide links here (Task 2). 4-space indent. No em dashes anywhere on this page (Story 1.2 shipped it em-dash-free).

**`tests/unit/internal-link-matrix.test.tsx`** — `MATRIX` array (L40-107); `AccountingTutorPage` edges at L68; `bodyEdgeCount` (L117-121) excludes nav/footer anchors so the assertion enforces the real in-body edge. `it.todo` for this exact edge at L136-142. 2-space indent (test files).

**`tests/unit/guides-config.test.ts`** — production-branch `isGuidePublished` tests L19-52; the "hides guides whose flag is false" test at L35-39 is the one that flips to the new contract. `afterEach` resets flags. The AC1-independence test (L106-116) already proves page-live + PDF-held and stays green. 2-space indent.

**`tests/unit/render-smoke.test.tsx`** — Resources block L248-266 encodes the old hidden state (2 assertions). `Resources.tsx` derives Available/deep-link from `isGuidePublished`. PDF arm L60-85 is PDF-gated (stays as-is). 2-space indent.

### Why the tests change is a contract update, not a regression (logged: medium)
Vitest runs with `NODE_ENV="test"` (NOT "development") and no preview env, so the top-level `@/config/guides` import exercises the PRODUCTION branch — the helpers read the maps directly (Stories 3.1/3.2 verified this repeatedly). Before this story, all page flags were `false`, so a whole family of tests asserted "every guide hidden": guides-config "hides guides whose flag is false", render-smoke Resources "Coming Soon for every guide" + "no deep-link", and the three `sitemap.test.ts` guide-route assertions FAILED because unpublished guides were filtered out of the sitemap while their `page.tsx` files exist on disk. Flipping the three page flags is the deliberate state change this story exists to make; the assertion edits ARE the new release contract. After the flip: guides become sitemap-registered (the 3 sitemap failures resolve with no sitemap edit), Resources shows Available + deep-links, and `isGuidePublished` returns true for the three. Not updating these would ship a red suite asserting a state the release intentionally left behind.

### The pending matrix edge this release owns (from Story 2.3, logged: medium)
Story 2.3 (done) audited the full hub<->spoke matrix and found every edge wired EXCEPT `/accounting-tutor -> /guides/ifrs-15` + `/guides/ifrs-16`. It could not wire that edge because those guide pages were gated (a public build would 302 the link target to Coming-Soon, violating NFR7). It recorded the edge as pending in `deferred-work.md` and left an `it.todo` in `internal-link-matrix.test.tsx`, both explicitly naming **Story 3.3** as the owner "when the guide flags flip to true". This story flips those flags, so it MUST wire the edge in the same release (NFR7 single-shot: no held matrix edge at release, and no later story owns it). `deferred-work.md` gives the exact link markup and test change; Task 2 + Task 3 follow it.

### Release-time step OUTSIDE this branch-local story (logged: medium — do NOT do it here)
project-context + epics note that the guide-gating change must ALSO land on `main`'s `middleware.ts` (only `middleware.ts` differs between the `seo/*` marketing branches and the `epic-6` portal branch). Stories 3.1 and 3.2 explicitly established "do NOT switch branches" — the backport is a **release-time deploy step**, not part of this dev-story. Do NOT `git checkout main` or edit any file outside `acce-nextjs/` on `seo/epic-3`. Record it as a release action; the human/release runbook (or Epic 4) applies the same `GUIDE_PUBLISH_STATUS` flip to `main`'s `middleware.ts` at merge/deploy time.

### Design-system / editorial guardrails (project-context)
- Reuse-only tokens; the two new `/accounting-tutor` links use the existing `text-accent hover:underline` cross-link style already in that card. No new hue/component/variant. Gold is `text-accent` (accent-ink), never raw `--accent`.
- Both modes: no visual change beyond the two added links (which inherit token-driven styling). Resources cards already theme correctly in both modes; flipping availability just swaps the badge text/deep-link, both already token-driven.
- **No em dashes (`—`)** in any added copy/comment. Use commas, colons, parentheses (NFR6).
- **4-space indentation** in `guides.ts`, `middleware.ts`, `accounting-tutor/page.tsx`; **2-space** in the three test files. Match each file.
- Content is hand-authored JSX + inline consts; editing copy = editing TSX.

### Testing standards
- Vitest 3 + Testing Library, tests in `tests/unit/`. Server components render synchronously. This story is the one that turns the suite fully green (resolving the 3 long-standing sitemap guide-route failures) — that is the signal it worked.
- No new test file is required; this is assertion updates + one edge-array extension + fulfilling one `it.todo`. The AC1-independence test in `guides-config.test.ts` already locks the page-live/PDF-held invariant.
- No middleware unit test (Edge middleware isn't tested in vitest here; Story 3.1 covered the gate logic). The existing e2e smoke (`tests/e2e/smoke.spec.ts`) continues to assert 200s.
- Baseline to reach: full vitest suite GREEN (previously 3 guide-route sitemap fails; those resolve here), render-smoke PDF arm unchanged (both arms), `tsc` no NEW errors.

### Previous story intelligence (Stories 3.1 & 3.2, both done)
- **3.1** added `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished` to `config/guides.ts` and mirrored both maps in `middleware.ts`; the PDF branch reads the PDF map. It verified vitest's `NODE_ENV="test"` exercises the production branch (maps read directly) — the reason THIS story's flag flip is observable in unit tests.
- **3.2** gated all 20 on-page `/pdfs/<file>.pdf` affordances behind `isGuidePdfPublished(id)`. Because 3.3 keeps PDF flags `false`, every one of those stays hidden on the newly-released pages — a released page renders content with no download button, exactly the "page live, PDF held" outcome.
- Editorial floor held across the epic: 4-space indent in config/middleware/guide files, zero em dashes, additive-only, per-file reversibility.

### Git intelligence (recent work patterns)
- `15fb19d` 3-2 code-review -> done; `bdc1134` 3-2 dev-story -> review; `de6b8d2` 3-1 code-review -> done. Commit convention: `bmad(seo/epic-3): <story-key> <stage> -> <status>`. Additive, per-file, test-guarded changes are the established rhythm; no new dependencies added in the epic. Branch `seo/epic-3`, cut from `seo/epic-2`.

### Project Structure Notes
- App root `acce-nextjs/`. Paths above are under `acce-nextjs/src/...` and `acce-nextjs/tests/unit/...`. Path alias `@/* -> ./src/*`.
- Branch: `seo/epic-3` (this story is dev'd there). Branch-local only; the `main` middleware backport is a release-time step (see above), NOT a code change in this story.
- Additive/data-only: the only logic-bearing edit is a Boolean flag flip in two mirrored maps; the rest is one page cross-link addition + test-assertion updates. No `next.config.ts`, `output: 'standalone'`, route, sitemap, or helper-body change.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3]: AC (flip reviewed guide pages published in config + mirrored middleware; PDFs stay blocked; sitemap needs no edit; only reviewed guides flip live).
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory]: FR9 (release reviewed guide pages, PDFs held, gated on content review; sitemap already filters on `isGuidePublished`), FR10 (conditional PDF CTA stays hidden while held), NFR4 (additive-only), NFR7 (single-shot release, no dead/held link at release).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2 / Story 2.3]: the `/accounting-tutor -> IFRS-guides` matrix edge is deferred to guide release (Story 3.3).
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#Deferred from create-story of 2-3]: exact wiring instruction for the pending edge (add `<Link href="/guides/ifrs-15">` + `<Link href="/guides/ifrs-16">` to `accounting-tutor/page.tsx`; extend `AccountingTutorPage` edges + remove the `it.todo`).
- [Source: _bmad-output/implementation-artifacts/3-2-conditional-download-pdf-cta-on-guide-pages.md]: PDF affordances gated behind `isGuidePdfPublished`; PDF flags all false -> stay hidden after release.
- [Source: _bmad-output/implementation-artifacts/3-1-decouple-guide-page-gating-from-pdf-gating.md]: two independent maps mirrored in config + middleware; vitest `NODE_ENV="test"` exercises the production branch.
- [Source: _bmad-output/project-context.md#Guide publish-gating]: `GUIDE_PUBLISH_STATUS` duplicated in `config/guides.ts` AND `middleware.ts`, any change mirrored by hand; `sitemap.ts` filters on `isGuidePublished` so flipping a page live needs no sitemap edit; PDFs never in sitemap; `main`'s `middleware.ts` backport at release.
- [Source: acce-nextjs/src/config/guides.ts#L18-28]: the two maps to edit (page) / leave (PDF).
- [Source: acce-nextjs/src/middleware.ts#L9-24]: mirrored maps; page branch L49-56, PDF branch L59-65.
- [Source: acce-nextjs/src/app/sitemap.ts#L8-13]: `isRouteIndexable` filters guide URLs on `isGuidePublished`/`anyGuidePublished` — no edit needed.
- [Source: acce-nextjs/src/components/Resources.tsx#L32-40, L77-99]: homepage Resources derives Available badge + deep-link from `isGuidePublished`.
- [Source: acce-nextjs/src/app/accounting-tutor/page.tsx#L262-277]: existing related-links card to extend with the two IFRS-guide links.
- [Source: acce-nextjs/tests/unit/internal-link-matrix.test.tsx#L66-68, L136-142]: `AccountingTutorPage` edges + the `it.todo` to fulfil.
- [Source: acce-nextjs/tests/unit/guides-config.test.ts#L35-39]: the "hides guides whose flag is false" assertion to flip to the released contract.
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx#L248-266]: the Resources "Coming Soon / no deep-link" assertions to flip to Available + deep-link.
- [Source: acce-nextjs/tests/unit/sitemap.test.ts#L74-91]: the two consistency tests that go GREEN once guides register.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent, 2026-07-11)

### Debug Log References
None — all four tasks passed cleanly on first attempt. Test run: 61 pass / 0 fail / 0 todo.

### Completion Notes List
- Task 1: Flipped `GUIDE_PUBLISH_STATUS` to all-true in `src/config/guides.ts` and the mirrored `src/middleware.ts`. `GUIDE_PDF_PUBLISH_STATUS` remains all-false in both files (PDFs held per AC2/FR9).
- Task 2: Added two in-body `<Link>` cross-links to `/guides/ifrs-15` and `/guides/ifrs-16` in the existing related-links card of `accounting-tutor/page.tsx` (~L262-277), using the same `text-accent hover:underline` style. Copy: "For the IFRS standards Accounting leans on most, see my IFRS 15 study guide and IFRS 16 study guide." No em dashes.
- Task 3: Updated three test files to reflect the released state: (a) `internal-link-matrix.test.tsx` — extended AccountingTutorPage edges to include `/guides/ifrs-15` and `/guides/ifrs-16`, removed `it.todo` block and stale comment; (b) `guides-config.test.ts` — renamed and updated the "hides guides" test to "publishes the three reviewed guides (released state)" with `toBe(true)` assertions, explicitly setting flags in the test body so the afterEach reset-to-false pattern still works for sibling tests; (c) `render-smoke.test.tsx` — updated Resources block: 3 Available badges (0 Coming Soon), deep-links present, doc-comment updated.
- Task 4: Full vitest suite: 61 pass / 0 fail / 0 todo. The three formerly-failing sitemap.test.ts guide-route assertions ("every content page.tsx on disk is registered in the sitemap") now PASS with no sitemap.ts edit (exactly as AC3 predicted). `tsc --noEmit`: no new errors in touched files; only pre-existing stale `.next/types/validator.ts` portal/admin cache errors. Em-dash grep: 0 added. PDF guard tests unchanged and green.
- Decision (medium): `guides-config.test.ts` afterEach resets flags to false (left intact per story instruction); "publishes the three reviewed guides" test explicitly sets all three flags to true in its body so it is independent of the afterEach pattern. This keeps all other tests in the describe block working with their false-baseline assumptions.

### File List
- acce-nextjs/src/config/guides.ts (modified: GUIDE_PUBLISH_STATUS all-true)
- acce-nextjs/src/middleware.ts (modified: mirrored GUIDE_PUBLISH_STATUS all-true)
- acce-nextjs/src/app/accounting-tutor/page.tsx (modified: added two IFRS-guide cross-links)
- acce-nextjs/tests/unit/internal-link-matrix.test.tsx (modified: AccountingTutorPage edges extended; it.todo removed)
- acce-nextjs/tests/unit/guides-config.test.ts (modified: "hides guides" test renamed and updated to release contract)
- acce-nextjs/tests/unit/render-smoke.test.tsx (modified: Resources block updated to released state)
- _bmad-output/implementation-artifacts/sprint-status.yaml (updated: 3-3 in-progress -> review)
- _bmad-output/implementation-artifacts/3-3-release-the-three-reviewed-guide-pages-pdfs-held.md (updated: tasks/status/dev-agent-record)

## Review Findings

Code review (autopilot, 2026-07-11) with FRESH adversarial reasoning (did not trust the dev step). Diff reviewed: `15fb19d..HEAD` (dev-story commit `59b996d`). Result: CLEAN, all 6 ACs re-verified, 0 HIGH/MEDIUM findings, 3 probes dismissed as noise. Status -> done.

- 0 `decision-needed`, 0 `patch`, 0 `defer`, 3 dismissed.
- **AC1** verified: both `GUIDE_PUBLISH_STATUS` maps (`src/config/guides.ts` + mirrored `src/middleware.ts`) flipped all-true and byte-match; middleware page branch (`guideId in GUIDE_PUBLISH_STATUS && !GUIDE_PUBLISH_STATUS[guideId]`) no longer 302s the three guides or their 17 part pages.
- **AC2** verified: both `GUIDE_PDF_PUBLISH_STATUS` maps untouched (all-false), `PDF_TO_GUIDE` intact; the `/pdfs/*.pdf` middleware branch still redirects; Story-3.2 `isGuidePdfPublished` affordance guards keep every download hidden on the released pages; no PDFs in sitemap.
- **AC3** verified: `sitemap.ts` UNEDITED; `isRouteIndexable` filters on `isGuidePublished`, so the flip auto-registers `/guides` + 3 guide index + 17 part routes; `sitemap.test.ts` now 6/6 green (the three long-standing guide-route failures red since 1.8 RESOLVED with no sitemap edit).
- **AC4** verified: two in-body `<Link>` cross-links to `/guides/ifrs-15` + `/guides/ifrs-16` added to the `/accounting-tutor` related-links card (`text-accent hover:underline`, reuse-only); `it.todo` removed and `AccountingTutorPage` edges extended; both targets now page-live, so NFR7 single-shot holds (no dead/gated internal link at release); `bodyEdgeCount` (nav/footer-excluded) assertion passes.
- **AC5** verified: exactly the superseded all-hidden assertions updated (`guides-config.test.ts` "publishes the three reviewed guides"; `render-smoke.test.tsx` Resources block: 3 Available / 0 Coming Soon + deep-links); PDF-guard arm (`render-smoke` L60-85) untouched and green; full suite 61 pass / 0 fail / 0 todo.
- **AC6** verified: reuse-only tokens, additive-only, `tsc` no new errors outside stale `.next/types`, 0 em dashes added (grep across the three non-test files).
- Probes dismissed: (1) `guides-config.test.ts` `afterEach` resets flags to false against a now-true source singleton = NOT cross-file pollution (vitest default `isolate: true` gives each test file its own module registry; sitemap/render-smoke read the true source in separate registries, all green); (2) `priority` non-boolean-attribute stderr = pre-existing Navbar/Hero warning, outside this diff; (3) `main`-branch `middleware.ts` backport intentionally deferred to a release-time deploy step (autopilot forbids branch switch).
