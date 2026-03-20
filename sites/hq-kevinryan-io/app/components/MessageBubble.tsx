'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import type { Message } from '../types/chat'

interface MessageBubbleProps {
  message: Message
  redacted?: boolean
  isStreaming?: boolean
}

interface DocumentBlock {
  filename: string
  content: string
}

const DOCUMENT_MARKER_REGEX =
  /---DOCUMENT:[^\n]+?---\n[\s\S]*?---END DOCUMENT---/g

function parseDocumentBlocks(text: string): {
  cleanText: string
  documents: DocumentBlock[]
} {
  const documents: DocumentBlock[] = []
  const markerRegex = /---DOCUMENT:([^\n]+?)---\n([\s\S]*?)---END DOCUMENT---/g

  let match
  while ((match = markerRegex.exec(text)) !== null) {
    documents.push({
      filename: match[1].trim(),
      content: match[2].trim(),
    })
  }

  const cleanText = text.replace(DOCUMENT_MARKER_REGEX, '').trim()

  return { cleanText, documents }
}

function stripDocumentMarkers(text: string): string {
  return text.replace(DOCUMENT_MARKER_REGEX, '').trim()
}

function downloadDocument(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function MessageBubble({
  message,
  redacted,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Extract documents from the full content (works for both segmented and plain text)
  const { cleanText, documents } = isUser
    ? { cleanText: message.content, documents: [] }
    : parseDocumentBlocks(message.content)

  // Case 2: Assistant message, redacted mode, still streaming — show placeholder
  if (!isUser && redacted && isStreaming) {
    return (
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
              color: '#F5F3EF66',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8125rem',
              fontStyle: 'italic',
              letterSpacing: '0.03em',
            }}
          >
            analysing sensitivity...
          </div>
        </div>
      </div>
    )
  }

  // Case 3: Assistant message, redacted mode, segments available — selective blur
  const hasSegments = !isUser && redacted && message.segments

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
            filter: 'none',
            userSelect: 'auto',
            transition: 'filter 0.3s ease',
          }}
          className={isUser || hasSegments ? undefined : 'hq-markdown'}
        >
          {isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{cleanText}</span>
          ) : hasSegments ? (
            <div className="hq-markdown">
              {message.segments!.map((segment, idx) => (
                <div
                  key={idx}
                  style={{
                    filter: segment.sensitive ? 'blur(5px)' : 'none',
                    userSelect: segment.sensitive ? 'none' : 'auto',
                    transition: 'filter 0.3s ease',
                    display: 'inline',
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {stripDocumentMarkers(segment.text)}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cleanText}
            </ReactMarkdown>
          )}
        </div>
        {documents.map((doc) => (
          <button
            key={doc.filename}
            onClick={() => downloadDocument(doc.filename, doc.content)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid #A8E10C',
              color: '#A8E10C',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            ↓ {doc.filename}
          </button>
        ))}
      </div>
    </div>
  )
}
