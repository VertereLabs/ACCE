import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Info, Lightbulb, Scale, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 1: Scope & Introduction | ACCE Tutors",
    description: "Why IFRS 9 replaced IAS 39, the IAS 32 definition of a financial instrument, what is in and out of scope, and the three phases of IFRS 9.",
    keywords: "IFRS 9, financial instruments, IAS 39 vs IFRS 9, IAS 32 definition, financial asset, financial liability, IFRS 9 scope, IFRS 9 transition",
    alternates: {
        canonical: "/guides/ifrs-9/part-1/",
    },
};

export default function IFRS9Part1Page() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                        <Link
                            href="/guides/ifrs-9/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to IFRS 9
                        </Link>
                        <div className="flex items-center gap-4">
                            {isGuidePdfPublished("ifrs-9") && (
                            <a
                                href="/pdfs/ifrs-9-financial-instruments.pdf"
                                download
                                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                            </a>
                            )}
                            <div className="text-muted-foreground text-sm">
                                Part 1 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 1: The Big Picture
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                IFRS 9: Scope & Introduction
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Before you can classify or measure anything, you need to know why IFRS 9 exists, what a financial instrument actually is, and which items the standard covers.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: The Problem */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Problem That Created IFRS 9
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The 2008 global financial crisis exposed a fundamental flaw in <strong className="text-foreground">IAS 39 Financial Instruments: Recognition and Measurement</strong>. Banks carried loans at full value right up until borrowers defaulted, because the accounting only recognised losses <em>after</em> they had occurred. Multi-billion-rand write-downs appeared seemingly overnight.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The G20 leaders called on the IASB to create a simpler, more forward-looking standard. The result was <strong className="text-foreground">IFRS 9</strong>, developed in three phases and fully effective from <strong className="text-foreground">1 January 2018</strong>.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">IAS 39: Backward-Looking</h3>
                                        <p className="text-sm text-muted-foreground m-0">Recognise losses when they happen (incurred loss).</p>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-2">IFRS 9: Forward-Looking</h3>
                                        <p className="text-sm text-muted-foreground m-0">Recognise losses before they happen (expected loss).</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: What is a Financial Instrument */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    What is a Financial Instrument? (IAS 32.11)
                                </h2>
                                <div className="bg-card rounded-2xl border border-border p-8 mb-6">
                                    <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                        A <strong className="text-foreground">financial instrument</strong> is any contract that gives rise to a <strong className="text-foreground">financial asset</strong> of one entity and a <strong className="text-foreground">financial liability or equity instrument</strong> of another entity.
                                    </p>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This is a two-sided definition: for every financial instrument, there are two parties.
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Financial Asset (IAS 32.11)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Type</th>
                                                    <th className="text-left py-2 text-foreground">Example</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Cash</td>
                                                    <td className="py-2">Bank balance</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">An equity instrument of another entity</td>
                                                    <td className="py-2">Shares held in a JSE-listed company</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">A contractual right to receive cash or another financial asset</td>
                                                    <td className="py-2">Trade receivable, loan given</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">A contractual right to exchange financial instruments under potentially favourable conditions</td>
                                                    <td className="py-2">Call option held</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Financial Liability (IAS 32.11)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Type</th>
                                                    <th className="text-left py-2 text-foreground">Example</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">A contractual obligation to deliver cash or another financial asset</td>
                                                    <td className="py-2">Trade payable, bond issued, loan received</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">A contractual obligation to exchange financial instruments under potentially unfavourable conditions</td>
                                                    <td className="py-2">Written put option</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border mb-6">
                                    <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Equity Instrument (IAS 32.11)</h4>
                                        <p className="text-sm text-muted-foreground m-0">Any contract that evidences a residual interest in the assets of an entity after deducting all of its liabilities.</p>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">The distinction matters enormously.</strong> Whether an instrument is a financial liability or equity under IAS 32 determines where interest or dividends go (P/L vs equity) and whether it appears in leverage ratios. This is governed by <strong className="text-foreground">IAS 32</strong>, not IFRS 9. IFRS 9 deals with <em>how</em> you measure once IAS 32 has determined <em>what</em> it is.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Scope */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    What is In and Out of Scope?
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 applies to <strong className="text-foreground">all financial instruments</strong> except those specifically excluded.
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-4">
                                            ✓ Within Scope
                                        </h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-muted-foreground">
                                            <li>• Trade receivables and payables</li>
                                            <li>• Loans and borrowings</li>
                                            <li>• Investments in shares and bonds</li>
                                            <li>• Derivative instruments (forwards, options, swaps)</li>
                                            <li>• Lease receivables (the lessor side under IFRS 16)</li>
                                            <li>• Financial guarantee contracts</li>
                                            <li>• Loan commitments (in some cases)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                            Outside Scope
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="text-left py-2 text-foreground">Excluded Item</th>
                                                        <th className="text-left py-2 text-foreground">Standard That Applies</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-muted-foreground">
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-4">Interests in subsidiaries, associates and joint ventures</td>
                                                        <td className="py-2">IFRS 10, IAS 27, IAS 28</td>
                                                    </tr>
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-4">Rights and obligations under leases (lessee)</td>
                                                        <td className="py-2">IFRS 16</td>
                                                    </tr>
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-4">Employers&apos; rights and obligations under employee benefit plans</td>
                                                        <td className="py-2">IAS 19</td>
                                                    </tr>
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-4">Insurance contracts (issued)</td>
                                                        <td className="py-2">IFRS 17</td>
                                                    </tr>
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-4">Share-based payment instruments</td>
                                                        <td className="py-2">IFRS 2</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 pr-4">Equity instruments issued by the entity itself</td>
                                                        <td className="py-2">IAS 32</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Common Exam Trap</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Investments in subsidiaries, associates and JVs are scoped <em>out</em> of IFRS 9 in the <strong className="text-foreground">consolidated</strong> financial statements. However, in the <strong className="text-foreground">separate</strong> financial statements of a parent or investor, these investments ARE within scope: they can be measured at cost, fair value (IFRS 9), or the equity method.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Three Phases & IAS 39 vs IFRS 9 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    The Three Phases & IAS 39 vs IFRS 9
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The IASB developed IFRS 9 in three phases, each fixing a different deficiency in IAS 39. Each phase is covered in detail later in this guide.
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Phase</th>
                                                    <th className="text-left py-2 text-foreground">Topic</th>
                                                    <th className="text-left py-2 text-foreground">The Problem with IAS 39</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Phase 1</td>
                                                    <td className="py-2 pr-4">Classification & Measurement</td>
                                                    <td className="py-2">Too many categories (4), arbitrary classification, &quot;tainting rules&quot;</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Phase 2</td>
                                                    <td className="py-2 pr-4">Impairment</td>
                                                    <td className="py-2">Losses recognised too late (incurred loss model)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Phase 3</td>
                                                    <td className="py-2 pr-4">Hedge Accounting</td>
                                                    <td className="py-2">Too rules-based; many legitimate economic hedges couldn&apos;t qualify</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Many exam questions are set in a transition context, or ask you to explain why a treatment differs, so you need to understand <em>both</em> standards:
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">IAS 39 vs IFRS 9: Summary Overview</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Feature</th>
                                                    <th className="text-left py-2 text-foreground">IAS 39</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Financial asset categories</td>
                                                    <td className="py-2 pr-4">4 categories</td>
                                                    <td className="py-2">3 categories</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Classification basis</td>
                                                    <td className="py-2 pr-4">Management intention + rules</td>
                                                    <td className="py-2">Business model + cash flow characteristics</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Impairment model</td>
                                                    <td className="py-2 pr-4">Incurred loss</td>
                                                    <td className="py-2">Expected credit loss (ECL)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Hedge effectiveness test</td>
                                                    <td className="py-2 pr-4">Quantitative: 80–125%</td>
                                                    <td className="py-2">Principles-based: economic relationship</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Own credit risk on FVO liabilities</td>
                                                    <td className="py-2 pr-4">Changes in P/L</td>
                                                    <td className="py-2">Changes in OCI</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Complexity</td>
                                                    <td className="py-2 pr-4">High: many exceptions and carve-outs</td>
                                                    <td className="py-2">Lower: principles-based</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Transition */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    IFRS 9 Transition: What You Need to Know
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    When IFRS 9 became effective (1 January 2018), entities moving from IAS 39 applied specific transition rules:
                                </p>
                                <div className="space-y-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Classification & Measurement</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Classification is assessed on the facts and circumstances at the <strong className="text-foreground">date of initial application</strong> (not retrospectively at each asset&apos;s original recognition date).</li>
                                            <li>An entity may designate or revoke prior FVO designations at the transition date.</li>
                                            <li>Comparative periods <strong className="text-foreground">need not be restated</strong>: the entity applies IFRS 9 prospectively from the transition date, with any adjustment recognised in opening retained earnings.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Impairment</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>The ECL model applies from the date of initial application.</li>
                                            <li>The stage of each asset is determined by comparing credit risk at origination with credit risk at the transition date, without the benefit of hindsight.</li>
                                            <li>This was particularly challenging for South African banks with large loan books originated years before transition.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Hedge Accounting</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Entities may make an irrevocable election to continue applying <strong className="text-foreground">IAS 39 hedge accounting</strong>; many SA entities with complex macro hedge programmes chose to do so.</li>
                                            <li>If transitioning to IFRS 9 hedge accounting, qualifying hedges can be carried forward without discontinuation.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Exam angle:</strong> Transition is usually tested by asking how an asset&apos;s classification changes from IAS 39 to IFRS 9, or how the opening ECL allowance is determined. Know the principle: assess at the transition date, adjust opening retained earnings, no restatement of comparatives.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Key Definitions */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Key Definitions You Must Know
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Term</th>
                                                    <th className="text-left py-2 text-foreground">Definition</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Amortised cost</td>
                                                    <td className="py-2">Initial amount ± principal repayments ± cumulative amortisation of premium/discount ± impairment loss</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Effective interest rate (EIR)</td>
                                                    <td className="py-2">The rate that exactly discounts future cash flows to the gross carrying amount</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Fair value</td>
                                                    <td className="py-2">Price received to sell an asset or paid to transfer a liability in an orderly transaction between market participants (IFRS 13)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Business model</td>
                                                    <td className="py-2">How an entity manages financial assets to generate cash flows</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">SPPI</td>
                                                    <td className="py-2">Solely Payments of Principal and Interest: the cash flow characteristic test</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Credit loss</td>
                                                    <td className="py-2">Difference between contractual cash flows and expected cash flows, discounted at EIR</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Expected credit loss (ECL)</td>
                                                    <td className="py-2">Probability-weighted estimate of credit losses</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">12-month ECL</td>
                                                    <td className="py-2">ECL from default events possible within 12 months</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Lifetime ECL</td>
                                                    <td className="py-2">ECL from all possible default events over the life of the instrument</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Significant increase in credit risk (SICR)</td>
                                                    <td className="py-2">The trigger for moving from 12-month to lifetime ECL</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Structure of IFRS 9 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    The Structure of IFRS 9
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ul className="space-y-3 m-0 p-0 list-none text-muted-foreground text-sm">
                                        <li><strong className="text-foreground">Chapter 2:</strong> Recognition and Derecognition</li>
                                        <li>
                                            <strong className="text-foreground">Chapter 3:</strong> Classification
                                            <ul className="list-none ml-6 mt-1 p-0 space-y-1">
                                                <li>3.1 Financial Assets</li>
                                                <li>3.2 Financial Liabilities</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <strong className="text-foreground">Chapter 4:</strong> Measurement
                                            <ul className="list-none ml-6 mt-1 p-0 space-y-1">
                                                <li>4.1 Initial Measurement</li>
                                                <li>4.2 Subsequent Measurement: Financial Assets</li>
                                                <li>4.3 Subsequent Measurement: Financial Liabilities</li>
                                                <li>4.4 Impairment</li>
                                            </ul>
                                        </li>
                                        <li><strong className="text-foreground">Chapter 6:</strong> Hedge Accounting</li>
                                    </ul>
                                </div>
                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                    <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <p className="text-sm text-muted-foreground m-0">
                                        There is no Chapter 5 in IFRS 9. The numbering jumps from Chapter 4 to Chapter 6. This is not an error: it was a deliberate decision by the IASB to allow for potential future chapters.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8: Worked Example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Worked Example: Is This a Financial Instrument?
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Consider the following items in a company&apos;s records:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Item</th>
                                                    <th className="text-left py-2 text-foreground">Financial Instrument?</th>
                                                    <th className="text-left py-2 text-foreground">Reasoning</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Trade receivable of R500,000 from a customer on 30-day credit</td>
                                                    <td className="py-2 pr-4 text-green-400 font-semibold">✓ Yes: financial asset</td>
                                                    <td className="py-2">A contract exists (the sale agreement). It gives a right to receive cash (seller&apos;s financial asset) and an obligation to pay cash (customer&apos;s financial liability).</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Inventory of 10,000 bags of maize held in a warehouse</td>
                                                    <td className="py-2 pr-4 text-red-400 font-semibold">✗ No</td>
                                                    <td className="py-2">No contractual right to receive cash or another financial instrument. Maize is a physical asset (IAS 2).</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forward contract to buy USD 1,000,000 in 90 days at a fixed ZAR rate</td>
                                                    <td className="py-2 pr-4 text-green-400 font-semibold">✓ Yes: derivative</td>
                                                    <td className="py-2">Settled net or by exchange of financial instruments. Both parties have contractual rights and obligations.</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Provision for site rehabilitation at a mining operation</td>
                                                    <td className="py-2 pr-4 text-red-400 font-semibold">✗ No</td>
                                                    <td className="py-2">A constructive or legal obligation, but not a <em>contractual</em> obligation to deliver cash or another financial instrument (IAS 37).</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Ordinary shares issued by the entity itself</td>
                                                    <td className="py-2 pr-4 text-red-400 font-semibold">✗ Not for the issuer</td>
                                                    <td className="py-2">The issuer&apos;s own equity instruments are scoped out of IFRS 9. For an investor, those shares are a financial asset.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">The key test every time:</strong> is there a contract that creates a financial asset in one entity and a financial liability or equity instrument in another? If not, stop. It&apos;s not a financial instrument.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Common Student Pitfalls
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Mixing up IAS 32, IAS 39, IFRS 9 and IFRS 7</h4>
                                        <p className="text-sm text-muted-foreground m-0">IAS 32 = presentation (what is it?). IFRS 9 = recognition & measurement. IFRS 7 = disclosures. IAS 39 = old measurement standard (now superseded).</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Forgetting that IFRS 9 has a scope</h4>
                                        <p className="text-sm text-muted-foreground m-0">Always check whether the instrument is in scope before applying IFRS 9.</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Assuming IAS 39 is irrelevant</h4>
                                        <p className="text-sm text-muted-foreground m-0">IAS 39 is still examinable, and some entities continue to apply IAS 39 hedge accounting under the IFRS 9 transition provisions.</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Confusing financial instruments with physical commodities</h4>
                                        <p className="text-sm text-muted-foreground m-0">A forward to buy gold is a financial instrument (derivative); gold itself is not.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 10: Exam Technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">10</span>
                                    Exam Technique: &quot;Identify and Classify&quot;
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    These questions give you a list of items and ask whether each is a financial instrument and, if so, what type. Apply the framework and they are straightforward marks:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Does a <strong className="text-foreground">contract</strong> exist? (Financial instruments are contractual.)</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span>Does it give rise to a financial asset <em>and</em> a corresponding financial liability or equity instrument?</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            If yes, it&apos;s a financial instrument. Identify which side you&apos;re looking at (asset, liability or equity).
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            Apply the scope exclusions: is it covered by another standard?
                                        </li>
                                    </ol>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Mark allocation tip:</strong> For a 2-mark &quot;is this a financial instrument?&quot; question, expect 1 mark for stating the definition or relevant criterion and 1 mark for applying it and concluding.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Key Takeaways */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                                    Key Takeaways
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">IFRS 9 replaced IAS 39</strong> to address the failures exposed by the 2008 financial crisis.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">A financial instrument</strong> is a contract that creates a financial asset in one entity and a financial liability or equity in another.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">IFRS 9 applies broadly</strong> to all financial instruments except those explicitly scoped out.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Three phases:</strong> classification & measurement, impairment, hedge accounting.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">IAS 32</strong> governs presentation (liability vs equity), <strong className="text-foreground">IFRS 9</strong> governs measurement and <strong className="text-foreground">IFRS 7</strong> governs disclosures: three separate standards working together.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">The central shift:</strong> from incurred loss to expected loss thinking.</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Next Steps */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming Up Next
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    In Part 2, we tackle the gateway to everything else in IFRS 9: the <strong className="text-foreground">Business Model Test</strong> and the <strong className="text-foreground">SPPI Test</strong> that decide how a financial asset is classified.
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-border">
                                    <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        <Link href="/guides/ifrs-9">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to IFRS 9
                                        </Link>
                                    </Button>
                                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                        <Link href="/guides/ifrs-9/part-2">
                                            Part 2: Classifying Financial Assets
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
                                Unsure Whether It&apos;s a Liability or Equity?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Spotting a financial instrument and applying the scope exclusions are easy marks once you have a framework. Let&apos;s make sure you can argue them effectively.
                            </p>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Ask Priyanka on WhatsApp
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
