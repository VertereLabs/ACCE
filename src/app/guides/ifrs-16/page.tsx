import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Target, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "IFRS 16: Leases | ACCE Tutors Study Guides",
    description: "IFRS 16 guide for lessee and lessor accounting, ROU assets, lease liabilities, and key exemptions. Clear, exam-focused explanations.",
    keywords: "IFRS 16, leases, right of use asset, lease liability, lessee accounting, lessor accounting, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/ifrs-16/",
    },
};

const parts = [
    {
        id: 1,
        title: "Introduction to IFRS 16 & Key Changes",
        description: "Understand the shift from IAS 17, the single lessee model, and the critical definition of a lease.",
        duration: "35 min read",
        status: "available",
        topics: ["IAS 17 vs IFRS 16", "Identified Assets", "Control", "Exemptions"],
    },
    {
        id: 2,
        title: "Lessee Accounting (The Big Change!)",
        description: "Master ROU assets and lease liabilities — initial recognition, subsequent measurement, and modifications.",
        duration: "75 min read",
        status: "available",
        topics: ["ROU Asset", "Lease Liability", "Modifications", "Financial Ratios Impact"],
    },
    {
        id: 3,
        title: "Lessor Accounting",
        description: "Classify leases as finance or operating, and apply the correct accounting treatment for each.",
        duration: "45 min read",
        status: "available",
        topics: ["Classification", "Finance Lease", "Operating Lease", "Manufacturer Lessors"],
    },
    {
        id: 4,
        title: "Sale and Leaseback Transactions",
        description: "Learn how to account for complex sale and leaseback deals, including restricted gain recognition.",
        duration: "55 min read",
        status: "available",
        topics: ["IFRS 15 Sales Criteria", "Restricted Gain", "ROU Asset Calculation"],
    },
    {
        id: 5,
        title: "Disclosures & Exam Preparation",
        description: "Disclosure requirements, common exam mistakes, and practice questions with worked solutions.",
        duration: "40 min read",
        status: "available",
        topics: ["Lessee Disclosures", "Lessor Disclosures", "Exam Tips", "Practice Questions"],
    },
];

export default function IFRS16GuidePage() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        href="/guides/"
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
                            IFRS 16: Leases
                        </h1>
                        <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
                            IFRS 16 brought lease liabilities onto the balance sheet for lessees, fundamentally changing lease accounting. This guide covers both lessee and lessor perspectives, helping you navigate ROU assets, lease liabilities, and all the exemptions.
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
                                    <FileText className="w-4 h-4" />
                                    <span className="font-semibold">2</span>
                                </div>
                                <span className="text-primary-foreground/60 text-sm">Exemptions</span>
                            </div>
                        </div>

                        {/* Download Full Guide */}
                        <div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-display text-lg font-semibold text-primary-foreground mb-1">
                                        Download Complete Guide
                                    </h2>
                                    <p className="text-primary-foreground/60 text-sm">
                                        Get the full 6-part guide with detailed examples, worked solutions, and exam tips (PDF, 100KB)
                                    </p>
                                </div>
                                <Button asChild variant="hero" className="shrink-0">
                                    <a href="/pdfs/ifrs-16-leases.pdf" download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Change Highlight */}
                    <div className="max-w-4xl mb-12">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
                            <h2 className="font-display text-xl font-bold text-primary-foreground mb-3">
                                ⚠️ The Big Change from IAS 17
                            </h2>
                            <p className="text-primary-foreground/70">
                                Under IAS 17, operating leases were off-balance sheet. IFRS 16 brings almost all leases onto the lessee&apos;s balance sheet, recognizing a Right-of-Use (ROU) asset and a corresponding Lease Liability. This significantly impacts financial ratios like gearing and ROCE.
                            </p>
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
                                                    <Link href={`/guides/ifrs-16/part-${part.id}`}>
                                                        Start Part {part.id}
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

                    {/* Practical Expedients Preview */}
                    <div className="max-w-4xl mt-12">
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4">
                                Key Exemptions (Practical Expedients)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="text-primary-foreground font-medium mb-2">Short-term Leases</h4>
                                    <p className="text-primary-foreground/60 text-sm">
                                        Leases with a term of 12 months or less at commencement with no purchase option. Elected by class of asset.
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="text-primary-foreground font-medium mb-2">Low-value Assets</h4>
                                    <p className="text-primary-foreground/60 text-sm">
                                        Assets with a low value when new (typically ~$5,000 or less). Elected on a lease-by-lease basis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                                Need Extra Support with IFRS 16?
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
