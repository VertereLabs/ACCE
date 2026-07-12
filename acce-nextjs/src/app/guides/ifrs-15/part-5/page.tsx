import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, FileText, LayoutList, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuideCompletionCard from "@/components/GuideCompletionCard";
import { isGuidePdfPublished } from "@/config/guides";

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
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                        <Link
                            href="/guides/ifrs-15/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to IFRS 15
                        </Link>
                        <div className="flex items-center gap-4">
                            {isGuidePdfPublished("ifrs-15") && (
                            <a
                                href="/pdfs/ifrs-15-revenue.pdf"
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
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 5: Finalizing
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
                                Disclosures & Exam Preparation
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                The best way to show you understand IFRS 15 is to structure your disclosures correctly and answer exam questions with precision.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Disclosure Requirements */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Key Disclosure Requirements
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 15 requires both qualitative and quantitative information. Investors want to see where the money comes from and how certain those future cash flows are.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                    <div className="p-5 bg-card border border-border rounded-xl">
                                        <div className="flex items-center gap-2 text-foreground mb-3">
                                            <LayoutList className="w-4 h-4 text-accent" />
                                            <h4 className="font-bold text-sm m-0 tracking-tight">Disaggregation of Revenue</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed m-0">Break down revenue into categories (e.g., product lines, regions, timing of transfer) that show how economic factors affect it.</p>
                                    </div>
                                    <div className="p-5 bg-card border border-border rounded-xl">
                                        <div className="flex items-center gap-2 text-foreground mb-3">
                                            <FileText className="w-4 h-4 text-accent" />
                                            <h4 className="font-bold text-sm m-0 tracking-tight">Contract Balances</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed m-0">Show opening and closing balances of contract assets, contract liabilities, and receivables.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Important Definitions for Disclosure */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The &quot;Contractual&quot; Line Items
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-bold text-accent mb-2 text-sm uppercase">Contract Asset</h4>
                                        <p className="text-sm text-muted-foreground m-0">An entity&apos;s right to consideration in exchange for goods/services that the entity has transferred. It is <strong className="text-foreground">conditional</strong> on something other than the passage of time (e.g., entity must satisfy another PO).</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-bold text-accent mb-2 text-sm uppercase">Contract Liability</h4>
                                        <p className="text-sm text-muted-foreground m-0">An entity&apos;s obligation to transfer goods/services to a customer for which the entity has received (or is due) consideration. (Essentially, Deferred Revenue).</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Exam Prep Strategy */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    Exam Preparation Strategy
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Revenue questions are often worth 25-35 marks. Use this roadmap to ensure you don&apos;t miss the &quot;low-hanging fruit&quot; marks.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">01</div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">Structure your answer by the FIVE STEPS</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">Even if the question is only about Step 3, briefly reference the fact that a valid contract and POs have been identified. It shows you are able to identify the issue.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">02</div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">Quote the &quot;Control&quot; transfer criteria</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">In Step 5, don&apos;t just say &quot;Revenue is recognized.&quot; Explain <strong className="text-foreground">why</strong> by referencing indicators like legal title, physical possession, or risks/rewards.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex flex-shrink-0 items-center justify-center text-accent font-bold">03</div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">Show your SASP calculations clearly</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">Examiners give partial marks for correct methods even if the final number is wrong. Use tables for Step 4 allocations.</p>
                                        </div>
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
                                <Link href="/guides/ifrs-15/part-4">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 4: Complex Scenarios
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
                        <GuideCompletionCard guide="ifrs-15" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
