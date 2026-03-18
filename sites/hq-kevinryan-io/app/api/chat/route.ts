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

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, demoMode }: { messages: Message[]; demoMode: boolean } =
    await request.json()
  const systemPrompt = demoMode ? DEMO_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SDK types lag behind beta API: mcp_servers + web_search tool
  const stream = await client.beta.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages,
    mcp_servers: [
      {
        type: 'url',
        url: 'https://mcp.github.com/sse',
        name: 'github',
        authorization_token: process.env.GITHUB_MCP_TOKEN,
      },
    ],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      },
      {
        type: 'mcp_toolset',
        mcp_server_name: 'github',
      },
    ] as any,
    betas: ['mcp-client-2025-11-20'],
  } as any)

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
