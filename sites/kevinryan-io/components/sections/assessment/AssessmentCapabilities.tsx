import Container from '@/components/Container'

const CAPS = [
  { title: 'CLEAR & COMMUNICATED AI STANCE', text: 'Ambiguity creates risk. A clear policy provides the psychological safety needed for effective experimentation.', outcome: '→ Individual effectiveness · Org performance · Throughput' },
  { title: 'HEALTHY DATA ECOSYSTEMS', text: 'The benefits of AI are significantly amplified by high-quality, accessible, and unified internal data.', outcome: '→ Organisational performance' },
  { title: 'AI-ACCESSIBLE INTERNAL DATA', text: 'Connecting AI to your internal documentation and codebases moves it from a generic assistant to a specialised expert.', outcome: '→ Individual effectiveness · Code quality' },
  { title: 'STRONG VERSION CONTROL PRACTICES', text: 'As AI increases the velocity of change, version control becomes the critical safety net that enables confident experimentation.', outcome: '→ Individual effectiveness · Team performance' },
  { title: 'WORKING IN SMALL BATCHES', text: 'This discipline counteracts the risk of AI generating large, unstable changes, ensuring that speed translates to better product performance.', outcome: '→ Product performance · Reduced friction' },
  { title: 'USER-CENTRIC FOCUS', text: 'A focus on user needs ensures AI-accelerated teams are moving quickly in the right direction. Without it, AI adoption actively harms team performance.', outcome: '→ Team performance (positive and negative)' },
  { title: 'QUALITY INTERNAL PLATFORMS', text: 'A platform provides the automated, secure pathways that allow AI’s benefits to scale across the organisation.', outcome: '→ Organisational performance' },
]

export default function AssessmentCapabilities() {
  return (
    <section className="section">
      <Container>
        <div className="section-number">02</div>
        <div className="section-label">The Seven Capabilities</div>
        <h2>WHAT WE ASSESS.</h2>
        <p className="subtitle">
          The assessment evaluates your organisation against the seven foundational capabilities identified by DORA&rsquo;s research as proven amplifiers of AI&rsquo;s positive impact on performance.
        </p>
        <div className="cap-grid">
          {CAPS.map((c) => (
            <div key={c.title} className="cap-card">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <div className="cap-outcome">{c.outcome}</div>
            </div>
          ))}
          <div className="cap-card cap-card--feature">
            <div>
              <h3>+ SPECIFICATION QUALITY</h3>
              <p>DORA identifies the gap. SDD fills it. Specification quality is the shifted bottleneck in AI-native development — AI can only be as good as the spec it receives.</p>
              <div className="cap-outcome">→ The Kevin Ryan &amp; Associates differentiator</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}