'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [label, setLabel] = useState<string | null>(null)
  const [hasFinePointer, setHasFinePointer] = useState(false)

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    setHasFinePointer(mql.matches)
    if (!mql.matches) return

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]')
      setLabel(el ? el.getAttribute('data-cursor') : null)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [cursorX, cursorY])

  if (!hasFinePointer) return null

  const isSolid = label && label !== 'View'

  return (
    <motion.div
      className={`pointer-events-none fixed left-0 top-0 z-[200] ${isSolid ? '' : 'mix-blend-difference'}`}
      style={{ x, y }}
      aria-hidden="true"
    >
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${isSolid ? 'bg-black' : 'bg-white'}`}
        initial={false}
        animate={{
          width: label ? 80 : 0,
          height: label ? 80 : 0,
          opacity: label ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {label && (
          <motion.span
            className={`text-[10px] font-medium uppercase tracking-[0.2em] ${isSolid ? 'text-white' : 'text-black'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
