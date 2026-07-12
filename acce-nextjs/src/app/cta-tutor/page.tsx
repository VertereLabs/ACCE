import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionFormats from "@/components/SessionFormats";
import ConversionCtas from "@/components/ConversionCtas";
import { BookOpen, Users, Award, HelpCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "CTA Tutor: Certificate in Theory of Accounting | ACCE",
    description: "CTA tutoring across Accounting, Tax, MAF and Auditing. Structured support for the Certificate in Theory of Accounting and the road to CA(SA). Book with ACCE.",
    alternates: {
        canonical: "/cta-tutor/",
    },
    openGraph: {
        title: "CTA Tutor: Certificate in Theory of Accounting | ACCE",
        description: "CTA tutoring across Accounting, Tax, MAF and Auditing. Structured support for the Certificate in Theory of Accounting and the road to CA(SA). Book with ACCE.",
    },
    twitter: {
        title: "CTA Tutor: Certificate in Theory of Accounting | ACCE",
        description: "CTA tutoring across Accounting, Tax, MAF and Auditing. Structured support for the Certificate in Theory of Accounting and the road to CA(SA). Book with ACCE.",
    },
};

const FAQ_ITEMS = [
    {
        question: "What is the CTA and why do students find it so difficult?",
        answer: "The CTA (Certificate in Theory of Accounting, also known as PGDA) is the postgraduate year that bridges an accounting degree to the ITC board exam and ultimately the CA(SA) designation. It covers four high-stakes subjects simultaneously (Accounting, Tax, MAF and Auditing), each at honours level, and demands integration across disciplines in a single sitting. The workload and the integration requirement are what catch most students off guard.",
    },
    {
        question: "Which subjects do you tutor at CTA level?",
        answer: "I tutor all four core CTA subjects: Financial Accounting, Taxation, Management Accounting and Finance (MAF), and Auditing. Sessions can focus on one subject or work across the integration required for the ITC.",
    },
    {
        question: "How does tutoring work at CTA level?",
        answer: "Sessions are available as 1:1 personal sessions or small group sessions, online via video call. We work through your specific problem areas, past exam questions, and integration scenarios. You set the agenda; I bring the structured approach.",
    },
    {
        question: "Do you help with ITC and APC preparation?",
        answer: "Yes. ITC preparation is a large part of what I do at CTA level. That includes integration practice across all four subjects, time management under exam conditions, and targeted work on the areas the ITC has repeatedly tested in recent sittings.",
    },
    {
        question: "What results have your students achieved?",
        answer: "Students I have worked with have gone on to pass the ITC and progress toward the CA(SA). The consistent feedback is that structured sessions helped them stop cramming and start understanding the integration the ITC demands.",
    },
    {
        question: "How do I book a session?",
        answer: "The quickest way is to send a WhatsApp message to +27 71 325 5295. Include your subject area, what you are struggling with, and your availability. I will respond to confirm a time.",
    },
];

const COURSE_DATA = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "CTA Tutoring (Certificate in Theory of Accounting)",
    description:
        "One-on-one and group tutoring for the CTA (PGDA) level, covering Financial Accounting, Taxation, MAF and Auditing, with dedicated ITC and APC board exam preparation.",
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

export default function CtaTutorPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="cta-tutor-jsonld-course" data={COURSE_DATA} />
            <JsonLd id="cta-tutor-jsonld-faq" data={FAQPAGE_DATA} />
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">

                    {/* Hero Header */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                Postgraduate
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                CA(SA) Pathway
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            CTA Tutoring (Certificate in Theory of Accounting)
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            The CTA year is the hardest step on the road to CA(SA). Four honours-level subjects, one integration exam, and a pass rate that humbles even strong students. I have guided PGDA students through exactly this, and I know where the gaps tend to hide.
                        </p>
                        <ConversionCtas
                            bookLabel="Book a CTA Session"
                            guidesHref="/guides"
                        />
                    </div>

                    {/* Section 1: What CTA is and why it is hard */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                What CTA is and why it is hard
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The Certificate in Theory of Accounting (CTA) is the postgraduate diploma year that sits between your undergraduate accounting degree and the SAICA Initial Test of Competence (ITC). In South Africa, it is the gateway to the CA(SA) designation, and it is not easy to pass.
                            </p>
                            <p>
                                Most students underestimate it because it looks like a continuation of third year. It is not. The CTA tests you across all four subjects at the same time, and the ITC at the end of the year asks you to apply them together in a single integrated case study. You cannot compartmentalise. If your Tax knowledge is strong but your MAF is shaky, the ITC will find that gap.
                            </p>
                            <p>
                                The pass rate for the ITC hovers around 50% for first-time writers most years. That is not a number to dismiss. The students who struggle are not weak students. They are students who never had their specific blind spots addressed before exam day. That is exactly what structured tutoring targets.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: The four subjects */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                The four subjects we cover
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            The CTA year covers four core subjects. I tutor all four, and I can work across the integration those subjects demand. Click through to each subject page for more detail on what we focus on in sessions.
                        </p>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed">
                            <li>
                                <Link href="/accounting-tutor" className="text-accent hover:underline font-medium">
                                    Financial Accounting
                                </Link>
                                : IFRS, group statements and the consolidation questions that carry the most marks in the ITC.
                            </li>
                            <li>
                                <Link href="/tax-tutor" className="text-accent hover:underline font-medium">
                                    Taxation
                                </Link>
                                : income tax, VAT and CGT, which thread through almost every ITC scenario.
                            </li>
                            <li>
                                <Link href="/financial-management-tutor" className="text-accent hover:underline font-medium">
                                    Management Accounting and Finance (MAF)
                                </Link>
                                : costing, budgeting and investment appraisal, often where ITC marks are won or lost.
                            </li>
                            <li>
                                <Link href="/auditing-tutor" className="text-accent hover:underline font-medium">
                                    Auditing
                                </Link>
                                : risk assessment, procedures and reporting, applied through professional judgement.
                            </li>
                        </ul>
                        <div className="mt-6 bg-card rounded-xl border border-border p-6">
                            <p className="text-muted-foreground text-sm">
                                Planning to continue after the ITC? The{" "}
                                <Link href="/pgda-tutor" className="text-accent hover:underline">
                                    PGDA tutor page
                                </Link>{" "}
                                covers how the PGDA year connects to the APC and what that pathway looks like for CA(SA) candidates.
                            </p>
                        </div>
                    </div>

                    {/* Section 3: ITC and board exam prep */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                ITC and board exam preparation
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The SAICA ITC is a two-part exam. Paper 1 focuses on Financial Accounting and Tax. Paper 2 covers MAF, Auditing, and integration. Both papers require you to demonstrate competence, not just recall of knowledge.
                            </p>
                            <p>
                                My ITC preparation sessions do a few things specifically. We go through past papers under timed conditions, because many students know the content but have never practised allocating time across a multi-part scenario. We identify the subjects and question types where you are consistently dropping marks. And we work on integration: how to approach a case study that layers Tax implications into an Accounting scenario and asks for an Auditing recommendation.
                            </p>
                            <p>
                                For students writing the APC after passing the ITC, the same principles apply at greater depth. The APC tests ethical reasoning and professional judgement in a comprehensive case. Students who have built strong integration habits during CTA tend to handle the APC better.
                            </p>
                        </div>
                    </div>

                    {/* Section 4: How it works (shared, compact) */}
                    <SessionFormats subjectLabel="CTA" />

                    {/* Section 5: Results and testimonials */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Results and student feedback
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                I am Priyanka, and I have been tutoring accounting students at undergraduate and postgraduate level for several years. Having qualified as a CA(SA) through SAICA, I understand the CTA and ITC from the inside, not just as a teacher.
                            </p>
                            <p>
                                The students I work with consistently say the same things: the sessions helped them understand the structure of exam answers, not just the technical content; and working through integration questions in a guided setting was different from doing past papers alone.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;I was failing my internal assessments in MAF and did not know where to start fixing it. After three sessions, I had a clear picture of where my gaps were and a plan to address them before the ITC.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">CTA student, 2024</span>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;The integration practice sessions were exactly what I needed before the ITC. I had been studying each subject in isolation and Priyanka helped me see how the case study pulls everything together.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">ITC first-time writer, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: FAQ */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Frequently asked questions
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
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                                Ready to get serious about the CTA?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Book a session and we will work out where to focus first.
                            </p>
                            <ConversionCtas
                                bookLabel="Book a Session on WhatsApp"
                                guidesHref="/guides"
                                align="center"
                            />
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
