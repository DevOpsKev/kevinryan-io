import Container from '@/components/Container'

const DELIVERABLES = [
  { title: 'EXECUTIVE REPORT', text: '10–15 page report for leadership: current state, key findings, prioritised recommendations, and the business case for investment.' },
  { title: 'CAPABILITY RADAR', text: 'Visual representation of capability maturity across all seven dimensions, mapped to DORA team archetypes.' },
  { title: 'VALUE STREAM MAP', text: 'Current-state and future-state maps with process time, wait time, and flow efficiency for each step.' },
  { title: 'SKILLS GAP ANALYSIS', text: 'Team skills heatmap with identified capability gaps and recommended training priorities.' },
  { title: 'SPEC QUALITY ASSESSMENT', text: 'Maturity assessment of how work is specified and communicated to AI tools, with SDD-informed recommendations.' },
  { title: 'IMPROVEMENT BACKLOG', text: 'Impact/effort mapped initiatives with owners, success criteria, and a committed first step.' },
  { title: 'METRICS PLAYBOOK', text: 'Leading and lagging indicators, collection methods, target cadence, ownership, and baseline values.' },
  { title: '90-DAY CHECK-IN', text: 'A follow-up review to evaluate progress on committed actions and recalibrate priorities.' },
]

export default function AssessmentDeliverables() {
  return (
    <section className="section section--dark">
      <Container>
        <div className="section-number">04</div>
        <div className="section-label">Deliverables</div>
        <h2>WHAT YOU GET.</h2>
        <p className="subtitle">Every assessment produces a set of actionable deliverables. This is a roadmap, not a slide deck.</p>
        <div className="deliverables-grid">
          {DELIVERABLES.map((d) => (
            <div key={d.title} className="deliverable-item">
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}