/**
 * Story 3.5 AC2, AC5 — Unit tests for the pure credit-wallet schema and toCents helper.
 *
 * Imports ONLY the pure credit-schema module (no db/Prisma/DATABASE_URL dependency)
 * so this suite runs safely in the jsdom environment without any live DB.
 *
 * Mirrors the pattern of reserve-schema.test.ts / class-form-schema.test.ts.
 *
 * Coverage:
 *   - creditWalletSchema: valid amounts, invalid amounts (0, negative, empty, non-numeric)
 *   - studentId validation (required, non-empty)
 *   - toCents: rounding (500 → 50000, 10.5 → 1050, 10.555 → 1056)
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - creditWalletAction — imports requireAdmin + db + wallet.mutate; needs real Postgres
 *   - page components — import db; need real Postgres
 */

import { describe, expect, it } from "vitest";
import { creditWalletSchema, toCents } from "../../src/app/(admin)/admin/students/[id]/credit-schema";

// ---------------------------------------------------------------------------
// creditWalletSchema — valid input
// ---------------------------------------------------------------------------

describe("creditWalletSchema — valid input", () => {
  it("accepts a positive integer amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: 500 });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.amountRand).toBe(500);
    expect(r.data.studentId).toBe("user-abc123");
  });

  it("accepts a positive decimal amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: 10.5 });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.amountRand).toBe(10.5);
  });

  it("accepts a small positive amount (e.g. 0.01)", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: 0.01 });
    expect(r.success).toBe(true);
  });

  it("coerces a numeric string to a positive number", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: "250" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.amountRand).toBe(250);
  });

  it("accepts a cuid-shaped studentId", () => {
    const r = creditWalletSchema.safeParse({ studentId: "clxyzabc0001234defgh5678", amountRand: 100 });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// creditWalletSchema — invalid amounts (AC2)
// ---------------------------------------------------------------------------

describe("creditWalletSchema — invalid amounts", () => {
  it("rejects zero amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects a negative amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: -100 });
    expect(r.success).toBe(false);
  });

  it("rejects an empty string amount (coerces to 0, fails positive())", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-numeric string amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: "not-a-number" });
    expect(r.success).toBe(false);
  });

  it("rejects an undefined amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123" });
    expect(r.success).toBe(false);
  });

  it("rejects a null amount", () => {
    const r = creditWalletSchema.safeParse({ studentId: "user-abc123", amountRand: null });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// creditWalletSchema — invalid studentId
// ---------------------------------------------------------------------------

describe("creditWalletSchema — invalid studentId", () => {
  it("rejects an empty studentId", () => {
    const r = creditWalletSchema.safeParse({ studentId: "", amountRand: 100 });
    expect(r.success).toBe(false);
  });

  it("rejects a missing studentId", () => {
    const r = creditWalletSchema.safeParse({ amountRand: 100 });
    expect(r.success).toBe(false);
  });

  it("rejects a null studentId", () => {
    const r = creditWalletSchema.safeParse({ studentId: null, amountRand: 100 });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// toCents — Rand→cents rounding (AD-9)
// ---------------------------------------------------------------------------

describe("toCents — Rand to integer cents conversion", () => {
  it("converts 500 to 50000", () => {
    expect(toCents(500)).toBe(50000);
  });

  it("converts 10.5 to 1050", () => {
    expect(toCents(10.5)).toBe(1050);
  });

  it("converts 10.555 to 1056 (Math.round)", () => {
    expect(toCents(10.555)).toBe(1056);
  });

  it("converts 290 to 29000", () => {
    expect(toCents(290)).toBe(29000);
  });

  it("converts 0.01 to 1 (one cent)", () => {
    expect(toCents(0.01)).toBe(1);
  });

  it("converts 1 to 100", () => {
    expect(toCents(1)).toBe(100);
  });

  it("converts 10.554 to 1055 (rounds down)", () => {
    expect(toCents(10.554)).toBe(1055);
  });

  it("always returns an integer", () => {
    const result = toCents(12.345);
    expect(Number.isInteger(result)).toBe(true);
  });
});
