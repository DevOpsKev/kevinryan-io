---
title: "Spec 0017: HQ Linear Integration"
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
- A provenance record at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0017-hq-linear-integration.md` in the repo. This is the canonical reference. Do not modify it after saving.
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

- Prose scenarios at `.sdd/scenarios/spec-0017-hq-linear-integration.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` in full.
3. Compare the provenance against the specification. Identify:
   - **Gaps:** Requirements in the spec that the provenance does not address.
   - **Assumptions:** Decisions the builder made where the spec was silent. These are primary targets for scenarios.
   - **Ambiguities:** Places where the builder interpreted an ambiguous requirement. Generate scenarios that test whether the interpretation was reasonable.
   - **Silences:** Things the provenance does not mention at all. These may indicate missing implementation or missing provenance.
   - **Deviations:** Anywhere the builder deviated from the spec. Generate scenarios that test the impact.
4. Write prose scenarios to `.sdd/scenarios/spec-0017-hq-linear-integration.scenarios.md`. Each scenario must:
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

1. Save this spec to `.sdd/specification/spec-0017-hq-linear-integration.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0010 deployed: HQ chat interface with streaming and agentic tool loop
- Spec 0011 deployed: GitHub MCP tools (the pattern this spec extends)
- Read ADR context: The existing tool architecture uses hand-rolled Anthropic tool definitions with a server-side execution function that calls external APIs via `fetch`. This spec follows the same pattern for Linear.

## Context

Kevin Ryan & Associates needs a project management system to track client engagements, internal initiatives, platform work, and business development. Linear has been selected as the tool — it is AI-native, lightweight, and has a clean GraphQL API.

HQ (the AI assistant running at hq.kevinryan.io) needs direct access to Linear so that Kevin can manage workstreams conversationally. Rather than switching to the Linear UI for every task, Kevin should be able to say things like:

- "What's outstanding on the CERN workstream?"
- "Create a task: draft SOW for Vodafone, due Friday"
- "Mark the NatWest proposal as done"
- "Give me a dashboard across all active engagements"

The integration follows the same architectural pattern as the existing GitHub tools: define Anthropic tool schemas in the `tools` array, add an `executeLinearTool` function that calls Linear's GraphQL API via `fetch`, and route tool calls in the agentic loop.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `sites/hq-kevinryan-io/app/api/chat/route.ts` | Chat API route with tool definitions, `executeGitHubTool` function, and agentic streaming loop. This is the primary file to modify. |
| `k8s/hq-kevinryan-io/deployment.yaml` | K8s deployment — currently references `hq-auth0-secrets` for env vars. |
| `k8s/hq-kevinryan-io/externalsecret.yaml` | ExternalSecret pulling secrets from Azure Key Vault into K8s. Needs `LINEAR_API_KEY` added. |
| `config/hq-system-prompt.md` | System prompt — needs updating to document Linear tools for HQ. |

### Key facts

- **Linear GraphQL endpoint:** `https://api.linear.app/graphql`
- **Authentication:** `Authorization: <LINEAR_API_KEY>` header (personal API key, no Bearer prefix needed for API keys)
- **Azure Key Vault secret name:** `hq-linear-api-key` (to be created manually by Kevin)
- **K8s secret key:** `LINEAR_API_KEY`
- **Env var in container:** `LINEAR_API_KEY`

## 1. Add `executeLinearTool` function to `route.ts`

Add a new function `executeLinearTool` in `sites/hq-kevinryan-io/app/api/chat/route.ts`, placed immediately after the existing `executeGitHubTool` function.

The function signature should be:

```typescript
async function executeLinearTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string>
```

It should call the Linear GraphQL API at `https://api.linear.app/graphql` using `fetch` with:

- Method: `POST`
- Headers: `Content-Type: application/json` and `Authorization: ${process.env.LINEAR_API_KEY}`
- Body: JSON-encoded `{ query, variables }` object

Add a helper function for making GraphQL requests:

```typescript
const LINEAR_API_URL = 'https://api.linear.app/graphql'

async function linearGraphQL(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${process.env.LINEAR_API_KEY}`,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  })
  if (!res.ok) return { error: `Linear API error: ${res.status} ${res.statusText}` }
  const json = await res.json() as { data?: unknown; errors?: Array<{ message: string }> }
  if (json.errors) return { error: json.errors.map(e => e.message).join(', ') }
  return json.data
}
```

The `executeLinearTool` function must handle these tool names:

### 1.1 `list_linear_teams`

Query all teams in the workspace. This is needed to discover team IDs for issue creation.

```graphql
query Teams {
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

Return: JSON array of teams with id, name, key, description.

### 1.2 `search_linear_issues`

Search issues with optional filters. Input parameters:

- `query` (optional string) — text search term
- `teamId` (optional string) — filter by team
- `projectId` (optional string) — filter by project
- `stateType` (optional string) — filter by state type: `backlog`, `unstarted`, `started`, `completed`, `cancelled`
- `assigneeId` (optional string) — filter by assignee
- `labelName` (optional string) — filter by label name
- `limit` (optional number, default 20) — max results

Build a GraphQL filter object dynamically based on which inputs are provided. Use the `issues` query with the `filter` parameter.

```graphql
query Issues($filter: IssueFilter, $first: Int) {
  issues(filter: $filter, first: $first) {
    nodes {
      id
      identifier
      title
      description
      priority
      priorityLabel
      state {
        name
        type
      }
      assignee {
        name
      }
      project {
        name
      }
      labels {
        nodes {
          name
        }
      }
      dueDate
      createdAt
      updatedAt
      url
    }
  }
}
```

When `query` is provided, use the `issueSearch` query instead:

```graphql
query IssueSearch($query: String!, $first: Int) {
  issueSearch(query: $query, first: $first) {
    nodes {
      id
      identifier
      title
      description
      priority
      priorityLabel
      state {
        name
        type
      }
      assignee {
        name
      }
      project {
        name
      }
      labels {
        nodes {
          name
        }
      }
      dueDate
      createdAt
      updatedAt
      url
    }
  }
}
```

Return: JSON array of issues with all the above fields.

### 1.3 `create_linear_issue`

Create a new issue. Input parameters:

- `title` (required string) — issue title
- `teamId` (required string) — team to create issue in
- `description` (optional string) — markdown description
- `projectId` (optional string) — project to associate with
- `assigneeId` (optional string) — user to assign to
- `priority` (optional number) — 0=none, 1=urgent, 2=high, 3=medium, 4=low
- `labelIds` (optional string array) — label IDs to apply
- `dueDate` (optional string) — ISO date string (YYYY-MM-DD)
- `stateId` (optional string) — workflow state ID

```graphql
mutation IssueCreate($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      id
      identifier
      title
      url
      state {
        name
      }
      project {
        name
      }
    }
  }
}
```

The `$input` variable should be built from the provided parameters, omitting any that are undefined.

Return: JSON with success boolean, issue id, identifier, title, url, state, and project.

### 1.4 `update_linear_issue`

Update an existing issue. Input parameters:

- `issueId` (required string) — the issue ID or identifier (e.g. `KRA-123`)
- `title` (optional string) — new title
- `description` (optional string) — new description
- `stateId` (optional string) — new state ID
- `assigneeId` (optional string) — new assignee
- `priority` (optional number) — new priority
- `projectId` (optional string) — move to project
- `labelIds` (optional string array) — replace labels
- `dueDate` (optional string) — new due date (YYYY-MM-DD)

```graphql
mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
  issueUpdate(id: $id, input: $input) {
    success
    issue {
      id
      identifier
      title
      url
      state {
        name
      }
    }
  }
}
```

Return: JSON with success boolean and updated issue details.

### 1.5 `list_linear_projects`

List projects with optional filtering. Input parameters:

- `state` (optional string) — filter by project state: `planned`, `started`, `paused`, `completed`, `cancelled`
- `limit` (optional number, default 20) — max results

```graphql
query Projects($filter: ProjectFilter, $first: Int) {
  projects(filter: $filter, first: $first) {
    nodes {
      id
      name
      description
      state
      progress
      startDate
      targetDate
      url
      lead {
        name
      }
      teams {
        nodes {
          name
        }
      }
      issues {
        nodes {
          id
          identifier
          title
          state {
            name
            type
          }
        }
      }
    }
  }
}
```

Return: JSON array of projects with all the above fields.

### 1.6 `create_linear_project`

Create a new project. Input parameters:

- `name` (required string) — project name
- `teamIds` (required string array) — teams to associate with
- `description` (optional string) — markdown description
- `state` (optional string) — initial state, defaults to `planned`
- `startDate` (optional string) — ISO date (YYYY-MM-DD)
- `targetDate` (optional string) — ISO date (YYYY-MM-DD)
- `leadId` (optional string) — project lead user ID

```graphql
mutation ProjectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    success
    project {
      id
      name
      url
      state
    }
  }
}
```

Return: JSON with success boolean and project details.

### 1.7 `add_linear_comment`

Add a comment to an issue. Input parameters:

- `issueId` (required string) — the issue ID
- `body` (required string) — markdown comment body

```graphql
mutation CommentCreate($input: CommentCreateInput!) {
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

Return: JSON with success boolean and comment details.

### 1.8 `list_linear_workflow_states`

List workflow states for a team. This is needed to know valid state IDs for issue creation/updates. Input parameters:

- `teamId` (required string) — team ID

```graphql
query WorkflowStates($filter: WorkflowStateFilter) {
  workflowStates(filter: $filter) {
    nodes {
      id
      name
      type
      position
      team {
        name
      }
    }
  }
}
```

Return: JSON array of workflow states.

### 1.9 `list_linear_labels`

List labels in the workspace. Needed to know valid label IDs. Input parameters:

- `limit` (optional number, default 50) — max results

```graphql
query Labels($first: Int) {
  issueLabels(first: $first) {
    nodes {
      id
      name
      color
      description
    }
  }
}
```

Return: JSON array of labels.

### Error handling

If `LINEAR_API_KEY` is not set, return a helpful error message: `"Linear integration is not configured. The LINEAR_API_KEY environment variable is missing."`

If the GraphQL response contains errors, return them formatted as a readable string.

## 2. Add Linear tool definitions to the `tools` array

Add the following tool definitions to the `tools` array in `route.ts`, after the existing GitHub tool definitions:

Each tool must have:

- `name` — matching the tool name in `executeLinearTool`
- `description` — clear description of what the tool does
- `input_schema` — JSON Schema object describing the input parameters

Tool definitions to add:

1. **`list_linear_teams`** — "List all teams in the Linear workspace. Returns team IDs, names, keys, and descriptions. Use this to discover team IDs needed for creating issues and projects."
   - No required parameters

2. **`search_linear_issues`** — "Search and filter issues in Linear. Can search by text query, or filter by team, project, state type, assignee, or label. Returns issue details including identifier, title, state, assignee, project, labels, due date, and URL."
   - Properties: query (string), teamId (string), projectId (string), stateType (string, enum: backlog/unstarted/started/completed/cancelled), assigneeId (string), labelName (string), limit (number)
   - No required parameters

3. **`create_linear_issue`** — "Create a new issue in Linear. Requires a title and team ID. Optionally set description, project, assignee, priority (0=none, 1=urgent, 2=high, 3=medium, 4=low), labels, due date, and initial state."
   - Properties: title (string), teamId (string), description (string), projectId (string), assigneeId (string), priority (number), labelIds (array of strings), dueDate (string), stateId (string)
   - Required: title, teamId

4. **`update_linear_issue`** — "Update an existing Linear issue. The issueId can be the UUID or the short identifier like KRA-123. Any provided field will be updated; omitted fields remain unchanged."
   - Properties: issueId (string), title (string), description (string), stateId (string), assigneeId (string), priority (number), projectId (string), labelIds (array of strings), dueDate (string)
   - Required: issueId

5. **`list_linear_projects`** — "List projects in Linear. Optionally filter by project state (planned, started, paused, completed, cancelled). Returns project details including progress, dates, lead, associated teams, and issues."
   - Properties: state (string, enum: planned/started/paused/completed/cancelled), limit (number)
   - No required parameters

6. **`create_linear_project`** — "Create a new project in Linear. Requires a name and at least one team ID. Optionally set description, initial state, start/target dates, and project lead."
   - Properties: name (string), teamIds (array of strings), description (string), state (string), startDate (string), targetDate (string), leadId (string)
   - Required: name, teamIds

7. **`add_linear_comment`** — "Add a comment to a Linear issue. The comment body supports markdown formatting."
   - Properties: issueId (string), body (string)
   - Required: issueId, body

8. **`list_linear_workflow_states`** — "List workflow states (statuses) for a Linear team. Use this to discover valid state IDs for creating or updating issues. States are categorised as: backlog, unstarted, started, completed, cancelled."
   - Properties: teamId (string)
   - Required: teamId

9. **`list_linear_labels`** — "List issue labels in the Linear workspace. Use this to discover valid label IDs for creating or updating issues."
   - Properties: limit (number)
   - No required parameters

## 3. Update the tool dispatch in the agentic loop

In the streaming loop inside the `POST` handler, the current code calls `executeGitHubTool` for all tool use blocks. Update this so that:

1. If the tool name starts with `list_linear_`, `search_linear_`, `create_linear_`, `update_linear_`, or `add_linear_`, route to `executeLinearTool`
2. Otherwise, continue routing to `executeGitHubTool`

The simplest approach: define a set or array of Linear tool names and check membership. For example:

```typescript
const linearToolNames = new Set([
  'list_linear_teams',
  'search_linear_issues',
  'create_linear_issue',
  'update_linear_issue',
  'list_linear_projects',
  'create_linear_project',
  'add_linear_comment',
  'list_linear_workflow_states',
  'list_linear_labels',
])
```

Then in the tool execution loop:

```typescript
const result = linearToolNames.has(toolUse.name)
  ? await executeLinearTool(toolUse.name, toolUse.input as Record<string, unknown>)
  : await executeGitHubTool(toolUse.name, toolUse.input as Record<string, unknown>)
```

## 4. Add `LINEAR_API_KEY` to Kubernetes secrets

### 4.1 Update ExternalSecret

In `k8s/hq-kevinryan-io/externalsecret.yaml`, add a new entry to the `data` array:

```yaml
    - secretKey: LINEAR_API_KEY
      remoteRef:
        key: hq-linear-api-key
```

This maps the Azure Key Vault secret `hq-linear-api-key` to the Kubernetes secret key `LINEAR_API_KEY`.

The deployment already uses `envFrom` with `secretRef: hq-auth0-secrets`, so the new secret key will automatically be available as an environment variable in the container. No changes to `deployment.yaml` are needed.

## 5. Update the system prompt

In `config/hq-system-prompt.md`, add a section documenting the Linear tools. Add it after the GitHub Write Tools section. The section should describe:

- The available Linear tools and when to use them
- The recommended Linear workspace structure (Teams: Client Engagements, Platform, Business Development, Internal)
- How to use tools together (e.g. list teams first to get IDs, then create issues)
- Priority values: 0=none, 1=urgent, 2=high, 3=medium, 4=low

Here is the content to add:

```markdown
## Linear Project Management Tools

You have read/write access to the Kevin Ryan & Associates Linear workspace for project management. Use these tools to manage client engagements, internal initiatives, platform work, and business development.

### Available Tools

- **`list_linear_teams`** — List all teams. Use first to discover team IDs.
- **`search_linear_issues`** — Search issues by text, or filter by team/project/state/assignee/label.
- **`create_linear_issue`** — Create an issue. Requires title and team ID.
- **`update_linear_issue`** — Update an issue by ID or identifier (e.g. KRA-123).
- **`list_linear_projects`** — List projects, optionally filtered by state.
- **`create_linear_project`** — Create a project. Requires name and team IDs.
- **`add_linear_comment`** — Add a markdown comment to an issue.
- **`list_linear_workflow_states`** — List valid statuses for a team.
- **`list_linear_labels`** — List available labels and their IDs.

### Usage Patterns

When creating issues or projects, you often need to look up IDs first:

1. Call `list_linear_teams` to find the team ID
2. Call `list_linear_workflow_states` with the team ID to find state IDs
3. Call `list_linear_labels` to find label IDs
4. Then call `create_linear_issue` or `create_linear_project` with those IDs

Cache team, state, and label IDs within a conversation — don't re-fetch them for every operation.

### Priority Values

- 0 = No priority
- 1 = Urgent
- 2 = High
- 3 = Medium
- 4 = Low

### Workspace Structure

The Linear workspace is organised into teams:

- **Client Engagements** — Billable delivery work (CERN, NatWest, BBC, etc.)
- **Platform** — kevin-ryan-platform, infrastructure, HQ development
- **Business Development** — Pipeline, proposals, outreach
- **Internal** — Admin, learning, certifications, content

Projects within teams represent individual engagements or initiatives. Issues are tasks/deliverables within projects.
```

## Constraints and Assumptions

- **Constraint:** No new npm dependencies. The integration uses `fetch` (built into Node.js 22) to call Linear's GraphQL API directly, matching the existing GitHub tool pattern.
- **Constraint:** The `LINEAR_API_KEY` must be a Linear personal API key, not an OAuth token. Personal API keys are passed in the Authorization header without a `Bearer` prefix.
- **Assumption:** Kevin will create the Azure Key Vault secret `hq-linear-api-key` manually before deployment.
- **Assumption:** The Linear workspace and teams already exist. This spec does not create the workspace structure — it provides tools for HQ to interact with whatever structure exists.
- **Assumption:** The ExternalSecret controller is already running and the `azure-keyvault` ClusterSecretStore is configured (established in Spec 0003).
- **Constraint:** Tool names follow the pattern `{verb}_linear_{resource}` to clearly distinguish them from GitHub tools and allow simple routing.
- **Constraint:** The system prompt update is a documentation-only change to help HQ use the tools effectively. It does not change HQ's behaviour — the tools work regardless of whether the system prompt mentions them.

## Out of Scope

- **Linear workspace setup** — Creating teams, labels, and workflow states in Linear is a manual task for Kevin.
- **Cycle management** — Linear cycles are better managed through the Linear UI.
- **Webhook integration** — Real-time updates from Linear to HQ are not in scope. HQ queries Linear on demand.
- **OAuth flow** — We use a personal API key, not OAuth. OAuth would be needed only if multiple users authenticated separately.
- **Linear SDK (`@linear/sdk`)** — We use raw GraphQL via `fetch` to avoid adding a dependency. The SDK can be considered in a future iteration if the raw approach becomes unwieldy.
- **File attachments** — Uploading files to Linear issues is not in scope.
- **Initiative/Roadmap features** — Linear's higher-level planning features are not exposed as tools in this iteration.

## Manual steps (not performed by the agent)

1. **Create Linear API key:** In Linear, go to Settings > Account > Security & Access and generate a Personal API Key.
2. **Store in Azure Key Vault:**

```bash
az keyvault secret set --vault-name kevinryan-kv --name hq-linear-api-key --value "<YOUR_LINEAR_API_KEY>"
```

3. **Set up Linear workspace structure** (if not already done): Create teams (Client Engagements, Platform, Business Development, Internal), relevant projects, and labels (billable, non-billable, blocked, waiting-on-client, spec-required).

Verify:

```bash
# Check the secret is in Key Vault
az keyvault secret show --vault-name kevinryan-kv --name hq-linear-api-key --query "value" -o tsv

# After deployment, check the secret is in K8s
kubectl get secret hq-auth0-secrets -n hq-kevinryan-io -o jsonpath='{.data.LINEAR_API_KEY}' | base64 -d
```

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0017-hq-linear-integration.md`
2. `sites/hq-kevinryan-io/app/api/chat/route.ts` contains the `linearGraphQL` helper function
3. `sites/hq-kevinryan-io/app/api/chat/route.ts` contains the `executeLinearTool` function handling all 9 tool names
4. `sites/hq-kevinryan-io/app/api/chat/route.ts` contains all 9 Linear tool definitions in the `tools` array
5. The agentic loop correctly routes Linear tool calls to `executeLinearTool` and GitHub tool calls to `executeGitHubTool`
6. `k8s/hq-kevinryan-io/externalsecret.yaml` includes the `LINEAR_API_KEY` entry referencing `hq-linear-api-key`
7. `config/hq-system-prompt.md` contains the Linear Project Management Tools section
8. `pnpm lint` passes
9. `pnpm build` passes
10. No new dependencies have been added to `package.json`
11. The provenance record exists at `.sdd/provenance/spec-0017-hq-linear-integration.provenance.md` and contains all required sections
12. All files (spec, implementation, provenance) are committed together
