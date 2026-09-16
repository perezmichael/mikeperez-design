"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { VALIO, valioLink, type ValioLink } from "@/lib/valio-data";
import { QrPlate } from "./QrSheet";

const SLIDES = [
  { bg: "#191B17", fg: "#F7F4ED", muted: "rgba(247,244,237,0.78)" },
  { bg: "#0F6E4F", fg: "#F3F0E6", muted: "rgba(243,240,230,0.9)" },
  { bg: "#F7F4ED", fg: "#21241F", muted: "#6E6C62" },
  { bg: "#CF3515", fg: "#FFF6EF", muted: "#FFF6EF" },
  { bg: "#21241F", fg: "#F7F4ED", muted: "rgba(247,244,237,0.68)" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const frame = "relative flex h-full flex-col px-7 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))]";

export function LoopC({ qrs }: { qrs: Record<string, string> }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const down = useRef<{ x: number; y: number } | null>(null);
  const last = SLIDES.length - 1;
  const slide = SLIDES[index];

  const go = useCallback(
    (d: number) => {
      const next = Math.min(last, Math.max(0, index + d));
      if (next === index) return;
      setDir(d);
      setIndex(next);
    },
    [index, last]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (e: React.PointerEvent) => {
    down.current = (e.target as HTMLElement).closest("a,button") ? null : { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = down.current;
    down.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const rect = e.currentTarget.getBoundingClientRect();
      go(e.clientX - rect.left < rect.width * 0.3 ? -1 : 1);
    }
  };

  const qrBlock = (link: ValioLink, extra?: React.ReactNode) => (
    <div className="mt-auto flex flex-col items-center">
      <QrPlate svg={qrs[link.id]} className="w-[min(60vw,34dvh)] shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5" />
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="mt-4 py-1 font-medium underline underline-offset-4">
        {link.display} ↗
      </a>
      {extra}
    </div>
  );

  const renderSlide = () => {
    switch (index) {
      case 0:
        return (
          <>
            <Image
              src={VALIO.photo}
              alt="Mike Perez snowboarding"
              fill
              priority
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-cover"
              style={{ objectPosition: "68% 30%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(10,11,9,.4) 0%, rgba(10,11,9,0) 28%, rgba(10,11,9,.12) 55%, rgba(10,11,9,.88) 100%)",
              }}
            />
            <div className="relative flex h-full flex-col justify-end px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
              <h1 className="text-[clamp(3.25rem,15vw,4.75rem)] font-bold leading-[0.92] tracking-tight">
                Hi,
                <br />
                I&apos;m Mike.
              </h1>
              <p className="mt-4 text-lg" style={{ color: slide.muted }}>
                {VALIO.role} · {VALIO.city}
              </p>
              <p className="mt-10 animate-pulse font-mono text-[11px] uppercase tracking-widest">Tap to continue →</p>
            </div>
          </>
        );
      case 1:
        return (
          <div className={`${frame} justify-end`}>
            <h2 className="text-[clamp(2.75rem,12.5vw,4rem)] font-bold leading-[0.95] tracking-tight">I design at Apple.</h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: slide.muted }}>
              In Los Angeles. That&apos;s about all I&apos;m allowed to say. <span aria-hidden>🤫</span>
            </p>
          </div>
        );
      case 2:
        return (
          <div className={frame}>
            <h2 className="text-[clamp(2.25rem,10vw,3.25rem)] font-bold leading-[0.98] tracking-tight">
              I build real things with AI.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: slide.muted }}>
              Frequent Flyer is LA event discovery — designed, coded, and shipped with Claude Code in the loop. It&apos;s live. Scan it.
            </p>
            {qrBlock(valioLink("frequent-flyer"))}
          </div>
        );
      case 3:
        return (
          <div className={frame}>
            <h2 className="text-[clamp(2.25rem,10vw,3.25rem)] font-bold leading-[0.98] tracking-tight">Follow the flyers.</h2>
            <p className="mt-4 text-[17px] font-medium leading-relaxed" style={{ color: slide.muted }}>
              The parties, the posters, and the people who show up.
            </p>
            {qrBlock(valioLink("instagram"))}
          </div>
        );
      default:
        return (
          <div className={frame}>
            <h2 className="text-[clamp(2.25rem,10vw,3.25rem)] font-bold leading-[0.98] tracking-tight">Let&apos;s stay in touch.</h2>
            <div className="mt-auto grid grid-cols-2 gap-4">
              {[valioLink("linkedin"), valioLink("x")].map((link) => (
                <div key={link.id} className="flex flex-col items-center">
                  <QrPlate svg={qrs[link.id]} className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 py-1 text-center text-[13px] font-medium underline underline-offset-4"
                  >
                    {link.short} ↗
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setDir(-1);
                setIndex(0);
              }}
              className="mx-auto mt-6 flex h-11 items-center gap-2 rounded-full border px-5 text-sm"
              style={{ borderColor: slide.muted }}
            >
              ↺ Start over
            </button>
          </div>
        );
    }
  };

  return (
    <div data-valio data-theme="isla" className="fixed inset-0 bg-[#0d0e0c]">
      <div
        className="relative mx-auto h-dvh max-w-md select-none overflow-hidden"
        style={{
          background: slide.bg,
          color: slide.fg,
          touchAction: "manipulation",
          transition: "background-color .5s cubic-bezier(.22,1,.36,1), color .5s cubic-bezier(.22,1,.36,1)",
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="absolute inset-x-0 top-0 z-30 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex gap-1.5">
            {SLIDES.map((_, k) => (
              <div
                key={k}
                className="h-[3px] flex-1 overflow-hidden rounded-full"
                style={{ background: `color-mix(in srgb, ${slide.fg} 25%, transparent)` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: slide.fg }}
                  initial={false}
                  animate={{ width: k <= index ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: slide.muted }}>
            <span>Mike Perez</span>
            <span>
              {index + 1} / {SLIDES.length}
            </span>
          </div>
        </div>

        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 40 * d }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -40 * d }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease }}
            className="absolute inset-0"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
