/**
 * Story 6.1 Task 4 (AC3, AC5) — Unit tests for the pure enrollment-display helpers.
 *
 * Imports ONLY src/lib/enrollment-display.ts — a pure module with no db/Prisma
 * runtime dependency (type-only import of EnrollmentStatus). Runs safely in
 * jsdom without DATABASE_URL or a live DB.
 *
 * Tests:
 *   - formatEnrollmentStatus: all 5 EnrollmentStatus values → exact label strings.
 *   - enrollmentStatusBadgeVariant: all 5 values → correct shadcn Badge variant.
 *
 * AC3 scope note: CANCELLED rows are filtered out of the roster query at the
 * page level (`status: { not: "CANCELLED" }`), but both label + variant mappings
 * cover CANCELLED for type-safety/exhaustiveness. This test pins that contract.
 */

import { describe, expect, it } from "vitest";
import {
  formatEnrollmentStatus,
  enrollmentStatusBadgeVariant,
} from "../../src/lib/enrollment-display";

// ---------------------------------------------------------------------------
// formatEnrollmentStatus (AC1, AC5)
// ---------------------------------------------------------------------------

describe("formatEnrollmentStatus", () => {
  it('maps CONFIRMED → "Paid" (student has paid, seat confirmed)', () => {
    expect(formatEnrollmentStatus("CONFIRMED")).toBe("Paid");
  });

  it('maps PENDING → "Pending" (seat held, payment in-flight)', () => {
    expect(formatEnrollmentStatus("PENDING")).toBe("Pending");
  });

  it('maps ATTENDED → "Attended" (post-class attendance mark)', () => {
    expect(formatEnrollmentStatus("ATTENDED")).toBe("Attended");
  });

  it('maps NO_SHOW → "No-show" (marked absent)', () => {
    expect(formatEnrollmentStatus("NO_SHOW")).toBe("No-show");
  });

  it('maps CANCELLED → "Cancelled" (exhaustive switch — filtered from roster query but must be labelled)', () => {
    expect(formatEnrollmentStatus("CANCELLED")).toBe("Cancelled");
  });
});

// ---------------------------------------------------------------------------
// enrollmentStatusBadgeVariant (AC1, UX-DR2/DR6)
// ---------------------------------------------------------------------------

describe("enrollmentStatusBadgeVariant", () => {
  it('maps CONFIRMED → "default" (paid/positive badge)', () => {
    expect(enrollmentStatusBadgeVariant("CONFIRMED")).toBe("default");
  });

  it('maps PENDING → "secondary" (in-progress/muted badge)', () => {
    expect(enrollmentStatusBadgeVariant("PENDING")).toBe("secondary");
  });

  it('maps ATTENDED → "outline" (post-class/neutral badge)', () => {
    expect(enrollmentStatusBadgeVariant("ATTENDED")).toBe("outline");
  });

  it('maps NO_SHOW → "destructive" (absent/warning badge)', () => {
    expect(enrollmentStatusBadgeVariant("NO_SHOW")).toBe("destructive");
  });

  it('maps CANCELLED → "outline" (exhaustive switch — filtered from roster query)', () => {
    expect(enrollmentStatusBadgeVariant("CANCELLED")).toBe("outline");
  });
});
