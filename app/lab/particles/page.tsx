"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useRef } from "react";
import { ParticleSystem, ParticleSystemHandle } from "@/components/lab/ParticleSystem";

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

export default function ParticlesPage() {
  const particleRef = useRef<ParticleSystemHandle>(null);

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
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 02</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Morphing Particles</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A Three.js particle system that shifts between geometric forms. This experiment explores the intersection of 3D math and fluid motion, using custom shaders for the particle interactions.
          </p>
        </motion.div>

        {/* The Experiment */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl relative group"
        >
          {/* Particle Canvas */}
          <div className="absolute inset-0">
            <ParticleSystem ref={particleRef} />
          </div>
          
          {/* Interaction controls overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex gap-2">
              {(["Sphere", "Cube", "Torus", "Cloud"] as const).map((shape) => (
                <button 
                  key={shape}
                  onClick={() => particleRef.current?.setShape(shape)}
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  {shape}
                </button>
              ))}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10">
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Active Particles: 10,000</p>
            </div>
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">The Math</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Each particle is an object in a BufferGeometry, manipulated through a vertex shader. The morphing occurs by interpolating between predefined target positions using a spring-based easing function. This creates the &quot;organic&quot; feel of the transition.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Technical Range</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              This experiment demonstrates my ability to work with lower-level graphics APIs (WebGL via Three.js) and custom shaders, moving beyond standard UI components into generative, math-driven visuals.
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
