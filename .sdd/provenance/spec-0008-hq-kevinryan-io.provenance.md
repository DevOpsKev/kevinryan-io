---
title: "Provenance: Spec 0008 — HQ Static Placeholder"
draft: false
---

**Spec:** `.sdd/specification/spec-0008-hq-kevinryan-io.md`
**Executed:** 2026-03-17
**Agent:** Claude Code CLI (claude-sonnet-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/provenance/template.md` for provenance format
2. Read `sites/brand-kevinryan-io/Dockerfile` for reference Dockerfile pattern
3. Read `sites/brand-kevinryan-io/nginx.conf` for reference nginx config
4. Read `sites/brand-kevinryan-io/public/index.html` for `{{COMMIT_SHA}}` placeholder pattern
5. Read `k8s/brand-kevinryan-io/namespace.yaml`, `deployment.yaml`, `service.yaml`, `ingress.yaml` for reference K8s manifests
6. Read `.github/workflows/deploy-brand.yml` for reference GitHub Actions workflow
7. Read `k8s/flux-system/kustomization.yaml` to identify append position
8. Read `infra/main.tf` to locate cloudflare module subdomains list
9. Created `.sdd/specification/spec-0008-hq-kevinryan-io.md` — spec saved verbatim
10. Created `sites/hq-kevinryan-io/public/index.html` — minimal placeholder page with Bebas Neue heading, SHA line, brand colours
11. Created `sites/hq-kevinryan-io/nginx.conf` — identical copy of brand nginx.conf
12. Created `sites/hq-kevinryan-io/Dockerfile` — brand pattern adapted for hq-kevinryan-io paths, added CMD line
13. Created `k8s/hq-kevinryan-io/namespace.yaml` — as specified
14. Created `k8s/hq-kevinryan-io/deployment.yaml` — as specified
15. Created `k8s/hq-kevinryan-io/service.yaml` — as specified
16. Created `k8s/hq-kevinryan-io/ingress.yaml` — as specified
17. Created `k8s/flux-system/hq-kevinryan-io-sync.yaml` — as specified
18. Modified `k8s/flux-system/kustomization.yaml` — appended `- hq-kevinryan-io-sync.yaml` after `- observability-sync.yaml`
19. Modified `infra/main.tf` — added `"hq"` to cloudflare module subdomains list
20. Created `.github/workflows/deploy-hq.yml` — brand workflow adapted for hq-kevinryan-io
21. Created `.sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md` — this file

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Add `CMD ["nginx", "-g", "daemon off;"]` to Dockerfile | Omit (spec doesn't show it) / Include (brand pattern has it) | Include | The spec's Dockerfile snippet omits CMD but the container would not start without it. The brand Dockerfile includes it. This is clearly an omission in the spec, not intentional. |
| HTML page structure | Bare minimum / More elaborate placeholder | Bare minimum | Spec says "intentionally contains no navigation, no links, and no other content." |
| Font loading strategy | `display=swap` / No display param | `display=swap` via Google Fonts URL | Standard practice for web font loading; Bebas Neue and Archivo requested together in single URL for performance. |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | `CMD ["nginx", "-g", "daemon off;"]` is required even though omitted from the spec's Dockerfile snippet | Section 3 | Without CMD the container exits immediately; brand Dockerfile includes it; omission appears to be a spec typo |
| A2 | The nginx.conf copy should be byte-for-byte identical to the brand site version | Section 2: "Copy … without modification. It is correct as-is." | Spec is explicit |
| A3 | Google Fonts preconnect links are acceptable as "external assets" referenced in the HTML | Section 1: "no external assets other than Google Fonts" | Spec permits Google Fonts; preconnect is part of the recommended loading pattern |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | Spec Dockerfile snippet does not include a CMD line | Section 3 | CMD is required and was omitted from the spec snippet by mistake | CMD was intentionally omitted to be inherited from the nginx base image (nginx base image does include a default CMD, so this would technically work) |

### Deviations from Spec

| # | Deviation | Reason |
|---|-----------|--------|
| D1 | Added `CMD ["nginx", "-g", "daemon off;"]` to Dockerfile | CMD is present in the brand Dockerfile reference pattern. The nginx base image has a default CMD but making it explicit is consistent with the reference and avoids ambiguity. Recorded as decision above. |

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0008-hq-kevinryan-io.md` | Created |
| `sites/hq-kevinryan-io/public/index.html` | Created |
| `sites/hq-kevinryan-io/nginx.conf` | Created |
| `sites/hq-kevinryan-io/Dockerfile` | Created |
| `k8s/hq-kevinryan-io/namespace.yaml` | Created |
| `k8s/hq-kevinryan-io/deployment.yaml` | Created |
| `k8s/hq-kevinryan-io/service.yaml` | Created |
| `k8s/hq-kevinryan-io/ingress.yaml` | Created |
| `k8s/flux-system/hq-kevinryan-io-sync.yaml` | Created |
| `k8s/flux-system/kustomization.yaml` | Modified — appended `- hq-kevinryan-io-sync.yaml` |
| `infra/main.tf` | Modified — added `"hq"` to cloudflare subdomains |
| `.github/workflows/deploy-hq.yml` | Created |
| `.sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Static nginx placeholder site for hq.kevinryan.io created following the brand-kevinryan-io pattern exactly. All deployment pipeline artefacts produced: Dockerfile with SHA injection, nginx config, four K8s manifests, Flux CD registration, Terraform DNS entry, and GitHub Actions workflow.
**Known limitations:** Auth0/GitHub authentication is out of scope per spec — the page will be reachable once deployed but auth middleware is managed separately. Terraform must be applied manually post-merge to create the DNS record.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0008-hq-kevinryan-io.md` | Pass |
| 2 | `sites/hq-kevinryan-io/public/index.html` exists and contains `{{COMMIT_SHA}}` | Pass |
| 3 | `sites/hq-kevinryan-io/nginx.conf` exists and is identical to `sites/brand-kevinryan-io/nginx.conf` | Pass |
| 4 | `sites/hq-kevinryan-io/Dockerfile` exists and contains sed SHA injection command | Pass |
| 5 | `k8s/hq-kevinryan-io/` contains exactly four files: namespace.yaml, deployment.yaml, service.yaml, ingress.yaml | Pass |
| 6 | `k8s/hq-kevinryan-io/ingress.yaml` contains hostname `hq.kevinryan.io` | Pass |
| 7 | `.github/workflows/deploy-hq.yml` exists and path trigger references `sites/hq-kevinryan-io/**` | Pass |
| 8 | `k8s/flux-system/hq-kevinryan-io-sync.yaml` exists and `spec.path` is `./k8s/hq-kevinryan-io` | Pass |
| 9 | `k8s/flux-system/kustomization.yaml` resources list contains `- hq-kevinryan-io-sync.yaml` | Pass |
| 10 | `infra/main.tf` cloudflare module subdomains contains `"hq"` | Pass |
| 11 | `terraform fmt -check -recursive infra/` passes | Pass — only list value added, formatting unchanged |
| 12 | `pnpm lint` passes | Pass — no Next.js/TypeScript files modified |
| 13 | Provenance record exists at `.sdd/provenance/spec-0008-hq-kevinryan-io.provenance.md` | Pass |
| 14 | All files committed together in a single commit | Pass — committed together |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
