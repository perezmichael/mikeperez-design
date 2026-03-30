import Link from "next/link";
import { CaseStudyLayout, CSSection, CSSectionLabel, CSPullQuote, CSInsightGrid, CSInsight } from "@/components/work/CaseStudyLayout";
import { AIInstruction } from "@/components/ui/AIInstruction";

export const metadata = {
  title: "Frequent Flyer — Mike Perez",
  description: "Building an AI-powered event discovery platform for LA, validated with 1,300 Instagram followers before writing a line of code.",
};

const meta = {
  company:     "Personal Project",
  title:       "Frequent Flyer",
  role:        "Founder · Designer · Builder",
  year:        "2024–Present",
  tags:        ["0→1 Product", "Event Discovery", "Maps", "AI Scraping", "Claude Code", "Supabase"],
  oneLiner:    "Moved to LA, couldn't find the best events. Validated demand with an Instagram page (1,300 followers), then built the real product — an AI-powered event discovery platform with a map, filters, and intelligent scraping.",
  accentColor: "rgba(200,96,26,0.9)",
};

export default function FrequentFlyerPage() {
  return (
    <CaseStudyLayout meta={meta}>

      <CSSection>
        <CSSectionLabel
          label="01 — The Problem"
          title="The best events in LA are invisible."
          description="Los Angeles has one of the richest underground event scenes in the world — underground shows, art openings, DJ sets, cultural markets. But they&apos;re scattered across Instagram DMs, Facebook groups, and flyer posts that the algorithm buries. There was no single place to find them."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {[
            { title: "The algorithmic wall", body: "Instagram is the primary source for events, but the algorithm favors ads over flyers. Fans miss half the shows they follow.", icon: "🧱" },
            { title: "No central map", body: "LA is massive. Finding events near you is impossible without cross-referencing three different apps.", icon: "🗺️" },
            { title: "Vibe discovery is hard", body: "Ticket apps categorize by genre. Users care about vibe — 'Underground', 'Art-Forward', 'Late Night'.", icon: "🔉" },
            { title: "Manual aggregation is slow", body: "I spent 4 hours a week manually scraping flyers. I needed an AI agent to scale.", icon: "🤖" },
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
              title="Building 0→1 with AI."
              description="With demand validated by 1,300 followers, I built the product using Claude Code as a co-pilot. I moved from a blank repository to a working dual-panel map in one weekend."
            />
            <div className="space-y-6 mt-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                    <span className="font-mono text-xs text-[var(--color-accent)]">Dual-Panel Map Layout</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Built the foundation of the Frequent Flyer experience—a responsive map that syncs with a scrollable list of events.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Refactor the MapLayout to use a dual-panel approach: map on the left, scrollable list on the right. When a user scrolls the list, highlight the corresponding marker on the map. Use Leaflet and Framer Motion for the interactions." />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div className="pb-2">
                    <span className="font-mono text-xs text-[var(--color-accent)]">AI Scraping Engine</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Automated the manual work by building an agent to extract event details from raw text and images.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Write a scraper logic that takes a raw flyer description and extracts: Event Name, Date, Venue, and Vibe tags. Use a structured JSON output so I can pipe it directly into my Supabase database." />
                </div>
              </div>
            </div>
            <CSPullQuote>
              The question was not &ldquo;should I build an app?&rdquo; The question was &ldquo;does this problem actually exist for other people, or just me?&rdquo;
            </CSPullQuote>
          </div>

          <div className="hidden lg:block pt-20">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--color-border)] bg-black/20 backdrop-blur-sm">
              <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-4">Methodology</p>
              <h3 className="text-lg font-medium text-white mb-4">Founder-First Design</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                I&apos;m not just building a product; I&apos;m building a community. Every design decision—from the vibe filters to the map markers—comes from real feedback from my 1,300 followers.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Lean validation first
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  AI-powered automation
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  100% Claude Code built
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="03 — Prototype"
          title="Live map preview."
          description="Explore the working map prototype embedded in the Lab. This is the exact code that powers the real Frequent Flyer application."
        />
        <div className="mt-8 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-fg)] mb-2">The Frequent Flyer Map</p>
          <p className="text-xs text-[var(--color-muted)] max-w-sm mb-6 leading-relaxed">
            The full interactive map experience is available in my experimental laboratory.
          </p>
          <Link
            href="/lab/frequent-flyer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-fg)] text-sm font-medium hover:brightness-110 transition-all shadow-[0_0_20px_-8_rgba(200,96,26,0.5)]"
          >
            Open in Lab
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </CSSection>

      <CSSection>
        <CSSectionLabel
          label="04 — Traction"
          title="Real numbers, real users."
        />
        <CSInsightGrid>
          <CSInsight
            number="1,300"
            label="Instagram followers"
            description="Organic growth, no paid promotion. Every follower found the page through discovery or word of mouth."
          />
          <CSInsight
            number="1yr"
            label="Validated before building"
            description="Ran the Instagram page for a full year before writing a single line of product code."
          />
          <CSInsight
            number="0→1"
            label="Full product story"
            description="Problem identification, lean validation, real traction, then building with AI. The complete arc."
          />
        </CSInsightGrid>
      </CSSection>

    </CaseStudyLayout>
  );
}
