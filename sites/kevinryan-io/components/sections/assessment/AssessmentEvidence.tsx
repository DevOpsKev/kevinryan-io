import Container from '@/components/Container'

const EVIDENCE = [
  { number: '~5,000', desc: 'Technology professionals surveyed', source: 'DORA 2025' },
  { number: '100+', desc: 'Hours of qualitative research data', source: 'DORA 2025' },
  { number: '7', desc: 'Validated AI capabilities', source: 'DORA AI Capabilities Model' },
  { number: 'SDD', desc: 'Spec-Driven Development referenced as an emerging methodology in the DORA AI Capabilities Model', source: 'DORA AI Capabilities Model, p.55' },
]

export default function AssessmentEvidence() {
  return (
    <section className="section section--grey">
      <Container>
        <div className="section-number">06</div>
        <div className="section-label">Evidence Base</div>
        <h2>RESEARCH-BACKED. NOT OPINION-BASED.</h2>
        <p className="subtitle" style={{ marginBottom: '1rem' }}>
          This assessment is grounded in the 2025 DORA AI Capabilities Model — the most comprehensive study of AI in software development to date. Every capability, every outcome measure, every team archetype is validated through rigorous research.
        </p>
        <div className="evidence-grid">
          {EVIDENCE.map((e) => (
            <div key={e.desc} className="evidence-item">
              <div className="evidence-number">{e.number}</div>
              <div className="evidence-desc">{e.desc}</div>
              <div className="evidence-source">{e.source}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}