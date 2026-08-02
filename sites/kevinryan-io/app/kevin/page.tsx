import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import TickerBar from '@/components/sections/TickerBar'
import DocsBanner from '@/components/sections/DocsBanner'
import AboutSection from '@/components/sections/AboutSection'
import CapabilitiesSection from '@/components/sections/CapabilitiesSection'
import DeliverySection from '@/components/sections/DeliverySection'
import ClientsSection from '@/components/sections/ClientsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import WritingSection from '@/components/sections/WritingSection'
import CertificationsSection from '@/components/sections/CertificationsSection'

export const metadata: Metadata = {
  title: { absolute: 'Kevin Ryan — AI-Native Engineering · Platform Engineering' },
  description:
    'Thirty years embedding with enterprise clients and making complex technology work in production. AI-native engineering, platform engineering, delivery management and AI governance. CERN, Nestlé, NatWest, BBC Worldwide, Financial Times, Dematic.',
}

export default function Page() {
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
    </main>
  )
}