import Link from "next/link";
import { MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/27713255295";

interface ConversionCtasProps {
    /** Primary (gold) button label. */
    bookLabel?: string;
    /** Primary button target. Defaults to the WhatsApp booking link. */
    bookHref?: string;
    /** Secondary (outline) button label. */
    guidesLabel?: string;
    /**
     * Secondary button target. Use "#guides" to scroll to an on-page
     * <SubjectGuides> section, or "/guides" for the full library.
     */
    guidesHref?: string;
    /** Horizontal alignment of the button row. */
    align?: "left" | "center";
    size?: "default" | "lg";
    className?: string;
}

/**
 * The site's two conversion paths as a paired call to action: book a session
 * (primary) or browse the study guides (secondary). Kept in one component so
 * the "book or read the guides" pattern stays consistent across every page.
 */
export default function ConversionCtas({
    bookLabel = "Book a Session",
    bookHref = WHATSAPP_URL,
    guidesLabel = "Browse the guides",
    guidesHref = "/guides",
    align = "left",
    size = "lg",
    className,
}: ConversionCtasProps) {
    const bookIsExternal = bookHref.startsWith("http");

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row gap-4",
                align === "center" && "justify-center",
                className,
            )}
        >
            <Button variant="hero" size={size} asChild>
                <a
                    href={bookHref}
                    {...(bookIsExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                >
                    <MessageCircle className="w-5 h-5" />
                    {bookLabel}
                </a>
            </Button>
            <Button variant="outline" size={size} asChild>
                <Link href={guidesHref}>
                    <BookOpen className="w-5 h-5" />
                    {guidesLabel}
                </Link>
            </Button>
        </div>
    );
}
