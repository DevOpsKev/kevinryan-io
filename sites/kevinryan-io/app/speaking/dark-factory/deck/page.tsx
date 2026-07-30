import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Dark Factory — Slide Deck',
  description: 'Interactive slide deck: The Dark Factory by Kevin Ryan.',
}

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
html, body { overflow:hidden; background:#000; }

#dark-factory-deck-root {
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
.stag-dark { color:#A8E10C; }
.stag-light { color:#A8E10C; }

.snum {
  position:absolute; left:52px; bottom:28px;
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
.card-blk { background:#0A0A0A; }
.card-lt  { background:#ECEAE5; }
.card-mid { background:#1A1A1A; }

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
  <div class="stag">The Dark Factory</div>

  <div style="position:absolute;left:64px;top:88px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:178px;line-height:.9;color:#fff;letter-spacing:2px;">THE DARK</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:178px;line-height:.9;color:#A8E10C;letter-spacing:2px;">FACTORY</div>
  </div>

  <div style="position:absolute;left:64px;top:510px;width:900px;font-family:'Archivo',sans-serif;font-size:18px;color:#7A7772;line-height:1.6;">
    The gap between AI-native software teams and everyone else —<br>and what it takes to cross it.
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">01</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 02 BIO -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Your Presenter</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:120px;line-height:.88;color:#0A0A0A;">KEVIN<br>RYAN</div>
  <div style="position:absolute;left:64px;top:336px;font-family:'Archivo',sans-serif;font-size:14px;font-style:italic;color:#55524E;">"I used to direct teams of software engineers. Now I coordinate AI agents."</div>
  <div style="position:absolute;left:64px;top:366px;font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;">Kevin Ryan &amp; Associates</div>
  <div style="position:absolute;left:64px;top:390px;font-family:'Archivo',sans-serif;font-size:12px;color:#55524E;">AI-Native · Platform Engineering · Author</div>

  <div style="position:absolute;left:64px;top:418px;width:460px;height:2px;background:#D4D1CB;"></div>

  <div style="position:absolute;left:64px;top:430px;display:flex;flex-wrap:wrap;gap:7px;width:500px;">
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">CERN</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">NESTLÉ</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">NATWEST</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">BBC WORLDWIDE</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">FINANCIAL TIMES</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">VODAFONE</span>
    <span style="background:#ECEAE5;border:1px solid #D4D1CB;padding:5px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;letter-spacing:.5px;">HELLOFRESH</span>
  </div>

  <div style="position:absolute;left:700px;top:88px;width:238px;height:238px;background:#0A0A0A;border-left:8px solid #A8E10C;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:82px;color:#A8E10C;padding:22px 20px 0;line-height:1;">30</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;padding:6px 20px;line-height:1.5;">Years in<br>technology</div>
  </div>
  <div style="position:absolute;left:954px;top:88px;width:238px;height:238px;background:#0A0A0A;border-left:8px solid #A8E10C;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:82px;color:#A8E10C;padding:22px 20px 0;line-height:1;">14</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;padding:6px 20px;line-height:1.5;">Professional<br>certifications</div>
  </div>
  <div style="position:absolute;left:700px;top:342px;width:238px;height:238px;background:#0A0A0A;border-left:8px solid #A8E10C;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:82px;color:#A8E10C;padding:22px 20px 0;line-height:1;">40+</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;padding:6px 20px;line-height:1.5;">Enterprise<br>clients</div>
  </div>
  <div style="position:absolute;left:954px;top:342px;width:238px;height:238px;background:#0A0A0A;border-left:8px solid #A8E10C;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:62px;color:#A8E10C;padding:22px 20px 0;line-height:1;">£20m+</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;padding:6px 20px;line-height:1.5;">Programme<br>budgets delivered</div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">02</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 03 THE PARADOX -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Paradox — Section 01</div>

  <div style="position:absolute;left:64px;top:80px;font-family:'Bebas Neue',sans-serif;font-size:106px;line-height:.9;color:#fff;letter-spacing:1px;">TWO REALITIES.<br>SAME INDUSTRY.<br>SAME YEAR.</div>

  <div style="position:absolute;left:64px;top:400px;width:552px;height:272px;background:#111111;border-left:8px solid #A8E10C;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#A8E10C;letter-spacing:3px;margin-bottom:14px;">FRONTIER</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.65;">Claude Code is <strong style="color:#A8E10C;">100% written by Claude Code</strong> — confirmed March 7, 2026 by Boris Cherny, Claude Code lead. StrongDM ships production software with zero humans writing or reviewing code.</div>
  </div>

  <div style="position:absolute;left:664px;top:400px;width:552px;height:272px;background:#111111;border-left:8px solid #55524E;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;letter-spacing:3px;margin-bottom:14px;">THE REST</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.65;">A 2025 METR randomised control trial found experienced developers using AI tools completed tasks <strong style="color:#fff;">19% SLOWER</strong>. They believed AI made them 24% faster. Wrong on direction AND magnitude.</div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">03</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 04 FIVE LEVELS -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Framework — Section 02</div>

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

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">04</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 05 LEVELS 0-2 -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Framework — Levels 0, 1 &amp; 2</div>

  <div style="position:absolute;left:64px;top:90px;font-family:'Bebas Neue',sans-serif;font-size:56px;color:#0A0A0A;letter-spacing:1px;">WHERE MOST DEVELOPERS LIVE</div>

  <div style="position:absolute;left:52px;top:192px;width:378px;height:473px;background:#ECEAE5;border-left:8px solid #A8E10C;padding:20px 22px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#D4D1CB;">00</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;margin-top:6px;letter-spacing:.5px;">SPICY AUTOCOMPLETE</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.65;margin-top:14px;">AI suggests the next line. You accept or reject. GitHub Copilot in its original format — a faster tab key. The human writes the software.</div>
    <div style="position:absolute;bottom:16px;left:30px;right:22px;background:#D4D1CB;padding:6px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;text-align:center;letter-spacing:.5px;">WHO: GITHUB COPILOT ORIGINAL</div>
  </div>

  <div style="position:absolute;left:451px;top:192px;width:378px;height:473px;background:#ECEAE5;border-left:8px solid #A8E10C;padding:20px 22px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#D4D1CB;">01</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;margin-top:6px;letter-spacing:.5px;">CODING INTERN</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.65;margin-top:14px;">Hand the AI a discrete, well-scoped task — write this function, refactor this module. You review everything that comes back. AI handles tasks, human handles architecture.</div>
    <div style="position:absolute;bottom:16px;left:30px;right:22px;background:#D4D1CB;padding:6px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;text-align:center;letter-spacing:.5px;">WHO: MOST CASUAL AI USERS</div>
  </div>

  <div style="position:absolute;left:850px;top:192px;width:378px;height:473px;background:#ECEAE5;border-left:8px solid #A8E10C;padding:20px 22px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#D4D1CB;">02</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;margin-top:6px;letter-spacing:.5px;">JUNIOR DEVELOPER</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.65;margin-top:14px;">AI handles multi-file changes, navigates the codebase, builds features spanning modules. You still read all the code. Shapiro estimates <strong>90% of 'AI native' developers operate here</strong>.</div>
    <div style="position:absolute;bottom:16px;left:30px;right:22px;background:#D4D1CB;padding:6px 12px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#55524E;text-align:center;letter-spacing:.5px;">WHO: 90% OF SELF-DESCRIBED AI-NATIVE DEVS</div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">05</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 06 LEVEL 3 -->
<div class="slide" style="background:#111111;">
  <div class="stag">The Framework — Level 3</div>

  <div style="position:absolute;left:50px;top:60px;font-family:'Bebas Neue',sans-serif;font-size:260px;color:#1A1A1A;line-height:1;pointer-events:none;">03</div>

  <div style="position:absolute;left:64px;top:96px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:88px;line-height:.9;color:#fff;letter-spacing:1px;">DEVELOPER<br>AS MANAGER</div>
    <div style="font-family:'Archivo',sans-serif;font-size:17px;font-style:italic;color:#A8E10C;margin-top:20px;">The relationship flips.</div>
    <div style="font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.7;margin-top:16px;max-width:680px;">You're no longer writing code with AI help. You're directing the AI and reviewing what it produces — at the feature level, the PR level. The model submits PRs for your review. You decide: approve, reject, redirect.<br><br>Most developers top out here. The ceiling isn't technical. It's psychological: <strong style="color:#fff;">letting go of the code.</strong></div>
  </div>

  <div style="position:absolute;right:52px;top:192px;width:310px;background:#0A0A0A;border-left:8px solid #A8E10C;padding:24px 20px 24px 24px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;color:#fff;line-height:1;">MOST</div>
    <div style="font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.6;margin-top:8px;">developers<br>hit the ceiling<br>right here.</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;font-style:italic;color:#A8E10C;line-height:1.6;margin-top:20px;">The barrier is psychological,<br>not technical.</div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">06</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 07 LEVELS 4 + 5 -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Framework — Levels 4 &amp; 5</div>

  <div style="position:absolute;left:64px;top:70px;font-family:'Bebas Neue',sans-serif;font-size:117px;line-height:.9;color:#fff;letter-spacing:1px;">BEYOND THE<br>CEILING.</div>

  <div style="position:absolute;left:64px;top:340px;width:563px;height:326px;background:#111111;border-left:8px solid #7A7772;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#fff;letter-spacing:1px;">04 &nbsp; DEVELOPER AS PRODUCT OWNER</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;margin-top:14px;">Write a spec, leave, come back hours later and check whether the tests pass. You're not reading the code anymore — you're evaluating outcomes. The code is a black box.<br><br>Requires spec quality almost nobody has developed yet.</div>
  </div>

  <div style="position:absolute;left:653px;top:340px;width:563px;height:326px;background:#111111;border-left:8px solid #A8E10C;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#A8E10C;letter-spacing:1px;">05 &nbsp; THE DARK FACTORY</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;margin-top:14px;">A black box that turns specs into software. No human writes the code. No human reviews it. The factory runs autonomously. Specification goes in — working, tested, shipped software comes out.<br><br>Almost nobody on the planet operates here. <strong style="color:#A8E10C;">Yet.</strong></div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">07</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 08 STRONGDM -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Proof of Concept — Section 03</div>

  <div style="position:absolute;left:64px;top:90px;width:680px;font-family:'Bebas Neue',sans-serif;font-size:60px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">STRONGDM: THE DARK<br>FACTORY IN PRODUCTION</div>

  <div style="position:absolute;left:64px;top:302px;width:630px;font-family:'Archivo',sans-serif;font-size:14px;font-style:italic;color:#55524E;line-height:1.65;">"The most ambitious form of AI-assisted software development I have seen yet." — Simon Willis</div>

  <div style="position:absolute;left:64px;top:385px;width:540px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:#0A0A0A;letter-spacing:1px;margin-bottom:14px;">HOW IT WORKS</div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="min-width:20px;height:20px;background:#A8E10C;margin-top:2px;"></div>
        <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">Write markdown spec</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="min-width:20px;height:20px;background:#A8E10C;margin-top:2px;"></div>
        <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">Agent reads spec</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="min-width:20px;height:20px;background:#A8E10C;margin-top:2px;"></div>
        <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">Agent writes &amp; tests code</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="min-width:20px;height:20px;background:#A8E10C;margin-top:2px;"></div>
        <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">Scenarios validate — agent never sees them</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="min-width:20px;height:20px;background:#A8E10C;margin-top:2px;"></div>
        <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">Software ships</div>
      </div>
    </div>
  </div>

  <div style="position:absolute;right:52px;top:90px;width:460px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:56px;color:#A8E10C;min-width:70px;line-height:1;">3</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Engineers. No one writes code.<br>No one reviews code.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:38px;color:#A8E10C;min-width:70px;line-height:1.1;">JUL<br>'24</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Running since July 2024. Inflection point: Claude 3.5 Sonnet, fall 2024.</div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 20px;display:flex;align-items:center;gap:20px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:56px;color:#A8E10C;min-width:70px;line-height:1;">$1k</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Per engineer per day in AI compute spend. That's the benchmark.</div>
    </div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">08</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 09 ARCHITECTURE -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">Proof of Concept — The Architecture</div>

  <div style="position:absolute;left:64px;top:77px;font-family:'Bebas Neue',sans-serif;font-size:100px;line-height:.9;color:#fff;letter-spacing:1px;">TWO IDEAS THAT<br>CHANGE EVERYTHING</div>

  <div style="position:absolute;left:64px;top:314px;width:563px;height:358px;background:#111111;border-left:8px solid #A8E10C;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#A8E10C;letter-spacing:1px;line-height:1.2;">EXTERNAL SCENARIOS<br>(NOT TESTS)</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;margin-top:16px;">Traditional tests live inside the codebase — the AI can see and game them. Teaching to the test.<br><br>Scenarios live <strong style="color:#fff;">outside</strong> the codebase. The agent builds the software without ever seeing the evaluation criteria. It can't cheat. Same principle as ML holdout sets.</div>
  </div>

  <div style="position:absolute;left:653px;top:314px;width:563px;height:358px;background:#111111;border-left:8px solid #A8E10C;padding:22px 26px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#A8E10C;letter-spacing:1px;line-height:1.2;">DIGITAL TWIN<br>UNIVERSE</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.7;margin-top:16px;">Behavioural clones of every external service: simulated Okta, Jira, Slack, Google Docs, Drive, Sheets.<br><br>Agents develop against digital twins — full integration testing without ever touching real production systems, real APIs, or real data.</div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">09</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 10 HYPERSCALERS -->
<div class="slide" style="background:#111111;">
  <div class="stag">Proof of Concept — The Hyperscalers</div>

  <div style="position:absolute;left:64px;top:80px;font-family:'Bebas Neue',sans-serif;font-size:110px;line-height:.9;color:#fff;letter-spacing:1px;">THE TOOLS<br>ARE BUILDING<br>THEMSELVES.</div>

  <div style="position:absolute;left:64px;top:408px;width:960px;font-family:'Archivo',sans-serif;font-size:14px;font-style:italic;color:#7A7772;line-height:1.65;">Boris Cherny, Claude Code lead at Anthropic, confirmed on X (March 7, 2026): <strong style="color:#A8E10C;">"Can confirm Claude Code is 100% written by Claude Code."</strong> His role has shifted entirely to specification, direction, and judgment. He hasn't personally written code in months.</div>

  <div style="position:absolute;left:64px;top:508px;width:1152px;display:flex;gap:16px;">
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#A8E10C;line-height:1;">100%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Claude Code written by<br>Claude Code. Confirmed.</div>
    </div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#A8E10C;line-height:1;">25%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Speed improvement building<br>Codex 5.3 — by Codex itself.</div>
    </div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#A8E10C;line-height:1;">4%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Of all GitHub public commits<br>directly authored by Claude Code.</div>
    </div>
    <div style="flex:1;background:#0A0A0A;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#A8E10C;line-height:1;">$1B</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Claude Code annual run rate.<br>Six months since launch.</div>
    </div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">10</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 11 J-CURVE -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">Why Most Orgs Are Stuck — Section 04</div>

  <div style="position:absolute;left:64px;top:83px;font-family:'Bebas Neue',sans-serif;font-size:100px;color:#0A0A0A;letter-spacing:1px;">THE J-CURVE</div>

  <div style="position:absolute;left:64px;top:198px;width:820px;font-family:'Archivo',sans-serif;font-size:16px;color:#55524E;line-height:1.55;">Productivity dips before it rises. Most organisations are sitting in the trough — and blaming the tool.</div>

  <svg style="position:absolute;left:52px;top:250px;" width="760" height="440" viewBox="0 0 760 440">
    <line x1="60" y1="20" x2="60" y2="370" stroke="#D4D1CB" stroke-width="2"/>
    <line x1="60" y1="370" x2="720" y2="370" stroke="#D4D1CB" stroke-width="2"/>
    <text x="30" y="200" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="13" fill="#7A7772" transform="rotate(-90,30,200)">Productivity</text>
    <text x="740" y="374" font-family="'Archivo',sans-serif" font-size="13" fill="#7A7772">Time →</text>
    <line x1="70" y1="220" x2="720" y2="220" stroke="#D4D1CB" stroke-width="1.5" stroke-dasharray="8,5"/>
    <text x="72" y="212" font-family="'Archivo',sans-serif" font-size="11" fill="#7A7772">Baseline</text>
    <polyline points="70,220 140,240 220,300 310,350 390,355 460,330 530,295" fill="none" stroke="#CC3333" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="530,295 600,240 660,175 720,105" fill="none" stroke="#A8E10C" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="320" y="395" text-anchor="middle" font-family="'Archivo',sans-serif" font-size="12" fill="#CC3333">← You are here (most orgs)</text>
    <text x="670" y="90" font-family="'Archivo',sans-serif" font-size="12" fill="#A8E10C">Dark Factory</text>
    <text x="670" y="106" font-family="'Archivo',sans-serif" font-size="12" fill="#A8E10C">teams →</text>
  </svg>

  <div style="position:absolute;right:52px;top:250px;width:380px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#0A0A0A;letter-spacing:1px;margin-bottom:18px;">WHY THE DIP HAPPENS</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:2;">Evaluating AI suggestions takes time<br>Correcting "almost right" code is costly<br>Context-switching between mental models<br>Debugging subtle errors that look correct<br>39% of devs have low trust in AI-generated code<br><span style="font-style:italic;color:#7A7772;font-size:12px;">— DORA 2024, 39,000+ professionals</span></div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">11</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 12 COPILOT -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">Why Most Orgs Are Stuck — The Tool Trap</div>

  <div style="position:absolute;left:64px;top:74px;width:1100px;font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#fff;letter-spacing:1px;">"COPILOT MAKES WRITING<br>CODE CHEAPER BUT<br>OWNING IT MORE EXPENSIVE."</div>

  <div style="position:absolute;left:64px;top:365px;width:900px;font-family:'Archivo',sans-serif;font-size:14px;font-style:italic;color:#55524E;">— Senior engineer. Common sentiment across the industry.</div>

  <div style="position:absolute;left:64px;top:415px;width:1152px;font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.6;">The organisations seeing 25–30%+ gains didn't just install Copilot and call it done. They <strong style="color:#fff;">redesigned their entire development workflow</strong> around AI capabilities.</div>

  <div style="position:absolute;left:64px;top:492px;width:1152px;display:flex;gap:16px;">
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;color:#A8E10C;line-height:1;">20M</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">GitHub Copilot users<br>42% market share</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #A8E10C;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;color:#A8E10C;line-height:1;">55%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Faster code completion<br>in isolated lab tasks</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC3333;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;color:#CC3333;line-height:1;">↑PRs</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Larger PRs, higher<br>review costs in production</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC3333;padding:14px 16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;color:#CC3333;line-height:1;">41%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.5;margin-top:4px;">Higher churn in AI-generated code<br>(GitClear 2024)</div>
    </div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">12</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 13 ORG STRUCTURES -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Reckoning — Section 05</div>

  <div style="position:absolute;left:64px;top:90px;width:1152px;font-family:'Bebas Neue',sans-serif;font-size:54px;line-height:.92;color:#0A0A0A;letter-spacing:.5px;">YOUR ORG WAS DESIGNED FOR<br>A WORLD WHERE HUMANS WRITE CODE.</div>

  <div style="position:absolute;left:64px;top:248px;width:1152px;display:flex;padding:0 14px;margin-bottom:4px;">
    <div style="flex:3;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#7A7772;letter-spacing:2px;">CEREMONY</div>
    <div style="flex:5;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#7A7772;letter-spacing:2px;">WHY IT EXISTED</div>
    <div style="width:130px;font-family:'Archivo',sans-serif;font-size:10px;font-weight:700;color:#7A7772;letter-spacing:2px;text-align:center;">STATUS</div>
  </div>

  <div style="position:absolute;left:64px;top:268px;width:1152px;">
    <div style="display:flex;align-items:center;padding:14px 14px;background:#ECEAE5;border-bottom:1px solid #D4D1CB;height:60px;">
      <div style="flex:3;font-family:'Archivo',sans-serif;font-size:14px;color:#55524E;">Daily Standup</div>
      <div style="flex:5;font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Developers need to synchronise</div>
      <div style="width:130px;font-family:'Bebas Neue',sans-serif;font-size:16px;color:#CC3333;text-align:center;letter-spacing:1px;">FRICTION</div>
    </div>
    <div style="display:flex;align-items:center;padding:14px 14px;background:#F5F3EF;border-bottom:1px solid #D4D1CB;height:60px;">
      <div style="flex:3;font-family:'Archivo',sans-serif;font-size:14px;color:#55524E;">Sprint Planning</div>
      <div style="flex:5;font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Humans can only hold so many tasks in memory</div>
      <div style="width:130px;font-family:'Bebas Neue',sans-serif;font-size:16px;color:#CC3333;text-align:center;letter-spacing:1px;">FRICTION</div>
    </div>
    <div style="display:flex;align-items:center;padding:14px 14px;background:#ECEAE5;border-bottom:1px solid #D4D1CB;height:60px;">
      <div style="flex:3;font-family:'Archivo',sans-serif;font-size:14px;color:#55524E;">Code Review</div>
      <div style="flex:5;font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Humans make mistakes other humans catch</div>
      <div style="width:130px;font-family:'Bebas Neue',sans-serif;font-size:16px;color:#CC3333;text-align:center;letter-spacing:1px;">FRICTION</div>
    </div>
    <div style="display:flex;align-items:center;padding:14px 14px;background:#F5F3EF;border-bottom:1px solid #D4D1CB;height:60px;">
      <div style="flex:3;font-family:'Archivo',sans-serif;font-size:14px;color:#55524E;">QA Team</div>
      <div style="flex:5;font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Builders can't evaluate objectively</div>
      <div style="width:130px;font-family:'Bebas Neue',sans-serif;font-size:16px;color:#7A7772;text-align:center;letter-spacing:1px;">EVOLVING</div>
    </div>
    <div style="display:flex;align-items:center;padding:14px 14px;background:#A8E10C;height:60px;">
      <div style="flex:3;font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#0A0A0A;">Write Spec / Eval</div>
      <div style="flex:5;font-family:'Archivo',sans-serif;font-size:13px;color:#0A0A0A;">Only thing left that actually matters</div>
      <div style="width:130px;font-family:'Bebas Neue',sans-serif;font-size:16px;color:#0A0A0A;text-align:center;letter-spacing:1px;">CORE</div>
    </div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">13</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 14 TALENT CLIFF -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Reckoning — Talent</div>

  <div style="position:absolute;left:64px;top:74px;width:832px;font-family:'Bebas Neue',sans-serif;font-size:95px;line-height:.9;color:#fff;letter-spacing:1px;">THE APPRENTICESHIP<br>MODEL IS BREAKING.</div>

  <div style="position:absolute;left:64px;top:338px;width:1152px;display:flex;gap:16px;">
    <div style="flex:1;background:#111111;border-left:8px solid #CC4444;padding:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#CC4444;line-height:1;">67%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.55;margin-top:6px;">Decline in US junior developer job postings</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC4444;padding:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#CC4444;line-height:1;">46%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.55;margin-top:6px;">Fall in UK graduate tech roles in 2024</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC4444;padding:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#CC4444;line-height:1;">53%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.55;margin-top:6px;">Further UK drop projected by end 2026</div>
    </div>
    <div style="flex:1;background:#111111;border-left:8px solid #CC4444;padding:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#CC4444;line-height:1.1;">9–10%</div>
      <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.55;margin-top:6px;">Junior employment drop per 6 quarters of AI adoption (Harvard, 2025)</div>
    </div>
  </div>

  <div style="position:absolute;left:64px;top:576px;width:1152px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:26px;color:#A8E10C;letter-spacing:1px;margin-bottom:10px;">THE NEW BAR FOR JUNIOR ENGINEERS</div>
    <div style="font-family:'Archivo',sans-serif;font-size:14px;color:#7A7772;line-height:1.6;max-width:1000px;">The junior of 2026 needs the systems design understanding expected of a mid-level engineer in 2020 — because the entry-level work got automated. The bar is rising toward exactly the skills that have always been hardest to develop.</div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">14</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 15 ECONOMICS -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Reckoning — New Org Economics</div>

  <div style="position:absolute;left:64px;top:82px;font-family:'Bebas Neue',sans-serif;font-size:88px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">THE AI-NATIVE<br>ORG IS ALREADY HERE.</div>

  <div style="position:absolute;left:64px;top:310px;width:620px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;letter-spacing:1px;margin-bottom:18px;">REVENUE PER EMPLOYEE</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:120px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#55524E;text-align:right;">Cursor</div>
      <div style="width:450px;height:38px;background:#A8E10C;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;">$3.3M</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:120px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#55524E;text-align:right;">Midjourney</div>
      <div style="width:420px;height:38px;background:#A8E10C;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;">$3.0M</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:120px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#55524E;text-align:right;">Lovable</div>
      <div style="width:380px;height:38px;background:#A8E10C;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#0A0A0A;">$2.2M</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:120px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#7A7772;text-align:right;">Avg SaaS</div>
      <div style="width:80px;height:38px;background:#D4D1CB;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#7A7772;">$610K</div>
    </div>
    <div style="font-family:'Archivo',sans-serif;font-size:12px;font-style:italic;color:#7A7772;margin-top:14px;">5–6× the average SaaS company</div>
  </div>

  <div style="position:absolute;right:52px;top:310px;width:474px;background:#0A0A0A;border-left:8px solid #A8E10C;padding:24px 22px;height:376px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;color:#A8E10C;letter-spacing:1px;margin-bottom:18px;">WHAT CHANGED</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:2;">
      No traditional eng / product / QA / DevOps teams<br>
      Small group — exceptional at understanding user needs<br>
      Exceptional at translating needs to clear spec<br>
      Directing AI systems that handle implementation<br>
      Org chart is radically flat<br>
      Middle management layer deleted
    </div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">15</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 16 BROWNFIELD -->
<div class="slide" style="background:#111111;">
  <div class="stag">The Path — Section 06</div>

  <div style="position:absolute;left:64px;top:77px;font-family:'Bebas Neue',sans-serif;font-size:106px;line-height:.9;color:#fff;letter-spacing:1px;">THE BROWNFIELD<br>PROBLEM</div>

  <div style="position:absolute;left:64px;top:330px;width:830px;font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.65;">You cannot dark factory your way through a legacy system.<br>The system IS the specification — and it was never written down.</div>

  <div style="position:absolute;left:64px;top:410px;width:1152px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;display:flex;gap:16px;align-items:flex-start;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#A8E10C;line-height:1;min-width:56px;">01</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Start at Level 2–3</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Use AI to accelerate what developers already do — new features, bug fixes, refactoring. Expect the J-curve dip.</div>
      </div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;display:flex;gap:16px;align-items:flex-start;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#A8E10C;line-height:1;min-width:56px;">02</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Document your system</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Use AI to generate specs from existing code. Build scenario suites capturing real behaviour. Create the holdout sets a future factory will need.</div>
      </div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;display:flex;gap:16px;align-items:flex-start;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#A8E10C;line-height:1;min-width:56px;">03</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Redesign CI/CD</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Handle AI-generated code at volume. Different testing strategies, review processes, deployment gates.</div>
      </div>
    </div>
    <div style="background:#0A0A0A;border-left:8px solid #A8E10C;padding:16px 20px;display:flex;gap:16px;align-items:flex-start;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#A8E10C;line-height:1;min-width:56px;">04</div>
      <div>
        <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Shift new development to L4–5</div>
        <div style="font-family:'Archivo',sans-serif;font-size:12px;color:#7A7772;line-height:1.6;">Autonomous agent patterns for greenfield work while maintaining legacy in parallel.</div>
      </div>
    </div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">16</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 17 BOTTLENECK -->
<div class="slide" style="background:#F5F3EF;">
  <div class="stag">The Path — What To Do</div>

  <div style="position:absolute;left:64px;top:82px;font-family:'Bebas Neue',sans-serif;font-size:117px;line-height:.9;color:#0A0A0A;letter-spacing:1px;">THE BOTTLENECK<br>HAS MOVED.</div>

  <div style="position:absolute;left:64px;top:334px;font-family:'Bebas Neue',sans-serif;font-size:40px;color:#A8E10C;letter-spacing:.5px;">From implementation speed → to specification quality.</div>

  <div style="position:absolute;left:64px;top:400px;width:1152px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#ECEAE5;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0A0A;margin-bottom:8px;">Spec quality</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.6;">The ability to describe what needs to exist precisely enough that machines can build it — without the human filling gaps.</div>
    </div>
    <div style="background:#ECEAE5;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0A0A;margin-bottom:8px;">Domain depth</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.6;">Understanding your system, your customer, and your problem deeply. The dark factory doesn't reduce this demand — it makes it an absolute law.</div>
    </div>
    <div style="background:#ECEAE5;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0A0A;margin-bottom:8px;">Judgment over coordination</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.6;">Shift roles from managing who is rowing to defining where the boat should go with enough precision for machines to navigate.</div>
    </div>
    <div style="background:#ECEAE5;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0A0A;margin-bottom:8px;">Invest in your people</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;line-height:1.6;">Engineers must upskill monthly, not annually. The person still on a January 2026 model needs a February model. This loop won't slow down.</div>
    </div>
  </div>

  <div class="logo"><span style="color:#0A0A0A;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#7A7772;">17</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 18 DEMAND EXPLOSION -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">The Opportunity</div>

  <div style="position:absolute;left:64px;top:77px;width:832px;font-family:'Bebas Neue',sans-serif;font-size:92px;line-height:.9;color:#fff;letter-spacing:1px;">THE TOTAL ADDRESSABLE<br>MARKET FOR SOFTWARE<br>IS EXPLODING.</div>

  <div style="position:absolute;left:64px;top:475px;width:832px;font-family:'Archivo',sans-serif;font-size:15px;color:#7A7772;line-height:1.65;">Every time the cost of computing has dropped, total software produced didn't stay flat — it exploded. Cloud didn't make existing software cheaper; it created SaaS, mobile, streaming, real-time analytics.</div>

  <div style="position:absolute;left:64px;top:584px;width:832px;font-family:'Archivo',sans-serif;font-size:14px;font-style:italic;color:#55524E;line-height:1.6;">We are dropping the cost of software production by an order of magnitude. The unmet need is becoming addressable — not theoretically, now.</div>

  <div style="position:absolute;right:52px;top:90px;width:358px;display:flex;flex-direction:column;gap:16px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;margin-bottom:8px;">Regional hospital</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Custom patient portal: was $300k+. Now addressable.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;margin-bottom:8px;">Mid-market manufacturer</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Custom inventory system: was $500k+. Now viable.</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:16px 20px;">
      <div style="font-family:'Archivo',sans-serif;font-size:14px;font-weight:700;color:#A8E10C;margin-bottom:8px;">Family logistics co.</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.55;">Bespoke ops tools: were unaffordable. Now buildable.</div>
    </div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">18</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 19 CLOSE -->
<div class="slide" style="background:#0A0A0A;">
  <div style="position:absolute;left:0;top:0;width:1280px;height:22px;background:#A8E10C;"></div>

  <div style="position:absolute;left:64px;top:50px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:85px;line-height:.92;color:#fff;letter-spacing:1px;">THE DARK FACTORY<br>DOES NOT REPLACE<br>GREAT ENGINEERS.</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:85px;color:#A8E10C;letter-spacing:1px;margin-top:16px;">IT AMPLIFIES THEM.</div>
  </div>

  <div style="position:absolute;left:64px;bottom:110px;width:960px;font-family:'Archivo',sans-serif;font-size:17px;color:#7A7772;line-height:1.7;">The constraint moves from <em>can we build it</em> — to <em>should we build it.</em><br><span style="color:#55524E;">Should we build it has always been the harder and more interesting question.</span></div>

  <div style="position:absolute;left:0;bottom:0;width:1280px;height:58px;background:#111111;border-top:2px solid #1A1A1A;display:flex;align-items:center;padding:0 64px;gap:40px;">
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;">Kevin Ryan &amp; Associates</div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#55524E;">kevinryan.io</div>
    <div style="flex:1;"></div>
    <div style="font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  </div>

  <div class="snum" style="color:#55524E;">19</div>
</div>


<!-- ═══════════════════════════════════════════════ SLIDE 20 HOW I CAN HELP -->
<div class="slide" style="background:#0A0A0A;">
  <div class="stag">What Next</div>

  <div style="position:absolute;left:64px;top:80px;width:740px;">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#fff;letter-spacing:1px;">THE BOTTLENECK IS SPEC<br>QUALITY AND EXECUTION.</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:.9;color:#A8E10C;letter-spacing:1px;margin-top:12px;">THAT'S WHERE WE WORK.</div>
  </div>

  <div style="position:absolute;left:64px;top:372px;width:1152px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:28px 26px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;color:#A8E10C;margin-bottom:14px;">01 — TALK</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:.95;margin-bottom:16px;">START HERE.<br>ONE CONVERSATION.</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.7;">If you're a CTO, engineering lead, or platform owner — let's talk. No pitch. We figure out together whether what we do is relevant to where you are.</div>
      <div style="margin-top:20px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#A8E10C;">kevinryan.io →</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:28px 26px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;color:#A8E10C;margin-bottom:14px;">02 — ASSESS</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:.95;margin-bottom:16px;">WHERE DOES<br>YOUR ORG SIT?</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.7;">A structured diagnostic — where your team sits on the five levels, what's blocking the transition, and what the migration path looks like for your specific stack, team, and codebase.</div>
      <div style="margin-top:20px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#A8E10C;">kevinryan.io →</div>
    </div>
    <div style="background:#111111;border-left:8px solid #A8E10C;padding:28px 26px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;color:#A8E10C;margin-bottom:14px;">03 — EMBED</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:.95;margin-bottom:16px;">WE COME IN.<br>WE MAKE IT WORK.</div>
      <div style="font-family:'Archivo',sans-serif;font-size:13px;color:#7A7772;line-height:1.7;">We sit inside your team and make the transition happen. Not a report. Not a deck. Working pipelines, working practice, shipped. Field engineering for the AI-native transition.</div>
      <div style="margin-top:20px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:700;color:#A8E10C;">kevinryan.io →</div>
    </div>
  </div>

  <div class="logo"><span style="color:#fff;">KEVIN </span><span style="color:#A8E10C;">RYAN</span></div>
  <div class="snum" style="color:#55524E;">20</div>
</div>

</div><!-- /wrapper -->

<!-- Navigation -->
<div id="nav">
  <button onclick="prev()" title="Previous (←)">←</button>
  <span id="counter">01 / 20</span>
  <button onclick="next()" title="Next (→)">→</button>
  <button onclick="toggleFS()" title="Fullscreen">&#x26F6;</button>
</div>
`

// Defined separately to avoid escaping the template literal inside the scale() function
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

export default function DeckPage() {
  return (
    <>
      {/* Load italic Archivo variants not included in root layout */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="dark-factory-deck-root"
        dangerouslySetInnerHTML={{ __html: slidesHtml }}
      />
      <Script
        id="deck-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: deckScript }}
      />
    </>
  )
}
