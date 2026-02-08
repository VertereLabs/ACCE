import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Calculator, Coins, Landmark, Plus, Equal, Lightbulb, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 2: IFRS 16 Lessee Initial Measurement | ACCE Tutors",
    description: "Learn how to calculate the initial lease liability and right-of-use asset under IFRS 16, including PV of lease payments and discount rates.",
    keywords: "IFRS 16 initial measurement, lease liability calculation, right of use asset calculation, incremental borrowing rate, interest rate implicit in lease, lease payments",
    alternates: {
        canonical: "/guides/ifrs-16/part-2/",
    },
};

export default function IFRS16Part2Page() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/ifrs-16/"
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
                                Part 2 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                                Part 2: Day One Accounting
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                                Lessee Initial Measurement
                            </h1>
                            <p className="text-primary-foreground/60 text-lg leading-relaxed">
                                On the commencement date, the lessee must recognize both an asset and a liability. Getting the numbers right on Day 1 is crucial for everything that follows.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Lease Liability */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    1. Initial Lease Liability
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The lease liability is measured at the <strong className="text-primary-foreground">Present Value (PV)</strong> of the lease payments that are not paid at the commencement date.
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                                    <h4 className="font-bold text-primary-foreground mb-4 text-xs uppercase tracking-widest text-accent">What is a &quot;Lease Payment&quot;?</h4>
                                    <ul className="space-y-3 p-0 m-0 list-none">
                                        {[
                                            { title: "Fixed Payments", detail: "Minus any lease incentives receivable." },
                                            { title: "Variable Payments", detail: "Only if they depend on an index or rate (e.g., CPI)." },
                                            { title: "Residual Value Guarantees", detail: "Amounts the lessee expects to pay." },
                                            { title: "Purchase Option Price", detail: "If the lessee is reasonably certain to exercise it." },
                                            { title: "Termination Penalties", detail: "If the lease term reflects the lessee exercising the option to terminate." }
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                <p className="m-0"><strong className="text-primary-foreground">{item.title}:</strong> <span className="text-primary-foreground/60">{item.detail}</span></p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2: Discount Rate */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    2. Choosing the Discount Rate
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Landmark className="w-5 h-5 text-accent" />
                                            <h4 className="font-bold text-primary-foreground m-0 text-sm uppercase">Implicit Rate</h4>
                                        </div>
                                        <p className="text-xs text-primary-foreground/60 leading-relaxed m-0 italic">
                                            The rate that causes the PV of (lease payments + unguaranteed residual value) to equal the Fair Value of the asset + direct costs.
                                        </p>
                                        <div className="mt-4 p-2 bg-accent/10 rounded text-[10px] text-accent font-bold text-center">FIRST CHOICE</div>
                                    </div>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Calculator className="w-5 h-5 text-accent" />
                                            <h4 className="font-bold text-primary-foreground m-0 text-sm uppercase">Incremental Borrowing Rate (IBR)</h4>
                                        </div>
                                        <p className="text-xs text-primary-foreground/60 leading-relaxed m-0 italic">
                                            The rate the lessee would have to pay to borrow (over a similar term, and with similar security) the funds necessary to obtain an asset of similar value.
                                        </p>
                                        <div className="mt-4 p-2 bg-white/5 border border-white/10 rounded text-[10px] text-primary-foreground/40 font-bold text-center uppercase tracking-widest">USE IF IMPLICIT UNKNOWN</div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: ROU Asset Calculation */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    3. Right-of-Use (ROU) Asset
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The ROU asset is NOT always equal to the lease liability. It consists of more components:
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between font-mono text-sm underline decoration-accent/30 underline-offset-4 decoration-2">
                                            <span className="text-primary-foreground/60">Initial Lease Liability</span>
                                            <span className="text-primary-foreground">X</span>
                                        </div>
                                        <div className="flex items-center justify-between font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <Plus className="w-3 h-3 text-accent" />
                                                <span className="text-primary-foreground/60">Payments at/before commencement</span>
                                            </div>
                                            <span className="text-primary-foreground">X</span>
                                        </div>
                                        <div className="flex items-center justify-between font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <Plus className="w-3 h-3 text-accent" />
                                                <p className="text-primary-foreground/60 m-0">Lessee&apos;s Initial Direct Costs</p>
                                            </div>
                                            <span className="text-primary-foreground">X</span>
                                        </div>
                                        <div className="flex items-center justify-between font-mono text-sm border-b border-white/20 pb-4">
                                            <div className="flex items-center gap-2">
                                                <Plus className="w-3 h-3 text-accent" />
                                                <span className="text-primary-foreground/60">Decommissioning / Removal Costs (IAS 37)</span>
                                            </div>
                                            <span className="text-primary-foreground">X</span>
                                        </div>
                                        <div className="flex items-center justify-between font-mono text-lg pt-4">
                                            <div className="flex items-center gap-2 font-display font-bold">
                                                <Equal className="w-4 h-4 text-accent" />
                                                <span className="text-primary-foreground">INITIAL ROU ASSET</span>
                                            </div>
                                            <span className="text-accent font-bold underline decoration-accent decoration-2 underline-offset-8">TOTAL</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                                    <div className="flex gap-4">
                                        <Lightbulb className="w-8 h-8 text-accent flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">Exam Hack: The Timeline</h3>
                                            <p className="text-sm text-primary-foreground/80 m-0 leading-relaxed italic">
                                                Always draw a timeline for lease questions. Distinguish between payments made <strong className="text-primary-foreground uppercase underline decoration-accent underline-offset-4 decoration-2">At Commencement</strong> (Only ROU, not Liability) and <strong className="text-primary-foreground uppercase underline decoration-accent underline-offset-4 decoration-2">After Commencement</strong> (Both).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/10">
                            <Button asChild variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground transition-all">
                                <Link href="/guides/ifrs-16/part-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 1: Key Changes
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20">
                                <Link href="/guides/ifrs-16/part-3">
                                    Part 3: Subsequent Measurement
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3 font-display">
                                Stuck on Discount Rates or PV?
                            </h3>
                            <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto leading-relaxed">
                                Don&apos;t let the math distract you from the logic. We can help you build a spreadsheet model or master the calculator steps for your exam.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10 h-12">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Practice With Me
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
