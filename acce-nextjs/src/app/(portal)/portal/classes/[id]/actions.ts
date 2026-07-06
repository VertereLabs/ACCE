"use server";

// Server action: reserveSeatAction — Story 3.4 (Task 2, AC1, AC5, AD-3).
//
// Guard / validation / reserve order (AD-3 mandate):
//   1. requireSession()          — TRUSTED entry guard (FIRST — before any parse or read)
//      studentId = session.user.id (never accept a client-supplied student id)
//   2. reserveInputSchema.safeParse(input) — Zod-validate { classId: string.min(1) }
//   3. reserveSeat(studentId, classId)    — domain call (Serializable tx; AC1-AC3)
//   4. on ok:true → revalidatePath('/portal/classes/' + classId)
//                   revalidatePath('/portal/wallet')
//      so the CONFIRMED state + ledger reflect immediately after the client island
//      calls router.refresh() (AC4).
//   5. return the discriminated result to the client island.
//
// Result shape: discriminated union — { ok: true, enrollmentId } | { ok: false, reason }
// Convention: NEVER throw for expected failures; NEXT_REDIRECT from requireSession() propagates.
//
// AD-14: enrollment.ts (reserveSeat) is the sole writer of Enrollment.status.
// AD-5: no write here — the action is a thin wrapper over the domain function.

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-guards";
import { reserveSeat, type ReserveSeatResult } from "@/lib/enrollment";
import { reserveInputSchema } from "@/lib/reserve-schema";

export async function reserveSeatAction(input: unknown): Promise<ReserveSeatResult> {
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

  // ── Step 4: Revalidate paths on success ────────────────────────────────────
  // revalidatePath invalidates the Next.js router cache for these paths so the
  // server re-renders the CONFIRMED state + updated wallet ledger when the client
  // island calls router.refresh() (AC4).
  if (result.ok) {
    revalidatePath(`/portal/classes/${classId}`);
    revalidatePath("/portal/wallet");
  }

  // ── Step 5: Return discriminated result ─────────────────────────────────────
  return result;
}
