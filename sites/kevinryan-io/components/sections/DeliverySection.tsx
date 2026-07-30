import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const CASES = [
  {
    tag: "Global platform", client: "Nestlé", url: "https://www.nestle.com", host: "nestle.com",
    desc: "Built a global DevOps platform from zero. Distributed team across India, Spain and the UK serving thousands of developers. Migrated Jenkins into AKS, Terraform IaC governance. Transferred capability for long-term sustainability.",
  },
  {
    tag: "CI/CD transformation", client: "Dematic", url: "https://www.dematic.com", host: "dematic.com",
    desc: "First through the door. CI/CD transformation for a warehouse automation leader. GitLab and Azure-based platform. Reusable pipeline templates, Helm-based Kubernetes deployments.",
    stat: "98%", statLabel: "Reduction in time to solution",
  },
  {
    tag: "Architecture review", client: "CERN", url: "https://home.cern", host: "home.cern",
    desc: "Kubernetes and CI/CD architectural review for the Large Hadron Collider control systems. Delivered recommendations that shipped to production infrastructure.",
  },
  {
    tag: "AI adoption", client: "NatWest", url: "https://www.natwest.com", host: "natwest.com",
    desc: "Enterprise AI-assisted development pilot. Assessment framework across Java, Python and Node.js. Board-level AI adoption recommendations in a tier-one financial institution.",
  },
  {
    tag: "Platform rebuild", client: "Financial Times", url: "https://www.ft.com", host: "ft.com",
    desc: "Platform rebuild during the period leading to Nikkei's £844m acquisition. Modernised how one of the world's leading publications delivers content during rapid digital transformation.",
  },
  {
    tag: "Digital portfolio", client: "BBC Worldwide", url: "https://www.bbc.com", host: "bbc.com",
    desc: "£10m+ digital portfolio including BBC Good Food, Top Gear and Global iPlayer. Agile programme management across product, engineering, editorial and commercial teams.",
  },
]

export default function DeliverySection() {
  return (
    <section className="section section--sink" id="delivery">
      <Container>
        <SectionHeader subtitle="Enterprise delivery" title="Embed. Build. Transfer." />
        <div className="cells cells--2">
          {CASES.map((c) => (
            <a className="cell" key={c.client} href={c.url} target="_blank" rel="noopener noreferrer">
              <span className="cell__tag">{c.tag}</span>
              <h3>{c.client}</h3>
              <p>{c.desc}</p>
              <span className="cell__grow" />
              {c.stat && (
                <div className="cell__figure">
                  <div className="v">{c.stat}</div>
                  <div className="k">{c.statLabel}</div>
                </div>
              )}
              <span className="cell__out">{c.host} <span className="arr">→</span></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
