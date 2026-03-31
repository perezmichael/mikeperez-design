import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { AboutTerminal } from "@/components/ui/AboutTerminal";
import Link from "next/link";

export const metadata = { title: "About — Mike Perez" };

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#0f0e0c]">
      {/* Hero Section with Terminal */}
      <Section className="mb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-start">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Background</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] leading-tight mb-8">
                Building interfaces that feel like music.
              </h1>
              <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-6">
                I&apos;m a product designer who builds. For the last 10 years, I&apos;ve worked across enterprise scale (Apple, Schwab, ADP) and 0→1 startups, bridging the gap between deep systems thinking and creative edge.
              </p>
              <p className="text-lg text-[var(--color-muted)] leading-relaxed">
                Today, I use AI as a design material. I don&apos;t just hand off static pixels — I prototype in code, using Claude Code and AI agents to build living systems that teams can feel before they ship.
              </p>
            </div>
            <div className="w-full lg:w-[500px]">
              <AboutTerminal />
            </div>
          </div>
        </Container>
      </Section>

      {/* Narrative Sections */}
      <Section className="border-t border-white/5 pt-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Philosophy */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Philosophy</h2>
              <div className="space-y-6 text-[var(--color-muted)] leading-relaxed">
                <p>
                  I believe the best interfaces share the same DNA as a good song: rhythm, clarity, and soul. Whether I&apos;m designing a security dashboard for Apple TV+ or a chat interface for an AI agent, I&apos;m looking for that same sense of flow.
                </p>
                <p>
                  My transition to &quot;AI-native&quot; design isn&apos;t about using a new tool — it&apos;s about a new methodology. I call it <span className="text-white italic">Vibe Coding</span>. It&apos;s about maintaining a tight loop between intent and execution, where the AI allows me to stay in a state of flow while building complex systems.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Experience</h2>
              <div className="space-y-8">
                {[
                  { company: "Apple", role: "Product Designer, IS&T", year: "2024–Present", desc: "Redesigning internal ticketing systems and consumer-facing Wallet flows for Apple Music events." },
                  { company: "Titan", role: "Product Designer", year: "2025", desc: "Designing the interaction patterns of AI agents for the regional banking sector." },
                  { company: "Bulla Network", role: "Head of Product", year: "2022–2023", desc: "Led product and design for a decentralized finance protocol, managing cross-functional teams." },
                  { company: "Schwab / ADP / Honeywell", role: "Product Designer", year: "2015–2021", desc: "Shipped enterprise-grade software at massive scale across fintech and industrial sectors." },
                ].map((job) => (
                  <div key={job.company} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <h3 className="text-sm font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">{job.company}</h3>
                      <span className="font-mono text-[10px] text-white/20">{job.year}</span>
                    </div>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">{job.role}</p>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">{job.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Tools & Workflow */}
      <Section className="py-24">
        <Container>
          <div className="p-12 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/10 blur-[100px] pointer-events-none" />
            
            <h2 className="text-2xl font-semibold text-white mb-8">Tools & Workflow</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Design", tools: "Figma, Framer, Adobe CC" },
                { label: "Build", tools: "Next.js, Tailwind, Claude Code" },
                { label: "AI", tools: "Gemini, Midjourney, Cursor" },
                { label: "Music", tools: "Ableton Live, Isla S2400" },
              ].map((cat) => (
                <div key={cat.label}>
                  <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-3">{cat.label}</p>
                  <p className="text-sm text-white/80 leading-relaxed">{cat.tools}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="pb-32">
        <Container className="text-center">
          <p className="text-lg text-[var(--color-muted)] mb-8 max-w-xl mx-auto">
            I&apos;m always looking for the next challenge in AI-native design and creator tools.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hi@mikeperezdigital.com"
              className="px-8 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-all"
            >
              Email me
            </a>
            <a
              href="https://linkedin.com/in/mikeperezdigital"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
            >
              LinkedIn
            </a>
            <Link 
              href="/vibes"
              className="px-8 py-3 rounded-xl font-mono text-[11px] text-white/20 hover:text-white/40 transition-all uppercase tracking-widest"
            >
              /vibes
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
