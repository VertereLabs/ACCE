/**
 * Story 3.4 AC5 + Story 4.1 AC6 — Unit tests for the pure reserve-seat schema
 * and message mapper.
 *
 * Imports ONLY src/lib/reserve-schema.ts (a pure module — no db/Prisma/DATABASE_URL
 * dependency) so this suite runs safely in the jsdom environment without any live DB.
 *
 * Mirrors the pattern of class-form-schema.test.ts / class-occupancy.test.ts.
 *
 * Story 4.1 update:
 *   - "insufficient_balance" removed from ReserveFailureReason and RESERVE_ERROR_MESSAGES.
 *     A balance shortfall now creates a PENDING hold (Paystack path) rather than an error.
 *   - PAYSTACK_REDIRECT_MESSAGE added and tested.
 *   - Reason count updated from 5 to 4.
 *
 * Coverage:
 *   - reserveInputSchema: valid input, invalid classId (empty, missing, non-string)
 *   - RESERVE_SUCCESS_MESSAGE: present and non-empty
 *   - PAYSTACK_REDIRECT_MESSAGE: present and non-empty (4.1)
 *   - RESERVE_ERROR_MESSAGES: all four reason keys covered (no insufficient_balance)
 *   - getReserveErrorMessage: returns correct message for each reason, and the
 *     fallback "error" message for an unknown reason string
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - reserveSeat() — imports db, needs real Postgres + Serializable lock + 40001
 *   - reserveSeatAction() / payWithPaystackAction() — import requireSession + db
 *   These are the CI ephemeral-Postgres concurrency integration tests (deferred, AD-4).
 */

import { describe, expect, it } from "vitest";
import {
  reserveInputSchema,
  RESERVE_SUCCESS_MESSAGE,
  PAYSTACK_REDIRECT_MESSAGE,
  RESERVE_ERROR_MESSAGES,
  getReserveErrorMessage,
  type ReserveFailureReason,
} from "../../src/lib/reserve-schema";

// ---------------------------------------------------------------------------
// reserveInputSchema — valid input
// ---------------------------------------------------------------------------

describe("reserveInputSchema — valid input", () => {
  it("accepts a non-empty classId string", () => {
    const r = reserveInputSchema.safeParse({ classId: "abc123" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.classId).toBe("abc123");
  });

  it("accepts a cuid-shaped classId", () => {
    const r = reserveInputSchema.safeParse({ classId: "clxyzabc0001234defgh5678" });
    expect(r.success).toBe(true);
  });

  it("accepts a seed-deterministic classId like 'seed-class-acc-1'", () => {
    const r = reserveInputSchema.safeParse({ classId: "seed-class-acc-1" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.classId).toBe("seed-class-acc-1");
  });

  it("accepts a classId with spaces and special characters (validated only for non-empty)", () => {
    // Schema validates non-empty; DB lookup will simply not find a match.
    const r = reserveInputSchema.safeParse({ classId: "class with spaces" });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// reserveInputSchema — invalid input
// ---------------------------------------------------------------------------

describe("reserveInputSchema — invalid input", () => {
  it("rejects an empty classId string", () => {
    const r = reserveInputSchema.safeParse({ classId: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a missing classId (undefined)", () => {
    const r = reserveInputSchema.safeParse({});
    expect(r.success).toBe(false);
  });

  it("rejects a null classId", () => {
    const r = reserveInputSchema.safeParse({ classId: null });
    expect(r.success).toBe(false);
  });

  it("rejects a numeric classId", () => {
    const r = reserveInputSchema.safeParse({ classId: 42 });
    expect(r.success).toBe(false);
  });

  it("rejects an entirely missing input object", () => {
    const r = reserveInputSchema.safeParse(undefined);
    expect(r.success).toBe(false);
  });

  it("rejects an input with additional properties but empty classId", () => {
    const r = reserveInputSchema.safeParse({ classId: "", extra: "value" });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RESERVE_SUCCESS_MESSAGE
// ---------------------------------------------------------------------------

describe("RESERVE_SUCCESS_MESSAGE", () => {
  it("is a non-empty string", () => {
    expect(typeof RESERVE_SUCCESS_MESSAGE).toBe("string");
    expect(RESERVE_SUCCESS_MESSAGE.length).toBeGreaterThan(0);
  });

  it("communicates enrollment and unlocked details (UX-DR5)", () => {
    // Must convey that the student is enrolled and details are now accessible.
    expect(RESERVE_SUCCESS_MESSAGE.toLowerCase()).toContain("enroll");
  });
});

// ---------------------------------------------------------------------------
// PAYSTACK_REDIRECT_MESSAGE — Story 4.1 (UX-DR6: label text carries state)
// ---------------------------------------------------------------------------

describe("PAYSTACK_REDIRECT_MESSAGE", () => {
  it("is a non-empty string", () => {
    expect(typeof PAYSTACK_REDIRECT_MESSAGE).toBe("string");
    expect(PAYSTACK_REDIRECT_MESSAGE.length).toBeGreaterThan(0);
  });

  it("communicates the redirect action to the user (UX-DR6)", () => {
    expect(PAYSTACK_REDIRECT_MESSAGE.toLowerCase()).toMatch(/redirect|paystack/i);
  });
});

// ---------------------------------------------------------------------------
// RESERVE_ERROR_MESSAGES — all four reasons covered (insufficient_balance removed in 4.1)
// ---------------------------------------------------------------------------

describe("RESERVE_ERROR_MESSAGES", () => {
  const reasons: ReserveFailureReason[] = [
    "class_full",
    "already_enrolled",
    "not_available",
    "error",
  ];

  it("contains exactly the four expected reason keys (no insufficient_balance — removed in 4.1)", () => {
    const keys = Object.keys(RESERVE_ERROR_MESSAGES).sort();
    expect(keys).toEqual([...reasons].sort());
  });

  it("does NOT contain insufficient_balance (Story 4.1: balance shortfall is now the Paystack path)", () => {
    expect("insufficient_balance" in RESERVE_ERROR_MESSAGES).toBe(false);
  });

  for (const reason of reasons) {
    it(`has a non-empty message for reason "${reason}"`, () => {
      const msg = RESERVE_ERROR_MESSAGES[reason];
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    });
  }

  it("class_full message references class being full", () => {
    expect(RESERVE_ERROR_MESSAGES.class_full.toLowerCase()).toMatch(/full|filled/);
  });

  it("already_enrolled message communicates existing enrollment", () => {
    expect(RESERVE_ERROR_MESSAGES.already_enrolled.toLowerCase()).toContain("enroll");
  });

  it("not_available message communicates unavailability", () => {
    expect(RESERVE_ERROR_MESSAGES.not_available.toLowerCase()).toMatch(/longer|available/);
  });

  it("error message is a generic retry prompt", () => {
    expect(RESERVE_ERROR_MESSAGES.error.toLowerCase()).toMatch(/wrong|again|retry/);
  });
});

// ---------------------------------------------------------------------------
// getReserveErrorMessage — maps reason → message string
// ---------------------------------------------------------------------------

describe("getReserveErrorMessage", () => {
  it("returns the class_full message for 'class_full'", () => {
    expect(getReserveErrorMessage("class_full")).toBe(
      RESERVE_ERROR_MESSAGES.class_full,
    );
  });

  it("returns the already_enrolled message for 'already_enrolled'", () => {
    expect(getReserveErrorMessage("already_enrolled")).toBe(
      RESERVE_ERROR_MESSAGES.already_enrolled,
    );
  });

  it("returns the not_available message for 'not_available'", () => {
    expect(getReserveErrorMessage("not_available")).toBe(
      RESERVE_ERROR_MESSAGES.not_available,
    );
  });

  it("returns the error message for 'error'", () => {
    expect(getReserveErrorMessage("error")).toBe(RESERVE_ERROR_MESSAGES.error);
  });

  it("falls back to the generic error message for an unknown reason", () => {
    expect(getReserveErrorMessage("unknown_reason_xyz")).toBe(
      RESERVE_ERROR_MESSAGES.error,
    );
  });

  it("falls back to the generic error message for an empty string reason", () => {
    expect(getReserveErrorMessage("")).toBe(RESERVE_ERROR_MESSAGES.error);
  });
});
