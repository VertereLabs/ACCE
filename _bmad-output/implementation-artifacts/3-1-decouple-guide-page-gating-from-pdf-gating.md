---
baseline_commit: c9a6f8832e56e815f23d7b930264448d805f635d
---

# Story 3.1: Decouple guide page-gating from PDF-gating

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want independent page-published and PDF-published states per guide,
so that a guide page can go public while its PDF stays blocked.

## Acceptance Criteria

1. **Config: page state preserved, independent PDF state added.**
   Given `src/config/guides.ts`, when the gating config is defined, then the existing page state (`GUIDE_PUBLISH_STATUS` / `isGuidePublished`) is preserved unchanged, and an independent PDF state is added (`GUIDE_PDF_PUBLISH_STATUS` + an `isGuidePdfPublished(id)` helper), such that the two states are fully independent (a guide may be page-published while PDF-unpublished).

2. **Middleware: both maps mirrored, correct source per check.**
   Given `src/middleware.ts` (Edge runtime, cannot import the config), when a request is evaluated, then both maps are mirrored in the middleware: the `/guides/<id>` page check reads the **page** state (`GUIDE_PUBLISH_STATUS`), and the `/pdfs/<file>.pdf` check reads the **PDF** state (`GUIDE_PDF_PUBLISH_STATUS`, resolved via `PDF_TO_GUIDE`). The mirrored middleware map values match the config values (kept in sync by hand).

3. **No behavior change / additive only.**
   Given the current published states are unchanged in this story, when the app builds, then existing behavior is preserved (no guide flips live yet, no PDF changes state), and existing tests still pass. New tests are additive.

4. **Editorial floor.** Any new comments/strings added contain zero em dashes (`—`) (NFR6); indentation matches the surrounding 4-space style of both files (project-context editorial rule).

## Tasks / Subtasks

- [x] **Task 1: Add the PDF-published state to `src/config/guides.ts` (AC: #1, #4)**
  - [x] Add `export const GUIDE_PDF_PUBLISH_STATUS: Record<string, boolean>` with the SAME three keys as `GUIDE_PUBLISH_STATUS` (`groups`, `ifrs-15`, `ifrs-16`), ALL `false` (PDFs stay held; this story changes no live state).
  - [x] Add `export function isGuidePdfPublished(guideId: string): boolean` mirroring `isGuidePublished` EXACTLY: `if (isDev || isGuidesPreview) return true; return GUIDE_PDF_PUBLISH_STATUS[guideId] ?? false;` (same dev/preview unlock, same safe-default-false for unknown ids).
  - [x] Do NOT touch `GUIDE_PUBLISH_STATUS`, `isGuidePublished`, `isDev`, `isGuidesPreview`, or `anyGuidePublished`: they are the page-state contract and must stay byte-identical.
  - [x] Update the file's top doc-comment so it explains the now-two independent states (page vs PDF) without an em dash. The current comment says the page + PDF are blocked together; adjust to note they are now independent gates.

- [x] **Task 2: Mirror both maps in `src/middleware.ts` (AC: #2, #4)**
  - [x] Add a `GUIDE_PDF_PUBLISH_STATUS` const alongside the existing `GUIDE_PUBLISH_STATUS` (same three keys, all `false`), with a comment that it must stay in sync with `src/config/guides.ts`.
  - [x] Keep `PDF_TO_GUIDE` as-is (already maps pdf filename -> guide id).
  - [x] In the guide-page branch (`/guides/<id>`), keep reading `GUIDE_PUBLISH_STATUS` (page state): no change.
  - [x] In the PDF branch (`/pdfs/<file>.pdf`), change the check from `GUIDE_PUBLISH_STATUS[guideId]` to `GUIDE_PDF_PUBLISH_STATUS[guideId]` so the PDF gate reads the PDF state. This is the single behavioral wiring change; values are identical today so no live behavior changes (AC3).
  - [x] Preserve the dev/preview early-return, the `matcher` config, and the redirect target (`/guides`).

- [x] **Task 3: Extend the gating test contract (AC: #3)**
  - [x] In `tests/unit/guides-config.test.ts`, add coverage for `isGuidePdfPublished`: (a) all three PDFs are unpublished in the current shipped/production state; (b) unknown/empty ids return false; (c) flipping a PDF flag to `true` in isolation does not leak to other PDFs; (d) **independence**: `GUIDE_PUBLISH_STATUS[id]=true` while `GUIDE_PDF_PUBLISH_STATUS[id]=false` yields `isGuidePublished(id)===true` and `isGuidePdfPublished(id)===false` (the core AC1 guarantee). Restore mutated flags in `afterEach` (mirror the existing pattern which resets the three page flags).
  - [x] Add/extend the dev-branch test so `isGuidePdfPublished` also returns `true` under `NODE_ENV=development` (re-import with stubbed env, same pattern as the existing dev test).

- [x] **Task 4: Verify no regressions (AC: #3)**
  - [x] Run the unit suite (`npm test` / vitest). Confirm `guides-config.test.ts` passes and the pre-existing baseline is unchanged.
  - [x] Run `tsc` (or `next build` typecheck) and confirm no NEW type errors in the two touched files.

## Dev Notes

### What this story is (and is not)
- **Is:** a pure gating refactor in TWO files only: `src/config/guides.ts` and `src/middleware.ts`: plus additive tests. It splits today's single `GUIDE_PUBLISH_STATUS` gate (which controls BOTH the page and its PDF) into two independent gates so a guide **page** can be public while its **PDF** stays blocked.
- **Is NOT:** the conditional Download-PDF CTA (that consumes `isGuidePdfPublished` in the guide page components: **Story 3.2**), and NOT flipping any guide live (page or PDF state stays `false`: **Story 3.3**). Do not edit any `src/app/guides/**/page.tsx`, `Resources.tsx`, `guides/page.tsx`, `sitemap.ts`, or `next.config.ts`.

### Current state of the two files (read before editing)

**`src/config/guides.ts`** (4-space indent). Exports: `GUIDE_PUBLISH_STATUS` (`{groups:false, "ifrs-15":false, "ifrs-16":false}`), `isDev` (`NODE_ENV === "development"`), `isGuidesPreview` (`NEXT_PUBLIC_GUIDES_PREVIEW === "true"`), `isGuidePublished(id)` (dev/preview -> true, else `GUIDE_PUBLISH_STATUS[id] ?? false`), `anyGuidePublished()`. The page-state contract (`isGuidePublished`) is consumed by `Resources.tsx`, `src/app/guides/page.tsx`, and `sitemap.ts`: leaving it untouched keeps all three correct (AC3).

**`src/middleware.ts`** (4-space indent, Edge runtime). Has its OWN duplicated `GUIDE_PUBLISH_STATUS` (Edge cannot import the config: this duplication is intentional, see project-context). Has `PDF_TO_GUIDE` (`"groups-business-combinations.pdf" -> "groups"`, `"ifrs-15-revenue.pdf" -> "ifrs-15"`, `"ifrs-16-leases.pdf" -> "ifrs-16"`). The `middleware()` function: dev/preview early-returns `next()`; `/guides/<id>` -> redirect to `/guides` if page-unpublished; `/pdfs/<file>.pdf` -> redirect to `/guides` if guide-unpublished. `config.matcher = ["/guides/:path+", "/pdfs/:path*"]`.

### Target end-state (exact shape)

`config/guides.ts` additions (after the existing `isGuidePublished`, keep style consistent):
```ts
export const GUIDE_PDF_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

/** Returns true if the guide's downloadable PDF should be accessible to users. */
export function isGuidePdfPublished(guideId: string): boolean {
    if (isDev || isGuidesPreview) return true;
    return GUIDE_PDF_PUBLISH_STATUS[guideId] ?? false;
}
```

`middleware.ts`: add the mirrored `GUIDE_PDF_PUBLISH_STATUS` const, then in the PDF branch swap the read to it:
```ts
// Guide PDFs: /pdfs/<file>.pdf
const pdfMatch = pathname.match(/^\/pdfs\/([^/]+\.pdf)$/i);
if (pdfMatch) {
    const guideId = PDF_TO_GUIDE[pdfMatch[1].toLowerCase()];
    if (guideId && !GUIDE_PDF_PUBLISH_STATUS[guideId]) {
        return NextResponse.redirect(new URL("/guides", request.url));
    }
}
```
The `/guides/<id>` page branch keeps reading `GUIDE_PUBLISH_STATUS`: do not change it.

### Sync rule (critical, do not skip)
`GUIDE_PUBLISH_STATUS` **and now** `GUIDE_PDF_PUBLISH_STATUS` are duplicated in BOTH `config/guides.ts` and `middleware.ts` because the Edge-runtime middleware cannot import the config. Any value in either map must be mirrored by hand in both files. In this story every value is `false` in both: but the middleware's PDF-branch read MUST point at `GUIDE_PDF_PUBLISH_STATUS`, not the page map, or Story 3.2/3.3 will gate the PDF off the wrong state.

### Why the swap is safe today (AC3)
All six flags are `false` and both helpers apply the identical dev/preview unlock. So the PDF branch behaves byte-for-byte the same before and after the swap in every environment. The decouple only becomes observable once Story 3.3 flips a **page** flag to `true` while the matching **PDF** flag stays `false`: then the page is reachable but `/pdfs/<file>.pdf` still redirects. Add a test that proves this independence now (AC1), so the guarantee is locked before 3.3 relies on it.

### Testing standards
- Vitest 3 + Testing Library, tests live in `tests/unit/`. `NODE_ENV` under vitest is `"test"` (not `"development"`), so a top-level import of `@/config/guides` exercises the PRODUCTION branch: the existing file relies on this. The dev branch is covered by `vi.stubEnv("NODE_ENV","development")` + `vi.resetModules()` + dynamic `import()`; mirror that exact pattern for the `isGuidePdfPublished` dev test.
- Reset any map flag you mutate in `afterEach` (the existing suite resets the three page flags: add the three PDF flags to the reset, or add a second `afterEach` in a new `describe` block).
- `middleware.ts` has no existing unit test and testing Edge middleware in vitest is out of scope here; rely on the config-level tests plus a `tsc` pass. Do not add a middleware test harness (avoid scope creep).

### Project Structure Notes
- App root is `acce-nextjs/`. Paths above are relative to `acce-nextjs/src/...` and `acce-nextjs/tests/...`. Path alias `@/* -> ./src/*`.
- **Indentation:** both `config/guides.ts` and `middleware.ts` use **4-space** indent (project-context editorial rule: config/ and middleware.ts are 4-space). Match it.
- **No em dashes** in any comment/string you add or edit (NFR6). Use commas/colons/parentheses.
- Additive-only: no changes to `next.config.ts` headers, `output: 'standalone'`, existing routes, or homepage sections (NFR4).

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]: AC (page state preserved, independent PDF state, mirrored middleware, additive/no-behavior-change).
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory]: FR8 (decouple, exact identifiers `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished(id)`), plus FR10 (conditional CTA, Story 3.2) and FR9 (release, Story 3.3) as downstream consumers.
- [Source: _bmad-output/project-context.md#Guide publish-gating]: the decouple is pre-described: "add `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished(id)` in `config/guides.ts`, and mirror both maps (plus `PDF_TO_GUIDE`) in `middleware.ts`. Page check reads page state; `/pdfs/<file>.pdf` check reads PDF state." Also the two-files-in-sync rule and the 4-space indent rule.
- [Source: acce-nextjs/src/config/guides.ts]: current page-state contract to preserve.
- [Source: acce-nextjs/src/middleware.ts]: current Edge gate; PDF branch to re-point.
- [Source: acce-nextjs/tests/unit/guides-config.test.ts]: the existing gate test to extend (production + dev branch patterns, `afterEach` flag reset).
- [Source: acce-nextjs/src/app/guides/ifrs-16/page.tsx#L124-138]: where the Download-PDF CTA (`/pdfs/ifrs-16-leases.pdf`) lives, to be gated in Story 3.2 (context only, do not edit here).

### Note on `main` branch mirroring
project-context notes the guide-gating changes must also land on `main`'s `middleware.ts` (only `middleware.ts` differs between branches). That cross-branch backport is a release-time concern, NOT part of this story's dev work on `seo/epic-3`. Do not switch branches. Flagged here so it is not forgotten at merge/release.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Debug Log References
None. Implementation was straightforward: the story provided exact target code shapes in Dev Notes and both files were small. No unexpected issues encountered.

### Completion Notes List
- Task 1 (guides.ts): Added `GUIDE_PDF_PUBLISH_STATUS` const (same 3 keys, all false) and `isGuidePdfPublished(id)` helper mirroring `isGuidePublished` exactly. Updated doc-comment to describe two independent gates (em dashes in original bullet-point sigils replaced with colons per AC4/NFR6). `GUIDE_PUBLISH_STATUS`, `isGuidePublished`, `isDev`, `isGuidesPreview`, and `anyGuidePublished` are preserved byte-identical.
- Task 2 (middleware.ts): Added `GUIDE_PDF_PUBLISH_STATUS` const alongside the existing page map, with a sync comment. Swapped the PDF branch from reading `GUIDE_PUBLISH_STATUS[guideId]` to `GUIDE_PDF_PUBLISH_STATUS[guideId]`. Page branch unchanged. `PDF_TO_GUIDE`, dev/preview early-return, `matcher` config, redirect target all preserved.
- Task 3 (guides-config.test.ts): Added two new describe blocks (6 tests total): `isGuidePdfPublished: production behavior` (5 tests covering current-state blocked, unknown/empty safe-default, isolation, and AC1 independence) and `isGuidePdfPublished: development behavior` (1 test for dev-unlock via re-import + stubbed env). `afterEach` resets all 3 PDF flags. Import extended to include `GUIDE_PDF_PUBLISH_STATUS` and `isGuidePdfPublished`.
- Task 4 (verify): vitest 57 pass / 3 pre-existing guide-route sitemap failures (Epic 3 scope, unchanged) / 1 todo unchanged. `tsc --noEmit` produced zero new errors in touched files.

### File List
- acce-nextjs/src/config/guides.ts (modified: added GUIDE_PDF_PUBLISH_STATUS + isGuidePdfPublished, updated doc-comment)
- acce-nextjs/src/middleware.ts (modified: added GUIDE_PDF_PUBLISH_STATUS const, swapped PDF branch to read it)
- acce-nextjs/tests/unit/guides-config.test.ts (modified: added isGuidePdfPublished test coverage, 6 new tests)

## Review Findings

Code review 2026-07-11 (autopilot, fresh adversarial reasoning across Blind Hunter + Edge Case Hunter + Acceptance Auditor layers): CLEAN. Zero decision-needed, zero patch, zero defer, 2 dismissed as noise. No HIGH/MEDIUM findings.

- All 4 ACs re-verified with fresh reasoning. AC1: page-state contract byte-identical (diff touches only the doc-comment, no logic); GUIDE_PDF_PUBLISH_STATUS + isGuidePdfPublished added as fully independent map+helper; the page=true/pdf=false independence test locks the core guarantee. AC2: middleware page branch reads GUIDE_PUBLISH_STATUS, PDF branch reads GUIDE_PDF_PUBLISH_STATUS via PDF_TO_GUIDE, both mirrored maps all-false matching config. AC3: all 6 flags false + identical dev/preview unlock, so the PDF branch is byte-for-byte identical in every env; full vitest suite unchanged from baseline (57 pass / 3 pre-existing guide-route sitemap fails, Epic-3 scope / 1 todo) and tsc clean outside .next/types. AC4: the only 2 em dashes in the test file are on pre-existing lines (the isGuidePublished describe blocks), not in this diff; added blocks use colons; 4-space indent held.
- Dismissed (LOW, noise): (1) GUIDE_PDF_PUBLISH_STATUS is hand-duplicated across guides.ts + middleware.ts with no automated sync guard: inherent, pre-existing Edge-runtime constraint acknowledged in the story and project-context, not introduced here. (2) The unconditional Download-PDF CTA on guide pages is unchanged: explicitly Story 3.2 scope, and middleware still redirects /pdfs/*.pdf so no dead download can leak in a public build.
- No code patched (clean pass). Status set to done.

## Change Log
- 2026-07-11: Story 3.1 implemented. Decoupled guide page-gating from PDF-gating in guides.ts and middleware.ts. Added 6 additive unit tests confirming the independence guarantee (AC1). No live behavior change (all flags false, AC3).
- 2026-07-11: Code review (autopilot) CLEAN, all 4 ACs re-verified with fresh reasoning, 2 low observations dismissed, no HIGH/MEDIUM findings. Status review -> done.
