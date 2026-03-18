---
title: "Spec 0009: HQ Next.js Application with Auth0"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- ADR-021 (`docs/adr/adr-021-auth0-authentication-hq.md`)
- `sites/kevinryan-io/` — reference Next.js pattern
- `sites/hq-kevinryan-io/` — existing static site being replaced
- `.github/workflows/deploy.yml` — reference workflow (kevinryan-io)
- `k8s/kevinryan-io/` — reference K8s manifests
- `https://brand.kevinryan.io` — brand guidelines (fonts, colours, design language)

**Produces:**

- Working Next.js application at `hq.kevinryan.io`, gated by Auth0
- A provenance record at `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0009-hq-nextjs-auth0.md` in the repo. This is the canonical reference. Do not modify it after saving.
2. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens.
5. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
6. For every ambiguity, record it under "Ambiguities" with your interpretation and the decision you made.
7. Do not write tests. Testing is not your role.
8. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
9. Commit the spec, implementation, and provenance together.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0009-hq-nextjs-auth0.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document recording findings

---

## Task

1. Save this spec to `.sdd/specification/spec-0009-hq-nextjs-auth0.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md`.

## Prerequisites

- Spec-0008 deployed: `hq.kevinryan.io` is live and resolving.
- Read ADR-021 (`docs/adr/adr-021-auth0-authentication-hq.md`) before starting. This documents the Auth0 decision and records the Auth0 callback URLs that must be registered manually.
- **Manual prerequisite (human, not agent):** The following URLs must be registered in the Auth0 tenant before deployment:
  - Allowed Callback URL: `https://hq.kevinryan.io/api/auth/callback`
  - Allowed Logout URL: `https://hq.kevinryan.io`
  - Allowed Web Origins: `https://hq.kevinryan.io`

## Context

`hq.kevinryan.io` currently serves a static nginx placeholder (spec-0008). This spec replaces it entirely with a Next.js application running in server mode, gated by Auth0/GitHub OAuth.

This is a **full replacement** of `sites/hq-kevinryan-io/`. The existing Dockerfile, nginx.conf, and public directory are deleted and replaced with a Next.js application. The K8s deployment manifest is updated to reflect the new port and increased resource requirements. The GitHub Actions workflow is replaced with one that builds and serves a Node.js process rather than a static nginx container.

The critical architectural difference from all other sites in this monorepo: HQ runs in **Next.js server mode** (`next start`), not as a static export served by nginx. This is required because Auth0's Next.js SDK needs API routes (`/api/auth/*`) which cannot exist in a static export. Server mode also enables the Anthropic API routes required in spec-0010.

The post-login page is a placeholder for the chat interface (spec-0010). It shows: the HQ wordmark, the logged-in user's GitHub username and avatar, the injected commit SHA, and a logout button. Nothing else.

The visual aesthetic is console/operational — dark background, monospaced accents, lime highlight — consistent with the mockup at `brand.kevinryan.io` and the existing placeholder page.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/` | Existing static site — **delete all contents and replace** |
| `sites/kevinryan-io/Dockerfile` | Reference Next.js Dockerfile pattern (stage 1 build, stage 2 serve) — adapt for server mode |
| `sites/kevinryan-io/next.config.ts` | Reference Next.js config — HQ removes `output: 'export'` |
| `sites/kevinryan-io/package.json` | Reference package.json — adapt, add Auth0 SDK |
| `.github/workflows/deploy.yml` | Reference GitHub Actions workflow — copy and adapt |
| `k8s/hq-kevinryan-io/deployment.yaml` | Update image, port, and resource limits |
| `k8s/kevinryan-io/deployment.yaml` | Reference deployment manifest |
| `docs/adr/adr-021-auth0-authentication-hq.md` | Auth0 decision and callback URL reference |

### Key facts

- **Site directory:** `sites/hq-kevinryan-io/`
- **Runtime:** Next.js server mode (`next start`) — NOT static export
- **Container port:** `3000` (Next.js default — different from nginx `8080` used by other sites)
- **Node.js version:** `22.22.0-alpine3.23` (match kevinryan-io)
- **Next.js version:** `16.1.4` (match kevinryan-io)
- **Auth0 SDK:** `@auth0/nextjs-auth0`
- **Hostname:** `hq.kevinryan.io`
- **Image name (ACR):** `kevinryanacr.azurecr.io/hq-kevinryan-io`
- **Image name (GHCR):** `ghcr.io/devopskev/hq-kevinryan-io`
- **SHA env var:** `NEXT_PUBLIC_COMMIT_SHA` (passed as Docker build-arg, same pattern as kevinryan-io)
- **Fonts:** Bebas Neue (display/wordmark), Archivo (body), JetBrains Mono (monospaced accents) — Google Fonts
- **Accent colour:** `#A8E10C`
- **Background:** `#0A0A0A`
- **Text:** `#F5F3EF`
- **Auth0 secrets (runtime env vars, injected via K8s secret):** `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- **Workflow file:** `.github/workflows/deploy-hq.yml` (replace existing)

## 1. Delete existing static site contents

Delete the following files from `sites/hq-kevinryan-io/`:

- `public/index.html`
- `nginx.conf`
- `Dockerfile`

Do not delete the directory itself — it will be repopulated with the Next.js application.

## 2. Next.js application scaffold

Create a Next.js App Router application under `sites/hq-kevinryan-io/` following the structure of `sites/kevinryan-io/` with these differences:

- No `output: 'export'` in `next.config.ts` — server mode only
- No `trailingSlash` — not needed for server mode
- Auth0 SDK installed and configured
- Single protected page at `/`
- Auth0 API routes at `/api/auth/[auth0]/`

### `package.json`

```json
{
  "name": "hq-kevinryan-io",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "eslint"
  },
  "dependencies": {
    "@auth0/nextjs-auth0": "^4",
    "next": "16.1.4",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.4",
    "typescript": "^5"
  }
}
```

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_COMMIT_SHA: process.env.NEXT_PUBLIC_COMMIT_SHA || 'dev',
  },
};

export default nextConfig;
```

## 3. Auth0 configuration

### `app/api/auth/[auth0]/route.ts`

```typescript
import { handleAuth } from '@auth0/nextjs-auth0';
export const GET = handleAuth();
```

### `middleware.ts` (at site root, alongside `app/`)

Protect all routes except the Auth0 callback:

```typescript
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/((?!api/auth).*)'],
};
```

### Environment variables

The following environment variables must be present at runtime. They are **not** build-time variables — they are delivered to the pod via the platform's established secret management pattern: Azure Key Vault (`kv-kevinryan-io`) → External Secrets Operator → Kubernetes Secret named `hq-auth0-secrets`.

| Variable | Key Vault secret name | Description |
|----------|-----------------------|-------------|
| `AUTH0_SECRET` | `hq-auth0-secret` | Long random string — session encryption key |
| `AUTH0_BASE_URL` | `hq-auth0-base-url` | `https://hq.kevinryan.io` |
| `AUTH0_ISSUER_BASE_URL` | `hq-auth0-issuer-base-url` | Auth0 tenant URL e.g. `https://your-tenant.auth0.com` |
| `AUTH0_CLIENT_ID` | `hq-auth0-client-id` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | `hq-auth0-client-secret` | Auth0 application client secret |

The secret values are written to Key Vault manually (see Manual steps). The `ExternalSecret` manifest (section 7) pulls them into a native K8s secret automatically.

## 4. Home page

Create `app/page.tsx` — the post-login landing page. This is a placeholder for the chat interface (spec-0010).

The page must display:

- **HQ wordmark** — `HQ` in Bebas Neue, large, lime accent on the period or as highlight
- **GitHub username** — from the Auth0 session (`user.nickname` or `user.name`)
- **GitHub avatar** — from the Auth0 session (`user.picture`) displayed as a small circle
- **Commit SHA** — `build: {NEXT_PUBLIC_COMMIT_SHA}` in JetBrains Mono, small, lime accent, bottom of page
- **Logout button** — minimal, monospaced, top right corner. Calls `/api/auth/logout`.
- **Chat placeholder** — a centred empty state message in the main content area: `chat interface coming soon` in JetBrains Mono, muted colour. This marks where spec-0010 will place the chat input.

Visual style: dark background `#0A0A0A`, warm white text `#F5F3EF`, lime accent `#A8E10C`, console/operational aesthetic consistent with the existing placeholder page. No navigation, no sidebar, no cards. Minimal.

### `app/layout.tsx`

Standard Next.js root layout. Load Google Fonts: Bebas Neue, Archivo, JetBrains Mono. Dark background. No additional structure.

## 5. Dockerfile

Replace `sites/hq-kevinryan-io/Dockerfile`. This is a server-mode Node.js container, not nginx:

```dockerfile
FROM node:22.22.0-alpine3.23 AS build

ARG COMMIT_SHA=dev
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY sites/hq-kevinryan-io/package.json ./sites/hq-kevinryan-io/

WORKDIR /app/sites/hq-kevinryan-io
RUN pnpm install --frozen-lockfile

WORKDIR /app
COPY sites/hq-kevinryan-io/ ./sites/hq-kevinryan-io/

WORKDIR /app/sites/hq-kevinryan-io
RUN pnpm build

FROM node:22.22.0-alpine3.23

LABEL org.opencontainers.image.source="https://github.com/DevOpsKev/kevin-ryan-platform"

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=build /app/sites/hq-kevinryan-io/.next ./sites/hq-kevinryan-io/.next
COPY --from=build /app/sites/hq-kevinryan-io/public ./sites/hq-kevinryan-io/public
COPY --from=build /app/sites/hq-kevinryan-io/package.json ./sites/hq-kevinryan-io/package.json
COPY --from=build /app/sites/hq-kevinryan-io/node_modules ./sites/hq-kevinryan-io/node_modules
COPY pnpm-workspace.yaml ./

WORKDIR /app/sites/hq-kevinryan-io

EXPOSE 3000

CMD ["pnpm", "start"]
```

**Design notes:**

- No nginx in this Dockerfile — Next.js serves its own HTTP responses
- `NEXT_PUBLIC_COMMIT_SHA` is injected at build time as before
- Auth0 environment variables are NOT in the Dockerfile — they are injected at runtime via K8s secret
- The `/healthz` endpoint does not exist in this container by default — see K8s manifests section

## 6. Health check endpoint

Next.js does not serve `/healthz` natively. Create `app/api/healthz/route.ts`:

```typescript
export async function GET() {
  return new Response('ok', { status: 200 });
}
```

This must NOT be behind auth middleware. Update `middleware.ts` matcher to exclude it:

```typescript
export const config = {
  matcher: ['/((?!api/auth|api/healthz).*)'],
};
```

## 7. Kubernetes manifests

Update `k8s/hq-kevinryan-io/deployment.yaml` and `k8s/hq-kevinryan-io/service.yaml`. Add `k8s/hq-kevinryan-io/externalsecret.yaml`. The namespace, ingress, and Flux sync files do not change.

Update the deployment to:

- Change container port from `8080` to `3000`
- Increase resource limits (Node.js requires more memory than nginx)
- Add `envFrom` to inject the Auth0 secrets from the `hq-auth0-secrets` K8s secret

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hq-kevinryan-io
  namespace: hq-kevinryan-io
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hq-kevinryan-io
  template:
    metadata:
      labels:
        app: hq-kevinryan-io
    spec:
      containers:
        - name: hq-kevinryan-io
          image: kevinryanacr.azurecr.io/hq-kevinryan-io:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: hq-auth0-secrets
          livenessProbe:
            httpGet:
              path: /api/healthz
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/healthz
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 256Mi
```

Update `k8s/hq-kevinryan-io/service.yaml` to target port `3000`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hq-kevinryan-io
  namespace: hq-kevinryan-io
spec:
  selector:
    app: hq-kevinryan-io
  ports:
    - port: 80
      targetPort: 3000
```

### externalsecret.yaml

Create `k8s/hq-kevinryan-io/externalsecret.yaml`. This pulls the Auth0 secrets from Key Vault into a native K8s secret following the same pattern as `k8s/umami/externalsecret.yaml` and `k8s/observability/externalsecret.yaml`:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: hq-auth0-secrets
  namespace: hq-kevinryan-io
spec:
  refreshInterval: 1h
  secretStoreRef:
    kind: ClusterSecretStore
    name: azure-keyvault
  target:
    name: hq-auth0-secrets
    creationPolicy: Owner
  data:
    - secretKey: AUTH0_SECRET
      remoteRef:
        key: hq-auth0-secret
    - secretKey: AUTH0_BASE_URL
      remoteRef:
        key: hq-auth0-base-url
    - secretKey: AUTH0_ISSUER_BASE_URL
      remoteRef:
        key: hq-auth0-issuer-base-url
    - secretKey: AUTH0_CLIENT_ID
      remoteRef:
        key: hq-auth0-client-id
    - secretKey: AUTH0_CLIENT_SECRET
      remoteRef:
        key: hq-auth0-client-secret
```

**Design notes:**

- `refreshInterval: 1h` — ESO syncs Key Vault values into the K8s secret every hour. If secrets are rotated in Key Vault the pod picks them up on the next sync without a restart.
- `creationPolicy: Owner` — ESO owns the lifecycle of the K8s secret. If the ExternalSecret is deleted, the K8s secret is deleted too.
- No template block needed — the Key Vault secret values map directly to environment variable names without transformation.

## 8. Terraform — Auth0 secrets

Add the following to `infra/variables.tf`. Follow the exact pattern of `cloudflare_api_token` — `type = string`, `sensitive = true`:

```hcl
variable "auth0_secret" {
  description = "Auth0 session encryption secret for HQ"
  type        = string
  sensitive   = true
}

variable "auth0_issuer_base_url" {
  description = "Auth0 tenant URL for HQ (e.g. https://your-tenant.auth0.com)"
  type        = string
  sensitive   = true
}

variable "auth0_client_id" {
  description = "Auth0 client ID for HQ"
  type        = string
  sensitive   = true
}

variable "auth0_client_secret" {
  description = "Auth0 client secret for HQ"
  type        = string
  sensitive   = true
}
```

Add the following to `infra/main.tf`, alongside the existing `azurerm_key_vault_secret` resources:

```hcl
resource "azurerm_key_vault_secret" "hq_auth0_secret" {
  name         = "hq-auth0-secret"
  value        = var.auth0_secret
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_base_url" {
  name         = "hq-auth0-base-url"
  value        = "https://hq.kevinryan.io"
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_issuer_base_url" {
  name         = "hq-auth0-issuer-base-url"
  value        = var.auth0_issuer_base_url
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_client_id" {
  name         = "hq-auth0-client-id"
  value        = var.auth0_client_id
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "hq_auth0_client_secret" {
  name         = "hq-auth0-client-secret"
  value        = var.auth0_client_secret
  key_vault_id = module.keyvault.key_vault_id
}
```

Update `.github/workflows/terraform.yml` to pass the new variables in both the `plan` and `apply` jobs, alongside the existing `TF_VAR_cloudflare_api_token` entry:

```yaml
TF_VAR_auth0_secret: ${{ secrets.TF_VAR_AUTH0_SECRET }}
TF_VAR_auth0_issuer_base_url: ${{ secrets.TF_VAR_AUTH0_ISSUER_BASE_URL }}
TF_VAR_auth0_client_id: ${{ secrets.TF_VAR_AUTH0_CLIENT_ID }}
TF_VAR_auth0_client_secret: ${{ secrets.TF_VAR_AUTH0_CLIENT_SECRET }}
```

**Design notes:**

- `hq-auth0-base-url` is hardcoded to `https://hq.kevinryan.io` — it is not a variable because it is determined by the infrastructure, not an external system.
- `AUTH0_SECRET` is a session encryption key generated once. Store it in GitHub secrets and do not rotate it unless there is a security incident — rotation invalidates all active sessions.
- Follow the `cloudflare_api_token` pattern exactly: `sensitive = true` on all variables, `TF_VAR_` prefix on GitHub secret names.

## 9. GitHub Actions workflow

Replace `.github/workflows/deploy-hq.yml`. Follow `deploy.yml` (kevinryan-io) exactly, substituting `kevinryan-io` → `hq-kevinryan-io` throughout. Path trigger: `sites/hq-kevinryan-io/**`.

The workflow does not change — build, push to ACR/GHCR, update manifest, commit. The Dockerfile handles the Node.js build internally.

## 10. pnpm workspace

Add `sites/hq-kevinryan-io` to `pnpm-workspace.yaml` if it is not already present. Check the file before modifying.

## Constraints and Assumptions

- **Constraint:** HQ runs in Next.js server mode. `output: 'export'` must not be present in `next.config.ts`.
- **Constraint:** Auth0 environment variables are runtime secrets, not build-time args. They must never appear in the Dockerfile or GitHub Actions workflow.
- **Constraint:** The Auth0 callback URLs must be registered in the Auth0 tenant before login will work. This is a manual step documented in Prerequisites.
- **Constraint:** Auth0 secret values reach Key Vault via Terraform, following the same pattern as `cloudflare_api_token`. The values are stored as GitHub Actions secrets (`TF_VAR_*`) and written to Key Vault by `infra/main.tf` during `terraform apply`. The agent adds the Terraform resources; the human adds the GitHub secrets.
- **Assumption:** The `ClusterSecretStore` named `azure-keyvault` is already running and healthy in the cluster (established by spec-0003/ADR-018).
- **Assumption:** `pnpm-lock.yaml` at the repo root covers all workspace packages. The agent runs `pnpm install` from the workspace root context in the Dockerfile.
- **Assumption:** Auth0 tenant is already provisioned with a GitHub social connection configured as the identity provider.

## Out of Scope

- Chat interface — that is spec-0010
- Anthropic API integration — that is spec-0010
- GitHub MCP integration — that is spec-0010
- Demo mode toggle — that is spec-0010
- Adding GitHub Actions secrets to the repository — manual step performed by the human before running Terraform
- Registering Auth0 callback URLs — manual step, must be done before deployment

## Manual steps (not performed by the agent)

**Before merging the PR:**

1. Register callback URLs in Auth0 dashboard:
   - Allowed Callback URL: `https://hq.kevinryan.io/api/auth/callback`
   - Allowed Logout URL: `https://hq.kevinryan.io`
   - Allowed Web Origins: `https://hq.kevinryan.io`

**Before merging the PR:**

1. Add the following GitHub Actions secrets to the `DevOpsKev/kevin-ryan-platform` repository (Settings → Secrets and variables → Actions):

| Secret name | Value |
|-------------|-------|
| `TF_VAR_AUTH0_SECRET` | Generate with `openssl rand -hex 32` |
| `TF_VAR_AUTH0_ISSUER_BASE_URL` | `https://<your-tenant>.auth0.com` |
| `TF_VAR_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `TF_VAR_AUTH0_CLIENT_SECRET` | Auth0 application client secret |

Note: `AUTH0_BASE_URL` is always `https://hq.kevinryan.io` — hardcoded in Terraform, not a GitHub secret.

1. Run `terraform apply` to write the secrets to Key Vault — this happens automatically when the PR is merged and `infra/**` changes trigger the Terraform workflow.

**After merging the PR:**

1. Verify ESO has synced the secret: `kubectl get secret hq-auth0-secrets -n hq-kevinryan-io`
1. Confirm the pod is running: `kubectl get pods -n hq-kevinryan-io`
1. Visit `https://hq.kevinryan.io` — should redirect to GitHub OAuth login
1. Complete login — should land on the HQ page showing your GitHub username and avatar
1. Click logout — should return to the login redirect

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

1. This spec has been saved to `.sdd/specification/spec-0009-hq-nextjs-auth0.md`
2. `sites/hq-kevinryan-io/public/index.html`, `nginx.conf` and the static `Dockerfile` no longer exist
3. `sites/hq-kevinryan-io/package.json` exists and contains `@auth0/nextjs-auth0` as a dependency
4. `sites/hq-kevinryan-io/next.config.ts` exists and does NOT contain `output: 'export'`
5. `sites/hq-kevinryan-io/app/api/auth/[auth0]/route.ts` exists
6. `sites/hq-kevinryan-io/app/api/healthz/route.ts` exists
7. `sites/hq-kevinryan-io/middleware.ts` exists and excludes both `api/auth` and `api/healthz` from auth requirement
8. `sites/hq-kevinryan-io/app/page.tsx` exists and references `NEXT_PUBLIC_COMMIT_SHA`
9. `sites/hq-kevinryan-io/Dockerfile` exists, contains `node:22.22.0-alpine3.23`, does NOT contain `nginx`, and exposes port `3000`
10. `k8s/hq-kevinryan-io/deployment.yaml` references port `3000` and `envFrom` referencing `hq-auth0-secrets`
11. `k8s/hq-kevinryan-io/service.yaml` targets port `3000`
12. `k8s/hq-kevinryan-io/externalsecret.yaml` exists, references `ClusterSecretStore` `azure-keyvault`, and maps all five Auth0 variables
13. `infra/variables.tf` contains `auth0_secret`, `auth0_issuer_base_url`, `auth0_client_id`, `auth0_client_secret` variables all with `sensitive = true`
14. `infra/main.tf` contains five `azurerm_key_vault_secret` resources for `hq-auth0-*`
15. `.github/workflows/terraform.yml` passes `TF_VAR_auth0_*` in both plan and apply jobs
16. `terraform fmt -check -recursive infra/` passes
17. `.github/workflows/deploy-hq.yml` path trigger references `sites/hq-kevinryan-io/**`
18. `pnpm lint` passes
19. `pnpm build` passes inside `sites/hq-kevinryan-io/` (without Auth0 env vars — build must succeed without them, only runtime requires them)
20. The provenance record exists at `.sdd/provenance/spec-0009-hq-nextjs-auth0.provenance.md`
21. All files are committed together in a single commit
