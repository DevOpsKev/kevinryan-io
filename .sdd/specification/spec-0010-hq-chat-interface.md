---
title: "Spec 0010: HQ Chat Interface"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- ADR-021 (`docs/adr/adr-021-auth0-authentication-hq.md`)
- `sites/hq-kevinryan-io/app/page.tsx` — current placeholder page being replaced
- `sites/hq-kevinryan-io/app/api/` — existing API routes
- `https://brand.kevinryan.io` — brand guidelines

**Produces:**

- Working chat interface at `hq.kevinryan.io`
- A provenance record at `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0010-hq-chat-interface.md` in the repo.
2. Read the full specification and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after.
5. Do not write tests. Testing is not your role.
6. When the build is complete, add a "Build Status" entry to the provenance.
7. Commit the spec, implementation, and provenance together.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0010-hq-chat-interface.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document

---

## Task

1. Save this spec to `.sdd/specification/spec-0010-hq-chat-interface.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md`.

## Prerequisites

- Spec-0009 deployed: `hq.kevinryan.io` is live with Auth0 authentication working.
- Read ADR-021 for Auth0 context.
- The `hq-auth0-secrets` K8s secret exists and is synced via ESO.

## Context

HQ (`hq.kevinryan.io`) currently shows a placeholder page post-login. This spec replaces the placeholder with a working chat interface backed by the Anthropic API.

This is Claude — a general-purpose AI assistant — with a system prompt that establishes its identity as HQ, the operational assistant for Kevin Ryan & Associates. No tools or integrations are added in this spec. Those come in subsequent specs (GitHub in spec-0011, Azure in spec-0012, platform monitoring in spec-0013).

The Anthropic API key is stored in Azure Key Vault and delivered to the pod via the platform's established ESO pattern — the same pattern used for Auth0 secrets in spec-0009.

The chat interface is a single-page application. The authenticated user types a message, it is sent to a Next.js API route server-side, the API route calls the Anthropic API, and the response streams back to the client. The UI maintains conversation history in React state for the duration of the session. There is no persistent conversation storage — history is lost on page refresh. That is intentional for this iteration.

A **demo mode toggle** is included. When enabled, HQ adds a instruction to the system prompt instructing it not to reveal sensitive information (rates, personal finances, HMRC matters, client details not already public). When demo mode is active a visible `DEMO` badge appears in the header. This allows HQ to be used safely in front of clients or at conferences.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/page.tsx` | Current placeholder — replace entirely |
| `sites/hq-kevinryan-io/app/api/auth/[auth0]/route.ts` | Auth0 handler — do not touch |
| `sites/hq-kevinryan-io/app/api/healthz/route.ts` | Health check — do not touch |
| `sites/hq-kevinryan-io/app/layout.tsx` | Root layout with Google Fonts — do not touch |
| `sites/hq-kevinryan-io/lib/auth0.ts` | Auth0 client — do not touch |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | ESO manifest — add Anthropic key mapping |
| `infra/variables.tf` | Terraform variables — add Anthropic key variable |
| `infra/main.tf` | Terraform resources — add Anthropic key vault secret |
| `.github/workflows/terraform.yml` | CI — add Anthropic key TF_VAR |

### Key facts

- **Anthropic model:** `claude-sonnet-4-20250514`
- **Max tokens:** `8192`
- **Streaming:** yes — use Anthropic streaming API, stream response to client via `ReadableStream`
- **API key env var:** `ANTHROPIC_API_KEY`
- **Key Vault secret name:** `anthropic-api-key`
- **Terraform variable name:** `anthropic_api_key`
- **GitHub secret name:** `TF_VAR_ANTHROPIC_API_KEY`
- **Container port:** `3000` (unchanged)
- **Fonts:** Bebas Neue (display), Archivo (body), JetBrains Mono (monospaced accents)
- **Colours:** `#0A0A0A` background, `#F5F3EF` text, `#A8E10C` lime accent, `#111111` message bubbles, `#1a1a1a` input background

## 1. Anthropic API key — secret management

Follow the exact pattern established in spec-0009 for Auth0 secrets.

### `infra/variables.tf` — add

```hcl
variable "anthropic_api_key" {
  description = "Anthropic API key for HQ chat interface"
  type        = string
  sensitive   = true
}
```

### `infra/main.tf` — add alongside existing hq_auth0 secrets

```hcl
resource "azurerm_key_vault_secret" "anthropic_api_key" {
  name         = "anthropic-api-key"
  value        = var.anthropic_api_key
  key_vault_id = module.keyvault.key_vault_id
}
```

### `.github/workflows/terraform.yml` — add to both plan and apply job env sections

```yaml
TF_VAR_anthropic_api_key: ${{ secrets.TF_VAR_ANTHROPIC_API_KEY }}
```

### `k8s/hq-kevinryan-io/externalsecret.yaml` — add mapping

```yaml
    - secretKey: ANTHROPIC_API_KEY
      remoteRef:
        key: anthropic-api-key
```

**Design notes:**

- The Anthropic API key is a runtime secret — it must never appear in the Dockerfile or GitHub Actions workflow.
- The `hq-auth0-secrets` K8s secret already exists. Adding a new key to the `ExternalSecret` will cause ESO to update the existing secret with the new key on its next sync. The secret name does not change.

## 2. Chat API route

Create `sites/hq-kevinryan-io/app/api/chat/route.ts`.

This route:

- Accepts `POST` requests with JSON body `{ messages: Message[], demoMode: boolean }`
- Is protected by Auth0 — returns `401` if no session
- Calls the Anthropic API with streaming enabled
- Returns a `ReadableStream` response that the client consumes

### Message type

```typescript
interface Message {
  role: 'user' | 'assistant'
  content: string
}
```

### System prompt

```typescript
const BASE_SYSTEM_PROMPT = `You are HQ — the operational AI assistant for Kevin Ryan & Associates, a boutique AI-Native engineering consultancy.

You have deep knowledge of:
- AI-Native Software Engineering and Spec Driven Development (SDD)
- DevOps, Platform Engineering, MLOps
- The Kevin Ryan & Associates client portfolio (CERN, Nestlé, NatWest, BBC Worldwide, Financial Times, Vodafone, HelloFresh, Dematic, McKinsey, Barclays)
- The platform infrastructure (K3s on Azure, Flux CD, Terraform, GitHub Actions)
- Active workstreams and business development

You are direct, concise, and operationally focused. You think like an engineering leader.
You assist with: strategy, writing, technical decisions, platform operations, business development, and general reasoning.
You have access to general knowledge and can search the web when needed.`

const DEMO_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

DEMO MODE IS ACTIVE. Do not reveal, reference, or quote any sensitive information including:
- Day rates, contract fees, or financial details
- HMRC, tax, or legal matters
- Personal health or financial circumstances
- Specific client contract terms not already publicly known
- Any information that could be commercially sensitive

If asked about these topics, acknowledge they exist but state they are redacted in demo mode.`
```

### Route implementation pattern

```typescript
import { auth0 } from '@/lib/auth0'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, demoMode } = await request.json()
  const systemPrompt = demoMode ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
```

## 3. Chat page

Replace `sites/hq-kevinryan-io/app/page.tsx` entirely.

This is a React client component (`'use client'`) — the chat interface requires browser state. The Auth0 session check moves to a server component wrapper.

### File structure

- `app/page.tsx` — thin server component, checks session, passes user to client component
- `app/components/ChatInterface.tsx` — full chat UI as a client component

### `app/page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { auth0 } from '../lib/auth0'
import ChatInterface from './components/ChatInterface'

export default async function HomePage() {
  const session = await auth0.getSession()
  if (!session) redirect('/auth/login')
  return <ChatInterface user={session.user} />
}
```

### `app/components/ChatInterface.tsx` — the UI

The component must implement:

**Header:**

- HQ wordmark (Bebas Neue, left aligned) with lime period
- Demo mode toggle (right side) — label `demo mode`, toggle switch, `DEMO` badge when active
- Logged-in user avatar (circle, from `user.picture`) and username
- No logout button in header — move logout to a subtle link in the footer

**Message area:**

- Scrollable, fills available height
- User messages right-aligned, dark bubble (`#1a2a05` background, lime border)
- Assistant messages left-aligned, dark bubble (`#111` background, `#222` border)
- HQ messages prefixed with a small `HQ` label in Bebas Neue lime
- Streaming text renders as it arrives — do not wait for full response
- Auto-scrolls to bottom on new content
- Empty state: centred `ask HQ anything` in JetBrains Mono, muted

**Input area:**

- Full-width textarea, dark background, lime focus border
- Send button — lime background, dark arrow icon
- Hint pills for common queries: `what's in flight`, `last deploy status`, `open specs`, `platform health`
- Disabled during streaming — re-enables when response completes

**Footer:**

- Commit SHA: `build: {NEXT_PUBLIC_COMMIT_SHA}` in JetBrains Mono, lime, right-aligned, very small
- Logout link: subtle, left-aligned, small

**Demo mode behaviour:**

- Toggle sends `demoMode: true` in the API request body
- When active: header shows amber `DEMO` badge, input placeholder changes to `ask HQ anything (demo mode)`
- State persists for the session (React state, not localStorage)

### Dependencies to add to `package.json`

```json
"@anthropic-ai/sdk": "^0.39.0"
```

## 4. Update pnpm lockfile

After adding `@anthropic-ai/sdk` to `package.json`, run `pnpm install` from the monorepo root to update `pnpm-lock.yaml`. Commit the updated lockfile alongside all other changes.

## Constraints and Assumptions

- **Constraint:** Conversation history is in-memory React state only. No persistence. History is lost on page refresh. This is intentional — persistence is a future spec.
- **Constraint:** The Anthropic API key is a runtime secret. It must never appear in the Dockerfile, GitHub Actions workflow, or any committed file.
- **Constraint:** Streaming must work end-to-end. Do not buffer the full response before sending to the client.
- **Constraint:** The chat API route must be excluded from Auth0 middleware — it handles its own auth check via `getSession()`. Update the middleware/proxy matcher to exclude `api/chat` if needed.
- **Assumption:** `ANTHROPIC_API_KEY` will be added to the `hq-auth0-secrets` K8s secret via ESO after Terraform applies the new Key Vault secret. The secret name remains `hq-auth0-secrets` — ESO updates it in place.
- **Assumption:** `TF_VAR_ANTHROPIC_API_KEY` GitHub secret will be added by the human before running Terraform.

## Out of Scope

- Persistent conversation history — future spec
- GitHub MCP integration — spec-0011
- Azure integration — spec-0012
- Platform monitoring integration — spec-0013
- Mobile responsive layout — future iteration
- Markdown rendering in messages — future iteration

## Manual steps (not performed by the agent)

**Before merging the PR:**

1. Add GitHub Actions secret `TF_VAR_ANTHROPIC_API_KEY` with your Anthropic API key value in repository Settings → Secrets and variables → Actions.

**After merging the PR:**

1. Run `terraform apply` to write the Anthropic API key to Key Vault.
2. Force ESO sync to update the K8s secret immediately:

   ```bash
   az vm run-command invoke \
     --resource-group rg-kevinryan-io \
     --name vm-kevinryan-node1 \
     --command-id RunShellScript \
     --scripts "kubectl annotate externalsecret hq-auth0-secrets -n hq-kevinryan-io force-sync=$(date +%s) --overwrite && kubectl rollout restart deployment/hq-kevinryan-io -n hq-kevinryan-io 2>&1"
   ```

3. Visit `https://hq.kevinryan.io` and confirm the chat interface loads.
4. Send a message and confirm streaming response appears.
5. Toggle demo mode and confirm the `DEMO` badge appears and sensitive topics are redacted.

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

1. This spec has been saved to `.sdd/specification/spec-0010-hq-chat-interface.md`
2. `infra/variables.tf` contains `anthropic_api_key` variable with `sensitive = true`
3. `infra/main.tf` contains `azurerm_key_vault_secret.anthropic_api_key` resource
4. `.github/workflows/terraform.yml` passes `TF_VAR_anthropic_api_key` in both plan and apply jobs
5. `k8s/hq-kevinryan-io/externalsecret.yaml` contains mapping for `ANTHROPIC_API_KEY` → `anthropic-api-key`
6. `sites/hq-kevinryan-io/app/api/chat/route.ts` exists
7. `sites/hq-kevinryan-io/app/api/chat/route.ts` returns `401` when no session
8. `sites/hq-kevinryan-io/app/components/ChatInterface.tsx` exists
9. `sites/hq-kevinryan-io/app/page.tsx` imports and renders `ChatInterface`
10. `sites/hq-kevinryan-io/package.json` contains `@anthropic-ai/sdk`
11. `pnpm-lock.yaml` is updated to include `@anthropic-ai/sdk`
12. Demo mode toggle exists in the UI and passes `demoMode` boolean to the API route
13. Base system prompt references Kevin Ryan & Associates and the operational context
14. Demo system prompt extends base prompt with redaction instructions
15. `pnpm build` passes inside `sites/hq-kevinryan-io/`
16. `pnpm lint` passes
17. The provenance record exists at `.sdd/provenance/spec-0010-hq-chat-interface.provenance.md`
18. All files are committed together in a single commit
