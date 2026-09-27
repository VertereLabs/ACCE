import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Calculator, Info, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 3: Measuring Financial Assets | ACCE Tutors",
    description: "IFRS 9 measurement of financial assets: initial fair value, transaction costs, the EIR method, FVOCI debt and equity, FVTPL and reclassification.",
    keywords: "IFRS 9 measurement, effective interest rate, amortised cost table, FVOCI debt, FVOCI equity, FVTPL, transaction costs, below-market loan, reclassification",
    alternates: {
        canonical: "/guides/ifrs-9/part-3/",
    },
};

export default function IFRS9Part3Page() {
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
                                Part 3 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 3: The Numbers
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Measurement of Financial Assets
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Once an asset is classified, measurement follows logically. You need two answers: what do you record on Day 1, and how do you carry it at each reporting date?
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Initial Measurement */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Initial Measurement (IFRS 9.5.1)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    All financial assets are initially measured at <strong className="text-foreground">fair value</strong>. What happens to transaction costs depends on the classification:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Classification</th>
                                                    <th className="text-left py-2 text-foreground">Transaction Costs</th>
                                                    <th className="text-left py-2 text-foreground">Initial Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVTPL</td>
                                                    <td className="py-2 pr-4">Expensed immediately in P/L</td>
                                                    <td className="py-2">Fair value only</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Amortised Cost</td>
                                                    <td className="py-2 pr-4">Added to initial amount</td>
                                                    <td className="py-2">FV + transaction costs</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVOCI (Debt)</td>
                                                    <td className="py-2 pr-4">Added to initial amount</td>
                                                    <td className="py-2">FV + transaction costs</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVOCI (Equity OCI option)</td>
                                                    <td className="py-2 pr-4">Added to initial amount</td>
                                                    <td className="py-2">FV + transaction costs</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-3">Transaction Costs</h3>
                                        <p className="text-xs text-muted-foreground mb-3">Incremental costs directly attributable to the acquisition:</p>
                                        <ul className="space-y-1 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• Brokerage commissions and fees</li>
                                            <li>• Transfer taxes</li>
                                            <li>• Regulatory levies</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-3">NOT Transaction Costs</h3>
                                        <p className="text-xs text-muted-foreground mb-3">Exclude these:</p>
                                        <ul className="space-y-1 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• Finance costs (interest)</li>
                                            <li>• Internal administrative costs</li>
                                            <li>• Debt premium/discount</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Example: Below-Market Loan</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Fair value usually equals the <strong className="text-foreground">transaction price</strong>. When it doesn&apos;t, most commonly with a below-market-rate loan, the difference must be recognised. A parent lends R1,000,000 to its subsidiary at 0% for 3 years when the market rate is 10%.
                                    </p>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm mb-4">
                                        <p className="text-foreground m-0">PV of R1,000,000 in 3 years @ 10%</p>
                                        <p className="text-accent ml-4 m-0">= R1,000,000 × 0.7513148 = R751,314.80</p>
                                    </div>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Account</th>
                                                    <th className="text-right py-2 text-foreground">Dr</th>
                                                    <th className="text-right py-2 text-foreground">Cr</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Loan Receivable</td>
                                                    <td className="py-2 text-right">751,314.80</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Equity (capital contribution to subsidiary)</td>
                                                    <td className="py-2 text-right">248,685.20</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-sans">Cash</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">1,000,000.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-muted-foreground m-0">
                                        The discount (R248,685.20) is the economic substance of the benefit given to the subsidiary: recognised as an equity contribution or expense depending on the relationship.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Amortised Cost & EIR */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Amortised Cost & the EIR Method
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Amortised Cost Formula</h3>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-2">
                                        <p className="text-foreground m-0">Amortised Cost = Initial Amount</p>
                                        <p className="text-accent ml-4 m-0">+ Cumulative interest income (EIR method)</p>
                                        <p className="text-red-400 ml-4 m-0">− Cash received</p>
                                        <p className="text-blue-400 ml-4 m-0">± Amortisation of premium/discount</p>
                                        <p className="text-red-400 ml-4 m-0">− Impairment losses</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The EIR is the rate that <strong className="text-foreground">exactly discounts</strong> all estimated future cash flows back to the gross carrying amount at initial recognition. Think of it as the internal rate of return of the instrument.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Why not the coupon rate?</h4>
                                        <p className="text-muted-foreground text-sm m-0">The coupon applies to face value (par). If you paid a premium or discount, the coupon understates or overstates your true return.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">What the EIR does</h4>
                                        <p className="text-muted-foreground text-sm m-0">It corrects for this by spreading the premium or discount over the life of the instrument.</p>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Most examined calculation:</strong> The EIR method is the single most frequently examined calculation in financial instruments. If you can build an amortisation table accurately under time pressure, you are well-positioned for any measurement question.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Worked Example Bond at Discount */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Worked Example: Bond at a Discount
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">Facts</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0 mb-4">
                                        <li>3-year bond, face value R1,000,000, coupon 8% p.a. (paid annually)</li>
                                        <li>Purchased for R950,262.96 (at a discount, because market rate = 10%)</li>
                                        <li>Transaction costs: nil</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        <strong className="text-foreground">EIR = 10%</strong>, the market rate that gives a PV of R950,262.96. Cash flows: R80,000 in Years 1 and 2; R80,000 + R1,000,000 = R1,080,000 in Year 3.
                                    </p>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-2">
                                        <p className="text-foreground m-0">PV @ 10%</p>
                                        <p className="text-accent ml-4 m-0">= R80,000 × 2.4868520 + R1,000,000 × 0.7513148</p>
                                        <p className="text-accent ml-4 m-0">= R198,948.16 + R751,314.80 = R950,262.96 ✓</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 m-0">
                                        Use the annuity factor for the three annual coupons plus the single-sum factor for the principal at maturity. Do not add the Year 3 coupon into the principal: the annuity factor already captures all three coupons.
                                    </p>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Amortisation Table</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Year</th>
                                                    <th className="text-right py-2 text-foreground">Opening</th>
                                                    <th className="text-right py-2 text-foreground">Interest @ 10% (EIR)</th>
                                                    <th className="text-right py-2 text-foreground">Coupon @ 8%</th>
                                                    <th className="text-right py-2 text-foreground">Closing</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">1</td>
                                                    <td className="py-2 text-right">950,262.96</td>
                                                    <td className="py-2 text-right">95,026.30</td>
                                                    <td className="py-2 text-right">(80,000.00)</td>
                                                    <td className="py-2 text-right">965,289.26</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">2</td>
                                                    <td className="py-2 text-right">965,289.26</td>
                                                    <td className="py-2 text-right">96,528.93</td>
                                                    <td className="py-2 text-right">(80,000.00)</td>
                                                    <td className="py-2 text-right">981,818.19</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">3</td>
                                                    <td className="py-2 text-right">981,818.19</td>
                                                    <td className="py-2 text-right">98,181.81</td>
                                                    <td className="py-2 text-right">(80,000.00)</td>
                                                    <td className="py-2 text-right">1,000,000.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">3</td>
                                                    <td className="py-2 text-right">1,000,000.00</td>
                                                    <td className="py-2 text-right">-</td>
                                                    <td className="py-2 text-right">(1,000,000.00)</td>
                                                    <td className="py-2 text-right">0.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Journal Entries: Year 1</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Account</th>
                                                    <th className="text-right py-2 text-foreground">Dr</th>
                                                    <th className="text-right py-2 text-foreground">Cr</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Cash (coupon received)</td>
                                                    <td className="py-2 text-right">80,000.00</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans pl-4">Interest Income</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">80,000.00</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Financial Asset: Bond (discount amortisation)</td>
                                                    <td className="py-2 text-right">15,026.30</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-sans pl-4">Interest Income</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">15,026.30</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4 m-0">Total interest income Year 1 = <strong className="text-foreground">R95,026.30</strong></p>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">The key insight:</strong> You received only R80,000 in cash, but your true return was R95,026.30. The extra R15,026.30 is the discount being amortised: the carrying amount increases toward face value over time.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: FVOCI Debt */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Subsequent Measurement: FVOCI (Debt)
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">To P/L (as for amortised cost)</h3>
                                        <ul className="space-y-1 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• Interest income (EIR method)</li>
                                            <li>• Impairment losses</li>
                                            <li>• FX gains/losses on the amortised cost portion</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-3">To OCI</h3>
                                        <ul className="space-y-1 m-0 p-0 list-none text-sm text-muted-foreground">
                                            <li>• The remaining fair value changes</li>
                                            <li>• On derecognition (sale), the cumulative OCI gain/loss is <strong className="text-foreground">recycled to P/L</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border mb-6">
                                    <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Why &quot;FVOCI&quot; if interest goes to P/L?</h4>
                                        <p className="text-sm text-muted-foreground m-0">The <em>carrying amount</em> on the balance sheet is fair value, but the P/L mirrors amortised cost. Only the <em>residual</em> fair value movement (beyond what the EIR model captures) goes to OCI.</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Worked Example: Same Bond at FVOCI</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Same bond, classified FVOCI (hold to collect &amp; sell). End of Year 1 market price = <strong className="text-foreground">R980,000</strong>; amortised cost carrying amount = <strong className="text-foreground">R965,289.26</strong>.
                                    </p>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Account</th>
                                                    <th className="text-right py-2 text-foreground">Dr</th>
                                                    <th className="text-right py-2 text-foreground">Cr</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Financial Asset: Bond (amortised cost basis)</td>
                                                    <td className="py-2 text-right">15,026.30</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Cash</td>
                                                    <td className="py-2 text-right">80,000.00</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans pl-4">Interest Income (P/L)</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">95,026.30</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Financial Asset: Bond (FV adjustment)</td>
                                                    <td className="py-2 text-right">14,710.74</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-sans pl-4">OCI (Fair Value Reserve)</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">14,710.74</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm mb-4">
                                        <p className="text-foreground m-0">OCI adjustment = R980,000.00 − R965,289.26 = R14,710.74</p>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-1 text-sm">SOFP</h4>
                                            <p className="text-muted-foreground text-sm m-0">Bond at R980,000 (fair value)</p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-1 text-sm">P/L</h4>
                                            <p className="text-muted-foreground text-sm m-0">R95,026.30 interest income only</p>
                                        </div>
                                        <div className="bg-card rounded-lg border border-border p-4">
                                            <h4 className="text-foreground font-semibold mb-1 text-sm">OCI</h4>
                                            <p className="text-muted-foreground text-sm m-0">R14,710.74 fair value gain</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: FVOCI Equity */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Subsequent Measurement: FVOCI (Equity OCI Option)
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Feature</th>
                                                    <th className="text-left py-2 text-foreground">FVOCI Debt</th>
                                                    <th className="text-left py-2 text-foreground">FVOCI Equity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Interest in P/L</td>
                                                    <td className="py-2 pr-4">✓ Yes (EIR)</td>
                                                    <td className="py-2">✗ No</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Dividends in P/L</td>
                                                    <td className="py-2 pr-4">✗ No</td>
                                                    <td className="py-2">✓ Yes (usually)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Impairment model</td>
                                                    <td className="py-2 pr-4">✓ Yes</td>
                                                    <td className="py-2">✗ No</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Recycling on derecognition</td>
                                                    <td className="py-2 pr-4">✓ Yes</td>
                                                    <td className="py-2">✗ Never</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">OCI balance on sale</td>
                                                    <td className="py-2 pr-4">→ P/L</td>
                                                    <td className="py-2">→ Retained earnings</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Dividends from FVOCI equity investments go to P/L <strong className="text-foreground">unless</strong> the dividend clearly represents a recovery of part of the cost of the investment (e.g. a liquidating dividend or return of capital).
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Worked Example: Growthpoint Shares at FVOCI</h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0 mb-4">
                                        <li>100,000 JSE-listed Growthpoint shares bought at R25/share (R2,500,000)</li>
                                        <li>Transaction costs R50,000 (added to carrying amount → R2,550,000)</li>
                                        <li>Irrevocably designated as FVOCI equity at inception</li>
                                        <li>Year end: share price R28 → fair value R2,800,000</li>
                                        <li>Dividend received during the year: R150,000</li>
                                    </ul>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Account</th>
                                                    <th className="text-right py-2 text-foreground">Dr</th>
                                                    <th className="text-right py-2 text-foreground">Cr</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Financial Asset: Growthpoint (initial recognition)</td>
                                                    <td className="py-2 text-right">2,550,000</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans pl-4">Cash</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">2,550,000</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Cash (dividend received)</td>
                                                    <td className="py-2 text-right">150,000</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans pl-4">Dividend Income (P/L)</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">150,000</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Financial Asset: Growthpoint (FV R2,800,000 − R2,550,000)</td>
                                                    <td className="py-2 text-right">250,000</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-sans pl-4">OCI (FV Reserve: Equity)</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">250,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4 className="text-foreground font-semibold mb-2 text-sm">If the shares are later sold for R2,900,000:</h4>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans">Cash</td>
                                                    <td className="py-2 text-right">2,900,000</td>
                                                    <td className="py-2 text-right"></td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-sans pl-4">Financial Asset: Growthpoint</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">2,800,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-sans pl-4">OCI (FV Reserve: Equity), gain on sale</td>
                                                    <td className="py-2 text-right"></td>
                                                    <td className="py-2 text-right">100,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-sm text-muted-foreground m-0">
                                        The cumulative OCI balance (now <strong className="text-foreground">R350,000</strong>: R250,000 unrealised + R100,000 from the sale) <strong className="text-foreground">transfers to retained earnings</strong>, not P/L. The gain on sale is never seen in P/L.
                                    </p>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Critical Exam Distinction</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Under IAS 39, selling an AFS equity investment WOULD have recycled gains to P/L. Under the IFRS 9 equity OCI option, these gains are permanently locked out of P/L.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: FVTPL & Reclassification */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    FVTPL & Reclassification
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    FVTPL is the simplest category: fair value at each reporting date, with <strong className="text-foreground">everything</strong> (gains, losses, interest, dividends) through profit or loss. Transaction costs are expensed immediately and do not form part of the carrying amount.
                                </p>
                                <div className="bg-card rounded-lg p-4 font-mono text-sm mb-6">
                                    <p className="text-foreground m-0">Dr / Cr Financial Asset (FV change)</p>
                                    <p className="text-accent ml-4 m-0">Cr / Dr Fair Value Gain/Loss (P/L)</p>
                                </div>
                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border mb-6">
                                    <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Why choose FVTPL via the FVO?</h4>
                                        <p className="text-sm text-muted-foreground m-0">If holding an asset at amortised cost would create a measurement mismatch with a related liability at fair value, the FVO eliminates that mismatch. It is an irrevocable choice made at inception.</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">Reclassification Between Categories</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Only permitted when the entity <strong className="text-foreground">changes its business model</strong>, which is expected to be very rare.</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">From → To</th>
                                                    <th className="text-left py-2 text-foreground">Treatment on Reclassification Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">AC → FVTPL</td>
                                                    <td className="py-2">Measure at FV; difference to P/L</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">AC → FVOCI</td>
                                                    <td className="py-2">Measure at FV; difference to OCI</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVTPL → AC</td>
                                                    <td className="py-2">FV at reclassification becomes the new gross carrying amount; EIR calculated from that date</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVTPL → FVOCI</td>
                                                    <td className="py-2">FV at reclassification becomes the new carrying amount; EIR calculated from that date</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVOCI → AC</td>
                                                    <td className="py-2">Cumulative OCI gain/loss removed from OCI and adjusted against the gross carrying amount; no P/L impact</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVOCI → FVTPL</td>
                                                    <td className="py-2">Cumulative OCI gain/loss reclassified to P/L at the reclassification date</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Comprehensive Example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    Comprehensive Example: Multi-Asset Portfolio
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    An entity holds the following at 1 January 20X1:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Asset</th>
                                                    <th className="text-left py-2 text-foreground">Classification</th>
                                                    <th className="text-right py-2 text-foreground">Carrying Amount</th>
                                                    <th className="text-right py-2 text-foreground">Year-End FV</th>
                                                    <th className="text-left py-2 pl-4 text-foreground">Cash Received</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Trade receivable</td>
                                                    <td className="py-2 pr-4">Amortised Cost</td>
                                                    <td className="py-2 text-right">R500,000</td>
                                                    <td className="py-2 text-right">N/A</td>
                                                    <td className="py-2 pl-4">R500,000 collected</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Corporate bond</td>
                                                    <td className="py-2 pr-4">FVOCI (Debt)</td>
                                                    <td className="py-2 text-right">R800,000</td>
                                                    <td className="py-2 text-right">R820,000</td>
                                                    <td className="py-2 pl-4">R60,000 interest (coupon)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">BHP shares</td>
                                                    <td className="py-2 pr-4">FVTPL</td>
                                                    <td className="py-2 text-right">R1,200,000</td>
                                                    <td className="py-2 text-right">R1,050,000</td>
                                                    <td className="py-2 pl-4">R30,000 dividend</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Sanlam shares</td>
                                                    <td className="py-2 pr-4">FVOCI (Equity OCI)</td>
                                                    <td className="py-2 text-right">R600,000</td>
                                                    <td className="py-2 text-right">R650,000</td>
                                                    <td className="py-2 pl-4">R20,000 dividend</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Trade receivable (AC)</h4>
                                        <p className="text-muted-foreground text-sm m-0">Collected in full, so derecognised. No measurement issue.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Corporate bond (FVOCI Debt)</h4>
                                        <p className="text-muted-foreground text-sm m-0">Assume EIR interest of R72,000. Amortised cost = R800,000 + R72,000 − R60,000 = R812,000. OCI = R820,000 − R812,000 = R8,000. P/L: R72,000 interest.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">BHP shares (FVTPL)</h4>
                                        <p className="text-muted-foreground text-sm m-0">FV decline R1,200,000 → R1,050,000 = R150,000 loss. P/L: R30,000 dividend less R150,000 loss = net R(120,000).</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Sanlam shares (FVOCI Equity)</h4>
                                        <p className="text-muted-foreground text-sm m-0">FV gain R650,000 − R600,000 = R50,000 to OCI (never recycled). P/L: R20,000 dividend.</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">P/L Impact</h3>
                                        <table className="w-full text-sm">
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border"><td className="py-2">Bond interest income</td><td className="py-2 text-right font-mono">+72,000</td></tr>
                                                <tr className="border-b border-border"><td className="py-2">BHP dividend</td><td className="py-2 text-right font-mono">+30,000</td></tr>
                                                <tr className="border-b border-border"><td className="py-2">BHP FV loss</td><td className="py-2 text-right font-mono">(150,000)</td></tr>
                                                <tr className="border-b border-border"><td className="py-2">Sanlam dividend</td><td className="py-2 text-right font-mono">+20,000</td></tr>
                                                <tr><td className="py-2 font-bold text-foreground">Net P/L</td><td className="py-2 text-right font-mono font-bold text-foreground">(28,000)</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4">OCI Impact</h3>
                                        <table className="w-full text-sm">
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border"><td className="py-2">Bond FV gain</td><td className="py-2 text-right font-mono">+8,000</td></tr>
                                                <tr className="border-b border-border"><td className="py-2">Sanlam shares FV gain</td><td className="py-2 text-right font-mono">+50,000</td></tr>
                                                <tr><td className="py-2 font-bold text-foreground">Total OCI</td><td className="py-2 text-right font-mono font-bold text-foreground">58,000</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Common Student Pitfalls
                                </h2>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
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
                                                    <td className="py-2 pr-4">Adding transaction costs to FVTPL assets</td>
                                                    <td className="py-2">Transaction costs for FVTPL assets are expensed immediately</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Using the coupon rate instead of the EIR</td>
                                                    <td className="py-2">Always use the EIR: it&apos;s the rate that amortises premium/discount</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Recycling FVOCI equity OCI gains to P/L on sale</td>
                                                    <td className="py-2">Equity OCI gains transfer to retained earnings, never P/L</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forgetting impairment applies to FVOCI debt but NOT FVOCI equity</td>
                                                    <td className="py-2">The ECL model (Part 6) applies to amortised cost AND FVOCI debt instruments</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Treating all FV changes on FVOCI as going to P/L</td>
                                                    <td className="py-2">Only interest (EIR), impairment and FX on amortised cost go to P/L for FVOCI debt</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Exam Technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Exam Technique: &quot;Prepare the Journal Entries&quot;
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span><strong className="text-foreground">Identify the classification</strong> first (from your Part 2 work).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span><strong className="text-foreground">Initial measurement:</strong> FV ± transaction costs (as applicable).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span><strong className="text-foreground">Interest income:</strong> always the EIR method for AC and FVOCI debt.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <span><strong className="text-foreground">Fair value movement:</strong> P/L vs OCI based on category.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                            <span><strong className="text-foreground">Dividends:</strong> P/L for FVTPL and FVOCI equity (unless a return of capital).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">6</span>
                                            <span><strong className="text-foreground">Impairment:</strong> P/L for AC and FVOCI debt (covered in Part 6).</span>
                                        </li>
                                    </ol>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Mark allocation tip:</strong> For amortised cost questions, always present the <strong className="text-foreground">amortisation table</strong> clearly. It shows the examiner your methodology and earns process marks even if you make an arithmetic error.
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
                                            <span className="text-muted-foreground"><strong className="text-foreground">All financial assets</strong> are initially recognised at <strong className="text-foreground">fair value</strong>; transaction costs are added except for FVTPL.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Amortised Cost:</strong> EIR method for interest; changes in carrying amount through P/L.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">FVOCI Debt:</strong> same interest and impairment in P/L as amortised cost; only residual FV changes go to OCI; recycled on derecognition.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">FVOCI Equity:</strong> dividends to P/L; all FV changes to OCI; OCI balance NEVER recycled to P/L.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">FVTPL:</strong> everything (FV changes, interest, dividends) goes to P/L.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Reclassification</strong> only on a genuine business model change; applied prospectively.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 4...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    We switch sides of the balance sheet to <strong className="text-foreground">financial liabilities</strong>: classification, amortised cost measurement, and the own credit risk rule for liabilities designated at fair value.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 2: Classifying Financial Assets
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-4">
                                    Part 4: Financial Liabilities
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Losing Marks on the EIR Table?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Amortisation tables and the P/L vs OCI split are where most measurement marks slip. Let&apos;s build a template you can trust under exam pressure.
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
