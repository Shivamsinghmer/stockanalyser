"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-[var(--muted)] animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)] text-[var(--foreground)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun size={18} className="text-[var(--primary)]" /> : <Moon size={18} />}
    </button>
  );
}
