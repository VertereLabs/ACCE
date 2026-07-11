import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Monitor, Award, HelpCircle, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "Financial Management & Management Accounting Tutor | ACCE",
    description: "Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA: costing, budgeting, decision-making and finance. Book with ACCE Tutors.",
    alternates: {
        canonical: "/financial-management-tutor/",
    },
    openGraph: {
        title: "Financial Management & Management Accounting Tutor | ACCE",
        description: "Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA: costing, budgeting, decision-making and finance. Book with ACCE Tutors.",
    },
    twitter: {
        title: "Financial Management & Management Accounting Tutor | ACCE",
        description: "Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA: costing, budgeting, decision-making and finance. Book with ACCE Tutors.",
    },
};

const FAQ_ITEMS = [
    {
        question: "Is management accounting the same as financial management?",
        answer: "In South African CA(SA) studies, they are two names for one subject. At undergraduate level, many universities split these into two separate modules: a management accounting module covering costing methods, budgets, and variance analysis, and a financial management module covering capital budgeting, cost of capital, and working capital. At CTA (PGDA) level, SAICA combines them into one subject called MAF (Management Accounting and Finance). So if you are searching for a management accounting tutor or a financial management tutor on the CA(SA) pathway, you are looking for MAF support.",
    },
    {
        question: "Which costing methods do you cover in MAF tutoring?",
        answer: "I cover all the costing methods that appear in SAICA assessments and the ITC: absorption costing and marginal (variable) costing, including the reconciliation between the two profit figures; activity-based costing (ABC), where the focus is identifying cost drivers and allocating overheads more accurately than blanket rates; standard costing and variance analysis (material price and usage, labour rate and efficiency, fixed overhead volume and expenditure); and process costing and job costing. At CTA level, questions combine costing methods with relevant-cost decision scenarios, so we also practise differentiating between relevant and sunk costs in make-or-buy, accept-or-reject, and limiting-factor problems.",
    },
    {
        question: "How does MAF feature in the APC compared to the ITC?",
        answer: "This is one of the most useful things to understand if you are preparing for the APC. In the ITC, MAF appears as a technical subject paper alongside Financial Accounting, Tax, and Auditing. The ITC tests your knowledge of costing methods, variance analysis, and financial management calculations. In the APC, the entire exam is one integrated case study and MAF appears through the management-decision-making lens: you might be asked to advise on a capital investment decision using NPV and IRR, evaluate a make-or-buy choice using relevant costing, or assess the impact of a pricing decision on contribution margin. The APC rewards candidates who can apply MAF thinking to a complex business scenario, not just reproduce a standard costing schedule. This applied, decision-focused angle is what I prepare APC candidates for specifically.",
    },
    {
        question: "I struggle with NPV and IRR calculations. Can you help?",
        answer: "Yes. Net present value and internal rate of return are high-mark areas in both the ITC and APC, and they catch a lot of students who understand the concept but make errors under exam pressure. The common failure points I see are: not identifying the correct discount rate (pre-tax vs post-tax, WACC vs project-specific risk adjustment), forgetting to include working capital movements and terminal recovery, treating initial investment and tax-depreciation shields correctly, and interpolating IRR when the exact rate is not given. I work through these systematically, starting from the cash-flow identification step and building up to full NPV and IRR answers in exam format.",
    },
    {
        question: "What does MAF tutoring cover at undergraduate level?",
        answer: "At first year level, MAF tutoring usually means the introduction to management accounting: cost classification, cost-volume-profit analysis and break-even, absorption vs marginal costing, and basic budgeting. Second year adds standard costing and variance analysis, activity-based costing, and more complex budgeting including the master budget and flexible budgets. Third year introduces financial management concepts: time value of money, net present value and payback, cost of capital, and working capital management. I work with students from UNISA (MNG2601, MNG3701, MNG3702 and the relevant FAC/financial management modules), UCT, Wits, UP, and Stellenbosch on the level-specific content.",
    },
    {
        question: "How do I book a MAF tutoring session?",
        answer: "Send a WhatsApp message to +27 71 325 5295. Let me know which level you are at (undergrad/PGDA/CTA or APC), whether you are working on the costing/management accounting side or the financial management/capital budgeting side, and what you are specifically struggling with. I will confirm availability and we will schedule a session.",
    },
];

const SERVICE_DATA = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Management Accounting & Finance Tutoring",
    serviceType: "Academic Tutoring",
    description:
        "One-on-one and group tutoring for Management Accounting and Financial Management (MAF): costing methods, budgeting, variance analysis, decision-making, and corporate finance for undergraduate, PGDA and CTA students on the CA(SA) pathway.",
    areaServed: "South Africa",
    provider: {
        "@id": "https://accetutors.co.za/#organization",
    },
};

const FAQPAGE_DATA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
        },
    })),
};

export default function FinancialManagementTutorPage() {
    return (
        <div className="min-h-screen bg-background">
            <Script
                id="financial-management-tutor-jsonld-service"
                type="application/ld+json"
            >
                {JSON.stringify(SERVICE_DATA)}
            </Script>
            <Script
                id="financial-management-tutor-jsonld-faq"
                type="application/ld+json"
            >
                {JSON.stringify(FAQPAGE_DATA)}
            </Script>
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">

                    {/* Hero Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                MAF Subject
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                Undergrad to CTA & APC
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Management Accounting & Finance Tutoring
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            Whether you are searching for a financial management tutor or a management accounting tutor, you are looking for MAF: the single subject on the CA(SA) pathway that covers costing, budgeting, decision-making and corporate finance. I help MAF students at every level understand the methods, apply them to exam scenarios, and stop losing marks to the same recurring gaps.
                        </p>
                        <Button asChild variant="hero">
                            <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                Book a MAF Session
                            </a>
                        </Button>
                    </div>

                    {/* Section 1: What MAF covers */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                What MAF covers: costing, budgeting, decision-making and financial management
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                MAF (Management Accounting and Finance) is one subject on the PGDA and CTA curriculum, but at undergraduate level it is often taught as two separate modules: management accounting (cost accounting and budgeting) and financial management (corporate finance and capital allocation). Both strands converge into one integrated MAF subject at CTA level, which is why students who studied "management accounting" at university and those who studied "financial management" end up in the same place.
                            </p>
                            <p>
                                The costing and management accounting strand covers: absorption costing and marginal (variable) costing, including the profit reconciliation between the two methods; activity-based costing, where we move beyond blanket overhead rates and assign costs using activity drivers; standard costing and variance analysis across materials, labour, and fixed overheads; process costing and job costing; and the decision-making toolkit, which includes relevant costing, cost-volume-profit and break-even analysis, make-or-buy decisions, limiting-factor analysis, and pricing under full-cost versus marginal-cost approaches.
                            </p>
                            <p>
                                The financial management strand covers: time value of money and discounted cash flow; net present value, internal rate of return, payback, and accounting rate of return as capital budgeting tools; cost of capital and WACC, including the weighted average across equity and debt; capital structure and leverage; working capital management (the cash conversion cycle, debtor and inventory management, short-term financing); business valuation techniques; and an introduction to financial risk and instruments. At CTA level, NPV and IRR questions are common, and the APC tests these in case-study decision scenarios where you advise on capital investment choices under uncertainty.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Who it's for */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Who it is for: undergrad, PGDA, CTA and APC students
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    Undergraduate Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    First, second and third year students at South African universities including UNISA, UCT, Wits, UP, and Stellenbosch. Financial management and management accounting are often two separate undergraduate modules that converge into one subject at CTA. I work with students on both strands, including UNISA module-specific content (MNG2601, MNG3701, MNG3702 and related FAC financial management modules).
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    PGDA Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    The PGDA (Postgraduate Diploma in Accounting, also called CTA) year is where management accounting and financial management merge into the full MAF subject. SAICA internal assessments test both strands together. Sessions focus on the high-mark areas: standard costing variances, decision-making under constraints, NPV/IRR capital budgeting, and WACC calculations.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    CTA and APC Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    At CTA level, the ITC tests MAF alongside Financial Accounting, Tax, and Auditing. For APC candidates, MAF is the decision-making lens on the integrated case study: advising on capital investments, make-or-buy choices, pricing decisions, and contribution margin analysis. The APC angle is distinctly applied, not just technical recall, which requires a different preparation approach.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether you are an undergraduate building cost-accounting foundations, a PGDA student consolidating the full MAF syllabus, a CTA candidate preparing for the ITC, or an APC candidate applying MAF thinking to a case study, sessions adapt to your level and your exam target.
                        </p>
                    </div>

                    {/* Section 3: How sessions work */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Monitor className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                How sessions work: 1:1, group, and online across South Africa
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                All sessions run online via video call with screen sharing, so MAF students anywhere in South Africa can access structured support: whether you are on campus, studying through UNISA, or working full-time while completing the PGDA.
                            </p>
                            <p>
                                Sessions are available as 1:1 personal sessions or small group sessions. In 1:1 sessions we go deep on your specific problem: a standard costing variance you cannot balance, an NPV question where you keep misidentifying the relevant cash flows, or an activity-based costing allocation you cannot get to reconcile. In small group sessions (two to four students) the format suits shared exam prep, such as working through ITC past-paper MAF questions together or unpacking a case-study decision scenario for APC preparation.
                            </p>
                            <p>
                                Many PGDA students book regular MAF sessions from the start of the year and increase frequency approaching the ITC, because both the costing and financial management halves of MAF need sustained practice rather than a last-minute cram. Ad hoc sessions work well for students who are generally on track but want targeted help on one specific concept.
                            </p>
                        </div>
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                            <p className="text-foreground font-medium mb-4">
                                Ready to work on MAF? Send a WhatsApp and we will sort out a time.
                            </p>
                            <Button asChild variant="hero">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    WhatsApp to Book
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Section 4: Why ACCE */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Why ACCE: CA(SA) pathway, MAF from both sides, real exam results
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                I am Priyanka. I completed the full CA(SA) qualifying pathway through SAICA, which means I have worked through the same MAF curriculum, sat the same ITC (where MAF appears alongside the other core subjects), and navigated the APC (where MAF thinking underpins half the decision-making scenarios in the case study). That experience shapes how I tutor: I can tell you not just how the costing method works, but where exam questions hide the traps and what a mark-earning answer looks like versus a technically correct but poorly structured one.
                            </p>
                            <p>
                                One thing that separates MAF tutoring at ACCE from generic tutoring is the APC angle. Most tutoring for management accounting focuses on the ITC: standard costing schedules, variance analysis, NPV computations. But for APC candidates, the relevant question is how management accounting and financial management thinking applies in an integrated business context: which capital investment to recommend, whether to make or buy a component, how to assess a pricing decision given contribution margin and capacity constraints. I prepare students for both, and the approach is different for each.
                            </p>
                            <p>
                                The students I work with consistently report that the sessions helped them understand not just the mechanics but the logic behind the method: why marginal costing gives a different profit figure than absorption, why a positive NPV does not automatically mean the project should proceed, what the limiting factor really means for a production decision. Understanding that logic is what makes the difference between recognising a question type and actually answering it well.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;I could do a standard costing schedule mechanically but I kept getting the variance analysis wrong in exam questions because I was mixing up which variances were favourable versus adverse. Two sessions with Priyanka sorting out the logic, not just the formulas, made a real difference.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">PGDA student, 2024</span>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;The APC case study had a capital investment decision I was not prepared for. Priyanka walked me through how to structure the NPV analysis, handle the tax-depreciation shield, and present a recommendation rather than just a number. That preparation was the difference.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">APC candidate, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Pricing snapshot + CTA */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Pricing and how to get started
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                Sessions are available per session or in blocks, with flexible scheduling to fit around lectures, work, and exam periods. Group sessions split the cost across participants, making regular MAF tutoring accessible for students on a tighter budget. Per-session and block rates are discussed directly when you reach out, matched to your frequency and situation.
                            </p>
                            <p>
                                If you are not sure whether you need the management accounting side, the financial management side, or both, send a WhatsApp describing where you are in your studies and what you are finding difficult. I will give you an honest picture of what a session can cover and whether a 1:1 or group format suits you better.
                            </p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-6 mb-6">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                For context on the full CA(SA) pathway, including how MAF fits alongside Financial Accounting, Tax, and Auditing at CTA level, see the{" "}
                                <Link href="/cta-tutor" className="text-accent hover:underline">
                                    CTA tutor overview
                                </Link>{" "}
                                and the{" "}
                                <Link href="/pgda-tutor" className="text-accent hover:underline">
                                    PGDA tutor page
                                </Link>
                                . For the full subject list and where MAF sits in the curriculum, visit the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">
                                    subjects page
                                </Link>
                                .
                            </p>
                        </div>
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                            <p className="text-foreground font-medium mb-4">
                                Book a session and we will work out whether to start on the costing side or the financial management side.
                            </p>
                            <Button asChild variant="hero">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book on WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Section 6: FAQ */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Frequently asked questions about MAF tutoring
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {FAQ_ITEMS.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-card rounded-xl border border-border p-6"
                                >
                                    <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                        {item.question}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="max-w-4xl">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                                Ready to get serious about MAF?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Whether it is costing methods, variance analysis, NPV, or APC case-study preparation, book a session and we will work on it together.
                            </p>
                            <Button asChild variant="hero">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book a Session on WhatsApp
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
