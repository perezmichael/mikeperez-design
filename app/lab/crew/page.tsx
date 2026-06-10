import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import CrewScene from "@/components/lab/crew/CrewScene";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Crew — Mike Perez Lab",
  description:
    "A landing page that plays like a music video. Beat-synced visuals driven by a hand-keyed frequency timeline.",
};

export default function CrewPage() {
  return (
    <main className={`min-h-screen pt-32 pb-24 px-6 ${bebas.variable}`}>
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
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 06</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Crew</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            A portfolio landing that plays like a music video. The visuals are beat-synced to
            &ldquo;Crew&rdquo; by GoldLink — streamed from SoundCloud while a hand-keyed frequency
            timeline drives the rings, glow, and scan lines. Click the gate to enter, then try
            typing <span className="font-mono text-[var(--color-accent)]">C-R-E-W</span>.
          </p>
        </div>

        {/* The scene */}
        <div className="h-[80vh] min-h-[480px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl">
          <CrewScene />
        </div>

        <p className="mt-6 text-[11px] font-mono text-[var(--color-muted)]">
          Originally built as a standalone site experiment, 2026. Ported into the lab intact.
        </p>
      </div>
    </main>
  );
}
