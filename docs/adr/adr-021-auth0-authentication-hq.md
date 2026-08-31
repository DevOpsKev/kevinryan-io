---
title: "ADR-021: Auth0 for HQ Authentication"
draft: false
---

**Status:** Superseded by [ADR-023](adr-023-librechat-theme-overlay.md) — HQ was re-platformed from the custom Next.js app to a vanilla LibreChat install with native email/password auth; the Auth0/GitHub OAuth layer was dropped with it.
**Date:** 2026-03-17
**Decision Makers:** Human
**Prompted By:** HQ (`hq.kevinryan.io`) is transitioning from a static placeholder to a Next.js application with access to sensitive operational data, GitHub repositories, and AI agent capabilities. A single authenticated entry point is required before any dynamic functionality is built.

## Context

HQ is the internal operational interface for Kevin Ryan & Associates. It will host an AI agent with access to GitHub repositories, business data, and eventually financial records. The static placeholder (spec-0008) has no auth — that was acceptable for a pipeline validation exercise. The Next.js application (spec-0009) requires authentication before any meaningful functionality is exposed.

Auth0 with GitHub OAuth is already implemented on this domain from a prior iteration of the site. The decision is therefore: confirm Auth0 as the authentication layer for the Next.js rebuild, or replace it with an alternative.

The operator is a solo user. The security requirement is: only Kevin Ryan can access HQ. The UX requirement is: login must not be friction. The operational requirement is: auth must work without ongoing maintenance.

## Decision Drivers

- **Already implemented:** Auth0/GitHub OAuth exists on this domain. The callback URLs, tenant config, and credentials are in place.
- **Zero friction for solo use:** GitHub OAuth means one click — already authenticated in the browser, no password, no MFA prompt.
- **No maintenance overhead:** Auth0 manages token refresh, session expiry, and security patches. No custom session management code.
- **Demo safety:** Auth0 provides a hard gate before the chat interface. Demo mode is handled at the application layer (system prompt), but the auth layer ensures HQ is never accidentally exposed.
- **Next.js integration:** Auth0's Next.js SDK (`@auth0/nextjs-auth0`) integrates cleanly with App Router and API routes — the exact stack used here.

## Options Considered

### Option A: Auth0 with GitHub OAuth (current)

Managed authentication service. GitHub as the identity provider. Single click login for the operator — already authenticated in GitHub. Auth0 handles sessions, token refresh, and callback routing. Free tier covers solo use with no volume limits.

**Trade-offs:** External dependency on Auth0's availability. Tenant configuration lives outside the repo. `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` required as secrets.

### Option B: NextAuth.js (Auth.js)

Open source auth library, runs inside the Next.js app. GitHub OAuth provider built in. No external service dependency — sessions managed in-process or via a database adapter.

**Trade-offs:** Requires implementing session storage (JWT cookies or database). More code to maintain. No external dependency is an advantage for self-hosted infrastructure but creates implementation overhead for a solo operator building a tool, not a product.

### Option C: Cloudflare Access

Zero Trust access control enforced at the Cloudflare edge, before requests reach the origin. GitHub as identity provider. Free tier covers this use case. No application code required.

**Trade-offs:** Auth happens outside the application entirely — no access to user identity within the app (relevant if HQ eventually has per-user context). Tighter coupling to Cloudflare as an infrastructure dependency. Configuration lives in the Cloudflare dashboard, not the repo.

### Option D: IP allowlist via Cloudflare firewall

Restrict access to known IPs at the Cloudflare WAF layer. Zero code, zero dependencies.

**Trade-offs:** Fragile — mobile, travel, and dynamic IPs break access immediately. Unacceptable for a tool used across Budapest, Dublin, London, and France.

### Option E: nginx Basic Auth

Username and password in the nginx config, enforced at the container level.

**Trade-offs:** Credentials in plaintext or base64 in config. No OAuth. Unsuitable for sharing access during demos. Lowest possible security for a tool containing sensitive operational data.

## Decision

**Auth0 with GitHub OAuth. Option A.**

The implementation already exists. The credentials are configured. The Next.js SDK integration is well-documented and maintained. For a solo operator, GitHub OAuth is the right identity provider — it requires no additional credentials to manage and works seamlessly across devices.

Cloudflare Access (Option C) is the strongest alternative and would be the right choice if starting from scratch with no existing auth configuration. It has no application code, no SDK dependency, and enforces the gate at the edge. It is worth revisiting if Auth0's free tier constraints become a problem or if the Auth0 dependency introduces friction during infrastructure changes.

NextAuth.js (Option B) is the right choice if HQ were a product with multiple users and per-user data. It is unnecessary complexity for a single-operator internal tool.

## Consequences

### Positive

- No implementation work — Auth0 is already configured and working on this domain
- GitHub OAuth provides frictionless login across all devices without password management
- Auth0's Next.js SDK handles session management, token refresh, and route protection cleanly
- Hard security gate before any AI agent functionality is accessible
- Auth layer is independent of application logic — demo mode and redaction are handled separately in the system prompt

### Negative

- External dependency on Auth0's managed service availability
- Tenant configuration is outside the repo and must be manually recreated if the Auth0 account is lost
- Five environment secrets required: `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`

### Risks

- **Auth0 free tier limits change:** Auth0 has modified its free tier in the past. Mitigation: monitor Auth0 announcements; Option C (Cloudflare Access) is a viable zero-cost migration path if needed.
- **Auth0 tenant misconfiguration after deployment changes:** If `AUTH0_BASE_URL` changes (e.g. during a domain migration), callbacks will break. Mitigation: document the callback URLs in this ADR and verify them during any domain change.

**Callback URLs registered in Auth0 tenant:**

- Allowed Callback URL: `https://hq.kevinryan.io/api/auth/callback`
- Allowed Logout URL: `https://hq.kevinryan.io`
- Allowed Web Origins: `https://hq.kevinryan.io`

## Agent Decisions

| Decision | Rationale | Acceptable |
|----------|-----------|------------|
| None | This ADR records a human decision. Auth0 was already implemented prior to this ADR being written. | — |

## References

- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [ADR-005: K3s on Azure with Cloudflare CDN](adr-005-k3s-azure-spot-cloudflare-cdn.md)
- [ADR-009: CI/CD with GitHub Actions and Flux CD](adr-009-cicd-github-actions-flux.md)
- [Spec-0008: HQ static placeholder](../specification/spec-0008-hq-kevinryan-io.md)
- [Cloudflare Access documentation](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/)
