import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, Target, Receipt, HelpCircle, CheckCircle2, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 1: IFRS 15 Foundations & Core Principle | ACCE Tutors",
    description: "Understand why IFRS 15 was introduced, its scope, and the core principle that governs revenue recognition for all contracts with customers.",
    keywords: "IFRS 15, revenue recognition, core principle, scope, IAS 18, IAS 11, accounting standards, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/ifrs-15/part-1/",
    },
};

export default function IFRS15Part1Page() {
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
                                Part 1 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 1: Foundations
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                IFRS 15: Foundations & Core Principle
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Revenue is the single most important metric for most businesses. IFRS 15 ensures it&apos;s reported consistently, regardless of the industry.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Why IFRS 15? */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Shift to a Single Framework
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Before IFRS 15, revenue was governed by several different standards (IAS 18 for goods/services, IAS 11 for construction). This created inconsistency, especially for complex bundles (e.g., a phone with a service contract).
                                </p>
                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">What changed?</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground list-none p-0 m-0">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                            <span><strong className="text-foreground">Consistency:</strong> One five-step model for everyone.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                            <span><strong className="text-foreground">Better Disclosure:</strong> Investors get more detail on the &quot;unearned&quot; revenue and contract assets.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                            <span><strong className="text-foreground">Allocation:</strong> Clear rules for how to split the price between a &quot;free&quot; handset and a monthly service.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* The Core Principle */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Core Principle
                                </h2>
                                <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 mb-6">
                                    <p className="text-xl font-display font-medium text-foreground leading-relaxed m-0 text-center italic">
                                        &quot;Recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled.&quot;
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-sm italic text-center">
                                    (IFRS 15.2)
                                </p>
                            </section>

                            {/* Scope */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Scope: What is NOT in IFRS 15?
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    While IFRS 15 is broad, some transactions are handled by other specific standards:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-card rounded-xl border border-border">
                                        <h4 className="font-bold text-red-400 mb-1">Lease Contracts</h4>
                                        <p className="text-xs text-muted-foreground">IFRS 16 (Leases) takes precedence here.</p>
                                    </div>
                                    <div className="p-4 bg-card rounded-xl border border-border">
                                        <h4 className="font-bold text-blue-400 mb-1">Insurance Contracts</h4>
                                        <p className="text-xs text-muted-foreground">Governed by IFRS 17.</p>
                                    </div>
                                    <div className="p-4 bg-card rounded-xl border border-border">
                                        <h4 className="font-bold text-purple-400 mb-1">Financial Instruments</h4>
                                        <p className="text-xs text-muted-foreground">IFRS 9 handles interest and dividends.</p>
                                    </div>
                                    <div className="p-4 bg-card rounded-xl border border-border">
                                        <h4 className="font-bold text-accent mb-1">Non-Monetary Exchanges</h4>
                                        <p className="text-xs text-muted-foreground">Between entities in the same line of business.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Key Definitions */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Key Definitions
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Receipt className="w-6 h-6 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Customer</h4>
                                            <p className="text-sm text-muted-foreground m-0">A party that has contracted with an entity to obtain goods or services that are an output of the entity&apos;s ordinary activities.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Receipt className="w-6 h-6 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Income vs Revenue</h4>
                                            <p className="text-sm text-muted-foreground m-0">Income is the broad category. <strong className="text-foreground">Revenue</strong> is specifically income arising in the course of an entity&apos;s <strong className="text-foreground">ordinary activities</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Summary & Next Steps */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    The Road Ahead
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Now that we have the foundations, we can dive into the heart of IFRS 15: the <strong className="text-foreground">Five-Step Model</strong>. This model is what you will apply in every single exam question.
                                </p>

                                <div className="bg-card border border-border rounded-xl p-8 text-center">
                                    <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                                    <h3 className="font-display text-xl font-bold text-foreground mb-2">Ready for the Deep Dive?</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                        Continue to Part 2 to master the five steps that govern all revenue recognition.
                                    </p>
                                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                        <Link href="/guides/ifrs-15/part-2">
                                            Part 2: The Five-Step Model
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </section>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Struggling with the Core Principle?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Revenue recognition is a high-yield topic in PGDA and CTA exams. Let&apos;s make sure you get those easy marks first.
                            </p>
                            <Button asChild variant="outline" className="border-border hover:bg-muted text-foreground">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Help Me With Revenue
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
