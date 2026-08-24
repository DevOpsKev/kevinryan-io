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

const client = new Anthropic()

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let messages: Message[]
  try {
    const body = await request.json()
    messages = body.messages
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const conversationMessages: Anthropic.MessageParam[] = messages.map(
    ({ role, content }) => ({ role, content }),
  )

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        const stream = client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 8192,
          system: BASE_SYSTEM_PROMPT,
          messages: conversationMessages,
        })

        stream.on('text', (text) => {
          controller.enqueue(encoder.encode(text))
        })

        await stream.finalMessage()
      } catch (err: unknown) {
        console.error('[HQ] Stream error:', err)
        const message = err instanceof Error ? err.message : 'Unknown error occurred'
        controller.enqueue(encoder.encode(`[HQ_ERROR] ${message}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
