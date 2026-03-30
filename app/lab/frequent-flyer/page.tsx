"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { events, neighborhoods, allVibes, LAEvent } from "@/lib/events";

const MapInner = dynamic(
  () => import("@/components/lab/MapInner").then((m) => m.MapInner),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#0a0906]" /> }
);

/* ── Event Card ───────────────────────────────────────────────────── */
function EventCard({
  event,
  isSelected,
  onClick,
}: {
  event:      LAEvent;
  isSelected: boolean;
  onClick:    () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-300 group ${
        isSelected
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] bg-transparent hover:border-[var(--color-border)]/60 hover:bg-white/[0.015]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Emoji icon */}
        <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-base transition-colors duration-300 ${
          isSelected ? "bg-[var(--color-accent)]/15" : "bg-[var(--color-surface)]"
        }`}>
          {event.image}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium leading-snug transition-colors duration-300 ${
              isSelected ? "text-[var(--color-fg)]" : "text-[var(--color-fg)]/80"
            }`}>
              {event.title}
            </p>
            {event.free && (
              <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Free
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate">{event.location}</p>
          <p className="text-[11px] font-mono text-[var(--color-accent)]/60 mt-0.5">{event.date}</p>

          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed mt-2 mb-2">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {event.vibes.map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function FrequentFlyerLabPage() {
  const [selectedId,       setSelectedId]       = useState<string | null>(null);
  const [searchQuery,      setSearchQuery]       = useState("");
  const [activeNeighborhood, setNeighborhood]   = useState("All");
  const [activeVibe,       setActiveVibe]        = useState("");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNeighborhood = activeNeighborhood === "All" || e.neighborhood === activeNeighborhood;
      const matchesVibe = !activeVibe || e.vibes.includes(activeVibe);
      return matchesSearch && matchesNeighborhood && matchesVibe;
    });
  }, [searchQuery, activeNeighborhood, activeVibe]);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 4rem)" }}>
      {/* Header bar */}
      <div className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span className="font-mono text-xs text-[var(--color-accent)] tracking-widest uppercase">
            Frequent Flyer
          </span>
          <span className="font-mono text-[10px] text-[var(--color-muted)]">— LA Events</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--color-muted)]">
          {filtered.length} events
        </span>
      </div>

      {/* Body: list + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-[380px] shrink-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
          {/* Filters */}
          <div className="shrink-0 p-3 space-y-2 border-b border-[var(--color-border)]">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.5"
              >
                <circle cx="5" cy="5" r="4" />
                <path d="M8.5 8.5L11 11" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search events or neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]/40 transition-colors"
              />
            </div>

            {/* Neighborhood pills */}
            <div className="flex gap-1.5 flex-wrap">
              {neighborhoods.slice(0, 6).map((n) => (
                <button
                  key={n}
                  onClick={() => setNeighborhood(n === activeNeighborhood ? "All" : n)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-full border transition-all duration-200 ${
                    activeNeighborhood === n
                      ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Vibe pills */}
            <div className="flex gap-1.5 flex-wrap">
              {allVibes.slice(0, 7).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveVibe(v === activeVibe ? "" : v)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-full border transition-all duration-200 ${
                    activeVibe === v
                      ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/30"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Event list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-[var(--color-muted)] text-sm">No events match those filters.</p>
                </motion.div>
              ) : (
                filtered.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EventCard
                      event={event}
                      isSelected={selectedId === event.id}
                      onClick={() => handleSelect(event.id)}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map panel — hidden on mobile */}
        <div className="hidden md:block flex-1 relative">
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
