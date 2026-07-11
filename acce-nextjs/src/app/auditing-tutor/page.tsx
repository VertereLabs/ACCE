import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubjectGuides from "@/components/SubjectGuides";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Monitor, Award, HelpCircle, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "Auditing Tutor for CA(SA) Students | ACCE Tutors",
    description: "Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.",
    alternates: {
        canonical: "/auditing-tutor/",
    },
    openGraph: {
        title: "Auditing Tutor for CA(SA) Students | ACCE Tutors",
        description: "Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.",
    },
    twitter: {
        title: "Auditing Tutor for CA(SA) Students | ACCE Tutors",
        description: "Auditing tutoring for undergrad, PGDA and CTA: ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.",
    },
};

const FAQ_ITEMS = [
    {
        question: "What is the difference between auditing and accounting?",
        answer: "Accounting is about preparing financial information: recording transactions, applying IFRS recognition and measurement rules, and presenting financial statements. Auditing is about providing independent assurance OVER that financial information after someone else has prepared it. An auditor does not draft the financial statements. Instead, the auditor gathers sufficient appropriate audit evidence to form an opinion on whether those statements are free from material misstatement, whether due to error or fraud. This distinction is fundamental under ISA 200, which frames the auditor's objective as obtaining reasonable assurance that the financial statements as a whole do not contain material misstatements. CA(SA) students often confuse the two subjects at undergraduate level, but the ITC and APC both require clarity: a consolidation or IFRS measurement question is Financial Accounting; an assessment of whether management's accounting judgements are well-supported is Auditing.",
    },
    {
        question: "What are the assertions and why do they drive the audit?",
        answer: "The assertions are the implicit or explicit claims that management makes when it presents financial information. Under ISA 315, the assertions for classes of transactions include: occurrence (transactions that have been recorded actually happened), completeness (all transactions that should have been recorded have been), accuracy (amounts have been recorded correctly), cut-off (transactions have been recorded in the correct period), and classification (transactions have been recorded in the correct accounts). The assertions for account balances at the period end include: existence (assets, liabilities and equity interests actually exist), rights and obligations (the entity has the rights to assets and is obliged on liabilities), completeness, accuracy, valuation and allocation (assets, liabilities and equity are at appropriate amounts), and presentation and disclosure. Every audit procedure has to be linkable to at least one assertion. In ITC questions, a common mark-loss is designing a procedure (for example, 'obtain a list of debtors') without identifying which assertion it addresses (completeness? existence? valuation?). I work with students on matching procedures to assertions until the linkage is automatic.",
    },
    {
        question: "How does the audit risk model work and what role does materiality play?",
        answer: "The audit risk model is the engine of audit planning. Under ISA 200 and ISA 315, audit risk is the risk that the auditor expresses an inappropriate audit opinion on materially misstated financial statements. The model sets out: Audit Risk = Inherent Risk x Control Risk x Detection Risk. Inherent risk is the susceptibility of an assertion to misstatement before considering controls. Control risk is the risk that the client's internal controls will not prevent or detect a misstatement. Together they form the risk of material misstatement, which the auditor assesses but cannot control. Detection risk is the risk that the auditor's own procedures will not detect an existing misstatement, and this is the lever the auditor can adjust: when inherent and control risk are high (a complex estimate with weak controls, for example), the auditor must set detection risk LOW, which means performing more audit work (more tests, larger samples, substantive rather than controls-only procedures). Materiality, set under ISA 320, determines the threshold at which a misstatement would influence economic decisions. It directly affects how many errors the auditor is looking for and how much evidence is needed. A smaller materiality threshold means more procedures and larger samples. In ITC planning questions, setting materiality correctly and then using the risk model to justify planned procedures is where a distinction answer separates from an average one.",
    },
    {
        question: "What are the different types of audit opinion and when is each one used?",
        answer: "The audit opinion types are covered by ISA 700 (unmodified opinion), ISA 705 (modified opinions), and ISA 706 (emphasis-of-matter and other-matter paragraphs). An unmodified opinion means the auditor has obtained sufficient appropriate evidence and concluded that the financial statements are free from material misstatement in all material respects. A modified opinion is required when the auditor cannot obtain sufficient appropriate evidence (a scope limitation) or concludes that the financial statements contain a material misstatement. The three modified opinions are: a qualified opinion (the matter is material but not pervasive: 'except for X, the statements are fairly presented'); an adverse opinion (the misstatement is material AND pervasive: 'the statements do not present fairly'); and a disclaimer of opinion (the scope limitation is so significant that the auditor cannot form an opinion at all). An emphasis-of-matter paragraph is added to an unmodified report to draw users' attention to a matter already adequately disclosed, such as a going concern uncertainty. ITC questions often describe a specific scenario (management refuses to write down an overvalued asset; the auditor cannot attend the inventory count) and ask the candidate to determine the correct opinion type and justify it. The key is to apply the materiality-and-pervasiveness test in sequence.",
    },
    {
        question: "How is auditing examined in the ITC compared to the APC?",
        answer: "In the ITC, Auditing is tested as one of the four discrete subject papers alongside Financial Accounting, Management Accounting and Finance, and Taxation. An ITC auditing paper typically includes an internal controls and risk assessment question (identify risks from a scenario and design procedures to address them under ISA 315), an audit procedures question linked to specific assertions (plan evidence-gathering for a cycle such as revenue, payroll, or inventory), an audit evidence or sampling scenario (evaluate the sufficiency and appropriateness of proposed procedures), and an audit report question (determine the correct opinion type given a described circumstance and draft the appropriate modification). The questions are structured and reward a visible framework: assertion named, procedure justified, risk model applied, opinion type determined with reasoning. In the APC, auditing is not a standalone paper. The integrated case study is a multidisciplinary business scenario, and auditing threads through it as a lens: governance and internal control weaknesses relevant to a business acquisition, the audit implications of a going concern risk flagged in the strategy section, or the independence considerations when the auditor is advising on the same transaction they will audit. APC candidates need to identify auditing dimensions in business problems and apply professional scepticism in a written advisory register, not just recall ISA numbers. The preparation style is genuinely different, and I prepare students for both.",
    },
    {
        question: "What does the IRBA do and why does independence matter?",
        answer: "IRBA stands for the Independent Regulatory Board for Auditors, the South African statutory body established under the Auditing Profession Act 26 of 2005. IRBA registers registered auditors (RAs) and candidate auditors (CAs), sets the continuing professional development requirements, investigates and sanctions members for misconduct, and issues the South African Auditing Practice Statements (SAAPSs) that supplement the ISAs in the South African context. Auditor independence is central to the value of an audit: if the auditor has a financial, business, employment, or personal relationship with the client that impairs objectivity, the assurance opinion is worthless. Under the SAICA/IRBA Code of Professional Conduct (which adopts the IESBA Code and adds South African-specific requirements), independence threats (self-interest, self-review, advocacy, familiarity, and intimidation) must be identified and either eliminated or reduced to an acceptable level through safeguards. King IV on corporate governance reinforces this: the audit committee, composed of independent non-executive directors, oversees the external auditor's independence and approves permitted non-audit services. ITC and APC questions test the candidate's ability to identify a specific independence threat, name the relevant threat type, and evaluate whether the safeguard proposed is sufficient to address it.",
    },
    {
        question: "How do I book an auditing tutoring session?",
        answer: "Send a WhatsApp message to +27 71 325 5295. Let me know where you are in your studies (undergraduate auditing module, PGDA year, or CTA/APC level), which aspect of auditing is causing you difficulty (risk assessment and planning, assertions and procedures, opinion types, or ethics and independence), and whether you want a 1:1 or small group session. I will confirm availability and we will schedule a time.",
    },
];

const SERVICE_DATA = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Auditing Tutoring",
    serviceType: "Academic Tutoring",
    description:
        "One-on-one and group tutoring for Auditing on the CA(SA) pathway: ISA framework, the audit process and phases, assertions, audit risk model, materiality, audit evidence and sampling, audit opinion types, ethics and independence under the SAICA/IRBA Code, and King IV governance. For undergraduate, PGDA and CTA students preparing for the ITC and APC.",
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

export default function AuditingTutorPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="auditing-tutor-jsonld-service" data={SERVICE_DATA} />
            <JsonLd id="auditing-tutor-jsonld-faq" data={FAQPAGE_DATA} />
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">

                    {/* Hero Header */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                Auditing Subject
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                Undergrad to CTA and APC
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Auditing Tutoring
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            Auditing is the subject on the CA(SA) pathway that teaches you to provide independent assurance over financial information that someone else has prepared. An auditor does not draft financial statements. Instead, an auditor gathers evidence to express an opinion on whether those statements are free from material misstatement. That framing shapes everything from how you plan procedures to how you decide whether an opinion needs to be modified. Whether you are working through undergraduate auditing modules, navigating the PGDA year, or building towards the ITC and APC, I help you understand the ISAs, apply the audit risk model, and answer questions at exam level.
                        </p>
                        <Button asChild variant="hero">
                            <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                Book an Auditing Session
                            </a>
                        </Button>
                    </div>

                    {/* Section 1: What we cover */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                What we cover: ISAs, the audit process, assertions and reporting
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The International Standards on Auditing form the technical foundation of the subject. ISA 200 establishes the overall objective of the auditor: to obtain reasonable assurance that the financial statements as a whole are free from material misstatement, whether due to error or fraud, and to issue a report communicating the opinion. Reasonable assurance is high but not absolute, which means the auditor does not guarantee that the statements are correct, but does provide meaningful assurance. That nuance is tested directly in both the ITC and the APC.
                            </p>
                            <p>
                                The audit process moves through distinct phases. The engagement begins with client acceptance and continuance, where the auditor assesses whether to accept or continue an engagement, considers independence threats under the SAICA and IRBA Code of Professional Conduct, and agrees the terms of engagement under ISA 210. Planning under ISA 300 follows: the auditor sets overall materiality and performance materiality under ISA 320, develops an understanding of the entity and its environment under ISA 315, and identifies the risks of material misstatement at both the financial statement level and the assertion level. ISA 240 governs the auditor's responsibilities relating to fraud: the auditor must maintain professional scepticism, presume that revenue recognition is a fraud risk, and respond to identified risks with procedures specifically designed to address them.
                            </p>
                            <p>
                                Internal controls are assessed under ISA 315 and ISA 330. Where controls are well-designed and implemented, the auditor may choose to test those controls to reduce detection risk and rely on them for substantive purposes. Where controls are absent or weak, the auditor responds with a wholly substantive approach. ISA 330 requires the auditor's planned responses to be directly linked to the assessed risks and the affected assertions. Audit evidence, governed by ISA 500, must be both sufficient (the quantity) and appropriate (the quality: relevance and reliability). The nature, timing and extent of procedures determines whether evidence is adequate. Audit sampling under ISA 530 allows the auditor to draw conclusions about a population from a sample, applying statistical or non-statistical methods depending on the risk level and the size of the population.
                            </p>
                            <p>
                                The audit concludes with the completion and reporting phase. The auditor performs procedures for subsequent events under ISA 560, evaluates whether the going concern basis is appropriate under ISA 570, and obtains written representations under ISA 580 as one form of evidence (though not as a substitute for other procedures). The audit report under ISA 700 communicates the opinion. Where the auditor cannot obtain sufficient appropriate evidence or concludes that the financial statements are materially misstated, ISA 705 requires a modified opinion: a qualified opinion where the matter is material but not pervasive, an adverse opinion where the misstatement is pervasive, or a disclaimer of opinion where the scope limitation is so severe that the auditor cannot form a view at all. Key audit matters, communicated under ISA 701 for listed entities, describe the most significant judgements in the audit.
                            </p>
                            <p>
                                Ethics and independence run through the entire engagement. The SAICA and IRBA Code of Professional Conduct adopts the IESBA Code and layers additional South African requirements from IRBA. The Code identifies five fundamental principles (integrity, objectivity, professional competence and due care, confidentiality, and professional behaviour) and requires auditors to identify threats to those principles, evaluate their significance, and apply safeguards to eliminate or reduce threats to an acceptable level. King IV on corporate governance addresses auditor oversight at the entity level: the audit committee monitors the external auditor's independence, approves permitted non-audit services, and assesses audit quality.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Who it's for */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Who it is for: undergraduate, PGDA and CTA students
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    Undergraduate Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Undergraduate auditing modules at UNISA (AUE2601, AUI3702), UCT, Wits, UP, and Stellenbosch introduce the audit process, the assertions, internal controls, and basic audit reporting. Many students encounter auditing for the first time here and find the subject unfamiliar: unlike Financial Accounting, there is no formula to balance, only a framework to apply to a scenario. Sessions focus on building the conceptual clarity that makes procedure design and opinion selection instinctive.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    PGDA Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    The PGDA year tests Auditing at SAICA CTA level alongside Financial Accounting, MAF, and Taxation. Internal assessments and mock-ITC papers require integrated auditing responses: risk assessment from a business scenario, assertions-linked procedures, evaluation of internal control weaknesses, and the correct opinion type with justification. Sessions address the areas where marks cluster: linking procedures to specific assertions, applying the audit risk model to complex scenarios, and drafting modified audit report paragraphs correctly.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    CTA and APC Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    At CTA level, the ITC tests Auditing as a discrete paper where planning, evidence, and reporting questions need exam-technique precision. For APC candidates, auditing appears as a dimension of the integrated case: governance weaknesses, internal control findings, going concern risks, and independence considerations all thread through the business scenario. I prepare CTA candidates for both the structured ITC paper and the applied, advisory APC register.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether you are building audit foundations at undergraduate level, consolidating the full auditing syllabus during your PGDA year, or preparing for the ITC and APC, sessions are matched to your level and your exam target.
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
                                All sessions run online via video call with screen sharing, which makes auditing tutoring available to students at any South African university regardless of campus or study mode. UNISA distance-learning students, part-time PGDA candidates, and full-time CTA students all access sessions the same way.
                            </p>
                            <p>
                                Sessions are available as 1:1 personal sessions or small group sessions. In 1:1 sessions, the focus is your specific gap: the audit risk model applied to a complex scenario, the assertions you cannot distinguish under time pressure, or the modified opinion logic that keeps tripping you. In small group sessions (two to four students), working through a full ITC-style auditing question together and then comparing answer structures is an effective format for PGDA candidates preparing for internal assessments.
                            </p>
                            <p>
                                The biggest challenge in auditing at ITC level is speed and precision: a complex risk assessment question in an exam requires you to identify risks, match them to assertions, design appropriately targeted procedures, and set the correct detection risk level, all under time pressure. That kind of fluency is built through practice with feedback, not from reading the ISAs alone. Sessions are structured around working through realistic scenarios, identifying the markers' scoring approach, and building the habits that produce marks in an exam.
                            </p>
                        </div>
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                            <p className="text-foreground font-medium mb-4">
                                Ready to work on Auditing? Send a WhatsApp and we will set up a session.
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
                                Why ACCE: the CA(SA) pathway, ISAs from first principles, real exam results
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                I am Priyanka. I completed the full CA(SA) qualifying pathway through SAICA, which means I sat the ITC (where Auditing is one of the four papers) and the APC (where auditing and governance considerations thread through the integrated case study). That experience shapes how I tutor: I can tell you not just what ISA 315 says about risk identification, but what the ITC examiner expects in a risk assessment answer and what separates a response that picks up 80% of the available marks from one that picks up 40%.
                            </p>
                            <p>
                                One thing I consistently see is students treating auditing as a memorisation subject: learn the ISAs, recall definitions in the exam. That approach gets you a pass at undergraduate level but breaks down in the ITC and APC, where questions are scenario-driven. A well-designed ISA 315 question will describe a client with a newly implemented ERP system, a revenue recognition policy change, and a shortage of qualified accounting staff, and ask you to identify the risks of material misstatement and explain how you would respond under ISA 330. You cannot memorise your way to full marks on that question. You need to understand the audit risk model deeply enough to apply it to a scenario you have not seen before.
                            </p>
                            <p>
                                For APC candidates, the auditing dimension is often the part of the integrated case they feel least prepared for, because the APC does not ask you to list procedures. It asks you to identify governance risks, evaluate internal control environments, consider going concern indicators, or assess whether the auditor's independence is threatened by a specific proposed arrangement, and to do all of that as a professional adviser, not as a technician recalling standards. I prepare APC candidates explicitly for that applied register.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;I kept designing audit procedures without linking them to specific assertions, and I was losing marks every time. Priyanka worked through the assertions framework with me until matching a procedure to an assertion was automatic. My ITC auditing paper score improved by a full grade after two months of sessions.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">PGDA student, 2024</span>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;The APC case study had a governance section that required me to identify audit independence threats and advise the audit committee. I had never practised auditing in that advisory format. Priyanka prepared me for it specifically, and I felt genuinely ready when I sat the exam.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">APC candidate, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: CTA + related pages */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                How to get started and where auditing fits in the CA(SA) pathway
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                Auditing is examined in the ITC as a standalone paper (alongside Financial Accounting, Management Accounting and Finance, and Taxation) and is woven through the APC integrated case study as a governance and assurance lens. This means auditing appears at both the technical recall level (ITC: procedures, assertions, opinion types) and the applied advisory level (APC: identifying audit implications of business decisions, evaluating internal control environments, assessing independence threats). Sessions are structured to address the right level for where you are in your studies.
                            </p>
                            <p>
                                Sessions are available per session or in blocks, with scheduling built around lectures, PGDA internal assessments, and the ITC exam calendar. Group sessions work well for PGDA cohorts preparing for the same internal assessment or mock-ITC paper. Per-session and block rates are confirmed directly when you reach out, matched to your frequency and level.
                            </p>
                            <p>
                                If you are not sure which aspect of auditing to focus on first, send a WhatsApp describing where you are in your studies and what you are finding difficult. I will give you a candid view of what a session can address.
                            </p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-6 mb-6">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                For context on how Auditing fits alongside the other three CTA subjects, see the{" "}
                                <Link href="/cta-tutor" className="text-accent hover:underline">
                                    CTA tutor overview
                                </Link>{" "}
                                and the{" "}
                                <Link href="/pgda-tutor" className="text-accent hover:underline">
                                    PGDA tutor page
                                </Link>
                                . For the full subject list and where Auditing sits in the curriculum, visit the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">
                                    subjects page
                                </Link>
                                .
                            </p>
                        </div>
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                            <p className="text-foreground font-medium mb-4">
                                Book a session and we will work through whichever part of the auditing syllabus is costing you marks.
                            </p>
                            <Button asChild variant="hero">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Book on WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Study guides for this subject */}
                    <div className="mb-16">
                        <SubjectGuides subject="auditing" subjectLabel="Auditing" />
                    </div>

                    {/* Section 6: FAQ */}
                    <div className="max-w-4xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Frequently asked questions about auditing tutoring
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
                                Ready to get serious about Auditing?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Whether it is the audit risk model, assertions and procedures, modified opinion types, ethics and independence under the SAICA/IRBA Code, or APC governance advisory, book a session and we will work on it together.
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
