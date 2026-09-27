import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lightbulb, Calculator, Scale, Split, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 4: Financial Liabilities | ACCE Tutors",
    description: "IFRS 9 financial liabilities: amortised cost vs FVTPL, own credit risk in OCI, convertible bond splits (IAS 32) and substantial modifications.",
    keywords: "IFRS 9 financial liabilities, amortised cost, EIR method, fair value option, own credit risk OCI, compound instruments, convertible bond, IAS 32, substantial modification 10% test",
    alternates: {
        canonical: "/guides/ifrs-9/part-4/",
    },
};

export default function IFRS9Part4Page() {
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
                                Part 4 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 4: The Other Side of the Balance Sheet
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Financial Liabilities: Classification & Measurement
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                The IASB overhauled financial assets but made only targeted changes to financial liabilities. The big exception is <strong className="text-foreground">own credit risk</strong> on liabilities designated at fair value.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground leading-relaxed m-0">
                                    The concerns that drove IFRS 9 (the 2008 crisis, the incurred loss model, too many asset categories) were mainly about <strong className="text-foreground">assets</strong>. The IAS 39 treatment of most financial liabilities was considered broadly appropriate, so liabilities under IFRS 9 look very similar to IAS 39, with one important exception: <strong className="text-foreground">own credit risk on FVO liabilities</strong>.
                                </p>
                            </div>

                            {/* Section 1: Two categories */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Two Categories
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Category</th>
                                                    <th className="text-left py-2 text-foreground">Default or Elected?</th>
                                                    <th className="text-left py-2 text-foreground">Measurement</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2"><strong className="text-foreground">Amortised Cost</strong></td>
                                                    <td className="py-2">Default</td>
                                                    <td className="py-2">EIR method</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong className="text-foreground">Fair Value Through Profit or Loss (FVTPL)</strong></td>
                                                    <td className="py-2">Elected (FVO) or mandatory</td>
                                                    <td className="py-2">Fair value</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            Unlike financial assets, there is <strong className="text-foreground">no &quot;hold to collect&quot; or SPPI test</strong> for liabilities. The default is amortised cost, and FVTPL is the exception.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Amortised cost */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Amortised Cost (the Default)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The vast majority of financial liabilities (borrowings, bonds payable, trade payables, lease liabilities) are measured at amortised cost using the EIR method.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Initial measurement</h4>
                                        <p className="font-mono text-xs text-accent mb-2">Initial carrying amount = Fair value of proceeds received − Transaction costs</p>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Issue costs, underwriting fees and legal fees <strong className="text-foreground">reduce</strong> the initial carrying amount. They are not expensed immediately; they are amortised over the life of the liability using the EIR.
                                        </p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Subsequent measurement</h4>
                                        <p className="font-mono text-xs text-accent mb-2">Closing CA = Opening balance + Interest expense (EIR) − Cash paid</p>
                                        <p className="text-muted-foreground text-sm m-0">
                                            Interest expense in P/L = opening carrying amount × EIR, <strong className="text-foreground">not the coupon rate</strong>. The difference between coupon paid and EIR interest adjusts the carrying amount.
                                        </p>
                                    </div>
                                </div>

                                {/* Worked example */}
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Worked Example: Bond Issued at a Discount
                                        </h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-4">
                                        <li>3-year bond, face value R2,000,000, coupon 8% p.a. (paid annually)</li>
                                        <li>Issue price R1,900,525.92 (a discount, because the market rate is 10%)</li>
                                        <li>Transaction costs: nil (for simplicity). <strong className="text-foreground">EIR = 10%</strong></li>
                                    </ul>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Year</th>
                                                    <th className="text-right py-2 text-foreground">Opening</th>
                                                    <th className="text-right py-2 text-foreground">Interest @ 10%</th>
                                                    <th className="text-right py-2 text-foreground">Coupon @ 8%</th>
                                                    <th className="text-right py-2 text-foreground">Closing</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">1</td>
                                                    <td className="py-2 text-right">1,900,525.92</td>
                                                    <td className="py-2 text-right">190,052.59</td>
                                                    <td className="py-2 text-right">(160,000.00)</td>
                                                    <td className="py-2 text-right">1,930,578.51</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">2</td>
                                                    <td className="py-2 text-right">1,930,578.51</td>
                                                    <td className="py-2 text-right">193,057.85</td>
                                                    <td className="py-2 text-right">(160,000.00)</td>
                                                    <td className="py-2 text-right">1,963,636.36</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">3</td>
                                                    <td className="py-2 text-right">1,963,636.36</td>
                                                    <td className="py-2 text-right">196,363.64</td>
                                                    <td className="py-2 text-right">(160,000.00)</td>
                                                    <td className="py-2 text-right text-foreground">2,000,000.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4 className="font-bold text-foreground mb-2 text-sm">Year 1 journal entries</h4>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1">
                                        <p className="text-muted-foreground text-xs m-0">Initial recognition:</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Cash</span><span className="text-foreground">1,900,525.92</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Bond Payable</span><span className="text-accent">1,900,525.92</span></div>
                                        <p className="text-muted-foreground text-xs m-0 pt-3">Year 1 interest expense (EIR):</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Finance Cost (P/L)</span><span className="text-foreground">190,052.59</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Bond Payable (discount amortised)</span><span className="text-accent">30,052.59</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Cash / Accrued Interest (coupon)</span><span className="text-accent">160,000.00</span></div>
                                        <p className="text-muted-foreground text-xs m-0 pt-3">Closing carrying amount: R1,930,578.51</p>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Exam Tip:</strong> The finance cost is always <strong className="text-foreground">higher</strong> than the coupon when a bond is issued at a discount, and <strong className="text-foreground">lower</strong> when issued at a premium. The difference moves the carrying amount toward face value over time: the same logic as assets, just from the liability side.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: FVTPL */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Two Routes to FVTPL
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-3">
                                            Route 1: Mandatory (Held for Trading)
                                        </h3>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Derivative liabilities (e.g. a written option or a swap in a net liability position)</li>
                                            <li>Short positions (selling borrowed securities)</li>
                                            <li>Liabilities incurred specifically to repurchase in the near term</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-3">
                                            Route 2: Elected (Fair Value Option)
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">
                                            An entity may <strong className="text-foreground">irrevocably</strong> designate any financial liability at FVTPL at initial recognition if doing so <strong className="text-foreground">eliminates or significantly reduces an accounting mismatch</strong>. The FVO criteria are the same as for assets: the designation must give more relevant information by removing a measurement inconsistency.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Own credit risk */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    The IFRS 9 Innovation: Own Credit Risk
                                </h2>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">The problem under IAS 39</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                All fair value changes on FVO liabilities went through P/L, including changes caused by the entity&apos;s own creditworthiness. If your credit rating deteriorates (your bonds fall in value), the liability&apos;s fair value decreases, creating a <strong className="text-foreground">gain</strong> in P/L. The worse your financial health, the better your reported profit. This &quot;day of reckoning paradox&quot; was widely criticised as economically nonsensical and misleading.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 splits the fair value movement on <strong className="text-foreground">FVO</strong> financial liabilities into two components:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Component</th>
                                                    <th className="text-left py-2 text-foreground">Where it goes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Change due to <strong className="text-foreground">own credit risk</strong></td>
                                                    <td className="py-2"><strong className="text-foreground">OCI</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">Change due to <strong className="text-foreground">other factors</strong> (e.g. benchmark interest rate movements)</td>
                                                    <td className="py-2"><strong className="text-foreground">P/L</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Never recycled</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                The own credit risk portion goes to OCI and is <strong className="text-foreground">never recycled to P/L</strong>, not even on derecognition. It stays in OCI and is transferred directly to retained earnings on settlement. Examiners love this because students consistently get tripped up: own credit risk → OCI, never recycled, never P/L.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        <strong className="text-foreground">When does the split apply?</strong> Only when a liability is designated at FVTPL via the FVO. Mandatory FVTPL liabilities (derivatives) continue to record all changes in P/L: there is no own credit risk split for trading liabilities.
                                    </p>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Worked Example: Own Credit Risk
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        An entity issues a 5-year bond with face value R10,000,000 and designates it at FVTPL (FVO) to eliminate an accounting mismatch with a related asset. At year-end the total fair value change is R(250,000) (the liability decreased in value), of which own credit risk deterioration caused R(180,000) and market interest rate movements caused R(70,000).
                                    </p>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
                                        <p className="text-muted-foreground text-xs m-0">Decrease in fair value (liability fell, so a gain):</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Bond Payable (FVO)</span><span className="text-foreground">250,000</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr OCI (Own Credit Risk)</span><span className="text-accent">180,000</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr P/L (Finance Income)</span><span className="text-accent">70,000</span></div>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li>The R70,000 gain from market rate movement appropriately hits P/L (offsetting the asset side of the mismatch).</li>
                                        <li>The R180,000 &quot;gain&quot; from credit deterioration is quarantined in OCI: it never boosts reported profit.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Compound instruments */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Compound Instruments (IAS 32 Link)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Some instruments contain both a <strong className="text-foreground">liability component</strong> and an <strong className="text-foreground">equity component</strong>. The classic example is a <strong className="text-foreground">convertible bond</strong>: a contractual right to interest and principal (liability) plus an option to convert into a fixed number of ordinary shares (equity). IAS 32 requires the components to be split and presented separately from inception; IFRS 9 then measures the liability component at amortised cost (or FVTPL if designated).
                                </p>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Split className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            The Split-Off Method (IAS 32.31)
                                        </h3>
                                    </div>
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Determine the fair value of the <strong className="text-foreground">liability component</strong>: the PV of the cash flows at the market rate for an equivalent non-convertible bond.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span><strong className="text-foreground">Equity component</strong> = Total proceeds − Liability component.</span>
                                        </li>
                                    </ol>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            The equity component is a <strong className="text-foreground">residual</strong>, not independently valued. The liability is valued first and equity gets whatever is left over. This is the &quot;with-and-without&quot; method.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Worked Example: Convertible Bond
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        3-year convertible bond, face value R5,000,000, coupon 6%. Equivalent non-convertible rate: 9%. Proceeds: R5,000,000 (par, because the conversion feature makes it attractive).
                                    </p>
                                    <h4 className="font-bold text-foreground mb-2 text-sm">Step 1: Value the liability component at 9%</h4>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Year</th>
                                                    <th className="text-right py-2 text-foreground">Cash Flow</th>
                                                    <th className="text-right py-2 text-foreground">PV Factor @ 9%</th>
                                                    <th className="text-right py-2 text-foreground">PV</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">1</td>
                                                    <td className="py-2 text-right">300,000</td>
                                                    <td className="py-2 text-right">0.9174312</td>
                                                    <td className="py-2 text-right">275,229.36</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">2</td>
                                                    <td className="py-2 text-right">300,000</td>
                                                    <td className="py-2 text-right">0.8416800</td>
                                                    <td className="py-2 text-right">252,504.00</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">3</td>
                                                    <td className="py-2 text-right">5,300,000</td>
                                                    <td className="py-2 text-right">0.7721835</td>
                                                    <td className="py-2 text-right">4,092,572.55</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 text-foreground font-bold" colSpan={3}>Liability component</td>
                                                    <td className="py-2 text-right text-foreground font-bold">4,620,305.91</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4 className="font-bold text-foreground mb-2 text-sm">Step 2: Equity component</h4>
                                    <p className="font-mono text-sm text-muted-foreground mb-4">R5,000,000.00 − R4,620,305.91 = <strong className="text-foreground">R379,694.09</strong></p>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
                                        <p className="text-muted-foreground text-xs m-0">Journal entry at inception:</p>
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Cash</span><span className="text-foreground">5,000,000.00</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Financial Liability (Bond)</span><span className="text-accent">4,620,305.91</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Equity (Conversion Option)</span><span className="text-accent">379,694.09</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm m-0">
                                        <strong className="text-foreground">Subsequently:</strong> the liability is measured at amortised cost using the 9% EIR. The equity component is never remeasured.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6: Derecognition & modification */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Derecognition & Substantial Modification
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A financial liability is derecognised when the obligation is <strong className="text-foreground">discharged, cancelled, or expired</strong>.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Event</th>
                                                    <th className="text-left py-2 text-foreground">Treatment</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Repayment at maturity</td>
                                                    <td className="py-2">Derecognise at carrying amount; no gain/loss if fully amortised to par</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Early redemption</td>
                                                    <td className="py-2">Carrying amount vs amount paid = gain/loss in P/L</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2">Debt forgiveness</td>
                                                    <td className="py-2">Carrying amount derecognised; gain in P/L (unless related party, which may be equity)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2">Exchange for new debt (substantial modification)</td>
                                                    <td className="py-2">Old liability derecognised; new liability at fair value; difference in P/L</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">Substantial (≥ 10%)</h3>
                                        <p className="text-muted-foreground text-sm m-0">Derecognise old; recognise new at FV; gain/loss in P/L.</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Not substantial</h3>
                                        <p className="text-muted-foreground text-sm m-0">Adjust carrying amount; amortise the adjustment using the original EIR.</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A modification is substantial if the PV of the new cash flows (discounted at the <strong className="text-foreground">original EIR</strong>) differs by <strong className="text-foreground">10% or more</strong> from the PV of the original remaining cash flows. Part 5 covers this in full.
                                </p>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">SA context:</strong> During COVID-19, many South African companies renegotiated debt terms with banks. Deciding whether those modifications were substantial (triggering derecognition) was a significant accounting issue, and the same principle applies whenever loan terms are restructured.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
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
                                                    <td className="py-2 pr-4">Classifying all liabilities at amortised cost</td>
                                                    <td className="py-2">Check for held-for-trading (derivatives) and FVO elections</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Ignoring transaction costs on liabilities</td>
                                                    <td className="py-2">They reduce the initial carrying amount and are amortised via the EIR</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Putting own credit risk gains through P/L</td>
                                                    <td className="py-2">Own credit risk on FVO liabilities → OCI, never P/L</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Splitting compound instruments equity-first</td>
                                                    <td className="py-2">Always value the liability first; equity is the residual</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Using the coupon rate for interest expense</td>
                                                    <td className="py-2">The EIR is the market rate at inception; always use it for P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Treating all debt modifications as derecognition</td>
                                                    <td className="py-2">Apply the 10% test; only substantial modifications derecognise</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Exam technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Exam Technique
                                </h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Pick the category</h4>
                                        <ol className="text-muted-foreground text-sm space-y-1 list-decimal ml-4 m-0">
                                            <li>Held for trading (incl. all derivative liabilities)? → FVTPL mandatory</li>
                                            <li>Irrevocably designated (FVO) to eliminate a mismatch? → FVTPL elected</li>
                                            <li>Everything else → Amortised cost</li>
                                        </ol>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">FVO liability questions</h4>
                                        <ol className="text-muted-foreground text-sm space-y-1 list-decimal ml-4 m-0">
                                            <li>Calculate the total fair value movement</li>
                                            <li>Identify the own credit risk portion (usually given)</li>
                                            <li>Own credit risk → OCI; remainder → P/L</li>
                                        </ol>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Compound instruments</h4>
                                        <ol className="text-muted-foreground text-sm space-y-1 list-decimal ml-4 m-0">
                                            <li>Identify the liability cash flows</li>
                                            <li>Discount at the non-convertible rate → liability</li>
                                            <li>Proceeds − Liability = Equity</li>
                                            <li>Show the amortisation table at the EIR</li>
                                        </ol>
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
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Most liabilities are at amortised cost:</strong> the EIR method spreads transaction costs and premium/discount over the instrument&apos;s life.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">FVTPL applies</strong> to held-for-trading liabilities and those designated via the FVO to eliminate accounting mismatches.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Own credit risk</strong> on FVO liabilities goes to OCI (never P/L) under IFRS 9, a key improvement over IAS 39.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Compound instruments:</strong> split at inception, liability first; equity is the residual (IAS 32).</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground"><strong className="text-foreground">Derecognition:</strong> on discharge; substantial modifications (10% test) also trigger derecognition.</span></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span><span className="text-muted-foreground">Financial liabilities <strong className="text-foreground">cannot be reclassified</strong> between categories.</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-3">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 3: Measuring Financial Assets
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-5">
                                    Part 5: Derecognition
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Stuck on Own Credit Risk or Convertible Bonds?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                The OCI split and the liability-first split are easy marks once they click. Let&apos;s work through a past paper question together.
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
