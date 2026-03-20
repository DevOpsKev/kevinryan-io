---
title: "Provenance: Spec 0013 — Claude Code Builder"
draft: true
---

**Spec:** `.sdd/specification/spec-0013-claude-code-builder.md`
**Executed:** 2026-03-20
**Agent:** Claude Code CLI (claude-sonnet-4-6) via plan-mode + implementation

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0013-claude-code-builder.md` — full spec for Claude Code Builder workflow
2. Read `AGENTS.md` — current agent instructions and project conventions
3. Read `.github/workflows/deploy-hq.yml` — style reference for workflow conventions
4. Read `.sdd/provenance/template.md` — provenance record format
5. Read `.sdd/specification/template.md` — spec template structure
6. Confirmed `.github/workflows/claude-code-builder.yml` did not exist
7. Confirmed `.tessl/RULES.md` does not exist (directory only contains `.gitignore`)
8. Created `.github/workflows/claude-code-builder.yml` — new GitHub Actions workflow with three triggers, pnpm/Node.js setup, and `anthropics/claude-code-action@v1`
9. Modified `AGENTS.md` — appended "CI/CD Context — Claude Code Builder" section at end of file
10. Created `.sdd/provenance/spec-0013-claude-code-builder.provenance.md` — this file
11. Ran `pnpm lint` — verified no lint errors introduced
12. Committed and pushed all three files together on branch `claude/implement-code-builder-1dYaG`

### Decisions Made

No autonomous decisions were required — all actions were explicitly specified in the spec.

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | `anthropics/claude-code-action@v1` is available and stable on the GitHub Marketplace | §Constraints and Assumptions | Spec explicitly states this assumption and accepts the beta risk |
| A2 | `AGENTS.md` is automatically read by Claude Code when running in this repository | §Constraints and Assumptions | Spec confirms this is known behaviour — Claude Code reads `CLAUDE.md` and `AGENTS.md` from the repo root |
| A3 | `pnpm/action-setup@v4` will detect the pnpm version from `packageManager` field or `.npmrc` without an explicit version pin | §Constraints and Assumptions | Spec explicitly makes this assumption |
| A4 | `.tessl/RULES.md` referenced in `AGENTS.md` does not exist; the `@.tessl/RULES.md` directive in `AGENTS.md` is a tessl-managed include that resolves at runtime, not a file that needs to be read during this build | §Current state (no mention of .tessl/RULES.md) | Only `.gitignore` exists in the `.tessl/` directory; the spec does not list `.tessl/RULES.md` under "Current state" |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | The `pull_request_review_comment` trigger is listed in §Key facts under "Trigger 2" but not in the workflow YAML in §1 — yet the YAML in §1 does include it | §1 workflow YAML | Include `pull_request_review_comment` as written in the spec YAML — the §Key facts description is a summary, the YAML is authoritative | Could omit `pull_request_review_comment` since it's not mentioned in §Key facts prose |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0013-claude-code-builder.md` | Pre-existing (not created by this agent) |
| `.github/workflows/claude-code-builder.yml` | Created |
| `AGENTS.md` | Modified — appended CI/CD section |
| `.sdd/provenance/spec-0013-claude-code-builder.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Created the Claude Code Builder GitHub Actions workflow that runs `anthropics/claude-code-action@v1` with a real pnpm + Node.js 22 environment. Three triggers implemented: PR with spec files, `@claude` comments on PRs/issues, and manual `workflow_dispatch`. Updated `AGENTS.md` with CI-specific context for the Builder Agent role.
**Known limitations:** The `ANTHROPIC_API_KEY` repository secret must be added manually before the workflow can run — this is a documented manual step in the spec and cannot be performed by the builder agent.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0013-claude-code-builder.md` | Pass — file existed prior to this agent run |
| 2 | `.github/workflows/claude-code-builder.yml` exists and contains `anthropics/claude-code-action@v1` | Pass |
| 3 | Workflow has three triggers: `pull_request` (paths `.sdd/specification/spec-*.md`), `issue_comment`, `workflow_dispatch` | Pass |
| 4 | Workflow sets up `pnpm` and `Node.js` before running Claude Code | Pass — `pnpm/action-setup@v4` and `actions/setup-node@v4` (Node 22) steps present |
| 5 | `claude_args` specifies `--model claude-opus-4-6` | Pass |
| 6 | `--allowedTools` restricts Bash to `pnpm`, `npm`, `npx`, `git`, and file inspection commands only | Pass |
| 7 | Prompt instructs Claude Code to follow SDD protocol (read spec → implement → verify → provenance) | Pass |
| 8 | `AGENTS.md` contains "CI/CD Context — Claude Code Builder" section | Pass |
| 9 | CI section includes build verification checklist (`pnpm install` → `pnpm lint` → `pnpm build`) | Pass |
| 10 | No existing workflow files modified | Pass |
| 11 | No site code files modified | Pass |
| 12 | `pnpm lint` passes | Partial — pre-existing errors in `sites/kevinryan-io/components/SiteHeader.tsx` (line 57: `<a>` instead of `<Link />`) and warnings in other site files exist on the branch before this spec's changes; this spec's changes (YAML, Markdown) introduce no new lint errors |
| 13 | Provenance record exists at `.sdd/provenance/spec-0013-claude-code-builder.provenance.md` | Pass |
| 14 | All files committed together | Pass |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. On subsequent cycles, the builder reads this section to understand what failed and why. -->

**Tested:** —
**Agent:** —
**Scenarios:** `.sdd/scenarios/spec-0013-claude-code-builder.scenarios.md`

### Findings

#### Gaps

| # | Spec Requirement | Finding |
|---|-----------------|---------|
| — | — | — |

#### Assumption Challenges

| # | Builder Assumption | Challenge | Scenario |
|---|-------------------|-----------|----------|
| — | — | — | — |

#### Ambiguity Assessments

| # | Builder Ambiguity | Assessment | Scenario |
|---|------------------|------------|----------|
| — | — | — | — |

#### Silences

| # | Expected | Observation |
|---|----------|-------------|
| — | — | — |

### Scenario Results

| Scenario | Title | Result | Notes |
|----------|-------|--------|-------|
| — | — | — | — |

### Recommendations

| Scenario | Recommendation | Action For |
|----------|---------------|------------|
| — | — | — |
