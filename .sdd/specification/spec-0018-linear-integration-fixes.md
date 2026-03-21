---
title: "Spec 0018: Linear Integration Fixes"
draft: true
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- All files listed under "Current state" below
- Updated provenance (on subsequent cycles, to address failing scenarios)

**Produces:**

- Working software that satisfies all requirements in this spec
- A provenance record at `.sdd/provenance/spec-0018-linear-integration-fixes.provenance.md`

**Instructions:**

1. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
2. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
3. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at `.sdd/provenance/template.md`.
4. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
5. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
6. Do not write tests. Testing is not your role.
7. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
8. Commit the implementation and provenance together.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0018-linear-integration-fixes.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0018-linear-integration-fixes.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document recording findings

## Prerequisites

- Spec 0017 deployed: Linear integration exists with basic tools
- Spec 0010 deployed: HQ chat interface with streaming route

## Context

During the HQ backlog setup session, multiple Linear write operations silently failed. The API returned success responses but the changes did not persist. This is a daily workflow blocker — HQ can create work but cannot assign it, comment on it, or reliably read context from it.

### Root Cause Analysis

After reading the implementation in `route.ts`, the following code-level bugs have been identified:

**Bug 1: `update_linear_issue` does not resolve short identifiers to UUIDs.**
The tool description tells users they can pass `KRA-123` as the `issueId`, but the code passes this value directly to the `issueUpdate` GraphQL mutation as the `$id` parameter. Linear's `issueUpdate` mutation requires a UUID. When a short identifier like `KRA-123` is passed, the mutation silently fails — no GraphQL error is returned, but the update does not persist.

**Bug 2: `add_linear_comment` has the same identifier resolution problem.**
The `commentCreate` mutation receives `issueId` directly from input. If a short identifier is passed instead of a UUID, the comment is not created but no error is surfaced.

**Bug 3: No user discovery tool exists.**
There is no `list_linear_users` tool, so HQ cannot discover valid user IDs. The `assigneeId` parameter on `create_linear_issue` and `update_linear_issue` is unusable because there is no way to look up who to assign.

**Bug 4: No comment read tool exists.**
There is no way to read comments on an issue. HQ cannot close the loop on its own findings or read context added by team members.

**Bug 5: GraphQL error responses may be swallowed.**
The `linearGraphQL` helper checks for `json.errors` but individual mutation responses also include a `success` boolean. This is not checked — so a mutation that returns `{ success: false }` is treated as successful.

### Current state (read these files before making changes)

| File / Directory | What it does |
|---|---|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | HQ chat API route — contains all tool implementations including `executeLinearTool` and all Linear GraphQL queries/mutations |
| `config/hq-system-prompt.md` | HQ system prompt — documents tool descriptions and usage patterns |

### Key facts

- **Linear API URL:** `https://api.linear.app/graphql`
- **Auth header format:** `Authorization: ${process.env.LINEAR_API_KEY}` (no Bearer prefix — this is correct for Linear API keys)
- **The `linearGraphQL` helper** is at approximately line 185 of `route.ts` — all Linear tools call through it
- **The `executeLinearTool` function** starts at approximately line 196 of `route.ts`
- **Tool definitions array** starts at approximately line 400 of `route.ts` — new tools need entries here
- **The `linearToolNames` Set** at approximately line 390 must be updated when adding new tool names

## 1. Add identifier-to-UUID resolution helper

Create a helper function inside `route.ts` (near the `linearGraphQL` helper) that resolves a Linear issue identifier to its UUID:

```typescript
async function resolveLinearIssueId(issueIdOrIdentifier: string): Promise<string> {
  // If it looks like a UUID, return as-is
  if (issueIdOrIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    return issueIdOrIdentifier
  }

  // Otherwise treat it as a short identifier (e.g. KRA-123) and resolve via search
  const data = await linearGraphQL(
    `query IssueByIdentifier($filter: IssueFilter) {
      issues(filter: $filter, first: 1) {
        nodes {
          id
          identifier
        }
      }
    }`,
    { filter: { identifier: { eq: issueIdOrIdentifier } } }
  )

  const result = data as { issues?: { nodes: Array<{ id: string; identifier: string }> } }
  const issue = result?.issues?.nodes?.[0]
  if (!issue) {
    throw new Error(`Linear issue not found: ${issueIdOrIdentifier}`)
  }
  return issue.id
}
```

**Design notes:**

- UUID regex check avoids an unnecessary API call when the caller already has a UUID
- The `identifier` filter field matches the exact short identifier format (e.g. `KRA-123`)
- Throws on not-found so the caller can surface a clear error message

## 2. Fix `update_linear_issue` to resolve identifiers

In the `update_linear_issue` handler inside `executeLinearTool`, add identifier resolution before the mutation:

**Current code (broken):**

```typescript
const issueId = input.issueId as string
// ... builds updateInput ...
const data = await linearGraphQL(
  `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) { ... }`,
  { id: issueId, input: updateInput },
)
```

**Fixed code:**

```typescript
const issueIdInput = input.issueId as string
let resolvedId: string
try {
  resolvedId = await resolveLinearIssueId(issueIdInput)
} catch (err) {
  return err instanceof Error ? err.message : `Error resolving issue ID: ${issueIdInput}`
}
// ... builds updateInput (unchanged) ...
const data = await linearGraphQL(
  `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) { ... }`,
  { id: resolvedId, input: updateInput },
)
```

Also add a `success` check after the mutation:

```typescript
const result = data as { issueUpdate?: { success: boolean; issue?: unknown } }
if (result?.issueUpdate && !result.issueUpdate.success) {
  return `Error: Linear issueUpdate mutation returned success: false for ${issueIdInput}`
}
return JSON.stringify(result?.issueUpdate ?? data)
```

## 3. Fix `add_linear_comment` to resolve identifiers

Apply the same identifier resolution pattern:

**Current code (broken):**

```typescript
const data = await linearGraphQL(
  `mutation CommentCreate($input: CommentCreateInput!) { ... }`,
  { input: { issueId: input.issueId, body: input.body } },
)
```

**Fixed code:**

```typescript
const issueIdInput = input.issueId as string
let resolvedIssueId: string
try {
  resolvedIssueId = await resolveLinearIssueId(issueIdInput)
} catch (err) {
  return err instanceof Error ? err.message : `Error resolving issue ID: ${issueIdInput}`
}
const data = await linearGraphQL(
  `mutation CommentCreate($input: CommentCreateInput!) { ... }`,
  { input: { issueId: resolvedIssueId, body: input.body } },
)
```

Also add a `success` check:

```typescript
const result = data as { commentCreate?: { success: boolean; comment?: unknown } }
if (result?.commentCreate && !result.commentCreate.success) {
  return `Error: Linear commentCreate mutation returned success: false`
}
return JSON.stringify(result?.commentCreate ?? data)
```

## 4. Add `list_linear_users` tool

Add a new tool handler in `executeLinearTool`:

```typescript
if (name === 'list_linear_users') {
  const limit = (input.limit as number) ?? 50
  const data = await linearGraphQL(
    `query Users($first: Int) {
      users(first: $first) {
        nodes {
          id
          name
          displayName
          email
          active
          admin
        }
      }
    }`,
    { first: limit },
  )
  const result = data as { users?: { nodes: unknown[] } }
  return JSON.stringify(result?.users?.nodes ?? data)
}
```

Add the tool definition to the `tools` array:

```typescript
{
  name: 'list_linear_users',
  description:
    'List users in the Linear workspace. Returns user IDs, names, emails, and active status. Use this to discover valid assignee IDs.',
  input_schema: {
    type: 'object' as const,
    properties: {
      limit: { type: 'number', description: 'Max results (default 50)' },
    },
    required: [],
  },
},
```

Add `'list_linear_users'` to the `linearToolNames` Set.

## 5. Add `list_linear_comments` tool

Add a new tool handler in `executeLinearTool`:

```typescript
if (name === 'list_linear_comments') {
  const issueIdInput = input.issueId as string
  let resolvedIssueId: string
  try {
    resolvedIssueId = await resolveLinearIssueId(issueIdInput)
  } catch (err) {
    return err instanceof Error ? err.message : `Error resolving issue ID: ${issueIdInput}`
  }
  const data = await linearGraphQL(
    `query IssueComments($id: String!) {
      issue(id: $id) {
        comments {
          nodes {
            id
            body
            createdAt
            updatedAt
            user { name email }
          }
        }
      }
    }`,
    { id: resolvedIssueId },
  )
  const result = data as { issue?: { comments?: { nodes: unknown[] } } }
  return JSON.stringify(result?.issue?.comments?.nodes ?? data)
}
```

Add the tool definition to the `tools` array:

```typescript
{
  name: 'list_linear_comments',
  description:
    'List comments on a Linear issue. Returns comment body, author, and timestamps. Accepts issue UUID or short identifier (e.g. KRA-123).',
  input_schema: {
    type: 'object' as const,
    properties: {
      issueId: { type: 'string', description: 'Issue ID or identifier (e.g. KRA-123)' },
    },
    required: ['issueId'],
  },
},
```

Add `'list_linear_comments'` to the `linearToolNames` Set.

## 6. Add `success` checks to existing mutations

For `create_linear_issue` and `create_linear_project`, add success validation after the mutation call. These tools may already work most of the time, but the success check will catch silent failures:

**`create_linear_issue` — add after the mutation:**

```typescript
const result = data as { issueCreate?: { success: boolean; issue?: unknown } }
if (result?.issueCreate && !result.issueCreate.success) {
  return `Error: Linear issueCreate mutation returned success: false`
}
return JSON.stringify(result?.issueCreate ?? data)
```

**`create_linear_project` — add after the mutation:**

```typescript
const result = data as { projectCreate?: { success: boolean; project?: unknown } }
if (result?.projectCreate && !result.projectCreate.success) {
  return `Error: Linear projectCreate mutation returned success: false`
}
return JSON.stringify(result?.projectCreate ?? data)
```

## 7. Update HQ system prompt

In `config/hq-system-prompt.md`, update the Linear Project Management Tools section:

- Add `list_linear_users` to the Available Tools list with description: "List users in the workspace. Returns user IDs, names, emails. Use to discover assignee IDs."
- Add `list_linear_comments` to the Available Tools list with description: "List comments on an issue. Accepts UUID or short identifier."
- Update the Usage Patterns section to include a step for looking up user IDs before assigning
- Note that all tools accepting `issueId` now support both UUIDs and short identifiers like `KRA-123`

## Constraints and Assumptions

- **Constraint:** All changes are within `sites/hq-kevinryan-io/app/api/chat/route.ts` and `config/hq-system-prompt.md`. No other files should be modified (except provenance).
- **Constraint:** The `linearGraphQL` helper function signature and behaviour must not change — it is used by all Linear tools.
- **Constraint:** All currently working operations (create issues, create projects, search/list issues, update state/priority) must continue to work.
- **Assumption:** Linear's `issues` query supports filtering by `identifier` with an `eq` comparator. If this is not the case, the Builder Agent should use `issueSearch` with the identifier string as the query and extract the first result.
- **Assumption:** The Linear API key has sufficient scopes for user listing and comment read/write. If API calls return permission errors, document this in the provenance — it means the key needs to be regenerated with broader scopes (a manual step for Kevin).

## Out of Scope

- OAuth2 app registration — we are staying with API key auth for now
- Regenerating the Linear API key — if scope issues are found, Kevin will handle this manually
- Changes to the keepalive mechanism — this has been confirmed as unrelated
- UI changes to the chat interface
- Adding tools beyond the five specified (list_linear_users, list_linear_comments, and fixes to update_linear_issue, add_linear_comment, and success checks)

## Manual steps (not performed by the agent)

If the Builder Agent discovers that the Linear API key lacks permissions for user listing or comment operations:

1. Kevin regenerates the API key at [Linear Settings > API](https://linear.app/settings/api) with full scopes
2. Update the `LINEAR_API_KEY` secret in GitHub repository settings
3. Update the `LINEAR_API_KEY` in the Kubernetes deployment environment

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0018-linear-integration-fixes.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. The `resolveLinearIssueId` helper function exists and handles both UUID and short identifier formats
2. `update_linear_issue` calls `resolveLinearIssueId` before the mutation
3. `add_linear_comment` calls `resolveLinearIssueId` before the mutation
4. The `list_linear_users` tool handler exists in `executeLinearTool` and returns user data
5. The `list_linear_comments` tool handler exists in `executeLinearTool`, resolves identifiers, and returns comments
6. `'list_linear_users'` and `'list_linear_comments'` are in the `linearToolNames` Set
7. Tool definitions for `list_linear_users` and `list_linear_comments` exist in the `tools` array
8. All mutation handlers (`issueCreate`, `issueUpdate`, `commentCreate`, `projectCreate`) check the `success` boolean in the response
9. `config/hq-system-prompt.md` documents the new tools and updated capabilities
10. `pnpm lint` passes
11. `pnpm build` passes
12. The provenance record exists at `.sdd/provenance/spec-0018-linear-integration-fixes.provenance.md` and contains all required sections
13. All files are committed together
