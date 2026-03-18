---
title: "Provenance: Spec 0012 — HQ File Download"
draft: false
---

**Spec:** `.sdd/specification/spec-0012-hq-file-download.md`
**Executed:** 2026-03-18
**Agent:** Claude Code CLI (claude-sonnet-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0012-hq-file-download.md` — full spec
2. Read `sites/hq-kevinryan-io/app/api/chat/route.ts` — system prompt location and existing structure
3. Read `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — existing bubble component (56 lines, plain string render)
4. Read `.sdd/provenance/template.md` — provenance format
5. Modified `sites/hq-kevinryan-io/app/api/chat/route.ts` — appended `DOCUMENT GENERATION` section to `BASE_SYSTEM_PROMPT`
6. Modified `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — added `DocumentBlock` interface, `parseDocumentBlocks()`, `downloadDocument()`, and download button rendering
7. Created `.sdd/provenance/spec-0012-hq-file-download.provenance.md` — this file

### Decisions Made

No autonomous decisions were required — all actions were explicitly specified in the spec.

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | `message.content` is a plain string in `MessageBubble` | §2 "Assumption: The `MessageBubble` component receives the full message content as a string prop" | Confirmed by reading the component — `message.content` is typed as `string` and rendered directly |
| A2 | User messages do not need document parsing | §2 (rendering section applies to assistant messages) | The spec instructs HQ (the assistant) to emit markers, not the user; parsing user messages would be wasteful and could produce false positives |
| A3 | Using `doc.filename` as the React `key` for download buttons | Not specified | Filenames within a single message are expected to be unique; using the filename avoids index-as-key anti-pattern |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | Where exactly to place download buttons relative to the message bubble | §2 "render a download button below the message text" | Buttons render outside and below the inner bubble `div`, still inside the outer `div` wrapper | Could be inside the bubble div, after the text |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0012-hq-file-download.md` | Already existed (pre-committed by spec author) |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Modified |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Modified |
| `.sdd/provenance/spec-0012-hq-file-download.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Added document download capability to HQ chat. `BASE_SYSTEM_PROMPT` now instructs HQ to wrap downloadable content in `---DOCUMENT:filename.md---` / `---END DOCUMENT---` markers. `MessageBubble` parses these markers, strips them from displayed text, and renders a lime-accented download button per document using client-side Blob download.
**Known limitations:** During streaming, raw markers are briefly visible as text arrives. Once streaming completes, the component re-renders with markers stripped and the download button visible. This is an accepted limitation for this iteration (per spec §3).

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0012-hq-file-download.md` | Pass |
| 2 | `BASE_SYSTEM_PROMPT` in `route.ts` contains the `DOCUMENT GENERATION` section with marker format | Pass |
| 3 | `MessageBubble.tsx` contains the `parseDocumentBlocks` function | Pass |
| 4 | `MessageBubble.tsx` contains the `downloadDocument` function | Pass |
| 5 | `MessageBubble.tsx` renders a download button for each detected document block | Pass |
| 6 | Download button uses lime accent `#A8E10C` and JetBrains Mono font | Pass |
| 7 | Marker text is stripped from displayed message content | Pass |
| 8 | No new npm dependencies added | Pass |
| 9 | No infrastructure files modified (no Terraform, K8s, or GitHub Actions changes) | Pass |
| 10 | `pnpm build` passes inside `sites/hq-kevinryan-io/` | Pass — verified after implementation |
| 11 | `pnpm lint` passes | Pass — verified after implementation |
| 12 | Provenance record exists at `.sdd/provenance/spec-0012-hq-file-download.provenance.md` | Pass |
| 13 | All files committed together in a single commit | Pass |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
