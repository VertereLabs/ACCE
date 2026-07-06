/**
 * Story 6.2 AC5 — Unit tests for the pure attendance schema and message mapper.
 *
 * Imports ONLY src/lib/attendance-schema.ts (a pure module — no db/Prisma/DATABASE_URL
 * dependency) so this suite runs safely in the jsdom environment without any live DB.
 *
 * Mirrors the pattern of cancel-schema.test.ts / reserve-schema.test.ts.
 *
 * Coverage:
 *   - markAttendanceInputSchema: valid inputs, invalid enrollmentId, invalid outcome
 *     (pins AC3 guarantee: only "ATTENDED" and "NO_SHOW" pass; e.g. "CONFIRMED",
 *     "CANCELLED", "" are all rejected — the action cannot write any other status)
 *   - MARK_ATTENDANCE_SUCCESS: returns correct outcome-specific message
 *   - MARK_ATTENDANCE_ERROR_MESSAGES: all three reason keys covered
 *   - getMarkAttendanceErrorMessage: correct per-reason + "error" fallback for unknown
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - markAttendance() — imports db, needs real Postgres
 *   - markAttendanceAction() — imports requireAdmin + db (server-only)
 *   These are CI ephemeral-Postgres concerns.
 */

import { describe, expect, it } from "vitest";
import {
  markAttendanceInputSchema,
  MARK_ATTENDANCE_SUCCESS,
  MARK_ATTENDANCE_ERROR_MESSAGES,
  getMarkAttendanceErrorMessage,
  type MarkAttendanceFailureReason,
} from "../../src/lib/attendance-schema";

// ---------------------------------------------------------------------------
// markAttendanceInputSchema — valid input
// ---------------------------------------------------------------------------

describe("markAttendanceInputSchema — valid input", () => {
  it("accepts a valid enrollmentId + ATTENDED outcome", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc123",
      classId: "cls456",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.enrollmentId).toBe("abc123");
    expect(r.data.classId).toBe("cls456");
    expect(r.data.outcome).toBe("ATTENDED");
  });

  it("accepts a valid enrollmentId + NO_SHOW outcome", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "clxyzabc0001234defgh5678",
      classId: "sess-001",
      outcome: "NO_SHOW",
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.outcome).toBe("NO_SHOW");
  });

  it("accepts uuid-shaped enrollmentId and classId", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "550e8400-e29b-41d4-a716-446655440000",
      classId: "660f9511-f30c-52e5-b827-557766551111",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// markAttendanceInputSchema — invalid outcome (AC3 guard)
// ---------------------------------------------------------------------------

describe("markAttendanceInputSchema — invalid outcome (AC3 guard: only ATTENDED|NO_SHOW pass)", () => {
  it("rejects outcome='CONFIRMED' (cannot be coerced to write CONFIRMED)", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
      outcome: "CONFIRMED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects outcome='CANCELLED'", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
      outcome: "CANCELLED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects outcome='PENDING'", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
      outcome: "PENDING",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an empty string outcome", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
      outcome: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a missing outcome field", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a numeric outcome", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "cls",
      outcome: 1,
    });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// markAttendanceInputSchema — invalid enrollmentId
// ---------------------------------------------------------------------------

describe("markAttendanceInputSchema — invalid enrollmentId", () => {
  it("rejects an empty enrollmentId string", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "",
      classId: "cls",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a missing enrollmentId", () => {
    const r = markAttendanceInputSchema.safeParse({
      classId: "cls",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a null enrollmentId", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: null,
      classId: "cls",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a numeric enrollmentId", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: 42,
      classId: "cls",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an entirely missing input object", () => {
    const r = markAttendanceInputSchema.safeParse(undefined);
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// markAttendanceInputSchema — invalid classId
// ---------------------------------------------------------------------------

describe("markAttendanceInputSchema — invalid classId", () => {
  it("rejects an empty classId string", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      classId: "",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a missing classId", () => {
    const r = markAttendanceInputSchema.safeParse({
      enrollmentId: "abc",
      outcome: "ATTENDED",
    });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// MARK_ATTENDANCE_SUCCESS — per-outcome success message
// ---------------------------------------------------------------------------

describe("MARK_ATTENDANCE_SUCCESS", () => {
  it("returns 'Marked as attended' for ATTENDED outcome", () => {
    const msg = MARK_ATTENDANCE_SUCCESS("ATTENDED");
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
    expect(msg.toLowerCase()).toMatch(/attended/);
  });

  it("returns 'Marked as no-show' for NO_SHOW outcome", () => {
    const msg = MARK_ATTENDANCE_SUCCESS("NO_SHOW");
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
    expect(msg.toLowerCase()).toMatch(/no.?show|no show/);
  });

  it("returns different messages for different outcomes", () => {
    expect(MARK_ATTENDANCE_SUCCESS("ATTENDED")).not.toBe(
      MARK_ATTENDANCE_SUCCESS("NO_SHOW"),
    );
  });
});

// ---------------------------------------------------------------------------
// MARK_ATTENDANCE_ERROR_MESSAGES — all three reasons covered
// ---------------------------------------------------------------------------

describe("MARK_ATTENDANCE_ERROR_MESSAGES", () => {
  const reasons: MarkAttendanceFailureReason[] = [
    "not_found",
    "not_markable",
    "error",
  ];

  it("contains exactly the three expected reason keys", () => {
    const keys = Object.keys(MARK_ATTENDANCE_ERROR_MESSAGES).sort();
    expect(keys).toEqual([...reasons].sort());
  });

  for (const reason of reasons) {
    it(`has a non-empty message for reason "${reason}"`, () => {
      const msg = MARK_ATTENDANCE_ERROR_MESSAGES[reason];
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    });
  }

  it("not_found message communicates missing enrollment", () => {
    expect(MARK_ATTENDANCE_ERROR_MESSAGES.not_found.toLowerCase()).toMatch(
      /find|enrollment|couldn/,
    );
  });

  it("not_markable message communicates enrollment is not markable", () => {
    expect(MARK_ATTENDANCE_ERROR_MESSAGES.not_markable.toLowerCase()).toMatch(
      /longer|mark|no longer/,
    );
  });

  it("error message is a generic retry prompt", () => {
    expect(MARK_ATTENDANCE_ERROR_MESSAGES.error.toLowerCase()).toMatch(
      /wrong|again|retry/,
    );
  });
});

// ---------------------------------------------------------------------------
// getMarkAttendanceErrorMessage — maps reason → message string
// ---------------------------------------------------------------------------

describe("getMarkAttendanceErrorMessage", () => {
  it("returns the not_found message for 'not_found'", () => {
    expect(getMarkAttendanceErrorMessage("not_found")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.not_found,
    );
  });

  it("returns the not_markable message for 'not_markable'", () => {
    expect(getMarkAttendanceErrorMessage("not_markable")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.not_markable,
    );
  });

  it("returns the error message for 'error'", () => {
    expect(getMarkAttendanceErrorMessage("error")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.error,
    );
  });

  it("falls back to the generic error message for an unknown reason", () => {
    expect(getMarkAttendanceErrorMessage("unknown_reason_xyz")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.error,
    );
  });

  it("falls back to the generic error message for an empty string reason", () => {
    expect(getMarkAttendanceErrorMessage("")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.error,
    );
  });

  it("falls back to the generic error message for a numeric-like reason", () => {
    expect(getMarkAttendanceErrorMessage("42")).toBe(
      MARK_ATTENDANCE_ERROR_MESSAGES.error,
    );
  });
});
