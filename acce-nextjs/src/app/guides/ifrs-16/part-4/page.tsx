import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, ShoppingCart, Repeat, Calculator, Info, Lightbulb, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 4: Sale and Leaseback (IFRS 16) | ACCE Tutors",
    description: "Master the accounting for sale and leaseback transactions, including the 'Proportion' method for gains and handling 'failed sales'.",
    keywords: "IFRS 16 sale and leaseback, IFRS 15 sale criteria, ROU asset sale and leaseback, gain on sale and leaseback, failed sale accounting",
    alternates: {
        canonical: "/guides/ifrs-16/part-4/",
    },
};

export default function IFRS16Part4Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                        <Link
                            href="/guides/ifrs-16/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to IFRS 16
                        </Link>
                        <div className="flex items-center gap-4">
                            {isGuidePdfPublished("ifrs-16") && (
                            <a
                                href="/pdfs/ifrs-16-leases.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            )}
                            <div className="text-muted-foreground text-sm">
                                Part 4 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                                Part 4: Special Transactions
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Sale and Leaseback Transactions
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                A sale and leaseback occurs when an entity sells an asset and then leases it back from the buyer. This is a classic exam &quot;level 3&quot; topic.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Step 1: Is it a sale? */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Step 1: Is it a &quot;Sale&quot;?
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    You must check if the transfer of the asset is a &quot;sale&quot; according to <strong className="text-foreground font-bold">IFRS 15</strong> (Revenue from Contracts with Customers).
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            NOT a Sale
                                        </h4>
                                        <p className="text-xs text-muted-foreground m-0">The &quot;seller-lessee&quot; continues to recognize the asset and accounts for the proceeds as a <strong className="text-foreground">Financial Liability</strong> (essentially a loan).</p>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                            <ShoppingCart className="w-4 h-4" />
                                            YES, it&apos;s a Sale
                                        </h4>
                                        <p className="text-xs text-muted-foreground m-0">Account for the transaction as a sale and a leaseback using the ROU model.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: If it is a Sale */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    If it is a Sale: The Proportion Model
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6 font-medium italic">
                                    The key trick here: You do NOT recognize the full gain on the sale.
                                </p>

                                <div className="space-y-6">
                                    <div className="p-6 bg-card border border-border rounded-xl">
                                        <h4 className="font-bold text-foreground mb-4 text-xs uppercase tracking-widest text-accent">Calculation Roadmap:</h4>
                                        <ol className="text-sm text-muted-foreground space-y-4 m-0 p-0 list-decimal ml-4">
                                            <li>
                                                <strong className="text-foreground">ROU Asset:</strong> Previous carrying amount × (Lease Liability ÷ Fair Value of Asset).
                                            </li>
                                            <li>
                                                <strong className="text-foreground">Gain on Sale:</strong> Full Gain × ([Fair Value - Lease Liability] ÷ Fair Value).
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 flex gap-4">
                                        <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                        <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                                            We only recognize the gain that relates to the <strong className="text-foreground">Rights Transferred</strong> to the buyer-lessor. The portion of the gain relating to the right to use the asset that we&apos;ve kept is offset against the ROU asset.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Adjustments for Non-Fair Value */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    Adjustments for Non-Fair Value
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If the sale price or the lease payments are NOT at market value, we must adjust:
                                </p>
                                <ul className="space-y-3 p-0 m-0 list-none">
                                    <li className="flex gap-3 p-4 bg-card rounded-xl border border-border text-xs">
                                        <Repeat className="w-4 h-4 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground uppercase">Below Market:</strong> Account for as a prepayment of lease payments.</span>
                                    </li>
                                    <li className="flex gap-3 p-4 bg-card rounded-xl border border-border text-xs">
                                        <Repeat className="w-4 h-4 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground uppercase">Above Market:</strong> Account for as additional financing provided by the buyer-lessor to the seller-lessee.</span>
                                    </li>
                                </ul>
                            </section>

                            {/* Exam Tip */}
                            <section className="mb-12">
                                <div className="bg-card border border-border rounded-xl p-8">
                                    <div className="flex gap-4">
                                        <Lightbulb className="w-8 h-8 text-accent flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-foreground mb-2">Exam Hack: Total Sanity Check</h3>
                                            <p className="text-sm text-muted-foreground m-0 leading-relaxed italic">
                                                In a Sale and Leaseback, your <strong className="text-foreground">ROU Asset</strong> and your <strong className="text-foreground">Gain on Sale</strong> are always linked. If one is wrong, both are wrong. Use the formula:
                                                <br />
                                                <span className="block mt-2 font-mono text-[10px] bg-black/40 p-2 rounded text-accent">Recognised Gain = [Total Gain] - [Total Gain * (ROU Asset / Previous Carrying Amount)]</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-16/part-3">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 3: Subsequent Measurement
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-center">
                                <Link href="/guides/ifrs-16/part-5">
                                    Part 5: Lessor & Prep
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3 font-display">
                                Finding the Sale & Leaseback Calculation Tricky?
                            </h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg mx-auto">
                                This is one of the most common &quot;big mark&quot; scenarios in CTA Level 2 and Initial Test of Competence (ITC) exams. Let&apos;s master it.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    WhatsApp for a Practical Example
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
