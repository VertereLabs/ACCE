import { Calculator, BookOpen, Coins, Scale } from "lucide-react";

const services = [
    {
        icon: BookOpen,
        title: "Financial Accounting",
        description: "From IFRS fundamentals to advanced group consolidations. Master the Analysis of Equity, FCTRs, and complex scenarios. I improved my score by 25% by going back to basics; I'll show you how.",
    },
    {
        icon: Scale,
        title: "Taxation",
        description: "Navigate the Income Tax Act with confidence. Corporate tax, VAT, estate duty, and everything in between. Fine-tuning and targeted revision strategies that actually work.",
    },
    {
        icon: Coins,
        title: "Management Accounting",
        description: "Excel in costing, budgeting, and financial strategy. Time management is key - I'll help you score marks efficiently within allocated time through smart exam techniques.",
    },
    {
        icon: Calculator,
        title: "Auditing",
        description: "Understand ISA standards and apply them to practical scenarios. From audit processes to governance and ethics, build a solid foundation for board exam success.",
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
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                        Comprehensive PGDA & BCom Support
                    </h2>
                    <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
                        Specialized tutoring for the four pillars of your CA(SA) qualification.
                        Whether you&apos;re a full-time student or working while studying - I&apos;ve been there, and I can help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                                <service.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                                {service.title}
                            </h3>
                            <p className="text-primary-foreground/70 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
