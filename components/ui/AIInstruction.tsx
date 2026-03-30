"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AIInstructionProps {
  prompt: string;
  label?: string;
  className?: string;
}

export function AIInstruction({ prompt, label = "Claude Code Prompt", className }: AIInstructionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border border-white/5 bg-black/40 overflow-hidden font-mono text-[11px] group ${className ?? ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-white/40 tracking-widest uppercase text-[9px]">{label}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="text-white/20 hover:text-white/60 transition-colors flex items-center gap-1.5"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-green-400"
              >
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                Copy
              </motion.span>
            )}
          </AnimatePresence>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <path d="M2 9V3a1 1 0 011-1h6" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-3 relative overflow-hidden">
        {/* Subtle scan line effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-30" />
        
        <p className="text-white/60 leading-relaxed whitespace-pre-wrap relative z-10">
          <span className="text-[var(--color-accent)] mr-2">$</span>
          {prompt}
        </p>
      </div>
    </div>
  );
}
