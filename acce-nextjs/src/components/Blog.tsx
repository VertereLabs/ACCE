import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
    {
        title: "Group Financial Accounting: Part 1 - Foundations",
        excerpt: "Master the Analysis of Equity, fair value adjustments, and the heart of group accounting. Learn the fundamentals before tackling complex consolidations.",
        category: "Financial Accounting",
        readTime: "8 min read",
        date: "Coming Soon",
    },
    {
        title: "My CTA Journey: From 38% to 63% in Financial Accounting",
        excerpt: "How going back to basics, relentless practice, and a focused approach helped me achieve a 25% improvement in my most challenging subject.",
        category: "Personal Story",
        readTime: "5 min read",
        date: "Coming Soon",
    },
    {
        title: "5 Lessons I Learned While Teaching Accounting",
        excerpt: "From adapting to different learning styles to the power of past paper; key insights from tutoring PGDA and BCom students.",
        category: "Study Tips",
        readTime: "6 min read",
        date: "Coming Soon",
    },
];

const Blog = () => {
    return (
        <section id="blog" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        Blog
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Tips, Guides & Insights
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Learn from my journey and get practical advice for your CA(SA) path.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {blogPosts.map((post) => (
                        <article
                            key={post.title}
                            className="group surface-card surface-card-hover rounded-2xl overflow-hidden border border-border transition-all duration-500"
                        >
                            {/* Placeholder Image */}
                            <div className="h-40 bg-gradient-to-br from-accent/20 to-white/5 flex items-center justify-center">
                                <span className="text-4xl">📚</span>
                            </div>

                            <div className="p-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium mb-3">
                                    {post.category}
                                </span>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-muted-foreground text-sm mb-4">
                        Blog posts are coming soon! Follow me on LinkedIn for updates.
                    </p>
                    <Button
                        variant="hero"
                        asChild
                    >
                        <a
                            href="https://www.linkedin.com/in/priyanka-govender21-724096186/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Follow on LinkedIn
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Blog;
