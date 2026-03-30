"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

/* ── Web Audio Synthesis ────────────────────────────────────────── */
class DrumSynth {
  ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  playSnare(time: number) {
    if (!this.ctx) return;
    const noise = this.ctx.createBufferSource();
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1000;
    noise.connect(noiseFilter);

    const noiseEnvelope = this.ctx.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const oscEnvelope = this.ctx.createGain();
    osc.type = "triangle";
    osc.connect(oscEnvelope);
    oscEnvelope.connect(this.ctx.destination);

    noiseEnvelope.gain.setValueAtTime(1, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    noise.start(time);

    osc.frequency.setValueAtTime(100, time);
    oscEnvelope.gain.setValueAtTime(0.7, time);
    oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  playHiHat(time: number) {
    if (!this.ctx) return;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 10000;
    osc.connect(filter);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}

/* ── Main Component ─────────────────────────────────────────────── */
const steps = 16;
const initialSequencer = {
  kick:  Array(steps).fill(false),
  snare: Array(steps).fill(false),
  hat:   Array(steps).fill(false),
};

// Seed some defaults
initialSequencer.kick[0] = true;
initialSequencer.kick[8] = true;
initialSequencer.snare[4] = true;
initialSequencer.snare[12] = true;
initialSequencer.hat[0] = true;
initialSequencer.hat[2] = true;
initialSequencer.hat[4] = true;
initialSequencer.hat[6] = true;
initialSequencer.hat[8] = true;
initialSequencer.hat[10] = true;
initialSequencer.hat[12] = true;
initialSequencer.hat[14] = true;

export default function IslaPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [sequence, setSequence] = useState(initialSequencer);
  const synth = useRef<DrumSynth | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    synth.current = new DrumSynth();
  }, []);

  const toggleStep = (track: keyof typeof initialSequencer, index: number) => {
    setSequence((prev) => {
      const next = { ...prev };
      next[track] = [...prev[track]];
      next[track][index] = !prev[track][index];
      return next;
    });
    // Visual/tactile feedback sound
    if (!isPlaying) {
      synth.current?.init();
      const time = synth.current?.ctx?.currentTime || 0;
      if (track === "kick") synth.current?.playKick(time);
      if (track === "snare") synth.current?.playSnare(time);
      if (track === "hat") synth.current?.playHiHat(time);
    }
  };

  const play = useCallback(() => {
    synth.current?.init();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / bpm / 4) * 1000;
      let nextStep = 0;
      
      const tick = () => {
        setCurrentStep(nextStep);
        const time = synth.current?.ctx?.currentTime || 0;
        
        if (sequence.kick[nextStep]) synth.current?.playKick(time);
        if (sequence.snare[nextStep]) synth.current?.playSnare(time);
        if (sequence.hat[nextStep]) synth.current?.playHiHat(time);
        
        nextStep = (nextStep + 1) % steps;
      };

      tick();
      timerRef.current = setInterval(tick, stepDuration);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, bpm, sequence]);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#0f0e0c]">
      <div className="max-w-4xl mx-auto">
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
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-12">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 04</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Isla Beatmaker</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A tactile, web-based drum machine. Built to explore creator tool UX — where latency, visual feedback, and &quot;feel&quot; are more important than traditional metrics.
          </p>
        </motion.div>

        {/* The Experiment */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="p-8 md:p-12 rounded-3xl border border-white/5 bg-[#161512] shadow-2xl"
        >
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <button
                onClick={isPlaying ? stop : play}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isPlaying 
                    ? "bg-red-500/10 border border-red-500/20 text-red-500" 
                    : "bg-[var(--color-accent)] text-white shadow-[0_0_20px_-5px_rgba(200,96,26,0.4)]"
                }`}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div>
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-1">Tempo</p>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="60" max="180" value={bpm} 
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-32 accent-[var(--color-accent)]"
                  />
                  <span className="font-mono text-sm text-white/80">{bpm} BPM</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg border border-white/5 bg-black/20 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                Pattern A
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-white/5 bg-black/20 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                4/4 Time
              </div>
            </div>
          </div>

          {/* Sequencer Grid */}
          <div className="space-y-6">
            {(["kick", "snare", "hat"] as const).map((track) => (
              <div key={track} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{track}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-white/5" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-8 md:grid-cols-16 gap-1.5">
                  {sequence[track].map((active, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(track, i)}
                      className={`aspect-square rounded-md border transition-all duration-75 relative ${
                        active 
                          ? "bg-[var(--color-accent)] border-[var(--color-accent)]" 
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      } ${
                        currentStep === i 
                          ? "ring-2 ring-white/20 scale-105 z-10" 
                          : ""
                      } ${
                        i % 4 === 0 && !active ? "bg-white/[0.08]" : ""
                      }`}
                    >
                      {active && (
                        <motion.div 
                          layoutId={`${track}-${i}`} 
                          className="absolute inset-0 bg-white/20 rounded-md" 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Tactile Feedback</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              When designing tools for creative expression, the feedback loop must be instantaneous. Isla uses the Web Audio API for low-latency synthesis, ensuring that the &quot;pocket&quot; of the beat feels real, not simulated.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Creator UX</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Creator tools are about reducing the friction between thought and sound. This experiment focuses on high-density information display (16 steps) that remains readable and interactive across device sizes.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
