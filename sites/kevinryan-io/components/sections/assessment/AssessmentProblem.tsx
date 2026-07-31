import Container from '@/components/Container'

const STATS = [
  { number: '90%', label: 'Of professionals using AI at work' },
  { number: '~5K', label: 'Professionals surveyed by DORA' },
  { number: '7', label: "Capabilities proven to amplify AI's impact" },
  { number: '19%', label: 'Slower — devs using AI on own codebases (METR RCT)' },
]

export default function AssessmentProblem() {
  return (
    <section className="section section--sink" id="problem" data-accent="red">
      <Container>
        <div className="sec-head">
          <span className="sec-mark">01 · The Problem</span>
          <h1 className="t-h1">YOU BOUGHT THE TOOLS. WHERE ARE THE RESULTS?</h1>
          <p className="t-lead" style={{ maxWidth: '78ch', margin: 'var(--sp-3) 0 0' }}>
            90% of technology professionals now use AI at work. Most organisations have invested in licences. But DORA&rsquo;s 2025 research — based on nearly 5,000 professionals — reveals a critical truth: AI adoption alone has only a modest impact on performance. Without the right foundations, you&rsquo;re amplifying dysfunction, not delivery.
          </p>
        </div>

        <div className="cells cells--4">
          {STATS.map((s) => (
            <div className="cell" key={s.label}>
              <span className="cell__stat">{s.number}</span>
              <span className="cell__cap">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="callout" style={{ marginTop: 'var(--sp-6)' }}>
          <span className="callout__label">The finding that matters</span>
          <p>AI is an amplifier. It magnifies the strengths of high-performing organisations and the dysfunctions of struggling ones. The greatest returns come not from the tools themselves, but from investing in the foundational systems that enable success.</p>
          <span className="src">— DORA State of AI-assisted Software Development, 2025</span>
        </div>
      </Container>
    </section>
  )
}
