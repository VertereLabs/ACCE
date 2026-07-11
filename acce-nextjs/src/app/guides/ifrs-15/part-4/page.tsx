import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, ShieldCheck, UserCog, RefreshCcw, Info, Lightbulb, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 4: IFRS 15 Complex Scenarios | ACCE Tutors",
    description: "Master the most challenging parts of IFRS 15: Warranties, Principal vs Agent, and Repurchase Agreements.",
    keywords: "IFRS 15 warranties, assurance type warranty, service type warranty, principal vs agent, repurchase agreements, call option, put option, forward contract",
    alternates: {
        canonical: "/guides/ifrs-15/part-4/",
    },
};

export default function IFRS15Part4Page() {
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
                                Part 4 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 4: Advanced Scenarios
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Complex Application Scenarios
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Once you master the baseline model, IFRS 15 throws some specific &quot;curveballs&quot; that often appear in advanced accounting exams.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Warranties */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Dual Nature of Warranties
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Not all warranties are created equal. IFRS 15 distinguishes between warranties that guarantee the product works as promised and those that provide an additional service.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-display font-semibold text-blue-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                            <ShieldCheck className="w-4 h-4" />
                                            Assurance-Type
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-4 font-medium italic">Does it provide a service in addition to the assurance that the product complies with agreed specifications?</p>
                                        <div className="bg-blue-500/10 rounded-lg p-3 text-xs text-muted-foreground">
                                            <strong className="text-foreground">ACCOUNTING:</strong> Not a separate PO. Account for under <strong className="text-foreground">IAS 37</strong> (Provisions).
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h4 className="font-display font-semibold text-green-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Service-Type
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-4 font-medium italic">If the customer has the option to purchase the warranty separately, it&apos;s a separate PO.</p>
                                        <div className="bg-green-500/10 rounded-lg p-3 text-xs text-muted-foreground">
                                            <strong className="text-foreground">ACCOUNTING:</strong> IS a <strong className="text-foreground">Separate PO</strong>. Allocate part of the transaction price to it.
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Principal vs Agent */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Principal vs Agent
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    When another party is involved in providing goods or services, you must determine if you are the <strong className="text-foreground underline decoration-accent decoration-2">Principal</strong> (Gross Revenue) or the <strong className="text-foreground underline decoration-accent decoration-2">Agent</strong> (Net Commission).
                                </p>

                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h4 className="font-bold text-foreground mb-4 text-sm flex items-center gap-2">
                                        <UserCog className="w-4 h-4 text-accent" />
                                        Indicators you are the Agent:
                                    </h4>
                                    <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                                        {[
                                            "Another party is primarily responsible for fulfilling the contract.",
                                            "The entity does not have inventory risk.",
                                            "The entity does not have discretion in establishing prices.",
                                            "The entity's consideration is in the form of a commission."
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Repurchase Agreements */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Repurchase Agreements
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A repurchase agreement is a contract in which an entity sells an asset and also promises (or has the option) to repurchase the asset.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <RefreshCcw className="w-6 h-6 text-accent flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm uppercase">Forward or Call Option</h4>
                                            <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                                                Customer does NOT have control. It&apos;s either a <strong className="text-foreground">Lease</strong> (under IFRS 16) or a <strong className="text-foreground">Financing Arrangement</strong>.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm uppercase">Put Option</h4>
                                            <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                                                Entity repurchases at customer&apos;s request. Assessment depends on whether the customer has a <strong className="text-foreground">significant economic incentive</strong> to exercise the option.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Exam Tip */}
                            <section className="mb-12">
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-8">
                                    <div className="flex gap-4">
                                        <Lightbulb className="w-8 h-8 text-accent flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-foreground mb-2">The &quot;Control&quot; Pivot</h3>
                                            <p className="text-muted-foreground italic m-0 text-sm leading-relaxed">
                                                In all these complex cases, the answer always comes back to <strong className="text-foreground underline decoration-accent decoration-2 underline-offset-4">Control</strong>. If the customer hasn&apos;t gained the ability to direct the use of and obtain substantially all remaining benefits from the asset, you cannot recognize revenue.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-15/part-3">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 3: Price Complexity
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/ifrs-15/part-5">
                                    Part 5: Disclosures & Prep
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center text-balance">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Struggling with Warranties or Principal/Agent?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                These are classic exam &quot;killers&quot; where the correct accounting is often counter-intuitive. Let&apos;s work through some real exam scenarios.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Get Expert Guidance on WhatsApp
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
