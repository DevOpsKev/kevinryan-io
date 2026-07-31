import Container from '@/components/Container'

const PHASES = [
  { number: '01', title: 'DIAGNOSE', desc: 'Capability survey across all seven DORA dimensions. Stakeholder interviews. Team skills self-assessment sessions. Map your team archetype.', output: 'Output: Capability radar · Team archetype · Skills heatmap' },
  { number: '02', title: 'LOCATE', desc: 'Value stream mapping workshop. Identify where work is waiting, not working. Specification quality audit. Find the real bottlenecks.', output: 'Output: Annotated VSM · Flow metrics · Spec maturity assessment' },
  { number: '03', title: 'PRIORITISE', desc: 'Facilitated team workshop. Impact/effort mapping. Ruthless prioritisation. Commit to a first step with ownership and success criteria.', output: 'Output: Prioritised backlog · Committed first action' },
  { number: '04', title: 'MEASURE', desc: 'Define leading indicators (capability maturity) and lagging indicators (DORA outcomes). Establish baselines. Build the measurement playbook.', output: 'Output: Metrics playbook · Baseline values · 90-day check-in' },
]

export default function AssessmentEngagement() {
  return (
    <section className="section section--sink" id="engagement" data-accent="cyan">
      <Container>
        <div className="sec-head">
          <span className="sec-mark">03 · The Engagement</span>
          <h1 className="t-h1">HOW IT WORKS.</h1>
          <p className="t-lead" style={{ maxWidth: '78ch', margin: 'var(--sp-3) 0 0' }}>
            Four phases. Discrete deliverables at each stage. A clear narrative arc from diagnosis to action.
          </p>
        </div>

        <div className="cells cells--4">
          {PHASES.map((p) => (
            <div className="cell cell--phase" key={p.number}>
              <span className="cell__n">{p.number}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="cell__grow" />
              <div className="cell__foot">{p.output}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
