# Story 2.2: Add homepage links into the new pages

---
baseline_commit: da5f7c7b87957920182f91d075aee30fa19a346e
---

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a homepage visitor,
I want each Services card and a Qualifications mention to link to the matching dedicated page,
so that I can go deeper from the homepage and ranking authority flows to the spokes.

## Acceptance Criteria

1. **Given** the homepage Services section (`src/components/Services.tsx`), **When** it renders, **Then** each of the four subject cards gains a visible "Learn more" link to its matching subject spoke: **Financial Accounting → `/accounting-tutor`**, **Taxation → `/tax-tutor`**, **Management Accounting → `/financial-management-tutor`**, **Auditing → `/auditing-tutor`**. (Map by subject NAME, not array position: the `services` array order in the file is Financial Accounting, Taxation, Management Accounting, Auditing.)
2. **Given** the homepage, **When** it renders, **Then** a short "Qualifications" mention is present that links to both `/cta-tutor` and `/pgda-tutor` (a single compact block with two inline links is sufficient). This mention is added inside the existing Services section (below the subject grid), NOT as a new page-level section (no `page.tsx` edit).
3. **Given** the existing homepage sections, **When** these changes ship, **Then** no homepage section is removed or restructured (NFR4): `src/app/page.tsx` and every other section component are untouched, the Services grid, its four cards' existing icon/title/description content, and the "Core Subjects" eyebrow/heading are all preserved. The change is purely additive (new links + one Qualifications block).
4. **Given** the design system (NFR5, UX-DR1/DR3), **When** the new links and Qualifications block render, **Then** they reuse existing tokens/components only, add no new hue or third accent, and add no new palette or component primitive. Internal-route links match the established Epic 1 sibling convention: `next/link` `<Link>` styled `text-accent hover:underline`. Gold remains accent-only.
5. **Given** dark (default) and light modes, **When** the section renders, **Then** the new links and Qualifications block render correctly in both modes (they inherit token colors), every link is keyboard-operable with a visible focus ring, and touch targets are comfortable (link text sits on its own line/row, not a cramped inline tap target).
6. **Given** NFR6, **When** the Services source and any added copy are inspected, **Then** there are zero em-dash (`—`) characters in the file. Use ">" or the arrow glyph "→" (a right-arrow, NOT an em dash) after "Learn more", commas, colons, or two sentences. (Grep the file for `—` before finishing.)
7. **Given** NFR7 (single-shot release, no dead internal links), **When** the change ships, **Then** all six link targets already exist on disk (`/accounting-tutor`, `/tax-tutor`, `/financial-management-tutor`, `/auditing-tutor`, `/cta-tutor`, `/pgda-tutor` route dirs are all present from Epic 1) so no added link dead-ends.

## Tasks / Subtasks

- [x] Task 1: Add a per-subject `href` to the `services` data and render a "Learn more" link on each card (AC: #1, #4, #5, #6, #7)
  - [x] In `acce-nextjs/src/components/Services.tsx`, add an `href` field to each of the four objects in the `services` array, mapped by SUBJECT NAME (do not rely on array index):
    - Financial Accounting → `/accounting-tutor`
    - Taxation → `/tax-tutor`
    - Management Accounting → `/financial-management-tutor`
    - Auditing → `/auditing-tutor`
  - [x] Import `Link` from `next/link` at the top of the file.
  - [x] Inside the `.map()` card body, after the `<p>` description, render a "Learn more" link: `<Link href={service.href} className="...text-accent hover:underline...">Learn more →</Link>` (use the "→" right-arrow glyph or ">", never an em dash). Match the Epic 1 spoke convention `text-accent hover:underline`; you may add `inline-flex items-center gap-1 mt-4 font-medium` for spacing so it reads as a card footer link and gives a comfortable tap area.
  - [x] Keep each card's existing icon, title, and description exactly as-is (additive only).
- [x] Task 2: Add the short "Qualifications" mention below the subject grid (AC: #2, #4, #5, #6, #7)
  - [x] Below the `grid` div (still inside `<div className="container mx-auto px-6">`, inside `<section id="services">`), add a compact centered block. Suggested copy (no em dashes): a short line such as "Studying towards a qualification? Get structured support for the whole programme:" followed by two inline `<Link>`s: **CTA Tutoring → `/cta-tutor`** and **PGDA Tutoring → `/pgda-tutor`**, styled `text-accent hover:underline` (mirror the Learn-more links). Separate the two links with a comfortable separator (e.g. a middot "·" or "and" or place them on their own row) — do NOT use an em dash as a separator.
  - [x] Wrap the block in something like `<div className="mt-12 text-center text-muted-foreground">…</div>` (reuse existing tokens `text-muted-foreground`, `text-accent`). No new hue, no new component, no `variant="hero"` second gold CTA (the hero conversion CTA stays owned by Hero/CTA sections).
  - [x] Do NOT add this as a new section in `src/app/page.tsx`; it lives inside the existing Services section so no homepage section is added or restructured (AC3/NFR4).
- [x] Task 3: Regression, accessibility, and no-em-dash checks (AC: #3, #5, #6, #7)
  - [x] Confirm `src/app/page.tsx` is NOT modified and no other section component is touched (AC3/NFR4). The only production file changed is `Services.tsx`.
  - [x] Grep `Services.tsx` for `—` (em dash) and confirm zero matches (AC6): `grep -c "—" src/components/Services.tsx` should be 0.
  - [x] Confirm all six link targets exist on disk: `src/app/{accounting-tutor,tax-tutor,financial-management-tutor,auditing-tutor,cta-tutor,pgda-tutor}/page.tsx` (all present from Epic 1) — no dead links (AC7/NFR7).
  - [x] Run the unit suite from `acce-nextjs/`: `npx vitest run`. Baseline is **41 pass / 3 pre-existing guide-route sitemap failures** (Epic 3 scope, `/guides/*` unpublished). Do NOT regress that: no NEW failures. The homepage render-smoke (`HomePage renders`) mounts `<Services/>`, so a render-time throw would surface there.
  - [x] Run `npx tsc --noEmit` from `acce-nextjs/`; confirm no NEW type errors (only pre-existing stale `.next/types` cache errors are acceptable).
  - [x] Optional but recommended guardrail: extend the existing `describe("HomePage renders")` block in `tests/unit/render-smoke.test.tsx` (or add a small `describe("Services homepage links")`) to assert the homepage now contains `a[href="/accounting-tutor"]`, `a[href="/tax-tutor"]`, `a[href="/financial-management-tutor"]`, `a[href="/auditing-tutor"]`, `a[href="/cta-tutor"]`, and `a[href="/pgda-tutor"]`. This is the cheap guardrail that Story 2.2 delivered its homepage edges. Keep it minimal; do NOT weaken any existing test.

### Review Findings

Code review (autopilot, fresh adversarial reasoning) 2026-07-11: CLEAN. All 7 ACs independently re-verified against the actual diff and repo. Zero decision-needed, zero patch, zero defer findings. 3 adversarial probes dismissed as noise (focus-ring = pre-existing site convention adjudicated in 2.1; text-accent vs accent-ink = pre-adjudicated cosmetic, Epic 1 precedent wins; inline Qualifications links = AC2-permitted). Tests: vitest 43 pass / 3 pre-existing guide-route sitemap failures (Epic 3, unchanged) + 2 new homepage-links guardrails pass; tsc no new errors. Status -> done.

## Dev Notes

### What this story is

Second story of **Epic 2 (Navigation & Internal-Link Matrix)**. Story 2.1 (done) repointed the **navbar** (Subjects → `/subjects`, added a Qualifications dropdown reaching `/cta-tutor` + `/pgda-tutor`). This story wires the **homepage body** entry points: the four homepage Services cards each gain a "Learn more" link to their subject spoke, plus a short Qualifications mention links the two hubs. This is the CAP-9 "homepage" row of the internal-link matrix.

**Sibling Epic 2 stories (NOT this story):** 2.3 audits/completes and verifies the WHOLE hub↔spoke internal-link matrix (every new page's in/out edges) and handles the pending `/accounting-tutor` → IFRS-guides edge (Epic 3-gated). Do NOT do a full-matrix audit or touch any `/app/*/page.tsx` spoke pages here. This story is the homepage (`Services.tsx`) only.

### The file being modified (READ IT FIRST)

`acce-nextjs/src/components/Services.tsx` — a **plain server component** (no `"use client"`; no client state needed, links are static). Current shape:

- A module-level `const services = [ … ]` array of 4 objects: `{ icon, title, description }`. **Array order in the file is: Financial Accounting, Taxation, Management Accounting, Auditing.** This order does NOT match the AC's listing order, so map card → spoke by the `title`/subject, not by index (adding an `href` field per object is the clean way — see decision log 2026-07-11, "Card-to-spoke mapping is by title").
- Renders `<section id="services" className="py-24">` → `container` → a centered header (`Core Subjects` eyebrow badge + `Comprehensive PGDA & BCom Support` h2 + intro `<p>`) → a `grid md:grid-cols-2 gap-6 max-w-4xl mx-auto` mapping the four cards. Each card: icon badge, `<h3>` title, `<p>` description.
- Imports currently: only `{ Calculator, BookOpen, Coins, Scale }` from `lucide-react`. **You will add `import Link from "next/link";`.**

**Current state to preserve (AC3, NFR4):** the section wrapper (`id="services"`, `py-24`), the `container mx-auto px-6`, the entire centered header, the grid, and all four cards' existing icon/title/description content. This story only (a) adds a `href` + a Learn-more `<Link>` inside each card, and (b) appends one Qualifications mention block below the grid.

### The card → spoke mapping (get this right)

| Card title (in file order) | Spoke href |
|---|---|
| Financial Accounting (index 0) | `/accounting-tutor` |
| Taxation (index 1) | `/tax-tutor` |
| Management Accounting (index 2) | `/financial-management-tutor` |
| Auditing (index 3) | `/auditing-tutor` |

Mapping by array index would mis-route Taxation and Management Accounting. Encode `href` per object.

### Qualifications mention — placement decision (medium)

The homepage has **no** dedicated Qualifications section and AC3/NFR4 forbid adding/restructuring homepage sections. Decision (logged 2026-07-11, "Qualifications mention placement"): add the mention as an **additive block inside the existing Services section** (`Services.tsx`), below the subject grid, rather than a new section component mounted in `page.tsx`. This keeps the whole story to one file, satisfies AC2, and adds/reorders no homepage section. Do NOT edit `src/app/page.tsx`.

### Link primitive + styling (NFR5, UX-DR1/DR3) — match Epic 1 precedent

- Use `next/link` `<Link>` for the internal-route links, styled **`text-accent hover:underline`** — this is the exact convention every Epic 1 spoke page uses for its cross-links (e.g. `src/app/accounting-tutor/page.tsx` lines ~265–273: `<Link href="/cta-tutor" className="text-accent hover:underline">`), all of which passed adversarial review. Matching that established, review-approved precedent beats introducing a divergent style.
  - Note (logged, low): `project-context.md` nominally says gold **text** should use `accent-ink`, and `--accent`/`text-accent` is for fills/buttons/borders. But the in-repo, review-passed precedent for these exact internal cross-links is `text-accent hover:underline`. Follow the precedent for consistency with the sibling pages; if a reviewer prefers `text-accent-ink` for the link text, that is a one-token swap and acceptable either way.
- **No second gold hero CTA.** `Button variant="hero"` (gradient gold) is the single conversion CTA per view group and is already owned by the Hero/CTA sections. The Learn-more and Qualifications links are plain accent text links, not hero buttons. Do not add a new `variant`, hue, or component.
- Reuse existing tokens only: `text-accent`, `text-muted-foreground`, existing spacing utilities. Renders correctly in both dark (default) and light modes automatically (token-driven). Keep links keyboard-operable with a visible focus ring (default anchor focus + underline-on-hover is the site baseline; do not remove focus outlines) and give the Learn-more link its own line (`mt-4`, `inline-flex`) so it is a comfortable tap target (UX-DR7 / NFR8).

### Editorial rule (NFR6) — no em dashes

- **Zero em dashes** (`—`) anywhere in the file, including comments and the new copy. For the "Learn more" affordance use the right-arrow glyph "→" or ">", NOT an em dash. For separating the two Qualifications links use a middot "·", the word "and", commas, or put them on separate lines. Grep the file for `—` before finishing (`grep -c "—"` must be 0). En dashes in numeric ranges are not relevant here (there are none in this copy).

### Indentation

`Services.tsx` currently uses **4-space** indentation. Match it exactly for any added JSX (per project-context: match the file you're editing; component files follow their own convention; root `page.tsx`/`layout.tsx` are 2-space but you are not editing those).

### Testing standards

- Vitest 3 + Testing Library; unit tests in `tests/unit/`. `tests/unit/render-smoke.test.tsx` `describe("HomePage renders")` renders `<HomePage/>` which mounts `<Services/>`, so a render-time throw in the modified Services would surface there.
- Baseline before this change: full unit suite **41 pass / 3 pre-existing guide-route sitemap failures** (Epic 3 scope, `/guides/*` unpublished — these are expected and unrelated). Do NOT regress that count; no NEW failures. Do NOT weaken any existing test to pass; this is an additive UI change.
- The e2e route-200 smoke (`tests/e2e/smoke.spec.ts`) is driven off the sitemap and does not need changes here (no new routes; all six targets already registered in Story 1.8). If you run Playwright it uses dedicated port 3100 with `reuseExistingServer: false` — do not attach to a stray dev server.
- Optional guardrail test (Task 3): assert the six new homepage `a[href="…"]` links exist. Minimal and additive.

### Project Structure Notes

- **Only production file to edit:** `acce-nextjs/src/components/Services.tsx`. (Optionally also `acce-nextjs/tests/unit/render-smoke.test.tsx` for the small homepage-links guardrail.)
- Do NOT edit `src/app/page.tsx`, any other homepage section component, any `/app/*/page.tsx` spoke/hub page (their outbound links were authored in Epic 1; the full-matrix verification is Story 2.3), `next.config.ts` (security headers, `output: 'standalone'`), `sitemap.ts`, `Navbar.tsx` (done in 2.1), or the guide gating files.
- No new route directories (all six targets exist). No new dependency (`next/link` is core Next.js), no new env var, no new config key, no new UI component file.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: Add homepage links into the new pages] — the three AC groups: Services cards Learn-more links to the four spokes, a short Qualifications mention linking `/cta-tutor` + `/pgda-tutor`, and additive-only (no section removed/restructured, reuse components, no em dashes).
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)] — the "homepage (Services cards)" matrix row: Learn-more to each of the 4 spokes + a mention of `/cta`, `/pgda`; and per-page 2–4 in/out link rule.
- [Source: _bmad-output/project-context.md#Design system / Additive-only] — reuse tokens only (gold accent-only), single hero CTA per view group, no new palette/component, dual-mode correctness, ≥44px targets, no em dashes, additive-only (do not remove/restructure homepage sections), match the file's 4-space indentation.
- [Source: acce-nextjs/src/components/Services.tsx] — the `services` array (order: Financial Accounting, Taxation, Management Accounting, Auditing), the `.map()` card render site, section/grid structure to preserve, and the current icon-only import set.
- [Source: acce-nextjs/src/app/accounting-tutor/page.tsx (lines ~265–273)] — the established Epic 1 internal-cross-link convention `<Link href="/…" className="text-accent hover:underline">` to mirror for the new homepage links.
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx#HomePage renders] — homepage render-smoke mounts `<Services/>`; the place to add the optional minimal homepage-links guardrail; the 41-pass / 3-pre-existing-fail baseline to hold.
- [Source: _bmad-output/implementation-artifacts/2-1-repoint-the-navbar-to-the-new-pages.md] — sibling story (navbar entry points, done); its scope split note (2.2 = homepage links, 2.3 = full-matrix verify) and the reuse/no-em-dash/dual-mode rules established for Epic 2.
- [Source: acce-nextjs/src/app/{accounting-tutor,tax-tutor,financial-management-tutor,auditing-tutor,cta-tutor,pgda-tutor}/page.tsx] — all six homepage link targets exist on disk (confirmed at story creation): no dead links (NFR7/AC7).

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- autopilot-decisions.md entries 2026-07-11T14:44:23Z (Qualifications mention placement; link primitive/styling convention; card-to-spoke mapping by title)
- autopilot-decisions.md entry 2026-07-11T14:48:59Z (implementation approach: &rarr; HTML entity for arrow glyph; middot separator for Qualifications links)

### Completion Notes List

- Task 1: Added `href` field to all four service objects in Services.tsx, mapped by title (not index). Added `import Link from "next/link"`. Added `<Link href={service.href} className="inline-flex items-center gap-1 mt-4 font-medium text-accent hover:underline">Learn more &rarr;</Link>` after each card description. Used HTML entity `&rarr;` for the right-arrow glyph (avoids literal Unicode in source).
- Task 2: Added Qualifications mention block below the subject grid inside `<section id="services">`. Used `<div className="mt-12 text-center text-muted-foreground">` with two inline `<Link>` elements styled `text-accent hover:underline`, separated by a middot "·". Copy: "Studying towards a qualification? Get structured support for the whole programme:". No page.tsx edit, no new section.
- Task 3: Verified page.tsx not modified (git diff confirms); grep for em dash = 0; all 6 route dirs confirmed on disk; vitest 43 pass / 3 pre-existing guide failures (2 new guardrail tests added); tsc only pre-existing .next/types stale cache errors.

### File List

- acce-nextjs/src/components/Services.tsx (modified - added href fields, Link import, Learn-more links, Qualifications block)
- acce-nextjs/tests/unit/render-smoke.test.tsx (modified - added Services homepage links guardrail describe block)

## Change Log

- 2026-07-11: Story 2.2 implemented. Added Learn-more links to all four Services cards and a Qualifications mention below the grid (Services.tsx only). Added homepage-links guardrail tests. 43 pass / 3 pre-existing failures. Status: review.
- 2026-07-11: Code review (autopilot) CLEAN, all 7 ACs re-verified with fresh reasoning, no HIGH/MEDIUM findings. Status: done.
