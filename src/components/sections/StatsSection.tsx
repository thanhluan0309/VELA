'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { value: 10000, suffix: '+', label: 'Happy customers' },
  { value: 47,    suffix: '',  label: 'Countries worldwide' },
  { value: 4.9,   suffix: '★', label: 'Average rating' },
]

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const duration = 1800
        const start = performance.now()
        const isDecimal = value % 1 !== 0

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration)
          const ease = 1 - Math.pow(1 - progress, 3)
          const next = isDecimal
            ? Math.round(ease * value * 10) / 10
            : Math.round(ease * value)
          setCurrent(next)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {value % 1 !== 0 ? current.toFixed(1) : current.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = sectionRef.current
    if (!el) return

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { default: ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.set(el.querySelectorAll('.stat-item'), { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(el.querySelectorAll('.stat-item'), {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power3.out',
            })
          },
          once: true,
        })
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="px-8 md:px-14 py-24 md:py-36"
      style={{ background: 'var(--bg)' }}
      aria-label="Stats and CTA"
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-8 mb-24 md:mb-32 border-t border-b py-12 md:py-16"
           style={{ borderColor: 'rgba(22,22,22,0.12)' }}>
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-item text-center" style={{ opacity: 0 }}>
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(40px, 6vw, 80px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--ink)',
              }}
            >
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p
              className="font-body mt-2"
              style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'var(--ink-muted)' }}
            >
              {stat.label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <h2
          className="font-display mb-8"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--ink)',
          }}
        >
          Ready to wear the light?
        </h2>

        <a
          href="#"
          data-cursor="expand"
          className="font-body font-medium inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#FAF7F2',
            fontSize: '14px',
            letterSpacing: '0.08em',
            padding: '18px 44px',
            borderRadius: '100px',
          }}
        >
          SHOP THE COLLECTION
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
