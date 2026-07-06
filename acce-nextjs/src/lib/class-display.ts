// class-display.ts — Story 2.2 (AC1, AC5), Story 3.2 (formatSeatsLeft).
// Pure, db-free display-formatting helpers for the admin classes UI and student browse.
//
// AD-9 rule: money is stored as integer cents (ZAR); format to Rand ONLY at
// the UI edge. Never compute or store a float. This is the only place in the
// codebase that converts priceCents → a human-readable Rand string.
//
// formatZar uses an explicit "R" prefix + toFixed(2) rather than toLocaleString
// to guarantee a stable, locale-independent string in both server and test
// (jsdom) environments. The canonical format is "R290.00" (R + 2 decimal places).
//
// formatSeatsLeft formats a pre-computed seatsLeft integer (from computeSeatsLeft)
// into a human-readable badge label. It NEVER re-derives the seat count — that is
// the sole responsibility of class-occupancy.ts (AD-5 single source).

/**
 * Format integer cents as a Rand string at the UI edge (AD-9).
 *
 * Examples:
 *   formatZar(29000) → "R290.00"
 *   formatZar(0)     → "R0.00"
 *   formatZar(29050) → "R290.50"
 *
 * Input MUST be integer cents; never pass a float.
 */
export function formatZar(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}

/**
 * Human-readable label for the GroupSession `mode` enum value.
 *
 *   "ONLINE"    → "Online"
 *   "IN_PERSON" → "In-person"
 */
export function formatMode(mode: "ONLINE" | "IN_PERSON"): string {
  return mode === "ONLINE" ? "Online" : "In-person";
}

/**
 * Human-readable label for the GroupSession `status` enum value.
 *
 *   "SCHEDULED" → "Scheduled"
 *   "CANCELLED" → "Cancelled"
 *   "COMPLETED" → "Completed"
 */
export function formatStatus(status: "SCHEDULED" | "CANCELLED" | "COMPLETED"): string {
  switch (status) {
    case "SCHEDULED":
      return "Scheduled";
    case "CANCELLED":
      return "Cancelled";
    case "COMPLETED":
      return "Completed";
  }
}

/**
 * Human-readable badge label for the pre-computed seats-left integer (AC1, AC2, UX-DR3).
 *
 * This function ONLY formats the label — it does NOT compute availability.
 * The integer is produced by `computeSeatsLeft` in `class-occupancy.ts` (AD-5 single source).
 *
 * Examples:
 *   formatSeatsLeft(0) → "Class full"
 *   formatSeatsLeft(1) → "1 seat left"
 *   formatSeatsLeft(2) → "2 seats left"
 *   formatSeatsLeft(6) → "6 seats left"
 *
 * Input MUST be a non-negative integer (the output of computeSeatsLeft is always ≥ 0).
 */
export function formatSeatsLeft(seatsLeft: number): string {
  if (seatsLeft === 0) return "Class full";
  if (seatsLeft === 1) return "1 seat left";
  return `${seatsLeft} seats left`;
}
