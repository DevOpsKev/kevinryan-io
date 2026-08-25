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
    <div className="border-t border-line bg-bg px-8 py-4">
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="ask HQ anything"
          rows={3}
          className="flex-1 resize-none rounded-none border border-line-3 bg-panel-2 px-4 py-3 font-body text-[0.9375rem] text-ink outline-none focus:border-accent"
        />
        <button
          onClick={() => onSend(input)}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="cursor-pointer border-none bg-accent px-5 text-xl font-bold text-bg disabled:cursor-not-allowed disabled:bg-line-3"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
