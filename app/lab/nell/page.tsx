import type { Metadata } from "next";
import Link from "next/link";
import NellScene from "@/components/lab/nell/NellScene";

export const metadata: Metadata = {
  title: "Nell — Mike Perez Lab",
  description:
    "A recreation of nell.ai's stealth landing: a full-bleed deep-red WebGL shader under almost no chrome.",
};

export default function NellPage() {
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
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 07</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Nell</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A recreation of{" "}
            <a
              href="https://nell.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              nell.ai
            </a>
            , the stealth media startup&apos;s landing page. The whole site is
            one mood: the manifesto rendered as a wall of animated ASCII. A
            domain-warped noise field drives each glyph&apos;s color and
            scrambles characters in the turbulent zones — the copy stays
            readable where it&apos;s calm and dissolves into noise where it
            churns. The &ldquo;manifesto&rdquo; button drives a procedural
            ambient drone. Move your cursor to push the smoke, and hit play.
          </p>
        </div>

        {/* The scene */}
        <div className="h-[80vh] min-h-[480px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl">
          <NellScene />
        </div>

        <p className="mt-6 text-[11px] font-mono text-[var(--color-muted)]">
          Recreated from the live site, 2026. Shader and audio are original — the
          private manifesto asset was not used.
        </p>
      </div>
    </main>
  );
}
