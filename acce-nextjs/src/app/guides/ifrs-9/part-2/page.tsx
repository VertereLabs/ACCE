import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Info, Lightbulb, Scale, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 2: Classifying Financial Assets | ACCE Tutors",
    description: "IFRS 9 classification of financial assets: the business model test, the SPPI test, the FVOCI equity option, and how it compares to IAS 39.",
    keywords: "IFRS 9 classification, business model test, SPPI test, amortised cost, FVOCI, FVTPL, fair value option, IAS 39 categories, reclassification",
    alternates: {
        canonical: "/guides/ifrs-9/part-2/",
    },
};

export default function IFRS9Part2Page() {
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
                                Part 2 of 9
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                                Part 2: The Gateway Test
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Classification of Financial Assets
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                The category a financial asset lands in determines everything about how it is measured. Get the classification wrong, and every number that flows from it is wrong.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Introduction */}
                            <div className="bg-card rounded-2xl border border-border p-8 mb-10">
                                <p className="text-muted-foreground text-lg leading-relaxed m-0">
                                    Classification also decides whether fair value changes hit <strong className="text-foreground">profit or loss</strong> (affecting earnings per share and bonuses) or <strong className="text-foreground">other comprehensive income</strong> (bypassing P/L entirely). This has real economic consequences for reported performance.
                                </p>
                            </div>

                            {/* Section 1: IAS 39 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                    IAS 39: The Old Four-Category Model
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Under IAS 39, financial assets fell into <strong className="text-foreground">four categories</strong>, driven primarily by <em>management intention</em>:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Category</th>
                                                    <th className="text-left py-2 text-foreground">Abbreviation</th>
                                                    <th className="text-left py-2 text-foreground">Basis</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Fair Value Through Profit or Loss</td>
                                                    <td className="py-2 pr-4">FVTPL</td>
                                                    <td className="py-2">Held for trading OR designated at inception</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Held-to-Maturity</td>
                                                    <td className="py-2 pr-4">HTM</td>
                                                    <td className="py-2">Positive intention AND ability to hold to maturity</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Loans and Receivables</td>
                                                    <td className="py-2 pr-4">L&amp;R</td>
                                                    <td className="py-2">Not quoted in an active market, fixed/determinable payments</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Available-for-Sale</td>
                                                    <td className="py-2 pr-4">AFS</td>
                                                    <td className="py-2">Residual category: everything else</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-4">The Problems with IAS 39</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">1. Unreliable intention</h4>
                                        <p className="text-muted-foreground text-sm m-0">Classification depended on what management <em>said</em> they intended, not what was economically appropriate, creating scope for manipulation.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">2. The &quot;Tainting Rule&quot; (HTM)</h4>
                                        <p className="text-muted-foreground text-sm m-0">Selling <em>any</em> HTM investment before maturity (outside very narrow circumstances) forced <em>all</em> HTM investments into AFS for the current year and the next two years.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">3. AFS &quot;recycling&quot;</h4>
                                        <p className="text-muted-foreground text-sm m-0">AFS fair value changes went to OCI, then were recycled to P/L on sale, creating artificial volatility in reported earnings.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">4. Too many exceptions</h4>
                                        <p className="text-muted-foreground text-sm m-0">Layer upon layer of carve-outs and specific guidance made IAS 39 enormously complex and hard to apply consistently.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: IFRS 9 three categories */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                    IFRS 9: The New Three-Category Model
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    IFRS 9 replaces the four IAS 39 categories with <strong className="text-foreground">three categories</strong>, based on objective criteria rather than management intention:
                                </p>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Category</th>
                                                    <th className="text-left py-2 text-foreground">Measurement</th>
                                                    <th className="text-left py-2 text-foreground">P/L or OCI?</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Amortised Cost (AC)</td>
                                                    <td className="py-2 pr-4">Initial FV → amortised cost thereafter</td>
                                                    <td className="py-2">Interest income via EIR in P/L</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Fair Value Through OCI (FVOCI)</td>
                                                    <td className="py-2 pr-4">Fair value</td>
                                                    <td className="py-2">FV changes in OCI; interest in P/L</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Fair Value Through P/L (FVTPL)</td>
                                                    <td className="py-2 pr-4">Fair value</td>
                                                    <td className="py-2">All FV changes in P/L</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">The Two-Step Classification Test</h3>
                                    <ol className="space-y-3 m-0 p-0 list-none mb-4">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span><strong className="text-foreground">Business Model Test:</strong> how are the assets managed?</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span><strong className="text-foreground">SPPI Test</strong> (cash flow characteristics): what are the contractual cash flows?</span>
                                        </li>
                                    </ol>
                                    <p className="text-sm text-muted-foreground m-0">Both tests must be applied, in sequence. The outcome of the two together determines the category.</p>
                                </div>
                            </section>

                            {/* Section 3: Business Model Test */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                    Step 1: The Business Model Test
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    The business model reflects how an entity manages its financial assets to generate cash flows. It is determined at a level <em>higher than individual instruments</em>: the portfolio or group of assets managed together.
                                </p>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <Scale className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">The business model is a fact, not a choice.</strong> It is determined by observable evidence of what management actually does, not what they claim they will do: how performance is evaluated, how managers are compensated, the frequency and volume of sales, and stated policies.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Hold to Collect</h3>
                                        <p className="text-sm text-muted-foreground mb-3">Objective: collect contractual cash flows (principal + interest). Sales are incidental, not central.</p>
                                        <p className="text-xs text-muted-foreground mb-3">e.g. a bank holding mortgage loans; a company holding bonds to maturity.</p>
                                        <p className="text-sm text-foreground font-semibold m-0">→ Amortised Cost (if SPPI passes)</p>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">Hold to Collect AND Sell</h3>
                                        <p className="text-sm text-muted-foreground mb-3">Objective: both collect contractual cash flows AND sell. Both activities are integral.</p>
                                        <p className="text-xs text-muted-foreground mb-3">e.g. a bank&apos;s liquidity portfolio; an insurer managing assets to meet policyholder claims.</p>
                                        <p className="text-sm text-foreground font-semibold m-0">→ FVOCI (if SPPI passes)</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                                        <h3 className="font-display text-lg font-semibold text-red-400 mb-2">Other (Trading)</h3>
                                        <p className="text-sm text-muted-foreground mb-3">Objective: primarily selling to realise fair value gains. Also applies when no other model fits.</p>
                                        <p className="text-xs text-muted-foreground mb-3">e.g. a trading book; investments held for speculative purposes.</p>
                                        <p className="text-sm text-foreground font-semibold m-0">→ FVTPL (regardless of SPPI)</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Sales Activity: What&apos;s Acceptable in &quot;Hold to Collect&quot;?</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Reason for Sale</th>
                                                    <th className="text-left py-2 text-foreground">Consistent with Hold to Collect?</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Credit deterioration (selling a deteriorating loan)</td>
                                                    <td className="py-2 text-green-400">✓ Yes</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Low frequency and insignificant value</td>
                                                    <td className="py-2 text-green-400">✓ Yes</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Close to maturity (cash flows substantially collected)</td>
                                                    <td className="py-2 text-green-400">✓ Yes</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Increasing sales frequency and volume</td>
                                                    <td className="py-2 text-red-400">✗ No</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Sales to generate profit from fair value movements</td>
                                                    <td className="py-2 text-red-400">✗ No</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Exam technique:</strong> Look for the <em>overall pattern</em>, not isolated transactions. One sale doesn&apos;t change a business model. Consistent, repeated selling to capture gains does.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: SPPI */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                    Step 2: The SPPI Test
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    For amortised cost or FVOCI, the contractual cash flows must be <strong className="text-foreground">Solely Payments of Principal and Interest</strong> on the principal amount outstanding. This tests what the contract actually says you will receive.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">What is &quot;Principal&quot;?</h4>
                                        <p className="text-muted-foreground text-sm m-0">The fair value of the financial asset at initial recognition. As repayments are made, the outstanding principal decreases.</p>
                                    </div>
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h4 className="text-foreground font-semibold mb-2">What is &quot;Interest&quot;?</h4>
                                        <p className="text-muted-foreground text-sm m-0">Consideration for the time value of money, credit risk, liquidity risk and other basic lending risks, plus reasonable administrative costs and profit margin.</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Does the Instrument Pass SPPI?</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Cash Flow Feature</th>
                                                    <th className="text-left py-2 text-foreground">Result</th>
                                                    <th className="text-left py-2 text-foreground">Explanation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Fixed rate bond</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2">Simple interest on principal</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Floating rate bond (JIBAR + spread)</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2">Rate changes but still time value + credit risk</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Inflation-linked bond</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass*</td>
                                                    <td className="py-2">Updating principal for inflation is consistent with time value</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Bond with prepayment option</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass*</td>
                                                    <td className="py-2">If prepayment amount ≈ outstanding principal + accrued interest</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Convertible bond (equity conversion)</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ Fail</td>
                                                    <td className="py-2">Equity conversion feature is not interest or principal</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Leveraged interest (e.g. 3× JIBAR)</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ Fail</td>
                                                    <td className="py-2">Leverage amplifies beyond time value compensation</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Return linked to equity index or commodity price</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ Fail</td>
                                                    <td className="py-2">Not compensation for time value or credit risk</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Profit-participating loans</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ Fail</td>
                                                    <td className="py-2">Return linked to borrower performance</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Non-recourse loans (asset-specific)</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2">Restriction of recourse doesn&apos;t disqualify if still P+I</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 m-0">* Subject to conditions</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">The &quot;Insignificant Effect&quot; Exception</h4>
                                            <p className="text-sm text-muted-foreground m-0">If a feature could modify timing or amount but its effect is <strong className="text-foreground">de minimis</strong> (insignificant in all circumstances), the asset may still pass SPPI.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                        <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 text-sm">Contractually Linked Instruments</h4>
                                            <p className="text-sm text-muted-foreground m-0">For tranches of a structured vehicle (e.g. a CDO or CLO), &quot;look through&quot; to the underlying pool. Subordinated tranches that concentrate credit risk typically fail SPPI.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-display font-semibold text-foreground mb-1">Exam Trap</h4>
                                            <p className="text-muted-foreground text-sm m-0">
                                                Don&apos;t assume any bond passes SPPI automatically. Always check for equity conversion features, performance-linked returns or leveraged interest rates: these are automatic SPPI failures.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Classification Matrix */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                    Putting It Together: The Classification Matrix
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Business Model</th>
                                                    <th className="text-left py-2 text-foreground">SPPI Pass?</th>
                                                    <th className="text-left py-2 text-foreground">Classification</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hold to Collect</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Yes</td>
                                                    <td className="py-2 font-semibold text-foreground">Amortised Cost</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hold to Collect</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ No</td>
                                                    <td className="py-2 font-semibold text-foreground">FVTPL</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hold to Collect &amp; Sell</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Yes</td>
                                                    <td className="py-2 font-semibold text-foreground">FVOCI (Debt)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Hold to Collect &amp; Sell</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ No</td>
                                                    <td className="py-2 font-semibold text-foreground">FVTPL</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Other/Trading</td>
                                                    <td className="py-2 pr-4">Any</td>
                                                    <td className="py-2 font-semibold text-foreground">FVTPL</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">The Override: The Fair Value Option (FVO)</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Even if an asset would otherwise be at amortised cost or FVOCI, an entity may <strong className="text-foreground">irrevocably designate</strong> it at FVTPL at initial recognition if doing so <strong className="text-foreground">eliminates or significantly reduces an accounting mismatch</strong>.
                                    </p>
                                    <div className="bg-card rounded-lg p-3 text-sm">
                                        <p className="text-muted-foreground m-0">
                                            <strong className="text-foreground">Example:</strong> A bank issues fixed-rate debt (liability at amortised cost) and holds fixed-rate bonds (asset would normally be amortised cost). If interest rates change, the asset&apos;s fair value moves but the liability doesn&apos;t, creating a mismatch. The bank can designate the bonds at FVTPL so both sides reflect market values, eliminating the mismatch.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Equity Instruments */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">6</span>
                                    Equity Instruments: A Special Case
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Equity instruments <strong className="text-foreground">always fail SPPI</strong>: dividends are not &quot;principal and interest&quot;. Therefore:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">Default: FVTPL</h3>
                                        <p className="text-sm text-muted-foreground m-0">All fair value changes and dividends in P/L.</p>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-purple-400 mb-2">Irrevocable OCI Option</h3>
                                        <p className="text-sm text-muted-foreground m-0">At initial recognition, an equity investment may be designated at FVOCI <strong className="text-foreground">if it is not held for trading</strong>.</p>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">FVOCI Debt vs FVOCI Equity (OCI Option)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Feature</th>
                                                    <th className="text-left py-2 text-foreground">FVOCI (Debt)</th>
                                                    <th className="text-left py-2 text-foreground">FVOCI (Equity)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Reclassification to P/L on sale</td>
                                                    <td className="py-2 pr-4">✓ Yes (recycled)</td>
                                                    <td className="py-2">✗ No (never recycled)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Impairment model applies</td>
                                                    <td className="py-2 pr-4">✓ Yes</td>
                                                    <td className="py-2">✗ No</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Interest income in P/L</td>
                                                    <td className="py-2 pr-4">✓ Yes (EIR method)</td>
                                                    <td className="py-2">✗ No (dividends only)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">OCI accumulation on sale</td>
                                                    <td className="py-2 pr-4">Transferred to P/L</td>
                                                    <td className="py-2">Transferred to retained earnings</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">The no-recycling rule is deliberate.</strong> The IASB decided recycling created artificial P/L volatility. Gains and losses on equity designated at FVOCI <strong className="text-foreground">never appear in P/L</strong>, not even on sale. This is a significant difference from IAS 39 AFS, where gains and losses <em>were</em> recycled on disposal.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: IAS 39 vs IFRS 9 + Reclassification */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">7</span>
                                    IAS 39 vs IFRS 9 & Reclassification
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">IAS 39 Category</th>
                                                    <th className="text-left py-2 text-foreground">IFRS 9 Equivalent</th>
                                                    <th className="text-left py-2 text-foreground">Key Difference</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">FVTPL (held for trading)</td>
                                                    <td className="py-2 pr-4">FVTPL</td>
                                                    <td className="py-2">Essentially the same</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">FVTPL (designated: FVO)</td>
                                                    <td className="py-2 pr-4">FVTPL (FVO)</td>
                                                    <td className="py-2">Similar criteria, but own credit risk changes go to OCI for liabilities</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Held-to-Maturity (HTM)</td>
                                                    <td className="py-2 pr-4">Amortised Cost</td>
                                                    <td className="py-2">No more &quot;tainting rule&quot;</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Loans and Receivables (L&amp;R)</td>
                                                    <td className="py-2 pr-4">Amortised Cost</td>
                                                    <td className="py-2">More principled basis (business model + SPPI)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Available-for-Sale (AFS)</td>
                                                    <td className="py-2 pr-4">FVOCI (debt) or FVOCI equity option</td>
                                                    <td className="py-2">Equity: no recycling; debt: impairment model now applies</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">Reclassification</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Under IFRS 9, reclassification of financial assets is <strong className="text-foreground">only permitted</strong> when the entity <strong className="text-foreground">changes its business model</strong>:
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4 m-0">
                                        <li>Changes are expected to be <strong className="text-foreground">very infrequent</strong>.</li>
                                        <li>Must be significant to the entity&apos;s operations (e.g. acquisition or disposal of a business line).</li>
                                        <li>Cannot be triggered by a change in intention for a specific instrument.</li>
                                        <li>Applied <strong className="text-foreground">prospectively</strong> from the reclassification date.</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-3 m-0">Under IAS 39, certain transfers between categories were permitted (with restrictions), and the tainting rule forced reclassifications.</p>
                                </div>
                                <div className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                                    <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <p className="text-sm text-muted-foreground m-0">Reclassification of <strong className="text-foreground">financial liabilities</strong> is <strong className="text-foreground">not permitted</strong> under either IAS 39 or IFRS 9.</p>
                                </div>
                            </section>

                            {/* Section 8: Worked Example */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">8</span>
                                    Worked Example: Classifying XYZ Bank&apos;s Portfolio
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Facts</h3>
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span><strong className="text-foreground">Home loan portfolio:</strong> fixed rate mortgages, managed to collect monthly payments. Occasional sales when borrowers default and security is sold.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span><strong className="text-foreground">Government bond portfolio:</strong> JSE-listed bonds, managed both to collect coupons and to sell when the yield curve shifts to manage liquidity.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span><strong className="text-foreground">Listed shares in ABC Ltd:</strong> bought because the treasury desk believes the price will rise. Not designated under the OCI option.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <span><strong className="text-foreground">Structured note:</strong> returns linked to the JSE All Share Index, with capital protection. Repayment = greater of initial investment or 120% × JSE return.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                            <span><strong className="text-foreground">Trade receivables:</strong> standard 30-day receivables from corporate clients; the business model is simply to collect.</span>
                                        </li>
                                    </ol>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Classification</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 text-foreground">Asset</th>
                                                    <th className="text-left py-2 text-foreground">Business Model</th>
                                                    <th className="text-left py-2 text-foreground">SPPI?</th>
                                                    <th className="text-left py-2 text-foreground">Classification</th>
                                                    <th className="text-left py-2 text-foreground">Reasoning</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">1. Home loans</td>
                                                    <td className="py-2 pr-4">Hold to Collect</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Amortised Cost</td>
                                                    <td className="py-2">Fixed P+I; sales are credit-driven (acceptable)</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">2. Govt bonds</td>
                                                    <td className="py-2 pr-4">Hold to Collect &amp; Sell</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVOCI (Debt)</td>
                                                    <td className="py-2">Both objectives are integral</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">3. ABC shares</td>
                                                    <td className="py-2 pr-4">Other/Trading</td>
                                                    <td className="py-2 pr-4">N/A (equity)</td>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVTPL</td>
                                                    <td className="py-2">Held for capital gain; no OCI designation</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">4. Structured note</td>
                                                    <td className="py-2 pr-4">N/A</td>
                                                    <td className="py-2 pr-4 text-red-400">✗ Fail</td>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">FVTPL</td>
                                                    <td className="py-2">Cash flows linked to equity index: not SPPI</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">5. Trade receivables</td>
                                                    <td className="py-2 pr-4">Hold to Collect</td>
                                                    <td className="py-2 pr-4 text-green-400">✓ Pass</td>
                                                    <td className="py-2 pr-4 font-semibold text-foreground">Amortised Cost</td>
                                                    <td className="py-2">Simple right to receive cash</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 9: Pitfalls */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">9</span>
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
                                                    <td className="py-2 pr-4">Applying SPPI before Business Model</td>
                                                    <td className="py-2">Always apply business model first: if it is &quot;other/trading&quot;, SPPI is irrelevant</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Assuming all bonds pass SPPI</td>
                                                    <td className="py-2">Check for equity conversion, leveraged interest, index-linked returns</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Confusing FVOCI debt and FVOCI equity</td>
                                                    <td className="py-2">Debt: recycled to P/L on sale. Equity OCI option: NEVER recycled</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Thinking sales automatically change the business model</td>
                                                    <td className="py-2">Frequency, volume and reason matter; isolated credit-driven sales don&apos;t change the model</td>
                                                </tr>
                                                <tr className="border-b border-border">
                                                    <td className="py-2 pr-4">Confusing IAS 39 AFS with IFRS 9 FVOCI</td>
                                                    <td className="py-2">IAS 39 equity AFS gains were recycled; IFRS 9 equity FVOCI gains are not</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4">Treating the FVO as a free choice</td>
                                                    <td className="py-2">Only available to eliminate or significantly reduce an accounting mismatch</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Section 10: Exam Technique */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">10</span>
                                    Exam Technique: Classification Framework
                                </h2>
                                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                    <ol className="space-y-3 m-0 p-0 list-none">
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span>Confirm it is a financial asset within the scope of IFRS 9.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span>Is it an equity instrument? <strong className="text-foreground">Yes:</strong> default FVTPL; consider whether the OCI option has been or could be elected. <strong className="text-foreground">No</strong> (debt): continue.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <span>Apply the <strong className="text-foreground">Business Model Test</strong>: describe the model and support it with evidence from the facts.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                            <span>Apply the <strong className="text-foreground">SPPI Test</strong>: identify any features that might cause a fail (leverage, equity-linking, etc.).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-muted-foreground">
                                            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                            <span>Conclude on classification using the matrix.</span>
                                        </li>
                                    </ol>
                                </div>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground text-sm m-0">
                                            <strong className="text-foreground">Mark allocation tip:</strong> A 4-mark classification question typically wants business model identification + justification (2 marks), SPPI assessment (1 mark) and the correct classification conclusion (1 mark).
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
                                            <span className="text-muted-foreground"><strong className="text-foreground">IAS 39 had four categories</strong> based on management intention; <strong className="text-foreground">IFRS 9 has three</strong> based on objective criteria.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Two tests:</strong> the Business Model Test (how are assets managed?) and the SPPI Test (what are the contractual cash flows?).</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Hold to Collect + SPPI pass</strong> → Amortised Cost. <strong className="text-foreground">Hold to Collect &amp; Sell + SPPI pass</strong> → FVOCI (Debt). <strong className="text-foreground">Anything else, or SPPI fail</strong> → FVTPL.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Equity instruments</strong> default to FVTPL; the irrevocable OCI option (no recycling) is available for non-trading equity investments.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground"><strong className="text-foreground">Reclassification</strong> is only permitted on a genuine change of business model, expected to be very rare.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Coming Next */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                                    Coming in Part 3...
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Classification done, we turn to <strong className="text-foreground">measurement</strong>: initial recognition, the effective interest rate method, and how FVOCI and FVTPL movements flow through P/L and OCI.
                                </p>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-9/part-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 1: Scope & Introduction
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <Link href="/guides/ifrs-9/part-3">
                                    Part 3: Measuring Financial Assets
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Stuck on the Business Model or SPPI Test?
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                                Classification is where most IFRS 9 marks are won or lost. Let&apos;s practise justifying your conclusion from the facts, the way examiners want it.
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
