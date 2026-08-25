'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import type { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[75%]">
        {!isUser && (
          <div className="mb-1 font-display text-xs tracking-[0.05em] text-accent">
            HQ
          </div>
        )}
        <div
          className={`px-4 py-3 font-body text-[0.9375rem] leading-[1.6] break-words text-ink ${
            isUser
              ? 'border border-accent bg-user-bubble'
              : 'border border-line-2 bg-panel'
          } ${isUser ? '' : 'hq-markdown'}`}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
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
