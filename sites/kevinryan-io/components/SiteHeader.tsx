'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'delivery', label: 'Enterprise delivery' },
  { id: 'clients', label: 'Notable clients' },
  { id: 'timeline', label: 'Career arc' },
  { id: 'projects', label: 'Published work' },
  { id: 'certs', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
] as const

/**
 * Location readout, not a progress indicator. Reports which section the
 * reader is in. The theme carries no scroll progress bar and no gauge.
 * See design-spec/theme-spec.md B27.
 */
function useLocus() {
  const [locus, setLocus] = useState('Available for contract')

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.35
      let label = 'Available for contract'
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= mid) label = s.label
      }
      setLocus(label)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return locus
}

export default function SiteHeader(): React.JSX.Element {
  const locus = useLocus()

  return (
    <header className="topbar">
      <Link href="/" className="topbar__brand">
        Kevin Ryan &amp; Associates
      </Link>

      <div className="topbar__locus">{locus}</div>

      <div className="topbar__tools">
        <Link className="tool" href="/ai-native-readiness-assessment">
          Assessment
        </Link>
        <a className="tool tool--accent" href="#contact">
          Contact
        </a>
      </div>
    </header>
  )
}
