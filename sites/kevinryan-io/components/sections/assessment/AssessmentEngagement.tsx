import Container from '@/components/Container'

const PHASES = [
  { number: '01', title: 'DIAGNOSE', desc: 'Capability survey across all seven DORA dimensions. Stakeholder interviews. Team skills self-assessment sessions. Map your team archetype.', output: 'Output: Capability radar · Team archetype · Skills heatmap' },
  { number: '02', title: 'LOCATE', desc: 'Value stream mapping workshop. Identify where work is waiting, not working. Specification quality audit. Find the real bottlenecks.', output: 'Output: Annotated VSM · Flow metrics · Spec maturity assessment' },
  { number: '03', title: 'PRIORITISE', desc: 'Facilitated team workshop. Impact/effort mapping. Ruthless prioritisation. Commit to a first step with ownership and success criteria.', output: 'Output: Prioritised backlog · Committed first action' },
  { number: '04', title: 'MEASURE', desc: 'Define leading indicators (capability maturity) and lagging indicators (DORA outcomes). Establish baselines. Build the measurement playbook.', output: 'Output: Metrics playbook · Baseline values · 90-day check-in' },
]

export default function AssessmentEngagement() {
  return (
    <section className="section section--grey">
      <Container>
        <div className="section-number">03</div>
        <div className="section-label">The Engagement</div>
        <h2>HOW IT WORKS.</h2>
        <p className="subtitle mb-4">
          Four phases. Discrete deliverables at each stage. A clear narrative arc from diagnosis to action.
        </p>
        <div className="phase-grid">
          {PHASES.map((p) => (
            <div key={p.number} className="phase-card">
              <div className="phase-number">{p.number}</div>
              <div className="phase-title">{p.title}</div>
              <p className="phase-desc">{p.desc}</p>
              <div className="phase-output">{p.output}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}