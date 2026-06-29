/* =====================================================
   SHMUEL — Try Me Page Interactions
   try-me.js
   ===================================================== */

'use strict';


/* ── DEFAULT TEXT ───────────────────────────────────────
   Canonical paragraph used on load and when reset is clicked.
─────────────────────────────────────────────────────── */
const DEFAULT_TEXT = '←←← חבית‭ ‬בירה? Punk IPA 13% מארז‭ ‬סודה 12 ליטר + 6 כוסות & ארגז של יין‭ ‬כתום 12.3% Midbar הפוך על מים {₪28} • מים (₪9)    § וויסקי Glenfiddich 21 בחנויות אספרסו כפול מפולי Arabica →→ חֲלִיטַת תֵּה Wissotzky החל מ־2€ ¾ מצ׳ייסר של Noah №12 ב־18:25';


/* ── PALETTES ───────────────────────────────────────────
   Each palette: label shown as tooltip, textColor, bgColor.
   null values → generate a random harmonious pair.
─────────────────────────────────────────────────────── */
const PALETTES = [
  { label: 'ראשי',  textColor: null, bgColor: '#0F0E0C', useGreen: true },      // default: --color-green on black
  { label: 'לבן',   textColor: '#0F0E0C', bgColor: '#d6d6d6'  },               // black on offwhite
  { label: 'מונו',  textColor: '#F2C4C8', bgColor: '#3D0C11'  },               // monochromatic: rose on deep burgundy
  { label: 'ניגוד', textColor: '#F5E642', bgColor: '#8B1A1A'  },               // high contrast: light yellow on dark red
  { label: 'חם',    textColor: '#F2815A', bgColor: '#0D2A22'  },               // warm/cool: coral on deep teal
  { label: 'אקראי', textColor: null,      bgColor: null, dynamic: true },       // live random 1
  { label: 'אקראי', textColor: null,      bgColor: null, dynamic: true },       // live random 2
];


/* ── STATE ──────────────────────────────────────────────
   Single source of truth for the canvas global state.
   Per-selection overrides are stored as inline spans,
   not reflected here.
─────────────────────────────────────────────────────── */
const state = {
  fontSize:      130,
  fontWeight:    900,
  letterSpacing: 0,
  lineHeight:    0.8,
  textColor:     '#87c540',
  bgColor:       '#0F0E0C',
  align:         'rtl',   // 'rtl' | 'center' | 'ltr'

  outlineEnabled: false,
  outlineColor:   '#808080',
  outlineSize:    2,

  shadowEnabled: false,
  shadowColor:   '#808080',
  shadowX:       4,
  shadowY:       4,
  shadowBlur:    0,
};


/* ── DOM REFS ───────────────────────────────────────────
─────────────────────────────────────────────────────── */
const canvas         = document.getElementById('tryme-canvas');
const customStyleEl  = document.getElementById('tryme-custom-css');
const panel          = document.getElementById('tryme-panel');
const panelBody      = document.getElementById('tp-body');

const weightSlider      = document.getElementById('wght-range');
const weightSliderOut   = document.getElementById('wght-out');

const sizeRange      = document.getElementById('size-range');
const sizeNum        = document.getElementById('size-out');
const lsRange        = document.getElementById('ls-range');
const lsNum          = document.getElementById('ls-out');
const lhRange        = document.getElementById('lh-range');
const lhNum          = document.getElementById('lh-out');

const textColorPicker = document.getElementById('tp-text-color');
const bgColorPicker   = document.getElementById('tp-bg-color');
const textHexInput    = document.getElementById('tp-text-hex');
const bgHexInput      = document.getElementById('tp-bg-hex');
const paletteRow      = document.getElementById('tp-palette-row');

const alignBtns       = [...document.querySelectorAll('.tp-align-btn')];
const cssInput        = document.getElementById('tp-css-input');


/* ── LIGHT MODE DETECTION ───────────────────────────────
   Computes relative luminance (W3C formula) of a #rrggbb
   hex color and toggles .is-light-mode on the body.
─────────────────────────────────────────────────────── */
function hexToLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function applyLightMode(bgHex) {
  if (!bgHex || bgHex.length < 7) return;
  document.body.classList.toggle('is-light-mode', hexToLuminance(bgHex) > 0.4);
}


/* ── APPLY GLOBAL STYLES ────────────────────────────────
   Writes all state values as inline styles on the canvas
   and the page body (for background).
─────────────────────────────────────────────────────── */
function applyGlobalStyles() {
  canvas.style.fontSize              = state.fontSize + 'px';
  canvas.style.fontWeight            = state.fontWeight;
  canvas.style.fontVariationSettings = `'wght' ${state.fontWeight}`;
  canvas.style.letterSpacing         = state.letterSpacing + 'em';
  canvas.style.lineHeight            = state.lineHeight;
  canvas.style.color                 = state.textColor;
  document.documentElement.style.setProperty('--ui-accent', state.textColor || '#87c540');
  document.body.style.backgroundColor = state.bgColor;
  applyLightMode(state.bgColor);

  // Direction + alignment together
  if (state.align === 'rtl') {
    canvas.dir = 'rtl';
    canvas.style.textAlign = 'right';
  } else if (state.align === 'ltr') {
    canvas.dir = 'ltr';
    canvas.style.textAlign = 'left';
  } else { // center
    canvas.style.textAlign = 'center';
    // keep dir as-is (rtl for hebrew by default)
  }

  // Outline (webkit-text-stroke)
  if (state.outlineEnabled) {
    canvas.style.webkitTextStroke = `${state.outlineSize}px ${state.outlineColor}`;
  } else {
    canvas.style.webkitTextStroke = '';
  }

  // Drop shadow
  if (state.shadowEnabled) {
    canvas.style.textShadow = `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowColor}`;
  } else {
    canvas.style.textShadow = '';
  }
}


/* ── SELECTION UTILITIES ────────────────────────────────
   Helpers for reading and modifying the active selection.
─────────────────────────────────────────────────────── */

/**
 * Check if the current selection is inside our canvas.
 */
function selectionIsInCanvas() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return false;
  const range = sel.getRangeAt(0);
  return canvas.contains(range.commonAncestorContainer);
}

/**
 * Read the computed fontWeight at two ends of the selection.
 * Returns: a weight string ('400'), 'mixed', or null (no selection).
 *
 * Simple two-point check: covers the most common designer workflow
 * (two differently-weighted words selected together).
 */
function getSelectionFontWeight() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;

  const anchorEl   = nearestElement(sel.anchorNode);
  const focusEl    = nearestElement(sel.focusNode);

  if (!anchorEl || !focusEl) return null;
  if (!canvas.contains(anchorEl) || !canvas.contains(focusEl)) return null;

  const anchorW = getComputedStyle(anchorEl).fontWeight;
  const focusW  = getComputedStyle(focusEl).fontWeight;

  // Treat weights within the same "100-step bucket" as identical
  // (browsers may return 399.9 for 400, etc.)
  if (Math.round(parseFloat(anchorW) / 100) ===
      Math.round(parseFloat(focusW)  / 100)) {
    return String(Math.round(parseFloat(anchorW) / 100) * 100);
  }

  return 'mixed';
}

/**
 * If node is a text node, return its parent element.
 */
function nearestElement(node) {
  if (!node) return null;
  return node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
}

/**
 * Wrap the current selection in a <span> carrying the given
 * inline styles. Falls back to global apply if nothing is selected.
 *
 * styleObj keys: fontWeight, color  (only these are per-selection)
 */
function applyToSelection(styleObj) {
  const sel = window.getSelection();

  // Nothing selected → apply globally
  if (!sel || sel.isCollapsed || !selectionIsInCanvas()) {
    if (styleObj.fontWeight !== undefined) {
      state.fontWeight = parseInt(styleObj.fontWeight, 10);
      applyGlobalStyles();
    }
    return;
  }

  const range = sel.getRangeAt(0);
  const span  = document.createElement('span');

  if (styleObj.fontWeight !== undefined) {
    span.style.fontWeight           = styleObj.fontWeight;
    span.style.fontVariationSettings = `'wght' ${styleObj.fontWeight}`;
  }
  if (styleObj.color !== undefined) {
    span.style.color = styleObj.color;
  }

  // extractContents handles selections that cross element boundaries
  try {
    range.surroundContents(span);
  } catch {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  }

  // Restore visual selection on the new span
  sel.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  sel.addRange(newRange);
}


/* ── SELECTION MONITOR ──────────────────────────────────
   Watches selectionchange. When selection lands inside the
   canvas and spans two differently-styled nodes, the weight
   select blinks (mixed-value Adobe behaviour).
─────────────────────────────────────────────────────── */
function initSelectionMonitor() {
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();

    if (!selectionIsInCanvas() || !sel || sel.isCollapsed) {
      weightSlider.value = state.fontWeight;
      weightSliderOut.value = state.fontWeight;
      return;
    }

    const wght = getSelectionFontWeight();
    if (wght && wght !== 'mixed') {
      weightSlider.value = wght;
      weightSliderOut.value = wght;
    }
  });
}


/* ── WEIGHT CONTROL ─────────────────────────────────────
─────────────────────────────────────────────────────── */
function setActivePreset(weight) {
  document.querySelectorAll('.weight-preset-btn').forEach(btn => {
    btn.classList.toggle('is-active', parseInt(btn.dataset.weight, 10) === weight);
  });
}

function initWeightControl() {
  // Weight preset buttons
  document.querySelectorAll('.weight-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = parseInt(btn.dataset.weight, 10);
      weightSlider.value = value;
      weightSliderOut.value = value;
      applyToSelection({ fontWeight: value });
      setActivePreset(value);
    });
  });

  // Weight slider
  weightSlider.addEventListener('input', () => {
    const val = parseInt(weightSlider.value, 10);
    weightSliderOut.value = val;
    applyToSelection({ fontWeight: val });
    setActivePreset(val);
  });

  // Manual number input on wght-out
  if (weightSliderOut) {
    function validateWeight() {
      let val = parseInt(weightSliderOut.value, 10);
      if (isNaN(val)) { weightSliderOut.value = weightSlider.value; return; }
      if (val < 500) val = 500;
      if (val > 900) val = 900;
      weightSliderOut.value = val;
      weightSlider.value = val;
      applyToSelection({ fontWeight: val });
      setActivePreset(val);
    }
    weightSliderOut.addEventListener('blur', validateWeight);
    weightSliderOut.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); weightSliderOut.blur(); }
    });
  }

  // Initial sync
  weightSlider.value = state.fontWeight;
  weightSliderOut.value = state.fontWeight;
  setActivePreset(state.fontWeight);
}


/* ── SLIDER + NUMBER INPUT PAIR ─────────────────────────
   Keeps range ↔ number in sync and calls an apply callback.
─────────────────────────────────────────────────────── */
function bindSliderPair(rangeEl, numEl, applyFn) {
  function applyVal(raw) {
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    // Clamp to [min, max]
    const clamped = Math.min(
      parseFloat(rangeEl.max),
      Math.max(parseFloat(rangeEl.min), val)
    );
    rangeEl.value = clamped;
    numEl.value   = clamped;
    applyFn(clamped);
  }

  rangeEl.addEventListener('input',  () => applyVal(rangeEl.value));
  numEl.addEventListener('input',    () => applyVal(numEl.value));
  numEl.addEventListener('change',   () => applyVal(numEl.value));
}

function initSliders() {
  bindSliderPair(sizeRange, sizeNum, val => {
    state.fontSize = val;
    canvas.style.fontSize = val + 'px';
  });

  bindSliderPair(lsRange, lsNum, val => {
    state.letterSpacing = val;
    canvas.style.letterSpacing = val + 'em';
  });

  bindSliderPair(lhRange, lhNum, val => {
    state.lineHeight = val;
    canvas.style.lineHeight = val;
  });
}


/* ── ALIGNMENT ──────────────────────────────────────────
─────────────────────────────────────────────────────── */
function initAlignment() {
  alignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.align = btn.dataset.dir;
      alignBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyGlobalStyles();
    });
  });
}


/* ── COLORS ─────────────────────────────────────────────
─────────────────────────────────────────────────────── */

/** Convert HSL values (0–360, 0–100, 0–100) to '#rrggbb' */
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomPalette() {
  const bgHue   = Math.floor(Math.random() * 360);
  const textHue = (bgHue + 140 + Math.floor(Math.random() * 80)) % 360;
  return {
    bgColor:   hslToHex(bgHue,   60 + Math.random() * 40,  8 + Math.random() * 20),
    textColor: hslToHex(textHue, 65 + Math.random() * 35, 55 + Math.random() * 30),
  };
}

function applyColor(textColor, bgColor) {
  state.textColor = textColor;
  state.bgColor   = bgColor;
  canvas.style.color                   = textColor;
  document.documentElement.style.setProperty('--ui-accent', textColor || '#87c540');
  document.body.style.backgroundColor = bgColor;
  applyLightMode(bgColor);
  textColorPicker.value = textColor;
  bgColorPicker.value   = bgColor;
  if (textHexInput) textHexInput.value = textColor;
  if (bgHexInput)   bgHexInput.value   = bgColor;
}

let activePaletteIdx = 0; // track active swatch

function initColors() {
  // Build palette swatches
  PALETTES.forEach((pal, i) => {
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.className   = 'tp-palette-swatch';
    btn.title       = pal.label;
    btn.dataset.idx = i;

    const span = document.createElement('span');
    span.className   = 'tp-swatch-letter';
    span.textContent = 'א';
    btn.appendChild(span);

    if (pal.dynamic) {
      // Live random: pre-generate colors, display them, regenerate on each click
      let current = randomPalette();
      const refreshSwatch = () => {
        btn.style.setProperty('--swatch-bg',   current.bgColor);
        btn.style.setProperty('--swatch-text', current.textColor);
      };
      refreshSwatch();

      btn.addEventListener('click', () => {
        applyColor(current.textColor, current.bgColor);
        document.querySelectorAll('.tp-palette-swatch').forEach(s =>
          s.classList.remove('is-active'));
        current = randomPalette();
        refreshSwatch();
      });
    } else {
      btn.style.setProperty('--swatch-bg',   pal.bgColor);
      btn.style.setProperty('--swatch-text', pal.textColor);

      btn.addEventListener('click', () => {
        applyColor(pal.textColor, pal.bgColor);
        document.querySelectorAll('.tp-palette-swatch').forEach(s =>
          s.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    }

    paletteRow.appendChild(btn);
  });

  // Mark first swatch active and sync picker inputs to initial state
  paletteRow.firstElementChild?.classList.add('is-active');
  if (textColorPicker) textColorPicker.value = state.textColor;
  if (textHexInput)    textHexInput.value    = state.textColor;

  // Free pickers
  textColorPicker.addEventListener('input', () => {
    state.textColor = textColorPicker.value;
    canvas.style.color = state.textColor;
    document.documentElement.style.setProperty('--ui-accent', state.textColor || '#87c540');
    if (textHexInput) textHexInput.value = textColorPicker.value;
    document.querySelectorAll('.tp-palette-swatch').forEach(s =>
      s.classList.remove('is-active'));
  });

  bgColorPicker.addEventListener('input', () => {
    state.bgColor = bgColorPicker.value;
    document.body.style.backgroundColor = state.bgColor;
    applyLightMode(state.bgColor);
    if (bgHexInput) bgHexInput.value = bgColorPicker.value;
    document.querySelectorAll('.tp-palette-swatch').forEach(s =>
      s.classList.remove('is-active'));
  });

  // Hex text inputs
  function isValidHex(v) { return /^#[0-9a-fA-F]{6}$/.test(v); }

  textHexInput?.addEventListener('input', () => {
    const v = textHexInput.value.trim();
    if (!isValidHex(v)) return;
    textColorPicker.value = v;
    state.textColor = v;
    canvas.style.color = v;
    document.documentElement.style.setProperty('--ui-accent', v);
    document.querySelectorAll('.tp-palette-swatch').forEach(s => s.classList.remove('is-active'));
  });

  bgHexInput?.addEventListener('input', () => {
    const v = bgHexInput.value.trim();
    if (!isValidHex(v)) return;
    bgColorPicker.value = v;
    state.bgColor = v;
    document.body.style.backgroundColor = v;
    applyLightMode(v);
    document.querySelectorAll('.tp-palette-swatch').forEach(s => s.classList.remove('is-active'));
  });
}


/* ── COLLAPSIBLE SECTIONS ───────────────────────────────
─────────────────────────────────────────────────────── */
function initCollapsibles() {
  document.querySelectorAll('.tp-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const body     = document.getElementById(targetId);
      if (!body) return;

      const willOpen = !body.classList.contains('is-open');
      body.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
}


/* ── CUSTOM CSS ─────────────────────────────────────────
   Debounced injection: wraps user input in a scoped rule
   and applies it to #tryme-canvas.
─────────────────────────────────────────────────────── */
function initCustomCSS() {
  let debounceTimer;

  cssInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const css = cssInput.value.trim();
      customStyleEl.textContent = css
        ? `#tryme-canvas { ${css} }`
        : '';
    }, 320);
  });
}



/* ── PLACEHOLDER ────────────────────────────────────────
   contenteditable :empty is unreliable (browser inserts
   a <br> on focus). We use a data-attribute + class.
─────────────────────────────────────────────────────── */
function initPlaceholder() {
  function check() {
    const isEmpty = canvas.innerText.replace(/\n/g, '').trim() === '';
    canvas.classList.toggle('is-empty', isEmpty);
  }

  canvas.addEventListener('input', check);
  canvas.addEventListener('focus', check);
  canvas.addEventListener('blur',  check);

  check(); // initial state
}


/* ── EFFECTS CONTROLS ───────────────────────────────────
   Outline (webkit-text-stroke) and drop shadow (text-shadow).
─────────────────────────────────────────────────────── */
const COLOR_MODES = ['hex', 'rgb', 'hsl'];

function hexToRgbString(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHslString(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function bindColorValueDisplay(pickerId, displayId) {
  const picker  = document.getElementById(pickerId);
  const display = document.getElementById(displayId);
  if (!picker || !display) return;

  function updateDisplay(hex) {
    display.dataset.color = hex;
    const mode = display.dataset.mode || 'hex';
    if (mode === 'rgb') display.textContent = hexToRgbString(hex);
    else if (mode === 'hsl') display.textContent = hexToHslString(hex);
    else display.textContent = hex;
  }

  display.addEventListener('click', () => {
    const cur = display.dataset.mode || 'hex';
    display.dataset.mode = COLOR_MODES[(COLOR_MODES.indexOf(cur) + 1) % COLOR_MODES.length];
    updateDisplay(display.dataset.color);
  });

  picker.addEventListener('input', () => updateDisplay(picker.value));
}

function initEffectsControls() {
  bindColorValueDisplay('tp-outline-color', 'tp-outline-color-value');
  bindColorValueDisplay('tp-shadow-color',  'tp-shadow-color-value');

  // Outline
  const outlineCheckbox  = document.getElementById('tp-outline-enabled');
  const outlineControls  = document.getElementById('tp-outline-controls');
  const outlineColor     = document.getElementById('tp-outline-color');
  const outlineSizeRange = document.getElementById('tp-outline-size');
  const outlineSizeNum   = document.getElementById('tp-outline-size-num');

  outlineCheckbox.addEventListener('change', () => {
    state.outlineEnabled = outlineCheckbox.checked;
    outlineControls.hidden = !outlineCheckbox.checked;
    applyGlobalStyles();
  });

  outlineColor.addEventListener('input', () => {
    state.outlineColor = outlineColor.value;
    applyGlobalStyles();
  });

  bindSliderPair(outlineSizeRange, outlineSizeNum, val => {
    state.outlineSize = val;
    applyGlobalStyles();
  });

  // Shadow
  const shadowCheckbox = document.getElementById('tp-shadow-enabled');
  const shadowControls = document.getElementById('tp-shadow-controls');
  const shadowColor    = document.getElementById('tp-shadow-color');
  const shadowXRange   = document.getElementById('tp-shadow-x');
  const shadowXNum     = document.getElementById('tp-shadow-x-num');
  const shadowYRange   = document.getElementById('tp-shadow-y');
  const shadowYNum     = document.getElementById('tp-shadow-y-num');
  const shadowBlurRange = document.getElementById('tp-shadow-blur');
  const shadowBlurNum  = document.getElementById('tp-shadow-blur-num');

  shadowCheckbox.addEventListener('change', () => {
    state.shadowEnabled = shadowCheckbox.checked;
    shadowControls.hidden = !shadowCheckbox.checked;
    applyGlobalStyles();
  });

  shadowColor.addEventListener('input', () => {
    state.shadowColor = shadowColor.value;
    applyGlobalStyles();
  });

  bindSliderPair(shadowXRange, shadowXNum, val => {
    state.shadowX = val;
    applyGlobalStyles();
  });

  bindSliderPair(shadowYRange, shadowYNum, val => {
    state.shadowY = val;
    applyGlobalStyles();
  });

  bindSliderPair(shadowBlurRange, shadowBlurNum, val => {
    state.shadowBlur = val;
    applyGlobalStyles();
  });
}


/* ── WEIGHT ANIMATION ───────────────────────────────────
   Toggles an infinite wght 500↔900 animation on the canvas,
   identical in feel to the section-sizes animation on specimen.
─────────────────────────────────────────────────────── */
function initWeightAnimation() {
  const btn = document.getElementById('tp-anim-btn');
  if (!btn) return;
  let playing = false;

  btn.addEventListener('click', () => {
    playing = !playing;
    btn.textContent = playing ? '⏸' : '▶';
    btn.classList.toggle('is-playing', playing);

    if (playing) {
      const styleEl = document.createElement('style');
      styleEl.id = 'tryme-weight-anim';
      styleEl.textContent = `
        @keyframes tryme-wght {
          from { font-variation-settings: 'wght' 500; font-weight: 500; }
          to   { font-variation-settings: 'wght' 900; font-weight: 900; }
        }
        #tryme-canvas {
          animation: tryme-wght 2.5s ease-in-out infinite alternate !important;
        }
      `;
      document.head.appendChild(styleEl);
    } else {
      document.getElementById('tryme-weight-anim')?.remove();
      applyGlobalStyles();
    }
  });
}



/* ── SETTINGS RESET BUTTON ──────────────────────────────
   Restores all sliders and canvas styles to clean defaults.
─────────────────────────────────────────────────────── */
function initSettingsReset() {
  const resetBtn = document.getElementById('tryme-reset-btn');
  if (!resetBtn) return;

  const defaults = {
    weight:        500,
    size:          48,
    lineHeight:    1.2,
    letterSpacing: 0,
  };

  resetBtn.addEventListener('click', () => {
    // Update state
    state.fontWeight    = defaults.weight;
    state.fontSize      = defaults.size;
    state.lineHeight    = defaults.lineHeight;
    state.letterSpacing = defaults.letterSpacing;

    // Sync weight controls
    if (weightSlider)    weightSlider.value    = defaults.weight;
    if (weightSliderOut) weightSliderOut.value = defaults.weight;
    setActivePreset(defaults.weight);

    // Sync typography sliders
    sizeRange.value = defaults.size;
    sizeNum.value   = defaults.size;
    lhRange.value   = defaults.lineHeight;
    lhNum.value     = defaults.lineHeight;
    lsRange.value   = defaults.letterSpacing;
    lsNum.value     = defaults.letterSpacing;

    applyGlobalStyles();
  });
}


/* ── SLIDER RELOAD ICONS ────────────────────────────────────
   Each .slider-reload-icon resets its paired slider to default.
   Uses cumulative rotation so the icon spins 360° and stays.
─────────────────────────────────────────────────────── */
function initSliderReloads() {
  const SLIDER_DEFAULTS = {
    'tp-size': { stateKey: 'fontSize',      value: 130,  range: sizeRange,    num: sizeNum },
    'tp-ls':   { stateKey: 'letterSpacing', value: 0,    range: lsRange,      num: lsNum   },
    'tp-lh':   { stateKey: 'lineHeight',    value: 0.8,  range: lhRange,      num: lhNum   },
    'tp-wght': { stateKey: 'fontWeight',    value: 900,  range: weightSlider, num: weightSliderOut,
                 onReset: () => setActivePreset(900) },
  };

  document.querySelectorAll('.slider-reload-icon').forEach(icon => {
    const targetId = icon.dataset.target;
    const def = SLIDER_DEFAULTS[targetId];
    if (!def) return;

    icon.style.transition = 'transform 0.4s ease';

    icon.addEventListener('click', () => {
      state[def.stateKey] = def.value;
      def.range.value = def.value;
      if (def.num) def.num.value = def.value;
      applyGlobalStyles();
      if (def.onReset) def.onReset();

      let rot = parseInt(icon.getAttribute('data-rot') || '0', 10);
      rot += 360;
      icon.style.transform = `rotate(${rot}deg)`;
      icon.setAttribute('data-rot', rot);
    });
  });
}


/* ── SLANTED CARET ──────────────────────────────────────
   Positions a rotated proxy div over the native cursor on
   the contenteditable canvas. Native caret is hidden via CSS.
─────────────────────────────────────────────────────── */
function initSlantedCaret() {
  const proxy = document.createElement('div');
  proxy.className = 'caret-proxy';
  document.body.appendChild(proxy);

  let hasTyped = false;

  function positionFromSelection() {
    if (hasTyped) return;
    if (canvas.classList.contains('has-fake-cursor')) return;
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

  ['focus', 'mouseup'].forEach(ev =>
    canvas.addEventListener(ev, positionFromSelection));

  canvas.addEventListener('keydown', () => {
    hasTyped = true;
    proxy.classList.remove('is-active');
  }, { once: true });

  canvas.addEventListener('blur', () => proxy.classList.remove('is-active'));

  document.addEventListener('mousedown', e => {
    if (!e.target.closest('[contenteditable]')) proxy.classList.remove('is-active');
  });

  window.addEventListener('scroll', positionFromSelection, { passive: true });
}


/* ── OPENTYPE FEATURES ──────────────────────────────────
─────────────────────────────────────────────────────── */
function initOpenTypeFeatures() {
  const checkboxes = document.querySelectorAll('.tp-feat-cb');
  const ligaCb     = document.getElementById('feat-liga');

  function updateFeatures() {
    const parts = [];
    // Always declare liga explicitly so it is never overridden by browser UA defaults
    parts.push(ligaCb.checked ? '"liga" 1' : '"liga" 0');
    checkboxes.forEach(cb => {
      if (cb.value === 'liga') return;
      if (cb.checked) parts.push(`"${cb.value}" 1`);
    });
    canvas.style.fontFeatureSettings = parts.join(', ');
  }

  function resetFeatures() {
    checkboxes.forEach(cb => {
      cb.checked = cb.value === 'liga'; // only liga on by default
    });
    updateFeatures();
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateFeatures));
  updateFeatures();

  // Expose reset so initSettingsReset can call it
  return { reset: resetFeatures };
}


/* ── INIT ───────────────────────────────────────────────
─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Resolve --color-green from CSS and apply to green palette + initial state
  const cssGreen = getComputedStyle(document.documentElement).getPropertyValue('--color-green').trim();
  if (cssGreen) {
    const greenPalette = PALETTES.find(p => p.useGreen);
    if (greenPalette) greenPalette.textColor = cssGreen;
    state.textColor = cssGreen;
  }

  // Populate canvas with default text
  if (DEFAULT_TEXT) {
    canvas.innerText = DEFAULT_TEXT;
  }

  // Remove fake cursor on first click/focus — never returns until page reload
  canvas.addEventListener('focus', () => {
    canvas.classList.remove('has-fake-cursor');
  }, { once: true });

  // Apply initial state to canvas and body
  applyGlobalStyles();

  // Wire up controls
  initWeightControl();
  initSliders();
  initAlignment();
  initColors();
  initCollapsibles();
  initCustomCSS();
  initPlaceholder();
  initEffectsControls();
  initWeightAnimation();
  initSettingsReset();
  initSliderReloads();

  // Start watching text selection
  initSelectionMonitor();

  // Slanted proxy caret (replaces native browser caret)
  initSlantedCaret();

  // OpenType feature toggles — store handle for reset integration
  const featureControls = initOpenTypeFeatures();

  // Hook feature reset into the settings reset button if it exists
  const resetBtn = document.getElementById('tryme-reset-btn');
  if (resetBtn && featureControls) {
    resetBtn.addEventListener('click', featureControls.reset);
  }
});
