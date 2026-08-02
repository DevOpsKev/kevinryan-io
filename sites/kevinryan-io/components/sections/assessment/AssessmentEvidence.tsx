import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const EVIDENCE = [
  { number: '~5,000', desc: 'Technology professionals surveyed', source: 'DORA 2025', feature: false },
  { number: '100+', desc: 'Hours of qualitative research data', source: 'DORA 2025', feature: false },
  { number: '7', desc: 'Validated AI capabilities', source: 'DORA AI Capabilities Model', feature: false },
  { number: 'SDD', desc: 'Spec-Driven Development referenced as an emerging methodology in the DORA AI Capabilities Model', source: 'DORA AI Capabilities Model, p.55', feature: true },
]

export default function AssessmentEvidence() {
  return (
    <section className="section" id="evidence" data-accent="yellow">
      <Container>
        <SectionHeader
          subtitle="06 · Evidence Base"
          title="RESEARCH-BACKED. NOT OPINION-BASED."
          lead="This assessment is grounded in the 2025 DORA AI Capabilities Model — the most comprehensive study of AI in software development to date. Every capability, every outcome measure, every team archetype is validated through rigorous research."
        />

        <div className="cells cells--4">
          {EVIDENCE.map((e) => (
            <div className={`cell${e.feature ? ' cell--feature' : ''}`} key={e.desc}>
              <span className="cell__stat">{e.number}</span>
              <span className="cell__cap">{e.desc}</span>
              <span className="cell__grow" />
              <div className="cell__foot">{e.source}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--sp-6)' }}>
          <a href="/contact" className="btn btn--primary">Book a Discovery Call</a>
        </div>
      </Container>
    </section>
  )
}
