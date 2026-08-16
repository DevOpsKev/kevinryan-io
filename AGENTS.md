# Agent Rules

## Project Summary

This is a monorepo hosting multiple sites for Kevin Ryan (DevOps & AI Governance Consultant):

- **kevinryan.io** — static Next.js 16 portfolio site
- **brand.kevinryan.io** — static HTML brand guidelines site (no build step, no Node.js tooling)
- **aiimmigrants.com** — static HTML holding page (no build step, no Node.js tooling)

**Stack:**

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- pnpm
- Static export to GitHub Pages

## Key Constraints

- No server-side runtime dependencies
- No `any` type without justification
- No custom CSS when Tailwind suffices
- All pages must be statically exportable
- Maximum component size: 200 lines
- One component per file

## Build Commands

```bash
# Install all workspace dependencies
pnpm install
# Dev server for kevinryan.io at localhost:3000
pnpm dev:kevinryan-io
# Build all sites
pnpm build
# Build specific site
pnpm --filter kevinryan-io build
# Lint specific site
pnpm --filter kevinryan-io lint
```

## Available Toolchain

The following CLI tools are installed in the local environment and should be used when they improve developer or agent workflow. Prefer them over hand-rolled scripts or manual editing for validation, search, and formatting. Run `toolchain` to see the full declared manifest.

> **Scope:** These tools are available locally; the CI runner (`ubuntu-latest`) only guarantees Node.js 22 and pnpm. Do not introduce a dependency on any tool below inside a build script or GitHub Action without also installing it in CI.

### Build & package management

- **`pnpm`** — workspace installs, per-site builds, lint, type checking. The central command for this repo.

### Search & file inspection

- **`rg`** — fast recursive grep across TS/React, k8s, terraform, and workflows.
- **`fd`** — fast file find for locating components, specs, and manifests.
- **`jq`** — parse `package.json`, `tsconfig*.json`, k8s JSON, and GitHub Actions outputs.
- **`yq`** — read/transform the YAML in `k8s/**`, `.github/workflows/**`, and `docker-compose.yml` before editing by hand.
- **`yamllint`** — lint Kubernetes manifests and workflow files before committing; catches indentation and quoting bugs Flux would reject.

### Kubernetes & GitOps

- **`kubectl`** — validate manifests with `kubectl apply --dry-run=client -f k8s/<site>/`.
- **`flux`** — `flux build kustomization ./k8s/<site>` and `flux check`; required when onboarding a new site per the "Adding a new site" steps below.
- **`kubectx`** — switch clusters/contexts when verifying live deployments.

### Infrastructure (infra/)

- **`terraform`** — run `terraform fmt`, `terraform validate`, and (with appropriate creds) `terraform plan` for `infra/` changes.
- **`tflint`** — lint Terraform alongside `terraform validate`.

### Containers

- **`docker`** + **`docker compose`** — build and test site images locally (`sites/<site>/Dockerfile`, `docker-compose.yml`).
- **`colima`** — macOS Docker runtime; start it if Docker is not already running.

### Platform & CI

- **`gh`** — inspect workflow runs (`gh run list` / `gh run view`), manage PRs and branches for the builder-agent flow.
- **`git`** — core version control (agents normally use pi's wrappers).

### Code review

- **`delta`** — syntax-highlighted diff pager for reviewing changesets.
- **`hunk`** — review-first diff viewer for AI-authored changesets.

### Not needed here

`glab`, `az`, `cloudflared`, `wrangler`, `cloudflare-speed-cli`, `op`, `cmake`, and the interactive TUIs (`starship`, `htop`, `btop`, `bandwhich`, `dust`, `atuin`, `herdr`, `fzf`, `zoxide`, `eza`, `bat`, `glow`, `tree`, `lazygit`, `lazydocker`, `nvim`, `ghostty`, `MesloLGS NF`) are not relevant to agent workflow on this repo.

## Local credentials (`.env.agents` — single source of truth for secrets)

The repo is **public**, so secrets must never be committed. `.env.agents` (gitignored — confirmed via `git check-ignore .env.agents`) is the **single source of truth for every secret** in the project. `.gitignore` blocks every real-values env filename (`.env*` and `*.env`) and only allows the committed `.env.agents.example` template (placeholders) plus the ADR-012 `.env.tpl` (1Password `op://` references, not values).

The split between the two Terraform inputs is rule-based, driven by Terraform's own `sensitive = true` flag in `infra/variables.tf`:

- **`infra/terraform.tfvars`** (gitignored) holds **non-secret config only**: `location`, `vm_size`, `admin_username`, `acr_name`, `keyvault_name`, `github_repo_owner`, `github_repo_name`, `admin_ssh_public_key` (a public key), and the four `cloudflare_zone_id*` (public identifiers). The committed template is `infra/terraform.tfvars.example`.
- **`.env.agents`** holds **every secret**. Terraform consumes the secret variables via the `TF_VAR_<name>` convention (Terraform reads `TF_VAR_<name>` from the environment natively — no `tfvars` entry needed for them). CLI tools consume their own conventional env vars (`ARM_*`, `AZURE_*`, `CLOUDFLARE_API_TOKEN`, `KUBECONFIG`, …).

This eliminates the prior duplication where secrets were declared in both `terraform.tfvars` and `.env.agents`. Each secret now lives exactly once.

To populate `.env.agents`:

```bash
# One-time: copy the committed template and fill in real values
cp .env.agents.example .env.agents
# (edit .env.agents with real values; the file is gitignored)
```

Then load it before running any tool or Terraform:

```bash
# Load credentials into the current shell (set -a exports every var)
set -a
source .env.agents
set +a

# Authenticate the az CLI with the service principal (one-time per session)
az login --service-principal \
  --username "$ARM_CLIENT_ID" \
  --password  "$ARM_CLIENT_SECRET" \
  --tenant    "$ARM_TENANT_ID"

# Terraform reads TF_VAR_* secrets directly from the environment
# (terraform.tfvars supplies the non-secret config)
cd infra
terraform plan
```

Entries in `.env.agents`:

- **Azure service principal** (assumes the machine is not already authenticated via `az login`): `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_TENANT_ID`, `ARM_SUBSCRIPTION_ID` (and matching `AZURE_*` aliases). Used by `terraform`, `tflint`, `az`, and `docker`→`az acr login`.
- **Azure Container Registry**: `ACR_NAME`, `ACR_LOGIN_SERVER` — for `docker build`/`push` to ACR.
- **Kubernetes**: `KUBECONFIG` points at `~/.kube/kr-k3s.yaml` (k3s cluster on Azure, `rg-kevinryan-io`). The kubeconfig's server is `127.0.0.1:6443`, so start an SSH tunnel once per session before using `kubectl`/`flux`/`k9s`/`kubectx`:

  ```bash
  ssh -fN -L 6443:127.0.0.1:6443 kr-node1
  ```

  (`kr-node1` is the k3s server VM, defined in `~/.ssh/config`.)
- **Tool credentials (non-`TF_VAR`)**: `CLOUDFLARE_API_TOKEN` (terraform Cloudflare provider + `wrangler`), `CLOUDFLARE_ACCOUNT_ID` (for `wrangler whoami` / account-scoped API), `FLUX_GITHUB_TOKEN`.
- **Terraform secrets** (`TF_VAR_<name>` for every `sensitive = true` variable in `infra/variables.tf`):
  - `TF_VAR_cloudflare_api_token`, `TF_VAR_github_token`
  - Auth0 (HQ app): `TF_VAR_auth0_secret`, `TF_VAR_auth0_client_id`, `TF_VAR_auth0_client_secret`, `TF_VAR_auth0_domain`, `TF_VAR_auth0_issuer_base_url`
  - HQ integrations: `TF_VAR_anthropic_api_key`, `TF_VAR_github_mcp_token`, `TF_VAR_linear_api_key`

> **Deviation from ADR-012:** ADR-012 mandates 1Password CLI (`op run --env-file=.env.tpl -- <cmd>`) with secret *references* and no values on disk. A local `.env.agents` with real values is a convenience deviation for agent workflow. It is acceptable here **only** because `.gitignore` guarantees the file is never committed to this public repo. If you'd prefer the ADR-012 flow, use the committed `.env.tpl` (op:// URIs) and run `op run --env-file=.env.tpl -- <cmd>` instead of sourcing `.env.agents`.

## Directory Structure

```text
kevin-ryan-platform/
├── .github/workflows/      # CI/CD (shared)
├── infra/                  # Terraform (shared across all sites)
├── k8s/                    # Kubernetes manifests
│   ├── flux-system/        # Flux CD entry point (peer to site dirs)
│   │   ├── gotk-components.yaml
│   │   ├── gotk-sync.yaml
│   │   ├── kustomization.yaml
│   │   ├── kevinryan-io-sync.yaml
│   │   ├── brand-kevinryan-io-sync.yaml
│   │   └── aiimmigrants-com-sync.yaml
│   ├── kevinryan-io/       # Plain manifests only (no flux-system)
│   ├── brand-kevinryan-io/ # Plain manifests only
│   └── aiimmigrants-com/   # Plain manifests only
├── sites/                  # Individual site packages
│   ├── kevinryan-io/       # kevinryan.io Next.js app
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components (one per file)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Shared utilities
│   │   ├── public/         # Static assets
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── brand-kevinryan-io/ # brand.kevinryan.io — static HTML, no build step
│   │   ├── public/         # Static assets (index.html, SVGs, PNGs, PDFs)
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── docker-compose.yml
│   └── aiimmigrants-com/   # aiimmigrants.com — static HTML, no build step
│       ├── public/         # Static assets (index.html)
│       ├── Dockerfile
│       ├── nginx.conf
│       └── docker-compose.yml
└── pnpm-workspace.yaml
```

### Adding a new site

To onboard a new site into Flux CD:

1. Add plain Kubernetes manifests under `k8s/<site-name>/`.
2. Create `k8s/flux-system/<site-name>-sync.yaml` — a `Kustomization` CR pointing `spec.path` at `./k8s/<site-name>`.
3. Add `<site-name>-sync.yaml` to the `resources` list in `k8s/flux-system/kustomization.yaml`.

> **Note:** `brand-kevinryan-io` and `aiimmigrants-com` are pure static HTML sites with no build step.
> TypeScript, Next.js, Tailwind, ESLint, and related conventions do **not** apply to them.
> The root `build` and `lint` scripts use `--if-present` to skip these packages automatically.

## When Generating Code

1. Follow TypeScript strict mode conventions
2. Use Tailwind utilities for styling
3. Ensure static export compatibility
4. Include alt attributes on all images
5. Keep components under 200 lines

## Documentation Conventions

- In Markdown code blocks, never put `#` comments on the same line as a command. Place comments on their own line above the command.
- Rationale: yanking a line in AstroVim should grab only the command, not the trailing comment.

Example (correct):

```bash
# Build specific site
pnpm --filter kevinryan-io build
```

Example (prohibited):

```bash
pnpm --filter kevinryan-io build   # Build specific site
```

## Prohibited Patterns

- `any` type without inline justification comment
- `eslint-disable` without inline justification comment
- Custom CSS when Tailwind can achieve the same result
- Server components with runtime data fetching
- API routes, middleware, or server actions
- Inline styles (`style={{ }}`)
- Index as React key

## When Unclear

If a request conflicts with project constraints or specifications, flag the conflict rather than silently deviating. Ask for clarification.

## Pre-Commit Checklist

> **Note:** Husky + lint-staged enforces most of these checks automatically at commit time
> (ESLint, TypeScript type checking, markdownlint). The pre-push hook runs `pnpm build`.
> This checklist remains as a manual reference for anything the hooks don't catch.

Before suggesting code is complete:

- [ ] `pnpm build` would pass
- [ ] `pnpm lint` would pass
- [ ] No TypeScript errors
- [ ] All images have alt text
- [ ] No new dependencies without justification
- [ ] Components under 200 lines

## CI/CD Context — Claude Code Builder

When running as a GitHub Actions Builder Agent (via `claude-code-builder.yml`):

### Environment

- Runner: `ubuntu-latest` with Node.js 22 and pnpm
- Working directory: repository root
- Full git access: can commit and push to the PR branch

### Build Verification Checklist

After implementing changes, ALWAYS run these in order:

1. `pnpm install` — if any `package.json` was modified
2. `pnpm lint` — fix all lint errors before proceeding
3. `pnpm build` — fix all build errors before proceeding
4. Verify no untracked files that should be committed (especially lockfiles)

### Spec-Driven Development Protocol

When implementing a spec:

1. Read the spec file completely before making any changes
2. Read ALL files listed in the spec's "Current state" table
3. Implement changes section by section, in order
4. Create the provenance record using the template at `.sdd/provenance/template.md`
5. Commit spec, implementation, and provenance together

### Commit Conventions

- Imperative mood, present tense: "Add feature" not "Added feature"
- Reference the spec in the commit message: `[spec-0013] Add Claude Code builder workflow`
- One logical change per commit where practical

### Restrictions

- Never modify a spec file after the initial save
- Never skip the build verification checklist
- Never add dependencies without justification recorded in provenance
- If the spec is ambiguous, record the ambiguity in provenance and make a reasonable choice
