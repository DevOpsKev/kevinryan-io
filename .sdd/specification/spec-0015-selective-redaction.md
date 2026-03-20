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

- Spec 0014 deployed: Redact Data toggle exists with correct branding, renamed `redacted` state, CSS blur on all message bubbles, and fixed double-toggle bug.
- Spec 0010 deployed: HQ Chat Interface exists and is functional.
- Spec 0012 deployed: File download feature exists in MessageBubble.

## Context

Spec 0014 implemented a blanket CSS blur on **all** message bubbles when the redact toggle is active. This was correct per that spec's requirements. However, the blanket blur is too aggressive for client demos — it obscures everything, making it impossible for viewers to follow the conversation flow.

The desired behaviour is **selective redaction**: when the toggle is on, only message bubbles that contain sensitive information should be blurred. General-purpose messages (greetings, technical explanations, UI descriptions) should remain visible so the demo makes sense to the audience.

The approach: **Claude reasons about sensitivity**. When redacted mode is active, the system prompt instructs Claude to return structured JSON responses with sensitivity tags on each segment. The UI parses this structure and selectively blurs only the sensitive segments. This is AI-Native — the LLM itself determines what is sensitive, rather than relying on brittle keyword lists or regex patterns.

This applies only to **assistant** (HQ) messages. User messages continue to be blanket-blurred when redacted mode is on (the user typed them and they may contain anything).

### Current state (read these files before making changes)

**IMPORTANT:** The HQ app's system prompt is loaded from `sites/hq-kevinryan-io/config/hq-system-prompt.md` at runtime (NOT the root `config/hq-system-prompt.md`). The `route.ts` file resolves this path using `path.join(process.cwd(), 'config/hq-system-prompt.md')`, and the app's working directory at runtime is `sites/hq-kevinryan-io/`. Do NOT confuse this with the root-level config file.

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | **THE** system prompt for the HQ app. Loaded by route.ts at runtime. This is the file that Claude sees as its instructions. |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | API route. Loads the system prompt from `config/hq-system-prompt.md` (relative to app cwd). Constructs `REDACTED_SYSTEM_PROMPT` by appending redaction instructions to the base prompt. Handles streaming responses and tool use. |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Main chat container. Holds `redacted` state. Passes it to ChatHeader, ChatInput, MessageBubble, and the API call. |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual messages. Currently applies blanket `filter: blur(5px)` when `redacted` is true. Handles document download blocks. |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Header with the Redact Data toggle. Brand-compliant lime styling. |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Chat input area. Receives `redacted` prop for placeholder text. |

### Key facts

- **System prompt load path:** `route.ts` calls `path.join(process.cwd(), 'config/hq-system-prompt.md')`. At runtime, `process.cwd()` is `sites/hq-kevinryan-io/`, so the resolved path is `sites/hq-kevinryan-io/config/hq-system-prompt.md`.
- **Current REDACTED_SYSTEM_PROMPT:** Appends a paragraph to the base prompt telling Claude not to reveal sensitive information. This will be replaced with structured output instructions.
- **Streaming:** The current API streams plain text chunks from Claude. This must change to handle JSON-structured responses when redacted mode is on.
- **Tool use:** The API handles multi-turn tool use loops. The structured response format only applies to the final text output, not to tool use blocks.
- **Brand colours:** Lime `#A8E10C`, Black `#0A0A0A`, White `#F5F3EF`, Dark `#111111`.

## 1. Update the REDACTED_SYSTEM_PROMPT in route.ts

Replace the current `REDACTED_SYSTEM_PROMPT` constant in `sites/hq-kevinryan-io/app/api/chat/route.ts`.

### Current value (to be replaced)

```typescript
const REDACTED_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

REDACTED MODE IS ACTIVE. Do not reveal, reference, or quote any sensitive information including:
- Day rates, contract fees, or financial details
- HMRC, tax, or legal matters
- Personal health or financial circumstances
- Specific client contract terms not already publicly known
- Any information that could be commercially sensitive

If asked about these topics, acknowledge they exist but state they are redacted in redacted mode.`
```

### New value

```typescript
const REDACTED_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

REDACTED MODE IS ACTIVE. You MUST respond using the structured JSON format described below. Do NOT respond with plain text. Your entire response must be a single valid JSON array.

Respond with a JSON array of segment objects. Each segment represents a logical portion of your response (typically one sentence or one short paragraph). For each segment, determine whether it contains sensitive information and tag it accordingly.

A segment is SENSITIVE if it contains ANY of the following:
- Client names, project names, or engagement details
- Day rates, contract fees, pricing, or financial figures
- HMRC, tax, or legal matters
- Personal health or financial circumstances
- Internal URLs, infrastructure details, or deployment specifics that are not publicly known
- Specific contract terms, SOW details, or commercial arrangements
- Names of individuals (other than Kevin Ryan himself)

A segment is NOT SENSITIVE if it contains:
- General greetings, pleasantries, or conversational filler
- Generic technical explanations (e.g. "Kubernetes uses pods to manage containers")
- Descriptions of publicly known technologies, methodologies, or frameworks
- General business advice that does not reference specific clients or figures
- Questions back to the user
- References to SDD methodology, AI-Native engineering concepts, or other publicly known Kevin Ryan & Associates practices

Format your ENTIRE response as a JSON array. Do not include any text before or after the JSON array. Do not wrap it in markdown code fences. Example:

[{"text":"Happy to help with that.","sensitive":false},{"text":"The CERN deployment uses a custom K3s cluster running on Azure with Flux CD for GitOps.","sensitive":true},{"text":"Generally, Flux CD reconciles the desired state from a Git repository against the live cluster state.","sensitive":false}]

Rules:
- Every segment MUST have exactly two keys: "text" (string) and "sensitive" (boolean).
- Keep segments at sentence or short-paragraph granularity. Do not put your entire response in a single segment.
- When in doubt, mark a segment as sensitive. Over-redaction is safer than under-redaction.
- Do not include a "reason" field or any other keys — only "text" and "sensitive".
- Your response must be parseable by JSON.parse() with no modifications.
- Do NOT wrap the JSON in markdown code fences (\`\`\`json ... \`\`\`). Output raw JSON only.`
```

**Design notes:**

- The prompt is explicit about what is and is not sensitive because Claude needs clear boundaries to make consistent decisions.
- The "when in doubt, mark sensitive" instruction ensures the demo errs on the side of caution.
- We use a flat JSON array (not nested objects) to keep parsing simple.
- The "no markdown code fences" instruction is critical — Claude's instinct is to wrap JSON in fences, which would break `JSON.parse()`.
- The "no text before or after" instruction prevents Claude from adding preamble like "Here is my response:" before the JSON.

## 2. Modify the streaming response handling in route.ts

The current implementation streams text chunks directly to the client. When `redacted` is true, we need to **buffer the complete response** and then send it, because the JSON structure cannot be reliably parsed from a partial stream.

### 2a. Non-redacted mode (no change to streaming)

When `redacted` is `false`, the current streaming behaviour is preserved exactly as-is. Plain text chunks flow through to the client in real time.

### 2b. Redacted mode (buffered JSON response)

When `redacted` is `true`, the response must be buffered and then sent as a single chunk. Modify the `POST` handler:

Replace the streaming logic in the `readable` ReadableStream's `start` function. The key change is: when `redacted` is true, instead of streaming text events directly via `stream.on('text', ...)`, accumulate all text into a buffer. After the final message is received (after all tool-use loops complete), send the entire buffered text as one chunk.

```typescript
// Inside the ReadableStream start function:

// For non-redacted: stream text events directly (existing behaviour)
// For redacted: buffer all text, then send at end

let textBuffer = ''

// In the while(true) loop:
stream.on('text', (text) => {
  if (redacted) {
    textBuffer += text
  } else {
    controller.enqueue(encoder.encode(text))
  }
})

// After the while loop breaks (final response):
if (redacted && textBuffer.length > 0) {
  controller.enqueue(encoder.encode(textBuffer))
}
controller.close()
```

**Design notes:**

- Buffering is necessary because partial JSON is not parseable. The client needs the complete JSON array to render segments.
- This means redacted-mode responses will appear all at once (no word-by-word streaming effect). This is acceptable — it also creates a visual distinction that signals "something different is happening" when redacted mode is on.
- Non-redacted mode is completely unchanged — zero performance or behaviour impact.

## 3. Update ChatInterface.tsx to handle structured responses

Modify the message handling in `ChatInterface.tsx` to detect and store structured responses when in redacted mode.

### 3a. Update the Message interface

Add an optional `segments` field to the Message interface:

```typescript
interface Segment {
  text: string
  sensitive: boolean
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  segments?: Segment[]
}
```

### 3b. Parse structured responses

After the streaming read loop completes for an assistant message (i.e. after `done` is true), if `redacted` is true, attempt to parse the accumulated content as JSON. If parsing succeeds and the result is an array of objects with `text` and `sensitive` keys, store the segments on the message.

In the `sendMessage` function, after the `while (true)` reader loop finishes:

```typescript
// After streaming is complete, if redacted, try to parse segments
if (redacted) {
  setMessages((prev) => {
    const next = [...prev]
    const last = next[next.length - 1]
    if (last?.role === 'assistant') {
      try {
        const parsed = JSON.parse(last.content)
        if (Array.isArray(parsed) && parsed.length > 0 && 'text' in parsed[0] && 'sensitive' in parsed[0]) {
          const segments: Segment[] = parsed.map((s: { text: string; sensitive: boolean }) => ({
            text: s.text,
            sensitive: s.sensitive,
          }))
          // Replace content with the concatenated plain text (for accessibility/search)
          // and store segments separately
          next[next.length - 1] = {
            role: 'assistant',
            content: segments.map((s) => s.text).join(' '),
            segments,
          }
        }
      } catch {
        // JSON parse failed — treat as plain text, blanket blur as fallback
        // This handles cases where Claude did not follow the JSON instruction
      }
    }
    return next
  })
}
```

**Design notes:**

- The `content` field is updated to contain the concatenated plain text of all segments. This ensures that if the user turns off redacted mode, the message is still readable as plain text.
- The `segments` field is only present on messages received while redacted mode was on.
- If JSON parsing fails (Claude didn't follow the format), the message stays as plain text with no segments. The MessageBubble will fall back to blanket blur for that message (see section 4).
- The `Segment` interface should be exported or defined in a shared location so both ChatInterface and MessageBubble can use it. Define it in `ChatInterface.tsx` and export it, or define it in a separate types file. Builder agent: choose the approach that keeps the codebase simplest and record the decision in provenance.

## 4. Update MessageBubble.tsx for selective blur

Replace the current blanket blur with segment-aware rendering.

### 4a. Update the MessageBubbleProps interface

```typescript
interface Segment {
  text: string
  sensitive: boolean
}

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    segments?: Segment[]
  }
  redacted?: boolean
}
```

### 4b. Rendering logic

The rendering logic should follow these rules:

1. **User messages + redacted ON:** Blanket blur the entire bubble (same as current behaviour). User messages never have segments.

2. **Assistant messages + redacted ON + segments exist:** Render each segment individually. Sensitive segments are blurred. Non-sensitive segments are rendered normally.

3. **Assistant messages + redacted ON + no segments (fallback):** Blanket blur the entire bubble. This handles messages that were sent before redacted mode was turned on, or cases where JSON parsing failed.

4. **Any message + redacted OFF:** Render normally (same as current behaviour). Ignore segments entirely.

### 4c. Segment rendering

For assistant messages with segments in redacted mode, replace the current single content div with a series of segment divs:

```tsx
// Inside the content div (the one with backgroundColor and padding):
{redacted && !isUser && message.segments && message.segments.length > 0 ? (
  // Selective redaction: render each segment
  message.segments.map((segment, idx) => (
    <div
      key={idx}
      style={{
        filter: segment.sensitive ? 'blur(5px)' : 'none',
        userSelect: segment.sensitive ? 'none' : 'auto',
        transition: 'filter 0.3s ease',
        marginBottom: idx < message.segments!.length - 1 ? '0.5rem' : 0,
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {segment.text}
      </ReactMarkdown>
    </div>
  ))
) : (
  // Normal rendering (existing code) — with blanket blur for user messages in redacted mode
  <div
    style={{
      filter: redacted && isUser ? 'blur(5px)' : (redacted && !isUser && !message.segments ? 'blur(5px)' : 'none'),
      userSelect: redacted ? 'none' : 'auto',
      transition: 'filter 0.3s ease',
    }}
  >
    {isUser ? (
      <span style={{ whiteSpace: 'pre-wrap' }}>{cleanText}</span>
    ) : (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cleanText}
      </ReactMarkdown>
    )}
  </div>
)}
```

**Design notes:**

- The blur/no-blur is applied per-segment div, not on the outer content container. This means the background and padding of the bubble are always visible — only the text within sensitive segments is blurred.
- Each segment is wrapped in its own `<div>` with its own blur filter. Non-sensitive segments render with full clarity.
- The fallback for messages without segments (pre-existing messages or parse failures) is blanket blur — same as spec 0014 behaviour. This ensures we never show potentially sensitive content that hasn't been classified.
- `marginBottom: '0.5rem'` between segments provides visual separation.
- The `ReactMarkdown` component is used for each segment so that markdown formatting within segments is preserved.
- The existing document download block rendering (the `documents.map(...)` section) remains OUTSIDE the blur logic and is never blurred — same as spec 0014.

### 4d. Blur behaviour for the content container

The current `filter: blur(5px)` on the outer content div must be removed. The blur is now applied at the segment level (or at the inner div level for blanket fallback). The outer content div should always have `filter: 'none'`.

Update the content div's style:

```tsx
// The outer content div (with backgroundColor, border, padding)
style={{
  backgroundColor: isUser ? '#1a2a05' : '#111111',
  border: `1px solid ${isUser ? '#A8E10C' : '#222222'}`,
  padding: '0.75rem 1rem',
  color: '#F5F3EF',
  fontFamily: "'Archivo', sans-serif",
  fontSize: '0.9375rem',
  lineHeight: 1.6,
  wordBreak: 'break-word',
  // REMOVED: filter and userSelect are now on inner segment divs
  transition: 'filter 0.3s ease',
}}
```

## 5. Handle the typing indicator during redacted mode

When `redacted` is true and a response is being generated, the response is buffered (section 2b) — so no streaming text appears. The typing indicator (bouncing dots) should display while waiting for the complete response.

The current typing indicator logic in `ChatInterface.tsx` already shows dots when `loading` is true and the last message is from the user. This is correct and requires **no change** — the buffered response will arrive all at once, at which point `loading` is set to false and the typing indicator disappears.

No changes needed here. Document this in provenance as an intentional no-op.

## 6. Edge case: toggling redacted mode mid-conversation

When the user toggles redacted mode:

- **Turning ON:** Messages already in the conversation do NOT have segments (they were received as plain text). These should blanket-blur (the fallback path in section 4c). Only new messages sent while redacted is on will have segments.
- **Turning OFF:** All messages render normally. The `segments` field is ignored. The `content` field (which contains the concatenated plain text) is displayed.

This requires **no additional code** — the rendering logic in section 4 already handles both cases via the conditional checks. Document this in provenance.

## Constraints and Assumptions

- **Constraint:** Non-redacted mode must be completely unchanged — same streaming behaviour, same rendering, zero regression.
- **Constraint:** The `REDACTED_SYSTEM_PROMPT` must be built by appending to `BASE_SYSTEM_PROMPT`, same as the current pattern. Do not load a separate file for the redacted prompt.
- **Constraint:** The system prompt file for the HQ app is at `sites/hq-kevinryan-io/config/hq-system-prompt.md`. Do NOT modify the root-level `config/hq-system-prompt.md` — that is the prompt for the MCP tool integration, not the app.
- **Constraint:** JSON parsing failure must not crash the app. If `JSON.parse()` throws, fall back to blanket blur gracefully.
- **Assumption:** Claude will follow the JSON format instruction reliably enough for demo purposes. Occasional failures are acceptable and handled by the fallback.
- **Assumption:** The buffered (non-streaming) response in redacted mode is acceptable UX. The response appears all at once after a loading period, which is a reasonable tradeoff for structured output.
- **Assumption:** User messages are always blanket-blurred in redacted mode. There is no sensitivity analysis on user input — the user could type anything.
- **Assumption:** The `Segment` type definition can live in either a shared types file or be duplicated in ChatInterface.tsx and MessageBubble.tsx. Builder agent should choose the cleanest approach.

## Out of Scope

- **Selective redaction of user messages** — User messages are always blanket-blurred. Analysing user input for sensitivity is a future enhancement.
- **Persistent segment data** — Segments are stored in React state only. They do not survive page refresh.
- **Segment-level "reveal" interaction** — Clicking a blurred segment to temporarily reveal it is a future enhancement.
- **Server-side redaction** — This spec only handles client-side visual redaction. The API transmits full content; blurring is a UI concern.
- **LLM classification API call** — We are not making a separate API call to classify sensitivity. Claude self-classifies within its response. This is simpler and cheaper.
- **Tests** — The builder agent does not write tests. Testing is handled by the testing agent.

## Manual steps (not performed by the agent)

None — all changes are in application code and will be built and deployed via the existing CI/CD pipeline.

Verify after merge:

1. Visit `https://hq.kevinryan.io`
2. Send a message with redacted mode OFF — response should stream normally (word by word), no change from current behaviour
3. Turn on "REDACT DATA" toggle
4. Send a message like "What's the status of the CERN deployment?" or "What are Kevin's current day rates?"
5. The response should appear after a brief loading period (buffered, not streamed)
6. Some segments of the response should be visible (general statements) and some should be blurred (client names, financial details, internal specifics)
7. Turn off the toggle — all message content should be fully visible again
8. Messages received before the toggle was turned on should be blanket-blurred when toggle is on (no segments)

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0015-selective-redaction.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0015-selective-redaction.md`
2. `route.ts` contains the new `REDACTED_SYSTEM_PROMPT` with JSON array format instructions
3. `route.ts` buffers the response when `redacted` is true (text is not streamed via `stream.on('text', ...)` in redacted mode)
4. `route.ts` sends the buffered text as a single chunk after all tool-use loops complete
5. `route.ts` preserves existing streaming behaviour when `redacted` is false — no changes to the non-redacted code path
6. `ChatInterface.tsx` contains a `Segment` interface with `text: string` and `sensitive: boolean`
7. `ChatInterface.tsx` attempts `JSON.parse()` on the assistant response after streaming completes when `redacted` is true
8. `ChatInterface.tsx` stores parsed segments on the message object
9. `ChatInterface.tsx` gracefully handles `JSON.parse()` failure (try/catch, falls back to plain text)
10. `MessageBubble.tsx` renders segments individually when `redacted` is true and segments exist
11. `MessageBubble.tsx` applies `filter: blur(5px)` only to segments where `sensitive` is true
12. `MessageBubble.tsx` renders non-sensitive segments with `filter: none` — text is fully readable
13. `MessageBubble.tsx` blanket-blurs user messages when redacted is true (no segments on user messages)
14. `MessageBubble.tsx` blanket-blurs assistant messages that have no segments when redacted is true (fallback)
15. `MessageBubble.tsx` does NOT blur document download buttons
16. The outer content div in MessageBubble no longer has `filter` or `userSelect` in its style — these are on inner divs
17. `pnpm lint` passes with no errors
18. `pnpm build` completes successfully
19. The provenance record exists at `.sdd/provenance/spec-0015-selective-redaction.provenance.md` and contains all required sections
20. All files (spec, implementation, provenance) are committed together
