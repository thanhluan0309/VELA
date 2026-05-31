'use client'

/* ─── Icon SVGs ─── */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)

/* Zalo "Z" — approximates the official mark */
const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="3" rx="1.5" fill="white"/>
    <line x1="20" y1="7" x2="4" y2="17" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <rect x="3.5" y="17" width="17" height="3" rx="1.5" fill="white"/>
  </svg>
)

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
)

const ACTIONS = [
  {
    id: 'phone',
    label: 'Gọi điện',
    bg: '#FF5B4A',
    ringColor: '#FF5B4A',
    href: 'tel:+84901234567',
    pulseDelay: '0s',
    Icon: PhoneIcon,
  },
  {
    id: 'zalo',
    label: 'Chat Zalo',
    bg: '#0068FF',
    ringColor: '#0068FF',
    href: 'https://zalo.me/0901234567',
    pulseDelay: '-0.8s',
    Icon: ZaloIcon,
  },
  {
    id: 'message',
    label: 'Nhắn tin',
    bg: '#2D2D2D',
    ringColor: '#2D2D2D',
    href: '#message',
    pulseDelay: '-1.6s',
    Icon: ChatIcon,
  },
]

export function FloatingActions() {
  return (
    <>
      <style>{`
        /* Outer ring pulses outward and fades */
        @keyframes fab-ring-out {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        /* Gentle float for the button */
        @keyframes fab-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        .fab-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: fab-ring-out 2.2s ease-out infinite;
          pointer-events: none;
        }
        .fab-ring-2 {
          animation-delay: -1.1s;
        }
        .fab-btn-el {
          animation: fab-float 3.2s ease-in-out infinite;
        }
        /* Tooltip */
        .fab-tip {
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .fab-wrap:hover .fab-tip {
          opacity: 1;
          transform: translateX(0);
        }
        .fab-btn-el:hover {
          filter: brightness(1.12);
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '88px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 50,
        }}
        role="complementary"
        aria-label="Liên hệ nhanh"
      >
        {ACTIONS.map(({ id, label, bg, ringColor, href, pulseDelay, Icon }) => (
          <div
            key={id}
            className="fab-wrap"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}
          >
            {/* Tooltip */}
            <span
              className="fab-tip font-body"
              style={{
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: '#FAF7F2',
                background: 'rgba(22,22,22,0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '5px 12px',
                borderRadius: '100px',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>

            {/* Pulse rings + button */}
            <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
              {/* Ring 1 */}
              <div
                className="fab-ring"
                style={{
                  border: `2px solid ${ringColor}`,
                  animationDelay: pulseDelay,
                }}
              />
              {/* Ring 2 — half period offset */}
              <div
                className="fab-ring fab-ring-2"
                style={{
                  border: `2px solid ${ringColor}`,
                  animationDelay: `calc(${pulseDelay} - 1.1s)`,
                }}
              />

              {/* Button */}
              <a
                href={href}
                target={id === 'zalo' ? '_blank' : undefined}
                rel={id === 'zalo' ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="fab-btn-el"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: bg,
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 6px 20px ${bg}50`,
                  textDecoration: 'none',
                  transition: 'filter 0.2s ease, box-shadow 0.2s ease',
                  animationDelay: pulseDelay,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${bg}80`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${bg}50`
                }}
              >
                <Icon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
