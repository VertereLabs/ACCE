import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lightbulb, Calculator, Layers, Gauge, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 6: Impairment (ECL) | ACCE Tutors",
    description: "IFRS 9 expected credit losses: the three-stage model, SICR and the 30-day backstop, PD x LGD x EAD, provision matrices, and POCI assets.",
    keywords: "IFRS 9 impairment, expected credit loss, ECL, three-stage model, SICR, 30 days past due, 12-month ECL, lifetime ECL, provision matrix, simplified approach, POCI, credit-adjusted EIR",
    alternates: {
        canonical: "/guides/ifrs-9/part-6/",
    },
};

export default function IFRS9Part6Page() {
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
                                Part 6 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 6: From Incurred to Expected
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Impairment: The Expected Credit Loss (ECL) Model
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Arguably the most significant, and most complex, change IFRS 9 introduced. Understanding <em>why</em> the model changed is the key to understanding <em>how</em> it works.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Paradigm shift */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Paradigm Shift
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-3">IAS 39: Incurred Loss</h3>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            Impairment only when there was <strong className="text-foreground">objective evidence of impairment</strong>, i.e. after a loss event had already occurred. This &quot;trigger event&quot; approach meant:
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>A healthy borrower who had never missed a payment could carry significant credit risk build-up, with no impairment until something happened</li>
                                            <li>Banks recognised losses too late, in large, sudden amounts</li>
                                            <li>In 2008, banks wrote off billions overnight because losses had accumulated invisibly</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-3">IFRS 9: Expected Credit Loss</h3>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            <strong className="text-foreground">Impairment is recognised from the moment a financial asset is first recognised</strong>, because every loan carries some probability of default, even if very small.
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Day 1 loss allowances exist for all in-scope assets (even performing ones)</li>
                                            <li>Loss allowances increase as credit quality deteriorates</li>
                                            <li>Losses are recognised earlier, in smaller, more frequent amounts</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        The G20 and IASB were unambiguous: the incurred loss model was <strong className="text-foreground">&quot;too little, too late.&quot;</strong>
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Scope */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Scope of the Impairment Model
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Applies to</h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /><span>Financial assets at <strong className="text-foreground">amortised cost</strong></span></li>
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" /><span>Financial assets at <strong className="text-foreground">FVOCI (debt instruments)</strong></span></li>
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />Lease receivables (IFRS 16)</li>
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />Contract assets (IFRS 15)</li>
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />Loan commitments (not in scope of FVTPL)</li>
                                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />Financial guarantee contracts (not measured at FVTPL)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-4">Does NOT apply to</h3>
                                        <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• Financial assets at FVTPL</li>
                                            <li>• Equity instruments (at FVTPL or under the FVOCI equity option)</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Three stages */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    The Three-Stage (General) Model
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The heart of IFRS 9 impairment. If you understand stages, SICR triggers and the interest base (gross vs net), you can handle any ECL question. Assets are staged by how their credit quality has changed <strong className="text-foreground">since initial recognition</strong>.
                                </p>
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-1">Stage 1</h3>
                                        <p className="text-xs text-muted-foreground mb-3 font-bold">Performing</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">When:</strong> no SICR since initial recognition (or low credit risk at reporting date)</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">Allowance:</strong> 12-month ECL</p>
                                        <p className="text-sm text-muted-foreground m-0"><strong className="text-foreground">Interest on:</strong> GROSS carrying amount</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-1">Stage 2</h3>
                                        <p className="text-xs text-muted-foreground mb-3 font-bold">Underperforming</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">When:</strong> significant increase in credit risk (SICR), not yet credit-impaired</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">Allowance:</strong> Lifetime ECL</p>
                                        <p className="text-sm text-muted-foreground m-0"><strong className="text-foreground">Interest on:</strong> GROSS carrying amount</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-1">Stage 3</h3>
                                        <p className="text-xs text-muted-foreground mb-3 font-bold">Credit-Impaired</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">When:</strong> one or more loss events with a detrimental impact on estimated future cash flows</p>
                                        <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">Allowance:</strong> Lifetime ECL</p>
                                        <p className="text-sm text-muted-foreground m-0"><strong className="text-foreground">Interest on:</strong> NET carrying amount (gross minus loss allowance)</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">12-month ECL is not 12 months of cash flows</h4>
                                            <p className="text-sm text-muted-foreground m-0">It is the probability of default within 12 months × loss given default × exposure at default: the portion of lifetime losses attributable to defaults that could occur in the next 12 months.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Layers className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">The &quot;cliff effect&quot; and the Stage 3 difference</h4>
                                            <p className="text-sm text-muted-foreground m-0">The jump from Stage 1 to Stage 2 can trigger a large increase in the allowance. The key operational difference between Stages 2 and 3 is the interest base: in Stage 3, interest is calculated on the reduced (&quot;credit-adjusted&quot;) balance.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Indicators of credit impairment</h3>
                                    <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
                                        <li>• Significant financial difficulty of the borrower</li>
                                        <li>• Breach of contract (e.g. default or delinquency in interest/principal payments)</li>
                                        <li>• Lender granting a concession for economic or contractual reasons related to the borrower&apos;s difficulty</li>
                                        <li>• It becoming probable that the borrower will enter bankruptcy</li>
                                        <li>• Disappearance of an active market for the financial asset</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Components */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Calculating ECL: The Components
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <p className="font-mono text-accent m-0">ECL = PD × LGD × EAD × Discount factor</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Component</th>
                                                    <th className="text-left py-2 text-foreground">Definition</th>
                                                    <th className="text-left py-2 text-foreground">Example</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4"><strong className="text-foreground">PD</strong></td>
                                                    <td className="py-2 pr-4">Probability of Default: likelihood the borrower defaults</td>
                                                    <td className="py-2">2% chance of default in 12 months</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4"><strong className="text-foreground">LGD</strong></td>
                                                    <td className="py-2 pr-4">Loss Given Default: % of exposure lost if default occurs</td>
                                                    <td className="py-2">45% of outstanding balance lost</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4"><strong className="text-foreground">EAD</strong></td>
                                                    <td className="py-2 pr-4">Exposure at Default: outstanding amount at time of default</td>
                                                    <td className="py-2">R1,000,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4"><strong className="text-foreground">Discount factor</strong></td>
                                                    <td className="py-2 pr-4">Discounts the expected loss back to reporting date using the EIR</td>
                                                    <td className="py-2">EIR = 8%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">12-Month ECL vs Lifetime ECL</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground"></th>
                                                    <th className="text-left py-2 text-foreground">12-Month ECL (Stage 1)</th>
                                                    <th className="text-left py-2 text-foreground">Lifetime ECL (Stages 2 & 3)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">PD horizon</td>
                                                    <td className="py-2 pr-4">12-month PD</td>
                                                    <td className="py-2">PD over full remaining life</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Loss calculation</td>
                                                    <td className="py-2 pr-4 font-mono">PD₁₂ₘ × LGD × EAD</td>
                                                    <td className="py-2 font-mono">Σ PDₜ × LGD × EADₜ for each year t</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground">Result</td>
                                                    <td className="py-2 pr-4">Smaller allowance</td>
                                                    <td className="py-2">Larger allowance</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-2">SA context: ECL in practice</h4>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            The big banks (<strong className="text-foreground">FNB, ABSA, Nedbank, Standard Bank</strong>) carry ECL allowances worth tens of billions of rands on home loan, vehicle finance and corporate books. Key considerations:
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li><strong className="text-foreground">Macroeconomic overlays:</strong> GDP forecasts, unemployment, load shedding severity and ZAR/USD projections feed into PD and LGD</li>
                                            <li><strong className="text-foreground">SOE credit risk:</strong> exposure to Eskom and Transnet requires careful SICR assessment</li>
                                            <li><strong className="text-foreground">Unsecured lending:</strong> personal loans and store cards carry higher PDs and LGDs</li>
                                        </ul>
                                    </div>
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                            <p className="text-muted-foreground text-sm m-0">
                                                <strong className="text-foreground">Exam Tip:</strong> PD, LGD and EAD are usually given to you. The skill is assembling them correctly, applying the right stage, and recognising changes in the loss allowance in P/L.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: SICR */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Significant Increase in Credit Risk (SICR)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The most judgemental part of the model, and the Stage 1 → Stage 2 trigger. Compare the <strong className="text-foreground">risk of default at the reporting date</strong> with the <strong className="text-foreground">risk of default at initial recognition</strong>. IFRS 9 uses the <em>change</em> in credit risk, not the absolute level: a BBB-rated borrower that deteriorates to BB has had a significant increase in credit risk, even though BB is still investment grade.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Quantitative indicators</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Significant increase in PD (e.g. PD has doubled since initial recognition)</li>
                                            <li>Downgrade below a specified credit rating threshold</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Qualitative indicators</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Breach of covenants</li>
                                            <li>Extension of payment terms as an accommodation</li>
                                            <li>Borrower in significant financial difficulty</li>
                                            <li>Adverse change in business, financial or economic conditions</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">30-Day Backstop (IFRS 9.5.5.11)</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                There is a <strong className="text-foreground">rebuttable presumption</strong> that credit risk has increased significantly when contractual payments are <strong className="text-foreground">more than 30 days past due</strong>. This is a minimum floor: SICR can be triggered earlier.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-2">SA-specific SICR triggers</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Industry deterioration (e.g. construction downturn, retail under pressure from falling consumer spending)</li>
                                            <li>Material adverse changes in the operating environment of SOE counterparties</li>
                                            <li>Borrowers entering business rescue under the Companies Act</li>
                                            <li>Sector-wide credit events (e.g. the Steinhoff collapse triggering reassessment of related exposures)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-2 text-accent mb-3">
                                            <Gauge className="w-5 h-5" />
                                            <h4 className="font-bold text-foreground m-0">Low credit risk simplification</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground m-0">
                                            If an asset has <strong className="text-foreground">low credit risk</strong> at the reporting date, the entity may assume there has been no SICR (Stage 1 applies). Low credit risk approximates an investment-grade equivalent (broadly, a PD comparable to Baa3/BBB− or better).
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Probability weighting */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Measurement: Probability Weighting
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    ECL is neither a worst-case nor a best-case scenario. It must reflect (1) an <strong className="text-foreground">unbiased, probability-weighted amount</strong>, (2) the <strong className="text-foreground">time value of money</strong> (discounted at the EIR), and (3) <strong className="text-foreground">reasonable and supportable information</strong> available without undue cost or effort.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Example: A R5,000,000 Loan at Year End
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Scenario</th>
                                                    <th className="text-right py-2 text-foreground">PD</th>
                                                    <th className="text-right py-2 text-foreground">LGD</th>
                                                    <th className="text-right py-2 text-foreground">Loss</th>
                                                    <th className="text-right py-2 text-foreground">Probability</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">No default</td>
                                                    <td className="py-2 text-right">70%</td>
                                                    <td className="py-2 text-right">n/a</td>
                                                    <td className="py-2 text-right font-mono">0</td>
                                                    <td className="py-2 text-right">70%</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Default, partial recovery</td>
                                                    <td className="py-2 text-right">20%</td>
                                                    <td className="py-2 text-right">40%</td>
                                                    <td className="py-2 text-right font-mono">R2,000,000</td>
                                                    <td className="py-2 text-right">20%</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">Default, full loss</td>
                                                    <td className="py-2 text-right">10%</td>
                                                    <td className="py-2 text-right">100%</td>
                                                    <td className="py-2 text-right font-mono">R5,000,000</td>
                                                    <td className="py-2 text-right">10%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1">
                                        <p className="text-muted-foreground m-0">ECL = (0.70 × R0) + (0.20 × R2,000,000) + (0.10 × R5,000,000)</p>
                                        <p className="text-muted-foreground m-0">= R0 + R400,000 + R500,000</p>
                                        <p className="text-accent font-bold m-0">= R900,000 (before discounting)</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: P/L recognition */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    Recognising ECL Changes in P/L
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Changes in the loss allowance (increases <em>and</em> decreases) are recognised as <strong className="text-foreground">impairment gains or losses in P/L</strong>.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <ul className="space-y-3 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li><strong className="text-foreground">Allowance increases:</strong> impairment loss (debit P/L)</li>
                                            <li><strong className="text-foreground">Allowance decreases:</strong> impairment gain (credit P/L), often called a &quot;reversal&quot;</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="bg-card rounded-lg font-mono text-sm space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Impairment Loss (P/L)</span><span className="text-muted-foreground text-xs">[increase]</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loss Allowance</span><span className="text-muted-foreground text-xs">[SOFP contra]</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">FVOCI debt:</strong> the loss allowance does not reduce the carrying amount on the balance sheet (the asset is carried at fair value). Instead, the loss allowance is recognised in P/L and OCI is adjusted.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Simplified approach */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    The Simplified Approach
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    No staging: the entity always recognises <strong className="text-foreground">lifetime ECL from day one</strong>. This dramatically simplifies things for entities with large volumes of short-duration receivables (retailers, manufacturers, service companies).
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Mandatory for</h3>
                                        <p className="text-muted-foreground text-sm m-0">Trade receivables and contract assets <strong className="text-foreground">without</strong> a significant financing component</p>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">Optional for</h3>
                                        <p className="text-muted-foreground text-sm m-0">Trade receivables <strong className="text-foreground">with</strong> a significant financing component, and lease receivables (IFRS 16)</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Example: Provision Matrix
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Historical loss rates, adjusted for forward-looking information, applied to ageing buckets.
                                    </p>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Ageing Bucket</th>
                                                    <th className="text-right py-2 text-foreground">Receivables</th>
                                                    <th className="text-right py-2 text-foreground">Historical Rate</th>
                                                    <th className="text-right py-2 text-foreground">Adjusted Rate</th>
                                                    <th className="text-right py-2 text-foreground">ECL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Current (0–30 days)</td>
                                                    <td className="py-2 text-right font-mono">R2,000,000</td>
                                                    <td className="py-2 text-right">0.3%</td>
                                                    <td className="py-2 text-right">0.5%</td>
                                                    <td className="py-2 text-right font-mono">R10,000</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">31–60 days</td>
                                                    <td className="py-2 text-right font-mono">R800,000</td>
                                                    <td className="py-2 text-right">1.2%</td>
                                                    <td className="py-2 text-right">1.8%</td>
                                                    <td className="py-2 text-right font-mono">R14,400</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">61–90 days</td>
                                                    <td className="py-2 text-right font-mono">R400,000</td>
                                                    <td className="py-2 text-right">3.5%</td>
                                                    <td className="py-2 text-right">5.0%</td>
                                                    <td className="py-2 text-right font-mono">R20,000</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">91–180 days</td>
                                                    <td className="py-2 text-right font-mono">R200,000</td>
                                                    <td className="py-2 text-right">8.0%</td>
                                                    <td className="py-2 text-right">12.0%</td>
                                                    <td className="py-2 text-right font-mono">R24,000</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">&gt;180 days</td>
                                                    <td className="py-2 text-right font-mono">R100,000</td>
                                                    <td className="py-2 text-right">25.0%</td>
                                                    <td className="py-2 text-right">35.0%</td>
                                                    <td className="py-2 text-right font-mono">R35,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 text-foreground font-bold">Total</td>
                                                    <td className="py-2 text-right font-mono text-foreground font-bold">R3,500,000</td>
                                                    <td className="py-2"></td>
                                                    <td className="py-2"></td>
                                                    <td className="py-2 text-right font-mono text-foreground font-bold">R103,400</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1">
                                        <p className="text-muted-foreground text-xs m-0">Prior year allowance was R80,000 (increase from R80,000 to R103,400):</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Impairment Loss (P/L)</span><span className="text-foreground">23,400</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loss Allowance</span><span className="text-accent">23,400</span></div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            Historical loss rates <strong className="text-foreground">must be adjusted for forward-looking information</strong>. If the economy is deteriorating, macroeconomic factors (unemployment trends, GDP forecasts, sectoral outlooks) must be incorporated. Pure historical rates without adjustment are NOT acceptable under IFRS 9.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h4 className="font-bold text-foreground mb-2">SA context: the provision matrix in practice</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Retailers like <strong className="text-foreground">Woolworths Financial Services</strong>, <strong className="text-foreground">Mr Price Money</strong> and <strong className="text-foreground">TFG</strong> (The Foschini Group) apply the provision matrix to their store card and credit portfolios; applying the three-stage model account by account to hundreds of thousands of accounts would be impractical. Forward-looking adjustments typically consider:
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li><strong className="text-foreground">Unemployment rate:</strong> rising unemployment directly increases consumer credit defaults</li>
                                        <li><strong className="text-foreground">Interest rate cycle:</strong> SARB repo rate increases raise instalments and default probability</li>
                                        <li><strong className="text-foreground">Consumer confidence index:</strong> a proxy for willingness and ability to pay</li>
                                        <li><strong className="text-foreground">Load shedding:</strong> prolonged outages reduce business revenue, affecting retail customers and SME borrowers</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 9: IAS 39 vs IFRS 9 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    IAS 39 vs IFRS 9 Impairment
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Feature</th>
                                                    <th className="text-left py-2 text-foreground">IAS 39 (Incurred Loss)</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9 (ECL)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">When recognised</td>
                                                    <td className="py-2 pr-4">Only after a loss event occurs</td>
                                                    <td className="py-2">From initial recognition</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Trigger</td>
                                                    <td className="py-2 pr-4">Objective evidence of impairment</td>
                                                    <td className="py-2">Increase in credit risk</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Measurement</td>
                                                    <td className="py-2 pr-4">PV of impaired cash flows</td>
                                                    <td className="py-2">PD × LGD × EAD (probability-weighted)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Forward-looking</td>
                                                    <td className="py-2 pr-4">No (historical focus)</td>
                                                    <td className="py-2">Yes (must use forward-looking info)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Complexity</td>
                                                    <td className="py-2 pr-4">Lower (binary: impaired or not)</td>
                                                    <td className="py-2">Higher (3 stages, continuous assessment)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Timing of losses</td>
                                                    <td className="py-2 pr-4">Too late</td>
                                                    <td className="py-2">Earlier, more gradual</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground">Trade receivables</td>
                                                    <td className="py-2 pr-4">Specific or portfolio provision</td>
                                                    <td className="py-2">Provision matrix (simplified approach)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 10: Worked example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">10</span>
                                    Worked Example: Three-Stage Model
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A bank lends <strong className="text-foreground">R10,000,000</strong> to a corporate borrower on 1 January 20X1 at an EIR of 8%.
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-2">1 Jan 20X1: Stage 1</h3>
                                        <p className="text-muted-foreground text-sm mb-3">No SICR yet. 12-month ECL = PD₁₂ₘ 1% × LGD 40% × EAD R10,000,000 = <strong className="text-foreground">R40,000</strong></p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Impairment Loss (P/L)</span><span className="text-foreground">40,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loss Allowance</span><span className="text-accent">40,000</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">31 Dec 20X1: Stage 2</h3>
                                        <p className="text-muted-foreground text-sm mb-3">The borrower&apos;s industry is hit by recession and PD has increased materially since origination. Assessed as SICR. Lifetime ECL = <strong className="text-foreground">R480,000</strong> (based on the full PD × LGD × EAD schedule over the remaining 4 years).</p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Impairment Loss (P/L) (480,000 − 40,000)</span><span className="text-foreground">440,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loss Allowance</span><span className="text-accent">440,000</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">31 Dec 20X2: Stage 3</h3>
                                        <p className="text-muted-foreground text-sm mb-3">The borrower misses two consecutive interest payments: credit-impaired. Lifetime ECL reassessed = <strong className="text-foreground">R2,500,000</strong>. Interest income is now on the NET carrying amount: (R10,000,000 − R2,500,000) × 8% = <strong className="text-foreground">R600,000</strong>.</p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <p className="text-muted-foreground m-0">Loss allowance increase:</p>
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Impairment Loss (P/L) (2,500,000 − 480,000)</span><span className="text-foreground">2,020,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loss Allowance</span><span className="text-accent">2,020,000</span></div>
                                            <p className="text-muted-foreground m-0 pt-2">Interest income (on net carrying amount):</p>
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Loan Receivable</span><span className="text-foreground">600,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Interest Income (P/L)</span><span className="text-accent">600,000</span></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 11: Write-offs */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">11</span>
                                    Write-offs and Recoveries
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-2">Write-offs</h4>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            When there is no reasonable expectation of recovery, the <strong className="text-foreground">gross carrying amount</strong> is reduced directly.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1 mb-3">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Loss Allowance</span><span className="text-muted-foreground">[amount written off]</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Loan/Receivable</span><span className="text-muted-foreground">[amount written off]</span></div>
                                        </div>
                                        <p className="text-muted-foreground text-xs m-0">Write-offs reduce both the gross carrying amount AND the loss allowance. They do not affect the NET carrying amount, which already reflected the expected loss.</p>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-2">Recoveries</h4>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            If a written-off amount is subsequently recovered:
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <p className="text-foreground m-0">Dr Cash</p>
                                            <p className="text-accent ml-4 m-0">Cr Impairment Gain (P/L)</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 12: POCI */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">12</span>
                                    Purchased or Originated Credit-Impaired (POCI) Assets
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    An asset is <strong className="text-foreground">POCI</strong> when one or more events with a detrimental impact on estimated future cash flows have already occurred when the entity recognises it: it is impaired on Day 1. Examples: a bank buying non-performing loans at a deep discount, a loan originated to a borrower already in distress (priced for the risk), or debt bought in a distressed debt market.
                                </p>
                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        <strong className="text-foreground">Why different rules?</strong> The credit impairment is already reflected in the purchase price. Applying the normal model would create a massive Day 1 loss allowance on an asset bought <em>knowing</em> it was impaired, at a price that already reflected that risk. That would be economically misleading.
                                    </p>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Feature</th>
                                                    <th className="text-left py-2 text-foreground">Normal Asset</th>
                                                    <th className="text-left py-2 text-foreground">POCI Asset</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Day 1 loss allowance</td>
                                                    <td className="py-2 pr-4">12-month ECL recognised</td>
                                                    <td className="py-2">No separate loss allowance</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">EIR used</td>
                                                    <td className="py-2 pr-4">Original EIR</td>
                                                    <td className="py-2"><strong className="text-foreground">Credit-adjusted EIR</strong> (reflects expected credit losses in the discount rate)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Subsequent impairment</td>
                                                    <td className="py-2 pr-4">Changes in ECL vs initial recognition</td>
                                                    <td className="py-2">Changes in <strong className="text-foreground">lifetime ECL</strong> from purchase date</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground">Staging</td>
                                                    <td className="py-2 pr-4">Stages 1 → 2 → 3</td>
                                                    <td className="py-2">No staging: always lifetime ECL</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground">Interest income</td>
                                                    <td className="py-2 pr-4">Gross (Stages 1 & 2) or Net (Stage 3)</td>
                                                    <td className="py-2">Always on <strong className="text-foreground">net carrying amount</strong> (amortised cost)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Worked Example: POCI Asset
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        A South African bank buys a portfolio of non-performing home loans with a face value of R50,000,000 for R30,000,000. The discount reflects the expected credit losses already embedded in the portfolio. The credit-adjusted EIR (incorporating expected defaults) is 14%.
                                    </p>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
                                        <p className="text-muted-foreground text-xs m-0">At initial recognition:</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Loan Portfolio (POCI)</span><span className="text-foreground">30,000,000</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Cash</span><span className="text-accent">30,000,000</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-3">No separate loss allowance is recognised: the R20,000,000 discount already reflects expected credit losses through the credit-adjusted EIR. Subsequently:</p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li>Interest income is calculated at 14% on the carrying amount</li>
                                        <li>Only <strong className="text-foreground">changes</strong> in lifetime ECL from the purchase date are recognised as impairment gains or losses</li>
                                        <li>Further deterioration: additional impairment loss in P/L</li>
                                        <li>Improvement (higher recoveries than expected): impairment gain in P/L; the carrying amount can increase above the initial recognition amount</li>
                                    </ul>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Exam trap:</strong> students commonly apply the normal three-stage model to POCI assets. The giveaway is that the asset was acquired at a significant discount or was already in default at purchase. When you see this, apply POCI rules, not the general model.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 13: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">13</span>
                                    Common Student Pitfalls
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Pitfall</th>
                                                    <th className="text-left py-2 text-foreground">Correct Approach</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Confusing 12-month ECL with 12 months of cash flows</td>
                                                    <td className="py-2">Losses from defaults in the next 12 months, not 12 monthly payments</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forgetting probability weighting</td>
                                                    <td className="py-2">ECL is NOT the worst-case loss; it is the probability-weighted expected loss</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">General model for trade receivables</td>
                                                    <td className="py-2">Simplified approach is mandatory without a significant financing component</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Ignoring the SICR assessment</td>
                                                    <td className="py-2">Staging is not optional: always assess SICR</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Unadjusted historical loss rates</td>
                                                    <td className="py-2">IFRS 9 requires current and forward-looking information</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Stage 3 interest on the gross amount</td>
                                                    <td className="py-2">Stage 3: interest on NET (gross minus loss allowance)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forgetting FVOCI debt needs impairment</td>
                                                    <td className="py-2">ECL applies to FVOCI debt; the loss goes to P/L (even though the asset is at FV)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Three-stage model for POCI assets</td>
                                                    <td className="py-2">Credit-adjusted EIR; only changes in lifetime ECL from purchase; no staging</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 14: Exam technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">14</span>
                                    Exam Technique
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-3">Step-by-step for ECL questions</h4>
                                        <ol className="text-muted-foreground text-sm space-y-1 list-decimal ml-4 m-0">
                                            <li>Scope: is the asset subject to the ECL model?</li>
                                            <li>Approach: general (3-stage) or simplified?</li>
                                            <li>General model: determine the stage (SICR, 30-day backstop)</li>
                                            <li>Calculate the allowance (12-month or lifetime ECL)</li>
                                            <li>Movement = closing allowance − opening allowance</li>
                                            <li>Recognise in P/L; present journal entries</li>
                                            <li>Interest income: gross (Stages 1 & 2) or net (Stage 3)</li>
                                        </ol>
                                    </div>
                                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-display font-semibold text-foreground mb-2">Typical 10-mark ECL question</h4>
                                                <ul className="text-sm text-muted-foreground space-y-1 m-0 p-0 list-none">
                                                    <li>• Stage determination with reasoning: 3 marks</li>
                                                    <li>• ECL calculation (PD × LGD × EAD): 3 marks</li>
                                                    <li>• Journal entries or P/L impact: 2 marks</li>
                                                    <li>• Interest income calculation: 2 marks</li>
                                                </ul>
                                            </div>
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
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">IAS 39 (incurred loss)</strong> recognised losses too late, only after a trigger event. <strong className="text-foreground">IFRS 9 (ECL)</strong> recognises losses from day one on forward-looking, probability-weighted estimates.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Three stages:</strong> Stage 1 (12-month ECL, interest on gross), Stage 2 (lifetime ECL, interest on gross), Stage 3 (lifetime ECL, interest on net).</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">SICR</strong> is the Stage 1 → 2 trigger; 30 days past due is the backstop.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Simplified approach</strong> (always lifetime ECL) is mandatory for trade receivables without significant financing; the <strong className="text-foreground">provision matrix</strong> is the practical tool, and historical rates MUST be adjusted for forward-looking factors (including, in SA, load shedding).</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground">ECL applies to amortised cost <strong className="text-foreground">AND</strong> FVOCI debt instruments.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">POCI assets</strong> use a credit-adjusted EIR, have no Day 1 loss allowance, and only recognise changes in lifetime ECL from acquisition.</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-5">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 5: Derecognition
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-7">
                                    Part 7: Hedge Accounting: IAS 39
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Staging, SICR or POCI Giving You Trouble?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                ECL questions reward a clear process: scope, approach, stage, measure, journal. Let&apos;s drill it until it&apos;s automatic.
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
