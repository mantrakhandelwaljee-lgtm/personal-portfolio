"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { Project } from "@/lib/projects"

export function ProjectView({ project }: { project: Project }) {
  /* Arrival: the incoming panel is already the block colour, then it lifts
     away — continuing the fill animation from the home page. */
  const [arrived, setArrived] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setArrived(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [offset, setOffset] = useState(0)

  /* Measure how far the track has to travel horizontally */
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  /* Map vertical scroll across the pinned section onto horizontal travel */
  useEffect(() => {
    if (distance <= 0) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const outer = outerRef.current
        if (!outer) return
        const start = outer.offsetTop
        const progress = (window.scrollY - start) / distance
        setOffset(Math.min(1, Math.max(0, progress)) * distance)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [distance])

  return (
    <main className="bg-background text-foreground">
      {/* arrival panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          backgroundColor: project.color,
          transform: arrived ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 700ms cubic-bezier(0.76,0,0.24,1) 200ms",
        }}
      />

      {/* Title at full scale */}
      <header
        className="flex min-h-[78vh] flex-col justify-between px-5 pb-10 pt-6 md:px-10"
        style={{ backgroundColor: project.color, color: project.onColor }}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/#top"
            className="font-display text-xs font-bold uppercase tracking-[0.18em] underline decoration-2 underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
            style={{ color: project.onColor }}
          >
            Mantra Khandelwal
          </Link>
          <Link
            href="/#top"
            className="font-display text-xs font-bold uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
            style={{ color: project.onColor }}
          >
            Close
          </Link>
        </div>

        <div>
          <h1
            className="text-balance font-display font-bold uppercase leading-[0.86] tracking-tight"
            style={{ fontSize: "clamp(3rem, 13vw, 12rem)" }}
          >
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed opacity-90 md:text-2xl">
            {project.tagline}
          </p>
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t pt-5 text-sm md:text-base"
          style={{ borderColor: `color-mix(in oklab, ${project.onColor} 30%, transparent)` }}
        >
          <div>
            <dt className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] opacity-70">
              Year
            </dt>
            <dd className="mt-1">{project.year}</dd>
          </div>
          <div>
            <dt className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] opacity-70">
              Role
            </dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
          <div>
            <dt className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] opacity-70">
              Stack
            </dt>
            <dd className="mt-1">{project.stack.join(" · ")}</dd>
          </div>
        </dl>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-pretty text-xl leading-relaxed md:text-3xl md:leading-[1.45]">
          {project.intro}
        </p>
        <p className="mt-10 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
          Scroll to move sideways
        </p>
      </section>

      {/* Horizontal reveal */}
      <div ref={outerRef} style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-6 px-5 md:gap-10 md:px-10"
            style={{
              transform: `translate3d(${-offset}px, 0, 0)`,
              willChange: "transform",
            }}
          >
            {project.media.map((item, i) => {
              if (item.kind === "note") {
                return (
                  <article
                    key={i}
                    className="flex h-[62vh] w-[78vw] shrink-0 flex-col justify-center gap-5 p-8 md:w-[38vw] md:p-12"
                    style={{
                      backgroundColor: project.color,
                      color: project.onColor,
                    }}
                  >
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-4xl">
                      {item.heading}
                    </h2>
                    <p className="text-pretty text-base leading-relaxed opacity-90 md:text-xl">
                      {item.body}
                    </p>
                  </article>
                )
              }

              const width = item.wide
                ? "w-[88vw] md:w-[62vw]"
                : "w-[78vw] md:w-[34vw]"

              return (
                <figure key={i} className={`${width} shrink-0`}>
                  <div className="h-[62vh] overflow-hidden bg-brand-gray/40">
                    {item.kind === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.src || "/placeholder.svg"}
                        alt={item.alt}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <video
                        className="h-full w-full object-cover object-top"
                        src={item.src}
                        poster={item.poster}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                    )}
                  </div>
                  <figcaption className="mt-3 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/60">
                    {item.caption}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </div>

      <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-5 py-20 md:px-10">
        <p className="font-display text-2xl font-bold uppercase tracking-tight md:text-4xl">
          Next up
        </p>
        <Link
          href="/#top"
          className="border-b-2 border-foreground pb-1 font-display text-sm font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        >
          Back to all work
        </Link>
      </footer>
    </main>
  )
}
