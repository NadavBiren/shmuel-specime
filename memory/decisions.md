# decisions.md — Technical & Design Decisions

## Format
Each entry: decision | rationale | what it rules out.

---

## Active Decisions

### Stack: Vanilla HTML/CSS/JS
**Rationale:** Minimal tooling overhead; site is a specimen, not an app. Full control over font-variation-settings and animation without framework abstraction.
**Rules out:** React, Vue, Svelte, any component framework. No build tools unless explicitly introduced.

### RTL-first layout
**Rationale:** Shmuel is a Hebrew font. The specimen must demonstrate the font in its native reading direction.
**Rules out:** LTR-default layout patterns. All structural CSS must account for RTL flow.

### Font delivery: local @font-face
**Rationale:** Variable font file(s) served from `site/assets/fonts/`. No CDN, no Google Fonts.
**Rules out:** Any remote font loading for Shmuel itself.

### Three-page structure: Specimen + Research + Try Me
**Rationale:** Separates the typographic showcase (index.html), the historical documentation (research.html), and the hands-on testing tool (try-me.html). Each page has a distinct mode and audience intent.
**Rules out:** Collapsing all concerns into one or two pages; adding a fourth page without deliberate justification.

### Hero: Pure CSS 12-layer depth effect
**Rationale:** The word שמואל is rendered as 12 stacked `<span>` elements in a CSS perspective container. Each layer offsets opacity and color (cream→gold gradient). Mouse X/Y drives CSS custom properties `--mx` and `--my`, rotating the container. Weight follows a history array — each layer trails the next, creating an echo effect. No external libraries needed; Three.js/Troika was deferred and ultimately not pursued.
**Rules out:** Three.js, Troika-three-text, WebGL, or any 3D library for the hero. Vanilla JS + CSS only.

### Mobile: Desktop priority
**Rationale:** Graded presentation is desktop-only. Mobile is a bonus.
**Rules out:** Any compromise of desktop experience for cross-device compatibility.

### Navigation: Vertical sidebar, right edge, three sections
**Rationale:** Replaced fixed top-right pill with a 3vw vertical sidebar on the right. Labels (top to bottom): פונט, מחקר, נסו אותי. Each section is ~33.33vh. Active page gets --color-second (#27D8A8) background with dark text; hover gets rgba(39,216,168,0.15) with --color-second text. CSS lives in base.css (shared). Sidebar HTML is duplicated across all three pages with nav-active on the current page's item.
**Rules out:** Horizontal nav, pill/button nav, hamburger menu, bottom nav.
