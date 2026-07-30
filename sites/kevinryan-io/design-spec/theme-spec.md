---
id: 002-site-theme
title: Kevin Ryan & Associates, site theme
status: locked
version: 2.0.0
authority: this document
supersedes: the lime-on-white brand applied to kevinryan.io up to v0.1.0
artefacts:
  - app/globals.css               # canonical implementation
  - design-spec/theme-sheet.html   # rendered specimen, visual acceptance
related:
  - 001-book-theme                 # The AI-Native Engineer. Sibling, not parent.
---

## Intent

A single theme for kevinryan.io. Deep neutral ground, one washed-lime accent, Swiss International Style grid, developer register. The site is a design sibling to *The AI-Native Engineer* rather than a copy of it: it shares the discipline and shares none of the signature devices.

The theme is consumed by generators as well as by people. Every value in it must be reproducible by an agent working from this document alone.

## Authority

This document is the authority. `app/globals.css` is the canonical implementation and must not diverge from it. `design-spec/theme-sheet.html` is the visual acceptance artefact. If the three disagree, this document wins and the others are rebuilt.

## Relationship to 001-book-theme

Inherited: the semantic token layer, fixed type steps, the 8px spacing scale, zero radius, no shadows, hairline structure with a sunken surface for depth, mono carrying all structure, the focus ring, reduced-motion suppression and the print rules.

Deliberately not inherited: the spine gauge, the top progress hairline, chapter numerals, section marks, the light theme, the Nord palette and the Archivo type. Those are the book's identity. Reusing them would have produced a clone.

## Behaviour

### Colour

- B1. One accent exists. `--accent` is used for links, active states, focus rings, section eyebrows, status marks and hover feedback, and for nothing else.
- B2. There is no second theme. The site is dark only. No `data-theme` attribute, no toggle, no auto-detection.
- B3. The ground sits at hue 236 in LCH with chroma at or below 4.2. Low grey chroma is load-bearing: it is what allows a single low-saturation accent to read as the only colour on the page.
- B4. `--accent` is the brand lime `#A8E10C` washed out. Hue 76 to 97, saturation 90 to 46 per cent, lightness 46 to 74 per cent. It must not be replaced with the unwashed lime.
- B5. Body text meets 7:1 against its background. Muted text meets 4.5:1. `--ink-3` on `--bg` is 4.61:1 and is the tightest pair in the system. Any darkening of the ink scale must be re-measured.
- B6. `--warn` and `--danger` encode state and are used nowhere else. There is no separate success colour: the live state uses `--accent`, because two greens on one page, one meaning interaction and one meaning state, is a confusion rather than a distinction.
- B7. No sixth colour is introduced under any circumstances.

### Typography

- B8. Three families. Space Grotesk for display, headings and UI names. IBM Plex Sans for reading body only. IBM Plex Mono for all structure: numbers, metadata, tags, buttons, labels, table headers.
- B9. Fonts are self-hosted through `@fontsource` and imported in `app/layout.tsx`. No request leaves the origin to render type. This is a sovereignty requirement, not a performance one.
- B10. Eleven fixed type steps exist. Generated output uses those steps and no intermediate values.
- B11. Two steps are fluid and clamped: `display` and `h1`. All others are fixed.
- B12. Uppercase is set in the mono face only. Display and body faces are never uppercased.
- B13. The heading map is `.t-display`, `h1`/`.t-h1`, `h2`/`.t-h2`, `h3`/`.t-h3`, `.label`. No intermediate levels are created. `.t-display` appears once per site, on the cover.
- B14. Section heads carry a mono eyebrow above the title. No numeral, no section marker glyph.
- B15. `.label` is a utility label outside the reading hierarchy. It never introduces reading content.
- B16. Reading measure is set by `.prose` from `--measure`. No other element sets a measure.

### Structure and surface

- B17. Border radius is zero everywhere.
- B18. There are no shadows, gradients, glows or glass effects. Depth is expressed with `--bg-sink` and hairlines only.
- B19. Structural lines are 1px `--line`. Emphasis edges are 2px and appear only on blockquotes and callout left edges.
- B20. Dashed borders appear on the empty state and nowhere else.
- B21. All spacing derives from the 8px scale. Arbitrary pixel values are a defect.
- B22. Sections alternate between `--bg` and `--bg-sink` to give rhythm. The step between them is roughly 4.5 in L*, which is the minimum that reads without a second surface colour.

### Components

- B23. Exactly three status pills exist: live, draft, plan.
- B24. Callouts are `.callout > .callout__label + p`. Colour lives on the left edge and the label. The body stays neutral. Callouts carry no icons.
- B25. Tables have no vertical rules, no zebra striping and no outer border. Numeric columns use `.num` with tabular figures.
- B26. One primary button per view.
- B27. The top bar carries a location readout, not a progress indicator. There is no scroll progress bar and no gauge anywhere in the system.

### Motion and accessibility

- B28. Nothing animates on entry. Motion responds to input only. Scroll-triggered reveals are prohibited, as are marquees and any other self-starting animation.
- B29. Focus is visible as a 2px square accent ring at 3px offset.
- B30. All transitions and animations are suppressed under `prefers-reduced-motion`.
- B31. At 1180px the three-column cell grids drop to two and the client grid drops to four. At 900px all cell grids become single column, the timeline loses its spine, the cover stacks and the location readout is hidden.

### Print

- B32. Print output drops the top bar and the keyword band, inverts to black on white, and removes the reading measure.
- B33. Headings do not break from the content that follows them.

## Tokens

Defined in `app/globals.css` under `@theme` so that Tailwind utilities resolve against them.

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#2A3033` | page |
| `--color-bg-raise` | `#32383C` | panels above the page |
| `--color-bg-sink` | `#212729` | wells, alternating sections, hover |
| `--color-line` | `#3C4448` | structural hairline |
| `--color-line-soft` | `#333A3D` | list and row separators |
| `--color-ink` | `#EBEEF0` | primary text, 11.49:1 |
| `--color-ink-2` | `#D5DBDE` | body, secondary, 9.60:1 |
| `--color-ink-3` | `#90999D` | metadata, muted, disabled, 4.61:1 |
| `--color-accent` | `#B7DCA0` | the only interactive colour, 8.77:1 |
| `--color-accent-2` | `#98C57D` | accent, quieter |
| `--color-accent-ink` | `#2A3033` | text on an accent fill |
| `--color-warn` | `#EBCB8B` | drafting state |
| `--color-danger` | `#BF616A` | failure state |

Type steps: micro 10, label 11, caption 12, code 13, ui 14, read 17, lead 19, h3 21, h2 24, h1 44 (clamped), display 100 (clamped).

Spacing: 8, 16, 24, 32, 40, 48, 56, 64, 80, 112.

Layout: topbar 52, measure 68ch, shell 1400, page padding `clamp(24px, 5vw, 72px)`.

## Non-goals

- N1. No component library or framework binding beyond Tailwind's token layer. The component classes are plain CSS and are consumable from any renderer.
- N2. No light theme in this version.
- N3. No icon set. Labels do the work icons would do.
- N4. No animation library.
- N5. No responsive type interpolation beyond the two clamped steps.

## Open

- O1. The `/ai-native-readiness-assessment` page still carries the previous light-brand markup. `app/globals.css` ends with a compatibility layer that maps its old token names onto the new ground so it stays coherent, but it has not had a design pass. It should be rebuilt against this spec.
- O2. Certifications are stated as GitLab x6 because six badge links exist. The practice brief says nine. Reconcile before this ships.
- O3. Voice is inconsistent. The header now names the firm, the hero speaks as the person, and four of the six capability cards say "we" while delivery and contact say "I". Settle on one voice.
- O4. `fitty` remains a dependency and is no longer used by any component on the home page. Confirm the assessment page does not need it, then remove.
- O5. `hooks/useRevealOnScroll.ts` is no longer called and `Reveal` is now a structural wrapper. Both can be removed once the assessment page is rebuilt.
- O6. This directory sits at the site root rather than the monorepo root, because that is the scope that was reachable. If the theme is to be shared across the other six sites, move it up and import from there.

## Acceptance

The implementation is accepted when `design-spec/theme-sheet.html` renders every component without visual defect, when no generated file violates a constraint listed above, and when `pnpm build` completes with no type or lint errors.

## Install note

This change adds three dependencies. Run `pnpm install` before the first build:

    @fontsource/space-grotesk
    @fontsource/ibm-plex-sans
    @fontsource/ibm-plex-mono
