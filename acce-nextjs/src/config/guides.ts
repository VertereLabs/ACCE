/**
 * Per-guide publish control.
 *
 * Two deploy paths from one codebase:
 *  - PUBLIC (default) — `npm run build` / normal deploy. Only guides with
 *    `true` below are live; the rest show as "Coming Soon" and their pages +
 *    PDFs are blocked.
 *  - REVIEW — set `NEXT_PUBLIC_GUIDES_PREVIEW=true` (dev or a private preview
 *    deploy). ALL guides + PDFs are unlocked so content can be reviewed for
 *    accuracy before release, without exposing them on the public site.
 *
 * When a guide is ready to go live, flip its value to `true` (update the copy
 * in `middleware.ts` too — it can't import this in the Edge runtime).
 */
export const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

export const isDev = process.env.NODE_ENV === "development";

/** REVIEW path: unlocks every guide without publishing them publicly. */
export const isGuidesPreview = process.env.NEXT_PUBLIC_GUIDES_PREVIEW === "true";

/** Returns true if the guide should be accessible to users */
export function isGuidePublished(guideId: string): boolean {
    if (isDev || isGuidesPreview) return true;
    return GUIDE_PUBLISH_STATUS[guideId] ?? false;
}

/** True when at least one guide is live to the public. */
export function anyGuidePublished(): boolean {
    return Object.keys(GUIDE_PUBLISH_STATUS).some(isGuidePublished);
}
