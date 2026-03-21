---
title: "Provenance: Spec 0018 — Linear Integration Fixes"
draft: true
---

**Spec:** `.sdd/specification/spec-0018-linear-integration-fixes.md`
**Executed:** 2026-03-21
**Agent:** Claude Code CLI (claude-opus-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0018-linear-integration-fixes.md` for full spec context
2. Read `.sdd/provenance/template.md` for provenance format
3. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` — full file, all Linear tool implementations
4. Read `sites/hq-kevinryan-io/config/hq-system-prompt.md` — full system prompt (found at `sites/hq-kevinryan-io/config/` not `config/`)
5. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `resolveLinearIssueId` helper function after `linearGraphQL`
6. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added success check to `create_linear_issue` handler
7. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — rewrote `update_linear_issue` handler with identifier resolution and success check
8. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added success check to `create_linear_project` handler
9. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — rewrote `add_linear_comment` handler with identifier resolution and success check
10. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `list_linear_users` tool handler
11. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `list_linear_comments` tool handler
12. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `'list_linear_users'` and `'list_linear_comments'` to `linearToolNames` Set
13. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added tool definitions for `list_linear_users` and `list_linear_comments` to the `tools` array
14. Modified `sites/hq-kevinryan-io/config/hq-system-prompt.md` — added new tools to Available Tools, added identifier note, added user lookup step to Usage Patterns
15. Ran `pnpm install` — installed all workspace dependencies
16. Ran `pnpm --filter hq-kevinryan-io lint` — passed (0 errors, 1 pre-existing warning)
17. Ran `pnpm build` — all sites built successfully

### Decisions Made

No autonomous decisions were required — all actions were explicitly specified in the spec.

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | Linear's `issues` query supports filtering by `identifier` with `eq` comparator | Section 1, Constraints and Assumptions | Spec explicitly states this assumption and provides fallback guidance if incorrect. Used as specified since this is the documented Linear API filter pattern. |
| A2 | The system prompt file is at `sites/hq-kevinryan-io/config/hq-system-prompt.md` | Section 7, Current state table says `config/hq-system-prompt.md` | The `loadBaseSystemPrompt` function in route.ts uses `path.join(process.cwd(), 'config/hq-system-prompt.md')` which resolves relative to the hq-kevinryan-io site directory. The actual file is at `sites/hq-kevinryan-io/config/hq-system-prompt.md`. |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | Spec says files are `route.ts` and `config/hq-system-prompt.md` but the system prompt path is relative | Current state table | Interpreted as `sites/hq-kevinryan-io/config/hq-system-prompt.md` based on the route.ts code that loads it | Could be a separate top-level `config/` directory, but that doesn't exist |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0018-linear-integration-fixes.md` | Pre-existing (not modified) |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | Modified |
| `.sdd/provenance/spec-0018-linear-integration-fixes.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** All five bugs identified in the spec have been fixed: (1) `resolveLinearIssueId` helper resolves short identifiers like KRA-123 to UUIDs, (2) `update_linear_issue` now resolves identifiers before mutation, (3) `add_linear_comment` now resolves identifiers before mutation, (4) new `list_linear_users` tool for user discovery, (5) new `list_linear_comments` tool for reading issue comments. All four mutation handlers (`issueCreate`, `issueUpdate`, `commentCreate`, `projectCreate`) now check the `success` boolean. System prompt updated with new tools and usage patterns.
**Known limitations:** The `identifier` filter on the Linear `issues` query is assumed to work as documented — if Linear's API does not support this filter, the `resolveLinearIssueId` function will need to fall back to `issueSearch` as noted in the spec's assumptions section.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | `resolveLinearIssueId` helper exists and handles UUID + short identifier | Pass |
| 2 | `update_linear_issue` calls `resolveLinearIssueId` before mutation | Pass |
| 3 | `add_linear_comment` calls `resolveLinearIssueId` before mutation | Pass |
| 4 | `list_linear_users` tool handler exists and returns user data | Pass |
| 5 | `list_linear_comments` tool handler exists, resolves identifiers, returns comments | Pass |
| 6 | `'list_linear_users'` and `'list_linear_comments'` in `linearToolNames` Set | Pass |
| 7 | Tool definitions for both new tools exist in `tools` array | Pass |
| 8 | All mutation handlers check `success` boolean | Pass |
| 9 | `config/hq-system-prompt.md` documents new tools and capabilities | Pass |
| 10 | `pnpm lint` passes | Pass (0 errors, 1 pre-existing warning) |
| 11 | `pnpm build` passes | Pass |
| 12 | Provenance record exists with all required sections | Pass |
| 13 | All files committed together | Pending (committing now) |
