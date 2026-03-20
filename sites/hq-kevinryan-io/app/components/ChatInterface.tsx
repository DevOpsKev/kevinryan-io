'use client'

import { useEffect, useRef, useState } from 'react'

import type { Message, Segment } from '../types/chat'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'

interface User {
  picture?: string
  nickname?: string
  name?: string
}

interface ChatInterfaceProps {
  user: User
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [redacted, setRedacted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMessage: Message = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, redacted }),
      })

      if (!res.ok || !res.body) {
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = {
            role: 'assistant',
            content: 'Error: failed to get response.',
          }
          return next
        })
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
              role: 'assistant',
              content: last.content + chunk,
            }
          } else {
            next.push({ role: 'assistant', content: chunk })
          }
          return next
        })
      }

      if (redacted) {
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            try {
              // Strip markdown code fences if Claude wrapped the JSON
              let rawContent = last.content
              const fenceMatch = rawContent.match(
                /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/,
              )
              if (fenceMatch) {
                rawContent = fenceMatch[1]
              }
              const segments: Segment[] = JSON.parse(rawContent)
              if (
                Array.isArray(segments) &&
                segments.every(
                  (s) =>
                    typeof s.text === 'string' &&
                    typeof s.sensitive === 'boolean',
                )
              ) {
                next[next.length - 1] = {
                  ...last,
                  segments,
                  content: segments.map((s) => s.text).join(' '),
                }
              }
            } catch {
              console.warn(
                '[HQ] Failed to parse redacted response as JSON, falling back to blanket blur',
              )
            }
          }
          return next
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        color: '#F5F3EF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ChatHeader
        user={user}
        redacted={redacted}
        onRedactedChange={setRedacted}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        {messages.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40vh',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.875rem',
                color: '#F5F3EF33',
                letterSpacing: '0.05em',
              }}
            >
              ask HQ anything
            </span>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                redacted={redacted}
                isStreaming={
                  loading &&
                  i === messages.length - 1 &&
                  msg.role === 'assistant'
                }
              />
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ maxWidth: '75%' }}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '0.75rem',
                      color: '#A8E10C',
                      marginBottom: '0.25rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    HQ
                  </div>
                  <div
                    style={{
                      backgroundColor: '#111111',
                      border: '1px solid #222222',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      gap: '0.3rem',
                      alignItems: 'center',
                    }}
                  >
                    <span className="typing-dot" />
                    <span
                      className="typing-dot"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="typing-dot"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </main>

      <ChatInput
        input={input}
        loading={loading}
        redacted={redacted}
        onChange={setInput}
        onSend={(text) => void sendMessage(text)}
      />

      <footer
        style={{
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderTop: '1px solid #111',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6875rem',
            color: '#A8E10C',
            letterSpacing: '0.05em',
          }}
        >
          build: {commitSha}
        </span>
      </footer>
    </div>
  )
}
