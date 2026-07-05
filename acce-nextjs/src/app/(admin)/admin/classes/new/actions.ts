"use server";

// Server action: createClassAction — Story 2.1 (Task 2).
// This is the FIRST server-side mutation in the ACCE app — it establishes the pattern.
//
// Guard / validation / write order (AD-3 mandate):
//   1. requireAdmin()          — TRUSTED entry guard (before any parse or write)
//   2. createClassSchema.safeParse — validate input (Zod, re-run server-side)
//   3. subject existence re-check — re-verify subjectId against DB
//   4. priceCents conversion   — Math.round(priceRand * 100)  (AD-9)
//   5. db.groupSession.create  — single write, no transaction (AD-16 scope is edits, Story 2.3)
//
// Result shape: discriminated union — { ok: true, id } | { ok: false, fieldErrors, message? }
// Convention: NEVER throw for expected validation failures (AC3 / Consistency Conventions).
// Unexpected errors (DB connectivity, etc.) are caught and returned as { ok: false }.

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { createClassSchema, toCents } from "./class-form-schema";

export type CreateClassResult =
  | { ok: true; id: string }
  | { ok: false; fieldErrors?: Partial<Record<string, string[]>>; message?: string };

export async function createClassAction(
  input: unknown
): Promise<CreateClassResult> {
  // ── Step 1: Trusted authorization guard (AD-3) ──────────────────────────
  // Called FIRST — no admin, no parse, no write.
  // requireAdmin() calls redirect() for non-admins (NEXT_REDIRECT) — propagates naturally.
  await requireAdmin();

  // ── Step 2: Validate input with Zod ────────────────────────────────────
  const parsed = createClassSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    };
  }

  const data = parsed.data;

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
    return { ok: false, message: "Database error checking subject. Please try again." };
  }

  // ── Step 4: Compute priceCents (AD-9) ──────────────────────────────────
  const priceCents = toCents(data.priceRand);

  // ── Step 5: Create the GroupSession ────────────────────────────────────
  // AD-5: Do NOT set any seat counter — live occupancy is derived from Enrollment.
  // AD-16: No transaction / FOR UPDATE — create has no concurrency invariant (that's Story 2.3).
  try {
    const session = await db.groupSession.create({
      data: {
        subjectId: data.subjectId,
        level: data.level,
        title: data.title,
        // Normalise empty description to undefined (Prisma writes null for undefined).
        description: data.description || undefined,
        start: data.start,
        end: data.end,
        capacity: data.capacity,
        priceCents,
        mode: data.mode,
        // Only set location for IN_PERSON classes; superRefine guarantees it is non-empty then.
        ...(data.mode === "IN_PERSON" && data.location ? { location: data.location } : {}),
        // Only set meetingUrl when a value is provided (AD-13: optional at create).
        ...(data.meetingUrl ? { meetingUrl: data.meetingUrl } : {}),
        status: "SCHEDULED",
      },
    });

    return { ok: true, id: session.id };
  } catch {
    return { ok: false, message: "Failed to create class. Please try again." };
  }
}
