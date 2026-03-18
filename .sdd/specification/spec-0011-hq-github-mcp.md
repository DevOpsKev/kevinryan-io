---
title: "Spec 0011: HQ GitHub MCP Integration"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- `sites/hq-kevinryan-io/app/api/chat/route.ts` — existing chat route being extended
- `k8s/hq-kevinryan-io/externalsecret.yaml` — ESO manifest to update
- `infra/variables.tf` and `infra/main.tf` — Terraform to extend
- `.github/workflows/terraform.yml` — CI to extend
- `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md` — context from prior spec
- `https://brand.kevinryan.io` — brand guidelines

**Produces:**

- Extended chat API route with GitHub MCP tool support
- A provenance record at `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0011-hq-github-mcp.md` in the repo.
2. Read the full specification and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent, make a reasonable decision and record it in provenance.
4. Write provenance as you build, not after.
5. Do not write tests. Testing is not your role.
6. When the build is complete, add a "Build Status" entry to the provenance.
7. Commit the spec, implementation, and provenance together.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0011-hq-github-mcp.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document

---

## Task

1. Save this spec to `.sdd/specification/spec-0011-hq-github-mcp.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md`.

## Prerequisites

- Spec-0010 deployed: HQ chat interface is live and working at `hq.kevinryan.io`.
- Read the spec-0010 provenance before starting.

## Context

HQ currently has a working chat interface backed by the Anthropic API. This spec adds GitHub as a tool layer — HQ can now read the platform repository and reason about its own infrastructure, deployments, specs, and ADRs in real time.

The integration uses the **Anthropic API's native MCP (Model Context Protocol) support** — specifically the `mcp_servers` parameter on the messages API. This passes the GitHub MCP server URL and authentication token directly to the Anthropic API. Claude handles the tool calls automatically — no custom tool definitions, no manual function calling. The chat route simply adds the MCP server configuration alongside the existing messages request.

**The GitHub MCP server** is the official Anthropic-hosted GitHub MCP server at `https://mcp.github.com/sse`. It exposes tools for reading repository contents, listing files, reading pull requests, checking workflow runs, browsing issues, and more.

**Scope is intentionally narrow.** The GitHub token is a fine-grained personal access token scoped to `DevOpsKev/kevin-ryan-platform` only, with read-only access to: contents, pull requests, actions, issues, metadata. HQ cannot write to the repository, cannot access other repositories, and cannot take destructive actions. This is enforced at the token level, not just in the system prompt.

**The system prompt is updated** to tell HQ about its own repository explicitly. HQ knows `DevOpsKev/kevin-ryan-platform` is its platform repo, where specs live, where ADRs live, and what the directory structure means.

The GitHub token is managed via the platform's established secret pattern: GitHub Actions secret → Terraform → Key Vault → ESO → K8s secret → pod env var.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Existing chat route — extend with MCP config |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | System prompts — update with repo context |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Add GitHub token mapping |
| `infra/variables.tf` | Add GitHub token variable |
| `infra/main.tf` | Add Key Vault secret resource |
| `.github/workflows/terraform.yml` | Add TF_VAR for GitHub token |

### Key facts

- **GitHub MCP server URL:** `https://mcp.github.com/sse`
- **Platform repository:** `DevOpsKev/kevin-ryan-platform`
- **GitHub token env var:** `GITHUB_MCP_TOKEN`
- **Key Vault secret name:** `hq-github-mcp-token`
- **Terraform variable name:** `github_mcp_token`
- **GitHub Actions secret name:** `TF_VAR_GITHUB_MCP_TOKEN`
- **Token type:** Fine-grained personal access token, read-only, scoped to `DevOpsKev/kevin-ryan-platform` only
- **Token permissions:** Contents (read), Pull requests (read), Actions (read), Issues (read), Metadata (read)
- **MCP parameter in Anthropic API:** `mcp_servers` array on the messages request

## 1. GitHub token — secret management

Follow the exact pattern established in spec-0009 and spec-0010.

### `infra/variables.tf` — add

```hcl
variable "github_mcp_token" {
  description = "Fine-grained GitHub PAT for HQ GitHub MCP integration — read-only, scoped to DevOpsKev/kevin-ryan-platform"
  type        = string
  sensitive   = true
}
```

### `infra/main.tf` — add alongside existing Key Vault secret resources

```hcl
resource "azurerm_key_vault_secret" "hq_github_mcp_token" {
  name         = "hq-github-mcp-token"
  value        = var.github_mcp_token
  key_vault_id = module.keyvault.key_vault_id
}
```

### `.github/workflows/terraform.yml` — add to both plan and apply job env sections

```yaml
TF_VAR_github_mcp_token: ${{ secrets.TF_VAR_GITHUB_MCP_TOKEN }}
```

### `k8s/hq-kevinryan-io/externalsecret.yaml` — add mapping

```yaml
    - secretKey: GITHUB_MCP_TOKEN
      remoteRef:
        key: hq-github-mcp-token
```

## 2. Updated system prompt

Update the `BASE_SYSTEM_PROMPT` and `DEMO_SYSTEM_PROMPT` in `sites/hq-kevinryan-io/app/api/chat/route.ts`.

Replace the existing `BASE_SYSTEM_PROMPT` with:

```typescript
const BASE_SYSTEM_PROMPT = `You are HQ — the operational AI assistant for Kevin Ryan & Associates, a boutique AI-Native engineering consultancy.

YOUR PLATFORM REPOSITORY
Your infrastructure, code, and operational documentation all live in one monorepo: DevOpsKev/kevin-ryan-platform

Key locations in the repo:
- .sdd/specification/ — SDD specs (numbered spec-NNNN-*). These define what has been built and what is in progress.
- docs/adr/ — Architecture Decision Records (ADR-NNN-*). These explain why decisions were made.
- sites/ — All web properties (kevinryan.io, hq.kevinryan.io, sddbook.com, aiimmigrants.com, specmcp.ai, distributedequity.org, brand.kevinryan.io)
- k8s/ — Kubernetes manifests for all deployed workloads
- infra/ — Terraform infrastructure (Azure, Cloudflare)
- .github/workflows/ — GitHub Actions CI/CD pipelines

You have live read access to this repository via GitHub tools. When asked about the platform, workstreams, deployments, specs, or ADRs — read the repo directly rather than relying on memory. Your memory may be stale; the repo is the source of truth.

YOUR IDENTITY AND CONTEXT
You have deep knowledge of:
- AI-Native Software Engineering and Spec Driven Development (SDD)
- DevOps, Platform Engineering, MLOps
- Kevin Ryan & Associates client portfolio (CERN, Nestlé, NatWest, BBC Worldwide, Financial Times, Vodafone, HelloFresh, Dematic, McKinsey, Barclays)
- The platform infrastructure (K3s on Azure, Flux CD, Terraform, GitHub Actions, Cloudflare)

You are direct, concise, and operationally focused. You think like an engineering leader.
You assist with: strategy, writing, technical decisions, platform operations, business development, and general reasoning.`
```

The `DEMO_SYSTEM_PROMPT` appends to the base prompt as before — no change to the demo redaction instructions, just update the base it extends from.

## 3. Updated chat API route

Update `sites/hq-kevinryan-io/app/api/chat/route.ts` to add the `mcp_servers` parameter to the Anthropic API call.

The change is minimal — add the MCP server configuration to the existing `client.messages.stream()` call:

```typescript
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 8192,
  system: systemPrompt,
  messages,
  mcp_servers: [
    {
      type: 'url',
      url: 'https://mcp.github.com/sse',
      name: 'github',
      authorization_token: process.env.GITHUB_MCP_TOKEN,
    },
  ],
} as Parameters<typeof client.messages.stream>[0])
```

**Design notes:**

- The `mcp_servers` parameter may not yet be in the TypeScript type definitions for `@anthropic-ai/sdk` depending on the version. The `as Parameters<typeof client.messages.stream>[0]` cast handles this. If the type definitions do include `mcp_servers`, remove the cast and use it directly.
- `process.env.GITHUB_MCP_TOKEN` is available at runtime via the K8s secret. It will be `undefined` at build time — this is expected and acceptable. The build does not call the API.
- If `GITHUB_MCP_TOKEN` is undefined at runtime, the MCP server will fail to authenticate. The route should not crash — the Anthropic API will return an error for the MCP tool calls but the base chat functionality will continue. Do not add a guard that disables MCP when the token is missing — surface the error so it is visible during debugging.

## 4. No UI changes

The chat interface (`ChatInterface.tsx`, `ChatHeader.tsx`, `ChatInput.tsx`, `MessageBubble.tsx`) requires no changes. The MCP tool calls are handled transparently by the Anthropic API — HQ will use GitHub tools automatically when relevant, and the responses appear as normal assistant messages in the existing UI.

The hint pills in `ChatInput.tsx` are already relevant: `what's in flight`, `last deploy status`, `open specs`, `platform health` — these will now trigger real GitHub reads.

## Constraints and Assumptions

- **Constraint:** The GitHub token must be read-only and scoped to `DevOpsKev/kevin-ryan-platform` only. This is enforced at token creation time by the human — the spec cannot enforce it technically beyond documenting the requirement.
- **Constraint:** The token is a runtime secret. It must never appear in committed code, Dockerfiles, or workflow files.
- **Constraint:** No write operations. HQ reads GitHub, it does not create issues, comment on PRs, or push commits. The token permissions enforce this.
- **Assumption:** The Anthropic API's `mcp_servers` parameter is supported on `claude-sonnet-4-20250514`. This was confirmed as of the spec authoring date.
- **Assumption:** `TF_VAR_GITHUB_MCP_TOKEN` GitHub secret will be added by the human before running Terraform.
- **Assumption:** The existing `hq-auth0-secrets` K8s secret will be updated in place by ESO when the new mapping is added to the ExternalSecret — no manual intervention required.

## Out of Scope

- Write access to GitHub — future spec if ever needed
- Access to repositories other than `DevOpsKev/kevin-ryan-platform`
- Azure integration — spec-0012
- Platform monitoring integration — spec-0013
- Displaying tool call activity in the UI (e.g. "reading GitHub...") — future iteration

## Manual steps (not performed by the agent)

**Before merging the PR:**

1. Create a fine-grained GitHub personal access token at `github.com/settings/tokens`:
   - Token name: `hq-kevinryan-io-mcp`
   - Expiration: 1 year
   - Resource owner: `DevOpsKev`
   - Repository access: `DevOpsKev/kevin-ryan-platform` only
   - Permissions: Contents (read), Pull requests (read), Actions (read), Issues (read), Metadata (read — mandatory)

2. Add GitHub Actions secret `TF_VAR_GITHUB_MCP_TOKEN` with the token value in repository Settings → Secrets and variables → Actions.

**After merging the PR:**

1. Run `terraform apply` to write the token to Key Vault.

2. Force ESO sync and restart the pod:

   ```bash
   az vm run-command invoke \
     --resource-group rg-kevinryan-io \
     --name vm-kevinryan-node1 \
     --command-id RunShellScript \
     --scripts "kubectl annotate externalsecret hq-auth0-secrets -n hq-kevinryan-io force-sync=$(date +%s) --overwrite && kubectl rollout restart deployment/hq-kevinryan-io -n hq-kevinryan-io 2>&1"
   ```

3. Visit `https://hq.kevinryan.io` and ask: *"What specs are currently in draft?"*
   HQ should read `.sdd/specification/` from the repo and return a list of specs with `draft: true` in their frontmatter.

4. Ask: *"What was the last deployment?"*
   HQ should read the recent workflow runs and return the last successful deploy.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

1. This spec has been saved to `.sdd/specification/spec-0011-hq-github-mcp.md`
2. `infra/variables.tf` contains `github_mcp_token` variable with `sensitive = true`
3. `infra/main.tf` contains `azurerm_key_vault_secret.hq_github_mcp_token` resource with name `hq-github-mcp-token`
4. `.github/workflows/terraform.yml` passes `TF_VAR_github_mcp_token` in both plan and apply jobs
5. `k8s/hq-kevinryan-io/externalsecret.yaml` contains mapping `GITHUB_MCP_TOKEN → hq-github-mcp-token`
6. `sites/hq-kevinryan-io/app/api/chat/route.ts` contains `mcp_servers` in the Anthropic API call
7. `sites/hq-kevinryan-io/app/api/chat/route.ts` references `process.env.GITHUB_MCP_TOKEN`
8. `sites/hq-kevinryan-io/app/api/chat/route.ts` `BASE_SYSTEM_PROMPT` references `DevOpsKev/kevin-ryan-platform` and lists key repo locations
9. No UI files have been modified
10. `pnpm build` passes inside `sites/hq-kevinryan-io/`
11. `pnpm lint` passes
12. The provenance record exists at `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md`
13. All files are committed together in a single commit
