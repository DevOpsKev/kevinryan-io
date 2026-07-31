'use client'

import { FormEvent, useState } from "react"
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const REACH = [
  { k: 'Email', v: 'kevin@kevinryan.io', href: 'mailto:kevin@kevinryan.io' },
  { k: 'Phone', v: '+44 7402 083261', href: 'tel:+447402083261' },
  { k: 'GitHub', v: 'devopskev ↗', href: 'https://github.com/devopskev' },
  { k: 'LinkedIn', v: 'devopskev ↗', href: 'https://linkedin.com/in/devopskev' },
  { k: 'Base', v: 'Budapest · Dublin · London' },
]

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/mkoqvnyp', {
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

  return (
    <section className="section" id="contact" data-accent="blue">
      <Container>
        <SectionHeader subtitle="Contact" title="Let us work together" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--sp-8)' }}>
          <div>
            <div className="prose">
              <p className="t-lead">
                Available for AI-native transition engagements and Platform Engineering contracts.
              </p>
              <p>
                I embed with teams and make the work happen. Specification quality, execution,
                delivery. Remote first, Budapest, Dublin and London. AI governance advisory
                available through Kevin Ryan &amp; Associates.
              </p>
            </div>

            <div style={{ marginTop: 'var(--sp-5)' }}>
              {REACH.map((r) => (
                <div className="reach__row" key={r.k}>
                  <span className="label">{r.k}</span>
                  {r.href ? (
                    <a
                      className="reach__v"
                      href={r.href}
                      {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {r.v}
                    </a>
                  ) : (
                    <span className="reach__v">{r.v}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="form-panel">
              <div className="form-panel__hd"><span className="label">Send a message</span></div>
              <div className="form-panel__bd">
                {status === 'success' ? (
                  <div className="callout">
                    <span className="callout__label">Message sent</span>
                    <p>Thanks for reaching out. I&rsquo;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {status === 'error' && (
                      <div
                        className="callout"
                        style={{ borderLeftColor: 'var(--danger)', marginBottom: 'var(--sp-3)' }}
                      >
                        <span className="callout__label" style={{ color: 'var(--danger)' }}>
                          Something went wrong
                        </span>
                        <p>
                          Please try again, or email{' '}
                          <a href="mailto:kevin@kevinryan.io" style={{ color: 'var(--accent)' }}>
                            kevin@kevinryan.io
                          </a>{' '}
                          directly.
                        </p>
                      </div>
                    )}

                    <div className="fgroup">
                      <label className="label" htmlFor="contact-email" style={{ display: 'block', marginBottom: 8 }}>
                        Your email
                      </label>
                      <input className="field" id="contact-email" type="email" name="email" required />
                    </div>

                    <div className="fgroup">
                      <label className="label" htmlFor="contact-message" style={{ display: 'block', marginBottom: 8 }}>
                        Your message
                      </label>
                      <textarea className="field" id="contact-message" name="message" required rows={4} />
                    </div>

                    <button className="btn btn--primary" type="submit" disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Sending…' : 'Send'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
