// Email send adapter — Story 1.2 (AD-13).
// Uses native `fetch` only — no resend SDK, no axios (NFR9 / lessons-learned supply-chain rule).
// Extended by Epic 6 for seat-confirmation emails.

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
