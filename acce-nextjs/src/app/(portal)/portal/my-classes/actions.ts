"use server";

// actions.ts — Story 5.2 (cancelEnrollmentAction).
//
// Guard / validation / cancel order (AD-3 mandate):
//   1. requireSession()                          — TRUSTED entry guard (FIRST — before any parse or read)
//      studentId = session.user.id (never accept a client-supplied student id)
//   2. cancelInputSchema.safeParse(input)         — Zod-validate { enrollmentId: string.min(1) }
//   3. cancelEnrollment(studentId, enrollmentId)  — domain call (Serializable tx; AC1–AC4)
//   4. on ok → revalidatePath + return { ok:true, refundCents, feeCents }
//   5. else pass through { ok:false, reason }
//
// Convention: NEVER throw for expected failures; NEXT_REDIRECT from requireSession() propagates.
//
// AD-14: enrollment.ts (cancelEnrollment) is the sole writer of Enrollment.status.
// AD-5: no write here — this action is a thin wrapper over the domain function.

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-guards";
import { cancelEnrollment } from "@/lib/enrollment";
import { cancelInputSchema, type CancelFailureReason } from "@/lib/cancel-schema";

// ---------------------------------------------------------------------------
// cancelEnrollmentAction — cancel-enrollment path (Story 5.2)
// ---------------------------------------------------------------------------

export type CancelEnrollmentActionResult =
  | { ok: true; refundCents: number; feeCents: number }
  | { ok: false; reason: CancelFailureReason };

export async function cancelEnrollmentAction(
  input: unknown,
): Promise<CancelEnrollmentActionResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ─────────────────────────────
  // Called FIRST — no parse, no cancel, no read.
  // requireSession() calls redirect() for unauthenticated users (NEXT_REDIRECT) —
  // it must NOT be wrapped in a try/catch that would swallow the redirect.
  const session = await requireSession();
  const studentId = session.user.id; // NEVER accept a client-supplied student id (AD-3)

  // ── Step 2: Validate input with Zod ────────────────────────────────────────
  const parsed = cancelInputSchema.safeParse(input);
  if (!parsed.success) {
    // Bad id shape — treat as not_found (the enrollmentId is invalid/empty).
    return { ok: false, reason: "not_found" };
  }

  const { enrollmentId } = parsed.data;

  // ── Step 3: Domain call ─────────────────────────────────────────────────────
  const result = await cancelEnrollment(studentId, enrollmentId);

  // ── Step 4: Map result ─────────────────────────────────────────────────────
  if (result.ok) {
    // Success: revalidate so the cancelled row disappears from the list and
    // the wallet balance reflects the refund (AC3/AC5).
    revalidatePath("/portal/my-classes");
    revalidatePath("/portal/wallet");
    return { ok: true, refundCents: result.refundCents, feeCents: result.feeCents };
  }

  // ── Step 5: Pass through failure reasons ────────────────────────────────────
  return { ok: false, reason: result.reason };
}
