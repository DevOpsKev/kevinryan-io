import { redirect } from 'next/navigation';

import { auth0 } from '../lib/auth0';

export default async function HomePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { user } = session;
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        color: '#F5F3EF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
        }}
      >
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.picture ?? ''}
            alt={`${user.nickname ?? user.name ?? 'user'} avatar`}
            width={36}
            height={36}
            style={{ borderRadius: '50%' }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.875rem',
              color: '#F5F3EF',
            }}
          >
            {user.nickname ?? user.name ?? ''}
          </span>
        </div>

        {/* Logout */}
        <a
          href="/auth/logout"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#F5F3EF',
            textDecoration: 'none',
            border: '1px solid #F5F3EF33',
            padding: '0.375rem 0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          logout
        </a>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {/* HQ wordmark */}
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            lineHeight: 1,
            color: '#F5F3EF',
          }}
        >
          HQ<span style={{ color: '#A8E10C' }}>.</span>
        </div>

        {/* Chat placeholder */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.875rem',
            color: '#F5F3EF55',
            letterSpacing: '0.05em',
          }}
        >
          chat interface coming soon
        </p>
      </main>

      {/* Footer — commit SHA */}
      <footer
        style={{
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6875rem',
            color: '#A8E10C',
            letterSpacing: '0.05em',
          }}
        >
          build: {commitSha}
        </span>
      </footer>
    </div>
  );
}
