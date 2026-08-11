import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const CLIENTS = [
  { name: "Accenture", url: "https://www.accenture.com" },
  { name: "Barclays", url: "https://www.barclays.co.uk" },
  { name: "CBRE", url: "https://www.cbre.com" },
  { name: "Codere Online", url: "https://www.codereonline.com/" },
  { name: "Deloitte Digital", url: "https://www.deloittedigital.com" },
  { name: "Elsevier", url: "https://www.elsevier.com" },
  { name: "EY", url: "https://www.ey.com" },
  { name: "GitLab", url: "https://gitlab.com" },
  { name: "Heathrow Airport", url: "https://www.heathrow.com" },
  { name: "HelloFresh", url: "https://www.hellofresh.com" },
  { name: "Informa", url: "https://www.informa.com" },
  { name: "Jaguar Landrover", url: "https://jlr.com/" },
  { name: "Lantum", url: "https://www.lantum.com" },
  { name: "Lely", url: "https://www.lely.com" },
  { name: "Lloyds Bank", url: "https://www.lloydsbank.com" },
  { name: "Maersk", url: "https://www.maersk.com" },
  { name: "Mastercard", url: "https://mastercard.com" },
  { name: "McKinsey & Co", url: "https://www.mckinsey.com" },
  { name: "Pearson", url: "https://www.pearson.com" },
  { name: "Sky", url: "https://www.sky.com" },
  { name: "TU Delft", url: "https://www.tudelft.nl" },
  { name: "Vodafone", url: "https://www.vodafone.com" },
  { name: "Volkswagen", url: "https://www.volkswagen.com" },
  { name: "William Hill Online", url: "https://williamhill.com/" },
  { name: "WorldRemit", url: "https://www.worldremit.com" },
]

export default function ClientsSection() {
  return (
    <section className="section" id="clients" data-accent="blue1">
      <Container>
        <SectionHeader subtitle="Notable clients" title="Who I have worked with" />
        <div className="clients">
          {CLIENTS.map((c) => (
            <a className="client" key={c.name} href={c.url} target="_blank" rel="noopener noreferrer">
              {c.name}
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
