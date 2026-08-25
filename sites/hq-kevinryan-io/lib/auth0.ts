import { Auth0Client } from '@auth0/nextjs-auth0/server'

/**
 * Lazily-constructed Auth0 client. The SDK validates required env
 * vars in the constructor and logs warnings when they are missing.
 * Deferring construction until the first real call keeps those
 * warnings out of the logs when `HQ_AUTH_DISABLED=true`.
 */
let client: Auth0Client | null = null

export function getAuth0(): Auth0Client {
  if (!client) client = new Auth0Client()
  return client
}

/**
 * Backwards-compatible property accessor. Existing imports that
 * use `auth0.getSession()` / `auth0.middleware()` still work; the
 * client is just created on first access instead of at load time.
 */
export const auth0 = new Proxy({} as Auth0Client, {
  get(_target, prop) {
    return Reflect.get(getAuth0(), prop)
  },
})
