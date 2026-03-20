---
title: "Spec 0014: Fix Redact Data Toggle"
draft: true
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
3. Compare the provenance against the specification. Identify:
   - **Gaps:** Requirements in the spec that the provenance does not address.
   - **Assumptions:** Decisions the builder made where the spec was silent. These are primary targets for scenarios.
   - **Ambiguities:** Places where the builder interpreted an ambiguous requirement. Generate scenarios that test whether the interpretation was reasonable.
   - **Silences:** Things the provenance does not mention at all. These may indicate missing implementation or missing provenance.
   - **Deviations:** Anywhere the builder deviated from the spec. Generate scenarios that test the impact.
4. Write prose scenarios to `.sdd/scenarios/spec-0014-fix-redact-toggle.scenarios.md`. Each scenario must:
   - Reference the specific spec requirement or provenance entry that triggered it.
   - State what is being tested and why, in plain language.
   - Define pass/fail criteria before any code is written.
5. Implement each prose scenario as executable test code in `tests/`. Every test must trace back to a numbered scenario in the prose document.
6. Run the tests against the built software.
7. Update the provenance document. Append a "Testing Agent Findings" section (do not modify the builder's sections). Record:
   - Gaps, assumptions, ambiguities, and silences found.
   - Scenario results (pass/fail with references to scenario IDs).
   - Recommendations: whether failing tests indicate a code fix, a spec clarification, or a provenance gap.

**On subsequent cycles:**

1. Re-read the updated provenance (including the builder's new entries).
2. Reassess existing scenarios — are they still relevant? Do the builder's fixes resolve them?
3. Generate new scenarios if the builder's fixes introduced new assumptions or decisions.
4. Re-run all tests. Update the provenance with new results.

---

## Task

1. Save this spec to `.sdd/specification/spec-0014-fix-redact-toggle.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0010 deployed: HQ chat interface exists and is functional
- Spec 0012 deployed: File download / document markers are working

## Context

The "Redact Data" toggle in the HQ chat interface has four bugs:

1. **Double-fire event bug** — The toggle requires multiple clicks to respond. The `ChatHeader.tsx` component wraps a hidden `<input type="checkbox">` inside a `<label>`, AND has a separate `<div role="switch" onClick={...}>` as a sibling. When the user clicks the visual toggle, the `<label>` propagates the click to the hidden checkbox `onChange`, AND the `<div onClick>` fires separately. This causes the state to flip twice (on→off→on), making it appear unresponsive.

2. **No client-side redaction** — Toggling redact mode only changes the system prompt sent with new API requests. Existing messages already rendered in the chat are not redacted. The requirement is that ALL existing messages in the chat should be visually redacted when the toggle is active.

3. **Off-brand styling** — The toggle uses amber `#F59E0B` for its active state (track colour and "REDACTED" badge). This colour is not in the brand palette. It also uses `JetBrains Mono` for the label text where `Archivo` should be used per brand guidelines.

4. **Incorrect variable naming** — The state variable is called `demoMode` throughout. It should be called `redacted`.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Header bar with the broken redact toggle |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Parent component — owns `demoMode` state, passes it as props |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Input area — receives `demoMode` prop, uses it for placeholder text |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Renders individual chat messages (user and assistant) |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | API route — receives `demoMode` in request body, selects system prompt |
| `sites/hq-kevinryan-io/app/globals.css` | Global styles including `.hq-markdown` classes |
| `sites/hq-kevinryan-io/app/layout.tsx` | Root layout with Google Fonts imports |
| `sites/brand-kevinryan-io/public/kr-brand-guidelines.md` | Brand guidelines — colours, typography, spacing rules |

### Key facts

- **Brand Orange:** `#FF6B2C` — use this for the redacted active state (replacing `#F59E0B`)
- **Brand Lime:** `#A8E10C` — the standard accent, do NOT use for redacted state
- **Brand Black:** `#0A0A0A`
- **Brand White:** `#F5F3EF`
- **Brand Dark Mid:** `#1A1A1A`
- **Brand Grey 800:** `#2E2D2B`
- **Body font:** Archivo (CSS variable `--font-sans`)
- **Display font:** Bebas Neue (CSS variable `--font-display`)
- **Code font:** JetBrains Mono — used for code only, NOT for UI labels
- **Label style (brand):** Archivo weight 700, font-size 0.7rem, letter-spacing 0.18em, uppercase
- **Button style (brand):** Archivo weight 800, font-size 0.72rem, letter-spacing 0.14em, uppercase

## 1. Fix the double-fire toggle bug in ChatHeader.tsx

The root cause is a `<label>` wrapping both a hidden `<input type="checkbox">` and a `<div role="switch" onClick={...}>`. Clicking the `<div>` fires BOTH the `onClick` on the div AND the `onChange` on the checkbox (via label propagation), causing the state to flip twice.

**Fix:** Remove the hidden `<input type="checkbox">` entirely. Keep only the `<div role="switch">` with its `onClick` and `onKeyDown` handlers. The `<label>` wrapper can remain for layout but should not contain any form element that would cause event propagation.

Alternatively, remove the `<label>` wrapper and use a plain `<div>` for layout, keeping the `<div role="switch">` as the sole interactive element. Either approach is acceptable — the key requirement is that a single click toggles the state exactly once.

**Acceptance criteria:**

- A single click on the toggle changes the `redacted` state exactly once
- The toggle remains keyboard accessible (Space and Enter keys work)
- The `aria-checked` attribute reflects the current state
- The visual position of the thumb matches the state

## 2. Rename demoMode to redacted everywhere

Rename the state variable, props, and API payload field from `demoMode` to `redacted`. This affects:

### 2.1 ChatInterface.tsx

- State: `const [demoMode, setDemoMode] = useState(false)` → `const [redacted, setRedacted] = useState(false)`
- Props passed to `ChatHeader`: `demoMode={demoMode}` → `redacted={redacted}`, `onDemoModeChange={setDemoMode}` → `onRedactedChange={setRedacted}`
- Props passed to `ChatInput`: `demoMode={demoMode}` → `redacted={redacted}`
- API request body: `JSON.stringify({ messages: updatedMessages, demoMode })` → `JSON.stringify({ messages: updatedMessages, redacted })`
- Pass `redacted` as a prop to `MessageBubble` (new — see section 4)

### 2.2 ChatHeader.tsx

- Interface: `demoMode: boolean` → `redacted: boolean`, `onDemoModeChange: (value: boolean) => void` → `onRedactedChange: (value: boolean) => void`
- All references to `demoMode` in the component body → `redacted`
- All references to `onDemoModeChange` → `onRedactedChange`

### 2.3 ChatInput.tsx

- Interface: `demoMode: boolean` → `redacted: boolean`
- Placeholder text: `redacted ? 'ask HQ anything (redacted mode)' : 'ask HQ anything'`

### 2.4 route.ts (API route)

- Request body destructuring: `const { messages, demoMode }` → `const { messages, redacted }`
- System prompt selection: `const systemPrompt = demoMode ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT` → `const systemPrompt = redacted ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT`
- Also rename `DEMO_SYSTEM_PROMPT` to `REDACTED_SYSTEM_PROMPT` for consistency

**Acceptance criteria:**

- No references to `demoMode` remain in any of the four files
- The `DEMO_SYSTEM_PROMPT` constant is renamed to `REDACTED_SYSTEM_PROMPT`
- TypeScript compiles without errors
- The API correctly receives and uses the `redacted` field

## 3. Restyle the toggle to match brand guidelines

Replace all instances of `#F59E0B` (amber) with `#FF6B2C` (brand orange). Update typography to use brand-compliant fonts and sizes.

### 3.1 Toggle label text ("REDACT DATA")

Current (wrong):

```typescript
fontFamily: "'JetBrains Mono', monospace",
fontSize: '0.6875rem',
color: demoMode ? '#F59E0B' : '#F5F3EF66',
letterSpacing: '0.04em',
```

Required:

```typescript
fontFamily: "'Archivo', sans-serif",
fontSize: '0.7rem',
fontWeight: 700,
color: redacted ? '#FF6B2C' : '#F5F3EF66',
letterSpacing: '0.18em',
textTransform: 'uppercase' as const,
```

This matches the brand "Label" style: Archivo 700, 0.7rem, letter-spacing 0.18em, uppercase.

### 3.2 Toggle track

Current (wrong):

```typescript
backgroundColor: demoMode ? '#F59E0B' : '#2a2a2a',
border: `1px solid ${demoMode ? '#F59E0B' : '#444'}`,
```

Required:

```typescript
backgroundColor: redacted ? '#FF6B2C' : '#2E2D2B',
border: `1px solid ${redacted ? '#FF6B2C' : '#55524E'}`,
```

Using brand Grey 800 (`#2E2D2B`) for inactive track and Grey 600 (`#55524E`) for inactive border.

### 3.3 Toggle thumb

The thumb currently uses `#0A0A0A` (brand black). This is fine — keep it. But when active (redacted), the thumb should be `#F5F3EF` (brand white) for contrast against the orange track.

```typescript
backgroundColor: redacted ? '#F5F3EF' : '#F5F3EF',
```

Actually, keep the thumb `#F5F3EF` in both states for consistency. Update from the current `#0A0A0A` to `#F5F3EF` so the thumb is visible against both the dark inactive track and the orange active track.

### 3.4 "REDACTED" badge

Current (wrong):

```typescript
fontFamily: "'JetBrains Mono', monospace",
fontSize: '0.6rem',
fontWeight: 700,
color: '#0A0A0A',
backgroundColor: '#F59E0B',
```

Required:

```typescript
fontFamily: "'Archivo', sans-serif",
fontSize: '0.7rem',
fontWeight: 700,
color: '#F5F3EF',
backgroundColor: '#FF6B2C',
letterSpacing: '0.18em',
textTransform: 'uppercase' as const,
padding: '0.125rem 0.5rem',
borderRadius: '2px',
```

The badge text should be brand white on brand orange, using the brand label style.

**Acceptance criteria:**

- No references to `#F59E0B` remain anywhere in the codebase
- No references to `JetBrains Mono` appear in the toggle or badge styles (JetBrains Mono is fine elsewhere for code rendering)
- Toggle label uses Archivo 700, 0.7rem, letter-spacing 0.18em
- Active track colour is `#FF6B2C`
- Badge uses brand orange background with brand white text
- Toggle thumb is `#F5F3EF` in both states

## 4. Implement client-side message redaction

When `redacted` is `true`, ALL messages currently displayed in the chat (both user and assistant) must be visually redacted. When `redacted` is toggled back to `false`, messages return to normal.

### 4.1 Pass redacted prop to MessageBubble

In `ChatInterface.tsx`, pass the `redacted` state to each `MessageBubble`:

```tsx
<MessageBubble key={i} message={msg} redacted={redacted} />
```

Update the `MessageBubbleProps` interface to include `redacted: boolean`.

### 4.2 Redaction overlay in MessageBubble

When `redacted` is `true`, apply a visual redaction effect to the message content. The implementation should:

- Apply a CSS `filter: blur(8px)` to the message text content
- Make the text non-selectable with `userSelect: 'none'`
- Add `pointerEvents: 'none'` to prevent interaction with blurred content
- The message bubble container (background, border) remains visible and unblurred — only the text content inside is blurred
- The "HQ" label above assistant messages remains visible and unblurred
- Document download buttons (from spec 0012) should be hidden when redacted
- The blur effect should have a CSS transition (`transition: 'filter 0.3s ease'`) for smooth toggle

**Do NOT:**

- Remove or alter the actual message content in state — this is purely visual
- Apply redaction to the message container/bubble itself — only the inner text
- Break the streaming behaviour — messages that arrive while redacted should render blurred

### 4.3 Redaction styles

The redacted message content wrapper should use these inline styles when `redacted` is `true`:

```typescript
{
  filter: 'blur(8px)',
  userSelect: 'none' as const,
  pointerEvents: 'none' as const,
  transition: 'filter 0.3s ease',
}
```

When `redacted` is `false`:

```typescript
{
  filter: 'none',
  userSelect: 'auto' as const,
  pointerEvents: 'auto' as const,
  transition: 'filter 0.3s ease',
}
```

### 4.4 Redacted state in ChatInput

When `redacted` is `true`, update the placeholder text to: `'ask HQ anything (redacted mode)'`

This is already handled by section 2.3 above.

**Acceptance criteria:**

- When redacted is toggled ON, all existing messages (user and assistant) have their text content blurred
- When redacted is toggled OFF, all messages return to clear, readable text
- The blur transition is smooth (0.3s ease)
- Message bubbles, borders, and the "HQ" label remain visible when redacted
- Document download buttons are hidden when redacted
- New messages arriving via streaming while redacted mode is active appear blurred
- The actual message content in React state is never modified — redaction is purely visual
- User cannot select or copy text while redacted mode is active

## Constraints and Assumptions

- **Constraint:** All styling uses inline styles (React `CSSProperties`), consistent with the existing codebase pattern. Do not introduce CSS modules or styled-components.
- **Constraint:** Brand colours must be exact hex values as specified — no approximations.
- **Constraint:** The redaction is client-side visual only. The API-side system prompt switching (now using the `redacted` field) continues to work as before.
- **Assumption:** The existing Google Fonts import in `layout.tsx` already includes Archivo at weights 400, 500, 700. If weight 800 is needed for the badge, it should be added to the import. Check and update if necessary.
- **Assumption:** The `MessageBubble` component currently does not receive a `redacted` prop. This is a new prop addition.
- **Constraint:** Do not change the `globals.css` file unless absolutely necessary (e.g. adding a transition utility class). Prefer inline styles.

## Out of Scope

- Server-side data redaction (e.g. filtering sensitive content from API responses) — the existing system prompt approach is sufficient
- Persisting redacted state across page reloads or sessions
- Redacting the user avatar or username in the header
- Adding a confirmation dialog before toggling redact mode
- Redacting content within code blocks differently from normal text (same blur applies to all)

## Manual steps (not performed by the agent)

None — this is a pure frontend change. After merge, the standard CI/CD pipeline will build and deploy.

Verify after deployment:

1. Navigate to hq.kevinryan.io
2. Send a few messages in the chat
3. Click the "Redact Data" toggle once — it should respond immediately
4. All messages should blur smoothly
5. The toggle, badge, and label should use brand orange `#FF6B2C`
6. Click the toggle again — messages should unblur smoothly
7. Send a new message while redacted — it should appear blurred
8. Check that the "REDACTED" badge appears in brand orange when active

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0014-fix-redact-toggle.md`
2. No references to `demoMode` exist in any of: `ChatHeader.tsx`, `ChatInterface.tsx`, `ChatInput.tsx`, `route.ts`
3. No references to `#F59E0B` exist in any file under `sites/hq-kevinryan-io/`
4. No references to `DEMO_SYSTEM_PROMPT` exist in `route.ts` — it should be `REDACTED_SYSTEM_PROMPT`
5. The `MessageBubble` component accepts a `redacted: boolean` prop
6. The toggle in `ChatHeader.tsx` has exactly ONE click handler mechanism (no dual label+div event conflict)
7. `pnpm lint` passes
8. `pnpm build` passes
9. The provenance record exists at `.sdd/provenance/spec-0014-fix-redact-toggle.provenance.md` and contains all required sections
10. All files (spec, implementation, provenance) are committed together
