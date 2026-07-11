import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Calculator, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 2: The Acquisition Method (IFRS 3) | ACCE Tutors",
    description: "IFRS 3 acquisition method: identify the acquirer, set the acquisition date, measure net assets at fair value, and calculate goodwill.",
    keywords: "IFRS 3, business combinations, acquisition method, goodwill, NCI, fair value, contingent consideration",
    alternates: {
        canonical: "/guides/groups/part-2/",
    },
};

export default function GroupsPart2Page() {
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
                                Part 2 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 2
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                The Acquisition Method (IFRS 3)
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                60 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    IFRS 3 mandates the <strong className="text-foreground">acquisition method</strong> for all business combinations. This part walks through each step, from identifying the acquirer to calculating goodwill. Get this right, and your consolidation journals will flow naturally.
                                </p>
                            </div>

                            {/* Section 1: Identifying the Acquirer */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Identifying the Acquirer
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The <strong className="text-foreground">acquirer</strong> is the entity that obtains control of the acquiree. In most cases, this is straightforward: the entity paying cash or issuing shares is the acquirer. However, some situations require careful analysis:
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Indicators of the Acquirer
                                    </h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The entity that transfers cash or other assets
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The entity that incurs liabilities
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The entity whose owners retain the largest voting interest
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The entity that appoints the majority of the board
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The larger entity (by assets, revenue, or profit)
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Reverse Acquisitions</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                In rare cases, the legal acquirer is not the accounting acquirer. This happens when a smaller company &quot;acquires&quot; a larger one by issuing enough shares that the larger company&apos;s shareholders end up with majority control. The accounting acquirer is the entity whose shareholders control the combined entity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Determining the Acquisition Date */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Determining the Acquisition Date
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The <strong className="text-foreground">acquisition date</strong> is the date on which the acquirer obtains control of the acquiree. This is typically the closing date when:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Legal transfer occurs</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Shares are transferred, consideration is paid
                                        </p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Control is obtained</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Power + variable returns + ability to affect returns
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Why it matters:</strong> All fair values are measured at the acquisition date. Pre-acquisition profits belong to the acquiree&apos;s previous owners; post-acquisition profits are included in the group&apos;s results.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Recognizing Identifiable Assets & Liabilities */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Recognizing Identifiable Assets & Liabilities
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    At acquisition date, the acquirer recognizes the acquiree&apos;s identifiable assets and liabilities at their <strong className="text-foreground">fair values</strong>. This includes items not previously recognized in the acquiree&apos;s books:
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-4">
                                            ✓ Assets to Recognize at Fair Value
                                        </h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-muted-foreground">
                                            <li>• Intangible assets (brands, customer lists, patents)</li>
                                            <li>• Property, plant and equipment</li>
                                            <li>• Investment property</li>
                                            <li>• Financial instruments</li>
                                            <li>• Inventories</li>
                                            <li>• Contingent assets (not recognized, see note)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-4">
                                            ✓ Liabilities to Recognize at Fair Value
                                        </h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-muted-foreground">
                                            <li>• Financial liabilities</li>
                                            <li>• Provisions and contingent liabilities (if FV can be measured reliably)</li>
                                            <li>• Deferred tax (arising from FV adjustments)</li>
                                            <li>• Employee benefit obligations</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Exceptions Table */}
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Exceptions to Fair Value Measurement
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Item</th>
                                                    <th className="text-left py-2 text-foreground">Measurement Basis</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Deferred tax</td>
                                                    <td className="py-2">IAS 12 (not discounted)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Employee benefits</td>
                                                    <td className="py-2">IAS 19</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Share-based payments</td>
                                                    <td className="py-2">IFRS 2</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Assets held for sale</td>
                                                    <td className="py-2">IFRS 5 (FV less costs to sell)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">Indemnification assets</td>
                                                    <td className="py-2">Same basis as indemnified item</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Measuring NCI */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Measuring Non-Controlling Interest (NCI)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 3 provides two choices for measuring NCI at acquisition, and this choice affects your goodwill calculation:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">
                                            Option 1: Fair Value (Full Goodwill)
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            NCI is measured at fair value, typically based on the market price per share × NCI shares.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 text-sm">
                                            <p className="text-muted-foreground m-0">
                                                <strong className="text-foreground">Result:</strong> Goodwill includes both parent&apos;s and NCI&apos;s share
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-3">
                                            Option 2: Proportionate Share (Partial Goodwill)
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            NCI is measured at their proportionate share of the acquiree&apos;s identifiable net assets.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 text-sm">
                                            <p className="text-muted-foreground m-0">
                                                <strong className="text-foreground">Result:</strong> Goodwill only includes parent&apos;s share
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Exam Tip:</strong> Always check which method the question requires. If not specified, state your assumption clearly. The fair value method gives higher goodwill but is more intuitive for impairment testing.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Calculating Goodwill */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Calculating Goodwill
                                </h2>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Goodwill Formula
                                        </h3>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-2">
                                        <p className="text-foreground m-0">Goodwill = </p>
                                        <p className="text-accent ml-4 m-0">+ Consideration transferred (at fair value)</p>
                                        <p className="text-blue-400 ml-4 m-0">+ NCI (at FV or proportionate share)</p>
                                        <p className="text-purple-400 ml-4 m-0">+ Previously held interest (remeasured to FV)</p>
                                        <p className="text-red-400 ml-4 m-0">− Fair value of identifiable net assets</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground">
                                        Components of Consideration
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-medium mb-2">Cash</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Amount paid at acquisition date
                                            </p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-medium mb-2">Shares Issued</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Fair value (market price) at acquisition date
                                            </p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-medium mb-2">Contingent Consideration</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Fair value at acquisition date (probability-weighted)
                                            </p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-medium mb-2">Deferred Consideration</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Present value if significant time element
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Acquisition Costs</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Transaction costs (legal fees, due diligence, advisory fees) are <strong>expensed as incurred</strong>: they are NOT part of consideration and do NOT affect goodwill. Only costs to issue shares are deducted from equity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Bargain Purchase */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Bargain Purchase (Negative Goodwill)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If the fair value of net assets exceeds the consideration paid + NCI, you have a <strong className="text-foreground">bargain purchase</strong>. Before recognizing a gain:
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            Review whether all assets and liabilities have been identified
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            Review the fair value measurements for reasonableness
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            If confirmed, recognize the excess as a <strong className="text-foreground">gain in profit or loss</strong>
                                        </li>
                                    </ol>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Common causes:</strong> Forced sales, distressed sellers, or errors in valuation. Bargain purchases are rare and examiners expect you to question them before recognizing a gain.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Key Takeaways
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Identify the acquirer:</strong> The entity obtaining control (power, returns, ability to affect returns).
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Acquisition date:</strong> When control is obtained; all FVs measured at this date.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Fair value everything:</strong> Assets and liabilities at FV, with specific exceptions.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">NCI choice:</strong> Fair value (full goodwill) or proportionate share (partial goodwill).
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Expense acquisition costs:</strong> Legal/advisory fees hit P&L, not goodwill.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 3...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll cover <strong className="text-foreground">IFRS 10: Consolidation Mechanics</strong>: the procedures for combining parent and subsidiary, eliminating intra-group transactions, and presenting unified group financial statements.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/groups/part-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 1: Foundations
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-3">
                                    Part 3: Consolidation
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Need Help with IFRS 3?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Goodwill calculations and NCI choices can be tricky. Book a session with Priyanka for step-by-step guidance.
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
