'use client'

interface ChatInputProps {
  input: string
  loading: boolean
  onChange: (value: string) => void
  onSend: (text: string) => void
}

export default function ChatInput({
  input,
  loading,
  onChange,
  onSend,
}: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(input)
    }
  }

  return (
    <div
      style={{
        padding: '1rem 2rem',
        borderTop: '1px solid #1a1a1a',
        backgroundColor: '#0A0A0A',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="ask HQ anything"
          rows={3}
          style={{
            flex: 1,
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            color: '#F5F3EF',
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.9375rem',
            padding: '0.75rem 1rem',
            resize: 'none',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#A8E10C'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#333'
          }}
        />
        <button
          onClick={() => onSend(input)}
          disabled={loading || !input.trim()}
          style={{
            backgroundColor: loading || !input.trim() ? '#333' : '#A8E10C',
            border: 'none',
            padding: '0 1.25rem',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            color: '#0A0A0A',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
