---
title: "ADR-022: Directus as Digital Asset Management Platform"
---

**Status:** Accepted
**Date:** 2026-04-14
**Decision Makers:** Human + HQ (claude.ai)
**Prompted By:** Digital assets (white papers, business plans, research PDFs, podcast media, LinkedIn drafts) accumulating across scattered locations with no centralised management, search, or access control. KRA's adoption of the "Red Bull model" — positioning as a content and thought leadership engine — requires a proper DAM backbone.

## Context

Kevin Ryan & Associates is building a content-driven consultancy brand. The volume of digital assets is growing: white papers, internal guides, business plans, research PDFs, podcast media, LinkedIn article drafts, client deliverable templates, and proposal documents. These assets are currently spread across local filesystems, cloud drives, and chat threads with no single source of truth, no metadata, no search, and no access control.

The platform already runs PostgreSQL (Azure Flexible Server), has a secrets pipeline (Azure Key Vault → ESO), and uses Traefik for ingress with Cloudflare for DNS and SSL. A DAM solution needs to slot into this existing infrastructure without introducing significant new operational complexity.

The long-term vision is for HQ (the AI assistant) to upload assets directly to the DAM via API, making it the programmatic backbone of KRA's content engine — not just a manual file store.

## Decision Drivers

- **API-first:** The DAM must expose a REST API for programmatic access — HQ will upload and query assets directly in future
- **Self-hosted:** Consistent with KRA's platform philosophy — own the infrastructure, control the data
- **Low operational overhead:** Must run on the existing K3s cluster without dedicated infrastructure
- **PostgreSQL compatible:** Must use the existing Azure PostgreSQL Flexible Server — no new database engines
- **File storage flexibility:** Must support Azure Blob Storage for file persistence — no local PVCs
- **Visual admin UI:** Non-technical users (or Kevin moving quickly) need a browser-based interface for uploads, tagging, and browsing
- **RBAC:** Role-based access control for future multi-user scenarios (editors, viewers, API consumers)
- **Cost:** Zero or near-zero licensing cost at KRA's scale

## Options Considered

### Option A: Directus

Open-source (BSL 1.1), API-first headless data platform built with Node.js and Vue.js. Provides a visual admin UI, REST and GraphQL APIs, role-based access control, and built-in file management with support for S3-compatible and Azure Blob Storage drivers. Backed by PostgreSQL (among other databases). Docker images are officially maintained. BSL 1.1 licence permits free self-hosting for organisations under $5M in total annual finances — KRA is well under this threshold.

Directus is more than a file manager — it's a full data platform. Collections, fields, relations, and flows can be configured through the UI without writing code. This means the DAM can evolve into a full content management backbone (asset metadata, taxonomies, publishing workflows) without a migration.

### Option B: MinIO + custom UI

MinIO is an S3-compatible object storage server. It handles file storage well but provides no metadata management, no visual admin UI for non-technical users, no RBAC beyond bucket policies, and no API for structured data. A custom UI and metadata layer would need to be built on top, significantly increasing development and maintenance effort.

### Option C: Strapi

Open-source (MIT) headless CMS built with Node.js. Has a media library, REST/GraphQL APIs, and an admin UI. However, Strapi's media library is secondary to its CMS focus — it's designed around content types and publishing, not asset management. File storage driver support is more limited than Directus. Strapi v5 introduced breaking changes and the plugin ecosystem is fragmented. The CMS-first model adds conceptual overhead for a DAM use case.

### Option D: Nextcloud

Open-source (AGPLv3) file sync and share platform. Rich file management, collaboration features, and a large app ecosystem. However, Nextcloud is designed as a Dropbox/Google Drive replacement — it's file-centric, not API-first. The REST API exists but is secondary to the web/desktop/mobile sync experience. It requires significantly more resources (PHP, Redis, full-text search) and the operational footprint is much larger than needed for a DAM backing a content engine. No native Azure Blob Storage driver without third-party plugins.

### Option E: SharePoint / Google Drive / Dropbox

SaaS file storage with collaboration features. Zero infrastructure overhead. However, these are not API-first platforms — programmatic access is possible but awkward and rate-limited. Data lives on third-party infrastructure, inconsistent with KRA's self-hosting philosophy. No custom metadata schemas, no RBAC granularity beyond basic sharing, and no path to becoming a programmable content backbone.

## Decision

**Use Directus as the Digital Asset Management platform, self-hosted on K3s with PostgreSQL and Azure Blob Storage.**

Directus is the strongest fit across every decision driver. It is genuinely API-first — the REST and GraphQL APIs are the primary interface, with the admin UI built on top of them. This means HQ can interact with it programmatically from day one. PostgreSQL compatibility means it slots directly onto the existing Azure Flexible Server with no new database engines. The Azure Blob Storage driver means file persistence is handled by managed cloud storage with soft delete and no PVCs on the cluster. The visual admin UI provides immediate value for manual uploads, browsing, and tagging without writing code.

The BSL 1.1 licence is a non-issue at KRA's scale. The Docker image is well-maintained and the deployment pattern (Deployment + Service + ExternalSecret + IngressRoute) is identical to Umami, keeping operational consistency across the platform.

Critically, Directus can grow with the use case. Today it's a DAM. Tomorrow it can manage content taxonomies, publishing workflows, client deliverable metadata, and proposal templates — all through UI configuration, not code changes. This extensibility without migration is a significant advantage over purpose-built file storage solutions.

### Deployment architecture

- **Image:** `directus/directus:11.17.2`
- **Database:** `directus_db` on existing Azure PostgreSQL Flexible Server (shared `pgadmin` user)
- **File storage:** Azure Blob Storage account `kradirectusblob`, container `directus-uploads`, LRS replication
- **Secrets:** Azure Key Vault → ESO ExternalSecret (KEY, SECRET, ADMIN_PASSWORD, Blob Storage credentials)
- **Ingress:** `dam.kevinryan.io` via Traefik IngressRoute, Cloudflare DNS with proxy
- **Namespace:** `directus`
- **Replicas:** 1 (single-digit user workload, no HA requirement)
- **No Redis:** Not needed at current scale

### What was explicitly excluded

- No Helm chart — plain Kubernetes manifests match the platform's existing patterns and avoid fighting the Helm chart's opinionated database subchart
- No Redis — unnecessary for single-digit concurrent users
- No custom extensions — the out-of-the-box feature set covers all current requirements
- No email/SMTP — password resets and notifications are a future addition
- No Flux HelmRelease — deployed as static YAML via a Flux Kustomization watching `k8s/directus/`

## Consequences

### Positive

- Centralised, searchable home for all KRA digital assets — no more scattered files
- API-first architecture enables future HQ integration (programmatic upload, search, metadata management)
- Visual admin UI provides immediate value without development effort
- Consistent deployment pattern with existing platform services (Umami, Grafana)
- Azure Blob Storage provides durable file persistence with 30-day soft delete recovery
- PostgreSQL metadata is covered by Azure Flexible Server's 7-day automatic backup retention
- Zero licence cost at KRA's scale (BSL 1.1, under $5M threshold)
- Extensible to content management, taxonomies, and workflows without migration
- RBAC ready for multi-user scenarios when KRA grows

### Negative

- BSL 1.1 is not a true open-source licence — if KRA's revenue exceeds $5M, a commercial licence would be required. Mitigation: this is a good problem to have, and migration to alternatives is feasible
- Directus adds another workload to the K3s cluster (CPU, memory). Mitigation: resource requests/limits are set conservatively (100m–1000m CPU, 256Mi–1Gi memory) and the cluster has headroom
- Shared `pgadmin` database user means Directus has theoretical access to other databases. Mitigation: Directus only connects to `directus_db` via its configuration; per-database roles are a future hardening step
- No email configuration means password resets require Key Vault access. Mitigation: single admin user for now; SMTP is a straightforward future addition

### Risks

- **Directus major version breaking changes:** Directus has historically made breaking changes between major versions. Mitigation: pin to specific image tag (`11.17.2`), test upgrades in a staging environment before production
- **Azure Blob Storage costs:** Large asset volumes could increase storage costs. Mitigation: LRS is the cheapest tier, and KRA's asset volume is modest. Monitor via Azure Cost Management
- **BSL licence change:** Directus could change licence terms. Mitigation: the BSL converts to open source (Apache 2.0 or GPLv3) after the change date specified in each release. Worst case, fork from the last permissive release
- **Single replica availability:** Pod restarts cause brief downtime. Mitigation: acceptable for a DAM with single-digit users; add a second replica if uptime becomes critical

## Agent Decisions

| Decision | Rationale | Acceptable |
|----------|-----------|------------|
| Plain K8s manifests instead of Helm chart | Matches existing platform patterns (Umami, Grafana). Avoids Helm chart's opinionated PostgreSQL subchart which conflicts with shared Azure Flexible Server | Yes |
| LRS replication for Blob Storage | Assets are not mission-critical (can be re-uploaded). LRS is cheapest option | Yes |
| 30-day soft delete on Blob Storage | Provides accidental deletion recovery without backup infrastructure | Yes |
| No Redis | Single-digit user DAM workload does not benefit from caching layer. Can be added later | Yes |
| `DB_SSL__REJECT_UNAUTHORIZED=false` | Azure PostgreSQL uses Microsoft-managed CA not in container trust store. Safe because connection is within VNet | Yes — document for future hardening |
| 60s liveness probe initial delay | Directus runs database migrations on first boot which can take time | Yes |

## References

- [Spec 0019: Directus DAM](/.sdd/specification/spec-0019-directus-dam.md)
- [ADR-007: PostgreSQL on Azure Flexible Server](./adr-007-postgresql-azure-flexible-server.md)
- [ADR-017: Managed PostgreSQL as Shared Database](./adr-017-managed-postgresql-shared-database.md)
- [ADR-018: Secret Management with Azure Key Vault and ESO](./adr-018-secret-management-keyvault-eso.md)
- [Directus documentation](https://docs.directus.io)
- [Directus GitHub repository](https://github.com/directus/directus)
- [Directus BSL 1.1 licence FAQ](https://directus.io/bsl-faq)
