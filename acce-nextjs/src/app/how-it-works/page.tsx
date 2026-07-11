import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
    title: "How ACCE Tutoring Works | From First Message to Exam Success",
    description:
        "How ACCE tutoring works in four steps: reach out, a free consultation, a personalized study plan, and consistent support through to exam success.",
    alternates: {
        canonical: "/how-it-works/",
    },
    openGraph: {
        title: "How ACCE Tutoring Works | From First Message to Exam Success",
        description:
            "How ACCE tutoring works in four steps: reach out, a free consultation, a personalized study plan, and consistent support through to exam success.",
    },
    twitter: {
        title: "How ACCE Tutoring Works | From First Message to Exam Success",
        description:
            "How ACCE tutoring works in four steps: reach out, a free consultation, a personalized study plan, and consistent support through to exam success.",
    },
};

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://accetutors.co.za/" },
        { "@type": "ListItem", position: 2, name: "How It Works", item: "https://accetutors.co.za/how-it-works/" },
    ],
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background">
            <Script id="how-it-works-jsonld-breadcrumb" type="application/ld+json">
                {JSON.stringify(BREADCRUMB_DATA)}
            </Script>
            <Navbar />
            <main className="pt-20">
                <HowItWorks />

                {/* Explore next */}
                <section className="pb-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                            <p>
                                Ready when you are. Browse the{" "}
                                <Link href="/subjects" className="text-accent hover:underline">subjects I tutor</Link>, see{" "}
                                <Link href="/pricing" className="text-accent hover:underline">pricing &amp; packages</Link>, or{" "}
                                <Link href="/contact" className="text-accent hover:underline">get in touch</Link>{" "}
                                to book your first session.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
