"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { VALIO } from "@/lib/valio-data";
import { QrPlate, QrSheet } from "./QrSheet";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function FlipB({ qrs }: { qrs: Record<string, string> }) {
  const [sheet, setSheet] = useState<number | null>(null);
  const [dark, setDark] = useState(false);

  /* ?dark opens straight into Noir */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("dark")) setDark(true);
  }, []);

  return (
    <div
      data-valio
      data-theme={dark ? "cinematic-noir" : "isla"}
      className="valio-flip flex min-h-dvh flex-col bg-[var(--color-bg)] text-[var(--color-fg)]"
    >
      <style>{`
        .valio-flip, .valio-flip * {
          transition-property: background-color, color, border-color;
          transition-duration: .6s;
          transition-timing-function: cubic-bezier(.22,1,.36,1);
        }
      `}</style>

      <div className="relative aspect-[900/785] w-full shrink-0 overflow-hidden rounded-b-[36px]">
        <Image
          src={VALIO.photoHero}
          alt="Mike Perez snowboarding"
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
          style={{ objectPosition: "center" }}
        />
        {/* background-color + mask (not a gradient) so the fade animates with the theme */}
        <div className="absolute inset-0 bg-[var(--color-bg)] [mask-image:linear-gradient(to_bottom,transparent_30%,black_88%)]" />

        <span className="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
          ValioCon · 2026
        </span>

        <button
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light" : "Switch to dark"}
          className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[15px] text-[var(--color-muted)]"
        >
          {dark ? "☀" : "☾"}
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="absolute bottom-5 left-6 text-[clamp(3rem,15vw,4.25rem)] font-bold leading-[0.88] tracking-tight"
        >
          Mike
          <br />
          Perez
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="flex flex-1 flex-col px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
      >
        <p className="text-[var(--color-muted)]">
          {VALIO.role} · {VALIO.city}
        </p>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 content-center justify-items-center gap-x-4 gap-y-4">
          {VALIO.links.map((link, i) => (
            <button key={link.id} onClick={() => setSheet(i)} className="group flex w-full flex-col items-center">
              {/* height-capped so Safari's toolbars can't push the bottom row off-screen */}
              <QrPlate
                svg={qrs[link.id]}
                className="w-full max-w-[min(42vw,15dvh,170px)] rounded-2xl p-[9%] ring-1 ring-[var(--color-border)] transition-transform group-active:scale-95"
              />
              <span className="mt-2 block text-center text-[12px] font-medium leading-tight">{link.short}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <QrSheet links={VALIO.links} qrs={qrs} index={sheet} onIndex={setSheet} />
    </div>
  );
}
