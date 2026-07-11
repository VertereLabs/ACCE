import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks, { howItWorksSteps } from "@/components/HowItWorks";
import ConversionCtas from "@/components/ConversionCtas";

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

// HowTo schema built from the same 4 steps the page renders.
const HOWTO_DATA = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How ACCE tutoring works",
    description:
        "Getting started with ACCE tutoring takes four steps, from your first message through to consistent exam support.",
    step: howItWorksSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
    })),
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="how-it-works-jsonld-breadcrumb" data={BREADCRUMB_DATA} />
            <JsonLd id="how-it-works-jsonld-howto" data={HOWTO_DATA} />
            <Navbar />
            <main className="pt-20">
                <HowItWorks />

                {/* Book or read the guides */}
                <section className="pb-12">
                    <div className="container mx-auto px-6">
                        <ConversionCtas guidesHref="/guides" align="center" />
                    </div>
                </section>

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
