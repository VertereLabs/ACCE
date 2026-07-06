// enrollment-display.ts — Story 6.1 (Task 1, AC1, AC5).
// Pure, db-free display-formatting helpers for enrollment status UI.
//
// Mirrors class-display.ts in structure and testability contract.
// Import the EnrollmentStatus enum as TYPE-ONLY so vitest (jsdom) can load
// this file without DATABASE_URL or a live DB — same pattern as class-occupancy.ts.
//
// This module is the SINGLE source of:
//   - formatEnrollmentStatus: human-readable label for each EnrollmentStatus value
//   - enrollmentStatusBadgeVariant: shadcn Badge variant for each status
//
// Story 6.2 (mark attended/no-show) will reuse both exports when adding
// per-row action buttons.

import type { EnrollmentStatus } from "@prisma/client";

/**
 * Human-readable label for the EnrollmentStatus enum value (AC1, AC5).
 *
 * Mapping:
 *   CONFIRMED → "Paid"        (student has paid, seat is confirmed)
 *   PENDING   → "Pending"     (seat held, payment in-flight — readers never flip this)
 *   ATTENDED  → "Attended"    (post-class attendance mark)
 *   NO_SHOW   → "No-show"     (marked absent)
 *   CANCELLED → "Cancelled"   (filtered out of roster query, but label is exhaustive for type safety)
 *
 * CANCELLED rows are excluded by the roster query (`status: { not: "CANCELLED" }`),
 * but this switch must cover all enum values so TypeScript enforces exhaustiveness and
 * Story 6.2 can reuse the helper without gaps.
 *
 * @param status - the EnrollmentStatus value from Prisma
 * @returns human-readable string for display
 */
export function formatEnrollmentStatus(status: EnrollmentStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "ATTENDED":
      return "Attended";
    case "NO_SHOW":
      return "No-show";
    case "CANCELLED":
      return "Cancelled";
  }
}

/**
 * shadcn Badge variant for the EnrollmentStatus enum value (AC1, UX-DR2/DR6).
 *
 * Variants resolve to the navy+gold design-token system (light/dark mode per UX-DR2/DR6).
 * NO hex colours are hardcoded here — the token system handles palette.
 *
 * Mapping:
 *   CONFIRMED → "default"     (paid/positive — prominent)
 *   PENDING   → "secondary"   (in-progress — muted)
 *   ATTENDED  → "outline"     (post-class state — neutral)
 *   NO_SHOW   → "destructive" (absent — warning)
 *   CANCELLED → "outline"     (filtered out of roster, included for exhaustiveness)
 *
 * @param status - the EnrollmentStatus value from Prisma
 * @returns shadcn Badge variant string
 */
export function enrollmentStatusBadgeVariant(
  status: EnrollmentStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "ATTENDED":
      return "outline";
    case "NO_SHOW":
      return "destructive";
    case "CANCELLED":
      return "outline";
  }
}
