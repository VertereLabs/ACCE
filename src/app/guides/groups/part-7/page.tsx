import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle2, Lightbulb, FileText, BarChart3, PieChart, GraduationCap, RefreshCw, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Part 7: Group Financial Statements & Exam Prep | ACCE Tutors",
    description: "Finalize your group accounting mastery. Learn to draft Group SOFP, SOCI, SOCIE, and SOCF. Get expert exam tips for PGDA and CTA exams.",
    keywords: "Group SOFP, Group SOCI, Group SOCIE, Group SOCF, consolidation journals, accounting exam tips, CA(SA), CTA, PGDA",
};

export default function GroupsPart7Page() {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl">
                        <Link
                            href="/guides/groups"
                            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Guide
                        </Link>
                        <div className="flex items-center gap-4">
                            <a
                                href="/pdfs/groups-business-combinations.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            <div className="text-primary-foreground/40 text-sm">
                                Part 7 of 7
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 7
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                                Group Financial Statements & Exam Preparation
                            </h1>
                            <p className="text-primary-foreground/60 text-lg">
                                60 min read • Last updated January 2026
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-10">
                                <p className="text-primary-foreground/80 text-lg leading-relaxed m-0">
                                    You&apos;ve mastered the acquisition method, consolidation mechanics, AOE, and complex transactions. Now, it&apos;s time to pull it all together. In this final part, we&apos;ll look at the <strong className="text-primary-foreground">structure of group financial statements</strong> and share some battle-tested exam techniques.
                                </p>
                            </div>

                            {/* Section 1: The Group Statement of Financial Position (SOFP) */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Group SOFP
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The SOFP shows the financial position of the group as a single entity.
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-accent" />
                                            Key Items to Watch:
                                        </h3>
                                        <ul className="space-y-3 text-sm text-primary-foreground/70 list-none p-0 m-0">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                                <span><strong className="text-primary-foreground">Goodwill:</strong> From your Part 2/4 calculations. Shown as a non-current asset.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                                <span><strong className="text-primary-foreground">Investment in Associate:</strong> From your Part 6 equity method working.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                                <span><strong className="text-primary-foreground">NCI:</strong> Presented within equity, but separately from the parent&apos;s equity.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                                <span><strong className="text-primary-foreground">Eliminated Balances:</strong> Ensure all intra-group receivables/payables are gone!</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: The Group Statement of Comprehensive Income (SOCI) */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Group SOCI
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The income statement combines the parent&apos;s and subsidiary&apos;s performance, but then &quot;attributes&quot; the profit at the bottom.
                                </p>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-blue-400 mb-4">
                                        The Profit Attribution Structure
                                    </h3>
                                    <div className="bg-white/5 rounded-lg p-5 font-mono text-xs space-y-2">
                                        <p className="text-primary-foreground font-bold">Profit for the year</p>
                                        <p className="text-primary-foreground pl-4">Attributable to:</p>
                                        <div className="flex justify-between pl-8 border-b border-white/10 pb-1">
                                            <span>Owners of the parent</span>
                                            <span>X</span>
                                        </div>
                                        <div className="flex justify-between pl-8">
                                            <span>Non-Controlling Interest</span>
                                            <span>X</span>
                                        </div>
                                        <div className="flex justify-between pt-2 font-bold text-accent">
                                            <span>Total Profit After Tax</span>
                                            <span>X</span>
                                        </div>
                                    </div>
                                    <p className="text-primary-foreground/50 text-[10px] mt-4 italic">
                                        *Refer to your Current Year column in the AOE for these split figures!
                                    </p>
                                </div>
                            </section>

                            {/* Section 3: The Group Statement of Changes in Equity (SOCIE) */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    The Group SOCIE
                                </h2>
                                <p className="text-primary-foreground/80 leading-relaxed mb-6">
                                    The SOCIE tracks the movements in the group&apos;s equity.
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">
                                        Common SOCIE Columns:
                                    </h3>
                                    <ul className="grid grid-cols-2 gap-4 text-sm text-primary-foreground/70 list-none p-0 m-0">
                                        <li className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                                            <FileText className="w-4 h-4 text-accent" />
                                            Share Capital
                                        </li>
                                        <li className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                                            <PieChart className="w-4 h-4 text-accent" />
                                            Group Retained Earnings
                                        </li>
                                        <li className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                                            <RefreshCw className="w-4 h-4 text-accent" />
                                            FCTR (if applicable)
                                        </li>
                                        <li className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg text-accent font-bold">
                                            <Users className="w-4 h-4" />
                                            NCI (Total Column)
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Final Exam Tips */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-primary-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Exam Preparation Strategy
                                </h2>

                                <div className="space-y-6">
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <GraduationCap className="w-6 h-6 text-accent flex-shrink-0" />
                                            <div>
                                                <h4 className="font-display font-bold text-primary-foreground mb-2">1. The &quot;Analysis Parade&quot;</h4>
                                                <p className="text-primary-foreground/80 text-sm">
                                                    In a 50-mark question, don&apos;t start drafting statements immediately. Spend the first 15-20 minutes building your working papers (AOE, Investment in Associate, FCTR). If your workings are solid, the statements will write themselves.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0" />
                                            <div>
                                                <h4 className="font-display font-bold text-primary-foreground mb-2">2. Pro-forma Journals</h4>
                                                <p className="text-primary-foreground/80 text-sm">
                                                    If the question asks for journals, use standardized formats.
                                                    <strong className="text-primary-foreground">Dr Revenue, Cr COS</strong> for intra-group sales is a &quot;free&quot; mark in almost every paper.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h4 className="font-display font-bold text-primary-foreground mb-2">3. Time Management</h4>
                                        <ul className="space-y-2 text-xs text-primary-foreground/70 list-disc ml-4">
                                            <li>If you can&apos;t balance the SOFP, don&apos;t spend 10 minutes hunting for a R5,000 difference. Move on.</li>
                                            <li>Marks are awarded for structure and following through on your own figures (own-figure marks).</li>
                                            <li>Always show your calculations!</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Final Conclusion */}
                            <div className="bg-accent rounded-2xl p-8 text-black mb-12 shadow-xl shadow-accent/20">
                                <h2 className="font-display text-2xl font-bold mb-4">You&apos;ve Finished the Groups Guide!</h2>
                                <p className="mb-6 opacity-90 leading-relaxed">
                                    Congratulations! You have completed all 7 parts of our comprehensive Groups and Business Combinations guide. You now have the foundational knowledge and advanced tools to tackle any CTA/PGDA financial accounting paper.
                                </p>
                                <p className="font-bold">Good luck with your studies and upcoming exams! 🎓✨</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/10">
                            <Button asChild variant="ghost" className="text-primary-foreground/60 hover:text-primary-foreground">
                                <Link href="/guides/groups/part-6">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 6: Associates & JVs
                                </Link>
                            </Button>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                <Link href="/guides">
                                    Explore Other Guides
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* Final CTA */}
                    <div className="max-w-4xl mt-16">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                            <GraduationCap className="w-16 h-16 text-accent mx-auto mb-6" />
                            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4 text-balance">
                                Ready to Ace your Exams?
                            </h3>
                            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                                If you&apos;re feeling confident but want that extra edge, or if you&apos;re still struggling with specific scenarios, Priyanka is here to help you cross the finish line.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                    <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                        WhatsApp for Tutoring
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-primary-foreground px-8">
                                    <Link href="/services">
                                        View Our Services
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
