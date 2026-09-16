export interface ValioLink {
  id: "linkedin" | "frequent-flyer" | "instagram" | "x";
  label: string;
  short: string;
  kicker: string;
  blurb: string;
  url: string;
  display: string;
  /* opens on my own phone mid-conversation, for the pieces I demo */
  demo?: boolean;
}

export const VALIO = {
  name: "Mike Perez",
  role: "Product designer at Apple",
  city: "Los Angeles",
  email: "hi@mikeperezdigital.com",
  about:
    "Ten years designing across fintech, AI, and Apple. These days I prototype in code with AI in the loop — and the best proof is something you can open on your phone.",
  photo: "/valio/mike-snow.jpg",
  /* pre-cropped head-to-snow, so the Flip hero never clips his head */
  photoHero: "/valio/mike-hero.jpg",
  avatar: "/valio/mike-avatar.jpg",
  contact: "/valio/contact",
  links: [
    {
      id: "linkedin",
      label: "LinkedIn",
      short: "LinkedIn",
      kicker: "Let's connect",
      blurb: "The fastest way to keep this conversation going.",
      url: "https://www.linkedin.com/in/michaelwperez/",
      display: "linkedin.com/in/michaelwperez",
    },
    {
      id: "frequent-flyer",
      label: "Frequent Flyer",
      short: "Frequent Flyer",
      kicker: "Live product",
      blurb: "LA event discovery I designed and built with AI in the loop.",
      url: "https://www.frequentflyerla.com/",
      display: "frequentflyerla.com",
      demo: true,
    },
    {
      id: "instagram",
      label: "@frequentflyerla",
      short: "Instagram",
      kicker: "The community",
      blurb: "The flyers, the parties, the people who show up.",
      url: "https://www.instagram.com/frequentflyerla/",
      display: "instagram.com/frequentflyerla",
      demo: true,
    },
    {
      id: "x",
      label: "@dreamsofprompts",
      short: "X",
      kicker: "The feed",
      blurb: "Where I post the AI and design work as it happens.",
      url: "https://x.com/dreamsofprompts",
      display: "x.com/dreamsofprompts",
    },
  ] as ValioLink[],
};

export function valioLink(id: ValioLink["id"]): ValioLink {
  return VALIO.links.find((l) => l.id === id)!;
}
