import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'
import AssessmentContactForm from '@/components/AssessmentContactForm'

export const metadata: Metadata = {
  title: 'AI-Native Readiness Assessment — Kevin Ryan & Associates',
  description:
    'A structured diagnostic that evaluates your organisation\'s capacity to realise measurable value from AI-assisted software development. Based on the DORA AI Capabilities Model.',
}

const css = `
#assessment-root {
  --lime: #A8E10C;
  --lime-dim: #92C40A;
  --black: #0A0A0A;
  --dark: #111111;
  --dark-mid: #1A1A1A;
  --grey-800: #2E2D2B;
  --grey-600: #55524E;
  --grey-400: #7A7772;
  --grey-200: #D4D1CB;
  --grey-100: #ECEAE5;
  --white: #F5F3EF;
  --pure-white: #FFFFFF;
  --font-display: 'Bebas Neue', sans-serif;
  --font-sans: 'Archivo', sans-serif;
  --max-width: 1400px;
  --pad: clamp(1.5rem, 5vw, 6rem);
}

#assessment-root {
  font-family: var(--font-sans);
  background: var(--white);
  color: var(--grey-600);
  font-size: 1.05rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

#assessment-root *, #assessment-root *::before, #assessment-root *::after { margin: 0; padding: 0; box-sizing: border-box; }

#assessment-root ::selection {
  background: var(--lime);
  color: var(--black);
}

#assessment-root a { color: var(--lime-dim); text-decoration: none; transition: color 0.2s; }
#assessment-root a:hover { color: var(--lime); }

/* ── Sections ── */
#assessment-root section {
  padding: 7rem var(--pad);
}
#assessment-root .section-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}
#assessment-root .bg-white { background: var(--white); }
#assessment-root .bg-grey { background: var(--grey-100); }
#assessment-root .bg-dark { background: var(--dark); color: var(--grey-200); }
#assessment-root .bg-black { background: var(--black); color: var(--grey-200); }

/* ── Typography ── */
#assessment-root .section-label {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--grey-400);
  margin-bottom: 0.75rem;
}
#assessment-root .bg-dark .section-label,
#assessment-root .bg-black .section-label { color: var(--grey-400); }

#assessment-root .section-number {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 5.5vw, 5.5rem);
  color: var(--lime);
  line-height: 0.88;
  margin-bottom: 0.5rem;
}

#assessment-root h1, #assessment-root h2, #assessment-root h3 {
  font-family: var(--font-display);
  color: var(--black);
  line-height: 0.92;
  letter-spacing: 0.02em;
}
#assessment-root .bg-dark h1, #assessment-root .bg-dark h2, #assessment-root .bg-dark h3,
#assessment-root .bg-black h1, #assessment-root .bg-black h2, #assessment-root .bg-black h3 { color: var(--pure-white); }

#assessment-root h1 { font-size: clamp(4.5rem, 13vw, 10rem); margin-bottom: 1.5rem; }
#assessment-root h2 { font-size: clamp(2.5rem, 7vw, 6rem); margin-bottom: 1.5rem; }
#assessment-root h3 { font-size: clamp(1.5rem, 3vw, 2.2rem); margin-bottom: 0.75rem; }

#assessment-root .subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--grey-600);
  max-width: 680px;
}
#assessment-root .bg-dark .subtitle,
#assessment-root .bg-black .subtitle { color: var(--grey-200); }

/* ── Hero ── */
#assessment-root .hero {
  padding-top: 140px !important;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
#assessment-root .hero h1 {
  font-size: clamp(4rem, 11vw, 9rem);
  max-width: 1000px;
}
#assessment-root .hero .subtitle {
  font-size: 1.2rem;
  max-width: 640px;
  margin-bottom: 2.5rem;
}
#assessment-root .hero-cta {
  display: inline-block;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--lime);
  padding: 1rem 2.5rem;
  border: 2px solid var(--lime);
  transition: all 0.25s;
}
#assessment-root .hero-cta:hover {
  background: transparent;
  color: var(--lime);
}
#assessment-root .hero-meta {
  margin-top: 3rem;
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}
#assessment-root .hero-meta-item {
  display: flex;
  flex-direction: column;
}
#assessment-root .hero-meta-label {
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--grey-400);
  margin-bottom: 0.25rem;
}
#assessment-root .hero-meta-value {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--black);
}

/* ── Thesis callout ── */
#assessment-root .thesis-block {
  border-left: 4px solid var(--lime);
  padding: 2rem 2.5rem;
  background: var(--grey-100);
  margin: 2rem 0;
  max-width: 800px;
}
#assessment-root .thesis-block p {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--grey-800);
  font-style: italic;
}
#assessment-root .thesis-block .source {
  font-style: normal;
  font-size: 0.8rem;
  color: var(--grey-400);
  margin-top: 0.75rem;
}

/* ── Stat grid ── */
#assessment-root .stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}
#assessment-root .stat-card {
  text-align: center;
  padding: 2rem 1rem;
}
#assessment-root .stat-number {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4.5rem);
  color: var(--lime);
  line-height: 1;
  margin-bottom: 0.5rem;
}
#assessment-root .stat-label {
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--grey-400);
}
#assessment-root .bg-dark .stat-label { color: var(--grey-400); }

/* ── Capability cards ── */
#assessment-root .cap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background: var(--grey-200);
  border: 1px solid var(--grey-200);
  margin: 2.5rem 0;
}
#assessment-root .cap-card {
  background: var(--white);
  padding: 2rem;
  transition: background 0.3s;
}
#assessment-root .cap-card:hover {
  background: var(--lime);
}
#assessment-root .cap-card:hover h3,
#assessment-root .cap-card:hover p,
#assessment-root .cap-card:hover .cap-outcome { color: var(--black); }
#assessment-root .cap-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}
#assessment-root .cap-card p {
  font-size: 0.92rem;
  line-height: 1.6;
  transition: color 0.3s;
}
#assessment-root .cap-outcome {
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lime-dim);
  margin-top: 1rem;
  transition: color 0.3s;
}

/* ── Phase timeline ── */
#assessment-root .phase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin: 3rem 0;
  border: 2px solid var(--black);
}
#assessment-root .phase-card {
  padding: 2.5rem 2rem;
  border-right: 1px solid var(--grey-200);
  position: relative;
}
#assessment-root .phase-card:last-child { border-right: none; }
#assessment-root .phase-number {
  font-family: var(--font-display);
  font-size: 3.5rem;
  color: var(--lime);
  line-height: 1;
  margin-bottom: 0.5rem;
}
#assessment-root .phase-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--black);
  letter-spacing: 0.02em;
  margin-bottom: 0.75rem;
}
#assessment-root .phase-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
#assessment-root .phase-output {
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--grey-400);
  padding-top: 0.75rem;
  border-top: 1px solid var(--grey-200);
}

/* ── Deliverables list ── */
#assessment-root .deliverables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;
}
#assessment-root .deliverable-item {
  padding: 1.5rem;
  border: 1px solid var(--grey-200);
  background: var(--white);
}
#assessment-root .bg-dark .deliverable-item {
  border-color: var(--grey-800);
  background: var(--dark-mid);
}
#assessment-root .deliverable-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}
#assessment-root .deliverable-item p {
  font-size: 0.88rem;
  line-height: 1.6;
}

/* ── Who for grid ── */
#assessment-root .audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin: 2.5rem 0;
}
#assessment-root .audience-card h3 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}
#assessment-root .audience-card p {
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ── Evidence ── */
#assessment-root .evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  margin: 2.5rem 0;
}
#assessment-root .evidence-item { text-align: center; }
#assessment-root .evidence-number {
  font-family: var(--font-display);
  font-size: clamp(4rem, 7vw, 6rem);
  color: var(--lime);
  line-height: 1;
}
#assessment-root .evidence-desc {
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--grey-600);
  margin-top: 0.5rem;
}
#assessment-root .evidence-source {
  font-size: 0.72rem;
  color: var(--grey-400);
  margin-top: 0.25rem;
  font-style: italic;
}

/* ── Client logos ── */
#assessment-root .client-strip {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  align-items: center;
  margin: 2rem 0;
}
#assessment-root .client-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  color: var(--grey-400);
  transition: color 0.3s;
}
#assessment-root .client-name:hover { color: var(--lime); }

/* ── CTA section ── */
#assessment-root .cta-section {
  text-align: left;
}
#assessment-root .cta-section h2 {
  margin-bottom: 1rem;
}
#assessment-root .cta-section .subtitle {
  margin-bottom: 2rem;
}
#assessment-root .cta-btn {
  display: inline-block;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--lime);
  padding: 1.1rem 3rem;
  border: 2px solid var(--lime);
  transition: all 0.25s;
  margin-right: 1rem;
}
#assessment-root .cta-btn:hover {
  background: transparent;
  color: var(--lime);
}
#assessment-root .cta-btn-ghost {
  display: inline-block;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pure-white);
  background: transparent;
  padding: 1.1rem 3rem;
  border: 2px solid var(--grey-600);
  transition: all 0.25s;
}
#assessment-root .cta-btn-ghost:hover {
  border-color: var(--lime);
  color: var(--lime);
}

/* ── Contact form ── */
#assessment-root .contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  margin-top: 1rem;
}
#assessment-root .contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
#assessment-root .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
#assessment-root .form-group label {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--grey-400);
}
#assessment-root .form-group input,
#assessment-root .form-group textarea,
#assessment-root .form-group select {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  background: var(--dark-mid);
  border: 1px solid var(--grey-800);
  color: var(--pure-white);
  outline: none;
  transition: border-color 0.2s;
  border-radius: 0;
}
#assessment-root .form-group input::placeholder,
#assessment-root .form-group textarea::placeholder {
  color: var(--grey-600);
}
#assessment-root .form-group input:focus,
#assessment-root .form-group textarea:focus,
#assessment-root .form-group select:focus {
  border-color: var(--lime);
}
#assessment-root .form-group textarea {
  resize: vertical;
  min-height: 100px;
}
#assessment-root .form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7772' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}
#assessment-root .form-group select option {
  background: var(--dark-mid);
  color: var(--pure-white);
}
#assessment-root .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
#assessment-root .form-submit {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--lime);
  padding: 1.1rem 3rem;
  border: 2px solid var(--lime);
  cursor: pointer;
  transition: all 0.25s;
  align-self: flex-start;
  border-radius: 0;
}
#assessment-root .form-submit:hover {
  background: transparent;
  color: var(--lime);
}
#assessment-root .form-note {
  font-size: 0.75rem;
  color: var(--grey-600);
  line-height: 1.5;
}
@media (max-width: 900px) {
  #assessment-root .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  #assessment-root .form-row {
    grid-template-columns: 1fr;
  }
}

/* ── Responsive ── */
@media (max-width: 900px) {
  #assessment-root .phase-grid {
    grid-template-columns: 1fr;
  }
  #assessment-root .phase-card { border-right: none; border-bottom: 1px solid var(--grey-200); }
  #assessment-root .phase-card:last-child { border-bottom: none; }
  #assessment-root h1 { font-size: clamp(3rem, 10vw, 6rem); }
}
@media (max-width: 600px) {
  #assessment-root .hero-meta { gap: 1.5rem; }
}
`

const html = `
<!-- ── Hero ── -->
<section class="hero bg-white">
  <div class="section-inner">
    <div class="section-label">Kevin Ryan &amp; Associates</div>
    <h1>AI-NATIVE READINESS ASSESSMENT</h1>
    <p class="subtitle">
      A structured diagnostic that evaluates your organisation's capacity to realise measurable value from AI-assisted software development. Based on the DORA AI Capabilities Model. Enhanced with Spec-Driven Development methodology.
    </p>
    <a href="#contact" class="hero-cta">Book a Discovery Call</a>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <span class="hero-meta-label">Framework</span>
        <span class="hero-meta-value">DORA AI Capabilities Model</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Duration</span>
        <span class="hero-meta-value">3–5 Weeks</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Delivery</span>
        <span class="hero-meta-value">Remote or On-Site</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Audience</span>
        <span class="hero-meta-value">Engineering Leaders</span>
      </div>
    </div>
  </div>
</section>

<!-- ── The Problem ── -->
<section class="bg-dark">
  <div class="section-inner">
    <div class="section-number">01</div>
    <div class="section-label">The Problem</div>
    <h2>YOU BOUGHT THE TOOLS. WHERE ARE THE RESULTS?</h2>
    <p class="subtitle">
      90% of technology professionals now use AI at work. Most organisations have invested in licences. But DORA's 2025 research — based on nearly 5,000 professionals — reveals a critical truth: AI adoption alone has only a modest impact on performance. Without the right foundations, you're amplifying dysfunction, not delivery.
    </p>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-number">90%</div>
        <div class="stat-label">Of professionals using AI at work</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">~5K</div>
        <div class="stat-label">Professionals surveyed by DORA</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">7</div>
        <div class="stat-label">Capabilities proven to amplify AI's impact</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">19%</div>
        <div class="stat-label">Slower — devs using AI on own codebases (METR RCT)</div>
      </div>
    </div>
    <div class="thesis-block" style="background: var(--dark-mid); border-left-color: var(--lime);">
      <p style="color: var(--grey-200);">AI is an amplifier. It magnifies the strengths of high-performing organisations and the dysfunctions of struggling ones. The greatest returns come not from the tools themselves, but from investing in the foundational systems that enable success.</p>
      <div class="source">— DORA State of AI-assisted Software Development, 2025</div>
    </div>
  </div>
</section>

<!-- ── What We Assess ── -->
<section class="bg-white">
  <div class="section-inner">
    <div class="section-number">02</div>
    <div class="section-label">The Seven Capabilities</div>
    <h2>WHAT WE ASSESS.</h2>
    <p class="subtitle">
      The assessment evaluates your organisation against the seven foundational capabilities identified by DORA's research as proven amplifiers of AI's positive impact on performance.
    </p>
    <div class="cap-grid">
      <div class="cap-card">
        <h3>CLEAR &amp; COMMUNICATED AI STANCE</h3>
        <p>Ambiguity creates risk. A clear policy provides the psychological safety needed for effective experimentation.</p>
        <div class="cap-outcome">→ Individual effectiveness · Org performance · Throughput</div>
      </div>
      <div class="cap-card">
        <h3>HEALTHY DATA ECOSYSTEMS</h3>
        <p>The benefits of AI are significantly amplified by high-quality, accessible, and unified internal data.</p>
        <div class="cap-outcome">→ Organisational performance</div>
      </div>
      <div class="cap-card">
        <h3>AI-ACCESSIBLE INTERNAL DATA</h3>
        <p>Connecting AI to your internal documentation and codebases moves it from a generic assistant to a specialised expert.</p>
        <div class="cap-outcome">→ Individual effectiveness · Code quality</div>
      </div>
      <div class="cap-card">
        <h3>STRONG VERSION CONTROL PRACTICES</h3>
        <p>As AI increases the velocity of change, version control becomes the critical safety net that enables confident experimentation.</p>
        <div class="cap-outcome">→ Individual effectiveness · Team performance</div>
      </div>
      <div class="cap-card">
        <h3>WORKING IN SMALL BATCHES</h3>
        <p>This discipline counteracts the risk of AI generating large, unstable changes, ensuring that speed translates to better product performance.</p>
        <div class="cap-outcome">→ Product performance · Reduced friction</div>
      </div>
      <div class="cap-card">
        <h3>USER-CENTRIC FOCUS</h3>
        <p>A focus on user needs ensures AI-accelerated teams are moving quickly in the right direction. Without it, AI adoption actively harms team performance.</p>
        <div class="cap-outcome">→ Team performance (positive and negative)</div>
      </div>
      <div class="cap-card">
        <h3>QUALITY INTERNAL PLATFORMS</h3>
        <p>A platform provides the automated, secure pathways that allow AI's benefits to scale across the organisation.</p>
        <div class="cap-outcome">→ Organisational performance</div>
      </div>
      <div class="cap-card" style="display:flex; align-items:center; justify-content:center;">
        <div>
          <h3 style="color: var(--lime-dim);">+ SPECIFICATION QUALITY</h3>
          <p>DORA identifies the gap. SDD fills it. Specification quality is the shifted bottleneck in AI-native development — AI can only be as good as the spec it receives.</p>
          <div class="cap-outcome">→ The Kevin Ryan &amp; Associates differentiator</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── How It Works ── -->
<section class="bg-grey">
  <div class="section-inner">
    <div class="section-number">03</div>
    <div class="section-label">The Engagement</div>
    <h2>HOW IT WORKS.</h2>
    <p class="subtitle" style="margin-bottom: 1rem;">
      Four phases. Discrete deliverables at each stage. A clear narrative arc from diagnosis to action.
    </p>
    <div class="phase-grid">
      <div class="phase-card">
        <div class="phase-number">01</div>
        <div class="phase-title">DIAGNOSE</div>
        <p class="phase-desc">Capability survey across all seven DORA dimensions. Stakeholder interviews. Team skills self-assessment sessions. Map your team archetype.</p>
        <div class="phase-output">Output: Capability radar · Team archetype · Skills heatmap</div>
      </div>
      <div class="phase-card">
        <div class="phase-number">02</div>
        <div class="phase-title">LOCATE</div>
        <p class="phase-desc">Value stream mapping workshop. Identify where work is waiting, not working. Specification quality audit. Find the real bottlenecks.</p>
        <div class="phase-output">Output: Annotated VSM · Flow metrics · Spec maturity assessment</div>
      </div>
      <div class="phase-card">
        <div class="phase-number">03</div>
        <div class="phase-title">PRIORITISE</div>
        <p class="phase-desc">Facilitated team workshop. Impact/effort mapping. Ruthless prioritisation. Commit to a first step with ownership and success criteria.</p>
        <div class="phase-output">Output: Prioritised backlog · Committed first action</div>
      </div>
      <div class="phase-card">
        <div class="phase-number">04</div>
        <div class="phase-title">MEASURE</div>
        <p class="phase-desc">Define leading indicators (capability maturity) and lagging indicators (DORA outcomes). Establish baselines. Build the measurement playbook.</p>
        <div class="phase-output">Output: Metrics playbook · Baseline values · 90-day check-in</div>
      </div>
    </div>
  </div>
</section>

<!-- ── What You Get ── -->
<section class="bg-dark">
  <div class="section-inner">
    <div class="section-number">04</div>
    <div class="section-label">Deliverables</div>
    <h2>WHAT YOU GET.</h2>
    <p class="subtitle">Every assessment produces a set of actionable deliverables. This is a roadmap, not a slide deck.</p>
    <div class="deliverables-grid">
      <div class="deliverable-item">
        <h3>EXECUTIVE REPORT</h3>
        <p>10–15 page report for leadership: current state, key findings, prioritised recommendations, and the business case for investment.</p>
      </div>
      <div class="deliverable-item">
        <h3>CAPABILITY RADAR</h3>
        <p>Visual representation of capability maturity across all seven dimensions, mapped to DORA team archetypes.</p>
      </div>
      <div class="deliverable-item">
        <h3>VALUE STREAM MAP</h3>
        <p>Current-state and future-state maps with process time, wait time, and flow efficiency for each step.</p>
      </div>
      <div class="deliverable-item">
        <h3>SKILLS GAP ANALYSIS</h3>
        <p>Team skills heatmap with identified capability gaps and recommended training priorities.</p>
      </div>
      <div class="deliverable-item">
        <h3>SPEC QUALITY ASSESSMENT</h3>
        <p>Maturity assessment of how work is specified and communicated to AI tools, with SDD-informed recommendations.</p>
      </div>
      <div class="deliverable-item">
        <h3>IMPROVEMENT BACKLOG</h3>
        <p>Impact/effort mapped initiatives with owners, success criteria, and a committed first step.</p>
      </div>
      <div class="deliverable-item">
        <h3>METRICS PLAYBOOK</h3>
        <p>Leading and lagging indicators, collection methods, target cadence, ownership, and baseline values.</p>
      </div>
      <div class="deliverable-item">
        <h3>90-DAY CHECK-IN</h3>
        <p>A follow-up review to evaluate progress on committed actions and recalibrate priorities.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── Who This Is For ── -->
<section class="bg-white">
  <div class="section-inner">
    <div class="section-number">05</div>
    <div class="section-label">Audience</div>
    <h2>WHO THIS IS FOR.</h2>
    <div class="audience-grid">
      <div class="audience-card">
        <h3>CTOs &amp;<br>VPs ENGINEERING</h3>
        <p>You've invested in AI tooling. Adoption is patchy. You need evidence-based guidance on where to invest next and a framework to justify that investment to the board.</p>
      </div>
      <div class="audience-card">
        <h3>HEADS OF<br>PLATFORM</h3>
        <p>Your platform is the distribution layer for AI's benefits. This assessment shows where your platform is amplifying value — and where it's creating bottlenecks.</p>
      </div>
      <div class="audience-card">
        <h3>ENGINEERING<br>MANAGERS</h3>
        <p>Your teams are using AI but results are inconsistent. You need a diagnostic that names the gaps and a workshop that gets your team aligned on what to fix first.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── The Evidence ── -->
<section class="bg-grey">
  <div class="section-inner">
    <div class="section-number">06</div>
    <div class="section-label">Evidence Base</div>
    <h2>RESEARCH-BACKED. NOT OPINION-BASED.</h2>
    <p class="subtitle" style="margin-bottom: 1rem;">
      This assessment is grounded in the 2025 DORA AI Capabilities Model — the most comprehensive study of AI in software development to date. Every capability, every outcome measure, every team archetype is validated through rigorous research.
    </p>
    <div class="evidence-grid">
      <div class="evidence-item">
        <div class="evidence-number">~5,000</div>
        <div class="evidence-desc">Technology professionals surveyed</div>
        <div class="evidence-source">DORA 2025</div>
      </div>
      <div class="evidence-item">
        <div class="evidence-number">100+</div>
        <div class="evidence-desc">Hours of qualitative research data</div>
        <div class="evidence-source">DORA 2025</div>
      </div>
      <div class="evidence-item">
        <div class="evidence-number">7</div>
        <div class="evidence-desc">Validated AI capabilities</div>
        <div class="evidence-source">DORA AI Capabilities Model</div>
      </div>
      <div class="evidence-item">
        <div class="evidence-number">SDD</div>
        <div class="evidence-desc">Spec-Driven Development referenced as an emerging methodology in the DORA AI Capabilities Model</div>
        <div class="evidence-source">DORA AI Capabilities Model, p.55</div>
      </div>
    </div>
  </div>
</section>

<!-- ── Credibility ── -->
<section class="bg-black">
  <div class="section-inner">
    <div class="section-number">07</div>
    <div class="section-label">The Presenter</div>
    <h2>KEVIN RYAN</h2>
    <p class="subtitle">
      30 years in enterprise technology. 14 professional certifications including GitLab ×9 and GitHub ×4. Currently writing <em>Spec Driven Development: AI-Native Software Engineering</em>. Published author of <em>AI Immigrants</em>. Remote-first. Budapest · Dublin · London.
    </p>
    <div class="client-strip">
      <span class="client-name">CERN</span>
      <span class="client-name">NESTLÉ</span>
      <span class="client-name">NATWEST</span>
      <span class="client-name">BBC WORLDWIDE</span>
      <span class="client-name">FINANCIAL TIMES</span>
      <span class="client-name">VODAFONE</span>
      <span class="client-name">HELLOFRESH</span>
    </div>
  </div>
</section>

`


export default function AssessmentPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div id="assessment-root">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <section className="bg-dark cta-section" id="contact" style={{ padding: '7rem var(--pad)' }}>
          <div className="section-inner">
            <div className="section-label">Interested?</div>
            <h2>LET&rsquo;S ARRANGE A CONVERSATION.</h2>
            <div className="contact-layout">
              <div>
                <p className="subtitle">
                  If this sounds right for your organisation, get in touch.
                  We&rsquo;ll talk through the fit, the scope, and what works for your context.
                  No pitch deck. Just a conversation.
                </p>
                <p className="subtitle" style={{ marginTop: '1.5rem' }}>
                  You can also reach me directly at{' '}
                  <a href="mailto:kevin@kevinryan.io">kevin@kevinryan.io</a> or connect on{' '}
                  <a href="https://linkedin.com/in/devopskev">LinkedIn</a>.
                </p>
              </div>
              <AssessmentContactForm />
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  )
}
