"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Flow Steps ─────────────────────────────────────────────────── */
const steps = [
  {
    id: "receive",
    label: "Receive Invitation",
    description: "Fan gets a personalized link from the event coordinator. The landing page shows artist hero, event details, and distribution options.",
  },
  {
    id: "distribute",
    label: "Choose Distribution",
    description: "Three clear paths: transfer individually, keep all tickets, or send them all to one guest. No ambiguity, no dead ends.",
  },
  {
    id: "manage",
    label: "Manage Guests",
    description: "Host dashboard shows all ticket assignments with live status. Pending transfers show countdown timers. One-tap revoke for no-shows.",
  },
  {
    id: "accept",
    label: "Guest Accepts",
    description: "Clean, single-action design. Guest sees event details and taps to accept — ticket goes directly to their Apple or Google Wallet.",
  },
  {
    id: "wallet",
    label: "Added to Wallet",
    description: "Confirmation with wallet pass preview. NFC-enabled for venue check-in. The entire flow takes under 30 seconds.",
  },
];

/* ── Mini Screen Components for Each Step ──────────────────────── */
function ReceiveScreen() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col">
      <div className="h-20 relative" style={{ background: "linear-gradient(160deg, #1a1040, #4a1060)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        <div className="absolute bottom-2 left-3">
          <p className="font-mono text-[7px] text-white/40 uppercase">Apple Music</p>
          <p className="text-[10px] font-semibold text-white">Aurora Night</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-3">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.2">
              <rect x="1" y="3" width="12" height="8" rx="1.5" />
              <path d="M1 5l6 3.5L13 5" />
            </svg>
          </div>
          <p className="text-[9px] text-white/60">Hey Jordan — you have</p>
          <p className="text-sm font-semibold text-white">4 tickets</p>
        </div>
      </div>
    </div>
  );
}

function DistributeScreen() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col p-3 pt-5">
      <p className="text-[9px] text-white/50 mb-3">How would you like to distribute?</p>
      <div className="space-y-1.5 flex-1">
        {[
          { label: "Transfer individually", icon: "→", active: true },
          { label: "Keep all on my device", icon: "↓", active: false },
          { label: "Send all to one person", icon: "↗", active: false },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center justify-between px-2.5 py-2 rounded-lg border text-[9px] ${
              opt.active ? "border-white/20 bg-white/5 text-white" : "border-white/5 text-white/30"
            }`}
          >
            <span>{opt.label}</span>
            <span className="font-mono text-[10px]">{opt.icon}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-2 py-2 rounded-lg text-[9px] font-medium bg-white text-black">
        Continue
      </button>
    </div>
  );
}

function ManageScreen() {
  return (
    <div className="w-full h-full bg-[#111] flex flex-col">
      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <p className="text-[9px] font-medium text-white">Guest Management</p>
        <span className="font-mono text-[8px] text-white/20">3 / 4</span>
      </div>
      <div className="flex-1 p-2 space-y-1">
        {[
          { name: "Alex R.", status: "Accepted", color: "text-green-400 bg-green-500/10" },
          { name: "Sam C.", status: "Pending", color: "text-amber-400 bg-amber-500/10" },
          { name: "Morgan L.", status: "Pending", color: "text-amber-400 bg-amber-500/10" },
        ].map((g) => (
          <div key={g.name} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white/40 font-mono">
                {g.name[0]}
              </div>
              <span className="text-[9px] text-white/70">{g.name}</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono ${g.color}`}>
              {g.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AcceptScreen() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col items-center justify-center px-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ background: "linear-gradient(135deg, #1a1040, #4a1060)" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
          <rect x="1" y="3" width="14" height="10" rx="2" />
          <path d="M1 6l7 4 7-4" />
        </svg>
      </div>
      <p className="font-mono text-[8px] text-white/30 uppercase mb-1">You&apos;re invited</p>
      <p className="text-[10px] font-semibold text-white mb-0.5">Aurora Night</p>
      <p className="text-[8px] text-white/40 mb-3">Nova Celeste · Apr 12</p>
      <button className="w-full max-w-[140px] py-2 rounded-lg text-[9px] font-medium bg-white text-black">
        Accept &amp; Add to Wallet
      </button>
    </div>
  );
}

function WalletScreen() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
        className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#4ade80" strokeWidth="2">
          <path d="M4 9l3.5 3.5L14 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <p className="font-mono text-[8px] text-green-400/60 uppercase mb-2">Confirmed</p>
      <div className="w-24 rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg, #1a1040, #2d1060)" }}>
        <div className="px-2 pt-2 pb-1.5">
          <p className="font-mono text-[6px] text-white/40">APPLE MUSIC</p>
          <p className="text-white text-[8px] font-semibold">Aurora Night</p>
          <p className="text-white/60 text-[7px]">Nova Celeste</p>
        </div>
        <div className="mx-1.5 mb-1.5 bg-white rounded-md py-1 flex items-center justify-center">
          <span className="text-[6px] text-black/60 font-mono">Added to Wallet</span>
        </div>
      </div>
    </div>
  );
}

const screenComponents = [ReceiveScreen, DistributeScreen, ManageScreen, AcceptScreen, WalletScreen];

/* ── Main Walkthrough Component ─────────────────────────────────── */
export function TicketFlowWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const ActiveScreen = screenComponents[activeStep];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Left: Steps */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
          <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-6">
            Interactive Flow · Click to explore
          </p>
          <div className="space-y-1">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeStep === i
                    ? "bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20"
                    : "hover:bg-white/[0.02] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-mono text-xs mt-0.5 transition-colors ${
                    activeStep === i ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${
                      activeStep === i ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"
                    }`}>
                      {step.label}
                    </p>
                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= activeStep ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="p-6 lg:p-8 flex items-center justify-center bg-[var(--color-bg)]/50">
          <div className="w-[200px]">
            {/* Phone frame */}
            <div className="rounded-[24px] border-2 border-white/10 overflow-hidden bg-black shadow-2xl">
              {/* Notch */}
              <div className="h-6 bg-black flex items-center justify-center">
                <div className="w-16 h-3 bg-black rounded-b-xl border border-white/5 border-t-0" />
              </div>
              {/* Screen */}
              <div className="h-[300px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full text-white"
                  >
                    <ActiveScreen />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Home indicator */}
              <div className="h-5 bg-black flex items-center justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
