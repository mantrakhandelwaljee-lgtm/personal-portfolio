'use client'

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useLayoutEffect, useRef, useState, useEffect, useCallback, type RefObject } from 'react'
import type { Project } from '@/lib/projects'
import { ProjectMedia } from './project-media'

type Props = {
  project: Project
  scrollContainer: RefObject<HTMLDivElement | null>
  onClose: () => void
}

export function HorizontalScroller({ project, scrollContainer, onClose }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorState, setCursorState] = useState<{ side: 'left' | 'right'; x: number; y: number } | null>(null)
  const prefersReducedMotion = useReducedMotion()

  /* ---- measure track width ---- */
  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth)
      setViewportWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    measure()
    // Small delay to ensure all fonts/images are rendered before measuring
    const timeoutId = setTimeout(measure, 100)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(timeoutId)
    }
  }, [])

  /* ---- horizontal scroll mapping ---- */
  const maxScroll = Math.max(0, trackWidth - viewportWidth)
  // The height of the section determines how much scrolling is required to complete the horizontal translation.
  // 1px of vertical scroll = 1px of horizontal scroll.
  const scrollHeight = maxScroll + (typeof window !== 'undefined' ? window.innerHeight : 800)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer as RefObject<HTMLElement>,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    let closeTimer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Auto-close with a 0.5s delay when reaching the very end
      if (latest >= 0.999) {
        if (!closeTimer) {
          closeTimer = setTimeout(() => onClose(), 500)
        }
      } else {
        // Cancel if user scrolls back
        if (closeTimer) {
          clearTimeout(closeTimer)
          closeTimer = null
        }
      }
    })
    return () => {
      unsubscribe()
      if (closeTimer) clearTimeout(closeTimer)
    }
  }, [scrollYProgress, onClose])

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll])

  /* ---- slide-based navigation for arrows ---- */
  const navigateSlide = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainer?.current || !sectionRef.current || !trackRef.current) return
    const container = scrollContainer.current
    const sectionTop = sectionRef.current.offsetTop
    const sectionScrollable = sectionRef.current.offsetHeight - window.innerHeight
    if (sectionScrollable <= 0) return

    const children = Array.from(trackRef.current.children) as HTMLElement[]
    
    // For each child, compute the target X translation that centers it in the viewport.
    const viewportCenter = window.innerWidth / 2
    const slideTargetX = children.map(child => {
      // The child's center relative to the track
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      // We want childCenter to be exactly at viewportCenter.
      // So the track needs to shift left by: childCenter - viewportCenter
      // We clamp this between 0 and maxScroll.
      return Math.max(0, Math.min(childCenter - viewportCenter, maxScroll))
    })

    // Current horizontal offset (from scroll progress)
    const currentScrollInSection = container.scrollTop - sectionTop
    const currentProgress = Math.max(0, Math.min(1, currentScrollInSection / sectionScrollable))
    const currentX = currentProgress * maxScroll

    // Find which slide we're currently on
    let currentSlide = 0
    for (let i = 0; i < slideTargetX.length - 1; i++) {
      const mid = (slideTargetX[i] + slideTargetX[i+1]) / 2
      if (currentX > mid) {
        currentSlide = i + 1
      }
    }

    // Determine target slide
    const targetSlide = direction === 'right'
      ? Math.min(currentSlide + 1, slideTargetX.length - 1)
      : Math.max(currentSlide - 1, 0)

    // Convert the target slide's left edge to a scroll progress value
    const targetX = slideTargetX[targetSlide]
    const targetProgress = maxScroll > 0 ? targetX / maxScroll : 0
    const targetScroll = sectionTop + targetProgress * sectionScrollable
    container.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }, [scrollContainer, maxScroll])

  /* ---- mouse tracking: cursor becomes arrow ---- */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mx = e.clientX
    const my = e.clientY
    const w = window.innerWidth
    if (mx < w * 0.25) {
      setCursorState({ side: 'left', x: mx, y: my })
    } else if (mx > w * 0.75) {
      setCursorState({ side: 'right', x: mx, y: my })
    } else {
      setCursorState(null)
    }
  }, [])

  /* ---- reduced-motion / mobile fallback: vertical stack ---- */
  if (prefersReducedMotion || isMobile) {
    return (
      <section className="bg-background px-5 py-16 md:px-10 text-foreground">
        <div className="mx-auto max-w-4xl space-y-16">
          <header>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-50">
              <span>{project.year}</span>
              <span aria-hidden className="h-3 w-px bg-current opacity-40" />
              <span>{project.role}</span>
            </div>
            <h1 className="font-serif font-normal leading-[0.95] tracking-[-0.02em] text-5xl md:text-7xl mb-6">
              {project.title}
            </h1>
            <p className="text-lg opacity-75">{project.tagline}</p>
          </header>
          
          <div className="text-xl leading-[1.6]">
            {project.intro}
          </div>

          <div className="space-y-8">
            {project.media.map((item, i) => (
              <ProjectMedia key={i} item={item} project={project} vertical />
            ))}
          </div>

          <div className="flex flex-col items-center gap-8 py-20">
            <span className="font-serif text-3xl">Fin</span>
            <button onClick={onClose} className="text-xs uppercase tracking-widest border-b border-foreground/30 pb-1">
              Close project
            </button>
          </div>
        </div>
      </section>
    )
  }

  const slideBaseClasses = "flex h-[80vh] shrink-0 flex-col justify-center px-16 md:px-24"

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: scrollHeight || '100vh', color: project.onColor }}
    >
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorState(null)}
        onClick={() => cursorState && navigateSlide(cursorState.side)}
        style={{ cursor: cursorState ? 'none' : 'default' }}
      >
        <motion.div
          ref={trackRef}
          className="flex items-center gap-[15vw]"
          style={{ x, willChange: 'transform' }}
        >
          {/* 1. Giant Title Slide — single horizontal line filling the screen */}
          <div className="flex h-screen shrink-0 items-center whitespace-nowrap px-[5vw]">
            <h1
              className="font-winner font-bold uppercase leading-[0.82] tracking-[-0.04em]"
              style={{ fontSize: '88vh' }}
            >
              {project.title}
            </h1>
          </div>

          {/* Dynamic Media Slides */}
          {project.media.map((item, idx) => {
            if (item.kind === 'intro') {
              return (
                <div key={idx} className="flex h-screen w-[95vw] shrink-0 items-center justify-center px-16 md:px-32 lg:px-48">
                   <p className="font-winner font-medium text-2xl uppercase leading-[1.1] md:text-4xl lg:text-[2.8rem] text-left max-w-[60%]">
                    {project.intro}
                  </p>
                </div>
              )
            }
            if (item.kind === 'note') {
              return (
                <div key={idx} className="flex h-screen w-[95vw] shrink-0 items-center justify-center px-16 md:px-32 lg:px-48">
                  <div className="flex flex-col gap-6 items-center text-center">
                    <h2 className="font-winner text-3xl md:text-5xl lg:text-7xl opacity-90 uppercase tracking-tight">{item.heading}</h2>
                    <p className="font-winner text-xl uppercase leading-[1.3] md:text-2xl lg:text-[2rem] max-w-[80%] opacity-80">
                      {item.body}
                    </p>
                  </div>
                </div>
              )
            }
            if (item.kind === 'image') {
              return (
                <div key={idx} className="flex h-screen shrink-0 items-center justify-center px-12 md:px-24">
                  <div className="flex flex-row items-end gap-8 h-[75vh]">
                    {item.caption && (
                      <div className="w-[200px] md:w-[250px] shrink-0 pb-4">
                        <p className="font-winner uppercase text-sm md:text-base lg:text-lg opacity-70 leading-tight">
                          {item.caption}
                        </p>
                      </div>
                    )}
                    <div className="h-full w-auto shrink-0 shadow-2xl rounded-[2rem] overflow-hidden bg-black/10">
                      <img src={item.src} alt={item.alt} className="h-full w-auto object-cover" />
                    </div>
                  </div>
                </div>
              )
            }
            if (item.kind === 'video') {
              return (
                <div key={idx} className="flex h-screen w-[90vw] shrink-0 items-center justify-center px-12 md:px-24">
                  <div className="flex flex-col items-center gap-8 md:gap-12 w-full h-full justify-center">
                    {item.heading && (
                      <h2 className="font-winner text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight opacity-90">{item.heading}</h2>
                    )}
                    <div className="h-[75vh] w-full max-w-[1400px] flex justify-center items-center overflow-hidden rounded-2xl bg-transparent">
                      <video 
                        src={item.src} 
                        className="h-full w-auto max-w-full rounded-2xl shadow-2xl object-contain" 
                        muted loop playsInline autoPlay 
                        ref={(el) => {
                          if (el && item.speed) {
                            el.playbackRate = item.speed;
                          }
                        }}
                        onCanPlay={(e) => {
                          if (item.speed) {
                            e.currentTarget.playbackRate = item.speed;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            }
            if (item.kind === 'horizontal-gallery') {
              return (
                <div key={idx} className="flex h-screen shrink-0 items-center justify-center px-12 md:px-24">
                  <div className="flex flex-col items-center gap-8 md:gap-12">
                    {item.heading && (
                      <h2 className="font-winner text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight opacity-90">{item.heading}</h2>
                    )}
                    <div className="flex items-center gap-6 md:gap-12">
                      {item.images.map((img: any, i: number) => (
                        <div key={i} className="h-[55vh] w-auto shrink-0 shadow-2xl rounded-[3rem] overflow-hidden border-[6px] border-black/10 bg-black">
                          <img src={img.src} alt={img.alt} className="h-full w-auto object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            if (item.kind === 'grid-4x') {
              return (
                <div key={idx} className="flex h-screen w-[90vw] shrink-0 items-center justify-center px-8 md:px-16 max-w-[1400px]">
                  <div className="flex flex-col items-center gap-8 md:gap-12 w-[70%]">
                    {item.heading && (
                      <h2 className="font-winner text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight opacity-90">{item.heading}</h2>
                    )}
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-8 w-full aspect-video md:aspect-[16/9]">
                      {item.images.map((img: any, i: number) => (
                        <div key={i} className="w-full h-full rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                          <img src={img.src} alt={img.alt} className="h-full w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            if (item.kind === 'collage-3x') {
              return (
                <div key={idx} className="flex h-screen w-[90vw] shrink-0 items-center justify-center px-8 md:px-16 max-w-[1400px]">
                  <div className="flex flex-col items-center gap-8 md:gap-12 w-[70%]">
                    {item.heading && (
                      <h2 className="font-winner text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight opacity-90">{item.heading}</h2>
                    )}
                    <div className="flex justify-center items-center gap-4 md:gap-8 w-full h-[65vh]">
                      {item.images.map((img: any, i: number) => (
                        <div 
                          key={i} 
                          className={`w-1/3 h-full overflow-hidden rounded-[2rem] transition-transform duration-300 hover:scale-[1.15] hover:z-20 ${
                            i === 1 ? 'scale-110 z-10 -translate-y-6 shadow-2xl' : 'scale-95 opacity-90 hover:opacity-100 shadow-xl'
                          }`}
                        >
                          <img src={img.src} alt={img.alt} className="h-full w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}

          {/* Closing Slide (0.75 page buffer for smooth auto-close) */}
          <div className="flex h-screen w-[75vw] shrink-0 items-center justify-center" />

        </motion.div>

        {/* Cursor-following arrow */}
        {cursorState && (
          <div
            className="pointer-events-none fixed z-50"
            style={{
              left: cursorState.x - 24,
              top: cursorState.y - 24,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: 0.4,
                transform: cursorState.side === 'left' ? 'rotate(180deg)' : 'none',
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}
