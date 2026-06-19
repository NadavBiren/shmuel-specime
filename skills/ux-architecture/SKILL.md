# SKILL.md — ux-architecture
## Page Structure, Layout & User Flow

---

## Purpose

This skill is the layout and structure authority for the Shmuel project. Load it for any task involving: page architecture, section order, navigation, scroll behavior, or spatial relationships between elements.

---

## Site Structure

Three separate HTML files. Each is a self-contained page with its own scroll context.

| Page | File | Role |
|---|---|---|
| Specimen | `docs/index.html` | Font showcase, interactive |
| Research | `docs/research.html` | Editorial, historical |
| Try Me | `docs/try-me.html` | Full-screen font testing tool |

---

## Navigation

A vertical sidebar sits at the right edge of every page. It is **2.5vw wide**, full viewport height, fixed. Three sections (~33.33vh each), stacked top to bottom: **הפונט** / **המחקר** / **הטסטר**. The active page's item gets `color: var(--page-accent)` on a dark background. Hover shows a 15% tint of each section's own accent color (pink for הפונט, orange for המחקר, green for הטסטר). CSS lives in `base.css` (shared). HTML is duplicated across all three pages with `nav-active` on the current page's item. `body` gets `padding-right: 2.5vw` from `base.css` to clear the sidebar.

Each page ends with an exit link leading to the next page in the sequence: Specimen → Research → Try Me.

---

## Specimen Page — Section Order

File: `docs/index.html`

1. **Font Specimen** (`.specimen-outer`) — sticky stage showing שמואל/Shmuel in variable weight; floating "נסו אותי" panel with text input and print-to-canvas button.
2. **Floating Weights** (`.section-floating-weights`) — 6 beverage icon masks (SVGs) + weight labels (mishkalim/Weights) with per-letter wave animation on the title. Hover on icon ↔ label creates cross-component scaling.
3. **Cacao Ceremony** (`.cacao-ceremony-section`) — hardcoded HTML/CSS animation of cacao ceremony poster; weight of title text maps to scroll progress.
4. **Character Grid** (`.section-character-grid`) — sticky inspector panel left (620px glyph, metric lines, unicode data); grids right: Hebrew alphabet, digits (+ ss01/ss02 alternates), punctuation, Latin. Cursor proximity (200px radius) scales weight and cell size.
5. **Try Me** (`.section-try-me`) — mini textarea + 4 sliders (size, weight, line-height, letter-spacing) embedded within the specimen flow.
6. **Fingers** (`.fingers-section`) — hardcoded soda-bottle animation; live text weight maps to scroll.
7. **Display** (`.section-display`) — large-scale blockquote typographic composition.
8. **Text** (`.section-text`) — paragraph specimen at readable size.
9. **Sizes** (`.section-sizes`) — 8 sizes (500pt→32pt) animated; weight cycles on loop; play/pause via IntersectionObserver.
10. **About** (`.section-about`) — font description.
11. **Exit** (`.section-exit`) — link to Research Page.
12. **Footer** (`.site-footer`) — 3-column info footer; `background-color: var(--page-accent)` (neon pink on index).

---

## Research Page — Section Order

File: `docs/research.html`

Layout: nested sticky tab system. 5 staggered tabs at the top (30px height each, 20% width each, positioned RTL from right). Each section is ~200vh tall.

1. **הכתב הבינוני** — historical context of Medium script.
2. **מחקר מקורות** — source research methodology + interactive viewer. 18 sources from `sources.json`. Left: image viewer with hover-based opacity crossfade between scan and digitized rendering. Right: 5×4 button grid + metadata display. Also contains the **inspiration showcase** (`<section class="inspiration-showcase">`): a full-bleed grid with background image (`scans_bg-font.jpg`), hover overlay (`#inspirationOverlay`), and auto-generated `#inspirationGrid` built by `inspiration-showcase.js`. Wired to `inspiration-showcase.css`. The `data-mode` attribute toggles display between `scans` and `fonts`.
3. **סקיצות** — the digitization process and first sketches.
4. **בדיקות ותיקונים** — testing and corrections methodology.
5. **מאפיינים** — font capabilities and features.

Exit link leads to Try-Me Page. Footer at end: `background-color: var(--page-accent)` (neon orange on research).

---

## Try-Me Page

File: `docs/try-me.html`

Full-screen `contenteditable` canvas (`.tryme-canvas`). Default text: beverage name list in Hebrew. Padding: `6vh 4vw`. Text color and background driven by state object in JS. Font size default: 140px (`clamp`-based, fluid).

**Canvas cursor behavior:** The canvas has `caret-color: transparent` — native cursor is hidden. Two-phase cursor system:
1. Before first focus: `has-fake-cursor` class on `.tryme-canvas` renders a blinking `|` via CSS `::after`, rotated 5°.
2. After first focus: `has-fake-cursor` is removed; `initSlantedCaret()` takes over with a positioned `.caret-proxy` div.

Floating control panel: 320px wide, right side (inside `.tryme-sidebar`), collapsible. Panel sections (top to bottom):
1. **Alignment** — RTL, Center, LTR buttons.
2. **Weight + Typography** — preset buttons (רגיל/בולד/בלאק at 500/700/900) + weight slider; size (50–400px), letter-spacing (−0.1–0.5em), line-height (0.7–2.5) sliders. Each slider paired with a synced number input and a reload-to-default icon.
3. **Colors** — 6 palette swatches (filled by JS) + free color pickers for text and background.
4. **Shadow** — checkbox toggle + color + X/Y/blur controls.
5. **Weight Animation** — play/pause button for continuous 500→900→500 weight oscillation.
6. **Features** — collapsible; disabled placeholders for liga, ss01, ss02, hist.
7. **Custom CSS** — collapsible textarea; debounced injection into `<style id="tryme-custom-css">`.

Footer at end: `background-color: var(--page-accent)` (neon green on try-me).

---

## Layout Principles

- RTL layout throughout. `dir="rtl"` on `<html>`. All flow is right-to-left.
- Each section occupies its own clearly bounded `<section>` element.
- Use simple, descriptive, recognizable element and class names. The designer will edit HTML directly — structure must be immediately legible to a human reader without comments.
- No deeply nested div structures without clear reason.
- Sections should be easy to reorder, remove, or replace independently.

---

## Mobile

Desktop is the primary and graded target. Mobile should not break the experience but does not receive dedicated design effort. Desktop experience always takes priority.

---

## Open Items

- [ ] Display and Text sections in specimen are currently hidden — content needed to activate
- [ ] Research page copy is placeholder text — designer to write or approve
- [ ] Features panel in try-me — which OpenType features to wire first
