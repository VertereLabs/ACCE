import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Target, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Groups & Business Combinations | ACCE Tutors Study Guides",
    description: "Group accounting guide covering IFRS 3 and IFRS 10, consolidation mechanics, and the Analysis of Equity. Built for CA(SA) and CTA prep.",
    keywords: "IFRS 3, IFRS 10, group accounting, consolidation, NCI, goodwill, analysis of equity, CA(SA), CTA, PGDA",
    alternates: {
        canonical: "/guides/groups/",
    },
};

const parts = [
    {
        id: 1,
        title: "Foundations of Group Financial Reporting",
        description: "Understand when to consolidate vs equity account. Master the control vs significant influence decision tree.",
        duration: "45 min read",
        status: "available",
        topics: ["Control vs Significant Influence", "Parent-Subsidiary Relationships", "Key Standards Overview"],
    },
    {
        id: 2,
        title: "The Acquisition Method (IFRS 3)",
        description: "Learn to identify the acquirer, determine the acquisition date, and measure identifiable assets and liabilities.",
        duration: "60 min read",
        status: "available",
        topics: ["Identifying the Acquirer", "Fair Value Measurement", "Contingent Consideration"],
    },
    {
        id: 3,
        title: "Consolidation Mechanics (IFRS 10)",
        description: "Master the consolidation process from combining line items to eliminating intra-group transactions.",
        duration: "50 min read",
        status: "available",
        topics: ["Control Definition", "Consolidation Procedures", "Intra-Group Eliminations"],
    },
    {
        id: 4,
        title: "Analysis of Equity (AOE)",
        description: "The heart of group accounting. Work through at acquisition, since acquisition, and current year columns.",
        duration: "90 min read",
        status: "available",
        topics: ["At Acquisition", "Since Acquisition", "Current Year", "NCI Allocation"],
    },
    {
        id: 5,
        title: "Complex Transactions",
        description: "Tackle advanced topics like step acquisitions, disposals, foreign subsidiaries (FCTR), and complex intra-group transfers.",
        duration: "75 min read",
        status: "available",
        topics: ["Step Acquisitions", "Loss of Control", "FCTR (IAS 21)", "Impairment"],
    },
    {
        id: 6,
        title: "Associates & Joint Ventures",
        description: "Learn when to use the equity method instead of consolidation for associates (IAS 28) and joint ventures (IFRS 11).",
        duration: "45 min read",
        status: "available",
        topics: ["Significant Influence", "Equity Method", "Joint Control", "Unrealised Profits"],
    },
    {
        id: 7,
        title: "Group Statements & Exam Prep",
        description: "Pull it all together. Learn to draft group financial statements and master exam techniques for distinction-level results.",
        duration: "60 min read",
        status: "available",
        topics: ["Group SOFP & SOCI", "SOCIE & SOCF", "Exam Strategy", "Common Mistakes"],
    },
];

export default function GroupsGuidePage() {
    const availableParts = parts.filter((p) => p.status === "available");
    const completedParts = 0; // This could be dynamic with user progress

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
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                                Advanced
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                7 Parts
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Groups & Business Combinations
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            Let&apos;s talk about Group Financial Accounting… Daunting, right? From FCTRs to changes in degrees of influence to eliminating pro formas: where do you even begin? This comprehensive guide breaks down everything you need to master consolidated financial statements.
                        </p>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-semibold">{parts.length}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Parts</span>
                            </div>
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-semibold">7+ hrs</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Total Time</span>
                            </div>
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <Target className="w-4 h-4" />
                                    <span className="font-semibold">{availableParts.length}/{parts.length}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Available</span>
                            </div>
                            <div className="bg-card rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2 text-accent mb-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-semibold">{completedParts}/{parts.length}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">Completed</span>
                            </div>
                        </div>

                        {/* Download Full Guide */}
                        {isGuidePdfPublished("groups") && (
                        <div className="mt-8 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                                        Download Complete Guide
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Get the full 11-part guide with detailed examples, worked solutions, and exam tips (PDF, 183KB)
                                    </p>
                                </div>
                                <Button asChild variant="hero" className="shrink-0">
                                    <a href="/pdfs/groups-business-combinations.pdf" download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </a>
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Key Standards */}
                    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 mb-12 max-w-4xl">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                            Standards Covered
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div>
                                    <span className="text-foreground font-medium">IFRS 3</span>
                                    <p className="text-muted-foreground text-sm">Business Combinations</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div>
                                    <span className="text-foreground font-medium">IFRS 10</span>
                                    <p className="text-muted-foreground text-sm">Consolidated Financial Statements</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div>
                                    <span className="text-foreground font-medium">IFRS 12</span>
                                    <p className="text-muted-foreground text-sm">Disclosure of Interests</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div>
                                    <span className="text-foreground font-medium">IAS 28</span>
                                    <p className="text-muted-foreground text-sm">Associates & Joint Ventures</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parts List */}
                    <div className="max-w-4xl">
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
                            Course Content
                        </h2>
                        <div className="space-y-4">
                            {parts.map((part) => (
                                <div
                                    key={part.id}
                                    className={`group bg-card backdrop-blur-md rounded-xl border border-border p-6 transition-all duration-300 ${part.status === "available" ? "hover:bg-muted cursor-pointer" : "opacity-60"
                                        }`}
                                >
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
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-muted-foreground text-sm">{part.duration}</span>
                                            {part.status === "available" && (
                                                <Button asChild size="sm" variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                                                    <Link href={`/guides/groups/part-${part.id}`}>
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

                    {/* Tip Box */}
                    <div className="max-w-4xl mt-12">
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                        Pro Tip: The Analysis of Equity
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Always work in the 100% column first, then multiply out to NCI or parent as needed. This reduces errors significantly. The AOE is the heart of group accounting: your journals flow from here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
