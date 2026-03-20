'use client'

interface User {
  picture?: string
  nickname?: string
  name?: string
}

interface ChatHeaderProps {
  user: User
  redacted: boolean
  onRedactedChange: (value: boolean) => void
}

const toggleTrackBase: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  width: '2.25rem',
  height: '1.25rem',
  borderRadius: '999px',
  transition: 'background-color 0.2s ease',
  flexShrink: 0,
}

const toggleThumb: React.CSSProperties = {
  position: 'absolute',
  top: '0.1875rem',
  width: '0.875rem',
  height: '0.875rem',
  borderRadius: '50%',
  backgroundColor: '#0A0A0A',
  transition: 'left 0.2s ease',
}

export default function ChatHeader({
  user,
  redacted,
  onRedactedChange,
}: ChatHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.875rem 2rem',
        borderBottom: '1px solid #1a1a1a',
        gap: '1rem',
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem',
          lineHeight: 1,
          color: '#F5F3EF',
          flexShrink: 0,
        }}
      >
        HQ<span style={{ color: '#A8E10C' }}>.</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {/* Redact Data toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={() => onRedactedChange(!redacted)}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6875rem',
              color: redacted ? '#A8E10C' : '#F5F3EF66',
              letterSpacing: '0.04em',
              transition: 'color 0.2s ease',
              userSelect: 'none',
            }}
          >
            REDACT DATA
          </span>
          {/* Visual toggle track */}
          <div
            role="switch"
            aria-checked={redacted}
            aria-label="Redact Data"
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                onRedactedChange(!redacted)
              }
            }}
            tabIndex={0}
            style={{
              ...toggleTrackBase,
              backgroundColor: redacted ? '#A8E10C' : '#2a2a2a',
              border: `1px solid ${redacted ? '#A8E10C' : '#444'}`,
            }}
          >
            <div
              style={{
                ...toggleThumb,
                left: redacted ? '1.1875rem' : '0.1875rem',
              }}
            />
          </div>
        </div>

        {redacted && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#0A0A0A',
              backgroundColor: '#A8E10C',
              padding: '0.125rem 0.4rem',
              letterSpacing: '0.12em',
              borderRadius: '2px',
            }}
          >
            REDACTED
          </span>
        )}

        <div
          style={{
            width: '1px',
            height: '1.25rem',
            backgroundColor: '#2a2a2a',
            flexShrink: 0,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.picture ?? ''}
          alt={`${user.nickname ?? user.name ?? 'user'} avatar`}
          width={28}
          height={28}
          style={{ borderRadius: '50%', flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#F5F3EF',
          }}
        >
          {user.nickname ?? user.name ?? ''}
        </span>

        <a
          href="/auth/logout"
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#A8E10C',
            backgroundColor: 'transparent',
            border: '1px solid #A8E10C',
            padding: '0.3rem 0.75rem',
            textDecoration: 'none',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderRadius: '2px',
            flexShrink: 0,
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.backgroundColor = '#A8E10C'
            el.style.color = '#0A0A0A'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.backgroundColor = 'transparent'
            el.style.color = '#A8E10C'
          }}
        >
          LOGOUT
        </a>
      </div>
    </header>
  )
}
