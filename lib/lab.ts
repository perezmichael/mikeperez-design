export interface LabItem {
  slug:        string;
  title:       string;
  description: string;
  tags:        string[];
  status:      "shipped" | "beta" | "wip";
  accent:      string;
}

export const labItems: LabItem[] = [
  {
    slug:        "frequent-flyer",
    title:       "Frequent Flyer Map",
    description: "Interactive event discovery for LA. Leaflet map with neighborhood filtering, vibe tags, and a dual-panel layout.",
    tags:        ["Next.js", "Leaflet", "Supabase"],
    status:      "shipped",
    accent:      "rgba(200,96,26,0.15)",
  },
  {
    slug:        "particles",
    title:       "Morphing Particles",
    description: "Three.js particle system that shifts between geometric forms. Pure visual exploration.",
    tags:        ["Three.js", "WebGL"],
    status:      "shipped",
    accent:      "rgba(100,120,200,0.12)",
  },
  {
    slug:        "aura",
    title:       "Aura",
    description: "Vibe-based generative art that reads a mood and produces a visual response. Claude API integration in progress.",
    tags:        ["Claude API", "Generative Art"],
    status:      "beta",
    accent:      "rgba(140,80,200,0.12)",
  },
  {
    slug:        "isla",
    title:       "Isla Beatmaker",
    description: "Web-based drum machine and sequencer. Explores the 'creator tools' angle with a focus on tactile interaction.",
    tags:        ["Web Audio API", "Creator Tools"],
    status:      "wip",
    accent:      "rgba(80,200,120,0.12)",
  },
  {
    slug:        "crew",
    title:       "Crew",
    description: "A landing page that plays like a music video. Beat-synced canvas visuals driven by a hand-keyed frequency timeline of GoldLink's 'Crew'.",
    tags:        ["Canvas", "Beat Sync", "Easter Eggs"],
    status:      "shipped",
    accent:      "rgba(212,168,67,0.14)",
  },
  {
    slug:        "cien",
    title:       "Cien",
    description: "Speak Spanish with the 100 most common words. Flashcards with phrase breakdowns, speech synthesis, and a grid that lights up as you learn.",
    tags:        ["Learning", "Speech Synthesis"],
    status:      "shipped",
    accent:      "rgba(232,98,42,0.12)",
  },
  {
    slug:        "design-system",
    title:       "AI-Native Design System",
    description: "A living component library where every element includes the AI instructions used to generate it.",
    tags:        ["Design Systems", "AI Meta"],
    status:      "beta",
    accent:      "rgba(200,180,80,0.12)",
  },
];
