---
title: "Spec 0016: Chat API Error Handling and UI Error Display"
draft: true
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- All files listed under "Current state" below
- The provenance template at `.sdd/provenance/template.md`

**Produces:**

- Working software that satisfies all requirements in this spec
- A provenance record at `.sdd/provenance/spec-0016-chat-error-handling.provenance.md`

**Instructions:**

1. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
2. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
3. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens.
4. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
5. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
6. Do not write tests. Testing is not your role.
7. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
8. Commit the spec, implementation, and provenance together.
9. After committing, post a summary comment on the PR describing what was implemented.

### Testing Agent

Not applicable for this spec — this is a UI/API error handling improvement that is best verified manually.

---

## Task

1. Implement all changes described below.
2. After completing all work, create a provenance record at `.sdd/provenance/spec-0016-chat-error-handling.provenance.md`.

## Prerequisites

- Spec 0015 deployed: Selective redaction is live on main

## Context

The HQ chat interface currently has two critical error handling gaps:

1. **Server-side (route.ts):** The `ReadableStream.start()` function has **no try/catch**. If the Anthropic SDK throws (e.g. invalid request, rate limit, network error, model error), the exception is unhandled. This causes the Next.js process to return an opaque 500, which Cloudflare proxies as a 502 with a generic HTML error page. There is no way to diagnose what went wrong without checking pod logs.

2. **Client-side (ChatInterface.tsx):** When the API returns a non-200 response, the error handler discards all useful information — the HTTP status code, status text, and response body are all ignored. The user sees only the unhelpful string `"Error: failed to get response."`.

This is actively blocking diagnosis of a redact-mode 502 error. We need the actual error message surfaced in the UI.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Server-side chat API route — streams Claude responses |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Client-side chat UI — sends messages, reads streams, renders messages |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual message bubbles (user and assistant) |
| `sites/hq-kevinryan-io/app/types/chat.ts` | TypeScript types for Message and Segment |

### Key facts

- The API route uses `client.messages.stream()` from `@anthropic-ai/sdk`
- The streaming runs inside a `ReadableStream({ async start(controller) { ... } })` constructor
- The client reads the stream with `res.body.getReader()`
- Errors can occur at multiple points: auth check, JSON parsing, Anthropic API call, tool execution, mid-stream failures
- The response goes through Cloudflare (which returns its own HTML 502 page when the origin errors)

## 1. Server-side error handling in route.ts

### 1.1 Wrap the entire ReadableStream.start() body in try/catch

The `async start(controller)` function must be wrapped in a try/catch. On error:

- Log the error server-side with `console.error('[HQ] Stream error:', err)`
- Encode a user-friendly error message as a text chunk: `[HQ_ERROR] <message>`
- Enqueue that error chunk to the controller so the client receives it
- Close the controller cleanly

The error prefix `[HQ_ERROR] ` is a sentinel that the client will detect and use to display the error. This approach works because the response is a text stream — even if headers have already been sent with status 200, we can still communicate the error through the stream body.

```typescript
const readable = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder()
    try {
      // ... existing streaming logic (while loop, tool use, etc.) ...
    } catch (err: unknown) {
      console.error('[HQ] Stream error:', err)
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      controller.enqueue(encoder.encode(`[HQ_ERROR] ${message}`))
    } finally {
      controller.close()
    }
  },
})
```

**Important:** Move the existing `controller.close()` call into the `finally` block so it always runs, whether the stream completes successfully or errors.

### 1.2 Add a top-level try/catch around the pre-stream code

The code before the ReadableStream (session check, JSON parsing) should also have error handling. Wrap the `request.json()` call in a try/catch and return a proper JSON error response:

```typescript
export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let messages: Message[]
  let redacted: boolean
  try {
    const body = await request.json()
    messages = body.messages
    redacted = body.redacted ?? false
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ... rest of the route
}
```

## 2. Client-side error display in ChatInterface.tsx

### 2.1 Extract error details from non-200 responses

Replace the current generic error handler with one that extracts actual error information:

```typescript
if (!res.ok || !res.body) {
  let errorDetail = `${res.status} ${res.statusText}`
  try {
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const errorJson = await res.json()
      errorDetail = errorJson.error ?? errorDetail
    } else if (contentType.includes('text/plain')) {
      const errorText = await res.text()
      if (errorText.length > 0 && errorText.length < 500) {
        errorDetail = errorText
      }
    }
    // If it's text/html (e.g. Cloudflare 502 page), don't try to parse it —
    // the status code is informative enough
  } catch {
    // If we can't parse the error body, fall back to status code
  }
  setMessages((prev) => [
    ...prev,
    {
      role: 'assistant',
      content: `⚠️ Error: ${errorDetail}`,
    },
  ])
  return
}
```

### 2.2 Detect the [HQ_ERROR] sentinel in the stream

After the streaming while loop completes, check if the accumulated assistant message starts with or contains the error sentinel. If so, rewrite the message to display it as an error:

```typescript
// After the streaming while loop ends:
setMessages((prev) => {
  const next = [...prev]
  const last = next[next.length - 1]
  if (last?.role === 'assistant' && last.content.includes('[HQ_ERROR] ')) {
    // Extract the error message after the sentinel
    const errorStart = last.content.indexOf('[HQ_ERROR] ')
    const errorMessage = last.content.substring(errorStart + '[HQ_ERROR] '.length)
    // Replace any content with just the error (there may be partial content before the error)
    next[next.length - 1] = {
      role: 'assistant',
      content: `⚠️ Error: ${errorMessage}`,
    }
  }
  return next
})
```

Place this block **after** the streaming while loop and **before** the redacted-mode JSON parsing block. It should run in both normal and redacted mode.

### 2.3 Wrap the entire fetch + streaming block in try/catch

The existing try block around the fetch should also catch network-level errors (e.g. if the server is completely unreachable):

```typescript
try {
  const res = await fetch('/api/chat', { ... })
  // ... existing stream handling ...
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Network error'
  setMessages((prev) => [
    ...prev,
    { role: 'assistant', content: `⚠️ Connection error: ${message}` },
  ])
} finally {
  setLoading(false)
}
```

Note: the existing code already has a `finally { setLoading(false) }` — make sure this structure is preserved, not duplicated.

## 3. Error styling in MessageBubble.tsx

No changes needed to MessageBubble.tsx — error messages are plain text content in an assistant message and will render normally with the ⚠️ emoji prefix making them visually distinct. The existing styling is sufficient.

## Constraints and Assumptions

- **Constraint:** The `[HQ_ERROR] ` sentinel prefix must not conflict with normal Claude output. The square-bracket-uppercase format is sufficiently unusual that Claude would not produce it in normal conversation.
- **Constraint:** Error messages must not leak sensitive server-side details (e.g. API keys, internal paths). The Anthropic SDK error messages are generally safe to surface — they contain status codes and descriptions, not secrets.
- **Assumption:** The Anthropic SDK throws standard JavaScript `Error` objects (or subclasses) when API calls fail.
- **Assumption:** The `controller.enqueue()` / `controller.close()` pattern works correctly even when called from within a catch block in the ReadableStream start function.

## Out of Scope

- Retry logic — not adding automatic retries for failed requests
- Error reporting/telemetry — not sending errors to an external service
- Toast notifications or separate error UI components — errors display in the message stream
- Fixing the underlying redact-mode 502 — this spec is about surfacing the error, not fixing its root cause

## Manual steps (not performed by the agent)

None — all changes are code. After merge, the deploy pipeline will build and push the new image.

Verify by:

1. Deploy the new build
2. Toggle redact mode on in the UI
3. Send a message
4. If the redact-mode error persists, the error message bubble should now show the actual error (e.g. "⚠️ Error: 400 Bad Request — invalid model" or similar) instead of the generic "Error: failed to get response."

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0016-chat-error-handling.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. `sites/hq-kevinryan-io/app/api/chat/route.ts` has try/catch around `request.json()` and returns JSON error responses for 401 and 400
2. `sites/hq-kevinryan-io/app/api/chat/route.ts` has try/catch inside the `ReadableStream.start()` function with `[HQ_ERROR]` sentinel output
3. `sites/hq-kevinryan-io/app/api/chat/route.ts` has `controller.close()` in a `finally` block
4. `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` extracts status code, status text, and body from non-200 responses
5. `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` detects `[HQ_ERROR]` sentinel in streamed content and rewrites the message
6. `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` has a catch block around the fetch for network errors
7. `pnpm lint` passes
8. `pnpm build` passes
9. The provenance record exists at `.sdd/provenance/spec-0016-chat-error-handling.provenance.md`
10. All files are committed together
