import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroupSessions from "@/components/GroupSessions";

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

export default function GroupClassesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Script id="group-classes-jsonld-breadcrumb" type="application/ld+json">
                {JSON.stringify(BREADCRUMB_DATA)}
            </Script>
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
