---
title: "Provenance: Spec NNNN — <Title>"
draft: true
---

**Spec:** `.sdd/specification/spec-NNNN-<slug>.md`
**Executed:** <YYYY-MM-DD or ISO timestamp>
**Agent:** <agent model and interface, e.g. "Cursor (claude-4.6-opus)" or "Claude Code CLI (claude-sonnet-4-6)">

---

## Implementation Record

### Actions Taken

<!-- Chronological numbered list of EVERY action: files read, files created, files modified, files deleted, commands run, external lookups. Be specific — include file paths and what changed. -->

1. Read `path/to/file` for context
2. Created `path/to/new-file`
3. Modified `path/to/existing-file` — description of change
4. Ran `command` — result

### Decisions Made

<!-- Document any decisions made that were NOT explicitly dictated by the spec. Use the table format below. If the spec was fully prescriptive, use the "no autonomous decisions" statement instead. -->

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| ... | ... | ... | ... |

<!-- OR, if no decisions were needed: -->
<!-- No autonomous decisions were required — all actions were explicitly specified in the spec. -->

### Assumptions

<!-- Decisions made where the spec was silent. Reviewers will specifically target these for scenario generation. Be honest and thorough — undocumented assumptions become invisible bugs. -->

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | <what you assumed> | <which section was silent> | <why this seemed reasonable> |

### Ambiguities

<!-- Places where the spec could be read more than one way. Record your interpretation. Reviewers will generate scenarios to test whether your interpretation was correct. -->

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | <what was ambiguous> | <section ref> | <how you read it> | <how else it could be read> |

### Deviations from Spec

<!-- Any points where the implementation deviated from what the spec instructed, and why. If none: -->

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-NNNN-<slug>.md` | Created |
| `path/to/file` | Created / Modified / Deleted |
| `.sdd/provenance/spec-NNNN-<slug>.provenance.md` | Created |

### Build Status

<!-- Added when the build is complete. Summary of what was built, what's working, any known limitations. -->

**Status:** Complete / Partial
**Summary:** <what was built>
**Known limitations:** <anything the implementer knows isn't perfect>

### Validation Results

<!-- One entry per validation step from the spec. -->

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/` | Pass |
| 2 | Description of check | Pass / Fail — details |

---

## Review Record

<!-- This section is written by the reviewer. The implementer must not modify this section. On subsequent cycles, the implementer reads this section to understand what failed and why. -->

**Reviewed:** <YYYY-MM-DD or ISO timestamp>
**Agent:** <agent model and interface>
**Scenarios:** `.sdd/scenarios/spec-NNNN-<slug>.scenarios.md`

### Findings

<!-- What the reviewer discovered by comparing the spec against the implementation provenance. This is the analysis that drives scenario generation. -->

#### Gaps

<!-- Requirements in the spec that the provenance does not address. -->

| # | Spec Requirement | Finding |
|---|-----------------|---------|
| G1 | <spec reference> | <what appears to be missing> |

#### Assumption Challenges

<!-- Implementer assumptions the reviewer is specifically targeting. -->

| # | Implementer Assumption | Challenge | Scenario |
|---|------------------------|-----------|----------|
| C1 | <ref to assumption A1, A2 etc.> | <why this assumption may be wrong> | <ref to scenario S-NNN> |

#### Ambiguity Assessments

<!-- Reviewer's view on the implementer's interpretation of ambiguities. -->

| # | Implementer Ambiguity | Assessment | Scenario |
|---|------------------------|------------|----------|
| D1 | <ref to ambiguity B1, B2 etc.> | <whether the interpretation seems sound> | <ref to scenario S-NNN> |

#### Silences

<!-- Things the implementer did not mention that the reviewer expected to see. -->

| # | Expected | Observation |
|---|----------|-------------|
| E1 | <what was expected based on the spec> | <what's missing from provenance> |

### Scenario Results

| Scenario | Title | Result | Notes |
|----------|-------|--------|-------|
| S-001 | <title> | Pass / Fail | <brief detail> |
| S-002 | <title> | Pass / Fail | <brief detail> |

### Recommendations

<!-- For each failing scenario, what should happen next. -->

| Scenario | Recommendation | Action For |
|----------|---------------|------------|
| S-NNN | Fix implementation — <description> | Implementer |
| S-NNN | Clarify spec — <what's ambiguous> | Human / Spec Author |
| S-NNN | Update provenance — <what's missing> | Implementer |
