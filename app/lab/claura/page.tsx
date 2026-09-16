import type { Metadata } from "next";
import Link from "next/link";
import ClauraSite from "@/components/lab/claura/ClauraSite";

export const metadata: Metadata = {
  title: "Claura — Mike Perez Lab",
  description:
    "A motion study recreating the Claura Framer template: drifting gradient auras, blur-in hero, count-up stats, marquee, scroll reveals, and a scroll-driven timeline.",
};

export default function ClauraPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-12"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 6H2M6 10l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Lab
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 08</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Claura</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A motion study recreating the{" "}
            <a
              href="https://claura.framer.ai/?via=hxmzaehsan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Claura
            </a>{" "}
            Framer template by Hamza Ehsan — an AI-agency landing page. The focus
            is the motion: drifting gradient auras, a word-by-word blur-in hero,
            a count-up stat, an infinite logo marquee, scroll-reveal sections
            (fade + rise + de-blur), pointer-following card glows, and a
            scroll-driven process timeline. Scroll through it and hover the
            cards.
          </p>
        </div>

        {/* The recreation */}
        <div className="rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl">
          <ClauraSite />
        </div>

        <p className="mt-6 text-[11px] font-mono text-[var(--color-muted)]">
          Recreated from the live template, 2026. Palette and copy approximated
          from the original; all motion is original framer-motion / CSS.
        </p>
      </div>
    </main>
  );
}
