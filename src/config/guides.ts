/**
 * Per-guide publish control.
 *
 * - In development (`npm run dev`), ALL guides are accessible regardless of this flag.
 * - In production (`npm run build`), only guides with `published: true` are accessible.
 *
 * When a guide is ready to go live, just flip its value to `true`.
 */
export const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

export const isDev = process.env.NODE_ENV === "development";

/** Returns true if the guide should be accessible to users */
export function isGuidePublished(guideId: string): boolean {
    if (isDev) return true;
    return GUIDE_PUBLISH_STATUS[guideId] ?? false;
}
