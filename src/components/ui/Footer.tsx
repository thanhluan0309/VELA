'use client'

const NAV_LINKS = ['Collection', 'About', 'Contact', 'Sustainability']
const SOCIAL = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'X', href: '#' },
]

export function Footer() {
  return (
    <footer
      className="px-8 md:px-14 py-10 md:py-12 border-t"
      style={{ background: 'var(--bg)', borderColor: 'rgba(22,22,22,0.12)' }}
      role="contentinfo"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Brand */}
        <a
          href="/"
          className="font-body font-medium tracking-[0.22em] text-ink"
          style={{ fontSize: '12px' }}
          aria-label="VELA"
        >
          VELA
        </a>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="font-body hover:text-accent transition-colors duration-200"
                  style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'var(--ink-muted)' }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social + copyright */}
        <div className="flex items-center gap-6">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="font-body hover:text-accent transition-colors duration-200"
              style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'var(--ink-muted)' }}
            >
              {s.label}
            </a>
          ))}
          <span
            className="font-body"
            style={{ fontSize: '11px', color: 'var(--ink-muted)', opacity: 0.5 }}
          >
            © 2024 VELA
          </span>
        </div>
      </div>
    </footer>
  )
}
