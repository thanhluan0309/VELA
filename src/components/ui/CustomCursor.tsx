'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const expanded = useRef(false)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current
    if (!dot) return

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const shouldExpand = !!target.closest('[data-cursor="expand"]')
      if (shouldExpand !== expanded.current) {
        expanded.current = shouldExpand
        if (shouldExpand) {
          dot.style.width = '52px'
          dot.style.height = '52px'
          dot.style.background = 'transparent'
          dot.style.border = '1.5px solid var(--ink)'
          dot.style.mixBlendMode = 'normal'
        } else {
          dot.style.width = '10px'
          dot.style.height = '10px'
          dot.style.background = 'var(--ink)'
          dot.style.border = 'none'
          dot.style.mixBlendMode = 'difference'
        }
      }
    }

    const tick = () => {
      // Lerp toward real mouse position
      current.current.x += (pos.current.x - current.current.x) * 0.14
      current.current.y += (pos.current.y - current.current.y) * 0.14

      if (dot) {
        dot.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10000,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'var(--ink)',
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease',
        willChange: 'transform',
      }}
    />
  )
}
