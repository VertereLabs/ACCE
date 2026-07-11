import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 3: Consolidation Mechanics (IFRS 10) | ACCE Tutors",
    description: "IFRS 10 consolidation mechanics: control, consolidation steps, uniform policies, and intra-group eliminations.",
    keywords: "IFRS 10, consolidation, control, intra-group eliminations, uniform accounting policies, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/groups/part-3/",
    },
};

export default function GroupsPart3Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
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
                                Part 3 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 3
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Consolidation Mechanics (IFRS 10)
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                50 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    IFRS 10 sets the rules for consolidated financial statements when an entity has <strong className="text-foreground">control</strong> over another entity. This part focuses on the mechanics: how to build the statements once control is clear.
                                </p>
                            </div>

                            {/* Section 1: Definition of Control */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Definition of Control
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Control is the cornerstone of consolidation. Under IFRS 10, an investor controls an investee when it has <strong className="text-foreground">all three</strong> of the following:
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">
                                            1. Power over the Investee
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Existing rights that give the investor the current ability to direct the <strong className="text-foreground">relevant activities</strong> (the activities that significantly affect the investee&apos;s returns).
                                        </p>
                                    </div>

                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-3">
                                            2. Exposure to Variable Returns
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Returns that can vary as a result of the investee&apos;s performance. This includes dividends, interest, fees, changes in investment value, and <strong className="text-foreground">synergies</strong>. Returns can be positive, negative, or both.
                                        </p>
                                    </div>

                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-3">
                                            3. Ability to Use Power to Affect Returns
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            The investor must be able to use its power over the investee to affect the amount of the investor&apos;s returns. This links power and returns together.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Exam Tip:</strong> Control is assessed continuously. If circumstances change, you must reassess whether control still exists. Look for changes in voting rights, contractual arrangements, or board composition.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: De Facto Control */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    De Facto Control
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    You don&apos;t always need &gt;50% of voting rights to have control. <strong className="text-foreground">De facto control</strong> exists when an investor can direct relevant activities even without a majority stake:
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Factors Indicating De Facto Control
                                    </h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Size of investor&apos;s holding relative to other shareholdings
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Dispersion of other shareholders (many small holders)
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Pattern of voting at shareholder meetings
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Potential voting rights held by the investor
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Example</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Company A holds 45% of Company B. The remaining 55% is held by thousands of small shareholders who rarely vote. Company A appoints the majority of the board and has historically controlled all shareholder votes. Company A likely has <strong className="text-foreground">de facto control</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Consolidation Procedures */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Consolidation Procedures
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Consolidation involves combining the financial statements of the parent and its subsidiaries. Here&apos;s the step-by-step process:
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Step-by-Step Consolidation Process
                                    </h3>
                                    <ol className="space-y-4 m-0 p-0 list-none">
                                        <li className="flex items-start gap-4 text-muted-foreground">
                                            <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <div>
                                                <strong className="text-foreground">Combine like items</strong>: Add together assets, liabilities, equity, income, and expenses line by line
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4 text-muted-foreground">
                                            <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <div>
                                                <strong className="text-foreground">Eliminate parent&apos;s investment</strong>: Remove the parent&apos;s investment in subsidiary against subsidiary&apos;s equity
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4 text-muted-foreground">
                                            <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <div>
                                                <strong className="text-foreground">Recognize goodwill or bargain purchase</strong>: Calculate and present on SOFP
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4 text-muted-foreground">
                                            <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <div>
                                                <strong className="text-foreground">Eliminate intra-group transactions</strong>: Remove all intercompany balances, sales, dividends
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4 text-muted-foreground">
                                            <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                            <div>
                                                <strong className="text-foreground">Recognize NCI</strong>: Present NCI in equity and allocate profit/loss
                                            </div>
                                        </li>
                                    </ol>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Remember:</strong> The consolidated financial statements present the parent and subsidiaries as a <strong>single economic entity</strong>. External transactions are shown; internal transactions are eliminated.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Uniform Accounting Policies */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Uniform Accounting Policies
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    For consolidation, the parent and all subsidiaries must use <strong className="text-foreground">uniform accounting policies</strong> for like transactions and events. If a subsidiary uses different policies:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Required Adjustment
                                        </div>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Make adjustments to align the subsidiary&apos;s policies with the group&apos;s policies before consolidation
                                        </p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                                            <X className="w-4 h-4" />
                                            Not Acceptable
                                        </div>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Mixing different accounting policies (e.g., FIFO and weighted average for inventory) in consolidated statements
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Common Policy Differences to Adjust
                                    </h3>
                                    <ul className="space-y-2 m-0 p-0 list-none text-muted-foreground text-sm">
                                        <li>• Inventory valuation methods (FIFO vs. weighted average)</li>
                                        <li>• Depreciation methods (straight-line vs. reducing balance)</li>
                                        <li>• Investment property measurement (cost model vs. fair value model)</li>
                                        <li>• Revenue recognition timing</li>
                                        <li>• Capitalisation policies for development costs</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Intra-Group Eliminations */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Intra-Group Eliminations
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    All transactions <strong className="text-foreground">between group entities</strong> must be eliminated in full. The consolidated statements should only show transactions with parties outside the group:
                                </p>

                                <div className="space-y-6">
                                    {/* Intra-group Balances */}
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                            📋 Intra-Group Balances
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Receivables and payables between group companies cancel out:
                                        </p>
                                        <div className="bg-card rounded-lg p-4 font-mono text-sm">
                                            <p className="text-foreground m-0">Dr Payable to parent (Sub&apos;s books)</p>
                                            <p className="text-accent ml-4 m-0">Cr Receivable from sub (Parent&apos;s books)</p>
                                        </div>
                                    </div>

                                    {/* Intra-group Sales */}
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                            💰 Intra-Group Sales
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Revenue and cost of sales for internal transactions must be eliminated:
                                        </p>
                                        <div className="bg-card rounded-lg p-4 font-mono text-sm">
                                            <p className="text-foreground m-0">Dr Revenue (Seller)</p>
                                            <p className="text-accent ml-4 m-0">Cr Cost of sales (Buyer)</p>
                                        </div>
                                    </div>

                                    {/* Unrealised Profits */}
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-accent mb-4">
                                            ⚠️ Unrealised Profits in Inventory
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            If goods sold between group companies are still held in inventory at year-end, the profit is <strong className="text-foreground">unrealised</strong> and must be eliminated:
                                        </p>
                                        <div className="bg-card rounded-lg p-4 font-mono text-sm">
                                            <p className="text-foreground m-0">Dr Cost of sales / Retained earnings</p>
                                            <p className="text-accent ml-4 m-0">Cr Inventory</p>
                                        </div>
                                        <div className="mt-4 p-4 bg-card rounded-lg">
                                            <p className="text-muted-foreground text-xs m-0">
                                                <strong className="text-foreground">Direction matters:</strong> For downstream sales (parent → sub), the full unrealised profit is eliminated from parent. For upstream sales (sub → parent), elimination is shared between parent and NCI.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Intra-group Dividends */}
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                            💸 Intra-Group Dividends
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Dividends paid by subsidiary and received by parent are eliminated:
                                        </p>
                                        <div className="bg-card rounded-lg p-4 font-mono text-sm">
                                            <p className="text-foreground m-0">Dr Dividend income (Parent&apos;s P/L)</p>
                                            <p className="text-accent ml-4 m-0">Cr Dividends paid (Sub&apos;s SOCIE)</p>
                                        </div>
                                        <p className="text-muted-foreground text-xs mt-3 m-0">
                                            Note: Only the parent&apos;s share is eliminated. NCI&apos;s share of dividends represents a payment to external parties.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Investment Entity Exception */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Investment Entity Exception
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    An <strong className="text-foreground">investment entity</strong> does not consolidate its subsidiaries (except those providing services). Instead, it measures them at <strong className="text-foreground">fair value through profit or loss</strong>.
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Investment Entity Criteria (All must be met)
                                    </h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Obtains funds from investors to provide investment management services
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Commits to investors that the purpose is to invest for capital appreciation, investment income, or both
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Measures and evaluates performance of substantially all investments on a fair value basis
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Note:</strong> This exception is typically relevant for venture capital entities, private equity funds, and similar investment vehicles. For most exam questions involving operating subsidiaries, normal consolidation applies.
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
                                                <strong className="text-foreground">Control = 3 elements:</strong> Power + variable returns + ability to affect returns.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">De facto control:</strong> Control possible without majority voting rights.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Line-by-line:</strong> Combine all assets, liabilities, income, and expenses.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Uniform policies:</strong> Adjust for any differences before consolidating.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Eliminate everything internal:</strong> Balances, sales, profits, dividends.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 4...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll dive deep into the <strong className="text-foreground">Analysis of Equity (AOE)</strong>, the heart of group accounting. You&apos;ll learn to work through at acquisition, since acquisition, and current year columns to derive all your consolidation journals.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/groups/part-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 2: Acquisition Method
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-4">
                                    Part 4: Analysis of Equity
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Need Help with Consolidation?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Intra-group eliminations and control assessments can be tricky. Book a session with Priyanka for step-by-step guidance.
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
