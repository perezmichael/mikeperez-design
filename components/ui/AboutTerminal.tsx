"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const lines = [
  { text: "$ mike --version", delay: 0 },
  { text: "   __  ___ ___  ____", delay: 400, isArt: true },
  { text: "  /  |/  // _ \\/ __/", delay: 500, isArt: true },
  { text: " / /|_/ // ___/ _/  ", delay: 600, isArt: true },
  { text: "/_/  /_//_/  /___/  v1.0.0", delay: 700, isArt: true },
  { text: "product designer + builder", delay: 900, isAccent: true },
  { text: "", delay: 1000 },
  { text: "$ mike.stack", delay: 1200 },
  { text: "→ design    figma · design systems · ux research", delay: 1400 },
  { text: "→ build     claude code · html/css · prototyping", delay: 1600 },
  { text: "", delay: 1700 },
  { text: "$ mike.now", delay: 1900 },
  { text: "✓  Apple          live events · security credentials", delay: 2100, isSuccess: true },
  { text: "✓  Titan          ai agents · conversational ux", delay: 2300, isSuccess: true },
  { text: "✓  Frequent Flyer events discovery · 1.3K followers", delay: 2500, isSuccess: true },
  { text: "", delay: 2600 },
  { text: "$ █", delay: 2800, isCursor: true },
];

export function AboutTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleLines < lines.length) {
        setVisibleLines(prev => prev + 1);
      }
    }, lines[visibleLines]?.delay ? lines[visibleLines].delay - (lines[visibleLines - 1]?.delay || 0) : 100);

    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 font-mono text-[11px] md:text-xs leading-relaxed overflow-hidden relative group">
      {/* Subtle scan line effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      <div className="relative z-10 space-y-0.5">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className={`
              ${line.isArt ? "text-[var(--color-accent)] opacity-80 leading-[1.1] whitespace-pre" : ""}
              ${line.isAccent ? "text-white font-bold" : "text-white/50"}
              ${line.isSuccess ? "text-white/70" : ""}
              ${line.isCursor ? "animate-pulse text-[var(--color-accent)]" : ""}
            `}
          >
            {line.isSuccess && <span className="text-green-500/60 mr-2">✓</span>}
            {line.isSuccess ? line.text.replace("✓", "").trim() : line.text}
          </motion.div>
        ))}
      </div>

      {/* Terminal window dots */}
      <div className="absolute top-4 right-4 flex gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
