import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const serif = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: 'swap',
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kevin Ryan | DevOps Leader & AI Architect",
  description: "Dynamic technology leader specializing in AI-native and cloud-native software development, DevOps transformation, and enterprise automation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="minimal" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans text-base-content bg-base-100">
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="274c83f6-0775-49a8-824c-da380cf7535b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
