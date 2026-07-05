import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MessageCircle, Mail } from "lucide-react";

const benefits = [
    "Personalized 1-on-1 sessions",
    "Flexible scheduling",
    "Real exam strategies",
];

const CTA = () => {
    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-6">
                <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-elevated p-12 md:p-20">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                            Let&apos;s work together to achieve your academic goals. Reach out today for a free consultation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                            <Button
                                size="lg"
                                variant="hero"
                                asChild
                            >
                                <a href="https://wa.me/27713255295" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp Me
                                </a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                            >
                                <a href="mailto:priyankamikaya21@gmail.com">
                                    <Mail className="w-5 h-5" />
                                    Send Email
                                </a>
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="w-5 h-5 text-accent" />
                                    <span className="text-sm font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-muted-foreground text-sm">
                            📞 071 325 5295 &nbsp;|&nbsp; 📧 priyankamikaya21@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
