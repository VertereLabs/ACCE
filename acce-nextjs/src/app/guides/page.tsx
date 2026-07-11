import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Building2, Receipt, ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GUIDES, isGuidePublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "CA(SA) Study Guides | ACCE Tutors",
    description: "Exam-focused CA(SA) study guides for IFRS 15, IFRS 16, and Group Accounting. Clear summaries, worked steps, and practice tips.",
    keywords: "IFRS 15, IFRS 16, IFRS 3, IFRS 10, group accounting, CA(SA) study guides, CTA resources, PGDA notes",
    alternates: {
        canonical: "/guides/",
    },
};

// Icon per guide id lives here (React-land), keeping the shared catalog icon-free.
const GUIDE_ICONS: Record<string, LucideIcon> = {
    groups: Building2,
    "ifrs-15": Receipt,
    "ifrs-16": FileText,
};

// Derive status + icon from the shared catalog — dev mode sees everything as available
const guides = GUIDES.map((g) => ({
    ...g,
    icon: GUIDE_ICONS[g.id] ?? FileText,
    status: isGuidePublished(g.id) ? "available" : "coming-soon",
}));

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "Advanced":
            return "bg-red-500/20 text-red-400";
        case "Intermediate":
            return "bg-accent/20 text-accent";
        default:
            return "bg-green-500/20 text-green-400";
    }
};

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 rounded-full bg-card text-foreground text-sm font-medium mb-4">
                            Study Guides
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Master Complex Topics
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Exam-focused guides built for CA(SA) and CTA success. Each guide breaks complex standards into short,
                            practical steps you can study quickly.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto mb-12 text-center text-muted-foreground text-base leading-relaxed">
                        <p>
                            Use these notes to revise key standards, learn exam techniques, and build confidence before test day.
                            We focus on clear explanations, worked examples, and common pitfalls.
                        </p>
                        <p>
                            Start with the full guide, then move through each part for detail. If you need help, we also offer
                            one-on-one tutoring for tricky sections.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                <BookOpen className="w-5 h-5" />
                                <span className="font-display text-2xl font-bold">17</span>
                            </div>
                            <span className="text-muted-foreground text-sm">Parts Total</span>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-display text-2xl font-bold">50+</span>
                            </div>
                            <span className="text-muted-foreground text-sm">Hours of Content</span>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                <Users className="w-5 h-5" />
                                <span className="font-display text-2xl font-bold">100%</span>
                            </div>
                            <span className="text-muted-foreground text-sm">Exam Focused</span>
                        </div>
                    </div>

                    {/* Guide Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {guides.map((guide) => (
                            <div
                                key={guide.id}
                                className="group bg-card backdrop-blur-md rounded-2xl border border-border overflow-hidden hover:bg-muted transition-all duration-500"
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-border">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-accent/20 text-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                            <guide.icon className="w-7 h-7" />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {guide.status === "coming-soon" && (
                                                <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                                                    Coming Soon
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                                                {guide.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                                        {guide.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {guide.description}
                                    </p>
                                </div>

                                {/* Topics */}
                                <div className="p-6 border-b border-border">
                                    <div className="flex flex-wrap gap-2">
                                        {guide.topics.map((topic) => (
                                            <span
                                                key={topic}
                                                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="p-6 flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        {guide.parts} Parts
                                    </span>
                                    {guide.status === "available" ? (
                                        <Button asChild variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                                            <Link href={guide.href}>
                                                Start Learning
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            Notify Me →
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-24 text-center">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-12 max-w-3xl mx-auto">
                            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                                Want personalized guidance?
                            </h3>
                            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                                These guides are great for self-study, but nothing beats personalized tutoring. Book a session with Priyanka for one-on-one support.
                            </p>
                            <Button asChild variant="hero" size="lg">
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
