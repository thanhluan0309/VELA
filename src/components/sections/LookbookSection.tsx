'use client'

import { useEffect, useRef } from 'react'
import { LOOKBOOK_CELLS } from '@/lib/products'

const IMG_PARAMS = '?auto=format&fit=crop&w=800&q=75'

export function LookbookSection() {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { default: ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        cellRefs.current.forEach((el, i) => {
          if (!el) return
          gsap.set(el, { opacity: 0, y: 20, scale: 0.98 })
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'power3.out',
                delay: i * 0.07,
              })
            },
            once: true,
          })
        })
      },
    )
  }, [])

  return (
    <>
      <style>{`
        .lb-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr 1fr;
          grid-auto-rows: 200px;
        }
        @media (min-width: 640px) {
          .lb-grid { grid-auto-rows: 240px; }
        }
        @media (min-width: 768px) {
          .lb-grid {
            grid-template-columns: 1fr 1.55fr 1fr;
            grid-template-rows: repeat(2, 300px);
            grid-auto-rows: unset;
          }
          .lb-cell-0 { grid-row: span 2; }
        }
        .lb-cell {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .lb-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94),
                      filter 0.55s ease;
          will-change: transform;
        }
        .lb-cell:hover img {
          transform: scale(1.06);
          filter: brightness(1.08);
        }
        .lb-cell:hover .lb-overlay {
          opacity: 0.75;
        }
      `}</style>

      <section
        className="px-4 sm:px-8 md:px-14 py-16 md:py-28"
        style={{ background: 'var(--bg)' }}
        aria-label="Lookbook"
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p
              className="font-body"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'var(--ink-muted)', marginBottom: '4px' }}
            >
              LOOKBOOK
            </p>
            <p
              className="font-display"
              style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1 }}
            >
              Wear the season.
            </p>
          </div>
          <a
            href="#"
            className="font-body hover:text-accent transition-colors shrink-0"
            style={{ fontSize: '12px', letterSpacing: '0.07em', color: 'var(--ink)' }}
          >
            View all →
          </a>
        </div>

        {/* Grid */}
        <div className="lb-grid">
          {LOOKBOOK_CELLS.map((cell, i) => (
            <div
              key={i}
              ref={(el) => { cellRefs.current[i] = el }}
              className={`lb-cell lb-cell-${i}`}
              style={{ opacity: 0 }}
              role="img"
              aria-label={`${cell.label} — ${cell.sub}`}
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cell.imgSrc + IMG_PARAMS}
                alt={`${cell.label} — ${cell.sub}`}
                loading="lazy"
                onError={(e) => {
                  // Fallback: hide img and show bg color
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />

              {/* Dark gradient — bottom heavier, slight top vignette */}
              <div
                className="lb-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    linear-gradient(
                      to bottom,
                      rgba(0,0,0,0.18) 0%,
                      rgba(0,0,0,0.08) 35%,
                      rgba(0,0,0,0.55) 70%,
                      rgba(0,0,0,0.82) 100%
                    )
                  `,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                }}
              />

              {/* Fallback bg (shows when img fails to load) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: cell.bg,
                  zIndex: -1,
                }}
              />

              {/* ── Top area ── */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: 'clamp(12px, 2vw, 20px)',
                  zIndex: 2,
                }}
              >
                {/* Sub label */}
                <p
                  className="font-body"
                  style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#FAF7F2', opacity: 0.7 }}
                >
                  {cell.sub.toUpperCase()}
                </p>

                {/* Tag badge */}
                {cell.tag && (
                  <span
                    className="font-body"
                    style={{
                      fontSize: '8px',
                      letterSpacing: '0.18em',
                      fontWeight: 700,
                      color: '#161616',
                      background: '#FAF7F2',
                      padding: '3px 8px',
                      borderRadius: '100px',
                    }}
                  >
                    {cell.tag}
                  </span>
                )}
              </div>

              {/* Ghost bigLabel — editorial texture */}
              <span
                className="font-display"
                style={{
                  position: 'absolute',
                  bottom: '-0.12em',
                  right: '-0.03em',
                  fontSize: i === 0 ? 'clamp(100px, 18vw, 180px)' : 'clamp(80px, 14vw, 140px)',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: '#FAF7F2',
                  opacity: 0.07,
                  letterSpacing: '-0.05em',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
                aria-hidden="true"
              >
                {cell.bigLabel}
              </span>

              {/* ── Bottom info ── */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 'clamp(10px, 2vw, 18px) clamp(12px, 2vw, 20px) clamp(12px, 2vw, 18px)',
                  zIndex: 2,
                }}
              >
                <p
                  className="font-display"
                  style={{
                    fontSize: i === 0 ? 'clamp(20px, 3vw, 38px)' : 'clamp(16px, 2.4vw, 30px)',
                    fontWeight: i === 1 ? 900 : 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: '#FAF7F2',
                    marginBottom: '8px',
                  }}
                >
                  {cell.label}
                </p>

                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.25)',
                    paddingTop: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <p
                    className="font-body"
                    style={{ fontSize: '8px', letterSpacing: '0.14em', color: '#FAF7F2', opacity: 0.6 }}
                  >
                    {cell.meta}
                  </p>
                  <span style={{ color: '#FAF7F2', opacity: 0.5, fontSize: '10px' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="flex items-center justify-between mt-6 md:mt-10 pt-5 md:pt-8"
          style={{ borderTop: '1px solid rgba(22,22,22,0.1)' }}
        >
          <p
            className="font-body"
            style={{ fontSize: '11px', letterSpacing: '0.06em', color: 'var(--ink-muted)' }}
          >
            60+ pieces · Free shipping over $200
          </p>
          <a
            href="#"
            data-cursor="expand"
            className="font-body font-medium hover:opacity-70 transition-opacity"
            style={{
              fontSize: '12px',
              letterSpacing: '0.09em',
              padding: '10px 22px',
              borderRadius: '100px',
              border: '1.5px solid var(--ink)',
              color: 'var(--ink)',
            }}
          >
            SHOP ALL →
          </a>
        </div>
      </section>
    </>
  )
}
