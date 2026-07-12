import Link from "next/link";
import { Building2, Receipt, FileText, MessageCircle, Sparkles, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/config/guides";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/27713255295";

type GuideId = "groups" | "ifrs-15" | "ifrs-16";

/**
 * Per-guide card theme. Icons mirror GUIDE_ICONS on the guides index; tints
 * reuse each guide's established badge colour (gold for Groups, blue for
 * IFRS 16 part badges) with green assigned to IFRS 15 so the two gold guides
 * don't render identically. Buttons and copy stay on the shared conversion
 * convention and do not vary.
 */
const THEMES: Record<GuideId, {
    name: string;
    icon: LucideIcon;
    pill: string;
    border: string;
    blobA: string;
    blobB: string;
}> = {
    groups: {
        name: "Groups",
        icon: Building2,
        pill: "bg-accent/20 text-accent",
        border: "border-accent/40",
        blobA: "bg-accent/15",
        blobB: "bg-accent/10",
    },
    "ifrs-15": {
        name: "IFRS 15",
        icon: Receipt,
        pill: "bg-green-500/20 text-green-400",
        border: "border-green-500/40",
        blobA: "bg-green-500/15",
        blobB: "bg-accent/10",
    },
    "ifrs-16": {
        name: "IFRS 16",
        icon: FileText,
        pill: "bg-blue-500/20 text-blue-400",
        border: "border-blue-500/40",
        blobA: "bg-blue-500/15",
        blobB: "bg-accent/10",
    },
};

interface GuideCompletionCardProps {
    guide: GuideId;
}

/**
 * End-of-guide completion card shown once at the bottom of each guide's final
 * part. Folds the "you've finished" congratulations and the closing
 * conversion CTA into a single standout card with the three follow-up paths:
 * WhatsApp support, the services on offer, and the rest of the guide library.
 */
export default function GuideCompletionCard({ guide }: GuideCompletionCardProps) {
    const theme = THEMES[guide];
    const parts = GUIDES.find((g) => g.id === guide)?.parts;
    const Icon = theme.icon;

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl border-2 bg-card p-10 md:p-12 text-center shadow-xl shadow-accent/10",
            theme.border,
        )}>
            {/* Decorative glow blobs */}
            <div className={cn("absolute top-0 right-0 w-48 h-48 rounded-full -mr-20 -mt-20 blur-3xl", theme.blobA)} />
            <div className={cn("absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-20 -mb-20 blur-3xl", theme.blobB)} />

            <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-accent shadow-glow rotate-3 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent-foreground" />
                </div>

                {parts && (
                    <span className={cn("inline-block px-3 py-1 rounded-full text-sm font-medium mb-4", theme.pill)}>
                        All {parts} Parts Complete
                    </span>
                )}
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                    {theme.name} Guide Complete! 🎉
                </h3>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                    Good luck with your studies and upcoming exams. If you&apos;d like some
                    additional support, reach out on WhatsApp or take a look at the
                    services on offer. Otherwise, feel free to check out our other guides.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button asChild variant="hero" size="lg" className="px-8">
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Priyanka
                        </a>
                    </Button>
                    <Button asChild variant="heroOutline" size="lg" className="px-8">
                        <Link href="/#services">
                            <Sparkles className="w-5 h-5" />
                            View Our Services
                        </Link>
                    </Button>
                    <Button asChild variant="heroOutline" size="lg" className="px-8">
                        <Link href="/guides/">
                            <BookOpen className="w-5 h-5" />
                            Explore Other Guides
                        </Link>
                    </Button>
                </div>

                <p className="text-foreground font-display font-semibold m-0">
                    We&apos;ll make sure you&apos;re ready to{" "}
                    <span className="text-accent font-bold">ACCE</span> your exams. 🎓
                </p>
            </div>
        </div>
    );
}
