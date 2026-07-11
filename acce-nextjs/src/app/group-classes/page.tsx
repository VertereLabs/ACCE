import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroupSessions from "@/components/GroupSessions";
import { groupSessions } from "@/config/groupSessions";

export const metadata: Metadata = {
    title: "CA(SA) Group Classes: Live Online Small-Group Tutoring | ACCE",
    description:
        "Structured small-group tutoring for CA(SA), CTA and PGDA students. See the live group class schedule across Accounting, Tax, MAF and Auditing, and book your seat.",
    alternates: {
        canonical: "/group-classes/",
    },
    openGraph: {
        title: "CA(SA) Group Classes: Live Online Small-Group Tutoring | ACCE",
        description:
            "Structured small-group tutoring for CA(SA), CTA and PGDA students. See the live group class schedule across Accounting, Tax, MAF and Auditing, and book your seat.",
    },
    twitter: {
        title: "CA(SA) Group Classes: Live Online Small-Group Tutoring | ACCE",
        description:
            "Structured small-group tutoring for CA(SA), CTA and PGDA students. See the live group class schedule across Accounting, Tax, MAF and Auditing, and book your seat.",
    },
};

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://accetutors.co.za/" },
        { "@type": "ListItem", position: 2, name: "Group Classes", item: "https://accetutors.co.za/group-classes/" },
    ],
};

// Course schema, with one CourseInstance per scheduled session pulled straight
// from the live campaign config so the markup never drifts from the page.
const COURSE_DATA = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "CA(SA) Group Revision Classes",
    description: groupSessions.subheading,
    provider: {
        "@type": "Organization",
        "@id": "https://accetutors.co.za/#organization",
        name: "ACCE Tutors",
    },
    educationalLevel: "Undergraduate, PGDA and CTA",
    about: ["Financial Accounting", "Taxation", "Management Accounting and Finance", "Auditing"],
    hasCourseInstance: groupSessions.sessions.map((session) => ({
        "@type": "CourseInstance",
        name: session.title,
        description: session.description,
        courseMode: "Online",
        courseWorkload: "PT2H",
        startDate: session.startDate,
        endDate: session.endDate,
        maximumAttendeeCapacity: 6,
        location: {
            "@type": "VirtualLocation",
            url: "https://accetutors.co.za/group-classes/",
        },
        offers: {
            "@type": "Offer",
            category: "Group tutoring",
            availability: "https://schema.org/LimitedAvailability",
            url: groupSessions.whatsappUrl,
        },
    })),
};

export default function GroupClassesPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="group-classes-jsonld-breadcrumb" data={BREADCRUMB_DATA} />
            <JsonLd id="group-classes-jsonld-course" data={COURSE_DATA} />
            <Navbar />
            <main className="pt-20">
                <GroupSessions />

                {/* Explore next */}
                <section className="pb-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                            <p>
                                Prefer one-on-one? Browse the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">subjects I tutor</Link>, compare{" "}
                                <Link href="/pricing" className="text-accent hover:underline">pricing &amp; packages</Link>, or{" "}
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
