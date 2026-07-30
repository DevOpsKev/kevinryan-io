import type { Metadata } from "next";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/* Self-hosted fonts. No third party request on page load.
   Display: Space Grotesk. Body: IBM Plex Sans. Structure: IBM Plex Mono. */
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Ryan & Associates | AI-Native Engineering · Platform Engineering",
  description:
    "Thirty years embedding with enterprise clients and making complex technology work in production. AI-native engineering, platform engineering, delivery management and AI governance. CERN, Nestlé, NatWest, BBC Worldwide, Financial Times, Dematic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Script
          src="https://analytics.kevinryan.io/script.js"
          data-website-id="155819eb-1dde-475a-95ed-9bc0b1b161b6"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
