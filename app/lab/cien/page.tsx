"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { words, initialPhrases, type Phrase, type Word } from "@/lib/cien-data";

const STORAGE_KEY = "cien_progress_v1";

interface CienState {
  masteredIds: string[];
  unlockedIds: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

/* ── 10×10 word grid ─────────────────────────────────────────────── */
function CienGrid({ masteredIds, unlockedIds }: CienState) {
  const cells = Array.from({ length: 100 }, (_, i) => words.find((w) => w.rank === i + 1));

  return (
    <div className="grid grid-cols-10 gap-1.5">
      {cells.map((word, index) => {
        const isMastered = word && masteredIds.includes(word.id);
        const isUnlocked = word && unlockedIds.includes(word.id);
        return (
          <div
            key={index}
            title={word ? `${word.spanish} — ${word.english}` : undefined}
            className={`aspect-square rounded transition-colors duration-300 ${
              isMastered
                ? "bg-[var(--color-accent)]"
                : isUnlocked
                ? "bg-[var(--color-accent)]/30"
                : "bg-[var(--color-surface)] border border-[var(--color-border)]"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ── Flashcard with flip + speech ────────────────────────────────── */
function FlashCard({ phrase, allWords, isFlipped, onFlip }: { phrase: Phrase; allWords: Word[]; isFlipped: boolean; onFlip: () => void }) {
  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.spanish);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const breakdown = phrase.wordIds
    .map((id) => allWords.find((w) => w.id === id))
    .filter((w): w is Word => Boolean(w));

  return (
    <div className="h-72 cursor-pointer select-none" style={{ perspective: "1200px" }} onClick={onFlip}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center justify-center gap-6 p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-3xl md:text-4xl font-semibold text-[var(--color-fg)] text-center">{phrase.spanish}</p>
          <button
            onClick={speak}
            aria-label="Listen in Spanish"
            className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.5 8.5a5 5 0 010 7M18.4 5.6a9 9 0 010 12.8" strokeLinecap="round" />
            </svg>
          </button>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-muted)]">Tap to reveal</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] flex flex-col items-center justify-center gap-5 p-8"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-2xl md:text-3xl font-semibold text-[var(--color-fg)] text-center">{phrase.english}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {breakdown.map((w) => (
              <span
                key={w.id}
                className="font-mono text-[10px] px-2 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-muted)] border border-[var(--color-accent)]/20"
              >
                {w.spanish} = {w.english}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function CienPage() {
  const [state, setState] = useState<CienState>({ masteredIds: [], unlockedIds: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<"grid" | "session" | "complete">("grid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ masteredIds: parsed.masteredIds ?? [], unlockedIds: parsed.unlockedIds ?? [] });
      } catch {
        setState({ masteredIds: [], unlockedIds: words.slice(0, 10).map((w) => w.id) });
      }
    } else {
      setState({ masteredIds: [], unlockedIds: words.slice(0, 10).map((w) => w.id) });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isLoaded]);

  const sessionPhrases = useMemo(
    () => initialPhrases.filter((p) => p.wordIds.some((id) => state.unlockedIds.includes(id))),
    [state.unlockedIds]
  );

  const startSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMode("session");
  };

  const handleGrade = () => {
    const phrase = sessionPhrases[currentIndex];
    // Grading a phrase marks its unlocked words as practiced/mastered
    setState((prev) => ({
      ...prev,
      masteredIds: [...new Set([...prev.masteredIds, ...phrase.wordIds.filter((id) => prev.unlockedIds.includes(id))])],
    }));

    if (currentIndex < sessionPhrases.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    } else {
      // Session complete: unlock the next batch of five words
      setState((prev) => ({
        ...prev,
        unlockedIds: [...prev.unlockedIds, ...words.slice(prev.unlockedIds.length, prev.unlockedIds.length + 5).map((w) => w.id)],
      }));
      setMode("complete");
    }
  };

  const progress = sessionPhrases.length > 0 ? (currentIndex / sessionPhrases.length) * 100 : 0;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-xl mx-auto">
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

        <AnimatePresence mode="wait">
          {mode === "grid" && (
            <motion.div key="grid" initial="hidden" animate="show" exit={{ opacity: 0 }} variants={fadeUp}>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 07</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Cien</h1>
              <p className="text-base text-[var(--color-muted)] leading-relaxed mb-10">
                Speak Spanish with the 100 most common words. Each cell is one word — practice
                phrases to light up the grid. Progress lives in your browser.
              </p>

              <CienGrid masteredIds={state.masteredIds} unlockedIds={state.unlockedIds} />

              <div className="flex items-center gap-6 mt-6 mb-10 font-mono text-xs text-[var(--color-muted)]">
                <span><strong className="text-[var(--color-accent)]">{state.masteredIds.length}</strong> mastered</span>
                <span><strong className="text-[var(--color-fg)]">{state.unlockedIds.length}</strong> unlocked</span>
              </div>

              <button
                onClick={startSession}
                disabled={sessionPhrases.length === 0}
                className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-on-accent)] text-sm font-medium hover:brightness-110 transition-all disabled:opacity-40 shadow-[var(--btn-glow)]"
              >
                Start today&apos;s session
              </button>
            </motion.div>
          )}

          {mode === "session" && sessionPhrases[currentIndex] && (
            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Progress header */}
              <div className="flex items-center gap-4 mb-10">
                <button
                  onClick={() => setMode("grid")}
                  aria-label="End session"
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors text-lg leading-none"
                >
                  ×
                </button>
                <div className="flex-1 h-1 rounded-full bg-[var(--color-surface)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[var(--color-muted)]">
                  {currentIndex + 1}/{sessionPhrases.length}
                </span>
              </div>

              <FlashCard
                key={currentIndex}
                phrase={sessionPhrases[currentIndex]}
                allWords={words}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />

              {/* Grade buttons */}
              <div
                className={`grid grid-cols-3 gap-3 mt-8 transition-opacity duration-300 ${
                  isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {(["Hard", "Good", "Easy"] as const).map((label) => (
                  <button
                    key={label}
                    onClick={handleGrade}
                    className={`py-3 rounded-lg text-sm font-medium transition-all ${
                      label === "Good"
                        ? "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:brightness-110"
                        : "bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-muted)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {mode === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-16">
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Session complete</p>
              <h2 className="text-3xl font-semibold text-[var(--color-fg)] mb-4">
                {sessionPhrases.length} phrases practiced.
              </h2>
              <p className="text-base text-[var(--color-muted)] mb-10">Five new words unlocked for next time.</p>
              <button
                onClick={() => setMode("grid")}
                className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-on-accent)] text-sm font-medium hover:brightness-110 transition-all shadow-[var(--btn-glow)]"
              >
                Back to the grid
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
