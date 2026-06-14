# SKILL.md — interaction
## Animations, Scroll Behavior & Creative Dev Logic

---

## Purpose

This skill governs all interactive and animated behavior across the Shmuel site. Load it for any task involving: motion, scroll effects, user input response, or event-driven state changes.

---

## Motion Language

**Funky, sharp, playful, semi-3D.**
Interactions should feel physical — like type has weight and presence. Easing defaults: fast in, slow out. Avoid smooth, generic ease-in-out. Prefer snappy transitions with slight overshoot where appropriate. Multi-layer depth is a recurring visual motif — interactions should reinforce this, not flatten it.

---

## Tech Stack — Interaction Layer

Vanilla JS only. No animation libraries, no Three.js, no external dependencies. All motion is CSS transitions/animations driven by JS-set custom properties.

---

## Hero — CSS 12-Layer Depth Effect

The word שמואל is rendered as 12 stacked `<span>` elements inside a CSS perspective container. This is all vanilla JS + CSS — no libraries.

**Visual construction:**
- Each layer is absolutely positioned, identical text, same position.
- Layers differ in opacity and color: a gradient from cream (front) toward gold (back).
- The container has a CSS `perspective` applied; the layers are translated in Z so they fan out in depth.

**Mouse interaction:**
- `mousemove` on the hero section updates `--mx` (0–1, horizontal) and `--my` (0–1, vertical).
- CSS `rotateY()` and `rotateX()` consume these to tilt the container, giving the illusion of a 3D slab rotating toward the cursor.
- Easing is applied in JS (lerp toward target) so rotation follows the mouse with a lag feel.

**Weight relay:**
- A `weightHistory` array (length = number of layers) stores recent weight values.
- On each frame, the target weight is pushed and the array shifts.
- Each layer reads its position in the array: front layer = most recent weight, back layers = older weights.
- This creates a "weight echo" — heavier weight trails through the depth layers like a ghosting effect.

---

## Scroll Interactions

**Primary behavior: font weight changes on scroll.**
Scroll progress maps to weight range 300–900. Used on both the Specimen and Research pages.

```javascript
const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
const weight = 300 + scrollFraction * 600;
document.documentElement.style.setProperty('--scroll-weight', weight);
```

Scroll listener must be passive: `addEventListener('scroll', fn, { passive: true })`.

Apply `--scroll-weight` intentionally — not as a global effect. Use it where the weight shift adds meaning.

---

## Character Grid — Specimen Page

**Proximity behavior:**
Each character cell measures its distance to the cursor on `mousemove`. Within a 200px radius, the cell's `font-variation-settings: 'wght'` scales up (up to 4× the base weight) and the cell itself scales up via CSS transform. Distance is computed in JS; the result is written as a per-cell CSS custom property.

**Inspector panel:**
Hovering a cell populates the sticky left-side inspector panel:
- Large glyph display (620px rendered size)
- Metric lines: ascender, x-height, baseline, descender
- Unicode data: glyph name, hex codepoint, decimal codepoint, Unicode character name, current weight

Weight in the inspector cycles 300→900 continuously (CSS animation on `font-variation-settings`).

**Four grids:**
1. 22 base Hebrew letters (aleph–tav)
2. Final forms (מנצפך)
3. Digits — standard Western Arabic + alternative forms
4. Punctuation marks

---

## Size Range Section — Specimen Page

8 display sizes rendered simultaneously (500pt down to 32pt). Font weight animates 300→900 on a continuous loop for all sizes. A play/pause button appears when the section enters the viewport (IntersectionObserver). Button is positioned bottom-left; CSS class toggles the animation play state.

---

## Try-Me Page Interactions

**State object:** A single JS object holds all canvas state: `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight`, `textColor`, `bgColor`, `align`, `outline` (toggle + color + size), `shadow` (toggle + color + XYZR). All controls read from and write to this object; the canvas reflects it.

**Weight control:**
Dropdown lists named steps (300 Light → 900 Black) plus a "custom" option that reveals a range slider. Selection-aware: if the contenteditable canvas has a text selection, the weight is applied to that selection only. If the selection contains mixed weights, the dropdown shows "mixed". Global weight change (no selection) applies to the whole canvas.

**Slider pairs:**
Each range input is paired with a number input. They stay in sync bidirectionally — changing one updates the other.

**Alignment:**
Three buttons (RTL, Center, LTR) set both `text-align` and the `dir` attribute on the canvas element.

**Colors:**
Six swatches: 5 fixed palette colors + 1 randomized on page load. Clicking a swatch sets both text and background colors per its preset. Free color pickers allow arbitrary text color and background color independently.

**Effects:**
- Outline: checkbox toggles `webkit-text-stroke`; color picker + size slider control stroke appearance.
- Shadow: checkbox toggles CSS `text-shadow`; X/Y/blur sliders + color picker.

**Custom CSS:**
Collapsed panel section. Textarea content is injected (with debounce) into a `<style id="tryme-custom-css">` tag in the document head. Power-user escape hatch — no sandboxing, intentional.

**Panel toggle:**
Collapse/expand button. Panel height animates; collapsed state is preserved across interactions.

---

## General Interaction Rules

- All interactive state is managed via CSS custom properties where possible. JS sets the value, CSS consumes it. This keeps JS lean.
- No interaction should block or delay page load.
- All motion should respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Open Items

- [ ] Features panel in try-me — liga, ss01, ss02, hist are wired but disabled; decide which to activate and when
- [ ] Character grid weight cycling in inspector — confirm target animation speed
