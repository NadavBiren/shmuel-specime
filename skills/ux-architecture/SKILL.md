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

A vertical sidebar sits at the right edge of every page. It is 3vw wide, full viewport height, fixed. Three sections (~33.33vh each), stacked top to bottom: **פונט**, **מחקר**, **נסו אותי**. The active page's item gets `--color-gold-dark` background; hover gets `--color-gold-light`. CSS lives in `base.css` (shared). HTML is duplicated across all three pages with `nav-active` on the current page's item. Body gets `padding-right: 3vw` from base.css to clear the sidebar.

Each page ends with an exit link leading to the next page in the sequence: Specimen → Research → Try Me.

---

## Specimen Page — Section Order

File: `docs/index.html`

1. **Hero** — 12-layer CSS depth effect, word שמואל. Mouse X/Y drives perspective rotation; weight echoes across layers via history array.
2. **Try Me** — full-viewport editable textarea with 4 sliders (size, weight, line-height, letter-spacing).
3. **Weights** — 7 rows (300, 400, 500, 600, 700, 800, 900), each editable, auto-sized text, varied background colors per row.
4. **Character Grid** — sticky inspector panel on the left (620px glyph display, metric lines, unicode data); 4 grids on the right (22 Hebrew letters, final forms, digits, punctuation). Cursor proximity scales weight and cell size (200px radius).
5. **Display** — large-scale typographic composition (currently hidden).
6. **Text** — paragraph setting at readable sizes (currently hidden).
7. **Size Range** — 8 sizes from 500pt→32pt animated continuously; weight cycles 300→900 on a loop; play/pause button appears on scroll into section.
8. **About** — font description text, green-sage background.
9. **Exit** — link to Research Page.

---

## Research Page — Section Order

File: `docs/research.html`

Layout: nested sticky tab system. 5 staggered tabs at the top (30px height each, 20% width each, positioned RTL from right). Each section is ~200vh tall.

1. **הכתב הבינוני** — historical context of Medium script, gold-dark background.
2. **מחקר מקורות** — source research methodology + interactive viewer. 18 sources from `sources.json`. Left: image viewer with hover-based opacity crossfade between scan and digitized rendering. Right: 5×4 button grid + metadata display (source name, year, writer, place, style, available letters).
3. **סקיצות** — the digitization process and first sketches, ink-warm background.
4. **בדיקות ותיקונים** — testing and corrections methodology, green-sage background.
5. **מאפיינים** — font capabilities and features, green-olive background.

Exit link leads to Try-Me Page.

---

## Try-Me Page

File: `docs/try-me.html`

Full-screen contenteditable canvas (default: Hebrew historical passage). Padding: 6vh 4vw. Text color and background driven by state.

Floating control panel: 320px wide, bottom-left, collapsible. Panel sections (top to bottom):
1. **Alignment** — RTL, Center, LTR buttons.
2. **Weight** — dropdown (300–900 named steps + "custom") + conditionally revealed range slider + preview letter. Selection-aware: detects mixed weights, shows "mixed".
3. **Typography** — 3 sliders: size (12–360px), letter-spacing (−0.1–0.3em), line-height (0.6–3). Each slider paired with a synced number input.
4. **Colors** — 6 palette swatches (5 fixed, 1 random on load) + free color pickers for text and background.
5. **Outline** — checkbox toggle + color picker + size slider (webkit-text-stroke).
6. **Shadow** — checkbox toggle + color + X/Y/blur controls.
7. **Features** — disabled placeholders for liga, ss01, ss02, hist (wired but not yet active).
8. **Reset** — restores default text.
9. **Custom CSS** — collapsed textarea; debounced injection into `<style id="tryme-custom-css">`.

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
