"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Subjects", href: "/#services" },
        { name: "About", href: "/#about" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Guides", href: "/guides" },
        { name: "Contact", href: "/#contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/40 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                            <span className="text-accent-foreground font-display font-bold text-xl">A</span>
                        </div>
                        <span className="font-display text-2xl font-semibold text-primary-foreground">
                            ACCE Tutors
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300 font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-primary-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-6 border-t border-white/10 animate-fade-up">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300 font-medium py-2"
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
