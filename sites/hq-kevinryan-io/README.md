# hq.kevinryan.io — LibreChat (vanilla)

This site is **not a source package**. It deploys the upstream, pre-built
LibreChat image directly — there is no build step, no Next.js source, and no
Dockerfile. The repo only holds configuration reference files here and the
Kubernetes manifests under `k8s/hq-kevinryan-io/`.

## What lives here

| File | Purpose |
|---|---|
| `librechat.env.example` | Template of the LibreChat env vars for the vanilla subset (copy to `.env` for local dev). |
| `docker-compose.yml` | Local `docker compose up` reference (api + mongodb only). |
| `README.md` | This file. |

## What lives in `k8s/hq-kevinryan-io/`

- `deployment.yaml` — LibreChat api Deployment (image
  `registry.librechat.ai/danny-avila/librechat:latest`, pulled direct).
- `mongodb-statefulset.yaml` + `mongodb-service.yaml` — internal MongoDB
  (unauthenticated for the vanilla install).
- `configmap.yaml` — non-secret env (`DOMAIN_*`, `MONGO_URI`, `SEARCH=false`,
  `ALLOW_*`).
- `externalsecret.yaml` — `librechat-secrets` Secret materialized from Azure
  Key Vault (`JWT_SECRET`, `CREDS_KEY`, `CREDS_IV`, `ANTHROPIC_API_KEY`).
- `pvc-*.yaml` — three RWO PVCs for `/app/data`, `/app/uploads`,
  `/app/client/public/images`.
- `service.yaml`, `ingress.yaml`, `namespace.yaml`, `kustomization.yaml`.

## Why no Dockerfile / CI build?

LibreChat ships a published image on `registry.librechat.ai`. The shared
`.github/workflows/deploy.yml` `detect` job only builds sites that have both a
`Dockerfile` and a `k8s/<site>/deployment.yaml`; because this site has no
Dockerfile, it is automatically skipped. Manifest changes deploy via Flux on
push to `main`.

## Local development

```bash
# Copy the env template and fill in the secrets:
cp librechat.env.example .env
#   JWT_SECRET    = openssl rand -hex 32
#   CREDS_KEY     = openssl rand -hex 32   # must be 32 bytes
#   CREDS_IV      = openssl rand -hex 16   # 16 bytes
#   ANTHROPIC_API_KEY = <your key>

docker compose up
```

Open <http://localhost:3080>.

## First-run secrets (cluster)

Before the first rollout, create these three Azure Key Vault secrets (random
values, not provider-managed):

```bash
az keyvault secret set --vault-name <vault> --name librechat-jwt-secret --value "$(openssl rand -hex 32)"
az keyvault secret set --vault-name <vault> --name librechat-creds-key    --value "$(openssl rand -hex 32)"
az keyvault secret set --vault-name <vault> --name librechat-creds-iv    --value "$(openssl rand -hex 16)"
```

`ANTHROPIC_API_KEY` is reused from the existing `anthropic-api-key` Key Vault
secret.

## Out of scope for the vanilla install

Meilisearch search, RAG API, admin panel, social/OIDC/SAML login, custom
branding, `librechat.yaml` presets, MCP/agents, ACR image mirroring, MongoDB
authentication, and Auth0-as-OIDC-IdP wiring are deferred to later
customization passes.
