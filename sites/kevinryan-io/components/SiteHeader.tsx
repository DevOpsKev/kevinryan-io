'use client'

import Link from "next/link"

/**
 * Left-aligned three-button nav. No wordmark, no section-locus readout.
 * HOME and ASSESSMENT are internal routes; CONTACT is a same-page scroll
 * to the home page's contact section.
 */
export default function SiteHeader(): React.JSX.Element {
  return (
    <header className="topbar">
      <nav className="topbar__nav">
        <Link className="tool" href="/">Home</Link>
        <Link className="tool" href="/ai-native-readiness-assessment">Assessment</Link>
        <a className="tool tool--accent" href="#contact">Contact</a>
      </nav>
    </header>
  )
}