'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MouseEvent } from "react"

/**
 * Left-aligned three-button nav. No wordmark, no section-locus readout.
 * HOME and ASSESSMENT are internal routes; clicking either returns to the
 * start of that page — when already on the target page a plain <Link> to
 * the same route is a no-op, so we intercept and smooth-scroll to top.
 * CONTACT is a same-page scroll to the home page's contact section.
 */
export default function SiteHeader(): React.JSX.Element {
  const pathname = usePathname()

  const goTop = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Normalise current path to match the link's `href` form (no trailing slash).
    const current = pathname.replace(/\/$/, '') || '/'
    if (current === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Otherwise let next/link navigate; Next scrolls to top on route change.
  }

  return (
    <header className="topbar">
      <nav className="topbar__nav">
        <Link className="tool" href="/" onClick={(e) => goTop(e, '/')}>Home</Link>
        <Link
          className="tool"
          href="/ai-native-readiness-assessment"
          onClick={(e) => goTop(e, '/ai-native-readiness-assessment')}
        >
          Assessment
        </Link>
        <a className="tool tool--accent" href="#contact">Contact</a>
      </nav>
    </header>
  )
}