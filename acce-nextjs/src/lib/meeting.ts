// meeting.ts — AD-13 MeetingProvider interface.
//
// Exposes a MeetingProvider interface with a ManualProvider for 1a (surfaces the
// manually-entered meetingUrl / location as-is). A GoogleMeetProvider that auto-generates
// a Meet link is deferred behind this same interface — no call-site change required when
// that provider is wired in later.
//
// See ARCHITECTURE-SPINE.md#AD-13 and Deferred "Auto Meet generation".

// ── Type exports ─────────────────────────────────────────────────────────────

export type SessionMode = "ONLINE" | "IN_PERSON";

/**
 * Discriminated union of join details per session mode.
 * ONLINE: url is the manually-entered meetingUrl (may be null if not yet set).
 * IN_PERSON: location is the manually-entered location string (may be null).
 */
export type JoinDetail =
  | { mode: "ONLINE"; url: string | null }
  | { mode: "IN_PERSON"; location: string | null };

// ── Interface ─────────────────────────────────────────────────────────────────

export interface MeetingProvider {
  /**
   * Return the join detail for the given session.
   * Accepts the minimal shape the email / portal needs; providers may enrich it.
   */
  getJoinDetail(session: {
    mode: SessionMode;
    meetingUrl: string | null;
    location: string | null;
  }): JoinDetail;
}

// ── ManualProvider (1a) ───────────────────────────────────────────────────────

/**
 * ManualProvider — returns the admin-entered join detail with no link generation.
 *
 * ONLINE  → { mode: "ONLINE", url: session.meetingUrl }
 * IN_PERSON → { mode: "IN_PERSON", location: session.location }
 *
 * A future GoogleMeetProvider slots in behind this same MeetingProvider interface
 * with no call-site change (AD-13 / Deferred "Auto Meet generation").
 */
export class ManualProvider implements MeetingProvider {
  getJoinDetail(session: {
    mode: SessionMode;
    meetingUrl: string | null;
    location: string | null;
  }): JoinDetail {
    if (session.mode === "ONLINE") {
      return { mode: "ONLINE", url: session.meetingUrl };
    }
    return { mode: "IN_PERSON", location: session.location };
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

/**
 * The single call-site handle for meeting join details.
 * Swap to a GoogleMeetProvider here when auto Meet-link generation is ready
 * (AD-13 — no call-site change at consumers).
 */
export const meetingProvider: MeetingProvider = new ManualProvider();
