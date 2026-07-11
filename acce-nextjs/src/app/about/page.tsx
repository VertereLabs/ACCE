import { Metadata } from "next";
import Script from "next/script";
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

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Script id="about-jsonld-breadcrumb" type="application/ld+json">
                {JSON.stringify(BREADCRUMB_DATA)}
            </Script>
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
