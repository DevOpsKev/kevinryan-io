'use client'

interface User {
  picture?: string
  nickname?: string
  name?: string
}

interface ChatHeaderProps {
  user: User
  demoMode: boolean
  onDemoModeChange: (value: boolean) => void
}

export default function ChatHeader({
  user,
  demoMode,
  onDemoModeChange,
}: ChatHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #1a1a1a',
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem',
          lineHeight: 1,
          color: '#F5F3EF',
        }}
      >
        HQ<span style={{ color: '#A8E10C' }}>.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {demoMode && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#0A0A0A',
              backgroundColor: '#F59E0B',
              padding: '0.125rem 0.5rem',
              letterSpacing: '0.1em',
            }}
          >
            DEMO
          </span>
        )}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#F5F3EF99',
          }}
        >
          demo mode
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => onDemoModeChange(e.target.checked)}
            style={{ accentColor: '#A8E10C', width: '1rem', height: '1rem' }}
          />
        </label>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.picture ?? ''}
          alt={`${user.nickname ?? user.name ?? 'user'} avatar`}
          width={32}
          height={32}
          style={{ borderRadius: '50%' }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8125rem',
            color: '#F5F3EF',
          }}
        >
          {user.nickname ?? user.name ?? ''}
        </span>
      </div>
    </header>
  )
}
