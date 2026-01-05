import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, TrendingUp, RefreshCw, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 5: Complex Transactions | ACCE Tutors",
    description: "Master complex group transactions including goodwill impairment, intra-group transfers of assets, changes in ownership, and FCTR.",
    keywords: "goodwill impairment, intra-group transfers, ownership changes, step acquisitions, FCTR, IAS 21, group accounting, CA(SA), CTA, PGDA",
};

export default function GroupsPart5Page() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/groups"
                            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
                            <div className="text-primary-foreground/40 text-sm">
                                Part 5 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 5
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                                Complex Transactions in Group Accounting
                            </h1>
                            <p className="text-primary-foreground/60 text-lg">
                                75 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-10">
                                <p className="text-primary-foreground/80 text-lg leading-relaxed m-0">
                                    Once you master the basics of consolidation and the AOE, the next challenge is handling <strong className="text-primary-foreground">complex transactions</strong>. These are the scenarios that separate the average students from those who achieve distinctions. We&apos;ll cover goodwill impairment, asset transfers, and changes in ownership.
                                </p>
                            </div>

                            {/* Section 1: Goodwill Impairment */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Goodwill Impairment (IAS 36)
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    Goodwill is not amortised. Instead, it must be tested for impairment annually (or more frequently if there are indicators). The accounting depends on whether you chose the <strong className="text-primary-foreground">Fair Value Method</strong> or the <strong className="text-primary-foreground">Proportionate Share Method</strong> for NCI.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">
                                            Full Goodwill Method
                                        </h3>
                                        <p className="text-primary-foreground/70 text-sm mb-4">
                                            NCI is measured at fair value. Both the parent AND NCI share the impairment loss.
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-3 font-mono text-xs">
                                            <p className="m-0">Dr Impairment Loss (P/L)</p>
                                            <p className="m-0 text-accent">Cr Goodwill (SOFP)</p>
                                            <p className="mt-2 text-primary-foreground/50 italic">*Loss split in AOE between Parent/NCI</p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">
                                            Partial Goodwill Method
                                        </h3>
                                        <p className="text-primary-foreground/70 text-sm mb-4">
                                            NCI is measured at proportionate share. Only the PARENT shares the impairment loss.
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-3 font-mono text-xs">
                                            <p className="m-0">Dr Impairment Loss (P/L)</p>
                                            <p className="m-0 text-accent">Cr Goodwill (SOFP)</p>
                                            <p className="mt-2 text-primary-foreground/50 italic">*Loss fully allocated to Parent in AOE</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Intra-Group Asset Transfers */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Intra-Group Transfers of PPE
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    When one group entity sells an item of PPE to another at a profit, two things happen that must be eliminated:
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-display font-semibold text-primary-foreground mb-1">1. Unrealised Profit</h4>
                                            <p className="text-primary-foreground/70 text-sm m-0">The profit on the sale is unrealised from the group&apos;s perspective until the asset is depreciated or sold outside the group.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-4">
                                        <RefreshCw className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-display font-semibold text-primary-foreground mb-1">2. Excess Depreciation</h4>
                                            <p className="text-primary-foreground/70 text-sm m-0">The buyer depreciates the asset at its new (higher) cost. This &quot;excess&quot; depreciation must be reversed to bring the asset back to its original group carrying amount.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <h4 className="font-display font-bold text-primary-foreground mb-4">The Elimination Journal (Year of Sale):</h4>
                                    <div className="bg-white/5 rounded-lg p-4 font-mono text-sm space-y-2">
                                        <p className="text-primary-foreground">Dr Other Income / Gain on sale (Seller)</p>
                                        <p className="text-accent ml-4">Cr PPE (Buyer) <span className="text-primary-foreground/40 text-xs ml-2">// Eliminate profit</span></p>
                                        <p className="text-primary-foreground">Dr Accumulated Depr (Buyer)</p>
                                        <p className="text-accent ml-4">Cr Depreciation Expense (Buyer) <span className="text-primary-foreground/40 text-xs ml-2">// Reverse excess depr</span></p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Changes in Ownership */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Changes in Ownership (IFRS 10)
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    This is a major exam topic. The accounting depends entirely on whether <strong className="text-primary-foreground">control</strong> is maintained or lost.
                                </p>

                                <div className="space-y-6">
                                    {/* Control Maintained */}
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            Control Maintained (e.g., 60% → 80%)
                                        </h3>
                                        <p className="text-primary-foreground/80 text-sm mb-4">
                                            This is viewed as an <strong className="text-primary-foreground">equity transaction</strong>. No gain or loss is recognized in Profit or Loss.
                                        </p>
                                        <ul className="space-y-2 text-sm text-primary-foreground/70 list-none p-0 m-0">
                                            <li>• Adjust carrying amount of NCI</li>
                                            <li>• Any difference between consideration paid/received and NCI adjustment goes directly to <strong className="text-primary-foreground">Equity</strong> (Retained Earnings/Common Control Reserve).</li>
                                        </ul>
                                    </div>

                                    {/* Loss of Control */}
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                            <Layers className="w-5 h-5" />
                                            Loss of Control (e.g., 60% → 40%)
                                        </h3>
                                        <p className="text-primary-foreground/80 text-sm mb-4">
                                            The subsidiary is deemed &quot;sold.&quot; You must:
                                        </p>
                                        <ol className="space-y-2 text-xs text-primary-foreground/70 list-decimal ml-4 p-0">
                                            <li>Derecognize all assets (including goodwill) and liabilities of the sub.</li>
                                            <li>Derecognize NCI.</li>
                                            <li>Recognize consideration received.</li>
                                            <li>Remeasure any retained interest (the 40%) to <strong className="text-primary-foreground">Fair Value</strong>.</li>
                                            <li>Recognize the gain or loss in <strong className="text-primary-foreground">Profit or Loss</strong>.</li>
                                        </ol>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: FCTR and Foreign Subs */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Foreign Currency Translation (IAS 21)
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    When you have a foreign subsidiary, you must translate its financial statements into the group&apos;s presentation currency. This gives rise to the <strong className="text-primary-foreground">Foreign Currency Translation Reserve (FCTR)</strong>.
                                </p>

                                <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">
                                        Translation Rates Quick Guide:
                                    </h3>
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="text-primary-foreground/40 border-b border-white/10">
                                                <th className="py-2">Item</th>
                                                <th className="py-2">Rate Used</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-primary-foreground/80">
                                            <tr className="border-b border-white/5">
                                                <td className="py-3">Assets & Liabilities</td>
                                                <td className="py-3 font-semibold text-accent text-xs">Closing Rate (Spot at year-end)</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3">Income & Expenses</td>
                                                <td className="py-3 font-semibold text-accent text-xs">Average Rate (or Transaction Rate)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">Equity Items</td>
                                                <td className="py-3 font-semibold text-accent text-xs">Historical Rate (at date of transaction)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-primary-foreground/80 m-0 text-sm">
                                            <strong className="text-primary-foreground">Pro-Tip:</strong> The difference resulting from these different rates is recognized in <strong className="text-primary-foreground">Other Comprehensive Income (OCI)</strong> and accumulated in the FCTR in equity. On disposal of the sub, this reserve is &quot;recycled&quot; to Profit or Loss.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6">
                                    Mastering the Complexity
                                </h2>
                                <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-sm">
                                    <p className="text-primary-foreground/70 mb-4">To master these complex topics, always focus on:</p>
                                    <ul className="space-y-2 m-0 p-0 list-none text-primary-foreground/80">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                            Does the NCI measurement method affect the calc? (Goodwill impairment)
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                            Did control change? (Ownership changes)
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                            Am I using the correct FX rates for the period? (IAS 21)
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-4">
                                    Coming in Part 6...
                                </h2>
                                <p className="text-primary-foreground/70 mb-6">
                                    We&apos;ll look at <strong className="text-primary-foreground">Associates and Joint Ventures</strong>. You&apos;ll learn when to use the equity method instead of consolidation and how to work through the investment in associate working paper.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/10">
                            <Button asChild variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground">
                                <Link href="/guides/groups/part-4">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 4: AOE
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/groups/part-6">
                                    Part 6: Associates & JVs
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                                Getting Stuck on FCTR or Step Acquisitions?
                            </h3>
                            <p className="text-primary-foreground/70 mb-6">
                                These advanced topics are common in PGDA exams. Book a tailored session to master the mechanics of complex group accounting.
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
