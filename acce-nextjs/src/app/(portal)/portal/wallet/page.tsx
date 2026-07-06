// Wallet page — Story 3.1 (AC1, AC2, AC4).
// Server component — fully server-rendered, no client island.
//
// Security model (AD-3): requireSession() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so unauthenticated users are redirected
// to /sign-in even if they bypass the (portal) layout via a direct RSC request.
//
// The balance and ledger are queried strictly by session.user.id — never a
// client-supplied id — so a student can never read another student's wallet (AC4).
//
// Data model (AD-6): balance = Σ LedgerEntry.amountCents (via getBalance()).
//   ledger entries are read-only here — no writes anywhere in this page.
//
// Money (AD-9): amountCents / balanceAfterCents are integer cents; formatted to
//   Rand ONLY at the UI edge via formatZar() and formatSignedZar().
//
// A11y (NFR10): page uses a plain <div> wrapper — the (portal) layout owns the
//   single <main> landmark; a second <main> here would be an invalid nested landmark
//   (1.3 review finding; 1.5 RSC-500 smoke net covers this route after Task 4).

import { requireSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { getBalance } from "@/lib/wallet";
import { formatZar } from "@/lib/class-display";
import { formatSignedZar, formatLedgerType } from "@/lib/wallet-display";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (story constraint + 2.2/2.3
// timezone-deferral convention: no pinned timeZone, uses en-ZA locale)
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

export default async function WalletPage() {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  // Redirects to /sign-in if no session.
  const session = await requireSession();
  const studentId = session.user.id;

  // Fetch balance and ledger entries in parallel (read-only, no writes).
  // Query is strictly by session.user.id (AC4 — never a route/query param).
  const [balance, entries] = await Promise.all([
    getBalance(studentId),
    db.ledgerEntry.findMany({
      where: { studentId },
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
    // Plain <div> — the (portal) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Balance card (AC1, AC2) ────────────────────────────────────── */}
      <Card className="mb-8">
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

      {/* ── Section heading ───────────────────────────────────────────── */}
      <h2 className="mb-4 text-lg font-semibold">Transaction history</h2>

      {/* ── Empty state (AC2) ─────────────────────────────────────────── */}
      {isEmpty && <EmptyState message="No wallet activity yet." />}

      {/* ── Ledger table (AC1) ────────────────────────────────────────── */}
      {!isEmpty && (
        // Wrap in overflow container for narrow-screen horizontal scroll (2.2 pattern, NFR10).
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
