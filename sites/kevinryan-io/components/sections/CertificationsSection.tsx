import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import Reveal from '@/components/Reveal'

const GROUPS = [
  {
    title: 'GitHub ×4',
    items: [
      { label: 'Administration', href: 'https://www.credly.com/badges/02e9c449-9385-4c95-9cfa-e72765f0d4de' },
      { label: 'Actions', href: 'https://www.credly.com/badges/b4a9987d-3a31-4cf3-8ee9-53607a4ef572' },
      { label: 'Advanced Security', href: 'https://www.credly.com/badges/74bdfd55-a572-46a9-9c00-5d4158385ca9' },
      { label: 'Foundations', href: 'https://www.credly.com/badges/2cf756b5-013f-4336-adda-1af6ce3c11c8/public_url' },
    ],
  },
  {
    title: 'GitLab ×6',
    items: [
      { label: 'Partner Technical Engineer', href: 'https://www.credly.com/badges/60bf5ece-b4b0-4bec-9c56-fc4d227fc689' },
      { label: 'DevOps Professional', href: 'https://www.credly.com/badges/73b62343-d671-4477-b412-2d833dc4ea42/public_url' },
      { label: 'Security Specialist', href: 'https://www.credly.com/badges/a64f651f-aa8c-4000-bf6e-9e5d3070dcb6/public_url' },
      { label: 'Services Engineer Professional', href: 'https://www.credly.com/badges/90be4ffc-c869-4d0c-8143-99fcbe7099d5/public_url' },
      { label: 'Migration Services Specialist', href: 'https://www.credly.com/badges/5ed58594-5438-45df-b57a-f2f8ef7435eb/public_url' },
      { label: 'CI/CD Associate', href: 'https://www.credly.com/badges/9340463c-a5d4-418e-9342-c18b145344e4/public_url' },
    ],
  },
  {
    title: 'LaunchDarkly ×4',
    items: [
      { label: 'Platinum Developer', href: 'https://verify.skilljar.com/c/b7tc7cjjjdv9' },
      { label: 'Gold Developer', href: 'https://verify.skilljar.com/c/xvvkdsp227on' },
      { label: 'Silver Developer', href: 'https://verify.skilljar.com/c/cw4ix2japf23' },
      { label: 'Bronze Developer', href: 'https://verify.skilljar.com/c/8m35pkrme9s8' },
    ],
  },
]

const EDUCATION = [
  'Hons, Digital Media — Birmingham City University',
  'AI and Ethics — Trinity College Dublin',
]

export default function CertificationsSection() {
  return (
    <section className="section section--black" id="certs">
      <Container>
        <SectionHeader number="07" subtitle="Certifications" title={<>Verified<br />Expertise</>} />
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {GROUPS.map((g) => (
            <div key={g.title} className="cert-group">
              <h3 className="cert-group__title">{g.title}</h3>
              <ul className="cert-group__list">
                {g.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="cert-group">
            <h3 className="cert-group__title">Education</h3>
            <ul className="cert-group__list">
              {EDUCATION.map((e) => (
                <li key={e}>{e}</li>
              ))}
              <li>
                MA Applied Linguistics — University of Pannonia{' '}
                <em className="text-accent not-italic text-[0.68rem] font-bold">(PLANNED)</em>
              </li>
            </ul>
          </div>
        </Reveal>
        <div className="award-banner reveal">
          <div className="award-banner__year">2014</div>
          <div className="award-banner__text">
            <strong>UK Agile Awards — Best Use of Agile in the Private Sector</strong>
            National recognition for enterprise agile delivery excellence.
          </div>
        </div>
      </Container>
    </section>
  )
}