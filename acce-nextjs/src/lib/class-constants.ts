// Canonical LEVELS constant for group classes (Story 2.1).
// Level is a plain String tag on GroupSession in Phase 1a — no Level model until 1b.
// A small, intentional duplication of the seed's LEVELS array (in prisma/seed-data.ts).
// Do NOT import this from app code into prisma/seed-data.ts or vice versa.

export const LEVELS = ["Undergrad", "CTA/PGDA"] as const;
export type LevelValue = (typeof LEVELS)[number];
