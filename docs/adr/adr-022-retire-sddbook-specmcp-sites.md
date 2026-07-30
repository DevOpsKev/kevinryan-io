---
title: "ADR-022: Retire sddbook.com and specmcp.ai Sites"
draft: false
---

**Status:** Accepted
**Date:** 2026-07-29
**Decision Makers:** Human
**Prompted By:** The `sddbook.com` and `specmcp.ai` static landing pages are no longer being maintained as live properties. They must be removed from the monorepo, the production K3s cluster, CI, Terraform-managed DNS, and the kevinryan.io portfolio. The teardown must be performed by Flux CD itself — no manual `kubectl delete` — so the cluster remains a pure GitOps system whose state is defined solely by `main`.

## Context

Two static HTML sites shipped from this repo:

- **`specmcp-ai`** — `specmcp.ai`, a single-page static site promoting "the coordination layer for multi-agent development". No build step. Deployed as an nginx container in the `specmcp-ai` namespace.
- **`sddbook-com`** — `sddbook.com`, a single-page static site promoting "Spec Driven Development". No build step. Deployed as an nginx container in the `sddbook-com` namespace.

Both were onboarded like every other site: a `sites/<name>/` package, a `k8s/<name>/` directory of plain manifests (namespace, deployment, service, ingress), a Flux `Kustomization` sync object in `k8s/flux-system/<name>-sync.yaml` wired into `kustomization.yaml`, a Cloudflare zone provisioned by a Terraform `module "cloudflare_<name>"`, and a row in the kevinryan.io portfolio promoting the product.

The sites are being retired. The requirement is a **complete, GitOps-clean removal**: nothing in the cluster, the repo, CI, DNS, or docs may still reference them, and the live cluster resources must be deleted by Flux rather than by hand.

## Decision Drivers

- **GitOps purity.** Flux's `prune: true` is the only mechanism that should delete cluster resources. Manual `kubectl delete` would diverge cluster state from Git and defeat the purpose of the GitOps model established in ADR-009.
- **No orphaned resources.** Deleting a Flux `Kustomization` and its source manifests in a single commit orphans the live resources — Flux simply stops tracking them; it does not delete them. The workloads, services, ingresses, and namespaces keep running indefinitely.
- **Complete removal.** Leaving stale references in CI, Terraform, docs, or the portfolio creates noise and future confusion. The removal must be consistent across every layer.
- **Irreversibility of DNS destroy.** Terraform manages the Cloudflare DNS records for both domains. Removing the modules means the next `terraform apply` (via CI) destroys those records. This is intentional and must be documented so it is not mistaken for drift.

## Options Considered

### Option A: Two-phase commit (workloads first, then namespaces + sync objects)

Commit 1 deletes only the workload manifests (`deployment.yaml`, `service.yaml`,
`ingress.yaml`) from `k8s/<name>/`, keeping `namespace.yaml`, the Flux
`Kustomization` sync objects, and the `kustomization.yaml` resource entries.
Because the `Kustomization` objects still exist with `prune: true`, Flux
reconciles and **prunes** the live `Deployment`, `Service`, and `IngressRoute`
for each site. After confirming the cluster is clean, Commit 2 deletes the
remaining `namespace.yaml`, the `<name>-sync.yaml` files, the kustomization
entries, the site source packages, CI references, Terraform modules, docs, and
the portfolio section — and Flux then prunes the now-absent `Namespace` objects
on its next reconciliation.

**Trade-offs:** Two commits and a verification gate between them. Slightly more process than a single PR. Guarantees Flux-managed pruning of every resource with no orphans.

### Option B: Single commit (delete everything at once)

One PR removes the site packages, the `k8s/<name>/` directories, the sync YAMLs, the kustomization entries, and all references together.

**Trade-offs:** Simpler diff. But the Flux `Kustomization` objects are deleted in the same reconciliation pass that loses track of the `Namespace`/workload resources. Flux has no living `Kustomization` to drive the prune, so the `Deployment`, `Service`, `IngressRoute`, and `Namespace` are **orphaned** in the cluster. They keep running. Manual `kubectl delete` is then required — which violates the GitOps-only requirement. Rejected.

### Option C: Manual cluster teardown followed by repo cleanup

Run `kubectl -n <name> delete deploy,svc,ingress,ns --all` by hand, then delete the repo-side files.

**Trade-offs:** Fast. But the cluster state is mutated outside Git, so the cluster and `main` disagree until the repo is cleaned up. If the manual delete is incomplete or forgotten, Flux reconciles stale resources back into existence (or they simply persist). Violates the principle that the cluster's desired state is defined solely by `main`. Rejected.

## Decision

**Option A — two-phase commit.** Flux is responsible for every deletion in the production cluster.

1. **Phase 1 (Commit A):** Delete only `k8s/<name>/deployment.yaml`, `service.yaml`,
   and `ingress.yaml` for `specmcp-ai` and `sddbook-com`. Leave `namespace.yaml`,
   the `<name>-sync.yaml` Flux `Kustomization` objects, and their entries in
   `k8s/flux-system/kustomization.yaml`. Push, then gate: reconcile both
   `Kustomization`s and confirm the live `Deployment`/`Service`/`IngressRoute` for
   each site are pruned (namespaces remain, empty).
2. **Phase 2 (Commit B):** Once the gate passes, delete the remaining `namespace.yaml` files, the `<name>-sync.yaml` files, the `kustomization.yaml` entries, the `sites/<name>/` packages, the `deploy.yml` workflow-dispatch choices, the `TF_VAR_cloudflare_zone_id_*` lines in `terraform.yml`, the `cloudflare_specmcp`/`cloudflare_sddbook` modules and variables in `infra/`, the kevinryan.io `SpecMcpSection` component + CSS + the `sddbook.com` credit text, the docs pages and sidebar entries, and every remaining reference in repo-root docs. Flux prunes the absent `Namespace` objects on its next reconciliation.

The next CI `terraform apply` destroys the Cloudflare DNS records (and zone-managed cache rulesets) for `specmcp.ai` and `sddbook.com` because the Terraform modules that owned them no longer exist in code.

## Consequences

### Positive

- The production cluster is torn down purely by Flux's reconciliation loop — no `kubectl delete`, no drift, no manual cluster mutation. The GitOps invariant from ADR-009 is preserved.
- No orphaned workloads, services, ingresses, or namespaces remain in the cluster.
- The monorepo, CI workflows, Terraform configuration, and documentation no longer reference two retired properties — reduced maintenance surface and cognitive load.
- kevinryan.io no longer promotes a product that is no longer live, so the portfolio stays truthful.
- The Cloudflare DNS records for the two domains are destroyed in a controlled, reviewed `terraform apply` rather than ad hoc.

### Negative

- Two commits with a verification gate between them is slightly more process than a single PR.
- The Cloudflare DNS records for `specmcp.ai` and `sddbook.com` are destroyed on the next `terraform apply`. If the domains are meant to be kept parked or repurposed, their DNS must be recreated out-of-band or the modules migrated before apply. This is intentional and documented here.
- Historical ADRs (`adr-005`, `adr-014`, `adr-020`) and saved SDD spec files still reference `sddbook.com` / `specmcp.ai` as they were at the time of writing. These are immutable history and are intentionally not edited.

### Risks

- **Phase 2 merged before Phase 1 reconciled:** If the namespace deletion lands before Flux has pruned the workloads, the namespace may stall in `Terminating` because Kubernetes cannot delete a namespace that still holds resources. Mitigation: enforce the Phase 1 gate (`flux reconcile kustomization <name>`; `kubectl -n <name> get deploy,svc,ingress` returns "No resources found") before proceeding to Phase 2. An empty `Terminating` namespace finalizes on its own once resources are gone.
- **Cloudflare DNS destroyed unexpectedly:** Operators unfamiliar with this ADR may read the Terraform destroy as drift. Mitigation: this ADR records the intent; the `terraform plan` in CI will show the destroy before review approval.
- **Stale GitHub secrets:** `CLOUDFLARE_ZONE_ID_SPECMCP` and `CLOUDFLARE_ZONE_ID_SDDBOOK` remain in repo secrets after the code references are gone. Harmless (unused), but should be revoked for hygiene. See manual follow-up checklist.
- **Stale Umami website entries:** `k8s/umami/` has no sddbook/specmcp manifests (Umami website rows are data in the analytics database, not Kubernetes manifests), so Flux does not touch them. The `docs/umami.md` table rows are removed here; the live Umami website entries remain in the PostgreSQL database and are a manual UI/DB cleanup if desired. See manual follow-up checklist.

## Agent Decisions

| Decision | Rationale | Acceptable |
|----------|-----------|------------|
| Numbered the new ADR as `adr-022` (not `adr-021` as originally planned) | `adr-021-auth0-authentication-hq.md` already exists; ADR numbers are never reused per the template guidance. | Yes |
| Left the portfolio section-number gap (`07` Certifications → `09` Contact, `08` removed) | Nothing in `SiteHeader.tsx` or elsewhere links to `#specmcp` or the `08` tag. Renumbering `09`→`08` would add churn unrelated to the removal. | Yes |
| Updated repo-root docs counts (`eight sites`→`six sites`, `6 domain zones`→`4 domain zones`, `9 IngressRoutes`→`7`, `14 hostnames`→`10`, `five Cloudflare zones`→`three`) to match the post-removal state | Keeps the docs internally consistent with the remaining sites/zones actually documented. (`docs/cloudflare.md` and `docs/index.md` already omitted `ai-native-engineer.io` before this change; that pre-existing omission is out of scope and was not corrected.) | Yes |
| Existing ADRs (`adr-005`, `adr-014`, `adr-020`) and saved SDD specs left unchanged | ADRs are append-only records and AGENTS.md forbids editing saved specs; the removal is documented by this new ADR rather than by rewriting history. | Yes |
| Removed the `(sddbook.com)` parenthetical from `CapabilitiesSection.tsx` but kept "Author of Spec Driven Development." as a publication credit | Decision was to remove the sddbook.com site reference, not to deny authorship of the book. | Yes |

## Manual follow-up checklist (out of band, after merge)

- [ ] Revoke the `CLOUDFLARE_ZONE_ID_SPECMCP` and `CLOUDFLARE_ZONE_ID_SDDBOOK` secrets in GitHub repo Settings → Secrets and variables → Actions.
- [ ] Confirm the Terraform workflow's next `apply` shows a clean destroy of the two Cloudflare modules' DNS records / cache rulesets for `specmcp.ai` and `sddbook.com`.
- [ ] Remove the `specmcp.ai` (`372ebc20-e8e7-4cc4-8aed-5a692eed1491`) and `sddbook.com` (`304d17ee-7587-4017-8060-2f8969646322`) website entries from the Umami analytics UI/database if no longer needed.
- [ ] Confirm final cluster state: `kubectl get ns sddbook-com specmcp-ai` → `NotFound`; `kubectl get deploy,svc,ingress -A | grep -E 'sddbook|specmcp'` → empty; `flux get kustomization` no longer lists either.

## References

- [ADR-005: K3s on Azure with Cloudflare CDN](adr-005-k3s-azure-spot-cloudflare-cdn.md) — original multi-domain rationale (now reduced in scope)
- [ADR-009: CI/CD with GitHub Actions and Flux](adr-009-cicd-github-actions-flux.md) — the GitOps invariant this teardown preserves
- [ADR-020: Email Capture via Formspree for Static Landing Pages](adr-020-email-capture-formspree-static-landing-pages.md) — referenced `specmcp.ai` as the prompting use case
- [Flux CD — Garbage Collection / Pruning](https://fluxcd.io/flux/components/kustomize/kustomization/#garbage-collection)
- `docs/flux-cd.md` — Flux deployment model and `prune: true`
