---
title: "Scenarios: Spec NNNN — <Title>"
draft: true
---

**Spec:** `.sdd/specification/spec-NNNN-<slug>.md`
**Provenance:** `.sdd/provenance/spec-NNNN-<slug>.provenance.md`
**Generated:** <YYYY-MM-DD or ISO timestamp>
**Agent:** <agent model and interface>

---

## Summary

<!-- Brief overview of what was found and what's being tested. Written for a human reviewer who may not be technical. -->

**Total scenarios:** <N>
**Triggered by gaps:** <N>
**Triggered by assumptions:** <N>
**Triggered by ambiguities:** <N>
**Triggered by silences:** <N>
**Triggered by requirements coverage:** <N>

---

## Scenarios

### S-001: <Descriptive title>

**Triggered by:** <Gap G1 / Assumption A1 / Ambiguity B1 / Silence E1 / Requirement FR-001>
**Spec reference:** <section or requirement ID in the spec>
**Provenance reference:** <section or entry in the provenance, if applicable>

**Context:**

<!-- Plain language explanation of why this scenario exists. A product owner should be able to read this paragraph and understand what's being tested and why it matters. -->

<Explain what the spec requires, what the builder did (or didn't do), and what the gap or risk is. This is the testing agent's reasoning, not just a test description.>

**Expects:**

<!-- What should happen if the software is correct. Written as observable outcomes, not implementation details. -->

- <Expected behaviour or outcome>
- <Expected behaviour or outcome>

**Fails if:**

<!-- What would constitute a failure. Be specific. -->

- <Failure condition>
- <Failure condition>

**Test implementation:** `tests/<path-to-test-file>#<test-name-or-line>`

---

### S-002: <Descriptive title>

**Triggered by:** <source>
**Spec reference:** <section>
**Provenance reference:** <section>

**Context:**

<Explanation>

**Expects:**

- <Expected behaviour>

**Fails if:**

- <Failure condition>

**Test implementation:** `tests/<path-to-test-file>#<test-name-or-line>`

---

<!-- Repeat for each scenario. -->

## Scenarios Not Generated

<!-- Document any areas where the testing agent considered generating a scenario but decided not to, and why. This is important for audit — it shows the testing agent's coverage reasoning. -->

| Area | Reason Not Tested |
|------|------------------|
| <spec section or topic> | <why a scenario wasn't needed — e.g. "fully prescribed in spec with no builder discretion"> |
