"use client";

/* Sanitized screen recreations for Titan AI Agents case study.
   All banking data, customer info, and agent logic are fictional. */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared primitives ──────────────────────────────────────────── */
const s = {
  label: "font-mono text-[10px] tracking-widest uppercase text-white/30 mb-1",
  pill: (color: string) => `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ${color}`,
};

/* ── 1. Titan Agent Chat Prototype ────────────────────────────── */
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: { name: string; status: "running" | "complete" | "error" }[];
  isThinking?: boolean;
};

const initialMessages: Message[] = [
  { id: "1", role: "assistant", content: "Hello! I'm your Titan banking agent. How can I help you today?" },
];

export function TitanChatPrototype() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [recordFields, setRecordFields] = useState<{ label: string; value: string; visible: boolean }[]>([
    { label: "Customer Name", value: "Jordan Miller", visible: false },
    { label: "Account Type", value: "Premier Checking", visible: false },
    { label: "Current Balance", value: "$12,482.10", visible: false },
    { label: "Loan Eligibility", value: "High — Up to $50k", visible: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    // Simulate AI response cycle
    setTimeout(() => simulateAIResponse(input), 600);
  };

  const simulateAIResponse = (query: string) => {
    setIsTyping(true);
    const thinkingMsg: Message = { 
      id: "thinking", 
      role: "assistant", 
      content: "", 
      isThinking: true,
      tools: [
        { name: "Query CRM", status: "running" },
        { name: "Check Compliance", status: "running" }
      ]
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    // Step 1: Tool 1 complete
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === "thinking" ? { ...m, tools: [{ name: "Query CRM", status: "complete" }, { name: "Check Compliance", status: "running" }] } : m));
      // Pop first two record fields
      setRecordFields(prev => prev.map((f, i) => i < 2 ? { ...f, visible: true } : f));
    }, 1500);

    // Step 2: Tool 2 complete
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === "thinking" ? { ...m, tools: [{ name: "Query CRM", status: "complete" }, { name: "Check Compliance", status: "complete" }] } : m));
      // Pop last two record fields
      setRecordFields(prev => prev.map((f, i) => i >= 2 ? { ...f, visible: true } : f));
    }, 2800);

    // Step 3: Final response
    setTimeout(() => {
      setIsTyping(false);
      const finalContent = query.toLowerCase().includes("balance") 
        ? "I've pulled up Jordan Miller's account. They have a balance of $12,482.10 and are eligible for a premier loan package."
        : "I've analyzed the customer records. Jordan Miller is currently in good standing with a Premier Checking account and high loan eligibility.";
      
      setMessages(prev => [
        ...prev.filter(m => m.id !== "thinking"),
        { id: Date.now().toString(), role: "assistant", content: finalContent }
      ]);
    }, 3500);
  };

  useEffect(() => {
    if (scrollRef.current && (messages.length > 1 || isTyping)) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  return (
    <div className="bg-[#0b0e14] h-[480px] flex text-white overflow-hidden border border-white/5 rounded-xl shadow-2xl">
      {/* Sidebar: Record View */}
      <div className="w-[35%] border-r border-white/5 bg-black/40 flex flex-col">
        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <p className="font-mono text-[9px] text-[var(--color-accent)] tracking-widest uppercase">Active Context</p>
        </div>
        <div className="p-4 space-y-4">
          {recordFields.map((field) => (
            <div key={field.label} className="relative">
              <p className={s.label}>{field.label}</p>
              <div className="h-8 relative overflow-hidden">
                <AnimatePresence>
                  {field.visible ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-white/80 flex items-center h-full"
                    >
                      {field.value}
                      <motion.div
                        initial={{ opacity: 0.5, scaleX: 1 }}
                        animate={{ opacity: 0, scaleX: 1.2 }}
                        className="absolute inset-0 bg-[var(--color-accent)]/20 rounded pointer-events-none"
                      />
                    </motion.div>
                  ) : (
                    <div className="h-4 w-full bg-white/5 rounded mt-2 animate-pulse" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-white/5">
            <p className={s.label}>Permissions</p>
            <div className="flex gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-white/40 font-mono">L3 Access Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main: Chat View */}
      <div className="flex-1 flex flex-col bg-black/20">
        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Titan Agent v1.2</span>
          </div>
          <span className="font-mono text-[9px] text-white/20">Model: Titan-L-70B</span>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed ${
                m.role === "user" 
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-fg)] border border-[var(--color-accent)]/20" 
                  : "bg-white/5 text-white/80 border border-white/10"
              }`}>
                {m.content}
                {m.isThinking && (
                  <div className="flex gap-1 items-center h-4 mt-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-white/40" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 rounded-full bg-white/40" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                )}
              </div>
              
              {/* Tool Chain */}
              <AnimatePresence>
                {m.tools && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1.5 ml-2"
                  >
                    {m.tools.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-px h-3 bg-white/10" />
                        <div className={`w-1.5 h-1.5 rounded-full ${t.status === "complete" ? "bg-green-500" : "bg-[var(--color-accent)] animate-pulse"}`} />
                        <span className="font-mono text-[9px] text-white/40">{t.name}</span>
                        {t.status === "complete" && (
                          <span className="font-mono text-[8px] text-green-500/50">Done</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a customer or loan..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[var(--color-accent)]/40 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1.5 px-3 py-1 rounded-lg bg-[var(--color-accent)] text-white text-[10px] font-mono hover:bg-[var(--color-accent)]/80 disabled:opacity-20 transition-all"
            >
              SEND
            </button>
          </form>
          <div className="flex gap-4 mt-3 px-1">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Suggestions:</span>
            <button onClick={() => setInput("Check balance for Jordan Miller")} className="text-[9px] font-mono text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors">&quot;Check balance for Jordan Miller&quot;</button>
            <button onClick={() => setInput("Check loan eligibility")} className="text-[9px] font-mono text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors">&quot;Check loan eligibility&quot;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
