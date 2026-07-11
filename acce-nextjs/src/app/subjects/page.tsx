import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConversionCtas from "@/components/ConversionCtas";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Monitor, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE",
    description:
        "Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing: for undergrad, PGDA and CTA students.",
    alternates: {
        canonical: "/subjects/",
    },
    openGraph: {
        title: "Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE",
        description:
            "Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing: for undergrad, PGDA and CTA students.",
    },
    twitter: {
        title: "Subjects We Tutor: Accounting, Tax, Audit & FM | ACCE",
        description:
            "Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing: for undergrad, PGDA and CTA students.",
    },
};

const SUBJECTS = [
    {
        name: "Financial Accounting",
        href: "/accounting-tutor",
        blurb:
            "IFRS standards, group statements, and financial instruments from undergrad through CTA level.",
    },
    {
        name: "Taxation",
        href: "/tax-tutor",
        blurb:
            "Income Tax Act, VAT, CGT, and estate duty for individuals, companies, and trusts.",
    },
    {
        name: "Management Accounting & Finance (MAF)",
        href: "/financial-management-tutor",
        blurb:
            "Costing, budgeting, investment appraisal, and financial decision-making for PGDA and CTA.",
    },
    {
        name: "Auditing",
        href: "/auditing-tutor",
        blurb:
            "ISA framework, audit process, assertions, and professional ethics for the ITC and APC.",
    },
];

const QUALIFICATIONS = [
    {
        name: "CTA (Certificate in Theory of Accounting)",
        href: "/cta-tutor",
        blurb:
            "Studying toward the ITC and the CA(SA) designation? This is where CTA students start.",
    },
    {
        name: "PGDA (Postgraduate Diploma in Accounting)",
        href: "/pgda-tutor",
        blurb:
            "Enrolled in the PGDA year, including the UNISA distance route? Start here.",
    },
];

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://accetutors.co.za/",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Subjects",
            item: "https://accetutors.co.za/subjects/",
        },
    ],
};

export default function SubjectsPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="subjects-jsonld-breadcrumb" data={BREADCRUMB_DATA} />
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">

                    {/* Hero Header */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                                CA(SA) Tutoring
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                                Undergrad to CTA
                            </span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Subjects We Tutor
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            I am Priyanka, and this is the single entry point for every subject and qualification ACCE tutors. Whether you are at undergraduate level working through your first Financial Accounting module, midway through a PGDA year at UNISA, or preparing for the CTA and the ITC board exam, you will find the right page from here. I have guided students from UCT, Wits, UJ, UP, and Stellenbosch through these subjects, and the same structured approach works regardless of which institution you are at or which year you are in.
                        </p>
                        <ConversionCtas guidesHref="/guides" />
                    </div>

                    {/* The four subjects */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                The four subjects we tutor
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            These are the four core subjects that run through the undergraduate accounting degree and into the PGDA and CTA year. Each subject page has the detail on what the sessions cover, how the content builds across levels, and how to book.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {SUBJECTS.map((subject) => (
                                <div
                                    key={subject.href}
                                    className="bg-card rounded-xl border border-border p-6"
                                >
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                        <Link
                                            href={subject.href}
                                            className="text-foreground hover:text-accent transition-colors"
                                        >
                                            {subject.name}
                                        </Link>
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {subject.blurb}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study guides pointer */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-card rounded-xl border border-border p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                                <h2 className="font-display text-2xl font-semibold text-foreground">
                                    Free study guides
                                </h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Alongside tutoring, I publish exam-focused notes on the standards students find hardest,
                                starting with Financial Accounting (IFRS 15, IFRS 16, and Group statements) and expanding into
                                the other subjects over time. Each subject page links to its own guides as they go live.
                            </p>
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                            >
                                Browse all study guides &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* The qualifications */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                The qualifications we support
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            The four subject pages above cover the academic content of each discipline. The two qualification hubs below take a different angle: they are organised around the qualification you are working toward. If your question is "I am in my PGDA year and I need help with the diploma" or "I am a CTA student preparing for the ITC", those pages have the context that fits your situation. They also link back to the subject pages so you can navigate freely between them.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {QUALIFICATIONS.map((qual) => (
                                <div
                                    key={qual.href}
                                    className="bg-card rounded-xl border border-border p-6"
                                >
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                        <Link
                                            href={qual.href}
                                            className="text-foreground hover:text-accent transition-colors"
                                        >
                                            {qual.name}
                                        </Link>
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {qual.blurb}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group vs 1:1 */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-accent" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                                1:1 or group: how the sessions work
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    1:1 Personal Sessions
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Fully tailored to you. We work through your specific gaps at your pace, whether that is a single tricky standard, a pattern of exam errors, or a subject that has not clicked yet. Most students use this for targeted problem-area work or ITC integration practice.
                                </p>
                            </div>
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                                    Small Group Sessions
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Two to four students sharing a topic. Good for working through past papers together, covering a technically dense area with peers, or splitting the cost of structured revision sessions in the lead-up to exams.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            All sessions run online via video call with screen sharing. That means students from any South African university can book regardless of where they are based. I work with students studying from Cape Town, Johannesburg, Pretoria, and anywhere else in the country. Scheduling works around your academic timetable, not the other way around.
                        </p>
                        <div className="mt-6 bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                            <p className="text-foreground font-medium mb-4">
                                Ready to find the right session? Send a WhatsApp and we will sort it out.
                            </p>
                            <Button asChild variant="hero">
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    WhatsApp to Book
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
                            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                                Not sure where to start?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Send a WhatsApp message with your subject, your university, and what you are struggling with. I will point you to the right page and confirm availability.
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
