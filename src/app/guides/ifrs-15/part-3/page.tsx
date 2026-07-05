import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, TrendingUp, Calculator, ShieldAlert, Clock, Coins, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 3: Variable Consideration & Financing | ACCE Tutors",
    description: "Learn how to handle complex transaction prices in IFRS 15, including discounts, rebates, performance bonuses, and the time value of money.",
    keywords: "IFRS 15 variable consideration, expected value method, most likely amount, constraint on variable consideration, significant financing component",
    alternates: {
        canonical: "/guides/ifrs-15/part-3/",
    },
};

export default function IFRS15Part3Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/ifrs-15/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to IFRS 15
                        </Link>
                        <div className="flex items-center gap-4">
                            <a
                                href="/pdfs/ifrs-15-revenue.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            <div className="text-muted-foreground text-sm">
                                Part 3 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 3: Price Complexity
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Variable Consideration & Financing
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Not all contracts have a fixed price. When a contract includes rebates, bonuses, or long-term payments, Step 3 of the Five-Step Model becomes significantly more complex.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Variable Consideration */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Variable Consideration
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Variable consideration occurs when the price depends on future events. Think of a construction bonus for early completion or a volume rebate based on annual sales.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex items-center gap-2 text-accent mb-3">
                                            <TrendingUp className="w-5 h-5" />
                                            <h3 className="font-bold text-foreground m-0">Expected Value</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-4">Sum of probability-weighted amounts in a range of possible outcomes.</p>
                                        <div className="p-3 bg-muted rounded-lg border border-white/5 text-[10px] text-accent/80 font-mono">
                                            BEST FOR: Large number of contracts with similar characteristics.
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex items-center gap-2 text-accent mb-3">
                                            <Calculator className="w-5 h-5" />
                                            <h3 className="font-bold text-foreground m-0">Most Likely Amount</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-4">The single most likely outcome in a range of possible outcomes.</p>
                                        <div className="p-3 bg-muted rounded-lg border border-white/5 text-[10px] text-accent/80 font-mono">
                                            BEST FOR: Only two possible outcomes (e.g., bonus or no bonus).
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: The Constraint */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Constraint (IFRS 15.56)
                                </h2>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 mb-6">
                                    <div className="flex items-start gap-4">
                                        <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">Wait! Don&apos;t recognize it all.</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed m-0">
                                                You only include variable consideration in the transaction price if it is <strong className="text-foreground uppercase">highly probable</strong> that a significant reversal of revenue will <strong className="text-foreground">not</strong> occur when the uncertainty is resolved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-xs italic">
                                    Think of this as &quot;Accountant&apos;s Prudence&quot; built into the standard. If you aren&apos;t sure you&apos;ll get the bonus, don&apos;t book it yet!
                                </p>
                            </section>

                            {/* Section 3: Significant Financing Component */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Significant Financing Component (SFC)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If the customer pays much later than delivery (or much earlier), the transaction price includes a &quot;financing element&quot; (interest).
                                </p>
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Clock className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">When to Adjust?</h4>
                                            <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                                Adjust the transaction price for the time value of money if the timing of payments provides the customer (or the entity) with a <strong className="text-foreground">significant benefit</strong> of financing.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-4 text-xs uppercase tracking-widest">Practical Expedient</h4>
                                        <p className="text-sm text-muted-foreground m-0">
                                            If the period between transfer of control and payment is <strong className="text-foreground text-md">one year or less</strong>, you do NOT need to account for a financing component.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Non-Cash Consideration */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Non-Cash Consideration
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If a customer pays with assets instead of cash (e.g., equipment or equity shares), how do we measure the revenue?
                                </p>
                                <div className="flex items-center gap-6 p-6 bg-card rounded-2xl border border-border">
                                    <Coins className="w-10 h-10 text-accent flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-muted-foreground leading-relaxed m-0">
                                            Measure the non-cash consideration at its <strong className="text-foreground text-md underline decoration-accent">Fair Value</strong> at contract inception. If fair value cannot be reliably estimated, use the stand-alone selling price of the goods/services promised.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Exam Tip: The Step 3 Traps
                                </h2>
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <div className="flex gap-4 items-start">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0" />
                                        <ul className="text-sm text-muted-foreground space-y-4 m-0 p-0 list-none">
                                            <li>
                                                <strong className="text-foreground">1. Volume Rebates:</strong> Always check if the rebate is retrospective (applies to all previous units) or prospective. It changes your calculation of variable consideration.
                                            </li>
                                            <li>
                                                <strong className="text-foreground">2. Financing Rate:</strong> Always use the rate that would be reflected in a separate financing transaction between the entity and its customer.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-15/part-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 2: 5-Step Model
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/ifrs-15/part-4">
                                    Part 4: Complex Scenarios
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Getting Tangled in SFC or Rebates?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                These specific price components are where most students lose marks in Step 3. Let&apos;s clarify the logic together.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    WhatsApp Priyanka
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
