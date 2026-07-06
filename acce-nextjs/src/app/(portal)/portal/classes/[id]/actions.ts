"use server";

// Server actions — Story 3.4 (reserveSeatAction) + Story 4.1 (payWithPaystackAction).
//
// ─── reserveSeatAction ───────────────────────────────────────────────────────
// Guard / validation / reserve order (AD-3 mandate):
//   1. requireSession()          — TRUSTED entry guard (FIRST — before any parse or read)
//      studentId = session.user.id (never accept a client-supplied student id)
//   2. reserveInputSchema.safeParse(input) — Zod-validate { classId: string.min(1) }
//   3. reserveSeat(studentId, classId)    — domain call (Serializable tx; AC1-AC3)
//   4. on outcome:"confirmed" → revalidatePath + return { ok:true, outcome:"confirmed", enrollmentId }
//      on outcome:"pending_payment" → unexpected for balance path → return { ok:false, reason:"error" }
//      (edge case: balance changed between render and click; PENDING hold created; will expire lazily)
//   5. return the discriminated result to the PayWithBalanceButton island.
//
// ─── payWithPaystackAction ───────────────────────────────────────────────────
// Paystack checkout action (Story 4.1, AC1, AC5, AD-3, AD-13):
//   1. requireSession() FIRST (AD-3): studentId = session.user.id, email = session.user.email
//   2. Zod-validate { classId } (reuse reserveInputSchema)
//   3. reserveSeat(studentId, classId) — creates PENDING hold + returns paymentRef
//   4. on pending_payment → paystack.initializeTransaction (OUTSIDE the tx; no lock across HTTP)
//      → return { ok: true, redirect: authorizationUrl }
//   5. on confirmed (balance just became sufficient) → revalidatePath + return { ok: true, confirmed: true }
//   6. on !ok or init failure → return { ok: false, reason }
//
// Convention: NEVER throw for expected failures; NEXT_REDIRECT from requireSession() propagates.
//
// AD-14: enrollment.ts (reserveSeat) is the sole writer of Enrollment.status.
// AD-5: no write here — the actions are thin wrappers over domain functions.
// AD-13: paystack.initializeTransaction uses native fetch (no axios/SDK).

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-guards";
import { reserveSeat } from "@/lib/enrollment";
import { initializeTransaction } from "@/lib/paystack";
import { reserveInputSchema, type ReserveFailureReason } from "@/lib/reserve-schema";

// ---------------------------------------------------------------------------
// reserveSeatAction — balance path (Story 3.4; updated Story 4.1 for new outcome type)
// ---------------------------------------------------------------------------

export type ReserveSeatActionResult =
  | { ok: true; outcome: "confirmed"; enrollmentId: string }
  | { ok: false; reason: ReserveFailureReason };

export async function reserveSeatAction(
  input: unknown,
): Promise<ReserveSeatActionResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ─────────────────────────────
  // Called FIRST — no parse, no reserve, no read.
  // requireSession() calls redirect() for unauthenticated users (NEXT_REDIRECT) —
  // it must NOT be wrapped in a try/catch that would swallow the redirect.
  const session = await requireSession();
  const studentId = session.user.id; // NEVER accept a client-supplied student id (AD-3)

  // ── Step 2: Validate input with Zod ────────────────────────────────────────
  const parsed = reserveInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "not_available" };
  }

  const { classId } = parsed.data;

  // ── Step 3: Domain call ─────────────────────────────────────────────────────
  const result = await reserveSeat(studentId, classId);

  // ── Step 4: Map result ─────────────────────────────────────────────────────
  if (result.ok && result.outcome === "confirmed") {
    // Success: balance was sufficient — CONFIRMED enrollment + BOOKING_CHARGE.
    // Revalidate so the CONFIRMED state + updated wallet ledger render on refresh.
    revalidatePath(`/portal/classes/${classId}`);
    revalidatePath("/portal/wallet");
    return { ok: true, outcome: "confirmed", enrollmentId: result.enrollmentId };
  }

  if (result.ok && result.outcome === "pending_payment") {
    // Edge case: balance dropped between page render and click. reserveSeat created
    // a PENDING hold (15-min expiry; will lazily cancel per AC2). Return an error
    // toast — the student should use the "Pay online" button instead.
    // The PENDING hold is harmless: it expires and frees the seat automatically.
    return { ok: false, reason: "error" };
  }

  // ── Step 5: Pass through failure reasons ────────────────────────────────────
  // All failure reasons from reserveSeat are valid ReserveFailureReason values.
  return { ok: false, reason: result.reason as ReserveFailureReason };
}

// ---------------------------------------------------------------------------
// payWithPaystackAction — Paystack checkout path (Story 4.1, AC1, AC5, AD-3)
// ---------------------------------------------------------------------------

export type PayWithPaystackResult =
  | { ok: true; redirect: string }
  | { ok: true; confirmed: true; enrollmentId: string }
  | { ok: false; reason: ReserveFailureReason };

export async function payWithPaystackAction(
  input: unknown,
): Promise<PayWithPaystackResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ─────────────────────────────
  // requireSession() FIRST — before any parse, read, or domain call (AD-3).
  // email comes from the session (never client-supplied; used for Paystack init).
  const session = await requireSession();
  const studentId = session.user.id;
  const email = session.user.email;

  // ── Step 2: Validate input with Zod ────────────────────────────────────────
  const parsed = reserveInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "not_available" };
  }

  const { classId } = parsed.data;

  // ── Step 3: Domain call — creates PENDING hold or CONFIRMED seat ─────────
  const result = await reserveSeat(studentId, classId);

  // ── Step 4: Handle pending_payment → Paystack init (OUTSIDE the tx) ───────
  if (result.ok && result.outcome === "pending_payment") {
    // The PENDING enrollment + paymentRef are already committed to the DB.
    // NOW call Paystack init outside the transaction (no lock held across HTTP).
    // The 4.2 webhook joins Payment.reference → Enrollment.paymentRef.
    const callbackUrl = `${process.env.APP_URL}/portal/classes/${classId}`;
    const initResult = await initializeTransaction({
      email: email ?? "",
      amountCents: result.amountCents,
      reference: result.paymentRef,
      callbackUrl,
    });

    if (initResult.ok) {
      return { ok: true, redirect: initResult.authorizationUrl };
    }

    // Paystack init failed after the PENDING hold was committed. The hold will
    // lazily expire (AC2 — pendingExpiresAt = now+15min) and free the seat.
    // Return a generic error toast; the student can retry.
    console.error("[payWithPaystackAction] Paystack init failed after PENDING commit:", {
      classId,
      paymentRef: result.paymentRef,
      error: initResult.error,
    });
    return { ok: false, reason: "error" };
  }

  // ── Step 5: Handle confirmed (balance became sufficient since page render) ─
  if (result.ok && result.outcome === "confirmed") {
    // The balance was sufficient — seat reserved via balance, BOOKING_CHARGE written.
    // Revalidate so the CONFIRMED state renders on router.refresh().
    revalidatePath(`/portal/classes/${classId}`);
    revalidatePath("/portal/wallet");
    return { ok: true, confirmed: true, enrollmentId: result.enrollmentId };
  }

  // ── Step 6: Pass through failure reasons ────────────────────────────────────
  return { ok: false, reason: result.reason as ReserveFailureReason };
}
