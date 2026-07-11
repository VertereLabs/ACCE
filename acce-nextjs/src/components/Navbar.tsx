"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Subjects", href: "/subjects" },
        { name: "Guides", href: "/guides" },
        { name: "About", href: "/about" },
        { name: "Group Classes", href: "/group-classes" },
        { name: "Pricing", href: "/pricing" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center" aria-label="ACCE Tutors home">
                        <Logo />
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium"
                            >
                                {link.name}
                            </a>
                        ))}

                        {/* Qualifications dropdown: reaches /cta-tutor and /pgda-tutor */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                                Qualifications
                                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem asChild>
                                    <a href="/cta-tutor" className="cursor-pointer w-full">
                                        CTA Tutoring
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="/pgda-tutor" className="cursor-pointer w-full">
                                        PGDA Tutoring
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* CTA Button + theme toggle */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <Button
                            variant="hero"
                            asChild
                        >
                            <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-4 h-4" />
                                Get Started
                            </a>
                        </Button>
                    </div>

                    {/* Mobile controls */}
                    <div className="md:hidden flex items-center gap-1">
                        <ThemeToggle />
                        <button
                            className="p-2 text-foreground"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-6 border-t border-border animate-fade-up">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            {/* Qualifications group: flat links to avoid nested-menu touch complexity */}
                            <span className="text-muted-foreground text-sm font-medium opacity-60 pt-1">
                                Qualifications
                            </span>
                            <a
                                href="/cta-tutor"
                                className="text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium py-2 pl-4"
                                onClick={() => setIsOpen(false)}
                            >
                                CTA Tutoring
                            </a>
                            <a
                                href="/pgda-tutor"
                                className="text-muted-foreground hover:text-accent-ink transition-colors duration-300 font-medium py-2 pl-4"
                                onClick={() => setIsOpen(false)}
                            >
                                PGDA Tutoring
                            </a>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    className="w-full"
                                    variant="hero"
                                    asChild
                                >
                                    <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="w-4 h-4" />
                                        Get Started
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
