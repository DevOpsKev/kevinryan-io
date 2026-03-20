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

- Spec 0014 deployed: Redact toggle exists, `redacted` state flows from ChatHeader through ChatInterface to MessageBubble and to the API route. CSS blur is applied to all message bubbles when `redacted` is true.
- Spec 0010 deployed: HQ Chat Interface is functional with streaming responses.
- Spec 0012 deployed: File download feature exists in MessageBubble.
- Read the brand guidelines at `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` — all styling must comply.

## Context

Spec 0014 implemented blanket CSS blur redaction — when the redact toggle is on, **all** message bubbles are blurred. This is too aggressive. The UI is used for client demos, and viewers need to see enough of the conversation to understand the flow while having genuinely sensitive content obscured.

This spec replaces blanket blur with **selective redaction**: when the redact toggle is on, Claude is instructed (via system prompt augmentation) to return structured responses where each segment is tagged as sensitive or not. The UI then blurs only the sensitive segments, leaving non-sensitive content visible.

This is a deliberate AI-Native design choice: rather than maintaining brittle keyword lists or regex patterns, we let the LLM reason about what is commercially sensitive. The cognitive overhead only applies when the toggle is active. When the toggle is off, the system behaves exactly as it does today — no structured output, no sensitivity tagging, no overhead.

### Current state (read these files before making changes)

**IMPORTANT:** The HQ app's system prompt file is at `sites/hq-kevinryan-io/config/hq-system-prompt.md`. This is NOT the same as the root-level `config/hq-system-prompt.md`. The app loads its prompt from `path.join(process.cwd(), 'config/hq-system-prompt.md')` in `route.ts`, and the app's working directory at runtime is `sites/hq-kevinryan-io/`. Make sure you understand this path resolution before making changes.

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | API route. Loads system prompt from `config/hq-system-prompt.md` (relative to app cwd). Contains `REDACTED_SYSTEM_PROMPT` which appends redaction instructions to the base prompt. Streams Claude responses to the client. Currently streams plain text. |
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | The HQ app's system prompt. Loaded by `route.ts` at runtime. This is the file that gets sent to Claude as the system message. |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Main chat container. Holds `redacted` state. Passes it to ChatHeader, ChatInput, and MessageBubble. Handles streaming API responses. |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual messages. Currently applies blanket `filter: blur(5px)` when `redacted` is true. Contains document download parsing. |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Header with the Redact Data toggle. Fixed and working per spec 0014. |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Chat input area. Receives `redacted` prop. |
| `sites/hq-kevinryan-io/app/globals.css` | Global CSS including `.hq-markdown` styles. |
| `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` | Brand guidelines — canonical colour and typography reference. |

### Key facts

- **Current redaction behaviour:** When `redacted` is true, ALL message bubbles get `filter: blur(5px)`. This is what we are replacing.
- **New redaction behaviour:** When `redacted` is true, Claude returns structured JSON with sensitivity-tagged segments. Only segments tagged `sensitive: true` are blurred. Non-sensitive segments render normally.
- **When `redacted` is false:** No change to current behaviour. Claude responds normally with plain text streaming. No structured output.
- **The system prompt path:** `sites/hq-kevinryan-io/config/hq-system-prompt.md` — loaded at runtime by `route.ts` via `path.join(process.cwd(), 'config/hq-system-prompt.md')`.
- **Accent colour:** `#A8E10C` (Lime)
- **Black:** `#0A0A0A`
- **White:** `#F5F3EF`
- **Dark:** `#111111`

## 1. Update the REDACTED_SYSTEM_PROMPT in route.ts

**File:** `sites/hq-kevinryan-io/app/api/chat/route.ts`

Replace the current `REDACTED_SYSTEM_PROMPT` constant with a new version that instructs Claude to return structured JSON with sensitivity-tagged segments.

The new `REDACTED_SYSTEM_PROMPT` should be:

```typescript
const REDACTED_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

REDACTED MODE IS ACTIVE. You must return your response as a JSON array of segments. Each segment has a "text" field and a "sensitive" field (boolean).

Rules for sensitivity classification:
- Mark as sensitive (true): client names, project codenames, contract values, day rates, financial figures, personal information, health details, tax/HMRC matters, internal URLs, API keys, specific deliverable details that could identify a client engagement, any commercially sensitive information.
- Mark as not sensitive (false): general greetings, technical explanations that are not client-specific, publicly known information, general advice, descriptions of methodology or process, tool usage descriptions, and any content that would be safe for a public audience.

Segment your response at natural sentence boundaries. Each segment should be one or a few sentences that share the same sensitivity level. Do not over-segment — group consecutive sentences that have the same sensitivity level into a single segment.

Your response must be ONLY the JSON array — no markdown, no code fences, no preamble, no explanation outside the JSON. Example format:

[{"text":"Hello! Let me look into that for you.","sensitive":false},{"text":"The ACME Corp deployment is using a custom auth flow with a day rate of £1,200.","sensitive":true},{"text":"The architecture follows a standard microservices pattern with Kubernetes orchestration.","sensitive":false}]

Important: Your entire response must be valid JSON. Do not include any text before or after the JSON array. Do not wrap it in markdown code blocks.`
```

**Design notes:**

- The prompt gives Claude explicit categories for sensitive vs. non-sensitive, reducing ambiguity.
- It instructs Claude to segment at sentence boundaries and group same-sensitivity sentences, preventing over-fragmentation.
- It demands pure JSON output with no wrapping, which is critical for reliable parsing.
- The example demonstrates the expected format with realistic content.

## 2. Change the streaming response handling for redacted mode in route.ts

**File:** `sites/hq-kevinryan-io/app/api/chat/route.ts`

When `redacted` is true, the response from Claude will be a JSON string (the sensitivity-tagged segments array). The current code streams plain text chunks to the client. We need to differentiate:

- **When `redacted` is false:** Stream plain text as today. No change.
- **When `redacted` is true:** Still stream the response as plain text (the JSON string), but add a custom response header `X-HQ-Redacted: true` so the client knows to parse the response as structured JSON rather than plain text.

In the `POST` function, when constructing the `Response`, add the `X-HQ-Redacted` header when `redacted` is true:

```typescript
const responseHeaders: Record<string, string> = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Transfer-Encoding': 'chunked',
}

if (redacted) {
  responseHeaders['X-HQ-Redacted'] = 'true'
}

return new Response(readable, { headers: responseHeaders })
```

**Design notes:**

- We do NOT change the streaming mechanism. Claude's response (whether plain text or JSON) is streamed identically. The client is responsible for interpreting the completed response.
- The `X-HQ-Redacted` header is a simple signal. The client checks for it after the stream completes to decide how to render.
- This avoids any changes to the streaming infrastructure, tool handling loop, or message accumulation logic.

## 3. Update ChatInterface.tsx to handle structured redacted responses

**File:** `sites/hq-kevinryan-io/app/components/ChatInterface.tsx`

The `sendMessage` function currently accumulates streamed chunks into a plain text string. When in redacted mode, after the stream completes, the accumulated text will be a JSON string containing the segments array. We need to:

1. After the streaming loop finishes, check if `redacted` is true.
2. If so, parse the accumulated assistant message content as JSON.
3. Store the parsed segments in a way that `MessageBubble` can render them selectively.

### 3a. Add a new message type that supports segments

Add a `Segment` interface and extend the `Message` interface:

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

### 3b. Parse the completed response when redacted

After the streaming `while` loop completes and `redacted` is true, parse the accumulated content:

```typescript
// After the streaming while loop
if (redacted) {
  setMessages((prev) => {
    const next = [...prev]
    const last = next[next.length - 1]
    if (last?.role === 'assistant') {
      try {
        const segments: Segment[] = JSON.parse(last.content)
        // Validate it's an array of objects with text and sensitive fields
        if (Array.isArray(segments) && segments.every(s => typeof s.text === 'string' && typeof s.sensitive === 'boolean')) {
          next[next.length - 1] = {
            ...last,
            segments,
            // Keep content as a plain-text fallback by joining segment texts
            content: segments.map(s => s.text).join(' '),
          }
        }
        // If parsing fails or validation fails, fall back to blanket blur
        // (the message stays as-is with no segments, and MessageBubble will blanket-blur)
      } catch {
        // JSON parse failed — Claude didn't return valid JSON
        // Fall back to blanket blur (no segments property)
        console.warn('[HQ] Failed to parse redacted response as JSON, falling back to blanket blur')
      }
    }
    return next
  })
}
```

**Design notes:**

- The JSON parsing happens **after** streaming completes. During streaming, the user sees the raw text accumulating (which will look like JSON). This is acceptable because the streaming indicator (bouncing dots) is shown while the assistant is responding, and the final parse + re-render happens immediately after.
- If Claude fails to return valid JSON (model inconsistency), we fall back gracefully to blanket blur — the `segments` property will be undefined, and MessageBubble will apply the existing blanket blur behaviour.
- The `content` field is always populated (either original text or joined segment text) so that non-redacted rendering always works.

### 3c. Handle streaming display during redacted mode

During streaming when `redacted` is true, the raw JSON text will be visible momentarily as it streams in. To avoid showing raw JSON to the user, when `redacted` is true AND the message is still streaming (i.e., `loading` is true), the MessageBubble should show a "processing" state instead of the raw text.

To achieve this, pass `loading` as a prop to MessageBubble for the last message:

```tsx
{messages.map((msg, i) => (
  <MessageBubble
    key={i}
    message={msg}
    redacted={redacted}
    isStreaming={loading && i === messages.length - 1 && msg.role === 'assistant'}
  />
))}
```

## 4. Update MessageBubble to render selectively blurred segments

**File:** `sites/hq-kevinryan-io/app/components/MessageBubble.tsx`

This is the core UI change. MessageBubble currently applies blanket blur when `redacted` is true. Replace this with segment-aware rendering.

### 4a. Update the props interface

```typescript
interface MessageBubbleProps {
  message: Message
  redacted?: boolean
  isStreaming?: boolean
}
```

And add the Segment and updated Message types (or import them — see design note below):

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

**Design note:** The `Message` and `Segment` interfaces are defined in both `ChatInterface.tsx` and `MessageBubble.tsx`. Ideally these would be in a shared types file, but to keep this spec focused and avoid unnecessary refactoring, duplicate the interfaces in both files. Record this as a known tech debt item in provenance. If the builder agent prefers to extract a shared types file (e.g., `sites/hq-kevinryan-io/app/types/chat.ts`), that is acceptable — record it in provenance.

### 4b. Rendering logic

The MessageBubble render logic should follow this decision tree:

1. **User messages when `redacted` is true:** Apply blanket blur (user's own messages might contain sensitive queries). Keep existing `filter: blur(5px)` behaviour for user messages.

2. **Assistant messages when `redacted` is true AND `isStreaming` is true:** Show a non-blurred placeholder message like "HQ is thinking..." in the message bubble, styled in the muted text colour (`#F5F3EF66`). Do NOT show the raw JSON stream.

3. **Assistant messages when `redacted` is true AND `message.segments` exists:** Render each segment individually. Non-sensitive segments render as normal markdown. Sensitive segments are wrapped in a blurred container.

4. **Assistant messages when `redacted` is true AND `message.segments` is undefined:** Fall back to blanket blur (same as spec-0014 behaviour). This handles the case where Claude failed to return valid JSON.

5. **Any message when `redacted` is false:** Render normally, exactly as today. No change.

### 4c. Segment rendering implementation

For case 3 above, render the segments like this:

```tsx
<div className="hq-markdown">
  {message.segments!.map((segment, idx) => (
    <span
      key={idx}
      style={{
        filter: segment.sensitive ? 'blur(5px)' : 'none',
        userSelect: segment.sensitive ? 'none' : 'auto',
        transition: 'filter 0.3s ease',
        display: 'inline',
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {segment.text}
      </ReactMarkdown>
    </span>
  ))}
</div>
```

**Design notes:**

- Each segment is wrapped in a `<span>` with conditional blur. Sensitive segments are blurred, non-sensitive ones are clear.
- The `display: inline` on the span ensures segments flow naturally. However, note that `ReactMarkdown` renders block-level elements (`<p>`, `<ul>`, etc.) which may not inline properly inside a `<span>`. The builder agent should test this and may need to use `<div>` instead of `<span>` for the wrapper element. If `<div>` is used, add `display: inline-block` or leave it as block-level — whichever renders more naturally. Record the decision in provenance.
- The `hq-markdown` class on the outer wrapper ensures existing markdown styles apply.
- The blur transition provides smooth visual feedback, consistent with spec-0014's animation.

### 4d. The streaming placeholder

When `isStreaming` is true and `redacted` is true, render:

```tsx
<div
  style={{
    backgroundColor: isUser ? '#1a2a05' : '#111111',
    border: `1px solid ${isUser ? '#A8E10C' : '#222222'}`,
    padding: '0.75rem 1rem',
    color: '#F5F3EF66',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8125rem',
    fontStyle: 'italic',
    letterSpacing: '0.03em',
  }}
>
  analysing sensitivity...
</div>
```

This replaces the raw JSON stream with a meaningful status indicator. The text uses the muted colour and JetBrains Mono to match the UI's metadata style.

## 5. Preserve document download functionality

**File:** `sites/hq-kevinryan-io/app/components/MessageBubble.tsx`

The existing `parseDocumentBlocks` function extracts `---DOCUMENT:filename---` blocks from assistant messages. When `redacted` is true and segments are present, document markers may appear inside segment text.

**Rule:** When segments are present, run `parseDocumentBlocks` on the **full joined content** (`message.content`) to extract documents, and render download buttons below the segments as today. Do NOT run `parseDocumentBlocks` on individual segment texts — this could split a document marker across segments.

When segments are present, the content displayed in the segments should have the document markers stripped. The simplest approach: after joining segment texts to create `message.content` (done in ChatInterface.tsx section 3b), the existing `parseDocumentBlocks(message.content)` call will handle extraction. For the segment rendering, also strip document markers from each segment's text before rendering.

The builder agent should ensure that document blocks are correctly extracted and rendered regardless of whether the response uses segments or plain text. Record any edge cases or decisions in provenance.

## 6. No changes to ChatHeader.tsx or ChatInput.tsx

These components are not modified by this spec. The toggle behaviour and input placeholder text remain as implemented in spec-0014.

## 7. No changes to the HQ app system prompt file

**File:** `sites/hq-kevinryan-io/config/hq-system-prompt.md`

This file is NOT modified. The redacted mode instructions are appended at runtime in `route.ts` via the `REDACTED_SYSTEM_PROMPT` constant, not baked into the prompt file. This keeps the base prompt clean and means the sensitivity tagging instructions only exist when redacted mode is active.

## Constraints and Assumptions

- **Constraint:** When `redacted` is false, the system must behave identically to the current implementation. Zero changes to the non-redacted path.
- **Constraint:** The blur CSS value remains `blur(5px)` for consistency with spec-0014.
- **Constraint:** The `X-HQ-Redacted` header is the only mechanism for the client to know the response should be parsed as JSON segments. Do not use query parameters, cookies, or body wrappers.
- **Constraint:** If JSON parsing fails for any reason, fall back to blanket blur. Never crash the UI due to a malformed response.
- **Assumption:** Claude will reliably return valid JSON when given the structured output instructions in the redacted system prompt. If it occasionally wraps the JSON in markdown code fences (```json ... ```), the client-side parser should strip those before parsing. Handle this edge case.
- **Assumption:** The sensitivity classification is probabilistic. Claude may occasionally over- or under-classify. This is acceptable — the demo context is controlled, and conservative over-classification (blurring more than necessary) is preferred to under-classification (leaking sensitive data).
- **Assumption:** Streaming raw JSON text is not shown to the user. The "analysing sensitivity..." placeholder hides the intermediate state.
- **Assumption:** User messages in redacted mode are always blanket-blurred. The user's own queries may contain sensitive information (e.g., "What's the CERN day rate?") and should not be visible during a demo.

## Out of Scope

- **Segment-level hover to reveal:** A future enhancement could let the user hover over a blurred segment to temporarily reveal it. Not in this spec.
- **Sensitivity confidence scoring:** Claude could return a confidence level (high/medium/low) per segment. Not in this spec — boolean is sufficient.
- **Persisting redacted state:** The toggle resets on page refresh. Same as spec-0014.
- **Server-side redaction:** This spec is about intelligent client-side display. The server still sends full content to the client. True server-side redaction (where sensitive content is never sent to the browser) is a different problem.
- **Tests:** The builder agent does not write tests. Testing is handled by the testing agent.

## Manual steps (not performed by the agent)

None — all changes are in application code and will be built and deployed via the existing CI/CD pipeline.

Verify after merge:

1. Visit `https://hq.kevinryan.io`
2. With redact toggle OFF: send a message. Verify normal streaming text response. No JSON, no segments, no blur.
3. Turn redact toggle ON.
4. Send a message like "What's the status of our client projects?"
5. While HQ is responding, verify you see "analysing sensitivity..." placeholder, NOT raw JSON.
6. After the response completes, verify: some segments are visible (general/non-sensitive text) and some segments are blurred (client names, project details, financials).
7. Verify user message bubbles are fully blurred.
8. Turn redact toggle OFF. Verify all messages render normally (plain text, no blur, no segment boundaries visible).
9. Check the Network tab: when redacted is on, verify the response includes the `X-HQ-Redacted: true` header.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0015-selective-redaction.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0015-selective-redaction.md`
2. `route.ts` contains an updated `REDACTED_SYSTEM_PROMPT` that instructs Claude to return JSON-segmented responses with sensitivity tags
3. `route.ts` adds an `X-HQ-Redacted: true` response header when `redacted` is true
4. `ChatInterface.tsx` defines a `Segment` interface with `text: string` and `sensitive: boolean`
5. `ChatInterface.tsx` parses the completed assistant response as JSON when `redacted` is true, with graceful fallback on failure
6. `ChatInterface.tsx` passes `isStreaming` prop to the last assistant MessageBubble
7. `MessageBubble.tsx` accepts `redacted` and `isStreaming` props
8. `MessageBubble.tsx` renders individual segments with per-segment blur when `message.segments` exists
9. `MessageBubble.tsx` shows "analysing sensitivity..." placeholder when `isStreaming` is true and `redacted` is true
10. `MessageBubble.tsx` falls back to blanket blur when `redacted` is true but `message.segments` is undefined
11. `MessageBubble.tsx` always blanket-blurs user messages when `redacted` is true
12. Document download buttons still render correctly for messages with document blocks in both redacted and non-redacted modes
13. When `redacted` is false, the entire system behaves identically to the spec-0014 implementation
14. No file in the codebase contains the string `demoMode` (regression check from spec-0014)
15. `pnpm lint` passes with no errors
16. `pnpm build` completes successfully
17. The provenance record exists at `.sdd/provenance/spec-0015-selective-redaction.provenance.md` and contains all required sections
18. All files (spec, implementation, provenance) are committed together
