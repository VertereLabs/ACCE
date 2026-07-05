import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";

const plans = [
    {
        name: "Single Session",
        price: "TBD",
        period: "per session",
        description: "Perfect for targeted help on specific topics or exam prep.",
        features: [
            "1-on-1 tutoring session",
            "Focus on your weak areas",
            "Exam strategies included",
            "Flexible scheduling",
        ],
        popular: false,
    },
    {
        name: "Monthly Package",
        price: "TBD",
        period: "per month",
        description: "Consistent support throughout your academic journey.",
        features: [
            "4 sessions per month",
            "Personalized study plan",
            "WhatsApp support",
            "Past paper practice",
            "Progress tracking",
        ],
        popular: true,
    },
    {
        name: "Semester Package",
        price: "TBD",
        period: "per semester",
        description: "Comprehensive support from start to exam success.",
        features: [
            "Weekly sessions",
            "Full semester study plan",
            "Priority WhatsApp support",
            "Notes & resources included",
            "Exam preparation focus",
            "Mock exam reviews",
        ],
        popular: false,
    },
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        Pricing
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Invest in Your Success
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Flexible pricing options to suit your needs. Contact me for current rates and package details.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative surface-card rounded-2xl p-8 border-2 transition-all duration-500 hover:-translate-y-2 ${plan.popular
                                    ? "border-accent shadow-lg shadow-accent/20 scale-105 z-10"
                                    : "border-border opacity-90"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-accent text-accent-foreground text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                                {plan.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                {plan.description}
                            </p>

                            <div className="mb-6">
                                <span className="font-display text-4xl font-bold text-foreground">
                                    {plan.price}
                                </span>
                                <span className="text-muted-foreground text-sm ml-2">
                                    {plan.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted-foreground text-sm">
                                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={plan.popular ? "hero" : "secondary"}
                                asChild
                            >
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="w-4 h-4" />
                                    Get Quote
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>

                <p className="text-center text-muted-foreground text-sm mt-8">
                    💡 Prices vary based on subject and level. Contact me for a personalized quote.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
