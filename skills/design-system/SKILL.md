# SKILL.md — design-system
## CSS Architecture, Tokens, Code Conventions & Tech Stack

---

## Purpose

This skill governs all code structure, naming conventions, CSS tokens, and technical standards for the Shmuel site. Load it for any task involving: CSS variables, file structure, class naming, font loading, or stack decisions.

---

## File Structure

```
site/
├── index.html           ← Specimen Page
├── research.html        ← Research Page
├── try-me.html          ← Try-Me Tool Page
├── assets/
│   ├── fonts/           ← All font files live here
│   ├── data/            ← sources.json (18 manuscript sources)
│   └── images/          ← scan-to-font/ JPG pairs
├── styles/
│   ├── base.css         ← Global tokens, resets, shared rules, sidebar nav
│   ├── specimen.css     ← Specimen Page specific styles
│   ├── research.css     ← Research Page specific styles
│   └── try-me.css       ← Try-Me Tool Page specific styles
└── scripts/
    ├── specimen.js      ← Specimen Page logic
    ├── research.js      ← Research Page logic
    └── try-me.js        ← Try-Me Tool Page logic
```

Load order in every HTML file:
1. `base.css`
2. Page-specific CSS (`specimen.css`, `research.css`, or `try-me.css`)
3. Page-specific JS at end of `<body>`

---

## Color Palette

Ten surface and accent tokens. No fixed semantic roles — sections assign colors freely from this palette. Adjust hex values directly in `base.css` as the visual design develops.

```css
:root {
  /* Surfaces */
  --color-cream:        #F5F2ED;   /* specimen page background */
  --color-ink:          #141414;   /* body text on cream */
  --color-ink-warm:     #181612;   /* warm near-black, section backgrounds */
  --color-ink-deep:     #0F0E0C;   /* deepest sections */
  --color-panel-bg:     #F4F4F2;   /* try-me floating panel background */

  /* Accents */
  --color-gold-dark:    #C8922A;   /* warm amber */
  --color-gold-light:   #F0C84A;   /* bright gold */

  /* Greens */
  --color-green-olive:  #3A4920;   /* dark aged-ink olive */
  --color-green-sage:   #7B9068;   /* muted desaturated sage */

  /* Grey */
  --color-grey-warm:    #C4C0B8;   /* light warm grey */
}
```

Never introduce hex values or rgb() directly in component styles — always reference a token. Exception: the try-me.css panel uses direct hex values for its neutral interactive states (hover/active on panel controls) — those are too granular and context-specific for the global palette.

---

## Typography Tokens

```css
:root {
  --font-primary:        'Shmuel', serif;
  --font-secondary:      'GretaSans', sans-serif;
  --font-weight-light:   300;
  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold:600;
  --font-weight-bold:    700;
  --font-weight-heavy:   800;
  --font-weight-black:   900;

  --font-size-min:       32px;
}
```

No type scale is locked — sizes are defined per section. Minimum font size is 32px. Do not set body text below this without explicit instruction.

---

## Font Loading

```css
@font-face {
  font-family: 'Shmuel';
  src: url('../assets/fonts/shmuel-Regular.ttf') format('truetype');
  font-weight: 300 900;
  font-display: block; /* specimen must not flash unstyled */
}

@font-face {
  font-family: 'GretaSans';
  src: url('../assets/fonts/GretaSansH+L-Regular.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
```

Current format: TTF. The variable font (`shmuel-Regular.ttf`) covers wght 300–900 and is live. Add WOFF2 when preparing for production.

---

## Interactive Tokens

All interactive state is driven by CSS custom properties set via JS. Define them in `:root` with defaults:

```css
:root {
  --scroll-weight:   300;    /* Updated by scroll listener */
  --cursor-x:        0.5;    /* 0–1, normalized */
  --cursor-y:        0.5;    /* 0–1, normalized */
}
```

JS sets values. CSS consumes them. Keep JS out of style logic.

---

## CSS Architecture Rules

- All global tokens in `base.css` only
- Page-specific rules in their respective CSS file
- No inline styles except when set by JS for performance-critical animation (e.g. `transform` on `requestAnimationFrame`)
- No `!important`
- No deeply nested selectors — maximum 3 levels
- Sections styled by their `<section>` element and a single descriptive class: e.g. `section-hero`, `section-weights`, `section-character-grid`

---

## HTML Conventions

- `<html dir="rtl" lang="he">` on every page
- Each page section is a `<section>` with a single descriptive class name
- Class names are lowercase, hyphenated, English
- The designer edits HTML directly — keep structure flat, legible, and easy to reorder without comments
- No div nesting deeper than necessary
- Navigation element: `<nav class="sidebar-nav">` present on all three pages, HTML duplicated per page

---

## Naming Convention

| Type | Format | Example |
|---|---|---|
| CSS token | `--category-descriptor` | `--color-gold-dark` |
| Section class | `section-[name]` | `section-hero` |
| JS variable | camelCase | `scrollWeight` |
| JS function | camelCase verb | `updateScrollWeight()` |
| File name | kebab-case | `try-me.js` |

---

## Tech Stack — Current

| Layer | Tool |
|---|---|
| Markup | Vanilla HTML |
| Style | Vanilla CSS |
| Interaction | Vanilla JS |
| Build | None |
| Font format | TTF (variable) → WOFF2 for production |

Introducing any new dependency requires explicit discussion and a logged decision in `memory/decisions.md`.

---

## Open Items

- [ ] WOFF2 conversion — deferred to production phase
- [ ] FedraSansVariableVF.ttf loaded in assets but not used in CSS — confirm if needed or remove
