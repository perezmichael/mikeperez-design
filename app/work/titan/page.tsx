import { CaseStudyLayout, CSSection, CSSectionLabel, CSPullQuote, CSInsightGrid, CSInsight } from "@/components/work/CaseStudyLayout";
import { TitanChatPrototype } from "@/components/work/screens/TitanScreens";
import { TitanAdvancedChatPrototype } from "@/components/work/screens/TitanAdvancedChatPrototype";
import { AIInstruction } from "@/components/ui/AIInstruction";

export const metadata = {
  title: "Titan — AI Agents for Banking · Mike Perez",
  description: "Designing AI agent interfaces, chat UX, and tool calling patterns for regional banks.",
};

const meta = {
  company:     "Titan",
  title:       "AI Agents for Banking",
  role:        "Product Designer (Freelance)",
  year:        "2025",
  tags:        ["AI Agents", "Chat UX", "Tool Calling", "Fintech", "Claude Code"],
  oneLiner:    "Designing the full AI agents experience for Titan's banking platform — chat interfaces, tool calling visualization, record population, and the interaction design of watching an AI think.",
  accentColor: "rgba(80,120,220,0.9)",
};

export default function TitanPage() {
  return (
    <CaseStudyLayout meta={meta}>

      <CSSection>
        <CSSectionLabel
          label="01 — Challenge"
          title="AI for banks that aren't JPMorgan."
          description="Regional banks across America need AI tools but don&apos;t have the engineering resources of the big players. Titan builds custom LLMs and agent platforms for these banks. The challenge: design an agent experience that feels trustworthy and transparent to bank employees who are skeptical of AI — and powerful enough to actually replace workflows."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: "Agents are opaque by nature", body: "When an AI is filling in a loan record or calling an API, the user needs to understand what is happening and why. Opacity kills trust.", icon: "🌫️" },
            { title: "Tool calling has no established UX", body: "There is no design pattern library for agent tool calls. We were designing from first principles.", icon: "🛠️" },
            { title: "Bank employees are not tech users", body: "The audience is loan officers and tellers, not engineers. The interface had to feel like a coworker, not a developer tool.", icon: "🏦" },
            { title: "Error states matter more than happy paths", body: "When an agent gets a tool call wrong or hits a permission boundary, the failure UX determines whether users trust it again.", icon: "🚫" },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/20 transition-colors duration-300 group">
              <div className="flex items-start gap-3">
                <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-fg)] mb-2">{item.title}</p>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CSSection>

      <CSSection>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <CSSectionLabel
              label="02 — Process"
              title="Prototyping the thinking process."
              description="Designing AI is different than designing static apps. You aren't just designing screens; you're designing the behavior of an entity. I used Claude Code to iterate on the 'thinking' states in real-time."
            />
            <div className="space-y-6 mt-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                    <span className="font-mono text-xs text-[var(--color-accent)]">Tool Chain Visualization</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">We moved away from generic spinners to a live-updating tool chain. This prompt helped build the recursive logic for the UI.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Refactor the Message component to support an optional 'tools' array. Each tool should have a status (running, complete, error). Animate the transition from running to complete with a green checkmark and a slight bounce." />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                          <span className="font-mono text-xs text-[var(--color-accent)]">Contextual Record Population</span>
                          <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Ensuring the sidebar updates in sync with the agent&apos;s discoveries was key for user trust.</p>
                        </div>
                      </div>
                      <div className="ml-9">
                        <AIInstruction prompt="Implement a &apos;RecordField&apos; component that takes a &apos;visible&apos; boolean. When visible is true, reveal the content with a slide-in and a subtle orange shimmer effect to indicate the data was just populated by the agent." />
                      </div>
                    </div>
                  </div>
            <CSPullQuote>
              Designing AI interfaces is designing for uncertainty. The question isn&apos;t what happens when it works — it&apos;s what happens when the user doesn&apos;t know if it worked.
            </CSPullQuote>
          </div>

          <div className="hidden lg:block pt-20">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--color-border)] bg-black/20 backdrop-blur-sm">
              <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-4">Methodology</p>
              <h3 className="text-lg font-medium text-white mb-4">Behavioral Design</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                I prototyped agent behaviors using mock tool calling logic to test how users react to different &quot;thinking&quot; speeds and transparency levels.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Interaction-first prototyping
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Trust-centered transparency
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Claude Code iteration
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="03 — Prototype"
          title="Playable agent experience."
          description="A standalone interactive prototype of the Titan agent chat. Click the suggested queries to see the agent call tools, update the record context, and reason through a banking workflow."
        />
        <div className="mt-8 space-y-16">
          <div>
            <h4 className="text-sm font-medium text-[var(--color-fg)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
              Iteration 1: Dark Mode Context Population
            </h4>
            <TitanChatPrototype />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--color-fg)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
              Iteration 2: Light Mode Thinking + Record Dossier
            </h4>
            <TitanAdvancedChatPrototype />
          </div>
        </div>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="04 — Why This Matters"
          title="This is the frontier of AI design."
        />
        <CSInsightGrid>
          <CSInsight
            number="0"
            label="Existing patterns to copy"
            description="Tool calling UX is a design problem being solved in real time. Titan, Anthropic, and Google are all figuring this out simultaneously."
          />
          <CSInsight
            number="3"
            label="Concurrent AI projects"
            description="Apple (Claude Code prototyping), Titan (designing AI agents), Frequent Flyer (AI-built product). Not dabbling — immersed."
          />
          <CSInsight
            number="Meta"
            label="AI designing AI"
            description="Every screen in this project was prototyped using Claude Code — using AI to design the AI interface is the whole point."
          />
        </CSInsightGrid>
      </CSSection>

    </CaseStudyLayout>
  );
}
