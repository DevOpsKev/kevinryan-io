---
title: "Spec NNNN: <Title>"
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
- A provenance record at `.sdd/provenance/spec-NNNN-<slug>.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-NNNN-<slug>.md` in the repo. This is the canonical reference. Do not modify it after saving.
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
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-NNNN-<slug>.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-NNNN-<slug>.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-NNNN-<slug>.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-NNNN-<slug>.provenance.md` in full.
3. Compare the provenance against the specification. Identify:
   - **Gaps:** Requirements in the spec that the provenance does not address.
   - **Assumptions:** Decisions the builder made where the spec was silent. These are primary targets for scenarios.
   - **Ambiguities:** Places where the builder interpreted an ambiguous requirement. Generate scenarios that test whether the interpretation was reasonable.
   - **Silences:** Things the provenance does not mention at all. These may indicate missing implementation or missing provenance.
   - **Deviations:** Anywhere the builder deviated from the spec. Generate scenarios that test the impact.
4. Write prose scenarios to `.sdd/scenarios/spec-NNNN-<slug>.scenarios.md`. Each scenario must:
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

1. Save this spec to `.sdd/specification/spec-NNNN-<slug>.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-NNNN-<slug>.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

<!-- List prior specs that must be deployed, and ADRs the agent should read for context. -->

- Spec XXXX deployed: <what must be true>
- Read ADR-NNN (`docs/adr/adr-NNN-<slug>.md`) — <why it matters>

## Context

<!-- Explain WHY this work is needed. Reference the ADR that mandates it. Describe the current state of the system and any lessons learned from prior specs that affect this one. -->

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `path/to/file` | Brief description |

### Key facts

<!-- Bullet list of concrete values the agent will need: image names, ports, hostnames, secret names, chart URLs, node taints, etc. -->

- **Item:** value
- **Item:** value

## 1. <First implementation section>

<!-- Number each major section. Be explicit about WHAT to create/modify and WHERE. Include full code blocks for manifests, HCL, or config the agent should produce. -->

### <Subsection>

```yaml
# Include complete manifests — don't leave the agent guessing
```

**Design notes:**

- Explain non-obvious choices so the agent (and future readers) understand the rationale.
- Call out constraints: why this value, why this pattern, why not the alternative.

## 2. <Second implementation section>

<!-- Continue numbering. Each section should be one logical unit of work (e.g. "Terraform changes", "Kubernetes manifests", "Flux sync"). -->

## Constraints and Assumptions

<!-- Explicit constraints and assumptions the spec author is making. The builder agent should validate these, and the testing agent should generate scenarios that challenge them. -->

- **Constraint:** <description>
- **Assumption:** <description — the testing agent will specifically target these>

## Out of Scope

<!-- What this spec explicitly does NOT cover. Prevents agents from over-building. -->

- <thing not being done and why>

## Manual steps (not performed by the agent)

<!-- Steps the human operator must perform after the code changes are merged. Include exact commands. -->

1. `command` — what it does
2. `command` — what to expect

Verify:

```bash
verification-command
```

## Provenance Record

After completing the work, create `.sdd/provenance/spec-NNNN-<slug>.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

<!-- Numbered checklist. Each item should be independently verifiable. Cover: file existence, content correctness, linting, formatting, no regressions, provenance completeness, commit integrity. -->

1. This spec has been saved to `.sdd/specification/spec-NNNN-<slug>.md`
2. <File/directory exists with expected contents>
3. <Specific content check — be precise about what to look for>
4. `terraform fmt -check -recursive infra/` passes (if Terraform files changed)
5. `pnpm lint` passes (if site code or markdown changed)
6. The provenance record exists at `.sdd/provenance/spec-NNNN-<slug>.provenance.md` and contains all required sections
7. All files (spec, implementation, provenance) are committed together
