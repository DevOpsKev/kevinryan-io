'use client'

interface User {
  picture?: string
  nickname?: string
  name?: string
}

interface ChatHeaderProps {
  user: User
}

export default function ChatHeader({ user }: ChatHeaderProps) {
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
