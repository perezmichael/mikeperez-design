"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-lg backdrop-blur-md">
      <button
        onClick={() => setTheme("dark")}
        className={`relative px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-full transition-colors z-10 ${
          theme === "dark" ? "text-white" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        }`}
      >
        {theme === "dark" && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-[#c8601a] rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Dark AI</span>
      </button>
      
      <button
        onClick={() => setTheme("light")}
        className={`relative px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-full transition-colors z-10 ${
          theme === "light" ? "text-white" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        }`}
      >
        {theme === "light" && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-[#4A6B53] rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Warm Editorial</span>
      </button>
    </div>
  );
}
