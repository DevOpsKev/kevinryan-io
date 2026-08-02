import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const DELIVERABLES = [
  { n: '01', title: 'EXECUTIVE REPORT', text: '10–15 page report for leadership: current state, key findings, prioritised recommendations, and the business case for investment.' },
  { n: '02', title: 'CAPABILITY RADAR', text: 'Visual representation of capability maturity across all seven dimensions, mapped to DORA team archetypes.' },
  { n: '03', title: 'VALUE STREAM MAP', text: 'Current-state and future-state maps with process time, wait time, and flow efficiency for each step.' },
  { n: '04', title: 'SKILLS GAP ANALYSIS', text: 'Team skills heatmap with identified capability gaps and recommended training priorities.' },
  { n: '05', title: 'SPEC QUALITY ASSESSMENT', text: 'Maturity assessment of how work is specified and communicated to AI tools, with SDD-informed recommendations.' },
  { n: '06', title: 'IMPROVEMENT BACKLOG', text: 'Impact/effort mapped initiatives with owners, success criteria, and a committed first step.' },
  { n: '07', title: 'METRICS PLAYBOOK', text: 'Leading and lagging indicators, collection methods, target cadence, ownership, and baseline values.' },
  { n: '08', title: '90-DAY CHECK-IN', text: 'A follow-up review to evaluate progress on committed actions and recalibrate priorities.' },
]

export default function AssessmentDeliverables() {
  return (
    <section className="section" id="deliverables" data-accent="green">
      <Container>
        <SectionHeader
          subtitle="04 · Deliverables"
          title="WHAT YOU GET."
          lead="Every assessment produces a set of actionable deliverables. This is a roadmap, not a slide deck."
        />

        <div className="cells cells--4">
          {DELIVERABLES.map((d) => (
            <div className="cell" key={d.title}>
              <span className="cell__n">{d.n}</span>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
