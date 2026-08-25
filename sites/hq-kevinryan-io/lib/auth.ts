import { auth0 } from './auth0'
import type { SessionData, User } from '@auth0/nextjs-auth0/types'

/**
 * Local-preview feature flag. Set `HQ_AUTH_DISABLED=true` in
 * `.env.local` to bypass Auth0 and render HQ with a synthetic
 * session — no login redirect, no callback URL configuration.
 *
 * Server-side only (never `NEXT_PUBLIC_`) so the flag cannot leak
 * to the client bundle or be toggled at runtime by a visitor.
 */
export const isAuthDisabled = process.env.HQ_AUTH_DISABLED === 'true'

const LOCAL_USER: User = {
  sub: 'local-preview',
  name: 'Local Preview',
  nickname: 'local',
  picture: '',
}

const LOCAL_SESSION: SessionData = {
  user: LOCAL_USER,
  tokenSet: {
    accessToken: '',
    expiresAt: 0,
    token_type: 'Bearer',
  },
  internal: {
    sid: 'local-preview',
    createdAt: Date.now(),
  },
}

/**
 * Returns the current session, or a synthetic one when auth is
 * disabled. Callers can treat the result uniformly — no per-call
 * branching needed.
 */
export async function getSession(): Promise<SessionData | null> {
  if (isAuthDisabled) return LOCAL_SESSION
  return auth0.getSession()
}
