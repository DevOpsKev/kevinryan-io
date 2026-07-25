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
- Tailwind CSS 4 + DaisyUI
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
pnpm install              # Install all workspace dependencies
pnpm dev:kevinryan-io     # Dev server for kevinryan.io at localhost:3000
pnpm build                # Build all sites
pnpm --filter kevinryan-io build   # Build specific site
pnpm --filter kevinryan-io lint    # Lint specific site
```

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

- Never commit directly to `main`
- Never modify a spec file after the initial save
- Never skip the build verification checklist
- Never add dependencies without justification recorded in provenance
- If the spec is ambiguous, record the ambiguity in provenance and make a reasonable choice
