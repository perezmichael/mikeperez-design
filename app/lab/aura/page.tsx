"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

export default function AuraPage() {
  const [input, setInput] = useState("");
  const [vibe, setVibe] = useState<{ label: string; color: string; intensity: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeVibe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setVibe(null);

    // Simulate AI sentiment analysis
    setTimeout(() => {
      const text = input.toLowerCase();
      let newVibe = { label: "Neutral", color: "from-blue-500/20 to-purple-500/20", intensity: 0.5 };

      if (text.includes("happy") || text.includes("excited") || text.includes("love")) {
        newVibe = { label: "Radiant", color: "from-orange-500/40 to-yellow-500/30", intensity: 0.8 };
      } else if (text.includes("sad") || text.includes("blue") || text.includes("dark")) {
        newVibe = { label: "Melancholic", color: "from-indigo-800/40 to-slate-900/40", intensity: 0.4 };
      } else if (text.includes("angry") || text.includes("fire") || text.includes("intense")) {
        newVibe = { label: "Electric", color: "from-red-600/40 to-orange-600/30", intensity: 0.9 };
      } else if (text.includes("calm") || text.includes("peace") || text.includes("nature")) {
        newVibe = { label: "Serene", color: "from-emerald-500/30 to-teal-600/20", intensity: 0.3 };
      }

      setVibe(newVibe);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#0f0e0c] overflow-hidden">
      {/* Background Aura Visual */}
      <AnimatePresence>
        {vibe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`fixed inset-0 pointer-events-none bg-gradient-to-br ${vibe.color} blur-[120px] opacity-30 z-0`}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back */}
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-12"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 6H2M6 10l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Lab
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-12 text-center flex flex-col items-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 03</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Aura</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A sentiment-to-visual bridge. Type how you&apos;re feeling, and the interface transforms to match your emotional state using real-time NLP analysis.
          </p>
        </motion.div>

        {/* The Experiment */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="max-w-xl mx-auto"
        >
          <div className="p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md shadow-2xl">
            <form onSubmit={analyzeVibe} className="space-y-6">
              <div>
                <label className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3 block">Current Mood</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="I'm feeling incredibly inspired today, like everything is falling into place..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[var(--color-accent)]/40 transition-all min-h-[120px] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isAnalyzing}
                className="w-full py-4 rounded-2xl bg-[var(--color-accent)] text-white text-sm font-medium hover:brightness-110 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                  </>
                ) : (
                  "Analyze Vibe"
                )}
              </button>
            </form>

            <AnimatePresence>
              {vibe && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-white/5 text-center"
                >
                  <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">Detected Aura</p>
                  <p className="text-2xl font-semibold text-white mb-2">{vibe.label}</p>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-4 rounded-full transition-all duration-500 ${
                          i / 5 <= vibe.intensity ? "bg-[var(--color-accent)]" : "bg-white/10"
                        }`} 
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Emotional UI</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Standard UIs are static. Aura explores the idea of &quot;empathetic interfaces&quot; that adapt to the user&apos;s emotional context. This has massive implications for mental health tools, personalized media, and creative workflows.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-4">AI Integration</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              This experiment uses a simple keyword-based sentiment analysis for the demo, but is architected to pipe raw text into an LLM (like Claude) for deep semantic analysis and generative visual parameters.
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
