import Image from "next/image"
import SiteHeader from "@/components/SiteHeader"

export default function Page() {
  return (
    <main className="min-h-screen bg-base-100">
      <SiteHeader />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl flex-shrink-0">
            <Image
              src="/kevin.jpg"
              alt="Kevin Ryan"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-serif leading-tight pb-2">
              Kevin Ryan
            </h1>
            <p className="text-xl md:text-2xl text-base-content/70 mb-6">
              DevOps & Agile Coach · AI Adoption & Governance · Author
            </p>
            <p className="text-lg leading-relaxed text-base-content/80 max-w-2xl">
              I help organizations adopt AI responsibly — balancing technical
              implementation with ethical frameworks and governance, while
              empowering development teams to leverage AI tools for better
              code quality and productivity.
            </p>

            <p className="text-lg leading-relaxed text-base-content/80 max-w-2xl mt-6">
              Author of "AI Immigrants" and founder of{' '}
              <a
                href="https://distributedequity.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                DistributedEquity.org
              </a>.
            </p>

            <div className="flex gap-6 mt-8 justify-center md:justify-start items-center">
              <a
                href="https://github.com/devopskev"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="/github_logo_black.png"
                  alt="GitHub"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://linkedin.com/in/devopskev"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="/linkedin_black_logo.png"
                  alt="LinkedIn"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-base-200/50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <blockquote className="text-2xl md:text-3xl font-light text-center italic text-base-content/90 leading-relaxed">
            "Good technology makes people more effective, not obsolete.
            I focus on AI tools that enhance human judgment rather than
            bypass it."
          </blockquote>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 font-serif">About Kevin</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-base-content/80">
            Dynamic and innovative technology leader with extensive experience in AI-native
            and cloud-native software development, DevOps transformation, and enterprise automation.
            Proven track record of delivering high-impact solutions for international clients,
            leveraging advanced automation, AI integration, and modern cloud practices.
          </p>
          <p className="text-lg leading-relaxed text-base-content/80 mt-4">
            Based in the UK and Hungary with full remote capability and open to international
            travel for client engagements and conferences.
          </p>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="bg-base-200/30 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-serif">Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-primary font-serif">Cloud Architecture</h3>
                <p className="text-base-content/80">
                  Designing and implementing scalable, secure, and cost-efficient cloud
                  solutions across Azure, AWS, and GCP to support enterprise workloads.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-primary font-serif">AI & Machine Learning Integration</h3>
                <p className="text-base-content/80">
                  Leveraging AI to optimize development workflows, observability,
                  and operational intelligence across the software development lifecycle.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-primary font-serif">DevOps Transformation</h3>
                <p className="text-base-content/80">
                  Driving cultural and technical change toward high-performance delivery
                  teams through agile, lean, and DevOps methodologies.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-primary font-serif">Infrastructure as Code</h3>
                <p className="text-base-content/80">
                  Automating provisioning, configuration, and drift management with
                  Terraform and Bicep for reproducible infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Role Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 font-serif">Current Role</h2>
        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-2xl font-bold mb-2 font-serif">Interim Head of DevOps EMEA</h3>
          <p className="text-xl text-primary mb-4">Cprime</p>
          <p className="text-base-content/80 leading-relaxed mb-4">
            Established GitLab and GitHub Professional Services Practices, mentoring engineering
            teams through training and certification to build internal capabilities and ensure
            client success. Leading pre-sales initiatives and delivering transformative outcomes
            for enterprise clients.
          </p>
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-lg font-serif">Recent Client Work:</h4>
            <ul className="space-y-2 text-base-content/80">
              <li>• <strong>Becton Dickinson:</strong> Architected cloud-native modernization from legacy .NET to containerized Azure solutions</li>
              <li>• <strong>Gilead Sciences:</strong> Led productionization of Real World Evidence GitHub repository at scale</li>
              <li>• <strong>NatWest:</strong> Delivered AI-assisted developer assessment framework and productivity analysis</li>
              <li>• <strong>Nestlé:</strong> Established platform engineering team for on-demand cloud infrastructure</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Career Highlights Section */}
      <section className="bg-base-200/30 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-serif">Career Highlights</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary font-serif">CERN</h3>
              <p className="text-base-content/80">
                Worked on architectural design for control systems for the Large Hadron Collider,
                focusing on Kubernetes architectures and CI/CD implementations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-primary font-serif">Financial Times</h3>
              <p className="text-base-content/80">
                Made significant improvements to FT.com, paving the way for its $1.3 billion
                sale to the Nikkei index.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-primary font-serif">Lunar Zebro (TU Delft)</h3>
              <p className="text-base-content/80">
                Served as DevOps Coach and mentor for a moon lander project, contributing
                to cutting-edge space exploration technology.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-primary font-serif">Repo Racers</h3>
              <p className="text-base-content/80">
                Founded community platform attracting 3,000-4,000 monthly visitors worldwide,
                promoting technical excellence and knowledge sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notable Clients Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-serif">Notable Clients</h2>
        <div className="flex flex-wrap justify-center gap-4 text-base-content/60 text-sm md:text-base">
          {[
            "Accenture", "Barclays", "CBRE", "CERN", "Deloitte Digital",
            "Elsevier", "EY", "Financial Times", "Heathrow Airport", "HelloFresh",
            "Lloyds Bank", "Maersk", "McKinsey & Company", "NatWest", "Nestlé",
            "Pearson", "Sky", "TU Delft", "Vodafone", "Volkswagen"
          ].map((client) => (
            <span key={client} className="badge badge-lg badge-outline">
              {client}
            </span>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-base-200/30 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-serif">Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary font-serif">GitHub</h3>
              <ul className="space-y-2 text-base-content/80 text-sm">
                <li>• GitHub Administration</li>
                <li>• GitHub Actions</li>
                <li>• GitHub Advanced Security</li>
                <li>• GitHub Foundations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-primary font-serif">GitLab</h3>
              <ul className="space-y-2 text-base-content/80 text-sm">
                <li>• Partner Technical Engineer</li>
                <li>• DevOps Professional</li>
                <li>• Security Specialist</li>
                <li>• Services Engineer Professional</li>
                <li>• Migration Services Specialist</li>
                <li>• CI/CD Associate</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-primary font-serif">LaunchDarkly</h3>
              <ul className="space-y-2 text-base-content/80 text-sm">
                <li>• Platinum Developer</li>
                <li>• Gold Developer</li>
                <li>• Silver Developer</li>
                <li>• Bronze Developer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Interests Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-serif">Education</h2>
            <ul className="space-y-3 text-base-content/80">
              <li>
                <strong>Hons, Digital Media</strong><br />
                Birmingham City University
              </li>
              <li>
                <strong>AI and Ethics</strong><br />
                Trinity College Dublin (HCI CPD)
              </li>
              <li>
                <strong>MA in Applied Linguistics</strong> (Planned)<br />
                University of Pannonia, Hungary
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 font-serif">Personal Interests</h2>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary badge-lg">Sailing & Liveaboard</span>
              <span className="badge badge-primary badge-lg">SciFi & Futurism</span>
              <span className="badge badge-primary badge-lg">AI Ethics</span>
              <span className="badge badge-primary badge-lg">Technology</span>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notable Achievement</h3>
              <p className="text-base-content/80 text-sm">
                Awarded 'Best Use of Agile in the Private Sector' at the UK Agile Awards (2014)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Let's Work Together</h2>
          <p className="text-lg text-base-content/80 mb-8 max-w-2xl mx-auto">
            Available for consulting engagements, speaking opportunities, and strategic
            advisory roles. Based in UK/Hungary with international travel capability.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:kevin@reporacers.com"
              className="btn btn-primary btn-lg"
            >
              Email Me
            </a>
            <a
              href="tel:+447402083261"
              className="btn btn-outline btn-lg"
            >
              +44 7402 083261
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-base-content/60 text-sm">
          <p>© {new Date().getFullYear()} Kevin Ryan. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <a
              href="https://github.com/devopskev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/devopskev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://reporacers.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Repo Racers
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
