'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import type { Message } from '../types/chat'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ maxWidth: '75%' }}>
        {!isUser && (
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
        )}
        <div
          style={{
            backgroundColor: isUser ? '#1a2a05' : '#111111',
            border: `1px solid ${isUser ? '#A8E10C' : '#222222'}`,
            padding: '0.75rem 1rem',
            color: '#F5F3EF',
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}
          className={isUser ? undefined : 'hq-markdown'}
        >
          {isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
