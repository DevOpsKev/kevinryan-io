import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kevin Ryan",
  description: "Technologist · Engineer · Author · Technical Writer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="business" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans text-base-content bg-base-100">{children}</body>
    </html>
  )
}
