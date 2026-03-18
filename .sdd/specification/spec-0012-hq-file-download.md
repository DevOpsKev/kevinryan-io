---
title: "Spec 0012: HQ File Download"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- `sites/hq-kevinryan-io/app/api/chat/route.ts` — system prompt to update
- `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` — message rendering to update
- `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — bubble component to update
- `.sdd/provenance/spec-0011-hq-github-mcp.provenance.md` — context from prior spec

**Produces:**

- Download capability for HQ-generated documents
- A provenance record at `.sdd/provenance/spec-0012-hq-file-download.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0012-hq-file-download.md` in the repo.
2. Read the full specification and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent, make a reasonable decision and record it in provenance.
4. Write provenance as you build, not after.
5. Do not write tests. Testing is not your role.
6. When the build is complete, add a "Build Status" entry to the provenance.
7. Commit the spec, implementation, and provenance together.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0012-hq-file-download.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0012-hq-file-download.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document

---

## Task

1. Save this spec to `.sdd/specification/spec-0012-hq-file-download.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0012-hq-file-download.provenance.md`.

## Prerequisites

- Spec-0011 deployed: HQ chat interface with GitHub tools is live.
- Read the spec-0011 provenance before starting.

## Context

HQ can generate high-quality documents — specs, proposals, reports, plans. Currently those documents only exist in the chat window. This spec adds the ability to download them as markdown files directly from the chat interface.

The pattern uses an explicit document marker. When the user asks HQ to produce something "for download" or to "generate a file", HQ wraps the document content in markers. The UI detects the markers, renders the content normally, and shows a download button with the correct filename. Clicking the button triggers a client-side browser download — no storage, no backend, no new API routes.

This is entirely a frontend change plus a system prompt update. No infrastructure changes, no Terraform, no K8s changes.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | System prompt — add document marker instructions |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Message rendering — detect markers, show download button |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Chat state — ensure document content renders correctly |

### Key facts

- **Document start marker:** `---DOCUMENT:filename.md---`
- **Document end marker:** `---END DOCUMENT---`
- **Download format:** Markdown (`.md`) only for this iteration
- **Trigger phrase:** User says "for download", "as a file", "generate a file", or similar
- **Client-side only:** `Blob` + `URL.createObjectURL` + temporary `<a>` tag — no backend
- **No new dependencies** required

## 1. System prompt update

Update `BASE_SYSTEM_PROMPT` in `sites/hq-kevinryan-io/app/api/chat/route.ts` to add document generation instructions. Append the following section to the existing prompt:

```text
DOCUMENT GENERATION
When the user asks you to produce a document, spec, proposal, report, or any structured content "for download" or "as a file":
1. Write any brief intro text BEFORE the markers
2. Wrap the document content in these exact markers:
   ---DOCUMENT:filename.md---
   [document content here]
   ---END DOCUMENT---
3. Choose a descriptive kebab-case filename based on the content e.g. emergn-proposal.md, spec-0014-hq-database.md, platform-review-report.md
4. The content inside the markers should be complete and well-structured markdown
5. Any closing remarks go AFTER the end marker

Example response structure:
"Here's the proposal for Emergn:

---DOCUMENT:emergn-proposal.md---
# Emergn Proposal
...
---END DOCUMENT---

Let me know if you'd like any changes."
```

The `DEMO_SYSTEM_PROMPT` extends `BASE_SYSTEM_PROMPT` — no separate change needed there.

## 2. Message bubble — document detection and download button

Update `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` to detect document markers in assistant messages and render a download button.

### Document parsing logic

Parse the message content to extract document blocks:

```typescript
interface DocumentBlock {
  filename: string
  content: string
}

function parseDocumentBlocks(text: string): {
  cleanText: string
  documents: DocumentBlock[]
} {
  const documents: DocumentBlock[] = []
  const markerRegex = /---DOCUMENT:([^\n-]+)---\n([\s\S]*?)---END DOCUMENT---/g
  
  let match
  while ((match = markerRegex.exec(text)) !== null) {
    documents.push({
      filename: match[1].trim(),
      content: match[2].trim(),
    })
  }

  const cleanText = text
    .replace(/---DOCUMENT:[^\n-]+---\n[\s\S]*?---END DOCUMENT---/g, '')
    .trim()

  return { cleanText, documents }
}
```

### Download handler

```typescript
function downloadDocument(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Rendering

In the `MessageBubble` component, for assistant messages:

1. Run `parseDocumentBlocks` on the content
2. Render `cleanText` as the message body (markers stripped)
3. For each document in `documents`, render a download button below the message text

**Download button style:**

```typescript
<button
  onClick={() => downloadDocument(doc.filename, doc.content)}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid #A8E10C',
    color: '#A8E10C',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    borderRadius: '4px',
  }}
>
  ↓ {doc.filename}
</button>
```

**Design notes:**

- The download button sits inside the assistant message bubble, below the text
- If a response contains multiple documents, each gets its own download button
- The clean text (with markers stripped) renders normally — the user sees the document content in the chat AND can download it
- The button uses the lime accent colour consistent with the HQ brand

## 3. Streaming consideration

The document markers appear in the streamed response. The `parseDocumentBlocks` function runs on the **final** message content once streaming is complete, not on each chunk. This means:

- During streaming, the raw markers are visible briefly as text arrives
- Once streaming completes, the component re-renders with markers stripped and the download button visible

This is acceptable for this iteration. A future improvement could hide markers during streaming, but that adds complexity not warranted here. Record this as a known limitation in provenance.

## Constraints and Assumptions

- **Constraint:** Client-side download only. No file storage, no new API routes, no backend changes.
- **Constraint:** Markdown only. No `.docx`, `.pdf`, or other formats in this iteration.
- **Constraint:** The document marker format must be exact — `---DOCUMENT:filename.md---` with no spaces around the colon. The system prompt must specify this exactly.
- **Assumption:** The `MessageBubble` component receives the full message content as a string prop. If it receives it differently, adapt the parsing accordingly and record in provenance.
- **Assumption:** No new npm dependencies are needed. `Blob` and `URL.createObjectURL` are native browser APIs.

## Out of Scope

- `.docx` or `.pdf` output — future spec
- Saving documents to GitHub — future spec
- Document history or storage — future spec
- Hiding markers during streaming — future improvement
- Multiple file formats — future spec

## Manual steps (not performed by the agent)

None. This is a pure frontend + system prompt change. Merge the PR, the deploy workflow triggers automatically, Flux reconciles, done.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0012-hq-file-download.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

1. This spec has been saved to `.sdd/specification/spec-0012-hq-file-download.md`
2. `BASE_SYSTEM_PROMPT` in `route.ts` contains the `DOCUMENT GENERATION` section with the marker format
3. `MessageBubble.tsx` contains the `parseDocumentBlocks` function
4. `MessageBubble.tsx` contains the `downloadDocument` function
5. `MessageBubble.tsx` renders a download button for each detected document block
6. The download button uses lime accent colour `#A8E10C` and JetBrains Mono font
7. The marker text is stripped from the displayed message content
8. No new npm dependencies have been added
9. No infrastructure files have been modified (no Terraform, K8s, or GitHub Actions changes)
10. `pnpm build` passes inside `sites/hq-kevinryan-io/`
11. `pnpm lint` passes
12. The provenance record exists at `.sdd/provenance/spec-0012-hq-file-download.provenance.md`
13. All files are committed together in a single commit
