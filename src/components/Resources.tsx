import Link from "next/link";
import { FileText, BookOpen, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
    {
        icon: Building2,
        title: "Groups & Business Combinations",
        description: "Master consolidated financial statements, IFRS 3, IFRS 10, and the Analysis of Equity.",
        badge: "Available",
        badgeStyle: "bg-green-500/20 text-green-400",
        href: "/guides/groups",
    },
    {
        icon: BookOpen,
        title: "IFRS 15: Revenue",
        description: "Understand revenue recognition through the five-step model for contracts with customers.",
        badge: "Available",
        badgeStyle: "bg-green-500/20 text-green-400",
        href: "/guides/ifrs-15",
    },
    {
        icon: FileText,
        title: "IFRS 16: Leases",
        description: "Navigate lessee and lessor accounting, ROU assets, and practical expedients.",
        badge: "Available",
        badgeStyle: "bg-green-500/20 text-green-400",
        href: "/guides/ifrs-16",
    },
];

const Resources = () => {
    return (
        <section id="resources" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-primary-foreground text-sm font-medium mb-4">
                        Study Guides
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                        Master Complex Topics
                    </h2>
                    <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
                        In-depth guides for the most challenging IFRS standards. Written by qualified tutors who know what examiners are looking for.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {resources.map((resource) => (
                        <Link
                            key={resource.title}
                            href={resource.href}
                            className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 relative block"
                        >
                            <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${resource.badgeStyle}`}>
                                {resource.badge}
                            </span>
                            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                <resource.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2">
                                {resource.title}
                            </h3>
                            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
                                {resource.description}
                            </p>
                            <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                                View Guide
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button
                        asChild
                        variant="hero"
                    >
                        <Link href="/guides/">
                            View All Guides
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Resources;
