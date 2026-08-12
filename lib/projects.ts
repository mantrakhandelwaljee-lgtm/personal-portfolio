export type MediaItem =
  | { kind: "image"; src: string; alt: string; caption: string; wide?: boolean }
  | { kind: "video"; src: string; poster?: string; caption: string; wide?: boolean; speed?: number }
  | { kind: "note"; heading: string; body: string }
  | { kind: "horizontal-gallery"; heading?: string; images: { src: string; alt: string }[] }
  | { kind: "grid-4x"; heading?: string; images: { src: string; alt: string }[] }
  | { kind: "collage-3x"; heading?: string; images: { src: string; alt: string }[] }
  | { kind: "intro" }

export type Project = {
  slug: string
  title: string
  /** letter rendered inside the hero block — first letter of the title */
  letter: string
  year: string
  role: string
  area: "green" | "yellow" | "red" | "gray" | "black" | "blue"
  /** css color token used for the fill transition + project page accents */
  color: string
  /** foreground that reads on `color` */
  onColor: string
  tagline: string
  intro: string
  stack: string[]
  media: MediaItem[]
}

export const projects: Project[] = [
  {
    slug: "journey-finder",
    title: "Journey Finder",
    letter: "J",
    year: "2026",
    role: "Design & Build",
    area: "green",
    color: "var(--brand-green)",
    onColor: "var(--brand-black)",
    tagline: "Turning travel plans into shared experiences.",
    intro:
      "Finding the right journey shouldn't feel like searching through endless options. I built a simple way for students to discover, compare, and share journeys, making it easier to turn travel plans into shared experiences.",
    stack: ["Next.js", "TypeScript", "Postgres", "Tailwind"],
    media: [
      {
        kind: "video",
        src: "/projects/journey-finder/new/intro_video.mov",
        caption: "Introduction to Journey Finder",
        wide: true,
      },
      {
        kind: "intro",
      },
      {
        kind: "grid-4x",
        images: [
          { src: "/projects/journey-finder/new/intro_page.png", alt: "Intro page" },
          { src: "/projects/journey-finder/new/login_page.png", alt: "Login page" },
          { src: "/projects/journey-finder/new/find_page.png", alt: "Find page" },
          { src: "/projects/journey-finder/new/publish_page.png", alt: "Publish page" },
        ],
      },
      {
        kind: "video",
        src: "/projects/journey-finder/new/functionality_video.mov",
        caption: "Core Functionality",
        wide: true,
      },
    ],
  },
  {
    slug: "atlas",
    title: "Atlas",
    letter: "A",
    year: "2025",
    role: "Product Design",
    area: "yellow",
    color: "var(--brand-yellow)",
    onColor: "var(--brand-black)",
    tagline: "A dashboard that answers before you ask.",
    intro:
      "An analytics surface built around questions instead of charts — the numbers you need are already on screen when you arrive.",
    stack: ["React", "D3", "Design System"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "note",
        heading: "In progress",
        body: "Case study write-up and visuals coming soon.",
      },
    ],
  },
  {
    slug: "roadtrip",
    title: "RoadTrip",
    letter: "R",
    year: "2026",
    role: "Design & Build",
    area: "red",
    color: "var(--brand-red)",
    onColor: "#ffffff",
    tagline: "Group travel, without the chaos.",
    intro:
      "The biggest challenge with group road trips is keeping everyone on the same page. RoadTrip brings suggestions, approvals, and navigation together so everyone can help shape the journey without the usual back-and-forth.",
    stack: ["Next.js", "React Native", "Maps API"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "horizontal-gallery",
        heading: "Host-Perspective",
        images: [
          { src: "/projects/roadtrip/Host /screen4.png", alt: "RoadTrip screen 4" },
          { src: "/projects/roadtrip/Host /screen1.png", alt: "RoadTrip screen 1" },
          { src: "/projects/roadtrip/Host /screen3.png", alt: "RoadTrip screen 3" },
          { src: "/projects/roadtrip/Host /screen2.png", alt: "RoadTrip screen 2" },
        ],
      },
      {
        kind: "collage-3x",
        heading: "User-Perspective",
        images: [
          { src: "/projects/roadtrip/User/IMG_8567.jpeg", alt: "User perspective 1" },
          { src: "/projects/roadtrip/User/IMG_8568.jpeg", alt: "User perspective 2" },
          { src: "/projects/roadtrip/User/IMG_8569.jpeg", alt: "User perspective 3" },
        ],
      },
    ],
  },
  {
    slug: "studio-notes",
    title: "Studio Notes",
    letter: "S",
    year: "2024",
    role: "Editorial & Code",
    area: "gray",
    color: "var(--brand-gray)",
    onColor: "var(--brand-black)",
    tagline: "Writing about interfaces, in public.",
    intro:
      "A long-running notebook of interface teardowns, typography experiments and half-finished ideas kept deliberately rough.",
    stack: ["MDX", "Next.js"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "note",
        heading: "In progress",
        body: "Case study write-up and visuals coming soon.",
      },
    ],
  },
  {
    slug: "nebula",
    title: "Nebula",
    letter: "N",
    year: "2024",
    role: "Creative Development",
    area: "black",
    color: "var(--brand-black)",
    onColor: "#ffffff",
    tagline: "A generative identity that never repeats.",
    intro:
      "A brand system where every asset is produced from the same set of rules, so no two touchpoints are ever identical.",
    stack: ["Canvas", "WebGL", "Type"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "note",
        heading: "In progress",
        body: "Case study write-up and visuals coming soon.",
      },
    ],
  },
  {
    slug: "beacon",
    title: "Beacon",
    letter: "B",
    year: "2023",
    role: "Design & Build",
    area: "blue",
    color: "var(--brand-blue)",
    onColor: "#ffffff",
    tagline: "Status pages people actually read.",
    intro:
      "Incident communication rebuilt around plain language and a timeline anyone can follow without engineering context.",
    stack: ["Next.js", "Edge", "Tailwind"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "note",
        heading: "In progress",
        body: "Case study write-up and visuals coming soon.",
      },
    ],
  },
  {
    slug: "chain-bot",
    title: "Chain-Bot",
    letter: "C",
    year: "2024",
    role: "AI & Logic",
    area: "black",
    color: "#000000",
    onColor: "#ffffff",
    tagline: "Strategic board dominance.",
    intro:
      "The challenge was turning every move into an opportunity to take over the board. I built a bot that analyzes the board, predicts chain reactions, and chooses moves that maximize its chances of controlling the game.",
    stack: ["Python", "Algorithms", "Game Theory"],
    media: [
      {
        kind: "intro",
      },
      {
        kind: "video",
        heading: "Gameplay",
        src: "/projects/chain_bot/gameplay.mov",
        caption: "Chain-Bot in action (3x speed)",
        speed: 3.0,
      },
      {
        kind: "image",
        src: "/projects/chain_bot/Critical Mass.png",
        alt: "Critical Mass Tournament Certificate",
        caption: "Our Chain Reaction bot took on a field of competing bots in the Critical Mass tournament and finished #1, turning strategic decision-making into a tournament-winning performance.",
      }
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
