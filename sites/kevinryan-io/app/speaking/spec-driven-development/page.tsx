import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spec Driven Development — Session Brief',
  description:
    'A practical method for AI-native software engineering. One spec. Two agents. Five artefacts. Complete traceability from intent to verification.',
}

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --black:   #0A0A0A;
  --dark:    #111111;
  --mid:     #1A1A1A;
  --grey800: #2E2D2B;
  --grey600: #55524E;
  --grey400: #7A7772;
  --grey200: #D4D1CB;
  --grey100: #ECEAE5;
  --warm:    #F5F3EF;
  --lime:    #A8E10C;
  --red:     #CC3333;
}

html { scroll-behavior: smooth; }

#sdd-root {
  font-family: 'Archivo', sans-serif;
  background: var(--black);
  color: var(--grey400);
  line-height: 1.6;
}

/* ── UTILITIES ── */
.label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--lime);
  text-transform: uppercase;
  display: block;
  margin-bottom: 20px;
}
.label-dark { color: var(--grey400); }

section { padding: 96px 64px; }
.inner { max-width: 1160px; margin: 0 auto; }

h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(52px, 7vw, 96px);
  line-height: .88;
  letter-spacing: 1px;
}

/* ── HERO ── */
.hero {
  background: var(--black);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 64px;
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position: absolute;
  right: -100px; top: -100px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(168,225,12,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner { max-width: 1160px; margin: 0 auto; width: 100%; }

.hero-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--lime);
  text-transform: uppercase;
  margin-bottom: 28px;
}
.hero h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(72px, 12vw, 152px);
  line-height: .86;
  letter-spacing: 2px;
  color: var(--warm);
}
.hero h1 span { color: var(--lime); }

.hero-sub {
  font-size: clamp(16px, 2vw, 21px);
  color: var(--grey400);
  max-width: 680px;
  margin-top: 36px;
  line-height: 1.65;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin-top: 52px;
  border-top: 1px solid var(--grey800);
  border-bottom: 1px solid var(--grey800);
}
.hero-meta-item {
  padding: 18px 40px 18px 0;
  margin-right: 40px;
  border-right: 1px solid var(--grey800);
}
.hero-meta-item:last-child { border-right: none; }
.hero-meta-item .meta-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--grey600);
  text-transform: uppercase;
  margin-bottom: 5px;
}
.hero-meta-item .meta-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: var(--warm);
  letter-spacing: .5px;
}

/* ── THE HOOK ── */
.hook { background: var(--dark); }
.hook-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 48px;
}
.hook-card {
  padding: 32px 32px 32px 36px;
  border-left: 6px solid var(--lime);
  background: var(--mid);
}
.hook-card.dim { border-color: var(--grey600); }
.hook-card-tag {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px;
  letter-spacing: 3px;
  color: var(--lime);
  margin-bottom: 14px;
}
.hook-card.dim .hook-card-tag { color: var(--grey200); }
.hook-card p { font-size: 15px; line-height: 1.75; }
.hook-card strong { color: var(--warm); }

/* ── FOR WHO ── */
.forwho { background: var(--warm); }
.forwho h2 { color: var(--black); }
.forwho .label { color: var(--grey400); }
.forwho-sub { font-size: 18px; color: var(--grey600); max-width: 640px; margin-top: 16px; line-height: 1.6; }
.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 48px;
}
.audience-card {
  background: var(--black);
  border-left: 6px solid var(--lime);
  padding: 26px 24px;
}
.audience-role {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  color: var(--warm);
  letter-spacing: .5px;
  margin-bottom: 10px;
}
.audience-card p { font-size: 13px; color: var(--grey400); line-height: 1.7; }

/* ── WHAT THEY'LL LEAVE WITH ── */
.learnings { background: var(--black); }
.learnings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 48px;
}
.learning-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: var(--dark);
  border-left: 6px solid var(--lime);
  padding: 24px 24px 24px 26px;
}
.learning-n {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 42px;
  color: var(--lime);
  line-height: 1;
  min-width: 44px;
}
.learning-body h3 {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--warm);
  margin-bottom: 8px;
}
.learning-body p { font-size: 13px; line-height: 1.7; }

/* ── THE TALK ── */
.thetalk { background: var(--warm); }
.thetalk h2 { color: var(--black); }
.thetalk .label { color: var(--grey400); }
.arc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 48px;
}
.arc-item {
  background: var(--black);
  border-left: 6px solid var(--lime);
  padding: 26px 24px;
}
.arc-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  color: var(--lime);
  line-height: 1;
  margin-bottom: 10px;
}
.arc-item h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  color: var(--warm);
  letter-spacing: .5px;
  margin-bottom: 10px;
}
.arc-item p { font-size: 13px; color: var(--grey400); line-height: 1.7; }

/* ── COMPANION ── */
.companion { background: var(--mid); }
.companion h2 { color: var(--warm); }
.companion-link {
  display: inline-block;
  margin-top: 28px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: var(--lime);
  letter-spacing: 2px;
  text-decoration: none;
  border-bottom: 2px solid var(--lime);
  padding-bottom: 4px;
  transition: opacity .15s;
}
.companion-link:hover { opacity: .75; }

/* ── PRESENTER ── */
.presenter { background: var(--black); border-top: 1px solid var(--grey800); }
.presenter-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 64px;
  align-items: start;
}
.presenter-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 100px;
  line-height: .88;
  color: var(--warm);
  letter-spacing: 1px;
}
.presenter-name span { color: var(--lime); }
.presenter-role {
  font-size: 14px;
  font-weight: 700;
  color: var(--lime);
  margin-bottom: 6px;
}
.presenter-quote {
  font-size: 17px;
  font-style: italic;
  color: var(--grey400);
  border-left: 4px solid var(--lime);
  padding-left: 18px;
  margin: 20px 0 24px;
  line-height: 1.65;
}
.presenter-bio { font-size: 14px; color: var(--grey600); line-height: 1.75; max-width: 580px; }
.client-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.client-tag {
  background: var(--dark);
  border: 1px solid var(--grey800);
  padding: 6px 14px;
  font-size: 10px;
  font-weight: 700;
  color: var(--grey600);
  letter-spacing: .5px;
}

/* ── FORMAT ── */
.format { background: var(--dark); }
.format h2 { color: var(--warm); }
.format-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;
}
.format-item {
  border-left: 6px solid var(--lime);
  background: var(--black);
  padding: 22px 20px;
}
.format-item .f-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--grey600);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.format-item .f-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  color: var(--warm);
  letter-spacing: .5px;
  line-height: 1.1;
}

/* ── CTA ── */
.cta-section {
  background: var(--black);
  border-top: 1px solid var(--grey800);
  padding: 96px 64px;
  text-align: center;
}
.cta-section h2 { color: var(--warm); }
.cta-section h2 span { color: var(--lime); }
.cta-section p {
  font-size: 18px;
  color: var(--grey400);
  max-width: 560px;
  margin: 24px auto 0;
  line-height: 1.65;
}
.cta-contact {
  display: inline-flex;
  align-items: center;
  gap: 48px;
  margin-top: 52px;
  border: 1px solid var(--grey800);
  padding: 28px 40px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta-contact a {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: var(--lime);
  letter-spacing: 2px;
  text-decoration: none;
  transition: opacity .15s;
}
.cta-contact a:hover { opacity: .75; }
.cta-divider { color: var(--grey800); font-size: 20px; }

/* ── FOOTER ── */
footer {
  background: var(--dark);
  border-top: 2px solid var(--grey800);
  padding: 28px 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-brand {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px;
  letter-spacing: 2px;
}
footer nav { display: flex; gap: 32px; }
footer nav a { font-size: 13px; color: var(--grey600); text-decoration: none; }
footer nav a:hover { color: var(--lime); }
footer small { font-size: 12px; color: var(--grey600); }

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  section, .hero, .cta-section, footer { padding-left: 24px; padding-right: 24px; }
  .hook-grid, .learnings-grid, .presenter-grid { grid-template-columns: 1fr; }
  .audience-grid, .arc-grid { grid-template-columns: 1fr 1fr; }
  .format-grid { grid-template-columns: 1fr 1fr; }
  .presenter-name { font-size: 72px; }
}
@media (max-width: 600px) {
  .audience-grid, .arc-grid, .format-grid { grid-template-columns: 1fr; }
  .hero-meta { flex-direction: column; }
  .hero-meta-item { border-right: none; border-bottom: 1px solid var(--grey800); }
}
`

const html = `
<!-- ── HERO ── -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-kicker">Session Brief — Kevin Ryan</div>
    <h1>SPEC DRIVEN<br><span>DEVELOPMENT</span></h1>
    <p class="hero-sub">A practical method for AI-native software engineering. One spec. Two agents. Five artefacts. Complete traceability from intent to verification.</p>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <div class="meta-label">Format</div>
        <div class="meta-val">Talk + Q&amp;A</div>
      </div>
      <div class="hero-meta-item">
        <div class="meta-label">Duration</div>
        <div class="meta-val">45 + 15 min</div>
      </div>
      <div class="hero-meta-item">
        <div class="meta-label">Delivery</div>
        <div class="meta-val">In-Person or Remote</div>
      </div>
      <div class="hero-meta-item">
        <div class="meta-label">Audience</div>
        <div class="meta-val">Engineers &amp; Tech Leads</div>
      </div>
      <div class="hero-meta-item">
        <div class="meta-label">Prerequisite</div>
        <div class="meta-val">Experience with AI Coding Tools</div>
      </div>
    </div>
  </div>
</section>

<!-- ── THE HOOK ── -->
<section class="hook">
  <div class="inner">
    <span class="label">The Premise</span>
    <h2 style="color:var(--warm);">YOU'RE STUCK ON<br>THE BOTTOM RUNG.<br>THIS GETS YOU OFF IT.</h2>
    <div class="hook-grid">
      <div class="hook-card">
        <div class="hook-card-tag">The Method</div>
        <p>Spec Driven Development has roots in formal specification, design-by-contract, and the shift toward treating specs as executable artefacts. This session introduces a <strong>practical, open method</strong> — the provenance chain, the builder-tester separation, and the templates to implement it today.</p>
      </div>
      <div class="hook-card dim">
        <div class="hook-card-tag">The Problem</div>
        <p>90% of developers are stuck at Level 0–2 on Shapiro's maturity model — using AI as a faster tab key. They know there's a higher level but <strong>they don't have a method to get there.</strong> SDD is the method. Write a spec, delegate to agents, verify through provenance.</p>
      </div>
    </div>
    <p style="font-size:15px;color:var(--grey600);margin-top:28px;max-width:720px;line-height:1.7;">The unique contribution of this session is <strong style="color:var(--lime);">provenance</strong> — how agents communicate through documentation, how reasoning is captured as a byproduct of building, and how that creates compliance-ready evidence without additional effort.</p>
  </div>
</section>

<!-- ── WHO IT'S FOR ── -->
<section class="forwho">
  <div class="inner">
    <span class="label label-dark">Audience</span>
    <h2>WHO THIS<br>IS FOR.</h2>
    <p class="forwho-sub">This session is for the people who need to go back to their desk on Monday and start working differently. It gives them a method, three templates, and a workflow they can implement with tools they already have.</p>
    <div class="audience-grid">
      <div class="audience-card">
        <div class="audience-role">Senior Engineers<br>&amp; Tech Leads</div>
        <p>Writing code alongside AI assistants and feeling diminishing returns. This session gives them a structured method to move from coding with AI to directing AI — spec-first, provenance-driven, verifiable.</p>
      </div>
      <div class="audience-card">
        <div class="audience-role">Platform &amp;<br>DevEx Engineers</div>
        <p>Building the internal infrastructure that AI-native development depends on. This session shows them how SDD integrates with CI/CD, how provenance fits into existing toolchains, and why the .sdd directory structure matters.</p>
      </div>
      <div class="audience-card">
        <div class="audience-role">Engineering<br>Managers</div>
        <p>Responsible for quality and delivery in teams adopting AI tools. This session gives them a framework for separation of concerns, audit-ready documentation, and a process that doesn't depend on individual tool choices.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── KEY LEARNINGS ── -->
<section class="learnings">
  <div class="inner">
    <span class="label">Key Learnings</span>
    <h2 style="color:var(--warm);">WHAT YOUR AUDIENCE<br>WALKS AWAY WITH.</h2>
    <div class="learnings-grid">
      <div class="learning-item">
        <div class="learning-n">01</div>
        <div class="learning-body">
          <h3>The infinity loop — spec, provenance, scenarios</h3>
          <p>The SDD architecture: spec as the authority, provenance at the crossing, scenarios as evidence. Two agent roles communicating through documents, not orchestration frameworks. A workflow they can draw on a napkin.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">02</div>
        <div class="learning-body">
          <h3>Why provenance is the core innovation</h3>
          <p>Code is self-describing — any agent can read it. Provenance answers the questions code can't answer about itself: why is it this way? What was assumed? Where was the spec silent? The reasoning record that makes AI-built software navigable.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">03</div>
        <div class="learning-body">
          <h3>Builder-tester separation as an architectural principle</h3>
          <p>Why the agent that builds the software cannot be the agent that verifies it. Same principle as code review, enforced structurally through role definitions in the spec itself. Prose scenarios before test code.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">04</div>
        <div class="learning-body">
          <h3>Three templates they can use on Monday</h3>
          <p>The spec template with agent roles. The provenance template with builder and tester layers. The scenario template with prose-first verification. Markdown files. No SDK. No framework. No vendor lock-in.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">05</div>
        <div class="learning-body">
          <h3>Compliance as a byproduct, not a project</h3>
          <p>How SDD's provenance chain satisfies SOC 2 change management, ISO 27001 secure development requirements, and EU AI Act documentation obligations — produced automatically as part of the build, not retrofitted.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">06</div>
        <div class="learning-body">
          <h3>Where SDD sits in the landscape</h3>
          <p>What SDD does and doesn't give you. How it relates to LangGraph, CrewAI, Bloom, MCP, and other agent technologies. Why starting with the spec sharpens the thinking that makes every other tool more effective.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── THE TALK ── -->
<section class="thetalk">
  <div class="inner">
    <span class="label label-dark">Session Structure</span>
    <h2>HOW THE<br>SESSION RUNS.</h2>
    <div class="arc-grid">
      <div class="arc-item">
        <div class="arc-num">01</div>
        <h3>The Maturity Model</h3>
        <p>Where most developers actually sit on Shapiro's five levels. Why 90% are stuck at L0–2 and what it takes to move up. SDD as the practical method to reach L3–4.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">02</div>
        <h3>It's All About the Spec</h3>
        <p>The bottleneck has moved from implementation speed to specification quality. What a spec contains in SDD — requirements, architecture, agent roles, and process — all in one document.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">03</div>
        <h3>The Infinity Loop</h3>
        <p>The SDD architecture in detail. The builder agent, the testing agent, provenance as the communication protocol between them. Code as canonical context. The five artefacts and their purposes.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">04</div>
        <h3>Provenance &amp; Scenarios</h3>
        <p>Deep dive into provenance as the core innovation. Prose scenarios before test code. How failing tests become work orders, not bug reports. The fix cycle and the layered provenance document.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">05</div>
        <h3>Compliance &amp; Audit</h3>
        <p>SOC 2, ISO 27001, and the EU AI Act. How provenance satisfies documentation and traceability requirements as a byproduct of building. Your auditor's AI is going to ask how this was built.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">06</div>
        <h3>Q&amp;A</h3>
        <p>15 minutes structured Q&amp;A. Kevin works with these tools daily and handles implementation questions, edge cases, and "how does this work with my stack" directly.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── COMPANION ── -->
<section class="companion">
  <div class="inner">
    <span class="label">Companion Talk</span>
    <h2 style="color:var(--warm);">PAIRS WITH<br>THE DARK FACTORY.</h2>
    <p style="font-size:16px;color:var(--grey400);max-width:680px;margin-top:16px;line-height:1.7;">The Dark Factory is the strategy — the gap between AI-native software teams and everyone else, and what it takes to cross it. SDD is the execution — the practical method that makes the transition real. One sells the problem. The other sells the discipline. Together they tell the full story.</p>
    <a href="/speaking/dark-factory" class="companion-link">VIEW THE DARK FACTORY SESSION BRIEF →</a>
  </div>
</section>

<!-- ── PRESENTER ── -->
<section class="presenter">
  <div class="inner">
    <span class="label">The Presenter</span>
    <div class="presenter-grid">
      <div class="presenter-name">KEVIN<br><span>RYAN</span></div>
      <div>
        <p class="presenter-role">Kevin Ryan &amp; Associates — AI-Native · Platform Engineering · Author</p>
        <p class="presenter-quote">"I used to direct teams of software engineers. Now I coordinate AI agents."</p>
        <p class="presenter-bio">30 years in enterprise technology. 14 professional certifications including GitLab ×9 and GitHub ×4. 40+ enterprise clients and £20m+ in programme budgets delivered. Currently writing <em>Spec Driven Development: AI-Native Software Engineering</em> (sddbook.com) — the book that formalises the methodology this talk introduces. Published author of <em>AI Immigrants</em>. Remote-first. Budapest · Dublin · London.</p>
        <div class="client-tags">
          <span class="client-tag">CERN</span>
          <span class="client-tag">NESTLÉ</span>
          <span class="client-tag">NATWEST</span>
          <span class="client-tag">BBC WORLDWIDE</span>
          <span class="client-tag">FINANCIAL TIMES</span>
          <span class="client-tag">VODAFONE</span>
          <span class="client-tag">HELLOFRESH</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── FORMAT ── -->
<section class="format">
  <div class="inner">
    <span class="label">Logistics</span>
    <h2>FORMAT &amp;<br>REQUIREMENTS.</h2>
    <div class="format-grid">
      <div class="format-item">
        <div class="f-label">Duration</div>
        <div class="f-val">45 min talk<br>+ 15 min Q&amp;A</div>
      </div>
      <div class="format-item">
        <div class="f-label">Delivery</div>
        <div class="f-val">In-person<br>or remote</div>
      </div>
      <div class="format-item">
        <div class="f-label">Slides</div>
        <div class="f-val">Provided.<br>HTML/SVG deck.</div>
      </div>
      <div class="format-item">
        <div class="f-label">Audience size</div>
        <div class="f-val">Any —<br>scales well</div>
      </div>
    </div>
  </div>
</section>

<!-- ── CTA ── -->
<section class="cta-section">
  <div class="label" style="text-align:center;">Interested in hosting this session?</div>
  <h2>LET'S ARRANGE<br><span>A CONVERSATION.</span></h2>
  <p>If this sounds right for your audience, get in touch. We'll talk through the fit, the format, and what works for your context.</p>
  <div class="cta-contact">
    <a href="https://kevinryan.io">kevinryan.io</a>
    <span class="cta-divider">·</span>
    <a href="https://linkedin.com/in/kevinryan">LinkedIn</a>
    <span class="cta-divider">·</span>
    <a href="mailto:kevin@kevinryan.io">kevin@kevinryan.io</a>
  </div>
</section>

<!-- ── FOOTER ── -->
<footer>
  <div class="footer-brand"><span style="color:var(--warm);">KEVIN </span><span style="color:var(--lime);">RYAN</span></div>
  <small style="font-family:monospace;font-size:0.65rem;opacity:0.5;">${process.env.NEXT_PUBLIC_COMMIT_SHA}</small>
  <small>© 2026 Kevin Ryan &amp; Associates</small>
</footer>
`

export default function SpecDrivenDevelopmentPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="sdd-root"
        style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
