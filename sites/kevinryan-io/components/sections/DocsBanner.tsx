'use client'

import { useEffect, useState } from "react"

const STRONG: React.CSSProperties = { color: '#F5F3EF', fontWeight: 700 }

export default function DocsBanner() {
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div style={{ background: '#0A0A0A', padding: '0 clamp(1.5rem, 5vw, 6rem)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', borderTop: '1px solid #2E2D2B' }}>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#A8E10C',
          paddingTop: '1.25rem',
          paddingBottom: '0.75rem',
        }}>
          See it in production
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
          alignItems: isMobile ? 'start' : 'end',
          gap: isMobile ? '1rem' : '3rem',
          paddingBottom: '1.75rem',
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#7A7772', maxWidth: '54ch', margin: 0 }}>
            This entire platform &mdash; <strong style={STRONG}>seven sites</strong>, one monorepo, full <strong style={STRONG}>analytics and observability</strong> &mdash; is agent-built, spec-driven, and deployed through <strong style={STRONG}>deterministic automation</strong>. The documentation is the portfolio.
          </p>
          <a
            href="https://docs.kevinryan.io"
            target="_blank"
            rel="noopener"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: hovered ? '#F5F3EF' : '#A8E10C',
              borderBottom: `2px solid ${hovered ? '#F5F3EF' : '#A8E10C'}`,
              paddingBottom: '0.15rem',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
          >
            docs.kevinryan.io
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
