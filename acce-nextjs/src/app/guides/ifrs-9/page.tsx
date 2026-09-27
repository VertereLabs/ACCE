import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, Target, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "IFRS 9: Financial Instruments | ACCE Tutors Study Guides",
    description: "IFRS 9 guide to classifying and measuring financial instruments, expected credit losses, derecognition, and hedge accounting, with IAS 39 comparisons.",
    keywords: "IFRS 9, financial instruments, IAS 39, IAS 32, IFRS 7, SPPI, business model test, amortised cost, FVOCI, FVTPL, expected credit loss, ECL, hedge accounting, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/ifrs-9/",
    },
};

const parts = [
    {
        id: 1,
        title: "Scope & Introduction",
        description: "Why IFRS 9 replaced IAS 39, what counts as a financial instrument, and what falls inside and outside the scope.",
        status: "available",
        topics: ["IAS 32 Definitions", "Scope Exclusions", "IAS 39 vs IFRS 9", "Transition"],
    },
    {
        id: 2,
        title: "Classifying Financial Assets",
        description: "Apply the business model test and the SPPI test to land every financial asset in the right category.",
        status: "available",
        topics: ["Business Model Test", "SPPI Test", "Equity OCI Election", "Reclassification"],
    },
    {
        id: 3,
        title: "Measuring Financial Assets",
        description: "Initial measurement, the effective interest method, and subsequent measurement at amortised cost, FVOCI and FVTPL.",
        status: "available",
        topics: ["Transaction Costs", "Effective Interest Rate", "FVOCI Recycling", "FVTPL"],
    },
    {
        id: 4,
        title: "Financial Liabilities",
        description: "Classify and measure financial liabilities, including own credit risk on FVTPL liabilities and compound instruments.",
        status: "available",
        topics: ["Amortised Cost", "Fair Value Option", "Own Credit Risk", "Compound Instruments"],
    },
    {
        id: 5,
        title: "Derecognition",
        description: "Work through the derecognition decision tree for financial assets and the substantial modification test for liabilities.",
        status: "available",
        topics: ["Risks & Rewards", "Control", "Factoring", "10% Test"],
    },
    {
        id: 6,
        title: "Impairment (ECL)",
        description: "The expected credit loss model: the three stages, SICR, the simplified approach, and POCI assets.",
        status: "available",
        topics: ["Three-Stage Model", "PD x LGD x EAD", "SICR", "Simplified Approach"],
    },
    {
        id: 7,
        title: "Hedge Accounting: IAS 39",
        description: "The IAS 39 hedge accounting framework, still examinable and still applied by some entities under the transition election.",
        status: "available",
        topics: ["Fair Value Hedges", "Cash Flow Hedges", "Net Investment Hedges", "80–125% Rule"],
    },
    {
        id: 8,
        title: "Hedge Accounting: IFRS 9",
        description: "The principles-based IFRS 9 model: economic relationship, rebalancing, risk components and costs of hedging.",
        status: "available",
        topics: ["Effectiveness", "Rebalancing", "Risk Components", "Costs of Hedging"],
    },
    {
        id: 9,
        title: "Disclosures & Exam Strategy",
        description: "IFRS 7 disclosures, IAS 32 presentation, and a complete exam strategy across the whole of IFRS 9.",
        status: "available",
        topics: ["IFRS 7", "IAS 32 Offsetting", "Exam Strategy", "Quick Reference"],
    },
];

export default function IFRS9GuidePage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        href="/guides/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Guides
                    </Link>

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                                Advanced
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                9 Parts
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            IFRS 9: Financial Instruments
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            IFRS 9 replaced IAS 39 after the 2008 financial crisis showed that losses were being recognised far too late. This guide covers the full standard: how to classify and measure financial assets and liabilities, when to derecognise them, how the expected credit loss model works, and hedge accounting under both IAS 39 and IFRS 9.
                        </p>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-semibold">{parts.length}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Parts</span>
                            </div>
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Target className="w-4 h-4" />
                                    <span className="font-semibold">{parts.filter(p => p.status === "available").length}/{parts.length}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Available</span>
                            </div>
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Layers className="w-4 h-4" />
                                    <span className="font-semibold">3</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Asset Categories</span>
                            </div>
                        </div>

                        {/* Download Full Guide */}
                        {isGuidePdfPublished("ifrs-9") && (
                        <div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                                        Download Complete Guide
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Get the full 9-part guide with detailed examples, worked solutions, and exam tips (PDF, 1.2MB)
                                    </p>
                                </div>
                                <Button asChild variant="hero" className="shrink-0">
                                    <a href="/pdfs/ifrs-9-financial-instruments.pdf" download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </a>
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Key Change Highlight */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
                            <h2 className="font-display text-xl font-bold text-foreground mb-3">
                                ⚠️ The Big Change from IAS 39
                            </h2>
                            <p className="text-muted-foreground">
                                IAS 39 was backward-looking: credit losses were only recognised once they had been incurred. IFRS 9 is forward-looking: an expected credit loss allowance is recognised from day one. Alongside this, four asset categories built on management intention became three categories driven by the business model and the contractual cash flows, and rigid 80–125% hedge effectiveness testing gave way to a principles-based economic relationship test.
                            </p>
                        </div>
                    </div>



                    {/* Preview of Parts */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
                            Course Content
                        </h2>
                        <div className="space-y-4">
                            {parts.map((part) => {
                                const inner = (
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${part.status === "available"
                                                ? "bg-accent/20 text-accent"
                                                : "bg-muted text-muted-foreground"
                                                }`}>
                                                {part.id}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-display text-lg font-semibold text-foreground">
                                                        {part.title}
                                                    </h3>
                                                    {part.status === "coming-soon" && (
                                                        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground text-sm mb-3">
                                                    {part.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {part.topics.map((topic) => (
                                                        <span
                                                            key={topic}
                                                            className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                                                        >
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {part.status === "available" && (
                                            <span className="inline-flex items-center text-accent text-sm font-medium whitespace-nowrap shrink-0">
                                                Start Part {part.id}
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </span>
                                        )}
                                    </div>
                                );
                                return part.status === "available" ? (
                                    <Link
                                        key={part.id}
                                        href={`/guides/ifrs-9/part-${part.id}`}
                                        className="group block bg-card backdrop-blur-md rounded-xl border border-border p-6 transition-all duration-300 hover:bg-muted"
                                    >
                                        {inner}
                                    </Link>
                                ) : (
                                    <div
                                        key={part.id}
                                        className="group bg-card backdrop-blur-md rounded-xl border border-border p-6 opacity-60"
                                    >
                                        {inner}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Classification Categories Preview */}
                    <div className="max-w-4xl mx-auto mt-12">
                        <div className="bg-card rounded-2xl border border-border p-8">
                            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                                The Three Financial Asset Categories
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-card rounded-lg p-4">
                                    <h4 className="text-foreground font-medium mb-2">Amortised Cost</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Held to collect contractual cash flows, and those cash flows are solely payments of principal and interest (SPPI).
                                    </p>
                                </div>
                                <div className="bg-card rounded-lg p-4">
                                    <h4 className="text-foreground font-medium mb-2">FVOCI</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Held to collect and sell, with SPPI cash flows. Equity investments can also be irrevocably elected into FVOCI.
                                    </p>
                                </div>
                                <div className="bg-card rounded-lg p-4">
                                    <h4 className="text-foreground font-medium mb-2">FVTPL</h4>
                                    <p className="text-muted-foreground text-sm">
                                        The residual category: everything that fails the business model or SPPI test, plus derivatives and held-for-trading assets.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Need Extra Support with IFRS 9?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                While these guides cover everything you need for the exams, some topics are tricky. Book a session with Priyanka for personalized guidance.
                            </p>
                            <Button asChild variant="hero">
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
