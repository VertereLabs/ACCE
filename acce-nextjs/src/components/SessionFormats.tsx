import Link from "next/link";
import { Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/27713255295";

interface SessionFormatsProps {
    /** Subject or qualification label, e.g. "Accounting", "MAF", "CTA". */
    subjectLabel: string;
}

/**
 * Compact "how sessions work" block shared across the subject and
 * qualification pages. The full four-step process lives on /how-it-works and
 * the rates on /pricing, so this is a short pointer plus a mid-page booking
 * CTA, kept deliberately brief so the same explanation is not repeated at
 * length on every page (which would read as near-duplicate content).
 */
export default function SessionFormats({ subjectLabel }: SessionFormatsProps) {
    return (
        <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center gap-3 mb-4">
                <Monitor className="w-6 h-6 text-accent" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold text-foreground">
                    How sessions work
                </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
                {subjectLabel} sessions run online by video call with screen sharing, so you can
                book from any South African university. Choose one-on-one for fully tailored
                problem-area work, or a small group of two to four to share the cost and work
                through past papers together. See{" "}
                <Link href="/how-it-works" className="text-accent hover:underline">
                    how it works
                </Link>{" "}
                for the full step-by-step, and{" "}
                <Link href="/pricing" className="text-accent hover:underline">
                    pricing and packages
                </Link>{" "}
                for session and block rates.
            </p>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
                <p className="text-foreground font-medium mb-4">
                    Ready to get started? Send a WhatsApp and we will sort out a time.
                </p>
                <Button asChild variant="hero">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                        WhatsApp to Book
                    </a>
                </Button>
            </div>
        </div>
    );
}
