'use client'

import { useEffect, useRef } from 'react'
import { HeroTitle } from './HeroTitle'
import { SceneClient } from '@/components/canvas/SceneClient'
import { emitScene } from '@/lib/sceneEvents'

const HERO_PRODUCT = {
  name: 'THE CLASSIC',
  materials: 'Italian suede · Rubber sole',
  price: '$320',
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { default: ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        if (navRef.current) {
          gsap.from(navRef.current, { y: -20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.05 })
        }
        if (labelRef.current) {
          gsap.from(labelRef.current, { x: -16, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.18 })
        }
        if (tagRef.current) {
          gsap.from(tagRef.current, { x: 20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 1.15 })
        }

        if (sectionRef.current) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'bottom 75%',
            onLeave: () => emitScene({ type: 'shoe:visible', visible: false }),
            onEnterBack: () => emitScene({ type: 'shoe:visible', visible: true }),
          })
        }
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)' }}
      aria-label="Hero"
    >

      {/* ── Ghost background "01" — editorial depth, desktop only ─── */}
      <span
        className="absolute font-display select-none pointer-events-none hidden md:block"
        style={{
          bottom: '-0.08em',
          right: '-0.04em',
          fontSize: 'clamp(280px, 38vw, 560px)',
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--ink)',
          opacity: 0.028,
          letterSpacing: '-0.05em',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        01
      </span>

      {/* ── Ghost "01" mobile version — smaller ─────────────────── */}
      <span
        className="absolute font-display select-none pointer-events-none md:hidden"
        style={{
          bottom: '-0.05em',
          right: '-0.04em',
          fontSize: 'clamp(180px, 55vw, 280px)',
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--ink)',
          opacity: 0.035,
          letterSpacing: '-0.05em',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        01
      </span>

      {/* ── 3D Canvas — absolute within hero, desktop only ────────── */}
      {/*
       * Hidden on mobile: canvas is expensive and layout is typography-first.
       * On md+ the canvas fills the section; shoe at x=+1.0 sits in right ~40%.
       */}
      <div className="absolute inset-0 z-0 hidden md:block" aria-hidden="true">
        <SceneClient />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 pt-6 md:px-14 md:pt-9"
      >
        <a
          href="/"
          className="font-body font-medium tracking-[0.22em] text-ink"
          style={{ fontSize: '12px' }}
          aria-label="VELA home"
        >
          VELA
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          {['Collection', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-ink hover:text-accent transition-colors duration-200 hidden md:block"
              style={{ fontSize: '11px', letterSpacing: '0.09em' }}
            >
              {item}
            </a>
          ))}
          <button
            data-cursor="expand"
            className="font-body text-ink hover:text-accent transition-colors duration-200"
            style={{ fontSize: '11px', letterSpacing: '0.09em' }}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* ── Editorial catalogue label ────────────────────────────── */}
      <p
        ref={labelRef}
        className="relative z-10 px-6 md:px-14 mt-3 md:mt-4 font-body"
        style={{
          fontSize: '10px',
          letterSpacing: '0.22em',
          color: 'var(--ink-muted)',
        }}
        aria-hidden="true"
      >
        N°001 — AW 2024
      </p>

      {/* ── Headline — full-width, no column clip ───────────────── */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-14 py-8 md:py-10">
        <HeroTitle />
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 flex items-end justify-between px-6 pb-7 md:px-14 md:pb-11">

        {/* Left: tagline */}
        <div>
          <p
            className="font-body leading-relaxed"
            style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              letterSpacing: '0.01em',
              maxWidth: '200px',
            }}
          >
            Editorial fashion for the modern woman.
            <br className="hidden md:block" />
            {' '}Crafted with intention. Worn with ease.
          </p>
          {/* EST. 2024 — under tagline */}
          <p
            className="font-body mt-3"
            style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--ink-muted)', opacity: 0.6 }}
            aria-hidden="true"
          >
            EST. 2024
          </p>
        </div>

        {/* Right: product info + scroll indicator */}
        <div className="flex items-end gap-6 md:gap-8">

          {/* Product tag — desktop only, fades in last */}
          <div
            ref={tagRef}
            className="hidden md:block text-right"
          >
            <p
              className="font-display"
              style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: '3px' }}
            >
              {HERO_PRODUCT.name}
            </p>
            <p
              className="font-body"
              style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'var(--ink-muted)' }}
            >
              {HERO_PRODUCT.materials}
            </p>
            <p
              className="font-body mt-1"
              style={{ fontSize: '12px', letterSpacing: '0.02em', color: 'var(--accent)', fontWeight: 600 }}
            >
              {HERO_PRODUCT.price}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2" aria-hidden="true">
            <div
              className="w-px"
              style={{ height: '40px', background: 'var(--ink)', opacity: 0.28 }}
            />
            <span
              className="font-body"
              style={{
                fontSize: '9px',
                letterSpacing: '0.18em',
                color: 'var(--ink-muted)',
                writingMode: 'vertical-rl',
              }}
            >
              SCROLL
            </span>
          </div>
        </div>
      </div>

    </section>
  )
}
