"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { events, LAEvent } from "@/lib/events";

const MapInner = dynamic(
  () => import("@/components/lab/MapInner").then((m) => m.MapInner),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#0a0906]" /> }
);

function MiniEventCard({
  event,
  isSelected,
  onClick,
}: {
  event:      LAEvent;
  isSelected: boolean;
  onClick:    () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 ${
        isSelected
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] hover:border-[var(--color-border)]/80 hover:bg-white/[0.015]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base shrink-0">{event.image}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium truncate transition-colors ${
            isSelected ? "text-[var(--color-fg)]" : "text-[var(--color-fg)]/75"
          }`}>
            {event.title}
          </p>
          <p className="text-[10px] font-mono text-[var(--color-accent)]/50 truncate">{event.date}</p>
        </div>
        {event.free && (
          <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            Free
          </span>
        )}
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-[var(--color-muted)] leading-relaxed mt-1.5 overflow-hidden"
          >
            {event.location}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FrequentFlyerMapEmbed() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search,     setSearch]     = useState("");

  const filtered = useMemo(() =>
    events.filter((e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.neighborhood.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/60">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          <span className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase">Frequent Flyer</span>
          <span className="font-mono text-[10px] text-[var(--color-muted)]">— LA</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--color-muted)]">{filtered.length} events</span>
      </div>

      {/* Body */}
      <div className="flex" style={{ height: "480px" }}>
        {/* List panel */}
        <div className="w-[220px] shrink-0 flex flex-col border-r border-[var(--color-border)]">
          {/* Search */}
          <div className="p-2 border-b border-[var(--color-border)]">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]/30 transition-colors"
            />
          </div>

          {/* Event list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <MiniEventCard
                    event={event}
                    isSelected={selectedId === event.id}
                    onClick={() => handleSelect(event.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative bg-[#0a0906]">
          <MapInner
            events={filtered}
            selectedId={selectedId}
            onSelectEvent={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
