'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projects, type Project } from '@/lib/projects'
import { ProjectViewer } from './project-viewer'
import { CustomCursor } from './custom-cursor'

/* --- Deterministic Grid System --- */
const l = (v: number) => `${v}%`

type Rect = { top: string; left: string; width: string; height: string; opacity?: number; zIndex?: number; borderRadius?: string }
type LayoutState = Record<string, Rect>

// State 1: Circles (Screenshot 1)
const layout1: LayoutState = {
  'journey-finder': { top: l(28), left: l(18), width: l(18), height: l(27), borderRadius: '999px 999px 999px 999px', zIndex: 2 },
  'atlas':          { top: l(18), left: l(30), width: l(30), height: l(45), borderRadius: '999px 999px 999px 999px', zIndex: 3 },
  'chain-bot':      { top: l(14), left: l(44), width: l(52), height: l(78), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'roadtrip':       { top: l(50), left: l(18), width: l(34), height: l(51), borderRadius: '999px 999px 999px 999px', zIndex: 2 },
  'studio-notes':   { top: l(58), left: l(38), width: l(16), height: l(24), borderRadius: '999px 999px 999px 999px', zIndex: 4 },
  'beacon':         { top: l(52), left: l(62), width: l(30), height: l(45), borderRadius: '999px 999px 999px 999px', zIndex: 3 },
  'dec1':           { top: l(68), left: l(74), width: l(14), height: l(21), borderRadius: '999px 999px 999px 999px', zIndex: 4 },
}

// State 2: Rectangles (Screenshot 2)
const layout2: LayoutState = {
  'journey-finder': { top: l(0), left: l(0), width: l(21.66), height: l(50), borderRadius: '0px 0px 0px 0px', zIndex: 1 },
  'atlas':          { top: l(0), left: l(21.66), width: l(33.33), height: l(50), borderRadius: '0px 0px 0px 0px', zIndex: 1 },
  'chain-bot':      { top: l(0), left: l(54.99), width: l(45.01), height: l(100), borderRadius: '0px 0px 0px 0px', zIndex: 0 },
  'roadtrip':       { top: l(50), left: l(0), width: l(38.33), height: l(50), borderRadius: '0px 0px 0px 0px', zIndex: 1 },
  'studio-notes':   { top: l(50), left: l(33.33), width: l(21.66), height: l(50), borderRadius: '0px 0px 0px 0px', zIndex: 1 },
  'beacon':         { top: l(50), left: l(66.66), width: l(33.33), height: l(50), borderRadius: '0px 0px 0px 0px', zIndex: 2 },
  'dec1':           { top: l(75), left: l(83.33), width: l(16.66), height: l(25), borderRadius: '0px 0px 0px 0px', zIndex: 3 },
}

// State 3: Mixed Shapes (Screenshot 3)
const layout3: LayoutState = {
  'journey-finder': { top: l(0), left: l(0), width: l(21.66), height: l(50), borderRadius: '0px 0px 0px 999px', zIndex: 1 },
  'atlas':          { top: l(0), left: l(21.66), width: l(33.33), height: l(50), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'chain-bot':      { top: l(0), left: l(54.99), width: l(45.01), height: l(100), borderRadius: '0px 999px 999px 0px', zIndex: 0 },
  'roadtrip':       { top: l(50), left: l(0), width: l(33.33), height: l(50), borderRadius: '0px 999px 999px 0px', zIndex: 1 },
  'studio-notes':   { top: l(50), left: l(33.33), width: l(21.66), height: l(50), borderRadius: '0px 0px 999px 999px', zIndex: 1 },
  'beacon':         { top: l(50), left: l(66.66), width: l(33.33), height: l(50), borderRadius: '999px 0px 0px 0px', zIndex: 2 },
  'dec1':           { top: l(75), left: l(83.33), width: l(16.66), height: l(25), borderRadius: '999px 0px 0px 0px', zIndex: 3 },
}

// State 4: Vertical Pills (Screenshot 4)
const layout4: LayoutState = {
  'journey-finder': { top: l(10), left: l(15), width: l(9), height: l(45), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'atlas':          { top: l(20), left: l(25), width: l(11), height: l(55), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'roadtrip':       { top: l(30), left: l(37), width: l(11), height: l(55), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'studio-notes':   { top: l(45), left: l(49), width: l(9), height: l(40), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'beacon':         { top: l(40), left: l(59), width: l(7), height: l(25), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'dec1':           { top: l(15), left: l(67), width: l(13), height: l(65), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
  'chain-bot':      { top: l(10), left: l(81), width: l(15), height: l(80), borderRadius: '999px 999px 999px 999px', zIndex: 1 },
}

const layouts = [layout1, layout2, layout3, layout4]

/* --- Entity definitions --- */
const blockDefs = [
  ...projects.map(p => ({
    id: p.slug,
    isProject: true,
    color: p.color,
    project: p
  })),
  { id: 'dec1', isProject: false, color: 'var(--brand-light-blue)' },
]

export function ProjectGrid() {
  const [layoutIndex, setLayoutIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoRotation, setLogoRotation] = useState(0)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start the generative loop
  useEffect(() => {
    if (prefersReducedMotion) return

    if (!isPaused && !selectedProject && !isAboutOpen) {
      const timeout = setTimeout(() => {
        setLayoutIndex((prev) => (prev + 1) % layouts.length)
        
        intervalRef.current = setInterval(() => {
          setLayoutIndex((prev) => (prev + 1) % layouts.length)
        }, 2187)
      }, 200)

      return () => {
        clearTimeout(timeout)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, selectedProject, prefersReducedMotion, isAboutOpen])

  const handleSelect = useCallback((project: Project, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCardRect(rect)
    setSelectedProject(project)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedProject(null)
    setCardRect(null)
  }, [])

  const currentLayout = layouts[layoutIndex] || layouts[0]

  return (
    <>
      <CustomCursor />

      {/* Top Right Logo Menu */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div 
            className="fixed top-6 right-6 md:top-12 md:right-12 z-[100]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="relative pb-4"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <motion.button 
                onClick={() => setLogoRotation(prev => prev + 360)}
                animate={{ rotateZ: logoRotation }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-colors shadow-sm"
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </motion.button>
    
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 bg-background border border-foreground/10 rounded-xl shadow-xl py-2 min-w-[140px] flex flex-col overflow-hidden"
                  >
                    <button 
                      className="px-4 py-2 text-left hover:bg-foreground/5 text-sm font-medium transition-colors"
                      onClick={() => { setIsAboutOpen(false); setIsMenuOpen(false); setLogoRotation(prev => prev + 360); }}
                    >
                      Home
                    </button>
                    <button 
                      className="px-4 py-2 text-left hover:bg-foreground/5 text-sm font-medium transition-colors"
                      onClick={() => { setIsAboutOpen(true); setIsMenuOpen(false); setLogoRotation(prev => prev + 360); }}
                    >
                      About
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="flex min-h-[100svh] w-full items-center justify-center p-6 md:p-12 lg:p-24 bg-background">
        <div 
          className="relative w-full max-w-[1200px] aspect-[1/1] sm:aspect-[4/3] md:aspect-[1.5/1] scale-[0.70]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div 
            className="absolute inset-0"
            animate={{ opacity: isAboutOpen ? 0 : 1, pointerEvents: isAboutOpen ? 'none' : 'auto' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {blockDefs.map((block, i) => {
            const rect = currentLayout[block.id]
            if (!rect) return null

            // Delay purely for the organic stagger feel
            const transitionDelay = i * 0.02

            const commonProps = {
              className: `absolute top-0 left-0 ${block.isProject ? 'cursor-none group @container overflow-hidden hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground transition-transform duration-300' : 'pointer-events-none'}`,
              style: { backgroundColor: block.color },
              initial: false,
              animate: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: rect.opacity,
                zIndex: rect.zIndex,
                borderRadius: rect.borderRadius,
              },
              transition: {
                duration: layoutIndex === 2 ? 0.75 : 1.25,
                ease: layoutIndex === 2 ? [0.65, 0, 0.35, 1] : [0.22, 1, 0.36, 1],
                delay: transitionDelay,
              },
              ...(block.isProject && { 'data-cursor': 'View' }),
            }

            if (block.isProject) {
              return (
                <motion.button
                  key={block.id}
                  onClick={(e) => handleSelect(block.project!, e)}
                  aria-label={`${block.project!.title} — view project`}
                  {...commonProps}
                >
                  <span 
                    className="absolute inset-0 flex items-center justify-center font-winner text-[88vh] leading-[0.82] tracking-[-0.04em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                    style={{ color: block.project!.onColor }}
                  >
                    {block.project!.letter}
                  </span>
                </motion.button>
              )
            }

            return <motion.div key={block.id} {...commonProps} />
          })}
          </motion.div>
          <AnimatePresence>
            {!isAboutOpen && (
              <>
                <motion.div 
                  className="absolute -bottom-20 md:-bottom-16 left-0 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button 
                    onClick={() => setIsAboutOpen(true)}
                    className="cursor-none font-sans text-[20px] font-bold uppercase tracking-widest text-foreground underline decoration-2 underline-offset-4 hover:opacity-70 transition-opacity"
                    data-cursor="About"
                  >
                    Mantra Khandelwal
                  </button>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-24 md:-bottom-20 right-0 text-right w-[70%] md:w-auto md:max-w-xs text-[10px] md:text-xs font-sans text-foreground/40 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Disclaimer: It's a work in progress and some boxes still don't have content. The green, red and black work perfectly well and others have demo content.
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAboutOpen && (
              <motion.div 
                className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <div className="absolute -top-10 left-0 text-[20px] font-bold uppercase tracking-[0.2em]">
                  About
                </div>
                <button 
                  onClick={() => setIsAboutOpen(false)}
                  className="absolute -top-10 right-0 p-2 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Close about"
                  data-cursor="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <h2 className="font-crimson font-normal text-5xl md:text-7xl lg:text-[7vw] leading-[0.9] tracking-[-0.04em] mb-4">
                  Howdy, I'm Mantra!
                </h2>
                
                <h3 className="font-benne font-normal text-2xl md:text-3xl mt-6 mb-4 text-foreground/90">
                  About Me
                </h3>
                
                <div className="max-w-[800px] text-[22px] md:text-[28px] leading-relaxed text-foreground/80 font-vetrena font-thin space-y-4 text-left md:text-center">
                  <p>
                    I’m an Indian creative developer and designer passionate about interactive web experiences—bringing together design, motion, and code to create digital experiences that feel engaging and alive.
                  </p>
                  <p>
                    Currently, I’m a Mathematics and Computing student at Indian Institute of Technology Patna, where I’ve developed a strong love for problem-solving through competitive programming.
                  </p>
                  <p>
                    When I’m not coding or designing, you’ll probably find me binge-watching a series, playing video games, playing table tennis, or singing.
                  </p>
                </div>
                <div className="mt-12 flex flex-col items-center gap-8">
                  <div className="flex gap-8">
                    <a href="mailto:mantrakhandelwaljee@gmail.com" className="cursor-none font-sans text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-70" data-cursor="Email">Email</a>
                    <a href="https://www.linkedin.com/in/mantra-khandelwal-2bba863b6/" target="_blank" rel="noopener noreferrer" className="cursor-none font-sans text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-70" data-cursor="LinkedIn">LinkedIn</a>
                    <a href="https://github.com/mantrakhandelwaljee-lgtm" target="_blank" rel="noopener noreferrer" className="cursor-none font-sans text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-70" data-cursor="GitHub">GitHub</a>
                  </div>
                  <a href="https://drive.google.com/file/d/1zsXILHGPp5PlPxJuCazQmsmz07kTdzux/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="cursor-none px-8 py-3 bg-[#EA580C] text-white font-sans text-lg md:text-xl font-medium tracking-wide hover:opacity-90 transition-opacity rounded-sm shadow-sm" data-cursor="Resume">Resume</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && cardRect && (
          <ProjectViewer
            key={selectedProject.slug}
            project={selectedProject}
            cardRect={cardRect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}
