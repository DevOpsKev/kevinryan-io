'use client'

import type { User } from '@/lib/types'

interface ChatHeaderProps {
  user: User
  authDisabled?: boolean
}

export default function ChatHeader({ user, authDisabled }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-8 py-3.5">
      <div className="shrink-0 font-display text-[2rem] leading-none text-ink">
        HQ<span className="text-accent">.</span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {user.picture ? (
          <>
            {/* Auth0 avatar is a remote runtime URL, so next/image needs a
                remote pattern config we don't have — plain img is intentional. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.picture}
              alt={`${user.nickname ?? user.name ?? 'user'} avatar`}
              width={28}
              height={28}
              className="shrink-0 rounded-full"
            />
          </>
        ) : null}
        <span className="font-mono text-xs text-ink">
          {user.nickname ?? user.name ?? ''}
        </span>

        {authDisabled ? null : (
          <a
            href="/auth/logout"
            className="shrink-0 rounded-[2px] border border-accent bg-transparent px-3 py-[0.3rem] font-body text-[0.72rem] font-bold uppercase tracking-[0.14em] no-underline text-accent transition-colors duration-150 ease-out hover:bg-accent hover:text-bg"
          >
            LOGOUT
          </a>
        )}
      </div>
    </header>
  )
}
