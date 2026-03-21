import fs from 'fs'
import path from 'path'

import Anthropic from '@anthropic-ai/sdk'

import { auth0 } from '@/lib/auth0'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const FALLBACK_SYSTEM_PROMPT =
  'You are HQ, the operational assistant for Kevin Ryan & Associates.'

function loadBaseSystemPrompt(): string {
  try {
    const filePath = path.join(process.cwd(), 'config/hq-system-prompt.md')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const content = raw
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('<!--'))
      .join('\n')
      .trim()
    return content.length > 0 ? content : FALLBACK_SYSTEM_PROMPT
  } catch (err) {
    console.error('[HQ] Failed to load config/hq-system-prompt.md:', err)
    return FALLBACK_SYSTEM_PROMPT
  }
}

const BASE_SYSTEM_PROMPT = loadBaseSystemPrompt()

const REDACTED_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

REDACTED MODE IS ACTIVE. You must return your response as a JSON array of segments. Each segment has a "text" field and a "sensitive" field (boolean).

Rules for sensitivity classification:
- Mark as sensitive (true): client names, project codenames, contract values, day rates, financial figures, personal information, health details, tax/HMRC matters, internal URLs, API keys, specific deliverable details that could identify a client engagement, any commercially sensitive information.
- Mark as not sensitive (false): general greetings, technical explanations that are not client-specific, publicly known information, general advice, descriptions of methodology or process, tool usage descriptions, and any content that would be safe for a public audience.

Segment your response at natural sentence boundaries. Each segment should be one or a few sentences that share the same sensitivity level. Do not over-segment — group consecutive sentences that have the same sensitivity level into a single segment.

Your response must be ONLY the JSON array — no markdown, no code fences, no preamble, no explanation outside the JSON. Example format:

[{"text":"Hello! Let me look into that for you.","sensitive":false},{"text":"The ACME Corp deployment is using a custom auth flow with a day rate of £1,200.","sensitive":true},{"text":"The architecture follows a standard microservices pattern with Kubernetes orchestration.","sensitive":false}]

Important: Your entire response must be valid JSON. Do not include any text before or after the JSON array. Do not wrap it in markdown code blocks.`

const client = new Anthropic()

const GITHUB_API_BASE = 'https://api.github.com/repos/DevOpsKev/kevin-ryan-platform'

async function executeGitHubTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_MCP_TOKEN}`,
    Accept: 'application/vnd.github+json',
  }

  if (name === 'read_github_file') {
    const path = input.path as string
    const res = await fetch(`${GITHUB_API_BASE}/contents/${path}`, { headers })
    if (!res.ok) return `Error: ${res.status} ${res.statusText}`
    const data = (await res.json()) as { content?: string; encoding?: string }
    if (data.encoding === 'base64' && data.content) {
      return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString(
        'utf-8',
      )
    }
    return JSON.stringify(data)
  }

  if (name === 'list_github_directory') {
    const path = input.path as string
    const res = await fetch(`${GITHUB_API_BASE}/contents/${path}`, { headers })
    if (!res.ok) return `Error: ${res.status} ${res.statusText}`
    const data = (await res.json()) as Array<{
      name: string
      type: string
      path: string
    }>
    return JSON.stringify(
      data.map((entry) => ({ name: entry.name, type: entry.type, path: entry.path })),
    )
  }

  if (name === 'list_github_prs') {
    const state = (input.state as string) ?? 'open'
    const res = await fetch(
      `${GITHUB_API_BASE}/pulls?state=${state}&per_page=30`,
      { headers },
    )
    if (!res.ok) return `Error: ${res.status} ${res.statusText}`
    const data = (await res.json()) as Array<{
      number: number
      title: string
      state: string
      html_url: string
      created_at: string
      user: { login: string }
    }>
    return JSON.stringify(
      data.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
        created_at: pr.created_at,
        author: pr.user.login,
      })),
    )
  }

  if (name === 'list_workflow_runs') {
    const limit = (input.limit as number) ?? 10
    const res = await fetch(
      `${GITHUB_API_BASE}/actions/runs?per_page=${limit}`,
      { headers },
    )
    if (!res.ok) return `Error: ${res.status} ${res.statusText}`
    const data = (await res.json()) as {
      workflow_runs: Array<{
        id: number
        name: string
        status: string
        conclusion: string | null
        created_at: string
        html_url: string
      }>
    }
    return JSON.stringify(
      data.workflow_runs.map((run) => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        url: run.html_url,
      })),
    )
  }

  if (name === 'create_github_branch') {
    const branchName = input.branchName as string
    if (!branchName.startsWith('hq-')) {
      return 'Error: Branch name must start with "hq-"'
    }
    const mainRes = await fetch(`${GITHUB_API_BASE}/git/ref/heads/main`, { headers })
    if (!mainRes.ok) {
      return `Error getting main branch: ${mainRes.status} ${mainRes.statusText}`
    }
    const mainData = (await mainRes.json()) as { object: { sha: string } }
    const res = await fetch(`${GITHUB_API_BASE}/git/refs`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: mainData.object.sha,
      }),
    })
    if (!res.ok) {
      const err = (await res.json()) as unknown
      return `Error creating branch: ${res.status} ${JSON.stringify(err)}`
    }
    const data = (await res.json()) as { ref: string }
    return `Branch created: ${data.ref}`
  }

  if (name === 'create_github_file') {
    const filePath = input.path as string
    const content = input.content as string
    const message = input.message as string
    const branch = input.branch as string
    if (filePath.includes('..')) {
      return 'Error: File path must not contain ".."'
    }
    let existingSha: string | undefined
    const checkRes = await fetch(
      `${GITHUB_API_BASE}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
      { headers },
    )
    if (checkRes.ok) {
      const existing = (await checkRes.json()) as { sha?: string }
      existingSha = existing.sha
    }
    const body: Record<string, string> = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
    }
    if (existingSha) body.sha = existingSha
    const res = await fetch(`${GITHUB_API_BASE}/contents/${filePath}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = (await res.json()) as unknown
      return `Error creating/updating file: ${res.status} ${JSON.stringify(err)}`
    }
    const data = (await res.json()) as { content: { html_url: string } }
    return `File ${existingSha ? 'updated' : 'created'}: ${data.content.html_url}`
  }

  if (name === 'create_github_pull_request') {
    const title = input.title as string
    const body = input.body as string
    const head = input.head as string
    const base = (input.base as string | undefined) ?? 'main'
    const res = await fetch(`${GITHUB_API_BASE}/pulls`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, head, base }),
    })
    if (!res.ok) {
      const err = (await res.json()) as unknown
      return `Error creating PR: ${res.status} ${JSON.stringify(err)}`
    }
    const data = (await res.json()) as {
      number: number
      html_url: string
      title: string
    }
    return JSON.stringify({ number: data.number, url: data.html_url, title: data.title })
  }

  if (name === 'add_pr_comment') {
    const prNumber = input.prNumber as number
    const body = input.body as string
    const res = await fetch(`${GITHUB_API_BASE}/issues/${prNumber}/comments`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    if (!res.ok) {
      const err = (await res.json()) as unknown
      return `Error adding comment: ${res.status} ${JSON.stringify(err)}`
    }
    const data = (await res.json()) as { id: number; html_url: string }
    return JSON.stringify({ id: data.id, url: data.html_url })
  }

  return `Unknown tool: ${name}`
}

const LINEAR_API_URL = 'https://api.linear.app/graphql'

async function linearGraphQL(
  query: string,
  variables?: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${process.env.LINEAR_API_KEY}`,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  })
  if (!res.ok) return { error: `Linear API error: ${res.status} ${res.statusText}` }
  const json = (await res.json()) as { data?: unknown; errors?: Array<{ message: string }> }
  if (json.errors) return { error: json.errors.map((e) => e.message).join(', ') }
  return json.data
}

async function executeLinearTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  if (!process.env.LINEAR_API_KEY) {
    return 'Linear integration is not configured. The LINEAR_API_KEY environment variable is missing.'
  }

  if (name === 'list_linear_teams') {
    const data = await linearGraphQL(`query Teams {
      teams {
        nodes {
          id
          name
          key
          description
        }
      }
    }`)
    const teams = data as { teams?: { nodes: unknown[] } }
    return JSON.stringify(teams?.teams?.nodes ?? data)
  }

  if (name === 'search_linear_issues') {
    const query = input.query as string | undefined
    const teamId = input.teamId as string | undefined
    const projectId = input.projectId as string | undefined
    const stateType = input.stateType as string | undefined
    const assigneeId = input.assigneeId as string | undefined
    const labelName = input.labelName as string | undefined
    const limit = (input.limit as number) ?? 20

    if (query) {
      const data = await linearGraphQL(
        `query IssueSearch($query: String!, $first: Int) {
          issueSearch(query: $query, first: $first) {
            nodes {
              id
              identifier
              title
              description
              priority
              priorityLabel
              state { name type }
              assignee { name }
              project { name }
              labels { nodes { name } }
              dueDate
              createdAt
              updatedAt
              url
            }
          }
        }`,
        { query, first: limit },
      )
      const result = data as { issueSearch?: { nodes: unknown[] } }
      return JSON.stringify(result?.issueSearch?.nodes ?? data)
    }

    const filter: Record<string, unknown> = {}
    if (teamId) filter.team = { id: { eq: teamId } }
    if (projectId) filter.project = { id: { eq: projectId } }
    if (stateType) filter.state = { type: { eq: stateType } }
    if (assigneeId) filter.assignee = { id: { eq: assigneeId } }
    if (labelName) filter.labels = { name: { eq: labelName } }

    const data = await linearGraphQL(
      `query Issues($filter: IssueFilter, $first: Int) {
        issues(filter: $filter, first: $first) {
          nodes {
            id
            identifier
            title
            description
            priority
            priorityLabel
            state { name type }
            assignee { name }
            project { name }
            labels { nodes { name } }
            dueDate
            createdAt
            updatedAt
            url
          }
        }
      }`,
      { filter, first: limit },
    )
    const result = data as { issues?: { nodes: unknown[] } }
    return JSON.stringify(result?.issues?.nodes ?? data)
  }

  if (name === 'create_linear_issue') {
    const issueInput: Record<string, unknown> = {
      title: input.title,
      teamId: input.teamId,
    }
    if (input.description !== undefined) issueInput.description = input.description
    if (input.projectId !== undefined) issueInput.projectId = input.projectId
    if (input.assigneeId !== undefined) issueInput.assigneeId = input.assigneeId
    if (input.priority !== undefined) issueInput.priority = input.priority
    if (input.labelIds !== undefined) issueInput.labelIds = input.labelIds
    if (input.dueDate !== undefined) issueInput.dueDate = input.dueDate
    if (input.stateId !== undefined) issueInput.stateId = input.stateId

    const data = await linearGraphQL(
      `mutation IssueCreate($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            url
            state { name }
            project { name }
          }
        }
      }`,
      { input: issueInput },
    )
    const result = data as { issueCreate?: unknown }
    return JSON.stringify(result?.issueCreate ?? data)
  }

  if (name === 'update_linear_issue') {
    const issueId = input.issueId as string
    const updateInput: Record<string, unknown> = {}
    if (input.title !== undefined) updateInput.title = input.title
    if (input.description !== undefined) updateInput.description = input.description
    if (input.stateId !== undefined) updateInput.stateId = input.stateId
    if (input.assigneeId !== undefined) updateInput.assigneeId = input.assigneeId
    if (input.priority !== undefined) updateInput.priority = input.priority
    if (input.projectId !== undefined) updateInput.projectId = input.projectId
    if (input.labelIds !== undefined) updateInput.labelIds = input.labelIds
    if (input.dueDate !== undefined) updateInput.dueDate = input.dueDate

    const data = await linearGraphQL(
      `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue {
            id
            identifier
            title
            url
            state { name }
          }
        }
      }`,
      { id: issueId, input: updateInput },
    )
    const result = data as { issueUpdate?: unknown }
    return JSON.stringify(result?.issueUpdate ?? data)
  }

  if (name === 'list_linear_projects') {
    const state = input.state as string | undefined
    const limit = (input.limit as number) ?? 20
    const filter: Record<string, unknown> = {}
    if (state) filter.state = { eq: state }

    const data = await linearGraphQL(
      `query Projects($filter: ProjectFilter, $first: Int) {
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
            lead { name }
            teams { nodes { name } }
            issues {
              nodes {
                id
                identifier
                title
                state { name type }
              }
            }
          }
        }
      }`,
      { filter, first: limit },
    )
    const result = data as { projects?: { nodes: unknown[] } }
    return JSON.stringify(result?.projects?.nodes ?? data)
  }

  if (name === 'create_linear_project') {
    const projectInput: Record<string, unknown> = {
      name: input.name,
      teamIds: input.teamIds,
    }
    if (input.description !== undefined) projectInput.description = input.description
    if (input.state !== undefined) projectInput.state = input.state
    if (input.startDate !== undefined) projectInput.startDate = input.startDate
    if (input.targetDate !== undefined) projectInput.targetDate = input.targetDate
    if (input.leadId !== undefined) projectInput.leadId = input.leadId

    const data = await linearGraphQL(
      `mutation ProjectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          success
          project {
            id
            name
            url
            state
          }
        }
      }`,
      { input: projectInput },
    )
    const result = data as { projectCreate?: unknown }
    return JSON.stringify(result?.projectCreate ?? data)
  }

  if (name === 'add_linear_comment') {
    const data = await linearGraphQL(
      `mutation CommentCreate($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
          comment {
            id
            body
            createdAt
            url
          }
        }
      }`,
      { input: { issueId: input.issueId, body: input.body } },
    )
    const result = data as { commentCreate?: unknown }
    return JSON.stringify(result?.commentCreate ?? data)
  }

  if (name === 'list_linear_workflow_states') {
    const teamId = input.teamId as string
    const data = await linearGraphQL(
      `query WorkflowStates($filter: WorkflowStateFilter) {
        workflowStates(filter: $filter) {
          nodes {
            id
            name
            type
            position
            team { name }
          }
        }
      }`,
      { filter: { team: { id: { eq: teamId } } } },
    )
    const result = data as { workflowStates?: { nodes: unknown[] } }
    return JSON.stringify(result?.workflowStates?.nodes ?? data)
  }

  if (name === 'list_linear_labels') {
    const limit = (input.limit as number) ?? 50
    const data = await linearGraphQL(
      `query Labels($first: Int) {
        issueLabels(first: $first) {
          nodes {
            id
            name
            color
            description
          }
        }
      }`,
      { first: limit },
    )
    const result = data as { issueLabels?: { nodes: unknown[] } }
    return JSON.stringify(result?.issueLabels?.nodes ?? data)
  }

  return `Unknown Linear tool: ${name}`
}

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

const tools: Anthropic.Tool[] = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- web_search_20250305 is not a literal in the SDK's Tool union type
  { type: 'web_search_20250305', name: 'web_search' } as any,
  {
    name: 'read_github_file',
    description:
      'Read the contents of a file from the DevOpsKev/kevin-ryan-platform GitHub repository',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description:
            'File path in the repository e.g. .sdd/specification/spec-0009-hq-nextjs-auth0.md',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_github_directory',
    description:
      'List files in a directory of the DevOpsKev/kevin-ryan-platform GitHub repository',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description:
            'Directory path e.g. .sdd/specification or k8s/hq-kevinryan-io',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_github_prs',
    description:
      'List open pull requests on the DevOpsKev/kevin-ryan-platform repository',
    input_schema: {
      type: 'object' as const,
      properties: {
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'PR state filter',
        },
      },
      required: [],
    },
  },
  {
    name: 'list_workflow_runs',
    description:
      'List recent GitHub Actions workflow runs for DevOpsKev/kevin-ryan-platform',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of runs to return, default 10',
        },
      },
      required: [],
    },
  },
  {
    name: 'create_github_branch',
    description:
      'Create a new branch in the DevOpsKev/kevin-ryan-platform repository from main. Branch name must start with "hq-".',
    input_schema: {
      type: 'object' as const,
      properties: {
        branchName: {
          type: 'string',
          description: 'Branch name — must start with "hq-", e.g. hq-my-feature',
        },
      },
      required: ['branchName'],
    },
  },
  {
    name: 'create_github_file',
    description:
      'Create or update a file in the DevOpsKev/kevin-ryan-platform repository on a given branch',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'File path in the repository e.g. config/hq-system-prompt.md',
        },
        content: {
          type: 'string',
          description: 'Full text content of the file',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        branch: {
          type: 'string',
          description: 'Branch to commit to, e.g. hq-my-feature',
        },
      },
      required: ['path', 'content', 'message', 'branch'],
    },
  },
  {
    name: 'create_github_pull_request',
    description:
      'Create a pull request in the DevOpsKev/kevin-ryan-platform repository',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'PR title',
        },
        body: {
          type: 'string',
          description: 'PR description / body',
        },
        head: {
          type: 'string',
          description: 'Source branch name, e.g. hq-my-feature',
        },
        base: {
          type: 'string',
          description: 'Target branch, defaults to "main"',
        },
      },
      required: ['title', 'body', 'head'],
    },
  },
  {
    name: 'add_pr_comment',
    description:
      'Add a comment to an existing pull request in the DevOpsKev/kevin-ryan-platform repository',
    input_schema: {
      type: 'object' as const,
      properties: {
        prNumber: {
          type: 'number',
          description: 'Pull request number',
        },
        body: {
          type: 'string',
          description: 'Comment body (markdown supported)',
        },
      },
      required: ['prNumber', 'body'],
    },
  },
  {
    name: 'list_linear_teams',
    description:
      'List all teams in the Linear workspace. Returns team IDs, names, keys, and descriptions. Use this to discover team IDs needed for creating issues and projects.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'search_linear_issues',
    description:
      'Search and filter issues in Linear. Can search by text query, or filter by team, project, state type, assignee, or label. Returns issue details including identifier, title, state, assignee, project, labels, due date, and URL.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Text search term' },
        teamId: { type: 'string', description: 'Filter by team ID' },
        projectId: { type: 'string', description: 'Filter by project ID' },
        stateType: {
          type: 'string',
          enum: ['backlog', 'unstarted', 'started', 'completed', 'cancelled'],
          description: 'Filter by state type',
        },
        assigneeId: { type: 'string', description: 'Filter by assignee ID' },
        labelName: { type: 'string', description: 'Filter by label name' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
      required: [],
    },
  },
  {
    name: 'create_linear_issue',
    description:
      'Create a new issue in Linear. Requires a title and team ID. Optionally set description, project, assignee, priority (0=none, 1=urgent, 2=high, 3=medium, 4=low), labels, due date, and initial state.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Issue title' },
        teamId: { type: 'string', description: 'Team ID to create issue in' },
        description: { type: 'string', description: 'Markdown description' },
        projectId: { type: 'string', description: 'Project ID to associate with' },
        assigneeId: { type: 'string', description: 'User ID to assign to' },
        priority: {
          type: 'number',
          description: 'Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low',
        },
        labelIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Label IDs to apply',
        },
        dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
        stateId: { type: 'string', description: 'Workflow state ID' },
      },
      required: ['title', 'teamId'],
    },
  },
  {
    name: 'update_linear_issue',
    description:
      'Update an existing Linear issue. The issueId can be the UUID or the short identifier like KRA-123. Any provided field will be updated; omitted fields remain unchanged.',
    input_schema: {
      type: 'object' as const,
      properties: {
        issueId: { type: 'string', description: 'Issue ID or identifier (e.g. KRA-123)' },
        title: { type: 'string', description: 'New title' },
        description: { type: 'string', description: 'New description' },
        stateId: { type: 'string', description: 'New state ID' },
        assigneeId: { type: 'string', description: 'New assignee ID' },
        priority: {
          type: 'number',
          description: 'New priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low',
        },
        projectId: { type: 'string', description: 'Move to project ID' },
        labelIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Replace labels with these IDs',
        },
        dueDate: { type: 'string', description: 'New due date (YYYY-MM-DD)' },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'list_linear_projects',
    description:
      'List projects in Linear. Optionally filter by project state (planned, started, paused, completed, cancelled). Returns project details including progress, dates, lead, associated teams, and issues.',
    input_schema: {
      type: 'object' as const,
      properties: {
        state: {
          type: 'string',
          enum: ['planned', 'started', 'paused', 'completed', 'cancelled'],
          description: 'Filter by project state',
        },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
      required: [],
    },
  },
  {
    name: 'create_linear_project',
    description:
      'Create a new project in Linear. Requires a name and at least one team ID. Optionally set description, initial state, start/target dates, and project lead.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Project name' },
        teamIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Team IDs to associate with',
        },
        description: { type: 'string', description: 'Markdown description' },
        state: { type: 'string', description: 'Initial state (defaults to planned)' },
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        targetDate: { type: 'string', description: 'Target date (YYYY-MM-DD)' },
        leadId: { type: 'string', description: 'Project lead user ID' },
      },
      required: ['name', 'teamIds'],
    },
  },
  {
    name: 'add_linear_comment',
    description:
      'Add a comment to a Linear issue. The comment body supports markdown formatting.',
    input_schema: {
      type: 'object' as const,
      properties: {
        issueId: { type: 'string', description: 'Issue ID' },
        body: { type: 'string', description: 'Markdown comment body' },
      },
      required: ['issueId', 'body'],
    },
  },
  {
    name: 'list_linear_workflow_states',
    description:
      'List workflow states (statuses) for a Linear team. Use this to discover valid state IDs for creating or updating issues. States are categorised as: backlog, unstarted, started, completed, cancelled.',
    input_schema: {
      type: 'object' as const,
      properties: {
        teamId: { type: 'string', description: 'Team ID' },
      },
      required: ['teamId'],
    },
  },
  {
    name: 'list_linear_labels',
    description:
      'List issue labels in the Linear workspace. Use this to discover valid label IDs for creating or updating issues.',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
      required: [],
    },
  },
]

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
  const systemPrompt = redacted ? REDACTED_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT

  const conversationMessages: Anthropic.MessageParam[] = messages.map(
    ({ role, content }) => ({ role, content }),
  )

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let keepalive: ReturnType<typeof setInterval> | undefined
      try {
        while (true) {
          const stream = client.messages.stream({
            model: 'claude-opus-4-6',
            max_tokens: 8192,
            system: systemPrompt,
            messages: conversationMessages,
            tools,
          })

          stream.on('text', (text) => {
            controller.enqueue(encoder.encode(text))
          })

          const finalMessage = await stream.finalMessage()

          if (finalMessage.stop_reason !== 'tool_use') {
            break
          }

          const toolUseBlocks = finalMessage.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
          )

          conversationMessages.push({
            role: 'assistant',
            content: finalMessage.content,
          })

          keepalive = setInterval(() => {
            controller.enqueue(encoder.encode(' '))
          }, 15000)

          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const toolUse of toolUseBlocks) {
            const result = linearToolNames.has(toolUse.name)
              ? await executeLinearTool(
                  toolUse.name,
                  toolUse.input as Record<string, unknown>,
                )
              : await executeGitHubTool(
                  toolUse.name,
                  toolUse.input as Record<string, unknown>,
                )
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: result,
            })
          }

          clearInterval(keepalive)
          keepalive = undefined

          conversationMessages.push({ role: 'user', content: toolResults })
        }
      } catch (err: unknown) {
        clearInterval(keepalive)
        console.error('[HQ] Stream error:', err)
        const message = err instanceof Error ? err.message : 'Unknown error occurred'
        controller.enqueue(encoder.encode(`[HQ_ERROR] ${message}`))
      } finally {
        clearInterval(keepalive)
        controller.close()
      }
    },
  })

  const responseHeaders: Record<string, string> = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
  }

  if (redacted) {
    responseHeaders['X-HQ-Redacted'] = 'true'
  }

  return new Response(readable, { headers: responseHeaders })
}