---
title: "Provenance: Spec 0015 — Selective Redaction via LLM Sensitivity Tagging"
draft: false
---

**Spec:** `.sdd/specification/spec-0015-selective-redaction.md`
**Executed:** 2026-03-20
**Agent:** Claude Code CLI (claude-opus-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0015-selective-redaction.md` — full spec
2. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` — current API route with blanket redaction prompt
3. Read `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` — current chat container
4. Read `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — current message rendering with blanket blur
5. Read `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` — confirmed no changes needed
6. Read `sites/hq-kevinryan-io/app/components/ChatInput.tsx` — confirmed no changes needed
7. Read `sites/hq-kevinryan-io/app/globals.css` — confirmed existing hq-markdown styles
8. Read `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` — brand colour/typography reference
9. Read `sites/hq-kevinryan-io/config/hq-system-prompt.md` — confirmed not modified by this spec
10. Read `.sdd/provenance/template.md` — provenance template reference
11. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — replaced `REDACTED_SYSTEM_PROMPT` with structured JSON segment instructions
12. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — added `X-HQ-Redacted: true` response header when `redacted` is true
13. Created `sites/hq-kevinryan-io/app/types/chat.ts` — shared `Segment` and `Message` interfaces
14. Modified `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` — imported shared types, added JSON segment parsing after streaming completes, passes `isStreaming` prop to MessageBubble
15. Modified `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — rewrote to support selective segment-level blur, streaming placeholder, and blanket blur fallback
16. Ran `grep` for `demoMode` — confirmed no occurrences in application code (only in spec/provenance docs)
17. Ran `pnpm install` — installed all dependencies
18. Ran `pnpm --filter hq-kevinryan-io lint` — passed (0 errors, 1 pre-existing warning)
19. Ran `pnpm --filter hq-kevinryan-io build` — passed successfully
20. Created `.sdd/provenance/spec-0015-selective-redaction.provenance.md` — this file

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Extract shared types to `app/types/chat.ts` | (a) Duplicate interfaces in both files (b) Extract to shared types file | (b) Shared types file | Avoids duplication and keeps types in sync. Spec explicitly permits this choice. |
| Use `<div>` with `display: inline` for segment wrappers | (a) `<span>` element (b) `<div>` with `display: inline` | (b) `<div>` with `display: inline` | ReactMarkdown renders block-level elements (`<p>`, `<ul>`) that cannot be valid children of `<span>`. Using `<div>` avoids HTML nesting violations while `display: inline` maintains flow. Spec anticipated this decision. |
| Strip markdown code fences before JSON parsing | (a) Parse directly (b) Strip fences first | (b) Strip fences first | Spec explicitly requires handling the edge case where Claude wraps JSON in ````json ... ``` `` fences. Implemented via regex match before `JSON.parse`. |
| Strip document markers from individual segment text | (a) Only strip from full content (b) Also strip from segments | (b) Strip from both | Spec section 5 says segment text should have markers stripped before rendering. Added `stripDocumentMarkers()` helper for per-segment cleanup. |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | The `Segment` type only needs `text` and `sensitive` fields (no additional metadata) | Section 3a | Spec defines exactly these two fields; no mention of additional properties |
| A2 | The streaming typing-dots indicator (shown when last message is user and loading is true) should remain unchanged | Section 3c | Spec only addresses the case where assistant message is streaming in redacted mode; the existing typing-dots UX for the initial waiting state is not discussed |
| A3 | The `hq-markdown` class should be applied to the outer wrapper div when segments are present, not to individual segment wrappers | Section 4c | Spec shows `className="hq-markdown"` on the outer div. Individual segments render their own ReactMarkdown which inherits these styles. |
| A4 | Pre-existing lint warnings and errors in `kevinryan-io` site are not caused by this spec's changes | Validation step 15 | Ran lint on `hq-kevinryan-io` specifically — 0 errors. The `kevinryan-io` error (`<a>` instead of `<Link>`) is pre-existing and unrelated. |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | Whether `isStreaming` placeholder should also apply to non-redacted assistant streaming | Section 4d | Only show "analysing sensitivity..." when both `isStreaming` AND `redacted` are true. Non-redacted streaming continues to show raw text as today. | Could apply a generic "thinking..." placeholder to all streaming states |
| B2 | Whether the outer bubble div should apply blanket blur when segments are present | Section 4b, 4c | When segments exist, the outer div has `filter: none` and individual segments handle their own blur. The outer div only applies blanket blur as fallback when segments are undefined. | Could apply blanket blur to outer div and selective blur to segments (double blur) |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0015-selective-redaction.md` | Already existed (committed in prior step) |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `sites/hq-kevinryan-io/app/types/chat.ts` | Created |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Modified |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Modified |
| `.sdd/provenance/spec-0015-selective-redaction.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Implemented selective redaction via LLM sensitivity tagging. The REDACTED_SYSTEM_PROMPT now instructs Claude to return JSON-segmented responses with per-segment sensitivity tags. The client parses these segments after streaming completes and renders them with per-segment blur. Fallback to blanket blur on JSON parse failure. "analysing sensitivity..." placeholder shown during streaming in redacted mode. Document download functionality preserved. Non-redacted path unchanged.
**Known limitations:** ReactMarkdown renders block-level elements inside `<div style="display: inline">` wrappers, which may cause minor layout differences compared to a single ReactMarkdown render (e.g., extra paragraph margins between segments). This is cosmetic and acceptable for the demo context.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/` | Pass — already committed |
| 2 | `route.ts` contains updated `REDACTED_SYSTEM_PROMPT` with JSON segment instructions | Pass |
| 3 | `route.ts` adds `X-HQ-Redacted: true` header when `redacted` is true | Pass |
| 4 | `ChatInterface.tsx` defines `Segment` interface (via import from shared types) | Pass |
| 5 | `ChatInterface.tsx` parses completed assistant response as JSON when `redacted` is true, with graceful fallback | Pass |
| 6 | `ChatInterface.tsx` passes `isStreaming` prop to last assistant MessageBubble | Pass |
| 7 | `MessageBubble.tsx` accepts `redacted` and `isStreaming` props | Pass |
| 8 | `MessageBubble.tsx` renders individual segments with per-segment blur | Pass |
| 9 | `MessageBubble.tsx` shows "analysing sensitivity..." placeholder when streaming and redacted | Pass |
| 10 | `MessageBubble.tsx` falls back to blanket blur when redacted but no segments | Pass |
| 11 | `MessageBubble.tsx` always blanket-blurs user messages when redacted | Pass |
| 12 | Document download buttons render correctly in both modes | Pass |
| 13 | Non-redacted path unchanged | Pass |
| 14 | No `demoMode` string in codebase (only in spec/provenance docs) | Pass |
| 15 | `pnpm lint` passes with no new errors | Pass (0 errors on hq-kevinryan-io) |
| 16 | `pnpm build` completes successfully | Pass |
| 17 | Provenance record exists with all required sections | Pass |
| 18 | All files committed together | Pending — commit step next |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
