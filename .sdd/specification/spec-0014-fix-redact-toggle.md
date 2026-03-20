---
title: "Spec 0014: Fix Redact Data Toggle"
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
- A provenance record at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0014-fix-redact-toggle.md` in the repo. This is the canonical reference. Do not modify it after saving.
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
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-0014-fix-redact-toggle.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0014-fix-redact-toggle.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` in full.
3. Compare the provenance against the specification. Identify Gaps, Assumptions, Ambiguities, Silences, and Deviations.
4. Write prose scenarios to `.sdd/scenarios/spec-0014-fix-redact-toggle.scenarios.md`.
5. Implement each prose scenario as executable test code in `tests/`.
6. Run the tests against the built software.
7. Update the provenance document with a "Testing Agent Findings" section.

---

## Task

1. Save this spec to `.sdd/specification/spec-0014-fix-redact-toggle.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0010 deployed: HQ Chat Interface exists and is functional
- Spec 0012 deployed: File download feature exists in MessageBubble
- Read the brand guidelines at `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` — all styling must comply

## Context

The "Redact Data" toggle in the HQ chat interface header has four bugs:

1. **Double-toggle bug:** The toggle requires multiple clicks to visually change state. This happens because a `<label>` wraps both a hidden `<input type="checkbox">` and a `<div role="switch">` with its own `onClick` handler. When the user clicks the toggle track, the label forwards the click to the checkbox (calling `onChange` → `onDemoModeChange`) AND the div's `onClick` fires (calling `onDemoModeChange(!demoMode)`). The state flips twice per click, appearing to do nothing. Only odd-numbered rapid clicks produce a visible change.

2. **Incorrect variable name:** The state variable is called `demoMode` throughout the codebase. It should be called `redacted` to accurately describe its purpose. The API route reads `demoMode` from the request body and uses it to select the system prompt. This must also be renamed.

3. **No client-side data redaction:** When the toggle is on, messages already rendered in the chat are displayed in plain text. The toggle only affects the system prompt for future API calls and shows a "REDACTED" badge — it does not visually obscure any content already on screen. When redacted mode is active, all message bubble content should be blurred using CSS so that on-screen data is not readable.

4. **Brand non-compliance:** The toggle uses amber/yellow (`#F59E0B`) for the active state and badge background. Per the brand guidelines, the accent colour is Lime `#A8E10C`. The toggle and badge must use brand-compliant colours.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Main chat container. Holds `demoMode` state, passes it to ChatHeader, ChatInput, and the API call. |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Header with the Redact Data toggle. Contains the double-toggle bug and amber styling. |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual messages. Currently has no awareness of redacted state. |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Chat input area. Receives `demoMode` prop for placeholder text. |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | API route. Reads `demoMode` from request body to select system prompt. |
| `sites/hq-kevinryan-io/app/globals.css` | Global CSS including `.hq-markdown` styles. |
| `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` | Brand guidelines — canonical colour and typography reference. |

### Key facts

- **Accent colour:** `#A8E10C` (Lime) — used for all interactive elements per brand guidelines
- **Accent dim:** `#92C40A` (Lime Dim) — available for hover/active states
- **Black:** `#0A0A0A`
- **White:** `#F5F3EF` (warm off-white)
- **Dark:** `#111111`
- **Dark Mid:** `#1A1A1A`
- **Body font:** Archivo
- **Display font:** Bebas Neue
- **Mono font:** JetBrains Mono (used for labels and code)
- **Label style:** Archivo 700, 0.7rem, letter-spacing 0.18em, uppercase
- **Button style:** Archivo 800, 0.72rem, letter-spacing 0.14em, uppercase

## 1. Fix the double-toggle bug in ChatHeader.tsx

The root cause is that a `<label>` element wraps both a hidden `<input type="checkbox">` and a `<div role="switch" onClick={...}>`. When the user clicks the div, two things happen:

- The div's `onClick` fires → `onRedactedChange(!redacted)`
- The click event bubbles up to the `<label>`, which forwards it to the `<input>` → `onChange` fires → `onRedactedChange(e.target.checked)`

This toggles the state twice, netting zero visual change.

**Fix:** Remove the hidden `<input type="checkbox">` entirely. The `<div role="switch">` already handles keyboard events (`Space`, `Enter`) and has `aria-checked` and `aria-label` for accessibility. The hidden checkbox is redundant and causes the conflict.

The resulting structure should be:

```
<div style={container}>
  <span>REDACT DATA</span>
  <div role="switch" aria-checked={redacted} onClick={...} onKeyDown={...} tabIndex={0}>
    <div style={thumb} />
  </div>
</div>
```

Remove the `<label>` wrapper and the `<input type="checkbox">`. The outer element should be a plain `<div>` with `display: flex; align-items: center; gap: 0.5rem; cursor: pointer`. Add an `onClick` on the outer div that also toggles, so clicking the "REDACT DATA" text works too — but since there is no hidden input, there is no double-fire.

**Important:** The outer `<div>` click and the inner `<div role="switch">` click will both fire due to event bubbling. To prevent double-toggle, apply `onClick` ONLY on the outer container div and use `e.stopPropagation()` is NOT needed — simply remove the `onClick` from the inner `<div role="switch">`. The inner div keeps `role="switch"`, `aria-checked`, `aria-label`, `tabIndex`, and `onKeyDown` for keyboard accessibility, but does NOT have its own `onClick`. The outer container's `onClick` handles all pointer clicks.

## 2. Rename `demoMode` to `redacted` throughout

Rename the state variable, props, API field, and all references. This is a find-and-replace across the affected files.

### ChatInterface.tsx

- `const [demoMode, setDemoMode] = useState(false)` → `const [redacted, setRedacted] = useState(false)`
- `demoMode={demoMode}` → `redacted={redacted}` (ChatHeader prop)
- `onDemoModeChange={setDemoMode}` → `onRedactedChange={setRedacted}` (ChatHeader prop)
- `demoMode={demoMode}` → `redacted={redacted}` (ChatInput prop)
- `body: JSON.stringify({ messages: updatedMessages, demoMode })` → `body: JSON.stringify({ messages: updatedMessages, redacted })`

### ChatHeader.tsx

- Interface prop `demoMode: boolean` → `redacted: boolean`
- Interface prop `onDemoModeChange: (value: boolean) => void` → `onRedactedChange: (value: boolean) => void`
- All internal references to `demoMode` → `redacted`
- All internal references to `onDemoModeChange` → `onRedactedChange`

### ChatInput.tsx

- Interface prop `demoMode: boolean` → `redacted: boolean`
- Destructured prop `demoMode` → `redacted`
- Placeholder text: `redacted ? 'ask HQ anything (redacted mode)' : 'ask HQ anything'`

### API route (route.ts)

- Request body destructuring: `const { messages, demoMode }` → `const { messages, redacted }`
- System prompt selection: `demoMode ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT` → `redacted ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT`
- Rename `DEMO_SYSTEM_PROMPT` constant to `REDACTED_SYSTEM_PROMPT` for consistency
- Update the redacted system prompt text: replace "DEMO MODE IS ACTIVE" with "REDACTED MODE IS ACTIVE"

## 3. Add CSS blur redaction to message content

When `redacted` is `true`, all message bubble content (both user and assistant messages) must be visually blurred so the text is not readable on screen.

### 3a. Pass `redacted` prop to MessageBubble

In `ChatInterface.tsx`, pass the `redacted` state to each `MessageBubble`:

```tsx
<MessageBubble key={i} message={msg} redacted={redacted} />
```

### 3b. Update MessageBubble component

Add `redacted` to the `MessageBubbleProps` interface:

```tsx
interface MessageBubbleProps {
  message: Message
  redacted?: boolean
}
```

Apply a CSS blur filter to the message content `<div>` when `redacted` is true. The blur should:

- Use `filter: blur(5px)` on the content div (the one with `backgroundColor` and `padding`)
- Use `user-select: none` when blurred to prevent copy-paste of redacted content
- Apply a smooth transition: `transition: 'filter 0.3s ease'`
- Apply to BOTH user and assistant message bubbles
- NOT blur the "HQ" label above assistant messages
- NOT blur the document download buttons below messages

The implementation on the content div:

```tsx
style={{
  // ...existing styles...
  filter: redacted ? 'blur(5px)' : 'none',
  userSelect: redacted ? 'none' : 'auto',
  transition: 'filter 0.3s ease',
}}
```

### 3c. Also blur the typing indicator

In `ChatInterface.tsx`, the typing indicator (the bouncing dots) does not need to be blurred — it contains no sensitive data. Leave it as-is.

## 4. Fix brand-compliant styling in ChatHeader.tsx

Replace all instances of amber `#F59E0B` with brand-compliant colours.

### Toggle track (active state)

- Current: `backgroundColor: demoMode ? '#F59E0B' : '#2a2a2a'`
- New: `backgroundColor: redacted ? '#A8E10C' : '#2a2a2a'`

- Current: `border: '1px solid ${demoMode ? '#F59E0B' : '#444'}'`
- New: `border: '1px solid ${redacted ? '#A8E10C' : '#444'}'`

### "REDACT DATA" label text colour

- Current: `color: demoMode ? '#F59E0B' : '#F5F3EF66'`
- New: `color: redacted ? '#A8E10C' : '#F5F3EF66'`

### "REDACTED" badge

- Current: `color: '#0A0A0A', backgroundColor: '#F59E0B'`
- New: `color: '#0A0A0A', backgroundColor: '#A8E10C'`

### Toggle thumb colour

The toggle thumb is currently `#0A0A0A` (black) which works well against the lime active track. Keep it as-is.

### Font compliance

The "REDACT DATA" label and "REDACTED" badge both use JetBrains Mono. Per brand guidelines, labels should use Archivo 700, 0.7rem, letter-spacing 0.18em, uppercase. However, the HQ interface uses JetBrains Mono as its monospace UI font for all metadata and controls (build hash, hint pills, etc), and this is an established pattern in the codebase. **Keep JetBrains Mono** for the toggle label and badge to maintain visual consistency with the rest of the HQ UI. This is a deliberate deviation from brand typography rules for the HQ app specifically — record it in the provenance.

## Constraints and Assumptions

- **Constraint:** All colour values must use the exact hex codes from the brand guidelines. No approximations.
- **Constraint:** The blur value of `5px` provides sufficient obscurity while still showing the general shape/length of content, making it clear that content exists but is redacted. Do not use higher values that would make the content invisible.
- **Constraint:** The `filter: blur()` approach must not affect layout or cause any scrolling/overflow issues.
- **Assumption:** The `redacted` state is client-side only and does not persist across page refreshes. This is intentional — it's a session-level toggle for demos.
- **Assumption:** The API still needs to know about redacted mode to adjust the system prompt for future messages. The rename from `demoMode` to `redacted` in the request body is a breaking change to the API contract, but since the only consumer is the same app's frontend, this is safe.
- **Assumption:** Blurring applies immediately to all messages (including already-rendered ones) when the toggle is activated. No need to clear the conversation.

## Out of Scope

- **Server-side redaction** — This spec only addresses client-side visual redaction via CSS blur. The API-level system prompt adjustment (telling the AI not to reveal sensitive data) already exists and is retained.
- **Persisting redacted state** — The toggle resets on page refresh. Adding localStorage or URL param persistence is future work.
- **Redaction of specific fields** — This is a blanket blur of all message content, not selective redaction of PII/financial data within messages.
- **Tests** — The builder agent does not write tests. Testing is handled by the testing agent.

## Manual steps (not performed by the agent)

None — all changes are in application code and will be built and deployed via the existing CI/CD pipeline.

Verify after merge:

1. Visit `https://hq.kevinryan.io`
2. Click the "REDACT DATA" toggle once — it should respond immediately
3. The toggle track and badge should be lime `#A8E10C`, not amber
4. All message content should blur smoothly when redacted is on
5. Sending a new message while redacted should include `redacted: true` in the API payload (check Network tab)

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0014-fix-redact-toggle.md`
2. No file in the codebase contains the string `demoMode` (renamed to `redacted` everywhere)
3. No file in the codebase contains the colour `#F59E0B` (replaced with `#A8E10C`)
4. `ChatHeader.tsx` does NOT contain a `<label>` wrapper or `<input type="checkbox">` element
5. `ChatHeader.tsx` contains a `<div role="switch">` with `aria-checked`, `aria-label`, `tabIndex`, and `onKeyDown` but does NOT have its own `onClick` handler
6. `MessageBubble.tsx` accepts a `redacted` prop and applies `filter: blur(5px)` when true
7. `MessageBubble.tsx` applies `userSelect: 'none'` when redacted is true
8. `ChatInterface.tsx` passes `redacted={redacted}` to each `<MessageBubble>`
9. `route.ts` destructures `redacted` (not `demoMode`) from the request body
10. `route.ts` contains `REDACTED_SYSTEM_PROMPT` (not `DEMO_SYSTEM_PROMPT`)
11. `pnpm lint` passes with no errors
12. `pnpm build` completes successfully
13. The provenance record exists at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` and contains all required sections
14. All files (spec, implementation, provenance) are committed together
