import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GroupSessions from "@/components/GroupSessions";
import Services from "@/components/Services";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import Pricing from "@/components/Pricing";
import Resources from "@/components/Resources";
import Blog from "@/components/Blog";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ACCE Tutors | Expert CA(SA) & CTA Support",
  description: "Expert tutoring for Undergraduate and PGDA/CTA students. Master Accounting, Tax, Management Accounts & Finance, and Auditing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ACCE Tutors | Expert CA(SA) & CTA Support",
    description: "Expert tutoring for Undergraduate and PGDA/CTA students. Master Accounting, Tax, Management Accounts & Finance, and Auditing.",
  },
  twitter: {
    title: "ACCE Tutors | Expert CA(SA) & CTA Support",
    description: "Expert tutoring for Undergraduate and PGDA/CTA students. Master Accounting, Tax, Management Accounts & Finance, and Auditing.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <GroupSessions />
        <Services />
        <About />
        <HowItWorks />
        <WhyChoose />
        <Pricing />
        <Resources />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
