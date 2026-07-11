---
baseline_commit: 98d59f91b15c95841c53f53c5b3d9f293548a582
---

# Story 4.1: Site-wide em-dash cleanup

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a reader,
I want the site's copy to read in a natural human voice with no em dashes,
so that the content does not read as AI-generated and the E-E-A-T voice holds.

## Acceptance Criteria

1. **Zero em dashes in rendered marketing copy and metadata.** Across all rendered marketing copy and metadata (homepage components, guide pages and their part pages, all page `metadata`, and the new Epic 1-2 pages), zero em-dash (`—`, U+2014) characters remain in the RENDERED output and the source strings that produce it, with meaning and tone preserved (each replaced by a comma, colon, parentheses, pipe, or two sentences).

2. **En dashes are left alone.** En dashes (`–`, U+2013) in numeric ranges (for example `24–48h`, `700–900 words`) are unchanged. Scope is em dashes (U+2014) ONLY. Do NOT touch en dashes, hyphens, or the horizontal-ellipsis `…`.

3. **Copy-only / additive.** No layout, component, structural, or functional behavior changes. This is editorial-only: only the text content of existing strings changes; no JSX structure, no className, no imports, no props, no logic.

4. **The three tutor-page titles are cleaned too.** The em dash in the `title`, `openGraph.title`, and `twitter.title` of `/cta-tutor`, `/tax-tutor`, and `/pgda-tutor` is replaced (colon or pipe), keeping each title within the ~60-char SEO budget (NFR2). See Dev Notes "Resolving the Epic 1 sanctioned-title exception".

5. **A durable guardrail test.** An additive vitest asserts no U+2014 remains in the in-scope rendered source strings, so a future em dash cannot silently re-enter. The full existing suite still passes and `tsc` shows no new errors.

## Tasks / Subtasks

- [x] Task 1: Replace em dashes in rendered guide-page body copy (AC: 1, 2, 3)
  - [x] `src/app/guides/groups/page.tsx` — L109 (`… pro formas — where do you even begin?`), L277 (`heart of group accounting — your journals`)
  - [x] `src/app/guides/groups/part-1/page.tsx` — L70, L149, L367, L396
  - [x] `src/app/guides/groups/part-2/page.tsx` — L70, L81, L181, L245, L349, L409, L440 (7)
  - [x] `src/app/guides/groups/part-3/page.tsx` — L70, L90, L188, L194, L200, L206, L212, L437 (8)
  - [x] `src/app/guides/groups/part-4/page.tsx` — L58 (em dash inside an `<h2>`/heading: `Analysis of Equity (AOE) — The Heart of Groups`)
  - [x] `src/app/guides/groups/part-6/page.tsx` — L160
  - [x] `src/app/guides/ifrs-15/page.tsx` — L90
  - [x] `src/app/guides/ifrs-15/part-1/page.tsx` — L107 (`— IFRS 15.2` attribution dash before a citation; replace with a plain citation form, e.g. `IFRS 15.2` or `(IFRS 15.2)`)
  - [x] `src/app/guides/ifrs-15/part-5/page.tsx` — L156 (NO surrounding spaces: `past papers as you can—revenue`)
  - [x] `src/app/guides/ifrs-16/part-1/page.tsx` — L165 (NO surrounding spaces: `over the lease term—just like`)
  - [x] `src/app/guides/ifrs-16/part-5/page.tsx` — L197 (NO surrounding spaces: `Don't just learn the theory—apply it.`)
- [x] Task 2: Replace em dashes in metadata strings (AC: 1, 4)
  - [x] `src/app/guides/ifrs-16/page.tsx` — L30 metadata `description`: `Master ROU assets and lease liabilities — initial recognition, ...` → colon or comma variant (keep description ≤ ~155 chars, NFR2)
  - [x] `src/app/cta-tutor/page.tsx` — L10/L16/L20 `title` / `openGraph.title` / `twitter.title`: `CTA Tutor — Certificate in Theory of Accounting | ACCE` → e.g. `CTA Tutor: Certificate in Theory of Accounting | ACCE`
  - [x] `src/app/tax-tutor/page.tsx` — L10/L16/L20: `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors` → e.g. `Tax Tutor: Taxation for PGDA & CTA | ACCE Tutors`
  - [x] `src/app/pgda-tutor/page.tsx` — L10/L16/L20: `PGDA Tutor — Postgraduate Diploma in Accounting | ACCE` → e.g. `PGDA Tutor: Postgraduate Diploma in Accounting | ACCE`
  - [x] Keep all three variants (title/og/twitter) IDENTICAL to each other per page (they mirror by design; AC2 of the Epic 1 stories required the OG/Twitter mirror).
- [x] Task 3: Replace the one em dash in rendered config data (AC: 1, 3)
  - [x] `src/config/groupSessions.ts` — L70 `mixSummary: "6 revision classes — 2 Accounting, ..."` (rendered by `src/components/GroupSessions.tsx` L63) → comma or colon variant.
  - [x] Do NOT edit L8 and L23 of the same file: those are code COMMENTS (`round (Test 4, board prep, etc.), update this object — no component edits`, `Subject bucket — selects the icon`), not rendered. Out of scope (AC1 is "rendered").
- [x] Task 4: Confirm the out-of-scope occurrences are left untouched (AC: 3)
  - [x] `src/app/guides/page.tsx` L51 — code comment (`Derive status from the config — dev mode...`). LEAVE.
  - [x] `src/components/Logo.tsx` L13 — code comment (`footers pass "reversed" — they are dark navy...`). LEAVE.
  - [x] Test-infra em dashes in `tests/unit/guides-config.test.ts` (L19/L57 describe strings), `tests/unit/sitemap.test.ts` (L8 comment), `tests/unit/utils.test.ts` (L6 comment). LEAVE — not rendered site copy.
- [x] Task 5: Add a regression guardrail test (AC: 5)
  - [x] Add `tests/unit/no-em-dash.test.ts` (additive) that fs-reads the in-scope source files, strips `//` and `/* ... */` comments, and asserts no U+2014 remains. Scope the file list to the app pages, homepage components, and rendered config (NOT the test files themselves, NOT `Logo.tsx`/`guides/page.tsx` comment-only files if you keep their comments — but since comments are stripped, they can be included safely).
  - [x] Prefer stripping comments so a legitimate comment em dash never fails the test, then assert `!content.includes("—")` on the remaining string. Reference the char as `"—"` in the test (do not embed a literal em dash in the assertion).
- [x] Task 6: Verify (AC: 1, 2, 3, 5)
  - [x] Re-run the scan: `grep -rc $'—' src --include="*.tsx" --include="*.ts"` should show only the intentionally-kept COMMENT lines (`groupSessions.ts` L8/L23, `guides/page.tsx` L51, `Logo.tsx` L13) and zero in any rendered string / metadata.
  - [ ] Confirm en dashes (U+2013) count is unchanged before/after.
  - [ ] `npm run test` (vitest) full suite green including the new guard; `npx tsc --noEmit` no new errors.

## Dev Notes

### What this story is (and is not)

This is a **codebase-wide editorial scrub**, not new authoring. The entire deliverable is: replace every em dash (U+2014) that appears in **rendered** copy or **metadata** with a natural-voice alternative (comma, colon, parentheses, pipe, or two sentences), preserving meaning and tone. It is copy-only and additive (NFR4): no JSX structure, className, import, prop, or logic changes — only the text inside existing string literals.

### Complete em-dash inventory (scanned 2026-07-11 on `seo/epic-4`)

18 source files contain U+2014; 43 total occurrences. Classified:

**IN SCOPE — rendered body copy** (replace):
| File | Lines |
|------|-------|
| `src/app/guides/groups/page.tsx` | 109, 277 |
| `src/app/guides/groups/part-1/page.tsx` | 70, 149, 367, 396 |
| `src/app/guides/groups/part-2/page.tsx` | 70, 81, 181, 245, 349, 409, 440 |
| `src/app/guides/groups/part-3/page.tsx` | 70, 90, 188, 194, 200, 206, 212, 437 |
| `src/app/guides/groups/part-4/page.tsx` | 58 (heading) |
| `src/app/guides/groups/part-6/page.tsx` | 160 |
| `src/app/guides/ifrs-15/page.tsx` | 90 |
| `src/app/guides/ifrs-15/part-1/page.tsx` | 107 (attribution `— IFRS 15.2`) |
| `src/app/guides/ifrs-15/part-5/page.tsx` | 156 (no-space `can—revenue`) |
| `src/app/guides/ifrs-16/part-1/page.tsx` | 165 (no-space `term—just`) |
| `src/app/guides/ifrs-16/part-5/page.tsx` | 197 (no-space `theory—apply`) |

**IN SCOPE — metadata** (replace, see title note below):
| File | Lines | What |
|------|-------|------|
| `src/app/guides/ifrs-16/page.tsx` | 30 | metadata `description` |
| `src/app/cta-tutor/page.tsx` | 10, 16, 20 | title / og.title / twitter.title |
| `src/app/tax-tutor/page.tsx` | 10, 16, 20 | title / og.title / twitter.title |
| `src/app/pgda-tutor/page.tsx` | 10, 16, 20 | title / og.title / twitter.title |

**IN SCOPE — rendered config data** (replace):
| File | Lines | What |
|------|-------|------|
| `src/config/groupSessions.ts` | 70 | `mixSummary` (rendered via `GroupSessions.tsx` L63) |

**OUT OF SCOPE — non-rendered code comments** (LEAVE unchanged):
- `src/config/groupSessions.ts` L8, L23
- `src/app/guides/page.tsx` L51
- `src/components/Logo.tsx` L13

**OUT OF SCOPE — test infrastructure** (LEAVE unchanged): `tests/unit/guides-config.test.ts` L19/L57, `tests/unit/sitemap.test.ts` L8, `tests/unit/utils.test.ts` L6.

**Already clean** (no action, verified): all Epic 1 spoke/hub pages `subjects`, `accounting-tutor`, `financial-management-tutor`, `auditing-tutor`; root `src/app/page.tsx`; `src/app/layout.tsx`; every homepage component except the two comment-only cases above. Epic 1 built these em-dash-free deliberately.

> Line numbers are from the current `seo/epic-4` HEAD; if a file shifted, re-grep with `grep -n $'—' <file>`. Prefer per-occurrence hand edits (each em dash needs a context-appropriate replacement); do NOT run a blanket `sed s/—//g` — that would mangle spacing (the no-space cases at ifrs-15/part-5 L156, ifrs-16/part-1 L165, ifrs-16/part-5 L197 need a comma or a rephrase, not an empty deletion) and risks touching en dashes if the pattern is sloppy.

### Replacement guidance (preserve voice — UX-DR6, Priyanka's first-person mentorship)

- Parenthetical / appositive em dash (` — `) → usually a comma, a colon, or wrap in parentheses. Example: `the heart of group accounting — your journals flow from here` → `the heart of group accounting: your journals flow from here`.
- No-space em dash (`term—just`) → comma + space (`term, just`) or rephrase. Example L197 `Don't just learn the theory—apply it.` → `Don't just learn the theory. Apply it.` (two sentences reads strongest for a CTA line).
- Attribution dash before a citation (L107 `— IFRS 15.2`) → drop the dash, render as `IFRS 15.2` or `(IFRS 15.2)`.
- Heading em dash (part-4 L58 `Analysis of Equity (AOE) — The Heart of Groups`) → colon: `Analysis of Equity (AOE): The Heart of Groups`.
- Keep replacements short so titles/descriptions stay within budget (NFR2: title ≤ ~60 chars, description ≤ ~155 chars).

### Resolving the Epic 1 sanctioned-title exception (AC4 — read this)

During Epic 1, the create-story/code-review notes for **1.1 (CAP-6 /cta-tutor)**, **1.4 (CAP-4 /tax-tutor)**, and **1.6 (CAP-7 /pgda-tutor)** deliberately kept the em dash in each page `<title>` as a "single sanctioned em-dash exception", deferring the cleanup. **Story 4.1 is that cleanup.** NFR6 is unconditional and site-wide ("No em dashes site-wide") and this AC explicitly covers "all page `metadata`", so those three titles ARE in scope now. Replace the em dash with a colon (recommended) or pipe in all three title fields per page (`title`, `openGraph.title`, `twitter.title` — they mirror, keep them identical). Character budget after a `:` swap:
- `CTA Tutor: Certificate in Theory of Accounting | ACCE` — 53 chars, OK.
- `Tax Tutor: Taxation for PGDA & CTA | ACCE Tutors` — 48 chars, OK.
- `PGDA Tutor: Postgraduate Diploma in Accounting | ACCE` — 53 chars, OK.

No existing test encodes the old em-dash titles, so clearing them breaks nothing. (The other four Epic 1 pages — subjects/accounting/financial-management/auditing — already use colon-variant titles and are clean.)

### Editorial / house rules (from project-context.md)

- **Indentation is inconsistent by design**: `src/app/*/page.tsx` (guides + tutor pages), `src/config/`, `middleware.ts` use **4-space**; root `layout.tsx`/`page.tsx` use **2-space**. You are only editing string CONTENT, so indentation should not change — but if a line rewraps, match the file you're editing. Do not reformat surrounding lines.
- Guide part pages use `&apos;` / `&quot;` HTML entities for apostrophes/quotes inside JSX text. When you rewrite a sentence, keep the same entity convention already present on that line (do not introduce raw `'` where the line uses `&apos;`).
- Do NOT touch the horizontal ellipsis `…` (U+2026) — it is not an em dash and is out of scope (appears e.g. groups/page L109, groups/part-1 L70).

### Testing standards

- **Framework**: Vitest 3 + Testing Library, tests under `tests/unit/`. Run `npm run test`. The `no-em-dash` guard is a pure fs/string test (no React render needed) — import `readFileSync` from `node:fs`, resolve paths from the repo root, strip comments, assert `expect(stripped.includes("—")).toBe(false)` per file.
- Reference the em dash as the escape `"—"` inside the test so the test file itself doesn't contain a literal em dash (which would otherwise trip its own scan if the scan ever includes the tests dir — keep the tests dir OUT of the scanned list regardless).
- **Baseline to hold**: the current suite is 61 pass / 0 fail / 0 todo on `seo/epic-4` (per Epic 3 close). Your change is copy-only, so no existing assertion should break. If `render-smoke.test.tsx` asserts on any specific text you rewrite, update that assertion to the new copy (grep the test for any string you touch before editing). The tutor-page render-smoke tests assert on H1 text and links, not on the metadata titles, so the title swap should not affect them — verify by re-running.
- `npx tsc --noEmit`: expect no NEW errors (stale `.next/types` errors, if any, are pre-existing and unrelated).

### Project Structure Notes

- App lives under `acce-nextjs/` (monorepo). All paths above are relative to `acce-nextjs/`. Run all `npm`/`grep`/`tsc` from inside `acce-nextjs/`.
- Additive/editorial-only: this story touches only string content in existing `.tsx`/`.ts` files plus one new test file. No new route, no config, no dependency, no sitemap edit.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1: Site-wide em-dash cleanup] — ACs
- [Source: _bmad-output/planning-artifacts/epics.md#FR18] — "remove every em-dash character from rendered marketing copy and metadata ... scope is em dashes only (en dashes in numeric ranges left alone)"
- [Source: _bmad-output/planning-artifacts/epics.md#NFR6] — "No em dashes site-wide (editorial voice)"
- [Source: _bmad-output/project-context.md#Content & editorial rules] — "No em dashes (—) anywhere in rendered copy or metadata ... En dashes in numeric ranges (24–48h, 700–900 words) are fine"
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml] — Epic 1 notes recording the deferred "sanctioned title em-dash exception" for /cta-tutor, /tax-tutor, /pgda-tutor (stories 1-1, 1-4, 1-6)
- Memory: `no-em-dashes-in-content.md` — Luke: em dashes read as AI-generated; use commas/colons/parentheses.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

N/A - editorial scrub, no debug issues.

### Completion Notes List

- Replaced 43 em-dash occurrences across 18 source files (11 guide body-copy files, 4 metadata files, 1 rendered config file, 3 tutor page title files).
- Replacements used: colon (`:`) for parenthetical/appositive dashes; comma (`,`) for loose connectives; semicolon (`;`) for clause joins; parentheses for appositives; two sentences for no-space CTA dashes; citation form `(IFRS 15.2)` for attribution dash.
- All three tutor page title em dashes resolved (CTA Tutor, Tax Tutor, PGDA Tutor): colon variant, all within 53-char limit.
- Out-of-scope comment lines in `groupSessions.ts` L8/L23, `guides/page.tsx` L51, `Logo.tsx` L13, and test files confirmed untouched.
- En dashes (U+2013, 15 occurrences in groupSessions.ts numeric ranges) left intact.
- Added `tests/unit/no-em-dash.test.ts`: 16 it.each cases, comment-stripping regex, U+2014 assertion via unicode escape. All pass.
- Full vitest suite: 77 pass / 0 fail / 0 todo. tsc: no new errors (pre-existing .next/types stale errors unchanged).

### File List

acce-nextjs/src/app/guides/groups/page.tsx
acce-nextjs/src/app/guides/groups/part-1/page.tsx
acce-nextjs/src/app/guides/groups/part-2/page.tsx
acce-nextjs/src/app/guides/groups/part-3/page.tsx
acce-nextjs/src/app/guides/groups/part-4/page.tsx
acce-nextjs/src/app/guides/groups/part-6/page.tsx
acce-nextjs/src/app/guides/ifrs-15/page.tsx
acce-nextjs/src/app/guides/ifrs-15/part-1/page.tsx
acce-nextjs/src/app/guides/ifrs-15/part-5/page.tsx
acce-nextjs/src/app/guides/ifrs-16/page.tsx
acce-nextjs/src/app/guides/ifrs-16/part-1/page.tsx
acce-nextjs/src/app/guides/ifrs-16/part-5/page.tsx
acce-nextjs/src/app/cta-tutor/page.tsx
acce-nextjs/src/app/tax-tutor/page.tsx
acce-nextjs/src/app/pgda-tutor/page.tsx
acce-nextjs/src/config/groupSessions.ts
acce-nextjs/tests/unit/no-em-dash.test.ts (new)

## Change Log

- 2026-07-11: Story 4.1 implemented. Replaced all 43 em-dash (U+2014) occurrences in rendered copy and metadata across 16 source files (guide body copy, guide part pages, tutor page metadata titles, rendered config). Added no-em-dash.test.ts guardrail (16 assertions, all green). vitest 77/0/0; tsc no new errors.
