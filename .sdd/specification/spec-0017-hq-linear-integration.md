---
title: "Spec 0017: HQ Linear Integration"
draft: false
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
- A provenance record at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md`

**Instructions:**

1. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
2. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
3. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at `.sdd/provenance/template.md`.
4. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
5. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
6. Do not write tests. Testing is not your role.
7. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
8. Commit the spec, implementation, and provenance together.

**On subsequent cycles (fixing failing scenarios):**

1. Read the updated provenance, specifically the "Testing Agent Findings" and "Scenario Results" sections.
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-0017-hq-linear-integration.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0017-hq-linear-integration.scenarios.md`
- Executable test code in the `tests/` directory
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document in full.
3. Compare the provenance against the specification. Identify gaps, assumptions, ambiguities, silences, and deviations.
4. Write prose scenarios. Each scenario must reference the specific spec requirement or provenance entry that triggered it.
5. Implement each prose scenario as executable test code. Every test must trace back to a numbered scenario in the prose document.
6. Run the tests against the built software.
7. Update the provenance document. Append a "Testing Agent Findings" section.

---

## Task

1. Implement Linear API integration in the HQ chat application.
2. Add Linear tool definitions and an `executeLinearTool` function to the chat API route.
3. Update the Kubernetes ExternalSecret to include the Linear API key.
4. Update the system prompt to document the new Linear tools.
5. After completing all work, create a provenance record at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md`.

## Prerequisites

- Spec 0010 deployed: HQ chat interface is operational
- Spec 0011 deployed: GitHub MCP tools pattern is established in `route.ts`
- Read ADR-018 (`docs/adr/adr-018-secret-management.md`) — secrets are managed via Azure Key Vault + External Secrets Operator

## Context

Kevin Ryan & Associates needs a project management solution integrated directly into HQ to manage client engagements, internal initiatives, and business development workstreams. Linear has been selected as the project management tool due to its AI-native design, clean API, and minimal overhead compared to alternatives like Jira.

The integration follows the exact same pattern already established for GitHub tools — defining Anthropic tool schemas in the `tools` array and implementing an `executeLinearTool` function that calls Linear's GraphQL API directly. No MCP client library is needed.

Linear's GraphQL API endpoint is `https://api.linear.app/graphql`. Authentication uses a Personal API Key passed in the `Authorization` header. The API key will be stored in Azure Key Vault and injected via the External Secrets Operator, consistent with all other secrets in the platform.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Chat API route with GitHub tool definitions and `executeGitHubTool` function. This is the primary file to modify. |
| `sites/hq-kevinryan-io/config/hq-system-prompt.md` | System prompt for HQ. Must be updated to document the new Linear tools. |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | ExternalSecret manifest that maps Azure Key Vault secrets to K8s env vars. Must add `LINEAR_API_KEY`. |
| `k8s/hq-kevinryan-io/deployment.yaml` | Deployment manifest. No changes needed — it already uses `envFrom` with `secretRef: hq-auth0-secrets`, so the new secret key will be available automatically. |
| `sites/hq-kevinryan-io/package.json` | Package dependencies. No new dependencies are needed — all Linear API calls use `fetch`. |

### Key facts

- **Linear GraphQL endpoint:** `https://api.linear.app/graphql`
- **Auth method:** `Authorization: <API_KEY>` header (Linear API keys are passed directly, no `Bearer` prefix)
- **Env var name:** `LINEAR_API_KEY`
- **Azure Key Vault secret name:** `hq-linear-api-key`
- **No new npm dependencies required** — uses native `fetch` for GraphQL calls
- **All GraphQL queries use POST method** with `Content-Type: application/json`

## 1. Add `executeLinearTool` function to `route.ts`

Add a new function `executeLinearTool` alongside the existing `executeGitHubTool` function in `sites/hq-kevinryan-io/app/api/chat/route.ts`.

### 1.1 Linear API helper

Create a helper function for making Linear GraphQL calls. Place it above `executeLinearTool`:

```typescript
const LINEAR_API_URL = 'https://api.linear.app/graphql'

async function linearGraphQL(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.LINEAR_API_KEY ?? '',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Linear API error: ${res.status} ${text}`)
  }
  const json = (await res.json()) as { data?: unknown; errors?: Array<{ message: string }> }
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Linear GraphQL error: ${json.errors.map((e) => e.message).join(', ')}`)
  }
  return json.data
}
```

### 1.2 `executeLinearTool` function

Implement the following tool handlers inside `executeLinearTool`. Each tool maps to a specific GraphQL query or mutation.

```typescript
async function executeLinearTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  try {
    // Tool implementations below
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Linear error'
    return `Error: ${message}`
  }
}
```

#### Tool: `search_linear_issues`

Search for issues using Linear's text search. Supports filtering by team, project, and status.

```graphql
query SearchIssues($query: String!, $first: Int) {
  searchIssues(query: $query, first: $first) {
    nodes {
      id
      identifier
      title
      description
      state { name }
      priority
      assignee { name }
      project { name }
      team { name key }
      createdAt
      updatedAt
      url
    }
  }
}
```

- Input: `query` (string, required), `limit` (number, optional, default 20)
- Maps `limit` to the `first` GraphQL variable
- Return the `nodes` array as JSON string

#### Tool: `list_linear_issues`

List issues with optional filters. This is for browsing/filtering rather than text search.

```graphql
query ListIssues($teamId: String, $projectId: String, $first: Int, $filter: IssueFilter) {
  issues(first: $first, filter: $filter) {
    nodes {
      id
      identifier
      title
      state { name }
      priority
      assignee { name }
      project { name }
      team { name key }
      dueDate
      url
    }
  }
}
```

- Input: `teamKey` (string, optional), `projectName` (string, optional), `status` (string, optional), `limit` (number, optional, default 20)
- Build the `filter` object dynamically based on which optional inputs are provided:
  - If `teamKey` is provided: `filter.team = { key: { eq: teamKey } }`
  - If `projectName` is provided: `filter.project = { name: { containsIgnoreCase: projectName } }`
  - If `status` is provided: `filter.state = { name: { containsIgnoreCase: status } }`
- Return the `nodes` array as JSON string

#### Tool: `create_linear_issue`

Create a new issue.

```graphql
mutation CreateIssue($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      id
      identifier
      title
      url
    }
  }
}
```

- Input: `title` (string, required), `description` (string, optional), `teamKey` (string, required), `projectName` (string, optional), `priority` (number, optional — 0=none, 1=urgent, 2=high, 3=medium, 4=low), `labelNames` (string array, optional)
- The `teamKey` must be resolved to a `teamId` before creating the issue. Query for the team first:

```graphql
query GetTeam($key: String!) {
  teams(filter: { key: { eq: $key } }) {
    nodes { id }
  }
}
```

- If `projectName` is provided, resolve it to a `projectId`:

```graphql
query GetProject($name: String!) {
  projects(filter: { name: { containsIgnoreCase: $name } }) {
    nodes { id name }
  }
}
```

- If `labelNames` is provided, resolve each to a label ID:

```graphql
query GetLabels {
  issueLabels(first: 100) {
    nodes { id name }
  }
}
```

Then match by name (case-insensitive). Skip any label names that don't match.

- Build the `input` object: `{ title, description, teamId, projectId, priority, labelIds }`
- Return the created issue details as JSON string

#### Tool: `update_linear_issue`

Update an existing issue by its identifier (e.g. `ENG-123`).

```graphql
mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
  issueUpdate(id: $id, input: $input) {
    success
    issue {
      id
      identifier
      title
      state { name }
      url
    }
  }
}
```

- Input: `issueIdentifier` (string, required — e.g. "ENG-123"), `title` (string, optional), `description` (string, optional), `status` (string, optional), `priority` (number, optional)
- First resolve the identifier to an issue ID:

```graphql
query GetIssue($filter: IssueFilter!) {
  issues(filter: $filter, first: 1) {
    nodes { id team { states { nodes { id name } } } }
  }
}
```

Use filter: `{ number: { eq: <number> }, team: { key: { eq: <teamKey> } } }` — parse the identifier to extract the team key prefix and issue number.

- If `status` is provided, find the matching workflow state ID from the team's states and set `stateId` in the update input
- Build the `input` object with only the provided fields
- Return the updated issue details as JSON string

#### Tool: `add_linear_comment`

Add a comment to an issue.

```graphql
mutation AddComment($input: CommentCreateInput!) {
  commentCreate(input: $input) {
    success
    comment {
      id
      body
      createdAt
      url
    }
  }
}
```

- Input: `issueIdentifier` (string, required), `body` (string, required — supports markdown)
- Resolve the identifier to an issue ID (same approach as `update_linear_issue`)
- Return the created comment details as JSON string

#### Tool: `list_linear_projects`

List projects with optional status filter.

```graphql
query ListProjects($first: Int, $filter: ProjectFilter) {
  projects(first: $first, filter: $filter) {
    nodes {
      id
      name
      description
      state
      progress
      startDate
      targetDate
      lead { name }
      teams { nodes { name key } }
      url
    }
  }
}
```

- Input: `status` (string, optional — e.g. "started", "planned", "completed"), `limit` (number, optional, default 20)
- If `status` is provided: `filter.state = { containsIgnoreCase: status }`
- Return the `nodes` array as JSON string

#### Tool: `list_linear_teams`

List all teams in the workspace. Useful for discovering team keys.

```graphql
query ListTeams {
  teams {
    nodes {
      id
      name
      key
      description
    }
  }
}
```

- Input: none required
- Return the `nodes` array as JSON string

## 2. Add Linear tool definitions to the `tools` array

Add the following tool definitions to the `tools` array in `route.ts`, after the existing GitHub tools. Each definition follows the exact same Anthropic `Tool` schema pattern already used for GitHub tools.

```typescript
{
  name: 'search_linear_issues',
  description: 'Search for issues in Linear using text search. Use this when looking for issues by keyword, title, or description.',
  input_schema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query text',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default 20)',
      },
    },
    required: ['query'],
  },
},
{
  name: 'list_linear_issues',
  description: 'List issues in Linear with optional filters for team, project, and status. Use this for browsing and filtering rather than text search.',
  input_schema: {
    type: 'object' as const,
    properties: {
      teamKey: {
        type: 'string',
        description: 'Filter by team key (e.g. "ENG", "BD", "PLT")',
      },
      projectName: {
        type: 'string',
        description: 'Filter by project name (partial match)',
      },
      status: {
        type: 'string',
        description: 'Filter by status name (e.g. "In Progress", "Todo", "Done")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default 20)',
      },
    },
    required: [],
  },
},
{
  name: 'create_linear_issue',
  description: 'Create a new issue in Linear. Requires a title and team key. Optionally set project, priority, labels, and description.',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: {
        type: 'string',
        description: 'Issue title',
      },
      description: {
        type: 'string',
        description: 'Issue description (supports markdown)',
      },
      teamKey: {
        type: 'string',
        description: 'Team key to create the issue in (e.g. "ENG", "BD")',
      },
      projectName: {
        type: 'string',
        description: 'Project name to associate the issue with (partial match)',
      },
      priority: {
        type: 'number',
        description: 'Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low',
      },
      labelNames: {
        type: 'array',
        items: { type: 'string' },
        description: 'Label names to apply (e.g. ["billable", "spec-required"])',
      },
    },
    required: ['title', 'teamKey'],
  },
},
{
  name: 'update_linear_issue',
  description: 'Update an existing Linear issue by its identifier (e.g. "ENG-123"). Can update title, description, status, and priority.',
  input_schema: {
    type: 'object' as const,
    properties: {
      issueIdentifier: {
        type: 'string',
        description: 'Issue identifier (e.g. "ENG-123")',
      },
      title: {
        type: 'string',
        description: 'New title',
      },
      description: {
        type: 'string',
        description: 'New description (supports markdown)',
      },
      status: {
        type: 'string',
        description: 'New status name (e.g. "In Progress", "Done")',
      },
      priority: {
        type: 'number',
        description: 'New priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low',
      },
    },
    required: ['issueIdentifier'],
  },
},
{
  name: 'add_linear_comment',
  description: 'Add a comment to a Linear issue. Supports markdown in the comment body.',
  input_schema: {
    type: 'object' as const,
    properties: {
      issueIdentifier: {
        type: 'string',
        description: 'Issue identifier (e.g. "ENG-123")',
      },
      body: {
        type: 'string',
        description: 'Comment body (supports markdown)',
      },
    },
    required: ['issueIdentifier', 'body'],
  },
},
{
  name: 'list_linear_projects',
  description: 'List projects in Linear with optional status filter. Shows project name, progress, lead, and associated teams.',
  input_schema: {
    type: 'object' as const,
    properties: {
      status: {
        type: 'string',
        description: 'Filter by project status (e.g. "started", "planned", "completed")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default 20)',
      },
    },
    required: [],
  },
},
{
  name: 'list_linear_teams',
  description: 'List all teams in the Linear workspace. Useful for discovering team keys needed by other Linear tools.',
  input_schema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
}
```

## 3. Update tool dispatch in the streaming loop

In the `ReadableStream` `start` function, update the tool execution block to route Linear tools to `executeLinearTool`. Currently the code calls `executeGitHubTool` for all tools. Change the dispatch logic:

```typescript
for (const toolUse of toolUseBlocks) {
  let result: string
  if (toolUse.name.startsWith('search_linear_') ||
      toolUse.name.startsWith('list_linear_') ||
      toolUse.name.startsWith('create_linear_') ||
      toolUse.name.startsWith('update_linear_') ||
      toolUse.name.startsWith('add_linear_')) {
    result = await executeLinearTool(
      toolUse.name,
      toolUse.input as Record<string, unknown>,
    )
  } else {
    result = await executeGitHubTool(
      toolUse.name,
      toolUse.input as Record<string, unknown>,
    )
  }
  toolResults.push({
    type: 'tool_result',
    tool_use_id: toolUse.id,
    content: result,
  })
}
```

**Design notes:**

- The prefix-based routing is simple and extensible. As we add more integrations in the future, each gets its own `execute*Tool` function and prefix check.
- The `web_search` tool is handled natively by the Anthropic SDK and never reaches this dispatch block, so no special case is needed.

## 4. Update ExternalSecret for Linear API key

Add the `LINEAR_API_KEY` entry to `k8s/hq-kevinryan-io/externalsecret.yaml`:

Add this entry to the `spec.data` array:

```yaml
    - secretKey: LINEAR_API_KEY
      remoteRef:
        key: hq-linear-api-key
```

**Design notes:**

- The Azure Key Vault secret name is `hq-linear-api-key`, following the existing naming convention (`hq-` prefix, kebab-case).
- The env var `LINEAR_API_KEY` follows the existing `GITHUB_MCP_TOKEN` and `ANTHROPIC_API_KEY` naming convention (UPPER_SNAKE_CASE).
- No changes needed to `deployment.yaml` — it already uses `envFrom: secretRef: hq-auth0-secrets` which will automatically include the new key.

## 5. Update system prompt with Linear tool documentation

Update `sites/hq-kevinryan-io/config/hq-system-prompt.md` to add documentation for the new Linear tools. Add a new section after the existing GitHub tools documentation.

The system prompt update should add:

1. A section explaining the Linear integration and available tools
2. Tool descriptions matching the tool definitions
3. Guidance on the recommended Linear workspace structure:
   - **Teams:** Client Engagements, Platform, Business Development, Internal
   - **Projects:** One per engagement or initiative
   - **Labels:** `billable`, `non-billable`, `blocked`, `waiting-on-client`, `spec-required`
4. Usage patterns — how to use Linear tools for common operations like "give me a dashboard", "what's outstanding on CERN", "create a task for the Vodafone SOW"

**Important:** Read the existing system prompt file first and preserve ALL existing content. Add the Linear section in the appropriate location — after the GitHub Write Tools section and before any closing sections.

## Constraints and Assumptions

- **Constraint:** No new npm dependencies. All Linear API calls use native `fetch` with GraphQL queries.
- **Constraint:** Authentication uses a Personal API Key (not OAuth2). This is appropriate because HQ is a single-user system (Kevin's tool), not a multi-tenant app.
- **Constraint:** The Linear API key must not be hardcoded. It must come from the `LINEAR_API_KEY` environment variable, sourced via External Secrets Operator from Azure Key Vault.
- **Assumption:** Kevin will create a Linear workspace and generate a Personal API Key before this integration goes live.
- **Assumption:** Kevin will add the API key to Azure Key Vault with the name `hq-linear-api-key` as a manual step after merge.
- **Assumption:** Linear's GraphQL API at `https://api.linear.app/graphql` is stable and does not require version pinning.
- **Assumption:** The `searchIssues` query is available (it was added to Linear's API in 2023). If the builder encounters issues with this query during testing, fall back to `issues` with a `filter` that uses `title: { containsIgnoreCase: query }`.

## Out of Scope

- **Linear MCP client integration** — We are using direct GraphQL API calls, not the MCP protocol. This avoids adding MCP client dependencies and matches the existing tool pattern.
- **Cycle management** — Linear cycles can be managed through Linear's UI. We may add cycle tools in a future spec.
- **Webhook integration** — Real-time updates from Linear to HQ are not included. This could be a future enhancement.
- **Team/workspace administration** — Creating teams, managing members, and workspace settings are done through Linear's UI.
- **Custom views and filters** — Complex saved views are better managed in Linear's UI.
- **OAuth2 authentication** — Not needed for a single-user system.

## Manual steps (not performed by the agent)

1. **Create Linear workspace** — Go to linear.app and create a workspace for Kevin Ryan & Associates (if not already done).
2. **Set up teams** — Create teams: Client Engagements, Platform, Business Development, Internal (with keys like `CE`, `PLT`, `BD`, `INT`).
3. **Create labels** — Add workspace-level labels: `billable`, `non-billable`, `blocked`, `waiting-on-client`, `spec-required`.
4. **Generate API key** — Go to Linear Settings > Account > Security & Access > Create a Personal API Key with full access.
5. **Add secret to Azure Key Vault:**

```bash
az keyvault secret set \
  --vault-name kevinryanplatform \
  --name hq-linear-api-key \
  --value "<your-linear-api-key>"
```

6. **Verify secret sync** — After the ExternalSecret manifest is deployed via Flux, verify:

```bash
kubectl get externalsecret hq-auth0-secrets -n hq-kevinryan-io
```

The status should show `SecretSynced`.

7. **Restart deployment** to pick up the new secret:

```bash
kubectl rollout restart deployment/hq-kevinryan-io -n hq-kevinryan-io
```

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. The file `sites/hq-kevinryan-io/app/api/chat/route.ts` contains:
   - A `linearGraphQL` helper function
   - An `executeLinearTool` function handling all 7 Linear tools
   - 7 new tool definitions in the `tools` array (search_linear_issues, list_linear_issues, create_linear_issue, update_linear_issue, add_linear_comment, list_linear_projects, list_linear_teams)
   - Updated tool dispatch logic that routes Linear tools to `executeLinearTool`
2. The file `k8s/hq-kevinryan-io/externalsecret.yaml` contains a `LINEAR_API_KEY` entry referencing `hq-linear-api-key`
3. The file `sites/hq-kevinryan-io/config/hq-system-prompt.md` contains documentation for all 7 Linear tools
4. `pnpm lint` passes with no errors
5. `pnpm build` passes with no errors
6. No new dependencies have been added to `package.json`
7. All existing GitHub tool functionality is unchanged and still works
8. The provenance record exists at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` and contains all required sections
9. All files (spec, implementation, provenance) are committed together
