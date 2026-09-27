import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, Lightbulb, CheckCircle2, XCircle, Calculator, Scale, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 7: Hedge Accounting: IAS 39 | ACCE Tutors",
    description: "IAS 39 hedge accounting: fair value, cash flow and net investment hedges, the six qualifying criteria, the 80–125% test and discontinuation.",
    keywords: "IAS 39 hedge accounting, fair value hedge, cash flow hedge, net investment hedge, 80-125% effectiveness test, hedge documentation, CA(SA) financial instruments",
    alternates: {
        canonical: "/guides/ifrs-9/part-7/",
    },
};

export default function IFRS9Part7Page() {
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
                                Part 7 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 7: The Rules-Based Framework
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Hedge Accounting: The IAS 39 Framework
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                IFRS 9 has its own hedge accounting chapter (Chapter 6), but you still need to know IAS 39. Exam questions compare the two, some entities still apply IAS 39 hedging, and you can&apos;t understand what changed without knowing what was there before.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Why study IAS 39 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Why Study IAS 39 Hedge Accounting?
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span><strong className="text-foreground">Exam relevance:</strong> many questions are set in the context of transitioning from IAS 39 to IFRS 9, or ask you to compare the two frameworks.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span><strong className="text-foreground">Transition provisions:</strong> on adopting IFRS 9, entities were permitted to continue applying IAS 39 hedge accounting. Some, particularly those with macro hedging programmes, still do while the IASB finalises IFRS 9 macro hedge accounting.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span><strong className="text-foreground">Foundation for IFRS 9:</strong> IFRS 9 hedge accounting builds on IAS 39 concepts.</span>
                                        </li>
                                    </ol>
                                </div>
                            </section>

                            {/* Section 2: Purpose */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    The Purpose: Fixing the Accounting Mismatch
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Consider a South African mining company (Harmony Gold) with a <strong className="text-foreground">forecast sale of 10,000 oz of gold</strong> in 6 months (unrecognised, not yet a financial asset). It enters into a <strong className="text-foreground">forward contract to sell gold at a fixed price</strong> (a derivative, recognised at fair value).
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-3">Without Hedge Accounting</h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• The forward is marked to market each quarter → gains/losses in P/L</li>
                                            <li>• The forecast gold sale is not recognised → no offsetting entry</li>
                                            <li>• Result: artificial P/L volatility that doesn&apos;t reflect the economics of a hedged position</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-3">With Hedge Accounting</h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• Gains/losses on the derivative are matched with those on the hedged item</li>
                                            <li>• P/L reflects the <strong className="text-foreground">net</strong> economic exposure, not the gross derivative movement</li>
                                            <li>• Better represents the entity&apos;s actual risk management activity</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Important:</strong> Hedge accounting is an <strong className="text-foreground">exception</strong> to the normal accounting rules. It requires meeting strict qualifying criteria. Entities cannot simply apply it because they think they have an economic hedge.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Three types */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    The Three Types of Hedges
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Both IAS 39 and IFRS 9 recognise the same three hedge relationships:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedge Type</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedged Item</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Risk Hedged</th>
                                                    <th className="text-left py-2 text-foreground">Example</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Fair Value Hedge</td>
                                                    <td className="py-2 pr-4">Recognised asset, liability or firm commitment</td>
                                                    <td className="py-2 pr-4">Changes in fair value</td>
                                                    <td className="py-2">Fixed-rate debt hedged with an interest rate swap</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Cash Flow Hedge</td>
                                                    <td className="py-2 pr-4">Highly probable forecast transaction or variable-rate asset/liability</td>
                                                    <td className="py-2 pr-4">Variability in cash flows</td>
                                                    <td className="py-2">Forecast USD export hedged with a forward contract</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground font-medium">Net Investment Hedge</td>
                                                    <td className="py-2 pr-4">Net investment in a foreign operation</td>
                                                    <td className="py-2 pr-4">Foreign exchange risk</td>
                                                    <td className="py-2">USD subsidiary equity hedged with USD borrowing</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Qualifying criteria */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    IAS 39 Qualifying Criteria
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Under IAS 39, <strong className="text-foreground">all six</strong> of the following criteria must be met for hedge accounting to apply.
                                </p>
                                <div className="space-y-4 mb-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-2">1. Formal Designation and Documentation</h4>
                                        <p className="text-muted-foreground text-sm mb-3">At inception, formal documentation must cover:</p>
                                        <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
                                            {[
                                                "The hedging relationship",
                                                "Risk management objective and strategy",
                                                "Identification of the hedging instrument",
                                                "Identification of the hedged item",
                                                "Nature of the risk being hedged",
                                                "How effectiveness will be assessed",
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-muted-foreground text-sm m-0">
                                                <strong className="text-foreground">Caution:</strong> Documentation is not optional or retrospective. If it is not done at inception, hedge accounting cannot be applied, even if everything else qualifies. This is a common real-world pitfall.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-2">2. The Hedging Instrument</h4>
                                            <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                                <li><strong className="text-foreground">Derivatives</strong> (forwards, futures, options, swaps): most commonly used</li>
                                                <li><strong className="text-foreground">Non-derivatives:</strong> only for hedges of foreign currency risk</li>
                                                <li>A non-derivative <strong className="text-foreground">cannot</strong> hedge interest rate or commodity price risk</li>
                                                <li>Written options (premium received) generally <strong className="text-foreground">not</strong> permitted, unless offsetting a purchased option in the hedged item</li>
                                            </ul>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-2">3. The Hedged Item</h4>
                                            <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                                <li>A recognised financial asset or liability</li>
                                                <li>An unrecognised firm commitment (fair value hedges)</li>
                                                <li>A highly probable forecast transaction (cash flow hedges)</li>
                                                <li>A net investment in a foreign operation</li>
                                            </ul>
                                            <p className="text-xs text-muted-foreground mt-3 mb-1"><strong className="text-red-400">Cannot</strong> be hedged items:</p>
                                            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                                <li>Held-to-maturity investments (for interest rate or prepayment risk)</li>
                                                <li>The entity&apos;s own equity instruments</li>
                                                <li>Forecast transactions that are not highly probable</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-2 text-sm">4. Expected to be Highly Effective</h4>
                                            <p className="text-muted-foreground text-xs m-0">&quot;Highly effective&quot; is defined with quantitative precision (see the 80–125% rule below).</p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-2 text-sm">5. Reliably Measurable</h4>
                                            <p className="text-muted-foreground text-xs m-0">Fair value or cash flows of both the hedging instrument and the hedged item must be reliably measurable.</p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-2 text-sm">6. Ongoing Assessment</h4>
                                            <p className="text-muted-foreground text-xs m-0">Assessed <strong className="text-foreground">prospectively</strong> (at designation and each reporting date) and <strong className="text-foreground">retrospectively</strong> (on actual results).</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: 80-125% */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    The Effectiveness Test: The 80–125% Rule
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The most distinctive (and criticised) aspect of IAS 39. The test is mechanical: examiners expect you to <strong className="text-foreground">calculate the ratio, state whether it falls within range, and conclude</strong>. Each step earns marks.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Effectiveness Ratio</h3>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-2">
                                        <p className="text-foreground m-0">Change in FV / cash flows of the hedging instrument</p>
                                        <p className="text-muted-foreground m-0">÷</p>
                                        <p className="text-foreground m-0">Change in FV / cash flows of the hedged item</p>
                                        <p className="text-accent m-0 pt-2 border-t border-border">Must fall within 80% to 125%</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-3">Example A: Passes</h3>
                                        <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                            <div className="flex justify-between"><span>Forward contract gain</span><span>+R1,050,000</span></div>
                                            <div className="flex justify-between border-b border-border pb-2"><span>Bond fair value loss</span><span>−R1,000,000</span></div>
                                            <div className="flex justify-between font-bold text-green-400"><span>1,050,000 ÷ 1,000,000</span><span>105%</span></div>
                                        </div>
                                        <p className="text-muted-foreground text-sm mt-3 m-0">Within 80–125% → <strong className="text-foreground">highly effective</strong>.</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-3">Example B: Fails</h3>
                                        <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                            <div className="flex justify-between"><span>Hedging instrument gain</span><span>+R700,000</span></div>
                                            <div className="flex justify-between border-b border-border pb-2"><span>Hedged item loss</span><span>−R1,000,000</span></div>
                                            <div className="flex justify-between font-bold text-red-400"><span>700,000 ÷ 1,000,000</span><span>70%</span></div>
                                        </div>
                                        <p className="text-muted-foreground text-sm mt-3 m-0">Outside 80–125% → <strong className="text-foreground">not effective</strong>. Hedge accounting must be discontinued from that assessment date.</p>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Problems with the 80–125% Rule</h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">Cliff effect:</strong> a hedge that is 79% effective gets no hedge accounting; 80% gets full treatment.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">Arbitrary threshold:</strong> there is no theoretical basis for the range.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">Mechanistic:</strong> economic hedges that miss the ratio are excluded even if risk management is sound.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">Volatility from exclusion:</strong> when hedge accounting is lost, the derivative&apos;s full fair value movement hits P/L.</span>
                                        </li>
                                    </ul>
                                    <p className="text-muted-foreground text-xs mt-4 m-0">These problems were a primary driver for IFRS 9&apos;s principles-based effectiveness approach (Part 8).</p>
                                </div>
                            </section>

                            {/* Section 6: Fair value hedge */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Type 1: Fair Value Hedge Accounting
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    <strong className="text-foreground">Objective:</strong> to offset exposure to changes in the fair value of a recognised asset, liability or firm commitment. Both sides go to <strong className="text-foreground">P/L</strong>: the gain/loss on the hedging instrument, and the gain/loss on the hedged item attributable to the hedged risk (adjusting the hedged item&apos;s carrying amount).
                                </p>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Key insight:</strong> the hedged item is <strong className="text-foreground">adjusted</strong> for the fair value movement attributable to the hedged risk, even if it would normally be carried at amortised cost. This is called the &quot;hedge adjustment&quot; or &quot;basis adjustment.&quot;
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Worked Example: Interest Rate Swap</h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-4">
                                        <li>Entity issues a 3-year fixed-rate bond at 8% (face value R10,000,000), a liability at amortised cost</li>
                                        <li>Enters into a receive-fixed, pay-floating interest rate swap to convert the fixed rate exposure to floating</li>
                                        <li>At year end: interest rates rise → fair value of bond falls → fair value of swap (asset position) rises</li>
                                        <li>Swap fair value gain: <strong className="text-foreground">+R200,000</strong>; bond fair value decrease attributable to interest rate risk: <strong className="text-foreground">−R200,000</strong></li>
                                    </ul>
                                    <h4 className="font-display font-bold text-foreground mb-3 text-sm">Journal Entries: Year 1</h4>
                                    <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                        <p className="text-muted-foreground italic m-0">Gain on hedging instrument (swap):</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Swap Asset</span><span>200,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Fair Value Gain (P/L)</span><span>200,000</span></div>
                                        <p className="text-muted-foreground italic m-0 pt-2">Loss on hedged item (bond hedge adjustment):</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Fair Value Loss (P/L)</span><span>200,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Bond Payable (hedge adjustment)</span><span>200,000</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-4 m-0">
                                        <strong className="text-foreground">Net P/L impact:</strong> R200,000 gain − R200,000 loss = <strong className="text-accent">NIL</strong>. The two movements cancel out, which is exactly the purpose of fair value hedge accounting.
                                    </p>
                                </div>
                            </section>

                            {/* Section 7: Cash flow hedge */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    Type 2: Cash Flow Hedge Accounting
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    <strong className="text-foreground">Objective:</strong> to offset exposure to variability in cash flows attributable to a particular risk associated with a recognised asset/liability or a highly probable forecast transaction.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Component</th>
                                                    <th className="text-left py-2 text-foreground">Treatment</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4"><strong className="text-foreground">Effective portion</strong> of gain/loss on hedging instrument</td>
                                                    <td className="py-2"><strong className="text-foreground">OCI</strong> (deferred until the hedged cash flow affects P/L)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4"><strong className="text-foreground">Ineffective portion</strong> of gain/loss on hedging instrument</td>
                                                    <td className="py-2"><strong className="text-foreground">P/L immediately</strong></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hedged transaction occurs and affects P/L</td>
                                                    <td className="py-2"><strong className="text-foreground">Reclassify</strong> from OCI to P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Hedged transaction results in a non-financial asset/liability</td>
                                                    <td className="py-2"><strong className="text-foreground">Basis adjustment</strong> (include in cost of asset) OR reclassify from OCI when it affects P/L</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Only the effective portion goes to OCI.</strong> Any ineffectiveness (gain/loss on the derivative that doesn&apos;t offset the hedged item) goes straight to P/L. This is where the 80–125% test has bite: large ineffectiveness means large immediate P/L charges.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Worked Example: Forward Contract (Sasol)</h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-4">
                                        <li>Sasol expects to purchase 1,000,000 barrels of crude oil in 6 months (highly probable forecast transaction)</li>
                                        <li>Enters into a forward contract to buy oil at $80/barrel (hedging instrument)</li>
                                        <li>At reporting date, oil has risen to $90/barrel → forward has a fair value of $10,000,000 gain (effective)</li>
                                        <li>6 months later, oil is purchased at a settlement price of $88/barrel → actual gain on forward = $8,000,000</li>
                                    </ul>
                                    <h4 className="font-display font-bold text-foreground mb-3 text-sm">At Reporting Date</h4>
                                    <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2 mb-4">
                                        <p className="text-muted-foreground italic m-0">Recognise effective portion in OCI:</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Forward Contract (Asset)</span><span>10,000,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Cash Flow Hedge Reserve (OCI)</span><span>10,000,000</span></div>
                                    </div>
                                    <h4 className="font-display font-bold text-foreground mb-3 text-sm">When Oil is Purchased</h4>
                                    <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                        <p className="text-muted-foreground italic m-0">Settle forward contract:</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Cash</span><span>8,000,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Forward Contract (Asset)</span><span>8,000,000</span></div>
                                        <p className="text-muted-foreground italic m-0 pl-8">(plus adjustment for change in FV since reporting date)</p>
                                        <p className="text-muted-foreground italic m-0 pt-2">Recognise oil inventory (hedged item) at spot price:</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Inventory (Oil)</span><span>88,000,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Cash</span><span>88,000,000</span></div>
                                        <p className="text-muted-foreground italic m-0 pt-2">Reclassify OCI to reduce cost of inventory (basis adjustment):</p>
                                        <div className="flex justify-between text-foreground"><span>Dr Cash Flow Hedge Reserve (OCI)</span><span>8,000,000</span></div>
                                        <div className="flex justify-between text-accent pl-4"><span>Cr Inventory (Oil)</span><span>8,000,000</span></div>
                                        <div className="flex justify-between font-bold text-accent border-t border-border pt-2"><span>Net: Inventory carried at</span><span>R80,000,000</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-4 m-0">
                                        <strong className="text-foreground">Economic result:</strong> Sasol effectively paid $80/barrel regardless of market movements, and the hedge accounting reflects this (locked-in forward price).
                                    </p>
                                </div>
                            </section>

                            {/* Section 8: Net investment hedge */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Type 3: Net Investment Hedge
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    <strong className="text-foreground">Objective:</strong> to hedge the foreign currency exposure on a net investment in a foreign operation (subsidiary, associate, JV, branch).
                                </p>
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2 text-sm">Effective portion</h4>
                                        <p className="text-muted-foreground text-xs m-0"><strong className="text-foreground">OCI</strong> (translation reserve)</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2 text-sm">Ineffective portion</h4>
                                        <p className="text-muted-foreground text-xs m-0"><strong className="text-foreground">P/L</strong></p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2 text-sm">On disposal of the foreign operation</h4>
                                        <p className="text-muted-foreground text-xs m-0"><strong className="text-foreground">Reclassify</strong> cumulative OCI to P/L</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Uniquely, both <strong className="text-foreground">derivative</strong> and <strong className="text-foreground">non-derivative</strong> instruments can be used as hedging instruments here. A common real-world example is a foreign currency <strong className="text-foreground">borrowing</strong> hedging the FX exposure on a foreign subsidiary.
                                </p>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">Example: Naspers</h3>
                                    <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                        <li>• USD subsidiary with net assets of <strong className="text-foreground">$50,000,000</strong></li>
                                        <li>• USD borrowings of <strong className="text-foreground">$30,000,000</strong> designated as a net investment hedge</li>
                                        <li>• If ZAR weakens against USD: the subsidiary&apos;s net assets increase in ZAR (gain in OCI under IAS 21). The USD borrowing also increases in ZAR (loss), but this loss goes to OCI (instead of P/L) under the hedge.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 9: Discontinuation */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Discontinuation of Hedge Accounting
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Reason</th>
                                                    <th className="text-left py-2 text-foreground">Effect</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hedging instrument expires, is sold, terminated or exercised</td>
                                                    <td className="py-2">Prospective discontinuation</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hedge no longer meets qualifying criteria (e.g. fails effectiveness test)</td>
                                                    <td className="py-2">Prospective discontinuation</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forecast transaction is no longer highly probable</td>
                                                    <td className="py-2">OCI balance reclassified to P/L immediately</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Entity revokes the designation (voluntary)</td>
                                                    <td className="py-2">Prospective discontinuation</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Still expected to occur</h3>
                                        <p className="text-muted-foreground text-sm m-0">On discontinuing a cash flow hedge, the cumulative OCI balance <strong className="text-foreground">remains</strong> and is reclassified when the transaction affects P/L.</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">No longer expected to occur</h3>
                                        <p className="text-muted-foreground text-sm m-0">The cumulative OCI balance is reclassified to P/L <strong className="text-foreground">immediately</strong>.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 10: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">10</span>
                                    Common Student Pitfalls
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Pitfall</th>
                                                    <th className="text-left py-2 text-foreground">Correct Approach</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Applying hedge accounting without documentation at inception</td>
                                                    <td className="py-2">Documentation must exist at the START, not retroactively</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Putting the ineffective portion into OCI</td>
                                                    <td className="py-2">Ineffective portion always goes to P/L immediately</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forgetting that a fair value hedge adjusts the hedged item&apos;s carrying amount</td>
                                                    <td className="py-2">The hedged item (e.g. bond at amortised cost) is adjusted for hedge-attributable FV changes</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Confusing cash flow and fair value hedges</td>
                                                    <td className="py-2">Fixed rate exposure → fair value hedge. Variable / forecast → cash flow hedge</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Recycling the OCI balance when the hedged forecast transaction is still probable</td>
                                                    <td className="py-2">Only recycle when the transaction affects P/L (or if no longer probable → recycle immediately)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Ignoring the 80–125% test in IAS 39 questions</td>
                                                    <td className="py-2">Always calculate the ratio; conclude on whether hedge accounting continues</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 11: Exam technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">11</span>
                                    Exam Technique
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Identify the Type of Hedge</h4>
                                            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                                <li>Recognised asset/liability or firm commitment? → <strong className="text-foreground">Fair value hedge</strong></li>
                                                <li>Forecast transaction or variable rate item? → <strong className="text-foreground">Cash flow hedge</strong></li>
                                                <li>Net investment in a foreign operation? → <strong className="text-foreground">Net investment hedge</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">For Cash Flow Hedge Questions</h4>
                                            <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4 m-0">
                                                <li>Determine the effective and ineffective portions</li>
                                                <li>Effective → OCI; ineffective → P/L</li>
                                                <li>Reclassify OCI to P/L when the hedged item affects P/L</li>
                                                <li>Show the cumulative OCI balance (hedge reserve) movement</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <h4 className="font-display font-bold text-foreground mb-4">Mark Allocation: a 12-mark hedge accounting question</h4>
                                    <div className="bg-card rounded-lg p-5 font-mono text-xs space-y-2">
                                        <div className="flex justify-between"><span>Identify type of hedge with justification</span><span>2</span></div>
                                        <div className="flex justify-between"><span>Check qualifying criteria</span><span>2</span></div>
                                        <div className="flex justify-between"><span>Effectiveness assessment (80–125%)</span><span>2</span></div>
                                        <div className="flex justify-between"><span>Journal entries for each period</span><span>4</span></div>
                                        <div className="flex justify-between border-b border-border pb-2"><span>Discontinuation treatment (if applicable)</span><span>2</span></div>
                                        <div className="flex justify-between font-bold text-accent"><span>Total</span><span>12</span></div>
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
                                        {[
                                            ["Hedge accounting", "prevents artificial P/L volatility by matching gains/losses on the hedging instrument with the hedged item."],
                                            ["Three hedge types:", "fair value, cash flow and net investment."],
                                            ["Six criteria", "must all be met; documentation at inception is non-negotiable."],
                                            ["The 80–125% test", "is IAS 39's quantitative threshold; failing it means losing hedge accounting."],
                                            ["Fair value hedges:", "both the derivative and the hedged item are adjusted through P/L, so they cancel."],
                                            ["Cash flow hedges:", "effective portion in OCI; reclassified to P/L when the hedged cash flow affects P/L."],
                                            ["Net investment hedges:", "effective portion in OCI (translation reserve); recycled on disposal of the foreign operation."],
                                        ].map(([label, text], i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">
                                                    <strong className="text-foreground">{label}</strong> {text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming Up Next
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    In Part 8, we&apos;ll see how <strong className="text-foreground">IFRS 9</strong> replaced the 80–125% rule with a principles-based effectiveness assessment, introduced rebalancing, and widened what can be hedged.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-6/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 6: Impairment (ECL)
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-8/">
                                    Part 8: Hedge Accounting: IFRS 9
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Stuck on Hedge Journals?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Knowing which side goes to OCI and which to P/L is where most hedge accounting marks are won or lost. Let&apos;s work through a full question together.
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
