"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ValioLink } from "@/lib/valio-data";
import { cn } from "@/lib/utils";

/* Scanners need dark modules on a light field, so plates stay light in every theme */
export function QrPlate({ svg, className }: { svg: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "aspect-square rounded-[14%] bg-[#FBF8F1] p-[11%] text-[#161814] [&_svg]:block [&_svg]:h-full [&_svg]:w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface QrSheetProps {
  links: ValioLink[];
  qrs: Record<string, string>;
  index: number | null;
  onIndex: (index: number | null) => void;
}

export function QrSheet({ links, qrs, index, onIndex }: QrSheetProps) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (dir: number) => {
      if (index === null) return;
      onIndex((index + dir + links.length) % links.length);
    },
    [index, links.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!dialogRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onIndex, step]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      returnFocus.current?.focus();
    };
  }, [open]);

  /* Stop the phone from dimming mid-scan */
  useEffect(() => {
    if (!open || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    navigator.wakeLock
      .request("screen")
      .then((l) => {
        if (cancelled) l.release().catch(() => {});
        else lock = l;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      lock?.release().catch(() => {});
    };
  }, [open]);

  const link = index !== null ? links[index] : null;

  return (
    <AnimatePresence>
      {link && index !== null && (
        <motion.div
          key="qr-sheet"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`QR code for ${link.label}`}
          className="fixed inset-0 z-[10000] flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted)]">
              {index + 1} / {links.length}
            </span>
            <button
              ref={closeRef}
              onClick={() => onIndex(null)}
              aria-label="Close"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-lg"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-7 px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={link.id}
                className="w-[min(84vw,56dvh)] cursor-grab active:cursor-grabbing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
              >
                <QrPlate svg={qrs[link.id]} className="shadow-[0_24px_60px_rgba(0,0,0,0.14)] ring-1 ring-black/5" />
              </motion.div>
            </AnimatePresence>

            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)]">{link.kicker}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{link.label}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{link.display}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <button
              onClick={() => step(-1)}
              aria-label="Previous code"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-xl"
            >
              ‹
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-[var(--color-accent)] font-medium text-[var(--color-on-accent)]"
            >
              Open {link.short} ↗
            </a>
            <button
              onClick={() => step(1)}
              aria-label="Next code"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-xl"
            >
              ›
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
