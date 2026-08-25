'use client'

export default function TypingIndicator() {
  return (
    <div className="mb-3 flex justify-start">
      <div className="max-w-[75%]">
        <div className="mb-1 font-display text-xs tracking-[0.05em] text-accent">
          HQ
        </div>
        <div className="flex items-center gap-[0.3rem] border border-line-2 bg-panel px-4 py-3">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
