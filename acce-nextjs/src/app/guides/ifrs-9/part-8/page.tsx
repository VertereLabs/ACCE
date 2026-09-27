import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, Lightbulb, CheckCircle2, Calculator, Scale, Shield, Target, RefreshCw, Ban, Layers, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 8: Hedge Accounting: IFRS 9 | ACCE Tutors",
    description: "IFRS 9 hedge accounting: the three effectiveness requirements, rebalancing, no voluntary discontinuation, risk components and costs of hedging.",
    keywords: "IFRS 9 hedge accounting, IAS 39 vs IFRS 9, rebalancing, economic relationship, hedge ratio, risk components, cost of hedging, CA(SA) financial instruments",
    alternates: {
        canonical: "/guides/ifrs-9/part-8/",
    },
};

export default function IFRS9Part8Page() {
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
                                Part 8 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 8: The Principles-Based Framework
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Hedge Accounting: The IFRS 9 Framework
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                IFRS 9&apos;s hedge accounting chapter (Chapter 6) was the third and final phase of the IFRS 9 project. Its goal: align hedge accounting with entities&apos; <strong className="text-foreground">actual risk management activities</strong> and remove IAS 39&apos;s arbitrary, rules-based constraints.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Philosophical shift */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Core Philosophical Shift
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground"></th>
                                                    <th className="text-left py-2 pr-4 text-foreground">IAS 39</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["Philosophy", "Rules-based", "Principles-based"],
                                                    ["Effectiveness test", "Quantitative: 80–125%", "Qualitative: economic relationship"],
                                                    ["Rebalancing", "Not permitted", "Permitted (and required)"],
                                                    ["Voluntary discontinuation", "Permitted", "Not permitted (unless relationship ceases)"],
                                                    ["Risk components", "Limited", "Expanded"],
                                                    ["Hedged items", "Narrower", "Expanded (e.g. aggregated exposures)"],
                                                    ["Disclosures", "IFRS 7", "Enhanced IFRS 7 requirements"],
                                                ].map(([feature, ias39, ifrs9], i, rows) => (
                                                    <tr key={feature} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{feature}</td>
                                                        <td className="py-2 pr-4">{ias39}</td>
                                                        <td className="py-2">{ifrs9}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Qualifying criteria */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    IFRS 9 Qualifying Criteria
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 keeps the same three hedge types (fair value, cash flow, net investment) and the same requirement for formal designation and documentation, but restructures and relaxes the criteria. IAS 39&apos;s six criteria are replaced by <strong className="text-foreground">three effectiveness requirements</strong> (IFRS 9.6.4.1) plus documentation.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h4 className="font-display font-semibold text-foreground mb-2">Criterion 1: Formal Designation and Documentation</h4>
                                    <p className="text-muted-foreground text-sm mb-3">Same as IAS 39: documentation must exist <strong className="text-foreground">at inception</strong> and cover:</p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li>The hedging relationship (instrument + item + risk)</li>
                                        <li>The entity&apos;s risk management objective and strategy</li>
                                        <li>How the entity will assess whether the relationship meets the effectiveness requirements</li>
                                    </ul>
                                </div>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Criterion 2: The Three Effectiveness Requirements</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">(a) Economic Relationship</h4>
                                            <p className="text-xs text-muted-foreground m-0">The hedging instrument and hedged item have values that move in <strong className="text-foreground">opposite directions because of the same risk</strong>. Under IAS 39 you had to <em>prove</em> effectiveness quantitatively; under IFRS 9 you demonstrate a <em>logical reason</em> why they should offset.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">(b) Credit Risk Does Not Dominate</h4>
                                            <p className="text-xs text-muted-foreground m-0">The effect of credit risk on the fair value of the hedging instrument or hedged item must not be so large that it dominates the value changes from the economic relationship. If a highly credit-impaired counterparty wrote your derivative, its value would be driven by the counterparty&apos;s credit risk, not the hedged risk, and the economic relationship breaks down.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Target className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">(c) Hedge Ratio</h4>
                                            <p className="text-xs text-muted-foreground m-0">The designated hedge ratio must be the same as the one the entity actually uses for risk management. An entity cannot designate an artificially high or low ratio to achieve a desired accounting outcome.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: No more 80-125% */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Effectiveness: No More 80–125%
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This is the most significant practical change, and where IAS 39 vs IFRS 9 comparison questions live. Know the five key differences (<strong className="text-foreground">effectiveness test, rebalancing, voluntary discontinuation, risk components, cost of hedging</strong>) and you can score full marks on any comparison question.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">Out: the 80–125% test</h3>
                                        <p className="text-muted-foreground text-sm m-0">IFRS 9 <strong className="text-foreground">abolishes</strong> the rule. There is no quantitative pass/fail threshold for hedge effectiveness.</p>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-2">In: a principles-based assessment</h3>
                                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal ml-4 m-0">
                                            <li>Economic relationship exists (qualitative)</li>
                                            <li>Credit risk doesn&apos;t dominate (qualitative)</li>
                                            <li>Hedge ratio aligns with actual risk management (quantitative, but not against a fixed threshold)</li>
                                        </ol>
                                        <p className="text-muted-foreground text-xs mt-3 m-0">Performed at inception and at each reporting date.</p>
                                    </div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Ineffectiveness Still Hits P/L</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Removing the 80–125% test does NOT mean all ineffectiveness goes to OCI. Ineffectiveness is still calculated the same way as under IAS 39 and recognised in <strong className="text-foreground">P/L</strong>. The change is that you no longer lose hedge accounting entirely if ineffectiveness is large: you recognise the ineffective portion in P/L and continue.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Rebalancing */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Rebalancing: The Key New Concept
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Under IAS 39, if a hedge started to become ineffective (e.g. an entity hedged 100 tons of copper but now only needs to hedge 80 tons), it could either accept the ineffectiveness and risk breaching 80–125%, or voluntarily discontinue and re-designate, causing a discontinuity. IFRS 9&apos;s <strong className="text-foreground">rebalancing</strong> lets the entity adjust the designated quantity of the hedging instrument or hedged item <strong className="text-foreground">without discontinuing</strong> the relationship.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Rebalancing is <em>required</em> (not just permitted) when:</h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The economic relationship still exists
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            Credit risk doesn&apos;t dominate
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            But the hedge ratio no longer reflects what the entity is actually doing for risk management
                                        </li>
                                    </ul>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">Increasing the hedged item</h3>
                                        <p className="text-muted-foreground text-xs mb-3 italic">(or decreasing the hedging instrument)</p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>The additional quantity is a new designation from the rebalancing date</li>
                                            <li>Previously accumulated OCI and basis adjustments are unaffected</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-3">Decreasing the hedged item</h3>
                                        <p className="text-muted-foreground text-xs mb-3 italic">(or increasing the hedging instrument)</p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>The removed portion is a partial discontinuation</li>
                                            <li>Accumulated OCI for that portion is reclassified to P/L (or stays in OCI if the hedged item is still expected to occur)</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Tip:</strong> Think of rebalancing as &quot;fine-tuning&quot; the designation to keep it aligned with reality, without starting over. It makes hedge accounting far more operationally practical than under IAS 39.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Discontinuation */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Discontinuation: Mandatory Only
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Under IFRS 9, <strong className="text-foreground">voluntary discontinuation of a qualifying hedge is NOT permitted</strong>. If the relationship still meets all the qualifying criteria, hedge accounting must continue.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Ban className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Discontinue only when:</h3>
                                    </div>
                                    <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
                                        {[
                                            "The economic relationship no longer exists",
                                            "Credit risk has come to dominate",
                                            "The hedging instrument expires, is sold, terminated or exercised",
                                            "The hedged item ceases to exist (or the forecast transaction is no longer highly probable)",
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        <strong className="text-foreground">Why the change?</strong> Under IAS 39, some entities used voluntary discontinuation opportunistically: discontinuing when it suited them to take OCI gains to P/L, then re-designating. IFRS 9 closes this arbitrage.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6: Risk components & aggregated exposures */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Expanded Eligibility
                                </h2>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Risk Components</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Under IAS 39, only financial items could be designated in their entirety or for a specific risk component (e.g. the JIBAR component of interest rate risk). For <strong className="text-foreground">non-financial items</strong> (commodities, etc.), only the total fair value change could be hedged. IFRS 9 allows <strong className="text-foreground">separately identifiable and reliably measurable</strong> risk components of <strong className="text-foreground">both financial and non-financial items</strong> to be designated.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">The Bakery</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Under IAS 39 it had to designate the full bread input cost (processing, transport, etc.), making a clean hedge impossible. Under IFRS 9 it can designate the <strong className="text-foreground">wheat commodity price component</strong> as the hedged item and a <strong className="text-foreground">wheat futures contract</strong> as the hedging instrument.
                                        </p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">The Airline</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Can hedge the <strong className="text-foreground">jet fuel price component</strong> of its ticket costs using <strong className="text-foreground">crude oil futures</strong> (even if the hedged item is jet fuel, not crude).
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-8">
                                    <div className="flex items-start gap-4">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Note:</strong> for non-financial risk components, the entity must demonstrate that the component is separately identifiable and reliably measurable. This is still a judgement call.
                                        </p>
                                    </div>
                                </div>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Aggregated Exposures</h3>
                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                    <Layers className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">IFRS 9 permits an <strong className="text-foreground">aggregated exposure</strong> (an exposure combined with a derivative) to be designated as a hedged item. For example:</p>
                                        <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Entity has variable rate debt (floating rate risk)</li>
                                            <li>Enters into a receive-floating, pay-fixed swap to convert it to fixed rate (now a fair value hedge)</li>
                                            <li>Then wants to hedge the fair value of the combined &quot;synthetic fixed rate debt&quot; with another derivative</li>
                                        </ul>
                                        <p className="text-xs text-muted-foreground mt-2 m-0">Under IAS 39 the synthetic instrument couldn&apos;t be a hedged item. Under IFRS 9 this layered strategy is permitted.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Accounting entries & cost of hedging */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    Accounting Entries & Costs of Hedging
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The <strong className="text-foreground">accounting entries</strong> for the three hedge types are largely the same as IAS 39 (see Part 7). The changes are in <em>eligibility</em> and <em>ongoing assessment</em>, not in how entries are recorded.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedge Type</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedging Instrument</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedged Item</th>
                                                    <th className="text-left py-2 text-foreground">Net P/L</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Fair value</td>
                                                    <td className="py-2 pr-4">P/L (fair value)</td>
                                                    <td className="py-2 pr-4">P/L (basis adjustment)</td>
                                                    <td className="py-2">Net to zero if perfect</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Cash flow: effective</td>
                                                    <td className="py-2 pr-4">OCI</td>
                                                    <td className="py-2 pr-4">No entry until transaction occurs</td>
                                                    <td className="py-2">Zero (until reclassification)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Cash flow: ineffective</td>
                                                    <td className="py-2 pr-4">P/L</td>
                                                    <td className="py-2 pr-4">No entry</td>
                                                    <td className="py-2">Immediate P/L charge</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground font-medium">Net investment: effective</td>
                                                    <td className="py-2 pr-4">OCI (translation reserve)</td>
                                                    <td className="py-2 pr-4">No separate entry</td>
                                                    <td className="py-2">Zero until disposal</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    <strong className="text-foreground">Costs of hedging</strong> is a new IFRS 9 concept for components excluded from the hedge designation:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Option Time Value</h3>
                                        <p className="text-muted-foreground text-sm mb-3">Designate only the <strong className="text-foreground">intrinsic value</strong> as the hedging instrument. The excluded time value is a cost of hedging:</p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Recognised in OCI initially</li>
                                            <li>Reclassified to P/L systematically over the period the hedge relates to (for transaction-related hedged items) or when the hedged item affects P/L</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">Forward Points</h3>
                                        <p className="text-muted-foreground text-sm m-0">Designate only the <strong className="text-foreground">spot element</strong> of a forward contract. The forward points (premium/discount) are treated similarly as a cost of hedging through OCI.</p>
                                    </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        <strong className="text-foreground">Why it matters:</strong> this treatment stops time value or forward points creating unwanted P/L volatility, while still recognising them as a cost of the hedging strategy over time.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8: Comparison */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    IAS 39 vs IFRS 9: Comprehensive Comparison
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Feature</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">IAS 39</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["Effectiveness test", "80–125% quantitative", "Economic relationship (qualitative)"],
                                                    ["Rebalancing", "Not permitted", "Permitted and required"],
                                                    ["Voluntary discontinuation", "Permitted", "Not permitted"],
                                                    ["Non-financial risk components", "Cannot be designated alone", "Can be designated if identifiable/measurable"],
                                                    ["Aggregated exposures", "Cannot be hedged items", "Can be hedged items"],
                                                    ["Option time value", "Ineffectiveness if excluded from designation", "Cost of hedging treatment (OCI)"],
                                                    ["Forward points", "Ineffectiveness if excluded", "Cost of hedging treatment (OCI)"],
                                                    ["Written options as instruments", "Generally not permitted", "Permitted in some circumstances"],
                                                    ["Macro hedging", "Permitted (IAS 39.AG114–132)", "Not yet addressed; IAS 39 may continue"],
                                                ].map(([feature, ias39, ifrs9], i, rows) => (
                                                    <tr key={feature} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{feature}</td>
                                                        <td className="py-2 pr-4">{ias39}</td>
                                                        <td className="py-2">{ifrs9}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Worked example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Worked Example: Cash Flow Hedge with Rebalancing
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Impala Platinum</h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-4">
                                        <li>Expects to sell 10,000 oz of platinum in 3 months (highly probable)</li>
                                        <li>Enters into a forward contract to sell 10,000 oz at R18,000/oz</li>
                                        <li>At the next reporting date, expects to sell only 8,000 oz (revised forecast)</li>
                                        <li>The economic relationship still exists; credit risk is not dominant</li>
                                    </ul>
                                    <h4 className="font-display font-bold text-foreground mb-3 text-sm">Rebalancing (reducing the hedged item)</h4>
                                    <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2 mb-4">
                                        <div className="flex justify-between gap-4"><span>Before rebalancing</span><span className="text-right">10,000 oz hedged; 10,000 oz forward designated</span></div>
                                        <div className="flex justify-between gap-4 border-b border-border pb-2"><span>After rebalancing</span><span className="text-right">8,000 oz hedged; 8,000 oz forward designated</span></div>
                                        <div className="flex justify-between gap-4 text-accent"><span>Discontinued</span><span className="text-right">2,000 oz forward: assess OCI treatment</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        The 2,000 oz portion of the forward with no corresponding hedged item is discontinued. For its accumulated OCI, assess whether the forecast transaction for those ounces is still expected: if <strong className="text-foreground">NO</strong>, reclassify to P/L immediately; if <strong className="text-foreground">YES</strong>, retain in OCI.
                                    </p>
                                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-xs text-muted-foreground leading-relaxed">
                                        Under IAS 39, this would likely require full discontinuation and re-designation, creating a gap in hedge accounting. Under IFRS 9, rebalancing allows continuous hedge accounting with minimal disruption.
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
                                                {[
                                                    ["Saying IFRS 9 has no effectiveness test", "There is still an effectiveness assessment, just no 80–125% threshold"],
                                                    ["Forgetting that ineffectiveness still goes to P/L", "Removing the 80–125% test doesn't eliminate P/L ineffectiveness"],
                                                    ["Applying voluntary discontinuation under IFRS 9", "IFRS 9 only allows mandatory discontinuation when criteria are no longer met"],
                                                    ["Assuming any risk component can be designated", "Must be separately identifiable AND reliably measurable"],
                                                    ["Ignoring the cost of hedging treatment for time value", "Option time value and forward points have a specific OCI deferral treatment"],
                                                    ["Treating rebalancing as discontinuation", "Rebalancing adjusts an ongoing hedge; it is not a stop and restart"],
                                                ].map(([pitfall, fix], i, rows) => (
                                                    <tr key={pitfall} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4">{pitfall}</td>
                                                        <td className="py-2">{fix}</td>
                                                    </tr>
                                                ))}
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
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 vs IAS 39 comparison questions are common at CTA level. Structure your answer around the five differences:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        {[
                                            ["Effectiveness:", "IAS 39 = 80–125% (quantitative); IFRS 9 = economic relationship (qualitative)"],
                                            ["Rebalancing:", "IAS 39 = not permitted; IFRS 9 = permitted/required"],
                                            ["Discontinuation:", "IAS 39 = voluntary allowed; IFRS 9 = mandatory only"],
                                            ["Eligible items:", "IFRS 9 = broader (risk components of non-financials, aggregated exposures)"],
                                            ["Cost of hedging:", "IFRS 9 introduces specific OCI treatment for time value and forward points"],
                                        ].map(([label, text], i) => (
                                            <li key={label} className="flex items-start gap-3 text-muted-foreground text-sm">
                                                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                                                <span><strong className="text-foreground">{label}</strong> {text}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <RefreshCw className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Any Hedge Question: Always Start By</h4>
                                            <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4 m-0">
                                                <li>Identifying the type (fair value / cash flow / net investment)</li>
                                                <li>Confirming qualifying criteria are met</li>
                                                <li>Determining effective vs ineffective portions</li>
                                                <li>Processing journals in the correct accounts (OCI vs P/L)</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                            <p className="text-muted-foreground text-sm m-0">
                                                <strong className="text-foreground">Mark allocation:</strong> a 10-mark IFRS 9 vs IAS 39 comparison typically allocates 2 marks per key difference. Aim for at least 5 clear, explained differences.
                                            </p>
                                        </div>
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
                                            ["IFRS 9 hedge accounting", "is principles-based; IAS 39 was rules-based."],
                                            ["The 80–125% test is abolished,", "replaced by a qualitative economic relationship assessment."],
                                            ["Ineffectiveness still hits P/L:", "the change is that a hedge doesn't collapse if ineffectiveness is high."],
                                            ["Rebalancing", "adjusts hedge ratios without discontinuation, a major practical improvement."],
                                            ["Voluntary discontinuation is prohibited,", "preventing opportunistic cherry-picking."],
                                            ["Risk components", "of non-financial items can now be designated as hedged items."],
                                            ["Cost of hedging", "(option time value, forward points) gets OCI deferral treatment, not immediate P/L."],
                                            ["Accounting entries", "are largely unchanged from IAS 39; the improvements are in eligibility and assessment."],
                                        ].map(([label, text]) => (
                                            <li key={label} className="flex items-start gap-3">
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
                                    In the final part, we cover <strong className="text-foreground">IFRS 7 disclosures, IAS 32 presentation and transition</strong>, then pull the whole standard together into a mark-earning exam strategy.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-7/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 7: Hedge Accounting: IAS 39
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-9/">
                                    Part 9: Disclosures & Exam Strategy
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                IAS 39 vs IFRS 9 Still Blurry?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Comparison questions reward a tight, structured answer. Let&apos;s practise turning the five key differences into full marks.
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
