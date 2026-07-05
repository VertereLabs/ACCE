import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-display text-8xl font-bold text-primary-foreground mb-4">404</h1>
                <p className="text-xl text-primary-foreground/70 mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link href="/">
                    <Button variant="hero">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
