---
baseline_commit: 8b9d49d7b6ba5035182f317d6285f4b01df4eee0
---

# Story 5.1: My classes with cancel and refund-tier preview

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want to see my upcoming classes and what I'd get back if I cancel now,
so that I can make an informed cancellation decision.

## Context & current state (READ FIRST)

Epics 1–4 are `done` (foundation/auth, admin class CRUD, browse+enroll+wallet, online payment+webhook). **Epic 5 (Cancellations & Refunds to Wallet) starts here.** This is the **first** story of Epic 5 and the **first** "my classes" surface in the app.

**This story = a read-only student page at `(portal)/portal/my-classes` that lists the viewer's CONFIRMED, upcoming enrollments, and — for each — shows a cancel affordance labelled with the refund % they'd get if they cancelled *now*.** The % comes from the AD-11 cancellation-tier logic based on hours-to-start.

**CRITICAL SCOPE BOUNDARY — the actual cancellation is Story 5.2, not this one.** Writing the `CANCELLATION_REFUND`/`CANCELLATION_FEE` ledger rows, flipping the enrollment to `CANCELLED`, and returning the seat to the pool are **Story 5.2's** acceptance criteria (FR13/FR14, AD-6/AD-11/AD-14). In 5.1 the **cancel button is rendered but INERT (disabled / non-submitting)** — a forward affordance, exactly like Story 3.3 rendered an inert "Pay with balance" button before 3.4 made it live. **5.1 issues NO write of any kind and calls NO cancellation/wallet-mutation code.** The preview % it shows is **advisory** (AD-11 last line: "The preview % in the UI is advisory; the server recomputes at cancel-time").

**One pure module IS built here (and unit-tested), because 5.2 will reuse it:** the AD-11 cancellation-tier logic. Building it now — pure, db-free, tested — and consuming it read-only in 5.1, then reusing the same `computeRefund` inside 5.2's locked mutation, guarantees the advisory preview % and the authoritative cancel-time refund can never diverge (single source, AD-11). This mirrors how `class-occupancy.ts` (`occupiedEnrollmentWhere`) was built + tested in 2.2 before `reserveSeat` consumed it in 3.4.

What already exists and MUST be reused (do NOT recreate):

- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED page-level guard (AD-3). Call it at the TOP of the page **before any data fetch or JSX**. `(portal)` entries require a STUDENT+ session; all lookups key off `session.user.id`, never a client-supplied id. [Source: acce-nextjs/src/lib/auth-guards.ts]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`formatZar(cents)`** in `src/lib/class-display.ts` — the ONLY cents→Rand converter (AD-9). Use it for the per-seat price and any refund-amount preview. Also `formatMode(mode)` if you show the mode. [Source: acce-nextjs/src/lib/class-display.ts]
- **The 3.1 wallet page** — `(portal)/portal/wallet/page.tsx` — is the closest structural analog for a **read-only portal server page + `Card` + `Table`/list + `formatEntryDate` (native `toLocaleString("en-ZA", …)`, no timeZone pin) + empty-state Card**. Copy its shape (guard-first, `Promise.all` fetch, plain `<div>` wrapper, empty-state pattern). [Source: acce-nextjs/src/app/(portal)/portal/wallet/page.tsx]
- **The 3.3 detail page** — `(portal)/portal/classes/[id]/page.tsx` — is the route each "my classes" row should link to for full class info + AD-10-gated join details (a CONFIRMED viewer sees the Meet link/location there). Do NOT re-implement the AD-10 gate in the list. [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx]
- **`PortalNav`** in `src/app/(portal)/portal-nav.tsx` — add a "My classes" link next to the existing "Classes"/"Wallet" links (same `Link` class string, ≥44px, focus ring). [Source: acce-nextjs/src/app/(portal)/portal-nav.tsx]
- **`tests/e2e/authenticated-routes.ts`** — the 1.5 authenticated-route manifest. Append `{ path: "/portal/my-classes", role: "STUDENT" }` (static route; mirrors the 3.1 `/portal/wallet` entry). The manifest even lists `/portal/my-classes` in its "HOW TO ADD ROUTES" example. [Source: acce-nextjs/tests/e2e/authenticated-routes.ts]
- **shadcn primitives present** in `src/components/ui/`: `card`, `badge`, `button`, `table`, `separator`. Use them — no new dependency, no new palette (navy+gold tokens only). [Source: acce-nextjs/src/components/ui/*]

**This story = a read-only `(portal)/portal/my-classes/page.tsx` (server component) + a NEW pure `src/lib/cancellation.ts` (tier constant + refund maths) + its unit test + a PortalNav "My classes" link + a `/portal/my-classes` e2e manifest entry. NO cancel write / no `enrollment.ts#cancel` / no `wallet.mutate` / no `CANCELLATION_REFUND`/`CANCELLATION_FEE` ledger row / no status flip / no seat-return (all Story 5.2), NO Paystack, NO client island, NO schema/migration/dependency change, NO writes of any kind.**

## Acceptance Criteria

**AC1 — "My classes" lists my CONFIRMED, upcoming enrollments with class details + a cancel affordance (FR12).**
Given I hold one or more `CONFIRMED` enrollments for classes whose `start` is in the future,
When I open `/portal/my-classes`,
Then I see each enrollment rendered with its class details — subject name, title, formatted date/time (`toLocaleString("en-ZA", …)`, no timeZone pin, consistent with 3.1/3.2/3.3), mode, and per-seat price (`formatZar(priceCents)`, AD-9) — and a **cancel affordance**. Rows are ordered by `start` ascending. The cancel affordance is a **forward affordance — rendered but disabled/non-submitting in this story**; the live cancel action is Story 5.2. Lookups are keyed to `session.user.id` only. Rows are limited to `status = CONFIRMED AND session.start > now` (a student's own confirmed, still-upcoming seats — the ones a cancel decision applies to).

**AC2 — The cancel affordance shows the refund % for the current tier from hours-to-start (FR12, FR14, AD-11).**
Given an enrollment I might cancel,
When I view its cancel affordance,
Then it shows the refund **%** for the current tier computed **server-side** from hours-to-start against the single `CANCELLATION_TIERS` constant with pinned comparators: **`h ≥ 48 → 100%`, `24 ≤ h < 48 → 70%`, `h < 24 → 0%`** (`h` = whole/fractional hours between `now` and `session.start`, computed in `src/lib/cancellation.ts`). The label carries the state in text (not colour alone, UX-DR6) — e.g. "Cancel — 100% refund", "Cancel — 70% refund", "Cancel — no refund". This % is **advisory** (AD-11): 5.2 recomputes authoritatively at cancel-time. Optionally show the previewed refund amount via `formatZar(computeRefund(priceCents, hours).refundCents)`.

**AC3 — No enrollments → a clear empty state (UX-DR4).**
Given I have no `CONFIRMED` upcoming enrollments,
When I open `/portal/my-classes`,
Then I see a clear, calm empty state (e.g. a `Card` with "You haven't booked any upcoming classes yet." and a subordinate link to `/portal/classes` to browse). No dead/enabled controls.

**AC4 — Authorization enforced at the page entry (AD-3).**
Given an unauthenticated actor,
When they request `/portal/my-classes` directly (bypassing the `(portal)` layout),
Then `requireSession()` at the top of the page redirects them to `/sign-in` before any enrollment data is fetched. The enrollment query filters strictly by `studentId = session.user.id` — a student can never see another student's classes.

**AC5 — The AD-11 cancellation-tier logic is a pure, unit-tested module (AD-9, AD-11).**
Given `src/lib/cancellation.ts` is created with the pure functions below,
When `npm test` runs,
Then a new `tests/unit/cancellation.test.ts` covers the tier boundaries and refund decomposition:
- `CANCELLATION_TIERS` constant (or equivalent) encodes the three tiers with the **pinned comparators** exactly (≥48→100, 24≤h<48→70, <24→0).
- `refundTierForHours(hours)` returns the correct tier/percentage at and around each boundary — **48.0 → 100%, 47.99 → 70%, 24.0 → 70%, 23.99 → 0%, 0 and negative → 0%**.
- `computeRefund(priceCents, hours)` returns `{ refundPct, refundCents, feeCents }` where `refundCents` derives from the tier and **`feeCents = priceCents − refundCents`** (the single decomposition, AD-11 — fee is never computed independently). Integer cents only, no floats (AD-9); assert `refundCents + feeCents === priceCents` for representative prices (e.g. 29000).

**AC6 — Chain stays green (no regressions), read-only, no schema change.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean; `/portal/my-classes` appears in the route table as `ƒ Dynamic`), and `npm test` (vitest) stays green with the new `cancellation.test.ts` added. No schema/migration/dependency files are modified; the page issues **no write of any kind**. `/portal/my-classes` is appended to the 1.5 authenticated-route manifest so the 200-smoke covers the route (live authenticated run remains deferred to CI ephemeral-Postgres).

## Tasks / Subtasks

- [x] **Task 1 — Pure AD-11 cancellation-tier module (AC2, AC5).**
  - [x] Create `src/lib/cancellation.ts` — **pure, db-free** (type-only imports only, so vitest/jsdom loads it without `DATABASE_URL`). Model header comment on `class-occupancy.ts`/`wallet-math.ts`.
  - [x] Export `CANCELLATION_TIERS` — the single source constant encoding `h ≥ 48 → 100%`, `24 ≤ h < 48 → 70%`, `h < 24 → 0%` (group variant; comment that a per-variant table swaps in later per AD-11).
  - [x] Export `hoursUntilStart(start: Date, now: Date): number` — `(start.getTime() − now.getTime()) / 3_600_000` (may be fractional/negative).
  - [x] Export `refundTierForHours(hours: number): { refundPct: number }` (or the tier object) — apply the **pinned comparators** exactly. Guard: negative/zero hours → 0%.
  - [x] Export `computeRefund(priceCents: number, hours: number): { refundPct: number; refundCents: number; feeCents: number }` — `refundCents = Math.round(priceCents * refundPct / 100)` (integer cents, AD-9), then **`feeCents = priceCents − refundCents`** (single decomposition — never compute fee independently). 100%→fee 0; 0%→refund 0, fee = priceCents.
- [x] **Task 2 — `tests/unit/cancellation.test.ts` (AC5).**
  - [x] Boundary tests for `refundTierForHours`: 48.0→100, 47.99→70, 24.0→70, 23.99→0, 0→0, −5→0.
  - [x] `computeRefund` invariants: for price 29000 at each tier assert `{refundCents, feeCents}` and **`refundCents + feeCents === priceCents`**; integer outputs; 100% and 0% edge cases.
- [x] **Task 3 — `(portal)/portal/my-classes/page.tsx` server component, read-only (AC1–AC4).**
  - [x] `await requireSession()` FIRST (AD-3) → `studentId = session.user.id`; `const now = new Date();` (compute once).
  - [x] Fetch the viewer's enrollments: `db.enrollment.findMany({ where: { studentId, status: "CONFIRMED", session: { start: { gt: now } } }, orderBy: { session: { start: "asc" } }, select: { id, priceCents, session: { select: { id, title, start, mode, subject: { select: { name } } } } } })`. Does **NOT** select `meetingUrl`/`location` (AD-10 stays in 3.3; each row links to `/portal/classes/[id]` for join details).
  - [x] For each row compute `hours = hoursUntilStart(session.start, now)`, `refundPct = refundTierForHours(hours).refundPct` + `computeRefund(...).refundCents` for an amount preview.
  - [x] Render a `Card`/list row per enrollment with subject, title, date/time, mode, `formatZar(priceCents)`, a **disabled** "Cancel — {pct}% refund" button (label carries state, UX-DR6), and a subordinate link to `/portal/classes/${session.id}` for details.
  - [x] Empty state (AC3) when the list is empty. Plain `<div>` wrapper — the `(portal)` layout owns the single `<main>` (1.3 a11y fix). **Fully server-rendered — no client island** (avoids the 1.5 RSC non-children-prop 500 trap; the live cancel island is 5.2).
- [x] **Task 4 — Wiring: nav link + e2e manifest (AC6).**
  - [x] `src/app/(portal)/portal-nav.tsx`: added a "My classes" `Link` to `/portal/my-classes` (reuses the exact existing link class string; keyboard-operable, ≥44px, focus ring).
  - [x] `tests/e2e/authenticated-routes.ts`: appended `{ path: "/portal/my-classes", role: "STUDENT" }` (static route; mirrors the 3.1 `/portal/wallet` entry). Manifest shape unchanged.
- [x] **Task 5 — Verify the chain (AC6).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; `/portal/my-classes` present in the route table as `ƒ Dynamic`).
  - [x] `npm test` → 405/405 green including the new `cancellation.test.ts` (54 new tests).
  - [x] Live-DB read of the page (needs a seeded student with a CONFIRMED upcoming enrollment) → **deferred to CI ephemeral-Postgres** (same wall as prior stories — the seed has no student/enrollment; the page renders its empty-state on a fresh seed).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-11 — Cancellation is server-computed from ONE tier constant (THE headline of this story's maths):** Refund % is computed server-side from hours-to-start against a single `CANCELLATION_TIERS` constant with **pinned comparators** — `h ≥ 48 → 100%`, `24 ≤ h < 48 → 70%`, `h < 24` (or no-show) `→ 0%`. The refund/fee split is a **single decomposition**: `refundCents` from the tier, then `feeCents = priceCents − refundCents` — never computed independently. The preview % in the UI is **advisory**; the server recomputes at cancel-time (Story 5.2). 5.1 builds this pure logic and uses it read-only; 5.2 reuses `computeRefund` inside the locked cancel mutation. [Source: ARCHITECTURE-SPINE.md#AD-11]
- **AD-3 — Authorization at the entry layer:** `requireSession()` at the top of the page is the trusted guard; the `(portal)` layout is defense-in-depth only. Filter the enrollment query by `studentId = session.user.id`. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-5 — Readers never write:** this page is a READER — it issues NO write, including NO lazy `PENDING → CANCELLED` expiry flip (that belongs only inside a locked mutation in `enrollment.ts`). We only list `CONFIRMED` rows, so expiry is not even in view here. [Source: ARCHITECTURE-SPINE.md#AD-5]
- **AD-6 — Wallet untouched here:** 5.1 neither reads nor writes the wallet. The `CANCELLATION_REFUND`/`CANCELLATION_FEE` ledger writes via `wallet.mutate` are Story 5.2. [Source: ARCHITECTURE-SPINE.md#AD-6]
- **AD-9 — Money is integer cents (ZAR):** `priceCents`, `refundCents`, `feeCents` are integers; all tier maths runs in cents; `refundCents = Math.round(priceCents * pct / 100)`; format to Rand ONLY at the UI edge via `formatZar`. No floats. [Source: ARCHITECTURE-SPINE.md#AD-9; class-display.ts]
- **AD-10 — Join details stay gated in 3.3:** do NOT select `meetingUrl`/`location` into the my-classes list. Each row links to `/portal/classes/[id]`, which already reveals the Meet link/location for a CONFIRMED viewer (server-side omission, built in 3.3). Keeps AD-10 single-sourced. [Source: ARCHITECTURE-SPINE.md#AD-10; (portal)/portal/classes/[id]/page.tsx]
- **AD-14 — `enrollment.ts` is the sole status writer:** the `CANCELLED` transition (with its GroupSession lock + seat-return) is Story 5.2's `enrollment.ts#cancel`. 5.1 writes NO status. [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive route-group isolation:** the new route lives only under `(portal)/portal/my-classes`; marketing routes/SEO/sitemap/headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Capability map:** "Cancellations (FR12,13,14)" lives in `lib/enrollment.ts#cancel`, governed by AD-6/AD-11/AD-14 — 5.1 builds the read/preview surface + the AD-11 tier module; the mutation lands in 5.2. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Scope boundary (do NOT do — belongs to Story 5.2 or other stories)
- **No cancel write of any kind** — no `enrollment.ts#cancel`, no status flip to `CANCELLED`, no `wallet.mutate`, no `CANCELLATION_REFUND`/`CANCELLATION_FEE` ledger row, no seat-return. All Story 5.2 (FR13/FR14). The cancel button is **inert/disabled** in 5.1; 5.2 makes it live (client island + confirm + `cancelEnrollmentAction` + UX-DR5 toast).
- **No client island / `"use client"`** — 5.1 is fully server-rendered (the cancel button is presentational). 5.2 converts it when it wires the action.
- **No AD-10 join-detail selection in the list** — link to 3.3's detail page instead.
- **No schema/migration/enum/dependency change; no date library; no new palette.**
- **No PENDING rows, no past classes, no admin/roster/attendance/email code.**

### The AD-12 ⇄ AD-8 collision this epic finally makes reachable (READ — cross-story awareness, NOT 5.1's job)
`deferred-work.md#AD-12` flags that Epic 5 is where the reactivation-vs-one-charge collision becomes reachable: re-booking a previously-`CANCELLED` class must **reactivate** the existing `Enrollment` row (AD-12, status-agnostic `@@unique([studentId, groupSessionId])`), but AD-8's partial-unique index forbids a second `BOOKING_CHARGE` on the same `enrollmentId`. **5.1 does NOT cancel anything, so it does NOT create a `CANCELLED` row and does NOT trigger this — the collision surfaces only once 5.2 lands the cancel flow.** Do not attempt to resolve it here; it is called out so the dev of 5.1 does not accidentally add cancel/reactivation logic. Resolution is 5.2's concern (key the partial-unique on an active-booking-cycle discriminator, or give a reactivated booking a fresh ledger identity, or null/supersede the prior charge under the lock). [Source: deferred-work.md#AD-12; ARCHITECTURE-SPINE.md#AD-8/#AD-12]

### Data model facts this story depends on (from schema.prisma — verified)
- `Enrollment { id, studentId + student→User, groupSessionId + session→GroupSession, priceCents Int, status EnrollmentStatus @default(PENDING), pendingExpiresAt?, paymentRef? @unique, createdAt, @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. Filter by `studentId` + `status: "CONFIRMED"` + nested `session: { start: { gt: now } }`. `EnrollmentStatus ∈ {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`. [Source: acce-nextjs/prisma/schema.prisma#Enrollment / EnrollmentStatus]
- `GroupSession { id, subjectId + subject→Subject, level String, title, description?, start DateTime, end DateTime, capacity Int, priceCents Int, mode Mode @default(ONLINE), location String?, meetingUrl String?, status GroupSessionStatus, ... }`. Reach it via the `session` relation on `Enrollment`; select only non-sensitive fields (NOT `meetingUrl`/`location`). [Source: schema.prisma#GroupSession]
- `LedgerType` already includes `CANCELLATION_REFUND` and `CANCELLATION_FEE` (used by 5.2, not 5.1). No enum change needed anywhere in Epic 5. [Source: schema.prisma#LedgerType]
- `Enrollment.priceCents` is the immutable **snapshot** taken at reserve-time (AD-16) — this is the amount 5.2 refunds against, and the amount 5.1 previews against. Use the enrollment's `priceCents`, not the (possibly-edited) class `priceCents`, for the refund preview. [Source: schema.prisma#Enrollment; ARCHITECTURE-SPINE.md#AD-16]

### Previous story intelligence (Epic 3 / Epic 4)
- **3.1 (done) is the closest read-only portal analog** — guard-first, `Promise.all`/`findMany`, `Card` + `Table`, native `formatEntryDate` (`toLocaleString("en-ZA", …)`, no timeZone pin), empty-state Card, plain `<div>` wrapper. Copy its structure. [Source: (portal)/portal/wallet/page.tsx]
- **3.3 (done) established the inert forward-affordance pattern** — an inert "Pay with balance" button rendered in 3.3, made live in 3.4. 5.1's inert "Cancel" button → 5.2 is the identical pattern. It also owns the AD-10 join-detail reveal; link to it rather than duplicating. [Source: 3-3-…md]
- **Pure-helper-ahead-of-consumer pattern (2.2 → 3.4):** `class-occupancy.ts` was pure + unit-tested in 2.2 before `reserveSeat` consumed it; `reserve-schema.ts` in 3.4; `credit-schema.ts` in 3.5. `cancellation.ts` follows the same rule — pure, db-free (type-only imports), unit-tested, consumed read-only in 5.1 and mutatingly in 5.2. [Source: class-occupancy.ts; reserve-schema.ts; 3-4-…md; 3-5-…md]
- **Money-at-edge rule (all money stories):** integer cents everywhere; `Math.round` when applying a percentage; format with `formatZar` only at the UI edge; assert `refund + fee === price` to catch rounding drift. [Source: class-display.ts; ARCHITECTURE-SPINE.md#AD-9]
- **Timezone deferral (2.2/2.3/3.1/3.2/3.3):** display `start` via `toLocaleString("en-ZA", …)` with NO explicit `timeZone`; hardening is a system-wide deferred decision — follow the convention, do NOT pin a tz. **Note the maths side:** `hoursUntilStart` uses absolute epoch-ms difference (`getTime()`), which is timezone-independent and correct regardless of display locale. [Source: deferred-work.md; 3-3-…md]
- **1.3 nested-`<main>` a11y fix:** the `(portal)` layout owns the single `<main>` — the page uses a `<div>` wrapper. [Source: (portal)/portal/page.tsx]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server Component (silent HTTP 500). 5.1 is fully server-rendered → safe; adding `/portal/my-classes` to the manifest gives the 200-smoke a regression net. [Source: 1-5-…md; lessons-learned]
- **Seed reality (1.4):** the seed provisions Priyanka (ADMIN) + 6 SCHEDULED classes but **no student user and no enrollments**. On a fresh seed `/portal/my-classes` renders its **empty-state**; the populated list + live refund-preview are a CI concern (needs a seeded/registered student with a CONFIRMED upcoming enrollment). Do NOT fake a live query. [Source: acce-nextjs/prisma/seed-data.ts; deferred-work.md]
- **Sandbox reality (1.1/…/4.x):** prod DB creds are blocked; live DB reads are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. [Source: deferred-work.md]
- **CTA/token rule (2.1/2.2/3.2):** any accented control uses token classes (`bg-accent text-accent-foreground …`) — NOT hardcoded hex — so gold+navy flip per light/dark mode. The 5.1 cancel button is **disabled** (subordinate), so it is not the gold CTA; keep it visually calm. [Source: 2-1-…md]
- **Git:** work lands on branch `epic-5` (chained off the epic-4 tip). Net-new `my-classes/page.tsx` + `cancellation.ts` + test + one nav link + one e2e-manifest line — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR4, UX-DR6, NFR10)
- **UX-DR4:** the no-enrollments empty state is a first-class state — a calm `Card` with a message + a subordinate link to browse classes, not a blank page. [Source: epics.md#UX-DR4]
- **UX-DR6 / NFR10 accessibility floor:** every control (nav link, the inert Cancel button, the details link) is keyboard-operable with a visible focus ring, ≥44px touch target, both-mode contrast. Do NOT rely on colour alone — the refund state is carried in the button **label text** ("100% refund" / "70% refund" / "no refund"). A disabled button must still be perceivable/announced. [Source: epics.md; DESIGN.md]
- **UX-DR2:** reuse shadcn `Card`/`Badge`/`Button` + navy+gold tokens — no new palette. The disabled Cancel button is subordinate (not a gold CTA); if any per-row accent exists keep it to one. [Source: epics.md#UX-DR2; DESIGN.md]
- **UX-DR5 (deferred to 5.2):** the cancel success/error toast belongs to 5.2 (which wires the live action). 5.1 renders no toast. [Source: epics.md#Story 5.2]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`, DB-bound) — add the static route to `authenticated-routes.ts` but do not run it here. [Source: acce-nextjs/vitest.config.ts]
- **New unit test required:** `tests/unit/cancellation.test.ts` covering `refundTierForHours` boundaries and `computeRefund` decomposition/invariants (AC5). This is the sandbox-provable core of the story.
- **Do NOT unit-test the page itself** (it imports `db` + needs `DATABASE_URL`); do NOT over-mock Prisma to fake the enrollment list — the live behaviour is a CI concern. Follow the 3.1/3.3 posture. [Source: 3-3-…md; 3-1-…md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `src/lib/cancellation.ts` — pure AD-11 tier constant + `hoursUntilStart` + `refundTierForHours` + `computeRefund` (db-free; type-only imports).
  - `src/app/(portal)/portal/my-classes/page.tsx` — read-only server component (guard + CONFIRMED-upcoming enrollment list + advisory refund preview + inert cancel affordance + empty state).
  - `tests/unit/cancellation.test.ts` — boundary + decomposition tests.
- UPDATE:
  - `src/app/(portal)/portal-nav.tsx` — add "My classes" link.
  - `tests/e2e/authenticated-routes.ts` — append `{ path: "/portal/my-classes", role: "STUDENT" }`.
- Aligns with the ARCHITECTURE-SPINE source tree: `(portal)/portal/` is seeded with `classes, classes/[id], my-classes, wallet` — `my-classes` is exactly this route. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Next 16 App Router**: `my-classes/page.tsx` is a server component by default; it reads `session` + `db` so it renders `ƒ Dynamic`. Keep it server-rendered — no route handler, no client island for a read-only page. [Source: 3-3-…md]
- **Prisma 6.x**: nested relation filter (`session: { start: { gt: now } }`) + nested `orderBy` (`{ session: { start: "asc" } }`) run in the DB. Select only non-sensitive `session` fields. [Source: (portal)/portal/classes/page.tsx]
- **`Intl`/`toLocaleString`**: format `start` with native `Date.toLocaleString("en-ZA", …)` (no `timeZone` pin). `hoursUntilStart` uses `getTime()` epoch-ms difference (tz-independent). No `date-fns`/`dayjs`. [Source: 3-1-…md; 3-3-…md]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5 / Story 5.1 / Story 5.2 / FR12 / FR13 / FR14 / UX-DR4 / UX-DR6]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-5, AD-6, AD-9, AD-10, AD-11, AD-14, AD-16, "Structural Seed", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#Enrollment / EnrollmentStatus / GroupSession / Mode / LedgerType]
- [Source: acce-nextjs/src/lib/class-display.ts (formatZar/formatMode — reuse); acce-nextjs/src/lib/auth-guards.ts (requireSession); acce-nextjs/src/lib/db.ts (db singleton)]
- [Source: acce-nextjs/src/app/(portal)/portal/wallet/page.tsx (3.1 read-only portal analog); acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (3.3 detail + AD-10 reveal to link to)]
- [Source: acce-nextjs/src/app/(portal)/portal-nav.tsx (nav link); acce-nextjs/tests/e2e/authenticated-routes.ts (manifest — /portal/my-classes example)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#AD-12 (cross-epic collision reachable in 5.2, not 5.1); 3-3-…md; 3-1-…md]

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Debug Log References
None — implementation was straightforward following prior story patterns (3.1/3.3 wallet/detail page analogs).

### Completion Notes List
- Created pure `src/lib/cancellation.ts` (no db/Prisma runtime import — type-only) with `CANCELLATION_TIERS`, `hoursUntilStart`, `refundTierForHours`, `computeRefund`. Follows the exact class-occupancy.ts/wallet-math.ts pattern (pure helper defined before its consuming stories).
- Created `tests/unit/cancellation.test.ts` with 54 tests covering: CANCELLATION_TIERS structure, hoursUntilStart arithmetic (tz-independent), refundTierForHours at all 6 AC5-required boundaries (48.0/47.99/24.0/23.99/0/−5), computeRefund decomposition invariant (refundCents + feeCents === priceCents) across varied prices (1000, 5000, 29000, 50050, 100000) and all three tier scenarios, Math.round integer-cents outputs, and edge cases.
- Created `src/app/(portal)/portal/my-classes/page.tsx`: server component, requireSession()-first (AD-3), fetches CONFIRMED upcoming enrollments by studentId, computes advisory refund per row via computeRefund, renders Card-per-row with subject/title/date/mode/price/inert cancel button (disabled, label carries refund state text per UX-DR6), empty-state Card (UX-DR4), plain `<div>` wrapper (1.3 a11y fix). No meetingUrl/location selected (AD-10). No writes (AD-5/AD-6/AD-14).
- Updated `src/app/(portal)/portal-nav.tsx`: added "My classes" Link to /portal/my-classes (reused exact existing link class string, h-11 ≥44px, focus ring per UX-DR6/NFR10).
- Updated `tests/e2e/authenticated-routes.ts`: appended `{ path: "/portal/my-classes", role: "STUDENT" }` — the static-route manifest entry matching the /portal/wallet pattern.
- Verification chain: `npx prisma validate` clean (schema untouched), `npm run build` tsc clean + `/portal/my-classes ƒ Dynamic` in route table, `npm test` 405/405 passing (22 test files, 54 new cancellation tests). No schema/migration/dependency change. No writes of any kind.

### File List
- acce-nextjs/src/lib/cancellation.ts (new)
- acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx (new)
- acce-nextjs/tests/unit/cancellation.test.ts (new)
- acce-nextjs/src/app/(portal)/portal-nav.tsx (updated — My classes nav link)
- acce-nextjs/tests/e2e/authenticated-routes.ts (updated — /portal/my-classes manifest entry)

### Change Log
- 2026-07-06: Story 5.1 implemented — pure cancellation-tier module (AD-11), my-classes server page (read-only, advisory refund preview, inert cancel affordance), nav link, e2e manifest entry. 54 new unit tests. tsc/build/prisma-validate all clean. 405/405 vitest passing.
