/**
 * Story 1.3 AC5 — auth guard helper unit tests.
 *
 * Tests requireSession() and requireAdmin() in isolation by mocking:
 *   - auth.api.getSession (the Better Auth session read)
 *   - next/navigation redirect (so we can assert it is called correctly)
 *   - next/headers headers (returns a stable stub)
 *
 * Pattern follows email.test.ts: vi.mock() at module level + vi.stubGlobal /
 * re-stubs in beforeEach so afterEach cleanup is safe.
 *
 * AD-3 rule verified here: requireSession() redirects when no session; requireAdmin()
 * redirects to /portal when role != "ADMIN" and passes when role === "ADMIN".
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Mock next/navigation (redirect must not actually navigate) ────────────────
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

// ── Mock next/headers (headers() returns a stable stub) ────────────────────
const mockHeaders = vi.fn().mockResolvedValue(new Headers());
vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

// ── Mock auth (getSession returns what we configure per test) ─────────────────
const mockGetSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

// ─────────────────────────────────────────────────────────────────────────────

describe("requireSession()", () => {
  beforeEach(() => {
    mockRedirect.mockReset();
    mockGetSession.mockReset();
    mockHeaders.mockResolvedValue(new Headers());
  });

  afterEach(() => {
    vi.resetModules();
  });

  async function importRequireSession() {
    vi.resetModules();
    return (await import("@/lib/auth-guards")).requireSession;
  }

  it("redirects to /sign-in when getSession returns null (no session)", async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const requireSession = await importRequireSession();

    // redirect() throws in Next production but in tests it returns (mock).
    // We call it and then verify the mock was called with "/sign-in".
    await requireSession().catch(() => {});
    // After redirect is called the function may or may not throw (depends on mock).
    // Either way, redirect must have been called.
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("returns the session when getSession returns a valid session", async () => {
    const fakeSession = {
      session: { id: "sess_1", token: "tok", userId: "u1" },
      user: { id: "u1", email: "student@test.com", role: "STUDENT" },
    };
    mockGetSession.mockResolvedValueOnce(fakeSession);

    const requireSession = await importRequireSession();
    const result = await requireSession();

    expect(result).toEqual(fakeSession);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("calls auth.api.getSession with the headers from next/headers", async () => {
    const stubHeaders = new Headers({ "x-test": "1" });
    mockHeaders.mockResolvedValueOnce(stubHeaders);
    mockGetSession.mockResolvedValueOnce({
      session: { id: "s" },
      user: { id: "u", email: "a@b.com", role: "STUDENT" },
    });

    const requireSession = await importRequireSession();
    await requireSession();

    expect(mockGetSession).toHaveBeenCalledWith({ headers: stubHeaders });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("requireAdmin()", () => {
  beforeEach(() => {
    mockRedirect.mockReset();
    mockGetSession.mockReset();
    mockHeaders.mockResolvedValue(new Headers());
  });

  afterEach(() => {
    vi.resetModules();
  });

  async function importRequireAdmin() {
    vi.resetModules();
    return (await import("@/lib/auth-guards")).requireAdmin;
  }

  it("redirects to /sign-in (via requireSession) when there is no session", async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const requireAdmin = await importRequireAdmin();
    await requireAdmin().catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects to /portal when session exists but role is STUDENT", async () => {
    mockGetSession.mockResolvedValueOnce({
      session: { id: "s1", token: "t", userId: "u1" },
      user: { id: "u1", email: "student@test.com", role: "STUDENT" },
    });

    const requireAdmin = await importRequireAdmin();
    await requireAdmin().catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/portal");
  });

  it("redirects to /portal when session exists but role is null (unset)", async () => {
    mockGetSession.mockResolvedValueOnce({
      session: { id: "s2", token: "t", userId: "u2" },
      user: { id: "u2", email: "user@test.com", role: null },
    });

    const requireAdmin = await importRequireAdmin();
    await requireAdmin().catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/portal");
  });

  it("redirects to /portal when session exists but role is undefined", async () => {
    mockGetSession.mockResolvedValueOnce({
      session: { id: "s3", token: "t", userId: "u3" },
      user: { id: "u3", email: "user@test.com", role: undefined },
    });

    const requireAdmin = await importRequireAdmin();
    await requireAdmin().catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/portal");
  });

  it("redirects to /portal when role is some other string (not ADMIN)", async () => {
    mockGetSession.mockResolvedValueOnce({
      session: { id: "s4", token: "t", userId: "u4" },
      user: { id: "u4", email: "user@test.com", role: "SUPER_ADMIN" },
    });

    const requireAdmin = await importRequireAdmin();
    await requireAdmin().catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/portal");
  });

  it("returns the session and does NOT redirect when role is exactly 'ADMIN'", async () => {
    const fakeAdminSession = {
      session: { id: "s5", token: "t", userId: "u5" },
      user: { id: "u5", email: "admin@test.com", role: "ADMIN" },
    };
    mockGetSession.mockResolvedValueOnce(fakeAdminSession);

    const requireAdmin = await importRequireAdmin();
    const result = await requireAdmin();

    expect(result).toEqual(fakeAdminSession);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
