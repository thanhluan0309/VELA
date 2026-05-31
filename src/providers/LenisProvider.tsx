'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LenisContext = createContext<any>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // All browser-only code lives inside useEffect — never runs on server
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let cleanup: (() => void) | undefined

    const init = async () => {
      // Dynamic imports keep GSAP + Lenis out of the SSR bundle entirely
      const [{ default: gsap }, { default: ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('lenis'),
        ])

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      lenisRef.current = lenis

      const gsapCallback = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(gsapCallback)
      gsap.ticker.lagSmoothing(0)
      lenis.on('scroll', ScrollTrigger.update)

      cleanup = () => {
        gsap.ticker.remove(gsapCallback)
        lenis.destroy()
        lenisRef.current = null
      }
    }

    init()

    return () => cleanup?.()
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
