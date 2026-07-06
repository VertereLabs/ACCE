// wallet.ts — Story 3.1 (AC1, AC3, AC4).
//
// AD-6 SINGLE SERIALIZED MUTATION SEAM — every balance change in the app MUST
// route through wallet.mutate(). Callers:
//   - Story 3.4: reserve/BOOKING_CHARGE (calls mutate inside the Enrollment tx)
//   - Story 3.5: admin credit/ADJUSTMENT (calls mutate inside the admin action tx)
//   - Epic 5:    cancellation refunds (CANCELLATION_REFUND / CANCELLATION_FEE)
//
// Readers use getBalance() (or the db query directly inside mutate's own balance
// read — getBalance accepts an optional tx param for exactly this purpose).
//
// AD-2: use the singleton db from @/lib/db. Never new PrismaClient().
// AD-6: mutate() never takes its own db connection; it operates on the passed tx
//       so it composes into the caller's transaction.
// AD-9: all monetary values are integer cents. No floats here or in callers.

import { db } from "@/lib/db";
import { computeBalanceAfter, wouldGoNegative } from "@/lib/wallet-math";
import type { LedgerEntry, LedgerType, Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Prisma interactive-transaction client type (passed to mutate by callers). */
type PrismaTx = Omit<
  Parameters<Parameters<typeof db.$transaction>[0]>[0],
  "$transaction"
>;

/** Input to wallet.mutate(). */
export interface WalletMutateInput {
  type: LedgerType;
  /** Signed integer cents. Positive = credit, negative = debit (e.g. −29000 for a charge). */
  amountCents: number;
  /** Optional: the enrollment this mutation is tied to (BOOKING_CHARGE, CANCELLATION_*). */
  enrollmentId?: string;
  /** Optional: external payment reference (Paystack ref, etc.). */
  paymentRef?: string;
}

/**
 * Typed error thrown by mutate() when the mutation would drive the balance below zero.
 * Callers catch this specific type to present a user-friendly "insufficient balance" message.
 */
export class WalletInsufficientFundsError extends Error {
  readonly currentBalanceCents: number;
  readonly requestedAmountCents: number;

  constructor(currentBalanceCents: number, requestedAmountCents: number) {
    const shortfall = Math.abs(requestedAmountCents) - currentBalanceCents;
    super(
      `Insufficient wallet balance: balance is ${currentBalanceCents} cents, ` +
        `charge is ${Math.abs(requestedAmountCents)} cents, ` +
        `shortfall is ${shortfall} cents.`,
    );
    this.name = "WalletInsufficientFundsError";
    this.currentBalanceCents = currentBalanceCents;
    this.requestedAmountCents = requestedAmountCents;
  }
}

// ---------------------------------------------------------------------------
// getBalance
// ---------------------------------------------------------------------------

/**
 * Returns the current wallet balance for a student in integer cents (AD-6, AD-9).
 *
 * The authoritative balance is the sum of ALL LedgerEntry.amountCents for that
 * student (AD-6: `balance = Σ LedgerEntry.amountCents`). This is computed in the
 * DB via an aggregate — no N+1, no row loading.
 *
 * The `balanceAfterCents` column on each row is an audit snapshot, NOT the source
 * of truth — getBalance() always recomputes from the raw amountCents sum.
 *
 * Returns 0 when the student has no ledger rows.
 *
 * @param studentId - the student's User.id
 * @param tx        - optional Prisma tx client; when provided, the read runs inside
 *                    the caller's transaction (used by mutate() to read under the lock)
 */
export async function getBalance(
  studentId: string,
  tx?: PrismaTx,
): Promise<number> {
  const client = tx ?? db;
  const result = await client.ledgerEntry.aggregate({
    where: { studentId },
    _sum: { amountCents: true },
  });
  return result._sum.amountCents ?? 0;
}

// ---------------------------------------------------------------------------
// mutate — the single serialized mutation path (AD-6)
// ---------------------------------------------------------------------------

/**
 * The single serialized mutation seam for all wallet balance changes (AD-6).
 *
 * This function MUST be called inside the caller's db.$transaction() block.
 * It performs the following steps on the passed `tx` (never `db` directly):
 *
 *  1. Per-student advisory lock: SELECT pg_advisory_xact_lock(hashtext(studentId))
 *     — held for the lifetime of the transaction; auto-released at tx end.
 *     This serializes concurrent mutations for the SAME student across different
 *     classes (the GroupSession FOR UPDATE row lock does not do this — AD-6).
 *
 *  2. Read current balance UNDER the lock via getBalance(studentId, tx).
 *
 *  3. computeBalanceAfter(current, amountCents) → balanceAfterCents.
 *
 *  4. NFR4 guard: if balanceAfterCents < 0, throw WalletInsufficientFundsError.
 *     The ledger row is NEVER written for a balance-negative operation.
 *
 *  5. Append immutable LedgerEntry: { studentId, type, amountCents, balanceAfterCents,
 *     enrollmentId?, paymentRef? }. Ledger rows are NEVER updated or deleted.
 *
 * @param tx        - Prisma interactive-transaction client from the caller's $transaction
 * @param studentId - the student's User.id
 * @param input     - mutation input (type, signed amountCents, optional enrollmentId/paymentRef)
 * @returns         the newly created LedgerEntry row
 * @throws WalletInsufficientFundsError if the mutation would drive the balance below zero
 */
export async function mutate(
  tx: PrismaTx,
  studentId: string,
  input: WalletMutateInput,
): Promise<LedgerEntry> {
  // Step 1: Take the per-student advisory lock inside the caller's tx.
  // hashtext() maps the cuid string to int4 (the range pg_advisory_xact_lock accepts).
  // $executeRaw tagged template → parameterised SQL (no injection risk — never $executeRawUnsafe).
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${studentId}))`;

  // Step 2: Read current balance UNDER the lock.
  const currentBalance = await getBalance(studentId, tx);

  // Step 3: Compute balanceAfterCents.
  const balanceAfterCents = computeBalanceAfter(currentBalance, input.amountCents);

  // Step 4: NFR4 guard — reject if balance would go negative.
  if (wouldGoNegative(currentBalance, input.amountCents)) {
    throw new WalletInsufficientFundsError(currentBalance, input.amountCents);
  }

  // Step 5: Append the immutable ledger row.
  const entry = await tx.ledgerEntry.create({
    data: {
      studentId,
      type: input.type,
      amountCents: input.amountCents,
      balanceAfterCents,
      enrollmentId: input.enrollmentId,
      paymentRef: input.paymentRef,
    },
  });

  return entry;
}
