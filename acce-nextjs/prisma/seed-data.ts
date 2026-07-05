/**
 * Pure seed constants — no Prisma/db import so this can be imported safely
 * in the jsdom unit test environment without DATABASE_URL being set.
 *
 * Story 1.4 (FR19): subjects, level strings, admin user, and 6 SCHEDULED
 * "Test-3" GroupSession classes for ACCE Tutors Phase 1a.
 */

// ─── Subjects ────────────────────────────────────────────────────────────────

export const SUBJECTS = [
  "Accounting",
  "Management Accounting & Finance",
  "Auditing",
  "Tax",
] as const;

export type SubjectName = (typeof SUBJECTS)[number];

// ─── Level constants (Phase 1a: level is a String tag on GroupSession; ────────
//     no Level model until 1b — these strings are the canonical values).

export const LEVELS = ["Undergrad", "CTA/PGDA"] as const;

export type LevelValue = (typeof LEVELS)[number];

// ─── Admin user ──────────────────────────────────────────────────────────────

export const ADMIN_USER = {
  id: "seed-priyanka-admin",
  name: "Priyanka",
  // Optional override for deployment; fallback is the real contact address from
  // the UX design docs (EXPERIENCE.md:36).
  email: process.env.SEED_ADMIN_EMAIL ?? "priyankamikaya21@gmail.com",
  emailVerified: true as const,
  role: "ADMIN" as const,
} as const;

// ─── Class definitions ────────────────────────────────────────────────────────
// 6 "Test-3" group sessions:  2 × Accounting, 2 × Tax, 1 × Auditing,
//                              1 × Management Accounting & Finance.
// start is computed at seed-run time using `daysOffset` (business hours, SAST).
// end = start + 2 h (enforced in seed.ts).
// AD-9: priceCents = 29000 (R290, integer cents — no floats).
// AD-5: capacity only (no seat-counter).
// AD-13: meetingUrl stays null; Priyanka pastes Meet link via admin later.

export interface ClassDef {
  id: string;
  subject: SubjectName;
  level: LevelValue;
  title: string;
  description: string;
  daysOffset: number; // days from seed run-time that the class starts
  hourOfDay: number;  // 24-h clock hour (SAST, business hours)
  capacity: number;   // 4–6 (AC1)
  priceCents: number; // AD-9: 29000 = R290
}

export const CLASSES: ClassDef[] = [
  {
    id: "seed-class-acc-1",
    subject: "Accounting",
    level: "CTA/PGDA",
    title: "Accounting Test-3 Session A",
    description: "CTA/PGDA Accounting intensive — Test-3 group class.",
    daysOffset: 7,
    hourOfDay: 9,
    capacity: 5,
    priceCents: 29000,
  },
  {
    id: "seed-class-acc-2",
    subject: "Accounting",
    level: "Undergrad",
    title: "Accounting Test-3 Session B",
    description: "Undergrad Accounting intensive — Test-3 group class.",
    daysOffset: 10,
    hourOfDay: 14,
    capacity: 6,
    priceCents: 29000,
  },
  {
    id: "seed-class-tax-1",
    subject: "Tax",
    level: "CTA/PGDA",
    title: "Tax Test-3 Session A",
    description: "CTA/PGDA Tax intensive — Test-3 group class.",
    daysOffset: 12,
    hourOfDay: 9,
    capacity: 4,
    priceCents: 29000,
  },
  {
    id: "seed-class-tax-2",
    subject: "Tax",
    level: "Undergrad",
    title: "Tax Test-3 Session B",
    description: "Undergrad Tax intensive — Test-3 group class.",
    daysOffset: 14,
    hourOfDay: 14,
    capacity: 5,
    priceCents: 29000,
  },
  {
    id: "seed-class-aud-1",
    subject: "Auditing",
    level: "CTA/PGDA",
    title: "Auditing Test-3 Session A",
    description: "CTA/PGDA Auditing intensive — Test-3 group class.",
    daysOffset: 17,
    hourOfDay: 9,
    capacity: 6,
    priceCents: 29000,
  },
  {
    id: "seed-class-maf-1",
    subject: "Management Accounting & Finance",
    level: "Undergrad",
    title: "Management Accounting & Finance Test-3 Session A",
    description:
      "Undergrad Management Accounting & Finance intensive — Test-3 group class.",
    daysOffset: 19,
    hourOfDay: 14,
    capacity: 4,
    priceCents: 29000,
  },
];

// ─── Derived helpers (pure — safe to call in tests) ──────────────────────────

/** Returns a Date for a class start time: today + daysOffset days, at hourOfDay:00:00 UTC. */
export function computeStart(daysOffset: number, hourOfDay: number): Date {
  const d = new Date();
  d.setUTCHours(hourOfDay, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + daysOffset);
  return d;
}

/** Returns end = start + 2 hours. */
export function computeEnd(start: Date): Date {
  return new Date(start.getTime() + 2 * 60 * 60 * 1000);
}
