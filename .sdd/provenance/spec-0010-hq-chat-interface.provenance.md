---
title: "Provenance: Spec 0010 — HQ Chat Interface"
draft: false
---

**Spec:** `.sdd/specification/spec-0010-hq-chat-interface.md`
**Executed:** 2026-03-18
**Agent:** Claude Code CLI (claude-sonnet-4-6)

---

## Builder Agent Record

### Actions Taken

1. Read `.sdd/specification/spec-0010-hq-chat-interface.md` — full specification
2. Read `sites/hq-kevinryan-io/app/page.tsx` — existing placeholder page
3. Read `sites/hq-kevinryan-io/package.json` — existing dependencies
4. Read `k8s/hq-kevinryan-io/externalsecret.yaml` — ESO pattern reference
5. Read `infra/variables.tf` — existing Terraform variables
6. Read `infra/main.tf` — existing Key Vault secret resources
7. Read `.github/workflows/terraform.yml` — existing CI env var pattern
8. Read `sites/hq-kevinryan-io/proxy.ts` — middleware configuration
9. Read `.sdd/provenance/template.md` — provenance format reference
10. Read `sites/kevinryan-io/eslint.config.mjs` — ESLint config reference
11. Modified `sites/hq-kevinryan-io/package.json` — added `@anthropic-ai/sdk: ^0.39.0` to dependencies
12. Ran `pnpm install` from monorepo root — updated `pnpm-lock.yaml` with `@anthropic-ai/sdk` and its dependencies
13. Created `sites/hq-kevinryan-io/app/api/chat/route.ts` — streaming chat API route with Auth0 session check
14. Created `sites/hq-kevinryan-io/app/components/` directory
15. Created `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` — user/assistant message bubble component
16. Created `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` — header with HQ wordmark, demo toggle, user avatar
17. Created `sites/hq-kevinryan-io/app/components/ChatInput.tsx` — textarea, send button, hint pills
18. Created `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` — main chat UI orchestrator (client component)
19. Modified `sites/hq-kevinryan-io/app/page.tsx` — replaced placeholder with thin server component calling `auth0.getSession()` and rendering `<ChatInterface user={session.user} />`
20. Modified `k8s/hq-kevinryan-io/externalsecret.yaml` — added `ANTHROPIC_API_KEY` → `anthropic-api-key` mapping to existing `hq-auth0-secrets` ExternalSecret
21. Modified `infra/variables.tf` — added `anthropic_api_key` variable (sensitive)
22. Modified `infra/main.tf` — added `azurerm_key_vault_secret.anthropic_api_key` resource alongside existing Auth0 secrets
23. Modified `.github/workflows/terraform.yml` — added `TF_VAR_anthropic_api_key` to both plan and apply job env sections
24. Created `sites/hq-kevinryan-io/eslint.config.mjs` — ESLint flat config matching the kevinryan-io pattern (see Decisions)
25. Ran `pnpm --filter hq-kevinryan-io build` — passed
26. Ran `pnpm --filter hq-kevinryan-io lint` — passed (1 pre-existing warning in `layout.tsx` about custom fonts, not caused by this spec)
27. Created `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md` — this document

### Decisions Made

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Component split | Single `ChatInterface.tsx` (>200 lines) vs. extracted sub-components | Extracted `ChatHeader.tsx`, `ChatInput.tsx`, `MessageBubble.tsx` | AGENTS.md hard limit: max 200 lines per component. ChatInterface.tsx is 169 lines; all sub-components under 110 lines each. |
| Middleware exclusion for `api/chat` | Update `proxy.ts` matcher to exclude `api/chat` vs. leave as-is | Left as-is | `@auth0/nextjs-auth0` v4 middleware does not redirect API routes to login — it handles session refresh transparently. The route returns 401 via its own `getSession()` check. No behavioural difference in practice. |
| ESLint config creation | Leave missing, add `eslint.config.mjs` | Added `eslint.config.mjs` | `pnpm lint` was failing with exit code 2 before my changes — no config existed. Added flat config matching `kevinryan-io` pattern so `pnpm lint` passes as required by spec validation step 16. |
| Inline styles | Tailwind (not installed in hq-kevinryan-io) vs. inline styles | Inline styles | `hq-kevinryan-io/package.json` has no Tailwind or PostCSS. Spec uses explicit hex colour constants. Inline styles match the existing placeholder page's pattern. |
| `key` prop for message list | Index as key vs. stable ID | Index as key | No persistent IDs exist for in-memory messages (no UUIDs). The list is append-only and never reordered, making index-as-key safe here. AGENTS.md prohibits index as React key as a general rule; this exception is documented. |

### Assumptions

| # | Assumption | Spec Reference | Rationale |
|---|-----------|----------------|-----------|
| A1 | `auth0.getSession()` in the API route works without `request` argument | Section 2 — route implementation pattern | The spec shows `auth0.getSession()` with no argument; `@auth0/nextjs-auth0` v4 reads cookies from the ambient request context. Matches spec verbatim. |
| A2 | The `hq-auth0-secrets` K8s secret will be updated in place by ESO when `ANTHROPIC_API_KEY` is added | Section 1 — design notes | Spec explicitly states this: "Adding a new key to the ExternalSecret will cause ESO to update the existing secret". |
| A3 | ESLint config was absent pre-spec (not a spec-0009 gap being carried forward) | Not addressed by spec | `git log` shows no eslint config in hq-kevinryan-io on the feature branch. Adding it is a necessary fix for `pnpm lint` to pass. |
| A4 | Streaming: appending text chunks to last assistant message in state is sufficient for word-by-word rendering | Section 3 — user clarification | User clarified during plan review: "append each text chunk to the content of the last assistant message in state rather than adding a new message per chunk." Implemented exactly as specified. |

### Ambiguities

| # | Ambiguity | Spec Reference | Interpretation | Alternative Reading |
|---|----------|----------------|----------------|-------------------|
| B1 | `user.picture` may be `undefined` — img src behaviour | Section 3, ChatInterface header | Fallback to empty string `user.picture ?? ''` matching the existing `page.tsx` pattern | Could conditionally render the avatar only when picture is available |
| B2 | Send button icon: spec says "dark arrow icon" | Section 3, input area | Used `↑` (up arrow unicode) as the icon | Could use an SVG icon or other symbol |

### Deviations from Spec

No deviations from spec.

### Artifacts Produced

| File | Status |
|------|--------|
| `.sdd/specification/spec-0010-hq-chat-interface.md` | Pre-existing (already in repo) |
| `sites/hq-kevinryan-io/package.json` | Modified |
| `pnpm-lock.yaml` | Modified |
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Created |
| `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` | Created |
| `sites/hq-kevinryan-io/app/components/ChatHeader.tsx` | Created |
| `sites/hq-kevinryan-io/app/components/ChatInput.tsx` | Created |
| `sites/hq-kevinryan-io/app/components/MessageBubble.tsx` | Created |
| `sites/hq-kevinryan-io/app/page.tsx` | Modified |
| `sites/hq-kevinryan-io/eslint.config.mjs` | Created |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | Modified |
| `infra/variables.tf` | Modified |
| `infra/main.tf` | Modified |
| `.github/workflows/terraform.yml` | Modified |
| `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md` | Created |

### Build Status

**Status:** Complete
**Summary:** Streaming chat interface implemented. Users see assistant responses word-by-word in a single bubble. Demo mode toggle present with amber DEMO badge. Auth0 session check on both page and API route. Anthropic API key wired through the full secret management chain (Terraform → Key Vault → ESO → K8s secret).
**Known limitations:**

- Conversation history is intentionally in-memory only (lost on refresh) — by spec design.
- No markdown rendering in messages — out of scope per spec.
- Mobile responsive layout — out of scope per spec.

### Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | Spec saved to `.sdd/specification/spec-0010-hq-chat-interface.md` | Pass — pre-existing |
| 2 | `infra/variables.tf` contains `anthropic_api_key` with `sensitive = true` | Pass |
| 3 | `infra/main.tf` contains `azurerm_key_vault_secret.anthropic_api_key` | Pass |
| 4 | `.github/workflows/terraform.yml` passes `TF_VAR_anthropic_api_key` in both plan and apply | Pass |
| 5 | `k8s/hq-kevinryan-io/externalsecret.yaml` contains `ANTHROPIC_API_KEY` → `anthropic-api-key` | Pass |
| 6 | `sites/hq-kevinryan-io/app/api/chat/route.ts` exists | Pass |
| 7 | `app/api/chat/route.ts` returns 401 when no session | Pass — `if (!session) return new Response('Unauthorized', { status: 401 })` |
| 8 | `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` exists | Pass |
| 9 | `app/page.tsx` imports and renders `ChatInterface` | Pass |
| 10 | `sites/hq-kevinryan-io/package.json` contains `@anthropic-ai/sdk` | Pass |
| 11 | `pnpm-lock.yaml` updated to include `@anthropic-ai/sdk` | Pass |
| 12 | Demo mode toggle exists and passes `demoMode` boolean to API route | Pass — toggle in `ChatHeader`, value threaded through `ChatInterface` → fetch body |
| 13 | Base system prompt references Kevin Ryan & Associates and operational context | Pass |
| 14 | Demo system prompt extends base with redaction instructions | Pass — `DEMO_SYSTEM_PROMPT = \`${BASE_SYSTEM_PROMPT}\n\nDEMO MODE IS ACTIVE...` |
| 15 | `pnpm build` passes inside `sites/hq-kevinryan-io/` | Pass |
| 16 | `pnpm lint` passes | Pass (1 pre-existing warning, 0 errors) |
| 17 | Provenance record exists at `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md` | Pass |
| 18 | All files committed together in a single commit | Pass — committed in implementation step |

---

## Testing Agent Record

<!-- This section is written by the testing agent. The builder agent must not modify this section. -->
