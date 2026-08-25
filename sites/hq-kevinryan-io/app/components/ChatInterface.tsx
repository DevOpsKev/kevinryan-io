'use client'

import { useEffect, useRef, useState } from 'react'

import type { Message, User } from '@/lib/types'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import EmptyState from './EmptyState'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface ChatInterfaceProps {
  user: User
  authDisabled?: boolean
}

let messageSeq = 0
function nextId(): string {
  messageSeq += 1
  return `msg-${messageSeq}`
}

export default function ChatInterface({ user, authDisabled }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMessage: Message = { id: nextId(), role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok || !res.body) {
        let errorDetail = `${res.status} ${res.statusText}`
        try {
          const contentType = res.headers.get('content-type') ?? ''
          if (contentType.includes('application/json')) {
            const errorJson = await res.json()
            errorDetail = errorJson.error ?? errorDetail
          } else if (contentType.includes('text/plain')) {
            const errorText = await res.text()
            if (errorText.length > 0 && errorText.length < 500) {
              errorDetail = errorText
            }
          }
        } catch {
          // If we can't parse the error body, fall back to status code
        }
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            content: `⚠️ Error: ${errorDetail}`,
          },
        ])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = {
              ...last,
              content: last.content + chunk,
            }
          } else {
            next.push({ id: nextId(), role: 'assistant', content: chunk })
          }
          return next
        })
      }

      // Detect [HQ_ERROR] sentinel in streamed content
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant' && last.content.includes('[HQ_ERROR] ')) {
          const errorStart = last.content.indexOf('[HQ_ERROR] ')
          const errorMessage = last.content.substring(errorStart + '[HQ_ERROR] '.length)
          next[next.length - 1] = {
            ...last,
            content: `⚠️ Error: ${errorMessage}`,
          }
        }
        return next
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error'
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: `⚠️ Connection error: ${message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <ChatHeader user={user} authDisabled={authDisabled} />

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
              />
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <TypingIndicator />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </main>

      <ChatInput
        input={input}
        loading={loading}
        onChange={setInput}
        onSend={(text) => void sendMessage(text)}
      />

      <footer className="flex items-center justify-end border-t border-panel px-8 py-2">
        <span className="font-mono text-[0.6875rem] tracking-[0.05em] text-accent">
          build: {commitSha}
        </span>
      </footer>
    </div>
  )
}
