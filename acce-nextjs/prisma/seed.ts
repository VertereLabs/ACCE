/**
 * ACCE Tutors — Phase 1a idempotent seed (Story 1.4 / FR19).
 *
 * Run via:  npx prisma db seed
 *           (Prisma loads .env before invoking tsx prisma/seed.ts — this is
 *            the only safe entrypoint because db.ts throws on missing DATABASE_URL)
 *
 * What is seeded (idempotent — safe to re-run):
 *   4  Subjects          — upsert by @unique name
 *   Priyanka (ADMIN)     — upsert by @unique email
 *   6  GroupSessions     — upsert by deterministic explicit id (no natural unique key)
 *
 * AD-2: Only the singleton from src/lib/db.ts is used — never new PrismaClient().
 * AD-9: priceCents = 29_000 (R290 in integer cents, no floats).
 * AD-5: capacity only; no seat-counter; live count comes from Enrollment.
 * AD-13: meetingUrl = null; Priyanka pastes a Meet link per class via admin.
 */

// Relative path is required: tsx does NOT resolve tsconfig @/* aliases.
import { db } from "../src/lib/db";
import {
  ADMIN_USER,
  CLASSES,
  SUBJECTS,
  computeEnd,
  computeStart,
} from "./seed-data";

async function main() {
  console.log("🌱  ACCE seed starting…");

  // ── 1. Subjects ────────────────────────────────────────────────────────────
  const subjectMap: Record<string, string> = {}; // name → id

  for (const name of SUBJECTS) {
    const subject = await db.subject.upsert({
      where: { name },
      create: { name },
      update: {}, // no-op on re-run
    });
    subjectMap[name] = subject.id;
    console.log(`  subject upserted: ${name} (${subject.id})`);
  }

  // ── 2. Admin user (Priyanka) ────────────────────────────────────────────────
  const admin = await db.user.upsert({
    where: { email: ADMIN_USER.email },
    create: {
      id: ADMIN_USER.id,
      name: ADMIN_USER.name,
      email: ADMIN_USER.email,
      emailVerified: ADMIN_USER.emailVerified,
      role: ADMIN_USER.role,
    },
    update: {
      // Ensure role stays ADMIN on re-run even if someone accidentally demoted.
      role: ADMIN_USER.role,
    },
  });
  console.log(`  admin user upserted: ${admin.email} (${admin.id})`);

  // ── 3. GroupSession classes ────────────────────────────────────────────────
  for (const cls of CLASSES) {
    const subjectId = subjectMap[cls.subject];
    if (!subjectId) {
      throw new Error(`Subject not found in map: ${cls.subject}`);
    }

    const start = computeStart(cls.daysOffset, cls.hourOfDay);
    const end = computeEnd(start);

    const session = await db.groupSession.upsert({
      where: { id: cls.id },
      create: {
        id: cls.id,
        subjectId,
        level: cls.level,
        title: cls.title,
        description: cls.description,
        start,
        end,
        capacity: cls.capacity,
        priceCents: cls.priceCents,
        status: "SCHEDULED",
        // mode defaults to ONLINE; meetingUrl stays null (AD-13).
        meetingUrl: null,
      },
      update: {
        // Re-run: refresh dynamic fields; leave enrollments / payments untouched.
        subjectId,
        level: cls.level,
        title: cls.title,
        description: cls.description,
        start,
        end,
        capacity: cls.capacity,
        priceCents: cls.priceCents,
      },
    });
    console.log(`  class upserted: ${session.title} (${session.id})`);
  }

  console.log(
    `\n✅  Seed complete — ${SUBJECTS.length} subjects, 1 admin, ${CLASSES.length} classes.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
