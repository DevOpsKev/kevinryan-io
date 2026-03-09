import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spec Driven Development — Slide Deck',
  description: 'Interactive slide deck: Spec Driven Development by Kevin Ryan.',
}

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
html, body { overflow:hidden; background:#000; }

#sdd-deck-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  overflow: hidden;
}

#wrapper {
  position:absolute;
  width:1280px; height:720px;
  transform-origin:top left;
}

.slide {
  position:absolute;
  width:1280px; height:720px;
  overflow:hidden; display:none;
}
.slide.active { display:block; }

/* ── Common atoms ────────────────────────────── */
.stag {
  position:absolute; top:40px; left:64px;
  font-family:'Archivo',sans-serif;
  font-size:11px; font-weight:700;
  letter-spacing:3.5px; color:#A8E10C;
  text-transform:uppercase;
}

.snum {
  position:absolute; left:38px; bottom:28px;
  font-family:'Bebas Neue',sans-serif; font-size:18px;
}
.logo {
  position:absolute; right:38px; bottom:24px;
  font-family:'Archivo',sans-serif; font-size:13px; font-weight:700; text-align:right;
}

/* ── Cards ────────────────────────────────────── */
.card {
  position:absolute;
  border-left:8px solid #A8E10C;
}
.card-dk  { background:#111111; }
.card-lt  { background:#ECEAE5; }

/* ── Navigation ─────────────────────────────── */
#nav {
  position:fixed; bottom:18px; left:50%;
  transform:translateX(-50%);
  z-index:9999;
  display:flex; align-items:center; gap:10px;
  background:rgba(10,10,10,0.93);
  border:1px solid #2E2D2B;
  padding:7px 18px; border-radius:100px;
  backdrop-filter:blur(10px);
}
#nav button {
  background:none; border:1px solid #2E2D2B;
  color:#7A7772; height:28px; cursor:pointer;
  font-size:14px; border-radius:4px;
  transition:all 0.15s; padding:0 10px;
  font-family:'Archivo',sans-serif;
}
#nav button:hover { border-color:#A8E10C; color:#A8E10C; }
#counter {
  font-family:'Bebas Neue',sans-serif;
  font-size:20px; color:#7A7772;
  min-width:60px; text-align:center;
  letter-spacing:1px;
}
`

const slidesHtml = `
<div id="wrapper">

<!-- ═══════════════════════════════════════════════ SLIDE 01 TITLE -->
<div class="slide active" style="background:#0A0A0A;">
  <div class="stag">Spec Driven Development</div>

  <div style="position:absolute;left:64px;top:88px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:158px;line-height:.9;color:#fff;letter-spacing:2px;">SPEC DRIVEN</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:158px;line-height:.9;color:#A8E10C;letter-spacing:2px;">DEVELOPMENT</div>
  </div>

  <div style="position:absolute;left:64px;top:468px;width:900px;font-family:'Archivo',sans-serif;font-size:18px;color:#7A7772;line-height:1.6;">
    A methodology for AI-native software engineering.<br>One spec. Two agents. Complete traceability.
  </div>

  <div style="position:absolute;left:64px;top:554px;display:flex;gap:14px;">
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">MARKDOWN</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">NO FRAMEWORK</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">NO SDK</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">OPEN PROCESS</span>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">01</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 02 WHAT IS SDD -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Context</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">WHAT IS <span style="color:#A8E10C;">SDD?</span></div>

  <div style="position:absolute;left:64px;top:220px;width:740px;font-family:'Archivo',sans-serif;font-size:16px;color:#55524E;line-height:1.7;">Spec Driven Development has roots in formal specification, design-by-contract, and the broader shift toward treating specifications as executable artefacts. StrongDM, Anthropic, and others are already building production software from specs using AI agents.</div>

  <div style="position:absolute;left:64px;top:340px;width:740px;height:2px;background:#D4D1CB;"></div>

  <div style="position:absolute;left:64px;top:362px;width:740px;font-family:'Archivo',sans-serif;font-size:16px;color:#0A0A0A;font-weight:700;line-height:1.7;">This presentation introduces a practical method for putting SDD into practice.</div>

  <div style="position:absolute;left:64px;top:418px;width:740px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.7;">The unique contribution is <strong style="color:#A8E10C;">provenance</strong> — the mechanism that makes specification-driven workflows auditable, traceable, and verifiable. How agents communicate through documentation. How reasoning is captured as a byproduct of building. How that creates compliance-ready evidence without additional effort.</div>

  <div style="position:absolute;right:52px;top:90px;width:380px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">SDD EXISTS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">The concept of building software from specifications using AI agents is established and in production today.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">WHAT'S NEW HERE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">A concrete, open method — the provenance chain, the builder-tester separation, and the templates to implement it today.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">WHAT YOU'LL LEAVE WITH</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">A workflow, three templates, and the understanding of why provenance is the core innovation.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">02</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 03 THE MATURITY MODEL -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Problem</div>

  <div style="position:absolute;left:64px;top:90px;width:1152px;font-family:'Bebas Neue',sans-serif;font-size:88px;color:#0A0A0A;letter-spacing:1px;">NOT ALL AI CODING IS EQUAL.</div>

  <div style="position:absolute;left:64px;top:258px;width:820px;font-family:'Archivo',sans-serif;font-size:17px;color:#55524E;line-height:1.55;">Dan Shapiro's Five Levels of Vibe Coding maps where teams actually operate — vs where they think they are.</div>

  <div style="position:absolute;left:64px;top:328px;font-family:'Archivo',sans-serif;font-size:15px;font-style:italic;color:#7A7772;">← 90% of developers are here</div>

  <svg style="position:absolute;left:0;top:325px;" width="1280" height="340" viewBox="0 -30 1280 340">
    <rect x="64"  y="225" width="164" height="40"  fill="#D4D1CB"/>
    <rect x="262" y="183" width="164" height="82"  fill="#D4D1CB"/>
    <rect x="460" y="135" width="164" height="130" fill="#D4D1CB"/>
    <rect x="658" y="90"  width="164" height="175" fill="#2E2D2B"/>
    <rect x="856" y="55"  width="164" height="210" fill="#2E2D2B"/>
    <rect x="1054" y="0" width="164" height="265" fill="#A8E10C"/>

    <text x="146"  y="215" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#7A7772">L0</text>
    <text x="344"  y="173" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#7A7772">L1</text>
    <text x="542"  y="125" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#7A7772">L2</text>
    <text x="740"  y="80"  text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#7A7772">L3</text>
    <text x="938"  y="45"  text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#0A0A0A">L4</text>
    <text x="1136" y="-10" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="22" fill="#A8E10C">L5</text>

    <text x="146"  y="285" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#7A7772">Spicy Autocomplete</text>
    <text x="344"  y="285" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#7A7772">Coding Intern</text>
    <text x="542"  y="285" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#7A7772">Junior Developer</text>
    <text x="740"  y="285" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#55524E">Developer as Manager</text>
    <text x="938"  y="285" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#0A0A0A">Developer as Product Owner</text>
    <text x="1136" y="295" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="11" fill="#A8E10C" font-weight="700">Dark Factory</text>
  </svg>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">03</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 04 SDD GETS YOU OFF THE BOTTOM RUNG -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Opportunity</div>

  <div style="position:absolute;left:64px;top:80px;font-family:'Bebas Neue',sans-serif;font-size:96px;line-height:.9;color:#fff;letter-spacing:1px;">SDD GETS YOU<br>TO <span style="color:#A8E10C;">LEVEL 3–4.</span></div>

  <div style="position:absolute;left:64px;top:310px;width:700px;font-family:'Archivo',sans-serif;font-size:16px;color:#7A7772;line-height:1.7;">Level 5 — the fully autonomous dark factory — that's a whole different problem set. Different tooling, different organisational structure, different economics.</div>

  <div style="position:absolute;left:64px;top:400px;width:700px;font-family:'Archivo',sans-serif;font-size:16px;font-weight:700;color:#fff;line-height:1.7;">But the method described in this deck can move you from L0–2 to L3–4 today. Write specs. Delegate to agents. Verify through provenance. That's the transition from writing code to directing agents.</div>

  <div style="position:absolute;right:52px;top:80px;width:430px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#111111;border-left:8px solid #55524E;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#55524E;letter-spacing:2px;margin-bottom:8px;">L0–2 — WHERE YOU ARE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">AI suggests, you accept or reject. You write code alongside an AI assistant. The human is still the bottleneck.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">L3–4 — WHERE SDD TAKES YOU</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">You specify, the agent builds, a separate agent verifies. Provenance captures the reasoning. The human writes specs and reviews results.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #2E2D2B;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#7A7772;letter-spacing:2px;margin-bottom:8px;">L5 — DARK FACTORY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Fully autonomous. No humans in the loop. Digital twins, external scenarios, thousand-dollar daily compute budgets. A different talk.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">04</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 05 ITS ALL ABOUT THE SPEC -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Insight</div>

  <div style="position:absolute;left:64px;top:80px;font-family:'Bebas Neue',sans-serif;font-size:110px;line-height:.88;color:#0A0A0A;letter-spacing:1px;">IT'S ALL<br>ABOUT<br><span style="color:#A8E10C;">THE SPEC.</span></div>

  <div style="position:absolute;left:64px;top:430px;width:660px;font-family:'Archivo',sans-serif;font-size:16px;color:#55524E;line-height:1.7;">With agentic AI, the spec you hand the agent <em>is</em> the implementation instruction. The agent reads your spec and builds the software. If the spec is structured well enough, it also defines the verification scenarios — not as a side effect, but inherently.</div>

  <div style="position:absolute;left:64px;top:570px;width:660px;font-family:'Archivo',sans-serif;font-size:16px;font-weight:700;color:#0A0A0A;line-height:1.7;">The spec is the single source of truth for what the software does, how it gets built, and how it gets verified.</div>

  <div style="position:absolute;right:52px;top:90px;width:430px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #55524E;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#7A7772;letter-spacing:2px;margin-bottom:8px;">THE OLD BOTTLENECK</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Implementation speed. Can we build it fast enough? Can we hire enough engineers?</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">THE NEW BOTTLENECK</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Specification quality. Can we describe what needs to exist precisely enough that agents can build it?</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;line-height:1.6;">The skill that matters now is the ability to specify — clearly, completely, and verifiably.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">05</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 06 THE ARCHITECTURE -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Architecture</div>

  <div style="position:absolute;left:64px;top:80px;font-family:'Bebas Neue',sans-serif;font-size:82px;line-height:.9;color:#fff;letter-spacing:1px;">THE INFINITY LOOP</div>

  <div style="position:absolute;left:64px;top:178px;width:440px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.65;">The spec sits at the top. Scenarios sit at the bottom. Provenance is the crossing point where the two agents communicate. Code is the canonical context — the reality everything else orbits.</div>

  <svg style="position:absolute;left:540px;top:30px;" width="680" height="660" viewBox="0 0 680 660">
    <path d="M 340,330 C 240,140 80,140 80,330 C 80,520 240,520 340,330 C 440,140 600,140 600,330 C 600,520 440,520 340,330"
          fill="none" stroke="#2E2D2B" stroke-width="3.5"/>
    <circle cx="340" cy="330" r="12" fill="#A8E10C" opacity="0.25"/>
    <circle cx="340" cy="330" r="5" fill="#A8E10C"/>
    <text x="175" y="330" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="44" fill="#fff" letter-spacing="3">SPEC</text>
    <text x="175" y="358" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="12" fill="#7A7772">The authority</text>
    <text x="340" y="280" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="30" fill="#A8E10C" letter-spacing="3">PROVENANCE</text>
    <text x="340" y="390" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="12" fill="#7A7772">The reasoning</text>
    <text x="505" y="330" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="44" fill="#fff" letter-spacing="3">SCENARIOS</text>
    <text x="505" y="358" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="12" fill="#7A7772">The evidence</text>
  </svg>

  <div style="position:absolute;left:64px;top:280px;width:420px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;margin-bottom:12px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#A8E10C;letter-spacing:1px;">LEFT LOOP — BUILDER</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:6px;">Reads spec → Writes code → Produces provenance</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;margin-bottom:12px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#A8E10C;letter-spacing:1px;">CROSSING — PROVENANCE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:6px;">Both agents read and write. Neither talks directly. The document is the interface.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;margin-bottom:12px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#A8E10C;letter-spacing:1px;">RIGHT LOOP — TESTER</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:6px;">Reads spec + provenance → Writes scenarios → Runs tests</div>
    </div>
    <div style="background:#111111;border-left:8px solid #fff;padding:14px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#fff;letter-spacing:1px;">CODE — CANONICAL CONTEXT</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:6px;">Self-describing. Any agent reads provenance to understand <em style="color:#A8E10C;">why</em>, reads code to understand <em style="color:#A8E10C;">what</em>.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">06</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 07 THE SPEC -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Spec — What It Contains</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">THE SPEC SPECIFIES<br>EVERYTHING.</div>

  <div style="position:absolute;left:64px;top:268px;width:700px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.65;">The spec defines both the product and the process that produces the product. Not just what to build — but who does the work, what each worker is responsible for, and how they communicate.</div>

  <div style="position:absolute;left:64px;top:380px;width:1152px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">REQUIREMENTS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Functional, non-functional, constraints, assumptions. Specific enough that an agent can implement them and a separate agent can verify them.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">ARCHITECTURE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Component boundaries, data flow, interfaces. Enough for the builder to make decisions and enough for the tester to know what to probe.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">AGENT ROLES</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Builder and tester roles defined in the spec itself. At prompt time: "You are the builder. Here is the spec. Do your job."</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">PROCESS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">What each agent reads, what it produces, where it writes. The spec is the orchestrator. No LangGraph. No supervisor agent. The workflow <em>is</em> the spec.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">07</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 08 BUILDER AGENT -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Builder Agent</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:96px;line-height:.9;color:#fff;letter-spacing:1px;">BUILD AND<br>SHOW YOUR<br><span style="color:#A8E10C;">WORKING.</span></div>

  <div style="position:absolute;left:64px;top:380px;width:530px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;">The builder doesn't just write code. It produces evidence of <em>how</em> it interpreted the spec — every assumption, every ambiguity, every decision. It's not marking its own homework. It's handing in its homework with its working shown.</div>

  <div style="position:absolute;right:52px;top:90px;width:480px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">01</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Read the spec</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Full specification, prerequisites, current state</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">02</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Build the software</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Implement as specified</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">03</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Write provenance as you go</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Assumptions, ambiguities, decisions — not after the fact</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">04</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Commit spec + code + provenance</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">One atomic unit. Never separated.</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #CC3333;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#CC3333;min-width:40px;">✕</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Do not write tests</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">That is not your role</div>
      </div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">08</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 09 TESTING AGENT -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Testing Agent</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:96px;line-height:.9;color:#fff;letter-spacing:1px;">CHALLENGE<br>EVERY<br><span style="color:#A8E10C;">ASSUMPTION.</span></div>

  <div style="position:absolute;left:64px;top:380px;width:530px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;">A separate agent because the builder has blind spots. If the builder misunderstood the spec, it will write code that reflects the misunderstanding <em>and</em> tests that confirm it. Everything passes. Everything's wrong. The testing agent reads the spec and provenance — never the code — and finds the daylight between them.</div>

  <div style="position:absolute;right:52px;top:90px;width:480px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">01</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Read the spec</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Full specification — the authority</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">02</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Read the provenance</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">What the builder claims it did and why</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">03</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Find the daylight</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Gaps, assumptions, ambiguities, silences</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">04</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Write prose scenarios</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Plain language — what's being tested and why</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">05</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Implement tests from scenarios</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Executable code, derived from the prose</div>
      </div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#A8E10C;min-width:40px;">06</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;">Update the provenance</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;margin-top:2px;">Findings, results, recommendations — append, never overwrite</div>
      </div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">09</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 10 PROVENANCE -->
<div class="slide" style="background:#111111;">
  <div class="stag">Provenance</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:96px;line-height:.9;color:#fff;letter-spacing:1px;">THE REASONING<br>RECORD.<br><span style="color:#A8E10C;">NOT A MAP.</span></div>

  <div style="position:absolute;left:64px;top:370px;width:1152px;font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.65;">Code is self-describing — any agent can read a codebase and understand its structure, patterns, and dependencies. What the code can't tell you is <em style="color:#fff;">why</em>. Why is the timeout 30 minutes? Why this library and not that one? Why does this module exist at all? That's the provenance. The reasoning layer that answers the questions code can't answer about itself.</div>

  <div style="position:absolute;left:64px;top:480px;width:1152px;display:flex;gap:16px;">
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #fff;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;letter-spacing:2px;margin-bottom:10px;">CODE — THE WHAT</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.7;">Self-describing context<br>Any agent can read and navigate it<br>The canonical reality of the system<br><span style="color:#fff;font-weight:700;">What exists right now</span></div>
    </div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:2px;margin-bottom:10px;">PROVENANCE — THE WHY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.7;">Decisions made, assumptions held<br>Ambiguities interpreted<br>Layered: builder writes, tester appends<br><span style="color:#A8E10C;font-weight:700;">Why it exists this way</span></div>
    </div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:2px;margin-bottom:10px;">TOGETHER</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.7;">Agent reads code → understands <em>what</em><br>Agent reads provenance → understands <em>why</em><br>Context window rebuilt from scratch each session<br><span style="color:#fff;font-weight:700;">Provenance is pre-loaded understanding</span></div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">10</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 11 THE CROSS-EXAMINATION -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Testing Agent</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">THE CROSS-<br>EXAMINATION.</div>

  <div style="position:absolute;left:64px;top:275px;width:560px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.65;">The testing agent never sees the code. It has two inputs: the spec (what was intended) and the provenance (what the builder says it did). Its job is to find the daylight between those two documents.</div>

  <div style="position:absolute;left:64px;top:418px;width:560px;font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#0A0A0A;line-height:1.65;">A separate agent because the builder has blind spots. If the builder misunderstood the spec, it will write code that reflects the misunderstanding <em>and</em> tests that confirm it. Everything passes. Everything's wrong.</div>

  <div style="position:absolute;right:52px;top:90px;width:480px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;">Gaps</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:4px;">Requirements the provenance doesn't address</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;">Assumptions</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:4px;">Decisions the builder made where the spec was silent — primary targets</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;">Ambiguities</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:4px;">Places the builder interpreted unclear requirements</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;">Silences</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:4px;">Things the builder didn't mention at all — red flags</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">11</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 12 PROSE FIRST -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">Scenarios — Prose First</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:96px;line-height:.9;color:#fff;letter-spacing:1px;">PROSE FIRST.<br><span style="color:#A8E10C;">CODE SECOND.</span></div>

  <div style="position:absolute;left:64px;top:308px;width:560px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;">The testing agent writes a markdown scenario — plain language explaining what's being tested and why — before it writes a single line of test code. The code is derived from the prose, not the other way around.</div>

  <div style="position:absolute;left:64px;top:440px;width:560px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;">A product owner can read the scenario. A regulator can read it. A client who knows nothing about code can say <span style="color:#fff;">"yes, that's the right question to ask"</span> or <span style="color:#fff;">"actually, don't test for that — update the spec."</span></div>

  <div style="position:absolute;right:52px;top:90px;width:520px;background:#111111;border-left:8px solid #A8E10C;padding:24px 28px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#A8E10C;letter-spacing:2px;">S-003: TOKEN EXPIRY HANDLING</div>
    <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#55524E;margin-top:10px;letter-spacing:1px;">TRIGGERED BY: ASSUMPTION A1</div>
    <div style="margin-top:16px;font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.7;">The spec requires authentication on all protected routes. The provenance states the builder implemented JWT validation with a 30-minute expiry, but the spec is silent on expiry duration.</div>
    <div style="margin-top:16px;font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#fff;">EXPECTS:</div>
    <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.7;">Expired tokens return 401<br>Expiry period is documented</div>
    <div style="margin-top:12px;font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#fff;">FAILS IF:</div>
    <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.7;">Expired token returns 200<br>No expiry validation exists</div>
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid #2E2D2B;font-family:'Archivo',sans-serif;font-size:11px;color:#55524E;">TEST: tests/auth/token-expiry.test.ts#L12</div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">12</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 13 THE LOOP -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Loop — Closing It</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">FAILING TESTS ARE<br>WORK ORDERS,<br>NOT BUG REPORTS.</div>

  <div style="position:absolute;left:64px;top:340px;width:700px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.65;">A failing test with provenance is a diagnosis. The builder doesn't get "line 47 assertion failed." It gets the prose scenario, the gap between spec and provenance, and a recommendation for what to fix.</div>

  <div style="position:absolute;left:64px;top:460px;width:1152px;display:flex;gap:8px;align-items:stretch;">
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #CC3333;padding:16px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#CC3333;line-height:1;">FAIL</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:8px;">Scenario S-003 fails. Token expiry not validated.</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#D4D1CB;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#A8E10C;line-height:1;">READ</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:8px;">Builder reads provenance. Tester's findings explain what and why.</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#D4D1CB;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#A8E10C;line-height:1;">FIX</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:8px;">Builder fixes code. Updates provenance with new entry.</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#D4D1CB;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#A8E10C;line-height:1;">PASS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:8px;">Tester re-runs. Scenario passes. Loop continues.</div>
    </div>
  </div>

  <div style="position:absolute;left:64px;top:620px;width:800px;font-family:'Archivo',sans-serif;font-size:13px;font-style:italic;color:#7A7772;">No human touched the code. No human wrote a test. No human triaged a bug. A human wrote a spec. Everything else is derived.</div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">13</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 14 THE CHAIN -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Provenance Chain</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#fff;letter-spacing:1px;">FIVE ARTEFACTS.<br>FIVE PURPOSES.<br><span style="color:#A8E10C;">COMPLETE LINEAGE.</span></div>

  <div style="position:absolute;left:64px;top:370px;width:1152px;display:flex;gap:12px;">
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#A8E10C;line-height:1;">SPEC</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#fff;font-weight:700;margin-top:8px;">Intent</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#7A7772;line-height:1.6;margin-top:4px;">What should exist<br>and why.</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #fff;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:1;">CODE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#fff;font-weight:700;margin-top:8px;">Reality</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#7A7772;line-height:1.6;margin-top:4px;">Self-describing.<br>Canonical context.</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#A8E10C;line-height:1;padding-top:5px;">PROVENANCE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#fff;font-weight:700;margin-top:8px;">Reasoning</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#7A7772;line-height:1.6;margin-top:4px;">Why it's this way.<br>The decisions made.</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#A8E10C;line-height:1;padding-top:4px;">SCENARIOS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#fff;font-weight:700;margin-top:8px;">Challenge</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#7A7772;line-height:1.6;margin-top:4px;">Plain language.<br>What's being verified.</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #fff;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:1;">TESTS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#fff;font-weight:700;margin-top:8px;">Execution</div>
      <div style="font-family:'Archivo',sans-serif;font-size:11px;color:#7A7772;line-height:1.6;margin-top:4px;">Derived from scenarios.<br>Pass or fail.</div>
    </div>
  </div>

  <div style="position:absolute;left:64px;top:540px;width:1152px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;">The spec describes what the code should be. The code describes itself. The provenance explains why the code is the way it is. The scenarios challenge the code based on the gap between spec and provenance. The tests execute against the code.</div>

  <div style="position:absolute;left:64px;top:610px;width:1152px;font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;line-height:1.7;">Code is the reality every other artefact exists in relation to. Provenance is the reasoning that makes the code navigable.</div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">14</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 15 WHY DIFFERENT -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Why It's Different</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:80px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">MARKDOWN AND<br>A PROCESS.</div>
  <div style="position:absolute;left:64px;top:268px;font-family:'Bebas Neue',sans-serif;font-size:80px;line-height:.9;color:#A8E10C;letter-spacing:1px;">THAT'S IT.</div>

  <div style="position:absolute;left:64px;top:390px;width:600px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.65;">No SDK. No framework. No vendor lock-in. No orchestration engine. Anyone with access to an AI agent and a markdown editor can implement SDD today. The entire methodology fits in three templates.</div>

  <div style="position:absolute;right:52px;top:90px;width:430px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #55524E;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#7A7772;letter-spacing:1px;">THE INDUSTRY SAYS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:8px;">Install our agent framework<br>Use our evaluation platform<br>Buy our orchestration tool<br>Adopt our scoring rubrics</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:700;color:#A8E10C;letter-spacing:1px;">SDD SAYS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;margin-top:8px;">Write a spec in markdown<br>Tell one agent to build<br>Tell another agent to verify<br>Let the documents do the rest</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;line-height:1.6;">The spec is the orchestrator.<br>The provenance is the protocol.<br>The tools are whatever you have.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">15</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 16 THE VALUE -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Value</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#fff;letter-spacing:1px;">WHAT SDD<br>GIVES YOU.</div>

  <div style="position:absolute;left:64px;top:290px;width:1152px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">TRACEABILITY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Every test traces to a scenario, every scenario to a provenance entry, every entry to a spec requirement. End to end.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">COMPLIANCE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Provenance is an audit trail. EU AI Act, SOC 2, ISO 27001 — the chain of evidence already exists.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">SEPARATION</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Builder and tester can't share blind spots. Same principle as code review, enforced architecturally.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">SIMPLICITY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Three markdown templates. No framework. No vendor. The human maintains one artefact: the spec.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">ACCESSIBILITY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Anyone with an AI agent and a text editor. No specialised tooling. The methodology is the tool.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">SPEC QUALITY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Forces rigorous specification. Vague specs produce vague provenance, vague scenarios, unjudgeable outcomes.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">16</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 17 WHAT SDD DOES NOT GIVE YOU -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Landscape</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#fff;letter-spacing:1px;">WHAT SDD DOES<br><span style="color:#A8E10C;">NOT GIVE YOU.</span></div>

  <div style="position:absolute;left:64px;top:290px;width:1152px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">MULTI-AGENT ORCHESTRATION</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">SDD uses two roles talking through documents. If you need dozens of agents coordinating dynamically in real-time, LangGraph, CrewAI, and AutoGen solve that problem. Most teams aren't there yet.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">REAL-TIME AGENT MONITORING</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">SDD tests the software, not the agent. If you need continuous evaluation of agent behaviour in production — drift, hallucination, alignment — Arize, Braintrust, and Bloom address that.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">DYNAMIC TOOL DISCOVERY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">SDD specs are static documents. If your agents need to discover and compose tools at runtime, MCP servers and tool registries are built for that.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:1px;margin-bottom:8px;">LONG-TERM AGENT MEMORY</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">SDD uses provenance as persistent context, but it doesn't give you vector stores, RAG pipelines, or cross-session memory systems.</div>
    </div>
  </div>

  <div style="position:absolute;left:64px;top:558px;width:1152px;font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.7;">These technologies solve real problems. But they solve <em style="color:#fff;">advanced</em> problems. SDD sharpens the thinking that makes every other tool more effective.</div>

  <div style="position:absolute;left:64px;top:620px;width:1152px;font-family:'Archivo',sans-serif;font-size:16px;font-weight:700;color:#fff;line-height:1.7;">Start with the spec. Graduate to complexity when the problem demands it.</div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">17</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 18 LIVE DEMO -->
<div class="slide" style="background:#0A0A0A;">
  <div style="position:absolute;left:0;top:0;width:1280px;height:6px;background:#A8E10C;"></div>
  <div class="stag">Live Demo</div>

  <div style="position:absolute;left:64px;top:100px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:140px;line-height:.88;color:#fff;letter-spacing:2px;">LIVE</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:140px;line-height:.88;color:#A8E10C;letter-spacing:2px;">DEMO</div>
  </div>

  <div style="position:absolute;left:64px;top:400px;width:600px;font-family:'Archivo',sans-serif;font-size:18px;color:#7A7772;line-height:1.7;">SDD in action. One spec. Two agents. Provenance, scenarios, and tests — generated live.</div>

  <div style="position:absolute;right:52px;top:100px;width:460px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">01 — THE SPEC</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">A real spec with agent roles, requirements, and constraints. Markdown. Nothing else.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">02 — THE BUILDER</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Hand the spec to the builder agent. Watch it build and produce provenance — assumptions, decisions, ambiguities — in real time.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">03 — THE TESTER</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Hand the spec and provenance to a separate agent. Watch it find the daylight, write prose scenarios, and generate executable tests.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">04 — THE LOOP</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.6;">Failing scenario → builder reads provenance → fixes → tester re-runs. The infinity loop, live.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">18</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 19 CLOSE -->
<div class="slide" style="background:#0A0A0A;">
  <div style="position:absolute;left:0;top:0;width:1280px;height:22px;background:#A8E10C;"></div>

  <div style="position:absolute;left:64px;top:50px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:85px;line-height:.92;color:#fff;letter-spacing:1px;">THE BOTTLENECK HAS<br>MOVED FROM CODE<br>TO SPECIFICATION.</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:85px;color:#A8E10C;letter-spacing:1px;margin-top:16px;">SDD IS THE METHOD.</div>
  </div>

  <div style="position:absolute;left:64px;bottom:110px;width:960px;font-family:'Archivo',sans-serif;font-size:17px;color:#7A7772;line-height:1.7;">One spec. Two agents. Five artefacts. Complete traceability from intent to verification.<br><span style="color:#55524E;">No framework required. Start today.</span></div>

  <div style="position:absolute;left:0;bottom:0;width:1280px;height:58px;background:#111111;border-top:2px solid #1A1A1A;display:flex;align-items:center;padding:0 64px;gap:40px;">
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Kevin Ryan &amp; Associates</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">kevinryan.io</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">sddbook.com</div>
    <div style="flex:1;"></div>
    <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="height:26px;" alt="Kevin Ryan">
  </div>

  <div class="snum" style="color:#55524E;">19</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 20 BONUS INTRO -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">Bonus Content</div>

  <div style="position:absolute;left:64px;top:140px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:160px;line-height:.88;color:#fff;letter-spacing:2px;">BONUS</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:160px;line-height:.88;color:#A8E10C;letter-spacing:2px;">CONTENT</div>
  </div>

  <div style="position:absolute;left:64px;top:470px;width:900px;font-family:'Archivo',sans-serif;font-size:18px;color:#7A7772;line-height:1.6;">
    Provenance, audit, and regulation — why SDD is a compliance<br>asset for SOC 2, ISO 27001, and the EU AI Act.
  </div>

  <div style="position:absolute;left:64px;top:550px;display:flex;gap:14px;">
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">SOC 2</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">ISO 27001</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">EU AI ACT</span>
    <span style="background:#111111;border:1px solid #2E2D2B;padding:7px 16px;font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;color:#7A7772;letter-spacing:1px;">AUGUST 2026</span>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">20</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 21 THE AUDIT PROBLEM -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Provenance &amp; Compliance</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:68px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">YOUR AUDITOR'S AI<br>IS GOING TO ASK<br><span style="color:#A8E10C;">HOW THIS WAS BUILT.</span></div>

  <div style="position:absolute;left:64px;top:340px;width:660px;font-family:'Archivo',sans-serif;font-size:15px;color:#55524E;line-height:1.65;">When a human builds software, the reasoning exists in their head, in Slack threads, in PR comments. You can reconstruct it — badly — after the fact. When an agent builds software, the reasoning exists in the context window. The session ends. The reasoning evaporates. Unless you capture it.</div>

  <div style="position:absolute;left:64px;top:510px;width:660px;font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#0A0A0A;line-height:1.65;">You cannot retrospectively create provenance for decisions that were never documented. SDD means you never have to.</div>

  <div style="position:absolute;right:52px;top:90px;width:430px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">SOC 2</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">Change Management Controls</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Auditors require evidence that changes are authorised, documented, and traceable. SDD's provenance chain is that evidence — spec to code to verification.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">ISO 27001</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">Annex A — Secure Development</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Requires documented development procedures, separation of duties, and design review records. SDD's builder-tester separation and layered provenance satisfy this structurally.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:18px 20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#A8E10C;letter-spacing:2px;margin-bottom:8px;">EU AI ACT</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">Articles 11, 12, 19 — Full Force August 2026</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Technical documentation, automatic record-keeping, and retained logs for high-risk AI systems. Provenance is all three — generated in real time, not written after the fact.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-outlined.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#7A7772;">21</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 22 COMPLIANCE AS BYPRODUCT -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">Provenance &amp; Compliance</div>

  <div style="position:absolute;left:64px;top:78px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#fff;letter-spacing:1px;">COMPLIANCE<br>AS A BYPRODUCT.<br><span style="color:#A8E10C;">NOT A PROJECT.</span></div>

  <div style="position:absolute;left:64px;top:342px;width:1152px;font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.65;">Most organisations will try to bolt compliance documentation onto AI-built systems after the fact. They will hire consultants to retrospectively construct the design history that auditors and regulators demand. SDD produces that documentation as an inherent part of the build. You don't retrofit it. It already exists.</div>

  <div style="position:absolute;left:64px;top:448px;width:1152px;display:flex;gap:8px;align-items:stretch;">
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#A8E10C;letter-spacing:1px;">AUDITOR ASKS</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:6px;">Why does this system behave this way?</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#55524E;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#A8E10C;letter-spacing:1px;">SCENARIO</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:6px;">This test exists because provenance entry C1 challenged assumption A3.</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#55524E;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#A8E10C;letter-spacing:1px;">PROVENANCE</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:6px;">A3 was assumed because the spec was silent on expiry. Builder chose 30 minutes.</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#55524E;display:flex;align-items:center;">→</div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#A8E10C;letter-spacing:1px;">SPEC</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;margin-top:6px;">Requirement FR-007: all protected routes require authentication.</div>
    </div>
  </div>

  <div style="position:absolute;left:64px;top:580px;width:1152px;display:flex;gap:14px;">
    <div style="flex:1;background:#111111;border-left:8px solid #CC3333;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#CC3333;line-height:1;">€35M</div>
      <div style="font-family:'Archivo',sans-serif;font-size:10px;color:#7A7772;line-height:1.5;margin-top:4px;">EU AI Act — 7% turnover<br>Prohibited practices</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC3333;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#CC3333;line-height:1;padding-top:4px;">SOC 2<br>FAIL</div>
      <div style="font-family:'Archivo',sans-serif;font-size:10px;color:#7A7772;line-height:1.5;margin-top:4px;">Lost contracts, lost clients<br>Unrecoverable trust damage</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC3333;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#CC3333;line-height:1;padding-top:4px;">ISO 27001<br>NC</div>
      <div style="font-family:'Archivo',sans-serif;font-size:10px;color:#7A7772;line-height:1.5;margin-top:4px;">Non-conformity finding<br>Certification at risk</div>
    </div>
    <div style="flex:2;background:#111111;border-left:8px solid #A8E10C;padding:14px 18px;display:flex;align-items:center;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;line-height:1.6;">SDD solves the documentation and traceability problem across all three frameworks — the one that requires you to have been recording decisions from the start.</div>
    </div>
  </div>

  <img src="https://brand.kevinryan.io/kevin-ryan-logo-whitetext.svg" style="position:absolute;right:38px;bottom:22px;height:36px;" alt="Kevin Ryan">
  <div class="snum" style="color:#55524E;">22</div>
</div>


</div><!-- /wrapper -->

<!-- Navigation -->
<div id="nav">
  <button onclick="prev()" title="Previous (←)">←</button>
  <span id="counter">01 / 22</span>
  <button onclick="next()" title="Next (→)">→</button>
  <button onclick="toggleFS()" title="Fullscreen">&#x26F6;</button>
</div>
`

const deckScript = `
let cur = 0;
const slides = Array.from(document.querySelectorAll('.slide'));
const total = slides.length;

function show(n) {
  slides[cur].classList.remove('active');
  cur = ((n % total) + total) % total;
  slides[cur].classList.add('active');
  document.getElementById('counter').textContent =
    String(cur + 1).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
}
function next() { show(cur + 1); }
function prev() { show(cur - 1); }

document.addEventListener('keydown', function(e) {
  if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); next(); }
  if (['ArrowLeft','ArrowUp'].includes(e.key)) { e.preventDefault(); prev(); }
});

function toggleFS() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function scale() {
  var w = document.getElementById('wrapper');
  if (!w) return;
  var sx = window.innerWidth / 1280;
  var sy = window.innerHeight / 720;
  var s  = Math.min(sx, sy);
  w.style.transform = 'scale(' + s + ')';
  w.style.left = Math.max(0, (window.innerWidth  - 1280 * s) / 2) + 'px';
  w.style.top  = Math.max(0, (window.innerHeight - 720  * s) / 2) + 'px';
}
window.addEventListener('resize', scale);
scale();
`

export default function SDDDeckPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="sdd-deck-root"
        dangerouslySetInnerHTML={{ __html: slidesHtml }}
      />
      <Script
        id="sdd-deck-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: deckScript }}
      />
    </>
  )
}
