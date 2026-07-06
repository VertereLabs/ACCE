/**
 * Story 5.2 AC6 — Unit tests for the pure cancel-enrollment schema
 * and message mapper.
 *
 * Imports ONLY src/lib/cancel-schema.ts (a pure module — no db/Prisma/DATABASE_URL
 * dependency) so this suite runs safely in the jsdom environment without any live DB.
 *
 * Mirrors the pattern of reserve-schema.test.ts / credit-schema.test.ts.
 *
 * Coverage:
 *   - cancelInputSchema: valid input, invalid enrollmentId (empty, missing, non-string)
 *   - CANCEL_SUCCESS_MESSAGE: present and non-empty
 *   - CANCEL_ERROR_MESSAGES: all three reason keys covered
 *   - getCancelErrorMessage: returns correct message for each reason, and the
 *     fallback "error" message for an unknown reason string
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - cancelEnrollment() — imports db, needs real Postgres + Serializable lock + 40001
 *   - cancelEnrollmentAction() — imports requireSession + db
 *   These are the CI ephemeral-Postgres integration tests (deferred, AD-4).
 */

import { describe, expect, it } from "vitest";
import {
  cancelInputSchema,
  CANCEL_SUCCESS_MESSAGE,
  CANCEL_ERROR_MESSAGES,
  getCancelErrorMessage,
  type CancelFailureReason,
} from "../../src/lib/cancel-schema";

// ---------------------------------------------------------------------------
// cancelInputSchema — valid input
// ---------------------------------------------------------------------------

describe("cancelInputSchema — valid input", () => {
  it("accepts a non-empty enrollmentId string", () => {
    const r = cancelInputSchema.safeParse({ enrollmentId: "abc123" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.enrollmentId).toBe("abc123");
  });

  it("accepts a cuid-shaped enrollmentId", () => {
    const r = cancelInputSchema.safeParse({
      enrollmentId: "clxyzabc0001234defgh5678",
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.enrollmentId).toBe("clxyzabc0001234defgh5678");
  });

  it("accepts a uuid-shaped enrollmentId", () => {
    const r = cancelInputSchema.safeParse({
      enrollmentId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(r.success).toBe(true);
  });

  it("accepts an enrollmentId with extra characters (schema validates non-empty only)", () => {
    const r = cancelInputSchema.safeParse({
      enrollmentId: "enr_2026_abc",
    });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// cancelInputSchema — invalid input
// ---------------------------------------------------------------------------

describe("cancelInputSchema — invalid input", () => {
  it("rejects an empty enrollmentId string", () => {
    const r = cancelInputSchema.safeParse({ enrollmentId: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a missing enrollmentId (undefined)", () => {
    const r = cancelInputSchema.safeParse({});
    expect(r.success).toBe(false);
  });

  it("rejects a null enrollmentId", () => {
    const r = cancelInputSchema.safeParse({ enrollmentId: null });
    expect(r.success).toBe(false);
  });

  it("rejects a numeric enrollmentId", () => {
    const r = cancelInputSchema.safeParse({ enrollmentId: 42 });
    expect(r.success).toBe(false);
  });

  it("rejects an entirely missing input object", () => {
    const r = cancelInputSchema.safeParse(undefined);
    expect(r.success).toBe(false);
  });

  it("rejects an input with additional properties but empty enrollmentId", () => {
    const r = cancelInputSchema.safeParse({ enrollmentId: "", extra: "value" });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CANCEL_SUCCESS_MESSAGE
// ---------------------------------------------------------------------------

describe("CANCEL_SUCCESS_MESSAGE", () => {
  it("is a non-empty string", () => {
    expect(typeof CANCEL_SUCCESS_MESSAGE).toBe("string");
    expect(CANCEL_SUCCESS_MESSAGE.length).toBeGreaterThan(0);
  });

  it("communicates cancellation and wallet refund (UX-DR5)", () => {
    expect(CANCEL_SUCCESS_MESSAGE.toLowerCase()).toMatch(/cancel|refund|wallet/);
  });
});

// ---------------------------------------------------------------------------
// CANCEL_ERROR_MESSAGES — all three reasons covered
// ---------------------------------------------------------------------------

describe("CANCEL_ERROR_MESSAGES", () => {
  const reasons: CancelFailureReason[] = [
    "not_found",
    "not_cancellable",
    "error",
  ];

  it("contains exactly the three expected reason keys", () => {
    const keys = Object.keys(CANCEL_ERROR_MESSAGES).sort();
    expect(keys).toEqual([...reasons].sort());
  });

  for (const reason of reasons) {
    it(`has a non-empty message for reason "${reason}"`, () => {
      const msg = CANCEL_ERROR_MESSAGES[reason];
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    });
  }

  it("not_found message communicates missing booking", () => {
    expect(CANCEL_ERROR_MESSAGES.not_found.toLowerCase()).toMatch(
      /find|booking|couldn/,
    );
  });

  it("not_cancellable message communicates cancellation not possible", () => {
    expect(CANCEL_ERROR_MESSAGES.not_cancellable.toLowerCase()).toMatch(
      /longer|cancel/,
    );
  });

  it("error message is a generic retry prompt", () => {
    expect(CANCEL_ERROR_MESSAGES.error.toLowerCase()).toMatch(/wrong|again|retry/);
  });
});

// ---------------------------------------------------------------------------
// getCancelErrorMessage — maps reason → message string
// ---------------------------------------------------------------------------

describe("getCancelErrorMessage", () => {
  it("returns the not_found message for 'not_found'", () => {
    expect(getCancelErrorMessage("not_found")).toBe(
      CANCEL_ERROR_MESSAGES.not_found,
    );
  });

  it("returns the not_cancellable message for 'not_cancellable'", () => {
    expect(getCancelErrorMessage("not_cancellable")).toBe(
      CANCEL_ERROR_MESSAGES.not_cancellable,
    );
  });

  it("returns the error message for 'error'", () => {
    expect(getCancelErrorMessage("error")).toBe(CANCEL_ERROR_MESSAGES.error);
  });

  it("falls back to the generic error message for an unknown reason", () => {
    expect(getCancelErrorMessage("unknown_reason_xyz")).toBe(
      CANCEL_ERROR_MESSAGES.error,
    );
  });

  it("falls back to the generic error message for an empty string reason", () => {
    expect(getCancelErrorMessage("")).toBe(CANCEL_ERROR_MESSAGES.error);
  });

  it("falls back to the generic error message for a numeric-like reason", () => {
    expect(getCancelErrorMessage("42")).toBe(CANCEL_ERROR_MESSAGES.error);
  });
});
