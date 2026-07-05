"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-6">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-muted-foreground">
                                PGDA & BCom Accounting Tutoring
                            </span>
                        </div>

                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
                            Your Path to{" "}
                            <span className="text-accent-light">CA(SA)</span>
                            {" "}Success
                        </h1>

                        <p className="text-xl text-foreground mb-8 max-w-lg leading-relaxed">
                            Using my journey to encourage and mentor others through a challenging but rewarding journey. Expert guidance in Financial Accounting, Taxation, Management Accounting & Auditing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="hero"
                                size="lg"
                                asChild
                            >
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                            >
                                <a href="#services">
                                    View Subjects
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Visual - Priyanka Card */}
                    <div className="relative animate-fade-up-delayed hidden lg:block">
                        <div className="relative">
                            {/* Main Card */}
                            <div className="bg-card rounded-3xl p-8 border border-border shadow-elevated">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-accent/30">
                                        <Image
                                            src="/images/priyanka.png"
                                            alt="Priyanka Govender"
                                            width={96}
                                            height={96}
                                            className="object-cover w-full h-full"
                                            sizes="96px"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-semibold text-foreground">Priyanka Govender</h3>
                                        <p className="text-sm text-muted-foreground">PGDA Graduate | ACCE Tutors Founder</p>
                                    </div>
                                </div>
                                <blockquote className="text-muted-foreground italic leading-relaxed border-l-2 border-accent pl-4">
                                    &quot;I am living proof that anything is possible. Short-term sacrifices do pay off in the long term.&quot;
                                </blockquote>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full hero-tag text-sm">Financial Accounting</span>
                                    <span className="px-3 py-1 rounded-full hero-tag text-sm">Taxation</span>
                                    <span className="px-3 py-1 rounded-full hero-tag text-sm">Management Accounting</span>
                                    <span className="px-3 py-1 rounded-full hero-tag text-sm">Auditing</span>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-card rounded-2xl p-4 border border-border shadow-elevated animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">PGDA Complete</p>
                                        <p className="text-xs text-muted-foreground">Milpark Education</p>
                                    </div>
                                </div>
                            </div>

                            {/* Improvement badge removed per request */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
