---
title: "Provenance: Spec 0017 — HQ Linear Integration"
draft: true
---

**Spec:** `.sdd/specification/spec-0017-hq-linear-integration.md`
**Executed:** 2026-03-21
**Agent:** Claude Code CLI (claude-opus-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0017-hq-linear-integration.md` — full spec
2. Read `.sdd/provenance/template.md` — provenance template
3. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` — existing chat API route with GitHub tools
4. Read `k8s/hq-kevinryan-io/deployment.yaml` — K8s deployment config
5. Read `k8s/hq-kevinryan-io/externalsecret.yaml` — ExternalSecret for Azure Key Vault secrets
6. Read `sites/hq-kevinryan-io/config/hq-system-prompt.md` — system prompt (found at `sites/` path, not `config/`)
7. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `LINEAR_API_URL` constant, `linearGraphQL` helper function, `executeLinearTool` function handling all 9 tool names, `linearToolNames` Set for routing, 9 Linear tool definitions in the `tools` array, and updated the agentic loop to route Linear tool calls to `executeLinearTool`
8. Modified `k8s/hq-kevinryan-io/externalsecret.yaml` — added `LINEAR_API_KEY` entry referencing `hq-linear-api-key` in Azure Key Vault
9. Modified `sites/hq-kevinryan-io/config/hq-system-prompt.md` — added Linear Project Management Tools section after GitHub Write Tools section
10. Ran `pnpm install` — success
11. Ran `pnpm lint` — hq-kevinryan-io passes (1 pre-existing warning about custom fonts, 0 errors)
12. Ran `pnpm build` — success, all routes generated correctly
13. Created `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` — this file

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| System prompt file path | `config/hq-system-prompt.md` (spec reference) vs `sites/hq-kevinryan-io/config/hq-system-prompt.md` (actual location) | Actual location | The spec references `config/hq-system-prompt.md` but the file lives at `sites/hq-kevinryan-io/config/hq-system-prompt.md`. The `route.ts` loads it with `path.join(process.cwd(), 'config/hq-system-prompt.md')` which resolves correctly at runtime since `process.cwd()` is the hq site directory. |
| Placement of Linear section in system prompt | Before Safety Rules vs after Safety Rules | Before Safety Rules | The spec says "after the GitHub Write Tools section". Safety Rules is a subsection under GitHub Write Tools, so the Linear section was placed before Safety Rules to keep it as a peer section to GitHub Write Tools. |
| GraphQL filter construction for `search_linear_issues` | String interpolation vs dynamic filter object | Dynamic filter object | Spec says "build a GraphQL filter object dynamically based on which inputs are provided". Used nested objects matching Linear's GraphQL filter schema (e.g. `{ team: { id: { eq: teamId } } }`). |
| Response extraction pattern | Return raw GraphQL response vs extract nested data | Extract nested data | Spec says "Return: JSON array of teams" etc. Extracted the `nodes` array from the GraphQL response to return clean arrays rather than the full GraphQL envelope. Falls back to raw data if extraction fails. |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | Linear GraphQL filter for team uses `{ team: { id: { eq: teamId } } }` nested structure | Section 1.2, "Build a GraphQL filter object dynamically" | This matches Linear's documented GraphQL filter schema pattern |
| A2 | Linear GraphQL filter for state type uses `{ state: { type: { eq: stateType } } }` | Section 1.2 | Consistent with Linear's filter nesting conventions |
| A3 | Linear GraphQL filter for label name uses `{ labels: { name: { eq: labelName } } }` | Section 1.2 | Linear supports filtering by label name in this format |
| A4 | Linear project state filter uses `{ state: { eq: state } }` | Section 1.5 | Linear project state is a simple enum field, not a nested object |
| A5 | The `issueSearch` query is used only when `query` is provided; other filters are ignored when using text search | Section 1.2 | Spec defines two separate queries — `issueSearch` for text search, `issues` for filter-based search. The spec does not describe combining them. |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | The spec lists the system prompt path as `config/hq-system-prompt.md` but the actual file is at `sites/hq-kevinryan-io/config/hq-system-prompt.md` | Current state table | Modified the file at its actual location since that's what the runtime loads | Could have created a new file at the root `config/` path |
| B2 | "Add it after the GitHub Write Tools section" — the GitHub Write Tools section has subsections (Pre-Commit Discipline, Safety Rules) | Section 5 | Placed the Linear section before Safety Rules, making it a peer to GitHub Write Tools | Could place after Safety Rules, making it fully after all GitHub content |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0017-hq-linear-integration.md` | Already existed (committed in prior step) |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Modified |
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | Modified |
| `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Added Linear project management integration to HQ chat API. Implemented 9 Linear tools (list teams, search issues, create/update issues, list/create projects, add comments, list workflow states, list labels) using raw GraphQL via `fetch` with no new dependencies. Updated ExternalSecret for LINEAR_API_KEY and system prompt with Linear tools documentation.
**Known limitations:** The `search_linear_issues` tool uses either text search (`issueSearch`) OR filter-based search (`issues`), not both simultaneously. When `query` is provided, other filter parameters are ignored. This matches the spec but users may expect combined search+filter in a future iteration.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/` | Pass — already committed |
| 2 | `route.ts` contains `linearGraphQL` helper function | Pass |
| 3 | `route.ts` contains `executeLinearTool` function handling all 9 tool names | Pass |
| 4 | `route.ts` contains all 9 Linear tool definitions in the `tools` array | Pass |
| 5 | Agentic loop correctly routes Linear tool calls to `executeLinearTool` and GitHub tool calls to `executeGitHubTool` | Pass — uses `linearToolNames.has()` Set lookup |
| 6 | `externalsecret.yaml` includes `LINEAR_API_KEY` entry referencing `hq-linear-api-key` | Pass |
| 7 | System prompt contains Linear Project Management Tools section | Pass |
| 8 | `pnpm lint` passes | Pass — 0 errors (1 pre-existing warning) |
| 9 | `pnpm build` passes | Pass |
| 10 | No new dependencies added to `package.json` | Pass |
| 11 | Provenance record exists with all required sections | Pass |
| 12 | All files committed together | Pending — commit step next |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
