'use client'

import { FormEvent, useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meerpkog'

export default function AssessmentContactForm(): React.JSX.Element {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="callout">
        <span className="callout__label">&#10003; Enquiry Sent</span>
        <p>Thanks for reaching out. I&rsquo;ll be in touch shortly to arrange a conversation.</p>
      </div>
    )
  }

  return (
    <div className="form-panel">
      <div className="form-panel__hd"><span className="label">Book a Discovery Call</span></div>
      <div className="form-panel__bd">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value="AI-Native Readiness Assessment Enquiry" />

          {status === 'error' && (
            <div className="callout" style={{ borderLeftColor: 'var(--danger)', marginBottom: 'var(--sp-3)' }}>
              <span className="callout__label" style={{ color: 'var(--danger)' }}>Something went wrong</span>
              <p>
                Please try again, or email{' '}
                <a href="mailto:kevin@kevinryan.io" style={{ color: 'var(--accent)' }}>kevin@kevinryan.io</a>{' '}
                directly.
              </p>
            </div>
          )}

          <div className="two-col" style={{ gap: 'var(--sp-3)' }}>
            <div className="fgroup">
              <label className="label" htmlFor="ar-name" style={{ display: 'block', marginBottom: 8 }}>Name</label>
              <input className="field" type="text" id="ar-name" name="name" placeholder="Your name" required />
            </div>
            <div className="fgroup">
              <label className="label" htmlFor="ar-email" style={{ display: 'block', marginBottom: 8 }}>Email</label>
              <input className="field" type="email" id="ar-email" name="email" placeholder="you@company.com" required />
            </div>
          </div>

          <div className="two-col" style={{ gap: 'var(--sp-3)' }}>
            <div className="fgroup">
              <label className="label" htmlFor="ar-company" style={{ display: 'block', marginBottom: 8 }}>Company</label>
              <input className="field" type="text" id="ar-company" name="company" placeholder="Your organisation" required />
            </div>
            <div className="fgroup">
              <label className="label" htmlFor="ar-role" style={{ display: 'block', marginBottom: 8 }}>Role</label>
              <select className="field" id="ar-role" name="role" required defaultValue="">
                <option value="" disabled>Select your role</option>
                <option value="CTO / VP Engineering">CTO / VP Engineering</option>
                <option value="Head of Platform / DevOps">Head of Platform / DevOps</option>
                <option value="Engineering Manager">Engineering Manager</option>
                <option value="Head of AI / Innovation">Head of AI / Innovation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="fgroup">
            <label className="label" htmlFor="ar-eng-size" style={{ display: 'block', marginBottom: 8 }}>Engineering Team Size</label>
            <select className="field" id="ar-eng-size" name="engineering_team_size" required defaultValue="">
              <option value="" disabled>Approximate number of engineers</option>
              <option value="< 50">Fewer than 50</option>
              <option value="50-200">50–200</option>
              <option value="200-500">200–500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <div className="fgroup">
            <label className="label" htmlFor="ar-message" style={{ display: 'block', marginBottom: 8 }}>
              What&rsquo;s prompting this? <span style={{ textTransform: 'none', letterSpacing: 0 }}>(Optional)</span>
            </label>
            <textarea
              className="field"
              id="ar-message"
              name="message"
              placeholder="Tell me briefly about your situation — AI tools in use, what's working, what isn't."
              rows={4}
            />
          </div>

          <button className="btn btn--primary" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Book a Discovery Call'}
          </button>

          <p className="label" style={{ marginTop: 'var(--sp-3)', textTransform: 'none', letterSpacing: 0, lineHeight: 1.5 }}>
            No commitment. No pitch deck. A 30-minute conversation about your context.
          </p>
        </form>
      </div>
    </div>
  )
}
