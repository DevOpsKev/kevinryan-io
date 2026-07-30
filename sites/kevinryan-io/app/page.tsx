'use client'

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import HeroSection from "@/components/sections/HeroSection"
import TickerBar from "@/components/sections/TickerBar"
import DocsBanner from "@/components/sections/DocsBanner"
import AboutSection from "@/components/sections/AboutSection"
import CapabilitiesSection from "@/components/sections/CapabilitiesSection"
import DeliverySection from "@/components/sections/DeliverySection"
import ClientsSection from "@/components/sections/ClientsSection"
import TimelineSection from "@/components/sections/TimelineSection"
import WritingSection from "@/components/sections/WritingSection"
import CertificationsSection from "@/components/sections/CertificationsSection"
import ContactSection from "@/components/sections/ContactSection"
import SiteFooter from "@/components/SiteFooter"

export default function Page() {
  useRevealOnScroll()

  return (
    <main>
      <HeroSection />
      <TickerBar />
      <DocsBanner />
      <AboutSection />
      <CapabilitiesSection />
      <DeliverySection />
      <ClientsSection />
      <TimelineSection />
      <WritingSection />
      <CertificationsSection />
      <ContactSection />
      <SiteFooter />
    </main>
  )
}
