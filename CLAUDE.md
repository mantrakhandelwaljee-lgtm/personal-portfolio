@AGENTS.md

# Mantra Khandelwal — Portfolio

## Project Overview

A personal portfolio website for Mantra Khandelwal, heavily inspired by [karinasirqueira.com](https://karinasirqueira.com). The site features a deterministic geometric shape animation system on the front page and an editorial-style horizontal scrolling project viewer.

## Tech Stack

- **Framework**: Next.js 16.3.0 (App Router)
- **Language**: TypeScript 5.7.3
- **React**: 19
- **Styling**: Tailwind CSS 4.3.3 (PostCSS plugin, NOT the old `tailwind.config.js` approach)
- **Animation**: Framer Motion 13.1.0
- **UI**: shadcn/ui components (via `@base-ui/react`, `class-variance-authority`, `lucide-react`)
- **Analytics**: Vercel Analytics

## Commands

```bash
npm run dev     # Start dev server (port 3000, or 3001 if 3000 is busy)
npm run build   # Production build
npm run lint    # ESLint
```

## Architecture

### Directory Structure

```
app/
├── globals.css          # Theme tokens, brand colors, font stacks
├── layout.tsx           # Root layout (fonts: Inter, Space Grotesk, Playfair Display, Oswald)
├── page.tsx             # Home — renders <ProjectGrid />
└── projects/            # (unused route, reserved)

components/
├── project-grid.tsx     # ★ CORE — Geometric shape animation system (front page)
├── project-viewer.tsx   # Full-screen project overlay with sticky nav bar
├── horizontal-scroller.tsx  # ★ CORE — Horizontal scroll presentation inside project viewer
├── project-media.tsx    # Renders individual media items (images/videos/notes)
├── custom-cursor.tsx    # Custom cursor component
├── morphing-hero.tsx    # (legacy, unused)
├── about-panel.tsx      # About section
├── contact-section.tsx  # Contact section
├── site-header.tsx      # Header
├── stats-section.tsx    # Stats display
├── work-grid.tsx        # (legacy grid, unused)
├── project-card.tsx     # (legacy card, unused)
├── project-view.tsx     # (legacy viewer, unused)
└── ui/                  # shadcn/ui primitives

lib/
├── projects.ts          # Project data model + all project content
└── utils.ts             # cn() helper (clsx + tailwind-merge)
```

### Key Design Patterns

#### 1. Geometric Shape Animation (`project-grid.tsx`)

The front page is a **deterministic generative motion system**. It contains 7 geometric blocks that continuously cycle through 4 predefined layout states:

1. **Circles** — Overlapping circles of various sizes
2. **Rectangles** — Flush, tightly packed rectangular grid
3. **Abstract shapes** — Quarter-circles, pills, mixed radii (the signature state)
4. **Vertical pills** — Separated pill-shaped vertical bars

Each block is a Framer Motion `<motion.div>` with animated `top`, `left`, `width`, `height`, and `borderRadius`. The transition between states uses a spring physics config with explicit 4-corner border-radius values (`"0px 999px 999px 0px"`) to ensure smooth morphing.

**Timing**: Layout transitions cycle every ~2.2 seconds. The rectangle-to-abstract transition uses a faster 0.6s duration for smoothness.

**Scale**: The grid container is scaled to `70%` (`scale-[0.70]`).

**Clicking**: Any shape can be clicked at any point during its transition. Clicking opens the `ProjectViewer` overlay with a color-fill animation.

#### 2. Horizontal Scroll Presentation (`horizontal-scroller.tsx`)

When a project is opened, the content is presented as a **horizontal scroll experience** mapped to vertical scroll input:

- Uses `useScroll` + `useTransform` from Framer Motion to map `scrollYProgress` → horizontal `x` translation
- The section's CSS `height` is set to `maxScroll + window.innerHeight` to create the scroll runway

**Slide sequence:**
1. **Giant Title** — Project name at `88vh` font size, single horizontal line (`whitespace-nowrap`), scrolls past like a billboard
2. **Context** — Project intro text in Oswald uppercase, centered
3. **Hero Video** — 16:9 video frame
4. **Pyramid Structure** — CSS Grid with dashboard video at top-center, two images side-by-side at bottom
5. **Closing buffer** — 75vw empty space, auto-closes after 2s delay at scroll end

**Cursor-following navigation arrows**: When the mouse enters the left 25% or right 25% of the viewport, the native cursor hides and a faded SVG arrow follows the mouse position. Clicking navigates to the previous/next slide using measured child widths for accurate page boundaries.

**Auto-close**: `scrollYProgress.on("change")` triggers `onClose()` with a 2-second `setTimeout` when progress ≥ 0.999. Scrolling back cancels the timer.

#### 3. Project Data Model (`lib/projects.ts`)

```typescript
type Project = {
  slug: string          // URL-safe identifier, also used as shape key
  title: string
  letter: string        // Single letter for shape label
  year: string
  role: string
  area: "green" | "yellow" | "red" | "gray" | "black" | "blue"
  color: string         // CSS variable reference (e.g., "var(--brand-green)")
  onColor: string       // Foreground color for readability
  tagline: string
  intro: string         // Long-form context paragraph
  stack: string[]
  media: MediaItem[]    // Images, videos, and text notes
}
```

Projects are mapped to geometric shapes by their `slug`. The shapes array in `project-grid.tsx` maps each project to a specific brand color area.

## Brand Colors

```css
Pink:       #ff395c     (--brand-red)
Green:      #66bc4d     (--brand-green)
Light Blue: #86cef2     (--brand-sky)
Yellow:     #ffe31a     (--brand-yellow)
Blue:       #2157a4     (--brand-blue)
Grey:       #cdcccc     (--brand-gray)
Black:      #0a0a0a     (--brand-black)
Background: #ffffff
```

## Font Stack

| Variable         | Font              | Usage                                    |
|------------------|-------------------|------------------------------------------|
| `--font-sans`    | Inter             | Body text, UI elements                   |
| `--font-display` | Space Grotesk     | Headings, display text                   |
| `--font-serif`   | Playfair Display  | Decorative/editorial accents             |
| `--font-winner`  | Oswald            | Giant titles, editorial typography (substitute for Winner Sans Comp Medium) |

## Important Implementation Notes

### Framer Motion
- Use `scrollYProgress.on("change", callback)` — NOT the deprecated `.onChange()`.
- Border-radius animations require explicit 4-corner format (`"0px 999px 999px 0px"`) for smooth morphing. Shorthand like `"0px"` won't interpolate smoothly to `"0 999px 999px 0"`.
- Hot-reload can cause `layoutIndex` state to go out of bounds — always add a fallback: `layouts[layoutIndex] || layouts[0]`.

### Tailwind CSS 4
- This project uses Tailwind v4 with `@import 'tailwindcss'` in CSS (no `tailwind.config.js`).
- Theme tokens are defined inline using `@theme inline { ... }` in `globals.css`.
- Custom colors use the pattern: define CSS variable in `:root`, reference via `--color-*` in `@theme`.

### Next.js 16
- App Router only. No `pages/` directory.
- All interactive components use `'use client'` directive.
- Fonts configured via `next/font/google` in `layout.tsx` and exposed as CSS variables.

### Scroll Mechanics
- The horizontal scroller works by creating a tall section (`height = trackWidth - viewportWidth + windowHeight`) and mapping vertical scroll progress to horizontal translation.
- The scroll container reference is passed down from `ProjectViewer` → `HorizontalScroller` as a `RefObject<HTMLDivElement>`.

## Current Projects (7)

| Slug            | Title          | Color Area |
|-----------------|----------------|------------|
| journey-finder  | Journey Finder | green      |
| atlas           | Atlas          | yellow     |
| nebula          | Nebula         | red        |
| roadtrip        | RoadTrip       | red        |
| studio-notes    | Studio Notes   | gray       |
| beacon          | Beacon         | black      |
| dec1            | (decorative)   | sky        |

## Design Reference

The visual design is inspired by [karinasirqueira.com](https://karinasirqueira.com):
- Front page: Morphing geometric shapes that act as project buttons
- Project view: Massive horizontal-scroll editorial layout with billboard-scale typography
- Navigation: Cursor-following arrows in left/right screen zones
- Auto-close: Project view automatically closes when scrolled to the end

### Context / Intro Slides
The `intro` slide (context section) of every project in `horizontal-scroller.tsx` is specifically designed to replicate the editorial, massive, Winner Sans Comp Medium style. 
- **Configuration**: Always include `{ kind: "intro" }` in the `media` array of a project in `projects.ts` to render this context slide.
- **Styling**: It strictly uses `font-winner font-medium`, uppercase, tight leading (`leading-[1.1]`), left-aligned text, and a maximum width of 60% (`max-w-[60%]`) with responsive scaling up to `lg:text-[2.8rem]`.
