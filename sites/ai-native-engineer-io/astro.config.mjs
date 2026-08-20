import { defineConfig } from 'astro/config';

// The AI-Native Engineer — a book, generated from markdown.
//
// Plain Astro (no Starlight): the locked THEME-SPEC imposes a bespoke
// book design (cover, spine gauge, contents rail) that Starlight's
// chrome would override. Astro is a transparent HTML emitter, so the
// canonical design-assets/theme.css is applied unchanged and the page
// chrome lives in src/styles/layout.css, referencing tokens only.
//
// Commit provenance mirrors docs-kevinryan-io: the Dockerfile injects
// PUBLIC_COMMIT_SHA / PUBLIC_COMMIT_DATE as build args, which Astro
// exposes on import.meta.env.

export default defineConfig({
  site: 'https://ai-native-engineer.io',
  // Token provenance: {{COMMIT_SHA}} is replaced by the Dockerfile at
  // build time so the cover carries the exact commit the site was
  // built from, per the preface's "commit hash at the top of the page".
  build: {
    // Inline small stylesheets so the canonical theme ships in a
    // single CSS request. The book is text-first; one stylesheet is
    // the Swiss-grid-consistent choice.
    inlineStylesheets: 'auto',
  },
  // Code figures are authored as raw <figure class="code"> HTML with
  // canonical .tok-* token spans, so the theme owns their styling.
  // Shiki only runs on fenced blocks, which the chapters avoid.
});
