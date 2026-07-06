// wallet-math.ts — Story 3.1 (AC1, AC3, AC5).
// Pure, db-free wallet balance arithmetic — mirrors class-occupancy.ts (2.2 pattern).
//
// AD-6 rule: balance(studentId) = Σ LedgerEntry.amountCents.
//   Every balance mutation goes through the single serialized wallet.mutate() seam,
//   which calls computeBalanceAfter() under the per-student advisory lock and guards
//   with wouldGoNegative() (NFR4: balance may never go negative).
//
// AD-9 rule: all monetary values are integer cents. No floats in domain logic.
//   These functions accept and return integer cents only.
//
// No PrismaClient runtime import — plain number arithmetic so vitest (jsdom) loads
// this file without DATABASE_URL or a live DB.

/**
 * Sum the amountCents of a list of ledger entry snapshots.
 *
 * This is the AD-6 balance definition applied to an in-memory slice (useful for
 * tests and fallback). The authoritative balance is computed by the DB aggregate
 * inside getBalance() in wallet.ts (not here).
 *
 * Returns 0 for an empty list.
 *
 * @param entries - array of objects with an integer `amountCents` field (signed)
 */
export function sumLedgerAmounts(entries: { amountCents: number }[]): number {
  return entries.reduce((acc, e) => acc + e.amountCents, 0);
}

/**
 * Compute what the balance will be after applying a ledger mutation.
 *
 *   newBalance = currentBalanceCents + amountCents
 *
 * Used inside wallet.mutate() UNDER the per-student advisory lock to determine
 * balanceAfterCents before writing the immutable LedgerEntry row.
 *
 * @param currentBalanceCents - current balance in integer cents (non-negative in a valid ledger)
 * @param amountCents         - signed delta in integer cents (negative = deduction)
 */
export function computeBalanceAfter(
  currentBalanceCents: number,
  amountCents: number,
): number {
  return currentBalanceCents + amountCents;
}

/**
 * NFR4 guard predicate: returns true when applying amountCents to the current
 * balance would drive the balance below zero.
 *
 * This is the pre-write check evaluated inside wallet.mutate() AFTER the
 * per-student advisory lock is held. If it returns true, mutate() rejects the
 * operation (throws WalletError) — the ledger row is never written.
 *
 * Rule: exact zero is ALLOWED (balance lands at exactly R0.00 = a full spend-down).
 * Only strict negative is rejected.
 *
 * @param currentBalanceCents - current balance in integer cents
 * @param amountCents         - signed delta in integer cents (a charge is negative)
 */
export function wouldGoNegative(
  currentBalanceCents: number,
  amountCents: number,
): boolean {
  return computeBalanceAfter(currentBalanceCents, amountCents) < 0;
}
