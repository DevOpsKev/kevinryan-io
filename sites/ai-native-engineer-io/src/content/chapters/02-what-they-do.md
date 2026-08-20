---
n: "02"
title: What an AI-Native Engineer Actually Does
status: live
mins: 16
---

<div class="sec-mark">§ 2.1</div>

## A working day, described honestly

<p class="t-lead">Descriptions of AI-native work tend to be either breathless or dismissive. Neither matches what the day actually looks like, which is mostly reading, deciding and arbitrating, punctuated by short bursts of extremely fast construction.</p>

The shape of the day inverts. Where the old pattern was a long build with short reviews, the new pattern is a long specification with short builds. The build is no longer where time goes and it is no longer where risk lives.

<div class="sec-mark">§ 2.2</div>

## Four things that fill the time

Specification, arbitration, verification design, and integration. In roughly that order of time spent.

- **Specification.** Turning a want into a set of statements that cannot be read two ways
- **Arbitration.** Deciding between plausible outputs when the spec permitted more than one
- **Verification design.** Deciding how you will know it is right, before it exists
- **Integration.** The part nobody automated, because it is where the organisation lives

Integration is the one that surprises people. Agents are excellent within a bounded context and poor across organisational seams, because the seams are political rather than technical. No model resolves whose team owns the schema.

<div class="sec-mark">§ 2.3</div>

## The skills that transfer, and the ones that do not

Systems thinking transfers completely. Debugging transfers, though the object of debugging changes from the code to the specification that produced it. Domain knowledge becomes more valuable, not less, because it is the thing the model does not have and cannot infer.

Speed of implementation does not transfer. Memorised API surface does not transfer. Neither does the reflex to reach for the keyboard when a problem appears, which is the hardest one to unlearn.
