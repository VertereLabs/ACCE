import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lightbulb, Calculator, GitBranch, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 5: Derecognition | ACCE Tutors",
    description: "IFRS 9 derecognition: the asset decision tree, risks and rewards, continuing involvement, factoring, repos, and the 10% test for liability modifications.",
    keywords: "IFRS 9 derecognition, financial asset derecognition decision tree, risks and rewards, continuing involvement, factoring with recourse, repo, securitisation, substantial modification, 10% test",
    alternates: {
        canonical: "/guides/ifrs-9/part-5/",
    },
};

export default function IFRS9Part5Page() {
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
                                Part 5 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 5: Is It Really Gone?
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Derecognition
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                &quot;When do I take it off the books?&quot; sounds simple, but derecognition of financial assets is among the most complex areas of IFRS 9, and a fertile source of exam questions.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground leading-relaxed m-0">
                                    Derecognition removes a financial asset or liability from the statement of financial position. The core challenge: <strong className="text-foreground">when an asset is transferred, is it really gone?</strong> Or has the entity retained exposure to its risks and rewards?
                                </p>
                            </div>

                            {/* Section 1: Decision tree */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    The Asset Derecognition Decision Tree
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 provides a sequential framework. Learn it by heart and draw it in rough before you start: derecognition questions reward methodical students who follow each step, not those who guess.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <GitBranch className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">Five steps, in order</h3>
                                    </div>
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Have the contractual rights to cash flows <strong className="text-foreground">expired</strong>? Yes → <strong className="text-foreground">Derecognise</strong>. No → continue.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span>Has the entity <strong className="text-foreground">transferred</strong> the asset? No → <strong className="text-foreground">Do not derecognise</strong>. Yes → continue.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span>Have substantially all the risks and rewards been <strong className="text-foreground">transferred</strong>? Yes → <strong className="text-foreground">Derecognise</strong>. No → continue.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <span>Have substantially all the risks and rewards been <strong className="text-foreground">retained</strong>? Yes → <strong className="text-foreground">Do not derecognise</strong>. No → continue.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                            <span>Mixed situation: has the entity retained <strong className="text-foreground">control</strong>? Yes → recognise the asset to the extent of <strong className="text-foreground">continuing involvement</strong>. No → <strong className="text-foreground">Derecognise</strong>.</span>
                                        </li>
                                    </ol>
                                </div>
                            </section>

                            {/* Section 2: Expiry and transfer */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    Expiry and Transfer (Steps 1 & 2)
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Step 1: Expiry</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            The simplest case. If the rights to receive cash flows have lapsed (e.g. a receivable is written off as uncollectable or a bond matures), the asset is derecognised. No transfer is involved.
                                        </p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">Step 2: Transfer</h4>
                                        <p className="text-muted-foreground text-sm m-0">
                                            A transfer occurs when the entity either <strong className="text-foreground">transfers the contractual rights</strong> to the cash flows (outright assignment), or <strong className="text-foreground">retains the rights but assumes an obligation to pass on</strong> those cash flows (pass-through arrangement).
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                                        Pass-through arrangements: all three conditions must be met
                                    </h3>
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            The entity has no obligation to pay unless it collects equivalent amounts from the original asset
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>Transfer of collected cash flows to the eventual recipients is <strong className="text-foreground">not permitted to be delayed</strong> beyond short periods</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span>The entity has <strong className="text-foreground">no right to reinvest</strong> those cash flows (except short-term investments in cash or cash equivalents during settlement periods)</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Risks and rewards */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    The Risks and Rewards Test (Steps 3 & 4)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This is the heart of the assessment. <strong className="text-foreground">&quot;Risks and rewards&quot;</strong> refers primarily to exposure to <strong className="text-foreground">variability in cash flows</strong>: both positive (upside from early repayment, favourable rates) and negative (credit losses, interest rate risk).
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Scenario</th>
                                                    <th className="text-left py-2 text-foreground">Assessment</th>
                                                    <th className="text-left py-2 text-foreground">Treatment</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Outright sale (no recourse, no repurchase obligation)</td>
                                                    <td className="py-2 pr-4">Substantially all transferred</td>
                                                    <td className="py-2">Derecognise</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Sale with full recourse for credit losses</td>
                                                    <td className="py-2 pr-4">Substantially all retained</td>
                                                    <td className="py-2">Continue recognition</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Sale with partial credit guarantee</td>
                                                    <td className="py-2 pr-4">Mixed</td>
                                                    <td className="py-2">Assess continuing involvement</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Repo (sell + agree to repurchase at a fixed price)</td>
                                                    <td className="py-2 pr-4">Substantially all retained (price risk stays)</td>
                                                    <td className="py-2">Continue recognition</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Securities lending</td>
                                                    <td className="py-2 pr-4">Substantially all retained (price risk stays)</td>
                                                    <td className="py-2">Continue recognition</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Sale of a senior tranche (junior retained)</td>
                                                    <td className="py-2 pr-4">Depends on structure</td>
                                                    <td className="py-2">Assess retained exposure</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground m-0">
                                            The risks and rewards test is not a precise calculation; it is a <strong className="text-foreground">&quot;substantially all&quot; judgement</strong>. If an entity retains any credit risk or interest rate variability, carefully assess whether that constitutes substantial retention.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Control and continuing involvement */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    The Control Test & Continuing Involvement (Step 5)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    When the outcome is mixed (neither substantially transferred nor substantially retained), look to <strong className="text-foreground">control</strong>. Control is retained if the entity has the practical ability to sell the transferred asset unilaterally. If control is retained, the entity recognises the asset to the extent of its <strong className="text-foreground">continuing involvement</strong>, which represents the maximum exposure to changes in value of the transferred asset.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Example: Sale with a Capped Credit Guarantee
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        An entity sells a loan receivable for R1,000,000 but provides a credit guarantee up to a R200,000 maximum loss.
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li>The entity derecognises the asset (transferred most risks and rewards) but retains a continuing involvement of R200,000</li>
                                        <li>Recognise a liability for the guarantee of R200,000 (initially at fair value)</li>
                                        <li>The asset is &quot;retained&quot; only to the extent of R200,000</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Common scenarios */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Derecognition in Practice
                                </h2>

                                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Scenario 1: Factoring of Trade Receivables</h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    A South African retailer sells R5,000,000 of trade receivables to a factor (financial institution) for R4,800,000.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h4 className="font-display text-lg font-semibold text-red-400 mb-2">With recourse</h4>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            The retailer bears all credit risk. Substantially all risks retained → <strong className="text-foreground">do not derecognise</strong>. Treat as a secured borrowing.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Cash</span><span className="text-foreground">4,800,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Discount (Finance Cost)</span><span className="text-foreground">200,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Financial Liability</span><span className="text-accent">5,000,000</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h4 className="font-display text-lg font-semibold text-green-400 mb-2">Without recourse</h4>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            The factor bears all credit risk. Substantially all risks transferred → <strong className="text-foreground">derecognise</strong>.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Cash</span><span className="text-foreground">4,800,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Loss on Derecognition</span><span className="text-foreground">200,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Trade Receivables</span><span className="text-accent">5,000,000</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Substance over form:</strong> many &quot;sale&quot; arrangements in practice are actually secured borrowings. The legal form says &quot;sale&quot; but the original holder still bears the risk. IFRS 9 always looks to the economic substance.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-3">Scenario 2: Repos</h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            An entity sells government bonds with fair value R10,000,000 and simultaneously agrees to repurchase them in 90 days at R10,200,000 (a fixed price). It bears the full risk of price changes until repurchase: substantially all risks retained → <strong className="text-foreground">do not derecognise</strong>.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Cash</span><span className="text-foreground">10,000,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Financial Liability (Repo)</span><span className="text-accent">10,000,000</span></div>
                                            <p className="text-muted-foreground italic m-0 pt-2">Interest expense at the EIR over the 90-day term</p>
                                        </div>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-3">Scenario 3: Securitisation</h3>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            An entity transfers R100,000,000 of home loans to an SPV, which issues senior notes (R80,000,000) and junior notes (R20,000,000). The entity retains the junior notes.
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-3">
                                            <li>Senior notes: investors bear the first R80m of value / risk</li>
                                            <li>Junior notes: the entity bears losses first (first-loss piece)</li>
                                        </ul>
                                        <p className="text-muted-foreground text-sm m-0">
                                            The entity retains exposure to variability (through the junior notes and any credit enhancement). The retained portion must be quantified, and the entity derecognises only the portion for which risks and rewards have genuinely been transferred (senior notes to external investors).
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Liabilities */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Derecognition of Financial Liabilities
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Much more straightforward. A financial liability is derecognised when it is <strong className="text-foreground">extinguished</strong>: the obligation is <strong className="text-foreground">discharged</strong> (paid in full), <strong className="text-foreground">cancelled</strong> (creditor formally releases it) or has <strong className="text-foreground">expired</strong> (legally lapsed).
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <p className="font-mono text-sm text-accent mb-3">Gain/Loss = Carrying Amount of Liability − Amount Paid to Settle</p>
                                    <p className="text-muted-foreground text-sm m-0">
                                        A gain arises when the entity pays <em>less</em> than the carrying amount (e.g. buys back bonds in the open market at a discount). A loss arises when more is paid.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Calculator className="w-5 h-5 text-accent" />
                                            <h4 className="font-bold text-foreground m-0">Worked Example: Early Redemption</h4>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            Bonds with a carrying amount of R2,050,000 (amortised cost, part-way through their term) are repurchased in the open market for R1,980,000.
                                        </p>
                                        <div className="bg-card rounded-lg p-3 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between"><span className="text-foreground">Dr Bond Payable</span><span className="text-foreground">2,050,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Cash</span><span className="text-accent">1,980,000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Gain on Extinguishment (P/L)</span><span className="text-accent">70,000</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h4 className="font-bold text-foreground mb-3">Part Extinguishment</h4>
                                        <ol className="text-muted-foreground text-sm space-y-2 list-decimal ml-4 m-0">
                                            <li>Allocate the carrying amount between the part redeemed and the part retained (based on relative fair values at the repurchase date)</li>
                                            <li>Derecognise the portion bought back</li>
                                            <li>Recognise the resulting gain/loss in P/L</li>
                                        </ol>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Substantial modification */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    Substantial Modification of Liabilities
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Introduced in Part 4. If a financial liability is renegotiated, apply the <strong className="text-foreground">10% test</strong>: compare the PV of the new cash flows (discounted at the <strong className="text-foreground">original EIR</strong>) with the PV of the original remaining cash flows.
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">PV Difference</th>
                                                    <th className="text-left py-2 text-foreground">Treatment</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">≥ 10%</td>
                                                    <td className="py-2"><strong className="text-foreground">Substantial</strong> → Derecognise old; recognise new at FV; gain/loss in P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">&lt; 10%</td>
                                                    <td className="py-2"><strong className="text-foreground">Not substantial</strong> → Adjust carrying amount; amortise difference using original EIR</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Qualitative changes count too</h4>
                                            <p className="text-sm text-muted-foreground m-0">Even if the 10% test is not breached, a modification may still be substantial if there is a <strong className="text-foreground">qualitative change</strong>, e.g. a change in the currency of the borrowing, conversion from fixed to floating rate, or change of debtor. Use judgement.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Non-substantial modifications</h4>
                                            <p className="text-sm text-muted-foreground m-0">The new carrying amount is the PV of the modified cash flows discounted at the <strong className="text-foreground">original EIR</strong>. The difference between the old carrying amount and this new PV is recognised <strong className="text-foreground">immediately in P/L</strong>.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calculator className="w-6 h-6 text-accent" />
                                        <h3 className="font-display text-lg font-semibold text-foreground m-0">
                                            Worked Example: Debt Modification
                                        </h3>
                                    </div>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 mb-4">
                                        <li>Loan payable: carrying amount R3,000,000; original EIR 12%; 4 years remaining</li>
                                        <li>The bank extends the term by 1 year and reduces the interest rate from 12% to 9%</li>
                                        <li>New cash flows (PV at the original 12% EIR): R2,650,000</li>
                                    </ul>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-2 mb-4">
                                        <p className="text-muted-foreground m-0">PV of original remaining cash flows at 12% = R3,000,000 (equal to carrying amount, simplification)</p>
                                        <p className="text-muted-foreground m-0">PV of new cash flows at 12% = R2,650,000</p>
                                        <p className="text-foreground m-0">Difference = R350,000 / R3,000,000 = 11.7% → <span className="text-accent font-bold">Substantial</span></p>
                                    </div>
                                    <div className="bg-card rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
                                        <div className="flex items-center justify-between"><span className="text-foreground">Dr Financial Liability (old)</span><span className="text-foreground">3,000,000</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Financial Liability (new @ FV)</span><span className="text-accent">2,650,000</span></div>
                                        <div className="flex items-center justify-between"><span className="text-accent ml-4">Cr Gain on Modification (P/L)</span><span className="text-accent">350,000</span></div>
                                    </div>
                                    <p className="text-muted-foreground text-sm m-0">
                                        The new liability is recognised at R2,650,000 and measured at amortised cost using the new EIR (9%).
                                    </p>
                                </div>
                            </section>

                            {/* Section 8: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
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
                                                    <td className="py-2 pr-4">Derecognising when legal title transfers</td>
                                                    <td className="py-2">Substance over form: test risks and rewards, not legal form</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Ignoring continuing involvement</td>
                                                    <td className="py-2">When risks and rewards are mixed, quantify the retained exposure</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Treating repos as sales</td>
                                                    <td className="py-2">Repos retain risks and rewards → secured borrowings</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Using the new EIR for the 10% test</td>
                                                    <td className="py-2">Use the ORIGINAL EIR to discount both old and new cash flows</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Forgetting modification gains/losses go to P/L</td>
                                                    <td className="py-2">Both substantial and non-substantial adjustments are recognised in P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Treating full recourse factoring as a sale</td>
                                                    <td className="py-2">Credit risk is retained → it&apos;s a secured borrowing</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Exam technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
                                    Exam Technique
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Asset derecognition framework</h3>
                                    <ol className="text-muted-foreground text-sm space-y-2 list-decimal ml-4 mb-4">
                                        <li>Have the contractual rights expired? If yes → derecognise.</li>
                                        <li>Has there been a transfer? If no → keep on balance sheet.</li>
                                        <li>Assess risks and rewards: substantially all transferred → derecognise and calculate gain/loss; substantially all retained → keep on balance sheet as a secured borrowing; mixed → assess control and continuing involvement.</li>
                                        <li>If derecognised, calculate the gain or loss:</li>
                                    </ol>
                                    <p className="font-mono text-sm text-accent m-0">Gain/Loss = Proceeds received − Carrying amount ± Fair value of any retained interest</p>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Mark allocation tip</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Derecognition questions often earn marks for the <em>reasoning</em>, not just the conclusion. State which test applies (risks and rewards), what specific risk exposure is retained or transferred, and the accounting consequence with a journal entry or balance sheet extract.
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
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Asset derecognition</strong> is sequential: expiry → transfer → risks and rewards → control.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Substance over form:</strong> a legal sale is not an accounting derecognition if risks are retained.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Repos and full-recourse factoring</strong> are secured borrowings: the asset stays on balance sheet.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Continuing involvement:</strong> when risks and rewards are mixed, only the retained exposure keeps the asset on balance sheet.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Liabilities</strong> are derecognised when discharged, cancelled, or expired; gain/loss = carrying amount − settlement amount.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Substantial modification</strong> (10% test using the original EIR) derecognises the old liability and recognises a new one.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-4">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 4: Financial Liabilities
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-6">
                                    Part 6: Impairment (ECL)
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Lost in the Derecognition Decision Tree?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Factoring, repos and securitisations all hinge on the same risks and rewards reasoning. Let&apos;s practise arguing it step by step.
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
