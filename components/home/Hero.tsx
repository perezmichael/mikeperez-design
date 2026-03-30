"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(200,96,26,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Second softer glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 30% 80%, rgba(212,168,83,0.06) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Status pill */}
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-accent)] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Currently at Apple · Los Angeles
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.92] tracking-tight text-[var(--color-fg)] mb-6"
          >
            Mike<br />
            <span className="text-[var(--color-muted)]">Perez</span>
          </motion.h1>

          {/* Descriptor line */}
          <motion.div
            variants={item}
            className="mb-10 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8"
          >
            <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-md leading-snug">
              Product designer for creative teams.{" "}
              <em className="not-italic text-[var(--color-fg)]">
                I build the things I design.
              </em>
            </p>
            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-[var(--color-border)]" />
            <p className="font-mono text-xs text-[var(--color-muted)] leading-relaxed max-w-xs">
              10+ years of enterprise design.<br />
              AI-native since before it was a buzzword.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-fg)] text-sm font-medium hover:brightness-110 transition-all"
            >
              View Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7h10M7 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] text-sm font-medium hover:text-[var(--color-fg)] hover:border-[var(--color-muted)] transition-all"
            >
              Explore the Lab
            </Link>
          </motion.div>

        </motion.div>
      </Container>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-muted)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
