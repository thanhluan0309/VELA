'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type CollectionProduct, type ColorVariant } from '@/lib/products'

const IMG_PARAMS = '?auto=format&fit=crop&w=900&q=80'

/* ─── Star rating ─── */
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span style={{ letterSpacing: '1px', fontSize: '14px', color: '#FFD66B' }} aria-label={`${rating} sao`}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
    </span>
  )
}

/* ─── Animated count-up ─── */
function CountUp({ n }: { n: number }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const dur = 900
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * n))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [n])
  return <>{val.toLocaleString()}</>
}

interface Props {
  open: boolean
  product: CollectionProduct
  selectedColor: ColorVariant
  onClose: () => void
}

export function ProductModal({ open, product, selectedColor, onClose }: Props) {
  const [activeColor, setActiveColor] = useState<ColorVariant>(selectedColor)
  const [activeSize, setActiveSize] = useState<string | null>(null)
  const [imgSrc, setImgSrc] = useState(selectedColor.imgSrc)
  const [imgFading, setImgFading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    setActiveColor(selectedColor)
    setImgSrc(selectedColor.imgSrc)
    setActiveSize(null)
  }, [open, selectedColor])

  function handleColorChange(c: ColorVariant) {
    if (c.name === activeColor.name) return
    setActiveColor(c)
    setImgFading(true)
    setTimeout(() => { setImgSrc(c.imgSrc); setImgFading(false) }, 160)
  }

  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!mounted || !open) return null

  const content = (
    <>
      <style>{`
        @keyframes modal-slide-in {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .modal-card {
          animation: modal-slide-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        /* Responsive grid */
        .modal-inner {
          display: grid;
          grid-template-rows: 240px 1fr;
          grid-template-columns: 1fr;
          max-height: 88vh;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .modal-inner { grid-template-rows: 300px 1fr; }
        }
        @media (min-width: 768px) {
          .modal-inner {
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 1fr;
            max-height: 82vh;
          }
        }
        .modal-info {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(14,14,14,0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 998,
        }}
        aria-hidden="true"
      />

      {/*
       * Centering wrapper — flex so centering is not done via transform.
       * The modal card uses transform only for the slide-in animation,
       * avoiding the conflict with transform: translate(-50%,-50%).
       */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết: ${product.name}`}
          className="modal-card modal-inner"
          style={{
            width: 'min(96vw, 960px)',
            background: '#FAF7F2',
            borderRadius: '14px',
            overflow: 'hidden',
            pointerEvents: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
          }}
        >
          {/* ══ LEFT / TOP: photo ══ */}
          <div style={{ position: 'relative', background: '#0E0E0E', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc + IMG_PARAMS}
              alt={`${product.name} — ${activeColor.name}`}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                opacity: imgFading ? 0 : 1,
                transition: 'opacity 0.18s ease',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(14,14,14,0.65) 0%, transparent 55%)',
              pointerEvents: 'none',
            }}/>

            {/* Badge */}
            {product.badge && (
              <span className="font-body" style={{
                position: 'absolute', top: 14, left: 16,
                background: product.accentLine, color: '#161616',
                fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700,
                padding: '4px 10px', borderRadius: '100px',
              }}>
                {product.badge}
              </span>
            )}

            {/* Saved count */}
            <div style={{
              position: 'absolute', bottom: 14, left: 16,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ color: '#FF5B4A', fontSize: '15px' }}>♥</span>
              <span className="font-body" style={{ fontSize: '12px', color: '#FAF7F2', fontWeight: 600 }}>
                <CountUp n={product.stats.saved} /> người đã lưu toàn cầu
              </span>
            </div>
          </div>

          {/* ══ RIGHT / BOTTOM: info ══ */}
          <div className="modal-info" style={{ padding: 'clamp(20px, 3vw, 32px)' }}>

            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p className="font-body" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--ink-muted)', marginBottom: '3px' }}>
                  {product.sku}
                </p>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900,
                  letterSpacing: '-0.03em', lineHeight: 0.92, color: 'var(--ink)',
                }}>
                  {product.name}
                </h2>
                <p className="font-body" style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '3px' }}>
                  {product.sub}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Đóng"
                style={{
                  flexShrink: 0, width: '32px', height: '32px',
                  borderRadius: '50%', border: '1.5px solid rgba(22,22,22,0.18)',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: '14px', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(22,22,22,0.08)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                ✕
              </button>
            </div>

            {/* Rating + stats chips */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <StarRating rating={product.stats.rating} />
                <span className="font-body" style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  {product.stats.rating} · {product.stats.reviews.toLocaleString()} đánh giá
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { icon: '♥', v: product.stats.saved.toLocaleString(), l: 'lượt lưu' },
                  { icon: '🌍', v: String(product.stats.countries), l: 'quốc gia' },
                  { icon: '↩', v: '30', l: 'ngày đổi trả' },
                ].map((s) => (
                  <span key={s.l} className="font-body" style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', padding: '4px 10px',
                    background: 'rgba(22,22,22,0.06)', borderRadius: '100px',
                    color: 'var(--ink)',
                  }}>
                    {s.icon} <strong>{s.v}</strong> {s.l}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(22,22,22,0.1)', marginBottom: '14px' }}/>

            {/* Description */}
            <p className="font-body" style={{ fontSize: '12px', lineHeight: 1.72, color: 'var(--ink-muted)', marginBottom: '16px' }}>
              {product.description}
            </p>

            {/* Color */}
            <div style={{ marginBottom: '14px' }}>
              <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                MÀU SẮC — {activeColor.name}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => handleColorChange(c)}
                    aria-label={c.name} aria-pressed={activeColor.name === c.name}
                    style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: c.hex, border: 'none', cursor: 'pointer',
                      boxShadow: activeColor.name === c.name
                        ? '0 0 0 2px #FAF7F2, 0 0 0 4px #161616'
                        : 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                      transform: activeColor.name === c.name ? 'scale(1.16)' : 'scale(1)',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    }}/>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: '16px' }}>
              <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                SIZE{activeSize ? ` — EU ${activeSize}` : ' — chọn size'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setActiveSize((p) => p === s ? null : s)}
                    aria-pressed={activeSize === s} className="font-body"
                    style={{
                      fontSize: '12px', padding: '6px 14px', borderRadius: '100px',
                      border: `1.5px solid ${activeSize === s ? '#161616' : 'rgba(22,22,22,0.2)'}`,
                      background: activeSize === s ? '#161616' : 'transparent',
                      color: activeSize === s ? '#FAF7F2' : '#161616',
                      cursor: 'pointer', transition: 'all 0.18s ease',
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="font-display" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="font-body" style={{ fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                    {product.originalPrice}
                  </span>
                )}
              </div>
              <button
                disabled={!activeSize} className="font-body"
                style={{
                  flex: 1, minWidth: '140px',
                  fontSize: '12px', letterSpacing: '0.08em', fontWeight: 700,
                  padding: '13px 18px', borderRadius: '100px', border: 'none',
                  background: activeSize ? product.accentLine : 'rgba(22,22,22,0.1)',
                  color: '#161616',
                  cursor: activeSize ? 'pointer' : 'default',
                  opacity: activeSize ? 1 : 0.4,
                  transition: 'all 0.22s ease',
                }}>
                {activeSize ? `THÊM VÀO GIỎ — EU ${activeSize}` : 'CHỌN SIZE TRƯỚC'}
              </button>
            </div>

            <div style={{ height: '1px', background: 'rgba(22,22,22,0.1)', marginBottom: '14px' }}/>

            {/* Materials */}
            <div style={{ marginBottom: '12px' }}>
              <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-muted)', marginBottom: '5px' }}>VẬT LIỆU</p>
              <p className="font-body" style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{product.materials}</p>
            </div>

            {/* Care */}
            <div style={{ marginBottom: '14px' }}>
              <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-muted)', marginBottom: '8px' }}>BẢO QUẢN</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {product.care.map((c, i) => (
                  <li key={i} className="font-body" style={{ fontSize: '11px', color: 'var(--ink-muted)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: product.accentLine, flexShrink: 0 }}>·</span>{c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 12px', background: 'rgba(22,22,22,0.04)', borderRadius: '8px',
            }}>
              <span style={{ fontSize: '15px' }}>📦</span>
              <span className="font-body" style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                Miễn phí ship từ <strong style={{ color: 'var(--ink)' }}>$200</strong> · Đổi trong{' '}
                <strong style={{ color: 'var(--ink)' }}>30 ngày</strong> · Giao tới{' '}
                <strong style={{ color: 'var(--ink)' }}>{product.stats.countries} quốc gia</strong>
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )

  return createPortal(content, document.body)
}
