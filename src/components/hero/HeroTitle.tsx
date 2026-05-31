'use client'

import { useEffect, useRef } from 'react'

const WORDS = ['WEAR', 'THE', 'LIGHT.']

export function HeroTitle() {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const ruleRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    import('gsap').then(({ default: gsap }) => {
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[]
      if (!words.length) return

      gsap.fromTo(
        words,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.11,
          duration: 1.05,
          ease: 'expo.out',
          delay: 0.25,
        },
      )

      if (ruleRef.current) {
        gsap.fromTo(
          ruleRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'expo.out', delay: 0.85 },
        )
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.95 },
        )
      }
    })
  }, [])

  return (
    <div>
      {/* Headline — each word in overflow mask so reveal clips cleanly */}
      {WORDS.map((word, i) => (
        <div key={word} className="overflow-hidden" style={{ lineHeight: 1 }}>
          <span
            ref={(el) => { wordRefs.current[i] = el }}
            className="hero-word block font-display"
            style={{
              fontSize: 'clamp(56px, 13vw, 210px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
              color: 'var(--ink)',
              fontStyle: i === 1 ? 'italic' : 'normal',
              paddingLeft: i === 1 ? 'clamp(28px, 5vw, 80px)' : '0',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
        </div>
      ))}

      {/* Coral accent rule — wipes in left-to-right after words */}
      <div
        ref={ruleRef}
        style={{
          width: '56px',
          height: '2.5px',
          background: 'var(--accent)',
          borderRadius: '2px',
          marginTop: '28px',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
        aria-hidden="true"
      />

      {/* CTA row — fades in */}
      <div
        ref={metaRef}
        className="hero-meta flex items-center gap-7 mt-6"
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      >
        <a
          href="#collection"
          data-cursor="expand"
          className="font-body font-medium inline-flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#FAF7F2',
            fontSize: '12px',
            letterSpacing: '0.1em',
            padding: '13px 28px',
            borderRadius: '100px',
          }}
        >
          SHOP NOW
          <span aria-hidden="true">→</span>
        </a>

        <a
          href="#about"
          data-cursor="expand"
          className="font-body text-ink hover:text-accent transition-colors duration-200"
          style={{ fontSize: '12px', letterSpacing: '0.08em' }}
        >
          Explore
        </a>
      </div>
    </div>
  )
}
