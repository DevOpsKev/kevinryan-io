'use client'

import { useEffect, useRef, useState } from 'react'

import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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
  const [demoMode, setDemoMode] = useState(false)
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
    setMessages([...updatedMessages, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, demoMode }),
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
          next[next.length - 1] = {
            role: 'assistant',
            content: next[next.length - 1].content + chunk,
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
        demoMode={demoMode}
        onDemoModeChange={setDemoMode}
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
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}
        <div ref={bottomRef} />
      </main>

      <ChatInput
        input={input}
        loading={loading}
        demoMode={demoMode}
        onChange={setInput}
        onSend={(text) => void sendMessage(text)}
      />

      <footer
        style={{
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #111',
        }}
      >
        <a
          href="/auth/logout"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6875rem',
            color: '#F5F3EF33',
            textDecoration: 'none',
          }}
        >
          logout
        </a>
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
