---
baseline_commit: de6b8d2eda5fd912bff484d47cee4945bc74c3bd
---

# Story 3.2: Conditional Download-PDF CTA on guide pages

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor on a guide page whose PDF is still held,
I want the Download-PDF button to be absent rather than dead-ending,
so that the page never offers a blocked download.

## Acceptance Criteria

1. **PDF CTA hidden when the PDF is unpublished.**
   Given a guide component that offers a `/pdfs/<file>.pdf` download, when `isGuidePdfPublished(<guideId>)` is `false`, then the "Download PDF" affordance does not render (it is guarded, not merely styled-off). No `<a href="/pdfs/...">` is emitted in the markup.

2. **PDF CTA renders when the PDF is published.**
   Given the same component, when `isGuidePdfPublished(<guideId>)` is `true` (either the config flag is flipped or the review/dev unlock is active), then the "Download PDF" affordance renders and links to the same `/pdfs/<file>.pdf` it links to today (which middleware still gates independently).

3. **All PDF affordances across the guide fleet are gated, not just the top-level CTA.**
   Given every guide component that currently emits a `/pdfs/<file>.pdf` link, when this story is complete, then all of them are wrapped in the `isGuidePdfPublished(<guideId>)` guard: the three top-level "Download Complete Guide" CTAs (`guides/groups`, `guides/ifrs-15`, `guides/ifrs-16`) AND the seventeen part-page header "PDF" links (`groups/part-1..7`, `ifrs-15/part-1..5`, `ifrs-16/part-1..5`). Each is keyed to its own guide id.

4. **Reuse existing styling, dual mode, zero em dashes, additive only.**
   Given dark and light modes, when the CTA (or its absence, or the optional "PDF coming soon" note) renders, then it reuses existing guide-page styling with no new palette/hue/component and contains zero em dashes (`—`). No page section is removed or restructured; the only change per file is wrapping the existing PDF affordance in the guard. Indentation matches the surrounding 4-space style of the guide `page.tsx` files.

5. **Test contract updated to the new conditional behavior.**
   Given `tests/unit/render-smoke.test.tsx` currently asserts a part-page PDF link is present (`a[href="/pdfs/ifrs-16-leases.pdf"]` on `IFRS16Part1Page`), when this story lands, then that assertion is updated to reflect the guarded contract (the PDF affordance is ABSENT in the default/production test env where `isGuidePdfPublished` returns false), and existing tests otherwise still pass (additive/adjusted only, no unrelated changes).

## Tasks / Subtasks

- [x] **Task 1: Gate the three top-level "Download Complete Guide" CTAs (AC: #1, #2, #3, #4)**
  - [x] In `src/app/guides/groups/page.tsx`, `import { isGuidePdfPublished } from "@/config/guides";` and wrap the entire "Download Full Guide" block (the `{/* Download Full Guide */}` `<div className="mt-8 bg-gradient-to-r ...">...</div>` containing `<a href="/pdfs/groups-business-combinations.pdf" download>`) in `{isGuidePdfPublished("groups") && ( ... )}`.
  - [x] In `src/app/guides/ifrs-15/page.tsx`, same pattern, guarding the block that contains `/pdfs/ifrs-15-revenue.pdf` with `isGuidePdfPublished("ifrs-15")`.
  - [x] In `src/app/guides/ifrs-16/page.tsx`, same pattern (block is at ~L124-142, contains `/pdfs/ifrs-16-leases.pdf`), guard with `isGuidePdfPublished("ifrs-16")`.
  - [x] Do NOT add a new palette/hue/component. Reuse the existing gradient card exactly as-is; only wrap it in the JSX conditional. Preserve the surrounding stats grid and header markup byte-for-byte outside the guard.

- [x] **Task 2: Gate the seventeen part-page header "PDF" links (AC: #1, #2, #3, #4)**
  - [x] For each part page, import `isGuidePdfPublished` and wrap the small header download `<a href="/pdfs/<file>.pdf" download className="inline-flex ... text-accent ...">...</a>` in `{isGuidePdfPublished("<guideId>") && ( ... )}`, keyed to that page's guide id.
  - [x] `groups/part-1` ... `groups/part-7` (7 files) -> guard key `"groups"`, href `/pdfs/groups-business-combinations.pdf`.
  - [x] `ifrs-15/part-1` ... `ifrs-15/part-5` (5 files) -> guard key `"ifrs-15"`, href `/pdfs/ifrs-15-revenue.pdf`.
  - [x] `ifrs-16/part-1` ... `ifrs-16/part-5` (5 files) -> guard key `"ifrs-16"`, href `/pdfs/ifrs-16-leases.pdf`.
  - [x] Wrap ONLY the PDF `<a>`; leave the adjacent "Part N of M" label and "Back to <guide>" link untouched. The surrounding `<div className="flex items-center gap-4">` stays; if you prefer, wrap the `<a>` alone so the layout collapses cleanly when it is absent.
  - [x] Do not introduce a "coming soon" note on the part pages (the header is a compact affordance; absence is the cleanest result). A coming-soon note is optional and, if used at all, belongs only on the three top-level CTAs.

- [x] **Task 3: Update the render-smoke test to the conditional contract (AC: #5)**
  - [x] In `tests/unit/render-smoke.test.tsx`, the block "A representative guide article renders" (~L60-68) currently asserts `container.querySelector('a[href="/pdfs/ifrs-16-leases.pdf"]')).not.toBeNull()`. Under vitest, `NODE_ENV="test"` (NOT "development") and `NEXT_PUBLIC_GUIDES_PREVIEW` is unset, so `isGuidePdfPublished("ifrs-16")` returns the production branch value `false` -> the PDF link is now ABSENT. Change that assertion to `.toBeNull()` (the guarded, held-PDF contract), keeping the heading assertion as-is.
  - [x] Optionally (recommended, additive) add a second `it(...)` that re-imports the component under `vi.stubEnv("NEXT_PUBLIC_GUIDES_PREVIEW", "true")` + `vi.resetModules()` + dynamic `import()` and asserts the PDF link IS present (mirrors the dev/preview re-import pattern in `tests/unit/guides-config.test.ts`). This proves both arms of AC1/AC2. If added, reset env in `afterEach`.
  - [x] Do NOT weaken or delete unrelated assertions; only the PDF-presence expectation changes shape.

- [x] **Task 4: Verify no regressions (AC: all)**
  - [x] Run the unit suite (`npm test` / vitest). The render-smoke PDF assertion now passes in its new (absent) shape; confirm the rest of the baseline is unchanged (the 3 pre-existing guide-route sitemap failures are Epic-3 scope and expected, per Stories 1.8/3.1).
  - [x] Run `tsc --noEmit` (or the build typecheck) and confirm no NEW type errors in the touched files.
  - [x] Grep the touched files for em dashes (`—`) and confirm zero (NFR6): any new/edited comment or the optional "coming soon" copy must use commas/colons/parentheses.

## Dev Notes

### What this story is (and is not)
- **Is:** wrapping every existing `/pdfs/<file>.pdf` download affordance across the guide fleet in an `isGuidePdfPublished(<guideId>)` guard so a held PDF is never offered as a dead-ending download. Twenty files: 3 top-level guide pages (large "Download Complete Guide" CTA) + 17 part pages (small header "PDF" link). Plus a one-assertion update to `render-smoke.test.tsx`.
- **Is NOT:** flipping any publish flag (Story 3.3 sets page/PDF state), touching `middleware.ts` / `config/guides.ts` / `sitemap.ts` (Story 3.1 already added `isGuidePdfPublished`; this story only CONSUMES it), or any marketing/homepage/Navbar change. No new component, hue, or design token.

### Scope decision (logged: medium)
The AC/FR10 name `src/app/guides/<id>/page.tsx`. The three top-level pages are the unambiguous target, but the 17 part pages carry the same `/pdfs/<file>.pdf` affordance and dead-end identically the moment Story 3.3 releases a page while its PDF stays held. Per the create-story "leave the system working end-to-end" rule, all 20 affordances are gated in this one story so 3.3's release cannot leak a fleet of redirecting downloads. This is additive and per-file reversible (delete a guard to restore the unconditional affordance). See `autopilot-decisions.md` (this story, scope entry).

### The consumed helper (already shipped by Story 3.1 — do not re-implement)
`src/config/guides.ts` already exports:
```ts
export function isGuidePdfPublished(guideId: string): boolean {
    if (isDev || isGuidesPreview) return true;   // dev OR NEXT_PUBLIC_GUIDES_PREVIEW=true
    return GUIDE_PDF_PUBLISH_STATUS[guideId] ?? false;  // groups/ifrs-15/ifrs-16 all false today
}
```
All three PDF flags are `false` in the shipped/production build, so in a public build every guarded affordance is HIDDEN. Under dev or `NEXT_PUBLIC_GUIDES_PREVIEW=true` (review path) the helper returns `true`, so reviewers still see and can test the downloads. This is a server-side call in a Server Component — no `"use client"` needed; the guide pages are all server components.

### Exact guide-id keys and PDF filenames (do not guess)
| Guide id (guard key) | PDF href | Top-level page | Part pages (each with a header PDF link) |
|---|---|---|---|
| `"groups"` | `/pdfs/groups-business-combinations.pdf` | `src/app/guides/groups/page.tsx` | `groups/part-1` … `part-7` (7) |
| `"ifrs-15"` | `/pdfs/ifrs-15-revenue.pdf` | `src/app/guides/ifrs-15/page.tsx` | `ifrs-15/part-1` … `part-5` (5) |
| `"ifrs-16"` | `/pdfs/ifrs-16-leases.pdf` | `src/app/guides/ifrs-16/page.tsx` | `ifrs-16/part-1` … `part-5` (5) |

These ids match both `GUIDE_PDF_PUBLISH_STATUS` and `PDF_TO_GUIDE` (via `middleware.ts`), so the on-page guard and the middleware gate agree.

### Files being MODIFIED (read before editing; current state documented)

**Top-level guide pages** — each has a `{/* Download Full Guide */}` block: an outer `<div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">` wrapping a heading ("Download Complete Guide"), a descriptive `<p>`, and a `<Button asChild variant="hero" className="shrink-0"><a href="/pdfs/<file>.pdf" download><Download .../>Download PDF</a></Button>`. Wrap the whole outer `<div>` in the guard so the entire card disappears when held (not just the button). Locations: `ifrs-16/page.tsx` ~L124-142, `ifrs-15/page.tsx` ~L124-142, `groups/page.tsx` ~L143-161.

**Part pages** — each has a header row `<div className="flex items-center justify-between mb-8 max-w-4xl">` containing a "Back to <guide>" `<Link>` and a `<div className="flex items-center gap-4">` holding the PDF `<a href="/pdfs/<file>.pdf" download className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"><Download className="w-3.5 h-3.5" />PDF</a>` plus a "Part N of M" label. Wrap ONLY the `<a>` in the guard; the label and back-link stay.

### The render-smoke test conflict (critical — handle in Task 3, logged: medium)
`tests/unit/render-smoke.test.tsx` L60-68 asserts the part-1 PDF link is PRESENT. Vitest runs with `NODE_ENV="test"` (Story 3.1 verified this) and no preview env, so `isGuidePdfPublished("ifrs-16")` returns `false` and the guarded link is now ABSENT. Leaving the old `.not.toBeNull()` assertion would turn the suite RED — but that is the CORRECT new behavior (public build hides held-PDF downloads), not a regression. Flip the assertion to `.toBeNull()`. This mirrors Story 3.1's reasoning that a top-level import of `@/config/guides` under vitest exercises the production branch. Optionally add a preview-env re-import test asserting presence, to lock both arms.

### Design-system / editorial guardrails (project-context)
- Reuse-only tokens; gold is `text-accent` (accent-ink), never raw `--accent`; `variant="hero"` is the single conversion CTA per view group (the existing Download button already is one — do not add a second). No new hue/component/variant.
- Must render in both dark (default) and light modes; the existing gradient card already is token-driven, so wrapping it in a conditional changes nothing about its theming.
- **No em dashes (`—`)** in any string/comment you add or in the optional "coming soon" note. Use commas/colons/parentheses.
- **4-space indentation** in all `src/app/guides/**/page.tsx` files (project-context editorial rule: `src/app/*/page.tsx` guides are 4-space). Match it.
- Content is hand-authored JSX + inline consts; no CMS/MDX. Editing copy = editing TSX.

### Testing standards
- Vitest 3 + Testing Library, tests in `tests/unit/`. Server components render synchronously here. The guides index (`src/app/guides/page.tsx`) already imports `isGuidePublished` from `@/config/guides` and renders fine under vitest, so importing `isGuidePdfPublished` into guide components is a proven, safe pattern.
- No new middleware test (out of scope; Story 3.1 covered the gate). No e2e change required for this story, though the existing e2e smoke (`tests/e2e/smoke.spec.ts`) continues to assert 200s.
- Baseline to hold: full vitest suite with the 3 pre-existing guide-route sitemap failures unchanged (Epic-3 scope) + the render-smoke PDF assertion passing in its new (absent) shape; `tsc` no NEW errors.

### Previous story intelligence (Story 3.1, done)
- 3.1 added `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished(id)` to `config/guides.ts` and mirrored both maps in `middleware.ts`; the PDF branch there now reads the PDF map. All flags are `false` (no live change). It explicitly flagged THIS story (3.2) as the consumer of `isGuidePdfPublished` in the guide page components, and pointed at `guides/ifrs-16/page.tsx#L124-138` as the CTA to gate.
- 3.1's key lesson reused here: vitest's `NODE_ENV="test"` exercises the PRODUCTION branch of the helpers (returns false with all flags false), which is exactly why the render-smoke assertion must flip to `.toBeNull()`.
- Editorial floor held across the epic: 4-space indent in config/middleware/guide files, zero em dashes.

### Git intelligence (recent work patterns)
- `de6b8d2` 3-1 code-review -> done; `2965389` 3-1 dev-story -> review; earlier commits are Epic 1/2 pages. Commit convention: `bmad(seo/epic-3): <story-key> <stage> -> <status>`. Additive, per-file, test-guarded changes are the established rhythm. No new dependencies added in the epic.

### Project Structure Notes
- App root `acce-nextjs/`. Paths above are `acce-nextjs/src/app/guides/...` and `acce-nextjs/tests/unit/...`. Path alias `@/* -> ./src/*`.
- Branch: `seo/epic-3` (this story is dev'd there). The guide-gating consumption is branch-local; no `main` backport is needed for 3.2 (only `middleware.ts` differs between branches, and this story does not touch middleware).
- Additive-only: no `next.config.ts`, `output: 'standalone'`, route, sitemap, config, or middleware changes.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]: AC (CTA hidden when `isGuidePdfPublished(id)` false; renders + links `/pdfs/<file>.pdf` when true; reuse styling, dual mode, zero em dashes).
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory]: FR10 (conditional Download-PDF CTA, CAP-8) — button renders only when `isGuidePdfPublished(id)` true, hidden while held.
- [Source: _bmad-output/implementation-artifacts/3-1-decouple-guide-page-gating-from-pdf-gating.md]: `isGuidePdfPublished` shipped and byte-verified; names THIS story as its consumer; documents the vitest production-branch behavior.
- [Source: _bmad-output/project-context.md#Guide publish-gating]: `NEXT_PUBLIC_GUIDES_PREVIEW=true`/dev unlocks everything for review; public build enforces the gate. Reuse-only design system; no em dashes; 4-space indent in guide/config files.
- [Source: acce-nextjs/src/config/guides.ts#L41-45]: the `isGuidePdfPublished` helper to consume (do not re-implement).
- [Source: acce-nextjs/src/app/guides/ifrs-16/page.tsx#L124-142]: top-level "Download Complete Guide" CTA block to gate (pattern identical in groups/ifrs-15).
- [Source: acce-nextjs/src/app/guides/ifrs-16/part-1/page.tsx#L32-44]: part-page header "PDF" link to gate (pattern identical across all 17 part pages).
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx#L60-68]: the PDF-presence assertion to flip to the guarded (`.toBeNull()`) contract.
- [Source: acce-nextjs/src/app/guides/page.tsx#L7]: precedent — a guide component already imports `isGuidePublished` from `@/config/guides`.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No debug issues. Implementation was additive-only: import + JSX conditional wrap per file. All 20 affordances gated in a single pass.

### Completion Notes List

- Gated 3 top-level "Download Complete Guide" cards (ifrs-16/page.tsx, ifrs-15/page.tsx, groups/page.tsx) with {isGuidePdfPublished("...") && (<div .../>)}, wrapping the entire gradient card.
- Gated 17 part-page header PDF links (5 ifrs-16, 5 ifrs-15, 7 groups) with {isGuidePdfPublished("...") && (<a .../>)}, wrapping only the anchor; the Part N of M label and back-link are untouched.
- Updated render-smoke.test.tsx: flipped .not.toBeNull() to .toBeNull() for the production-env (absent) arm; added optional preview-env dynamic-import test that asserts the link IS present (both arms of AC1/AC2 locked).
- vitest: 57 pass / 3 pre-existing guide-route sitemap failures (Epic-3 scope, unchanged) / 1 todo unchanged. Both new render-smoke tests pass.
- tsc: no NEW errors in touched files (pre-existing .next/types stale errors only).
- em-dash grep on newly added code: zero.
- 4-space indent preserved throughout; reuse-only tokens; no new component/hue/variant.

### File List

- acce-nextjs/src/app/guides/ifrs-16/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/page.tsx
- acce-nextjs/src/app/guides/groups/page.tsx
- acce-nextjs/src/app/guides/ifrs-16/part-1/page.tsx
- acce-nextjs/src/app/guides/ifrs-16/part-2/page.tsx
- acce-nextjs/src/app/guides/ifrs-16/part-3/page.tsx
- acce-nextjs/src/app/guides/ifrs-16/part-4/page.tsx
- acce-nextjs/src/app/guides/ifrs-16/part-5/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/part-1/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/part-2/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/part-3/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/part-4/page.tsx
- acce-nextjs/src/app/guides/ifrs-15/part-5/page.tsx
- acce-nextjs/src/app/guides/groups/part-1/page.tsx
- acce-nextjs/src/app/guides/groups/part-2/page.tsx
- acce-nextjs/src/app/guides/groups/part-3/page.tsx
- acce-nextjs/src/app/guides/groups/part-4/page.tsx
- acce-nextjs/src/app/guides/groups/part-5/page.tsx
- acce-nextjs/src/app/guides/groups/part-6/page.tsx
- acce-nextjs/src/app/guides/groups/part-7/page.tsx
- acce-nextjs/tests/unit/render-smoke.test.tsx
- _bmad-output/implementation-artifacts/3-2-conditional-download-pdf-cta-on-guide-pages.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/autopilot-decisions.md
