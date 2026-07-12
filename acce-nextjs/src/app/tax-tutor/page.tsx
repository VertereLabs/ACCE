import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubjectGuides from "@/components/SubjectGuides";
import SessionFormats from "@/components/SessionFormats";
import ConversionCtas from "@/components/ConversionCtas";
import { getGuidesForSubject } from "@/config/guides";
import { BookOpen, Users, Award, HelpCircle, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "Tax Tutor: Taxation for PGDA & CTA | ACCE Tutors",
    description: "Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.",
    alternates: {
        canonical: "/tax-tutor/",
    },
    openGraph: {
        title: "Tax Tutor: Taxation for PGDA & CTA | ACCE Tutors",
        description: "Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.",
    },
    twitter: {
        title: "Tax Tutor: Taxation for PGDA & CTA | ACCE Tutors",
        description: "Taxation tutoring for CA(SA) students: Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.",
    },
};

const FAQ_ITEMS = [
    {
        question: "What is the general deduction formula and why does it matter so much?",
        answer: "The general deduction formula is the backbone of South African income tax. Section 11(a) of the Income Tax Act No. 58 of 1962 permits a deduction for expenditure and losses actually incurred in the production of income, provided the expenditure is not of a capital nature. The formula analysis asks four questions in sequence: was there expenditure or a loss? was it actually incurred? was it in the production of income (the trade nexus)? and is it capital or revenue in nature? Students typically lose marks by skipping the framework or misclassifying capital versus revenue items. In ITC questions, a well-structured formula analysis showing each limb earns marks even if you reach the wrong final answer, whereas a one-line conclusion earns nothing. I make sure students can apply the formula to unfamiliar fact patterns, not just recall the definition.",
    },
    {
        question: "How does provisional tax work and when do I need to pay it?",
        answer: "Provisional tax is a mechanism under the Fourth Schedule to the Income Tax Act that requires taxpayers who earn income other than remuneration (salary) to pay tax in advance during the tax year. A provisional taxpayer makes two compulsory payments: the first payment is due six months into the tax year (31 August for February year-end individuals) and must be at least 50% of the estimated tax liability; the second payment is due at the end of the tax year (28/29 February) and must bring the total provisional payments to at least 90% of the actual liability to avoid a penalty. A voluntary third payment can be made six months after the tax year-end to top up and reduce interest. The key exam trap is confusing provisional tax with final tax: provisional payments are credits against the normal tax assessed when SARS issues the assessment. For CA(SA) students, the ITC tests provisional tax calculations as a stand-alone question and as part of integrated income tax scenarios.",
    },
    {
        question: "What is the difference between zero-rated and exempt supplies for VAT?",
        answer: "Both zero-rated and exempt supplies fall outside the standard 15% VAT rate in South Africa, but they have completely different consequences. A zero-rated supply is still a taxable supply under the VAT Act, Act 89 of 1991, but the tax charged is 0%. Because it is a taxable supply, the vendor can claim input tax credits on costs related to making zero-rated supplies. Basic food items (brown bread, maize meal, fresh vegetables, fresh fruit, dried beans, lentils, eggs, milk, unprocessed cereals and legumes), petrol, diesel, paraffin, and exports are the main zero-rated categories. An exempt supply is not a taxable supply at all: no VAT is charged on the output, and no input tax may be claimed on related costs. Financial services, residential accommodation in a dwelling, and educational services are the common exempt categories. The exam trap is claiming input tax on costs related to exempt supplies: that is not permitted. I work through the distinction using real examples from ITC past papers.",
    },
    {
        question: "How does Capital Gains Tax work under the Eighth Schedule?",
        answer: "Capital Gains Tax in South Africa is governed by the Eighth Schedule to the Income Tax Act and applies to capital gains realised on the disposal of assets. The key steps are: identify the disposal event (sale, donation, death, deemed disposal); determine the proceeds received or accrued; subtract the base cost (what was paid for the asset plus allowable costs of improvement and disposal); arrive at the capital gain or capital loss; apply the annual exclusion for individuals (R40 000 for most disposals, R300 000 in the year of death); multiply the net capital gain by the inclusion rate (40% for individuals, 80% for companies) to get the taxable capital gain; then that taxable capital gain is included in taxable income and taxed at the taxpayer's marginal rate. The common exam challenges are correctly identifying the base cost (especially for assets held before the CGT commencement date of 1 October 2001, which requires the valuation date method or the 20% rule or the time-apportionment method) and applying the primary residence exclusion correctly. For companies, the 80% inclusion rate combined with the 28% (now 27%) corporate tax rate effectively taxes capital gains at around 22.4%.",
    },
    {
        question: "Is taxation tested in the ITC and in the APC, and how do they differ?",
        answer: "Yes, taxation appears in both. In the ITC, taxation is tested as a discrete subject paper alongside Financial Accounting, Management Accounting and Finance, and Auditing. An ITC tax paper typically includes a normal tax computation for an individual (income from employment, fringe benefits, allowances, rental income, business income, provisional tax credits, medical tax credits, retirement fund deductions), a company tax scenario, a VAT question, and sometimes CGT or estate duty. The questions are structured and test technical accuracy: applying the correct section, getting the formula sequence right, and knowing which items are included or excluded. In the APC, taxation is not a standalone paper. Instead, tax considerations appear throughout the integrated case study: a business decision might have normal tax, dividends tax, and CGT implications that you need to identify and advise on, often alongside an audit or financial reporting angle. APC candidates need to think about tax as a dimension of business decisions, not just as a calculation subject. The preparation approach differs significantly between the two exams, and I prepare students for both explicitly.",
    },
    {
        question: "How do I book a taxation tutoring session?",
        answer: "Send a WhatsApp message to +27 71 325 5295. Let me know where you are in your studies (undergrad tax module, PGDA taxation year, or CTA/APC level), which topic is causing you difficulty, and whether you prefer a 1:1 session or a small group. I will confirm availability and we will set up a session.",
    },
];

const SERVICE_DATA = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Taxation Tutoring",
    serviceType: "Academic Tutoring",
    description:
        "One-on-one and group tutoring for Taxation on the CA(SA) pathway: Income Tax Act framework, individual and corporate tax, VAT, Capital Gains Tax, estate duty, and exam technique for the ITC and APC. For undergraduate, PGDA and CTA students.",
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

export default function TaxTutorPage() {
    const guidesHref = getGuidesForSubject("tax").length > 0 ? "#guides" : "/guides";

    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="tax-tutor-jsonld-service" data={SERVICE_DATA} />
            <JsonLd id="tax-tutor-jsonld-faq" data={FAQPAGE_DATA} />
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">

                    {/* Hero Header */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                Taxation Subject
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                Undergrad to CTA & APC
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Taxation Tutoring for PGDA & CTA
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            Taxation is one of the four core subjects on the CA(SA) pathway and one of the areas where students most often lose marks to formula-sequence errors and misclassified items rather than a lack of understanding. Whether you are working through undergraduate tax modules, preparing for the PGDA internal assessments, or building towards the ITC and APC, I help you understand the Acts, apply the correct framework, and answer questions at exam level.
                        </p>
                        <ConversionCtas
                            bookLabel="Book a Tax Session"
                            guidesHref={guidesHref}
                        />
                    </div>

                    {/* Section 1: What we cover */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                What we cover: Income Tax Act, corporate tax, VAT, estate duty and CGT
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Taxation on the CA(SA) pathway is taught primarily through the Income Tax Act No. 58 of 1962 and the VAT Act, Act 89 of 1991. The core of the income tax syllabus is the general deduction formula under section 11(a): gross income, special inclusions, exempt income, and the deductions framework. Students need to work through this sequence consistently, because ITC questions reward a visible formula analysis even when the final answer is wrong.
                            </p>
                            <p>
                                Individual taxation builds on the gross income definition by adding employment-specific rules: fringe benefits (the use of motor vehicle, meals and refreshments, low-interest loans, residential accommodation), retirement fund contribution deductions, medical tax credits and qualifying medical expenses, and the interaction between employment income and provisional tax obligations. These items appear in almost every ITC individual tax scenario, and the exam traps are specific: getting the travel allowance business-use apportionment wrong, applying the wrong medical credit formula, or misclassifying a retirement annuity versus a pension fund contribution.
                            </p>
                            <p>
                                Corporate tax covers the taxable income of companies (gross income, allowable deductions, capital allowances under sections 11(e) and 12C/12E), dividends tax under section 64E and the withholding mechanism, assessed losses and the carry-forward rules, and close corporation provisions at undergraduate level. At CTA level, company tax integrates with transfer pricing, the secondary adjustments rule, and thin capitalisation concepts.
                            </p>
                            <p>
                                VAT under the VAT Act distinguishes output tax (charged on taxable supplies), input tax (claimable on costs relating to taxable supplies), zero-rated supplies, and exempt supplies. The registration threshold, the tax period, and the implications of mixed (taxable and exempt) supplies on input tax apportionment are the areas where marks cluster in ITC questions.
                            </p>
                            <p>
                                Capital Gains Tax under the Eighth Schedule applies the disposal, proceeds, base cost, exclusion, and inclusion-rate sequence. For individuals the annual exclusion and primary residence exclusion are the main adjustments; for companies the 80% inclusion rate applies. Estate duty under the Estate Duty Act levies duty on the dutiable amount of the estate after applying the section 4A abatement (R3.5 million) and deductions for bequests to a surviving spouse, donations tax exemptions, and the value of assets passing to PBOs.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Who it's for */}
                    <div className="max-w-4xl mx-auto mb-16">
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
                                    Undergraduate tax modules at UNISA (TAX2601, TAX3701), UCT, Wits, UP, and Stellenbosch introduce the Income Tax Act framework, individual tax, basic company tax, and VAT. Sessions focus on building the formula-sequence habits that prevent mark-loss in later exams. I work with students on module-specific content including UNISA assignment preparation and semester-test revision.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    PGDA Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    The PGDA (Postgraduate Diploma in Accounting) year tests Taxation at SAICA CTA level alongside Financial Accounting, MAF, and Auditing. Internal assessments and mock-ITC papers integrate multiple tax areas in a single question. Sessions address the high-mark areas: the full individual tax computation, the deduction formula applied to complex fact patterns, CGT, and VAT input tax apportionment.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    CTA and APC Students
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    At CTA level, the ITC tests Taxation as a discrete paper with a full individual or company computation plus VAT and CGT. For APC candidates, tax appears as a dimension of the integrated case study: the CGT consequences of a disposal, the VAT status of a new service, the tax effect of a restructuring. I prepare CTA candidates for both the technical ITC paper and the applied APC context.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether you are building tax foundations at undergraduate level, consolidating the full taxation syllabus in your PGDA year, or preparing for the ITC and APC, sessions are structured around your level and your exam target.
                        </p>
                    </div>

                    {/* Section 3: How sessions work (shared, compact) */}
                    <SessionFormats subjectLabel="Taxation" />

                    {/* Section 4: Why ACCE */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Why ACCE: the CA(SA) pathway, taxation from the Acts, real exam results
                            </h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            <p>
                                I am Priyanka, a CA(SA) qualified through SAICA. I have worked through the same taxation syllabus, sat the ITC (where Taxation appears alongside Financial Accounting, MAF, and Auditing), and navigated the APC (where tax consequences thread through the integrated business case). That firsthand experience shapes how I tutor: I can tell you not just what section 11(a) says, but where the ITC marker is looking for the formula structure and what separates a distinction answer from an average one.
                            </p>
                            <p>
                                One thing I emphasise in taxation tutoring is working from the Acts. Students who learn tax as a series of rules to memorise struggle with unfamiliar fact patterns in the ITC. Students who understand why the Income Tax Act draws the line between capital and revenue in the way it does, or why the VAT Act treats zero-rated and exempt supplies differently, can reason through questions they have not seen before. That is the standard the ITC and APC require, and it is what I build towards.
                            </p>
                            <p>
                                For APC candidates specifically, the tax angle is often the part of the integrated case they feel least prepared for, because the APC does not ask for a memorised formula: it asks you to identify which tax considerations are relevant to a business decision and advise accordingly. I prepare APC candidates for that applied, advisory register, not just technical recall.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;I kept getting the fringe benefit calculations wrong because I was applying the motor vehicle formula incorrectly. Priyanka showed me how to read the SARS table properly and work through the business-use apportionment step by step. I stopped losing those marks in the practice papers after two sessions.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">PGDA student, 2024</span>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    &ldquo;The APC case study had a disposal with both CGT and income tax consequences that I could not untangle under time pressure. Priyanka walked me through the Eighth Schedule sequence and how to present the tax advice in the advisory format the APC expects. That preparation changed how I approached the exam.&rdquo;
                                </p>
                                <span className="text-accent text-sm font-medium">APC candidate, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Where this subject fits on the pathway (internal links) */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Where Taxation fits on the CA(SA) pathway
                            </h2>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-6">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                For context on how Taxation fits alongside the other three CTA subjects, see the{" "}
                                <Link href="/cta-tutor" className="text-accent hover:underline">
                                    CTA tutor overview
                                </Link>{" "}
                                and the{" "}
                                <Link href="/pgda-tutor" className="text-accent hover:underline">
                                    PGDA tutor page
                                </Link>
                                . For the full subject list and where Taxation sits in the curriculum, visit the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">
                                    subjects page
                                </Link>
                                .
                            </p>
                        </div>
                    </div>

                    {/* Study guides for this subject */}
                    <div className="mb-16">
                        <SubjectGuides subject="tax" subjectLabel="Taxation" />
                    </div>

                    {/* Section 6: FAQ */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                Frequently asked questions about taxation tutoring
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
                                Ready to get serious about Taxation?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Whether it is the general deduction formula, fringe benefits, VAT input tax, CGT under the Eighth Schedule, or APC case-study tax advice, book a session and we will work on it together.
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
