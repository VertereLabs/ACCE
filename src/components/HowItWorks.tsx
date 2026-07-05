import { MessageCircle, Users, FileText, Trophy } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: MessageCircle,
        title: "Reach Out",
        description: "Contact me via WhatsApp or email. Tell me where you are in your studies and what support you need.",
    },
    {
        number: "02",
        icon: Users,
        title: "Free Consultation",
        description: "We'll discuss your challenges, goals, and learning style. Every student learns differently; I adapt my approach to you.",
    },
    {
        number: "03",
        icon: FileText,
        title: "Personalized Plan",
        description: "Get a structured study plan tailored to your schedule. Past papers, targeted revision, and exam strategies included.",
    },
    {
        number: "04",
        icon: Trophy,
        title: "Achieve Success",
        description: "With consistent effort and the right guidance, watch your understanding and grades improve. Your success is my priority.",
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-foreground text-sm font-medium mb-4">
                        How It Works
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Your Journey to Success
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Getting started is simple. Four steps to personalized, intentional support for your accounting journey.
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="relative group"
                            >
                                {/* Step Card */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:-translate-y-2 relative z-10">
                                    {/* Number Badge */}
                                    <div className="absolute -top-4 left-8 px-3 py-1 rounded-full gradient-accent text-accent-foreground text-sm font-bold">
                                        {step.number}
                                    </div>

                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                                        <step.icon className="w-8 h-8 text-foreground group-hover:text-accent transition-colors duration-300" />
                                    </div>

                                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Connector Dot */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-primary border-4 border-accent z-20 -translate-y-1/2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
