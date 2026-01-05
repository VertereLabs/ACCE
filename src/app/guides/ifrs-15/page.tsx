import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Target, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "IFRS 15: Revenue from Contracts with Customers | ACCE Tutors Study Guides",
    description: "Master revenue recognition with our comprehensive guide to IFRS 15. Learn the five-step model, variable consideration, performance obligations, and more.",
    keywords: "IFRS 15, revenue recognition, five step model, performance obligations, variable consideration, CA(SA), CTA, PGDA",
};

const parts = [
    {
        id: 1,
        title: "Foundations & Core Principle",
        description: "Why IFRS 15 was introduced, replacing IAS 18 & IAS 11, scope, and the core principle of revenue recognition.",
        duration: "30 min read",
        status: "available",
        topics: ["Introduction", "Scope", "Core Principle", "Key Definitions"],
    },
    {
        id: 2,
        title: "The Five-Step Model (Deep Dive)",
        description: "Master each step: identify contract, identify performance obligations, determine transaction price, allocate, and recognize.",
        duration: "75 min read",
        status: "available",
        topics: ["Step 1-5", "Contract Modifications", "Control Transfer"],
    },
    {
        id: 3,
        title: "Variable Consideration & Financing",
        description: "Handle discounts, rebates, performance bonuses, and the time value of money in contracts.",
        duration: "45 min read",
        status: "available",
        topics: ["Variable Consideration", "Constraint", "Financing Component"],
    },
    {
        id: 4,
        title: "Complex Application Scenarios",
        description: "Master tricky topics like warranties, principal vs. agent, and repurchase agreements.",
        duration: "60 min read",
        status: "available",
        topics: ["Warranties", "Principal vs Agent", "Repurchase Agreements"],
    },
    {
        id: 5,
        title: "Disclosures & Exam Preparation",
        description: "Disclosure requirements, common exam mistakes, and practice questions with worked solutions.",
        duration: "45 min read",
        status: "available",
        topics: ["Disclosures", "Exam Tips", "Practice Questions"],
    },
];

export default function IFRS15GuidePage() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Guides
                    </Link>

                    {/* Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                Intermediate
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-primary-foreground/70 text-sm">
                                5 Parts
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                            IFRS 15: Revenue from Contracts with Customers
                        </h1>
                        <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
                            IFRS 15 establishes a comprehensive framework for revenue recognition, replacing IAS 18 and IAS 11. The five-step model is the heart of this standard — master it and you&apos;ll unlock consistent revenue recognition across any scenario.
                        </p>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-semibold">{parts.length}</span>
                                </div>
                                <span className="text-primary-foreground/60 text-sm">Parts</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-semibold">4+ hrs</span>
                                </div>
                                <span className="text-primary-foreground/60 text-sm">Total Time</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Target className="w-4 h-4" />
                                    <span className="font-semibold">{parts.filter(p => p.status === "available").length}/{parts.length}</span>
                                </div>
                                <span className="text-primary-foreground/60 text-sm">Available</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Receipt className="w-4 h-4" />
                                    <span className="font-semibold">5</span>
                                </div>
                                <span className="text-primary-foreground/60 text-sm">Steps Model</span>
                            </div>
                        </div>

                        {/* Download Full Guide */}
                        <div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-display text-lg font-semibold text-primary-foreground mb-1">
                                        Download Complete Guide
                                    </h3>
                                    <p className="text-primary-foreground/60 text-sm">
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
                    </div>

                    {/* Preview of Parts */}
                    <div className="max-w-4xl">
                        <h2 className="font-display text-2xl font-semibold text-primary-foreground mb-8">
                            Course Content
                        </h2>
                        <div className="space-y-4">
                            {parts.map((part) => (
                                <div
                                    key={part.id}
                                    className={`group bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 transition-all duration-300 ${part.status === "available" ? "hover:bg-white/10 cursor-pointer" : "opacity-60"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${part.status === "available"
                                                ? "bg-accent/20 text-accent"
                                                : "bg-white/10 text-primary-foreground/50"
                                                }`}>
                                                {part.id}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-display text-lg font-semibold text-primary-foreground">
                                                        {part.title}
                                                    </h3>
                                                    {part.status === "coming-soon" && (
                                                        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-primary-foreground/60 text-sm mb-3">
                                                    {part.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {part.topics.map((topic) => (
                                                        <span
                                                            key={topic}
                                                            className="px-2 py-1 rounded-full bg-white/5 text-primary-foreground/50 text-xs"
                                                        >
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-primary-foreground/40 text-sm">{part.duration}</span>
                                            {part.status === "available" && (
                                                <Button asChild size="sm" variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                                                    <Link href={`/guides/ifrs-15/part-${part.id}`}>
                                                        Start
                                                        <ArrowRight className="w-4 h-4 ml-1" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                                Need Extra Support with IFRS 15?
                            </h3>
                            <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto">
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
