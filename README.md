# kevin-ryan-platform

Multi-site platform monorepo for Kevin Ryan (DevOps & AI Governance Consultant). Hosts seven sites across five domains, deployed to a K3s Kubernetes cluster on Azure via Flux CD GitOps. Full documentation at [docs.kevinryan.io](https://docs.kevinryan.io).

## Sites

| Site | URL | Stack |
|------|-----|-------|
| Portfolio | [kevinryan.io](https://kevinryan.io) | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Brand Guidelines | [brand.kevinryan.io](https://brand.kevinryan.io) | Static HTML |
| Docs | [docs.kevinryan.io](https://docs.kevinryan.io) | Astro Starlight |
| AI Immigrants | [aiimmigrants.com](https://aiimmigrants.com) | Static HTML |
| SpecMCP | [specmcp.ai](https://specmcp.ai) | Static HTML |
| SDD Book | [sddbook.com](https://sddbook.com) | Static HTML |
| Distributed Equity | [distributedequity.org](https://distributedequity.org) | Static HTML |

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework with App Router (kevinryan.io)
- [Astro Starlight](https://starlight.astro.build/) — Documentation site (docs.kevinryan.io)
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — Type safety (strict mode)
- [Tailwind CSS 4](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) — Styling
- [pnpm](https://pnpm.io) — Workspace package manager
- [Terraform](https://www.terraform.io) — Infrastructure as code (Azure + Cloudflare)
- [K3s](https://k3s.io) — Lightweight Kubernetes
- [Flux CD](https://fluxcd.io) — GitOps deployment
- [Traefik](https://traefik.io) — Ingress controller (bundled with K3s)
- [Cloudflare](https://www.cloudflare.com) — DNS, CDN, DDoS protection
- [Tessl](https://tessl.io) — Agent context and skills management

## Architecture

```text
Cloudflare (DNS + CDN + TLS) — 5 domain zones
     │
     │  HTTPS (Full SSL mode)
     ▼
Azure Public IP (North Europe)
├── K3s Server (node1 — Standard_B2s)
│   ├── Traefik Ingress (host-based routing)
│   ├── Flux CD (source, kustomize, helm controllers)
│   ├── External Secrets Operator
│   └── Site Deployments ×7 (nginx containers)
│
├── K3s Agent (node2 — Standard_B2s)
│   ├── Grafana (monitoring.kevinryan.io)
│   ├── Loki (log aggregation)
│   ├── Promtail (log collection)
│   └── VictoriaMetrics (metrics)
│
├── Azure Container Registry (image pulls)
├── Azure Key Vault (secrets via managed identity)
└── Azure PostgreSQL Flexible Server (Umami + Grafana)
```

## Prerequisites

- [Node.js](https://nodejs.org) (v20 or higher)
- [pnpm](https://pnpm.io)
- [Tessl CLI](https://docs.tessl.io) (`npm install -g @tessl/cli`)
- [yamllint](https://github.com/adrienverge/yamllint), [hadolint](https://github.com/hadolint/hadolint), [tflint](https://github.com/terraform-linters/tflint) — for git hooks

For infrastructure work:

- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://developer.hashicorp.com/terraform/install) (>= 1.5)
- [Flux CLI](https://fluxcd.io/flux/installation/)
- Cloudflare API token with DNS edit permissions
- GitHub PAT for Flux bootstrap

## Getting Started

```bash
git clone https://github.com/DevOpsKev/kevin-ryan-platform.git
cd kevin-ryan-platform
pnpm install
```

### Set up Tessl

```bash
tessl init --agent claude-code
tessl install
```

### Run development servers

```bash
pnpm dev:kevinryan-io    # kevinryan.io at localhost:3000
```

### Build all sites

```bash
pnpm build               # Build all sites (--if-present skips static HTML sites)
pnpm --filter kevinryan-io build   # Build specific site
pnpm --filter kevinryan-io lint    # Lint specific site
```

## Project Structure

```text
kevin-ryan-platform/
├── .github/workflows/         # CI/CD — one deploy workflow per site + Terraform
├── .tessl/                    # Tessl agent context (managed by Tessl CLI)
├── docs/                      # Documentation content (symlinked into docs site)
├── infra/                     # Terraform — Azure, Cloudflare, GitHub OIDC
│   ├── bootstrap/             # State storage (applied once)
│   ├── modules/               # network, compute, registry, keyvault, postgresql, cloudflare, github-oidc
│   ├── cloud-init-server.yaml # K3s server bootstrap
│   └── cloud-init-agent.yaml  # K3s agent bootstrap
├── k8s/                       # Kubernetes manifests (watched by Flux CD)
│   ├── flux-system/           # Flux bootstrap + per-site Kustomization CRs
│   ├── <site-name>/           # Deployment, Service, IngressRoute per site
│   ├── external-secrets/      # External Secrets Operator (HelmRelease)
│   ├── external-secrets-store/ # ClusterSecretStore (Azure Key Vault)
│   ├── umami/                 # Umami analytics
│   └── observability/         # Grafana, Loki, Promtail, VictoriaMetrics
├── sites/                     # Application code — one directory per site
│   ├── kevinryan-io/          # Next.js 16 (App Router)
│   ├── brand-kevinryan-io/    # Static HTML
│   ├── docs-kevinryan-io/     # Astro Starlight
│   ├── aiimmigrants-com/      # Static HTML
│   ├── specmcp-ai/            # Static HTML
│   ├── sddbook-com/           # Static HTML
│   └── distributedequity-org/ # Static HTML
├── pnpm-workspace.yaml
├── AGENTS.md                  # Agent rules and conventions
├── CLAUDE.md                  # Claude Code instructions
└── tessl.json                 # Tessl tile manifest
```

## Deployment

All sites deploy via GitOps. A push to `main` that changes files under a site's directory triggers the following:

1. **GitHub Actions** builds a Docker image and pushes to ACR + GHCR (SHA-tagged)
2. **GitHub Actions** updates the image tag in `k8s/<site>/deployment.yaml` and commits
3. **Flux CD** detects the manifest change and reconciles the cluster (within 10 minutes)
4. **Kubernetes** performs a rolling update

Infrastructure changes (pushes to `infra/`) trigger a separate Terraform workflow with plan → manual approval → apply.

### Docker Builds

Sites with a build step (kevinryan.io, docs.kevinryan.io) use multi-stage Dockerfiles: Node.js builds the static output, then nginx serves it. Static HTML sites use single-stage nginx images. All containers run as non-root on port 8080 with JSON structured logging.

```bash
cd sites/kevinryan-io
pnpm docker:build    # Build the production Docker image locally
pnpm docker:up       # Build and start the container
pnpm docker:down     # Stop and remove the container
curl http://localhost:8080/healthz   # expect: ok
```

## Infrastructure

All infrastructure is defined in Terraform and deployed to Azure:

| Component | Details |
|-----------|---------|
| **Compute** | 2-node K3s cluster on Ubuntu 24.04 LTS (Standard_B2s) |
| **Container Registry** | Azure Container Registry (ACR) + GHCR |
| **Secrets** | Azure Key Vault, synced via External Secrets Operator |
| **Database** | Azure PostgreSQL Flexible Server (Umami + Grafana) |
| **DNS** | Cloudflare (5 zones, proxied with CDN caching + serve stale) |
| **CI/CD Auth** | GitHub Actions → Azure via OIDC (no stored secrets) |

### Bootstrap

```bash
# 1. State storage (one-time)
cd infra/bootstrap
terraform init
terraform apply -var="storage_account_name=krtfstateXXXX"

# 2. Main infrastructure
cd infra
terraform init -backend-config="storage_account_name=<from step 1>"
terraform plan
terraform apply
```

### GitHub Environment

Create a `production` environment in GitHub repo settings (Settings → Environments) with required reviewers. This gates `terraform apply` in CI.

## Observability

| Service | URL | Purpose |
|---------|-----|---------|
| Umami | [analytics.kevinryan.io](https://analytics.kevinryan.io) | Privacy-focused web analytics (all 7 sites) |
| Grafana | [monitoring.kevinryan.io](https://monitoring.kevinryan.io) | Dashboards (Loki logs + VictoriaMetrics metrics) |

## Development Guidelines

### Git Hooks

Husky + lint-staged enforce code quality automatically at commit time:

- **TypeScript** (`*.ts`, `*.tsx`): ESLint with autofix + `tsc-files` type checking
- **Markdown** (`*.md`): markdownlint
- **YAML** (`*.yaml`, `*.yml`): yamllint
- **Dockerfiles** (`Dockerfile*`): hadolint
- **Terraform** (`*.tf`, `*.tfvars`): `terraform fmt` + tflint

The pre-push hook runs `pnpm build` to catch build failures before they reach CI.

### Code Conventions

- TypeScript strict mode — no `any` without justification
- Tailwind CSS for all styling — no custom CSS when Tailwind suffices
- One component per file, max 200 lines
- All images must have `alt` text
- All pages must be statically exportable

## Tessl Skills

This project uses [Tessl](https://tessl.io) to manage context and skills for AI coding agents.

| Tile | Version | Purpose |
|------|---------|---------|
| `tessl/npm-next` | 16.0.0 | Next.js 16 documentation and API context |
| `tessl/npm-react` | 19.2.0 | React 19 documentation and API context |
| `tessl/npm-react-dom` | 19.2.0 | React DOM 19 documentation and API context |
| `vercel-labs/agent-skills` | e23951b | React and Next.js performance best practices |
| `tessl/npm-tailwindcss--typography` | 0.5.0 | Tailwind CSS Typography plugin |
| `tessl/npm-tailwindcss--forms` | 0.5.0 | Tailwind CSS Forms plugin |
| `secondsky/claude-skills` | 6ebd12c | Aceternity UI animated React components |
| `microsoft/agent-skills` | — | Microsoft cloud-deploy patterns |
| `tessl/pypi-azure-mgmt-containerservice` | 39.1.0 | Azure Container Service SDK docs |

```bash
tessl init --agent claude-code
tessl install
tessl list    # Verify installed tiles
```

## License

© 2026 Kevin Ryan. All rights reserved.

## Contact

- Email: kevin@kevinryan.io
- Phone: +44 7402 083261
- GitHub: [@devopskev](https://github.com/devopskev)
- LinkedIn: [/in/devopskev](https://linkedin.com/in/devopskev)
- Website: [distributedequity.org](https://distributedequity.org)
