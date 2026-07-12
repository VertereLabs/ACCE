import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Gavel, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuideCompletionCard from "@/components/GuideCompletionCard";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 5: IFRS 16 Lessor Accounting & Exam Prep | ACCE Tutors",
    description: "Learn how lessors classify and account for leases, and get a foolproof strategy for lease recognition exam questions.",
    keywords: "IFRS 16 lessor accounting, finance lease vs operating lease lessor, lease classification criteria, accounting exam strategy, CA(SA) leases",
    alternates: {
        canonical: "/guides/ifrs-16/part-5/",
    },
};

export default function IFRS16Part5Page() {
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
                                Part 5 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                                Part 5: Finalizing Leases
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
                                Lessor Accounting & Exam Strategy
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                While the lessee model changed drastically, lessor accounting remains largely unchanged from IAS 17. Let&apos;s wrap up our IFRS 16 journey.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Lessor Classification */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Lessor Classification
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Unlike lessees, lessors must still classify a lease as either <strong className="text-foreground">Finance</strong> or <strong className="text-foreground">Operating</strong>.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8 text-[11px]">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-display font-semibold text-accent mb-3 uppercase tracking-widest text-[10px]">Finance Lease</h4>
                                        <p className="text-muted-foreground mb-4 font-medium italic">A lease that transfers <strong className="text-foreground">substantially all</strong> the risks and rewards incidental to ownership.</p>
                                        <div className="p-3 bg-accent/10 rounded-lg text-muted-foreground leading-relaxed">
                                            <strong className="text-foreground">ACCOUNTING:</strong> Derecognize the asset and recognize a <strong className="text-foreground">Lease Receivable</strong>.
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-display font-semibold text-blue-400 mb-3 uppercase tracking-widest text-[10px]">Operating Lease</h4>
                                        <p className="text-muted-foreground mb-4 font-medium italic">All other leases that do not transfer risks and rewards.</p>
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-muted-foreground leading-relaxed">
                                            <strong className="text-foreground">ACCOUNTING:</strong> Keep the asset on the SOFP. Recognize lease income on a <strong className="text-foreground">Straight-Line</strong> basis.
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Classification Criteria */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Is it Finance or Operating?
                                </h2>
                                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                                    <h4 className="font-bold text-foreground mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                                        <Gavel className="w-4 h-4 text-accent" />
                                        Primary Indicators of a Finance Lease:
                                    </h4>
                                    <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
                                        {[
                                            "Ownership transfers to lessee at end of term.",
                                            "Lessee has a 'bargain' purchase option.",
                                            "Lease term is for the major part of the asset's economic life.",
                                            "PV of lease payments is substantially all of the asset's fair value.",
                                            "Asset is of a specialized nature (only lessee can use it)."
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Exam Success Roadmap */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    The IFRS 16 Exam Roadmap
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Lease questions are long and calculation-heavy. Follow this order to stay organized and pick up all the marks.
                                </p>

                                <div className="space-y-8">
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">1</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Define the Lease & Term</h4>
                                        <p className="text-xs text-muted-foreground m-0">What is the identified asset? What is the non-cancellable period plus extension options?</p>
                                    </div>
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">2</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Determine the Discount Rate</h4>
                                        <p className="text-xs text-muted-foreground m-0 text-balance">Quote the rule for Implicit Rate vs IBR. Always search for the implicit rate first.</p>
                                    </div>
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8 text-balance">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">3</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Initial Measurement (The Day 1 Box)</h4>
                                        <p className="text-xs text-muted-foreground m-0">Show your workings for the PV of the liability and the bundle of costs that make up the ROU asset.</p>
                                    </div>
                                    <div className="relative pl-10 ml-4 pb-4">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">4</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Subsequent Amortization & Depreciation</h4>
                                        <p className="text-xs text-muted-foreground m-0 text-balance">Prepare an amortization table. It makes calculating interest and carrying amounts foolproof.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Coming Soon Note */}
                            <div className="bg-card border border-border rounded-xl p-6 mb-12">
                                <p className="text-muted-foreground text-sm m-0">
                                    <strong className="text-foreground">Coming soon:</strong> full guides with detailed worked examples and solutions. Keep an eye on this page.
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-16/part-4/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 4: Sale & Leaseback
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/">
                                    Master All Standards
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* Guide Completion Card */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <GuideCompletionCard guide="ifrs-16" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
