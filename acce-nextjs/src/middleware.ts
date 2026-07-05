import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-guide publish status — must stay in sync with src/config/guides.ts.
 * Duplicated here because middleware runs in the Edge runtime and has
 * restricted import capabilities in some Next.js versions.
 */
const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

/** Maps a downloadable PDF filename to its guide id (kept private until live). */
const PDF_TO_GUIDE: Record<string, string> = {
    "groups-business-combinations.pdf": "groups",
    "ifrs-15-revenue.pdf": "ifrs-15",
    "ifrs-16-leases.pdf": "ifrs-16",
};

/**
 * Blocks direct access to unpublished guide pages AND their PDFs in the public
 * deploy. The REVIEW path (NEXT_PUBLIC_GUIDES_PREVIEW=true) and development
 * leave everything open.
 *
 * Story 1.3 extension: adds a coarse portal/admin unauthenticated redirect.
 * The middleware runs in the Edge runtime — no Node APIs, no DB, no Prisma.
 * Therefore this is a COARSE cookie-presence check only; the real auth/role
 * enforcement lives in the (portal) and (admin) server-component layouts and
 * per-page requireSession() / requireAdmin() calls (AD-3).
 */
export function middleware(request: NextRequest) {
    // ── Guides + PDF gating (Story 1.2, load-bearing — DO NOT REMOVE) ─────────────
    // In development or preview mode, open everything.
    if (
        process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_GUIDES_PREVIEW === "true"
    ) {
        // Guides/PDF paths: pass through. Portal/admin paths: still do coarse check below
        // — but only when inside the guides/pdfs matcher branch. Because we return early
        // for the full dev/preview short-circuit, portal/admin coarse check is skipped
        // in development too (acceptable: real auth guards still run in the layout/page).
        //
        // Note: this early return only fires for paths IN the matcher
        // (["/guides/:path+", "/pdfs/:path*", "/portal/:path*", "/admin/:path*"]).
        // Marketing routes are never in the matcher — they bypass middleware entirely.
        return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    // ── Guide pages: /guides/<id>/... ─────────────────────────────────────────────
    const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
    if (guideMatch) {
        const guideId = guideMatch[1];
        if (guideId in GUIDE_PUBLISH_STATUS && !GUIDE_PUBLISH_STATUS[guideId]) {
            return NextResponse.redirect(new URL("/guides", request.url));
        }
        return NextResponse.next();
    }

    // ── Guide PDFs: /pdfs/<file>.pdf ─────────────────────────────────────────────
    const pdfMatch = pathname.match(/^\/pdfs\/([^/]+\.pdf)$/i);
    if (pdfMatch) {
        const guideId = PDF_TO_GUIDE[pdfMatch[1].toLowerCase()];
        if (guideId && !GUIDE_PUBLISH_STATUS[guideId]) {
            return NextResponse.redirect(new URL("/guides", request.url));
        }
        return NextResponse.next();
    }

    // ── Portal / Admin coarse unauthenticated redirect (Story 1.3, AC2, AC6) ─────
    //
    // Edge runtime only — no DB lookup, no role check.
    // This is purely a UX pre-emption: if there is NO Better Auth session cookie at
    // all, redirect to /sign-in before the user sees a flash of unguarded UI.
    //
    // Real auth enforcement: requireSession() / requireAdmin() in each layout and page.
    // Those run in the Node runtime with full DB access and are the TRUSTED boundary
    // (AD-3). Do not gate on role here — role requires DB.
    //
    // Cookie detection: Better Auth v1 default session cookie is `better-auth.session_token`.
    // To be resilient to cookie name changes, redirect only when NO cookie whose name
    // starts with "better-auth" is present (fail-open to the layout guard rather than
    // locking out a valid session on a cookie-name mismatch).
    if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
        const hasBetterAuthCookie = request.cookies
            .getAll()
            .some((c) => c.name.startsWith("better-auth"));

        if (!hasBetterAuthCookie) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        // Cookie present → pass through to the layout/page guard (the trusted check).
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    // Merged matcher: guides/PDF gating (1.2) + portal/admin coarse redirect (1.3).
    // Marketing routes NOT listed here bypass middleware entirely (AC1).
    matcher: ["/guides/:path+", "/pdfs/:path*", "/portal/:path*", "/admin/:path*"],
};
