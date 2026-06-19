# SKILL.md — design-system
## CSS Architecture, Tokens, Code Conventions & Tech Stack

---

## Purpose

This skill governs all code structure, naming conventions, CSS tokens, and technical standards for the Shmuel site. Load it for any task involving: CSS variables, file structure, class naming, font loading, or stack decisions.

---

## File Structure

```
docs/
├── index.html                    ← Specimen Page
├── research.html                 ← Research Page
├── try-me.html                   ← Try-Me Tool Page
├── assets/
│   ├── fonts/                    ← All font files live here
│   ├── data/                     ← sources.json (18 manuscript sources)
│   └── images/                   ← scan-to-font/ JPG pairs, svg/, footer/, from-Inspiration-to-font/
├── styles/
│   ├── base.css                  ← Global tokens, resets, shared rules, sidebar nav, footer
│   ├── specimen.css              ← Specimen Page specific styles
│   ├── research.css              ← Research Page specific styles
│   ├── try-me.css                ← Try-Me Tool Page specific styles
│   └── inspiration-showcase.css  ← Inspiration showcase component (research page only)
└── scripts/
    ├── specimen.js               ← Specimen Page logic
    ├── research.js               ← Research Page logic
    ├── try-me.js                 ← Try-Me Tool Page logic
    └── inspiration-showcase.js  ← Inspiration showcase component logic
```

Load order in every HTML file:
1. `base.css`
2. Page-specific CSS
3. Component CSS if needed (e.g., `inspiration-showcase.css` in research.html)
4. Page-specific JS at end of `<body>`
5. Component JS before page JS if needed

---

## Color Palette

The site uses a **neon dark theme**. Background is near-black; accents are high-contrast neons. All tokens live in `base.css :root`.

```css
:root {
  /* Neon accents */
  --color-main:   #FF1493;   /* neon pink   — index/specimen page accent */
  --color-second: #FFFF00;   /* neon yellow — secondary accent           */
  --color-third:  #FF5E00;   /* neon orange — research page accent       */
  --color-fourth: #39FF14;   /* neon green  — try-me page accent         */

  /* Surfaces */
  --color-black:     #151515;   /* off-black — body background           */
  --color-dark:      #3A3835;   /* dark grey — borders, dividers         */
  --color-grey:      #7A7875;   /* mid grey  — muted text, annotations   */
  --color-lightgrey: #c0c0c0;   /* soft grey — light mode background     */
  --color-white:     #F5F2ED;   /* off-white — text on dark, light bg    */

  /* Ink tones */
  --color-ink-warm:  #151515;   /* warm near-black — panel/item bg       */
  --color-ink-deep:  #151515;   /* deeper near-black — sidebar bg        */

  /* Derived opacities */
  --color-main-dim:    rgba(255, 20,  147, 0.12);
  --color-main-faint:  rgba(255, 20,  147, 0.06);
  --color-second-dim:  rgba(255, 255, 0,   0.12);
  --color-third-dim:   rgba(255, 94,  0,   0.12);
  --color-third-faint: rgba(255, 94,  0,   0.06);
  --color-fourth-glow: rgba(57,  255, 20,  0.5);

  /* Structure */
  --color-border-dark:  rgba(245, 242, 237, 0.07);
  --color-border-light: rgba(15, 14, 12, 0.08);

  /* Other */
  --color-pure-black:   #000000;
  --color-surface-dark: #1E1E1C;
  --color-focus:        #D3D3D3;
  --color-muted-warm:   #888880;
  --color-soda-yellow:  #f5f000;  /* fingers-animation stage yellow */
}
```

Never introduce hex values or `rgb()` directly in component styles — always reference a token. Exception: `try-me.css` panel uses direct hex for neutral interactive states too granular for the global palette.

---

## Per-Page Accent System (`--page-accent`)

Each page declares `--page-accent` via a body class selector in `base.css`. This single variable drives: footer background, footer text color, sidebar active state, and scrollbar thumb color.

```css
body.page-index    { --scrollbar-color: var(--color-main);   --page-accent: var(--color-main);   }
body.page-research { --scrollbar-color: var(--color-third);  --page-accent: var(--color-third);  }
body.page-tryme    { --scrollbar-color: var(--color-fourth); --page-accent: var(--color-fourth); }
```

When adding any element that should match the current page's color without hardcoding it, use `var(--page-accent)`.

---

## Typography Tokens

```css
:root {
  --font-primary:         'Shmuel', serif;
  --font-secondary:       'SimplerMono', 'Courier New', monospace;

  /* Secondary font size scale */
  --size-meta-large:      clamp(1.1rem, 1.4vw, 1.4rem);   /* ~18–22px */
  --size-meta-small:      clamp(0.9rem, 1.05vw, 1.1rem);  /* ~14–18px */
  --tracking-mono:        0.04em;

  /* Weight name tokens */
  --font-weight-light:    300;
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
  --font-weight-heavy:    800;
  --font-weight-black:    900;
}
```

No type scale is locked — sizes are defined per section using `clamp()` for fluid scaling. The secondary font (`SimplerMono`) provides typographic contrast: calligraphic historical serif vs. sterile machine-precision mono.

---

## Font Loading

```css
@font-face {
  font-family: 'Shmuel';
  src: url('../assets/fonts/shmuel-Regular.ttf') format('truetype');
  font-weight: 500 900;             /* variable axis covers 500–900 only */
  font-display: block;              /* specimen must not flash unstyled */
}

@font-face {
  font-family: 'SimplerMono';
  src: url('../assets/fonts/SimplerPro_HLAR_Mono-Regular.otf') format('opentype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'SimplerMono';
  src: url('../assets/fonts/SimplerPro_HLAR_Mono-Medium.otf') format('opentype');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'SimplerMono';
  src: url('../assets/fonts/SimplerPro_HLAR_Mono-Bold.otf') format('opentype');
  font-weight: 700;
  font-display: swap;
}
```

Shmuel's `font-weight` range is **500–900**. There is no Light (300) or Regular (400) — the axis starts at Medium. Current format: TTF. Add WOFF2 when preparing for production.

---

## Interactive Tokens

All interactive state is driven by CSS custom properties set via JS. Defined in `:root` with defaults:

```css
:root {
  --scroll-weight: 500;   /* Updated by scroll listener — drives font weight */
  --cursor-x:      0.5;   /* 0–1, normalized cursor position */
  --cursor-y:      0.5;
}
```

JS sets values. CSS consumes them. Keep style logic in CSS, not JS.

---

## Global Footer (in `base.css`)

`.site-footer` is defined in `base.css` and shared across all three pages. It uses `--page-accent` for its color so it automatically changes color per page — no per-page overrides needed.

```css
.site-footer {
  background-color: var(--page-accent);  /* neon pink / orange / green per page */
  font-family: var(--font-secondary);
}

.site-footer__title {
  font-variation-settings: 'wght' 900;
  font-size: 7vw;
  color: var(--color-black);             /* black text on accent background */
}

.site-footer__col span,
.site-footer__col a,
.site-footer__col p {
  background-color: var(--color-black);  /* reversed-out label strips */
  color: var(--page-accent);
}
```

Structure: title row + 3-column grid (`repeat(3, 1fr)` with `clamp` gap). Markup duplicated in all three HTML files.

---

## CSS Architecture Rules

- All global tokens in `base.css` only
- Page-specific rules in their respective CSS file
- No inline styles except when set by JS for performance-critical animation (e.g. `transform` on `requestAnimationFrame`)
- No `!important` except inside `@media (prefers-reduced-motion: reduce)` — correct standard practice
- No deeply nested selectors — maximum 3 levels
- Sections styled by their `<section>` element and a single descriptive class

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
| CSS token | `--category-descriptor` | `--color-main` |
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
