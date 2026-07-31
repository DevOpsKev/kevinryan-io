import Container from '@/components/Container'
import AssessmentContactForm from '@/components/AssessmentContactForm'

export default function AssessmentCta() {
  return (
    <section className="section section--sink" id="contact" data-accent="blue">
      <Container>
        <div className="sec-head">
          <span className="sec-mark">Interested?</span>
          <h1 className="t-h1">LET&rsquo;S ARRANGE A CONVERSATION.</h1>
        </div>

        <div className="two-col">
          <div className="prose">
            <p className="t-lead">
              If this sounds right for your organisation, get in touch.
              We&rsquo;ll talk through the fit, the scope, and what works for your context.
              No pitch deck. Just a conversation.
            </p>
            <p>
              You can also reach me directly at{' '}
              <a href="mailto:kevin@kevinryan.io" className="link-out">kevin@kevinryan.io</a> or connect on{' '}
              <a href="https://linkedin.com/in/devopskev" className="link-out">LinkedIn</a>.
            </p>
          </div>
          <AssessmentContactForm />
        </div>
      </Container>
    </section>
  )
}
