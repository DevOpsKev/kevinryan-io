---
n: "01"
title: The End of the Typing Bottleneck
status: live
mins: 14
---

<div class="sec-mark">§ 1.1</div>

## The assumption underneath everything

<p class="t-lead">Every practice in modern software engineering was designed around a single scarcity: writing correct code took a skilled person a long time. Code review exists because that person makes mistakes. Pair programming exists because two of them make fewer. Estimation exists because we needed to predict how long the typing would take.</p>

Remove the scarcity and the practices do not automatically fail. They just stop being aimed at anything. A code review that reads two hundred lines carefully was proportionate when two hundred lines was a day of work. It is theatre when two hundred lines is ninety seconds of work and there are four thousand more behind it.

This is the uncomfortable part. The practices are not wrong. They are aimed at a bottleneck that moved.

<div class="sec-mark">§ 1.2</div>

## Where the bottleneck moved to

Run a serious agent workflow for a month and the failure mode becomes obvious. The generated code is rarely bad in the way people expect. It compiles. It follows the idioms. It is plausible. It is wrong because it was asked for the wrong thing, in language that permitted several readings, and it chose one.

The bottleneck is now the quality of the description. Not the quality of the typing.

<figure class="code">
  <figcaption><span>vague-intent.md</span><button class="btn-copy" type="button" data-copy>Copy</button></figcaption>
  <pre><code><span class="tok-com"># A request that will produce working, wrong code</span>

Add rate limiting to the payments API so it does not
get hammered during sales events.</code></pre>
</figure>

Three unresolved decisions sit inside that sentence. Rate limited by what key. What happens on rejection. Whether the limit is shared across instances. An agent will resolve all three, silently and confidently, and you will find out in production which way it went.

<div class="callout callout--note">
  <span class="callout-label">The pattern</span>
  <p>Ambiguity does not stop generation. It gets absorbed into it. That is the whole difficulty, and it is why prose briefs do not survive contact with agents.</p>
</div>

<div class="sec-mark">§ 1.3</div>

## Why the productivity numbers are meaningless

Leaders keep asking for a percentage. Thirty per cent faster, forty, sixty. The number is always measured against lines produced or tickets closed, which are measures of the thing that stopped being scarce.

- Lines of code rose. It measures output volume, not delivered value
- Cycle time improved for small changes, and barely moved for changes requiring real coordination
- Defect escape rate is the interesting number, and almost nobody is instrumenting it properly
- Time spent in specification went up, and every organisation I have seen reports it as a regression

Time spent in specification going up is the signal that the method is working. Organisations that treat it as waste and cut it are the ones that end up shipping confident nonsense at speed.

<div class="sec-mark">§ 1.4</div>

## What happens to craft

There is a real loss here and it is worth naming rather than managing away. A lot of engineers, myself included, took genuine pleasure in the act of construction. In finding the clean expression of a thing. That pleasure is not gone but it has been displaced upwards, into a layer that fewer people find satisfying.

The engineers adapting best are not the fastest coders. They are the ones who were already good at writing things down. Who wrote decent design documents when nobody read them. Who could hold an ambiguous requirement up to the light and find the three readings.

> The skill that was undervalued for twenty years turned out to be the load-bearing one.
