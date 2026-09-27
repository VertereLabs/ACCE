import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, Lightbulb, CheckCircle2, Calculator, Scale, FileText, BarChart3, Landmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuideCompletionCard from "@/components/GuideCompletionCard";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 9: Disclosures & Exam Strategy | ACCE Tutors",
    description: "IFRS 7 disclosures, IAS 32 offsetting, IFRS 9 transition and a complete exam strategy for financial instruments questions.",
    keywords: "IFRS 7 disclosures, IAS 32 offsetting, IFRS 9 transition, loss allowance reconciliation, fair value hierarchy, IFRS 9 exam strategy, CA(SA) financial instruments",
    alternates: {
        canonical: "/guides/ifrs-9/part-9/",
    },
};

const examTopics = [
    {
        title: "1. Classification",
        steps: [
            "Is it a financial instrument? (IAS 32 definition)",
            "Is it in scope of IFRS 9? (check exclusions)",
            "Equity instrument → FVTPL (or OCI option)?",
            "Business model: hold to collect / collect & sell / other?",
            "SPPI test: does it pass?",
            "Apply the matrix → AC / FVOCI debt / FVTPL",
            "Consider the FVO if mismatch elimination is needed",
        ],
        traps: [
            "Equity instruments never pass SPPI: don't even apply the test",
            "FVOCI equity option is irrevocable and made at initial recognition",
            "Reclassification requires a genuine business model change",
        ],
    },
    {
        title: "2. Measurement",
        steps: [
            "Amortised cost: calculate EIR (given, or solve by trial-and-error/annuity factors); build the table (Opening → Interest → Cash → Closing); show journals",
            "FVOCI debt: same as amortised cost for interest and impairment; extra OCI entry for residual FV movement; show OCI recycled on derecognition",
            "FVTPL: FV at reporting date; all changes to P/L; transaction costs expensed upfront",
        ],
        traps: [],
    },
    {
        title: "3. Impairment",
        steps: [
            "Scope check: is the asset subject to ECL?",
            "Approach: general or simplified?",
            "Stage: assess SICR (general model)",
            "Calculate ECL (PD × LGD × EAD, probability-weighted)",
            "Opening allowance → movement → closing allowance",
            "Journal entries",
            "Interest income on gross (Stages 1 & 2) or net (Stage 3) carrying amount",
        ],
        traps: [
            "12-month ECL ≠ 12 months of cash flows",
            "Stage 3 interest on NET carrying amount, never gross",
            "FVOCI debt still requires ECL; impairment goes to P/L",
        ],
    },
    {
        title: "4. Derecognition",
        steps: [
            "Asset: rights expired → derecognise",
            "Asset: transfer occurred? → risks & rewards → control → continuing involvement",
            "Full recourse = secured borrowing; repos = secured borrowing",
            "Liability: discharged/cancelled/expired → derecognise; gain/loss in P/L",
            "Liability: substantial modification (10% test at original EIR) → derecognise old, recognise new; gain/loss in P/L",
        ],
        traps: [],
    },
    {
        title: "5. Transition",
        steps: [
            "Identify the IAS 39 classification of each instrument",
            "Reassess business model and SPPI at the transition date",
            "Determine the IFRS 9 classification",
            "Assets moving to amortised cost: calculate opening amortised cost",
            "All in-scope assets: calculate opening ECL (stage each asset at transition)",
            "Recognise the net adjustment in opening retained earnings",
        ],
        traps: [
            "The FVOCI equity OCI option can be elected at the transition date, not only at initial recognition",
            "Opening ECL adjusts retained earnings, never P/L",
            "Comparatives are not restated unless the entity elects to (rare)",
        ],
    },
    {
        title: "6. Hedge Accounting",
        steps: [
            "Recognised asset/liability or firm commitment → fair value hedge",
            "Forecast transaction or variable rate exposure → cash flow hedge",
            "Net investment in foreign operation → net investment hedge",
            "Cash flow hedge: effective → OCI; ineffective → P/L; reclassify OCI when hedged item affects P/L; if forecast no longer probable → reclassify OCI immediately",
            "IAS 39 vs IFRS 9: 80–125% vs economic relationship; rebalancing not permitted vs permitted/required; voluntary discontinuation permitted vs not; risk components limited vs expanded",
        ],
        traps: [],
    },
];

const pitfalls = [
    ["Classification", "Applying SPPI to equity instruments", "Equity instruments always fail SPPI: go straight to FVTPL or OCI option"],
    ["Classification", "Forgetting the FVO is irrevocable", "Once designated at FVO, cannot reverse"],
    ["Measurement", "Using coupon rate for interest income", "Always use EIR"],
    ["Measurement", "Adding transaction costs to FVTPL assets", "Transaction costs for FVTPL → P/L immediately"],
    ["Measurement", "Recycling FVOCI equity OCI gains", "Equity OCI option: gains transfer to retained earnings, never P/L"],
    ["Impairment", "Applying general model to trade receivables", "Simplified approach is mandatory for trade receivables without significant financing"],
    ["Impairment", "Recognising ECL only when objective evidence exists", "That's IAS 39. Under IFRS 9, ECL from Day 1"],
    ["Impairment", "Calculating interest on gross carrying amount (Stage 3)", "Stage 3 → interest on NET carrying amount"],
    ["Impairment", "Applying the three-stage model to POCI assets", "POCI assets use a credit-adjusted EIR; only changes in lifetime ECL from purchase date are recognised"],
    ["Derecognition", "Derecognising on legal title transfer", "Substance over form: test risks and rewards"],
    ["Derecognition", "Using new EIR for 10% modification test", "Use the ORIGINAL EIR"],
    ["Hedging", "Voluntary discontinuation under IFRS 9", "Not permitted: discontinue only when criteria cease to be met"],
    ["Hedging", "Putting ineffectiveness into OCI", "Ineffective portion always to P/L, regardless of hedge type"],
    ["Presentation", "Offsetting without meeting both IAS 32 conditions", "Both legally enforceable right AND net settlement intention required"],
    ["Transition", "Recognising opening ECL in P/L", "Opening ECL allowance on transition adjusts retained earnings, not P/L"],
];

export default function IFRS9Part9Page() {
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
                                Part 9 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 9: Bringing It All Together
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Disclosures & Exam Strategy
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                IFRS 9 tells you how to measure. IFRS 7 tells you what to disclose, and IAS 32 tells you how to present. This final part covers all three, the IAS 39 to IFRS 9 transition, and the exam technique that turns knowledge into marks.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Section 1: Three standards */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    Three Standards Working Together
                                </h2>
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">IAS 32</h3>
                                        <p className="text-xs text-muted-foreground mb-0 leading-relaxed font-bold">Presentation</p>
                                        <p className="text-xs text-muted-foreground m-0">What is it? Where does it go on the face? (offset, liability vs equity)</p>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">IFRS 9</h3>
                                        <p className="text-xs text-muted-foreground mb-0 leading-relaxed font-bold">Recognition & Measurement</p>
                                        <p className="text-xs text-muted-foreground m-0">How much? When?</p>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-green-400 mb-2">IFRS 7</h3>
                                        <p className="text-xs text-muted-foreground mb-0 leading-relaxed font-bold">Disclosures</p>
                                        <p className="text-xs text-muted-foreground m-0">What do you tell users about it?</p>
                                    </div>
                                </div>
                                <div className="bg-accent/10 rounded-xl p-5 border border-accent/20 text-xs text-muted-foreground italic text-center leading-relaxed">
                                    Understanding this three-standard architecture is itself examinable.
                                </div>
                            </section>

                            {/* Section 2: Significance disclosures */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    IFRS 7: Significance Disclosures
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 7 organises disclosures around two objectives: the <strong className="text-foreground">significance</strong> of financial instruments for financial position and performance, and the <strong className="text-foreground">nature and extent of risks</strong> arising from them and how they are managed.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-3">Carrying Amounts by Category</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Financial assets at amortised cost</li>
                                            <li>Financial assets at FVOCI (debt)</li>
                                            <li>Financial assets at FVOCI (equity, OCI option)</li>
                                            <li>Financial assets at FVTPL</li>
                                            <li>Financial liabilities at amortised cost</li>
                                            <li>Financial liabilities at FVTPL</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-3">Income Statement Items</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Interest income/expense (using the EIR method)</li>
                                            <li>Fee income/expense not included in EIR</li>
                                            <li>Fair value gains/losses by category</li>
                                            <li>Impairment losses/reversals</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Fair Value Hierarchy (IFRS 13)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Level</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Description</th>
                                                    <th className="text-left py-2 text-foreground">Example</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Level 1</td>
                                                    <td className="py-2 pr-4">Quoted prices in active markets for identical instruments</td>
                                                    <td className="py-2">JSE-listed shares</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Level 2</td>
                                                    <td className="py-2 pr-4">Observable inputs other than Level 1 quotes (e.g. yield curves, credit spreads)</td>
                                                    <td className="py-2">OTC interest rate swap</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground font-medium">Level 3</td>
                                                    <td className="py-2 pr-4">Unobservable inputs: significant management judgement</td>
                                                    <td className="py-2">Private equity; complex structured products</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-muted-foreground text-xs mt-4 m-0">Transfers between levels must be disclosed. Level 3 instruments require a roll-forward reconciliation and sensitivity analysis.</p>
                                </div>
                            </section>

                            {/* Section 3: Risk disclosures */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    IFRS 7: Risk Disclosures
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Qualitative and quantitative disclosures are required for each type of risk.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Credit Risk</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Disclosure</th>
                                                    <th className="text-left py-2 text-foreground">Content</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["Maximum exposure", "Gross carrying amount before collateral and credit enhancements"],
                                                    ["Collateral and credit enhancements", "Description and fair value"],
                                                    ["Concentration of credit risk", "By geography, industry, counterparty"],
                                                    ["Loss allowance reconciliation", "Opening → movements (Stage 1/2/3) → closing"],
                                                    ["Significant judgements in SICR", "Criteria used to determine significant increase"],
                                                    ["Write-offs", "Amounts, recovery actions"],
                                                    ["Modified financial assets", "Carrying amount; how modification affected loss allowance"],
                                                ].map(([item, content], i, rows) => (
                                                    <tr key={item} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{item}</td>
                                                        <td className="py-2">{content}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-muted-foreground text-xs mt-4 m-0">The <strong className="text-foreground">loss allowance reconciliation</strong> is a high-priority IFRS 9 disclosure, showing how the ECL allowance moved between stages during the year.</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-3">Liquidity Risk</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Maturity analysis of financial liabilities (contractual cash flows, not carrying amounts)</li>
                                            <li>Must include derivative liabilities</li>
                                            <li>Management of liquidity risk</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-3">Market Risk</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li><strong className="text-foreground">Interest rate:</strong> impact of a parallel yield curve shift on P/L and equity; duration analysis for fixed rate instruments</li>
                                            <li><strong className="text-foreground">Currency:</strong> net exposure by currency; sensitivity of P/L and equity to exchange rate movements</li>
                                            <li><strong className="text-foreground">Other price:</strong> commodity and equity price sensitivity</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Hedge disclosures */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Hedge Accounting Disclosures (IFRS 7.21A–24F)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 significantly expanded hedge disclosures in IFRS 7, so users understand the entity&apos;s risk management strategy, how hedging affects the financial statements, and the effect of hedge accounting on risk exposure.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Disclosure</th>
                                                    <th className="text-left py-2 text-foreground">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["Risk management strategy", "For each risk category, qualitative description"],
                                                    ["Hedging instruments", "Nominal amounts; carrying amounts; line items in balance sheet"],
                                                    ["Hedged items", "Carrying amounts; accumulated hedge adjustments; line items"],
                                                    ["Hedge effectiveness", "Sources of ineffectiveness; ineffectiveness in P/L"],
                                                    ["Cash flow hedge reserve", "Roll-forward: opening → OCI additions → reclassified to P/L → closing"],
                                                    ["Costs of hedging reserve", "Roll-forward for option time value and forward points"],
                                                    ["Net investment hedge", "Roll-forward of translation reserve"],
                                                ].map(([item, detail], i, rows) => (
                                                    <tr key={item} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{item}</td>
                                                        <td className="py-2">{detail}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: IAS 32 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    IAS 32: Presentation
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Scale className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Offsetting: Both Conditions Required</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">A financial asset and liability are offset and the <strong className="text-foreground">net amount presented</strong> only when the entity:</p>
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Currently has a legally enforceable right to set off the amounts; <strong className="text-foreground">AND</strong></span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            Intends either to settle on a net basis, or to realise the asset and settle the liability simultaneously
                                        </li>
                                    </ol>
                                    <p className="text-muted-foreground text-xs mt-4 m-0">Most netting arrangements (e.g. ISDA master agreements that allow offset only on default) fail condition 2: they are disclosed in the notes but not offset on the face.</p>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Puttable Instruments and Obligations Arising on Liquidation</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Instruments that give the holder the right to put them back to the issuer (e.g. units in a fund) are classified as liabilities under IAS 32, even if they look like equity economically. The contractual obligation to deliver cash on demand makes them liabilities.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Integrated example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Integrated Example: Disclosure Note Extract
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileText className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Note X: Impairment of Financial Assets</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        The group applies the IFRS 9 three-stage ECL model to financial assets at amortised cost and FVOCI (debt). The following table shows movements in the loss allowance for the year ended 31 December 20X2:
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground"></th>
                                                    <th className="text-right py-2 pr-4 text-foreground">Stage 1 (12m ECL)</th>
                                                    <th className="text-right py-2 pr-4 text-foreground">Stage 2 (Lifetime)</th>
                                                    <th className="text-right py-2 pr-4 text-foreground">Stage 3 (Lifetime)</th>
                                                    <th className="text-right py-2 text-foreground">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-mono text-xs">
                                                {[
                                                    ["Opening balance", "R120,000", "R380,000", "R950,000", "R1,450,000"],
                                                    ["Transfer to Stage 2", "(45,000)", "45,000", "", ""],
                                                    ["Transfer to Stage 3", "", "(80,000)", "80,000", ""],
                                                    ["New originations", "35,000", "", "", "35,000"],
                                                    ["Changes in parameters", "(10,000)", "65,000", "320,000", "375,000"],
                                                    ["Write-offs", "", "", "(400,000)", "(400,000)"],
                                                ].map(([label, s1, s2, s3, total]) => (
                                                    <tr key={label} className="border-b border-border">
                                                        <td className="py-2 pr-4 font-sans text-sm">{label}</td>
                                                        <td className="py-2 pr-4 text-right">{s1 || "-"}</td>
                                                        <td className="py-2 pr-4 text-right">{s2 || "-"}</td>
                                                        <td className="py-2 pr-4 text-right">{s3 || "-"}</td>
                                                        <td className="py-2 text-right">{total || "-"}</td>
                                                    </tr>
                                                ))}
                                                <tr className="font-bold text-accent">
                                                    <td className="py-2 pr-4 font-sans text-sm">Closing balance</td>
                                                    <td className="py-2 pr-4 text-right">R100,000</td>
                                                    <td className="py-2 pr-4 text-right">R410,000</td>
                                                    <td className="py-2 pr-4 text-right">R950,000</td>
                                                    <td className="py-2 text-right">R1,460,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4 text-xs text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">Check the columns:</strong> Stage 1: 120,000 − 45,000 + 35,000 − 10,000 = 100,000. Stage 2: 380,000 + 45,000 − 80,000 + 65,000 = 410,000. Stage 3: 950,000 + 80,000 + 320,000 − 400,000 = 950,000. Transfers net to nil in the Total column.
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Transition */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    IFRS 9 Transition Mechanics
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Transition from IAS 39 to IFRS 9 is examinable, particularly classification changes and the opening ECL allowance.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Classification on Transition</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">IAS 39 Category</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">IFRS 9 Reassessment</th>
                                                    <th className="text-left py-2 text-foreground">Key Point</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["HTM", "Reassess business model and SPPI at transition date", "Most HTM assets will qualify for amortised cost (same outcome, different basis)"],
                                                    ["L&R", "Reassess business model and SPPI at transition date", "Most will remain at amortised cost"],
                                                    ["AFS (debt)", "Reassess; could become AC, FVOCI debt or FVTPL", "Classification may change, depending on business model at transition"],
                                                    ["AFS (equity)", "Default FVTPL; may irrevocably designate FVOCI equity at transition", "The OCI option can be elected at the transition date (not only at initial recognition)"],
                                                    ["FVTPL (mandatory)", "Reassess; may qualify for AC or FVOCI if business model and SPPI support it", "An asset previously \"stuck\" in FVTPL under IAS 39 may now qualify for AC"],
                                                ].map(([cat, reassess, point], i, rows) => (
                                                    <tr key={cat} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{cat}</td>
                                                        <td className="py-2 pr-4">{reassess}</td>
                                                        <td className="py-2">{point}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-display font-semibold text-foreground mb-3">Opening ECL Allowance</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>Stage each asset at the <strong className="text-foreground">transition date</strong> by comparing credit risk at origination with credit risk at transition</li>
                                            <li>The Day 1 ECL allowance adjusts <strong className="text-foreground">opening retained earnings</strong>, not P/L</li>
                                            <li>Comparatives are not restated (unless the entity elects to restate, which is permitted but rare)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Landmark className="w-5 h-5 text-accent" />
                                            <h4 className="font-display font-semibold text-foreground m-0">Practical Issues for SA Entities</h4>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                            <li>SA banks with large, long-dated loan books found the opening ECL particularly complex: many had to estimate credit risk at origination for loans made years before IFRS 9 existed</li>
                                            <li>Entities continuing IAS 39 hedge accounting must still adopt IFRS 9 for classification, measurement and impairment</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Exam strategy by topic */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Comprehensive Exam Strategy
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A step-by-step approach for each of the six IFRS 9 / IAS 39 question types.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {examTopics.map((topic) => (
                                        <div key={topic.title} className="bg-card rounded-xl border border-border p-6">
                                            <h3 className="font-display text-lg font-semibold text-foreground mb-3">{topic.title}</h3>
                                            <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4 m-0">
                                                {topic.steps.map((step) => (
                                                    <li key={step}>{step}</li>
                                                ))}
                                            </ol>
                                            {topic.traps.length > 0 && (
                                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                    <p className="text-xs font-bold text-red-400 mb-1">Common traps</p>
                                                    <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                                        {topic.traps.map((trap) => (
                                                            <li key={trap}>{trap}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section 9: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Common Pitfalls Across All Topics
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Area</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Pitfall</th>
                                                    <th className="text-left py-2 text-foreground">Correct Approach</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {pitfalls.map(([area, pitfall, fix], i) => (
                                                    <tr key={pitfall} className={i < pitfalls.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{area}</td>
                                                        <td className="py-2 pr-4">{pitfall}</td>
                                                        <td className="py-2">{fix}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 10: Mark-earning techniques */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">10</span>
                                    Mark-Earning Exam Techniques
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    You can understand IFRS 9 perfectly and still underperform if your technique is poor. This discipline is what separates a pass from a distinction.
                                </p>
                                <div className="space-y-8">
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">1</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">State Your Basis First</h4>
                                        <p className="text-xs text-muted-foreground m-0">Before any calculation, state which classification, stage or approach you are applying and <em>why</em>. Markers can&apos;t credit an unexplained number, but they can credit correct reasoning even with an arithmetic error.</p>
                                    </div>
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">2</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Show Full Amortisation Tables</h4>
                                        <p className="text-xs text-muted-foreground m-0">Never compress a multi-year EIR schedule to one line. Show opening balance, interest, cash flows and closing balance for each period: markers award process marks at each step.</p>
                                    </div>
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">3</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Use a Structured Journal Format</h4>
                                        <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-1 my-2">
                                            <div className="flex justify-between text-foreground"><span>Dr [Account Name]</span><span>[Amount]</span></div>
                                            <div className="flex justify-between text-accent pl-4"><span>Cr [Account Name]</span><span>[Amount]</span></div>
                                            <p className="text-muted-foreground italic m-0">(Narrative)</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground m-0">Label every debit and credit. An unexplained DR/CR loses the mark.</p>
                                    </div>
                                    <div className="relative pl-10 border-l border-accent/30 ml-4 pb-8">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">4</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Conclude on Every Sub-Question</h4>
                                        <p className="text-xs text-muted-foreground m-0">End every section with a brief conclusion, e.g. &quot;Therefore, the bond is classified as a financial asset at amortised cost.&quot; Examiners award a conclusion mark, so don&apos;t leave it implied.</p>
                                    </div>
                                    <div className="relative pl-10 ml-4 pb-4">
                                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">5</div>
                                        <h4 className="font-bold text-foreground mb-1 text-sm">Distinguish Discussion Marks from Calculation Marks</h4>
                                        <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-1 my-2">
                                            <div className="flex justify-between"><span>Definitions / principles / classification reasoning</span><span>5</span></div>
                                            <div className="flex justify-between"><span>Calculations (EIR table, ECL, journals)</span><span>8</span></div>
                                            <div className="flex justify-between border-b border-border pb-1"><span>Presentation / disclosure</span><span>2</span></div>
                                            <div className="flex justify-between font-bold text-accent"><span>Typical 15-mark question</span><span>15</span></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground m-0">Plan your time accordingly. Don&apos;t spend 12 minutes perfecting a 3-mark calculation while a 5-mark discussion sits unanswered.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 11: SA context */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">11</span>
                                    SA Context: JSE and Industry Applications
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Industry</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9 Issues Commonly Arising</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {[
                                                    ["Banking (FNB, ABSA, Nedbank, Standard Bank)", "Massive ECL disclosures; stage migration; SICR assessment; macro overlays"],
                                                    ["Mining (Anglo, Glencore, Impala)", "Hedge accounting for commodity prices; forward contracts; options"],
                                                    ["Retail (Shoprite, Pick n Pay, Woolworths)", "Trade receivable impairment; provision matrix; store card portfolios"],
                                                    ["Insurance (Sanlam, Discovery, Old Mutual)", "Financial asset classification; equity investments; FVTPL vs FVOCI"],
                                                    ["Property (Growthpoint, Redefine)", "Financial liabilities at amortised cost; interest rate hedges"],
                                                    ["Industrials (Sasol, Eskom)", "Commodity hedges; foreign currency risk; net investment hedges"],
                                                ].map(([industry, issues], i, rows) => (
                                                    <tr key={industry} className={i < rows.length - 1 ? "border-b border-border" : undefined}>
                                                        <td className="py-2 pr-4 text-foreground font-medium">{industry}</td>
                                                        <td className="py-2">{issues}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Study tip:</strong> JSE-listed entities must apply IFRS, so their annual reports are excellent real-world study material. A bank&apos;s IFRS 9 credit risk note (e.g. First National Bank&apos;s annual report) shows the three-stage ECL model in real numbers.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 12: Quick reference */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">12</span>
                                    Quick Reference: IFRS 9 at a Glance
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Calculator className="w-6 h-6 text-accent" />
                                            <h3 className="font-display text-lg font-semibold text-foreground m-0">Classification Matrix</h3>
                                        </div>
                                        <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2">
                                            {[
                                                ["Hold to Collect + Pass", "Amortised Cost"],
                                                ["Hold to Collect & Sell + Pass", "FVOCI (Debt)"],
                                                ["Other/Trading + Any", "FVTPL"],
                                                ["Any + Fail", "FVTPL"],
                                                ["Equity instrument", "FVTPL (or FVOCI equity option, irrevocable)"],
                                            ].map(([test, result]) => (
                                                <div key={test} className="flex justify-between gap-4">
                                                    <span>{test}</span>
                                                    <span className="text-accent text-right">{result}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <BarChart3 className="w-6 h-6 text-accent" />
                                            <h3 className="font-display text-lg font-semibold text-foreground m-0">ECL Stage Summary</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="text-left py-2 pr-2 text-foreground">Stage</th>
                                                        <th className="text-left py-2 pr-2 text-foreground">Trigger</th>
                                                        <th className="text-left py-2 pr-2 text-foreground">Allowance</th>
                                                        <th className="text-left py-2 text-foreground">Interest Base</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-muted-foreground">
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-2 text-foreground font-medium">1</td>
                                                        <td className="py-2 pr-2">Initial recognition / low credit risk</td>
                                                        <td className="py-2 pr-2">12-month ECL</td>
                                                        <td className="py-2">Gross</td>
                                                    </tr>
                                                    <tr className="border-b border-border">
                                                        <td className="py-2 pr-2 text-foreground font-medium">2</td>
                                                        <td className="py-2 pr-2">SICR since initial recognition</td>
                                                        <td className="py-2 pr-2">Lifetime ECL</td>
                                                        <td className="py-2">Gross</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 pr-2 text-foreground font-medium">3</td>
                                                        <td className="py-2 pr-2">Credit impaired</td>
                                                        <td className="py-2 pr-2">Lifetime ECL</td>
                                                        <td className="py-2">Net</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Hedge Type Summary</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 pr-4 text-foreground">Type</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Hedged Item</th>
                                                    <th className="text-left py-2 pr-4 text-foreground">Effective Portion</th>
                                                    <th className="text-left py-2 text-foreground">Ineffective Portion</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Fair value</td>
                                                    <td className="py-2 pr-4">Recognised asset/liability/firm commitment</td>
                                                    <td className="py-2 pr-4">P/L (both sides)</td>
                                                    <td className="py-2">N/A (both in P/L)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 text-foreground font-medium">Cash flow</td>
                                                    <td className="py-2 pr-4">Forecast transaction/variable rate exposure</td>
                                                    <td className="py-2 pr-4">OCI</td>
                                                    <td className="py-2">P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-foreground font-medium">Net investment</td>
                                                    <td className="py-2 pr-4">Net investment in foreign operation</td>
                                                    <td className="py-2 pr-4">OCI (translation reserve)</td>
                                                    <td className="py-2">P/L</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                                            ["Three standards:", "IAS 32 (presentation), IFRS 9 (measurement), IFRS 7 (disclosures)."],
                                            ["IFRS 7", "requires carrying amounts by category, fair value hierarchy levels and extensive risk disclosures."],
                                            ["Credit risk disclosures", "include loss allowance roll-forwards by stage, a key IFRS 9-specific disclosure."],
                                            ["IAS 32 offsetting", "requires both legal enforceability AND net settlement intent; most netting arrangements don't qualify."],
                                            ["Transition:", "classification reassessed at transition date; opening ECL adjusts retained earnings; comparatives not restated; FVOCI equity OCI option can be elected at transition."],
                                            ["Exam technique:", "state your basis, show your tables, conclude every sub-question, distinguish discussion from calculation marks."],
                                            ["South African context:", "know which industries face which IFRS 9 issues; JSE annual reports are real-world examples."],
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
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-8/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 8: Hedge Accounting: IFRS 9
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/">
                                    Master All Standards
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* Guide Completion Card */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <GuideCompletionCard guide="ifrs-9" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
