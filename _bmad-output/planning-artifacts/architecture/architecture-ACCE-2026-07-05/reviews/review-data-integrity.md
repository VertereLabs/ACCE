---
review: data-integrity & concurrency
target: ARCHITECTURE-SPINE.md (ACCE Phase 1a — Group Classes MVP)
schema: acce-nextjs/prisma/schema.prisma
reviewer-lens: money and seats must never corrupt
date: 2026-07-05
verdict: CONDITIONAL PASS — the invariants are the right ones, but three of them (AD-6, AD-8, and the missing auto-refund rule) lack DB-level or lock-level *teeth* and rest silently on Postgres SSI. Tighten before build.
---

# Data-Integrity & Concurrency Review — ACCE Phase 1a

## Executive summary

The spine reaches for the correct primitives (append-only ledger, derived capacity, out-of-band idempotent webhook, integer cents). The problem is not the choice of invariants — it is that several ADs **attribute their safety to the wrong mechanism** and offer implementation options that do not actually serialize what they claim to. Correctness in the concurrent cases below holds *only* because `SERIALIZABLE` SSI happens to catch the write-skew — not because of the `SELECT … FOR UPDATE` row lock the spine keeps crediting. That is a fragile foundation: any future "optimisation" that downgrades isolation, or any code path that skips the transaction, corrupts money or seats with no compile-time or unit-test signal.

Findings are ordered by severity.

---

## F1 — [HIGH] Same-student concurrent bookings can double-spend the wallet

**Where:** AD-6, AD-8, ledger `balanceAfterCents`.

**The scenario:** One student, balance R290, opens two *different* classes (each priceCents 29000) and clicks "Pay from balance" on both at the same instant.

- `reserveSeat()` locks the **GroupSession** row (AD-4). The two bookings are for **different** GroupSessions → they lock **different** rows → **zero mutual exclusion between them.**
- Both transactions compute `balance = Σ LedgerEntry.amountCents` = 29000, both pass the non-negative guard, both append a `BOOKING_CHARGE` of −29000.
- Result: two confirmed seats paid from one R290, wallet balance now −29000. Both ledger rows may even record the **same** `balanceAfterCents = 0`, corrupting the derived-snapshot invariant.

**Why the spine thinks it is safe (and why that is wrong):** AD-6 says concurrent same-student mutations "must be serialized — **either under the reservation's row lock** or an explicit per-student lock." The reservation's row lock is on `GroupSession`; it does **not** serialize two bookings of *different* sessions by the same student. So the first of the two offered options has no teeth for the exact case that matters.

The scenario is in fact caught today — but only because under `SERIALIZABLE` both transactions register an SIRead predicate on the ledger (`studentId`), both insert, and SSI aborts one with `40001`. Safety therefore lives entirely in SSI, not in the lock AD-6 names.

**Existing AD closes it?** No — AD-6 as written explicitly permits an insufficient implementation.

**Tightening (new/tightened AD-6):**
- Strike the "under the reservation's row lock" option for cross-session same-student serialization — it is false.
- Mandate an **explicit per-student serialization point** taken as the first statement of any transaction that reads-then-writes the wallet: `SELECT pg_advisory_xact_lock(hashtextextended(:studentId, 0))`. This is deterministic, deadlock-safe, and works even under READ COMMITTED (no abort/retry needed).
- If the team prefers to rely on SSI instead, AD-6 must (a) state that SSI — not any row lock — is the guarantee, (b) require the wallet-balance `SUM` read to happen *inside* the same Serializable tx that appends, and (c) mandate the bounded-retry loop on `40001` for the wallet path too (AD-4 only mentions retry for reservation).

---

## F2 — [HIGH] "Exactly one BOOKING_CHARGE" (AD-8) has no enforcement; two pay-paths can both charge

**Where:** AD-8, AD-12, `LedgerEntry`.

**The scenario:** Student starts a Paystack booking (insufficient balance) → enrollment `PENDING`, `pendingExpiresAt = now+15m`, Paystack checkout opened. Before the webhook lands, funds appear / student retries and hits the balance path. Per AD-12, `reserveSeat()` **reactivates the same row**, flips it `CONFIRMED`, and writes a `BOOKING_CHARGE`. Then Paystack's `charge.success` webhook arrives and — per AD-7 — writes **another** `BOOKING_CHARGE` and re-confirms. Student is charged twice for one seat.

**Why the spine thinks it is safe:** AD-8 asserts the two paths are "mutually exclusive for a given enrollment." That is an *aspiration stated in prose* with no structural enforcement. There is no unique constraint, no state guard specified to make the two paths observe each other.

**Existing AD closes it?** No — AD-8 is a description of the desired outcome, not a mechanism.

**Tightening:**
- Add a **partial unique index** to the schema — this is the real teeth:
  ```prisma
  // one booking charge per enrollment, enforced by the DB
  @@unique([enrollmentId, type]) // OR, more precisely, a raw partial index:
  // CREATE UNIQUE INDEX one_booking_charge_per_enrollment
  //   ON "LedgerEntry" ("enrollmentId") WHERE type = 'BOOKING_CHARGE';
  ```
  (Prisma can't express the `WHERE` filter natively — add it as a raw-SQL migration step. Use the filtered form so refunds/fees on the same enrollment aren't blocked.)
- Tighten AD-8 to require the webhook confirm path to be **no-op if the enrollment is already CONFIRMED** (guard on current status inside the locked tx), so the balance-then-webhook race resolves to auto-refund (see F3), not a second charge.

---

## F3 — [HIGH] Late/duplicate webhook after the seat is lost — money conservation is not covered by any AD

**Where:** AD-7 (confirm path), AD-5 (lazy expiry), AD-11 (only covers *user-initiated* refunds). This is the exact "auto-refund edge case" flagged in the brief, and **no AD owns it.**

**The scenario:** Paystack booking → `PENDING`, `pendingExpiresAt = now+15m`. Payment succeeds but the webhook is delayed >15m (Paystack ret/backoff, or transient 5xx on our side). Meanwhile the hold expires: AD-5 drops the row from the occupancy count, and another student legitimately takes the last seat. The delayed webhook now arrives on a booking whose seat is gone.

Two failure modes if AD-7 is implemented literally ("flip PENDING → CONFIRMED"):
1. It confirms without re-checking capacity → **oversell** (seat count now exceeds capacity).
2. Or it refuses to confirm — but Paystack already captured real money, and nothing credits it back → **money vanishes** (student paid, no seat, no refund).

**Existing AD closes it?** No. AD-7 does not require the webhook to re-check capacity under the session lock, and AD-11 explicitly scopes to user cancellations.

**Tightening (new AD — "Webhook confirm re-validates seat under lock; conserves money on failure"):**
- The webhook confirm MUST run through the same `reserveSeat`-style Serializable tx that takes `SELECT … FOR UPDATE` on the `GroupSession` and re-derives occupancy (AD-4/5) **before** confirming — the webhook is not exempt from the capacity check.
- If the seat is still available → confirm + single `BOOKING_CHARGE` (subject to F2's index).
- If the seat is gone / hold expired and unrecoverable → do **not** confirm; instead record the `Payment` mirror **and** credit the student's wallet with a ledger entry for the captured amount (a `TOPUP`/refund-type row, amount = `Payment.amountCents`), then email. This makes money conservation total: every rand Paystack captured ends up either as a seat or as wallet balance.
- State the invariant explicitly: *for every successful Paystack capture, exactly one of {a CONFIRMED enrollment with one BOOKING_CHARGE} XOR {a wallet credit equal to the captured amount} exists.*

---

## F4 — [MEDIUM] No-oversell rests on SSI, not on the FOR UPDATE lock the spine credits

**Where:** AD-4, AD-5.

**The mechanism, precisely:** AD-4 says it "locks the GroupSession row (`SELECT … FOR UPDATE`) **before** counting occupancy." But the occupancy count reads **child** `Enrollment` rows, and under `REPEATABLE READ`/`SERIALIZABLE` the transaction's snapshot is fixed at its first statement. Postgres does **not** refresh that snapshot when a `FOR UPDATE` waiter acquires a row that was only *locked* (not updated) by the committer (per the documented rule: rollback-on-serialization only happens when the prior tx "actually updated or deleted the row, not just locked it"). The GroupSession row is only locked, never updated. Therefore:

- T2 blocks on T1's `FOR UPDATE`, T1 commits its new enrollment, T2 proceeds — **but T2's count still uses its pre-T1 snapshot and does not see T1's insert.** The row lock alone does **not** prevent oversell.
- What actually saves it: under `SERIALIZABLE`, T2's count registers a predicate (SIRead) over the `(groupSessionId, status)` range; T1's insert falls inside it; the rw-antidependency forms a dangerous structure and SSI aborts one with `40001`; the caller retries. **SSI is the guarantee; the FOR UPDATE is essentially a queueing optimisation that reduces abort churn.**

This matters because the spine's stated reasoning invites a silent regression: a future maintainer reading "we hold `FOR UPDATE` on the session" may reasonably downgrade to `READ COMMITTED` or `REPEATABLE READ` for performance, keep the lock, pass code review — and reintroduce oversell that no unit test catches.

**Existing AD closes it?** Correctness holds *today* under true `SERIALIZABLE`, so AD-4 is not wrong in outcome — but its rationale is wrong and its teeth are mis-located.

**Tightening:**
- Rewrite AD-4's rationale: state that **`SERIALIZABLE` SSI over the derived count is the no-oversell guarantee**; the `FOR UPDATE` on `GroupSession` is retained only to serialise contenders and cut retry rate. Forbid downgrading isolation without replacing the mechanism.
- Alternatively (simpler, deadlock-free, no retry loop): switch this path to **`READ COMMITTED` + `SELECT … FOR UPDATE` on GroupSession as the true mutex**, and — because READ COMMITTED gives each statement a *fresh* snapshot — the post-lock count then reliably sees committed inserts. This removes the SSI dependency entirely and is the classic seat-booking pattern. (Note this trades against F1/F5, which want SSI or an advisory lock for the wallet; the per-student advisory lock in F1 pairs cleanly with READ COMMITTED here.)
- Mandate the concurrency test be an **integration test against real Postgres** (SSI/`40001` behaviour cannot be exercised by the mocked unit suite listed in `tests/unit/`). Add "N parallel bookings on a capacity-N session → exactly N CONFIRMED, no oversell" and "capacity-1, 20 racers → 1 winner."

---

## F5 — [MEDIUM] Webhook idempotency under *concurrent* double-fire needs explicit gate ordering

**Where:** AD-7.

Sequential re-delivery is handled by the `Payment.reference` unique upsert. Two deliveries firing **concurrently** are the sharper case:

- Both verify HMAC, both attempt to write `Payment` + flip enrollment + write `BOOKING_CHARGE`.
- If each does `INSERT … ON CONFLICT DO NOTHING` and then unconditionally proceeds to confirm, both confirm and both charge — the unique constraint prevented a duplicate *Payment row* but not a duplicate *effect*.

The safe shape (AD-7 implies "no second effect" but does not pin the ordering that produces it):
1. Everything in **one transaction**.
2. The `Payment` insert is the **first** write and the **idempotency gate**: `INSERT … ON CONFLICT (reference) DO NOTHING RETURNING id`. Proceed to confirm/charge **only if a row was returned** (i.e. *this* tx created it). The losing concurrent tx blocks on the unique index until the first commits, then gets zero rows back → returns HTTP 200 with no further effect.
3. F2's partial unique index on `BOOKING_CHARGE` is the backstop if step 2 is ever violated.

**Existing AD closes it?** Partially — AD-7 has the right primitive but not the load-bearing ordering/atomicity.

**Tightening:** Extend AD-7 to mandate (a) single transaction spanning Payment insert + confirm + ledger, (b) Payment insert as the gate with `RETURNING`-guarded proceed, (c) explicit statement that concurrent duplicates are serialised by the unique index. Combine with F3 so the confirm step also re-checks capacity under the session lock.

---

## F6 — [MEDIUM] AD-11 refund tiers: boundary inclusivity and the refund/fee decomposition are ambiguous

**Where:** AD-11, `LedgerEntry` (CANCELLATION_REFUND / CANCELLATION_FEE).

**(a) Boundary inclusivity.** "`≥48h → 100%`, `24–48h → 70%`, `<24h → 0%`" leaves the `24h` and `48h` edges under-specified in prose. `≥48` is explicit; `24–48` reads as inclusive at 24 but its upper edge collides with `≥48`. Pin it to unambiguous comparators, evaluated in a single integer time unit:
```
minutesToStart = floor((start - now) / 60000)      // or keep in ms
minutesToStart >= 48*60            → 100%
48*60 > minutesToStart >= 24*60    →  70%
minutesToStart <  24*60            →   0%   (also no-show)
```
Compute in whole minutes/ms with explicit `>=`; do **not** truncate to integer hours (a booking at 47h59m must land in the 70% tier, and exactly 24h00m must be 70%, not 0%). Add unit tests at 48:00, 47:59, 24:00, 23:59.

**(b) Ledger decomposition can double-count the fee.** The `BOOKING_CHARGE` already removed 100% of price. AD-11 says cancelling "writes `CANCELLATION_REFUND` (+ `CANCELLATION_FEE` when kept)." If, in the 70% tier, the system credits `CANCELLATION_REFUND = +70%` **and also** writes a `CANCELLATION_FEE = −30%`, the student nets −60%, not the intended −30%. The two-entry model only balances if it is: `CANCELLATION_REFUND = +100%` then `CANCELLATION_FEE = −30%` (nets +70%). Pin the exact decomposition so the **sum of cancellation entries equals the intended net credit**.

**(c) Rounding leftover cent.** `refund = round(price * pct)` and `fee = round(price * (1−pct))` can differ from `price` by a cent. Define `fee = price − refund` so refund + fee always reconstruct price exactly. Refund maths in cents server-side is already mandated by AD-9 — extend it with this rule.

**Existing AD closes it?** AD-11 fixes the *authority* (server computes) but not the *arithmetic contract*.

**Tightening:** Add the comparator table, the fixed two-entry decomposition, and the `fee = price − refund` rule to AD-11, with the boundary unit tests.

---

## Lower-severity / confirmations

- **[LOW] `balanceAfterCents` duplicate rows** are a *symptom* of F1, not a separate bug; fixing per-student serialization removes it. Consider a per-student integration assertion: ledger ordered by `createdAt` has `balanceAfterCents[i] == balanceAfterCents[i-1] + amountCents[i]` (monotone reconstruction) as a cheap corruption detector.
- **[LOW] Lazy expiry vs capacity** — AD-5 excluding expired PENDING rows from the count (rather than flipping them) is safe for the capacity math; the flip is cosmetic. The only danger from an expired hold is the late-webhook path, which is F3.
- **[INFO] No FK on `LedgerEntry.studentId` / `enrollmentId`** is an intentional spine decision (append-only, future cash-out). Acceptable; the partial unique index in F2 does not need an FK to function.
- **[INFO] `Payment.amountCents` vs charged price** — the webhook should assert the captured amount equals the enrollment `priceCents` before confirming (guards against amount tampering / partial capture); worth a line in AD-7.

---

## Recommended AD changes, condensed

| AD | Change | Severity |
| --- | --- | --- |
| AD-6 | Remove the false "reservation row lock serializes wallet" option; mandate per-student `pg_advisory_xact_lock` (or SSI + documented retry) for all read-then-write wallet ops | HIGH |
| AD-8 | Add DB partial unique index `ON LedgerEntry(enrollmentId) WHERE type='BOOKING_CHARGE'`; make webhook confirm a no-op when already CONFIRMED | HIGH |
| **NEW** | Webhook confirm re-validates capacity under the GroupSession lock; on lost/expired seat, credit wallet with captured amount (money conservation invariant) | HIGH |
| AD-4 | Fix rationale — SSI (not FOR UPDATE) is the no-oversell guarantee; forbid isolation downgrade; require real-Postgres concurrency integration test | MED |
| AD-7 | Mandate single-tx + Payment-insert-as-gate (`ON CONFLICT DO NOTHING RETURNING`, proceed only if inserted); assert captured amount == priceCents | MED |
| AD-11 | Pin tier comparators (`>=`, minutes/ms), fixed refund/fee entry decomposition, `fee = price − refund` | MED |
