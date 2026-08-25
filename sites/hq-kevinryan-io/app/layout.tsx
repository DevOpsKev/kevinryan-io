import type { Metadata } from "next";
import { Archivo, Bebas_Neue, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-archivo",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "HQ — Kevin Ryan",
  description: "Kevin Ryan HQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${archivo.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
