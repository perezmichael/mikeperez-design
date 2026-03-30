export interface LAEvent {
  id:           string;
  title:        string;
  date:         string;
  location:     string;
  description:  string;
  lat:          number;
  lng:          number;
  neighborhood: string;
  vibes:        string[];
  free:         boolean;
  image:        string; // emoji fallback for now
}

export const neighborhoods = [
  "All",
  "Echo Park",
  "Silver Lake",
  "DTLA",
  "Los Feliz",
  "Koreatown",
  "West Adams",
  "Highland Park",
  "Boyle Heights",
];

export const allVibes = [
  "jazz",
  "electronic",
  "indie",
  "hip-hop",
  "art",
  "film",
  "comedy",
  "dance",
  "ambient",
  "punk",
];

export const events: LAEvent[] = [
  {
    id:           "e1",
    title:        "Late Plates at the Echo",
    date:         "Fri, Apr 4 · 9 PM",
    location:     "The Echo, 1822 W Sunset Blvd",
    description:  "Rotating local DJs, no cover before 10. Part of the monthly underground series.",
    lat:          34.0782,
    lng:          -118.2604,
    neighborhood: "Echo Park",
    vibes:        ["electronic", "dance"],
    free:         true,
    image:        "🎧",
  },
  {
    id:           "e2",
    title:        "Gallery Night — Elsewhere",
    date:         "Sat, Apr 5 · 7 PM",
    location:     "Elsewhere Gallery, 2206 W Sunset Blvd",
    description:  "New works from five emerging LA artists. Wine. Low lighting. Good crowd.",
    lat:          34.0770,
    lng:          -118.2625,
    neighborhood: "Echo Park",
    vibes:        ["art"],
    free:         true,
    image:        "🎨",
  },
  {
    id:           "e3",
    title:        "Hyperion Sessions",
    date:         "Fri, Apr 4 · 8 PM",
    location:     "Cha Cha Lounge, 2375 Glendale Blvd",
    description:  "Acoustic sets, cheap beer, sticky floors. The best kind of Friday.",
    lat:          34.0887,
    lng:          -118.2641,
    neighborhood: "Silver Lake",
    vibes:        ["indie", "punk"],
    free:         false,
    image:        "🎸",
  },
  {
    id:           "e4",
    title:        "Sunset Comedy Hour",
    date:         "Thu, Apr 3 · 8 PM",
    location:     "Lot 1, 1527 Griffith Park Blvd",
    description:  "Intimate standup in a converted garage space. 30 seats. BYOB.",
    lat:          34.0851,
    lng:          -118.2619,
    neighborhood: "Silver Lake",
    vibes:        ["comedy"],
    free:         false,
    image:        "🎤",
  },
  {
    id:           "e5",
    title:        "Rooftop Jazz — Grand Central",
    date:         "Sat, Apr 5 · 6 PM",
    location:     "Grand Central Market Roof, 317 S Broadway",
    description:  "Sunset jazz sessions above the market. Free entry, full bar.",
    lat:          34.0507,
    lng:          -118.2492,
    neighborhood: "DTLA",
    vibes:        ["jazz", "ambient"],
    free:         true,
    image:        "🎺",
  },
  {
    id:           "e6",
    title:        "Short Film Bloc",
    date:         "Sun, Apr 6 · 4 PM",
    location:     "Regent Theater, 448 S Main St",
    description:  "12 films. 12 minutes each. Audience votes. Filmmaker Q&A after.",
    lat:          34.0474,
    lng:          -118.2488,
    neighborhood: "DTLA",
    vibes:        ["film", "art"],
    free:         false,
    image:        "🎬",
  },
  {
    id:           "e7",
    title:        "Vermont Ave Block Party",
    date:         "Sun, Apr 6 · 2 PM",
    location:     "Vermont & Franklin Ave",
    description:  "Local vendors, live cumbia, tamales, low riders. All-ages.",
    lat:          34.1063,
    lng:          -118.2907,
    neighborhood: "Los Feliz",
    vibes:        ["dance", "art"],
    free:         true,
    image:        "🎉",
  },
  {
    id:           "e8",
    title:        "Club Tonic — K-town",
    date:         "Sat, Apr 5 · 10 PM",
    location:     "Tonic, 3221 W 8th St",
    description:  "Weekly. Underground beats, packed floor, no attitude.",
    lat:          34.0600,
    lng:          -118.3058,
    neighborhood: "Koreatown",
    vibes:        ["electronic", "dance", "hip-hop"],
    free:         false,
    image:        "🔊",
  },
  {
    id:           "e9",
    title:        "Avenue 50 Open Studios",
    date:         "Sat, Apr 5 · 12 PM",
    location:     "Avenue 50 Studio, 131 N Ave 50",
    description:  "Highland Park artists open their studios. Self-guided tour, free.",
    lat:          34.1047,
    lng:          -118.2019,
    neighborhood: "Highland Park",
    vibes:        ["art"],
    free:         true,
    image:        "🖼️",
  },
];
