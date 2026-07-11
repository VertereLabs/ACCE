import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Users, Network, Scale, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 6: Associates & Joint Ventures | ACCE Tutors",
    description: "Learn how to account for associates and joint ventures using the equity method. Understand significant influence and joint control.",
    keywords: "IAS 28, IFRS 11, associates, joint ventures, equity method, significant influence, joint control, group accounting, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/groups/part-6/",
    },
};

export default function GroupsPart6Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/groups/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Guide
                        </Link>
                        <div className="flex items-center gap-4">
                            {isGuidePdfPublished("groups") && (
                            <a
                                href="/pdfs/groups-business-combinations.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            )}
                            <div className="text-muted-foreground text-sm">
                                Part 6 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 6
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Associates & Joint Ventures
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                45 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    Not every investment in another company leads to control. When you have <strong className="text-foreground">significant influence</strong> or <strong className="text-foreground">joint control</strong>, you don&apos;t consolidate line-by-line. Instead, you use the <strong className="text-foreground">Equity Method</strong>.
                                </p>
                            </div>

                            {/* Section 1: Determining Influence */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Significant Influence & Joint Control
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Associates (IAS 28)
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            The power to participate in financial and operating policy decisions, but <strong className="text-foreground">not control</strong>.
                                        </p>
                                        <ul className="space-y-2 text-xs text-muted-foreground list-none p-0 m-0">
                                            <li>• Usually 20% to 50% voting rights</li>
                                            <li>• Representation on the board</li>
                                            <li>• Participation in policy-making</li>
                                            <li>• Material transactions between entities</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                            <Scale className="w-5 h-5" />
                                            Joint Ventures (IFRS 11)
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Contractually agreed sharing of control. Decisions require <strong className="text-foreground">unanimous consent</strong> of the parties sharing control.
                                        </p>
                                        <ul className="space-y-2 text-xs text-muted-foreground list-none p-0 m-0">
                                            <li>• Joint Control is the key</li>
                                            <li>• Parties have rights to the <strong className="text-foreground">net assets</strong> of the arrangement</li>
                                            <li>• Accounted for using the Equity Method (same as associates)</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: The Equity Method */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Equity Method Principles
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The equity method is often called &quot;one-line consolidation.&quot; Instead of adding assets and liabilities, you show your investment as a single line item in the SOFP.
                                </p>

                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        The Standard Formula:
                                    </h3>
                                    <div className="bg-card rounded-lg p-5 font-mono text-sm space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span>Initial Cost of Investment</span>
                                            <span className="text-accent">X</span>
                                        </div>
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>+ Share of Post-Acq Profits (Net of Tax)</span>
                                            <span>X</span>
                                        </div>
                                        <div className="flex justify-between items-center text-blue-400 border-b border-border pb-2">
                                            <span>+ Share of Post-Acq OCI</span>
                                            <span>X</span>
                                        </div>
                                        <div className="flex justify-between items-center text-red-400">
                                            <span>- Dividends Received from Associate</span>
                                            <span>(X)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-accent">
                                            <span>- Impairment Losses</span>
                                            <span>(X)</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-accent pt-2 font-bold text-lg">
                                            <span>Carrying Amount (SOFP)</span>
                                            <span className="text-accent">NAV</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0 text-sm">
                                            <strong className="text-foreground">Crucial Distinction:</strong> In consolidation, dividends from a sub are eliminated in full. In the equity method, dividends from an associate <strong className="text-foreground">reduce the carrying amount</strong> of the investment; they are not recognized as income in the group P/L.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: The Investment in Associate Working */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    The &quot;Investment in Associate&quot; Working
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Just like the AOE for subsidiaries, you need a structured working for associates. Use these two columns:
                                </p>

                                <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted text-foreground">
                                                <th className="p-3 border-b border-border">Working Item</th>
                                                <th className="p-3 border-b border-border border-l border-border text-center">Since Acq (Pre-CY)</th>
                                                <th className="p-3 border-b border-border border-l border-border text-center">Current Year</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr>
                                                <td className="p-3 border-b border-border font-semibold">Associate&apos;s Profit</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center">X</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center">X</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border-b border-border underline italic">Less: Unrealised Profits (Group Share)</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center">(X)</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center">(X)</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border-b border-border italic">Adjusted Profit</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center font-bold">Total</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center font-bold">Total</td>
                                            </tr>
                                            <tr className="bg-accent/5">
                                                <td className="p-3 border-b border-border font-bold text-accent">Group Share (x%)</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center font-bold text-accent">Split</td>
                                                <td className="p-3 border-b border-border border-l border-border text-center font-bold text-accent">Split</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Section 4: Elimination of Unrealised Profit */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Unrealised Profits with Associates
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    When the group sells to an associate (downstream) or vice versa (upstream), only the <strong className="text-foreground">group&apos;s share</strong> of the profit is eliminated.
                                </p>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <h4 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Example: Downstream Sale
                                    </h4>
                                    <p className="text-muted-foreground text-sm m-0">
                                        Parent sells inventory to Associate for R10,000 profit. Parent owns 30% of Associate. Associate still holds the stock at year-end.
                                    </p>
                                    <div className="mt-4 p-3 bg-card rounded-lg font-mono text-xs">
                                        <p className="text-accent m-0">Profit to eliminate = R10,000 x 30% = R3,000</p>
                                        <p className="mt-2 text-foreground">Dr Group Retained Earnings / COS</p>
                                        <p className="ml-4 text-accent">Cr Investment in Associate</p>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Key Takeaways
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <ul className="space-y-4 m-0 p-0 list-none text-muted-foreground">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>Associate = Significant influence (usually 20-50%).</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>JV = Joint control + rights to net assets.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>Equity Method: One line in SOFP, one line in P/L.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>Dividends <strong className="text-foreground">reduce</strong> the asset; they aren&apos;t income.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 7...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll wrap up the series with <strong className="text-foreground">Group Financial Statements</strong>. You&apos;ll see how everything pulls together into the Group SOFP, SOCI, and SOCIE, with final exam tips for the big day.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/groups/part-5">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 5: Complex Transactions
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-7">
                                    Part 7: Group Statements
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Confused by the Equity Method?
                            </h3>
                            <p className="text-muted-foreground mb-6 font-medium">
                                Share of profits, unrealised eliminations, and carrying amount calcs can be overwhelming. Let&apos;s simplify it together.
                            </p>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Get Personalized Help
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
