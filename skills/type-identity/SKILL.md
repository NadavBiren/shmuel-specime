# SKILL.md — type-identity
## Font History, Script Anatomy & Typographic Logic

---

## Purpose

This skill is the typographic authority for the Shmuel project.
Load it for any task involving: font history, script characterization,
typographic decisions, glyph behavior, axis logic, or Research Page content.
All other skills defer to this one on matters of typographic accuracy.

---

## Font Identity

**Name:** Shmuel
**Classification:** Hebrew serif variable font
**Script basis:** כתב בינוני (Medium script) — a distinct medieval Hebrew script style characterized by moderate stroke contrast, seriffed terminals, and a dense, calligraphic rhythm. Not to be confused with square script (כתב מרובע) or cursive (כתב רהוט). A category in its own right.
**Primary source:** Scan C154 — an Ashkenazi manuscript, likely of German origin, medieval period. Details to be expanded. Treat as the canonical typographic anchor for all letterform decisions.
**Style family:** Ashkenazi. Influenced by the broader beinoni tradition across European Hebrew manuscripts.

---

## Research Methodology

Shmuel was not derived from a single source. The design process involved:

1. Identifying 20 historical beinoni manuscript sources
2. Digitizing 6–12 letterforms (¼ to ½ of the Hebrew alphabet) from each source into a working partial font — enough to evaluate rhythmic consistency and structural viability
3. Selecting specific letterforms from across these sources based on quality, completeness, and stylistic coherence
4. Anchoring the final design to Scan C154 as the primary structural reference

This methodology is central to the Research Page narrative. When generating Research Page content, frame this as a comparative digitization process — not a revival of a single manuscript.

---

## Variable Axis Specification

**Axis:** Weight (wght)
**Range:** 300 (Light) — 900 (Black)
**Current status:** Variable font is live and functional. `shmuel-Regular.ttf` covers wght 300–900 and is actively used across all interactions on the site (hero weight relay, scroll weight, character grid proximity, try-me tool, weights ramp).

**Future axis (out of scope for now):** Italic / slant. Do not design interactions or CSS around this axis until explicitly reintroduced.

**Font file location:** `site/assets/fonts/`
**Format:** TTF (primary). Add WOFF2 conversion when preparing for production.

**CSS implementation:**
```css
@font-face {
  font-family: 'Shmuel';
  src: url('../assets/fonts/shmuel-Regular.ttf') format('truetype');
  font-weight: 300 900;
  font-display: block;
}

/* Usage */
font-family: 'Shmuel', serif;
font-variation-settings: 'wght' 600;
```

---

## Glyph Coverage

- Hebrew base alphabet (אלף-בית)
- Final forms (מנצפך)
- Niqqud (vowel marks)
- Cantillation marks (טעמי המקרא) — confirm scope with designer
- Ligatures
- Alternative character sets
- Numbers (Western Arabic numerals confirmed; Hebrew numerals TBD)

When writing specimen strings or test content, use characters confirmed present in the current font file. Do not assume full niqqud or ligature coverage until verified.

---

## Typographic Character

These are design constraints, not stylistic preferences. Respect them in all layout, sizing, and spacing decisions:

- **Stroke contrast:** Moderate. Not flat (like Rashi script), not high-contrast (like square script). Mid-range between calligraphic and formal.
- **Rhythm:** Dense. Letters sit close. Specimen layouts should reflect this — avoid generous tracking.
- **Terminals:** Seriffed, calligraphic in origin. The serif structure is historically derived, not geometrically constructed.
- **Display intent:** Optimized for display sizes and short paragraphs. Not intended for continuous long-form reading. Do not use at body text sizes below ~18px without testing.
- **Optical behavior:** At heavy weights (700–900), stroke density increases significantly. Test ink trap behavior and counter shapes at these weights specifically.

---

## Specimen Page Directives

When building or populating the Specimen Page:

- Lead with weight range as the primary interactive axis
- Use short, high-impact Hebrew text — single words, short phrases, poetic fragments. Not full sentences.
- Tight kerning is a feature, not a problem. Layouts should make this visible, not compensate for it.
- Avoid Lorem Ipsum Hebrew equivalents. Specimen strings should carry meaning or historical resonance when possible.
- Test and display the full weight range 300–900 explicitly.

---

## Research Page Directives

When building or populating the Research Page:

- The 20-source methodology is the editorial spine. Structure content around it.
- Scan C154 is introduced first and in more depth than the other 19.
- Tone is scholarly but accessible. Not academic paper, not marketing.
- Do not invent historical details. If a fact about a source manuscript is unknown, mark it as `[TBD — designer to confirm]` in the content.
- RTL layout applies fully to this page. Hebrew labels, Hebrew captions.
- Current research page copy is placeholder — designer to review and replace.

---

## Open Items (to resolve with designer)

- [ ] Cantillation marks: full set or subset?
- [ ] Hebrew numerals: included or Western Arabic only?
- [ ] Exact name / shelf reference for Scan C154
- [ ] Specimen strings: designer to provide or approve meaningful text
- [ ] Confirm count: exactly 20 sources, or working number? (site currently uses 18 in sources.json)
