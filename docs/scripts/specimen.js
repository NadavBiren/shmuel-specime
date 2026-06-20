/* =====================================================
   SHMUEL — Specimen Page Interactions
   specimen.js
   ===================================================== */

'use strict';

// ── Data ─────────────────────────────────────────────

let glyphData = null;
const glyphMap = {};

// ── DOM Population ────────────────────────────────────

function buildCell(glyph, categoryFeatureTag, categoryDirection) {
  const ft  = glyph.featureTag  || categoryFeatureTag  || null;
  const dir = glyph.direction   || categoryDirection   || null;
  const span = document.createElement('span');
  span.className = 'char-cell';
  if (ft) span.classList.add(`char-cell--${ft}`);
  span.textContent = glyph.display;
  span.dataset.glyphName = glyph.glyphName;
  span.setAttribute('aria-hidden', 'true');
  if (ft)  span.style.setProperty('font-feature-settings', `"${ft}" 1`);
  if (dir) span.setAttribute('dir', dir);
  return span;
}

function buildCharGrid() {
  if (!glyphData) return;
  const gridPanel = document.querySelector('.charview-grid-panel');
  if (!gridPanel) return;

  glyphData.categories.forEach(cat => {
    if (cat.type === 'subgroups') {
      const container = cat.containerId ? document.getElementById(cat.containerId) : null;
      if (!container) return;
      cat.subgroups.forEach(sg => {
        const group = document.createElement('div');
        group.className = 'char-alt-group';
        const groupLabel = document.createElement('span');
        groupLabel.className = 'char-alt-group-label';
        groupLabel.textContent = sg.label;
        group.appendChild(groupLabel);
        const gridDiv = document.createElement('div');
        gridDiv.className = 'char-grid';
        sg.glyphs.forEach(g => gridDiv.appendChild(buildCell(g, sg.featureTag, sg.direction)));
        group.appendChild(gridDiv);
        container.appendChild(group);
      });
    } else {
      let container = cat.containerId ? document.getElementById(cat.containerId) : null;
      if (!container) {
        const section = document.createElement('div');
        section.className = 'char-category';
        const labelEl = document.createElement('span');
        labelEl.className = 'char-category-label';
        labelEl.textContent = cat.label;
        section.appendChild(labelEl);
        const gridDiv = document.createElement('div');
        gridDiv.className = 'char-grid';
        gridDiv.id = `char-grid-${cat.id}`;
        section.appendChild(gridDiv);
        gridPanel.appendChild(section);
        container = gridDiv;
      }
      (cat.glyphs || []).forEach(g => container.appendChild(buildCell(g, cat.featureTag, cat.direction)));
    }
  });
}

// ── Character Inspector ───────────────────────────────

function initCharInspector() {
  const glyphEl  = document.getElementById('charview-glyph');
  const nameEl   = document.getElementById('chardata-name');
  const hexEl    = document.getElementById('chardata-hex');
  const decEl    = document.getElementById('chardata-dec');
  const uNameEl  = document.getElementById('chardata-unicode-name');
  const weightEl = document.getElementById('chardata-weight');
  if (!glyphEl) return;

  // Weight cycle — CSS transition handles the smooth glyph animation.
  // A parallel rAF counter makes the number display count smoothly too.
  const CYCLE = [500, 600, 700, 800, 900, 800, 700, 600];
  const STEP_MS = 1100;
  const TRANS_MS = 950;
  let cycleIdx = 0;
  let numFrom = 500, numTo = 500, numStart = null;

  function stepNumber(ts) {
    if (numStart === null) numStart = ts;
    const t = Math.min(1, (ts - numStart) / TRANS_MS);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    if (weightEl) weightEl.textContent = Math.round(numFrom + (numTo - numFrom) * eased);
    if (t < 1) requestAnimationFrame(stepNumber);
  }

  setInterval(() => {
    cycleIdx = (cycleIdx + 1) % CYCLE.length;
    const w = CYCLE[cycleIdx];
    glyphEl.style.fontVariationSettings = `'wght' ${w}`;
    numFrom = numTo;
    numTo   = w;
    numStart = null;
    requestAnimationFrame(stepNumber);
  }, STEP_MS);

  function selectGlyph(glyphName) {
    const data = glyphMap[glyphName];
    if (!data) return;

    glyphEl.textContent = data.display;
    glyphEl.style.fontFeatureSettings = data.featureTag ? `"${data.featureTag}" 1` : '';
    if (data.direction) glyphEl.setAttribute('dir', data.direction);
    else glyphEl.removeAttribute('dir');

    if (nameEl)  nameEl.textContent  = data.label;
    if (hexEl)   hexEl.textContent   = data.unicode  ?? '—';
    if (decEl)   decEl.textContent   = data.decimal  != null ? data.decimal : '—';
    if (uNameEl) uNameEl.textContent = data.glyphName;

    document.querySelectorAll('.char-cell').forEach(cell => {
      cell.classList.toggle('char-cell--selected', cell.dataset.glyphName === glyphName);
    });
  }

  const panel = document.querySelector('.charview-grid-panel');
  if (panel) {
    let lastCell = null;
    panel.addEventListener('mouseover', e => {
      const cell = e.target.closest('.char-cell');
      if (cell && cell !== lastCell) {
        lastCell = cell;
        selectGlyph(cell.dataset.glyphName);
      }
    });
  }

  selectGlyph('alef-hb');
}

// ── Hero Weight Hover ────────────────────────────────
/**
 * Flat 2D interaction — 3D layers and relay chains removed.
 * Cursor moving horizontally maps directly to the wght axis.
 * RTL: right side = 300 (light), left side = 900 (black).
 *
 * A small hint label shows the current axis value so the
 * interaction reads as intentional typography control,
 * not a decoration.
 */
function initHeroWeightHover() {
  const heroWrapper = document.querySelector('.hero-3d-wrapper');
  const textEl      = document.querySelector('.layered-text');
  if (!textEl || !heroWrapper) return;

  const hint = document.createElement('span');
  hint.className = 'hero-weight-hint';
  hint.setAttribute('aria-hidden', 'true');
  textEl.appendChild(hint);

  let targetWeight  = 900;
  let currentWeight = 900;
  let rafId         = null;

  // RTL: right edge of viewport = 300 (light), left = 900 (black)
  function xToWeight(normX) {
    return 900 - normX * 600;
  }

  function animate() {
    const diff = targetWeight - currentWeight;
    if (Math.abs(diff) < 0.8) {
      currentWeight = targetWeight;
      rafId = null;
    } else {
      currentWeight += diff * 0.10;   // lerp — lower = slower/smoother
      rafId = requestAnimationFrame(animate);
    }
    const w = Math.round(currentWeight);
    textEl.style.fontVariationSettings = `'wght' ${w}`;
    hint.textContent = `wght ${w}`;
  }

  heroWrapper.addEventListener('mousemove', e => {
    const rect   = heroWrapper.getBoundingClientRect();
    const normX  = (e.clientX - rect.left) / rect.width;
    targetWeight = xToWeight(normX);
    if (!rafId) rafId = requestAnimationFrame(animate);
  }, { passive: true });

  heroWrapper.addEventListener('mouseleave', () => {
    targetWeight = 900;
    if (!rafId) rafId = requestAnimationFrame(animate);
  });
}

// ── Character Grid Proximity ──────────────────────────

/**
 * Each letter reacts to cursor proximity:
 *   - scale up when near (CSS transform)
 *   - color shifts from cream → gold
 *   - font-variation-settings 'wght' rises (structural, ready for full VF)
 *
 * Uses requestAnimationFrame — only active when grid is in the viewport.
 */
function initCharProximity() {
  const gridSection = document.querySelector('.section-character-grid');
  if (!gridSection) return;

  // Read --color-green from CSS so this stays in sync with the design token
  const greenHex = getComputedStyle(document.documentElement).getPropertyValue('--color-green').trim();
  const greenR = parseInt(greenHex.slice(1, 3), 16);
  const greenG = parseInt(greenHex.slice(3, 5), 16);
  const greenB = parseInt(greenHex.slice(5, 7), 16);

  let mouseX = -9999, mouseY = -9999;
  let rafId = null, isVisible = false;
  const RADIUS = 200;

  // Cached once per cell from CSS before any inline override
  const baseSizes = new Map();

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function tick() {
    if (!isVisible) { rafId = null; return; }

    const cells = gridSection.querySelectorAll('.char-cell');

    // Phase 1: all reads — no writes, eliminates layout-thrash oscillation
    const updates = [];
    cells.forEach(cell => {
      if (!baseSizes.has(cell)) {
        baseSizes.set(cell, parseFloat(getComputedStyle(cell).fontSize));
      }
      const rect = cell.getBoundingClientRect();
      const cx   = rect.left + rect.width  * 0.5;
      const cy   = rect.top  + rect.height * 0.5;
      const dist = Math.hypot(mouseX - cx, mouseY - cy);
      const raw  = Math.max(0, 1 - dist / RADIUS);
      const t    = raw * raw;
      updates.push({ cell, t, base: baseSizes.get(cell) });
    });

    // Phase 2: all writes
    // Only font size and color change — no transform, so the grid stays intact.
    updates.forEach(({ cell, t, base }) => {
      const fontMult = 1 + t * 2.12;

      cell.style.transform = '';
      cell.style.zIndex    = '';
      cell.style.fontSize  = (base * fontMult).toFixed(1) + 'px';

      const wght = Math.round(500 + t * 150);
      cell.style.fontVariationSettings = `'wght' ${wght}`;

      const alpha = (0.25 + t * 0.25).toFixed(2);
      cell.style.color = `rgba(${greenR}, ${greenG}, ${greenB}, ${alpha})`;
      cell.style.backgroundColor = '';
    });

    rafId = requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !rafId) tick();
  }, { threshold: 0.05 });

  obs.observe(gridSection);
}

// ── Try Me ───────────────────────────────────────────

/**
 * Size slider → font-size on textarea
 * Weight slider → font-variation-settings on textarea
 * Textarea auto-grows as user types
 */
function initTryMe() {
  const textarea    = document.querySelector('.try-me-text');
  const sizeRange   = document.getElementById('size-range');
  const wghtRange   = document.getElementById('wght-range');
  const sizeOut     = document.getElementById('size-out');
  const wghtOut     = document.getElementById('wght-out');
  const lhRange     = document.getElementById('lh-range');
  const lsRange     = document.getElementById('ls-range');
  const lhOut       = document.getElementById('lh-out');
  const lsOut       = document.getElementById('ls-out');

  if (!textarea || !sizeRange) return;

  const frame = document.querySelector('.try-me-frame');

  function autoHeight() {
    textarea.style.height = '0';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  function fitTextToSection() {
    if (!frame) return;
    let fs = parseFloat(textarea.style.fontSize) || 80;
    while (frame.scrollHeight > frame.clientHeight && fs > 8) {
      fs -= 2;
      textarea.style.fontSize = fs + 'px';
      autoHeight();
      if (sizeOut) sizeOut.value = fs;
    }
  }

  function apply() {
    const size = sizeRange.value;
    const wght = wghtRange?.value ?? 400;
    const lh   = lhRange?.value ?? 1.00;
    const ls   = lsRange?.value ?? 0;

    textarea.style.fontSize            = size + 'px';
    textarea.style.fontVariationSettings = `'wght' ${wght}`;
    textarea.style.lineHeight          = lh;
    textarea.style.letterSpacing       = ls + 'em';

    if (sizeOut) sizeOut.value = size;
    if (wghtOut) wghtOut.value = wght;
    if (lhOut)   lhOut.value   = parseFloat(lh).toFixed(2);
    if (lsOut)   lsOut.value   = parseFloat(ls).toFixed(3);

    autoHeight();
    fitTextToSection();
  }

  sizeRange.addEventListener('input', apply);
  wghtRange?.addEventListener('input', apply);
  lhRange?.addEventListener('input', apply);
  lsRange?.addEventListener('input', apply);
  textarea.addEventListener('input', () => { autoHeight(); fitTextToSection(); });

  apply();
  document.fonts.ready.then(apply);
}

// ── Scroll Weight ─────────────────────────────────────

/**
 * Maps full-page scroll progress → --scroll-weight (500–900).
 * Currently drives the exit section word weight.
 * Will become meaningful once the full variable font is live.
 */
function initScrollWeight() {
  function update() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const fraction = Math.min(1, window.scrollY / maxScroll);
    const weight   = 500 + fraction * 400;
    document.documentElement.style.setProperty('--scroll-weight', weight);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Header Weight Scroll ──────────────────────────────

/**
 * Animates .about-title wght from 500 (enters viewport) to 900
 * (exits top), starting slightly before it leaves.
 */
function initHeaderWeightScroll() {
  const headers = document.querySelectorAll('.about-title');
  if (!headers.length) return;

  function update() {
    const vh = window.innerHeight;
    headers.forEach(el => {
      const rect = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (vh - rect.bottom) / (vh * 0.85)));
      el.style.fontVariationSettings = `'wght' ${Math.round(500 + t * 400)}`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Nav Scroll-Reveal ─────────────────────────────────

function initNavScroll() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  function update() {
    nav.classList.toggle('is-visible', window.scrollY >= window.innerHeight);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}


// ── Slanted Caret (5°) ───────────────────────────────

function initSlantedCaret() {
  const proxy = document.createElement('div');
  proxy.className = 'caret-proxy';
  document.body.appendChild(proxy);

  function positionFromSelection() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) { proxy.classList.remove('is-active'); return; }
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rects = range.getClientRects();
    if (!rects.length) { proxy.classList.remove('is-active'); return; }
    const r = rects[0];
    if (r.top < 0 || r.top > window.innerHeight) { proxy.classList.remove('is-active'); return; }
    const lh = parseFloat(getComputedStyle(document.activeElement).lineHeight) || r.height || 40;
    proxy.style.left   = r.left + 'px';
    proxy.style.top    = r.top  + 'px';
    proxy.style.height = lh     + 'px';
    proxy.classList.add('is-active');
  }

  function positionFromTextarea(ta) {
    const mirror = document.createElement('div');
    const cs = getComputedStyle(ta);
    ['font', 'fontSize', 'fontFamily', 'fontWeight', 'fontVariationSettings',
     'letterSpacing', 'lineHeight', 'padding', 'border', 'width', 'whiteSpace',
     'wordWrap', 'overflowWrap', 'direction', 'textAlign'].forEach(p => {
      mirror.style[p] = cs[p];
    });
    mirror.style.position   = 'fixed';
    mirror.style.visibility = 'hidden';
    mirror.style.top        = '0';
    mirror.style.left       = '-9999px';
    mirror.style.height     = 'auto';
    mirror.style.overflow   = 'hidden';
    const before = document.createElement('span');
    before.textContent = ta.value.slice(0, ta.selectionStart) || '​';
    const cursor = document.createElement('span');
    cursor.textContent = '​';
    mirror.appendChild(before);
    mirror.appendChild(cursor);
    document.body.appendChild(mirror);
    const taRect  = ta.getBoundingClientRect();
    const curRect = cursor.getBoundingClientRect();
    document.body.removeChild(mirror);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    proxy.style.left   = curRect.left + 'px';
    proxy.style.top    = curRect.top  + 'px';
    proxy.style.height = lh           + 'px';
    proxy.classList.add('is-active');
  }

  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.style.caretColor = 'transparent';
    ['focus', 'keyup', 'mouseup', 'input'].forEach(ev =>
      el.addEventListener(ev, positionFromSelection));
    el.addEventListener('blur', () => proxy.classList.remove('is-active'));
  });

  document.addEventListener('mousedown', e => {
    if (!e.target.closest('[contenteditable]')) {
      proxy.classList.remove('is-active');
    }
  });

  window.addEventListener('scroll', positionFromSelection, { passive: true });

  const ta = document.querySelector('.try-me-text');
  if (ta) {
    ta.style.caretColor = 'transparent';
    ['focus', 'keyup', 'mouseup', 'input'].forEach(ev =>
      ta.addEventListener(ev, () => positionFromTextarea(ta)));
    ta.addEventListener('blur', () => proxy.classList.remove('is-active'));
  }
}


// ── Hero Scroll Arrow ─────────────────────────────────

function initHeroScrollArrow() {
  const hint = document.querySelector('.hero-scroll-hint');
  if (!hint) return;
  hint.addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  });
}

// ── Specimen Variable Font Titles ─────────────────────

/**
 * Mouse X drives two opposing wght axes:
 *   Hebrew:  left→right = 300→900
 *   English: left→right = 900→300
 */
function initSpecimenTitles() {
  const titleHe = document.getElementById('title-he');
  const titleEn = document.getElementById('title-en');
  const labelHe = document.getElementById('weight-he');
  const labelEn = document.getElementById('weight-en');
  if (!titleHe || !titleEn) return;

  const trBoxes = document.querySelectorAll('.hc-tr .hc-box');
  const blBoxes = document.querySelectorAll('.hc-bl .hc-box');
  if (trBoxes[1]) trBoxes[1].style.fontVariationSettings = "'wght' 700";
  if (blBoxes[1]) blBoxes[1].style.fontVariationSettings = "'wght' 700";

  window.addEventListener('mousemove', e => {
    const percent   = e.clientX / window.innerWidth;
    const weightHe  = Math.round(500 + percent * 400);
    const weightEn  = Math.round(900 - percent * 400);
    titleHe.style.fontVariationSettings = `'wght' ${weightHe}`;
    titleEn.style.fontVariationSettings = `'wght' ${weightEn}`;
    if (labelHe) labelHe.textContent = weightHe;
    if (labelEn) labelEn.textContent = weightEn;

    const progressY = Math.max(0, Math.min(1, e.clientY / window.innerHeight));
    const wTop = Math.round(500 + (400 * (1 - progressY)));
    const wBot = Math.round(500 + (400 * progressY));
    [trBoxes[0], blBoxes[0]].forEach(el => {
      if (el) el.style.fontVariationSettings = `'wght' ${wTop}`;
    });
    [trBoxes[2], blBoxes[2]].forEach(el => {
      if (el) el.style.fontVariationSettings = `'wght' ${wBot}`;
    });
  }, { passive: true });
}

// ── Specimen Print Logic ──────────────────────────────

function initSpecimenPrint() {
  const printBtn   = document.getElementById('print-btn');
  const container  = document.getElementById('prints-container');
  const section    = document.getElementById('font-specimen');
  const inputEl    = document.getElementById('print-text');
  const charCount  = document.getElementById('print-char-count');
  if (!printBtn || !container || !section || !inputEl) return;

  const MAX_CHARS   = 40;
  const MAX_ITEMS   = 25;
  const NEON_COLORS = ['var(--color-pink)', 'var(--color-yellow)', 'var(--color-orange)', 'var(--color-green)', 'var(--color-white)'];
  const SVG_SHAPES  = ['hero-icon-1', 'hero-icon-2', 'hero-icon-3', 'hero-icon-4', 'hero-icon-5'];
  const TEXT_POOL   = [
    "Espresso Blend מספר 4", "Barrel Aged מהדורה מיוחדת", "House Blend מקומי",
    "Natural Wine תל אביב", "Cold Brew", "בירה Unfiltered מהחבית", "קפה של הבוקר"
  ];
  const WEIGHT_STEPS = [500, 600, 700, 800, 900];

  let printCount = 0;

  // Break sticker text into lines so it grows vertically instead of
  // overflowing horizontally — line-break frequency depends on the
  // sticker's shape (horizontal / square / vertical mask).
  function formatStickerText(text, shape) {
    const words = text.split(' ');
    if (words.length === 2) return words.join('\n');

    let wordsPerBreak;
    if (shape === 'hero-icon-3')      wordsPerBreak = 3; // Horizontal
    else if (shape === 'hero-icon-2') wordsPerBreak = 2; // Square
    else                              wordsPerBreak = Math.random() < 0.5 ? 1 : 2; // Vertical


    const lines = [];
    let current = [];

    words.forEach((word) => {
      current.push(word);
      if (word.includes(',') || current.length >= wordsPerBreak) {
        lines.push(current.join(' '));
        current = [];
      }
    });
    if (current.length) lines.push(current.join(' '));

    return lines.join('\n');
  }

  // Character limit + countdown — counts against the actual value
  function updateCharCount() {
    const activeLen = inputEl.value.length;
    const remaining = MAX_CHARS - activeLen;
    if (charCount) charCount.textContent = `${Math.max(0, remaining)} תווים נותרו`;
  }

  inputEl.addEventListener('input', () => {
    if (inputEl.value.length > MAX_CHARS) {
      inputEl.value = inputEl.value.slice(0, MAX_CHARS);
    }
    updateCharCount();
  });

  printBtn.addEventListener('click', () => {
    const text = inputEl.value.trim() || TEXT_POOL[Math.floor(Math.random() * TEXT_POOL.length)];

    // Always-random neon color and SVG shape mask
    const bgColor  = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    const svgShape = SVG_SHAPES[Math.floor(Math.random() * SVG_SHAPES.length)];
    const maskUrl  = `url('assets/images/svg/hero-svg/${svgShape}.svg')`;

    const len = text.length;

    // Adaptive font size + box width — both scale with text length so longer
    // phrases print larger and wrap across more lines instead of shrinking
    let size, widthEm;
    if (len <= 8)       { size = Math.floor(Math.random() * 30) + 85; widthEm = 3.8; } // 85-114
    else if (len <= 14) { size = Math.floor(Math.random() * 25) + 60; widthEm = 4.8; } // 60-84
    else if (len <= 22) { size = Math.floor(Math.random() * 18) + 43; widthEm = 5.5; } // 43-60
    else                { size = Math.floor(Math.random() * 15) + 32; widthEm = 6.5; } // 32-46

      // Random weight: one of 500,600,700,800,900
    const randomWeight = WEIGHT_STEPS[Math.floor(Math.random() * WEIGHT_STEPS.length)];

    // Random rotation -20 to +20 degrees
    const angle = (Math.random() * 40 - 20).toFixed(1);

    const item = document.createElement('div');
    item.className = 'printed-item';
    if (svgShape === 'hero-icon-3') {
      item.classList.add('shape-icon-3');
    }
    item.textContent = formatStickerText(text, svgShape);
    item.style.backgroundColor = bgColor;
    item.style.maskImage       = maskUrl;
    item.style.webkitMaskImage = maskUrl;
    item.style.fontSize              = `clamp(${Math.round(size * 0.6)}px, ${size / 10}vw, ${size}px)`;
    item.style.width                 = widthEm + 'em';
    item.style.fontVariationSettings = `'wght' ${randomWeight}`;

    const itemWidthPx  = widthEm * size;
    const itemHeightPx = size * 2;

    // Allow stickers to bleed slightly off the edges (negative padding)
    const bleed = 40;

    // Calculate bounds allowing the stickers to exit the screen slightly on all sides
    const minX = -bleed;
    const maxX = window.innerWidth - itemWidthPx + bleed;

    const minY = -bleed;
    const maxY = window.innerHeight - itemHeightPx - 80;

    // Generate random coordinates within the new organic bounds
    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);

    const wrapper = document.createElement('div');
    wrapper.className = 'printed-item-wrapper';
    wrapper.style.left = randomX + 'px';
    wrapper.style.top  = randomY + 'px';
    wrapper.style.transform = `rotate(${angle}deg)`;

    wrapper.appendChild(item);

    // FIFO: remove oldest if over limit
    if (container.childElementCount >= MAX_ITEMS) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(wrapper);
    printCount++;

    // Reset input after each print
    inputEl.value = '';
    updateCharCount();
  });

  updateCharCount();

  const continueLink = document.querySelector('.sp-continue-link');
  if (continueLink) {
    continueLink.addEventListener('click', (e) => {
      e.preventDefault();
      const nextSection = document.querySelector('.section-floating-weights');
      if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ── Floating Weights Section ─────────────────────────

function initFloatingWeights() {
  function createWaveEffect(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? ' ' : char;
      span.style.animationDelay = `${index * 0.15}s`;
      el.appendChild(span);
    });
  }
  createWaveEffect('fw-title-he');
  createWaveEffect('fw-title-en');
}

// ── Glyph Data ────────────────────────────────────────

async function initGlyphData() {
  try {
    const res = await fetch('data/glyph-data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    glyphData = await res.json();

    function indexGlyphs(glyphs, inheritedFeatureTag) {
      glyphs.forEach(g => {
        glyphMap[g.glyphName] = Object.assign({}, g, {
          featureTag: g.featureTag || inheritedFeatureTag || null
        });
      });
    }
    glyphData.categories.forEach(cat => {
      if (cat.type === 'subgroups') {
        cat.subgroups.forEach(sg => indexGlyphs(sg.glyphs, sg.featureTag));
      } else {
        indexGlyphs(cat.glyphs || [], cat.featureTag);
      }
    });

    buildCharGrid();
    initCharInspector();
  } catch (e) {
    console.error('Failed to load glyph data:', e);
  }
}

// ── Init ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initGlyphData();
  initSpecimenTitles();
  initSpecimenPrint();
  initCharProximity();
  initTryMe();
  initScrollWeight();
  initHeaderWeightScroll();
  initNavScroll();
  initSlantedCaret();
  initFloatingWeights();
  initFingersAnimation();
  initCacaoCeremonyAnimation();
});

// ── Fingers animation component ──────────────────────

function initFingersAnimation(root = document) {
  const section = root.querySelector("#fingersSection");
  if (!section) return;

  const fingerTop = section.querySelector("#fingerTop");
  const fingerBottom = section.querySelector("#fingerBottom");
  const capWrap = section.querySelector("#capWrap");

  if (!fingerTop || !fingerBottom || !capWrap) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function updateAnimation() {
    const rect = section.getBoundingClientRect();
    const scrollableDistance = section.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / scrollableDistance, 0, 1);

    // האצבע העליונה: מתחילה מימין ומגיעה למיקום הסופי שלה
    const topX = lerp(22, 1, progress);

    // האצבע התחתונה: מתחילה במקום שלה וממשיכה ימינה
    const bottomX = lerp(4, 14, progress);

    // הפקק (+ הטקסט החי עליו): מסתובב סיבוב מלא אחד. מספר שלילי = עם כיוון השעון במבנה הנוכחי שלך.
    const capRotation = lerp(0, -360, progress);

    // כל הטקסטים החיים (עליון, תחתון, ופקק) עוברים יחד מ-500 ל-900
    const liveTextWeight = Math.round(lerp(500, 900, progress));

    fingerTop.style.transform = `translateX(${topX}%)`;
    fingerBottom.style.transform = `translateX(${bottomX}%)`;
    capWrap.style.transform = `translate(-50%, -50%) rotate(${capRotation}deg)`;

    section.style.setProperty("--live-text-weight", liveTextWeight);
  }

  window.addEventListener("scroll", updateAnimation, { passive: true });
  window.addEventListener("resize", updateAnimation);

  updateAnimation();
}

// ── Cacao Ceremony animation component ───────────────

function initCacaoCeremonyAnimation(root = document) {
  const section = root.querySelector
    ? root.querySelector("#cacaoCeremonySection")
    : document.querySelector("#cacaoCeremonySection");

  if (!section) return;

  const titleContainer = section.querySelector(".cacao-ceremony-title");
  if (!titleContainer) return;

  const titleSpans = section.querySelectorAll(".cacao-ceremony-title span");
  const locationSpans = section.querySelectorAll(".cacao-ceremony-location span");

  const leftHead = section.querySelector("#cacaoCeremonyLeft");
  const rightHead = section.querySelector("#cacaoCeremonyRight");

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function updateAnimation() {
    const viewportHeight = window.innerHeight;

    /*
      titleProgress:
      0 = כשהטקסט מגיע למרכז המסך
      1 = כשהטקסט עבר מרכז המסך לחלוטין (הגיע לראש המסך)
    */
    const titleRect = titleContainer.getBoundingClientRect();
    const titleAnimationStart = viewportHeight * 0.5;
    const titleAnimationDistance = titleAnimationStart * 1.5;
    const titleProgress = clamp(
      (titleAnimationStart - titleRect.top) / titleAnimationDistance,
      0,
      1
    );

    const locationProgress = clamp((titleProgress - 0.4) / 0.6, 0, 1);

    const titleWeight = Math.round(lerp(500, 900, titleProgress));
    const locationWeight = Math.round(lerp(700, 500, locationProgress));

    titleSpans.forEach((span) => {
      span.style.fontVariationSettings = `'wght' ${titleWeight}`;
    });

    locationSpans.forEach((span) => {
      span.style.fontVariationSettings = `'wght' ${locationWeight}`;
    });

    /*
      headsProgress:
      0 = ראש הסקשן עדיין בתחתית המסך (לא נכנס)
      1 = ראש הסקשן הגיע לראש המסך (נחשף במלואו)
    */
    const sectionRect = section.getBoundingClientRect();
    const headsProgress = clamp(
      (viewportHeight - sectionRect.top) / (viewportHeight * 1.5),
      0,
      1
    );

    const leftX = lerp(-38, 0, headsProgress);
    const rightX = lerp(38, 0, headsProgress);

    if (leftHead) {
      leftHead.style.transform = `translate3d(${leftX}%, 0, 0)`;
    }

    if (rightHead) {
      rightHead.style.transform = `translate3d(${rightX}%, 0, 0)`;
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateAnimation);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  updateAnimation();
}
