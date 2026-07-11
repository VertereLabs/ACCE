import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getGuidesForSubject, type GuideSubject } from "@/config/guides";

interface SubjectGuidesProps {
    /** Subject taxonomy key used to pull published guides from the catalog. */
    subject: GuideSubject;
    /** Human-readable subject name, e.g. "Financial Accounting". */
    subjectLabel: string;
}

/**
 * Renders the published study guides for a subject as linked cards. When a
 * subject has no live guides yet (Tax, MAF, Auditing today), it shows a
 * pointer to the main guides index instead. New guides tagged to the subject
 * in `config/guides.ts` appear here automatically.
 */
const SubjectGuides = ({ subject, subjectLabel }: SubjectGuidesProps) => {
    const guides = getGuidesForSubject(subject);

    return (
        <div id="guides" className="max-w-3xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-accent" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold text-foreground">
                    Study guides for {subjectLabel}
                </h2>
            </div>

            {guides.length > 0 ? (
                <>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Free, exam-focused notes on the {subjectLabel} standards students find hardest. Use them to revise
                        between sessions, then bring your questions to a lesson.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {guides.map((guide) => (
                            <Link
                                key={guide.id}
                                href={guide.href}
                                className="group bg-card rounded-xl border border-border p-6 hover:border-accent transition-colors"
                            >
                                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                                    {guide.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">{guide.description}</p>
                                <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                                    Read the guide
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                    >
                        Browse all study guides
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </>
            ) : (
                <div className="bg-card rounded-xl border border-border p-6">
                    <p className="text-muted-foreground leading-relaxed">
                        Dedicated {subjectLabel} guides are on the way. In the meantime, the{" "}
                        <Link href="/guides" className="text-accent hover:underline">
                            study guides library
                        </Link>{" "}
                        covers the core CA(SA) standards, and a tutoring session is the fastest way to work through the
                        {" "}{subjectLabel} topics you are stuck on.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubjectGuides;
