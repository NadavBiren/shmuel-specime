# project-log.md — Shmuel / Pagmar Website

## Format
Each entry: date | task | current state | next step.
Entries older than 3 milestones with no active relevance → compressed to one summary line.

---

## Log

### 2026-05-05
**Task:** Project scaffolding — created full directory structure and seed files.
**Current state:** Structure in place. CLAUDE.md is the master orchestrator. Memory, skills, and site folders created. Site is empty (no HTML/CSS/JS yet).
**Next step:** Populate skill files with domain knowledge, then begin site development.

### 2026-05-06
**Task:** Built all four SKILL.md files and finalized CLAUDE.md through collaborative session in Claude.
**Current state:** All skills complete and verified. CLAUDE.md finalized. Memory files in place. HTML scaffolding not yet built.
**Next step:** Scaffold index.html and research.html per ux-architecture skill.

### 2026-05-06
**Task:** Scaffolded index.html and research.html with complete section structure, RTL layout, and navigation.
**Current state:** Both HTML files in place with all sections from ux-architecture skill. Nav links between pages. Empty sections ready for content. CSS and JS links in correct load order.
**Next step:** Build base.css with tokens and resets, then begin section content development.

### 2026-05-06
**Task:** Built Specimen Page — site/index.html, site/styles/base.css, site/styles/specimen.css, site/scripts/specimen.js.
**Current state:** base.css has correct design-system tokens (6 colors, 8 weight names, font-size-min, 4 interactive defaults), correct @font-face pointing to shmuel-variable.ttf. index.html has all 9 sections populated: hero (שמואל static display), try-me (range slider + textarea wired to JS), weights (7-step ramp with data-weight attributes), exit link. specimen.css has nav fixed top-right, all section layouts, 7 font-variation-settings selectors for weight ramp. specimen.js has passive scroll listener (--scroll-weight) and try-me slider/textarea logic. All sections render with serif fallback until VF file is dropped into assets/fonts/.
**Next step:** Build research.html with content and research.css.

### 2026-05-12
**Task:** Color system refactor — renamed confusing variables, merged one near-duplicate, replaced direct hex values with variable references across all CSS files.
**Current state:** 10 root color tokens (down from 11). `--color-black`/`--color-white` inverted naming resolved: now `--color-cream`/`--color-ink`/`--color-ink-warm`/`--color-ink-deep`. `--color-black-exit` merged into `--color-ink-deep`. Added `--color-panel-bg`. All direct hex duplicates in weight rows, research section-pair tokens, and try-me swatches now use variables. rgba cream values standardized to match `--color-cream` base. UI grey hierarchy in try-me.css intentionally left as direct hex (distinct interactive states on neutral panel).
**Next step:** Visual browser verification of all sections per the verification checklist.

### 2026-05-11
**Task:** Replaced fixed pill nav with vertical sidebar across all pages.
**Current state:** .sidebar-nav CSS lives in base.css (shared). Old .site-nav rules removed from specimen.css and research.css. index.html and research.html updated with sidebar HTML (nav-active on current page item). try-me.html created as empty page with sidebar only. body gets padding-right: 3vw from base.css to clear the sidebar. All three sidebar items link to index.html, research.html, try-me.html respectively.
**Next step:** Build out try-me.html content.

### 2026-05-13
**Task:** Built try-me.html into a full-featured font testing tool.
**Current state:** Full-screen contenteditable canvas with default Hebrew passage. Floating control panel (320px, bottom-left, collapsible). 9 panel sections: Alignment (RTL/Center/LTR buttons), Weight (dropdown 300–900 + custom + preview letter), Typography (3 sliders: size 12–360px, letter-spacing, line-height), Colors (6 palette swatches + free color pickers for text/bg), Outline (webkit-text-stroke toggle + color + size), Shadow (toggle + X/Y/blur/color), Features (disabled placeholders for liga/ss01/ss02/hist), Custom CSS (debounced raw injection), Reset button. All driven by a central state object. Weight control is selection-aware — shows "mixed" on multi-weight selection.
**Next step:** Visual verification pass; define which features to wire in the Features panel.

### 2026-05-13
**Task:** Built research.html into a complete 5-section editorial page.
**Current state:** 5 sections: הכתב הבינוני (gold-dark bg), מחקר מקורות (gold-light bg, source viewer), סקיצות (ink-warm bg), בדיקות ותיקונים (green-sage bg), מאפיינים (green-olive bg). Nested sticky tab system — 5 staggered tabs (30px each, 20% wide, positioned RTL). Source viewer loads 18 sources from sources.json; hover crossfades between scan and digitized images; metadata panel shows source name, year, writer, place, letters. Exit link leads to try-me.html. Site is now stable across all three pages.
**Next step:** Content refinement — research page copy is placeholder; try-me Features panel wiring TBD.

### 2026-05-13
**Task:** Content update — replaced all body copy with final corrected Hebrew text.
**Current state:** index.html about-body updated with final 3-paragraph About Shmuel text. research.html all five rs-section__bd blocks replaced with final copy: section 01 includes blockquote with Beit-Arié citation. All placeholder text removed. HTML structure intact.
**Next step:** Visual verification pass across all three pages.

### 2026-05-18
**Task:** Color system refactor — replaced entire previous accent system (#FF6B35, #C8922A, #F0C84A, #7B9068, #3A4920) with three named accent colors.
**Current state:** Three-color palette refactor complete across all four CSS files and specimen.js. base.css: --color-main/second/third tokens + five derived opacities; compatibility aliases retained. specimen.css: section-label→amber, hero hint→cyan, sliders→cyan, char grid→teal hover/cyan selected, weight rows 400→teal/700→amber, exit→cyan/teal. research.css: sections 3–4 now deep teal/amber rooms; tabs match; page/rail bg→#0F0E0C; crossfade line→cyan; src-btn active dot→cyan. try-me.css: full dark-mode panel conversion; panel border→cyan glow; all interactive controls→cyan/teal. specimen.js proximity interpolation→teal. grep pass (step 5) confirmed zero remaining old-accent hex values in styles/. Residual light-mode values in try-me.css sub-elements (.tp-feat-name, .tp-feat-code, .tp-css-hint, .tp-weight-slider-out) not covered by step 4 spec — still rendering incorrectly on dark panel.
**Next step:** Visual verification pass across all three pages; optionally fix residual try-me.css light-mode sub-elements.

### 2026-05-25 (v2)
**Task:** Refined Font Specimen Section — UI, print logic, and shape system overhaul.
**Current state:** English title updated to "Shmuel" (capital S only). Size range removed from panel; size is now random 40–450px per print. Shape options: none / circle / square (ריבוע) / rectangle (מלבן לרוחב) / hexagon (משושה). Shape CSS uses aspect-ratio + clip-path (hexagon). Text color always #000000; background color from color picker. Random rotation -20 to +20 deg per stamp. First 2 prints restricted to left 52% of viewport (clear of panel); 3rd+ span full width. Panel and all its children (h3, labels, inputs, select, button) now use var(--font-secondary) throughout. z-index: removed explicit z-index from sp-titles-wrapper (sticky stage z-index:1 < prints-canvas z-index:50 < panel fixed z-index:200).
**Next step:** Visual verification; tune hexagon clip-path if text clips at small sizes.

### 2026-05-25
**Task:** Built new Font Specimen Section on index.html with interactive print mechanic.
**Current state:** New 300vh `.specimen-outer` section inserted after hero (section ②). Contains: sticky 100vh stage with Hebrew title "שמואל" (wght 300→900 L→R on mouse) and English title "shmuel" (wght 900→300 L→R), two weight labels (top and bottom). `.sp-try-panel` slides in from right after 100px scroll into section (position: fixed, visible class via JS). Print button creates absolute-positioned `.printed-item` divs in `.prints-canvas` at current scroll position + random offset; first 3 prints get z-index:3 (below sticky stage). Hero scroll-hint arrow now clickable (scrolls 100vh). All new CSS namespaced with `sp-` prefix to avoid conflicts. Weight labels use `sp-weight-label` to avoid conflict with existing `.weight-label` in weight rows.
**Next step:** Visual verification across all sections; confirm font loads correctly on variable title; optionally fine-tune print positioning and panel width on real viewport.

### 2026-05-18
**Task:** Color system audit and full palette consolidation — 30 CSS variables → 7-color core palette.
**Current state:** base.css :root now defines exactly 7 core colors (--color-main/second/third/black/dark/grey/white) + 5 derived accent opacities + 2 border vars = 14 total. All 30 legacy/semantic variables removed. All four CSS files fully migrated: zero references to old vars confirmed by grep. Old orange accent orphans (rgba(255,107,53,...)) replaced with amber throughout. Dark-mode rendering bugs in try-me.css fixed (tp-feat-name/code/soon/css-hint/weight-slider-out now use white-toned values). specimen.css weight rows: teal (400) and amber (700) rows gained left-edge accent bar (border-inline-start); weight row 900 label/num/hint now cyan-tinted for accent rhythm on the darkest row. Research editorial room bgs (#1A1816, #2D2C29, #0D2A22, #2A1F05) remain hardcoded as intentional atmospheric colors.
**Next step:** Visual browser verification across all three pages.

### 2026-06-06
**Task:** 8-item UI/UX pass across all pages.
**Current state:** (1) index.html body now has `class="page-index"` so scrollbar uses --color-main (pink). (2) research.css theme-toggle redesigned: flat square button, linear-gradient(90deg) vertical split, solid 2px shadow, rotate(45deg) dark / rotate(-45deg) light / rotate(0deg) hover — no pseudo-element crossfade. (3) base.css sidebar nth-child(3) switched from --color-second to --color-fourth (green) for hover and active states. (4+5) try-me page overhauled: canvas defaults to green text (#39FF14) on black bg; panel moved to top: 3vw / left: 3vw; all border-radius → 0 throughout try-me.css and sources-selector in research.css; weight slider always visible (no hidden custom mode), "מותאם אישית" option removed, slider and select stay in sync; outline section hidden (display:none); canvas starts empty with placeholder "הקלידו לבדיקה"; "לפונט" button added at bottom of panel linking to index.html; all --color-main references in try-me.css replaced with --color-fourth. (6) No legacy blue values found in specimen.css — nothing to change. (7) Exit hover colors: specimen.css → --color-third (orange), research.css → --color-fourth (green), try-me.css → --color-main (pink). (8) Sidebar labels updated across all 3 HTML files: "פונט"→"הפונט", "מחקר"→"המחקר", "נסו אותי"→"הטסטר".
**Next step:** Visual verification across all three pages.

### 2026-06-06
**Task:** Try-me page UI/UX/layout refinements — panel cleanup, weight control overhaul, typography color logic.
**Current state:** (1) Minimize button and מחק button removed from panel; panel is permanently open. (2) Panel header updated: title → "נסו אותי..." at explicit font-size: 15px; subtitle "כלי בדיקה" added with color: var(--color-white). (3) Panel border changed to rgba(245,242,237,0.15) matching exit button border. (4) Canvas gets padding-left: calc(25vw + 4vw) to clear sidebar. (5) .tp-label and .tp-unit now use var(--color-grey) — only interactive elements keep var(--color-fourth). (6) Weight section merged into typography section: preset buttons (רגיל/בולד/בלאק at wght 500/700/900) sit above weight range slider; old select dropdown and preview letter removed. (7) JS wired: preset buttons update slider + apply font-variation-settings; slider syncs active preset; selection monitor syncs slider to selection weight.
**Next step:** Visual verification of try-me.html.

### 2026-06-06
**Task:** Try-me targeted UX/UI fixes — header, weight input, reset animation, palette layout.
**Current state:** Header now reads "כלי בדיקה" in white (removed "נסו אותי..." title and tp-subtitle span). Weight row: `<output>` replaced with editable `<input type="number" id="wght-out" class="ctrl-out ctrl-out-input">` with blur/Enter validation (clamps 500–900); reload icon added (`data-target="tp-wght"`). SLIDER_DEFAULTS now includes 'tp-wght' → value 900, onReset calls setActivePreset. Reload spin: replaced classList.add('is-spinning')/setTimeout with cumulative `data-rot` attribute approach (persistent rotation, no class toggle). `.tryme-sidebar` max-width → 300px !important. `.tp-palette-row` → justify-content: space-between; gap: 0. `.ctrl-out-input` CSS rule added (transparent bg, green text, 4ch width, focus underline). `.is-spinning` CSS rule removed.
**Next step:** Visual verification of try-me.html.

### 2026-06-06
**Task:** Section 01 (הכתב הבינוני) full content and layout refactor.
**Current state:** research.html section 01 rebuilt with new structure. Two h3 sub-headings using `rs-section__subhead` class: "אנטומיה של כתב בינוני" and "הטיפוסים של כתב בינוני — השפעות גאוגרפיות". Inline `rs-figure` for תמונה 1 (margin: 50px 100px). Four `rs-ms-type` blocks for ספרדי/אשכנזי/מזרחי/תימני — each a 70/30 flex split (img-col right, info-col left, 20px gap, margin: 25px 100px). Info-col contains: h4.rs-ms-type__name (50px, wght 900), location subtitle, then a CSS grid key-value table (display:contents on rows, auto/1fr columns RTL, vertical divider via border-inline-start). rs-ms-caption styled as SimplerMono, mirrors research-quote cite, text-align right, margin-top 15px. Light-theme overrides added. Image src paths are placeholders — no images exist in assets/images/ for this section yet. Paragraph body text is structural placeholder; actual text from the attached md file should be substituted manually (encoding was unreadable in session).
**Next step:** Add actual section 01 images to assets/images/; substitute correct paragraph and caption text from טקסטים לסקשן הראשון.md.

### 2026-06-06
**Task:** Section 01 structural layout and CSS fixes — header banner, text centering, wide media blocks.
**Current state:** (1) `.rs-section__hd` — removed `width: calc(100% + 3vw)` and `margin-right: -3vw` that were causing the black gap on the left; now `width: 100%`. (2) HTML — all `rs-section__text-flow` divs renamed to `rs-section__bd text-centered-flow`; all `rs-section__wide-block` divs renamed to `rs-section__wide-media-block` (both only existed in section 0). (3) CSS — added `.text-centered-flow` (flex column, align-items:center) and `.text-centered-flow p` (max-width:40em, centered); added `.rs-section__wide-media-block` (padding-block:25px, padding-inline:100px) and reset rules for child `.rs-figure` and `.rs-ms-type`.
**Next step:** Visual verification of section 01 layout in browser.

### 2026-06-07
**Task:** CSS polish pass — !important audit, duplicate selector merge, redundant rule removal, comment cleanup across all four CSS files.
**Current state:** base.css: merged two body{} blocks; removed redundant body.page-research sidebar nav-active override; removed !important from .sidebar-nav width/padding. specimen.css: removed !important from .char-cell hover/selected; replaced redundant physical+logical padding shorthand on .section-sizes with clean padding-block/inline; removed obvious visual-description comments. research.css: removed redundant html/body reset block; removed !important from .sidebar-nav positioning, .rs-section__hd, .text-centered-flow, .rs-section__wide-media-block, .src-meta-val, .research-quote, .research-quote cite, .theme-toggle-btn, theme-toggle pseudo-elements, all light-theme overrides, #rs-section-0 inner padding, caption max-width. try-me.css: removed !important from sidebar overrides, canvas padding, tryme-sidebar, ctrl-group border, ctrl-out-input, exit link hover states, exit word/sub font-size; merged duplicate .tp-slider-row selectors (4-col → 5-col with reload icon column). Only remaining !important: prefers-reduced-motion media queries (3 in base.css, 1 in research.css) — correct standard practice.
**Next step:** Visual verification across all three pages.

### 2026-06-07
**Task:** Cacao Ceremony animation component — edits and integration into index.html.
**Current state:** Component updated: (1) Location block DOM order swapped — `__he` (חוף פלמחים) first → visually LEFT, `__en` (Palmachim Beach) second → visually RIGHT; `direction: ltr` added to `.cacao-ceremony-location` grid container to neutralize RTL page context. (2) All live text font-sizes multiplied ×1.25 in both desktop and mobile media query rules. (3) קקאו span given class `cacao-ceremony-title__cacao`; CSS rule sets `font-weight` and `font-variation-settings` via `--cacao-title-weight` CSS variable (default 500). (4) JS `updateAnimation()` now also calculates `cacaoTitleWeight = Math.round(lerp(500, 900, progress))` and sets `--cacao-title-weight` on the section element. (5) Layout already used `aspect-ratio: 1920/2260` with no sticky — no change needed. Integration: `cacao-ceremony-animation.css` added to index.html `<head>`; `#cacaoCeremonyAnimationMount` div inserted after `.specimen-outer` section; `cacao-ceremony-animation.js` script tag added before `</body>`; fetch/init inline script added after it.
**Next step:** Visual verification of animation in browser.

### 2026-06-07
**Task:** Cacao Ceremony animation — stage height and weight animation fixes.
**Current state:** `.cacao-ceremony-stage` switched from `aspect-ratio: 1920/2260` to `padding-top: 107%; overflow: hidden` — no more distortion of child elements. `.cacao-ceremony-title__cacao` transition changed to `0.05s linear`. JS `updateAnimation()` now sets `--cacao-title-weight` on both the section element AND directly on the `.cacao-ceremony-title__cacao` element to guarantee the CSS variable reaches the target regardless of cascade issues.
**Next step:** Visual verification of height and weight animation in browser.

### 2026-06-07
**Task:** research.html + research.css layout refactor — unified layout system, sticky rail fix, font-size audit.
**Current state:** Two new layout classes replace all ad-hoc wrappers: `.layout-text` (max-width:40em, centered, flex column, padding-top:6vh; text/blockquote children get text-align:right + margin-inline:0 auto) and `.layout-media` (full-bleed, padding-block:25px padding-inline:100px). Applied across all five sections — two `.layout-text` + five `.layout-media` in section 0; one `.layout-text` each in sections 1–4. Old classes `.rs-section__bd`, `.text-centered-flow`, `.rs-section__wide-media-block` removed from HTML (CSS rules remain as dead code). `.top-grey-rail` now has `background-color: var(--color-black)` with `body.light-theme` override to `--color-white`. Z-index hierarchy confirmed: rail z-index:100, tab-bar z-index:300, sections z-index:1. Font-size audit complete — nine properties raised to 16px: sidebar-nav__item, rs-section__eyebrow, src-btn, sources-viewer::after hint, rs-figure__caption, rs-ms-caption, rs-ms-type__location, rs-ms-grid-key, rs-ms-grid-val.
**Next step:** Visual verification of research.html in browser.

### 2026-06-09
**Task:** Light mode black bar fix — left-edge layout gap and body background.
**Current state:** Two fixes applied: (1) base.css — added `body.light-theme, html:has(body.light-theme) { background-color: var(--color-lightgrey); }` so the root layer switches to light in light mode (previously only .rs-section was overridden, leaving body/html black and exposing them through any layout gap). (2) research.css — `.rs-section__inner` changed from `width: var(--rs-rail-w)` (100vw, wider than content area) + `margin-inline-start: 15px; margin-inline-end: 0` to `width: 100%` with no inline margins; `.sources-viewer` `margin-inline-end: -15px` compensation removed (changed to 0) since the inner no longer carries the offsetting margin.
**Next step:** Visual verification of light mode on research.html.

### 2026-06-09
**Task:** Scrollbar and layout overflow fixes — black bar on left, tab misalignment.
**Current state:** (1) base.css — `::-webkit-scrollbar-track` changed from `var(--color-black)` to `transparent`; `::-webkit-scrollbar-thumb` border changed from `3px solid var(--color-black)` to `3px solid transparent` and `background-clip: padding-box` added — scrollbar no longer renders as a visible coloured bar against page sections. (2) research.css — `--rs-rail-w: calc(100vw)` removed from `:root` (unused since last session). `.rs-section__inner` got `padding-inline: 15px` and `box-sizing: border-box` — eliminates 100vw overflow that caused RTL tabs to shift left and collide with sidebar nav.
**Next step:** Visual verification of research.html scrollbar and tab alignment.

### 2026-06-13
**Task:** weights-icons.html (standalone component) — center-column padding tweak and letter-wave title animation.
**Current state:** (1) `.col-hebrew .center-text-item:not(.weights-title)` gets `padding-left: 0.3em`; `.col-english .center-text-item:not(.weights-title)` gets `padding-right: 0.3em` — pulls the weight labels slightly toward the center gap. (2) `.weights-title` now `display: flex` with no animation of its own; `.col-hebrew .weights-title` and `.col-english .weights-title` set `justify-content: flex-start` (English also `direction: ltr`). (3) `@keyframes weight-animation` renamed to `letter-wave-animation`; now applied per-letter via `.weights-title span` (1.6s ease-in-out infinite alternate, `min-width: 0.1em`, `display: inline-block`). (4) Both title divs given ids (`title-he`, `title-en`); inline script splits each into per-character spans on DOMContentLoaded with staggered `animation-delay` (0.15s × index) for a wave effect across "משקלים" / "Weights".
**Next step:** Visual verification of the wave animation in browser; not yet integrated into index.html.

### 2026-06-13
**Task:** Integrated weights-icons.html standalone component into the main site as `.section-floating-weights`.
**Current state:** New `<section class="section-floating-weights">` inserted in index.html immediately after `.specimen-outer#font-specimen` and before `#cacaoCeremonyAnimationMount` — contains `.center-stage` (he/en weight label columns) and all 6 `.weight-icon-wrapper` divs. CSS appended to specimen.css: container is `position: relative; height: 100vh; overflow: hidden; background-color: var(--color-black)` with local `--center-gap`/`--icon-size` vars; all layout classes (`.center-stage`, `.text-column`, `.weights-title`, `.weight-icon-wrapper`, `.svg-icon-mask`, `.icon-X`, `.weights-icon-X` positions, per-icon `.weight-icon-text` overrides) namespaced under `.section-floating-weights`; all `body:has(...)` hover triggers rewritten to `.section-floating-weights:has(...)` so hover scoping doesn't leak to the rest of the page. JS: `initFloatingWeights()` added to specimen.js (runs `createWaveEffect` on the title elements), called from the main `DOMContentLoaded` listener. IMPORTANT FIX: the standalone component used `id="title-he"`/`id="title-en"` for its animated title, which collided with the existing hero specimen title IDs (`index.html` sp-var-title elements, used by `initSpecimenTitles` in specimen.js) — renamed the new section's title IDs to `fw-title-he`/`fw-title-en` in both the HTML and `initFloatingWeights`. Verified via headless Chromium screenshot: section renders within 100vh bounds (no scroll breakage), wave animation creates per-letter spans, and bidirectional hover scaling (label↔icon) works correctly. No new console errors (pre-existing 404s are from unrelated cacao-ceremony/fingers-animation assets).
**Next step:** Visual verification in a real browser; consider whether `.section-floating-weights` needs a section label/nav entry consistent with other sections.

### 2026-06-14
**Task:** Moved Character Grid section and recolored it to the secondary green accent.
**Current state:** `.section-character-grid` relocated in index.html — now sits immediately after `#cacaoCeremonyAnimationMount` and before `.section-try-me` (previously after `#fingersAnimationMount`, before `.section-display`). specimen.css: `.charview-glyph` color → `var(--color-fourth)`; `.char-cell:hover, .char-cell--selected` color → `rgba(57, 255, 20, 0.5)`; `.char-cell--selected` outline color-mix → `var(--color-fourth)`; new rule `.section-character-grid .section-label { color: var(--color-fourth); }`. specimen.js: proximity hover effect on char cells (previously neon pink `rgba(255, 20, 147, ...)`) now uses `rgba(57, 255, 20, ...)` to match.
**Next step:** Visual verification of the relocated, recolored Character Grid section in browser.

### 2026-06-14 (v2)
**Task:** Added Cap Height and x height metric lines to the character-grid inspector panel.
**Current state:** `.charview-stage` metric-line stack reordered top to bottom: Ascender (800, top:3%) → Cap Height (700, top:12%, new — CSS rule for `[data-metric="cap-height"]` already existed unused) → Heb Height (550, top:29.5%, renamed from "x-Height"; `data-metric` changed `x-height`→`heb-height`) → x height (400, top:45%, new `[data-metric="x-height"]` rule) → Baseline (0, top:76%) → Descender (−200, top:95%). Also fixed hyphenated label in specimen.js: HEBREW_GLYPH_DATA[';'].name "פסיק-עליון" → "פסיק עליון". Changes mirrored from `site/` to `docs/` for index.html, styles/specimen.css, scripts/specimen.js (docs/ is a 1:1 GitHub Pages mirror).
**Next step:** Visual verification of the new metric lines/labels in browser; confirm Cap Height (700) and x height (400) values read well against the live glyph.
