"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function VibesPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibeLevel, setVibeLevel] = useState(0);

  // Simulate audio reactive data
  useEffect(() => {
    if (!isPlaying) {
      setVibeLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setVibeLevel(Math.random());
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background visualizer elements */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {isPlaying && (
            <>
              {/* Central pulsing glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 0.3 + (vibeLevel * 0.4), 
                  scale: 1 + (vibeLevel * 0.2),
                }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/40 to-purple-600/30 blur-[150px]"
              />
              
              {/* Dynamic rings */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2 + (vibeLevel * 0.5), 1],
                    opacity: [0.1, 0.2 + (vibeLevel * 0.3), 0.1],
                  }}
                  transition={{
                    duration: 2 / i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 border border-white/5 rounded-full"
                  style={{ margin: `${i * 10}%` }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">Experience 00</p>
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter mb-12">/vibes</h1>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-full group bg-gradient-to-br from-[var(--color-accent)] to-purple-600 group-hover:from-[var(--color-accent)] group-hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-800 transition-all"
          >
            <span className="relative px-12 py-4 transition-all ease-in duration-75 bg-black rounded-full group-hover:bg-opacity-0">
              {isPlaying ? "STOP AUDIO" : "START AUDIO"}
            </span>
          </button>
          
          <p className="mt-8 font-mono text-[10px] text-white/20 uppercase tracking-widest">
            {isPlaying ? "Audio Reactivity Active" : "Click to initialize visualizer"}
          </p>
        </motion.div>
      </div>

      {/* Visualizer bars at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 px-4 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? `${10 + (vibeLevel * Math.random() * 90)}%` : "4px",
              opacity: isPlaying ? 0.3 + (vibeLevel * 0.7) : 0.1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="w-1 md:w-2 bg-[var(--color-accent)] rounded-t-full"
          />
        ))}
      </div>

      {/* Back button */}
      <Link
        href="/about"
        className="fixed top-8 left-8 font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 6H2M6 10l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Return
      </Link>

      {/* Info toggle */}
      <div className="fixed top-8 right-8 text-right">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
          Build v3.2 · March 2026
        </p>
      </div>
    </main>
  );
}
