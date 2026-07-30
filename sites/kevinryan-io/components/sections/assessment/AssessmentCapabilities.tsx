import Container from '@/components/Container'

const CAPS = [
  { n: '01', title: 'CLEAR & COMMUNICATED AI STANCE', text: 'Ambiguity creates risk. A clear policy provides the psychological safety needed for effective experimentation.', outcome: '→ Individual effectiveness · Org performance · Throughput' },
  { n: '02', title: 'HEALTHY DATA ECOSYSTEMS', text: 'The benefits of AI are significantly amplified by high-quality, accessible, and unified internal data.', outcome: '→ Organisational performance' },
  { n: '03', title: 'AI-ACCESSIBLE INTERNAL DATA', text: 'Connecting AI to your internal documentation and codebases moves it from a generic assistant to a specialised expert.', outcome: '→ Individual effectiveness · Code quality' },
  { n: '04', title: 'STRONG VERSION CONTROL PRACTICES', text: 'As AI increases the velocity of change, version control becomes the critical safety net that enables confident experimentation.', outcome: '→ Individual effectiveness · Team performance' },
  { n: '05', title: 'WORKING IN SMALL BATCHES', text: 'This discipline counteracts the risk of AI generating large, unstable changes, ensuring that speed translates to better product performance.', outcome: '→ Product performance · Reduced friction' },
  { n: '06', title: 'USER-CENTRIC FOCUS', text: 'A focus on user needs ensures AI-accelerated teams are moving quickly in the right direction. Without it, AI adoption actively harms team performance.', outcome: '→ Team performance (positive and negative)' },
  { n: '07', title: 'QUALITY INTERNAL PLATFORMS', text: 'A platform provides the automated, secure pathways that allow AI’s benefits to scale across the organisation.', outcome: '→ Organisational performance' },
]

export default function AssessmentCapabilities() {
  return (
    <section className="section" id="capabilities">
      <Container>
        <div className="sec-head">
          <span className="sec-mark">02 · The Seven Capabilities</span>
          <h1 className="t-h1">WHAT WE ASSESS.</h1>
          <p className="t-lead" style={{ maxWidth: '78ch', margin: 'var(--sp-3) 0 0' }}>
            The assessment evaluates your organisation against the seven foundational capabilities identified by DORA&rsquo;s research as proven amplifiers of AI&rsquo;s positive impact on performance.
          </p>
        </div>

        <div className="cells cells--4">
          {CAPS.map((c) => (
            <div className="cell" key={c.title}>
              <span className="cell__n">{c.n}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="cell__grow" />
              <div className="cell__foot">{c.outcome}</div>
            </div>
          ))}
          <div className="cell cell--feature">
            <span className="cell__n">08</span>
            <h3>+ SPECIFICATION QUALITY</h3>
            <p>DORA identifies the gap. SDD fills it. Specification quality is the shifted bottleneck in AI-native development — AI can only be as good as the spec it receives.</p>
            <span className="cell__grow" />
            <div className="cell__foot">→ The Kevin Ryan &amp; Associates differentiator</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
