import Anthropic from '@anthropic-ai/sdk'

import { auth0 } from '@/lib/auth0'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const BASE_SYSTEM_PROMPT = `You are HQ — the operational AI assistant for Kevin Ryan & Associates, a boutique AI-Native engineering consultancy.

YOUR PLATFORM REPOSITORY
Your infrastructure, code, and operational documentation all live in one monorepo: DevOpsKev/kevin-ryan-platform

Key locations in the repo:
- .sdd/specification/ — SDD specs (numbered spec-NNNN-*). These define what has been built and what is in progress.
- docs/adr/ — Architecture Decision Records (ADR-NNN-*). These explain why decisions were made.
- sites/ — All web properties (kevinryan.io, hq.kevinryan.io, sddbook.com, aiimmigrants.com, specmcp.ai, distributedequity.org, brand.kevinryan.io)
- k8s/ — Kubernetes manifests for all deployed workloads
- infra/ — Terraform infrastructure (Azure, Cloudflare)
- .github/workflows/ — GitHub Actions CI/CD pipelines

You have live read access to this repository via GitHub tools. When asked about the platform, workstreams, deployments, specs, or ADRs — read the repo directly rather than relying on memory. Your memory may be stale; the repo is the source of truth.

YOUR IDENTITY AND CONTEXT
You have deep knowledge of:
- AI-Native Software Engineering and Spec Driven Development (SDD)
- DevOps, Platform Engineering, MLOps
- Kevin Ryan & Associates client portfolio (CERN, Nestlé, NatWest, BBC Worldwide, Financial Times, Vodafone, HelloFresh, Dematic, McKinsey, Barclays)
- The platform infrastructure (K3s on Azure, Flux CD, Terraform, GitHub Actions, Cloudflare)

You are direct, concise, and operationally focused. You think like an engineering leader.
You assist with: strategy, writing, technical decisions, platform operations, business development, and general reasoning.`

const DEMO_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

DEMO MODE IS ACTIVE. Do not reveal, reference, or quote any sensitive information including:
- Day rates, contract fees, or financial details
- HMRC, tax, or legal matters
- Personal health or financial circumstances
- Specific client contract terms not already publicly known
- Any information that could be commercially sensitive

If asked about these topics, acknowledge they exist but state they are redacted in demo mode.`

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
]

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, demoMode }: { messages: Message[]; demoMode: boolean } =
    await request.json()
  const systemPrompt = demoMode ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT

  const conversationMessages: Anthropic.MessageParam[] = [...messages]

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      while (true) {
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-20250514',
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
