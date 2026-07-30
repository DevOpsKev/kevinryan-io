'use client'

import Link from "next/link"
import { useState } from "react"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Assessment", href: "/ai-native-readiness-assessment" },
] as const

const linkClass =
  "text-[0.72rem] font-bold tracking-[0.14em] uppercase relative pb-[2px]"
const mobileLinkClass =
  "text-[0.72rem] font-bold tracking-[0.14em] uppercase"

export default function SiteHeader(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black">
      <div className="flex justify-between items-center mx-auto max-w-[1400px] px-[clamp(1.5rem,5vw,6rem)] py-4">
        <Link
          href="/"
          className="font-['Work_Sans'] font-black text-[1.8rem] leading-none uppercase"
        >
          Kevin<span className="text-accent-dim ml-[0.15em]">Ryan</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={`nav-link ${linkClass}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-[26px] h-[2px] bg-black my-[6px]" />
          <span className="block w-[26px] h-[2px] bg-black my-[6px]" />
          <span className="block w-[26px] h-[2px] bg-black my-[6px]" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden flex flex-col bg-white border-b-2 border-black px-[clamp(1.5rem,5vw,6rem)] py-8 gap-5 list-none">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href} onClick={() => setOpen(false)} className={mobileLinkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}