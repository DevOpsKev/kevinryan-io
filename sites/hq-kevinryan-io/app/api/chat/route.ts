import Anthropic from '@anthropic-ai/sdk'

import { auth0 } from '@/lib/auth0'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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

const client = new Anthropic()

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, demoMode }: { messages: Message[]; demoMode: boolean } =
    await request.json()
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
