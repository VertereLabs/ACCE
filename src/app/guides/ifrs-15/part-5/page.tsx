import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, FileText, LayoutList, GraduationCap, CheckCircle2, AlertCircle, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 5: IFRS 15 Disclosures & Exam Prep | ACCE Tutors",
    description: "Wrap up your IFRS 15 journey with a guide to disclosure requirements and a strategy for tackling revenue recognition exam questions.",
    keywords: "IFRS 15 disclosures, contract assets, contract liabilities, revenue recognition exam strategy, accounting exam tips, CA(SA), CTA",
    alternates: {
        canonical: "/guides/ifrs-15/part-5/",
    },
};

export default function IFRS15Part5Page() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/ifrs-15/"
                            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
                            <div className="text-primary-foreground/40 text-sm">
                                Part 5 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 5: Finalizing
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
                                Disclosures & Exam Preparation
                            </h1>
                            <p className="text-primary-foreground/60 text-lg leading-relaxed">
                                The best way to show you understand IFRS 15 is to structure your disclosures correctly and answer exam questions with precision.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Disclosure Requirements */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Key Disclosure Requirements
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    IFRS 15 requires both qualitative and quantitative information. Investors want to see where the money comes from and how certain those future cash flows are.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center gap-2 text-primary-foreground mb-3">
                                            <LayoutList className="w-4 h-4 text-accent" />
                                            <h4 className="font-bold text-sm m-0 tracking-tight">Disaggregation of Revenue</h4>
                                        </div>
                                        <p className="text-xs text-primary-foreground/60 leading-relaxed m-0">Break down revenue into categories (e.g., product lines, regions, timing of transfer) that show how economic factors affect it.</p>
                                    </div>
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center gap-2 text-primary-foreground mb-3">
                                            <FileText className="w-4 h-4 text-accent" />
                                            <h4 className="font-bold text-sm m-0 tracking-tight">Contract Balances</h4>
                                        </div>
                                        <p className="text-xs text-primary-foreground/60 leading-relaxed m-0">Show opening and closing balances of contract assets, contract liabilities, and receivables.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Important Definitions for Disclosure */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The &quot;Contractual&quot; Line Items
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h4 className="font-bold text-accent mb-2 text-sm uppercase">Contract Asset</h4>
                                        <p className="text-sm text-primary-foreground/70 m-0">An entity&apos;s right to consideration in exchange for goods/services that the entity has transferred. It is <strong className="text-primary-foreground">conditional</strong> on something other than the passage of time (e.g., entity must satisfy another PO).</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h4 className="font-bold text-accent mb-2 text-sm uppercase">Contract Liability</h4>
                                        <p className="text-sm text-primary-foreground/70 m-0">An entity&apos;s obligation to transfer goods/services to a customer for which the entity has received (or is due) consideration. (Essentially, Deferred Revenue).</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Exam Prep Strategy */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    Exam Preparation Strategy
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    Revenue questions are often worth 25-35 marks. Use this roadmap to ensure you don&apos;t miss the &quot;low-hanging fruit&quot; marks.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">01</div>
                                        <div>
                                            <h4 className="font-bold text-primary-foreground mb-2">Structure your answer by the FIVE STEPS</h4>
                                            <p className="text-sm text-primary-foreground/60 leading-relaxed">Even if the question is only about Step 3, briefly reference the fact that a valid contract and POs have been identified. It sets a professional tone for your response.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">02</div>
                                        <div>
                                            <h4 className="font-bold text-primary-foreground mb-2">Quote the &quot;Control&quot; transfer criteria</h4>
                                            <p className="text-sm text-primary-foreground/60 leading-relaxed">In Step 5, don&apos;t just say &quot;Revenue is recognized.&quot; Explain <strong className="text-primary-foreground">why</strong> by referencing indicators like legal title, physical possession, or risks/rewards.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">03</div>
                                        <div>
                                            <h4 className="font-bold text-primary-foreground mb-2">Show your SASP calculations clearly</h4>
                                            <p className="text-sm text-primary-foreground/60 leading-relaxed">Examiners give partial marks for correct methods even if the final number is wrong. Use tables for Step 4 allocations.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Conclusion */}
                            <section className="mb-12">
                                <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8">
                                    <div className="flex items-start gap-4">
                                        <GraduationCap className="w-8 h-8 text-accent flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">You&apos;ve Mastered IFRS 15!</h3>
                                            <p className="text-sm text-primary-foreground/80 m-0 leading-relaxed italic">
                                                From the core principle to complex repurchase agreements, you now have the tools to tackle revenue recognition with confidence. Practice as many past papers as you can—revenue is all about identifying those subtle &quot;hooks&quot; in the question narrative.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/10">
                            <Button asChild variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground">
                                <Link href="/guides/ifrs-15/part-4">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 4: Complex Scenarios
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/">
                                    Back to All Guides
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* Final CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
                            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
                                Ready to Test Your Knowledge?
                            </h3>
                            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto leading-relaxed text-balance">
                                Get one-on-one coaching to review your past paper attempts and squash any recurring mistakes.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10 h-14 text-lg">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book Final Review
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
