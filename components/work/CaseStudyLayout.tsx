"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";

/* ── Animation variants ─────────────────────────────────────────── */
const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Types ──────────────────────────────────────────────────────── */
interface CaseStudyMeta {
  company:     string;
  title:       string;
  role:        string;
  year:        string;
  tags:        string[];
  oneLiner:    string;
  isNDA?:      boolean;
  accentColor?: string;
}

interface CaseStudyLayoutProps {
  meta:     CaseStudyMeta;
  children: React.ReactNode;
}

/* ── Main Layout ────────────────────────────────────────────────── */
export function CaseStudyLayout({ meta, children }: CaseStudyLayoutProps) {
  const accent = meta.accentColor ?? "var(--color-accent)";

  return (
    <article>
      {/* Hero */}
      <motion.div
        className="border-b border-[var(--color-border)] py-20 lg:py-28"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <Container>
          {/* Back */}
          <motion.div variants={fadeUp}>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-10"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 6H2M6 10l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All work
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              {/* Company + NDA */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>
                  {meta.company}
                </span>
                {meta.isNDA && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] tracking-widest uppercase">
                    NDA · Recreated
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl lg:text-6xl font-semibold text-[var(--color-fg)] tracking-tight leading-tight mb-5"
              >
                {meta.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-[var(--color-muted)] max-w-2xl leading-relaxed"
              >
                {meta.oneLiner}
              </motion.p>
            </div>

            {/* Meta sidebar */}
            <motion.div variants={fadeUp} className="flex flex-row lg:flex-col gap-6 lg:gap-5 lg:text-right">
              <div>
                <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-1">Role</p>
                <p className="text-sm text-[var(--color-fg)]">{meta.role}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-1">Year</p>
                <p className="text-sm text-[var(--color-fg)]">{meta.year}</p>
              </div>
            </motion.div>
          </div>

          {/* Tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-[var(--color-border)]">
            {meta.tags.map((tag) => (
              <Tag key={tag} variant="default">{tag}</Tag>
            ))}
          </motion.div>

          {/* NDA notice */}
          {meta.isNDA && (
            <motion.p variants={fadeUp} className="mt-4 font-mono text-xs text-[var(--color-muted)] leading-relaxed max-w-xl">
              Screens recreated with representative data to protect proprietary information. All interaction patterns and design decisions are authentic.
            </motion.p>
          )}
        </Container>
      </motion.div>

      {/* Content */}
      <div className="py-16 lg:py-24">
        {children}
      </div>
    </article>
  );
}

/* ── Section building blocks ──────────────────────────────────── */

export function CSSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <Container className={`mb-20 lg:mb-28 ${className ?? ""}`}>
        {children}
      </Container>
    </motion.div>
  );
}

export function CSSectionLabel({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <motion.div variants={fadeUp} className="mb-10">
      <p className="font-mono text-xs text-[var(--color-accent)] tracking-widest uppercase mb-3">{label}</p>
      <h2 className="text-2xl lg:text-3xl font-semibold text-[var(--color-fg)] tracking-tight mb-4">{title}</h2>
      {description && (
        <p className="text-[var(--color-muted)] leading-relaxed max-w-2xl">{description}</p>
      )}
    </motion.div>
  );
}

export function CSPullQuote({ children }: { children: React.ReactNode }) {
  return (
    <motion.blockquote
      variants={fadeUp}
      className="border-l-2 border-[var(--color-accent)] pl-6 py-1 my-8"
    >
      <p className="text-lg lg:text-xl text-[var(--color-fg)] leading-relaxed italic">{children}</p>
    </motion.blockquote>
  );
}

export function CSScreenGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <motion.div
      variants={stagger}
      className={`grid grid-cols-1 ${cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4 mt-8`}
    >
      {children}
    </motion.div>
  );
}

export function CSScreen({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-3 group">
      <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)] transition-all duration-500 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[0_0_40px_-12px_rgba(200,96,26,0.15)]">
        {children}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-fg)]">{title}</p>
        {description && <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </motion.div>
  );
}

export function CSInsightGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {children}
    </motion.div>
  );
}

export function CSInsight({ number, label, description }: { number: string; label: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/20 transition-colors duration-300"
    >
      <p className="font-mono text-2xl font-bold text-[var(--color-accent)] mb-1">{number}</p>
      <p className="text-sm font-medium text-[var(--color-fg)] mb-2">{label}</p>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}
