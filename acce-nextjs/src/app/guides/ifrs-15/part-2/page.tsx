import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, ClipboardCheck, Split, DollarSign, Calculator, Unlock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuidePdfPublished } from "@/config/guides";

export const metadata: Metadata = {
    title: "Part 2: The Five-Step Model (IFRS 15) | ACCE Tutors",
    description: "Master IFRS 15's five-step model: identify the contract, performance obligations, transaction price, allocation, and recognition.",
    keywords: "IFRS 15 five step model, performance obligations, transaction price, relative standalone selling price, revenue recognition over time vs point in time",
    alternates: {
        canonical: "/guides/ifrs-15/part-2/",
    },
};

export default function IFRS15Part2Page() {
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
                                Part 2 of 5
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                                Part 2: The Deep Dive
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                                The IFRS 15 Five-Step Model
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                This is the core framework. Master these five steps, and you can solve almost any revenue recognition problem.
                            </p>
                        </header>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none">
                            {/* Intro Model */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-12">
                                {[
                                    { step: 1, title: "Identify Contract" },
                                    { step: 2, title: "Identify POs" },
                                    { step: 3, title: "Determine Price" },
                                    { step: 4, title: "Allocate Price" },
                                    { step: 5, title: "Recognize Rev" }
                                ].map((s) => (
                                    <div key={s.step} className="p-3 bg-card border border-border rounded-lg text-center">
                                        <div className="text-accent font-bold text-xs mb-1">STEP {s.step}</div>
                                        <div className="text-[10px] text-foreground leading-tight">{s.title}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Step 1 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">1</span>
                                    Identify the Contract with the Customer
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Before you can recognize revenue, you must have a valid contract. A contract meets all 5 of these criteria:
                                </p>
                                <ul className="space-y-3 bg-card border border-border rounded-xl p-6 mb-6 list-none m-0 shadow-inner">
                                    {[
                                        "Approved by all parties (oral, written, or implied)",
                                        "Each party's rights can be identified",
                                        "Payment terms can be identified",
                                        "The contract has commercial substance",
                                        "Collection of consideration is probable"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <ClipboardCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 flex gap-4">
                                    <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted-foreground m-0">
                                        <strong className="text-foreground italic">Collectability:</strong> You only look at the customer&apos;s <strong className="text-foreground">ability and intention</strong> to pay. If it&apos;s not probable, you don&apos;t have a contract under IFRS 15.
                                    </p>
                                </div>
                            </section>

                            {/* Step 2 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">2</span>
                                    Identify the Performance Obligations (POs)
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A PO is a promise to transfer a good or service. The key is determining if the goods/services are <strong className="text-foreground">Distinct</strong>.
                                </p>
                                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                                    <h4 className="font-bold text-foreground mb-4">Criteria for a Distinct PO:</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-accent font-bold text-xs uppercase tracking-wider">A) Capability</div>
                                            <p className="text-sm text-muted-foreground">Customer can benefit from the good/service on its own or with other readily available resources.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-accent font-bold text-xs uppercase tracking-wider">B) Separately Identifiable</div>
                                            <p className="text-sm text-muted-foreground">The promise to transfer is distinct from other promises in the contract (not highly integrated or complexly interdependent).</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                                        <strong className="text-foreground">Common Example:</strong> A laptop (PO 1) and a 1-year software license (PO 2). They are distinct because the customer can use the laptop without the specific software and vice versa.
                                    </p>
                                </div>
                            </section>

                            {/* Step 3 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">3</span>
                                    Determine the Transaction Price
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This is the amount the entity expects to be entitled to receive. It&apos;s not always just a flat fee. You must consider:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
                                    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
                                        <DollarSign className="w-5 h-5 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground">Variable Consideration:</strong> Rebates, discounts, performance bonuses.</span>
                                    </div>
                                    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
                                        <Calculator className="w-5 h-5 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground">Significant Financing:</strong> If payment is delayed by &gt;1 year.</span>
                                    </div>
                                    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
                                        <Split className="w-5 h-5 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground">Non-cash Consideration:</strong> Measured at fair value.</span>
                                    </div>
                                    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
                                        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
                                        <span><strong className="text-foreground">Consideration Payable:</strong> Payments made TO the customer.</span>
                                    </div>
                                </div>
                            </section>

                            {/* Step 4 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">4</span>
                                    Allocate Transaction Price to POs
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If a contract has multiple POs, you must split the total price between them based on their <strong className="text-foreground">Relative Stand-Alone Selling Prices (SASP)</strong>.
                                </p>
                                <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                                    <div className="p-4 bg-accent/20 border-b border-border">
                                        <h4 className="font-bold text-accent text-xs uppercase tracking-widest text-center m-0">Allocation Example</h4>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs text-muted-foreground mb-4 italic">Total Bundle Price charged: R1,200</p>
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="border-b border-border text-muted-foreground uppercase">
                                                    <th className="pb-2">PO Item</th>
                                                    <th className="pb-2 text-right">SASP</th>
                                                    <th className="pb-2 text-right">Calculation</th>
                                                    <th className="pb-2 text-right">Allocation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                <tr className="border-b border-white/5">
                                                    <td className="py-3">Handset</td>
                                                    <td className="py-3 text-right">R1,000</td>
                                                    <td className="py-3 text-right">10/15 x 1200</td>
                                                    <td className="py-3 text-right font-bold text-accent">R800</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3">Service</td>
                                                    <td className="py-3 text-right">R500</td>
                                                    <td className="py-3 text-right">5/15 x 1200</td>
                                                    <td className="py-3 text-right font-bold text-accent">R400</td>
                                                </tr>
                                                <tr className="border-t border-accent/30 bg-muted font-bold">
                                                    <td className="py-3">TOTAL</td>
                                                    <td className="py-3 text-right">R1,500</td>
                                                    <td className="py-3 text-right">-</td>
                                                    <td className="py-3 text-right">R1,200</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Step 5 */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">5</span>
                                    Recognize Revenue
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Revenue is recognized when (or as) the entity <strong className="text-foreground text-lg">satisfies</strong> a PO by transferring control of the good or service.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Unlock className="w-5 h-5 text-accent" />
                                            Over Time
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">Recognize revenue as work progresses if ANY of these apply:</p>
                                        <ul className="text-xs text-muted-foreground space-y-2 list-disc ml-4">
                                            <li>Customer simultaneously consumes benefit (e.g., cleaning service)</li>
                                            <li>Entity creates/enhances asset customer controls</li>
                                            <li>Asset has no alternative use AND entity has right to payment for work done</li>
                                        </ul>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-accent" />
                                            Point in Time
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">If it doesn&apos;t meet &apos;Over Time&apos; criteria. Look for indicators of control transfer:</p>
                                        <ul className="text-xs text-muted-foreground space-y-2 list-disc ml-4">
                                            <li>Legal title transferred</li>
                                            <li>Physical possession transferred</li>
                                            <li>Customer has significant risks and rewards of ownership</li>
                                            <li>Customer has accepted the asset</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Summary & Next Steps */}
                            <section className="mb-12">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-4 border-t border-border pt-12">
                                    Summary
                                </h2>
                                <div className="bg-accent/10 rounded-xl p-6">
                                    <p className="text-muted-foreground leading-relaxed italic m-0">
                                        The five-step model is a logical chain. If you miss a step or misidentify a PO, your entire revenue recognition will be incorrect. Always work through the steps in order!
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-8 border-t border-border">
                            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Link href="/guides/ifrs-15/part-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Part 1: Foundations
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/guides/ifrs-15/part-3">
                                    Part 3: Variable Consideration
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </article>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
                            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                                Still Struggling with SASP or Control Transfer?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                The five-step model is the &quot;bread and butter&quot; of accounting exams. Book a session to practice complex worked examples.
                            </p>
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book a Coaching Session
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
