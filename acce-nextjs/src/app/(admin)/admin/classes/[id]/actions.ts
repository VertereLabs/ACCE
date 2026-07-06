"use server";

// Server action: markAttendanceAction — Story 6.2 (Task 3, AC1, AC4, AD-3/14).
// Marks a CONFIRMED enrollment ATTENDED or NO_SHOW.
//
// Guard / validation / write order (AD-3 mandate, mirrors creditWalletAction 3.5):
//   1. requireAdmin()                          — TRUSTED entry guard (before any parse or write)
//   2. markAttendanceInputSchema.safeParse     — validate input (Zod; outcome enum pins AC3 guard)
//   3. markAttendance(enrollmentId, outcome)   — sole status writer (AD-14, plain atomic updateMany)
//   4. revalidatePath                          — roster cache invalidated so island's router.refresh()
//                                                fetches updated Badge
//
// Result shape: discriminated union — { ok:true, status } | { ok:false, reason }
// Convention: NEVER throw for expected failures (Consistency Conventions).
// requireAdmin()'s NEXT_REDIRECT propagates naturally — do NOT wrap it in a swallowing try/catch.
//
// AD-14: markAttendance lives in enrollment.ts (sole writer). This action is the thin
// entry layer — validate + call domain fn + revalidate. No Prisma write here.
//
// AD-4 note: NO Serializable/FOR UPDATE/retry needed. Attendance is not seat-affecting.
// Do NOT cargo-cult reserveSeat's envelope — same "no Serializable" precedent as creditWalletAction.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import { markAttendance } from "@/lib/enrollment";
import {
  markAttendanceInputSchema,
  type MarkAttendanceFailureReason,
} from "@/lib/attendance-schema";

export type MarkAttendanceActionResult =
  | { ok: true; status: "ATTENDED" | "NO_SHOW" }
  | { ok: false; reason: MarkAttendanceFailureReason };

export async function markAttendanceAction(
  input: unknown
): Promise<MarkAttendanceActionResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ──────────────────────────
  // Called FIRST — no admin, no parse, no write.
  // requireAdmin() calls redirect() for non-admins (NEXT_REDIRECT) — propagates naturally.
  await requireAdmin();

  // ── Step 2: Validate input with Zod ────────────────────────────────────
  // outcome z.enum(["ATTENDED","NO_SHOW"]) is the AC3 guard — only the two attendance
  // values pass; the action cannot be coerced to write any other EnrollmentStatus.
  const parsed = markAttendanceInputSchema.safeParse(input);
  if (!parsed.success) {
    // Bad/missing enrollmentId or invalid outcome → treat as not found (generic rejection).
    return { ok: false, reason: "not_found" };
  }

  const { enrollmentId, classId, outcome } = parsed.data;

  // ── Step 3: Domain transition (AD-14 sole writer) ──────────────────────
  const result = await markAttendance(enrollmentId, outcome);

  if (result.ok) {
    // ── Step 4: Revalidate the roster RSC cache ─────────────────────────
    // /admin/classes/[id] is the load-bearing revalidate — invalidates the roster
    // so router.refresh() in the island fetches the fresh server render with the
    // updated Badge. /admin/classes is the index (attendance doesn't change occupancy,
    // but revalidating keeps the index consistent per 6.1 parity).
    revalidatePath(`/admin/classes/${classId}`);
    revalidatePath("/admin/classes");

    return { ok: true, status: result.status };
  }

  // Pass through the domain-layer reason unchanged.
  return { ok: false, reason: result.reason };
}
