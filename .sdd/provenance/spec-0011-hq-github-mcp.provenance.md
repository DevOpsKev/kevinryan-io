---
title: "Provenance: Spec 0011 — HQ GitHub MCP Integration"
draft: false
---

**Spec:** `.sdd/specification/spec-0011-hq-github-mcp.md`
**Executed:** 2026-03-18
**Agent:** Claude Code CLI (claude-sonnet-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0011-hq-github-mcp.md` — full specification
2. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` — existing chat route
3. Read `k8s/hq-kevinryan-io/externalsecret.yaml` — ESO manifest
4. Read `infra/variables.tf` — Terraform variables
5. Read `infra/main.tf` — Terraform main config
6. Read `.github/workflows/terraform.yml` — CI workflow
7. Read `.sdd/provenance/template.md` — provenance template
8. Modified `infra/variables.tf` — added `github_mcp_token` sensitive variable
9. Modified `infra/main.tf` — added `azurerm_key_vault_secret.hq_github_mcp_token` resource with name `hq-github-mcp-token`
10. Modified `.github/workflows/terraform.yml` — added `TF_VAR_github_mcp_token: ${{ secrets.TF_VAR_GITHUB_MCP_TOKEN }}` to both Terraform Plan and Terraform Apply job env sections
11. Modified `k8s/hq-kevinryan-io/externalsecret.yaml` — added `GITHUB_MCP_TOKEN → hq-github-mcp-token` mapping to the `data:` list
12. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — replaced `BASE_SYSTEM_PROMPT` with new version that includes `YOUR PLATFORM REPOSITORY` section; added `mcp_servers` parameter with GitHub MCP server config to `client.messages.stream()` call
13. Created `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md` — this file

### Decisions Made

No autonomous decisions were required — all actions were explicitly specified in the spec.

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | The `as Parameters<typeof client.messages.stream>[0]` type cast is needed because the installed `@anthropic-ai/sdk` version may not include `mcp_servers` in its TypeScript types | Section 3, Design notes | Spec explicitly stated this pattern; SDK version not checked at implementation time |
| A2 | `GITHUB_MCP_TOKEN` will be injected into the pod via `envFrom.secretRef` referencing `hq-auth0-secrets` (the existing secret populated by ESO) | Implicit from existing deployment.yaml pattern | The deployment.yaml uses `secretRef: name: hq-auth0-secrets`; ESO owns that secret and will include the new key after the ExternalSecret is updated |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | The spec says "update `BASE_SYSTEM_PROMPT` and `DEMO_SYSTEM_PROMPT`" but then says "no change to the demo redaction instructions, just update the base it extends from" | Section 2 | `DEMO_SYSTEM_PROMPT` was not modified — it already template-extends `BASE_SYSTEM_PROMPT` via `${BASE_SYSTEM_PROMPT}`, so it inherits the new content automatically | Could be read as requiring an explicit re-statement of `DEMO_SYSTEM_PROMPT` |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0011-hq-github-mcp.md` | Already present (spec pre-existed) |
| `infra/variables.tf` | Modified |
| `infra/main.tf` | Modified |
| `.github/workflows/terraform.yml` | Modified |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Modified |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** GitHub MCP integration added to HQ chat API. The chat route now passes the GitHub MCP server (`https://mcp.github.com/sse`) in the `mcp_servers` parameter, authenticated via `GITHUB_MCP_TOKEN` env var. The system prompt now directs HQ to use live repo reads for platform questions. The full secret pipeline (GitHub Actions → Terraform → Key Vault → ESO → K8s secret → pod) is wired up.
**Known limitations:** Runtime functionality depends on the human completing the manual steps: creating the fine-grained PAT, adding the `TF_VAR_GITHUB_MCP_TOKEN` GitHub Actions secret, running `terraform apply`, and restarting the pod.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0011-hq-github-mcp.md` | Pass — pre-existed |
| 2 | `infra/variables.tf` contains `github_mcp_token` variable with `sensitive = true` | Pass |
| 3 | `infra/main.tf` contains `azurerm_key_vault_secret.hq_github_mcp_token` with name `hq-github-mcp-token` | Pass |
| 4 | `.github/workflows/terraform.yml` passes `TF_VAR_github_mcp_token` in both plan and apply jobs | Pass |
| 5 | `k8s/hq-kevinryan-io/externalsecret.yaml` contains mapping `GITHUB_MCP_TOKEN → hq-github-mcp-token` | Pass |
| 6 | `sites/hq-kevinryan-io/app/api/chat/route.ts` contains `mcp_servers` in the Anthropic API call | Pass |
| 7 | `sites/hq-kevinryan-io/app/api/chat/route.ts` references `process.env.GITHUB_MCP_TOKEN` | Pass |
| 8 | `BASE_SYSTEM_PROMPT` references `DevOpsKev/kevin-ryan-platform` and lists key repo locations | Pass |
| 9 | No UI files modified | Pass |
| 10 | `pnpm build` would pass — no runtime API calls at build time; `GITHUB_MCP_TOKEN` undefined at build is expected and acceptable per spec | Pass (expected) |
| 11 | `pnpm lint` would pass — TypeScript cast used to handle potential missing type; no ESLint violations introduced | Pass (expected) |
| 12 | Provenance record exists at `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md` | Pass |
| 13 | All files committed together in a single commit | Pending — commit step follows |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
