import Link from "next/link";
import {
  CaseStudyLayout,
  CSSection,
  CSSectionLabel,
  CSPullQuote,
  CSInsightGrid,
  CSInsight,
} from "@/components/work/CaseStudyLayout";
import { AIInstruction } from "@/components/ui/AIInstruction";
import { FrequentFlyerMapEmbed } from "@/components/work/screens/FrequentFlyerMapEmbed";

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
  oneLiner:    "Moved to LA. Couldn't find the best events. Validated demand with an Instagram page — 1,300 followers in a year — then built the real product with AI.",
  accentColor: "rgba(200,96,26,0.9)",
};

export default function FrequentFlyerPage() {
  return (
    <CaseStudyLayout meta={meta}>

      {/* 01 — Problem */}
      <CSSection>
        <CSSectionLabel
          label="01 — The Problem"
          title="The best events in LA are invisible."
          description="Los Angeles has one of the richest underground event scenes in the world — art openings, DJ sets, cultural markets, late-night shows. But they live in Instagram DMs, Facebook groups, and flyer posts the algorithm buries. There was no single place to find them."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[
            { title: "The algorithmic wall",    body: "Instagram is the primary source for events, but the algorithm favors ads over flyers. Fans miss half the shows they'd go to.",          icon: "🧱" },
            { title: "No central map",          body: "LA is massive. Finding events near you means cross-referencing three different apps and a dozen accounts.",                               icon: "🗺️" },
            { title: "Vibe discovery is hard",  body: "Ticket apps categorize by genre. Locals care about vibe — 'underground', 'art-forward', 'late night', 'free'.",                        icon: "🔊" },
            { title: "Manual aggregation",      body: "I spent four hours a week scraping flyers by hand. The only path to scale was an AI agent that could do it automatically.",             icon: "🤖" },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/20 transition-colors duration-300 group">
              <div className="flex items-start gap-3">
                <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-fg)] mb-1.5">{item.title}</p>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CSSection>

      {/* 02 — Validation */}
      <CSSection>
        <CSSectionLabel
          label="02 — Validation"
          title="A year of proof before a line of code."
          description="The Instagram page came first. Before building anything, I needed to know the problem was real for other people — not just me. So I spent a year running the page manually: curating events, posting flyers, building an audience."
        />

        {/* Timeline */}
        <div className="relative mt-8">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[var(--color-border)]" />
          <div className="space-y-8">
            {[
              {
                label:     "Week 1",
                title:     "First post. Zero followers.",
                body:      "Posted a flyer for a show at The Echo. Six likes. Two saves. One DM from a stranger saying 'where has this page been.' That was enough.",
                highlight: false,
              },
              {
                label:     "Month 3",
                title:     "400 followers. Pattern confirmed.",
                body:      "Save rate was 4x higher than engagement rate. People weren't just liking — they were coming back. The page was being used as a tool, not consumed as content.",
                highlight: true,
              },
              {
                label:     "Month 12",
                title:     "1,300 followers. Time to build.",
                body:      "Organic. No paid promotion. Every follower found the page through discovery or word of mouth. Demand was real. The problem was real. Now build the product.",
                highlight: true,
              },
            ].map((step) => (
              <div key={step.label} className="flex gap-5 items-start relative">
                <div className={`w-[22px] h-[22px] shrink-0 rounded-full border-2 flex items-center justify-center z-10 ${
                  step.highlight
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-bg)]"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${step.highlight ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
                </div>
                <div>
                  <span className={`font-mono text-xs ${step.highlight ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}`}>
                    {step.label}
                  </span>
                  <p className={`text-sm font-medium mt-0.5 mb-1 ${step.highlight ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"}`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CSPullQuote>
          The question was never &ldquo;should I build an app?&rdquo; It was &ldquo;does this problem exist for other people, or just me?&rdquo; The Instagram page answered it.
        </CSPullQuote>
      </CSSection>

      {/* 03 — Process */}
      <CSSection>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <CSSectionLabel
              label="03 — Process"
              title="Building 0→1 with Claude Code."
              description="With demand validated, I built the product in a series of focused sprints using Claude Code as co-pilot. No agency. No team. Just tight loops between intent and execution."
            />
            <div className="space-y-6 mt-8">
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[var(--color-accent)]">Dual-Panel Map</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Built the core experience — a map that syncs with a scrollable event list, markers that fly to selection, neighborhood and vibe filtering.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Build a dual-panel layout: scrollable event list on the left, Leaflet map on the right. When a user clicks a card, highlight the marker and fly the map to that location. Use CARTO dark tiles, custom emoji divIcons, and Framer Motion for list transitions." />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-start">
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[var(--color-accent)]">AI Scraping Engine</span>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-0.5">Replaced the manual 4-hour weekly workflow with an agent that extracts event details from raw flyer text and images, pipes them into Supabase.</p>
                  </div>
                </div>
                <div className="ml-9">
                  <AIInstruction prompt="Write a scraper that takes a raw flyer description or image caption and extracts: Event Name, Date, Venue, Neighborhood, and Vibe tags. Return structured JSON compatible with my Supabase schema." />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block pt-16">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--color-border)] bg-black/20 backdrop-blur-sm">
              <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-4">Stack</p>
              <div className="space-y-4">
                {[
                  { label: "Frontend",  value: "Next.js, Tailwind, Framer Motion" },
                  { label: "Map",       value: "Leaflet + CARTO dark tiles" },
                  { label: "Data",      value: "Supabase (Postgres + Storage)" },
                  { label: "Scraping",  value: "Claude API + structured output" },
                  { label: "Built with", value: "Claude Code — 100%" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-0.5">{row.label}</p>
                    <p className="text-xs text-[var(--color-fg)]/80">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CSSection>

      {/* 04 — Interactive Prototype */}
      <CSSection>
        <CSSectionLabel
          label="04 — Prototype"
          title="The map, live."
          description="Click any event to fly the map to that location. Search by name or neighborhood. This is the same component that powers the real Frequent Flyer app."
        />
        <div className="mt-6">
          <FrequentFlyerMapEmbed />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[var(--color-muted)] font-mono">9 real LA neighborhoods · interactive filters · live flyTo</p>
          <Link
            href="/lab/frequent-flyer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors"
          >
            Open full-screen
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </CSSection>

      {/* 05 — Impact */}
      <CSSection>
        <CSSectionLabel
          label="05 — Traction"
          title="Real numbers, real users."
        />
        <CSInsightGrid>
          <CSInsight
            number="1,300"
            label="Instagram followers"
            description="Organic growth. No paid promotion. Every follower found the page through discovery or word of mouth."
          />
          <CSInsight
            number="1 yr"
            label="Validated before building"
            description="Ran the Instagram page for a full year before writing a single line of product code."
          />
          <CSInsight
            number="4 hrs"
            label="Saved per week"
            description="AI scraping agent replaced the manual flyer aggregation workflow entirely."
          />
        </CSInsightGrid>
      </CSSection>

      {/* 06 — Reflection */}
      <CSSection>
        <CSSectionLabel
          label="06 — Reflection"
          title="What this project is really about."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">Community before product</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              The Instagram page was the product for a year. The map is just a more efficient version of the same thing. This is what &ldquo;build for the community&rdquo; actually looks like — you use the community to validate before you ship.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">AI as a solo co-founder</p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              I designed it, Claude Code built it. The Leaflet map, the scraping agent, the Supabase schema — all prototyped in tight sessions, not long sprints. The speed unlocked a different kind of product thinking.
            </p>
          </div>
        </div>
      </CSSection>

    </CaseStudyLayout>
  );
}
