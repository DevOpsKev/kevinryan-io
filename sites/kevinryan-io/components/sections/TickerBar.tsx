const TICKER_ITEMS = [
  "Systems Thinking", "AI-Native Engineering", "Platform Engineering", "Spec Driven Development",
  "Agent Orchestration", "Deterministic Automation", "Enterprise Delivery", "Cloud-Native Architecture",
  "CI/CD", "Kubernetes",
]

export default function TickerBar() {
  return (
    <div className="ticker">
      <div className="ticker__track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="ticker__item">{item}</span>
        ))}
      </div>
    </div>
  )
}
