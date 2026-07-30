'use client'

import { FormEvent, useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meerpkog'

const labelClass = 'font-sans font-bold text-[0.7rem] tracking-[0.12em] uppercase text-grey-400'
const inputClass =
  'font-sans text-[0.95rem] py-[0.85rem] px-4 bg-dark-mid border border-grey-800 text-white outline-none transition-colors duration-200 focus:border-accent w-full'
const selectClass = `${inputClass} appearance-none bg-no-repeat bg-[right_1rem_center] pr-10 cursor-pointer bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='8'%3E%3Cpath%20d='M1%201l5%205%205-5'%20stroke='%237A7772'%20stroke-width='1.5'%20fill='none'/%3E%3C/svg%3E")]`

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
      <div className="border-l-4 border-accent bg-[rgba(168,225,12,0.06)] p-6">
        <div className="text-accent text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-3">
          &#10003; Enquiry Sent
        </div>
        <p className="text-[0.9rem] leading-[1.6] text-grey-200 m-0">
          Thanks for reaching out. I&rsquo;ll be in touch shortly to arrange a conversation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="_subject" value="AI-Native Readiness Assessment Enquiry" />

      {status === 'error' && (
        <div className="border-l-4 border-[#CC3333] bg-[rgba(204,51,51,0.08)] p-4">
          <div className="text-[#CC3333] text-[0.7rem] font-bold tracking-[0.12em] uppercase mb-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="ar-name">Name</label>
          <input type="text" id="ar-name" name="name" placeholder="Your name" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="ar-email">Email</label>
          <input type="email" id="ar-email" name="email" placeholder="you@company.com" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="ar-company">Company</label>
          <input type="text" id="ar-company" name="company" placeholder="Your organisation" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="ar-role">Role</label>
          <select id="ar-role" name="role" required defaultValue="" className={selectClass}>
            <option value="" disabled>Select your role</option>
            <option value="CTO / VP Engineering">CTO / VP Engineering</option>
            <option value="Head of Platform / DevOps">Head of Platform / DevOps</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Head of AI / Innovation">Head of AI / Innovation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="ar-eng-size">Engineering Team Size</label>
        <select id="ar-eng-size" name="engineering_team_size" required defaultValue="" className={selectClass}>
          <option value="" disabled>Approximate number of engineers</option>
          <option value="< 50">Fewer than 50</option>
          <option value="50-200">50–200</option>
          <option value="200-500">200–500</option>
          <option value="500+">500+</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="ar-message">
          What&rsquo;s prompting this?{' '}
          <span className="font-normal normal-case tracking-normal text-[0.7rem]">(Optional)</span>
        </label>
        <textarea
          id="ar-message"
          name="message"
          placeholder="Tell me briefly about your situation — AI tools in use, what's working, what isn't."
          rows={4}
          className={`${inputClass} resize-y min-h-[100px]`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="font-sans font-extrabold text-[0.78rem] tracking-[0.12em] uppercase px-12 py-4 border-2 self-start transition-all duration-200 disabled:cursor-wait disabled:text-grey-600 disabled:bg-grey-800 disabled:border-grey-800 enabled:text-black enabled:bg-accent enabled:border-accent enabled:hover:bg-transparent enabled:hover:text-accent"
      >
        {status === 'submitting' ? 'Sending…' : 'Book a Discovery Call'}
      </button>

      <p className="text-[0.75rem] text-grey-600 leading-[1.5]">
        No commitment. No pitch deck. A 30-minute conversation about your context.
      </p>
    </form>
  )
}