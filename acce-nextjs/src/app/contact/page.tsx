import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact ACCE Tutors | Book CA(SA) Tutoring via WhatsApp",
    description:
        "Get in touch with ACCE Tutors. Message on WhatsApp or email Priyanka to book CA(SA), CTA and PGDA tutoring, or ask about subjects, group classes and pricing.",
    alternates: {
        canonical: "/contact/",
    },
    openGraph: {
        title: "Contact ACCE Tutors | Book CA(SA) Tutoring via WhatsApp",
        description:
            "Get in touch with ACCE Tutors. Message on WhatsApp or email Priyanka to book CA(SA), CTA and PGDA tutoring, or ask about subjects, group classes and pricing.",
    },
    twitter: {
        title: "Contact ACCE Tutors | Book CA(SA) Tutoring via WhatsApp",
        description:
            "Get in touch with ACCE Tutors. Message on WhatsApp or email Priyanka to book CA(SA), CTA and PGDA tutoring, or ask about subjects, group classes and pricing.",
    },
};

const BREADCRUMB_DATA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://accetutors.co.za/" },
        { "@type": "ListItem", position: 2, name: "Contact", item: "https://accetutors.co.za/contact/" },
    ],
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <Script id="contact-jsonld-breadcrumb" type="application/ld+json">
                {JSON.stringify(BREADCRUMB_DATA)}
            </Script>
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Hero header */}
                    <div className="max-w-3xl mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                            Get in touch
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Contact ACCE Tutors
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            The fastest way to reach me is WhatsApp. Tell me where you are in your studies, which subject or
                            qualification you need help with, and what you are finding difficult. I will reply with honest
                            guidance on how a session can help and confirm availability. Sessions run online, so students at any
                            South African university can book.
                        </p>
                    </div>

                    {/* Contact methods */}
                    <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mb-12">
                        <a
                            href="https://wa.me/27713255295"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 bg-card rounded-xl border border-border p-6 hover:border-accent transition-colors"
                        >
                            <MessageCircle className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
                            <div>
                                <h2 className="font-display font-semibold text-foreground mb-1">WhatsApp</h2>
                                <p className="text-muted-foreground text-sm">071 325 5295 &mdash; fastest reply</p>
                            </div>
                        </a>
                        <a
                            href="mailto:priyankamikaya21@gmail.com"
                            className="flex items-start gap-4 bg-card rounded-xl border border-border p-6 hover:border-accent transition-colors"
                        >
                            <Mail className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
                            <div>
                                <h2 className="font-display font-semibold text-foreground mb-1">Email</h2>
                                <p className="text-muted-foreground text-sm break-all">priyankamikaya21@gmail.com</p>
                            </div>
                        </a>
                        <div className="flex items-start gap-4 bg-card rounded-xl border border-border p-6">
                            <Phone className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
                            <div>
                                <h2 className="font-display font-semibold text-foreground mb-1">Phone</h2>
                                <p className="text-muted-foreground text-sm">071 325 5295</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-card rounded-xl border border-border p-6">
                            <MapPin className="w-6 h-6 text-accent flex-shrink-0" aria-hidden="true" />
                            <div>
                                <h2 className="font-display font-semibold text-foreground mb-1">Where</h2>
                                <p className="text-muted-foreground text-sm">Online, across South Africa</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-3xl mb-4">
                        <Button asChild variant="hero" size="lg">
                            <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-5 h-5" />
                                Message on WhatsApp
                            </a>
                        </Button>
                    </div>

                    <p className="max-w-3xl text-muted-foreground text-sm">
                        Not sure where to start? Browse the{" "}
                        <Link href="/subjects" className="text-accent hover:underline">subjects I tutor</Link>, the{" "}
                        <Link href="/group-classes" className="text-accent hover:underline">group class schedule</Link>, or{" "}
                        <Link href="/pricing" className="text-accent hover:underline">pricing &amp; packages</Link>.
                    </p>
                </div>

                {/* Conversion band */}
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
