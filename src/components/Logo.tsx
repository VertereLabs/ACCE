"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

type Variant = "auto" | "standard" | "reversed";

/**
 * Theme-aware ACCE logo (DESIGN.md: Logo component).
 * - reversed (cream+gold) on dark surfaces; standard (navy) on light surfaces
 * - variant="auto" follows the active theme; force with "standard" / "reversed"
 *   (footers pass "reversed" — they are dark navy in both modes).
 * SSR-safe: renders the reversed mark first (dark is the default theme), then
 * corrects after mount to avoid a hydration mismatch.
 */
const Logo = ({
    variant = "auto",
    showWordmark = true,
    size = 40,
}: {
    variant?: Variant;
    showWordmark?: boolean;
    size?: number;
}) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    useEffect(() => setMounted(true), []);

    let src = "/acce-logo-reversed.png";
    if (variant === "standard") src = "/acce-logo.png";
    else if (variant === "auto" && mounted && resolvedTheme === "light") src = "/acce-logo.png";

    return (
        <span className="flex items-center gap-2.5">
            <Image
                src={src}
                alt="ACCE Tutors logo"
                width={size}
                height={size}
                priority
                className="w-auto"
                style={{ height: size }}
            />
            {showWordmark && (
                <span className="font-display text-2xl font-semibold text-foreground">
                    ACCE Tutors
                </span>
            )}
        </span>
    );
};

export default Logo;
