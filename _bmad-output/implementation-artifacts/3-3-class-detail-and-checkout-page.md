---
baseline_commit: a3210042ce00ef0c6d68ccebb8404367acb9cfd0
---

# Story 3.3: Class detail and checkout page

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want a class detail page with a checkout panel,
so that I can review the class and choose how to pay.

## Context & current state (READ FIRST)

Epic 1 and Epic 2 are `done` (foundation, auth, admin class CRUD). Epic 3 is in-progress: **3.1 (`done`)**
built the wallet domain (`src/lib/wallet.ts` — `getBalance` + the serialized `mutate` seam) and the read-only
wallet page; **3.2 (`done`)** built the student browse listing at `(portal)/portal/classes` where each available
class Card links forward to `/portal/classes/${id}` — **the detail route THIS story builds.**

**This story = the class detail + checkout PAGE at `(portal)/portal/classes/[id]` (a dynamic route).** It is a
**read-only** server component: it shows full class info, gates the Meet-link/location reveal behind a `CONFIRMED`
enrollment (FR6 / AD-10), and presents a **checkout panel** that computes — server-side — whether the viewer's
wallet balance is enough to book, showing a **"Pay with balance"** affordance when it is.

**CRITICAL SCOPE BOUNDARY — the actual booking is Story 3.4, not this one.** The canonical seat reservation
(`reserveSeat` in `src/lib/enrollment.ts`, the `wallet.mutate` `BOOKING_CHARGE`, AD-4/AD-6) and the UX-DR5
success/error toast are **Story 3.4's** acceptance criteria. In 3.3 the **"Pay with balance" button is rendered
but INERT (disabled / non-submitting)** — a forward affordance, exactly like Story 2.2 rendered an Edit link to
the not-yet-built 2.3 route. 3.4 will convert the panel to a client island, add `reserveSeat`, wire the button,
and add the toast. **3.3 issues NO write of any kind and calls NO reservation/wallet-mutation code.**

What already exists and MUST be reused (do NOT recreate):

- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED page-level guard (AD-3). Call it at the TOP of
  the page **before any data fetch or JSX**. Any authenticated session (STUDENT+) may view a class detail page;
  balance and enrollment lookups are keyed to `session.user.id`. [Source: acce-nextjs/src/lib/auth-guards.ts:25]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`getBalance(studentId)`** in `src/lib/wallet.ts` — returns the student's balance in integer cents
  (`Σ LedgerEntry.amountCents`, AD-6). Use it read-only to compute checkout eligibility. **Do NOT call
  `wallet.mutate` in this story** (that is 3.4). [Source: acce-nextjs/src/lib/wallet.ts:83]
- **`occupiedEnrollmentWhere(now)` + `computeSeatsLeft(capacity, occupied)`** in `src/lib/class-occupancy.ts` —
  the AD-5 single-source occupancy predicate + seats-left maths. Reuse via a filtered `_count` exactly like 3.2.
  **Do NOT re-derive.** [Source: acce-nextjs/src/lib/class-occupancy.ts]
- **`formatZar(cents)`, `formatMode(mode)`, `formatSeatsLeft(seatsLeft)`** in `src/lib/class-display.ts` — reuse
  all three. `formatZar` is the ONLY cents→Rand converter (AD-9). No new display helper is required for this story.
  [Source: acce-nextjs/src/lib/class-display.ts]
- **The 2.3 edit page** — `(admin)/admin/classes/[id]/edit/page.tsx` — is the closest structural analog for a
  **dynamic `[id]` server page**: `params: Promise<{ id: string }>` awaited, `requireX()`-first, `findUnique` by
  id, `notFound()` when missing, serialisable-only props. **Mirror its dynamic-route + notFound shape.** [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx]
- **The 3.2 browse page** — `(portal)/portal/classes/page.tsx` — is the closest analog for the **portal reader +
  filtered `_count` occupancy + navy/gold Card + formatZar/formatMode/formatSeatsLeft** pattern. Reuse its
  `formatDateTime` (native `toLocaleString("en-ZA", …)`, no timeZone pin — timezone hardening is deferred). [Source: acce-nextjs/src/app/(portal)/portal/classes/page.tsx]
- **shadcn primitives present** in `src/components/ui/`: `card`, `badge`, `button`, `separator`, `alert`. Use them —
  no new dependency, no new palette (navy+gold tokens only). [Source: acce-nextjs/src/components/ui/*]
- **`tests/e2e/authenticated-routes.ts`** — the 1.5 authenticated-route manifest. Append the dynamic detail route
  using the deterministic seeded id (mirrors the 2.3 edit entry `/admin/classes/seed-class-acc-1/edit`). [Source: acce-nextjs/tests/e2e/authenticated-routes.ts]

**This story = a read-only `(portal)/portal/classes/[id]/page.tsx` (server component) + a `/portal/classes/[id]`
e2e manifest entry. NO `reserveSeat`/`wallet.mutate`/`BOOKING_CHARGE`/enrollment write (3.4), NO Paystack
(Epic 4), NO UX-DR5 toast wiring (3.4), NO schema/migration/dependency change, NO writes of any kind.**

## Acceptance Criteria

**AC1 — The detail page shows full class info + a checkout panel offering "Pay with balance" when balance is sufficient (FR7, UX-DR2).**
Given a `SCHEDULED`, future-start class,
When I open `/portal/classes/${id}`,
Then I see full class info — subject name, title, description (if present), formatted date/time, per-seat price
(`formatZar(priceCents)`, AD-9), mode (`formatMode`), and a **"N seats left" `Badge`** (`formatSeatsLeft` over
`computeSeatsLeft(capacity, occupied)` with `occupied` from the reused `occupiedEnrollmentWhere(now)` filtered
`_count`, AD-5) — **and** a **checkout panel**. When my wallet balance (`getBalance(session.user.id)`) is **≥ the
per-seat price** and the class is not full and I am not already enrolled, the panel presents a token-styled
**"Pay with balance"** affordance (the Paystack option arrives in Epic 4). The button is a **forward affordance —
rendered but disabled/non-submitting in this story**; the live reserve action is Story 3.4.

**AC2 — Without a CONFIRMED enrollment, the Meet link / location is hidden (FR6, AD-10).**
Given I do **not** hold a `CONFIRMED` enrollment for this class,
When I view the detail page,
Then the class's `meetingUrl` (online) / `location` (in-person) is **not shown** — and, per AD-10, is **omitted
server-side** (never selected into the rendered output / never sent to the client), not merely visually hidden.

**AC3 — With a CONFIRMED enrollment, the Meet link (online) / location (in-person) is revealed (FR6, AD-10).**
Given I hold a `CONFIRMED` enrollment for this class,
When I view the detail page,
Then the join detail is revealed **mode-dependently**: for an `ONLINE` class the `meetingUrl` (as a clickable
link), for an `IN_PERSON` class the `location`. The checkout panel shows an **"You're enrolled"** state instead of
a "Pay with balance" affordance (a confirmed student does not re-checkout).

**AC4 — Insufficient balance and full-class states are handled without a misleading Pay affordance (UX-DR3, UX-DR6).**
Given the class is full (`computeSeatsLeft === 0`) OR my balance is below the price,
When the checkout panel renders,
Then it shows a clear, calm state — **"Class full"** (no Pay affordance) when full, or an **insufficient-balance**
message (balance shown, "online payment arrives soon" — Epic 4) when balance < price — and it does **not** present
an active/misleading "Pay with balance" button. Label text (not colour alone) carries the state (UX-DR6).

**AC5 — Authorization enforced at the page entry; a missing/unknown id 404s (AD-3).**
Given an unauthenticated actor,
When they request `/portal/classes/${id}` directly (bypassing the `(portal)` layout),
Then `requireSession()` at the top of the page redirects them to `/sign-in` before any class/balance/enrollment
data is fetched. Given an authenticated viewer and an `id` that matches no `GroupSession`, the page calls
`notFound()` (Next 404) rather than rendering an empty/broken page. Balance and enrollment lookups are keyed to
`session.user.id` only (never a client-supplied id).

**AC6 — Chain stays green (no regressions), read-only, no schema change.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean; `/portal/classes/[id]`
appears in the route table as `ƒ Dynamic`), and `npm test` (vitest) stays green. No schema/migration/dependency
files are modified; the page issues **no write of any kind**. `/portal/classes/seed-class-acc-1` is appended to the
1.5 authenticated-route manifest so the 200-smoke covers the dynamic detail route (live authenticated run remains
deferred to CI ephemeral-Postgres).

## Tasks / Subtasks

- [x] **Task 1 — Class detail + checkout page (server component, dynamic route, read-only) (AC1–AC5).**
  - [x] Create `src/app/(portal)/portal/classes/[id]/page.tsx` as a **server component** with
    `interface Props { params: Promise<{ id: string }> }` (Next 16 — `params` must be awaited; mirror the 2.3 edit
    page shape).
  - [x] `await requireSession()` FIRST (AD-3, trusted guard) → capture `studentId = session.user.id`. Then
    `const { id } = await params;` and `const now = new Date();` (compute once, AD-5).
  - [x] **Determine enrollment state BEFORE deciding which fields to fetch (AD-10 gating):**
    (`studentId_groupSessionId` is the Prisma accessor for `@@unique([studentId, groupSessionId])`.)
  - [x] Fetch the class by id. **AC2/AC3 (AD-10):** `meetingUrl` / `location` selected ONLY when `isConfirmed`
    (conditional two-branch `findUnique`; server-side omission). If `!cls` → `notFound()` (AC5).
  - [x] Compute `occupied`, `seatsLeft`, `isFull`, `balanceCents` (getBalance — read-only), `canPayFromBalance`.
  - [x] Render: back link → class info block → checkout panel Card with all four states (enrolled/full/balance-ok/insufficient).
  - [x] **Fully server-rendered — no client island** (consistent with 3.1/3.2; avoids the 1.5 RSC non-children-prop
    500 trap). The checkout panel is presentational only in 3.3.
- [x] **Task 2 — Wiring: e2e manifest (AC6).**
  - [x] `tests/e2e/authenticated-routes.ts`: appended `{ path: "/portal/classes/seed-class-acc-1", role: "STUDENT" }`
    (deterministic seeded class id, mirrors the 2.3 `/admin/classes/seed-class-acc-1/edit` entry). Manifest shape
    unchanged.
- [x] **Task 3 — Verify the chain (AC6).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; `/portal/classes/[id]` present in the route table as `ƒ Dynamic`).
  - [x] `npm test` → 223/223 vitest green (no regressions; no new unit tests required per story spec).
  - [x] Live-DB read of the detail page → **deferred to CI ephemeral-Postgres** (same wall as prior stories).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-10 — Join details gated by CONFIRMED (THE headline of this story):** `GroupSession.meetingUrl` / `location`
  are returned by the server data-fetch **only** to a viewer holding a `CONFIRMED` enrollment for that class. "For
  everyone else the fields are omitted server-side — not merely hidden in the component (so they never reach the
  client payload)." Implement by looking up the viewer's `Enrollment.status` first and **conditionally selecting**
  the sensitive fields only when `CONFIRMED`. Reveal is mode-dependent per FR6: ONLINE→`meetingUrl`, IN_PERSON→
  `location`. [Source: ARCHITECTURE-SPINE.md#AD-10; epics.md#Story 3.3 / FR6]
- **AD-3 — Authorization at the entry layer:** `requireSession()` at the top of the page is the trusted guard; the
  `(portal)` layout is defense-in-depth only. `(portal)` entries require a `STUDENT`+ session. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-5 — Capacity is derived, never stored; readers never write:** `occupied = count(Enrollment where status ∈
  {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now))`; `seatsLeft = max(0, capacity −
  occupied)`. This page is a READER — it issues NO write, including NO lazy PENDING→CANCELLED flip (that belongs
  only inside a locked mutation in `enrollment.ts`, Story 3.4/Epic 4). Reuse `occupiedEnrollmentWhere` +
  `computeSeatsLeft` (single source). [Source: ARCHITECTURE-SPINE.md#AD-5; class-occupancy.ts]
- **AD-9 — Money is integer cents (ZAR):** `priceCents` and the wallet balance are integers; the balance-vs-price
  comparison (`balanceCents >= priceCents`) runs in cents; format to Rand ONLY at the UI edge via `formatZar`. No
  floats. [Source: ARCHITECTURE-SPINE.md#AD-9; class-display.ts]
- **AD-6 — Wallet is read-only here:** use `getBalance(studentId)` to READ the balance for the checkout-eligibility
  display. **Never** call `wallet.mutate` in this story — the balance mutation (BOOKING_CHARGE) is Story 3.4. [Source: ARCHITECTURE-SPINE.md#AD-6; wallet.ts]
- **AD-4 — One canonical seat reservation lives in 3.4:** `reserveSeat()` (the Serializable tx that creates the
  CONFIRMED enrollment + BOOKING_CHARGE) is NOT built here. 3.3 only presents the affordance. Do NOT introduce a
  second reservation path. [Source: ARCHITECTURE-SPINE.md#AD-4; epics.md#Story 3.4]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive route-group isolation:** the new route lives only under `(portal)/portal/classes/[id]`; marketing
  routes, SEO, sitemap, headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Capability map:** "Join-details gating (FR6)" lives in the server data-fetch, governed by AD-10; "Class
  discovery + seats-left (FR4,5)" lives under `(portal)/portal/classes/**`, governed by AD-5, AD-10. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Scope boundary (do NOT do — belongs to other stories)
- **No `reserveSeat` / `wallet.mutate` / `BOOKING_CHARGE` / enrollment create/confirm / any write** — Story 3.4
  (AD-4/AD-6). The "Pay with balance" button is inert (disabled) in 3.3; 3.4 makes it live and adds the UX-DR5 toast.
- **No Paystack / online payment** — Epic 4 (FR8–10). The panel only mentions it arrives soon; no init/handler.
- **No client island / `"use client"`** — 3.3 is fully server-rendered (the panel is presentational). 3.4 will
  convert the checkout panel to a client island when it wires the action.
- **No schema/migration/enum/dependency change; no date library; no new palette; no new display helper.**
- **No lazy expiry write** (AD-5 readers never write); **no admin credit / cancellation / roster / email code.**

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession { id cuid, subjectId + subject→Subject, level String, title, description?, start DateTime,
  end DateTime, capacity Int, priceCents Int, mode Mode @default(ONLINE), location String?, meetingUrl String?,
  status GroupSessionStatus @default(SCHEDULED), enrollments Enrollment[], updatedAt }`. Fetch by `id` via
  `findUnique`. [Source: acce-nextjs/prisma/schema.prisma#GroupSession]
- `Enrollment { id, studentId + student→User, groupSessionId + session→GroupSession, priceCents, status
  EnrollmentStatus @default(PENDING), pendingExpiresAt?, paymentRef? @unique, createdAt, @@unique([studentId,
  groupSessionId]) }`. The compound-unique Prisma accessor is **`studentId_groupSessionId`**. `EnrollmentStatus ∈
  {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`; **only `CONFIRMED` unlocks join details (AD-10).** [Source: acce-nextjs/prisma/schema.prisma#Enrollment / EnrollmentStatus]
- `Mode ∈ {ONLINE, IN_PERSON}` — controls which join detail is revealed (AD-10/FR6). [Source: schema.prisma#Mode]
- **Filtered relation `_count`:** `_count: { select: { enrollments: { where: occupiedEnrollmentWhere(now) } } }` runs
  the occupancy count in the DB (no N+1). Identical shape to 2.2/3.2. Prisma 6.19.3 (GA since 5.0). [Source: (portal)/portal/classes/page.tsx:91-98]

### Previous story intelligence (Epic 3 / Epic 2)
- **3.2 (done) is the closest portal analog** — the browse page renders each available class with a CTA linking to
  `/portal/classes/${id}` (this route). It reuses `occupiedEnrollmentWhere` + `computeSeatsLeft` +
  `formatZar/formatMode/formatSeatsLeft` and a native `formatDateTime`. Copy that fetch shape and the exact gold
  CTA class string (`bg-accent text-accent-foreground hover:bg-accent/90`, ≥44px). [Source: 3-2-…md; (portal)/portal/classes/page.tsx]
- **2.3 (done) is the closest dynamic-`[id]` analog** — `params: Promise<{ id }>` awaited, `requireX()`-first,
  `findUnique` by id, `notFound()` when missing, serialisable-only props. Mirror it for the guard/notFound/await
  pattern. **2.3 deferred item is directly relevant to AD-10 here:** an ONLINE→IN_PERSON edit can leave a stale
  `meetingUrl` on the row — so reveal the Meet link **only for `mode === "ONLINE"`** and the `location` only for
  `IN_PERSON`; never show a `meetingUrl` on an IN_PERSON class. [Source: 2-3-…md; deferred-work.md#story-2.3]
- **CTA token rule (2.1/2.2/3.2):** any gold CTA uses token classes (`bg-accent text-accent-foreground
  hover:bg-accent/90`) — NOT hardcoded hex — so gold+navy flip per light/dark mode (UX-DR2/DR6). [Source: 2-1-…md; 2-2-…md Review]
- **Timezone deferral (2.2/2.3/3.1/3.2):** display `start` via `toLocaleString("en-ZA", …)` with NO explicit
  `timeZone`; timezone hardening is a system-wide deferred decision — follow the same convention, do NOT pin a tz. [Source: deferred-work.md#story-2.2; 3-2-…md]
- **1.3 nested-`<main>` a11y fix:** the `(portal)` layout owns the single `<main>` — the page uses a `<div>`
  wrapper, not a second `<main>`. [Source: (portal)/portal/page.tsx]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a
  Server Component (silent HTTP 500). 3.3 is fully server-rendered (no client island) → safe; adding
  `/portal/classes/seed-class-acc-1` to the manifest gives the 200-smoke a regression net. [Source: 1-5-…md; lessons-learned]
- **Seed reality (1.4):** `seed-class-acc-1` (…`acc-2`, `tax-1/2`, `aud-1`, `maf-1`) are the 6 deterministic seeded
  `SCHEDULED` classes (future dates, cap 4–6, **no enrollments**, **no student user**). On a fresh seed every class
  shows full capacity as seats-left, nobody is `CONFIRMED` (so AD-10 hides join details everywhere), and no student
  has balance (so the checkout shows the insufficient-balance state) until Story 3.5 credits a wallet / 3.4 books.
  This is expected — the live enrolled/balance paths are a CI concern. [Source: acce-nextjs/prisma/seed-data.ts; 1-4-…md]
- **Sandbox reality (1.1/1.4/1.5/2.x/3.1/3.2):** prod DB creds are blocked interactively; live DB reads are deferred
  to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. Do NOT fake a live
  query. [Source: deferred-work.md; 3-2-…md Task 5]
- **Git:** work lands on branch `epic-3` (chained off the 3.2 tip). Net-new `portal/classes/[id]/page.tsx` + one
  e2e-manifest line — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR3, UX-DR5, UX-DR6, NFR10)
- **UX-DR2:** reuse shadcn `Card` + `Badge` + `Button` (accent-gold CTA) and the navy+gold tokens — **one gold
  accent CTA per view group.** On this page the single gold CTA is the "Pay with balance" affordance; keep any
  secondary control (Back link) subordinate (ghost/link). [Source: epics.md#UX-DR2]
- **UX-DR3:** the seats-left `Badge`; a full class shows a clear "Class full" state, not a dead Book button. [Source: epics.md#UX-DR3]
- **UX-DR6 / NFR10 accessibility floor:** every control (Back link, the inert Pay button, any join-detail link) is
  keyboard-operable with a visible focus ring, ≥44px touch target, both-mode contrast, honours
  `prefers-reduced-motion`. Do NOT rely on colour alone for full/insufficient/enrolled states — label text carries
  it (UX-DR6). A disabled button must still be perceivable/announced. [Source: epics.md; DESIGN.md]
- **UX-DR5 (deferred to 3.4):** the success/error toast on booking belongs to 3.4 (which wires the live action). 3.3
  renders no toast. [Source: epics.md#Story 3.4]
- Reuse the navy+gold token system — NO new palette. `Card` token is `--card` on `--border`, radius `0.625rem`. [Source: DESIGN.md]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate
  (`tests/e2e`, DB-bound) — add the dynamic route to `authenticated-routes.ts` but do not run it here. [Source: acce-nextjs/vitest.config.ts]
- **No new pure helper is introduced by this story**, so no new unit test is strictly required — the reused
  helpers (`occupiedEnrollmentWhere`, `computeSeatsLeft`, `formatZar`, `formatMode`, `formatSeatsLeft`) already have
  unit coverage (2.2/3.2). Do NOT unit-test the page itself (it imports `db` + needs `DATABASE_URL`); do NOT
  over-mock Prisma to fake the filtered `_count`, the enrollment lookup, or the AD-10 gate — the live behaviour is a
  CI concern. [Source: 3-2-…md; 3-1-…md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW file:
  - `src/app/(portal)/portal/classes/[id]/page.tsx` — server component (guard + read-only detail + AD-10-gated join
    details + presentational checkout panel).
- UPDATE (one line):
  - `tests/e2e/authenticated-routes.ts` — append `{ path: "/portal/classes/seed-class-acc-1", role: "STUDENT" }`.
- Aligns with the ARCHITECTURE-SPINE source tree: `(portal)/portal/` is seeded with `classes, classes/[id],
  my-classes, wallet`; `classes/[id]` is exactly this route. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Next 16 App Router**: `classes/[id]/page.tsx` is a server component by default; `params` is a `Promise` and
  must be awaited (`const { id } = await params;`). Route shows as `ƒ Dynamic` in the build table. Keep it
  server-rendered — no route handler or client island for a read-only detail page. [Source: 2-3-…md]
- **Prisma 6.19.3**: filtered relation `_count` runs the occupancy count in the DB (no N+1). Conditional-select on
  `meetingUrl`/`location` (AD-10) is a plain select-object toggle. [Source: (portal)/portal/classes/page.tsx]
- **`Intl`/`toLocaleString`**: format `start` with native `Date.toLocaleString("en-ZA", …)` (no `timeZone` pin —
  consistent with 2.2/2.3/3.1/3.2). No `date-fns`/`dayjs`. [Source: 3-2-…md]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 / Story 3.3 / Story 3.4 / FR6 / FR7 / UX-DR2 / UX-DR3 / UX-DR5 / UX-DR6]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-4, AD-5, AD-6, AD-9, AD-10, "Structural Seed", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#GroupSession / Enrollment / EnrollmentStatus / Mode / GroupSessionStatus]
- [Source: acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere + computeSeatsLeft — reuse)]
- [Source: acce-nextjs/src/lib/class-display.ts (formatZar/formatMode/formatSeatsLeft — reuse)]
- [Source: acce-nextjs/src/lib/wallet.ts (getBalance — read-only; do NOT call mutate)]
- [Source: acce-nextjs/src/lib/auth-guards.ts (requireSession); acce-nextjs/src/lib/db.ts (db singleton)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/page.tsx (3.2 reader + Card + formatDateTime analog)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx (2.3 dynamic-[id] + notFound analog)]
- [Source: acce-nextjs/tests/e2e/authenticated-routes.ts (manifest; 2.3 seed-class-acc-1 dynamic-route precedent)]
- [Source: _bmad-output/implementation-artifacts/3-2-browse-upcoming-classes-with-seats-left.md; 2-3-edit-an-existing-class.md; deferred-work.md]

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (via autopilot subagent, 2026-07-06)

### Debug Log References
No debug issues encountered. Build succeeded first pass; all 223 tests green.

### Completion Notes List
- Created `src/app/(portal)/portal/classes/[id]/page.tsx` as a fully server-rendered dynamic route.
- Guards: `requireSession()` first (AD-3), capturing `studentId = session.user.id` before any data fetch.
- AD-10 enforcement: enrollment lookup first (`findUnique` on `studentId_groupSessionId`); two-branch class fetch — CONFIRMED viewer gets `meetingUrl`+`location` selected; non-confirmed does not select them (server-side omission, not JSX hiding).
- Occupancy: reused `occupiedEnrollmentWhere(now)` + `computeSeatsLeft` filtered `_count` (AD-5 single-source, read-only).
- Wallet: `getBalance(studentId)` read-only for checkout eligibility; `wallet.mutate` NOT called (Story 3.4).
- Checkout panel: four states — enrolled (+ join details), full (no CTA), balance-ok (inert disabled "Pay with balance" forward affordance), insufficient-balance (calm message, Epic 4 reference).
- Token classes on CTA: `bg-accent text-accent-foreground hover:bg-accent/90` (2.1 code-review rule).
- No `<main>` in page; layout owns the landmark (1.3 a11y fix).
- No schema/migration/dependency change; no writes; no client island.
- Appended `/portal/classes/seed-class-acc-1` to the e2e authenticated-route manifest.
- Verifications: `prisma validate` clean, `npm run build` clean (`/portal/classes/[id]` as `ƒ Dynamic`), `npm test` 223/223 vitest green.

### File List
- `acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx` — NEW: server component detail+checkout page
- `acce-nextjs/tests/e2e/authenticated-routes.ts` — UPDATED: appended `/portal/classes/seed-class-acc-1` STUDENT entry

## Change Log
- 2026-07-06: Story 3.3 implemented — class detail+checkout page (server component, dynamic route). Created `(portal)/portal/classes/[id]/page.tsx` with AD-10 join-detail gating, AD-5 occupancy, AD-6 balance read-only, four checkout panel states (enrolled/full/balance-ok/insufficient). Appended dynamic route to e2e manifest. 223/223 vitest, build clean, prisma validate clean.
