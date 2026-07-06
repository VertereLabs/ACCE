---
baseline_commit: 92fa690b85f1bf4960ddea81e7b7388e97005c57
---

# Story 3.4: Reserve and pay a seat from wallet balance

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student with enough balance,
I want to buy a seat instantly from my balance,
so that I'm confirmed without an external payment step.

## Context & current state (READ FIRST)

Epic 1 and Epic 2 are `done`. Epic 3 is in-progress: **3.1 (`done`)** built the wallet domain
(`src/lib/wallet.ts` — `getBalance` + the serialized `mutate` seam) + the wallet page; **3.2 (`done`)**
built the student browse listing; **3.3 (`done`)** built the class detail + checkout page at
`(portal)/portal/classes/[id]` — a **read-only** server component that renders a **"Pay with balance"
button that is currently INERT/disabled** (a forward affordance). **THIS story makes that button live.**

**This story = the first real seat purchase in the app.** It builds:
1. **`src/lib/enrollment.ts`** — a **NEW** domain module owning `reserveSeat()`, the **single canonical
   seat reservation** (AD-4). This is the first `enrollment.ts`, the first **`Serializable`** transaction,
   and the first place `wallet.mutate` is actually **called** (3.1 built the seam but never invoked it).
2. A **server action** (`(portal)/portal/classes/[id]/actions.ts`, `"use server"`) wrapping `reserveSeat`
   with the `requireSession` guard + Zod-validated input + a discriminated result.
3. A **client island** for the checkout panel's "Pay with balance" button that calls the action and shows a
   **sonner toast** on success/error (UX-DR5), then reveals the CONFIRMED state.
4. A **pure, unit-tested helper module** (reserve-input schema / result mapping), mirroring 2.1/2.3.

**This is a MONEY + CONCURRENCY path.** It moves real balance (a `BOOKING_CHARGE` debit) and prevents
overselling. Follow the ARCHITECTURE-SPINE invariants below to the letter — an isolation downgrade or a
mis-ordered lock silently reintroduces oversell or a negative balance.

**CRITICAL SCOPE BOUNDARIES:**
- **Balance path ONLY.** `reserveSeat` in 3.4 implements the **balance ≥ price → CONFIRMED + BOOKING_CHARGE**
  branch. The **insufficient-balance → PENDING + Paystack** branch is **Epic 4 (Story 4.1)** — build
  `reserveSeat` so Epic 4 extends it *in place* (do NOT create a second reservation path — AD-4 forbids it).
- **`enrollment.ts` is the SOLE writer of every `Enrollment.status` transition (AD-14).** No status `UPDATE`
  anywhere else (no reader, no page, no action). Reserve/confirm/cancel/expire all live here.
- **NO Paystack, NO cancellation/refund, NO admin credit (3.5), NO roster/attendance, NO email.**
- **NO schema/migration/enum/dependency change.** The models this story needs (`Enrollment`, `LedgerEntry`,
  the `@@unique`, the partial-unique BOOKING_CHARGE index) are already migrated.

What already exists and MUST be reused (do NOT recreate):

- **`wallet.mutate(tx, studentId, input)`** in `src/lib/wallet.ts` — the AD-6 single serialized balance
  mutation. It takes the **per-student advisory lock**, reads balance under the lock, guards non-negative
  (NFR4), and appends the immutable `LedgerEntry`. **`reserveSeat` MUST write the `BOOKING_CHARGE` through
  this — never `tx.ledgerEntry.create` directly.** Pass it the caller's `tx`, a **negative** `amountCents`
  (`-priceCents`), `type: "BOOKING_CHARGE"`, and `enrollmentId`. It throws `WalletInsufficientFundsError`
  when the balance would go negative — catch it and return a discriminated `insufficient_balance` result.
  [Source: acce-nextjs/src/lib/wallet.ts:126]
- **`WalletInsufficientFundsError`** (exported from `wallet.ts`) — the typed error to catch for the
  insufficient-balance result. [Source: acce-nextjs/src/lib/wallet.ts:46]
- **`occupiedEnrollmentWhere(now)`** + **`computeSeatsLeft`** + **`capacityBelowOccupied`** in
  `src/lib/class-occupancy.ts` — the AD-5 occupancy predicate + maths. Count occupancy **inside the lock**
  with `occupiedEnrollmentWhere(now)`; the reserve check is `occupied < capacity`. Reuse — do NOT re-derive.
  [Source: acce-nextjs/src/lib/class-occupancy.ts]
- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call it FIRST in the
  server action; capture `studentId = session.user.id`. Never accept a client-supplied student id.
  [Source: acce-nextjs/src/lib/auth-guards.ts:25]
- **`db` singleton** from `@/lib/db` (`@prisma/adapter-pg` + `pg.Pool`) — the ONLY `PrismaClient` (AD-2).
  It supports `db.$transaction(fn, { isolationLevel, maxWait, timeout })`. Never `new PrismaClient()`.
  [Source: acce-nextjs/src/lib/db.ts]
- **`updateClassAction` (2.3)** — `(admin)/admin/classes/[id]/edit/actions.ts` — the CLOSEST structural
  analog: it is the existing `db.$transaction` + **`SELECT … FOR UPDATE`** on the `GroupSession` row +
  count-under-lock pattern. **Mirror its `$queryRaw<{...}[]>\`… FOR UPDATE\`` lock, its count-inside-the-lock,
  and its discriminated `{ ok: … }` result.** Your addition on top: `Serializable` isolation + a retry loop
  (AD-4) + the `wallet.mutate` charge. [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/actions.ts]
- **`createClassAction` (2.1)** — the server-action skeleton (guard → Zod safeParse → discriminated result).
  [Source: acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts]
- **`ClassForm` (2.1)** — the `"use client"` + react-hook-form + **`toast` from `@/components/ui/sonner`** +
  gold-token CTA pattern for the client island. The sonner Toaster is already mounted app-wide.
  [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx]
- **The 3.3 detail page** — `(portal)/portal/classes/[id]/page.tsx` — already computes `occupied`,
  `seatsLeft`, `isFull`, `balanceCents`, `canPayFromBalance`, `isConfirmed` and renders the four checkout
  states. **You extend it: replace the inert `<Button disabled>` "Pay with balance" with the client island**;
  everything else (AD-10 join-detail gating, AD-5 occupancy read, the enrolled/full/insufficient states) stays.
  [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx]
- **shadcn `button` + `sonner`** in `src/components/ui/` — reuse. No new dependency, no new palette.

**This story = `src/lib/enrollment.ts` (`reserveSeat`, balance path) + a server action + a client-island Pay
button + a pure helper with unit tests + wiring the 3.3 panel to reveal CONFIRMED after booking. NO Paystack,
NO cancel/refund, NO admin credit, NO roster/email, NO schema/migration/dependency change, NO status write
outside `enrollment.ts`.**

## Acceptance Criteria

**AC1 — A locked, Serializable reservation creates a CONFIRMED enrollment + BOOKING_CHARGE and decrements seats-left (FR7, AD-4, AD-5, AD-6, AD-8, AD-9).**
Given the reservation runs in **one interactive `Serializable` transaction** that (a) locks the `GroupSession`
row with `SELECT … FOR UPDATE`, (b) guards `status = 'SCHEDULED'` **and** `start` is in the future, and
(c) counts occupied (`PENDING`+`CONFIRMED`, unexpired via `occupiedEnrollmentWhere(now)`) `< capacity`,
When I book a class where my wallet balance (`getBalance`) `≥ priceCents`,
Then a **`CONFIRMED`** `Enrollment` is created for `(studentId, groupSessionId)` with `priceCents` snapshotted
from the class, **and** a **`BOOKING_CHARGE`** `LedgerEntry` of `-priceCents` is appended **via `wallet.mutate`**
(never a direct `ledgerEntry.create`), so the derived `seatsLeft` decrements by one. All money is integer cents
(AD-9). The enrollment is created **before** the charge so `wallet.mutate` receives its `enrollmentId` (AD-8).

**AC2 — A student already holding a non-cancelled enrollment cannot re-book (FR11, AD-12).**
Given I already hold a **non-cancelled** enrollment (`PENDING`/`CONFIRMED`/`ATTENDED`/`NO_SHOW`) for the class,
When I try to book it again,
Then the reservation is **rejected** with a clear discriminated result (e.g. `already_enrolled`) — enforced by
the in-transaction status check **and** backstopped by the `@@unique([studentId, groupSessionId])` constraint —
and **no** second `BOOKING_CHARGE` / no duplicate `Enrollment` is written. (A previously-`CANCELLED` row is the
AD-12 reactivation case — see Dev Notes; not reachable in Phase 1a until Epic 5's cancel path exists.)

**AC3 — A full class is rejected with "class full" and no ledger row is written (AD-5, NFR1).**
Given the class is already full (occupied `≥ capacity` at the moment of the lock),
When I try to book from balance,
Then the reservation is **rejected** with a discriminated `class_full` result, **no `Enrollment` is
created/confirmed, and no `LedgerEntry` (BOOKING_CHARGE) is written** — the whole transaction rolls back. The
occupancy count is evaluated **inside the `FOR UPDATE` lock** under `Serializable` isolation so a concurrent
buyer racing for the last seat cannot oversell (the no-oversell guarantee comes from **Serializable SSI**, not
the row lock alone — AD-4). Insufficient balance is likewise rejected (`insufficient_balance`) with nothing
written (the `wallet.mutate` NFR4 guard rolls the tx back).

**AC4 — Success or error surfaces a sonner toast and the confirmed state is revealed (UX-DR5, AD-10, UX-DR6).**
Given a booking succeeds or fails,
When the action returns,
Then the client island shows a **success toast** ("You're enrolled" etc.) or an **error toast** carrying the
specific failure ("Class full", "Insufficient balance", "You're already enrolled", or a generic retry message).
On success the page **re-renders to the CONFIRMED state** (via `revalidatePath`/`router.refresh`) so the
checkout panel flips to "You're enrolled" and the AD-10 join detail (Meet link / location) is now revealed by
the existing server gate. Every control is keyboard-operable, ≥44px, both-mode contrast; label text (not colour)
carries the state (UX-DR6/NFR10).

**AC5 — Authorization at the entry, no oversell/negative-balance path, chain stays green.**
The server action calls **`requireSession()` first** (AD-3) and keys every lookup to `session.user.id` (never a
client-supplied id); the `classId` is Zod-validated. `reserveSeat` is the **only** writer of `Enrollment.status`
and the **only** caller of `wallet.mutate` for `BOOKING_CHARGE` (AD-14/AD-8). `npx prisma validate` passes
(schema untouched), `npm run build` succeeds (tsc clean), and `npm test` (vitest) stays green **with new unit
tests for the pure reserve helper**. **No schema/migration/dependency change.** The live real-Postgres
concurrency (no-oversell / `40001`) integration test is **deferred to the CI ephemeral-Postgres job** (AD-4's
mandated test; same wall as 1.1/1.5/2.2/2.3) and recorded in `deferred-work.md`.

## Tasks / Subtasks

- [x] **Task 1 — `src/lib/enrollment.ts`: `reserveSeat` (balance path) (AC1, AC2, AC3, AD-4/5/6/8/12/14).**
  - [x] Create `src/lib/enrollment.ts`. Export `reserveSeat(studentId: string, classId: string)` returning a
    **discriminated union**: `{ ok: true; enrollmentId: string }` | `{ ok: false; reason: "class_full" |
    "already_enrolled" | "insufficient_balance" | "not_available" | "error" }`. Never throw across the boundary
    for expected failures.
  - [x] Wrap the body in `db.$transaction(async (tx) => { … }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout, maxWait })`
    (import `Prisma` from `@prisma/client`). **This is the AD-4 `Serializable` requirement — do NOT omit it.**
  - [x] **Retry loop (AD-4):** wrap the `$transaction` call in a bounded retry (e.g. up to 3–5 attempts with
    small backoff) that retries on Prisma **`P2034`** (write conflict / deadlock) **and** raw pg **`40001`**
    (serialization failure). On exhaustion return `{ ok: false, reason: "error" }`. (Unit mocks cannot exercise
    `40001` — the live proof is the deferred CI concurrency test.)
  - [x] Inside the tx, in order:
    1. **Lock** the row: `tx.$queryRaw<{ id: string; status: string; start: Date; capacity: number; priceCents: number }[]>\`SELECT id, status, "start", capacity, "priceCents" FROM "GroupSession" WHERE id = ${classId} FOR UPDATE\``
       (mirror the 2.3 `$queryRaw … FOR UPDATE`). Empty → `{ ok: false, reason: "not_available" }`.
    2. **State guard (AC1/AC3):** reject if `status !== 'SCHEDULED'` or `start <= now` → `not_available`.
    3. **Existing-enrollment check (AC2, AD-12):** `tx.enrollment.findUnique({ where: { studentId_groupSessionId: { studentId, groupSessionId: classId } } })`. If a row exists and `status !== 'CANCELLED'` → `{ ok: false, reason: "already_enrolled" }` (FR11). If it exists and **is** `CANCELLED` → this is the AD-12 reactivation branch (see Dev Notes; defensively reset the row — but this is unreachable in 3.4 since no cancel path exists yet). If none → create fresh below.
    4. **Capacity check under the lock (AC3, AD-5):** `const occupied = await tx.enrollment.count({ where: { groupSessionId: classId, ...occupiedEnrollmentWhere(now) } })`. If `occupied >= capacity` → `{ ok: false, reason: "class_full" }`.
    5. **Create/reactivate the enrollment as `CONFIRMED`** with `priceCents` snapshotted from the locked row
       (AD-16: the price snapshot is immutable thereafter), `pendingExpiresAt: null`, `paymentRef: null`.
    6. **Charge via `wallet.mutate(tx, studentId, { type: "BOOKING_CHARGE", amountCents: -priceCents, enrollmentId })`** —
       `WalletInsufficientFundsError` propagates OUT of the callback (tx rolls back, enrollment NOT persisted), caught in outer try/catch → `{ ok: false, reason: "insufficient_balance" }`. AD-6/AD-8.
    7. Return `{ ok: true, enrollmentId }`.
  - [x] Header comment documenting AD-4/5/6/8/12/14, the lock/charge order, and the Epic-4 PENDING-branch seam.
- [x] **Task 2 — Server action wrapping `reserveSeat` (AC1, AC5, AD-3).**
  - [x] Create `src/app/(portal)/portal/classes/[id]/actions.ts` (`"use server"`). Export
    `reserveSeatAction(input: unknown)`: (1) `await requireSession()` FIRST → `studentId = session.user.id`;
    (2) Zod-validate `{ classId: string.min(1) }` (a small pure schema — reuse in the unit test); (3) call
    `reserveSeat(studentId, classId)`; (4) on `ok:true`, `revalidatePath('/portal/classes/' + classId)` (and
    `/portal/wallet`) so the CONFIRMED state + ledger reflect immediately; (5) return the discriminated result.
    Never accept a client-supplied studentId.
- [x] **Task 3 — Client island: "Pay with balance" button (AC4, UX-DR5, UX-DR6).**
  - [x] Create `src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx` `"use client"` component
    taking `{ classId }` (plain string prop — serialisable, RSC-500 safe), rendering gold-token CTA
    (`bg-accent text-accent-foreground hover:bg-accent/90`, ≥44px, `aria-busy` while pending), calling
    `reserveSeatAction({ classId })` on click, mapping the result `reason` → specific sonner toast, and
    calling `router.refresh()` on success.
  - [x] In `page.tsx`, replaced the inert `<Button disabled>…Pay with balance…</Button>` block (and its
    "Booking coming soon" caption) with `<PayWithBalanceButton classId={cls.id} />`. Balance/price copy kept.
    Enrolled / full / insufficient states unchanged (server-side).
- [x] **Task 4 — Pure helper + unit tests (AC5).**
  - [x] Added `src/lib/reserve-schema.ts`: pure db-free module with `reserveInputSchema` (Zod) + `RESERVE_SUCCESS_MESSAGE` + `RESERVE_ERROR_MESSAGES` + `getReserveErrorMessage`. No db/Prisma import — jsdom-safe.
  - [x] `tests/unit/reserve-schema.test.ts`: 30 tests covering schema (valid/invalid classId), all five reason→message mappings, fallback for unknown reason. No `reserveSeat` unit test (needs Postgres + real lock/40001).
- [x] **Task 5 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → ✓ schema valid (untouched). `npm run build` → ✓ tsc clean + `/portal/classes/[id]` ƒ Dynamic in route table. `npm test` → ✓ 253/253 tests pass (30 new reserve-schema tests).
  - [x] Deferred live no-oversell / negative-balance concurrency integration test (AD-4) already recorded in `deferred-work.md` (CI ephemeral-Postgres, from create-story). `/portal/classes/seed-class-acc-1` already in e2e manifest (3.3) — no change needed.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-4 — One canonical seat reservation; oversell prevented by SSI (THE headline):** every seat acquisition
  (balance AND Paystack) goes through **one** `reserveSeat()` in `src/lib/enrollment.ts`, in **one interactive
  `Serializable` transaction**. The no-oversell guarantee is **Serializable SSI** — the occupancy count reads
  child `Enrollment` rows under a snapshot a plain row lock would not refresh, so **SSI (not `FOR UPDATE`) is
  what blocks the last-seat race**; keep `SELECT … FOR UPDATE` on the `GroupSession` row as belt-and-braces.
  **Any isolation downgrade silently reintroduces oversell.** `reserveSeat()` retries on **both** Prisma
  `P2034` and raw pg `40001` with bounded backoff. Verification MUST include a real-Postgres concurrency
  integration test (deferred to CI — unit mocks can't exercise `40001`). [Source: ARCHITECTURE-SPINE.md#AD-4]
- **AD-6 — Wallet is append-only; one serialized mutation path:** the `BOOKING_CHARGE` MUST go through
  `wallet.mutate(tx, studentId, …)` (per-student advisory lock → read-under-lock → non-negative guard →
  immutable append). Pass the **caller's `tx`** so it composes into the same Serializable transaction. Balance
  may never go negative (checked after the lock, before deducting). Ledger rows are never updated/deleted.
  [Source: ARCHITECTURE-SPINE.md#AD-6; wallet.ts]
- **AD-8 — Exactly one BOOKING_CHARGE per confirmed enrollment — enforced:** the balance path writes
  `BOOKING_CHARGE` at reserve-time (enrollment created directly `CONFIRMED`). Enforced by a **partial unique
  index** `ON "LedgerEntry"("enrollmentId") WHERE type = 'BOOKING_CHARGE'` (already in migration
  `20260705203800_schema_deltas_spine`). So `wallet.mutate` needs the `enrollmentId` → **create the enrollment
  first, then charge.** [Source: ARCHITECTURE-SPINE.md#AD-8; deferred-work.md#story-1.1]
- **AD-5 — Capacity derived, never stored:** `occupied = count(Enrollment where status ∈ {PENDING, CONFIRMED}
  and (pendingExpiresAt is null or pendingExpiresAt > now))`; `seatsLeft = capacity − occupied`. Count **inside
  the lock** via `occupiedEnrollmentWhere(now)`. There is no seat counter to increment (AD-5 forbids it) — the
  new CONFIRMED row IS the decrement. [Source: ARCHITECTURE-SPINE.md#AD-5; class-occupancy.ts]
- **AD-12 — Re-enrollment reuses the row:** `@@unique([studentId, groupSessionId])` is **status-agnostic**, so a
  student re-booking a class they previously `CANCELLED` must **reactivate the existing row** (reset status,
  priceCents, pendingExpiresAt, paymentRef), never `INSERT` a new one. `reserveSeat()` owns this create-or-
  reactivate logic. **⚠ Cross-epic tension (flagged, deferred):** reactivating a row that already has a
  historical `BOOKING_CHARGE` and writing a new one collides with AD-8's partial-unique index. This is **not
  reachable in 3.4** — the only producer of a `CANCELLED` enrollment is Epic 5's cancel flow, which does not
  exist yet. Code the reactivation branch defensively per AD-12, but the BOOKING_CHARGE-on-reactivation
  resolution is a deferred cross-epic decision (recorded in deferred-work). The **reachable, tested** behaviour
  in 3.4 is: non-cancelled existing → reject (FR11); none → create fresh CONFIRMED. [Source: ARCHITECTURE-SPINE.md#AD-8, #AD-12]
- **AD-14 — `enrollment.ts` is the sole writer of every status transition:** no page/reader/action writes
  `Enrollment.status` directly. `reserveSeat` is the create+CONFIRMED writer here; cancel/expire/confirm(webhook)
  arrive in later epics as functions in the same module, each taking the appropriate lock.
  [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-16 — Immutable price snapshot:** `Enrollment.priceCents` is the price snapshot taken at reserve-time from
  the locked `GroupSession.priceCents`; later class-price edits never alter existing enrollments' charges (2.3's
  `updateClassAction` already never touches Enrollment rows). [Source: ARCHITECTURE-SPINE.md#AD-16]
- **AD-3 — Authorization at the entry layer:** `requireSession()` first in the action; `(portal)` requires a
  STUDENT+ session; all lookups keyed to `session.user.id`. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-9 — Money is integer cents (ZAR):** `priceCents`, `amountCents`, balance are integers; the charge is
  `-priceCents`; no floats; format to Rand only at the UI edge (`formatZar`, already on the page). [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive isolation:** all new code lives under `(portal)/portal/classes/[id]` + `src/lib/enrollment.ts`;
  marketing routes/headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Consistency conventions:** server action result is a **discriminated union** (`{ ok: true, … }` |
  `{ ok: false, … }`) — never throw across the UI boundary for expected failures ("class full", "insufficient
  balance"); **Zod at the server entry**; **sonner toast** at the client island; money-path emits structured
  logs on failure (never swallow). [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### The reservation control flow (correctness-critical — from the spine sequence diagram)
```
requireSession() → studentId
db.$transaction(Serializable, retry on P2034/40001):
  SELECT … FOR UPDATE GroupSession(classId)      -- belt-and-braces writer serialization (AD-4)
  guard status=SCHEDULED AND start>now            -- (AC1/AC3; addresses 3.3 deferred deep-link item)
  findUnique Enrollment(studentId, classId)
    non-cancelled → reject already_enrolled       -- FR11 / AC2
    CANCELLED     → reactivate branch (AD-12; unreachable in 3.4)
  count occupied (occupiedEnrollmentWhere) < cap  -- AD-5 under lock; SSI blocks last-seat race
    occupied>=cap → reject class_full             -- AC3
  create/reactivate Enrollment CONFIRMED, priceCents snapshot
  wallet.mutate(tx, studentId, BOOKING_CHARGE, -priceCents, enrollmentId)  -- AD-6/8; throws → insufficient_balance
  → { ok:true, enrollmentId }
```
[Source: ARCHITECTURE-SPINE.md#Structural Seed "Seat-purchase control flow"; #AD-4/5/6/8]

### Scope boundary (do NOT do — belongs to other stories)
- **No Paystack / online payment / PENDING-hold branch** — Epic 4 (Story 4.1). Build `reserveSeat` so 4.1
  extends it with the `insufficient balance → PENDING + pendingExpiresAt` branch; do NOT build a second path.
- **No cancellation / refund / tier maths** — Epic 5. (`CANCELLATION_REFUND`/`CANCELLATION_FEE` ledger types
  are not written here; the AD-12 reactivation collision is deferred to when cancel lands.)
- **No admin wallet credit (`ADJUSTMENT`)** — Story 3.5.
- **No roster / attendance / confirmation email** — Epic 6. (`enrollment.ts` will gain `attend`/`noShow` later.)
- **No schema/migration/enum/dependency change; no new palette; no seat counter (AD-5 forbids it).**
- **No status write outside `enrollment.ts` (AD-14).**

### Data model facts this story depends on (from schema.prisma — verified)
- `Enrollment { id cuid, studentId + student→User, groupSessionId + session→GroupSession, priceCents Int,
  status EnrollmentStatus @default(PENDING), pendingExpiresAt DateTime?, paymentRef String? @unique, createdAt,
  @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. Compound-unique Prisma accessor:
  **`studentId_groupSessionId`**. Create with explicit `status: "CONFIRMED"`. [Source: acce-nextjs/prisma/schema.prisma#Enrollment]
- `EnrollmentStatus ∈ {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}` — non-cancelled = the four
  non-`CANCELLED` values for the FR11 reject. [Source: schema.prisma#EnrollmentStatus]
- `GroupSession { id, status GroupSessionStatus @default(SCHEDULED), start DateTime, capacity Int,
  priceCents Int, … }`; `GroupSessionStatus ∈ {SCHEDULED, CANCELLED, COMPLETED}` — reserve only for `SCHEDULED`
  future classes. [Source: schema.prisma#GroupSession / GroupSessionStatus]
- `LedgerEntry { studentId, type LedgerType, amountCents Int (signed), balanceAfterCents, enrollmentId String?,
  paymentRef String? }`; `LedgerType` includes `BOOKING_CHARGE`. Partial-unique index (one BOOKING_CHARGE per
  enrollmentId) is hand-SQL in the migration — **do not write a second BOOKING_CHARGE for the same
  enrollmentId** (AD-8). [Source: schema.prisma#LedgerEntry / LedgerType; ARCHITECTURE-SPINE.md#AD-8]

### Previous story intelligence (Epic 2 / Epic 3)
- **2.3 `updateClassAction` is the closest analog** — copy its `db.$transaction` + `tx.$queryRaw<…>\`… FOR
  UPDATE\`` lock + count-inside-the-lock + discriminated result shape. **Your delta:** add `{ isolationLevel:
  Serializable }`, the P2034/40001 retry loop, and the `wallet.mutate` charge. Note 2.3's raw-`updatedAt`
  `.toISOString()` parity caveat is not relevant here (no optimistic-concurrency token in reserve). [Source: (admin)/admin/classes/[id]/edit/actions.ts; 2-3-…md]
- **2.1 `createClassAction` + `ClassForm`** — the server-action skeleton (guard→safeParse→discriminated result)
  and the `"use client"` + `toast` from `@/components/ui/sonner` + gold-token CTA pattern for the island. [Source: (admin)/admin/classes/new/actions.ts, class-form.tsx]
- **3.1 built `wallet.mutate` but never called it** — 3.4 is its first caller. The seam already does the advisory
  lock + non-negative guard; do NOT reimplement any of that in `enrollment.ts` — just call it inside the tx with
  a negative `amountCents` and the `enrollmentId`. [Source: 3-1-…md; wallet.ts]
- **3.3 built the inert Pay button + the four checkout states** — this story flips the button live; the AD-10
  join-detail server gate + AD-5 occupancy read already exist and must be preserved. 3.3 review flagged **two
  deferred items this story touches:** (1) the detail page has no `status`/`start` guard on the fetch — 3.4's
  `reserveSeat` enforces `SCHEDULED` + future `start` **under the lock** (real enforcement), so a deep-linked
  CANCELLED/past class cannot be booked even though the read page still shows it; (2) the inert `disabled` button
  becomes a live client-island button (naturally focusable) — closes the UX-DR6 focus note. [Source: 3-3-…md; deferred-work.md#story-3.3]
- **CTA token rule (2.1/2.2/3.2/3.3):** gold CTA uses `bg-accent text-accent-foreground hover:bg-accent/90` — never hardcoded hex — so gold+navy flip per light/dark mode (UX-DR2/DR6). [Source: 2-1-…md Review]
- **1.5 RSC-500 trap:** never pass a Client Component element through a non-`children` prop from a Server
  Component. Pass the island a plain `classId` string prop (safe). The `/portal/classes/seed-class-acc-1` e2e
  manifest entry (added by 3.3) gives the 200-smoke a regression net. [Source: 1-5-…md; lessons-learned]
- **Seed reality (1.4):** the 6 seeded `SCHEDULED` classes have **no enrollments and no student user**, and no
  student has balance until 3.5 credits a wallet. So a live successful reserve can only be exercised in CI (or
  after 3.5). On a fresh seed the reachable live states are "insufficient balance" (no balance) — the CONFIRMED
  path is a CI/3.5 concern. Do NOT fake a live query. [Source: prisma/seed-data.ts; 1-4-…md]
- **Sandbox reality (1.1/1.5/2.x/3.x):** prod DB creds are blocked; live DB writes + the `40001` concurrency
  proof are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the
  bar. [Source: deferred-work.md]
- **Git:** work lands on branch `epic-3` (chained off the 3.3 tip). New `src/lib/enrollment.ts` + action + island
  + one page edit + unit tests — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR5, UX-DR6, NFR10)
- **UX-DR5:** book success/error → **sonner** `toast` (Toaster already mounted). Specific messages per `reason`:
  success ("You're enrolled — your class details are now unlocked"), `class_full` ("This class just filled up"),
  `insufficient_balance` ("Not enough wallet balance"), `already_enrolled` ("You're already enrolled"),
  `not_available` ("This class is no longer available"), `error` (generic retry). [Source: epics.md#UX-DR5]
- **UX-DR6 / NFR10:** the live Pay button is keyboard-operable, visible focus ring, ≥44px, both-mode contrast,
  honours `prefers-reduced-motion`, `aria-busy` while submitting; label text carries state. [Source: epics.md#UX-DR6]
- **UX-DR2:** one gold-accent CTA per view — the Pay button is it; keep the Back link subordinate (already ghost). [Source: epics.md#UX-DR2]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. **Add unit tests for the pure reserve
  helper** (input schema + reason→message mapping) — mirrors `class-form-schema.test.ts` / `class-occupancy.test.ts`.
  Do NOT unit-test `reserveSeat`/the action (they import `db` + need Postgres + real lock/`40001` semantics); do
  NOT over-mock Prisma to fake the tx/lock. [Source: acce-nextjs/vitest.config.ts; 3-1-…md]
- **Deferred (record in `deferred-work.md`):** the AD-4-mandated real-Postgres concurrency integration test — two
  concurrent `reserveSeat` on the same last seat, assert exactly one CONFIRMED (one BOOKING_CHARGE) and the other
  gets `class_full`/retry-then-`class_full`, proving Serializable SSI + the `40001` retry block oversell; plus a
  negative-balance attempt asserting rollback (no enrollment, no ledger). CI ephemeral-Postgres, same wall as
  1.1/1.5/2.2/2.3. [Source: ARCHITECTURE-SPINE.md#AD-4; deferred-work.md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `src/lib/enrollment.ts` — domain: `reserveSeat` (balance path, Serializable tx, AD-4/5/6/8/12/14).
  - `src/app/(portal)/portal/classes/[id]/actions.ts` — `"use server"` `reserveSeatAction` (guard + Zod + revalidate).
  - `src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx` — `"use client"` island (action call + toast).
  - a pure db-free reserve-input/result-message module (e.g. colocated or `src/lib/…`) + `tests/unit/…` spec.
- UPDATE:
  - `src/app/(portal)/portal/classes/[id]/page.tsx` — swap the inert Pay button for the island; keep everything else.
  - `_bmad-output/implementation-artifacts/deferred-work.md` — record the deferred concurrency integration test.
- Aligns with the ARCHITECTURE-SPINE source tree: `src/lib/enrollment.ts` is the named "sole status writer:
  reserve/confirm/cancel/expire/attend (AD-4,5,11,12,14,16)". No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Prisma 6.19.3 `$transaction` isolation:** `db.$transaction(fn, { isolationLevel:
  Prisma.TransactionIsolationLevel.Serializable, maxWait, timeout })` — supported via `@prisma/adapter-pg`. On a
  serialization failure Prisma surfaces **`P2034`**; the underlying pg error is **`40001`** (accessible on the
  raw error) — retry on both. Keep `timeout` generous enough for the lock + charge but bounded. [Source: ARCHITECTURE-SPINE.md#AD-4; Stack table]
- **Next 16 App Router:** server action in `actions.ts` (`"use server"`); use `revalidatePath()` from
  `next/cache` to refresh the RSC after a successful reserve; the client island uses `useRouter().refresh()`.
  Pass the island a plain string prop (1.5 RSC-500 safety). [Source: 2-3-…md; 1-5-…md]
- **No date library** — the `start > now` guard is a plain `Date` comparison; no `date-fns`/`dayjs`. [Source: 3-3-…md]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 / Story 3.4 / FR7 / FR11 / FR15 / NFR4 / UX-DR5 / UX-DR6]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-4, AD-5, AD-6, AD-8, AD-9, AD-12, AD-14, AD-16, "Structural Seed", "Consistency Conventions", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#GroupSession / Enrollment / EnrollmentStatus / LedgerEntry / LedgerType]
- [Source: acce-nextjs/src/lib/wallet.ts (mutate — the AD-6 charge seam; WalletInsufficientFundsError)]
- [Source: acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere + computeSeatsLeft — reuse under the lock)]
- [Source: acce-nextjs/src/lib/auth-guards.ts (requireSession); acce-nextjs/src/lib/db.ts (db singleton, $transaction)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/actions.ts (2.3 $transaction + FOR UPDATE analog)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts + class-form.tsx (2.1 action + client-island/toast pattern)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (3.3 detail page — inert button to replace)]
- [Source: _bmad-output/implementation-artifacts/3-3-class-detail-and-checkout-page.md; 3-1-view-wallet-balance-and-ledger.md; 2-3-edit-an-existing-class.md; deferred-work.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (2026-07-06)

### Debug Log References

- **CRITICAL tx-rollback decision**: `WalletInsufficientFundsError` must propagate OUT of the `db.$transaction` callback to trigger Prisma's automatic rollback. Catching inside and returning a value would commit the tx with an orphaned CONFIRMED enrollment but no BOOKING_CHARGE — data corruption. Outer try/catch returns `{ ok: false, reason: "insufficient_balance" }` after the tx is already rolled back.
- **Serialization error detection**: Both `Prisma.PrismaClientKnownRequestError.code === "P2034"` and raw `{ code: "40001" }` (from @prisma/adapter-pg) are checked in `isSerializationError()` per AD-4.
- **AD-12 reactivation branch**: Coded defensively per AD-12 (update existing CANCELLED row to CONFIRMED + new priceCents); but UNREACHABLE in 3.4 since no cancel flow exists. The AD-8 partial-unique BOOKING_CHARGE collision on reactivation is a deferred cross-epic issue (see deferred-work.md#AD-12).

### Completion Notes List

- **Task 1**: `src/lib/enrollment.ts` created. `reserveSeat()` exports a discriminated union result (never throws for expected failures). Implements: Serializable $transaction (AD-4), MAX_RETRIES=4 retry loop on P2034/40001, FOR UPDATE GroupSession lock (belt-and-braces, mirrors 2.3), state guard (SCHEDULED+future), FR11 reject (non-cancelled existing enrollment), AD-5 occupied count under lock via `occupiedEnrollmentWhere`, create/reactivate CONFIRMED enrollment with priceCents snapshot (AD-16), `wallet.mutate()` BOOKING_CHARGE via AD-6 seam (WalletInsufficientFundsError propagates out → tx rollback → outer catch returns insufficient_balance). AD-12 reactivation coded defensively (unreachable in 3.4). Epic-4 seam documented in header comment.
- **Task 2**: `src/app/(portal)/portal/classes/[id]/actions.ts` created. `reserveSeatAction()` calls `requireSession()` FIRST, Zod-validates input via `reserveInputSchema`, calls `reserveSeat(studentId, classId)`, and on success `revalidatePath` for both `/portal/classes/${classId}` and `/portal/wallet`.
- **Task 3**: `pay-with-balance-button.tsx` client island created. Takes plain `classId` string prop (RSC-500 safe per 1.5 lesson). Gold-token CTA (`bg-accent text-accent-foreground hover:bg-accent/90`), ≥44px, `aria-busy` while pending, keyboard-operable, specific sonner toast per reason. `page.tsx` updated: `Button` import removed (no longer needed for this block), `PayWithBalanceButton` import added, inert `<Button disabled>` + "Booking coming soon" caption replaced with `<PayWithBalanceButton classId={cls.id} />`.
- **Task 4**: `src/lib/reserve-schema.ts` created (pure, db-free, jsdom-safe). Contains `reserveInputSchema` (Zod: classId non-empty string), `RESERVE_SUCCESS_MESSAGE`, `RESERVE_ERROR_MESSAGES` (all 5 reasons), `getReserveErrorMessage()` (falls back to "error" for unknown). `tests/unit/reserve-schema.test.ts` created: 30 assertions covering schema valid/invalid paths, all reason→message mappings, fallback for unknown reason. Does NOT unit-test `reserveSeat` or `reserveSeatAction` (those need real Postgres + lock/40001 semantics — CI only).
- **Task 5**: `npx prisma validate` → schema valid (untouched). `npm run build` → tsc clean, `/portal/classes/[id]` ƒ Dynamic in route table. `npm test` → 253/253 vitest green (30 new). Deferred CI concurrency test already in deferred-work.md from create-story.

### File List

- `acce-nextjs/src/lib/enrollment.ts` (new — Task 1: reserveSeat, AD-4/5/6/8/12/14)
- `acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts` (new — Task 2: reserveSeatAction server action)
- `acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx` (new — Task 3: client island)
- `acce-nextjs/src/lib/reserve-schema.ts` (new — Task 4: pure db-free schema + message mapper)
- `acce-nextjs/tests/unit/reserve-schema.test.ts` (new — Task 4: 30 unit tests)
- `acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx` (modified — Task 3: inert button → PayWithBalanceButton island)

## Change Log

- 2026-07-06: Story 3.4 implementation complete (claude-sonnet-4-6). Created `enrollment.ts` (reserveSeat Serializable tx, retry loop, AD-4/5/6/8/12/14), `actions.ts` (reserveSeatAction server action, requireSession-first AD-3), `pay-with-balance-button.tsx` (client island + sonner toast UX-DR5), `reserve-schema.ts` (pure Zod schema + reason→message mapper), `reserve-schema.test.ts` (30 unit tests). Updated `page.tsx` to replace inert Pay button with live `PayWithBalanceButton` island. Chain: 253/253 vitest, build clean, prisma validate clean. Status set to `review`.
