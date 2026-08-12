'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/projects'
import { HorizontalScroller } from './horizontal-scroller'

type Props = {
  project: Project
  cardRect: DOMRect
  onClose: () => void
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function ProjectViewer({ project, cardRect, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  /* ---- body scroll lock ---- */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  /* ---- mark ready after entrance ---- */
  useEffect(() => {
    const t = setTimeout(
      () => setIsReady(true),
      prefersReducedMotion ? 50 : 900,
    )
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  /* ---- escape to close ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* ---- close handler ---- */
  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isClosing])

  /* ---- clip-path values ---- */
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900

  const insetFrom = `inset(${cardRect.top}px ${vw - cardRect.right}px ${vh - cardRect.bottom}px ${cardRect.left}px round 20px)`
  const insetTo = 'inset(0px 0px 0px 0px round 0px)'

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      style={{ backgroundColor: project.color }}
      initial={{ clipPath: prefersReducedMotion ? insetTo : insetFrom }}
      animate={{ clipPath: isClosing ? insetFrom : insetTo }}
      transition={{
        duration: prefersReducedMotion ? 0 : isClosing ? 0.7 : 0.85,
        ease,
        delay: isClosing ? 0.12 : 0,
      }}
      onAnimationComplete={() => {
        if (isClosing) onClose()
      }}
    >
      {/* Scrollable inner container */}
      <div
        ref={scrollRef}
        className="h-full"
        style={{ overflowY: isReady && !isClosing ? 'auto' : 'hidden' }}
      >
        {/* Fixed Top Nav */}
        <nav 
          className="fixed left-0 right-0 top-0 z-[70] flex items-center justify-between p-6 md:px-14 md:py-8"
          style={{ color: project.onColor }}
        >
          <motion.span 
            className="font-winner text-sm font-bold uppercase tracking-wider opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 0.9 }}
            transition={{ delay: isClosing ? 0 : 0.5, duration: 0.5 }}
          >
            {project.title}
          </motion.span>
          <motion.button
            type="button"
            onClick={handleClose}
            className="rounded-full px-4 py-2 text-sm font-winner font-bold uppercase tracking-wider opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label="Close project"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 0.6 }}
            transition={{ delay: isClosing ? 0 : 0.5, duration: 0.5 }}
          >
            Close
          </motion.button>
        </nav>

        {/* ═══════ Horizontal gallery (now contains everything) ═══════ */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <HorizontalScroller project={project} scrollContainer={scrollRef} onClose={handleClose} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
