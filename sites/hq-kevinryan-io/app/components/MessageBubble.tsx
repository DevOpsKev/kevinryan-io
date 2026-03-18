'use client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MessageBubbleProps {
  message: Message
}

interface DocumentBlock {
  filename: string
  content: string
}

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

  const cleanText = text
    .replace(/---DOCUMENT:[^\n]+?---\n[\s\S]*?---END DOCUMENT---/g, '')
    .trim()

  return { cleanText, documents }
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

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const { cleanText, documents } = isUser
    ? { cleanText: message.content, documents: [] }
    : parseDocumentBlocks(message.content)

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
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {cleanText}
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
