'use client'

import { FormEvent, useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meerpkog'

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: '0.7rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--grey-400)',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.95rem',
  padding: '0.85rem 1rem',
  background: 'var(--dark-mid)',
  border: '1px solid var(--grey-800)',
  color: '#FFFFFF',
  outline: 'none',
  transition: 'border-color 0.2s',
  borderRadius: 0,
  width: '100%',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7772' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
  cursor: 'pointer',
}

function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'var(--lime)'
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'var(--grey-800)'
}

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
      <div style={{
        borderLeft: '4px solid var(--lime)',
        background: 'rgba(168, 225, 12, 0.06)',
        padding: '1.5rem 1.25rem',
      }}>
        <div style={{
          ...labelStyle,
          color: 'var(--lime)',
          fontSize: '0.72rem',
          marginBottom: '0.75rem',
        }}>
          &#10003; Enquiry Sent
        </div>
        <p style={{
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--grey-200)',
          margin: 0,
        }}>
          Thanks for reaching out. I&rsquo;ll be in touch shortly to arrange a conversation.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      <input type="hidden" name="_subject" value="AI-Native Readiness Assessment Enquiry" />

      {status === 'error' && (
        <div style={{
          borderLeft: '4px solid #CC3333',
          background: 'rgba(204, 51, 51, 0.08)',
          padding: '1rem 1.25rem',
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
            <a href="mailto:kevin@kevinryan.io" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
              kevin@kevinryan.io
            </a>{' '}
            directly.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={labelStyle} htmlFor="ar-name">Name</label>
          <input
            type="text"
            id="ar-name"
            name="name"
            placeholder="Your name"
            required
            style={inputStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={labelStyle} htmlFor="ar-email">Email</label>
          <input
            type="email"
            id="ar-email"
            name="email"
            placeholder="you@company.com"
            required
            style={inputStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={labelStyle} htmlFor="ar-company">Company</label>
          <input
            type="text"
            id="ar-company"
            name="company"
            placeholder="Your organisation"
            required
            style={inputStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={labelStyle} htmlFor="ar-role">Role</label>
          <select
            id="ar-role"
            name="role"
            required
            defaultValue=""
            style={selectStyle}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            <option value="" disabled>Select your role</option>
            <option value="CTO / VP Engineering">CTO / VP Engineering</option>
            <option value="Head of Platform / DevOps">Head of Platform / DevOps</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Head of AI / Innovation">Head of AI / Innovation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle} htmlFor="ar-eng-size">Engineering Team Size</label>
        <select
          id="ar-eng-size"
          name="engineering_team_size"
          required
          defaultValue=""
          style={selectStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        >
          <option value="" disabled>Approximate number of engineers</option>
          <option value="< 50">Fewer than 50</option>
          <option value="50-200">50–200</option>
          <option value="200-500">200–500</option>
          <option value="500+">500+</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle} htmlFor="ar-message">
          What&rsquo;s prompting this?{' '}
          <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.7rem' }}>(Optional)</span>
        </label>
        <textarea
          id="ar-message"
          name="message"
          placeholder="Tell me briefly about your situation — AI tools in use, what's working, what isn't."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '100px' }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          fontSize: '0.78rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: status === 'submitting' ? 'var(--grey-600)' : 'var(--black)',
          background: status === 'submitting' ? 'var(--grey-800)' : 'var(--lime)',
          padding: '1.1rem 3rem',
          border: `2px solid ${status === 'submitting' ? 'var(--grey-800)' : 'var(--lime)'}`,
          cursor: status === 'submitting' ? 'wait' : 'pointer',
          transition: 'all 0.25s',
          alignSelf: 'flex-start',
          borderRadius: 0,
        }}
        onMouseEnter={(e) => {
          if (status !== 'submitting') {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--lime)'
          }
        }}
        onMouseLeave={(e) => {
          if (status !== 'submitting') {
            e.currentTarget.style.background = 'var(--lime)'
            e.currentTarget.style.color = 'var(--black)'
          }
        }}
      >
        {status === 'submitting' ? 'Sending\u2026' : 'Book a Discovery Call'}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--grey-600)', lineHeight: 1.5 }}>
        No commitment. No pitch deck. A 30-minute conversation about your context.
      </p>
    </form>
  )
}
