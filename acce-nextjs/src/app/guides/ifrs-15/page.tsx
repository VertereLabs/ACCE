import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, Target, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "IFRS 15 Revenue Guide | ACCE Tutors",
    description: "IFRS 15 guide covering the five-step model, performance obligations, variable consideration, and exam-focused tips for CA(SA) and CTA.",
    keywords: "IFRS 15, revenue recognition, five step model, performance obligations, variable consideration, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/ifrs-15/",
    },
};

const parts = [
    {
        id: 1,
        title: "Foundations & Core Principle",
        description: "Why IFRS 15 was introduced, replacing IAS 18 & IAS 11, scope, and the core principle of revenue recognition.",
        status: "available",
        topics: ["Introduction", "Scope", "Core Principle", "Key Definitions"],
    },
    {
        id: 2,
        title: "The Five-Step Model (Deep Dive)",
        description: "Master each step: identify contract, identify performance obligations, determine transaction price, allocate, and recognize.",
        status: "available",
        topics: ["Step 1-5", "Contract Modifications", "Control Transfer"],
    },
    {
        id: 3,
        title: "Variable Consideration & Financing",
        description: "Handle discounts, rebates, performance bonuses, and the time value of money in contracts.",
        status: "available",
        topics: ["Variable Consideration", "Constraint", "Financing Component"],
    },
    {
        id: 4,
        title: "Complex Application Scenarios",
        description: "Master tricky topics like warranties, principal vs. agent, and repurchase agreements.",
        status: "available",
        topics: ["Warranties", "Principal vs Agent", "Repurchase Agreements"],
    },
    {
        id: 5,
        title: "Disclosures & Exam Preparation",
        description: "Disclosure requirements, common exam mistakes, and practice questions with worked solutions.",
        status: "available",
        topics: ["Disclosures", "Exam Tips", "Practice Questions"],
    },
];

export default function IFRS15GuidePage() {
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
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                Intermediate
                            </span>
                            <span className="px-3 py-1 rounded-full bg-card text-muted-foreground text-sm">
                                5 Parts
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            IFRS 15: Revenue from Contracts with Customers
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            IFRS 15 establishes a comprehensive framework for revenue recognition, replacing IAS 18 and IAS 11. The five-step model is the heart of this standard: master it and you&apos;ll unlock consistent revenue recognition across any scenario.
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
                                    <Receipt className="w-4 h-4" />
                                    <span className="font-semibold">5</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Steps Model</span>
                            </div>
                        </div>

                        {/* Download Full Guide */}
                        {isGuidePdfPublished("ifrs-15") && (
                        <div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                                        Download Complete Guide
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Get the full 9-part guide with detailed examples, worked solutions, and exam tips (PDF, 155KB)
                                    </p>
                                </div>
                                <Button asChild variant="hero" className="shrink-0">
                                    <a href="/pdfs/ifrs-15-revenue.pdf" download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </a>
                                </Button>
                            </div>
                        </div>
                        )}
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
                                                : "bg-card text-muted-foreground"
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
                                        href={`/guides/ifrs-15/part-${part.id}`}
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

                    {/* CTA Section */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Need Extra Support with IFRS 15?
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
