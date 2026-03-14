---
title: "ADR-020: Email Capture via Formspree for Static Landing Pages"
draft: false
---

**Status:** Accepted
**Date:** 2026-03-14
**Decision Makers:** Human
**Prompted By:** Need for email capture on specmcp.ai pre-launch landing page without introducing backend infrastructure.

## Context

Static landing pages across the platform (specmcp.ai, and potentially future product sites) need a way to capture email addresses for waitlists and early access signups. These sites are served as static HTML from Nginx Alpine containers on K3s — there is no application server or database available to handle form submissions. The solution must work with zero backend, forward submissions to a personal email, and store submissions for later use.

## Decision Drivers

- No backend infrastructure — static sites only, no application server or database
- Zero ongoing maintenance — must not add operational burden to the K3s cluster
- Free or near-free at current scale — wealth is the binding constraint; specmcp.ai is pre-launch with low volume
- Email forwarding — submissions must arrive in a personal inbox
- Submission storage — captured emails must be retrievable later for launch announcements
- Speed to implement — drop-in solution, not a build project

## Options Considered

### Option A: Formspree

Hosted form backend. Submit via JavaScript `fetch` or plain HTML form action. Free tier: 50 submissions/month. Submissions stored in Formspree dashboard and forwarded to a configured email address. No backend required — works entirely from client-side code.

Trade-offs: 50/month free limit is tight if a post goes viral, but adequate for pre-launch. No mailing list features — it captures emails but can't send to them. Vendor dependency on a small company.

### Option B: Formspark

Very similar to Formspree. 250 free submissions (lifetime, not monthly), then paid. Slightly cleaner dashboard. Also zero-backend.

Trade-offs: Lifetime cap rather than monthly is worse for sustained low-volume use. Less widely adopted, slightly less documentation.

### Option C: Buttondown

Lightweight newsletter platform. Free up to 100 subscribers. Captures emails and provides a mailing list — can send launch announcements directly. Embeddable signup form.

Trade-offs: More capable long-term (actual mailing list, not just a submission log). But heavier integration — requires managing a newsletter platform, unsubscribe compliance, and content workflow. Premature for a "coming soon" page.

### Option D: Self-hosted endpoint (n8n or custom function on K3s)

Full control. Deploy a lightweight webhook receiver or n8n workflow on the existing cluster. Zero per-submission cost. Data stays on own infrastructure.

Trade-offs: Adds operational surface area — another service to maintain, monitor, and secure. Needs persistent storage for submissions. Violates the "knowing when not to spend money is a skill" principle — the problem doesn't justify the infrastructure.

### Option E: Mailchimp / ConvertKit / Beehiiv

Full newsletter and marketing automation platforms. Generous free tiers. Mature tooling for managing subscriber lists, segmentation, and campaigns.

Trade-offs: Massive overkill for a pre-launch waitlist. Heavy onboarding. Would become relevant if specmcp.ai evolves into a content or community play, but premature now.

## Decision

Formspree. It is already implemented on specmcp.ai (form ID `xpqjkvjl`), requires zero backend, and fits the current scale perfectly. The 50 submissions/month free tier is more than sufficient for a pre-launch landing page. Submissions are forwarded to email and stored in the Formspree dashboard for later export.

If the waitlist outgrows the free tier or there is a need to email the list directly (launch announcements, SDD content), the natural upgrade path is Buttondown — it adds mailing list capabilities without heavy infrastructure. That migration would be a new ADR.

## Consequences

### Positive

- Zero backend infrastructure required — no changes to K3s, Terraform, or Flux
- Operational cost: £0 at current scale
- Already implemented and working — no further work needed
- Submissions exportable as CSV from Formspree dashboard

### Negative

- 50 submissions/month cap on free tier — requires upgrade if volume spikes
- No ability to email captured subscribers without exporting and importing to another tool
- Vendor dependency — if Formspree goes down or shuts down, form submissions silently fail

### Risks

- Volume spike from a viral LinkedIn post could exceed free tier → Mitigation: Formspree queues submissions and prompts for upgrade; upgrade to paid ($8/month) or migrate to Buttondown
- Formspree service outage → Mitigation: client-side error handling already implemented in specmcp.ai; user sees retry prompt. Low blast radius — it's a waitlist, not a transaction.

## Agent Decisions

| Decision | Rationale | Acceptable |
|----------|-----------|------------|
| N/A — no agent implementation required | Formspree integration is client-side JavaScript already in place | N/A |

## References

- specmcp.ai landing page source (this project)
- Formspree documentation: https://formspree.io/
- Buttondown documentation: https://buttondown.com/ (future upgrade path)
