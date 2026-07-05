import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Calculator, Table as TableIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 4: Analysis of Equity (AOE) | ACCE Tutors",
    description: "Master the Analysis of Equity (AOE). Learn how to structure working papers for at acquisition, since acquisition, and current year columns.",
    keywords: "Analysis of Equity, AOE, group accounting, consolidation journals, NCI allocation, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/groups/part-4/",
    },
};

export default function GroupsPart4Page() {
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
                            <a
                                href="/pdfs/groups-business-combinations.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            <div className="text-muted-foreground text-sm">
                                Part 4 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 4
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Analysis of Equity (AOE) — The Heart of Groups
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                90 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    The <strong className="text-foreground">Analysis of Equity (AOE)</strong> is the single most important working paper in group accounting. It is the &quot;engine room&quot; where you calculate the figures that populate your consolidation journals and financial statements. Master the AOE, and you master Groups.
                                </p>
                            </div>

                            {/* Section 1: The Principle of 100% first */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Golden Rule: Work in 100% First
                                </h2>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            Always work in the <strong className="text-foreground">100% column</strong> first. Only once you have calculated the total movement for a period do you split it between the Parent and the Non-Controlling Interest (NCI).
                                        </p>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Why? Because it reduces rounding errors and ensures that your split always reconciles back to the total. It makes the logic much easier to follow when things get complex (like with fair value adjustments).
                                </p>
                            </section>

                            {/* Section 2: AOE Structure */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Structure of the AOE
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    An AOE is typically divided into three time-based sections. Each section calculates the equity of the subsidiary at a specific point in time or for a specific period.
                                </p>

                                <div className="space-y-8">
                                    {/* At Acquisition */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                            🔵 Column 1: At Acquisition
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Calculates the Net Asset Value (NAV) of the subsidiary on the date control was obtained. This is used to calculate Goodwill.
                                        </p>
                                        <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
                                            <li>• Share Capital</li>
                                            <li>• Retained Earnings (at acq date)</li>
                                            <li>• Fair Value Adjustments (Land, PPE, Brands)</li>
                                            <li>• Deferred Tax on FV Adjustments</li>
                                        </ul>
                                    </div>

                                    {/* Since Acquisition */}
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-accent mb-4 flex items-center gap-2">
                                            🟡 Column 2: Since Acquisition to Start of Current Year
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Calculates the growth in equity from the date of acquisition until the beginning of the current reporting period.
                                        </p>
                                        <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
                                            <li>• Total profits made since acquisition (pre-current year)</li>
                                            <li>• Depreciation on FV adjustments (pre-current year)</li>
                                            <li>• Dividends paid from pre-acquisition profits (if any)</li>
                                            <li>• Impairment of goodwill (if fair value method used)</li>
                                        </ul>
                                    </div>

                                    {/* Current Year */}
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                            🟢 Column 3: Current Year
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Calculates the movements in equity for the current reporting year. This figure goes to the Group Income Statement and SOCI.
                                        </p>
                                        <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
                                            <li>• Profit for the current year</li>
                                            <li>• Current year depreciation on FV adjustments</li>
                                            <li>• Current year impairment of goodwill</li>
                                            <li>• Other Comprehensive Income (OCI) items</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: The AOE Template */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Recommended AOE Template
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Below is the standard template we recommend for all Groups questions. Using a consistent layout reduces the &quot;mental load&quot; during an exam.
                                </p>

                                <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead>
                                                <tr className="bg-muted text-foreground">
                                                    <th className="p-3 border-b border-border">Description</th>
                                                    <th className="p-3 border-b border-border border-l border-border">Total (100%)</th>
                                                    <th className="p-3 border-b border-border border-l border-border">Parent (x%)</th>
                                                    <th className="p-3 border-b border-border border-l border-border">NCI (y%)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="bg-blue-500/5">
                                                    <td className="p-3 border-b border-border font-semibold text-blue-400">AT ACQUISITION</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Share Capital</td>
                                                    <td className="p-3 border-b border-border border-l border-border">X</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Retained Earnings (at acq)</td>
                                                    <td className="p-3 border-b border-border border-l border-border">X</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">FV Adjustments (Net of Tax)</td>
                                                    <td className="p-3 border-b border-border border-l border-border">X</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr className="bg-blue-500/10 font-bold">
                                                    <td className="p-3 border-b border-border">At Acquisition Equity</td>
                                                    <td className="p-3 border-b border-border border-l border-border">NAV</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                </tr>
                                                <tr className="bg-accent/5">
                                                    <td className="p-3 border-b border-border font-semibold text-accent">SINCE ACQUISITION (Pre-CY)</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Movement in Retained Earnings</td>
                                                    <td className="p-3 border-b border-border border-l border-border">X</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Depreciation on FV Adj (Pre-CY)</td>
                                                    <td className="p-3 border-b border-border border-l border-border">(X)</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr className="bg-accent/10 font-bold">
                                                    <td className="p-3 border-b border-border">Total Since Acquisition</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Total</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                </tr>
                                                <tr className="bg-green-500/5">
                                                    <td className="p-3 border-b border-border font-semibold text-green-400">CURRENT YEAR</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Profit for the Year</td>
                                                    <td className="p-3 border-b border-border border-l border-border">X</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-b border-border">Current Year Depreciation on FV Adj</td>
                                                    <td className="p-3 border-b border-border border-l border-border">(X)</td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                    <td className="p-3 border-b border-border border-l border-border"></td>
                                                </tr>
                                                <tr className="bg-green-500/10 font-bold">
                                                    <td className="p-3 border-b border-border">Total Current Year</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Total</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                    <td className="p-3 border-b border-border border-l border-border">Split</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-xs text-center italic">
                                    Note: Dividends and FCTRs would also be included here depending on the scenario.
                                </p>
                            </section>

                            {/* Section 4: Dealing with Deferred Tax */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Dealing with Deferred Tax in the AOE
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Deferred tax must be accounted for on every fair value adjustment. This is where many students lose easy marks.
                                </p>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-red-400 mb-4">
                                        The Dual Rate System
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        In South Africa, the rate depends on how the asset&apos;s value will be recovered.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-card rounded-lg p-4">
                                            <h4 className="text-foreground font-semibold mb-2">Use / Normal Recovery</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Rate: <strong className="text-foreground">27%</strong> (Current rate)<br />
                                                Applies to: Inventory, Depreciable PPE, Provisions.
                                            </p>
                                        </div>
                                        <div className="bg-card rounded-lg p-4">
                                            <h4 className="text-foreground font-semibold mb-2">Sale / CGT Recovery</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Rate: <strong className="text-foreground">21.6%</strong> (27% x 80% inclusion)<br />
                                                Applies to: Land, Investment Property.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Calculations to show in AOE:
                                    </h3>
                                    <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                        <p className="text-foreground">FV Adj (PPE) = FV - Cost</p>
                                        <p className="text-foreground font-bold">Deferred Tax = FV Adj x 27%</p>
                                        <p className="text-accent">Net FV Adj = FV Adj - Deferred Tax</p>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-4 italic">
                                        *Use the Net figure in the main AOE calc to save time on splits!
                                    </p>
                                </div>
                            </section>

                            {/* Section 5: The Split and NCI */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    The Split: NCI vs. Parent
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Once you have the total movement for a column (e.g., &quot;Since Acquisition&quot;), multiply that total by the ownership percentages.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                            Parent Share
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Goes to <strong className="text-foreground">Group Retained Earnings</strong> or SOCIE. This represents the parent&apos;s portion of the subsidiary&apos;s growth.
                                        </p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                            NCI Share
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Goes to the <strong className="text-foreground">NCI line in Equity</strong> on the SOFP. This represents the minority shareholders&apos; portion of the subsidiary&apos;s equity.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Important: Negative NCI</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Under IFRS 10, NCI can be negative. If the subsidiary makes losses that exceed its equity, NCI continues to share in those losses unless the parent has a contractual obligation to cover them.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Summary Checklist
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <ul className="space-y-4 m-0 p-0 list-none text-muted-foreground">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Did I identify the correct acquisition date and NAV?
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Did I account for all FV adjustments and related deferred tax?
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Did I use the correct tax rates (27% vs 21.6%)?
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Did I work in 100% first before splitting?
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Does my current year column match the Income Statement?
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 5...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll tackle <strong className="text-foreground">Complex Transactions</strong>: step acquisitions, disposals (loss of control), FCTRs, and complex intra-group transfers of assets.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/groups/part-3">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 3: Consolidation
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-5">
                                    Part 5: Complex Transactions
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Struggling with your AOE?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                If you&apos;re getting lost in the numbers, a one-on-one session can help you build your working papers with confidence.
                            </p>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book a Session
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
