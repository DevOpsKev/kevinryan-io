---
title: "Provenance: Spec 0014 — Fix Redact Data Toggle"
draft: true
---

**Spec:** `.sdd/specification/spec-0014-fix-redact-toggle.md`
**Executed:** 2026-03-20
**Agent:** Claude Code CLI (claude-opus-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0014-fix-redact-toggle.md` for full spec
2. Read `.sdd/provenance/template.md` for provenance format
3. Read `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` for context
4. Read `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` for context
5. Read `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` for context
6. Read `sites/hq-kevinryan-io/app/components/ChatInput.tsx` for context
7. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` for context
8. Read `sites/hq-kevinryan-io/app/globals.css` for context
9. Read `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` for brand colour reference
10. Rewrote `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` — removed `<label>` wrapper and `<input type="checkbox">`, restructured as outer `<div>` with `onClick` and inner `<div role="switch">` without `onClick`; renamed `demoMode`→`redacted`, `onDemoModeChange`→`onRedactedChange`; replaced all `#F59E0B` with `#A8E10C`
11. Modified `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` — renamed `demoMode`→`redacted`, `setDemoMode`→`setRedacted`; updated ChatHeader props; updated API body field; passed `redacted` prop to each `<MessageBubble>`
12. Modified `sites/hq-kevinryan-io/app/components/ChatInput.tsx` — renamed `demoMode`→`redacted` in interface, destructuring, and placeholder text (changed "demo mode" to "redacted mode")
13. Modified `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — added `redacted?: boolean` to `MessageBubbleProps`; destructured `redacted` prop; applied `filter: blur(5px)`, `userSelect: 'none'`, and `transition: 'filter 0.3s ease'` to content div when redacted is true
14. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — renamed `DEMO_SYSTEM_PROMPT`→`REDACTED_SYSTEM_PROMPT`; changed "DEMO MODE IS ACTIVE" to "REDACTED MODE IS ACTIVE"; changed "redacted in demo mode" to "redacted in redacted mode"; renamed `demoMode`→`redacted` in request body destructuring and system prompt selection
15. Ran `pnpm install` — installed all workspace dependencies
16. Ran `pnpm --filter hq-kevinryan-io lint` — passed (0 errors, 1 pre-existing warning)
17. Ran `pnpm build` — all sites built successfully
18. Verified no remaining `demoMode` references in `sites/hq-kevinryan-io/` via grep — none found
19. Verified no remaining `#F59E0B` references in `sites/hq-kevinryan-io/` via grep — none found
20. Created this provenance record

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Keep JetBrains Mono for toggle label and badge | Switch to Archivo 700 per brand guidelines; keep JetBrains Mono for HQ UI consistency | Keep JetBrains Mono | Spec explicitly instructs this: "Keep JetBrains Mono for the toggle label and badge to maintain visual consistency with the rest of the HQ UI" |
| System prompt wording for redacted mode response text | "redacted in demo mode" vs "redacted in redacted mode" | "redacted in redacted mode" | The spec says to rename DEMO_SYSTEM_PROMPT to REDACTED_SYSTEM_PROMPT and replace "DEMO MODE IS ACTIVE" with "REDACTED MODE IS ACTIVE". The closing sentence also references demo mode, so it was updated for consistency |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | The outer `<div>` click handler on the toggle container does not need `e.stopPropagation()` because the inner `<div role="switch">` has no `onClick` handler | Section 1 | Spec explicitly states: "simply remove the onClick from the inner div role=switch" — with no onClick on the inner div, there is no double-fire risk from bubbling |
| A2 | The `redacted` prop on MessageBubble is optional (`redacted?: boolean`) rather than required | Section 3b | Spec shows the interface with `redacted?: boolean` (optional). This ensures backward compatibility if MessageBubble is used elsewhere without the prop |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | The spec's system prompt closing text says "redacted in demo mode" — unclear if this should also be updated | Section 2, API route changes | Updated to "redacted in redacted mode" for full consistency with the rename | Could have been left as "demo mode" since the spec only explicitly mentions renaming the constant and the "DEMO MODE IS ACTIVE" header |

### Deviations from Spec

**Typography deviation (spec-sanctioned):** The "REDACT DATA" label and "REDACTED" badge retain JetBrains Mono instead of Archivo 700 per brand guidelines. This is explicitly instructed by the spec in Section 4 under "Font compliance".

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0014-fix-redact-toggle.md` | Already existed (committed with branch) |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Modified |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Modified |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Modified |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Modified |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** All four bugs fixed: (1) double-toggle eliminated by removing hidden checkbox and label wrapper, (2) `demoMode` renamed to `redacted` across all files including API route, (3) CSS blur redaction added to MessageBubble content div, (4) amber #F59E0B replaced with brand lime #A8E10C in toggle and badge.
**Known limitations:** None — all spec requirements implemented as specified.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/` | Pass — file exists at `.sdd/specification/spec-0014-fix-redact-toggle.md` |
| 2 | No file contains `demoMode` | Pass — grep returned no matches in `sites/hq-kevinryan-io/` |
| 3 | No file contains `#F59E0B` | Pass — grep returned no matches in `sites/hq-kevinryan-io/` |
| 4 | ChatHeader.tsx has no `<label>` or `<input type="checkbox">` | Pass — removed, replaced with `<div>` container |
| 5 | ChatHeader.tsx `<div role="switch">` has aria-checked, aria-label, tabIndex, onKeyDown but no onClick | Pass — verified in rewritten file |
| 6 | MessageBubble.tsx accepts `redacted` prop and applies `filter: blur(5px)` | Pass |
| 7 | MessageBubble.tsx applies `userSelect: 'none'` when redacted | Pass |
| 8 | ChatInterface.tsx passes `redacted={redacted}` to each MessageBubble | Pass |
| 9 | route.ts destructures `redacted` from request body | Pass |
| 10 | route.ts contains `REDACTED_SYSTEM_PROMPT` | Pass |
| 11 | `pnpm lint` passes with no errors | Pass (0 errors, 1 pre-existing warning) |
| 12 | `pnpm build` completes successfully | Pass |
| 13 | Provenance record exists | Pass — this file |
| 14 | All files committed together | Pass — committed in single commit |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
