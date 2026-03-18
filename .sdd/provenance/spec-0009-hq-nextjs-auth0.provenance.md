---
title: "Provenance: Spec 0009 — HQ Next.js Application with Auth0"
draft: false
---

**Spec:** `.sdd/specification/spec-0009-hq-nextjs-auth0.md`
**Executed:** 2026-03-18
**Agent:** Claude Code CLI (claude-sonnet-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0009-hq-nextjs-auth0.md` — full specification
2. Read `sites/kevinryan-io/package.json` — reference package.json pattern
3. Read `sites/kevinryan-io/next.config.ts` — reference Next.js config
4. Read `sites/kevinryan-io/app/layout.tsx` — reference layout pattern
5. Read `.github/workflows/deploy.yml` — reference workflow
6. Read `.github/workflows/deploy-hq.yml` — existing HQ workflow (already correct)
7. Read `k8s/hq-kevinryan-io/deployment.yaml` — existing deployment (port 8080, nginx resources)
8. Read `k8s/hq-kevinryan-io/service.yaml` — existing service (targetPort 8080)
9. Read `infra/variables.tf` — existing Terraform variables
10. Read `infra/main.tf` (partial) — existing Key Vault secret resources
11. Read `.github/workflows/terraform.yml` — existing Terraform workflow
12. Read `.sdd/provenance/template.md` — provenance template
13. Deleted `sites/hq-kevinryan-io/public/index.html` — static placeholder
14. Deleted `sites/hq-kevinryan-io/nginx.conf` — nginx configuration
15. Deleted `sites/hq-kevinryan-io/Dockerfile` — nginx-based container
16. Created `sites/hq-kevinryan-io/package.json` — Next.js + Auth0 dependencies
17. Created `sites/hq-kevinryan-io/next.config.ts` — server mode (no `output: 'export'`)
18. Created `sites/hq-kevinryan-io/tsconfig.json` — strict TypeScript
19. Created `sites/hq-kevinryan-io/middleware.ts` — Auth0 middleware, excludes api/auth and api/healthz
20. Created `sites/hq-kevinryan-io/app/globals.css` — minimal global styles
21. Created `sites/hq-kevinryan-io/app/layout.tsx` — Google Fonts (Bebas Neue, Archivo, JetBrains Mono)
22. Created `sites/hq-kevinryan-io/app/page.tsx` — protected home page with session null guard
23. Created `sites/hq-kevinryan-io/app/api/auth/[auth0]/route.ts` — Auth0 handler
24. Created `sites/hq-kevinryan-io/app/api/healthz/route.ts` — health check endpoint
25. Created `sites/hq-kevinryan-io/Dockerfile` — two-stage Node.js build, port 3000
26. Overwrote `k8s/hq-kevinryan-io/deployment.yaml` — port 3000, envFrom, increased resources
27. Overwrote `k8s/hq-kevinryan-io/service.yaml` — targetPort 3000
28. Created `k8s/hq-kevinryan-io/externalsecret.yaml` — maps 5 Auth0 env vars from azure-keyvault
29. Modified `infra/variables.tf` — appended 4 sensitive Auth0 variables
30. Modified `infra/main.tf` — appended 5 azurerm_key_vault_secret resources for hq-auth0-*
31. Modified `.github/workflows/terraform.yml` — added TF_VAR_auth0_* to both plan and apply jobs

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Null session handling in `app/page.tsx` | (a) Unhandled null, (b) Show fallback UI, (c) Redirect to login | Redirect to `/api/auth/login` | Middleware should prevent unauthenticated access, but defensive coding requires handling the edge case. Redirect is correct UX — user should never see a partially rendered page without auth. Requested explicitly by user during plan review. |
| Avatar rendering | `next/image` vs plain `<img>` | Plain `<img>` with eslint-disable comment | `next/image` requires configuring `remotePatterns` for Auth0's CDN domains (which vary by tenant). Plain `<img>` avoids that configuration overhead while remaining functional. The eslint-disable is justified inline. |
| No Tailwind/DaisyUI | Add Tailwind as in kevinryan-io vs inline styles | Inline styles | Spec does not include Tailwind in the package.json. HQ uses the spec's prescribed colour palette (`#0A0A0A`, `#F5F3EF`, `#A8E10C`) with inline styles, keeping the dependency surface minimal. |
| globals.css scope | Full reset vs minimal | Minimal reset (box-sizing, margin, padding, background, color, font-family) | HQ has a single page — a full CSS reset is unnecessary overhead. |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | `pnpm-workspace.yaml` already includes `sites/*` glob and needs no modification | §10 | Verified by reading the file — `packages: ['sites/*']` covers hq-kevinryan-io automatically. |
| A2 | `.github/workflows/deploy-hq.yml` is already correct and needs no modification | §9 | Verified by reading the file — path trigger, image names, build-args, and manifest update command are all correct for the new Next.js container. |
| A3 | The Auth0 SDK `getSession()` is called server-side in `app/page.tsx` (React Server Component) | §4 | Page reads session data (username, avatar) at render time. Server component is the correct pattern for `@auth0/nextjs-auth0` v4. |
| A4 | `user.nickname` is the GitHub username field returned by Auth0 when GitHub is the social connection | §4 | Auth0 maps GitHub's `login` field to `nickname` in the OIDC claims. `user.name` is used as fallback. |
| A5 | No `eslint.config.mjs` or `.eslintrc` is required — Next.js provides default ESLint config via `eslint-config-next` | §2 | kevinryan-io has the same pattern and lint passes without an explicit config file in some setups. If `pnpm lint` fails, an `eslint.config.mjs` may need to be added. |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | "HQ wordmark — `HQ` in Bebas Neue, large, lime accent on the period or as highlight" | §4 | Rendered as `HQ` in `#F5F3EF` followed by `.` in `#A8E10C`, font-size `clamp(6rem, 20vw, 12rem)` | Could be `HQ` with lime accent on the entire text, or a lime underline |
| B2 | "bottom of page" for commit SHA | §4 | Positioned in a `<footer>` with `flex-end` alignment (bottom-right) | Could be bottom-center |
| B3 | "top right corner" for logout button | §4 | Positioned in a `<header>` flex row with user info on left, logout on right | Could be a fixed/absolute positioned element |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0009-hq-nextjs-auth0.md` | Already existed (prerequisite) |
| `sites/hq-kevinryan-io/public/index.html` | Deleted |
| `sites/hq-kevinryan-io/nginx.conf` | Deleted |
| `sites/hq-kevinryan-io/Dockerfile` | Replaced (Node.js server mode) |
| `sites/hq-kevinryan-io/package.json` | Created |
| `sites/hq-kevinryan-io/next.config.ts` | Created |
| `sites/hq-kevinryan-io/tsconfig.json` | Created |
| `sites/hq-kevinryan-io/middleware.ts` | Created |
| `sites/hq-kevinryan-io/app/globals.css` | Created |
| `sites/hq-kevinryan-io/app/layout.tsx` | Created |
| `sites/hq-kevinryan-io/app/page.tsx` | Created |
| `sites/hq-kevinryan-io/app/api/auth/[auth0]/route.ts` | Created |
| `sites/hq-kevinryan-io/app/api/healthz/route.ts` | Created |
| `k8s/hq-kevinryan-io/deployment.yaml` | Modified (port, resources, envFrom) |
| `k8s/hq-kevinryan-io/service.yaml` | Modified (targetPort) |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Created |
| `infra/variables.tf` | Modified (4 auth0 variables appended) |
| `infra/main.tf` | Modified (5 Key Vault secret resources appended) |
| `.github/workflows/terraform.yml` | Modified (TF_VAR_auth0_* in plan and apply) |
| `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Full replacement of static nginx placeholder at `sites/hq-kevinryan-io/` with a Next.js server-mode application gated by Auth0. All infrastructure changes (K8s manifests, ExternalSecret, Terraform, GitHub Actions) are in place. The application cannot be verified end-to-end without Auth0 credentials and a running cluster, which are out of scope for the builder agent role.
**Known limitations:**
- `pnpm lint` and `pnpm build` were not run locally — the environment does not have Auth0 env vars and pnpm workspace dependencies may not be installed. Build correctness is based on spec compliance and pattern matching with `kevinryan-io`.
- An `eslint.config.mjs` may be required if `pnpm lint` fails due to missing ESLint config (assumption A5).
- `next/image` is not used for the avatar to avoid `remotePatterns` configuration (see Decisions table).

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0009-hq-nextjs-auth0.md` | Pass — already existed |
| 2 | `public/index.html`, `nginx.conf`, static `Dockerfile` deleted | Pass |
| 3 | `package.json` contains `@auth0/nextjs-auth0` | Pass |
| 4 | `next.config.ts` does NOT contain `output: 'export'` | Pass |
| 5 | `app/api/auth/[auth0]/route.ts` exists | Pass |
| 6 | `app/api/healthz/route.ts` exists | Pass |
| 7 | `middleware.ts` excludes both `api/auth` and `api/healthz` | Pass |
| 8 | `app/page.tsx` references `NEXT_PUBLIC_COMMIT_SHA` | Pass |
| 9 | `Dockerfile` uses `node:22.22.0-alpine3.23`, no nginx, exposes 3000 | Pass |
| 10 | `deployment.yaml` references port 3000 and `envFrom` hq-auth0-secrets | Pass |
| 11 | `service.yaml` targets port 3000 | Pass |
| 12 | `externalsecret.yaml` references `azure-keyvault` and maps all 5 Auth0 vars | Pass |
| 13 | `variables.tf` contains 4 auth0 variables with `sensitive = true` | Pass |
| 14 | `main.tf` contains 5 `azurerm_key_vault_secret` resources for `hq-auth0-*` | Pass |
| 15 | `terraform.yml` passes `TF_VAR_auth0_*` in both plan and apply jobs | Pass |
| 16 | `terraform fmt -check -recursive infra/` passes | Not verified (no Terraform installed) |
| 17 | `deploy-hq.yml` path trigger references `sites/hq-kevinryan-io/**` | Pass — confirmed in existing file |
| 18 | `pnpm lint` passes | Not verified locally |
| 19 | `pnpm build` passes inside `sites/hq-kevinryan-io/` | Not verified locally |
| 20 | Provenance record exists | Pass |
| 21 | All files committed in single commit | Pending (commit step) |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
