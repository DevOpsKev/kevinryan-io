import { CONTAINER } from "@/lib/constants"

export default function AboutSection() {
  return (
    <section className="section section--grey" id="about">
      <div style={CONTAINER}>
        <div className="section__header reveal">
          <div className="section__number">01</div>
          <div>
            <div className="section__subtitle">About</div>
            <h2 className="display-lg">When AI Writes<br />The Code</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'calc(2rem * 3)' }}>
          <div className="reveal">
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '60ch', marginBottom: '1.5rem' }}>
              The market has shifted. Anthropic hires generalists with &ldquo;quirky side projects&rdquo; over narrow specialists. OpenAI seeks &ldquo;builders who thrive in ambiguity.&rdquo; Spotify&rsquo;s best engineers have not written a line of code since December 2025 &mdash; they orchestrate AI agents while making architectural decisions the machines cannot. The signal is clear: when AI fills in the implementation details, you need people who think in systems.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '60ch', marginBottom: '1.5rem' }}>
              That is what thirty years of breadth gives you. I have built production pipelines, run multi-million-pound delivery programmes, and operated platforms for Vodafone, Nestl&eacute;, NatWest, and the BBC. AI amplifies everything I already know &mdash; and you cannot shortcut that context. Most contractors are infrastructure specialists who have never managed a client engagement, or consultants who have never touched a pipeline. I have done both.
            </p>
            <blockquote style={{
              borderLeft: '4px solid var(--accent)', paddingLeft: '1.5rem',
              fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.65,
              marginTop: '2.5rem', maxWidth: '50ch',
            }}>
              &ldquo;Grady Booch calls this the third golden age of software engineering &mdash; the age of systems. I have been building for all three.&rdquo;
            </blockquote>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '60ch', marginBottom: '1.5rem' }}>
              I have been early to every wave. XP and TDD when they were fringe. Agile before it was the default. Cloud-native and containerisation before the industry caught up. VentureBeat now argues that hiring specialists made sense before AI &mdash; now generalists win. This is the shift I have spent three decades preparing for.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '60ch', marginBottom: '1.5rem' }}>
              I am not theorising about AI-native engineering. I am practising it &mdash; writing the book on Spec Driven Development and building the tooling. I conduct the agents. They build the software. The entire lifecycle ships through deterministic automation.
            </p>
            <div className="grid grid-cols-2 gap-8" style={{ marginTop: '3rem' }}>
              {[
                { num: '30', label: 'Years in technology' },
                { num: '14', label: 'Certifications' },
                { num: '40+', label: 'Enterprise clients' },
                { num: '£20m+', label: 'Programme budgets' },
              ].map((s) => (
                <div key={s.label} style={{ borderTop: '3px solid var(--black)', paddingTop: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.8rem', lineHeight: 1, marginBottom: '0.25rem' }}>{s.num}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--grey-600)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
