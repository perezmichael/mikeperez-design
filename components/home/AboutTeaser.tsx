"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

const companies = ["Apple", "Charles Schwab", "ADP", "Honeywell", "Allma", "Bulla"];

export function AboutTeaser() {
  return (
    <section className="border-t border-[var(--color-border)] py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs text-[var(--color-accent)] tracking-widest uppercase mb-4">
              About
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--color-fg)] leading-snug mb-6">
              Designer. Builder.{" "}
              <span className="text-[var(--color-muted)]">
                Currently at Apple.
              </span>
            </h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-8">
              I work on creative operations, live events, and production tooling at Apple.
              On the side, I run Frequent Flyer — an LA events platform I validated on Instagram
              before writing a single line of code. I build all my prototypes with Claude Code,
              which means my ideas go from Figma to working product in hours, not weeks.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-accent)] hover:gap-3 transition-all"
            >
              Full story
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase mb-6">
              Trusted by
            </p>
            <div className="grid grid-cols-2 gap-3">
              {companies.map((name) => (
                <div
                  key={name}
                  className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  <span className="text-sm text-[var(--color-muted)] font-medium">{name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
