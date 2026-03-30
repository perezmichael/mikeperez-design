export interface WorkItem {
  slug:        string;
  company:     string;
  title:       string;
  description: string;
  tags:        string[];
  year:        string;
  status:      "featured" | "nda";
  accent:      string;  // CSS gradient for card visual
}

export const workItems: WorkItem[] = [
  {
    slug:        "live-experiences",
    company:     "Apple",
    title:       "Live Experiences — Event Ticketing",
    description:
      "Redesigned the internal ticketing platform and consumer-facing ticket flows for Apple Music's live events. From a legacy Rails app to a modern Wallet Pass Builder, fan invitation pages, and guest transfer system with NFC integration.",
    tags:        ["Enterprise", "Consumer", "AI Prototyping", "Live Events"],
    year:        "2025–Present",
    status:      "nda",
    accent:      "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #1a1a1a 100%)",
  },
  {
    slug:        "circa",
    company:     "Apple",
    title:       "Circa — Security Credentials",
    description:
      "End-to-end redesign of a credential management system for Apple TV+ productions. IoT badge readers, personnel tracking, and emergency location detection — shipped from concept to developer handoff in 4 weeks using Claude Code.",
    tags:        ["IoT", "Enterprise", "Claude Code", "4-Week Sprint"],
    year:        "2025",
    status:      "nda",
    accent:      "linear-gradient(135deg, #1a2e1a 0%, #2d442d 50%, #1a1a1a 100%)",
  },
  {
    slug:        "titan",
    company:     "Titan",
    title:       "AI Agents for Banking",
    description:
      "Regional banks need AI but don't have JPMorgan's resources. Designing the entire agents experience for Titan's custom LLM platform — chat interfaces, tool calling, record population, and the UX of watching an AI think.",
    tags:        ["AI Agents", "Chat UX", "Fintech", "Tool Calling"],
    year:        "2025",
    status:      "featured",
    accent:      "linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #0d1520 100%)",
  },
  {
    slug:        "frequent-flyer",
    company:     "Personal Project",
    title:       "Frequent Flyer — Event Discovery",
    description:
      "Moved to LA. Realized the city's best events — underground shows, art openings, DJ sets — were impossible to find. Validated with an Instagram page (1,300 followers), then built the real product: an AI-powered event discovery platform with a map, filters, and intelligent scraping.",
    tags:        ["0→1 Product", "Maps", "AI Scraping", "Creator"],
    year:        "2024–Present",
    status:      "featured",
    accent:      "linear-gradient(135deg, #1f0d00 0%, #3d1a00 50%, #1a0e00 100%)",
  },
];
