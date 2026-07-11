import { BookOpen, Scale, Coins, Calculator, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Group revision-class campaign data.
 *
 * This drives the <GroupSessions /> homepage section. To advertise a new
 * round (Test 4, board prep, etc.), update this object — no component edits
 * needed. Set `active: false` to hide the section entirely between rounds.
 *
 * Source: "Group Test 2 prep" flyer (Test 3 Preparation Revision Classes).
 */

export type GroupSession = {
    /** Display order / badge number */
    number: number;
    day: string;
    /** e.g. "8th of July" */
    date: string;
    /** e.g. "7:00PM – 9:00PM" */
    time: string;
    /** ISO 8601 start, SAST (+02:00) — powers Course structured data */
    startDate: string;
    /** ISO 8601 end, SAST (+02:00) */
    endDate: string;
    title: string;
    /** Subject bucket — selects the icon */
    subject: "accounting" | "tax" | "management" | "auditing" | "general";
    description: string;
    /** e.g. "4–6 people max" */
    capacity: string;
};

export type GroupSessionCampaign = {
    active: boolean;
    /** Small pill above the heading */
    eyebrow: string;
    heading: string;
    subheading: string;
    /** Short "Plan · Prepare · Pass" style promise chips */
    promises: string[];
    /** The four "what's included" highlights */
    highlights: { icon: LucideIcon; label: string }[];
    /** One-line summary of the class mix */
    mixSummary: string;
    sessions: GroupSession[];
    /** Notes shown in the footer strip of the section */
    notes: string[];
    urgencyLabel: string;
    whatsappUrl: string;
    ctaLabel: string;
};

export const subjectIcons: Record<GroupSession["subject"], LucideIcon> = {
    accounting: BookOpen,
    tax: Scale,
    management: Coins,
    auditing: Calculator,
    general: GraduationCap,
};

export const groupSessions: GroupSessionCampaign = {
    active: true,
    eyebrow: "Group Revision Classes",
    heading: "Test 3 Preparation Revision Classes",
    subheading: "Focused revision. Stronger results. Six small-group classes across Accounting, Tax, Management Accounting and Auditing.",
    promises: ["Plan", "Prepare", "Pass PGDA"],
    highlights: [
        { icon: GraduationCap, label: "Exam technique" },
        { icon: BookOpen, label: "Exam papers" },
        { icon: Coins, label: "Key concepts recaps" },
        { icon: Scale, label: "Time for questions" },
    ],
    mixSummary: "6 revision classes: 2 Accounting, 2 Tax, 1 Management Accounting, 1 Auditing",
    sessions: [
        {
            number: 1,
            day: "Wednesday",
            date: "8th of July",
            time: "7:00PM – 9:00PM",
            startDate: "2026-07-08T19:00:00+02:00",
            endDate: "2026-07-08T21:00:00+02:00",
            title: "Test 3 Preparation Revision Class",
            subject: "general",
            description: "For exam technique, exam papers and key concepts revision recaps for the main sections.",
            capacity: "4–6 people max",
        },
        {
            number: 2,
            day: "Saturday",
            date: "11th of July",
            time: "6:00PM – 8:00PM",
            startDate: "2026-07-11T18:00:00+02:00",
            endDate: "2026-07-11T20:00:00+02:00",
            title: "Auditing Revision Class",
            subject: "auditing",
            description: "Exam technique focusing on Test 3 content and exam papers.",
            capacity: "4–6 people max",
        },
        {
            number: 3,
            day: "Sunday",
            date: "12th of July",
            time: "8:00AM – 10:00AM",
            startDate: "2026-07-12T08:00:00+02:00",
            endDate: "2026-07-12T10:00:00+02:00",
            title: "Accounting Revision Class",
            subject: "accounting",
            description: "Exam technique and key concepts revision for Test 3. Exam papers.",
            capacity: "4–6 people max",
        },
        {
            number: 4,
            day: "Wednesday",
            date: "15th of July",
            time: "7:00PM – 9:00PM",
            startDate: "2026-07-15T19:00:00+02:00",
            endDate: "2026-07-15T21:00:00+02:00",
            title: "Tax Revision Class",
            subject: "tax",
            description: "Test 3 papers and revision of key concepts.",
            capacity: "4–6 people max",
        },
        {
            number: 5,
            day: "Saturday",
            date: "18th of July",
            time: "6:00PM – 8:00PM",
            startDate: "2026-07-18T18:00:00+02:00",
            endDate: "2026-07-18T20:00:00+02:00",
            title: "Tax Revision Class",
            subject: "tax",
            description: "Exam technique framework and exam papers.",
            capacity: "4–6 people max",
        },
        {
            number: 6,
            day: "Sunday",
            date: "19th of July",
            time: "8:00AM – 10:00AM",
            startDate: "2026-07-19T08:00:00+02:00",
            endDate: "2026-07-19T10:00:00+02:00",
            title: "Management Accounting Revision Class",
            subject: "management",
            description: "Exam technique framework and past papers.",
            capacity: "4–6 people max",
        },
    ],
    notes: [
        "Each session is 2 hours, with time for questions after.",
        "Private lessons are also available.",
        "Class size: 4–6 people maximum.",
    ],
    urgencyLabel: "Spaces are limited",
    whatsappUrl: "https://wa.me/27713255295",
    ctaLabel: "DM me to book a spot",
};
