'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useRef } from 'react'
import type { Project } from '@/lib/projects'

type Props = {
  project: Project
  index: number
  isSelected: boolean
  onSelect: (project: Project, rect: DOMRect) => void
}

export function ProjectCard({ project, index, isSelected, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleClick = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    onSelect(project, rect)
  }, [project, onSelect])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick],
  )

  return (
    <motion.div
      ref={ref}
      data-cursor="View"
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex cursor-none flex-col justify-between overflow-hidden p-6 outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 md:p-8 ${
        index === 0 || index === 3 ? 'md:col-span-2' : ''
      }`}
      style={{
        backgroundColor: project.color,
        color: project.onColor,
        borderRadius: 20,
        opacity: isSelected ? 0 : 1,
        aspectRatio: '16/10',
      }}
      whileHover={
        prefersReducedMotion
          ? {}
          : { scale: 1.015, y: -4, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
      }
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
    >
      {/* Top metadata */}
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-50">
        {project.role} · {project.year}
      </span>

      {/* Bottom content */}
      <div>
        <span className="font-serif text-2xl leading-[1.05] md:text-3xl lg:text-[2.6rem]">
          {project.title}
        </span>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed opacity-60 md:text-sm">
          {project.tagline}
        </p>
      </div>

      {/* Hover arrow */}
      <motion.span
        aria-hidden
        className="absolute right-6 top-6 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-50"
      >
        ↗
      </motion.span>
    </motion.div>
  )
}
