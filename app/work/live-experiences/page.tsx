import {
  CaseStudyLayout,
  CSSection,
  CSSectionLabel,
  CSPullQuote,
  CSScreenGrid,
  CSScreen,
  CSInsightGrid,
  CSInsight,
} from "@/components/work/CaseStudyLayout";
import {
  WalletPassBuilderScreen,
  PassesListScreen,
  TransferLandingScreen,
  GuestManagementScreen,
  GuestInvitationScreen,
  LegacyBeforeScreen,
} from "@/components/work/screens/LiveExperiencesScreens";
import { TicketFlowWalkthrough } from "@/components/work/screens/TicketFlowWalkthrough";
import { AIInstruction } from "@/components/ui/AIInstruction";

export const metadata = {
  title: "Live Experiences — Apple · Mike Perez",
  description: "Redesigning Apple Music's internal ticketing platform and consumer-facing ticket distribution flows.",
};

const meta = {
  company:     "Apple",
  title:       "Live Experiences",
  role:        "Product Designer, IS&T (Contractor)",
  year:        "2025–Present",
  tags:        ["Enterprise", "Consumer", "NFC", "Apple Wallet", "Claude Code", "Live Events"],
  oneLiner:    "Redesigned Apple Music's internal ticketing platform and consumer-facing ticket distribution — from an aging Ruby on Rails app to a modern Wallet Pass experience used at Lady Gaga and Bad Bunny events.",
  isNDA:       true,
  accentColor: "rgba(200,96,26,1)",
};

export default function LiveExperiencesPage() {
  return (
    <CaseStudyLayout meta={meta}>

      {/* The Challenge */}
      <CSSection>
        <CSSectionLabel
          label="01 — Challenge"
          title="A legacy app powering world-class events."
          description="Apple Live Experiences plans some of the largest music events in the world. But the internal tool running ticket distribution was a dated Ruby on Rails app — minimal hierarchy, no modern Wallet integration, and no unified flow connecting the internal admin experience to what fans actually saw."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "No Wallet Pass builder", body: "Customizing Apple/Google Wallet passes required direct code changes. No admin could do it without engineering.", icon: "⚠" },
            { title: "Disconnected fan experience", body: "Fans received tickets through a fragmented flow — no consistent landing page, no branded transfer experience.", icon: "🔗" },
            { title: "Guest management was manual", body: "Transferring tickets to guests involved email threads. No expiry, no revocation, no visibility for the host.", icon: "📧" },
            { title: "NFC integration was missing", body: "The system had no path toward NFC check-in, which is required for the Wallet pass experience Apple expects.", icon: "📱" },
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

      {/* Before / After */}
      <CSSection>
        <CSSectionLabel
          label="02 — Before & After"
          title="From Rails form to polished platform."
        />
        <CSScreenGrid>
          <CSScreen
            title="Before — Legacy Ticketing Portal"
            description="Dated Rails UI. Dense tables, no visual hierarchy, basic form inputs for Wallet config. No branded experience."
          >
            <LegacyBeforeScreen />
          </CSScreen>
          <CSScreen
            title="After — Wallet Pass Builder v5"
            description="Form on left with real-time preview on right. Tab structure mirrors the complexity of pass configuration without overwhelming the user. Click the tabs to explore."
          >
            <WalletPassBuilderScreen />
          </CSScreen>
        </CSScreenGrid>
        <CSPullQuote>
          The team went from needing engineering for every pass update to shipping production Wallet passes independently — in the same week.
        </CSPullQuote>
      </CSSection>

      {/* Process */}
      <CSSection>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <CSSectionLabel
              label="03 — Process"
              title="Five iterations in two weeks with Claude Code."
              description="The Wallet Pass Builder went through 5 major versions. Each iteration was prototyped in code using Claude Code, demoed to the team, and refined based on how internal coordinators actually used it. What would have taken a traditional design-dev cycle weeks, took days."
            />
            <div className="mt-8 relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[var(--color-border)]" />
              <div className="space-y-6">
                {[
                  { v: "V1", desc: "Basic form — all fields on one page. Coordinators said it felt like filling out a tax form.", highlight: false },
                  { v: "V2", desc: "Added tab structure. Preview pane added but static — not connected to form inputs.", highlight: false },
                  { v: "V3", desc: "Live preview connected to form. Coordinators immediately started using it as a testing tool.", highlight: true, prompt: "Refactor the WalletPassBuilder component to use a shared state object for all fields. Connect the preview pane to this state so it updates in real-time as I type in the form inputs. Use a spring animation for the preview transitions." },
                  { v: "V4", desc: "Added color picker, logo upload, and Apple vs Google Wallet switching in preview.", highlight: false },
                  { v: "V5", desc: "Final polish — edge case handling, empty states, loading feedback. This is what engineering built.", highlight: true, prompt: "Add accessibility labels to all form inputs. Implement a 'Shimmer' loading state for the preview pane when switching tabs. Ensure the layout remains stable on mobile viewports." },
                ].map((step) => (
                  <div key={step.v} className="flex flex-col gap-4">
                    <div className="flex gap-4 items-start relative">
                      <div className={`w-[22px] h-[22px] shrink-0 rounded-full border-2 flex items-center justify-center z-10 ${
                        step.highlight
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                          : "border-[var(--color-border)] bg-[var(--color-bg)]"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${step.highlight ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
                      </div>
                      <div className="pb-2">
                        <span className={`font-mono text-xs ${step.highlight ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}`}>{step.v}</span>
                        <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                    {step.prompt && (
                      <div className="ml-9">
                        <AIInstruction prompt={step.prompt} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block pt-20">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--color-border)] bg-black/20 backdrop-blur-sm">
              <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-4">Methodology</p>
              <h3 className="text-lg font-medium text-white mb-4">Vibe Coding</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                Instead of handing off static Figma files, I used Claude Code to build a living design system. This allowed the team to &quot;feel&quot; the interactions long before they were built in production.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Real-time stakeholder feedback
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Zero design-to-dev friction
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Production-ready patterns
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSection>

      {/* Interactive Flow Walkthrough */}
      <CSSection>
        <CSSectionLabel
          label="04 — The Flow"
          title="End-to-end ticket distribution."
          description="From receiving an invitation to adding a pass to your Wallet — walk through the entire experience. Click each step to see the corresponding screen."
        />
        <div className="mt-8">
          <TicketFlowWalkthrough />
        </div>
      </CSSection>

      {/* Key Screens */}
      <CSSection>
        <CSSectionLabel
          label="05 — Key Screens"
          title="The full system in detail."
          description="From the internal pass management table to the fan-facing transfer and acceptance experience — every screen was designed as part of a single coherent system. All screens below are interactive."
        />
        <CSScreenGrid>
          <CSScreen
            title="Passes List"
            description="Internal table showing all wallet passes with status, event association, and one-click Apple/Google Wallet downloads."
          >
            <PassesListScreen />
          </CSScreen>
          <CSScreen
            title="Transfer Landing Page"
            description="Fan-facing entry point. Personalized greeting, artist hero, three clear distribution paths. Click the options to explore."
          >
            <TransferLandingScreen />
          </CSScreen>
          <CSScreen
            title="Guest Management"
            description="Host view of all ticket assignments. Pending transfers show expiry countdown. One-tap revoke for no-shows."
          >
            <GuestManagementScreen />
          </CSScreen>
          <CSScreen
            title="Guest Invitation"
            description="Guest-facing acceptance flow. Click 'Accept' to see the confirmation state with wallet pass preview."
          >
            <GuestInvitationScreen />
          </CSScreen>
        </CSScreenGrid>
      </CSSection>

      {/* Impact */}
      <CSSection>
        <CSSectionLabel
          label="06 — Impact"
          title="Shipped to production. Used at scale."
        />
        <CSInsightGrid>
          <CSInsight
            number="5×"
            label="Faster pass creation"
            description="Coordinators went from requiring engineering changes to publishing passes independently."
          />
          <CSInsight
            number="2"
            label="Major events shipped"
            description="The new flows supported events at the Wiltern and a halftime show — before the full rebuild was complete."
          />
          <CSInsight
            number="4 wks"
            label="From concept to dev handoff"
            description="Claude Code prototyping compressed a multi-sprint design cycle into a focused four-week push."
          />
        </CSInsightGrid>
        <CSPullQuote>
          &ldquo;The team is really excited about the prototyping work — they haven&apos;t seen designs move this fast.&rdquo;
        </CSPullQuote>
      </CSSection>

      {/* Reflection */}
      <CSSection>
        <CSSectionLabel
          label="07 — Reflection"
          title="What I learned."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">Internal/external duality is underrated</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              The admin tool and the fan experience are two completely different products — but every decision in one affects the other. Designing them simultaneously forced a level of systems thinking that separate projects don&apos;t require.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">Claude Code changed how I pitch ideas</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              When you can show a working prototype in the same meeting where you explain a concept, stakeholder alignment happens faster. The V3 moment — where the live preview updated as you typed — sold the whole direction without a single slide.
            </p>
          </div>
        </div>
      </CSSection>

    </CaseStudyLayout>
  );
}
