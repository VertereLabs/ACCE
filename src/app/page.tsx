import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import Pricing from "@/components/Pricing";
import Resources from "@/components/Resources";
import Blog from "@/components/Blog";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
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
