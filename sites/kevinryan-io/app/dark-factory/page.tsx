import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Dark Factory — Session Brief',
  description:
    'A talk for engineering leaders on the gap between AI-native software teams and everyone else — and what it takes to cross it.',
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

#dark-factory-root {
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
  font-size: clamp(80px, 13vw, 172px);
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

/* ── THE EVIDENCE ── */
.evidence { background: var(--dark); }
.evidence-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;
}
.stat {
  background: var(--black);
  border-left: 6px solid var(--lime);
  padding: 20px 18px;
}
.stat-n {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 58px;
  color: var(--lime);
  line-height: 1;
}
.stat-n.red { color: var(--red); }
.stat p { font-size: 12px; color: var(--grey400); line-height: 1.6; margin-top: 8px; }
.stat .source { font-size: 10px; color: var(--grey600); margin-top: 6px; font-style: italic; }

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
  .evidence-grid, .format-grid { grid-template-columns: 1fr 1fr; }
  .presenter-name { font-size: 72px; }
}
@media (max-width: 600px) {
  .audience-grid, .arc-grid, .evidence-grid, .format-grid { grid-template-columns: 1fr; }
  .hero-meta { flex-direction: column; }
  .hero-meta-item { border-right: none; border-bottom: 1px solid var(--grey800); }
}
`

const html = `
<!-- ── HERO ── -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-kicker">Session Brief — Kevin Ryan</div>
    <h1>THE DARK<br><span>FACTORY</span></h1>
    <p class="hero-sub">The gap between AI-native software teams and everyone else — and what it takes to cross it.</p>
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
        <div class="meta-val">Engineering Leaders</div>
      </div>
      <div class="hero-meta-item">
        <div class="meta-label">Level</div>
        <div class="meta-val">Intermediate — Advanced</div>
      </div>
    </div>
  </div>
</section>

<!-- ── THE HOOK ── -->
<section class="hook">
  <div class="inner">
    <span class="label">The Premise</span>
    <h2 style="color:var(--warm);">TWO REALITIES.<br>SAME INDUSTRY.<br>SAME YEAR.</h2>
    <div class="hook-grid">
      <div class="hook-card">
        <div class="hook-card-tag">The Frontier</div>
        <p>Boris Cherny, Claude Code lead at Anthropic, confirmed in March 2026 that <strong>Claude Code is 100% written by Claude Code.</strong> StrongDM ships production software with 3 engineers, zero humans writing code, and $1,000 per engineer per day in AI compute.</p>
      </div>
      <div class="hook-card dim">
        <div class="hook-card-tag">The Rest</div>
        <p>A 2025 METR randomised control trial found experienced developers using frontier AI tools completed tasks <strong>19% slower</strong> than without. They believed they were 24% faster. Wrong on direction and magnitude.</p>
      </div>
    </div>
    <p style="font-size:15px;color:var(--grey600);margin-top:28px;max-width:720px;line-height:1.7;">This talk is about the gap between those two realities — what's causing it, what the transition actually looks like, and why most organisations are misreading the signals.</p>
  </div>
</section>

<!-- ── WHO IT'S FOR ── -->
<section class="forwho">
  <div class="inner">
    <span class="label label-dark">Audience</span>
    <h2>WHO THIS<br>IS FOR.</h2>
    <p class="forwho-sub">This session is built for the people responsible for engineering capability and delivery — not developers in general, but the leaders making decisions about how AI fits into how their teams work.</p>
    <div class="audience-grid">
      <div class="audience-card">
        <div class="audience-role">CTOs &amp;<br>VPs Engineering</div>
        <p>Making investment decisions on AI tooling, team structure, and capability. This session gives them the framework to evaluate where they are and a clear-eyed view of what the transition requires.</p>
      </div>
      <div class="audience-card">
        <div class="audience-role">Engineering<br>Managers &amp; Leads</div>
        <p>Running teams day-to-day and feeling the gap between the AI productivity narrative and what they actually see. This session names the J-curve and gives them language and evidence to work with.</p>
      </div>
      <div class="audience-card">
        <div class="audience-role">Platform &amp;<br>DevEx Teams</div>
        <p>Building the internal infrastructure that AI-native development depends on. This session connects their work directly to the org-level transition — and explains why CI/CD and toolchain choices are now strategic decisions.</p>
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
          <h3>A precise map of where their team actually sits</h3>
          <p>Dan Shapiro's Five Levels of Vibe Coding — from spicy autocomplete to the dark factory — gives leaders a concrete framework to assess their current state. Most discover they're two levels behind where they thought they were.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">02</div>
        <div class="learning-body">
          <h3>Why the productivity dip is not a failure signal</h3>
          <p>The DORA 2024 data on the J-curve — why every 25% increase in AI adoption correlates with a short-term drop in throughput and stability, and why organisations that push through it come out the other side ahead.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">03</div>
        <div class="learning-body">
          <h3>What a real dark factory looks like in production</h3>
          <p>A detailed breakdown of StrongDM's architecture — external scenarios as holdout sets, digital twin universe, no humans writing or reviewing code — so leaders can distinguish genuine AI-native practice from marketing noise.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">04</div>
        <div class="learning-body">
          <h3>The brownfield migration path</h3>
          <p>You cannot dark factory your way through a legacy system. A four-stage migration path for organisations with real codebases, real teams, and real constraints — starting where they are, not where they wish they were.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">05</div>
        <div class="learning-body">
          <h3>Where to invest now</h3>
          <p>The bottleneck has moved from implementation speed to specification quality and AI-native execution. Concrete guidance on where to direct engineering investment, upskilling, and org design in 2026.</p>
        </div>
      </div>
      <div class="learning-item">
        <div class="learning-n">06</div>
        <div class="learning-body">
          <h3>The talent and economics picture</h3>
          <p>Junior developer employment down 67% in the US. AI-native startups generating 5–6× the revenue per employee of traditional SaaS. The structural shifts that make this transition urgent — not optional.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── THE EVIDENCE ── -->
<section class="evidence">
  <div class="inner">
    <span class="label">The Evidence</span>
    <h2 style="color:var(--warm);">EVIDENCE-BASED.<br>NOT HYPE.</h2>
    <p style="font-size:15px;color:var(--grey600);max-width:680px;margin-top:16px;line-height:1.7;">Every claim in this session is sourced. The talk draws on peer-reviewed research, industry data, and first-hand accounts from the teams operating at the frontier.</p>
    <div class="evidence-grid">
      <div class="stat">
        <div class="stat-n red">19%</div>
        <p>Slower. Experienced developers using frontier AI tools on their own codebases.</p>
        <div class="source">METR RCT, Becker et al., 2025 — arxiv.org/abs/2507.09089</div>
      </div>
      <div class="stat">
        <div class="stat-n">100%</div>
        <p>Of Claude Code written by Claude Code. Confirmed by Boris Cherny, March 2026.</p>
        <div class="source">Anthropic / Boris Cherny, X, March 7 2026</div>
      </div>
      <div class="stat">
        <div class="stat-n red">67%</div>
        <p>Decline in US junior developer job postings since peak.</p>
        <div class="source">Stanford Digital Economy Lab / ADP payroll data, 2025</div>
      </div>
      <div class="stat">
        <div class="stat-n">$3.5M</div>
        <p>Revenue per employee at top AI-native startups vs $610K SaaS average.</p>
        <div class="source">Jeremiah Owyang, May 2025 — Cursor, Midjourney, Lovable</div>
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
        <h3>The Paradox</h3>
        <p>Open with the two realities — the dark factory frontier and the METR slowdown. Sets up the core tension and establishes that this isn't a binary "AI works / AI doesn't work" debate.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">02</div>
        <h3>The Five Levels</h3>
        <p>Dan Shapiro's framework. Where the audience sits, where the ceiling is, and what distinguishes each level. The psychological barrier at Level 3 — letting go of the code — is where most teams stall.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">03</div>
        <h3>Proof of Concept</h3>
        <p>Inside StrongDM's architecture. External scenarios, digital twins, $1k/engineer/day compute. The hyperscalers — Anthropic and OpenAI — building their own tools with their own tools.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">04</div>
        <h3>Why Most Orgs Are Stuck</h3>
        <p>The J-curve. The Copilot trap. Org structures designed for a world where humans write code. The talent cliff. The economics of AI-native companies and what they imply for everyone else.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">05</div>
        <h3>The Path Forward</h3>
        <p>The brownfield migration. Where to invest. Spec quality and AI-native execution as the new bottleneck. Practical guidance for organisations starting where they are, not where they wish they were.</p>
      </div>
      <div class="arc-item">
        <div class="arc-num">06</div>
        <h3>Q&amp;A</h3>
        <p>15 minutes structured Q&amp;A. Kevin has a comprehensive briefing document covering the most commonly challenged claims — METR study design, data sourcing, confidence levels — and handles hard questions directly.</p>
      </div>
    </div>
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
        <p class="presenter-bio">30 years in enterprise technology. 14 professional certifications including GitLab ×9 and GitHub ×4. 40+ enterprise clients and £20m+ in programme budgets delivered. Currently writing <em>Spec Driven Development</em> (sddbook.com) — a book directly addressing the spec quality bottleneck this talk describes. Published author of <em>AI Immigrants</em>. Remote-first. Budapest · Dublin · London.</p>
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
      <div class="format-item">
        <div class="f-label">Slide Deck</div>
        <div class="f-val"><a href="/dark-factory/deck" style="color:var(--lime);text-decoration:none;">Preview →</a></div>
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

export default function DarkFactoryPage() {
  return (
    <>
      {/* Load italic Archivo variants not included in root layout */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="dark-factory-root"
        style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
