import Container from '@/components/Container'

const META = [
  { label: 'Framework', value: 'DORA AI Capabilities Model' },
  { label: 'Duration', value: '3–5 Weeks' },
  { label: 'Delivery', value: 'Remote or On-Site' },
  { label: 'Audience', value: 'Engineering Leaders' },
]

export default function AssessmentHero() {
  return (
    <section className="section" data-accent="blue" style={{ borderTop: 0, padding: 'var(--sp-10) 0 var(--sp-8)' }}>
      <Container>
        <div className="split">
          <div>
            <span className="sec-mark">Kevin Ryan &amp; Associates</span>
            <h1 className="t-h1" style={{ maxWidth: '16ch' }}>AI-NATIVE READINESS ASSESSMENT</h1>
            <p className="t-lead" style={{ maxWidth: '62ch', margin: 'var(--sp-3) 0 var(--sp-5)' }}>
              A structured diagnostic that evaluates your organisation&rsquo;s capacity to realise measurable value from AI-assisted software development. Based on the DORA AI Capabilities Model. Enhanced with Spec-Driven Development methodology.
            </p>
            <a href="/contact" className="btn btn--primary">Book a Discovery Call</a>
          </div>

          <div className="meta-panel">
            {META.map((m) => (
              <div className="row" key={m.label}>
                <span className="k">{m.label}</span>
                <span className="v">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
