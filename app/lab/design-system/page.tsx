"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { AIInstruction } from "@/components/ui/AIInstruction";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#0f0e0c]">
      <div className="max-w-5xl mx-auto">
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
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-20">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 05</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">AI-Native<br />Design System</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-2xl">
            A living component library where every element is documented alongside the AI instructions used to generate its first iteration. This is the foundation of my <span className="text-white italic">Vibe Coding</span> methodology — maintaining a tight loop between intent and execution.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={container} className="space-y-32">
          
          {/* Colors */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">01 — Palette</h2>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Global Tokens</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { name: "Accent", hex: "#C8601A", variable: "--color-accent" },
                { name: "Background", hex: "#0F0E0C", variable: "--color-bg" },
                { name: "Surface", hex: "#161512", variable: "--color-surface" },
                { name: "Foreground", hex: "#F5F5F0", variable: "--color-fg" },
                { name: "Muted", hex: "#8A8882", variable: "--color-muted" },
              ].map((color) => (
                <div key={color.name} className="group">
                  <div 
                    className="aspect-square rounded-2xl border border-white/5 mb-3 transition-transform group-hover:scale-[1.02]" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-medium text-white">{color.name}</p>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-tight mt-1">{color.variable}</p>
                  <p className="font-mono text-[9px] text-white/20 mt-0.5">{color.hex}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 max-w-2xl">
              <AIInstruction 
                label="System Prompt"
                prompt="Define a design token system for a premium, tech-editorial portfolio. Use a warm, high-contrast palette: a burnt orange accent, cream foreground, and deep olive-black background. Map these to CSS variables for consistency across all components." 
              />
            </div>
          </motion.section>

          {/* Typography */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">02 — Typography</h2>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Type Scales</span>
            </div>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-baseline">
                <span className="font-mono text-[10px] text-white/20 w-32 shrink-0">Headings / Space Grotesk</span>
                <div className="space-y-4">
                  <h1 className="text-5xl font-semibold text-white">The quick brown fox</h1>
                  <h2 className="text-3xl font-medium text-white/80">Jumps over the lazy dog</h2>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-baseline">
                <span className="font-mono text-[10px] text-white/20 w-32 shrink-0">Body / Sans Serif</span>
                <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
                  Grumpy wizards make toxic brew for the evil Queen and Jack. Consistency is the key to a successful design system. Every pixel should have a purpose, and every decision should be rooted in logic.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-baseline">
                <span className="font-mono text-[10px] text-white/20 w-32 shrink-0">Mono / Space Mono</span>
                <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest">
                  System.Log(&quot;Design system initialized successfully&quot;);
                </p>
              </div>
            </div>
            <div className="mt-12 max-w-2xl">
              <AIInstruction 
                label="Type Strategy"
                prompt="Select a typographic pairing that feels both technical and cinematic. Use Space Grotesk for bold headings, a clean system sans-serif for readability in body text, and Space Mono for labels, data, and metadata. Ensure the scale follows a 1.25x major third progression." 
              />
            </div>
          </motion.section>

          {/* Buttons */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">03 — Buttons</h2>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Interactive</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <AIInstruction 
                prompt="Create a flexible Button component in React using Tailwind CSS. Support variants (primary, secondary, ghost, outline) and sizes (sm, md, lg). Use CSS variables for colors (accent, surface, border) to ensure theme consistency." 
              />
            </div>
          </motion.section>

          {/* Cards */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">04 — Cards</h2>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Containers</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h3 className="text-sm font-medium text-white mb-2">Static Card</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    A basic container for content that doesn&apos;t require interaction.
                  </p>
                </Card>
                <Card hover className="p-5">
                  <h3 className="text-sm font-medium text-white mb-2">Interactive Card</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    Includes a subtle translate-y and border transition on hover.
                  </p>
                </Card>
              </div>
              <AIInstruction 
                prompt="Build a versatile Card component with sub-components for Body and Image. Focus on subtle borders, rounded corners, and smooth hover transitions for a premium 'magazine' feel." 
              />
            </div>
          </motion.section>

          {/* Tags */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">05 — Tags</h2>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Classification</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-wrap gap-2">
                <Tag variant="default">Default</Tag>
                <Tag variant="accent">Accent</Tag>
                <Tag variant="outline">Outline</Tag>
                <Tag variant="muted">Muted</Tag>
              </div>
              <AIInstruction 
                prompt="Implement a Tag component for categorizing items. Use a monospace font, support multiple color variants (default, accent, muted, outline), and ensure it fits a minimalist, tech-forward aesthetic." 
              />
            </div>
          </motion.section>

        </motion.div>

        {/* Closing */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 pt-16 border-t border-white/5 text-center"
        >
          <p className="text-sm text-[var(--color-muted)]">
            This design system is built with <span className="text-white">Next.js</span>, <span className="text-white">Tailwind 4</span>, and <span className="text-white">Claude Code</span>.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
