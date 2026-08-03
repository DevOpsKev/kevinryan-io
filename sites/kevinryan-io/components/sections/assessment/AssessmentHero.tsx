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
          {/* The eyebrow carries the entry-point signal, which leaves the
              headline free to stay the product name. A verb phrase at
              display size reads as marketing rather than as a named offer. */}
          <div>
            <span className="sec-mark">Where engagements start</span>
            <h2 className="t-h1" style={{ maxWidth: '16ch' }}>AI-Native Readiness Assessment</h2>
            <p className="t-lead" style={{ maxWidth: '62ch', margin: 'var(--sp-3) 0 var(--sp-5)' }}>
              Three to five weeks. A baseline you can act on, and no commitment beyond it.
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
