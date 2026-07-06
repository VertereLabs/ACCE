// Email send adapter — Story 1.2 (AD-13); extended Story 6.3 for seat-confirmation emails.
// Uses native `fetch` only — no resend SDK, no axios (NFR9 / lessons-learned supply-chain rule).
//
// Story 6.3 additions:
//   buildSeatConfirmationHtml(data) — pure, db-free; unit-testable under jsdom.
//   sendSeatConfirmationEmail(enrollmentId) — reads DB, builds HTML, sends via sendEmail.

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Low-level email sender via Resend REST API.
 * Dev ergonomics: if RESEND_API_KEY is unset, logs the email details to the console
 * and returns `ok: true` (so the dev flow is unblocked without a real API key).
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "ACCE Tutors <no-reply@accetutors.co.za>";

  // Dev fallback: log and return ok if no API key configured.
  if (!apiKey) {
    console.log(
      "[email] RESEND_API_KEY not set — email skipped (dev mode).\n" +
        `  To: ${to}\n  Subject: ${subject}`,
    );
    return { ok: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "(no body)");
      const error = `Resend returned ${response.status}: ${text}`;
      console.error("[email] send failed:", error);
      return { ok: false, error };
    }

    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[email] network error:", error);
    return { ok: false, error };
  }
}

/**
 * Sends the magic-link sign-in email for Better Auth.
 * Subject and branding consistent with ACCE Tutors identity.
 * Throws if the send fails in production (non-2xx) so Better Auth surfaces an error (AC5).
 */
export async function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  const subject = "Sign in to ACCE Tutors";
  const html = buildMagicLinkHtml(url);

  const result = await sendEmail({ to, subject, html });

  if (!result.ok) {
    // Surface to Better Auth which will propagate as an error response to the client (AC5).
    throw new Error(result.error);
  }
}

// ── HTML template ─────────────────────────────────────────────────────────────

function buildMagicLinkHtml(url: string): string {
  // Minimal branded email — navy + gold palette (ACCE rebrand).
  // Plain-text fallback included via the link text.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to ACCE Tutors</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation"
               style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1a2744;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#d4a91e;font-size:24px;font-weight:700;letter-spacing:0.5px;">
                ACCE Tutors
              </h1>
              <p style="margin:8px 0 0;color:#c8d0e0;font-size:13px;">
                Expert CA(SA) &amp; CTA Support
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;color:#1a2744;font-size:16px;">Hello,</p>
              <p style="margin:0 0 28px;color:#444;font-size:15px;line-height:1.6;">
                Click the button below to sign in to your ACCE Tutors portal.
                This link expires in <strong>15 minutes</strong> and can only be used once.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <a href="${escapeHtmlAttr(url)}"
                       style="display:inline-block;background:#1a2744;color:#d4a91e;
                              padding:14px 32px;border-radius:6px;font-size:15px;
                              font-weight:600;text-decoration:none;letter-spacing:0.3px;">
                      Sign in to ACCE Tutors
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;color:#666;font-size:13px;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
                <br />
                <a href="${escapeHtmlAttr(url)}" style="color:#1a2744;word-break:break-all;">
                  ${escapeHtml(url)}
                </a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f0f2f7;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#888;font-size:12px;">
                If you did not request this email, you can safely ignore it.
                <br />© ${new Date().getFullYear()} ACCE Tutors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── Story 6.3: Seat-confirmation email ─────────────────────────────────────────

import { db } from "@/lib/db";
import { formatZar } from "@/lib/class-display";
import { meetingProvider, type JoinDetail } from "@/lib/meeting";

/**
 * Data shape for buildSeatConfirmationHtml.
 * Plain types only (no Prisma types) so the function is pure and db-free (AC5).
 */
export type SeatConfirmationData = {
  studentName: string;
  classTitle: string;
  subjectName: string;
  startsAt: Date;
  join: JoinDetail;
  priceCents: number;
};

/**
 * Pure, db-free HTML builder for the seat-confirmation email (AC1, AC4, AC5).
 *
 * Mirrors the magic-link email skeleton: navy #1a2744 header + gold #d4a91e accent + footer.
 * All user-provided fields are HTML-escaped to prevent email HTML injection (AC4).
 * Date is formatted with toLocaleString("en-ZA") — no explicit timeZone pin, consistent
 * with the 2.2/2.3/3.1/3.2/3.3 timezone-deferral convention.
 */
export function buildSeatConfirmationHtml(data: SeatConfirmationData): string {
  const { studentName, classTitle, subjectName, startsAt, join, priceCents } = data;

  // Escape all user-authored text fields.
  const safeStudentName = escapeHtml(studentName);
  const safeClassTitle = escapeHtml(classTitle);
  const safeSubjectName = escapeHtml(subjectName);
  const safePrice = formatZar(priceCents);

  // Format date/time — no explicit timeZone pin (timezone-deferral convention).
  const formattedDate = startsAt.toLocaleString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Build the mode-gated join detail block (AC3, AC4).
  let joinBlock: string;
  if (join.mode === "ONLINE") {
    if (join.url) {
      const safeUrl = escapeHtmlAttr(join.url);
      const safeUrlText = escapeHtml(join.url);
      joinBlock = `
              <p style="margin:0 0 8px;color:#1a2744;font-size:14px;font-weight:600;">
                Online class — Join link:
              </p>
              <p style="margin:0 0 24px;">
                <a href="${safeUrl}"
                   style="color:#1a2744;font-size:14px;word-break:break-all;">
                  ${safeUrlText}
                </a>
              </p>`;
    } else {
      // Null meetingUrl fallback — graceful, never a broken empty href.
      joinBlock = `
              <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.6;">
                The joining link will be shared before the class.
              </p>`;
    }
  } else {
    // IN_PERSON
    const safeLocation = join.location ? escapeHtml(join.location) : "Location to be confirmed";
    joinBlock = `
              <p style="margin:0 0 8px;color:#1a2744;font-size:14px;font-weight:600;">
                In-person class — Location:
              </p>
              <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.6;">
                ${safeLocation}
              </p>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your seat is confirmed: ${safeClassTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation"
               style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1a2744;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#d4a91e;font-size:24px;font-weight:700;letter-spacing:0.5px;">
                ACCE Tutors
              </h1>
              <p style="margin:8px 0 0;color:#c8d0e0;font-size:13px;">
                Expert CA(SA) &amp; CTA Support
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;color:#1a2744;font-size:16px;font-weight:600;">
                Your seat is confirmed!
              </p>
              <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.6;">
                Hi ${safeStudentName}, your seat has been confirmed for the following class:
              </p>

              <!-- Class details -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background:#f8f9fc;border-radius:6px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0 0 4px;color:#1a2744;font-size:16px;font-weight:700;">
                      ${safeClassTitle}
                    </p>
                    <p style="margin:0;color:#666;font-size:14px;">
                      ${safeSubjectName}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0 0 4px;color:#1a2744;font-size:14px;font-weight:600;">
                      Date &amp; Time:
                    </p>
                    <p style="margin:0;color:#444;font-size:14px;">
                      ${formattedDate}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 16px;">
                    ${joinBlock}
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 0;">
                    <p style="margin:0 0 4px;color:#1a2744;font-size:14px;font-weight:600;">
                      Price paid:
                    </p>
                    <p style="margin:0;color:#444;font-size:14px;">
                      ${safePrice}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">
                If you have any questions, please contact us through the portal.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f0f2f7;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#888;font-size:12px;">
                &copy; ${new Date().getFullYear()} ACCE Tutors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Load the confirmed enrollment from the DB and send the seat-confirmation email (AC1, AC2, AC4).
 *
 * - Reads enrollment + student + session + subject in one findUnique round-trip (AD-2).
 * - Defensive AD-10 guard: returns { ok:false } for non-confirmed-family statuses.
 * - Never throws — all errors are caught, logged, and returned as { ok:false, error }.
 * - Dev fallback: if RESEND_API_KEY is unset, sendEmail logs and returns ok (AC5).
 *
 * @param enrollmentId - the confirmed enrollment's id.
 */
export async function sendSeatConfirmationEmail(
  enrollmentId: string,
): Promise<SendResult> {
  try {
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        status: true,
        priceCents: true,
        student: {
          select: { email: true, name: true },
        },
        session: {
          select: {
            title: true,
            start: true,
            mode: true,
            meetingUrl: true,
            location: true,
            subject: { select: { name: true } },
          },
        },
      },
    });

    if (!enrollment) {
      console.error(
        "[email] sendSeatConfirmationEmail: enrollment not found",
        { enrollmentId },
      );
      return { ok: false, error: "enrollment not found" };
    }

    // AD-10 defensive guard — never email join details for a non-confirmed seat (AC4).
    const confirmedFamily = new Set(["CONFIRMED", "ATTENDED", "NO_SHOW"]);
    if (!confirmedFamily.has(enrollment.status)) {
      console.error(
        "[email] sendSeatConfirmationEmail: enrollment not confirmed — skipping send (AD-10)",
        { enrollmentId, status: enrollment.status },
      );
      return { ok: false, error: "enrollment not confirmed" };
    }

    const join = meetingProvider.getJoinDetail({
      mode: enrollment.session.mode as "ONLINE" | "IN_PERSON",
      meetingUrl: enrollment.session.meetingUrl,
      location: enrollment.session.location,
    });

    const html = buildSeatConfirmationHtml({
      studentName: enrollment.student.name,
      classTitle: enrollment.session.title,
      subjectName: enrollment.session.subject.name,
      startsAt: enrollment.session.start,
      join,
      priceCents: enrollment.priceCents,
    });

    const subject = `Your seat is confirmed: ${enrollment.session.title}`;

    return await sendEmail({
      to: enrollment.student.email,
      subject,
      html,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[email] sendSeatConfirmationEmail error:", error, { enrollmentId });
    return { ok: false, error };
  }
}
