'use client'

import { FormEvent, useState } from "react"
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import Reveal from '@/components/Reveal'

const inputClass =
  'w-full px-4 py-3 bg-dark-mid border border-grey-800 text-white font-sans text-[0.95rem] outline-none transition-colors duration-200 focus:border-accent'
const labelClass =
  'block text-[0.68rem] font-bold tracking-[0.18em] uppercase text-grey-600 mb-2'

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
    <section className="section section--dark" id="contact">
      <Container>
        <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <div>
            <SectionHeader number="09" subtitle="Contact" title={<>Let&rsquo;s Work<br />Together</>} className="!mb-10" />
            <p className="text-[1.1rem] leading-[1.7] text-white max-w-[45ch]">
              Available for AI-native transition engagements and Platform Engineering contracts. I embed with teams and make the work happen — spec quality, execution, delivery. Remote-first. Budapest · Dublin · London. AI governance advisory available through Kevin Ryan &amp; Associates.
            </p>
          </div>

          <div>
            <div className="p-8 border border-grey-800 mb-10">
              <div className="text-accent text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-6">
                Send a Message
              </div>

              {status === 'success' ? (
                <div className="border-l-4 border-accent bg-[rgba(168,225,12,0.06)] p-6">
                  <div className="text-accent text-[0.72rem] font-bold tracking-[0.18em] uppercase mb-3">
                    &#10003; Message Sent
                  </div>
                  <p className="text-[0.9rem] leading-[1.6] text-white m-0">
                    Thanks for reaching out. I&rsquo;ll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {status === 'error' && (
                    <div className="border-l-4 border-[#CC3333] bg-[rgba(204,51,51,0.08)] p-4 mb-5">
                      <div className="text-[#CC3333] text-[0.68rem] font-bold tracking-[0.18em] uppercase mb-2">
                        Something went wrong
                      </div>
                      <p className="text-[0.85rem] leading-[1.5] text-grey-400 m-0">
                        Please try again, or email{' '}
                        <a href="mailto:kevin@kevinryan.io" className="text-white underline">
                          kevin@kevinryan.io
                        </a>{' '}
                        directly.
                      </p>
                    </div>
                  )}

                  <div className="mb-5">
                    <label className={labelClass} htmlFor="contact-email">
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="mb-5">
                    <label className={labelClass} htmlFor="contact-message">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase px-6 py-2.5 border transition-all duration-200 disabled:cursor-wait disabled:text-grey-600 disabled:border-grey-800 enabled:text-accent enabled:border-accent enabled:hover:bg-accent enabled:hover:text-black"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send'}
                  </button>
                </form>
              )}
            </div>

            <div className="md:text-right">
              <div className="mb-8">
                <div className={labelClass}>Email</div>
                <a
                  href="mailto:kevin@kevinryan.io"
                  className="font-display text-[1.6rem] tracking-[0.02em] uppercase text-white transition-colors duration-200 hover:text-accent"
                >
                  kevin@kevinryan.io
                </a>
              </div>
              <div className="mb-8">
                <div className={labelClass}>Phone</div>
                <a
                  href="tel:+447402083261"
                  className="font-display text-[1.6rem] tracking-[0.02em] uppercase text-white transition-colors duration-200 hover:text-accent"
                >
                  +44 7402 083261
                </a>
              </div>
              <div className="flex gap-4 md:justify-end mt-8">
                {[
                  { label: 'GitHub', href: 'https://github.com/devopskev' },
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/devopskev' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-accent px-6 py-2.5 border border-accent transition-all duration-200 hover:bg-accent hover:text-black"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}