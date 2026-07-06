---
baseline_commit: d7b071911c8c7d1addae36136548fb4bfdce72df
---

# Story 5.2: Cancel enrollment → tiered refund to wallet, seat returns to pool

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want cancelling to refund the correct amount to my wallet and free my seat,
so that I'm treated fairly and someone else can take the spot.

## Context & current state (READ FIRST)

Epics 1–4 are `done`. Epic 5 (Cancellations & Refunds to Wallet) is in progress: **Story 5.1 (done)** built the read-only `(portal)/portal/my-classes` page that lists a student's CONFIRMED upcoming enrollments and, per row, renders an **INERT/disabled** "Cancel — {pct}% refund" button plus the pure `src/lib/cancellation.ts` tier module. **This story (5.2) makes that cancel button LIVE** and lands the actual cancel mutation.

**This story = the live cancel flow.** Concretely:
- A NEW `enrollment.ts#cancelEnrollment(studentId, enrollmentId)` domain function — the AD-14 sole-status-writer for the `CONFIRMED → CANCELLED` transition, inside a `Serializable` `$transaction` under the `GroupSession` `FOR UPDATE` lock, that **recomputes the refund server-side** (authoritative, AD-11), writes the wallet ledger rows via `wallet.mutate` (AD-6), flips the enrollment to `CANCELLED` (AD-14), and lets the freed seat return to the derived pool (AD-5).
- A NEW `cancelEnrollmentAction` server action (colocated at `(portal)/portal/my-classes/actions.ts`) — `requireSession()`-first (AD-3), Zod-validate `{ enrollmentId }`, call the domain fn, `revalidatePath`, return a discriminated result.
- A NEW client island `cancel-enrollment-button.tsx` — replaces the 5.1 inert button; confirms (AlertDialog), calls the action, shows a `sonner` toast (UX-DR5), `router.refresh()` on success. Mirrors the 3.4 `PayWithBalanceButton` pattern exactly.
- A NEW pure `src/lib/cancel-schema.ts` (Zod input + reason→message mapper) + its unit test. Mirrors `reserve-schema.ts` / `credit-schema.ts`.
- The 5.1 `my-classes/page.tsx` is UPDATED to render the live island instead of the inert `<Button disabled>`.

**What already exists and MUST be reused (do NOT recreate):**

- **`computeRefund` / `hoursUntilStart` / `refundTierForHours` / `CANCELLATION_TIERS`** in `src/lib/cancellation.ts` — the pure AD-11 tier maths built + unit-tested in 5.1. **`cancelEnrollment` MUST call `computeRefund(enrollment.priceCents, hoursUntilStart(session.start, now))` — do NOT re-implement tier logic.** This is the single-source guarantee: the 5.1 advisory preview and the 5.2 authoritative refund can never diverge. [Source: acce-nextjs/src/lib/cancellation.ts]
- **`wallet.mutate(tx, studentId, { type, amountCents, enrollmentId, paymentRef? })`** in `src/lib/wallet.ts` — the AD-6 single serialized mutation seam (per-student advisory lock → balance read under lock → NFR4 non-negative guard → immutable append). Call it INSIDE the cancel tx, on the caller's `tx`, for `CANCELLATION_REFUND` (and `CANCELLATION_FEE`). Never `tx.ledgerEntry.create()` directly. [Source: acce-nextjs/src/lib/wallet.ts]
- **`reserveSeat` / `confirmPaidSeat` in `src/lib/enrollment.ts`** — the reference for the transaction envelope: `Serializable` isolation, `SELECT … FOR UPDATE GroupSession` via `$queryRaw`, the `MAX_RETRIES`/`backoffMs`/`isSerializationError` retry loop, lock order (GroupSession FOR UPDATE → wallet advisory). **Reuse those module-level helpers** — do not duplicate them. `cancelEnrollment` is a NEW exported function in this SAME module (AD-14: enrollment.ts is the sole `Enrollment.status` writer). [Source: acce-nextjs/src/lib/enrollment.ts]
- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call FIRST in the action; `studentId = session.user.id`, never a client-supplied id. [Source: acce-nextjs/src/lib/auth-guards.ts]
- **`db` singleton** from `@/lib/db` (AD-2). **`reserveInputSchema` shape / `getReserveErrorMessage` mapper** in `src/lib/reserve-schema.ts` — the pattern to mirror for `cancel-schema.ts`. [Source: acce-nextjs/src/lib/reserve-schema.ts]
- **`PayWithBalanceButton`** (`(portal)/portal/classes/[id]/pay-with-balance-button.tsx`) + **`reserveSeatAction`** (`…/[id]/actions.ts`) — the exact client-island + server-action template: plain string prop (RSC-500 safe, 1.5 lesson), `useState` pending guard, `toast.success`/`toast.error` (UX-DR5), `router.refresh()` on success. [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx; …/actions.ts]
- **`AlertDialog`** in `src/components/ui/alert-dialog.tsx` (present) + **`toast`** from `@/components/ui/sonner` + **`Button`** — no new dependency. Cancellation is a meaningful action → confirm before firing. [Source: acce-nextjs/src/components/ui/*]
- **`formatZar(cents)`** in `src/lib/class-display.ts` (AD-9 — the only cents→Rand converter). [Source: acce-nextjs/src/lib/class-display.ts]

**Scope boundary — 5.2 does NOT:** touch `reserveSeat`/`confirmPaidSeat`, resolve the AD-12⇄AD-8 re-book collision (see "Deferred / cross-story" below), add a Paystack **card** refund (AD-15 conserves to wallet; card-refund is spine-deferred), change the schema/migration/enum/dependencies, add attendance/roster/email (Epic 6), or cancel PENDING / past / non-own enrollments.

## Acceptance Criteria

**AC1 — Cancelling an enrollment computes the refund server-side and credits the wallet per the tier (FR13, FR14, AD-11, AD-6).**
Given I hold a `CONFIRMED` enrollment for a class whose `start` is in the future,
When I cancel it,
Then the server recomputes the refund **authoritatively at cancel-time** via `computeRefund(enrollment.priceCents, hoursUntilStart(session.start, now))` against the single `CANCELLATION_TIERS` constant (pinned comparators `h ≥ 48 → 100%`, `24 ≤ h < 48 → 70%`, `h < 24 → 0%`), and:
- a **`CANCELLATION_REFUND`** ledger row is written via `wallet.mutate` with `amountCents = +refundCents` (the amount credited back to the wallet — the tier refund, AD-9) **when `refundCents > 0`**;
- a **`CANCELLATION_FEE`** ledger row is written via `wallet.mutate` with **`amountCents = 0`** (an immutable audit record that a fee was retained) **when `feeCents > 0`**. It carries `amountCents = 0` deliberately — the fee was already captured by the original `BOOKING_CHARGE = -priceCents`; crediting only `refundCents` back leaves the student's net cost at `feeCents`. A non-zero debit here would double-count the fee (see Dev Notes "Ledger model" — this is binding).
- the enrollment `status` is set to `CANCELLED` (AD-14 — via this function, the sole writer).
The refund is computed from the **enrollment's immutable `priceCents` snapshot** (AD-16), never the (possibly-edited) class price. All three writes happen inside ONE `Serializable` transaction under the `GroupSession` `FOR UPDATE` lock; the refund is `+refundCents` so the NFR4 non-negative guard is never tripped.

**AC2 — The freed seat returns to the pool (FR13, AD-5).**
Given my seat was `CONFIRMED` and I cancel it,
When the class's seats-left is next computed,
Then the freed seat returns to the derived pool (spaces-left goes up by one) — with **no seat-counter write**: occupancy is derived (`occupiedEnrollmentWhere` counts only `status ∈ {PENDING, CONFIRMED}` with unexpired holds, AD-5), so flipping to `CANCELLED` automatically removes this row from the count. No reader or counter is decremented.

**AC3 — The wallet ledger reflects the refund (and any fee) and the updated balance.**
Given a refund is credited,
When I open `/portal/wallet`,
Then the ledger shows the `CANCELLATION_REFUND` entry (amount = the previewed `refundCents`, consistent with the 5.1 preview) and, when a fee applied, the `CANCELLATION_FEE` entry, and `getBalance` has increased by **exactly `refundCents`**. `revalidatePath("/portal/wallet")` (and `"/portal/my-classes"`) is called so the fresh state renders after the action.

**AC4 — Authorization + state re-guarded server-side; no IDOR, no double-refund (AD-3, AD-14, NFR4/NFR5).**
Given the cancel action receives a client-supplied `enrollmentId`,
When it runs,
Then: (a) `requireSession()` is called FIRST; the enrollment is looked up keyed on **both** `id = enrollmentId` **and** `studentId = session.user.id` — a student can never cancel another student's seat (returns `not_found`, no write); (b) the status is **re-read UNDER the `GroupSession` `FOR UPDATE` lock** and the cancel proceeds **only if still `CONFIRMED` and `start > now`** — a stale page / double-click / concurrent second cancel serializes behind the lock, sees `CANCELLED`, and no-ops (`not_cancellable`, **zero** ledger rows written); (c) a class whose `start <= now` (already begun) is rejected (`not_cancellable`) — cancellation applies only to upcoming classes (attendance/no-show is Epic 6). No status `UPDATE` is issued anywhere outside `enrollment.ts` (AD-14).

**AC5 — The cancel UI is a live client island with confirmation + toast (UX-DR5, UX-DR6, NFR10, 1.5 RSC-safety).**
Given I am on `/portal/my-classes` with a cancellable enrollment,
When I click the (now live) "Cancel — {pct}% refund" button,
Then a confirmation step (`AlertDialog`) appears summarising what I'll get back (e.g. "You'll be refunded {formatZar(refundCents)} to your wallet" / "No refund applies at this notice"), and on confirm the island calls `cancelEnrollmentAction({ enrollmentId })`, shows a `sonner` **success** toast on `{ ok:true }` and a specific **error** toast per reason on `{ ok:false }` (UX-DR5), then `router.refresh()` so the cancelled row disappears and the wallet updates. The island receives **plain string/number props only** (RSC-500 safe, 1.5 lesson); it is keyboard-operable, ≥44px, visible focus ring, `aria-busy` while pending (UX-DR6/NFR10); label text carries the refund state (not colour alone). The 5.1 `<Button disabled>` is removed in favour of this island.

**AC6 — `cancel-schema.ts` is a pure, unit-tested module; chain stays green; no schema change.**
Given `src/lib/cancel-schema.ts` (pure Zod `{ enrollmentId: string.min(1) }` + `CancelFailureReason` + reason→message mapper, db-free, type-only imports),
When `npm test` runs,
Then a new `tests/unit/cancel-schema.test.ts` covers valid/invalid input and every reason→message mapping. Additionally `npx prisma validate` passes (**schema untouched** — `LedgerType` already contains `CANCELLATION_REFUND` and `CANCELLATION_FEE`; no migration/enum/dependency change), `npm run build` succeeds (tsc clean; `/portal/my-classes ƒ Dynamic` still present), and the full vitest suite stays green. The live cancel round-trip (needs a seeded student with a CONFIRMED upcoming enrollment + real Postgres) is **deferred to CI ephemeral-Postgres** (same wall as prior stories); a concurrency/double-cancel integration assertion is added to the deferred CI suite (see Task 6).

## Tasks / Subtasks

- [x] **Task 1 — `src/lib/cancel-schema.ts` (pure) + `tests/unit/cancel-schema.test.ts` (AC5, AC6).**
  - [x] Create `cancel-schema.ts` — pure, db-free (type-only imports; loads under vitest/jsdom without `DATABASE_URL`). Model on `reserve-schema.ts`.
  - [x] Export `cancelInputSchema = z.object({ enrollmentId: z.string().min(1) })` + `type CancelInput`.
  - [x] Export `type CancelFailureReason = "not_found" | "not_cancellable" | "error"` + `CANCEL_SUCCESS_MESSAGE` + `CANCEL_ERROR_MESSAGES` record + `getCancelErrorMessage(reason)` (fallback to `error`). Messages are user-facing (UX-DR5), e.g. `not_found` → "We couldn’t find that booking", `not_cancellable` → "This class can no longer be cancelled", `error` → "Something went wrong — please try again".
  - [x] `tests/unit/cancel-schema.test.ts`: valid input parses; empty/missing `enrollmentId` fails; each reason maps to its message; unknown reason falls back to the `error` message.
- [x] **Task 2 — `enrollment.ts#cancelEnrollment` (AC1, AC2, AC4) — AD-14 sole writer.**
  - [x] Add a NEW exported `async function cancelEnrollment(studentId: string, enrollmentId: string): Promise<CancelResult>` to `src/lib/enrollment.ts`. Reuse the module’s existing `MAX_RETRIES` / `backoffMs` / `isSerializationError` helpers and the `Serializable` + retry envelope (mirror `reserveSeat`).
  - [x] Define + export `type CancelResult = { ok: true; refundCents: number; feeCents: number } | { ok: false; reason: "not_found" | "not_cancellable" | "error" }`.
  - [x] Inside the `Serializable` `$transaction` (`const now = new Date()`): IDOR-safe findFirst, FOR UPDATE GroupSession lock, re-read enrollment status under lock, computeRefund from snapshot, CANCELLED flip, CANCELLATION_REFUND credit, CANCELLATION_FEE audit row (amountCents 0), return ok:true.
  - [x] Outer catch: reuse `isSerializationError` → retry with backoff; otherwise `console.error(...)` → `{ ok:false, reason:"error" }`.
  - [x] Module header: `Story 5.2` block documenting cancelEnrollment as the CANCELLED-transition sole writer, ledger model, and lock order.
- [x] **Task 3 — `(portal)/portal/my-classes/actions.ts` server action (AC3, AC4, AC5).**
  - [x] Create the file with `"use server"`. Export `type CancelEnrollmentActionResult`.
  - [x] `cancelEnrollmentAction(input: unknown)`: requireSession() FIRST, safeParse, cancelEnrollment domain call, revalidatePath, discriminated return.
  - [x] Mirror `reserveSeatAction` structure/comments exactly.
- [x] **Task 4 — `cancel-enrollment-button.tsx` client island (AC5).**
  - [x] Create `(portal)/portal/my-classes/cancel-enrollment-button.tsx` with `"use client"`. Props: plain serialisable values only (RSC-500 safe).
  - [x] Render Button with AlertDialog confirm, sonner toast on ok/error, router.refresh() on success. aria-busy, ≥44px, focus ring, outline/destructive variant (UX-DR2/DR6/NFR10).
- [x] **Task 5 — Wire the live island into `my-classes/page.tsx` (AC5).**
  - [x] Replaced the inert `<Button disabled>` block with `<CancelEnrollmentButton enrollmentId={…} refundCents={…} refundPct={…} classTitle={…} />`. Removed unused Button import. hoursUntilStart/computeRefund kept for advisory preview props.
- [x] **Task 6 — Verify the chain (AC6) + record deferrals.**
  - [x] `npx prisma validate` → passes (schema untouched; LedgerType already has both values).
  - [x] `npm run build` → tsc clean; `/portal/my-classes ƒ Dynamic` present.
  - [x] `npm test` → 430/430 green incl. 25 new `cancel-schema.test.ts`.
  - [x] Appended to `deferred-work.md` (under "5.2" heading): live cancel round-trip, double-cancel/concurrency, AD-12⇄AD-8 re-book collision carry-forward.

## Dev Notes

### Ledger model — CANCELLATION_REFUND / CANCELLATION_FEE (BINDING — read before coding Task 2)
The append-only wallet ledger is `balance = Σ LedgerEntry.amountCents` (AD-6). The original booking **already debited the full price**: the balance path (3.4) wrote `BOOKING_CHARGE = -priceCents`; the Paystack path (4.2) wrote `TOPUP = +captured` then `BOOKING_CHARGE = -priceCents`. In BOTH, a `BOOKING_CHARGE = -priceCents` is on the books for this enrollment. Therefore, to leave the student's **net cost at `feeCents`** after cancellation, the cancel writes exactly **one balance-affecting row: `CANCELLATION_REFUND = +refundCents`** (the tier refund credited back). The **`CANCELLATION_FEE` row is written with `amountCents = 0`** — a deliberate, immutable **audit marker** that a fee was retained (its magnitude is `priceCents − refundCents`, reconstructable from the enrollment snapshot). Writing `-feeCents` here would **double-count** the fee (BOOKING_CHARGE already took it) → wrong balance. This choice is consistent with AD-15 (4.2), where `CANCELLATION_REFUND.amountCents` = "the amount credited back to the wallet", and with the 5.1 preview (the ledger's refund figure = the previewed `refundCents`). **Regression guard:** after cancel, `getBalance` must increase by **exactly `refundCents`** — assert this in the deferred CI test. (Full rationale + the rejected "full-reversal + fee-debit" alternative: autopilot-decisions.md 2026-07-06 "ledger model for CANCELLATION_REFUND / CANCELLATION_FEE".)

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-11 — Cancellation server-computed from ONE tier constant; single decomposition:** recompute the refund **authoritatively at cancel-time** via `computeRefund` (the same pure fn the 5.1 preview used — never a second tier implementation). `refundCents` from the tier; `feeCents = priceCents − refundCents` (single decomposition, `refundCents + feeCents === priceCents`). Writes `CANCELLATION_REFUND` (+ `CANCELLATION_FEE` when `feeCents > 0`) via AD-6, sets `CANCELLED` via AD-14, seat returns to the derived pool (AD-5). [Source: ARCHITECTURE-SPINE.md#AD-11; src/lib/cancellation.ts]
- **AD-14 — `enrollment.ts` is the sole `Enrollment.status` writer:** the `CONFIRMED → CANCELLED` transition MUST live in `enrollment.ts#cancelEnrollment` under the `GroupSession` `FOR UPDATE` lock (seat-affecting). No action/page/reader writes status. [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-6 — Wallet is append-only; one serialized mutation seam:** every refund/fee write goes through `wallet.mutate(tx, studentId, …)` on the caller's `tx` (advisory lock → balance read → NFR4 guard → immutable append). Never `tx.ledgerEntry.create()` directly. Ledger rows are never updated/deleted. [Source: ARCHITECTURE-SPINE.md#AD-6; src/lib/wallet.ts]
- **AD-5 — Capacity derived; readers never write; seat returns for free:** occupancy = `count(status ∈ {PENDING,CONFIRMED} AND unexpired)`. Flipping to `CANCELLED` removes the row from the count — no seat-counter to decrement (AC2). There is no lazy expiry flip to do here (we operate on a CONFIRMED row). [Source: ARCHITECTURE-SPINE.md#AD-5; src/lib/class-occupancy.ts]
- **AD-3 — Authorization at the entry layer:** `requireSession()` first in the action; the domain lookup is keyed on `{ id, studentId }` so a client-supplied `enrollmentId` can never reach another student's row (AC4a). [Source: ARCHITECTURE-SPINE.md#AD-3; src/lib/auth-guards.ts]
- **AD-16 — Refund against the immutable snapshot:** use `enrollment.priceCents` (the reserve-time snapshot), never the current class `priceCents`. A later admin price edit must not change what a past booking refunds. [Source: ARCHITECTURE-SPINE.md#AD-16]
- **AD-9 — Integer cents (ZAR):** all refund/fee maths in cents; `formatZar` only at the UI edge (the confirm dialog copy). [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-4 (envelope reuse) — Serializable + FOR UPDATE + retry:** reuse `reserveSeat`'s transaction envelope and the `MAX_RETRIES`/`backoffMs`/`isSerializationError` helpers. Cancel cannot oversell (it frees a seat), but the identical envelope + lock order keeps ONE seat-mutation pattern and avoids deadlock (GroupSession FOR UPDATE → wallet advisory). [Source: ARCHITECTURE-SPINE.md#AD-4; src/lib/enrollment.ts]
- **AD-2 / AD-1:** import `{ db }` from `@/lib/db`; the new route/action live only under `(portal)`. [Source: ARCHITECTURE-SPINE.md#AD-2/#AD-1]
- **Capability map:** "Cancellations (FR12,13,14)" → `lib/enrollment.ts#cancel`, governed by AD-6/AD-11/AD-14. 5.2 lands exactly this. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Scope boundary (do NOT do)
- **Do NOT touch `reserveSeat` / `confirmPaidSeat`** — `cancelEnrollment` is a new, independent function in the same module. Reuse the shared helpers; do not modify the existing ones.
- **Do NOT resolve the AD-12⇄AD-8 re-book collision** (see below) — leave `reserveSeat`'s reactivation branch as-is.
- **No Paystack card refund** — AD-15 conserves money to the wallet; a card-refund adapter is spine-deferred. 5.2 credits the wallet only.
- **No schema / migration / enum / dependency change** — `LedgerType` already has `CANCELLATION_REFUND` + `CANCELLATION_FEE`. No new package (AlertDialog/sonner already present).
- **No PENDING / past / other-student cancels; no attendance/roster/email (Epic 6).**

### The AD-12 ⇄ AD-8 collision — NOW REACHABLE, intentionally UNRESOLVED in 5.2 (READ)
5.2 is the FIRST producer of `CANCELLED` enrollments, so the long-flagged collision (deferred-work.md#AD-12, 3.4 review) becomes reachable: a student who cancels then **re-books** the same class hits `reserveSeat`'s AD-12 reactivation branch, which attempts a second `BOOKING_CHARGE` on the same `enrollmentId` — forbidden by AD-8's partial-unique index. **5.2 does NOT resolve this** (out of AC scope; would require risky surgery on the oversell-critical `reserveSeat` with no in-sandbox test). It **fails safe**: the partial-unique index PREVENTS a double charge, so a re-book-after-cancel surfaces as a caught `P2002 → { ok:false, reason:"error" }` (generic toast), never corruption / never a double charge. Carry the deferred-work item forward (Task 6c). Resolution (when a re-book story lands): key the BOOKING_CHARGE partial-unique on a booking-cycle discriminator, OR give a reactivated booking a fresh ledger identity, OR null/supersede the prior charge under the lock. [Source: deferred-work.md#AD-12; ARCHITECTURE-SPINE.md#AD-8/#AD-12; autopilot-decisions.md 2026-07-06]

### Data model facts (from schema.prisma — verified)
- `Enrollment { id, studentId + student→User, groupSessionId + session→GroupSession, priceCents Int, status EnrollmentStatus @default(PENDING), pendingExpiresAt?, paymentRef? @unique, createdAt, @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. Cancel: look up by `{ id, studentId }`, re-read `status` under the lock, reach `start` via the `session` relation. `EnrollmentStatus ∈ {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`. [Source: acce-nextjs/prisma/schema.prisma#Enrollment]
- `LedgerType` includes `BOOKING_CHARGE, TOPUP, ADJUSTMENT, CANCELLATION_REFUND, CANCELLATION_FEE, WITHDRAWAL` — **`CANCELLATION_REFUND` and `CANCELLATION_FEE` already exist; NO enum change.** [Source: schema.prisma#LedgerType]
- `LedgerEntry { …, studentId, type LedgerType, amountCents Int, balanceAfterCents Int, enrollmentId?, paymentRef?, createdAt }` — `wallet.mutate` sets `balanceAfterCents`; a `CANCELLATION_FEE` with `amountCents = 0` leaves `balanceAfterCents` unchanged (valid). [Source: schema.prisma#LedgerEntry]
- `GroupSession { id, start DateTime, capacity Int, priceCents Int, status GroupSessionStatus, … }` — locked `FOR UPDATE` in the cancel tx; use its `start` for the future-guard. [Source: schema.prisma#GroupSession]

### Previous story intelligence
- **5.1 (done)** built `cancellation.ts` (`computeRefund` etc.) pure + unit-tested (54 tests) and the `my-classes` page with the INERT cancel button. 5.2 = make it live. Reuse `computeRefund` verbatim — the single-source guarantee. [Source: 5-1-…md; src/lib/cancellation.ts]
- **3.4 `reserveSeat` + `PayWithBalanceButton` + `reserveSeatAction`** is the exact template: Serializable tx, FOR UPDATE via `$queryRaw`, retry loop, `wallet.mutate` on the caller tx (AD-6/8), client island with plain-string prop + sonner toast + `router.refresh()`, thin server action `requireSession`-first. Copy these shapes. [Source: src/lib/enrollment.ts; …/pay-with-balance-button.tsx; …/actions.ts]
- **4.2 `confirmPaidSeat`** already writes `CANCELLATION_REFUND` via `wallet.mutate` (AD-15 orphan path) — confirms the seam works for refund credits and shows `amountCents = +captured` semantics (amount credited back). 5.2's REFUND mirrors this (amount back = `refundCents`). [Source: src/lib/enrollment.ts:731-748]
- **3.5 root-cause fix — Better Auth `defaultRole:"STUDENT"`:** real magic-link students carry `role:"STUDENT"` (schema default aligned in `auth.ts`). Not directly touched here, but the cancel action's `requireSession()` returns a STUDENT session; `session.user.id` is the ledger `studentId`. [Source: 3-5-…md]
- **1.5 RSC-500 trap + smoke net:** the island receives only serialisable props; the page renders `<CancelEnrollmentButton …/>` (a Client Component element as `children`-equivalent JSX, which is safe) — never pass a Client element through a non-`children` prop of a Server Component. `/portal/my-classes` is already in the e2e authenticated-route manifest (added in 5.1) → the 200-smoke covers it. [Source: 1-5-…md; lessons-learned]
- **Sandbox reality:** prod DB creds blocked; live cancel round-trip + concurrency test deferred to CI ephemeral-Postgres. Static bar = `prisma validate` + `build` + vitest. [Source: deferred-work.md]

### UX / accessibility (UX-DR2, UX-DR5, UX-DR6, NFR10)
- **UX-DR5:** cancel success/error surfaced via `sonner` toast at the island (already mounted app-wide). Specific message per reason. [Source: epics.md#UX-DR5]
- **UX-DR6 / NFR10:** the live Cancel button + AlertDialog controls are keyboard-operable, ≥44px, visible focus ring, both-mode contrast; state carried in label **text** ("100% refund"/"70% refund"/"no refund"), not colour alone; `aria-busy` while the action is pending. [Source: epics.md; DESIGN.md]
- **UX-DR2:** reuse shadcn `Button`/`AlertDialog` + navy+gold tokens; the Cancel control is subordinate/destructive (outline or `destructive` token variant), **not** the gold CTA — no hardcoded hex. [Source: epics.md#UX-DR2; DESIGN.md]

### Testing standards
- **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. **New required unit test:** `tests/unit/cancel-schema.test.ts` (AC6) — the sandbox-provable core (schema + reason mapper). Do NOT unit-test the page/action/domain fn against a mocked Prisma (they need `DATABASE_URL`; follow the 3.4/3.5 posture — live behaviour is a CI concern). `cancellation.ts` maths is already covered by 5.1's 54 tests; do not duplicate. [Source: acce-nextjs/vitest.config.ts; 5-1-…md]
- Playwright e2e (`tests/e2e`) is DB-bound; `/portal/my-classes` is already in `authenticated-routes.ts` (5.1). No new manifest entry needed (same static route).

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW: `src/lib/cancel-schema.ts`; `tests/unit/cancel-schema.test.ts`; `(portal)/portal/my-classes/actions.ts`; `(portal)/portal/my-classes/cancel-enrollment-button.tsx`.
- UPDATE: `src/lib/enrollment.ts` (add `cancelEnrollment` + `CancelResult` + header note); `(portal)/portal/my-classes/page.tsx` (inert Button → live island); `_bmad-output/implementation-artifacts/deferred-work.md` (5.2 deferrals + carry AD-12 forward).
- Aligns with the source tree: `enrollment.ts` = "reserve + cancel" (spine); `(portal)/portal/my-classes` already seeded. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed / #Capability Map]

### Latest tech notes
- **Next 16 App Router:** server action in `actions.ts` (`"use server"`); client island `"use client"`; `revalidatePath` from `next/cache`; `useRouter().refresh()` from `next/navigation`. No route handler needed (colocated server action). [Source: …/[id]/actions.ts]
- **Prisma 6.x:** `$queryRaw…FOR UPDATE` for the GroupSession lock (Prisma has no `findUnique…FOR UPDATE`); `Serializable` via `Prisma.TransactionIsolationLevel.Serializable`; retry on `P2034`/raw `40001` (reuse `isSerializationError`). [Source: src/lib/enrollment.ts]
- **No date library:** `hoursUntilStart` uses `getTime()` epoch-ms (tz-independent); confirm-dialog copy uses `formatZar` only. [Source: src/lib/cancellation.ts; class-display.ts]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5 / Story 5.2 / FR12 / FR13 / FR14 / UX-DR5 / UX-DR6]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-2/#AD-3/#AD-4/#AD-5/#AD-6/#AD-9/#AD-11/#AD-14/#AD-16/#AD-8/#AD-12/#AD-15/"Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#Enrollment / EnrollmentStatus / LedgerEntry / LedgerType / GroupSession]
- [Source: acce-nextjs/src/lib/cancellation.ts (computeRefund/hoursUntilStart — reuse); src/lib/wallet.ts (mutate/getBalance — AD-6); src/lib/enrollment.ts (reserveSeat/confirmPaidSeat envelope + helpers); src/lib/reserve-schema.ts (schema/mapper pattern); src/lib/auth-guards.ts (requireSession); src/lib/class-display.ts (formatZar)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx + actions.ts (island + action template); acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx (5.1 page to update)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#AD-12; 5-1-…md; 3-4-…md; 3-5-…md; 4-2-…md; autopilot-decisions.md 2026-07-06 (5.2 ledger-model / re-guard / AD-12-defer decisions)]

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References
No debug issues encountered. All 6 tasks completed in sequence without failures.

### Completion Notes List
- **Task 1 (cancel-schema.ts + test):** Pure Zod schema `{ enrollmentId: z.string().min(1) }`, `CancelFailureReason`, `CANCEL_SUCCESS_MESSAGE`, `CANCEL_ERROR_MESSAGES`, `getCancelErrorMessage` mapper. 25 unit tests (all pass).
- **Task 2 (enrollment.ts#cancelEnrollment):** New exported `cancelEnrollment(studentId, enrollmentId)` added to `src/lib/enrollment.ts` as the AD-14 CANCELLED-transition sole writer. Serializable + FOR UPDATE + MAX_RETRIES/backoff retry envelope mirroring reserveSeat. IDOR-safe findFirst keyed on `{id, studentId}`, GroupSession FOR UPDATE lock, TOCTOU-safe re-read of status, computeRefund from enrollment.priceCents snapshot (AD-16), CANCELLED flip, CANCELLATION_REFUND `+refundCents` via wallet.mutate (when >0), CANCELLATION_FEE `amountCents=0` audit row via wallet.mutate (when feeCents>0). Imports `{ computeRefund, hoursUntilStart }` from `@/lib/cancellation` added.
- **Task 3 (actions.ts):** `cancelEnrollmentAction` server action: requireSession-first, safeParse, cancelEnrollment domain call, revalidatePath("/portal/my-classes")+("/portal/wallet"), discriminated return. Mirrors reserveSeatAction pattern exactly.
- **Task 4 (cancel-enrollment-button.tsx):** `CancelEnrollmentButton` client island with AlertDialog confirm, `useState` pending guard, sonner toast UX-DR5, router.refresh() on success, outline variant (UX-DR2), aria-busy+min-h-[44px]+focus ring (UX-DR6/NFR10), plain serialisable props (RSC-500 safe).
- **Task 5 (page.tsx wiring):** Replaced `<Button disabled>` with `<CancelEnrollmentButton enrollmentId refundCents refundPct classTitle>`. Removed unused `Button` import. hoursUntilStart/computeRefund retained for advisory preview props feeding the island.
- **Task 6 (verification):** prisma validate clean (schema untouched; CANCELLATION_REFUND+CANCELLATION_FEE already in LedgerType). build clean (`/portal/my-classes ƒ Dynamic` present). ESLint exit 0. 430/430 vitest (25 new cancel-schema). Deferrals appended to deferred-work.md.

### File List
- `acce-nextjs/src/lib/cancel-schema.ts` (NEW)
- `acce-nextjs/tests/unit/cancel-schema.test.ts` (NEW)
- `acce-nextjs/src/lib/enrollment.ts` (MODIFIED — added cancelEnrollment + CancelResult + cancellation import)
- `acce-nextjs/src/app/(portal)/portal/my-classes/actions.ts` (NEW)
- `acce-nextjs/src/app/(portal)/portal/my-classes/cancel-enrollment-button.tsx` (NEW)
- `acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx` (MODIFIED — live island replaces inert button)
- `_bmad-output/implementation-artifacts/deferred-work.md` (MODIFIED — 5.2 deferrals appended)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (MODIFIED — status: review)
- `_bmad-output/implementation-artifacts/5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool.md` (MODIFIED — tasks/status/record)
