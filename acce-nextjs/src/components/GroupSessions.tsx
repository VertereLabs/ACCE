import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, Users, MessageCircle, Sparkles, Check, ArrowRight } from "lucide-react";
import { groupSessions, subjectIcons } from "@/config/groupSessions";

// Compact homepage teaser: pitch + promise chips + link to the full schedule.
const GroupSessionsTeaser = () => {
    const campaign = groupSessions;
    if (!campaign.active) return null;

    return (
        <section id="group-classes" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        {campaign.eyebrow}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {campaign.heading}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        {campaign.subheading}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        {campaign.promises.map((promise) => (
                            <span
                                key={promise}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-accent-ink text-sm font-medium"
                            >
                                <Check className="w-4 h-4" />
                                {promise}
                            </span>
                        ))}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-accent text-accent-foreground text-sm font-bold shadow-glow">
                            {campaign.urgencyLabel}
                        </span>
                    </div>
                    <Button variant="hero" size="lg" asChild>
                        <Link href="/group-classes">
                            See the full group class schedule
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

const GroupSessions = ({ teaser = false }: { teaser?: boolean }) => {
    const campaign = groupSessions;

    if (!campaign.active) return null;
    if (teaser) return <GroupSessionsTeaser />;

    return (
        <section id="group-classes" className="py-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        {campaign.eyebrow}
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {campaign.heading}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {campaign.subheading}
                    </p>

                    {/* Promise chips + urgency */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        {campaign.promises.map((promise) => (
                            <span
                                key={promise}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-accent-ink text-sm font-medium"
                            >
                                <Check className="w-4 h-4" />
                                {promise}
                            </span>
                        ))}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-accent text-accent-foreground text-sm font-bold shadow-glow">
                            {campaign.urgencyLabel}
                        </span>
                    </div>
                </div>

                {/* What's included */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                    {campaign.highlights.map((highlight) => (
                        <div
                            key={highlight.label}
                            className="flex flex-col items-center text-center gap-3 surface-card rounded-2xl p-6 border border-border"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                                <highlight.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                                {highlight.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Mix summary */}
                <div className="max-w-5xl mx-auto mb-6">
                    <p className="font-display text-lg font-semibold text-accent-ink text-center md:text-left">
                        {campaign.mixSummary}
                    </p>
                </div>

                {/* Session schedule */}
                <div className="grid gap-4 max-w-5xl mx-auto">
                    {campaign.sessions.map((session) => {
                        const SubjectIcon = subjectIcons[session.subject];
                        return (
                            <div
                                key={session.number}
                                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-6 surface-card surface-card-hover rounded-2xl p-6 border border-border transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Session number */}
                                <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-1 md:w-20 flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl gradient-accent text-accent-foreground flex items-center justify-center font-display text-xl font-bold shadow-lg">
                                        {session.number}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Session
                                    </span>
                                </div>

                                {/* Date & time */}
                                <div className="md:w-52 flex-shrink-0 space-y-1.5">
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                                        <span>{session.day} {session.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                                        <span>{session.time}</span>
                                    </div>
                                </div>

                                {/* Title & description */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
                                            <SubjectIcon className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-display text-lg font-semibold text-foreground">
                                            {session.title}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {session.description}
                                    </p>
                                </div>

                                {/* Capacity */}
                                <div className="flex items-center gap-2 md:w-32 flex-shrink-0 text-sm font-medium text-accent-ink">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span>{session.capacity}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Notes */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 max-w-5xl mx-auto mt-8 text-sm text-muted-foreground">
                    {campaign.notes.map((note) => (
                        <span key={note} className="inline-flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent flex-shrink-0" />
                            {note}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Button variant="hero" size="lg" asChild>
                        <a href={campaign.whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4" />
                            {campaign.ctaLabel}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default GroupSessions;
