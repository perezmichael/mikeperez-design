"use client";

import { useState, useEffect, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Send: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Sparkles: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"></path></svg>,
  Shield: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Search: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  BookOpen: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
  ChevronDown: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>,
  FileText: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  X: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface ReasoningStep {
  icon: 'shield' | 'search' | 'book' | 'sparkles';
  label: string;
  items?: string[];
}

interface DemoRecord {
  id: string;
  name: string;
  noteNumber: string;
  assetClass: string;
  status: 'Active' | 'Renewal' | 'Payoff';
}

interface DemoDossier {
  name: string;
  assetClass: string;
  description: string;
  dealDetails: Array<{ label: string; value: string }>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: ReasoningStep[];
  records?: DemoRecord[];
}

const CONTEXT_LABELS = [
  'Validating message for PII',
  'Searching portfolio records',
  'Referencing knowledge base',
  'Drafting response',
];

const MOCK_RESPONSE = 'Found **2 loans** with maturities in the next 90 days:';

function renderText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
  );
}

const TITAN_PATH = "M47.2423 71.4809L34.4963 58.7302C32.6352 56.86 33.2539 57.4793 31.7433 55.9716C14.6419 38.8588 11.7307 37.4185 11.7307 30.5882C11.7317 23.3304 17.5941 17.6895 24.6098 17.6892C31.1319 17.6892 33.976 21.7116 38.9795 26.7223L47.2461 18.4502C41.5612 12.7615 36.1899 6.00011 24.6098 6.00011C10.9317 6.00042 0.000739855 17.1042 0 30.5692C0 42.1253 6.79117 47.5434 12.4798 53.2358L12.5026 53.2167C27.7218 68.5006 21.6839 62.4498 38.9757 79.753L47.2423 71.4809ZM87.5299 53.2167C93.2148 47.5281 99.9717 42.1488 99.9717 30.5844C99.9742 8.56382 73.2786 -2.08453 57.9958 13.1992L26.2715 44.9446L34.5039 53.2129L66.2625 21.4714C74.3184 13.4114 88.2586 19.0372 88.26 30.5844C88.26 37.1225 84.2823 39.9222 79.2632 44.9446L87.5299 53.2167ZM75.3885 105.981C97.2753 105.981 108.216 79.4607 92.7735 64.0078L61.0226 32.2358L52.7598 40.5079L65.4982 53.2205C66.4132 54.1401 67.1959 54.9156 68.255 55.9754L68.2512 55.9792C79.9164 67.656 76.2804 64.0138 84.5183 72.2571C89.4984 77.2912 89.4986 85.4795 84.5107 90.5174C79.6319 95.4017 71.1332 95.3981 66.2625 90.5174L61.0188 85.2665L52.7522 93.5386C58.4563 99.2388 63.8207 105.981 75.3885 105.981ZM24.6098 106C37.5954 106 40.3064 100.475 73.7572 67.0024L65.4868 58.7378C31.2883 92.9512 31.712 94.292 24.6098 94.292C13.1508 94.2916 7.44711 80.3578 15.4876 72.2419L20.7275 66.9947L12.4798 58.7416L7.22096 64.0078C-8.26441 79.5034 2.88298 106 24.6098 106Z";

function TitanMessageIcon({ spinning }: { spinning: boolean }) {
  return (
    <div className="relative flex-shrink-0 mt-0.5" style={{ width: 28, height: 28 }}>
      <style>{`
        @keyframes titan-arc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .titan-arc-ring { transform-origin: 18px 18px; animation: titan-arc-spin 1.1s linear infinite; }
      `}</style>
      <div
        className="absolute pointer-events-none"
        style={{ inset: -4, opacity: spinning ? 1 : 0, transition: 'opacity 350ms ease' }}
      >
        <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
          <defs>
            <linearGradient id="arcGradMsg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6E3C" stopOpacity="0" />
              <stop offset="100%" stopColor="#FF6E3C" stopOpacity="1" />
            </linearGradient>
          </defs>
          <g className="titan-arc-ring">
            <circle cx="18" cy="18" r="16" stroke="#FF6E3C" strokeOpacity="0.15" strokeWidth="2" fill="none" />
            <circle cx="18" cy="18" r="16" stroke="url(#arcGradMsg)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeDasharray="75 26" />
          </g>
        </svg>
      </div>
      <div
        className="w-full h-full"
        style={{
          transform: spinning ? 'scale(0.68)' : 'scale(0.88)',
          transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'center center',
        }}
      >
        <svg viewBox="0 0 106 106" fill="none" className="w-full h-full">
          <path d={TITAN_PATH} fill="#FF6E3C" />
        </svg>
      </div>
    </div>
  );
}

// ─── Reasoning ────────────────────────────────────────────────────────────────

const REASONING_STEPS: ReasoningStep[] = [
  { icon: 'shield', label: 'Validated message for PII', items: ['No personally identifiable information detected'] },
  { icon: 'search', label: 'Searched 6 portfolio records', items: ['GH3 Cler SNU', 'Retail Plaza Holdings', 'VFN Holdings Inc', '+3 more'] },
  { icon: 'book', label: 'Referenced KB documents', items: ['Axiom Commercial Lending Policy', 'Loan Maturity Guidelines 2026'] },
  { icon: 'sparkles', label: 'Generated response' },
];

const REASONING_SUMMARY = 'Searched 6 records · Referenced 2 docs · No PII';

function ReasoningStepIcon({ icon }: { icon: ReasoningStep['icon'] }) {
  const cls = 'w-3.5 h-3.5 text-gray-400';
  if (icon === 'shield') return <Icons.Shield className={cls} />;
  if (icon === 'search') return <Icons.Search className={cls} />;
  if (icon === 'book') return <Icons.BookOpen className={cls} />;
  return <Icons.Sparkles className={cls} />;
}

function ReasoningPanel({ steps }: { steps: ReasoningStep[] }) {
  return (
    <div className="mt-2 ml-1">
      <style>{`
        @keyframes step-spring {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3" style={{ animation: `step-spring 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 45}ms both` }}>
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
            <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
              <ReasoningStepIcon icon={step.icon} />
            </div>
            {i < steps.length - 1 && <div className="w-px bg-gray-200 flex-1 my-1" style={{ minHeight: 12 }} />}
          </div>
          <div className="pb-3 min-w-0">
            <div className="text-xs font-medium text-gray-700 leading-5">{step.label}</div>
            {step.items && (
              <div className="mt-0.5 space-y-0.5">
                {step.items.map(item => <div key={item} className="text-[11px] text-gray-400">{item}</div>)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReasoningToggle({ steps, summary }: { steps: ReasoningStep[]; summary: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <span>{summary}</span>
        <Icons.ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {open && <ReasoningPanel steps={steps} />}
    </div>
  );
}

function ThinkingAnimation({ isComplete = false }: { isComplete?: boolean }) {
  const [labelIndex, setLabelIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const currentLabel = CONTEXT_LABELS[labelIndex];

  useEffect(() => {
    if (isComplete) return;
    setLabelIndex(0); setDisplayed(0);
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, CONTEXT_LABELS.length - 1);
      setLabelIndex(i); setDisplayed(0);
      if (i >= CONTEXT_LABELS.length - 1) clearInterval(interval);
    }, 1400);
    return () => clearInterval(interval);
  }, [isComplete]);

  useEffect(() => {
    if (isComplete) return;
    setDisplayed(0); let ch = 0;
    const t = setInterval(() => {
      ch++; setDisplayed(ch);
      if (ch >= currentLabel.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [labelIndex, currentLabel, isComplete]);

  return (
    <div className="flex items-center gap-3">
      <TitanMessageIcon spinning={!isComplete} />
      <style>{`
        @keyframes char-arrive {
          from { opacity: 0.2; color: #d1d5db; }
          to   { opacity: 1;   color: #111827; }
        }
        .char-arrive { animation: char-arrive 0.25s ease forwards; }
      `}</style>
      {!isComplete && (
        <span className="text-sm font-medium" aria-live="polite">
          {currentLabel.split('').map((char, i) => (
            <span key={`${labelIndex}-${i}`} className="char-arrive" style={{ animationDelay: `${i * 38}ms`, opacity: i < displayed ? 1 : 0, color: '#111827' }}>
              {char}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MATURITY_RECORDS: DemoRecord[] = [
  { id: '2', name: 'GH3 Cler SNU', noteNumber: '20230045-001', assetClass: 'CRE — Office', status: 'Renewal' },
  { id: '4', name: 'Retail Plaza Holdings', noteNumber: '20230122-001', assetClass: 'CRE — Retail', status: 'Active' },
];

const DEMO_DOSSIERS: Record<string, DemoDossier> = {
  '2': {
    name: 'GH3 Cler SNU',
    assetClass: 'CRE — Office',
    description: 'GH3 Cler SNU operates a portfolio of Class A office properties in suburban markets across the Southeast. The company focuses on long-term leases with investment-grade tenants and maintains active asset management.',
    dealDetails: [
      { label: 'Transaction Type', value: 'Renewal' },
      { label: 'Loan Term', value: '36 months' },
      { label: 'Interest Rate', value: '5.85% Fixed' },
      { label: 'Sponsor Name', value: 'GH3 Capital Partners' },
      { label: 'LTV (As-Is)', value: '68%' },
      { label: 'Occupancy Rate', value: '91%' },
    ],
  },
  '4': {
    name: 'Retail Plaza Holdings',
    assetClass: 'CRE — Retail',
    description: 'Retail Plaza Holdings owns a 42,000 sq ft open-air strip center in Mesa, AZ anchored by a regional grocery chain. Strong foot traffic with one junior anchor vacancy since Q3 2025. Loan matures May 2026.',
    dealDetails: [
      { label: 'Transaction Type', value: 'Renewal' },
      { label: 'Loan Term', value: '36 months' },
      { label: 'Interest Rate', value: '6.10% Fixed' },
      { label: 'Sponsor Name', value: 'Retail Plaza Group LLC' },
      { label: 'LTV (As-Is)', value: '72%' },
      { label: 'Occupancy Rate', value: '80%' },
    ],
  },
};

const STATUS_STYLES: Record<DemoRecord['status'], string> = {
  Active: 'bg-green-50 text-green-700',
  Renewal: 'bg-amber-50 text-amber-700',
  Payoff: 'bg-gray-100 text-gray-500',
};

// ─── Record Cards & Dossier ───────────────────────────────────────────────────

function RecordCards({ records, openId, onOpen }: { records: DemoRecord[]; openId: string | null; onOpen: (r: DemoRecord) => void }) {
  return (
    <div className="mt-2">
      <style>{`
        @keyframes card-spring {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="text-xs text-gray-400 mb-2">{records.length} records found</div>
      <div className="space-y-1.5">
        {records.map((record, i) => {
          const isOpen = openId === record.id;
          return (
            <div key={record.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-gray-300 transition-colors" style={{ animation: `card-spring 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms both` }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <Icons.FileText className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-medium text-gray-900 truncate">{record.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{record.assetClass} · {record.noteNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[record.status]}`}>{record.status}</span>
                <button onClick={() => onOpen(record)} className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${isOpen ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>
                  {isOpen ? <>Close <Icons.ChevronDown className="w-3 h-3 rotate-90" /></> : <>Open <Icons.ChevronDown className="w-3 h-3 -rotate-90" /></>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DossierPanel({ dossier, onClose }: { dossier: DemoDossier; onClose: () => void }) {
  return (
    <div className="w-full h-full bg-[#f5f5f3] flex flex-col overflow-hidden border-l border-gray-200" style={{ animation: 'card-spring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-lg font-medium text-gray-900">{dossier.name}</h1>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 mt-1">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-3">{dossier.assetClass}</div>
            <p className="text-xs text-gray-600 leading-relaxed">{dossier.description}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xs font-medium text-gray-900">Deal Details</h2>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              {dossier.dealDetails.map(({ label, value }, i) => (
                <div key={label} className={`flex justify-between gap-4 text-xs ${i > 0 ? 'border-t border-gray-100 pt-2.5' : ''}`}>
                  <div className="font-medium text-gray-500">{label}</div>
                  <div className="text-gray-900 text-right">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TitanAdvancedChatPrototype() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [thinkingKey, setThinkingKey] = useState(0);
  const [openDossierRecord, setOpenDossierRecord] = useState<DemoRecord | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && (messages.length > 0 || thinking)) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, thinking]);

  const send = (query?: string) => {
    const q = query ?? input;
    if (!q.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q }]);
    setThinking(true);
    setCompleting(false);
    setThinkingKey(k => k + 1);
    
    setTimeout(() => {
      setCompleting(true);
      setTimeout(() => {
        setThinking(false);
        setCompleting(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: MOCK_RESPONSE,
          reasoning: REASONING_STEPS,
          records: MATURITY_RECORDS,
        }]);
      }, 450);
    }, 3500);
  };

  const dossierOpen = openDossierRecord !== null && !!DEMO_DOSSIERS[openDossierRecord?.id ?? ''];

  return (
    <div className="bg-[#f5f5f3] h-[480px] flex text-gray-900 overflow-hidden border border-white/5 rounded-xl shadow-2xl relative font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 scroll-smooth"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.length === 0 && !thinking && (
              <div className="flex flex-col items-center justify-center text-center pt-24 pb-8">
                <div className="w-10 h-10 rounded-xl bg-[#455a4f] flex items-center justify-center mb-4">
                  <Icons.Sparkles className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Send a message to see the animation</p>
                <p className="text-xs text-gray-400 mb-6">Or try one of these</p>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {['Which loans have maturities in the next 90 days?', 'How many deals are for data centers in Arizona?'].map(s => (
                    <button key={s} onClick={() => send(s)} className="px-4 py-2.5 text-sm text-left bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <TitanMessageIcon spinning={false} />}
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className={`text-sm rounded-2xl px-4 py-2.5 leading-relaxed ${msg.role === 'user' ? 'bg-white border border-gray-200 text-gray-900 rounded-tr-sm self-end' : 'bg-gray-50 border border-gray-200 text-gray-900 rounded-tl-sm'}`}>
                    {msg.reasoning && <ReasoningToggle steps={msg.reasoning} summary={REASONING_SUMMARY} />}
                    {renderText(msg.content)}
                  </div>
                  {msg.records && <RecordCards records={msg.records} openId={openDossierRecord?.id ?? null} onOpen={r => setOpenDossierRecord(prev => prev?.id === r.id ? null : r)} />}
                </div>
              </div>
            ))}
            {(thinking || completing) && <ThinkingAnimation key={thinkingKey} isComplete={completing} />}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-gray-400 transition-colors">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send(); }}
                placeholder="Ask anything about your portfolio…"
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || thinking}
                className="w-7 h-7 bg-[#455a4f] text-white rounded-lg flex items-center justify-center hover:bg-[#3a4a42] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Icons.Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dossier Side Panel */}
      <div className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${dossierOpen ? 'w-[320px]' : 'w-0'}`}>
        {openDossierRecord && DEMO_DOSSIERS[openDossierRecord.id] && (
          <DossierPanel dossier={DEMO_DOSSIERS[openDossierRecord.id]} onClose={() => setOpenDossierRecord(null)} />
        )}
      </div>
    </div>
  );
}
