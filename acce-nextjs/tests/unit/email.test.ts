/**
 * Story 1.2 AC5, AC6 — email send adapter unit tests.
 *
 * Tests:
 *   1. sendEmail builds the correct Resend fetch payload (URL, headers, body shape).
 *   2. Non-2xx Resend response yields an error result (AC5).
 *   3. Dev fallback: no RESEND_API_KEY → logs, returns ok, no fetch call.
 *   4. sendMagicLinkEmail throws on a failed send so Better Auth surfaces the error (AC5).
 *   5. sendMagicLinkEmail does NOT throw when send is ok.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ─── Global fetch mock ────────────────────────────────────────────────────────
// NOTE: stubGlobal is re-applied in every beforeEach because afterEach calls
// vi.unstubAllGlobals() which restores the original fetch between tests.

const mockFetch = vi.fn();

// ─── Capture console output ───────────────────────────────────────────────────
const consoleSpy = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

// ─────────────────────────────────────────────────────────────────────────────

describe("sendEmail (AC5, AC6)", () => {
  const RESEND_URL = "https://api.resend.com/emails";

  beforeEach(() => {
    // Re-stub global fetch before every test so afterEach's unstubAllGlobals() doesn't
    // leave subsequent tests with the real fetch.
    vi.stubGlobal("fetch", mockFetch);
    // Set env defaults.
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.EMAIL_FROM = "ACCE Tutors <no-reply@accetutors.co.za>";
    mockFetch.mockReset();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    vi.resetModules();
  });

  // Re-import module per test so env changes take effect cleanly.
  async function importSendEmail() {
    vi.resetModules();
    return (await import("@/lib/email")).sendEmail;
  }

  it("calls the Resend API with the correct URL and Authorization header", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const sendEmail = await importSendEmail();
    await sendEmail({ to: "student@example.com", subject: "Test", html: "<p>hi</p>" });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(RESEND_URL);
    expect((init.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer test-api-key",
    );
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    expect(init.method).toBe("POST");
  });

  it("sends the correct from/to/subject in the request body", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const sendEmail = await importSendEmail();
    await sendEmail({
      to: "student@example.com",
      subject: "Sign in to ACCE Tutors",
      html: "<p>link</p>",
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.from).toBe("ACCE Tutors <no-reply@accetutors.co.za>");
    expect(body.to).toBe("student@example.com");
    expect(body.subject).toBe("Sign in to ACCE Tutors");
    expect(typeof body.html).toBe("string");
  });

  it("returns { ok: true } on a successful 2xx Resend response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const sendEmail = await importSendEmail();
    const result = await sendEmail({ to: "a@b.com", subject: "S", html: "<p/>" });
    expect(result).toEqual({ ok: true });
  });

  it("returns { ok: false, error } on a non-2xx Resend response (AC5)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: async () => '{"message":"Invalid email"}',
    });

    const sendEmail = await importSendEmail();
    const result = await sendEmail({ to: "bad", subject: "S", html: "<p/>" });
    expect(result).toMatchObject({ ok: false });
    expect((result as { ok: false; error: string }).error).toContain("422");
  });

  it("returns { ok: false, error } on a network error (AC5)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    const sendEmail = await importSendEmail();
    const result = await sendEmail({ to: "a@b.com", subject: "S", html: "<p/>" });
    expect(result).toMatchObject({ ok: false, error: "Network failure" });
  });

  it("dev fallback: no RESEND_API_KEY → logs, returns ok, does NOT call fetch", async () => {
    delete process.env.RESEND_API_KEY;

    const sendEmail = await importSendEmail();
    const result = await sendEmail({ to: "dev@test.com", subject: "Dev", html: "<p/>" });

    expect(result).toEqual({ ok: true });
    expect(mockFetch).not.toHaveBeenCalled();
    expect(consoleSpy.log).toHaveBeenCalledOnce();
    const logMsg = consoleSpy.log.mock.calls[0]?.[0] as string;
    expect(logMsg).toContain("RESEND_API_KEY");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("sendMagicLinkEmail (AC1, AC5)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.EMAIL_FROM = "ACCE Tutors <no-reply@accetutors.co.za>";
    mockFetch.mockReset();
    consoleSpy.error.mockClear();
    consoleSpy.log.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    vi.resetModules();
  });

  async function importSendMagicLinkEmail() {
    vi.resetModules();
    return (await import("@/lib/email")).sendMagicLinkEmail;
  }

  it("resolves without throwing on a successful send", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const sendMagicLinkEmail = await importSendMagicLinkEmail();
    await expect(sendMagicLinkEmail("user@example.com", "https://auth/verify/abc")).resolves.toBeUndefined();
  });

  it("throws on a failed Resend response so Better Auth surfaces the error (AC5)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const sendMagicLinkEmail = await importSendMagicLinkEmail();
    await expect(
      sendMagicLinkEmail("user@example.com", "https://auth/verify/abc"),
    ).rejects.toThrow();
  });

  it("sends subject 'Sign in to ACCE Tutors' (branded)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const sendMagicLinkEmail = await importSendMagicLinkEmail();
    await sendMagicLinkEmail("user@example.com", "https://magic/link");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.subject).toBe("Sign in to ACCE Tutors");
  });

  it("includes the magic-link URL in the email HTML body", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const magicUrl = "https://portal.accetutors.co.za/api/auth/magic-link/verify?token=abc123";

    const sendMagicLinkEmail = await importSendMagicLinkEmail();
    await sendMagicLinkEmail("user@example.com", magicUrl);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.html as string).toContain("abc123");
  });

  it("dev fallback: no RESEND_API_KEY → does NOT throw, logs (dev ergonomics)", async () => {
    delete process.env.RESEND_API_KEY;

    const sendMagicLinkEmail = await importSendMagicLinkEmail();
    await expect(
      sendMagicLinkEmail("dev@test.com", "https://magic/link/dev"),
    ).resolves.toBeUndefined();

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
