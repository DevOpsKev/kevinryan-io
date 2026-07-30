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
      <ContactSection />
    </main>
  )
}
