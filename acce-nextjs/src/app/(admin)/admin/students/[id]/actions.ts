"use server";

// Server action: creditWalletAction — Story 3.5 (Task 2, AC1, AC2, AC4, AD-3/6/9).
// This is the SECOND wallet.mutate caller in the app (the first is 3.4's BOOKING_CHARGE).
// This writes a positive ADJUSTMENT LedgerEntry for a target student.
//
// Guard / validation / write order (AD-3 mandate, mirrors 2.1 createClassAction):
//   1. requireAdmin()                  — TRUSTED entry guard (before any parse or write)
//   2. creditWalletSchema.safeParse    — validate input (Zod, re-run server-side; AC2)
//   3. target user re-check            — verify studentId exists and is role="STUDENT" (AC4, NFR5)
//   4. toCents(amountRand)             — Rand→cents, once (AD-9)
//   5. db.$transaction → wallet.mutate — advisory lock + read + NFR4 + append (AD-6)
//   6. revalidatePath                  — ensure admin view + portal wallet reflect immediately (AC3)
//
// Result shape: discriminated union — { ok: true, balanceAfterCents } | { ok: false, … }
// Convention: NEVER throw for expected validation failures (Consistency Conventions).
// Unexpected errors (DB connectivity, etc.) are caught and returned as { ok: false }.
//
// AD-6: This action calls wallet.mutate (the SINGLE serialized mutation seam) — it does
// NOT write LedgerEntry directly. wallet.mutate takes the per-student advisory lock,
// reads balance under the lock, guards NFR4 (non-negative), and appends the immutable row.
// A positive credit (amountCents > 0) will NEVER trip the NFR4 guard.
//
// AD-4 note: No Serializable/FOR UPDATE/retry loop needed here. The only concurrency
// concern is two concurrent credits for the SAME student — the per-student advisory lock
// inside wallet.mutate serializes those. Cargo-culting 3.4's Serializable would be wrong.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { mutate } from "@/lib/wallet";
import { creditWalletSchema, toCents } from "./credit-schema";

export type CreditWalletResult =
  | { ok: true; balanceAfterCents: number }
  | { ok: false; fieldErrors?: Partial<Record<string, string[]>>; message?: string };

export async function creditWalletAction(
  input: unknown
): Promise<CreditWalletResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ──────────────────────────
  // Called FIRST — no admin, no parse, no write.
  // requireAdmin() calls redirect() for non-admins (NEXT_REDIRECT) — propagates naturally.
  await requireAdmin();

  // ── Step 2: Validate input with Zod ────────────────────────────────────
  const parsed = creditWalletSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    };
  }

  const { studentId, amountRand } = parsed.data;

  // ── Step 3: Re-check target user exists and is a STUDENT (AC4, NFR5) ───
  // Re-verify even though studentId comes from a server route prop —
  // stale/forged ids must fail cleanly rather than hitting an FK violation mid-tx.
  // Mirrors 2.1's subject existence re-check.
  let student: { id: string; role: string | null } | null = null;
  try {
    student = await db.user.findUnique({
      where: { id: studentId },
      select: { id: true, role: true },
    });
  } catch {
    return { ok: false, message: "Database error checking student. Please try again." };
  }

  if (!student || student.role !== "STUDENT") {
    return { ok: false, message: "Student not found" };
  }

  // ── Step 4: Compute amountCents (AD-9) ─────────────────────────────────
  // Rand→cents conversion happens ONCE here at the server entry.
  // A positive amountRand produces a positive amountCents — NFR4 guard never trips.
  const amountCents = toCents(amountRand);

  // ── Step 5: Write the ADJUSTMENT via wallet.mutate inside a $transaction ──
  // wallet.mutate: per-student advisory lock → read balance under lock →
  // computeBalanceAfter → NFR4 guard → append immutable LedgerEntry (AD-6).
  // Plain default isolation is correct — no oversell invariant here (AD-4 note above).
  // DO NOT add Serializable/FOR UPDATE/retry — cargo-cult from 3.4 is wrong here.
  try {
    const entry = await db.$transaction(async (tx) => {
      return mutate(tx, studentId, {
        type: "ADJUSTMENT",
        amountCents, // positive cents — credit
      });
    });

    // ── Step 6: Revalidate paths so both views reflect the new balance ──
    // The admin student view and the student's portal wallet both read getBalance() —
    // revalidating both ensures the balance Card + ledger table update immediately (AC3).
    revalidatePath(`/admin/students/${studentId}`);
    revalidatePath("/portal/wallet");

    return { ok: true, balanceAfterCents: entry.balanceAfterCents };
  } catch (err) {
    // Money-path observability: log the error server-side (never swallow).
    console.error("[creditWalletAction] Unexpected error:", err);
    return {
      ok: false,
      message: "Failed to credit wallet. Please try again.",
    };
  }
}
