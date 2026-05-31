'use client'

import { useEffect, useRef } from 'react'

const LINES = [
  { big: 'Designed for the', small: 'woman who moves.' },
  { big: 'Fabric that breathes', small: 'with every step.' },
  { big: 'VELA — clothes that', small: 'stay with you.' },
]

const MARQUEE_TEXT = 'VELA · WEAR THE LIGHT · AW 2024 · EDITORIAL FASHION · '

export function ManifestoSection() {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const quoteRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { default: ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        // Decorative quote mark slides down
        if (quoteRef.current) {
          gsap.fromTo(
            quoteRef.current,
            { y: -30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: quoteRef.current, start: 'top 85%' },
            },
          )
        }

        // Each pair: big line slides from left, small line slides from right
        lineRefs.current.forEach((el, i) => {
          if (!el) return
          const big = el.querySelector('.manifesto-big')
          const small = el.querySelector('.manifesto-small')

          gsap.set([big, small], { opacity: 0 })
          gsap.set(big, { x: -60 })
          gsap.set(small, { x: 40 })

          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(big, { x: 0, opacity: 1, duration: 1.0, ease: 'expo.out', delay: i * 0.05 })
              gsap.to(small, { x: 0, opacity: 0.45, duration: 1.0, ease: 'expo.out', delay: i * 0.05 + 0.12 })
            },
            once: true,
          })
        })
      },
    )
  }, [])

  return (
    <>
      {/* Marquee keyframe — plain style tag, no styled-jsx */}
      <style>{`
        @keyframes vela-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .vela-marquee-track {
          animation: vela-marquee 22s linear infinite;
          will-change: transform;
        }
      `}</style>

      <section
        style={{ background: '#161616' }}
        aria-label="Manifesto"
      >
        {/* Main content */}
        <div className="px-6 md:px-14 pt-20 md:pt-32 pb-16 md:pb-24">

          {/* Decorative opening quote */}
          <span
            ref={quoteRef}
            className="font-display block"
            style={{
              fontSize: 'clamp(80px, 14vw, 180px)',
              fontWeight: 900,
              lineHeight: 0.7,
              color: '#FAF7F2',
              opacity: 0,
              marginBottom: 'clamp(20px, 3vw, 40px)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            "
          </span>

          {/* Lines */}
          <div className="space-y-10 md:space-y-16">
            {LINES.map((line, i) => (
              <div
                key={i}
                ref={(el) => { lineRefs.current[i] = el }}
                className="overflow-hidden"
              >
                {/* Big italic line */}
                <p
                  className="manifesto-big font-display"
                  style={{
                    fontSize: 'clamp(32px, 5.5vw, 80px)',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: 1.0,
                    letterSpacing: '-0.025em',
                    color: '#FAF7F2',
                    opacity: 0,
                  }}
                >
                  {line.big}
                </p>
                {/* Continuation line */}
                <p
                  className="manifesto-small font-display"
                  style={{
                    fontSize: 'clamp(32px, 5.5vw, 80px)',
                    fontStyle: 'normal',
                    fontWeight: 300,
                    lineHeight: 1.0,
                    letterSpacing: '-0.025em',
                    color: '#FAF7F2',
                    paddingLeft: 'clamp(32px, 4.5vw, 72px)',
                    opacity: 0,
                  }}
                >
                  {line.small}
                </p>
              </div>
            ))}
          </div>

          {/* Closing detail */}
          <div
            className="flex items-center gap-4 mt-16 md:mt-24"
          >
            <div
              style={{
                width: '40px',
                height: '1.5px',
                background: '#FF5B4A',
                borderRadius: '2px',
              }}
            />
            <p
              className="font-body"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#FAF7F2', opacity: 0.35 }}
            >
              VELA — SINCE 2024
            </p>
          </div>
        </div>

        {/* Marquee strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            padding: '18px 0',
          }}
          aria-hidden="true"
        >
          <div className="vela-marquee-track" style={{ display: 'flex', width: 'max-content', gap: 0 }}>
            {/* Repeat content twice so infinite loop is seamless */}
            {[0, 1].map((n) => (
              <span key={n} className="font-body" style={{ whiteSpace: 'nowrap', fontSize: '11px', letterSpacing: '0.18em', color: '#FAF7F2', opacity: 0.28, paddingRight: '0' }}>
                {MARQUEE_TEXT.repeat(6)}
              </span>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}
