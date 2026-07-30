import Container from '@/components/Container'

const STATS = [
  { number: '90%', label: 'Of professionals using AI at work' },
  { number: '~5K', label: 'Professionals surveyed by DORA' },
  { number: '7', label: "Capabilities proven to amplify AI's impact" },
  { number: '19%', label: 'Slower — devs using AI on own codebases (METR RCT)' },
]

export default function AssessmentProblem() {
  return (
    <section className="section section--dark">
      <Container>
        <div className="section-number">01</div>
        <div className="section-label">The Problem</div>
        <h2>YOU BOUGHT THE TOOLS. WHERE ARE THE RESULTS?</h2>
        <p className="subtitle">
          90% of technology professionals now use AI at work. Most organisations have invested in licences. But DORA&rsquo;s 2025 research — based on nearly 5,000 professionals — reveals a critical truth: AI adoption alone has only a modest impact on performance. Without the right foundations, you&rsquo;re amplifying dysfunction, not delivery.
        </p>
        <div className="stat-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="thesis-block thesis-block--dark">
          <p>AI is an amplifier. It magnifies the strengths of high-performing organisations and the dysfunctions of struggling ones. The greatest returns come not from the tools themselves, but from investing in the foundational systems that enable success.</p>
          <div className="source">— DORA State of AI-assisted Software Development, 2025</div>
        </div>
      </Container>
    </section>
  )
}