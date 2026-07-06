// cancellation.ts — Story 5.1 (AC2, AC5), consumed read-only here and
// mutatingly by Story 5.2's locked cancel mutation.
//
// Pure, db-free module: type-only imports only, so vitest/jsdom loads it
// without DATABASE_URL or a live DB. Follows the pattern of class-occupancy.ts
// and wallet-math.ts (pure helpers defined before their consuming stories).
//
// AD-11 — Cancellation tiers (single source, pinned comparators):
//   h ≥ 48 → 100%   (full refund, >2 days' notice)
//   24 ≤ h < 48 → 70%   (partial refund, 1-2 days' notice)
//   h < 24 → 0%    (no refund, < 1 day notice or after start)
//
// Note: a per-variant tier table (e.g. different tiers per class type) may
// replace CANCELLATION_TIERS in a later story per AD-11 ("group variant;
// per-variant table swaps in later"). For now the single constant is canonical.
//
// AD-9 — Money is integer cents (ZAR).
//   refundCents = Math.round(priceCents * refundPct / 100)  (integer; no floats)
//   feeCents    = priceCents − refundCents                   (single decomposition)
//   Never compute fee independently — always derive from the decomposition.

// ---------------------------------------------------------------------------
// Tier constant
// ---------------------------------------------------------------------------

export interface CancellationTier {
  /** Minimum hours from now to start for this tier to apply (inclusive). */
  minHours: number;
  /** Refund percentage (0, 70, or 100). */
  refundPct: number;
}

/**
 * Single-source cancellation tier table (AD-11 pinned comparators).
 *
 * Ordered from highest-refund (most notice) to lowest (least notice).
 * `refundTierForHours` walks this array in order, so the FIRST matching
 * tier wins. The final catch-all entry has `minHours: 0` (h < 24 → 0%).
 *
 * Boundaries:
 *   h ≥ 48 → 100%
 *   24 ≤ h < 48 → 70%
 *   h < 24 (incl. 0 and negative) → 0%
 */
export const CANCELLATION_TIERS: readonly CancellationTier[] = [
  { minHours: 48, refundPct: 100 },
  { minHours: 24, refundPct: 70 },
  { minHours: 0, refundPct: 0 },
] as const;

// ---------------------------------------------------------------------------
// hoursUntilStart
// ---------------------------------------------------------------------------

/**
 * Compute fractional hours between now and the session start.
 *
 * Uses epoch-ms difference (timezone-independent) — consistent with the
 * timezone-deferral convention across Epics 2–5 (no pinned tz in display,
 * and the maths side uses getTime() to stay tz-safe regardless of locale).
 *
 * May return a negative number for classes that have already started.
 *
 * @param start  - the session start DateTime (from DB / groupSession.start)
 * @param now    - the request instant (compute ONCE per request and pass in)
 */
export function hoursUntilStart(start: Date, now: Date): number {
  return (start.getTime() - now.getTime()) / 3_600_000;
}

// ---------------------------------------------------------------------------
// refundTierForHours
// ---------------------------------------------------------------------------

/**
 * Look up the correct cancellation tier for the given hours-until-start.
 *
 * Applies the AD-11 pinned comparators exactly:
 *   h ≥ 48 → 100%
 *   24 ≤ h < 48 → 70%
 *   h < 24 (incl. 0 and negative) → 0%
 *
 * Guard: negative/zero hours → 0% (past the cancellation deadline).
 *
 * @param hours - fractional hours until session start (may be negative)
 * @returns     - the matching tier object from CANCELLATION_TIERS
 */
export function refundTierForHours(hours: number): CancellationTier {
  // Walk tiers from highest minHours downward; first match wins.
  for (const tier of CANCELLATION_TIERS) {
    if (hours >= tier.minHours) {
      return tier;
    }
  }
  // Fallback — should never be reached since CANCELLATION_TIERS includes
  // a minHours:0 catch-all, but guards against an empty/modified array.
  return CANCELLATION_TIERS[CANCELLATION_TIERS.length - 1];
}

// ---------------------------------------------------------------------------
// computeRefund
// ---------------------------------------------------------------------------

export interface RefundResult {
  /** Refund percentage applied (0, 70, or 100). */
  refundPct: number;
  /** Integer cents refunded to the student wallet (AD-9). */
  refundCents: number;
  /** Integer cents retained as a cancellation fee (AD-9). Always = priceCents − refundCents. */
  feeCents: number;
}

/**
 * Compute the refund and fee breakdown for a cancellation at the given
 * hours-until-start (AD-11 single decomposition).
 *
 * Money rules (AD-9):
 *   refundCents = Math.round(priceCents * refundPct / 100)   (integer cents)
 *   feeCents    = priceCents − refundCents                    (single decomp)
 *   Invariant:  refundCents + feeCents === priceCents
 *
 * Never compute fee independently — always derive from the subtraction above.
 * This guarantees the refund/fee pair sums exactly to price regardless of
 * rounding, eliminating the rounding-drift hazard (lessons-learned money rule).
 *
 * @param priceCents - the enrollment's immutable priceCents snapshot (AD-16)
 * @param hours      - fractional hours until session start
 */
export function computeRefund(
  priceCents: number,
  hours: number,
): RefundResult {
  const { refundPct } = refundTierForHours(hours);
  const refundCents = Math.round((priceCents * refundPct) / 100);
  const feeCents = priceCents - refundCents; // single decomposition (AD-11)
  return { refundPct, refundCents, feeCents };
}
