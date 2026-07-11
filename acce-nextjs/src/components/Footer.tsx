import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import Logo from "@/components/Logo";

const footerLinks = {
    subjects: [
        { name: "Financial Accounting", href: "/accounting-tutor" },
        { name: "Taxation", href: "/tax-tutor" },
        { name: "Management Accounting & Finance", href: "/financial-management-tutor" },
        { name: "Auditing", href: "/auditing-tutor" },
        { name: "All Subjects", href: "/subjects" },
    ],
    resources: [
        { name: "About Priyanka", href: "/about" },
        { name: "Group Classes", href: "/group-classes" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Guides", href: "/guides" },
    ],
    support: [
        { name: "Contact", href: "/contact" },
        { name: "WhatsApp", href: "https://wa.me/27713255295" },
        { name: "Privacy Policy", href: "#" },
    ],
};

const Footer = () => {
    return (
        <footer className="bg-footer text-footer-foreground border-t border-white/10">
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-6">
                            <Logo variant="reversed" showWordmark={false} />
                            <span className="font-display text-2xl font-semibold text-footer-foreground">
                                ACCE Tutors
                            </span>
                        </div>
                        <p className="text-footer-foreground/60 mb-6 max-w-xs leading-relaxed">
                            Empowering PGDA and BCom Accounting students to achieve their CA(SA) dreams through personalized mentorship.
                        </p>
                        <div className="space-y-3">
                            <a href="mailto:priyankamikaya21@gmail.com" className="flex items-center gap-3 text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>priyankamikaya21@gmail.com</span>
                            </a>
                            <a href="tel:+27713255295" className="flex items-center gap-3 text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>071 325 5295</span>
                            </a>
                            <div className="flex items-center gap-3 text-footer-foreground/60">
                                <MapPin className="w-5 h-5" />
                                <span>South Africa</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-display font-semibold text-footer-foreground mb-4">Subjects</h4>
                        <ul className="space-y-3">
                            {footerLinks.subjects.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-footer-foreground/60 hover:text-footer-foreground transition-colors text-sm">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-footer-foreground mb-4">Explore</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-footer-foreground/60 hover:text-footer-foreground transition-colors text-sm">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-footer-foreground mb-4">Contact</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-footer-foreground/60 hover:text-footer-foreground transition-colors text-sm"
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-footer-foreground/40 text-sm">
                        © 2026 ACCE Tutors. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/acce.tutorscta/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent text-footer-foreground hover:text-accent-foreground transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/priyanka-govender21-724096186/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent text-footer-foreground hover:text-accent-foreground transition-all duration-300"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
