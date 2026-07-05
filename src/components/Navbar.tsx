"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Subjects", href: "/#services" },
        { name: "Group Classes", href: "/#group-classes" },
        { name: "About", href: "/#about" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Guides", href: "/guides" },
        { name: "Contact", href: "/#contact" },
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
