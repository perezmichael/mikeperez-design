"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { labItems } from "@/lib/lab";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const statusLabel: Record<string, string> = {
  shipped: "Shipped",
  beta:    "Beta",
  wip:     "WIP",
};

const statusColor: Record<string, string> = {
  shipped: "text-green-400 bg-green-500/10 border-green-500/20",
  beta:    "text-amber-400 bg-amber-500/10 border-amber-500/20",
  wip:     "text-[var(--color-muted)] bg-white/5 border-white/10",
};

export default function LabPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4"
          >
            The Lab
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] leading-tight mb-5"
          >
            Experiments &<br />explorations.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl"
          >
            Side projects that exist to push ideas further. Maps, particles, generative art —
            things that are interesting before they&apos;re useful.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {labItems.map((item) => (
            <motion.div key={item.slug} variants={fadeUp}>
              <Link href={`/lab/${item.slug}`} className="group block">
                <div
                  className="relative h-64 rounded-2xl overflow-hidden border border-[var(--color-border)] transition-all duration-500 group-hover:border-[var(--color-accent)]/30"
                  style={{ background: item.accent }}
                >
                  {/* Accent glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 30% 50%, ${item.accent}, transparent 70%)` }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Status badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusColor[item.status]}`}>
                        {statusLabel[item.status]}
                      </span>
                      {/* Arrow */}
                      <div className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom text */}
                    <div>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-muted)] mb-2">
                        {item.tags.join(" · ")}
                      </p>
                      <h2 className="text-xl font-semibold text-[var(--color-fg)] mb-1.5 group-hover:text-white transition-colors duration-300">
                        {item.title}
                      </h2>
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-[11px] font-mono text-[var(--color-muted)] text-center"
        >
          More experiments shipping soon.
        </motion.p>

      </div>
    </main>
  );
}
