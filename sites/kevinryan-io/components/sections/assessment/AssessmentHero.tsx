import Container from '@/components/Container'

const META = [
  { label: 'Framework', value: 'DORA AI Capabilities Model' },
  { label: 'Duration', value: '3–5 Weeks' },
  { label: 'Delivery', value: 'Remote or On-Site' },
  { label: 'Audience', value: 'Engineering Leaders' },
]

export default function AssessmentHero() {
  return (
    <section className="section hero">
      <Container>
        <div className="section-label">Kevin Ryan &amp; Associates</div>
        <h1>AI-NATIVE READINESS ASSESSMENT</h1>
        <p className="subtitle">
          A structured diagnostic that evaluates your organisation&rsquo;s capacity to realise measurable value from AI-assisted software development. Based on the DORA AI Capabilities Model. Enhanced with Spec-Driven Development methodology.
        </p>
        <a href="#contact" className="hero-cta">Book a Discovery Call</a>
        <div className="hero-meta">
          {META.map((m) => (
            <div key={m.label} className="hero-meta-item">
              <span className="hero-meta-label">{m.label}</span>
              <span className="hero-meta-value">{m.value}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}