---
title: "Spec 0015: Selective Redaction via LLM Sensitivity Tagging"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- Any prerequisites listed below
- Updated provenance (on subsequent cycles, to address failing scenarios)

**Produces:**

- Working software that satisfies all requirements in this spec
- A provenance record at `.sdd/provenance/spec-0015-selective-redaction.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0015-selective-redaction.md` in the repo. This is the canonical reference. Do not modify it after saving.
2. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at `.sdd/provenance/template.md`.
5. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
6. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
7. Do not write tests. Testing is not your role.
8. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
9. Commit the spec, implementation, and provenance together.

**On subsequent cycles (fixing failing scenarios):**

1. Read the updated provenance, specifically the "Testing Agent Findings" and "Scenario Results" sections.
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-0015-selective-redaction.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0015-selective-redaction.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0015-selective-redaction.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-0015-selective-redaction.provenance.md` in full.
3. Compare the provenance against the specification. Identify Gaps, Assumptions, Ambiguities, Silences, and Deviations.
4. Write prose scenarios to `.sdd/scenarios/spec-0015-selective-redaction.scenarios.md`.
5. Implement each prose scenario as executable test code in `tests/`.
6. Run the tests against the built software.
7. Update the provenance document with a "Testing Agent Findings" section.

---

## Task

1. Save this spec to `.sdd/specification/spec-0015-selective-redaction.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0015-selective-redaction.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0014 deployed: Redact toggle is functional with correct naming (`redacted`), brand colours, and blanket CSS blur
- Spec 0010 deployed: HQ Chat Interface exists and is functional
- Spec 0012 deployed: File download feature exists in MessageBubble

## Context

Spec 0014 implemented a "Redact Data" toggle that applies a blanket CSS blur to ALL message bubbles when activated. This is too aggressive for client demos — it obscures everything, making the conversation incomprehensible to the viewer.

The desired behaviour is **selective redaction**: when the toggle is on, only message bubbles that contain sensitive information should be blurred. Non-sensitive messages (greetings, general technical discussion, UI descriptions, etc.) should remain fully visible. This creates a natural, readable demo experience where the viewer can follow the conversation flow while sensitive data (client names, financial details, internal project specifics) is protected.

The approach is **LLM-driven sensitivity tagging**. Rather than maintaining brittle keyword lists or regex patterns, we instruct Claude to reason about what is sensitive and tag its responses accordingly. This is only active when the redact toggle is on — when the toggle is off, there is zero overhead and Claude responds normally.

**CRITICAL — System prompt location:** The HQ app's system prompt lives at `sites/hq-kevinryan-io/config/hq-system-prompt.md`. This is NOT the same as `config/hq-system-prompt.md` in the repo root. The file at the repo root is the MCP tool system prompt. The app's `route.ts` loads the system prompt using `path.join(process.cwd(), 'config/hq-system-prompt.md')` — at runtime, `process.cwd()` resolves to the `sites/hq-kevinryan-io/` directory, so it reads `sites/hq-kevinryan-io/config/hq-system-prompt.md`. Do NOT modify the root-level `config/hq-system-prompt.md`. All system prompt changes in this spec refer to `sites/hq-kevinryan-io/config/hq-system-prompt.md`.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | API route. Loads the base system prompt from `config/hq-system-prompt.md` (relative to app root). Appends redacted instructions when `redacted: true`. Streams Claude responses to the client. Currently streams plain text. |
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | The HQ app system prompt. This is the file loaded by route.ts at runtime. Do NOT confuse with the root-level config/hq-system-prompt.md. |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Main chat container. Holds `redacted` state. Passes it to ChatHeader, ChatInput, and MessageBubble. Sends `redacted` flag in API request body. Currently streams plain text from the API and appends chunks to message content. |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Header with the Redact Data toggle. No changes needed for this spec. |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual messages. Currently applies blanket `filter: blur(5px)` when `redacted` is true. This spec changes it to selective blur based on sensitivity metadata. |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Chat input area. No changes needed for this spec. |
| `sites/hq-kevinryan-io/app/globals.css` | Global CSS. May need a new class for blurred segments. |

### Key facts

- **Accent colour:** `#A8E10C` (Lime)
- **Black:** `#0A0A0A`
- **White:** `#F5F3EF` (warm off-white)
- **Dark:** `#111111`
- **Mono font:** JetBrains Mono
- **Body font:** Archivo
- **Current streaming approach:** The API streams plain text chunks. ChatInterface reads chunks and appends them to the last assistant message's `content` string. MessageBubble renders the content string as markdown.

## 1. Modify the redacted system prompt in route.ts

### 1a. Update REDACTED_SYSTEM_PROMPT

The current `REDACTED_SYSTEM_PROMPT` in `route.ts` tells Claude not to reveal sensitive information. Replace it with an instruction that tells Claude to **wrap sensitive portions** of its response in a custom XML-style tag.

Replace the current `REDACTED_SYSTEM_PROMPT` definition with:

```typescript
const REDACTED_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

REDACTED MODE IS ACTIVE.

You MUST wrap every part of your response in either <sensitive> or <safe> tags. Every character of your response must be inside one of these tags — no text outside them.

Rules for tagging:
- <sensitive>...</sensitive> — Wrap content that contains or directly references ANY of the following:
  - Client names, project names, or codenames (e.g. CERN, Nestlé, NatWest, specific project names)
  - Financial information (day rates, contract values, revenue, costs, invoices)
  - Personal information (health, tax, legal, HMRC, personal financial details)
  - Internal URLs, IP addresses, API keys, credentials, or infrastructure specifics that identify clients
  - Commercially sensitive strategy, pricing, or contractual terms
  - Any information that could identify a specific client engagement or its commercial terms

- <safe>...</safe> — Wrap content that is general, non-sensitive, and safe for a public audience:
  - Greetings, acknowledgements, general conversation
  - Generic technical explanations (e.g. "Kubernetes uses pods to run containers")
  - Descriptions of methodology, process, or tooling that don't reference specific clients
  - Public knowledge or general industry information
  - UI/UX descriptions, general architecture patterns

Important:
- Respond naturally. Write your response as you normally would, then wrap each paragraph or logical section in the appropriate tag.
- A section is sensitive if ANY part of it contains sensitive information. When in doubt, tag as sensitive.
- Do NOT mention the tags, redaction, or sensitivity classification in your response text. The tags are metadata only.
- Do NOT change the content of your response based on redaction mode. Say exactly what you would normally say — just add the tags.
- Maintain valid markdown WITHIN each tag. The tags wrap around markdown content.
- Every response must have at least one tag. If the entire response is safe, wrap it all in <safe>...</safe>. If entirely sensitive, wrap it all in <sensitive>...</sensitive>.`
```

### 1b. No changes to streaming

The API continues to stream plain text. The `<sensitive>` and `<safe>` tags are inline in the text stream, just like markdown syntax would be. The client-side will parse them. No changes to the streaming mechanism in `route.ts` are needed.

## 2. Update ChatInterface.tsx to parse sensitivity tags

### 2a. Update the Message interface

Add a parsed segments structure. Define a new interface:

```typescript
interface MessageSegment {
  text: string
  sensitive: boolean
}
```

### 2b. Add a parsing function

Add a function that takes a raw message content string and parses out the `<sensitive>` and `<safe>` tags into segments:

```typescript
function parseRedactionSegments(content: string): MessageSegment[] {
  const segments: MessageSegment[] = []
  const tagRegex = /<(sensitive|safe)>([\s\S]*?)<\/\1>/g
  let lastIndex = 0
  let match

  while ((match = tagRegex.exec(content)) !== null) {
    // Any text between tags (shouldn't exist if Claude follows instructions, but handle gracefully)
    if (match.index > lastIndex) {
      const between = content.slice(lastIndex, match.index).trim()
      if (between) {
        segments.push({ text: between, sensitive: true }) // Default untagged text to sensitive (conservative)
      }
    }
    segments.push({
      text: match[2],
      sensitive: match[1] === 'sensitive',
    })
    lastIndex = match.index + match[0].length
  }

  // Any trailing text after the last tag
  if (lastIndex < content.length) {
    const trailing = content.slice(lastIndex).trim()
    if (trailing) {
      segments.push({ text: trailing, sensitive: true }) // Default to sensitive
    }
  }

  // If no tags were found at all, return the whole content as a single segment
  if (segments.length === 0) {
    segments.push({ text: content, sensitive: false })
  }

  return segments
}
```

### 2c. Pass parsed segments to MessageBubble

Update the MessageBubble rendering in ChatInterface.tsx. When `redacted` is true, parse the message content into segments and pass them. When `redacted` is false, pass the raw content as-is (no parsing overhead).

Change the MessageBubble invocation from:

```tsx
<MessageBubble key={i} message={msg} redacted={redacted} />
```

To:

```tsx
<MessageBubble
  key={i}
  message={msg}
  redacted={redacted}
  segments={redacted && msg.role === 'assistant' ? parseRedactionSegments(msg.content) : undefined}
/>
```

Note: Only assistant messages get segment parsing. User messages are always treated as sensitive when redacted (the user typed them — they may contain sensitive queries). This is handled in MessageBubble (section 3).

## 3. Update MessageBubble.tsx for selective blur

### 3a. Update the props interface

```typescript
interface MessageSegment {
  text: string
  sensitive: boolean
}

interface MessageBubbleProps {
  message: Message
  redacted?: boolean
  segments?: MessageSegment[]
}
```

### 3b. Rendering logic

The rendering logic should work as follows:

**When `redacted` is false (or undefined):**
- Render exactly as today. No change. The `segments` prop will be undefined.
- Remove the existing blanket `filter: blur(5px)` from the content div. The blur is no longer applied at this level.

**When `redacted` is true AND `segments` is provided (assistant messages):**
- Render each segment as a separate div within the message bubble.
- Sensitive segments get `filter: blur(5px)`, `userSelect: 'none'`, and `transition: 'filter 0.3s ease'`.
- Safe segments render normally with no blur.
- Each segment's text is rendered as markdown (using ReactMarkdown with remarkGfm, same as current assistant message rendering).
- The `<sensitive>` and `<safe>` tags must be stripped from the rendered text (the parsing function already does this — segments contain only the inner text).

**When `redacted` is true AND `segments` is NOT provided (user messages):**
- Apply blanket blur to the entire user message bubble, same as spec 0014 behaviour.
- User messages always blur entirely when redacted because the user may have typed sensitive queries.

### 3c. Implementation detail for the content div

Replace the current single content div with conditional rendering. Here is the structural approach:

For the main content `<div>` (the one with `backgroundColor`, `padding`, `border`):

- Remove the existing `filter: redacted ? 'blur(5px)' : 'none'` and `userSelect: redacted ? 'none' : 'auto'` from this div.
- For **user messages when redacted**: apply `filter: blur(5px)` and `userSelect: 'none'` on this content div (blanket blur for user messages, same as before).
- For **assistant messages when redacted and segments provided**: do NOT blur this outer div. Instead, render each segment inside it, with sensitive segments individually blurred.
- For **all messages when not redacted**: no blur anywhere, render as before.

The segment rendering inside the content div (assistant messages, redacted mode):

```tsx
{segments.map((segment, idx) => (
  <div
    key={idx}
    style={{
      filter: segment.sensitive ? 'blur(5px)' : 'none',
      userSelect: segment.sensitive ? 'none' : 'auto',
      transition: 'filter 0.3s ease',
    }}
    className="hq-markdown"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {segment.text}
    </ReactMarkdown>
  </div>
))}
```

When NOT in redacted mode or no segments (current behaviour):

```tsx
{isUser ? (
  <span style={{ whiteSpace: 'pre-wrap' }}>{cleanText}</span>
) : (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {cleanText}
  </ReactMarkdown>
)}
```

### 3d. Document blocks

The existing document block parsing (`parseDocumentBlocks`) should run BEFORE redaction segment parsing. The flow is:

1. `parseDocumentBlocks(message.content)` extracts document blocks and returns `cleanText`
2. If segments are provided (from ChatInterface), those segments were parsed from the full `message.content`. However, document block markers (`---DOCUMENT:...---`) should NOT appear inside `<sensitive>` or `<safe>` tags because they are structural, not conversational. If a document block marker does end up inside a tag, the `parseDocumentBlocks` function in MessageBubble will strip it regardless.
3. For safety: in MessageBubble, when segments are provided, run `parseDocumentBlocks` on EACH segment's text to strip any document markers that may have leaked into segments. Collect all extracted documents into a single array for rendering download buttons.

### 3e. Streaming behaviour

During streaming, the message content is built up chunk by chunk. Tags may be incomplete mid-stream (e.g. `<sensi` then `tive>some text`). The `parseRedactionSegments` function handles this naturally:

- Incomplete tags won't match the regex, so that text falls into the "untagged trailing text" case and defaults to `sensitive: true` (conservative — blur it until the tag completes).
- As more chunks arrive, the content is re-parsed and tags resolve correctly.
- This means during streaming, partially received segments may flicker from blurred to unblurred as tags complete. This is acceptable and even desirable — it shows the system actively processing.

ChatInterface already re-renders MessageBubble on every chunk (because message content state updates). The segments will be re-parsed on each render when `redacted` is true. Since `parseRedactionSegments` is a pure function with no side effects, this is safe and has negligible overhead (it's just a regex over the current message string).

## 4. Handle edge cases

### 4a. Claude fails to tag

If Claude returns a response with no `<sensitive>` or `<safe>` tags (model non-compliance), the `parseRedactionSegments` function returns the entire content as a single non-sensitive segment (`sensitive: false`). This is the correct fallback — if the model didn't tag anything, we can't know what's sensitive, and showing the content is better than blanking the entire response. The `REDACTED_SYSTEM_PROMPT` instructions are strong enough that this should be rare.

### 4b. Nested tags

Claude should not produce nested tags (e.g. `<sensitive><safe>text</safe></sensitive>`). The regex is non-greedy and matches the innermost tags. If nesting occurs, the inner tags will be treated as literal text within the outer tag's content. Record in provenance how this is handled if encountered during testing.

### 4c. Tags in user messages

User messages are never parsed for tags. They are always blanket-blurred when redacted. User-typed `<sensitive>` text would just render as literal text (React escapes it).

### 4d. Redact toggle toggled mid-conversation

When the user toggles redact ON mid-conversation:
- Past assistant messages that were sent WITHOUT redacted mode will have no tags in their content. `parseRedactionSegments` will return them as a single non-sensitive segment. They will display unblurred. This is correct — those messages were generated in non-redacted mode and may not contain what the user considers sensitive in a demo context.
- Past user messages will blanket-blur.
- Future messages will be sent with `redacted: true`, and Claude will tag its responses.

When the user toggles redact OFF mid-conversation:
- All messages display normally. Tags in previously-tagged responses are ignored (segments prop is not passed when `redacted` is false). The raw content including `<sensitive>` and `<safe>` tags will be visible as literal text in the markdown. This is acceptable for a dev/internal tool — the tags are lightweight and self-explanatory.

**Alternative approach:** If the visible tags when toggling off are undesirable, the `cleanText` passed to the non-redacted renderer could strip the tags. Add a simple strip function:

```typescript
function stripRedactionTags(content: string): string {
  return content.replace(/<\/?(?:sensitive|safe)>/g, '')
}
```

Apply this in MessageBubble when rendering assistant messages in non-redacted mode — use `stripRedactionTags(cleanText)` instead of `cleanText`. This ensures tags are never visible to the user regardless of toggle state. **Do implement this.**

## Constraints and Assumptions

- **Constraint:** When `redacted` is false, there must be ZERO changes to the current behaviour. No parsing, no tag stripping overhead for the non-redacted path except the lightweight `stripRedactionTags` regex in MessageBubble rendering.
- **Constraint:** The `<sensitive>` and `<safe>` tag names must be exactly these strings. Do not use other tag names.
- **Constraint:** User messages are always blanket-blurred when redacted. No selective redaction for user input.
- **Constraint:** The blur value remains `5px` as established in spec 0014.
- **Constraint:** Document download buttons are never blurred, regardless of redaction state.
- **Assumption:** Claude will reliably tag responses when instructed. The redacted system prompt instructions are explicit and structured enough for high compliance. Occasional failures are handled gracefully by the fallback.
- **Assumption:** The tags add minimal token overhead to Claude's response. Each tag pair is ~25 characters. This is negligible relative to response length.
- **Assumption:** Parsing segments on every re-render during streaming is fast enough. The regex runs against a string that grows as chunks arrive. For typical message lengths (under 10KB), this is sub-millisecond.
- **Assumption:** The `redacted` state is session-only and does not persist. Same as spec 0014.

## Out of Scope

- **Server-side redaction or filtering** — This spec only addresses client-side visual redaction. The API streams the full content regardless.
- **Persisting redacted state across sessions** — Future work.
- **Redaction of tool call results or system messages** — Only user and assistant message bubbles are affected.
- **Configurable sensitivity rules** — The LLM decides what is sensitive based on the system prompt. No user-configurable rules in this spec.
- **Tests** — The builder agent does not write tests. Testing is handled by the testing agent.

## Manual steps (not performed by the agent)

None — all changes are in application code and will be built and deployed via the existing CI/CD pipeline.

Verify after merge:

1. Visit `https://hq.kevinryan.io`
2. With redact toggle OFF, send a message. Response should render normally, no tags visible, identical to current behaviour.
3. Turn redact toggle ON.
4. Send a message that would produce mixed sensitivity, e.g. "What's the status of the CERN project and how does Flux CD work?"
5. Claude's response should contain both safe segments (Flux CD explanation) and sensitive segments (CERN project details).
6. Safe segments should be fully visible and readable.
7. Sensitive segments should be blurred with `filter: blur(5px)`.
8. User message bubbles should be blanket-blurred.
9. Toggle redact OFF — all messages should display normally, no `<sensitive>` or `<safe>` tags visible in the text.
10. Document download buttons should never be blurred in any state.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0015-selective-redaction.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0015-selective-redaction.md`
2. `route.ts` contains the updated `REDACTED_SYSTEM_PROMPT` with `<sensitive>` and `<safe>` tag instructions
3. The file `sites/hq-kevinryan-io/config/hq-system-prompt.md` has NOT been modified (the redacted prompt is composed in route.ts only)
4. The file `config/hq-system-prompt.md` (repo root) has NOT been modified
5. `ChatInterface.tsx` contains a `parseRedactionSegments` function that parses `<sensitive>` and `<safe>` tags
6. `ChatInterface.tsx` passes a `segments` prop to MessageBubble when `redacted` is true and the message is from the assistant
7. `MessageBubble.tsx` accepts a `segments` prop of type `MessageSegment[]`
8. `MessageBubble.tsx` renders segments individually when provided, blurring only sensitive segments
9. `MessageBubble.tsx` blanket-blurs user messages when `redacted` is true (no segment parsing for user messages)
10. `MessageBubble.tsx` contains a `stripRedactionTags` function that removes `<sensitive>`, `</sensitive>`, `<safe>`, and `</safe>` tags from content
11. `MessageBubble.tsx` applies `stripRedactionTags` to assistant message content when rendering in non-redacted mode
12. Document download buttons are rendered outside of any blur filter
13. `pnpm lint` passes with no errors
14. `pnpm build` completes successfully
15. The provenance record exists at `.sdd/provenance/spec-0015-selective-redaction.provenance.md` and contains all required sections
16. All files (spec, implementation, provenance) are committed together
