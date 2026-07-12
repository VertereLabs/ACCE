import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 1: Group Reporting Foundations | ACCE Tutors",
    description: "Group accounting basics: when to consolidate, when to use equity accounting, and the standards behind control and influence.",
    keywords: "group accounting foundations, control vs significant influence, IFRS 10, subsidiary vs associate, consolidation basics",
    alternates: {
        canonical: "/guides/groups/part-1/",
    },
};

export default function GroupsPart1Page() {
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
                                Part 1 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 1
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Foundations of Group Financial Reporting
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    Let&apos;s talk about Group Financial Accounting… Daunting, right? From FCTRs to changes in degrees of influence to eliminating pro formas: where do you even begin? This part covers the essential foundations you need before diving into the mechanics.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Know Your Starting Point
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Before doing any consolidation work, ask yourself the fundamental question:
                                </p>

                                {/* Decision Tree */}
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        The Control Question
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                            <p className="text-muted-foreground m-0">
                                                <strong className="text-foreground">Am I acquiring a subsidiary or an associate?</strong><br />
                                                <span className="text-muted-foreground">Does the parent have control?</span>
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                                            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Yes → Control
                                                </div>
                                                <p className="text-muted-foreground text-sm m-0">
                                                    <strong>Consolidate</strong> (Subsidiary)<br />
                                                    Apply IFRS 10 consolidation procedures
                                                </p>
                                            </div>
                                            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    No → Significant Influence
                                                </div>
                                                <p className="text-muted-foreground text-sm m-0">
                                                    <strong>Equity Account</strong> (Associate)<br />
                                                    Apply IAS 28 equity method
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">
                                    This decision is crucial because it determines the entire accounting approach. Get this wrong, and everything that follows will be incorrect.
                                </p>
                            </section>

                            {/* Section 2 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Master the Analysis of Equity (AOE)
                                </h2>

                                {/* Pro Tip */}
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Pro Tip</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Work in the 100% column first, then multiply out to NCI or parent as needed. This reduces calculation errors significantly.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This is the <strong className="text-foreground">heart of group accounting</strong>: your journals flow from here. Understanding the structure of an AOE is essential.
                                </p>

                                {/* AOE Structure */}
                                <div className="space-y-6">
                                    {/* At Acquisition */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-4">
                                            🔵 At Acquisition
                                        </h3>
                                        <ul className="space-y-3 m-0 p-0 list-none">
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                                                Eliminate the subsidiary&apos;s equity balances
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                                                Process fair value adjustments on assets and liabilities
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                                                Apply deferred tax
                                            </li>
                                        </ul>

                                        {/* Tax Rates Table */}
                                        <div className="mt-4 bg-card rounded-lg p-4">
                                            <h4 className="text-foreground font-medium mb-3 text-sm">Tax Rates:</h4>
                                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Normal tax rate:</span>
                                                    <span className="text-foreground font-mono">27%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">CGT inclusion (assets recovered through sale):</span>
                                                    <span className="text-foreground font-mono">27% × 80% = 21.6%</span>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-xs mt-3 m-0">
                                                Note: 21.6% is the exact figure; many students use 21.3% from lecture material.
                                            </p>
                                        </div>

                                        <div className="mt-4 p-4 bg-card rounded-lg">
                                            <h4 className="text-foreground font-medium mb-2 text-sm">Assets usually recovered through sale include:</h4>
                                            <ul className="text-muted-foreground text-sm space-y-1 m-0 p-0 list-none">
                                                <li>• Land</li>
                                                <li>• Investment property (usually measured through fair value model)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Since Acquisition */}
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-accent mb-4">
                                            🟡 Since Acquisition (Pre-current year)
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Process all movements after acquisition:
                                        </p>
                                        <ul className="space-y-3 m-0 p-0 list-none">
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                                Depreciation/amortisation on FV adjustments
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                                Deferred tax movements
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                                Prior year profits
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                                Impairments if applicable
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                                Dividends declared/paid
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Current Year */}
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-4">
                                            🟢 Current Year
                                        </h3>
                                        <ul className="space-y-3 m-0 p-0 list-none">
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                                                Current-year profit
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                                                Current-year effects of fair value adjustments
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                                                Updated deferred tax
                                            </li>
                                            <li className="flex items-start gap-3 text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                                                Any FV adjustments on financial instruments or investment property
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Know Your Group Statements
                                </h2>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Understanding where figures flow from in your AOE and journals is crucial. You should be comfortable drafting:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-3">Primary Statements</h4>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm">
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Group Statement of Financial Position
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Group Income Statement
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Group Statement of Changes in Equity
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Group Statement of Cash Flows
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-3">Key Calculations</h4>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm">
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Group Profit After Tax (GPAT)
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Notes to the financial statements
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                NCI calculations
                                            </li>
                                            <li className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                Goodwill reconciliation
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Key Insight:</strong> If you know the source of every number, consolidation becomes logical and not intimidating. Always trace back to your AOE.
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
                                                <strong className="text-foreground">Control = Consolidate:</strong> Always start by determining whether you have control (subsidiary) or significant influence (associate).
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">AOE is king:</strong> The Analysis of Equity is the foundation of all group accounting journals.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Work in 100%:</strong> Always calculate in the 100% column first, then allocate to NCI and parent.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">
                                                <strong className="text-foreground">Know your tax rates:</strong> 27% normal rate, 21.6% for CGT assets.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 2...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll dive deep into <strong className="text-foreground">IFRS 3: The Acquisition Method</strong>, covering how to identify the acquirer, determine the acquisition date, measure identifiable assets, calculate goodwill, and handle contingent consideration.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/groups">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Guide
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-2">
                                    Part 2: Acquisition Method
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Need Help with Groups?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                If you&apos;re struggling with PGDA or your BCom Accounting degree and need guidance, support, or structure, book a session with Priyanka.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                    <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                        WhatsApp: 071 325 5295
                                    </a>
                                </Button>
                                <Button asChild variant="heroOutline">
                                    <a href="mailto:priyankamikaya21@gmail.com">
                                        priyankamikaya21@gmail.com
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
