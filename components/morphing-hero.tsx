"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { projects, type Project } from "@/lib/projects"

/* Letter crop: each letter is oversized and pushed off-centre so the block
   frames only a fragment of it. Tuned per block, size unchanged. */
const crop: Record<
  Project["area"],
  { x: string; y: string; size: string; delay: string }
> = {
  green: { x: "-22%", y: "-18%", size: "clamp(11rem, 26vw, 20rem)", delay: "0s" },
  yellow: { x: "26%", y: "16%", size: "clamp(11rem, 26vw, 20rem)", delay: "1.1s" },
  red: { x: "-18%", y: "24%", size: "clamp(11rem, 26vw, 20rem)", delay: "2.2s" },
  gray: { x: "22%", y: "-22%", size: "clamp(11rem, 26vw, 20rem)", delay: "0.6s" },
  black: { x: "-14%", y: "20%", size: "clamp(16rem, 38vw, 30rem)", delay: "1.7s" },
  blue: { x: "24%", y: "-20%", size: "clamp(11rem, 26vw, 20rem)", delay: "2.9s" },
}

type Fill = {
  rect: { top: number; left: number; width: number; height: number }
  color: string
  onColor: string
  title: string
}

export function MorphingHero() {
  const router = useRouter()
  const [fill, setFill] = useState<Fill | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const navigating = useRef(false)

  const open = useCallback(
    (project: Project, el: HTMLElement) => {
      if (navigating.current) return
      navigating.current = true

      const r = el.getBoundingClientRect()
      setFill({
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        color: project.color,
        onColor: project.onColor,
        title: project.title,
      })

      router.prefetch(`/projects/${project.slug}`)

      // let the start frame paint, then grow to fill the viewport
      requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)))
      window.setTimeout(() => router.push(`/projects/${project.slug}`), 620)
    },
    [router],
  )

  return (
    <section
      aria-label="Selected projects by Mantra Khandelwal"
      className="relative mx-auto w-full max-w-5xl px-5 pt-8 md:pt-14"
    >
      <div
        className="grid gap-3 md:gap-4"
        style={{
          height: "min(68vh, 620px)",
          minHeight: "440px",
          gridTemplateColumns: "1fr 1fr 1.35fr",
          gridTemplateRows: "1fr 1fr",
          gridTemplateAreas: `
            "green yellow black"
            "red gray blue"
          `,
        }}
      >
        {projects.map((p) => {
          const c = crop[p.area]
          const on = active === p.slug
          return (
            <button
              key={p.slug}
              type="button"
              onClick={(e) => open(p, e.currentTarget)}
              onPointerEnter={() => setActive(p.slug)}
              onPointerLeave={() => setActive((s) => (s === p.slug ? null : s))}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive((s) => (s === p.slug ? null : s))}
              aria-label={`${p.title} — view case study`}
              className="brand-block relative cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              style={{
                gridArea: p.area,
                animationDelay: c.delay,
                backgroundColor: p.color,
              }}
            >
              <span
                aria-hidden="true"
                className="brand-block-letter absolute transition-opacity duration-300 ease-out"
                style={{
                  color: p.onColor,
                  fontSize: c.size,
                  left: "50%",
                  top: "50%",
                  opacity: on ? 1 : 0,
                  transform: `translate(calc(-50% + ${c.x}), calc(-50% + ${c.y}))`,
                }}
              >
                {p.letter}
              </span>

              <span
                className="absolute bottom-3 left-3 right-3 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] transition-all duration-300 ease-out md:text-xs"
                style={{
                  color: p.onColor,
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {p.title}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground/70 md:text-base">
          Designer &amp; developer building bold, playful and precise digital
          experiences. Hover a block, click to enter.
        </p>
        <span className="shrink-0 border-b-2 border-foreground pb-1 font-display text-sm font-bold uppercase tracking-[0.18em] md:text-base">
          Mantra Khandelwal
        </span>
      </div>

      {/* Fill-the-page transition */}
      {fill ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[100]"
          style={{
            top: expanded ? 0 : fill.rect.top,
            left: expanded ? 0 : fill.rect.left,
            width: expanded ? "100vw" : fill.rect.width,
            height: expanded ? "100vh" : fill.rect.height,
            backgroundColor: fill.color,
            borderRadius: expanded ? 0 : 8,
            transition:
              "top 600ms cubic-bezier(0.76,0,0.24,1), left 600ms cubic-bezier(0.76,0,0.24,1), width 600ms cubic-bezier(0.76,0,0.24,1), height 600ms cubic-bezier(0.76,0,0.24,1), border-radius 600ms cubic-bezier(0.76,0,0.24,1)",
          }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-4xl font-bold uppercase leading-none tracking-tight transition-opacity duration-300 md:text-7xl"
            style={{
              color: fill.onColor,
              opacity: expanded ? 1 : 0,
              transitionDelay: expanded ? "260ms" : "0ms",
            }}
          >
            {fill.title}
          </span>
        </div>
      ) : null}
    </section>
  )
}
