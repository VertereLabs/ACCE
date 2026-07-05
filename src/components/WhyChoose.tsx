import { Heart, Target, Clock, Lightbulb, GraduationCap, Users } from "lucide-react";

const valueProps = [
    {
        icon: Heart,
        title: "Been There, Done That",
        description: "I've walked the PGDA journey myself - through the struggles, the failures, and ultimately the success. I understand what you're going through.",
    },
    {
        icon: Target,
        title: "Personalized Approach",
        description: "Every student learns differently. I adapt my teaching methods to match your learning style for maximum effectiveness.",
    },
    {
        icon: Clock,
        title: "Flexible for Working Students",
        description: "I completed PGDA while working full-time. I know the challenges and have practical strategies to help you balance both.",
    },
    {
        icon: Lightbulb,
        title: "Exam-Focused Strategies",
        description: "Past papers are your best friend. I'll teach you to practice under exam conditions, manage time, and focus on what matters.",
    },
    {
        icon: GraduationCap,
        title: "Back to Basics Approach",
        description: "Sometimes the key is returning to fundamentals. I improved 25% in Financial Accounting by mastering the basics first.",
    },
    {
        icon: Users,
        title: "Ongoing Support",
        description: "From study planning to exam day - I'm here to guide, motivate, and support you throughout your entire academic journey.",
    },
];

const WhyChoose = () => {
    return (
        <section id="why-choose" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        Why Choose ACCE
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        What Makes Us Different
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        More than just tutoring: it's mentorship from someone who truly understands the CA(SA) journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {valueProps.map((prop) => (
                        <div
                            key={prop.title}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 relative group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                                <prop.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                                {prop.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {prop.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
