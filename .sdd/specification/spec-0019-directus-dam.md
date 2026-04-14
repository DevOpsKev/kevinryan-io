---
title: "Spec 0019: Directus DAM (Digital Asset Management)"
draft: true
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

- Spec 0002 deployed: PostgreSQL Flexible Server is running (`psql-kevinryan-io`)
- Spec 0003 deployed: External Secrets Operator is running with `azure-keyvault` ClusterSecretStore
- Read ADR-018 (`docs/adr/adr-018-secret-management.md`) — secrets flow from Azure Key Vault via ESO

## Context

Kevin Ryan & Associates is adopting a "Red Bull model" — positioning as a content and thought leadership engine that sells AI-Native engineering consulting. Content assets (white papers, internal guides, business plans, research PDFs, podcast media, LinkedIn article drafts) are accumulating with no centralised home. Without a Digital Asset Management system, content gets lost, duplicated, or forgotten.

Directus is an API-first, headless data platform that provides a visual admin UI, role-based access control, and file management out of the box. It will serve as the operational backbone for KRA's content engine — the single source of truth for all digital assets.

**Licensing:** Directus uses the BSL 1.1 license. Organisations with less than $5M in total annual finances can self-host freely for all uses including production and commercial. KRA is well under this threshold. No licence fee required.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `infra/main.tf` | Root Terraform module — PostgreSQL, Key Vault secrets, Cloudflare DNS |
| `infra/modules/postgresql/main.tf` | PostgreSQL Flexible Server with `for_each` database creation |
| `infra/modules/postgresql/variables.tf` | `databases` variable defaults to `["umami_db", "grafana_db"]` |
| `infra/modules/cloudflare/main.tf` | Cloudflare DNS records and cache rules |
| `k8s/umami/` | Reference pattern: Deployment + Service + ExternalSecret + IngressRoute |
| `k8s/umami/externalsecret.yaml` | Reference pattern for ESO pulling secrets from Key Vault |
| `k8s/external-secrets-store/` | ClusterSecretStore configuration for Azure Key Vault |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Reference for multi-key ExternalSecret |

### Key facts

- **Directus Docker image:** `directus/directus:11.17.2`
- **Directus default port:** 8055
- **Subdomain:** `dam.kevinryan.io`
- **Database name:** `directus_db` (new, on existing PostgreSQL Flexible Server)
- **Database user:** Shared `pgadmin` user (same as Umami/Grafana)
- **Azure Blob Storage account name:** `kradirectusblob` (new, to be created in Terraform)
- **Azure Blob Storage container name:** `directus-uploads`
- **Namespace:** `directus`
- **Helm chart:** `directus-labs/directus` from `https://directus-labs.github.io/helm-chart/`
- **Multi-user:** RBAC enabled, admin account bootstrapped on first launch
- **No Redis:** Not needed for single-digit user DAM workload

## 1. Terraform Changes

### 1.1 Add `directus_db` to PostgreSQL databases

In `infra/main.tf`, update the `module "postgresql"` call to pass a `databases` argument that includes the new database:

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

- The PostgreSQL module uses `for_each = toset(var.databases)` with `azurerm_postgresql_flexible_server_database`. Adding `directus_db` creates a new database without affecting `umami_db` or `grafana_db` — Terraform's `for_each` is keyed by name, so existing resources are untouched.
- No schema changes to existing databases. Directus runs its own migrations on first boot.

### 1.2 Create Azure Blob Storage account and container

Add the following to `infra/main.tf`:

```hcl
resource "azurerm_storage_account" "directus_blob" {
  name                     = "kradirectusblob"
  resource_group_name      = module.network.resource_group_name
  location                 = module.network.resource_group_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 30
    }
  }
}

resource "azurerm_storage_container" "directus_uploads" {
  name                  = "directus-uploads"
  storage_account_id    = azurerm_storage_account.directus_blob.id
  container_access_type = "private"
}
```

**Design notes:**

- LRS (Locally Redundant Storage) is sufficient for DAM assets — cost-effective and the assets are not mission-critical (can be re-uploaded).
- 30-day soft delete retention provides accidental deletion recovery.
- Container access is private — all access goes through Directus, not direct blob URLs.

### 1.3 Store Blob Storage credentials in Key Vault

Add to `infra/main.tf`:

```hcl
resource "azurerm_key_vault_secret" "directus_blob_account_name" {
  name         = "directus-blob-account-name"
  value        = azurerm_storage_account.directus_blob.name
  key_vault_id = module.keyvault.key_vault_id
}

resource "azurerm_key_vault_secret" "directus_blob_account_key" {
  name         = "directus-blob-account-key"
  value        = azurerm_storage_account.directus_blob.primary_access_key
  key_vault_id = module.keyvault.key_vault_id
}
```

### 1.4 Generate and store Directus secrets in Key Vault

Add to `infra/main.tf`:

```hcl
resource "random_password" "directus_key" {
  length  = 64
  special = false
}

resource "random_password" "directus_secret" {
  length  = 64
  special = false
}

resource "random_password" "directus_admin_password" {
  length  = 32
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

resource "azurerm_key_vault_secret" "directus_admin_password" {
  name         = "directus-admin-password"
  value        = random_password.directus_admin_password.result
  key_vault_id = module.keyvault.key_vault_id
}
```

**Design notes:**

- `KEY` and `SECRET` are required Directus env vars used for JWT signing and encryption.
- `ADMIN_PASSWORD` bootstraps the initial admin account on first launch.
- All generated without special characters to avoid shell/YAML escaping issues.

### 1.5 Add Cloudflare DNS record for `dam.kevinryan.io`

Add to `infra/main.tf`:

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

- Follows the same pattern as `analytics` and `monitoring` DNS records already in `main.tf`.
- Proxied through Cloudflare for SSL termination and DDoS protection.

## 2. Kubernetes Manifests

Create directory `k8s/directus/` with the following files.

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
        STORAGE_AZURE_CONTAINER_NAME: "directus-uploads"
        STORAGE_AZURE_ACCOUNT_NAME: "{{ .directus_blob_account_name }}"
        STORAGE_AZURE_ACCOUNT_KEY: "{{ .directus_blob_account_key }}"
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
    - secretKey: directus_blob_account_name
      remoteRef:
        key: directus-blob-account-name
    - secretKey: directus_blob_account_key
      remoteRef:
        key: directus-blob-account-key
```

**Design notes:**

- Follows the same ESO pattern as `k8s/umami/externalsecret.yaml`.
- `DB_SSL__REJECT_UNAUTHORIZED=false` is needed because Azure PostgreSQL Flexible Server uses a Microsoft-managed CA certificate that may not be in the container's trust store. This is safe because the connection is within the VNet (private endpoint).
- `ADMIN_EMAIL` is hardcoded — this is the bootstrap admin. Additional users are added via the Directus UI after first login.
- All Azure Blob Storage config is templated from Key Vault secrets so no credentials appear in manifests.

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
          readinessProbe:
            httpGet:
              path: /server/health
              port: 8055
            initialDelaySeconds: 30
            periodSeconds: 10
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 1Gi
```

**Design notes:**

- `initialDelaySeconds: 60` for liveness gives Directus time to run database migrations on first boot.
- Resource limits are generous for initial setup — Directus with PostgreSQL and Blob Storage needs more memory than Umami.
- No persistent volume needed — all files go to Azure Blob Storage, all metadata to PostgreSQL.

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

- Follows the exact same IngressRoute pattern as `k8s/umami/ingress.yaml`.
- TLS is terminated at Traefik using the default Let's Encrypt certificate resolver configured on the cluster.

## Constraints and Assumptions

- **Constraint:** No Redis. The DAM will serve single-digit concurrent users. Redis caching can be added later if performance requires it.
- **Constraint:** Single replica. No HA requirement for this workload.
- **Constraint:** Shared `pgadmin` database user. Directus does not get its own PostgreSQL role — it shares the admin credentials like Umami and Grafana.
- **Assumption:** The `directus-labs/directus` Helm chart is NOT used. After analysis, deploying Directus as plain Kubernetes manifests (Deployment + Service + ExternalSecret + IngressRoute) is more consistent with the platform's existing patterns (Umami uses the same approach) and avoids fighting the Helm chart's opinionated database subchart configuration.
- **Assumption:** Directus auto-migrates on first boot — no manual database schema setup required.
- **Assumption:** Azure Blob Storage account name `kradirectusblob` is globally unique and available.
- **Assumption:** The PostgreSQL `azure.extensions` config (`PGCRYPTO`) is sufficient for Directus. Directus uses `pgcrypto` for UUID generation which is already enabled.

## Out of Scope

- **Redis caching** — Not needed for current scale. Add when API response times degrade under load.
- **Custom Directus extensions** — No custom modules, interfaces, or hooks in this spec.
- **Content taxonomy/collections** — Data modelling within Directus (asset types, tags, workflows) will be configured manually through the Directus UI after deployment.
- **Automated backups** — Azure Blob Storage soft delete provides 30-day recovery. PostgreSQL Flexible Server has 7-day backup retention built in. Additional backup automation is a future spec.
- **Email configuration** — SMTP for password resets and notifications is not configured. Can be added later.
- **Flux HelmRelease/Kustomization** — The Kubernetes manifests are created as static YAML. Integrating them into a Flux Kustomization is a follow-up task if the platform adopts that pattern for plain manifests.

## Manual steps (not performed by the agent)

These steps must be performed by the operator after the code changes are merged.

1. **Run Terraform apply** to create the `directus_db` database, Blob Storage account, and Key Vault secrets:

   ```bash
   cd infra
   terraform plan -out=plan.tfplan
   terraform apply plan.tfplan
   ```

2. **Verify Key Vault secrets** were created:

   ```bash
   az keyvault secret list --vault-name kv-kevinryan-io --query "[?starts_with(name, 'directus')].name" -o tsv
   ```

   Expected output should include: `directus-key`, `directus-secret`, `directus-admin-password`, `directus-blob-account-name`, `directus-blob-account-key`

3. **Verify Cloudflare DNS** record was created:

   ```bash
   dig dam.kevinryan.io +short
   ```

4. **Apply Kubernetes manifests** (if not picked up by Flux automatically):

   ```bash
   kubectl apply -f k8s/directus/namespace.yaml
   kubectl apply -f k8s/directus/externalsecret.yaml
   kubectl apply -f k8s/directus/deployment.yaml
   kubectl apply -f k8s/directus/service.yaml
   kubectl apply -f k8s/directus/ingress.yaml
   ```

5. **Wait for ExternalSecret to sync** and pod to start:

   ```bash
   kubectl get externalsecret -n directus
   kubectl get pods -n directus -w
   ```

6. **Access Directus** at `https://dam.kevinryan.io` and log in with:
   - Email: `kevin@kevinryan.io`
   - Password: Retrieve from Key Vault: `az keyvault secret show --vault-name kv-kevinryan-io --name directus-admin-password --query value -o tsv`

7. **Configure RBAC** — After first login, go to Settings → Roles & Permissions to create additional roles (Editor, Viewer) and invite team members.

Verify:

```bash
# ExternalSecret is synced
kubectl get externalsecret -n directus -o jsonpath='{.items[0].status.conditions[0].status}'
# Pod is running
kubectl get pods -n directus -o jsonpath='{.items[0].status.phase}'
# Directus health check
curl -s https://dam.kevinryan.io/server/health | jq .status
```

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0019-directus-dam.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0019-directus-dam.md`
2. `k8s/directus/namespace.yaml` exists with namespace `directus`
3. `k8s/directus/externalsecret.yaml` exists and references all 8 Key Vault secrets
4. `k8s/directus/deployment.yaml` exists with image `directus/directus:11.17.2` and port 8055
5. `k8s/directus/service.yaml` exists mapping port 80 → 8055
6. `k8s/directus/ingress.yaml` exists with host `dam.kevinryan.io`
7. `infra/main.tf` includes `directus_db` in the PostgreSQL `databases` list
8. `infra/main.tf` includes `azurerm_storage_account.directus_blob` resource
9. `infra/main.tf` includes `azurerm_storage_container.directus_uploads` resource
10. `infra/main.tf` includes Key Vault secrets for `directus-key`, `directus-secret`, `directus-admin-password`, `directus-blob-account-name`, `directus-blob-account-key`
11. `infra/main.tf` includes `cloudflare_record.dam` resource
12. `terraform fmt -check -recursive infra/` passes
13. `pnpm lint` passes
14. The provenance record exists at `.sdd/provenance/spec-0019-directus-dam.provenance.md` and contains all required sections
15. All files (spec, implementation, provenance) are committed together
