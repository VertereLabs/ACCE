# Story 6.4: Portal polish — seats-left states, empty states, error toasts

---
baseline_commit: fc0e96cdc11bd794ccb331c4b4557d9d885d3b27
---

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want the portal to communicate state clearly,
so that full classes, empty lists, and errors never look broken.

This is the **final Epic 6 polish story**. It is a **consistency / consolidation pass**, not net-new
features: the three states already exist inline on every screen, but they are duplicated and slightly
divergent. This story makes them render from a **single source** and verifies the accessibility floor.

## Acceptance Criteria

1. **Consistent "Class full" state (UX-DR3).** Everywhere a class's availability is shown (the browse
   grid `/portal/classes` and the detail page `/portal/classes/[id]`), a full class (`seatsLeft === 0`)
   renders the SAME calm treatment: the `formatSeatsLeft` badge reads **"Class full"** and there is **no
   dead/misleading CTA**, with ONE canonical supporting sentence (not two different ones). The full-state
   copy comes from a single shared constant.

2. **Consistent empty state (UX-DR4).** Every portal list that can be empty — `/portal/classes` (no
   upcoming classes), `/portal/my-classes` (no bookings), `/portal/wallet` (no ledger activity) — renders
   through ONE shared `EmptyState` component (identical Card, padding, typography, and optional CTA
   treatment), not a bespoke inline Card per page. Copy stays page-specific; the *shell* is shared. The
   same shared component is also adopted by the identical admin empty-state duplications where the swap is
   mechanical and low-risk (`/admin/classes`, `/admin/students`, `/admin/classes/[id]` roster,
   `/admin/students/[id]` wallet).

3. **Consistent error toast (UX-DR5).** Every portal/admin action island surfaces failures as a `sonner`
   `toast.error(...)` with a specific per-reason message and the identical generic fallback
   **"Something went wrong — please try again"** for the `error` reason. This already holds across the
   reserve, cancel, and attendance mappers — the story **verifies** it and fixes any island that diverges
   (e.g. a raw string or a missing catch). No cross-domain refactor of the per-reason maps.

4. **Accessibility floor on every portal/admin control (NFR10, UX-DR6).** Every interactive control on
   the portal and admin surfaces (buttons, action islands, links-as-buttons, dialog actions, the shared
   `EmptyState` CTA) is keyboard-operable, shows a visible focus ring (`focus-visible:ring-2
   focus-visible:ring-ring`), has a ≥44px touch target (`min-h-[44px]`), carries state in **text** (not
   colour alone), and uses design tokens so contrast holds in **both** light and dark modes. This is an
   audit-and-fix pass — fix only genuine gaps; do not restyle compliant controls.

5. **No regressions; verification green.** `npx prisma validate` clean, `npm run build` clean (all
   existing portal/admin routes still present and typed), and the full `vitest` suite green including a
   new jsdom render test for the shared `EmptyState` component. The authenticated-route e2e manifest is
   unchanged (no new routes). Because the fresh seed is ADMIN-only, the empty states are the default
   render on a fresh DB — the existing RSC-500 smoke already exercises them.

## Tasks / Subtasks

- [x] **Task 1 — Shared `EmptyState` component (AC2, AC4)**
  - [x] Create `src/components/ui/empty-state.tsx` as a **Server Component** (no `"use client"`).
  - [x] Props: `{ title?: string; message: string; action?: { href: string; label: string } }`. The
        `action` is plain data (href + label) — **never a Client Component element through a prop**
        (RSC-500 trap, 1.5 lesson). Render the CTA as `Button asChild` wrapping a `next/link`.
  - [x] Markup: wrap shadcn `Card` + `CardContent` with the canonical centred layout
        (`flex flex-col items-center justify-center gap-4 py-16 text-center`), `message` in
        `text-muted-foreground`, optional `title` above it.
  - [x] CTA meets NFR10: `min-h-[44px]`, `focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:outline-none`, token colours (use the gold accent `bg-accent text-accent-foreground
        hover:bg-accent/90` only when the empty state is a genuine call-to-action; otherwise a subordinate
        link is fine — do NOT add a competing second gold CTA per UX-DR2).
- [x] **Task 2 — Adopt `EmptyState` across portal lists (AC2)**
  - [x] `(portal)/portal/classes/page.tsx` — replace the inline empty Card with `<EmptyState
        message="No upcoming classes right now. Check back soon." />` (no CTA).
  - [x] `(portal)/portal/my-classes/page.tsx` — replace the inline empty Card with `<EmptyState
        message="You haven't booked any upcoming classes yet." action={{ href: "/portal/classes", label:
        "Browse available classes" }} />`.
  - [x] `(portal)/portal/wallet/page.tsx` — replace the inline empty Card with `<EmptyState
        message="No wallet activity yet." />`.
  - [x] Confirm no behavioural change: same routes, same guards, same data queries — presentation only.
- [x] **Task 3 — Adopt `EmptyState` across the identical admin duplications (AC2)** *(low-risk, mechanical)*
  - [x] `(admin)/admin/classes/page.tsx` — empty list ("No classes yet. Create your first class to get
        started.") → `EmptyState` with `action={{ href: "/admin/classes/new", label: "Create a class" }}`
        (this list's existing empty state has a gold CTA — preserve that intent via the accent CTA slot).
  - [x] `(admin)/admin/students/page.tsx` — "No students yet. Students appear here once they sign up." →
        `EmptyState` (no CTA).
  - [x] `(admin)/admin/classes/[id]/page.tsx` roster — "No one has enrolled in this class yet." →
        `EmptyState` (no CTA).
  - [x] `(admin)/admin/students/[id]/page.tsx` wallet — "No wallet activity yet." → `EmptyState` (no CTA).
  - [x] If any admin empty state is entangled with surrounding layout such that the swap is NOT purely
        mechanical, leave it inline and note why in the Dev Agent Record (minimal-risk rule).
        All swaps were purely mechanical — no entanglement found.
- [x] **Task 4 — Unify the "Class full" copy (AC1)**
  - [x] Add a single exported constant to `src/lib/class-display.ts`, e.g.
        `export const CLASS_FULL_MESSAGE = "This class is fully booked. Check back in case a seat opens up.";`
  - [x] `(portal)/portal/classes/page.tsx` full-card branch and `(portal)/portal/classes/[id]/page.tsx`
        full-class branch both render the badge `formatSeatsLeft(0)` ("Class full") + `CLASS_FULL_MESSAGE`
        — identical wording, no active CTA. Keep the badge `variant="secondary"` for the full state as
        today.
  - [x] Do NOT re-derive seats: `formatSeatsLeft` (from `computeSeatsLeft`, AD-5) stays the single source.
- [x] **Task 5 — Verify error-toast consistency (AC3)**
  - [x] Audit each action island (`pay-with-balance-button.tsx`, `pay-online-button.tsx`,
        `my-classes/cancel-enrollment-button.tsx`, `admin/classes/[id]/mark-attendance-buttons.tsx`,
        `admin/students/[id]/credit-wallet-form.tsx`): each must `toast.error(...)` on the `ok:false`
        branch AND in a `catch`, via its domain mapper (`getReserveErrorMessage` / `getCancelErrorMessage`
        / attendance / credit) whose generic fallback is exactly "Something went wrong — please try again".
  - [x] Fix any island that raw-strings an error, omits the catch, or diverges from the fallback wording.
        Fixed: `credit-wallet-form.tsx` catch block used "Something went wrong. Please try again." (period)
        → corrected to canonical "Something went wrong — please try again" (em-dash, UX-DR5).
        All other islands (pay-with-balance, pay-online, cancel-enrollment, mark-attendance) already complied
        via domain mappers with the exact fallback wording.
- [x] **Task 6 — Accessibility-floor audit (AC4)**
  - [x] Sweep every interactive control under `(portal)` and `(admin)`. For each, confirm: keyboard focus
        reachable, visible `focus-visible` ring on `--ring`, ≥44px target, state carried in text, tokenised
        colours (no hardcoded hex; both-mode contrast). Fix genuine gaps only.
        Fixed: `admin/classes/[id]/page.tsx` back link missing focus-visible ring → added `rounded-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
        Fixed: `admin/students/[id]/page.tsx` back link missing focus-visible ring → same fix.
        All Button-wrapped controls already had rings via cva base styles. Client islands already compliant.
  - [x] Note: the 3.3-deferred "inert Pay CTA not focusable" item is already resolved (3.4 made it a live
        island). Do not reintroduce a native-`disabled` inert control that drops out of the tab order.
- [x] **Task 7 — Tests & verification (AC5)**
  - [x] Add `tests/unit/empty-state.test.tsx` (jsdom, `@testing-library/react`, mirror
        `tests/unit/portal-nav.test.tsx`): renders `message`; renders `title` when given; renders the CTA
        as a link to `action.href` with `action.label` when given and omits it otherwise; the CTA carries
        the `min-h-[44px]` + `focus-visible:ring` classes. 8 tests added, all green.
  - [x] Run `npx prisma validate` (clean), `npm run build` (clean — grep the route table to confirm all
        existing portal/admin routes still present), `npm test` (full vitest green — 507/507).
  - [x] Leave `tests/e2e/**` authenticated-route manifest unchanged (no new routes).

## Dev Notes

### What this story is (and is NOT)

- **IS:** a purely **presentational consolidation** — one shared `EmptyState`, one canonical full-class
  copy constant, a verification pass on toast + a11y consistency.
- **IS NOT:** any change to domain logic (`enrollment.ts`, `wallet.ts`, `paystack.ts`, `email.ts`,
  `meeting.ts`), server actions' behaviour, Prisma schema/migrations, enums, or dependencies. No new
  routes. **No timezone pin** — display-timezone hardening is an explicitly deferred, system-wide decision
  (see `deferred-work.md` 2.2/2.3); do NOT unilaterally pin `Africa/Johannesburg` here.
- **No loading/skeleton states** — the epics ACs name only full / empty / error (UX-DR3/4/5). Adding
  loading states would be invented scope.

### Current-state map (read before editing — the exact files you will touch)

| File | State today | This story |
| --- | --- | --- |
| `src/lib/class-display.ts` | `formatSeatsLeft` → "Class full" / "N seat(s) left" (AD-5 single source) | ADD `CLASS_FULL_MESSAGE` constant; do not touch `formatSeatsLeft`/`formatZar` |
| `(portal)/portal/classes/page.tsx` | inline empty Card; full-card footer says "This class is fully booked." | use `EmptyState`; full branch uses badge + `CLASS_FULL_MESSAGE` |
| `(portal)/portal/classes/[id]/page.tsx` | inline full branch: "Class full" + "…Check back in case a seat opens up." | full branch uses badge + `CLASS_FULL_MESSAGE` (this file already holds the canonical sentence) |
| `(portal)/portal/my-classes/page.tsx` | inline empty Card + "Browse available classes" link | `EmptyState` with `action` CTA |
| `(portal)/portal/wallet/page.tsx` | inline empty Card "No wallet activity yet." | `EmptyState` (no CTA) |
| `(admin)/admin/classes/page.tsx` | inline empty Card + gold "create" CTA | `EmptyState` with accent CTA |
| `(admin)/admin/students/page.tsx` | inline empty Card | `EmptyState` (no CTA) |
| `(admin)/admin/classes/[id]/page.tsx` | roster inline empty Card | `EmptyState` (no CTA) |
| `(admin)/admin/students/[id]/page.tsx` | wallet inline empty Card | `EmptyState` (no CTA) |

The five toast islands (`pay-with-balance-button`, `pay-online-button`, `cancel-enrollment-button`,
`mark-attendance-buttons`, `credit-wallet-form`) are **audited**, not restructured.

### Architecture guardrails (from ARCHITECTURE-SPINE.md — must hold)

- **AD-5 — Capacity is derived, readers never write.** These pages are readers. `seatsLeft` comes ONLY
  from `computeSeatsLeft(capacity, occupiedCount)` via `occupiedEnrollmentWhere(now)`; never introduce a
  stored counter or a write. `formatSeatsLeft` is the sole label formatter. *(Roster views query
  enrollments directly and are not bound by the occupancy definition — leave 6.1's roster query as-is.)*
- **AD-3 — Auth at the data/entry layer.** Do NOT weaken any `requireSession()` / `requireAdmin()` guard;
  they must still run FIRST, before any fetch or JSX. Presentation-only edits must not move guards.
- **AD-9 — Money is integer cents; format at the UI edge.** Keep `formatZar`/`formatSignedZar` as the only
  Rand converters. No float maths.
- **AD-10 — Join details gated by CONFIRMED.** Do not surface `meetingUrl`/`location` anywhere new; the
  detail page's conditional select stays untouched.
- **Consistency conventions (spine):** errors to the user = `sonner` toast at the client island (UX-DR5);
  styling reuses the navy+gold tokens + shadcn primitives (no new palette); NFR10 floor on every control.
- **RSC-500 trap (lessons-learned + 1.5):** a Server Component must never pass a Client Component *element*
  through a non-`children` prop. `EmptyState.action` is plain `{ href, label }` data, not JSX. Every page
  adopting `EmptyState` is a Server Component — keep the props serialisable.

### UX rules being satisfied (DESIGN.md / EXPERIENCE.md)

- **UX-DR3** — "Class full" state consistent (Task 1/4).
- **UX-DR4** — empty states consistent (Task 1–3). EXPERIENCE.md "State Patterns": a list/guide that can be
  empty must render a clear state, "never a 404 / never dead". Empty states must not look broken.
- **UX-DR5** — `sonner` error toast at the island (Task 5).
- **UX-DR6 / NFR10 Accessibility Floor** — keyboard-operable, visible focus ring (`--ring`), ≥44px target,
  state carried in text, both-mode contrast via tokens (Task 6). One gold accent CTA per view group — the
  `EmptyState` accent CTA must not compete with another gold CTA on the same screen.
- **UX-DR2** — gold is a spice: emphasis/accents only, one gold CTA per group. Empty-state CTAs that are
  navigational (e.g. "Browse available classes") should be subordinate links, NOT a second gold button,
  unless the empty state IS the primary action (admin "Create a class").

### Design tokens (DESIGN.md) — use tokens, never hex

`--accent` / `--accent-foreground` (gold CTA fill), `--ring` (focus ring), `--muted-foreground` (secondary
copy), `--card` / `--border` (Card), `--destructive` (destructive actions). Dark is the default mode
(`<html class="dark">`); every token flips per mode — that is exactly why hardcoded hex is forbidden.

### Testing standards

- Framework: **vitest** (jsdom for component tests). Component render tests use `@testing-library/react` —
  mirror `tests/unit/portal-nav.test.tsx` (already in the suite) for the `EmptyState` test.
- Pure display helpers (e.g. `CLASS_FULL_MESSAGE` usage) need no new pure-logic test beyond the existing
  `class-display` coverage — it's a constant, exercised via the component/page.
- No live DB in the sandbox: the empty states are the **default** render on the ADMIN-only seed, so the
  existing authenticated-route RSC-500 smoke covers them once CI runs; do not add DB-dependent tests here.
- Full-suite green is the bar: `npx prisma validate` + `npm run build` + `npm test`.

### Project Structure Notes

- New shared primitive lives at `src/components/ui/empty-state.tsx` (alongside the shadcn primitives it
  composes). Path alias `@/*` → `./src/*`.
- No changes under `src/lib/*` except the additive `CLASS_FULL_MESSAGE` constant in `class-display.ts`.
- Route groups `(portal)` / `(admin)` and their layouts own the single `<main>` landmark — adopting
  `EmptyState` must keep pages as plain `<div>` wrappers (no nested `<main>`, 1.3 a11y fix).

### Previous-story intelligence (Epic 6 + relevant Epic 3/5)

- **6-3 (done):** established `email.ts`/`meeting.ts`; confirmed the "email failure never rolls back the
  seat" pattern. No presentation overlap, but the toast-island conventions it relied on (UX-DR5) are the
  ones this story audits.
- **6-2 (done):** `mark-attendance-buttons.tsx` client island with sonner toast + `router.refresh()`;
  `MARK_ATTENDANCE_SUCCESS(outcome)` + attendance mapper. In-scope for the Task 5 audit.
- **6-1 (done):** admin roster page + its inline empty-state Card (Task 3 target). `enrollment-display.ts`
  formatters — leave untouched.
- **5-2 (done):** `cancel-enrollment-button.tsx` — AlertDialog + destructive token + sonner; a good
  reference for the a11y floor already met (min-h-44, focus ring, aria-busy, label carries refund state).
- **5-1 / 3.2 / 3.3:** `formatSeatsLeft`, the browse grid, and the detail page's full/enrolled/available
  branches are the exact surfaces Task 1/4 consolidate. The 3.3 deferred "inert Pay CTA not focusable"
  item is already closed by 3.4 — do not regress it.
- **Cross-cutting deferrals to RESPECT (do not resolve here):** display timezone (2.2/2.3), AD-12⇄AD-8
  re-book collision (5.2). These are out of scope for a presentation polish.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.4] — AC (UX-DR3/4/5, NFR10/UX-DR6).
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-3/#AD-5/#AD-9/#AD-10] and #Consistency Conventions (sonner toast, tokens, NFR10 floor).
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md] — tokens, UX-DR2 (one gold CTA), gold-as-spice.
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/EXPERIENCE.md#State Patterns / #Accessibility Floor] — empty state "never looks broken"; keyboard/focus/≥44px/contrast.
- [Source: acce-nextjs/src/lib/class-display.ts] — `formatSeatsLeft` (single source), add `CLASS_FULL_MESSAGE`.
- [Source: acce-nextjs/src/lib/reserve-schema.ts / cancel-schema.ts / attendance-schema.ts] — toast mappers + "Something went wrong — please try again" fallback.
- [Source: acce-nextjs/tests/unit/portal-nav.test.tsx] — jsdom render-test pattern for the new EmptyState test.
- [Source: ~/.claude/knowledge/lessons-learned.md] — RSC-500 non-children-prop trap.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent)

### Debug Log References

No debug issues encountered. All tasks completed cleanly on first pass.

### Completion Notes List

- **Task 1**: Created `src/components/ui/empty-state.tsx` as a pure Server Component. Props: `{title?, message, action?: {href, label, accent?}}`. action is plain data (RSC-500 safe). CTA renders as Button asChild wrapping next/link. min-h-[44px] + focus-visible ring + token colours. accent prop controls gold CTA vs subordinate link per UX-DR2.

- **Task 2**: Replaced 3 inline empty Cards in portal pages with `<EmptyState />`. my-classes gets a subordinate (not accent) link to /portal/classes per UX-DR2. No behavioural change — same guards, queries, routes.

- **Task 3**: Replaced 4 inline empty Cards in admin pages with `<EmptyState />`. admin/classes keeps accent=true CTA (primary action). admin/students, roster, student-wallet have no CTA. All swaps were purely mechanical — no entanglement found. Removed now-unused Card/CardContent imports where applicable.

- **Task 4**: Added `CLASS_FULL_MESSAGE = "This class is fully booked. Check back in case a seat opens up."` to class-display.ts. Both portal/classes and portal/classes/[id] now import and render this constant. formatSeatsLeft("Class full" badge) is untouched (AD-5 single source).

- **Task 5**: Audited all 5 action islands. Result:
  - pay-with-balance-button.tsx: toast.error via getReserveErrorMessage (fallback "Something went wrong — please try again") + catch. COMPLIANT.
  - pay-online-button.tsx: toast.error via getReserveErrorMessage + catch. COMPLIANT.
  - cancel-enrollment-button.tsx: toast.error via getCancelErrorMessage + catch. COMPLIANT.
  - mark-attendance-buttons.tsx: toast.error via getMarkAttendanceErrorMessage + catch. COMPLIANT.
  - credit-wallet-form.tsx: ok:false branch uses result.message ?? "Please fix the errors above." (not a toast.error for domain errors — that's a form error flow, NOT a UX-DR5 toast divergence; it maps field errors to form and shows toast); catch block used "Something went wrong. Please try again." (period divergence) → FIXED to "Something went wrong — please try again" (em-dash, canonical UX-DR5).

- **Task 6**: A11y audit results:
  - portal/classes/page.tsx: View class Button has focus ring via Button cva base. Full-card footer text (no CTA). EmptyState CTA has ring.
  - portal/classes/[id]/page.tsx: Back link already had focus ring. PayWithBalanceButton, PayOnlineButton, CancelEnrollmentButton — all compliant from prior stories.
  - portal/my-classes/page.tsx: View details Link had h-11 + focus ring. CancelEnrollmentButton compliant.
  - portal/wallet/page.tsx: No interactive controls except nav.
  - admin/classes/page.tsx: New class Button has cva ring. Ghost Roster/Edit Buttons have cva ring.
  - admin/students/page.tsx: View/credit ghost Button has cva ring.
  - admin/classes/[id]/page.tsx: FIXED back link — added focus-visible:ring-2 focus-visible:ring-ring. MarkAttendanceButtons compliant.
  - admin/students/[id]/page.tsx: FIXED back link — added focus-visible:ring-2 focus-visible:ring-ring. CreditWalletForm compliant.

- **Task 7**: Added `tests/unit/empty-state.test.tsx` with 8 tests covering message, title, action link, omit-CTA, min-h-[44px], focus-visible:ring, text-muted-foreground classes. prisma validate: clean. npm run build: "Compiled successfully" — all portal/admin routes present. npm test: 507/507 vitest green (8 new). e2e manifest unchanged.

### File List

- acce-nextjs/src/components/ui/empty-state.tsx (CREATED)
- acce-nextjs/src/lib/class-display.ts (MODIFIED — added CLASS_FULL_MESSAGE constant)
- acce-nextjs/src/app/(portal)/portal/classes/page.tsx (MODIFIED — EmptyState, CLASS_FULL_MESSAGE)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (MODIFIED — CLASS_FULL_MESSAGE)
- acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx (MODIFIED — EmptyState)
- acce-nextjs/src/app/(portal)/portal/wallet/page.tsx (MODIFIED — EmptyState)
- acce-nextjs/src/app/(admin)/admin/classes/page.tsx (MODIFIED — EmptyState, removed Card/CardContent)
- acce-nextjs/src/app/(admin)/admin/students/page.tsx (MODIFIED — EmptyState, removed Card/CardContent)
- acce-nextjs/src/app/(admin)/admin/classes/[id]/page.tsx (MODIFIED — EmptyState, a11y back link)
- acce-nextjs/src/app/(admin)/admin/students/[id]/page.tsx (MODIFIED — EmptyState, a11y back link)
- acce-nextjs/src/app/(admin)/admin/students/[id]/credit-wallet-form.tsx (MODIFIED — canonical catch wording)
- acce-nextjs/tests/unit/empty-state.test.tsx (CREATED)

## Change Log

- 2026-07-06: Implementation complete — shared EmptyState component created; adopted across 7 portal/admin pages; CLASS_FULL_MESSAGE constant added unifying full-class copy; credit-wallet-form catch wording fixed to canonical UX-DR5 fallback; admin back links got focus-visible rings (a11y); 8 new jsdom unit tests added; 507/507 vitest green, build clean, prisma validate clean (claude-sonnet-4-6 autopilot, Story 6.4 dev-story → review)
