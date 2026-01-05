import Image from "next/image";
import { GraduationCap, Heart, Target, TrendingUp } from "lucide-react";

const milestones = [
    {
        icon: GraduationCap,
        title: "BCom Degree",
        description: "Completed undergraduate degree during COVID, followed by a gap year of reflection.",
    },
    {
        icon: Target,
        title: "Bridging Programme",
        description: "Achieved 75% aggregate while studying abroad through Milpark Education.",
    },
    {
        icon: Heart,
        title: "Overcoming Challenges",
        description: "Left a toxic work environment to focus fully on CTA—there was no plan B.",
    },
    {
        icon: TrendingUp,
        title: "25% Improvement",
        description: "Went from 38% to 63% in Financial Accounting through back-to-basics practice.",
    },
];

const About = () => {
    return (
        <section id="about" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        About Priyanka
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                        My CTA Journey
                    </h2>
                    <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
                        A story of resistance and struggle, but triumph in the end through persistence and resilience.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Image */}
                    <div className="relative">
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/20">
                            <Image
                                src="/images/priyanka.png"
                                alt="Priyanka Govender"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="font-display text-3xl font-bold text-accent">PGDA</p>
                            <p className="text-sm text-primary-foreground/60">Graduate</p>
                            <p className="text-xs text-primary-foreground/40 mt-1">Milpark Education</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <blockquote className="text-xl text-primary-foreground/90 italic leading-relaxed mb-8 border-l-4 border-accent pl-6">
                            &quot;I am living proof that anything is possible. Short-term sacrifices do pay off in the long term.&quot;
                        </blockquote>

                        <p className="text-primary-foreground/70 leading-relaxed mb-6">
                            After completing my undergraduate degree during COVID, I made the decision to commit fully to
                            becoming a Chartered Accountant. The journey wasn&apos;t smooth—I faced toxic work environments,
                            failed modules, and moments where I genuinely lost hope.
                        </p>

                        <p className="text-primary-foreground/70 leading-relaxed mb-8">
                            When I failed Financial Accounting with 38%, something shifted inside me. I went back to basics,
                            practiced relentlessly, and disappeared for three months. The result? A 25% improvement and four passes.
                            Now I use my journey to encourage and mentor others through this challenging but rewarding path.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {milestones.map((milestone) => (
                                <div
                                    key={milestone.title}
                                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                                >
                                    <milestone.icon className="w-6 h-6 text-accent mb-2" />
                                    <h4 className="font-semibold text-primary-foreground text-sm">{milestone.title}</h4>
                                    <p className="text-xs text-primary-foreground/60 mt-1">{milestone.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
