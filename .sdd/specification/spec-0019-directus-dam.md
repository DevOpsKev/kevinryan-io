---
title: "Spec 0019: Directus DAM"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- Any prerequisites listed below
- Updated provenance (on subsequent cycles, to address failing scenarios)

**Produces:**

- Working software that satisfies all requirements in this spec
- A provenance record at `.sdd/provenance/spec-0019-directus-dam.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0019-directus-dam.md` in the repo. This is the canonical reference. Do not modify it after saving.
2. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at `.sdd/provenance/template.md`.
5. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
6. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
7. Do not write tests. Testing is not your role.
8. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
9. Commit the spec, implementation, and provenance together.

**On subsequent cycles (fixing failing scenarios):**

1. Read the updated provenance, specifically the "Testing Agent Findings" and "Scenario Results" sections.
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-0019-directus-dam.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0019-directus-dam.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0019-directus-dam.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-0019-directus-dam.provenance.md` in full.
3. Compare the provenance against the specification. Identify:
   - **Gaps:** Requirements in the spec that the provenance does not address.
   - **Assumptions:** Decisions the builder made where the spec was silent. These are primary targets for scenarios.
   - **Ambiguities:** Places where the builder interpreted an ambiguous requirement. Generate scenarios that test whether the interpretation was reasonable.
   - **Silences:** Things the provenance does not mention at all. These may indicate missing implementation or missing provenance.
   - **Deviations:** Anywhere the builder deviated from the spec. Generate scenarios that test the impact.
4. Write prose scenarios to `.sdd/scenarios/spec-0019-directus-dam.scenarios.md`. Each scenario must:
   - Reference the specific spec requirement or provenance entry that triggered it.
   - State what is being tested and why, in plain language.
   - Define pass/fail criteria before any code is written.
5. Implement each prose scenario as executable test code in `tests/`. Every test must trace back to a numbered scenario in the prose document.
6. Run the tests against the built software.
7. Update the provenance document. Append a "Testing Agent Findings" section (do not modify the builder's sections). Record:
   - Gaps, assumptions, ambiguities, and silences found.
   - Scenario results (pass/fail with references to scenario IDs).
   - Recommendations: whether failing tests indicate a code fix, a spec clarification, or a provenance gap.

**On subsequent cycles:**

1. Re-read the updated provenance (including the builder's new entries).
2. Reassess existing scenarios — are they still relevant? Do the builder's fixes resolve them?
3. Generate new scenarios if the builder's fixes introduced new assumptions or decisions.
4. Re-run all tests. Update the provenance with new results.

---

## Task

1. Save this spec to `.sdd/specification/spec-0019-directus-dam.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0019-directus-dam.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0002 deployed: PostgreSQL Flexible Server running (`psql-kevinryan-io`)
- Spec 0003 deployed: External Secrets Operator running with `ClusterSecretStore` named `azure-keyvault`
- Read `infra/main.tf` — understand Terraform module structure and Key Vault secrets pattern
- Read `infra/modules/postgresql/main.tf` — understand `for_each = toset(var.databases)` pattern
- Read `k8s/umami/` — reference pattern for namespace, ExternalSecret, deployment, service, ingress
- Read `k8s/observability/helmrelease-grafana.yaml` — reference pattern for HelmRelease with Flux CD

## Context

Kevin Ryan & Associates is adopting a "Red Bull model" — operating as a content and thought leadership engine that sells AI-Native engineering consulting. Content assets are accumulating (white papers, internal guides, business plans, research PDFs) with no centralised system to manage them. This will grow to include LinkedIn article drafts, podcast episodes, media assets, and campaign materials.

Directus is being deployed as the Digital Asset Management (DAM) platform — the single source of truth for all KRA content. It provides a modern UI for managing assets, a full RBAC system for multi-user access, and an API-first architecture that allows programmatic access from other platform services.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `infra/main.tf` | Root Terraform config — modules, secrets, Cloudflare DNS |
| `infra/modules/postgresql/main.tf` | PostgreSQL Flexible Server with `for_each` databases |
| `infra/modules/postgresql/variables.tf` | Database list defaults: `["umami_db", "grafana_db"]` |
| `k8s/external-secrets-store/clustersecretstore.yaml` | ClusterSecretStore pointing to `kv-kevinryan-io` |
| `k8s/umami/` | Reference deployment pattern (namespace, externalsecret, deployment, service, ingress) |
| `k8s/observability/helmrelease-grafana.yaml` | Reference HelmRelease pattern with Flux CD |
| `k8s/observability/helmrepository-grafana.yaml` | Reference HelmRepository pattern |

### Key facts

- **Directus image:** `directus/directus:11.17.2`
- **Directus port:** 8055
- **Helm chart repo:** `https://directus-labs.github.io/helm-chart/` (community chart from `directus-labs`)
- **Database:** PostgreSQL on existing Azure Flexible Server (`psql-kevinryan-io`)
- **Database name:** `directus_db`
- **Database user:** `pgadmin` (shared admin user, same as Umami and Grafana)
- **File storage:** Azure Blob Storage (new storage account and container)
- **Hostname:** `dam.kevinryan.io`
- **Namespace:** `directus`
- **Key Vault:** `kv-kevinryan-io`
- **ClusterSecretStore:** `azure-keyvault`
- **Licensing:** BSL 1.1 — free for organisations under $5M revenue. KRA qualifies.

## 1. Terraform changes

### 1.1 Add `directus_db` to PostgreSQL module

In `infra/main.tf`, update the `module "postgresql"` block to pass `directus_db` in the databases list:

```hcl
module "postgresql" {
  source              = "./modules/postgresql"
  location            = module.network.resource_group_location
  resource_group_name = module.network.resource_group_name
  vnet_name           = module.network.vnet_name
  vnet_id             = module.network.vnet_id
  admin_password      = random_password.pg_admin_password.result
  databases           = ["umami_db", "grafana_db", "directus_db"]
}
```

**Design notes:**

- The PostgreSQL module uses `for_each = toset(var.databases)` so adding a new entry creates only the new database. Existing `umami_db` and `grafana_db` resources are keyed by name and will not be touched.
- The `databases` variable has a default of `["umami_db", "grafana_db"]` but we override it explicitly at the root module level for clarity and to avoid relying on defaults.

### 1.2 Create Azure Blob Storage account and container

Add the following resources to `infra/main.tf`:

```hcl
resource "azurerm_storage_account" "directus" {
  name                     = "stakrdirectus"
  resource_group_name      = module.network.resource_group_name
  location                 = module.network.resource_group_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 30
    }
    container_delete_retention_policy {
      days = 30
    }
  }
}

resource "azurerm_storage_container" "directus_assets" {
  name                  = "assets"
  storage_account_id    = azurerm_storage_account.directus.id
  container_access_type = "private"
}
```

**Design notes:**

- Storage account name `stakrdirectus` follows Azure naming constraints (3-24 lowercase alphanumeric).
- LRS replication is sufficient — this is not mission-critical data and can be re-uploaded.
- 30-day soft delete on blobs and containers provides accidental deletion protection.
- Container access is `private` — all access goes through Directus using the storage account key.

### 1.3 Store Azure Storage credentials in Key Vault

Add the following secrets to `infra/main.tf`:

```hcl
resource "azurerm_key_vault_secret" "directus_storage_account_name" {
  name         = "directus-storage-account-name"
  value        = azurerm_storage_account.directus.name
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_storage_account_key" {
  name         = "directus-storage-account-key"
  value        = azurerm_storage_account.directus.primary_access_key
  key_vault_id = module.keyvault.key_vault_id
}
```

### 1.4 Generate and store Directus secrets in Key Vault

Directus requires a `KEY` and `SECRET` environment variable for encryption and hashing. Generate these and store in Key Vault:

```hcl
resource "random_password" "directus_key" {
  length  = 64
  special = false
}

resource "random_password" "directus_secret" {
  length  = 64
  special = false
}

resource "azurerm_key_vault_secret" "directus_key" {
  name         = "directus-key"
  value        = random_password.directus_key.result
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_secret" {
  name         = "directus-secret"
  value        = random_password.directus_secret.result
  key_vault_id = module.keyvault.key_vault_id
}
```

### 1.5 Generate and store Directus admin password in Key Vault

```hcl
resource "random_password" "directus_admin_password" {
  length  = 32
  special = false
}

resource "azurerm_key_vault_secret" "directus_admin_password" {
  name         = "directus-admin-password"
  value        = random_password.directus_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}
```

### 1.6 Add Cloudflare DNS record for `dam.kevinryan.io`

Add the following to `infra/main.tf`:

```hcl
resource "cloudflare_record" "dam" {
  zone_id = var.cloudflare_zone_id
  name    = "dam"
  content = module.network.public_ip_address
  type    = "A"
  proxied = true
  ttl     = 1
}
```

**Design notes:**

- Follows the same standalone `cloudflare_record` pattern used for `analytics` and `monitoring`.
- Alternatively, `dam` could be added to the `subdomains` list in `module "cloudflare"`. The standalone resource is preferred here to avoid touching the existing module call which also handles `cache_bypass_subdomains`. The builder agent should choose whichever approach is cleanest — either add `"dam"` to the `subdomains` list in the existing `module "cloudflare"` block, or use a standalone `cloudflare_record`. Record the decision in provenance.

## 2. Kubernetes manifests

Create all files under `k8s/directus/`.

### 2.1 Namespace

Create `k8s/directus/namespace.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: directus
```

### 2.2 ExternalSecret

Create `k8s/directus/externalsecret.yaml`:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: directus-secrets
  namespace: directus
spec:
  refreshInterval: 1h
  secretStoreRef:
    kind: ClusterSecretStore
    name: azure-keyvault
  target:
    name: directus-secrets
    creationPolicy: Owner
    template:
      engineVersion: v2
      data:
        DB_CLIENT: "pg"
        DB_HOST: "{{ .pg_fqdn }}"
        DB_PORT: "5432"
        DB_DATABASE: "directus_db"
        DB_USER: "{{ .pg_admin_username }}"
        DB_PASSWORD: "{{ .pg_admin_password }}"
        DB_SSL__REJECT_UNAUTHORIZED: "false"
        KEY: "{{ .directus_key }}"
        SECRET: "{{ .directus_secret }}"
        ADMIN_EMAIL: "kevin@kevinryan.io"
        ADMIN_PASSWORD: "{{ .directus_admin_password }}"
        STORAGE_LOCATIONS: "azure"
        STORAGE_AZURE_DRIVER: "azure"
        STORAGE_AZURE_CONTAINER_NAME: "assets"
        STORAGE_AZURE_ACCOUNT_NAME: "{{ .directus_storage_account_name }}"
        STORAGE_AZURE_ACCOUNT_KEY: "{{ .directus_storage_account_key }}"
        PUBLIC_URL: "https://dam.kevinryan.io"
  data:
    - secretKey: pg_fqdn
      remoteRef:
        key: pg-fqdn
    - secretKey: pg_admin_username
      remoteRef:
        key: pg-admin-username
    - secretKey: pg_admin_password
      remoteRef:
        key: pg-admin-password
    - secretKey: directus_key
      remoteRef:
        key: directus-key
    - secretKey: directus_secret
      remoteRef:
        key: directus-secret
    - secretKey: directus_admin_password
      remoteRef:
        key: directus-admin-password
    - secretKey: directus_storage_account_name
      remoteRef:
        key: directus-storage-account-name
    - secretKey: directus_storage_account_key
      remoteRef:
        key: directus-storage-account-key
```

**Design notes:**

- `DB_SSL__REJECT_UNAUTHORIZED: "false"` is required because Azure PostgreSQL uses Microsoft-managed certificates that may not be in the container's trust store. This is safe because the connection is within the VNet via private endpoint.
- The `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used only on first bootstrap to create the initial admin user. After that, Directus ignores them.
- `PUBLIC_URL` must be set for correct asset URL generation behind the Cloudflare proxy.

### 2.3 Deployment

Create `k8s/directus/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: directus
  namespace: directus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: directus
  template:
    metadata:
      labels:
        app: directus
    spec:
      containers:
        - name: directus
          image: directus/directus:11.17.2
          ports:
            - containerPort: 8055
          envFrom:
            - secretRef:
                name: directus-secrets
          livenessProbe:
            httpGet:
              path: /server/health
              port: 8055
            initialDelaySeconds: 60
            periodSeconds: 30
            timeoutSeconds: 5
          readinessProbe:
            httpGet:
              path: /server/health
              port: 8055
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 1Gi
```

**Design notes:**

- Using a plain Deployment rather than the directus-labs HelmRelease. The community Helm chart bundles its own PostgreSQL/MySQL subchart and is oriented toward self-contained deployments. Since we use an external Azure PostgreSQL Flexible Server and inject all config via ExternalSecret, a plain Deployment is simpler, more transparent, and consistent with the Umami pattern on this platform.
- `initialDelaySeconds: 60` for liveness — Directus runs database migrations on first start which can take time.
- Memory limit of 1Gi accounts for image transformation operations (Directus uses Sharp for on-the-fly image transforms).
- No `nodeSelector` or `tolerations` — Directus should run on any available node.

### 2.4 Service

Create `k8s/directus/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: directus
  namespace: directus
spec:
  selector:
    app: directus
  ports:
    - port: 80
      targetPort: 8055
      protocol: TCP
  type: ClusterIP
```

### 2.5 IngressRoute

Create `k8s/directus/ingress.yaml`:

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: directus
  namespace: directus
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`dam.kevinryan.io`)
      kind: Rule
      services:
        - name: directus
          port: 80
  tls: {}
```

**Design notes:**

- Follows the exact same IngressRoute pattern as Umami (`analytics.kevinryan.io`).
- TLS is terminated at the Traefik ingress controller using the default Let's Encrypt / Cloudflare origin certificate.

## Constraints and Assumptions

- **Constraint:** The directus-labs community Helm chart is NOT used. A plain Deployment is used instead (same pattern as Umami). This avoids complexity from the chart's bundled database subcharts and gives full control over configuration. All environment variables are injected via ExternalSecret.
- **Constraint:** No Redis is deployed. For a single-replica DAM with a small number of users, Redis adds unnecessary complexity. If scaling to multiple replicas in the future, Redis should be added for session management and caching.
- **Constraint:** Azure Blob Storage is used for file storage, not PostgreSQL binary storage. This keeps the database lean and provides purpose-built file storage with soft-delete protection.
- **Assumption:** The Azure PostgreSQL Flexible Server accepts connections from the K3s VNet (this is already true for Umami and Grafana).
- **Assumption:** The Cloudflare zone ID variable `var.cloudflare_zone_id` is available and correct for `kevinryan.io` (already used by other DNS records).
- **Assumption:** The storage account name `stakrdirectus` is globally unique and available in Azure.
- **Assumption:** Multi-user access will be configured via the Directus admin UI after deployment (creating roles and inviting users). The initial bootstrap creates only the admin account.
- **Assumption:** `DB_SSL__REJECT_UNAUTHORIZED: "false"` is acceptable because the PostgreSQL connection traverses only the private VNet.

## Out of Scope

- **Redis caching layer** — not needed for single-replica, low-user-count deployment. Add later if scaling.
- **Directus Flows / automation** — can be configured via the UI post-deployment.
- **Custom extensions** — no custom Directus extensions are needed for DAM functionality.
- **Backup automation** — Azure Blob Storage has 30-day soft delete. PostgreSQL Flexible Server has 7-day backup retention. Additional backup automation is a separate concern.
- **Content taxonomy / collection design** — this will be configured via the Directus admin UI after deployment, not via code.
- **SSO / Auth0 integration** — Directus supports SSO but this is a post-deployment configuration. Initial access is via email/password.

## Manual steps (not performed by the agent)

These steps must be performed by the human operator after the code changes are merged.

### Terraform

1. Run Terraform to create the new database, storage account, and Key Vault secrets:

```bash
cd infra
terraform plan -out=plan.tfplan
# Review the plan — should show:
#   - 1 new database (directus_db)
#   - 1 new storage account (stakrdirectus)
#   - 1 new storage container (assets)
#   - 5 new Key Vault secrets (directus-key, directus-secret, directus-admin-password, directus-storage-account-name, directus-storage-account-key)
#   - 1 new Cloudflare DNS record (dam.kevinryan.io)
#   - 0 changes to existing resources
terraform apply plan.tfplan
```

2. Verify the database was created:

```bash
az postgres flexible-server db list \
  --resource-group rg-kevinryan-io \
  --server-name psql-kevinryan-io \
  --output table
```

3. Verify Key Vault secrets:

```bash
az keyvault secret list --vault-name kv-kevinryan-io --query "[?starts_with(name, 'directus')]" --output table
```

### Kubernetes

4. After Flux syncs the new manifests (or force a reconciliation):

```bash
flux reconcile source git flux-system
flux reconcile kustomization flux-system
```

5. Verify the namespace and pods:

```bash
kubectl get ns directus
kubectl get pods -n directus
kubectl get externalsecret -n directus
```

6. Check Directus logs for successful startup:

```bash
kubectl logs -n directus deployment/directus --tail=50
```

7. Access `https://dam.kevinryan.io` and log in with `kevin@kevinryan.io` and the generated admin password:

```bash
az keyvault secret show --vault-name kv-kevinryan-io --name directus-admin-password --query value -o tsv
```

### Post-deployment configuration

8. Log into Directus admin panel and:
   - Change admin password to something memorable (or set up SSO later)
   - Create roles: Editor, Viewer
   - Invite team members with appropriate roles
   - Create initial folder structure for asset organisation (e.g. White Papers, Internal Guides, Business Plans, Research)

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0019-directus-dam.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0019-directus-dam.md`
2. `infra/main.tf` contains the `databases = ["umami_db", "grafana_db", "directus_db"]` override in the postgresql module
3. `infra/main.tf` contains the `azurerm_storage_account.directus` resource
4. `infra/main.tf` contains the `azurerm_storage_container.directus_assets` resource
5. `infra/main.tf` contains Key Vault secrets for `directus-key`, `directus-secret`, `directus-admin-password`, `directus-storage-account-name`, `directus-storage-account-key`
6. `infra/main.tf` contains a Cloudflare DNS record for `dam`
7. `k8s/directus/namespace.yaml` exists and creates the `directus` namespace
8. `k8s/directus/externalsecret.yaml` exists and references all required Key Vault secrets
9. `k8s/directus/deployment.yaml` exists with image `directus/directus:11.17.2` and correct resource limits
10. `k8s/directus/service.yaml` exists with port 80 targeting 8055
11. `k8s/directus/ingress.yaml` exists with host `dam.kevinryan.io`
12. `terraform fmt -check -recursive infra/` passes
13. `pnpm lint` passes (if markdown linting is configured)
14. The provenance record exists at `.sdd/provenance/spec-0019-directus-dam.provenance.md` and contains all required sections
15. All files (spec, implementation, provenance) are committed together
