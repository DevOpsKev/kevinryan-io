import Container from '@/components/Container'
import AssessmentContactForm from '@/components/AssessmentContactForm'

export default function AssessmentCta() {
  return (
    <section className="section section--dark cta-section" id="contact">
      <Container>
        <div className="section-label">Interested?</div>
        <h2>LET&rsquo;S ARRANGE A CONVERSATION.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-4">
          <div>
            <p className="subtitle">
              If this sounds right for your organisation, get in touch.
              We&rsquo;ll talk through the fit, the scope, and what works for your context.
              No pitch deck. Just a conversation.
            </p>
            <p className="subtitle" style={{ marginTop: '1.5rem' }}>
              You can also reach me directly at{' '}
              <a href="mailto:kevin@kevinryan.io">kevin@kevinryan.io</a> or connect on{' '}
              <a href="https://linkedin.com/in/devopskev">LinkedIn</a>.
            </p>
          </div>
          <AssessmentContactForm />
        </div>
      </Container>
    </section>
  )
}