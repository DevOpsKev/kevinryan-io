import Container from '@/components/Container'

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
        <div className="sec-head">
          <span className="sec-mark">06 · Evidence Base</span>
          <h1 className="t-h1">RESEARCH-BACKED. NOT OPINION-BASED.</h1>
          <p className="t-lead" style={{ maxWidth: '78ch', margin: 'var(--sp-3) 0 0' }}>
            This assessment is grounded in the 2025 DORA AI Capabilities Model — the most comprehensive study of AI in software development to date. Every capability, every outcome measure, every team archetype is validated through rigorous research.
          </p>
        </div>

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
      </Container>
    </section>
  )
}
