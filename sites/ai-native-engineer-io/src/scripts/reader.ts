/*
 * The AI-Native Engineer — reader behaviour.
 *
 * Vanilla TS, no framework. Handles: theme + measure toggle, the spine
 * gauge + progress hair + scroll-spy (B27–B31), copy buttons, keyboard
 * navigation (B36), the mobile contents drawer, and client-side search
 * over the built /search-index.json. Motion respects reduced-motion
 * (B34) via the global transition suppression in theme.css.
 */

const $ = <T extends Element = HTMLElement>(sel: string): T | null =>
  document.querySelector<T>(sel);

const $$ = <T extends Element = HTMLElement>(sel: string): T[] =>
  Array.from(document.querySelectorAll<T>(sel));

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── theme + measure ──────────────────────────────────────── */
function initThemeToggle() {
  const btn = $<HTMLButtonElement>('#btn-theme');
  if (!btn) return;
  const sync = () => {
    const t = document.documentElement.dataset.theme ?? 'dark';
    btn.setAttribute('aria-pressed', String(t === 'light'));
  };
  sync();
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ane-theme', next); } catch {}
    sync();
  });
}

function initMeasureToggle() {
  const btn = $<HTMLButtonElement>('#btn-measure');
  if (!btn) return;
  const order = ['normal', 'wide', 'narrow'] as const;
  const sync = () => {
    const m = document.documentElement.dataset.measure ?? 'normal';
    btn.setAttribute('aria-pressed', String(m !== 'normal'));
  };
  sync();
  btn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.measure ?? 'normal';
    const idx = order.indexOf(cur as (typeof order)[number]);
    const next = order[(idx + 1) % order.length];
    document.documentElement.dataset.measure = next;
    try { localStorage.setItem('ane-measure', next); } catch {}
    sync();
    measure();
  });
}

/* ── scroll: progress hair, spine gauge, active section ──── */
const article = () => $<HTMLElement>('#article');

function measure() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;

  const progress = $<HTMLElement>('#progress');
  if (progress) progress.style.width = `${pct * 100}%`;
  const fill = $<HTMLElement>('#gauge-fill');
  if (fill) fill.style.height = `${pct * 100}%`;
  const pctEl = $<HTMLElement>('#gauge-pct');
  if (pctEl) pctEl.textContent = `${Math.round(pct * 100)}%`;

  // scroll-spy: light the last section heading above the fold.
  const onpageItems = $$<HTMLElement>('.onpage-item');
  if (onpageItems.length === 0) return;
  let active: string | null = null;
  for (const item of onpageItems) {
    const id = item.dataset.for;
    if (!id) continue;
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 140) active = id;
  }
  for (const item of onpageItems) {
    item.classList.toggle('is-active', item.dataset.for === active);
  }
}

function buildGaugeTicks() {
  const track = $<HTMLElement>('#gauge-track');
  if (!track) return;
  track.querySelectorAll('.gauge-tick').forEach((t) => t.remove());
  const n = $$('.onpage-item').length;
  if (n < 2) return;
  for (let i = 1; i < n; i++) {
    const tick = document.createElement('div');
    tick.className = 'gauge-tick';
    tick.style.top = `${(i / n) * 100}%`;
    track.appendChild(tick);
  }
}

/* ── copy buttons (figure.code) ───────────────────────────── */
function initCopy() {
  for (const btn of $$<HTMLButtonElement>('[data-copy]')) {
    btn.addEventListener('click', () => {
      const fig = btn.closest('figure');
      const pre = fig?.querySelector('pre');
      if (!pre) return;
      const text = pre.textContent ?? '';
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = 'Copied';
        btn.classList.add('is-done');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('is-done');
        }, 1400);
      });
    });
  }
}

/* ── mobile contents drawer ───────────────────────────────── */
function initDrawer() {
  const btn = $<HTMLButtonElement>('#menu-btn');
  const rail = $<HTMLElement>('#toc');
  const scrim = $<HTMLElement>('#scrim');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!rail) {
      // Cover page: jump to the cover contents instead.
      const idx = document.querySelector('.cover-index');
      if (idx) idx.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
      return;
    }
    const open = rail.classList.toggle('is-open');
    scrim?.classList.toggle('is-open', open);
  });
  scrim?.addEventListener('click', () => {
    rail?.classList.remove('is-open');
    scrim.classList.remove('is-open');
  });
}

/* ── keyboard ─────────────────────────────────────────────── */
function initKeyboard() {
  const nav = $<HTMLElement>('#page-nav');
  const prev = nav?.dataset.prev;
  const next = nav?.dataset.next;

  document.addEventListener('keydown', (e) => {
    // Escape closes the search overlay and is swallowed so the browser
    // never sees it — otherwise the OS minimises the frontmost window on
    // a stray Escape. When the overlay is closed, Escape passes through
    // untouched so the browser/OS shortcut still works.
    if (e.key === 'Escape') {
      if (isSearchOpen()) {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
      }
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.key === '/') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 't') {
      $<HTMLButtonElement>('#btn-theme')?.click();
    } else if (e.key === 'g') {
      window.location.href = '/';
    } else if (e.key === 'ArrowRight' && next) {
      window.location.href = `/${next}`;
    } else if (e.key === 'ArrowLeft' && prev) {
      window.location.href = `/${prev}`;
    }
  });
}

/* ── search ───────────────────────────────────────────────── */
type SearchEntry = { slug: string; n: string; title: string; text: string };
let index: SearchEntry[] | null = null;

async function loadIndex(): Promise<SearchEntry[]> {
  if (index) return index;
  const res = await fetch('/search-index.json');
  index = (await res.json()) as SearchEntry[];
  return index;
}

function renderResults(term: string) {
  const box = $<HTMLElement>('#results');
  if (!box) return;
  const t = term.trim();
  if (!t) {
    box.innerHTML = '<div class="search-empty">Type to search across published chapters.</div>';
    return;
  }
  const needle = t.toLowerCase();
  const data = index ?? [];
  const hits = data
    .filter(
      (e) => e.title.toLowerCase().includes(needle) || e.text.toLowerCase().includes(needle),
    )
    .slice(0, 10);
  if (hits.length === 0) {
    box.innerHTML = '<div class="search-empty">No matches. Try a different word.</div>';
    return;
  }
  box.innerHTML = '';
  for (const h of hits) {
    const i = h.text.toLowerCase().indexOf(needle);
    const start = i >= 0 ? Math.max(0, i - 60) : 0;
    const snip = (i >= 0 ? '…' : '') + h.text.slice(start, start + 170) + '…';
    const safe = snip.replace(
      new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'),
      (m) => `<mark>${m}</mark>`,
    );
    const a = document.createElement('a');
    a.className = 'result';
    a.href = `/${h.slug}`;
    a.innerHTML = `<span class="r-src">§ ${h.n} · ${h.title}</span><span class="r-txt">${safe}</span>`;
    box.appendChild(a);
  }
}

function openSearch() {
  const el = $<HTMLElement>('#search');
  if (!el) return;
  el.classList.add('is-open');
  const input = $<HTMLInputElement>('#q');
  if (input) {
    input.value = '';
    input.focus();
  }
  renderResults('');
  loadIndex().then(() => renderResults(input?.value ?? ''));
}

function isSearchOpen(): boolean {
  return $('#search')?.classList.contains('is-open') ?? false;
}

function closeSearch() {
  const el = $<HTMLElement>('#search');
  if (el) el.classList.remove('is-open');
}

function initSearch() {
  $<HTMLButtonElement>('#btn-search')?.addEventListener('click', openSearch);
  const input = $<HTMLInputElement>('#q');
  input?.addEventListener('input', () => renderResults(input.value));
  $<HTMLElement>('#search')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSearch();
  });
}

/* ── boot ─────────────────────────────────────────────────── */
function init() {
  initThemeToggle();
  initMeasureToggle();
  initDrawer();
  initSearch();
  initKeyboard();
  initCopy();
  buildGaugeTicks();
  measure();
  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
