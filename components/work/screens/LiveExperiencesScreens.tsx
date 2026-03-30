"use client";

/* Sanitized screen recreations for Apple Live Experiences case study.
   All artists, venues, and user data are fictional. */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared primitives ──────────────────────────────────────────── */
const s = {
  row:    "flex items-center gap-3 px-4 py-3 border-b border-white/5 text-sm",
  label:  "font-mono text-[10px] tracking-widest uppercase text-white/30",
  pill:   (color: string) => `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ${color}`,
  th:     "px-4 py-2.5 text-left font-mono text-[10px] tracking-widest uppercase text-white/30 border-b border-white/5",
  td:     "px-4 py-3 text-xs text-white/70 border-b border-white/5",
  input:  "bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white/70 w-full focus:border-white/20 focus:outline-none transition-colors",
};

/* ── 1. Wallet Pass Builder (Interactive) ──────────────────────── */
const tabs = ["Pass Style", "Event Guide", "Pass Details", "Additional Info"] as const;

const tabContent: Record<string, { fields: { label: string; value: string }[]; preview: { bg: string; accent: string; eventName: string; artist: string; date: string; venue: string } }> = {
  "Pass Style": {
    fields: [
      { label: "Event Name",        value: "Aurora Night — Hollywood Bowl" },
      { label: "Artist",            value: "Nova Celeste" },
      { label: "Date",              value: "Apr 12, 2025" },
      { label: "Background Color",  value: "#1A1040" },
    ],
    preview: { bg: "linear-gradient(160deg, #1a1040 0%, #2d1060 100%)", accent: "#1a1040", eventName: "Aurora Night", artist: "Nova Celeste", date: "APR 12 · 8:00 PM", venue: "Hollywood Bowl" },
  },
  "Event Guide": {
    fields: [
      { label: "Venue",             value: "Hollywood Bowl" },
      { label: "Doors Open",        value: "6:30 PM" },
      { label: "Parking Info",      value: "Lot B — $25 pre-paid" },
      { label: "Accessibility",     value: "ADA seating available at Gate 3" },
    ],
    preview: { bg: "linear-gradient(160deg, #1a1040 0%, #2d1060 100%)", accent: "#1a1040", eventName: "Aurora Night", artist: "Nova Celeste", date: "APR 12 · 6:30 PM", venue: "Hollywood Bowl" },
  },
  "Pass Details": {
    fields: [
      { label: "Ticket Type",       value: "VIP — Floor Access" },
      { label: "Section",           value: "Floor A, Row 3" },
      { label: "Barcode Type",      value: "QR Code" },
      { label: "NFC Enabled",       value: "Yes — Tap to verify" },
    ],
    preview: { bg: "linear-gradient(160deg, #0d2040 0%, #1a3060 100%)", accent: "#0d2040", eventName: "Aurora Night", artist: "VIP · Floor A", date: "APR 12 · 8:00 PM", venue: "Hollywood Bowl" },
  },
  "Additional Info": {
    fields: [
      { label: "Transfer Policy",   value: "Up to 72 hours before event" },
      { label: "Max Transfers",     value: "3 per ticket" },
      { label: "Refund Policy",     value: "Non-refundable after transfer" },
      { label: "Support Contact",   value: "events-help@example.com" },
    ],
    preview: { bg: "linear-gradient(160deg, #1a1040 0%, #2d1060 100%)", accent: "#1a1040", eventName: "Aurora Night", artist: "Nova Celeste", date: "APR 12 · 8:00 PM", venue: "Hollywood Bowl" },
  },
};

export function WalletPassBuilderScreen() {
  const [activeTab, setActiveTab] = useState<string>("Pass Style");
  const content = tabContent[activeTab];

  return (
    <div className="bg-[#111] h-[380px] flex flex-col text-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-black/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[10px] text-white/40 ml-2">Wallet Pass Builder</span>
        <span className="ml-auto font-mono text-[9px] text-white/20">v5</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left: form */}
        <div className="w-[55%] border-r border-white/10 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-2 font-mono text-[9px] tracking-wide border-r border-white/5 transition-all relative ${
                  activeTab === t ? "text-white" : "text-white/30 hover:text-white/50"
                }`}
              >
                {t}
                {activeTab === t && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/5"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-3"
            >
              {content.fields.map((field) => (
                <div key={field.label}>
                  <p className={s.label + " mb-1"}>{field.label}</p>
                  {field.label === "Background Color" ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-white/20"
                        style={{ background: field.value }}
                      />
                      <div className={s.input + " flex-1"}>{field.value}</div>
                    </div>
                  ) : field.label === "NFC Enabled" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-4 bg-green-500/30 rounded-full flex items-center justify-end px-0.5">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-xs text-green-400/70">{field.value}</span>
                    </div>
                  ) : (
                    <div className={s.input}>{field.value}</div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Right: preview */}
        <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-[130px] rounded-xl overflow-hidden shadow-2xl"
              style={{ background: content.preview.bg }}
            >
              <div className="px-3 pt-3 pb-2">
                <p className="font-mono text-[7px] text-white/40 mb-1">APPLE MUSIC</p>
                <p className="text-white text-[11px] font-semibold leading-tight">{content.preview.eventName}</p>
                <p className="text-white/60 text-[9px]">{content.preview.artist}</p>
              </div>
              <div className="mx-3 my-2 bg-white/10 rounded-lg p-2">
                <p className="text-white/40 text-[8px] font-mono">{content.preview.date}</p>
                <p className="text-white/60 text-[8px]">{content.preview.venue}</p>
              </div>
              <div className="mx-3 mb-3 flex items-center justify-center bg-white rounded-lg py-2">
                <div className="w-16 h-8 bg-black/80 rounded flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5 opacity-60">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Passes List ─────────────────────────────────────────────── */
export function PassesListScreen() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const passes = [
    { name: "Aurora Night — VIP",     event: "Hollywood Bowl",     status: "Published" },
    { name: "Meridian Tour — GA",      event: "Crypto.com Arena",   status: "Published" },
    { name: "Summer Showcase",         event: "The Forum",          status: "Draft"     },
    { name: "Coastal Weekend",         event: "Banc of CA Stad.",   status: "Draft"     },
  ];
  return (
    <div className="bg-[#111] h-[300px] flex flex-col text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <span className="text-xs font-medium">Wallet Passes</span>
          <span className="font-mono text-[9px] text-white/20 ml-2">{passes.length} passes</span>
        </div>
        <button className="font-mono text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all">
          + New Pass
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className={s.th}>Pass Name</th>
            <th className={s.th}>Event</th>
            <th className={s.th}>Status</th>
            <th className={s.th}>Wallet</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((p, i) => (
            <tr
              key={p.name}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`transition-colors duration-200 ${hoveredRow === i ? "bg-white/[0.04]" : ""}`}
            >
              <td className={s.td}>
                <span className={`transition-colors ${hoveredRow === i ? "text-white" : ""}`}>{p.name}</span>
              </td>
              <td className={s.td + " text-white/40"}>{p.event}</td>
              <td className={s.td}>
                <span className={s.pill(
                  p.status === "Published"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-white/5 text-white/30"
                )}>
                  {p.status}
                </span>
              </td>
              <td className={s.td}>
                <div className="flex gap-1.5">
                  <span className="font-mono text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/40 hover:text-white/60 transition-colors cursor-pointer">
                    Apple
                  </span>
                  <span className="font-mono text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/40 hover:text-white/60 transition-colors cursor-pointer">
                    Google
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 3. Transfer Landing Page ───────────────────────────────────── */
export function TransferLandingScreen() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-[#0d0d0d] h-[380px] flex flex-col text-white overflow-hidden">
      {/* Artist hero */}
      <div
        className="h-[130px] relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a1040 0%, #4a1060 100%)" }}
      >
        {/* Subtle animated shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Apple Music</p>
          <p className="text-sm font-semibold text-white">Aurora Night</p>
          <p className="text-[10px] text-white/60">Nova Celeste · Hollywood Bowl</p>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 px-4 pt-4">
        <p className="text-xs text-white/70 mb-4">
          Hey <span className="text-white font-medium">Jordan</span> — you&apos;ve been sent 4 tickets.
          How would you like to distribute them?
        </p>
        <div className="space-y-2">
          {[
            { label: "Transfer individually",      sub: "Choose who gets each ticket",       icon: "→" },
            { label: "Keep all on my device",       sub: "Add all 4 to your Wallet",          icon: "↓" },
            { label: "Send all to one person",      sub: "Forward everything to a guest",     icon: "↗" },
          ].map((opt, i) => (
            <motion.button
              key={opt.label}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-200 ${
                selected === i
                  ? "border-white/20 bg-white/5 text-white shadow-[0_0_20px_-8px_rgba(200,96,26,0.2)]"
                  : "border-white/5 text-white/50 hover:border-white/10 hover:bg-white/[0.02]"
              }`}
            >
              <div>
                <p className="text-xs font-medium">{opt.label}</p>
                <p className="text-[10px] text-white/40">{opt.sub}</p>
              </div>
              <span className={`font-mono text-sm transition-colors ${selected === i ? "text-[var(--color-accent)]" : "opacity-30"}`}>
                {opt.icon}
              </span>
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2.5 rounded-xl text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}

/* ── 4. Guest Management ────────────────────────────────────────── */
export function GuestManagementScreen() {
  const guests = [
    { name: "Alex Rivera",   status: "Accepted",   exp: null },
    { name: "Sam Chen",      status: "Pending",    exp: "Expires in 48h" },
    { name: "Morgan Lee",    status: "Pending",    exp: "Expires in 12h" },
  ];
  return (
    <div className="bg-[#111] h-[300px] flex flex-col text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <p className="text-xs font-medium">Guest Management</p>
          <p className="font-mono text-[9px] text-white/30">Aurora Night · 4 tickets</p>
        </div>
        <button className="font-mono text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all">
          + Add Guest
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {guests.map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={s.row + " justify-between hover:bg-white/[0.02] transition-colors"}
          >
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] ${
                g.status === "Accepted"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-white/10 text-white/40"
              }`}>
                {g.name[0]}
              </div>
              <div>
                <p className="text-xs text-white/80">{g.name}</p>
                {g.exp && (
                  <p className={`text-[9px] ${
                    g.exp.includes("12h") ? "text-red-400/70" : "text-amber-400/70"
                  }`}>
                    {g.exp}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={s.pill(
                g.status === "Accepted"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-amber-500/10 text-amber-400"
              )}>
                {g.status}
              </span>
              {g.status === "Pending" && (
                <button className="font-mono text-[9px] text-white/20 hover:text-red-400 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          </motion.div>
        ))}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] text-white/20">1 ticket remaining · unassigned</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={`w-2 h-2 rounded-full ${n <= 3 ? "bg-white/20" : "bg-white/5 border border-dashed border-white/10"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Guest Invitation Acceptance ────────────────────────────── */
export function GuestInvitationScreen() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="bg-[#0d0d0d] h-[320px] flex flex-col items-center justify-center text-white px-6">
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="invite"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #1a1040, #4a1060)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="2" y="4" width="16" height="12" rx="2" />
                <path d="M2 7l8 5 8-5" />
              </svg>
            </div>
            <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">You&apos;re invited</p>
            <p className="text-sm font-semibold text-white text-center mb-1">Aurora Night</p>
            <p className="text-[11px] text-white/50 text-center mb-6">
              Nova Celeste · Hollywood Bowl · Apr 12, 8:00 PM
            </p>
            <div className="w-full max-w-[200px] space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccepted(true)}
                className="w-full py-2.5 rounded-xl text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
              >
                Accept &amp; Add to Wallet
              </motion.button>
              <button className="w-full py-2.5 rounded-xl text-xs text-white/40 border border-white/10 hover:border-white/20 transition-colors">
                Decline
              </button>
            </div>
            <p className="mt-4 font-mono text-[9px] text-white/20 text-center">
              Sent by Jordan M. · Expires in 72h
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
              className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <path d="M5 12l5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <p className="font-mono text-[10px] text-green-400/60 tracking-widest uppercase mb-2">Confirmed</p>
            <p className="text-sm font-semibold text-white text-center mb-1">You&apos;re in!</p>
            <p className="text-[11px] text-white/50 text-center mb-4">
              Aurora Night · Apr 12, 8:00 PM
            </p>
            <div className="w-[130px] rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(160deg, #1a1040 0%, #2d1060 100%)" }}>
              <div className="px-3 pt-3 pb-2">
                <p className="font-mono text-[7px] text-white/40 mb-0.5">APPLE MUSIC</p>
                <p className="text-white text-[10px] font-semibold leading-tight">Aurora Night</p>
                <p className="text-white/60 text-[8px]">Nova Celeste</p>
              </div>
              <div className="mx-2 mb-2 bg-white rounded-lg py-1.5 flex items-center justify-center">
                <span className="text-[8px] text-black/60 font-mono">Added to Wallet</span>
              </div>
            </div>
            <button
              onClick={() => setAccepted(false)}
              className="mt-3 font-mono text-[9px] text-white/20 hover:text-white/40 transition-colors"
            >
              Reset demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 6. Legacy Before Screen ────────────────────────────────────── */
export function LegacyBeforeScreen() {
  return (
    <div className="bg-[#f5f5f5] h-[280px] flex flex-col text-gray-800 overflow-hidden">
      {/* Old nav */}
      <div className="flex items-center px-4 py-2 bg-[#1c1c3a] border-b border-black/10">
        <span className="font-mono text-[10px] text-white/50">Ticketing Portal</span>
        <div className="ml-auto flex gap-3">
          {["Events", "Passes", "Invites", "Settings"].map(t => (
            <span key={t} className="text-[9px] text-white/40">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Old sidebar */}
        <div className="w-[100px] bg-[#e8e8e8] border-r border-black/5 p-2 space-y-1">
          {["Dashboard", "Events", "Wallet Config", "Invitations", "Reports"].map(t => (
            <div key={t} className={`text-[9px] px-2 py-1.5 rounded ${t === "Dashboard" ? "bg-[#1c1c3a] text-white" : "text-gray-500"}`}>
              {t}
            </div>
          ))}
        </div>
        {/* Old content */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-700">Upcoming Events</p>
          <table className="w-full text-[9px] text-gray-600 border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 text-left border-r border-gray-300">Event</th>
                <th className="px-2 py-1 text-left border-r border-gray-300">Date</th>
                <th className="px-2 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Event_083", "04/12/25", "Active"],
                ["Event_084", "05/02/25", "Draft"],
                ["Event_085", "05/18/25", "Draft"],
              ].map(([e, d, st]) => (
                <tr key={e} className="border-t border-gray-200">
                  <td className="px-2 py-1.5 border-r border-gray-200">{e}</td>
                  <td className="px-2 py-1.5 border-r border-gray-200">{d}</td>
                  <td className="px-2 py-1.5 text-blue-600">{st}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 bg-white border border-gray-300 rounded p-2">
              <p className="text-[9px] text-gray-500 font-bold mb-1">Wallet Config</p>
              <p className="text-[8px] text-gray-400">BG Color: <span className="border border-gray-200 px-1 text-[8px] inline-block">#000000</span></p>
              <p className="text-[8px] text-gray-400 mt-1">Logo: <span className="border border-gray-200 px-1 text-[8px] inline-block">Upload</span></p>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded p-2">
              <p className="text-[9px] text-gray-500 font-bold mb-1">Attendees</p>
              <div className="flex items-center justify-center h-[50px] bg-gray-50 rounded">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1c1c3a" strokeWidth="3"
                      strokeDasharray="56 38" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
