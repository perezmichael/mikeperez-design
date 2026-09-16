"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { VALIO } from "@/lib/valio-data";
import { IconArrowUpRight, QrPlate, QrSheet } from "./QrSheet";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function CardA({ qrs }: { qrs: Record<string, string> }) {
  const [sheet, setSheet] = useState<number | null>(null);

  return (
    <div data-valio data-theme="isla" className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)]">
      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]"
      >
        <motion.div variants={rise} className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-[var(--color-surface)]">
            <Image src={VALIO.avatar} alt="Mike Perez" fill sizes="56px" className="object-cover" priority />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent-2)]" />
            At ValioCon this week
          </span>
        </motion.div>

        <motion.h1 variants={rise} className="mt-8 text-[clamp(3rem,15vw,4.25rem)] font-bold leading-[0.9] tracking-tight">
          Mike
          <br />
          Perez
        </motion.h1>
        <motion.p variants={rise} className="mt-4 text-[var(--color-muted)]">
          {VALIO.role} · {VALIO.city}
        </motion.p>
        <motion.p variants={rise} className="mt-6 text-xl leading-snug">
          I design AI products — <span className="text-[var(--color-accent)]">then I build them.</span>
        </motion.p>
        <motion.p variants={rise} className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
          {VALIO.about}
        </motion.p>

        <motion.ul variants={stagger} className="mt-8 space-y-3">
          {VALIO.links.map((link, i) => (
            <motion.li key={link.id} variants={rise} className="relative">
              <button
                onClick={() => setSheet(i)}
                className={`flex w-full items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-transform active:scale-[0.98] ${
                  link.demo ? "pr-14" : "pr-4"
                }`}
              >
                <QrPlate svg={qrs[link.id]} className="w-16 shrink-0 rounded-xl p-1.5 ring-1 ring-[var(--color-border)]" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                    {link.kicker}
                  </span>
                  <span className="block font-semibold">{link.label}</span>
                  <span className="block text-[13px] leading-snug text-[var(--color-muted)]">{link.blurb}</span>
                </span>
              </button>
              {link.demo && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${link.short} on this phone`}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
                >
                  <IconArrowUpRight />
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p variants={rise} className="mt-auto pt-10 text-center font-mono text-[11px] text-[var(--color-muted)]">
          Tap a tile for a full-screen QR ·{" "}
          <Link href="/lab" className="underline underline-offset-4">
            see the lab
          </Link>
        </motion.p>
      </motion.main>

      <QrSheet links={VALIO.links} qrs={qrs} index={sheet} onIndex={setSheet} />
    </div>
  );
}
