import Container from '@/components/Container'

const CLIENTS = ['CERN', 'NESTLÉ', 'NATWEST', 'BBC WORLDWIDE', 'FINANCIAL TIMES', 'VODAFONE', 'HELLOFRESH']

export default function AssessmentCredibility() {
  return (
    <section className="section section--black">
      <Container>
        <div className="section-number">07</div>
        <div className="section-label">The Presenter</div>
        <h2>KEVIN RYAN</h2>
        <p className="subtitle">
          30 years in enterprise technology. 14 professional certifications including GitLab ×9 and GitHub ×4. Currently writing <em>Spec Driven Development: AI-Native Software Engineering</em>. Published author of <em>AI Immigrants</em>. Remote-first. Budapest · Dublin · London.
        </p>
        <div className="client-strip">
          {CLIENTS.map((c) => (
            <span key={c} className="client-name">{c}</span>
          ))}
        </div>
      </Container>
    </section>
  )
}