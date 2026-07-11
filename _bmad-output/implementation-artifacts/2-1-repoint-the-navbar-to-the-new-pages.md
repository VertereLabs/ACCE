# Story 2.1: Repoint the navbar to the new pages

---
baseline_commit: 457e2611030d89be766bcb098977e012f6d51205
---

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor using the site navigation,
I want the navbar to reach the new subject and qualification pages,
so that I can browse to a dedicated page instead of only scrolling homepage anchors.

## Acceptance Criteria

1. **Given** `src/components/Navbar.tsx`, **When** the navbar renders (both the desktop bar and the open mobile menu), **Then** the "Subjects" link points to `/subjects` (replacing the current `/#services`), so clicking Subjects navigates to the new hub page rather than scrolling to the homepage Services anchor.
2. **Given** the navbar, **When** it renders (desktop and mobile), **Then** a "Qualifications" affordance is present that reaches both `/cta-tutor` and `/pgda-tutor` (a dropdown on desktop and grouped links in the mobile menu, OR plain grouped links in both), so the navbar can reach every new page directly or one hop away.
3. **Given** the remaining nav items, **When** I use About / How It Works / Pricing / Contact / Group Classes / Guides, **Then** they still resolve to their existing destinations unchanged (`/#about`, `/#how-it-works`, `/#pricing`, `/#contact`, `/#group-classes`, `/guides`).
4. **Given** the mobile menu, **When** I open it and tab through it, **Then** it remains keyboard-operable with a visible focus ring on every interactive element and ≥44px touch targets; opening/closing still works via the existing menu button and the menu closes on link selection.
5. **Given** dark (default) and light modes, **When** the navbar renders, **Then** it uses the existing navbar styling/tokens (`text-muted-foreground`, `hover:text-accent-ink`, `bg-background/80`, `border-border`, etc.) with no new palette, hue, or third accent, and renders correctly in both modes.
6. **Given** NFR6, **When** the navbar source and any added copy are inspected, **Then** there are zero em-dash (`—`) characters in the file (labels are plain words: "Subjects", "Qualifications", "CTA Tutoring", "PGDA Tutoring", etc.).
7. **Given** NFR4 (additive-only) and NFR7 (single-shot release), **When** the change ships, **Then** no homepage section is removed or restructured, no existing route is broken, and every navbar link target already exists on disk (`/subjects`, `/cta-tutor`, `/pgda-tutor` route dirs are all present) so no navbar link dead-ends.

## Tasks / Subtasks

- [ ] Task 1: Repoint the "Subjects" nav item to `/subjects` (AC: #1)
  - [ ] In `src/components/Navbar.tsx`, change the `navLinks` entry `{ name: "Subjects", href: "/#services" }` to `{ name: "Subjects", href: "/subjects" }`.
  - [ ] This single entry drives BOTH the desktop bar (line ~33 `.map`) and the mobile menu (line ~75 `.map`), so one edit updates both surfaces. Confirm both render the new href.
  - [ ] Because `/subjects` is a real route (server component, not a homepage anchor), a plain `<a href="/subjects">` is correct and matches the existing pattern (the existing `Guides` item is already a real route via `<a href="/guides">`). Do NOT convert other anchor items to `<Link>`; keep the file's existing `<a>` convention.
- [ ] Task 2: Add the "Qualifications" affordance reaching `/cta-tutor` and `/pgda-tutor` (AC: #2, #4, #5)
  - [ ] Desktop (recommended): render a "Qualifications" trigger using the already-installed shadcn `DropdownMenu` (`@/components/ui/dropdown-menu`) with two `DropdownMenuItem`s wrapping links to `/cta-tutor` ("CTA Tutoring") and `/pgda-tutor` ("PGDA Tutoring"). Style the trigger to match the sibling desktop links (`text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium`) so it reads as a peer nav item, with a small `ChevronDown` (lucide-react) caret. Place it in the desktop nav row next to "Subjects".
  - [ ] Mobile: do NOT nest a dropdown inside the mobile menu. Instead render a "Qualifications" sub-heading (non-link label styled muted/smaller) followed by two indented links to `/cta-tutor` and `/pgda-tutor`, each calling `setIsOpen(false)` on click like the other mobile links. This keeps touch targets ≥44px and avoids nested-menu focus traps.
  - [ ] Acceptable simpler fallback (either surface): if the dropdown adds friction, render "Qualifications" as a plain non-interactive label with the two child links inline (grouped links) on desktop too. AC2 explicitly permits "dropdown or grouped links". Pick one and be consistent.
  - [ ] Ensure the Qualifications dropdown trigger and items are keyboard-operable with a visible focus ring (Radix `DropdownMenu` provides this by default; verify the trigger shows the ring on `:focus-visible`).
- [ ] Task 3: Verify the remaining nav items are untouched (AC: #3)
  - [ ] Confirm `Group Classes → /#group-classes`, `About → /#about`, `How It Works → /#how-it-works`, `Pricing → /#pricing`, `Guides → /guides`, `Contact → /#contact` are unchanged in both desktop and mobile lists.
  - [ ] Confirm the "Get Started" WhatsApp CTA (`https://wa.me/27713255295`) and `ThemeToggle` are unchanged in both surfaces.
- [ ] Task 4: Regression, accessibility, and no-em-dash checks (AC: #4, #5, #6, #7)
  - [ ] Run the unit suite from `acce-nextjs/`: `npx vitest run` (or at minimum `tests/unit/render-smoke.test.tsx`). Confirm the homepage render-smoke still passes (it renders `<HomePage/>` which mounts `<Navbar/>`). 39 tests currently pass with 3 pre-existing guide-route failures (Epic 3 scope) — that baseline must be unchanged: no NEW failures.
  - [ ] Run `npx tsc --noEmit` from `acce-nextjs/`; confirm no NEW type errors (only pre-existing stale `.next/types` cache errors are acceptable).
  - [ ] Optional but recommended: add one lightweight assertion to `tests/unit/render-smoke.test.tsx` under a `describe("Navbar renders")` that renders `<Navbar/>` (import `@/components/Navbar`) and asserts an `<a href="/subjects">` exists and a Qualifications affordance reaching `/cta-tutor` + `/pgda-tutor` exists. This is the cheap guardrail that this story delivered its edges; keep it minimal.
  - [ ] Grep the file for `—` (em dash) and confirm zero matches (AC6).
  - [ ] Confirm all three link targets exist on disk: `src/app/subjects/page.tsx`, `src/app/cta-tutor/page.tsx`, `src/app/pgda-tutor/page.tsx` (all present as of this story) — no dead links (AC7).

## Dev Notes

### What this story is

First story of **Epic 2 (Navigation & Internal-Link Matrix)**. Epic 1 built all seven new pages and registered them in the sitemap (Stories 1.1–1.8, all `done`). Those pages exist but the site navigation still only reaches homepage anchors plus `/guides`. This story wires the **navbar entry points** so humans (and crawl paths from the persistent global nav) reach the new pages. It is deliberately small and surgical: one component file.

Sibling Epic 2 stories (not this story): **2.2** adds homepage Services "Learn more" links + a Qualifications mention; **2.3** audits/completes the full hub↔spoke internal-link matrix. Do NOT do 2.2/2.3 work here — this story is the navbar only.

### The file being modified (READ IT FIRST)

`acce-nextjs/src/components/Navbar.tsx` — a `"use client"` component (needs client state for the mobile menu toggle). Current shape:

- A `navLinks` array of `{ name, href }` objects (7 entries), rendered by `.map()` in two places: the desktop row (`hidden md:flex`) and the mobile menu (`isOpen &&` block). All links are plain `<a href>` tags styled `text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium`.
- The current `Subjects` entry is `{ name: "Subjects", href: "/#services" }` — a homepage anchor. **This is the exact line to repoint to `/subjects`.**
- Desktop right cluster: `<ThemeToggle />` + a `variant="hero"` "Get Started" WhatsApp button. Mobile mirrors the button inside the menu.
- Mobile menu closes each link via `onClick={() => setIsOpen(false)}`.
- Imports: `useState` (react), `Button` (`@/components/ui/button`), `Menu, X, MessageCircle` (lucide-react), `Logo`, `ThemeToggle`.

**Current state to preserve (AC3, NFR4):** the six other nav items, the WhatsApp CTA href, the ThemeToggle, the fixed/blur nav shell (`fixed top-0 … bg-background/80 backdrop-blur-lg border-b border-border`), the `h-20` bar height, and the mobile open/close mechanics must all stay working. This story only (a) repoints Subjects and (b) adds a Qualifications affordance.

### The Qualifications affordance — design decision (medium)

AC2 allows "dropdown or grouped links". Recommended: **desktop shadcn `DropdownMenu`, mobile grouped links.** Rationale and the rejected alternatives are logged in `autopilot-decisions.md` (2026-07-11, "Qualifications affordance"). Key facts for the dev agent:

- `@/components/ui/dropdown-menu.tsx` is already generated and `@radix-ui/react-dropdown-menu` is already a dependency (`package.json`). **No new dependency is needed** (NFR5 reuse). Do not add a new package or a new UI primitive.
- Radix `DropdownMenu` is keyboard-operable and focus-ring-friendly out of the box (satisfies AC4/NFR8 for the desktop trigger).
- `NavigationMenu` (`@/components/ui/navigation-menu`) also exists but is heavier than needed for two links; prefer `DropdownMenu`. Plain grouped links are an acceptable simpler fallback (AC2).
- The two child links are `/cta-tutor` (label "CTA Tutoring") and `/pgda-tutor` (label "PGDA Tutoring"). Both route dirs exist on disk. `/subjects` also exists. No dead links (NFR7/AC7).
- Since this is already a `"use client"` component, adding an interactive dropdown is fine (no server/client boundary issue).

### Styling / design-system rules (NFR5, UX-DR1–DR7)

- Reuse existing tokens only: `text-muted-foreground`, `hover:text-accent-ink` (gold is accent-only; gold text uses `accent-ink`, never raw `--accent`), `bg-background`, `border-border`, `bg-card`/`bg-popover` for the dropdown surface (shadcn `DropdownMenuContent` already uses `bg-popover text-popover-foreground`). **No new hue, no third accent, no new component.**
- The single conversion CTA per view group is the existing `variant="hero"` "Get Started" button — do NOT add a second gold CTA. The Qualifications trigger is a plain nav-style link/label, not a hero button.
- Must render correctly in both dark (default) and light modes (the dropdown popover inherits token colors, so it follows the theme automatically). Visible focus ring on every interactive element; ≥44px touch targets on mobile (the mobile links already use `py-2`; keep comparable padding on the new Qualifications child links).

### Editorial rule (NFR6)

- **Zero em dashes** anywhere in the file, including any comment. Nav labels are single plain words/phrases. If you write any inline note, use commas/colons. (Grep the file for `—` before finishing.)

### Indentation

Per project-context: `src/components/*` follows the component's own convention. `Navbar.tsx` currently uses **4-space** indentation — match it exactly for any added JSX. (Root `layout.tsx`/`page.tsx` use 2-space, but this file does not.)

### Testing standards

- Vitest 3 + Testing Library; unit tests in `tests/unit/`. `tests/unit/render-smoke.test.tsx` renders `<HomePage/>` which mounts `<Navbar/>`, so a render-time throw in the new Navbar would surface there. There is currently **no dedicated Navbar test** — adding a tiny one (Task 4) is recommended but optional.
- The e2e route-200 smoke (`tests/e2e/smoke.spec.ts`) is driven off the sitemap; `/subjects`, `/cta-tutor`, `/pgda-tutor` are already registered (Story 1.8) so they are already covered as 200-routes — this navbar change does not add routes. If you run Playwright it uses dedicated port 3100 with `reuseExistingServer: false` (do not attach to a stray dev server).
- Baseline before this change: full unit suite **39 pass / 3 pre-existing guide-route failures** (Epic 3 scope). Do not regress that count; the 3 guide failures are expected and unrelated.
- Do NOT weaken any existing test to pass. This is an additive UI change.

### Project Structure Notes

- **Only file to edit:** `acce-nextjs/src/components/Navbar.tsx`. (Optionally also `acce-nextjs/tests/unit/render-smoke.test.tsx` if you add the small Navbar guardrail test.)
- No new route directories (all targets exist). No new dependency, no new env var, no new config key. No new UI component file (reuse `ui/dropdown-menu.tsx`).
- Do not touch `next.config.ts` (security headers, `output: 'standalone'`), the homepage, or any page under `src/app/`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1: Repoint the navbar to the new pages] — the three AC groups (Subjects → /subjects, Qualifications affordance, unchanged items + mobile a11y, dark/light + no em dashes).
- [Source: _bmad-output/planning-artifacts/epics.md] — FR11 (navbar repoint), Epic 2 constraints NFR4/NFR5/NFR6.
- [Source: _bmad-output/specs/spec-seo-page-architecture/page-catalog.md#Internal-link matrix (CAP-9)] — navbar repoint requirement: "Subjects → /subjects + Qualifications: CTA/PGDA"; and the release-model note that the navbar must reach every new page.
- [Source: _bmad-output/project-context.md#New marketing/SEO pages] — Navbar is a `"use client"` component; design-system reuse rules (gold accent-only via `accent-ink`, no new palette/components, single hero CTA per view group, dual-mode correctness, ≥44px targets, no em dashes).
- [Source: acce-nextjs/src/components/Navbar.tsx] — the `navLinks` array (Subjects currently `/#services`), the two `.map()` render sites (desktop + mobile), existing link styling tokens, and the mobile open/close mechanics to preserve.
- [Source: acce-nextjs/src/components/ui/dropdown-menu.tsx] + [package.json `@radix-ui/react-dropdown-menu`] — the installed dropdown primitive to reuse for the desktop Qualifications affordance (no new dependency).
- [Source: acce-nextjs/tests/unit/render-smoke.test.tsx] — homepage render-smoke mounts Navbar; the place to add an optional minimal Navbar guardrail test.
- [Source: acce-nextjs/src/app/{subjects,cta-tutor,pgda-tutor}/page.tsx] — all three navbar link targets exist on disk (confirmed at story creation): no dead links (NFR7).

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-11)

### Debug Log References

- autopilot-decisions.md entries 2026-07-11T14:33:07Z (implementation approach) and 2026-07-11T14:40:00Z (completion notes)

### Completion Notes List

- Task 1: `navLinks` Subjects entry changed from `/#services` to `/subjects` (one edit, updates both desktop and mobile `.map()` renders)
- Task 2: Desktop uses shadcn `DropdownMenu` with `DropdownMenuContent` + two `DropdownMenuItem` links to `/cta-tutor` and `/pgda-tutor`; mobile uses flat grouped links (Qualifications label + two indented links) to avoid nested-menu touch issues
- Task 3: All 6 other nav items confirmed unchanged; WhatsApp CTA and ThemeToggle unchanged
- Task 4: 41 unit tests pass (+2 new Navbar guardrail tests); 3 pre-existing guide-route sitemap failures unchanged; tsc no new errors; zero em dashes confirmed (python3 count = 0); all 3 link targets confirmed on disk
- Added optional Navbar guardrail tests to render-smoke.test.tsx: /subjects link present + Qualifications trigger text present

### File List

- acce-nextjs/src/components/Navbar.tsx (modified)
- acce-nextjs/tests/unit/render-smoke.test.tsx (modified, +2 Navbar describe tests)
