---
title: Adversarial Review — ACCE Phase 1a Architecture Spine
reviewer: adversarial (one-level-down clash construction)
target: ARCHITECTURE-SPINE.md
date: 2026-07-05
verdict: CHANGES-REQUESTED
---

# Adversarial Review — ACCE Phase 1a Architecture Spine

## Method

For each finding I construct **two units one level down** — two stories/modules that
different developers would plausibly build — where *each unit independently satisfies
every AD (AD-1..AD-13) to the letter*, yet the pair **builds incompatibly**: clashing
data shapes, two owners of one entity, conflicting mutation paths, or a race the ADs
do not actually close. Each surviving pair is a hole; each hole ends with a proposed
new or tightened AD.

Overall: the seat-oversell invariant (AD-4/5) is genuinely tight for the *balance-pay
reserve path*. Almost everything else that writes to `Enrollment.status` or to the
wallet balance is **outside** that lock and **outside** any equivalent invariant. The
spine locks one door and leaves four open.

---

## Finding 1 — AD-6 "serialize per-student balance" is a wish, not a mechanism (CRITICAL)

AD-6: *"Concurrent balance mutations for the same student must be serialized — either
under the reservation's row lock or an explicit per-student lock."* This offers two
mechanisms and mandates **neither**, and the one concrete lock that exists (AD-4's
`SELECT … FOR UPDATE` on `GroupSession`) **is on the wrong row**.

**Unit A — `enrollment.reserveSeat` balance path (Story 3.4).** Runs `Serializable`,
locks the *GroupSession* row for class X, guards `balance ≥ price`, appends
`BOOKING_CHARGE`. Obeys AD-4, AD-6, AD-8, AD-9 to the letter.

**Unit B — the webhook confirm (Story 4.2).** AD-7/Story-4.2 say it flips
`PENDING→CONFIRMED` and writes `BOOKING_CHARGE` *"in a transaction"* — **isolation
level unspecified, so READ COMMITTED by default.** It does **not** run through
`reserveSeat`, so it never takes the `GroupSession` row lock, and it takes no
per-student lock. It reads current balance to compute `balanceAfterCents`.

**The clash — three independent ways balance corrupts:**
1. **Two different classes, same student, both balance-pay.** Unit A locks the class-X
   row; a sibling reserve for class Y locks the class-Y row. Different rows → **no
   mutual exclusion.** Both read `balance = R290`, both deduct → balance goes to
   `-R290` or one deduction is lost. AD-6's "reservation's row lock" cannot serialize
   two *different* sessions. (Postgres SSI *might* abort one on a `LedgerEntry`
   predicate write-skew *if* both are `Serializable* and the sum query predicate-locks
   the `studentId` range — but the spine neither requires `Serializable` here nor
   guarantees the predicate index is used. Relying on it is exactly the "wish".)
2. **Webhook confirm vs cancel-refund.** Unit B (READ COMMITTED) writes
   `BOOKING_CHARGE` while `enrollment.cancel` (AD-11 — which names **no lock at all**)
   concurrently writes `CANCELLATION_REFUND` for the same student. Both read the same
   starting balance → two `balanceAfterCents` computed off the same base → the ledger's
   running-balance column is now wrong (violates the AD-6 promise that
   `balanceAfterCents` is coherent).
3. **Non-negative guard is not atomic.** "Guard before deducting" is a check-then-act;
   without a common lock two txns both pass the guard and both deduct → negative
   balance (violates NFR4), the exact thing AD-6 claims to prevent.

**Two owners obeying the ADs still corrupt the ledger.** This is the single biggest hole.

**Proposed fix — tighten AD-6 to name the mechanism.** Mandate a **per-student
serialization key** for *every* balance mutation, independent of any class: e.g.
`SELECT id FROM "user" WHERE id = $studentId FOR UPDATE` (or a Postgres advisory lock
`pg_advisory_xact_lock(hashtext(studentId))`) acquired at the top of a **single
`wallet.mutate(tx, studentId, …)`** helper that *all* callers (reserve, webhook confirm,
cancel, future adjustment/withdrawal) must use, inside a transaction whose isolation is
**explicitly stated**. Add: the webhook confirm and `cancel` run under this same
per-student lock. Without a named lock, AD-6 cannot be implemented consistently by two devs.

---

## Finding 2 — `Enrollment.status` has ungoverned writers; AD-4 and AD-7 contradict on "sole" (HIGH)

AD-4: *"No other code path may create or confirm an Enrollment."* AD-7: the webhook
*"is the sole authority that flips PENDING → CONFIRMED."* Both claim exclusivity — a
literal contradiction (reserveSeat confirms the balance path; the webhook confirms the
Paystack path). More importantly, **AD-4 governs only `create` and `confirm`.** Three
other status transitions exist and are owned by nobody:

- `CONFIRMED → ATTENDED / NO_SHOW` (Epic 6, Story 6.2, admin roster).
- `PENDING → CANCELLED` via **lazy expiry** (AD-5, "when next touched" — see Finding 3).
- `CONFIRMED → CANCELLED` via cancel (AD-11 — governed, but with no lock; see Finding 1).

**Unit A — Story 6.2 admin attendance.** A dev writes
`db.enrollment.update({ where:{id}, data:{ status: 'ATTENDED' }})` directly from the
admin server action. **No AD forbids it** (AD-4 only forbids create/confirm; AD-3 only
requires the admin guard). Perfectly compliant.

**Unit B — AD-5 occupancy definition.** `occupied = count(status ∈ {PENDING,
CONFIRMED})`. `ATTENDED`/`NO_SHOW` are **excluded from the count**, yet an `ATTENDED`
student still physically occupied a seat.

**The clash:** the moment Priyanka marks the roster, occupancy drops and `seatsLeft`
*rises* for a class whose seats are actually all used. Oversell is only *accidentally*
prevented — by Story 3.4's "future `start`" guard, which is **not an AD** and is
**not restated on the Paystack path (Story 4.1) nor the webhook confirm (Story 4.2)**.
The invariant that stops re-selling a past/attended class exists in one AC and nowhere
in the spine. A second dev implementing the Paystack init without that guard reopens
oversell of a started class.

**Proposed fixes:**
- **Tighten AD-4**: reword the exclusivity to "no code path *other than* `reserveSeat`
  (create + balance-confirm) and the webhook (Paystack-confirm) may create or transition
  an `Enrollment`; the `ATTENDED`/`NO_SHOW` transition is owned by a single
  `enrollment.markAttendance(tx, …)` in `enrollment.ts`, callable only from the admin
  path." Make `enrollment.ts` the **sole writer of `Enrollment.status`, full stop** —
  every transition (create, confirm, cancel, expire, attend) is a named function there.
- **New AD (or fold into AD-4)**: seat acquisition on *all* paths guards
  `status = SCHEDULED AND start > now()` **inside the lock** — promote Story 3.4's
  buried guard to an invariant binding both pay paths and the webhook.

---

## Finding 3 — Lazy expiry flip (AD-5) races confirm/reserve; owner + lock unspecified; read paths mutate (HIGH)

AD-5: expired `PENDING` rows are *"lazily flipped to CANCELLED when next touched."*
"When next touched" names **no owner and no lock**, and "touched" includes **read
paths** — the class listing (Story 3.2), detail (3.3), and seats-left computation all
compute occupancy and therefore all "touch" expired rows.

**Unit A — listing/detail read path.** A dev computes `seatsLeft`, sees an expired
`PENDING`, and (per AD-5) flips it `CANCELLED` with a bare `UPDATE` — a **write
side-effect inside an RSC GET render**, with **no `FOR UPDATE` lock** (it's a read path;
nothing tells this dev to lock).

**Unit B — the webhook confirm (Story 4.2).** Concurrently flips that same
`PENDING → CONFIRMED` (the payment just succeeded, a few seconds late).

**The clash:** classic lost-update / TOCTOU. If A wins, the webhook then finds **no
`PENDING` row** for a *paid* seat. Story 4.2's only recovery is the auto-refund path,
but that path is gated on *"class has since filled"* — here the class may **not** be
full, so the correct action is re-confirm, which requires **reactivation** — and
reactivation is `reserveSeat`'s job (AD-12), **not the webhook's**. The webhook has
**no defined behavior** for "PENDING was lazily cancelled but the seat is still free."
Undefined → the paid student silently loses the seat *and* the refund path doesn't fire.

Two concurrent *readers* also both flip the same row (double write, harmless) — but it
proves reads mutate shared state unlocked, which the spine's "arrow points downward /
UI never contains business logic" rule (Design Paradigm) also implicitly violates: a
read view is performing a domain mutation.

**Proposed fix — new/tightened AD:** the expiry flip is a **domain write owned solely
by `enrollment.ts`**, performed **only under the `GroupSession` row lock** (i.e. only
inside `reserveSeat`, or a dedicated `expireStale(tx, sessionId)` it calls). Read/data-
fetch paths **compute occupancy by excluding expired PENDING (already in AD-5) but must
not write** — they never issue an `UPDATE`. State the read is pure. And define the
webhook's behavior when the matching PENDING is missing/expired-but-seat-free:
re-run the locked reserve (reactivate) before deciding confirm-vs-refund.

---

## Finding 4 — Admin class edit races reserveSeat and other admins; no lock, no optimistic concurrency (HIGH)

Nothing in the spine requires the **admin edit** path (Story 2.3, capacity/price/
meetingUrl) to take the `GroupSession` row lock or run any isolation guarantee. AD-4's
lock lives only in `reserveSeat`.

**Unit A — `reserveSeat`.** Locks the session row, reads `capacity`, counts occupancy,
inserts. Compliant.

**Unit B — Story 2.3 edit.** Reads the class into a form, admin changes `capacity`
`6→4`, the server action re-checks "capacity ≥ occupied" (Story 2.3 AC) then
`db.groupSession.update`. **That check is outside AD-4's lock**, so a concurrent
reserve slips between the admin's occupancy read and the capacity write → capacity is
lowered below true occupancy → **oversold class**, defeating NFR1 through a path NFR1
never considered. (Row-level `UPDATE` vs `FOR UPDATE` do serialize at the row, but the
*application-level check-then-write* still races unless the whole read-check-write runs
under the same lock.)

**Two admins (Unit B vs Unit B'):** `GroupSession` has **no `updatedAt` and no version
column**, so optimistic concurrency is *impossible without a schema change*. Admin A
saves a new price; Admin B, on a stale form, saves the Meet link via a full-object PUT
and **silently clobbers the price back**. If one dev implements edit as a whole-row
replace and another implements a "paste Meet link" quick-action as a field patch
(Story 2.3 explicitly mentions pasting the link *after* scheduling), the PUT clobbers
the patch. Same entity, two write shapes, zero concurrency control — a compliant clash.

**Price-vs-reserve interaction:** the Paystack path snapshots `enrollment.priceCents`
and initializes Paystack with that amount at PENDING-create. If the admin then edits the
price, the webhook must write `BOOKING_CHARGE` equal to the **snapshot the student
actually paid**, not the class's current price — but **no AD states the `BOOKING_CHARGE`
amount equals `enrollment.priceCents`** (AD-8 governs *count*, not *amount*). Two devs
will pick differently → ledger diverges from what Paystack charged.

**Proposed fixes:**
- **New AD**: admin mutations to `GroupSession` fields that feed capacity/pricing
  invariants (`capacity`, `priceCents`, `status`, `start`) go through a single
  `session.update()` that acquires the **same `SELECT … FOR UPDATE` row lock** as
  `reserveSeat` and re-validates `capacity ≥ occupied` inside it.
- **Schema + AD**: add `updatedAt @updatedAt` to `GroupSession` and require
  optimistic-concurrency (version/`updatedAt` compare) on admin edits.
- **Tighten AD-8/AD-9**: `BOOKING_CHARGE.amountCents == enrollment.priceCents`
  (the snapshot), and refund base in AD-11 is `enrollment.priceCents` — name it.

---

## Finding 5 — `paymentRef` ownership/uniqueness undefined; webhook→enrollment mapping unspecified; auto-refund edge is AD-less (HIGH)

`Enrollment.paymentRef` is `String?` with **no unique constraint** in the schema.
`Payment.reference` is `@unique`; `LedgerEntry.paymentRef` is also non-unique. Story 4.1
says "a **unique** `paymentRef`" — uniqueness is **by convention only**, unenforced.
The ERD says Payment is *"linked by paymentRef (idempotency mirror)"* but there is **no
FK, no unique index, and no AD defining the join**.

**Unit A — Story 4.1 checkout init.** Generates `paymentRef` (say `enr_<cuid>`), stores
it on the enrollment, passes it as Paystack `reference`.

**Unit B — Story 4.2 webhook.** Upserts `Payment` by `reference` (idempotent, AD-7 ✓),
then must find *"the matching PENDING enrollment."* **By what key?** Dev B could look
up `Enrollment.paymentRef == reference`, *or* read `enrollmentId` from Paystack
`metadata` (a common Paystack pattern). Two legitimate lookup strategies, no AD picks
one → they diverge, and neither is guarded against a second enrollment sharing a
`paymentRef` (no unique constraint).

**Re-enrollment interaction (AD-12):** reactivation *resets* `paymentRef` on the reused
row. A **late webhook for the old reference** now matches **no** enrollment → orphan.

**The auto-refund edge (Story 4.2 AC3) is governed by no AD at all.** "Expired/released
and class filled → auto-refund via Paystack + notify." Unspecified:
- Does it write a ledger row? It's a **Paystack** refund, not wallet → likely **no**
  `LedgerEntry`, leaving a **`Payment` (status=success) with no enrollment and no
  ledger** — an orphan reconciliation gap AD-8 doesn't cover (AD-8 assumes a CONFIRMED
  enrollment exists).
- **Refund idempotency.** AD-7 makes *Payment upsert* idempotent, but the **Paystack
  refund API call itself** is not — a re-delivered `charge.success` before `Payment` is
  marked refunded could fire a **second refund**. Nothing governs this.
- The "class filled?" decision is read **without the session row lock** in the webhook,
  so it races `reserveSeat` (ties to Finding 3).

**Proposed fixes:**
- **New AD**: `paymentRef` is generated exactly once by `paystack.ts` at init, format
  defined, and is the **sole** webhook→enrollment join key; add
  `@unique` on `Enrollment.paymentRef` (nullable-unique) in schema. State that the
  webhook resolves the enrollment by `paymentRef` only.
- **New AD (auto-refund / orphan)**: define the lost-seat path — refund idempotency
  keyed on `Payment.reference` (record refund state on the `Payment` row), whether a
  compensating ledger/wallet-credit is written vs external Paystack refund, and that a
  successful `Payment` with no live enrollment is a recognized, reconciled state — not
  an orphan. Bind it to a new NFR.

---

## Finding 6 — AD-5's single occupancy definition is wrong for the admin display consumer (MEDIUM)

AD-5 fixes **one** definition of `occupied` (`PENDING + CONFIRMED`) for **all**
consumers. But there are two consumers with different needs:

**Unit A — `reserveSeat` / seats-left (Stories 3.2/4).** Wants `PENDING + CONFIRMED`
(future capacity). Correct.

**Unit B — admin index & roster (Stories 2.2 "occupied/seats-left", 6.1).** After a
class runs, seats are `ATTENDED`/`NO_SHOW` — **excluded** by AD-5 — so a fully-attended
6-seat class displays **"0 occupied / 6 seats left."** Priyanka's roster/index shows a
completed, full class as empty. Same field name, two required meanings.

**Proposed fix — tighten AD-5:** define occupancy as **two derived views** — a
*capacity-occupancy* (`PENDING`+`CONFIRMED`, unexpired) used only by `reserveSeat`, and
a *headcount* (`CONFIRMED`+`ATTENDED`+`NO_SHOW`) for admin display — and name which view
each consumer uses, so two devs don't reuse the wrong one.

---

## Secondary / lower-severity notes

- **No FK on `LedgerEntry.studentId` (and `enrollmentId`, `paymentRef`).** Balance is
  `Σ ledger by studentId` with no referential integrity — a typo'd `studentId` mints a
  phantom balance; a banned/deleted Better Auth user orphans a ledger with a live
  balance. AD-6 assumes the ledger is trustworthy; nothing enforces the key exists.
  Consider a FK or an AD asserting `studentId` referential integrity + user-lifecycle
  policy (ban/delete vs redeemable balance, NFR5/CPA).
- **`GroupSession` has no `updatedAt`** (also flagged in Finding 4) — blocks optimistic
  concurrency and audit of admin edits; `Enrollment` likewise has only `createdAt`, so
  the `ATTENDED`/`NO_SHOW`/`CANCELLED` transitions leave **no timestamp of when they
  happened** — weakens the "audit any state change" lesson-learned rule.
- **No audit trail for admin state changes.** Global lessons-learned mandates
  who/what/when logging for user-initiated state changes; the spine has no AD for it,
  and admin capacity/price edits and attendance marks are exactly such changes.
- **Cancel (AD-11) states no transaction/isolation.** It writes a ledger row (AD-6) and
  flips status; per Finding 1 it must run under the per-student lock and (for the seat
  return) is a status write that should be owned by `enrollment.ts` (Finding 2). Make
  AD-11 explicitly reference the AD-6 mechanism and the AD-4 status-writer rule.

---

## Summary of proposed AD changes

| # | Change | Severity |
|---|--------|----------|
| 1 | **AD-6**: mandate a concrete **per-student lock** (advisory or `user` row `FOR UPDATE`) via one `wallet.mutate` helper used by reserve/webhook/cancel; state explicit isolation for the webhook confirm | CRITICAL |
| 2 | **AD-4**: `enrollment.ts` is the *sole* writer of **every** `Enrollment.status` transition (incl. `ATTENDED`/`NO_SHOW`/expiry); resolve the AD-4↔AD-7 "sole confirmer" contradiction; promote the `SCHEDULED && start>now` guard to an invariant on all pay paths | HIGH |
| 3 | **AD-5**: expiry flip is a locked domain write owned by `enrollment.ts`; read paths are pure (no `UPDATE`); define webhook behavior when PENDING is missing/expired-but-free | HIGH |
| 4 | **New AD** + schema: admin `GroupSession` edits take the reserve row lock and re-check capacity≥occupied inside it; add `updatedAt` + optimistic concurrency; `BOOKING_CHARGE.amount == enrollment.priceCents` | HIGH |
| 5 | **New AD** + schema: `paymentRef` single-generator + `@unique`, sole webhook→enrollment key; **new AD** for the auto-refund/orphan-Payment path (refund idempotency, ledger treatment, reconciliation) | HIGH |
| 6 | **AD-5**: split occupancy into capacity-occupancy vs headcount and name each consumer's view | MEDIUM |

The spine's oversell invariant is strong. Its **weakness is everything that mutates
`Enrollment.status` or the wallet balance outside `reserveSeat`** — the admin, the
webhook, the cancel, and the lazy-expiry paths each run without the lock, isolation, or
single-owner rule that AD-4 gives the happy path. Close Findings 1–3 before build.
