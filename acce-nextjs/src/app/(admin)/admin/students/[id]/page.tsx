// Per-student admin view — Story 3.5 (Task 5, AC1, AC3, AC4, mirrors 2.3 edit page pattern).
// Dynamic server RSC: params awaited (Next 16), requireAdmin() first, findUnique + notFound().
//
// Security model (AD-3): requireAdmin() is the TRUSTED page-level guard.
// Runs BEFORE any data fetch or JSX — non-admins cannot see student wallet data
// even via a direct RSC request.
//
// Data fetches (read-only):
//   - student identity: db.user.findUnique (select id/name/email/role — notFound if missing or non-STUDENT)
//   - balance: getBalance(id) — same Σ LedgerEntry.amountCents as the student's own /portal/wallet
//   - ledger entries: db.ledgerEntry.findMany (ordered asc — oldest first, same as portal wallet page)
//
// Credit write: rendered as a client island <CreditWalletForm studentId={student.id} />
//   Passing a plain string prop (1.5 RSC-500 safety — never pass a client element through
//   a non-children prop from a server component).
//
// Ledger rendering: mirrors (portal)/portal/wallet/page.tsx — reuses formatZar, formatSignedZar,
//   formatLedgerType. Admin is reading the SAME ledger, just keyed to the target studentId.
//
// A11y (NFR10): plain <div> wrapper — the (admin) layout owns the single <main> (1.3 a11y fix).

import { notFound } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { getBalance } from "@/lib/wallet";
import { formatZar } from "@/lib/class-display";
import { formatSignedZar, formatLedgerType } from "@/lib/wallet-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditWalletForm } from "./credit-wallet-form";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (3.1/2.2 convention)
// ---------------------------------------------------------------------------

function formatEntryDate(date: Date): string {
  return date.toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface StudentAdminPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentAdminPage({ params }: StudentAdminPageProps) {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  await requireAdmin();

  // Next 16: params is a Promise — must be awaited (mirrors 2.3 edit page).
  const { id } = await params;

  // Verify the target user exists and is a STUDENT.
  // notFound() if missing or not STUDENT (mirrors 2.3's notFound pattern — AC4).
  const student = await db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!student || student.role !== "STUDENT") {
    notFound();
  }

  // Fetch balance and ledger entries in parallel (read-only — no writes in this page).
  // AD-9: balance is integer cents; formatted at the UI edge via formatZar.
  const [balance, entries] = await Promise.all([
    getBalance(student.id),
    db.ledgerEntry.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "asc" }, // oldest first → running balance reads top-to-bottom
      select: {
        id: true,
        type: true,
        amountCents: true,
        balanceAfterCents: true,
        createdAt: true,
      },
    }),
  ]);

  const isEmpty = entries.length === 0;

  return (
    // Plain <div> — the (admin) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Back navigation ─────────────────────────────────────────────── */}
      <Link
        href="/admin/students"
        className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Back to students
      </Link>

      {/* ── Student identity header ──────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {student.name ?? student.email}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{student.email}</p>
      </div>

      {/* ── Balance card (mirrors 3.1 wallet page AC1/AC2) ───────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Wallet balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold tabular-nums">
            {formatZar(balance)}
          </p>
        </CardContent>
      </Card>

      {/* ── Credit form island (AC1, AC3, UX-DR5) ───────────────────────── */}
      {/* Plain string prop — RSC-500 safe (1.5 lesson: never pass a client element
          through a non-children prop from a server component). */}
      <div className="mb-8">
        <CreditWalletForm studentId={student.id} />
      </div>

      {/* ── Ledger section (mirrors 3.1 wallet page rendering) ───────────── */}
      <h2 className="mb-4 text-lg font-semibold">Transaction history</h2>

      {isEmpty && (
        <Card>
          <CardContent className="flex items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No wallet activity yet.</p>
          </CardContent>
        </Card>
      )}

      {!isEmpty && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatEntryDate(entry.createdAt)}
                  </TableCell>
                  <TableCell>{formatLedgerType(entry.type)}</TableCell>
                  <TableCell
                    className={`text-right tabular-nums font-medium whitespace-nowrap ${
                      entry.amountCents < 0
                        ? "text-destructive"
                        : entry.amountCents > 0
                          ? "text-green-600 dark:text-green-400"
                          : ""
                    }`}
                  >
                    {formatSignedZar(entry.amountCents)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">
                    {formatZar(entry.balanceAfterCents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
