"use server";

// Server action: updateClassAction — Story 2.3 (Task 3, AC1-AC5).
// This is the FIRST interactive transaction + FOR UPDATE lock in the ACCE app.
//
// Guard / validation / lock / write order (AD-3 mandate + AD-16 lock):
//   1. requireAdmin()                   — TRUSTED entry guard (before any parse/read/lock/write)
//   2. editClassSchema.safeParse(input) — validate input (Zod, server-side)
//   3. subject existence re-check       — reject unknown/stale subjectId
//   4. priceCents = toCents(priceRand)  — AD-9 single conversion site
//   5. db.$transaction with FOR UPDATE lock (AD-16):
//      a. SELECT id, updatedAt FROM GroupSession WHERE id = ? FOR UPDATE
//      b. Optimistic-concurrency check: expectedUpdatedAt must match locked row's updatedAt
//      c. Capacity floor (AC2): count occupied enrollments INSIDE the lock; reject if below occupied
//      d. tx.groupSession.update(...)   — write to the SAME row (id unchanged)
//   6. Return { ok: true, id }
//
// Result shape: { ok: true, id } | { ok: false, fieldErrors?, message? }
// Convention: NEVER throw for expected failures; NEXT_REDIRECT from requireAdmin() propagates.
//
// AD-16 notes:
//   - The FOR UPDATE lock serialises with Epic 3/4's reserveSeat (same GroupSession row).
//   - Enrollment.priceCents is immutable (reserve-time snapshot) — this action NEVER touches it.
//   - @updatedAt bumps automatically on update → stale expectedUpdatedAt fails AC4 on next submit.

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import {
  editClassSchema,
  toCents,
} from "./edit-class-schema";
import {
  occupiedEnrollmentWhere,
  capacityBelowOccupied,
} from "@/lib/class-occupancy";

export type UpdateClassResult =
  | { ok: true; id: string }
  | {
      ok: false;
      fieldErrors?: Partial<Record<string, string[]>>;
      message?: string;
    };

export async function updateClassAction(
  input: unknown
): Promise<UpdateClassResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ──────────────────────────
  // Called FIRST — no admin, no parse, no read, no lock, no write.
  // requireAdmin() throws NEXT_REDIRECT for non-admins — do NOT wrap in try/catch.
  await requireAdmin();

  // ── Step 2: Validate input with Zod ────────────────────────────────────
  const parsed = editClassSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<
        Record<string, string[]>
      >,
    };
  }

  const data = parsed.data;
  const { id, expectedUpdatedAt } = data;

  // ── Step 3: Re-check subjectId exists (reject stale/forged IDs) ────────
  try {
    const subject = await db.subject.findUnique({ where: { id: data.subjectId } });
    if (!subject) {
      return {
        ok: false,
        fieldErrors: { subjectId: ["Subject not found"] },
      };
    }
  } catch {
    return {
      ok: false,
      message: "Database error checking subject. Please try again.",
    };
  }

  // ── Step 4: Compute priceCents (AD-9) ──────────────────────────────────
  const priceCents = toCents(data.priceRand);

  // ── Step 5: Interactive transaction with FOR UPDATE lock (AD-16) ────────
  try {
    const result = await db.$transaction(async (tx) => {
      // ── 5a: Lock the GroupSession row ─────────────────────────────────
      // Raw SQL — Prisma has no findUnique...FOR UPDATE.
      // Parameterised via tagged template (safe, no string concatenation).
      const rows = await tx.$queryRaw<
        { id: string; updatedAt: Date }[]
      >`SELECT id, "updatedAt" FROM "GroupSession" WHERE id = ${id} FOR UPDATE`;

      if (rows.length === 0) {
        return {
          ok: false as const,
          message: "This class no longer exists.",
        };
      }

      const lockedRow = rows[0];

      // ── 5b: Optimistic-concurrency check (AC4) ────────────────────────
      // Compare the locked row's updatedAt to the token the client submitted.
      // Use ISO string equality — consistent with how the form serialises it.
      if (lockedRow.updatedAt.toISOString() !== expectedUpdatedAt) {
        return {
          ok: false as const,
          message:
            "This class was changed by someone else — reload the page and try again.",
        };
      }

      // ── 5c: Capacity floor under the lock (AC2, AD-16) ───────────────
      // Count occupying enrollments INSIDE the lock so the count cannot race
      // a concurrent reserveSeat that is about to lock the same row.
      const now = new Date();
      const occupied = await tx.enrollment.count({
        where: {
          groupSessionId: id,
          ...occupiedEnrollmentWhere(now),
        },
      });

      if (capacityBelowOccupied(data.capacity, occupied)) {
        return {
          ok: false as const,
          fieldErrors: {
            capacity: [
              `Capacity cannot be below the ${occupied} seat${occupied === 1 ? "" : "s"} already taken`,
            ],
          },
        };
      }

      // ── 5d: Write (AC1, AC5) ─────────────────────────────────────────
      // Update the SAME row (id unchanged). @updatedAt bumps automatically.
      // Do NOT touch any Enrollment row — Enrollment.priceCents is immutable.
      const updated = await tx.groupSession.update({
        where: { id },
        data: {
          subjectId: data.subjectId,
          level: data.level,
          title: data.title,
          description: data.description || null,
          start: data.start,
          end: data.end,
          capacity: data.capacity,
          priceCents,
          mode: data.mode,
          // location: required for IN_PERSON, null otherwise
          location:
            data.mode === "IN_PERSON" && data.location
              ? data.location
              : null,
          // meetingUrl: set/replace when provided, null when cleared (AD-13)
          meetingUrl: data.meetingUrl || null,
          // status left untouched — cancel/complete is out of scope (Dev Notes scope boundary)
        },
      });

      return { ok: true as const, id: updated.id };
    });

    return result;
  } catch {
    return {
      ok: false,
      message: "Failed to save changes. Please try again.",
    };
  }
}
