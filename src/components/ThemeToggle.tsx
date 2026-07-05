"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Navbar theme toggle (DESIGN.md: "Theme toggle" component; EXPERIENCE.md: Interaction Primitives).
 * Ghost icon-button, keyboard-operable, aria-label reflects the TARGET mode.
 * Mounted guard avoids a hydration mismatch on first paint.
 */
const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";
    const target = isDark ? "light" : "dark";

    return (
        <button
            type="button"
            aria-label={mounted ? `Switch to ${target} mode` : "Toggle theme"}
            onClick={() => setTheme(target)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-accent-ink hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {/* Render both, cross-fade by opacity; only the active one is visible */}
            <Sun className={`w-5 h-5 ${mounted && !isDark ? "block" : "hidden"}`} />
            <Moon className={`w-5 h-5 ${mounted && isDark ? "block" : "hidden"}`} />
            {!mounted && <Sun className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;
