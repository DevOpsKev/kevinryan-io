'use client'

import { FormEvent, useState } from "react"
import { CONTAINER } from "@/lib/constants"

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

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--grey-600)',
    marginBottom: '0.5rem',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--dark-mid)',
    border: '1px solid var(--grey-800)',
    color: 'var(--white)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  return (
    <section className="section section--dark" id="contact">
      <div style={CONTAINER}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 reveal"
          style={{ gap: 'calc(2rem * 3)', alignItems: 'start' }}
        >
          <div>
            <div className="section__header" style={{ marginBottom: '2.5rem' }}>
              <div className="section__number">09</div>
              <div>
                <div className="section__subtitle">Contact</div>
                <h2 className="display-lg">Let&rsquo;s Work<br />Together</h2>
              </div>
            </div>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'var(--white)',
              maxWidth: '45ch',
            }}>
              Available for AI-native transition engagements and Platform Engineering contracts. I embed with teams and make the work happen — spec quality, execution, delivery. Remote-first. Budapest · Dublin · London. AI governance advisory available through Kevin Ryan &amp; Associates.
            </p>
          </div>

          <div>
            <div style={{
              padding: '2rem',
              border: '1px solid var(--grey-800)',
              marginBottom: '2.5rem',
            }}>
              <div style={{
                ...labelStyle,
                color: 'var(--accent)',
                fontSize: '0.72rem',
                marginBottom: '1.5rem',
              }}>
                Send a Message
              </div>

              {status === 'success' ? (
                <div style={{
                  borderLeft: '4px solid var(--accent)',
                  background: 'rgba(168, 225, 12, 0.06)',
                  padding: '1.5rem 1.25rem',
                }}>
                  <div style={{
                    ...labelStyle,
                    color: 'var(--accent)',
                    fontSize: '0.72rem',
                    marginBottom: '0.75rem',
                  }}>
                    &#10003; Message Sent
                  </div>
                  <p style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--white)',
                    margin: 0,
                  }}>
                    Thanks for reaching out. I&rsquo;ll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {status === 'error' && (
                    <div style={{
                      borderLeft: '4px solid #CC3333',
                      background: 'rgba(204, 51, 51, 0.08)',
                      padding: '1rem 1.25rem',
                      marginBottom: '1.25rem',
                    }}>
                      <div style={{
                        ...labelStyle,
                        color: '#CC3333',
                        marginBottom: '0.4rem',
                      }}>
                        Something went wrong
                      </div>
                      <p style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        color: 'var(--grey-400)',
                        margin: 0,
                      }}>
                        Please try again, or email{' '}
                        <a href="mailto:kevin@kevinryan.io" style={{ color: 'var(--white)', textDecoration: 'underline' }}>
                          kevin@kevinryan.io
                        </a>{' '}
                        directly.
                      </p>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle} htmlFor="contact-email">
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--grey-800)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle} htmlFor="contact-message">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--grey-800)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: status === 'submitting' ? 'var(--grey-600)' : 'var(--accent)',
                      padding: '0.6rem 1.4rem',
                      border: `1px solid ${status === 'submitting' ? 'var(--grey-800)' : 'var(--accent)'}`,
                      background: 'transparent',
                      cursor: status === 'submitting' ? 'wait' : 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (status !== 'submitting') {
                        e.currentTarget.style.background = 'var(--accent)'
                        e.currentTarget.style.color = 'var(--black)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = status === 'submitting' ? 'var(--grey-600)' : 'var(--accent)'
                    }}
                  >
                    {status === 'submitting' ? 'Sending\u2026' : 'Send'}
                  </button>
                </form>
              )}
            </div>

            <div className="md:text-right">
              <div style={{ marginBottom: '2rem' }}>
                <div style={labelStyle}>Email</div>
                <a href="mailto:kevin@kevinryan.io" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--white)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--white)' }}
                >kevin@kevinryan.io</a>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={labelStyle}>Phone</div>
                <a href="tel:+447402083261" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--white)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--white)' }}
                >+44 7402 083261</a>
              </div>
              <div className="flex gap-4 md:justify-end" style={{ marginTop: '2rem' }}>
                {[
                  { label: 'GitHub', href: 'https://github.com/devopskev' },
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/devopskev' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'var(--accent)',
                      padding: '0.6rem 1.4rem', border: '1px solid var(--accent)',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--black)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
