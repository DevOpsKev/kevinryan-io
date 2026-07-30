import Container from '@/components/Container'

const AUDIENCES = [
  { title: 'CTOs & VPs ENGINEERING', text: "You've invested in AI tooling. Adoption is patchy. You need evidence-based guidance on where to invest next and a framework to justify that investment to the board." },
  { title: 'HEADS OF PLATFORM', text: "Your platform is the distribution layer for AI's benefits. This assessment shows where your platform is amplifying value — and where it's creating bottlenecks." },
  { title: 'ENGINEERING MANAGERS', text: 'Your teams are using AI but results are inconsistent. You need a diagnostic that names the gaps and a workshop that gets your team aligned on what to fix first.' },
]

export default function AssessmentAudience() {
  return (
    <section className="section">
      <Container>
        <div className="section-number">05</div>
        <div className="section-label">Audience</div>
        <h2>WHO THIS IS FOR.</h2>
        <div className="audience-grid">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="audience-card">
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}