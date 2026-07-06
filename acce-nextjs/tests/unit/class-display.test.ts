/**
 * Story 2.2 AC5 — Unit tests for the pure display-formatting helpers.
 * Story 3.2 AC6 — Extended with formatSeatsLeft boundary assertions.
 *
 * Imports ONLY src/lib/class-display.ts — a pure module with no db/Prisma
 * runtime dependency. Runs safely in jsdom without DATABASE_URL or a live DB.
 *
 * Tests:
 *   - formatZar: AD-9 cents→Rand conversion, exact string output, no float drift.
 *   - formatMode: enum → human-readable label.
 *   - formatStatus: enum → human-readable label.
 *   - formatSeatsLeft: 0 → "Class full", 1 → "1 seat left", ≥2 → "N seats left" (AC6, UX-DR3).
 */

import { describe, expect, it } from "vitest";
import { formatZar, formatMode, formatStatus, formatSeatsLeft } from "../../src/lib/class-display";

// ---------------------------------------------------------------------------
// formatZar (AD-9 — money is integer cents, format at UI edge only)
// ---------------------------------------------------------------------------

describe("formatZar", () => {
  it('formats 29000 cents as "R290.00"', () => {
    expect(formatZar(29000)).toBe("R290.00");
  });

  it('formats 0 cents as "R0.00"', () => {
    expect(formatZar(0)).toBe("R0.00");
  });

  it("round-trips integer cents with no float drift (29050 → R290.50)", () => {
    // 29050 in floating-point binary is exact (integer), so (29050/100).toFixed(2)
    // must be "290.50" with no drift.
    expect(formatZar(29050)).toBe("R290.50");
  });

  it('formats 100 cents as "R1.00"', () => {
    expect(formatZar(100)).toBe("R1.00");
  });

  it('formats 1 cent as "R0.01"', () => {
    expect(formatZar(1)).toBe("R0.01");
  });
});

// ---------------------------------------------------------------------------
// formatMode
// ---------------------------------------------------------------------------

describe("formatMode", () => {
  it('formats ONLINE as "Online"', () => {
    expect(formatMode("ONLINE")).toBe("Online");
  });

  it('formats IN_PERSON as "In-person"', () => {
    expect(formatMode("IN_PERSON")).toBe("In-person");
  });
});

// ---------------------------------------------------------------------------
// formatStatus
// ---------------------------------------------------------------------------

describe("formatStatus", () => {
  it('formats SCHEDULED as "Scheduled"', () => {
    expect(formatStatus("SCHEDULED")).toBe("Scheduled");
  });

  it('formats CANCELLED as "Cancelled"', () => {
    expect(formatStatus("CANCELLED")).toBe("Cancelled");
  });

  it('formats COMPLETED as "Completed"', () => {
    expect(formatStatus("COMPLETED")).toBe("Completed");
  });
});

// ---------------------------------------------------------------------------
// formatSeatsLeft (Story 3.2 — AC1, AC2, AC6, UX-DR3)
// ---------------------------------------------------------------------------

describe("formatSeatsLeft", () => {
  it('returns "Class full" when seatsLeft is 0 (AC2 — full class must not show a dead CTA)', () => {
    expect(formatSeatsLeft(0)).toBe("Class full");
  });

  it('returns "1 seat left" when seatsLeft is 1 (AC1, UX-DR3 — singular)', () => {
    expect(formatSeatsLeft(1)).toBe("1 seat left");
  });

  it('returns "2 seats left" when seatsLeft is 2 (AC6 — plural lower boundary)', () => {
    expect(formatSeatsLeft(2)).toBe("2 seats left");
  });

  it('returns "6 seats left" when seatsLeft is 6 (AC6 — typical seeded capacity)', () => {
    expect(formatSeatsLeft(6)).toBe("6 seats left");
  });
});
