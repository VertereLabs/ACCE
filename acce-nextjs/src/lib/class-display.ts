// class-display.ts — Story 2.2 (AC1, AC5).
// Pure, db-free display-formatting helpers for the admin classes UI.
//
// AD-9 rule: money is stored as integer cents (ZAR); format to Rand ONLY at
// the UI edge. Never compute or store a float. This is the only place in the
// codebase that converts priceCents → a human-readable Rand string.
//
// formatZar uses an explicit "R" prefix + toFixed(2) rather than toLocaleString
// to guarantee a stable, locale-independent string in both server and test
// (jsdom) environments. The canonical format is "R290.00" (R + 2 decimal places).

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
