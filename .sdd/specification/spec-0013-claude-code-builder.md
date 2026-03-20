---
title: "Spec 0013: Claude Code Builder"
draft: true
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- `AGENTS.md` — current agent instructions for the repository
- `.github/workflows/deploy-hq.yml` — existing workflow as a style reference
- `.sdd/specification/template.md` — spec template (to understand what specs look like)
- `sites/hq-kevinryan-io/app/api/chat/route.ts` — current HQ system prompt and tool definitions

**Produces:**

- A new GitHub Actions workflow at `.github/workflows/claude-code-builder.yml`
- An updated `AGENTS.md` with CI-specific instructions for Claude Code
- A provenance record at `.sdd/provenance/spec-0013-claude-code-builder.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0013-claude-code-builder.md` in the repo.
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
- The provenance document at `.sdd/provenance/spec-0013-claude-code-builder.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0013-claude-code-builder.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document

---

## Task

1. Save this spec to `.sdd/specification/spec-0013-claude-code-builder.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0013-claude-code-builder.provenance.md`.

## Prerequisites

- Spec-0011 deployed: HQ chat interface with GitHub MCP tools is live.
- Spec-0012 deployed: HQ file download capability is live.
- Read `AGENTS.md` — current agent and build instructions for the repository.

## Context

HQ (the operational AI at `hq.kevinryan.io`) can read the platform repository, write files via the GitHub API, create branches, and open PRs. However, when HQ writes code through the GitHub API it bypasses the local development environment entirely. There is no `pnpm install` to update lockfiles, no `pre-commit` hooks to lint, no `pnpm build` to catch type errors. This leads to broken builds.

**The triggering incident:** HQ added `react-markdown` and `remark-gfm` to `package.json` via the GitHub API. Because no `pnpm install` ran, the `pnpm-lock.yaml` was not updated. The Docker build then failed on `pnpm install --frozen-lockfile` because the lockfile did not match `package.json`.

**The solution:** Introduce Claude Code as a Builder Agent that runs inside GitHub Actions. HQ writes specs (its strength — reasoning, architecture, design). Claude Code implements specs (its strength — code generation with a real dev environment). The workflow is:

```text
Kevin ↔ HQ (Opus)                    Claude Code (GitHub Action)
         │                                     │
         ├── 1. Discuss & agree scope          │
         ├── 2. Write spec to branch           │
         ├── 3. Open PR with spec ─────────────┤
         │                                     ├── 4. Read spec from PR
         │                                     ├── 5. Implement code changes
         │                                     ├── 6. Run pnpm install
         │                                     ├── 7. Run pre-commit hooks
         │                                     ├── 8. Run pnpm lint & pnpm build
         │                                     ├── 9. Commit & push to branch
         │                                     └── 10. Post summary comment on PR
         ├── 11. Review PR
Kevin ───┴── 12. Merge
```

This spec uses the official `anthropics/claude-code-action@v1` GitHub Action. Claude Code runs on the GitHub Actions runner with full access to the repository, file system, and git. It reads the `AGENTS.md` file automatically for project context. The action is triggered when HQ opens a PR containing a new spec, or when someone comments `@claude` on a PR or issue.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `AGENTS.md` | Agent instructions for the repository — extend with CI context |
| `.github/workflows/deploy-hq.yml` | Existing workflow — reference for style and conventions |
| `.github/workflows/terraform.yml` | Existing workflow — reference for secret patterns |
| `.sdd/specification/template.md` | Spec template — Claude Code must understand spec structure |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | HQ system prompt — no changes in this spec |

### Key facts

- **GitHub Action:** `anthropics/claude-code-action@v1`
- **Authentication:** `ANTHROPIC_API_KEY` repository secret (Anthropic direct API)
- **Model:** `claude-opus-4-6` (configured via `claude_args`)
- **Trigger 1:** PR opened or edited with a spec file in `.sdd/specification/`
- **Trigger 2:** `@claude` comment on any PR or issue
- **Trigger 3:** `workflow_dispatch` with a spec path input for manual runs
- **Runner:** `ubuntu-latest`
- **Branch prefix for Claude Code:** `claude/` (default)
- **Allowed tools:** Bash (pnpm, git, npm), Read, Write, Edit, Glob, Grep

## 1. GitHub Actions workflow — `.github/workflows/claude-code-builder.yml`

Create a new workflow file at `.github/workflows/claude-code-builder.yml`:

```yaml
name: Claude Code Builder

on:
  # Trigger 1: When HQ opens a PR containing a new spec
  pull_request:
    types: [opened, edited]
    paths:
      - ".sdd/specification/spec-*.md"

  # Trigger 2: @claude mention on PRs or issues
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

  # Trigger 3: Manual trigger with spec path
  workflow_dispatch:
    inputs:
      spec_path:
        description: "Path to the spec file (e.g. .sdd/specification/spec-0014-example.md)"
        required: true
        type: string

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

concurrency:
  group: claude-code-${{ github.event.pull_request.number || github.event.issue.number || github.run_id }}
  cancel-in-progress: false

jobs:
  claude-code:
    runs-on: ubuntu-latest
    # Only run on issue_comment if it contains @claude
    if: >
      github.event_name == 'pull_request' ||
      github.event_name == 'workflow_dispatch' ||
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude'))
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: |
            --model claude-opus-4-6
            --max-turns 50
            --allowedTools "Bash(pnpm:*),Bash(npm:*),Bash(npx:*),Bash(git:*),Bash(cat:*),Bash(ls:*),Bash(find:*),Bash(head:*),Bash(tail:*),Bash(grep:*),Bash(sed:*),Bash(echo:*),Bash(mkdir:*),Bash(cp:*),Bash(mv:*),Bash(cd:*),Read,Write,Edit,GlobTool,GrepTool,BatchTool"
          prompt: |
            You are the Builder Agent for the kevin-ryan-platform monorepo.

            WORKFLOW:
            1. Read the spec file and ALL files listed in its "Current state" table.
            2. Implement every change described in the spec.
            3. Run `pnpm install` if any package.json was modified.
            4. Run `pnpm lint` and fix any issues.
            5. Run `pnpm build` and fix any issues.
            6. Create the provenance record as described in the spec.
            7. Commit all changes with a clear commit message.

            RULES:
            - Follow AGENTS.md and .tessl/RULES.md for project conventions.
            - Never modify the spec file after saving it.
            - If a pre-commit hook fails, fix the issue and retry.
            - If pnpm build fails, fix the issue and retry.
            - Record every decision in the provenance document.
            - Do not skip validation steps listed in the spec.

            ${{ github.event_name == 'workflow_dispatch' && format('SPEC FILE: {0}', github.event.inputs.spec_path) || '' }}
```

**Design notes:**

- The `pnpm/action-setup` and `actions/setup-node` steps ensure Claude Code has a working Node.js/pnpm environment. This is what was missing when HQ wrote code directly via the GitHub API.
- The `--max-turns 50` gives Claude Code enough room for iterative fix cycles (build fails → fix → rebuild).
- The `--allowedTools` restricts Bash commands to safe development operations. Claude Code cannot run arbitrary commands — only `pnpm`, `npm`, `npx`, `git`, and common file inspection tools.
- The `concurrency` group prevents multiple Claude Code runs from conflicting on the same PR.
- The `if` condition on the job ensures issue comments only trigger when they contain `@claude`.
- When triggered by `workflow_dispatch`, the spec path is passed in the prompt so Claude Code knows which spec to implement.
- When triggered by a PR containing a new spec, Claude Code reads the PR diff to find the spec and implements it.
- When triggered by an `@claude` comment, Claude Code responds to the specific request in the comment.

## 2. Update `AGENTS.md` — CI-specific section

Append a new section to the existing `AGENTS.md` file. Do not modify existing sections — add the following at the end:

```markdown
## CI/CD Context — Claude Code Builder

When running as a GitHub Actions Builder Agent (via `claude-code-builder.yml`):

### Environment

- Runner: `ubuntu-latest` with Node.js 22 and pnpm
- Working directory: repository root
- Full git access: can commit and push to the PR branch

### Build Verification Checklist

After implementing changes, ALWAYS run these in order:

1. `pnpm install` — if any `package.json` was modified
2. `pnpm lint` — fix all lint errors before proceeding
3. `pnpm build` — fix all build errors before proceeding
4. Verify no untracked files that should be committed (especially lockfiles)

### Spec-Driven Development Protocol

When implementing a spec:

1. Read the spec file completely before making any changes
2. Read ALL files listed in the spec's "Current state" table
3. Implement changes section by section, in order
4. Create the provenance record using the template at `.sdd/provenance/template.md`
5. Commit spec, implementation, and provenance together

### Commit Conventions

- Imperative mood, present tense: "Add feature" not "Added feature"
- Reference the spec in the commit message: `[spec-0013] Add Claude Code builder workflow`
- One logical change per commit where practical

### Restrictions

- Never commit directly to `main`
- Never modify a spec file after the initial save
- Never skip the build verification checklist
- Never add dependencies without justification recorded in provenance
- If the spec is ambiguous, record the ambiguity in provenance and make a reasonable choice
```

## 3. Repository secret

The `ANTHROPIC_API_KEY` secret must be added to the repository. This is the same Anthropic API key used for HQ's chat backend, but stored as a GitHub Actions secret for Claude Code to use.

This is a manual step — the builder agent cannot create repository secrets.

## Constraints and Assumptions

- **Constraint:** Claude Code runs on `ubuntu-latest` GitHub-hosted runners. Build times count against the repository's GitHub Actions minutes quota.
- **Constraint:** The `ANTHROPIC_API_KEY` secret must be added manually to the repository before this workflow can run. Claude Code will fail with an auth error if the secret is missing.
- **Constraint:** The `--allowedTools` list is intentionally restrictive. Claude Code cannot install system packages, run Docker, or make arbitrary network requests via Bash. If a future spec requires broader tool access, update the allowed tools list.
- **Assumption:** `anthropics/claude-code-action@v1` is stable and available on the GitHub Marketplace. The action is currently marked as beta but is actively maintained by Anthropic.
- **Assumption:** The `AGENTS.md` file is read automatically by Claude Code when it runs in the repository. This is confirmed behaviour — Claude Code reads `CLAUDE.md` and `AGENTS.md` from the repo root.
- **Assumption:** `pnpm/action-setup@v4` will detect the pnpm version from the `packageManager` field in `package.json` or from `.npmrc`. No explicit version pin is needed.
- **Assumption:** The existing `deploy-hq.yml` workflow will continue to handle Docker builds and K8s deployments. This spec does NOT modify the deploy pipeline — Claude Code only handles code implementation and pre-merge verification.

## Out of Scope

- **HQ tool extension** (`trigger_claude_code`) — future spec. HQ currently writes specs and opens PRs manually. A dedicated tool to trigger `workflow_dispatch` from the chat interface will be added in a follow-up spec.
- **Claude Code for deployment** — Claude Code only implements code. It does not deploy, modify K8s manifests at deploy time, or interact with the cluster.
- **PR auto-review by Claude Code** — automatic code review on every PR is a separate concern. This spec focuses on implementation (Builder Agent), not review.
- **Testing Agent workflow** — a separate GitHub Action for the Testing Agent role (reading provenance, generating scenarios, running tests) will be a future spec.
- **Cost controls and budget limits** — Anthropic API usage by Claude Code is not capped in this iteration. Monitor usage and add `--max-budget-usd` in a future update if needed.

## Manual steps (not performed by the agent)

**Before merging the PR:**

1. Add `ANTHROPIC_API_KEY` to repository secrets at `Settings → Secrets and variables → Actions → New repository secret`. Use the same Anthropic API key that powers HQ's chat backend.

**After merging the PR:**

1. Test the workflow by manually triggering it:

   Go to `Actions → Claude Code Builder → Run workflow` and provide a spec path (e.g. an existing spec like `.sdd/specification/spec-0012-hq-file-download.md` — Claude Code should read it and report that it's already implemented).

2. Test the `@claude` trigger:

   Open any PR or issue and comment `@claude What files would this spec require me to change?`. Claude Code should respond with an analysis.

3. Verify that the existing `deploy-hq.yml` workflow is unaffected — push a change to `sites/hq-kevinryan-io/` and confirm the build and deploy pipeline still runs normally.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0013-claude-code-builder.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

1. This spec has been saved to `.sdd/specification/spec-0013-claude-code-builder.md`
2. `.github/workflows/claude-code-builder.yml` exists and contains the `anthropics/claude-code-action@v1` step
3. The workflow has three triggers: `pull_request` (paths `.sdd/specification/spec-*.md`), `issue_comment`, and `workflow_dispatch`
4. The workflow sets up `pnpm` and `Node.js` before running Claude Code
5. The `claude_args` specifies `--model claude-opus-4-6`
6. The `--allowedTools` restricts Bash to `pnpm`, `npm`, `npx`, `git`, and file inspection commands only
7. The `prompt` instructs Claude Code to follow the SDD protocol (read spec → implement → verify → provenance)
8. `AGENTS.md` contains a "CI/CD Context — Claude Code Builder" section
9. The CI section includes the build verification checklist (`pnpm install` → `pnpm lint` → `pnpm build`)
10. No existing workflow files have been modified
11. No site code files have been modified
12. `pnpm lint` passes (for any markdown changes)
13. The provenance record exists at `.sdd/provenance/spec-0013-claude-code-builder.provenance.md`
14. All files are committed together
