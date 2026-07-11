import Link from "next/link";
import { Calculator, BookOpen, Coins, Scale } from "lucide-react";

const services = [
    {
        icon: BookOpen,
        title: "Financial Accounting",
        description: "From IFRS fundamentals to advanced group consolidations. Master the Analysis of Equity, FCTRs, and complex scenarios. I improved my score by 25% by going back to basics; I'll show you how.",
        href: "/accounting-tutor",
    },
    {
        icon: Scale,
        title: "Taxation",
        description: "Navigate the Income Tax Act with confidence. Corporate tax, VAT, estate duty, and everything in between. Fine-tuning and targeted revision strategies that actually work.",
        href: "/tax-tutor",
    },
    {
        icon: Coins,
        title: "Management Accounting",
        description: "Excel in costing, budgeting, and financial strategy. Time management is key - I'll help you score marks efficiently within allocated time through smart exam techniques.",
        href: "/financial-management-tutor",
    },
    {
        icon: Calculator,
        title: "Auditing",
        description: "Understand ISA standards and apply them to practical scenarios. From audit processes to governance and ethics, build a solid foundation for board exam success.",
        href: "/auditing-tutor",
    },
];

const Services = () => {
    return (
        <section id="services" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        Core Subjects
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Comprehensive PGDA & BCom Support
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Specialized tutoring for the four pillars of your CA(SA) qualification.
                        Whether you&apos;re a full-time student or working while studying - I&apos;ve been there, and I can help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group surface-card surface-card-hover rounded-2xl p-8 border border-border transition-all duration-500 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                                <service.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                                {service.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {service.description}
                            </p>
                            <Link
                                href={service.href}
                                className="inline-flex items-center gap-1 mt-4 font-medium text-accent hover:underline"
                            >
                                Learn more &rarr;
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-muted-foreground">
                    <p>
                        Studying towards a qualification? Get structured support for the whole programme:{" "}
                        <Link href="/cta-tutor" className="text-accent hover:underline">
                            CTA Tutoring
                        </Link>
                        {" · "}
                        <Link href="/pgda-tutor" className="text-accent hover:underline">
                            PGDA Tutoring
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Services;
