import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing, { pricingPlans } from "@/components/Pricing";

export const metadata: Metadata = {
    title: "Tutoring Pricing & Packages | CA(SA), CTA & PGDA | ACCE",
    description:
        "Flexible CA(SA) tutoring pricing: single sessions, monthly packages, and full-semester support. Rates vary by subject and level: request a personalized quote.",
    alternates: {
        canonical: "/pricing/",
    },
    openGraph: {
        title: "Tutoring Pricing & Packages | CA(SA), CTA & PGDA | ACCE",
        description:
            "Flexible CA(SA) tutoring pricing: single sessions, monthly packages, and full-semester support. Rates vary by subject and level: request a personalized quote.",
    },
    twitter: {
        title: "Tutoring Pricing & Packages | CA(SA), CTA & PGDA | ACCE",
        description:
            "Flexible CA(SA) tutoring pricing: single sessions, monthly packages, and full-semester support. Rates vary by subject and level: request a personalized quote.",
    },
};

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://accetutors.co.za/" },
        { "@type": "ListItem", position: 2, name: "Pricing", item: "https://accetutors.co.za/pricing/" },
    ],
};

// Service + OfferCatalog of the tutoring packages. Prices are quote-on-request
// (literal "TBD" in the config), so Offers carry the package as itemOffered
// without asserting a price we do not have.
const SERVICE_DATA = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CA(SA) Tutoring",
    serviceType: "Tutoring",
    description:
        "One-on-one and small-group tutoring for CA(SA), CTA and PGDA students across Financial Accounting, Taxation, Management Accounting & Finance, and Auditing.",
    provider: {
        "@type": "Organization",
        "@id": "https://accetutors.co.za/#organization",
        name: "ACCE Tutors",
    },
    areaServed: { "@type": "Country", name: "South Africa" },
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tutoring packages",
        itemListElement: pricingPlans.map((plan) => ({
            "@type": "Offer",
            itemOffered: {
                "@type": "Service",
                name: plan.name,
                description: plan.description,
            },
        })),
    },
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd id="pricing-jsonld-breadcrumb" data={BREADCRUMB_DATA} />
            <JsonLd id="pricing-jsonld-service" data={SERVICE_DATA} />
            <Navbar />
            <main className="pt-20">
                <Pricing />

                {/* Explore next */}
                <section className="pb-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                            <p>
                                Group classes split the cost: see the{" "}
                                <Link href="/group-classes" className="text-accent hover:underline">group class schedule</Link>. Not sure what you need?{" "}
                                <Link href="/contact" className="text-accent hover:underline">Get in touch</Link>{" "}
                                and I&apos;ll match a package to your situation.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
