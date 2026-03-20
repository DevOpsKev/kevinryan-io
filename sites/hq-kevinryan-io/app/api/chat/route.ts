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

  const conversationMessages: Anthropic.MessageParam[] = [...messages]

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
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

          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const toolUse of toolUseBlocks) {
            const result = await executeGitHubTool(
              toolUse.name,
              toolUse.input as Record<string, unknown>,
            )
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: result,
            })
          }

          conversationMessages.push({ role: 'user', content: toolResults })
        }
      } catch (err: unknown) {
        console.error('[HQ] Stream error:', err)
        const message = err instanceof Error ? err.message : 'Unknown error occurred'
        controller.enqueue(encoder.encode(`[HQ_ERROR] ${message}`))
      } finally {
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