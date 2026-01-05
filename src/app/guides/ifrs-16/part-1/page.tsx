import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, AlertCircle, CheckCircle2, Info, Scale, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 1: Intro to IFRS 16 & Key Changes | ACCE Tutors",
    description: "Understand the monumental shift from IAS 17 to IFRS 16, specifically the new 'Single Lessee Model' and why off-balance sheet financing is a thing of the past.",
    keywords: "IFRS 16, leases, IAS 17 vs IFRS 16, single lessee model, right-of-use asset, lease liability, accounting standards",
};

export default function IFRS16Part1Page() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/ifrs-16"
                            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
                            <div className="text-primary-foreground/40 text-sm">
                                Part 1 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                                Part 1: The New Era
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
                                IFRS 16: Introduction & Key Changes
                            </h1>
                            <p className="text-primary-foreground/60 text-lg leading-relaxed">
                                IFRS 16 brought one of the biggest changes to the balance sheet in decades. It eliminated &quot;off-balance sheet&quot; financing for lessees.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Why the change? */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Why was IAS 17 replaced?
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    Under the old standard (IAS 17), companies could classify leases as &quot;operating leases.&quot; This meant billions in future payment obligations were hidden in the footnotes rather than shown as debt on the balance sheet.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                    <h4 className="font-bold text-primary-foreground mb-4">The Result?</h4>
                                    <p className="text-sm text-primary-foreground/70 m-0">
                                        Investors had to &quot;add back&quot; these hidden debts to get a true picture of a company&apos;s gearing (leverage). IFRS 16 solved this by requiring almost all leases to be recognized on the SOFP.
                                    </p>
                                </div>
                            </section>

                            {/* The Single Lessee Model */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Single Lessee Model
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    This is the most critical change. Except for very specific exemptions, a lessee no longer distinguishes between &apos;finance&apos; and &apos;operating&apos; leases.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">The Asset</h3>
                                        <p className="text-xs text-primary-foreground/70 mb-0 leading-relaxed font-bold">Right-of-Use (ROU) Asset</p>
                                        <p className="text-[10px] text-primary-foreground/50 m-0">Representing the right to use the underlying asset.</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">The Liability</h3>
                                        <p className="text-xs text-primary-foreground/70 mb-0 leading-relaxed font-bold">Lease Liability</p>
                                        <p className="text-[10px] text-primary-foreground/50 m-0">Representing the obligation to make lease payments.</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <p className="text-sm text-primary-foreground/80 m-0 leading-relaxed">
                                        <strong className="text-primary-foreground">Lessor Accounting:</strong> Interestingly, for lessors, the old IAS 17 model remains largely the same. They still distinguish between operating and finance leases.
                                    </p>
                                </div>
                            </section>

                            {/* Definition of a Lease */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Is it actually a Lease?
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    A contract is, or contains, a lease if it conveys the <strong className="text-primary-foreground">right to control</strong> the use of an <strong className="text-primary-foreground text-md">identified asset</strong> for a period of time in exchange for consideration.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-primary-foreground mb-1 text-sm">Identified Asset</h4>
                                            <p className="text-[11px] text-primary-foreground/70 m-0">The asset must be explicitly or implicitly specified. If the supplier has <strong className="text-primary-foreground">substantive substitution rights</strong>, it is not an identified asset.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-primary-foreground mb-1 text-sm">Control</h4>
                                            <p className="text-[11px] text-primary-foreground/70 m-0">The customer must have the right to obtain <strong className="text-primary-foreground uppercase font-bold">substantially all</strong> economic benefits and the right to direct the use of the asset.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Exemptions */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    The &quot;Escape Clauses&quot; (Exemptions)
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    You can choose NOT to apply the ROU model for:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-primary-foreground text-xs uppercase m-0">Short-Term Leases</h4>
                                            <p className="text-[10px] text-primary-foreground/60 m-0 mt-1">12 months or less, with no purchase option.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-primary-foreground text-xs uppercase m-0">Low-Value Assets</h4>
                                            <p className="text-[10px] text-primary-foreground/60 m-0 mt-1">Think tablets, office furniture, or small IT equipment (typically &lt; $5,000 when new).</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-accent/10 rounded-xl p-5 border border-accent/20 text-xs text-primary-foreground/70 italic text-center leading-relaxed">
                                    If you use these exemptions, you simply recognize the lease payments as an <strong className="text-primary-foreground">expense</strong> on a straight-line basis over the lease term—just like the old operating lease model.
                                </div>
                            </section>

                            {/* Next Steps */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-4">
                                    Coming Up Next
                                </h2>
                                <p className="text-primary-foreground/70 mb-8">
                                    In Part 2, we will master the technical mechanics: how to calculate the initial value of that <strong className="text-primary-foreground">Lease Liability</strong> and the <strong className="text-primary-foreground">ROU Asset</strong>.
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                                    <Button asChild variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground">
                                        <Link href="/guides/ifrs-16">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to IFRS 16
                                        </Link>
                                    </Button>
                                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                        <Link href="/guides/ifrs-16/part-2">
                                            Part 2: Initial Measurement
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </section>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                                Confused about Substitution Rights or Control?
                            </h3>
                            <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto leading-relaxed">
                                Identifying whether a contract contains a lease is the most common &quot;Theory&quot; question in IFRS 16. Let&apos;s make sure you can argue it effectively.
                            </p>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Ask Priyanka on WhatsApp
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
