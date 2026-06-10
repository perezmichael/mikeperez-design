"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEnergyAt } from "@/lib/crewTimeline";
import MusicPlayer, { MusicPlayerHandle } from "./MusicPlayer";
import FrequencyVisualizer from "./FrequencyVisualizer";

const GOLD = "#d4a843";
const CORAL = "#ff5c4a";
const INK = "#0a0a12";
const BONE = "#f0ede6";

interface AudioEnergy {
  bass: number;
  mid: number;
  high: number;
  isBeat: boolean;
}

/* Hand-keyed timeline playback synced to the SoundCloud stream */
function useAudioAnalyser() {
  const [energy, setEnergy] = useState<AudioEnergy>({ bass: 0, mid: 0, high: 0, isBeat: false });
  const [isPlaying, setIsPlaying] = useState(false);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (!isPlaying || startTime.current === null) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const elapsed = Date.now() - startTime.current;
    setEnergy(getEnergyAt(elapsed));
    rafRef.current = requestAnimationFrame(tick);
  }, [isPlaying]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return { energy, startTime, isPlaying, setIsPlaying };
}

interface Dot {
  x: number;
  y: number;
  id: number;
}

export default function CrewScene() {
  const [hasEntered, setHasEntered] = useState(false);
  const [scanOpacity, setScanOpacity] = useState(0.04);
  const [invertPage, setInvertPage] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dotIdRef = useRef(0);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const { energy, startTime, isPlaying, setIsPlaying } = useAudioAnalyser();

  const handleEnter = useCallback(() => {
    setHasEntered(true);
    startTime.current = Date.now();
    setIsPlaying(true);
    musicPlayerRef.current?.play();
  }, [startTime, setIsPlaying]);

  // Scan line intensity pulses on the beat
  useEffect(() => {
    if (energy.isBeat) {
      setScanOpacity(0.12);
      const timer = setTimeout(() => setScanOpacity(0.04), 120);
      return () => clearTimeout(timer);
    }
  }, [energy.isBeat]);

  // Cursor trail, scoped to the scene container
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursor({ x, y });
      const id = dotIdRef.current++;
      const trailLength = Math.floor(4 + energy.bass * 10);
      setDots((prev) => [{ x, y, id }, ...prev].slice(0, trailLength));
    },
    [energy.bass]
  );

  // C-R-E-W easter egg: invert flash + confetti
  useEffect(() => {
    const sequence = ["c", "r", "e", "w"];
    let typed: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      typed.push(e.key.toLowerCase());
      typed = typed.slice(-4);
      if (typed.join("") === sequence.join("")) {
        setInvertPage(true);
        setTimeout(() => setInvertPage(false), 200);

        const colors = [GOLD, CORAL, BONE];
        for (let i = 0; i < 30; i++) {
          const el = document.createElement("div");
          el.style.cssText = `
            position: fixed;
            z-index: 99999;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
            pointer-events: none;
            animation: crew-confetti-fall ${Math.random() * 1.5 + 0.8}s ease-in forwards;
          `;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2500);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setCursor({ x: -100, y: -100 });
        setDots([]);
      }}
      className="relative w-full h-full overflow-hidden cursor-none"
      style={{
        background: INK,
        filter: invertPage ? "invert(1)" : "none",
        transition: "filter 0.05s",
      }}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: scanOpacity,
          zIndex: 2,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          transition: "opacity 0.1s ease",
        }}
      />

      {/* Background radial glow — pulses with bass */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 30% 80%, rgba(212,168,67,${0.03 + energy.bass * 0.08}) 0%, transparent 65%)`,
          zIndex: 0,
          transition: "background 0.1s",
        }}
      />

      {/* Canvas visualizer */}
      <FrequencyVisualizer
        bass={energy.bass}
        mid={energy.mid}
        high={energy.high}
        isBeat={energy.isBeat}
        isPlaying={isPlaying}
      />

      {/* Beat pill */}
      {isPlaying && (
        <div
          className="absolute top-5 right-5 z-30 px-3 py-1.5 border rounded-full font-mono transition-colors duration-75"
          style={{
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: energy.isBeat ? INK : "rgba(212,168,67,0.55)",
            borderColor: "rgba(212,168,67,0.25)",
            backgroundColor: energy.isBeat ? GOLD : "transparent",
          }}
        >
          ♫ CREW — GOLDLINK
        </div>
      )}

      {/* Hero text */}
      <motion.div
        className="absolute left-0 bottom-0 z-10 pl-[5%] pb-[10%] select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEntered ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="font-mono text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: "rgba(212,168,67,0.55)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : 12 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          DESIGNER / PORTFOLIO / 2026
        </motion.p>

        <div
          style={{
            lineHeight: 0.88,
            textShadow: `0 0 ${energy.bass * 40 + (energy.isBeat ? 60 : 0)}px rgba(212,168,67,${0.05 + energy.bass * 0.3})`,
          }}
        >
          {[
            { text: "MIKE", color: BONE },
            { text: "PEREZ", color: GOLD },
          ].map((word, i) => (
            <motion.div
              key={word.text}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : 40 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="crew-display block"
                style={{ fontSize: "clamp(60px, 9vw, 140px)", color: word.color, letterSpacing: "0.02em" }}
              >
                {word.text}
                {i === 1 && <span style={{ color: CORAL }}>.</span>}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-6 font-mono text-xs tracking-[0.2em] uppercase"
          style={{ color: "rgba(240,237,230,0.3)", maxWidth: "40ch" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hasEntered ? 1 : 0 }}
          transition={{ delay: 0.55, duration: 0.9 }}
        >
          Building interfaces that feel like music.
        </motion.p>
      </motion.div>

      {/* Floating credits marquee */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            className="absolute bottom-4 left-0 right-0 z-20 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <div className="crew-marquee inline-block">
              <span
                className="font-mono text-xs tracking-[0.3em] uppercase"
                style={{ color: "rgba(212,168,67,0.4)" }}
              >
                ♫&nbsp;&nbsp;CREW — GOLDLINK FT. BRENT FAIYAZ &amp; SHY GLIZZY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor + trail */}
      <div
        className="absolute pointer-events-none z-[60] w-3 h-3 rounded-full border"
        style={{
          left: cursor.x - 6,
          top: cursor.y - 6,
          borderColor: GOLD,
          transition: "left 0.05s, top 0.05s",
        }}
      />
      {dots.map((dot, i) => (
        <div
          key={dot.id}
          className="absolute pointer-events-none z-[59] rounded-full"
          style={{
            left: dot.x - 3,
            top: dot.y - 3,
            width: 6,
            height: 6,
            backgroundColor: GOLD,
            opacity: (1 - i / dots.length) * 0.18,
            transform: `scale(${1 - i / dots.length})`,
          }}
        />
      ))}

      {/* Hidden music player */}
      <MusicPlayer ref={musicPlayerRef} />

      {/* Entry gate */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="gate"
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: INK }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            onClick={handleEnter}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(212,168,67,0.07) 0%, transparent 70%)",
              }}
            />

            <div className="relative select-none text-center">
              <motion.p
                className="font-mono text-xs tracking-[0.4em] uppercase mb-8"
                style={{ color: "rgba(212,168,67,0.6)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                DESIGNER / PORTFOLIO / 2026
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="crew-display leading-none"
                  style={{
                    fontSize: "clamp(60px, 12vw, 160px)",
                    color: BONE,
                    letterSpacing: "0.02em",
                    lineHeight: 0.9,
                  }}
                >
                  MIKE
                  <br />
                  <span style={{ color: GOLD }}>PEREZ</span>
                  <span style={{ color: CORAL }}>.</span>
                </h2>
              </motion.div>

              <motion.p
                className="mt-8 font-mono text-xs tracking-[0.25em] uppercase"
                style={{ color: "rgba(240,237,230,0.35)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                LOS ANGELES
              </motion.p>
            </div>

            <motion.div
              className="absolute bottom-10 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <div className="crew-pulse-dot w-2 h-2 rounded-full" style={{ background: GOLD }} />
              <p
                className="font-mono text-xs tracking-[0.35em] uppercase"
                style={{ color: "rgba(212,168,67,0.7)" }}
              >
                PRESS ANYWHERE TO ENTER
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
