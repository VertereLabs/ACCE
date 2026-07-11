import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/components/About";

export const metadata: Metadata = {
    title: "About Priyanka | CA(SA) Journey & Tutoring Approach | ACCE",
    description:
        "Meet Priyanka Govender: PGDA graduate and CA(SA) candidate who turned a 38% Financial Accounting mark into four passes. The story and approach behind ACCE tutoring.",
    alternates: {
        canonical: "/about/",
    },
    openGraph: {
        title: "About Priyanka | CA(SA) Journey & Tutoring Approach | ACCE",
        description:
            "Meet Priyanka Govender: PGDA graduate and CA(SA) candidate who turned a 38% Financial Accounting mark into four passes. The story and approach behind ACCE tutoring.",
    },
    twitter: {
        title: "About Priyanka | CA(SA) Journey & Tutoring Approach | ACCE",
        description:
            "Meet Priyanka Govender: PGDA graduate and CA(SA) candidate who turned a 38% Financial Accounting mark into four passes. The story and approach behind ACCE tutoring.",
    },
};

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://accetutors.co.za/" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://accetutors.co.za/about/" },
    ],
};

// Person (E-E-A-T) + ProfilePage, with founder linked back onto the site
// Organization (node-merged by @id with the definition in the root layout).
const PROFILE_DATA = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "ProfilePage",
            "@id": "https://accetutors.co.za/about/#profilepage",
            url: "https://accetutors.co.za/about/",
            name: "About Priyanka",
            mainEntity: { "@id": "https://accetutors.co.za/#priyanka" },
        },
        {
            "@type": "Person",
            "@id": "https://accetutors.co.za/#priyanka",
            name: "Priyanka Govender",
            jobTitle: "CA(SA) Tutor & Founder",
            description:
                "PGDA graduate and CA(SA) candidate who tutors Financial Accounting, Taxation, Management Accounting & Finance, and Auditing for undergraduate, PGDA and CTA students.",
            image: "https://accetutors.co.za/images/priyanka.png",
            alumniOf: { "@type": "EducationalOrganization", name: "Milpark Education" },
            knowsAbout: [
                "Financial Accounting",
                "Taxation",
                "Management Accounting and Finance",
                "Auditing",
                "IFRS",
                "CA(SA)",
                "CTA",
            ],
            worksFor: { "@id": "https://accetutors.co.za/#organization" },
            sameAs: ["https://www.linkedin.com/in/priyanka-govender21-724096186/"],
        },
        {
            "@type": "Organization",
            "@id": "https://accetutors.co.za/#organization",
            founder: { "@id": "https://accetutors.co.za/#priyanka" },
            sameAs: ["https://www.instagram.com/acce.tutorscta/"],
        },
    ],
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="about-jsonld-breadcrumb" data={BREADCRUMB_DATA} />
            <JsonLd id="about-jsonld-profile" data={PROFILE_DATA} />
            <Navbar />
            <main className="pt-20">
                <About />

                {/* Explore next */}
                <section className="pb-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                            <p>
                                Ready to work together? See the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">subjects I tutor</Link>,
                                explore the{" "}
                                <Link href="/guides" className="text-accent hover:underline">study guides</Link>, or{" "}
                                <Link href="/contact" className="text-accent hover:underline">get in touch</Link>.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
