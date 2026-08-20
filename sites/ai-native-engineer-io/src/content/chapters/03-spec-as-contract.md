---
n: "03"
title: The Specification as Contract
status: live
mins: 18
---

<div class="sec-mark">§ 3.1</div>

## What makes a specification a contract

<p class="t-lead">A description becomes a contract when something downstream can be held to it. Prose descriptions cannot do this. They accommodate. You can read a paragraph of intent, build something that satisfies one reading of it, and no artefact anywhere will disagree with you.</p>

A specification is a contract when three things are true. It is committed before the work starts. It is the sole authority when the code and the description disagree. And the tests are derived from it rather than from the implementation.

<div class="callout callout--note">
  <span class="callout-label">The rule that does the work</span>
  <p>Commit the specification to the repository before any builder agent runs. If the spec is not in version control before generation, you have no contract. You have a chat log.</p>
</div>

<div class="sec-mark">§ 3.2</div>

## The shape of a locked spec

Specifications that work with agents share a structure. Intent stated once. Behaviour as discrete numbered statements. Explicit non-goals. Open questions marked as blocking rather than quietly resolved.

<figure class="code">
  <figcaption><span>specs/014-rate-limit/spec.md</span><button class="btn-copy" type="button" data-copy>Copy</button></figcaption>
  <pre><code><span class="tok-key">---</span>
<span class="tok-num">id</span>: <span class="tok-str">014-rate-limit</span>
<span class="tok-num">status</span>: <span class="tok-str">locked</span>
<span class="tok-num">authority</span>: <span class="tok-str">this document</span>
<span class="tok-key">---</span>

<span class="tok-key">## Intent</span>
Protect the payments API from a single tenant
consuming shared capacity during peak events.

<span class="tok-key">## Behaviour</span>
B1. Limit is applied per tenant id, not per IP.
B2. Limit is 120 requests per rolling 60 seconds.
B3. On rejection, return 429 with Retry-After
    in whole seconds.
B4. The counter is shared across all instances.
B5. Health check paths are exempt.

<span class="tok-key">## Non-goals</span>
N1. No per-endpoint differentiation in this spec.
N2. No burst allowance. Deliberate.

<span class="tok-key">## Open</span>
<span class="tok-com">O1. BLOCKING. Behaviour when the shared counter
    store is unavailable: fail open or fail closed?</span></code></pre>
</figure>

Compare that with the sentence in chapter one. The three silent decisions are now B1, B3 and B4. The fourth decision, the one nobody had thought about, is sitting in the open section blocking the build. That is the specification doing its job.

<div class="sec-mark">§ 3.3</div>

## Blocking questions are the point

Teams new to this treat the open section as friction and push to resolve everything so the build can start. That is exactly backwards. The open section is where the specification earns its cost. Every blocking question found before generation is a defect that never existed.

The failure mode is the resolved-by-default question. Someone decides fail open on a Thursday afternoon without writing down why, and eighteen months later nobody can reconstruct whether it was a decision or an accident. Which is chapter five.

<div class="sec-mark">§ 3.4</div>

## Handling drift

Code will drift from the spec. This is not a failure of discipline, it is what happens when reality arrives. The question is which one wins.

Under a contract model the specification wins by default, and the code is brought back into line or the specification is amended deliberately with a new version and a recorded reason. What must not happen is silent divergence, where the specification remains in the repository looking authoritative while describing something that no longer exists. A stale spec is more dangerous than no spec, because people trust it.

> An out of date specification is not documentation debt. It is a false statement about the system, sitting in version control, signed by your team.
