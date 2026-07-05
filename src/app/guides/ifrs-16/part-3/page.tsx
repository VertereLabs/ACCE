import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, RefreshCw, LayoutDashboard, AlertCircle, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 3: IFRS 16 Subsequent Measurement | ACCE Tutors",
    description: "Learn how to account for leases after the commencement date, including depreciation of ROU assets, interest on lease liabilities, and remeasurement.",
    keywords: "IFRS 16 subsequent measurement, lease liability amortization, ROU asset depreciation, lease remeasurement, lease modification",
    alternates: {
        canonical: "/guides/ifrs-16/part-3/",
    },
};

export default function IFRS16Part3Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/ifrs-16/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to IFRS 16
                        </Link>
                        <div className="flex items-center gap-4">
                            <a
                                href="/pdfs/ifrs-16-leases.pdf"
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
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                                Part 3: Maintenance Accounting
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Subsequent Measurement & Remeasurement
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Accounting for a lease doesn&apos;t end on Day 1. You must track the liability, depreciate the asset, and react to changes in the contract.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Subsequent Liability */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Lease Liability Journey
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The lease liability is measured using the <strong className="text-foreground underline decoration-accent decoration-2 underline-offset-4">Amortized Cost</strong> method. Each period, you increase the liability for interest and decrease it for payments made.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex items-center gap-2 text-accent mb-3">
                                            <TrendingUp className="w-5 h-5" />
                                            <h4 className="font-bold text-foreground m-0 text-sm">Interest Expense</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground m-0">
                                            Calculate interest by multiplying the carrying amount of the liability by the discount rate. Recognized in Profit or Loss.
                                        </p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex items-center gap-2 text-accent mb-3">
                                            <TrendingDown className="w-5 h-5" />
                                            <h4 className="font-bold text-foreground m-0 text-sm">Lease Payments</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground m-0">
                                            The actual cash paid reduces the liability. Note: This cash flow should be split between interest and principal in your SOCF.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Subsequent ROU Asset */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Depreciating the ROU Asset
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Generally, lessees use the <strong className="text-foreground">Cost Model</strong> for the ROU asset (unless they use the Revaluation Model or Fair Value Model for the underlying asset class).
                                </p>
                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h4 className="font-bold text-foreground mb-4 text-xs uppercase tracking-widest text-accent">Depreciation Period:</h4>
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold m-0 text-foreground">If ownership transfers / purchase option is likely:</p>
                                                <p className="text-xs text-muted-foreground m-0">Depreciate over the <strong className="text-foreground">Useful Life</strong> of the asset.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold m-0 text-foreground">Otherwise:</p>
                                                <p className="text-xs text-muted-foreground m-0">Depreciate over the <strong className="text-foreground">shorter</strong> of the Useful Life or the Lease Term.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Remeasurement */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Remeasurement
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Sometimes, events happen that change the future lease payments. When this happens, you must &quot;adjust&quot; the liability and usually the ROU asset too.
                                </p>

                                <div className="space-y-4">
                                    <div className="p-5 bg-card border border-border rounded-xl flex gap-4">
                                        <RefreshCw className="w-6 h-6 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">When to remeasure?</h4>
                                            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                                                <li>Change in the lease term (e.g., you now expect to extend).</li>
                                                <li>Change in the assessment of a purchase option.</li>
                                                <li>Change in the amounts expected to be payable under residual value guarantees.</li>
                                                <li>Change in future lease payments resulting from a change in an index or rate.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                                                <strong className="text-foreground">Crucial Rule:</strong> Most remeasurements involve adjusting the <strong className="text-foreground">Lease Liability</strong> and making a corresponding adjustment to the <strong className="text-foreground">ROU Asset</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Summary / Tip */}
                            <section className="mb-12">
                                <div className="bg-card border border-border rounded-xl p-8">
                                    <div className="flex gap-4">
                                        <Lightbulb className="w-8 h-8 text-accent flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-foreground mb-2 text-balance">Exam Tip: The Carrying Amount Trap</h3>
                                            <p className="text-sm text-muted-foreground m-0 leading-relaxed italic">
                                                If a remeasurement reduces the ROU asset to zero, any remaining adjustment is recognized in <strong className="text-foreground font-bold">Profit or Loss</strong>. You can&apos;t have a negative ROU asset!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-16/part-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 2: Initial Measurement
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-16/part-4">
                                    Part 4: Sale & Leaseback
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3 font-display">
                                Getting Lost in the Amortization Table?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Subsequent measurement is where most calculation errors occur. Let&apos;s build a robust template together.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book a Coaching Session
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
