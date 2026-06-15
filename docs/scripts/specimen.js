/* =====================================================
   SHMUEL — Specimen Page Interactions
   specimen.js
   ===================================================== */

'use strict';

// ── Data ─────────────────────────────────────────────

// Finals interleaved after their base forms: כ→ך  מ→ם  נ→ן  פ→ף  צ→ץ
const HEBREW_LETTERS = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת'.split('');
const NUMBER_CHARS   = '0123456789'.split('');
const MARK_CHARS     = [':', ';', '!', '?', '/', '\\', '-', '—', '_', '(', ')', '[', ']', '.', ',', '־', "'", '"', '״', '׳', '&'];
const LATIN_CHARS    = 'abcdefghijklmnopqrstuvwxyz'.split('').concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
const SS01_DIGITS = ['0','1','2','3','4','5','6','7','8','9'];
const SS02_DIGITS = ['0','2','3','4','5','6','9'];

const HEBREW_GLYPH_DATA = {
  'א': { name: 'אלף',        unicode: 'U+05D0', decimal: 1488, unicodeName: 'alef-hb'          },
  'ב': { name: 'בית',        unicode: 'U+05D1', decimal: 1489, unicodeName: 'bet-hb'           },
  'ג': { name: 'גימל',       unicode: 'U+05D2', decimal: 1490, unicodeName: 'gimel-hb'         },
  'ד': { name: 'דלת',        unicode: 'U+05D3', decimal: 1491, unicodeName: 'dalet-hb'         },
  'ה': { name: 'הא',         unicode: 'U+05D4', decimal: 1492, unicodeName: 'he-hb'            },
  'ו': { name: 'וו',         unicode: 'U+05D5', decimal: 1493, unicodeName: 'vav-hb'           },
  'ז': { name: 'זיין',       unicode: 'U+05D6', decimal: 1494, unicodeName: 'zayin-hb'         },
  'ח': { name: 'חית',        unicode: 'U+05D7', decimal: 1495, unicodeName: 'het-hb'           },
  'ט': { name: 'טית',        unicode: 'U+05D8', decimal: 1496, unicodeName: 'tet-hb'           },
  'י': { name: 'יוד',        unicode: 'U+05D9', decimal: 1497, unicodeName: 'yod-hb'           },
  'כ': { name: 'כף',         unicode: 'U+05DB', decimal: 1499, unicodeName: 'kaf-hb'           },
  'ל': { name: 'למד',        unicode: 'U+05DC', decimal: 1500, unicodeName: 'lamed-hb'         },
  'מ': { name: 'מם',         unicode: 'U+05DE', decimal: 1502, unicodeName: 'mem-hb'           },
  'נ': { name: 'נון',        unicode: 'U+05E0', decimal: 1504, unicodeName: 'nun-hb'           },
  'ס': { name: 'סמך',        unicode: 'U+05E1', decimal: 1505, unicodeName: 'samekh-hb'        },
  'ע': { name: 'עין',        unicode: 'U+05E2', decimal: 1506, unicodeName: 'ayin-hb'          },
  'פ': { name: 'פא',         unicode: 'U+05E4', decimal: 1508, unicodeName: 'pe-hb'            },
  'צ': { name: 'צדי',        unicode: 'U+05E6', decimal: 1510, unicodeName: 'tsadi-hb'         },
  'ק': { name: 'קוף',        unicode: 'U+05E7', decimal: 1511, unicodeName: 'qof-hb'           },
  'ר': { name: 'ריש',        unicode: 'U+05E8', decimal: 1512, unicodeName: 'resh-hb'          },
  'ש': { name: 'שין',        unicode: 'U+05E9', decimal: 1513, unicodeName: 'shin-hb'          },
  'ת': { name: 'תו',         unicode: 'U+05EA', decimal: 1514, unicodeName: 'tav-hb'           },
  'ך': { name: 'כף סופית',   unicode: 'U+05DA', decimal: 1498, unicodeName: 'kaf-final-hb'     },
  'ם': { name: 'מם סופית',   unicode: 'U+05DD', decimal: 1501, unicodeName: 'mem-final-hb'     },
  'ן': { name: 'נון סופית',  unicode: 'U+05DF', decimal: 1503, unicodeName: 'nun-final-hb'     },
  'ף': { name: 'פא סופית',   unicode: 'U+05E3', decimal: 1507, unicodeName: 'pe-final-hb'      },
  'ץ': { name: 'צדי סופית',  unicode: 'U+05E5', decimal: 1509, unicodeName: 'tsadi-final-hb'   },
  '0': { name: '0',           unicode: 'U+0030', decimal: 48,   unicodeName: 'zero'             },
  '1': { name: '1',           unicode: 'U+0031', decimal: 49,   unicodeName: 'one'              },
  '2': { name: '2',           unicode: 'U+0032', decimal: 50,   unicodeName: 'two'              },
  '3': { name: '3',           unicode: 'U+0033', decimal: 51,   unicodeName: 'three'            },
  '4': { name: '4',           unicode: 'U+0034', decimal: 52,   unicodeName: 'four'             },
  '5': { name: '5',           unicode: 'U+0035', decimal: 53,   unicodeName: 'five'             },
  '6': { name: '6',           unicode: 'U+0036', decimal: 54,   unicodeName: 'six'              },
  '7': { name: '7',           unicode: 'U+0037', decimal: 55,   unicodeName: 'seven'            },
  '8': { name: '8',           unicode: 'U+0038', decimal: 56,   unicodeName: 'eight'            },
  '9': { name: '9',           unicode: 'U+0039', decimal: 57,   unicodeName: 'nine'             },
  '0_alt': { name: '0', unicode: 'U+0030', decimal: 48, unicodeName: 'zero.001'  },
  '1_alt': { name: '1', unicode: 'U+0031', decimal: 49, unicodeName: 'one.001'   },
  '2_alt': { name: '2', unicode: 'U+0032', decimal: 50, unicodeName: 'two.001'   },
  '3_alt': { name: '3', unicode: 'U+0033', decimal: 51, unicodeName: 'three.001' },
  '4_alt': { name: '4', unicode: 'U+0034', decimal: 52, unicodeName: 'four.001'  },
  '5_alt': { name: '5', unicode: 'U+0035', decimal: 53, unicodeName: 'five.001'  },
  '6_alt': { name: '6', unicode: 'U+0036', decimal: 54, unicodeName: 'six.001'   },
  '7_alt': { name: '7', unicode: 'U+0037', decimal: 55, unicodeName: 'seven.001' },
  '8_alt': { name: '8', unicode: 'U+0038', decimal: 56, unicodeName: 'eight.001' },
  '9_alt': { name: '9', unicode: 'U+0039', decimal: 57, unicodeName: 'nine.001'  },
  '0_alt2': { name: '0', unicode: 'U+0030', decimal: 48, unicodeName: 'zero.002'  },
  '2_alt2': { name: '2', unicode: 'U+0032', decimal: 50, unicodeName: 'two.002'   },
  '3_alt2': { name: '3', unicode: 'U+0033', decimal: 51, unicodeName: 'three.002' },
  '4_alt2': { name: '4', unicode: 'U+0034', decimal: 52, unicodeName: 'four.002'  },
  '5_alt2': { name: '5', unicode: 'U+0035', decimal: 53, unicodeName: 'five.005'  },
  '6_alt2': { name: '6', unicode: 'U+0036', decimal: 54, unicodeName: 'six.002'   },
  '9_alt2': { name: '9', unicode: 'U+0039', decimal: 57, unicodeName: 'nine.002'  },
  '־': { name: 'מקף עברי',   unicode: 'U+05BE', decimal: 1470, unicodeName: 'maqaf-hb'         },
  '.': { name: 'נקודה',      unicode: 'U+002E', decimal: 46,   unicodeName: 'period'           },
  ',': { name: 'פסיק',       unicode: 'U+002C', decimal: 44,   unicodeName: 'comma'            },
  ':': { name: 'נקודותיים',  unicode: 'U+003A', decimal: 58,   unicodeName: 'colon'            },
  ';': { name: 'פסיק-עליון', unicode: 'U+003B', decimal: 59,   unicodeName: 'semicolon'        },
  '!': { name: 'קריאה',      unicode: 'U+0021', decimal: 33,   unicodeName: 'exclam'           },
  '?': { name: 'שאלה',       unicode: 'U+003F', decimal: 63,   unicodeName: 'question'         },
  '/': { name: 'לוכסן',      unicode: 'U+002F', decimal: 47,   unicodeName: 'slash'            },
  '\\':{ name: 'לוכסן הפוך', unicode: 'U+005C', decimal: 92,   unicodeName: 'backslash'        },
  '-': { name: 'מקף',        unicode: 'U+002D', decimal: 45,   unicodeName: 'hyphen'           },
  '—': { name: 'קו מפריד',   unicode: 'U+2014', decimal: 8212, unicodeName: 'emdash'           },
  '_': { name: 'קו תחתון',   unicode: 'U+005F', decimal: 95,   unicodeName: 'underscore'       },
  '(': { name: 'סוגריים פתוח',  unicode: 'U+0028', decimal: 40, unicodeName: 'parenleft'      },
  ')': { name: 'סוגריים סגור',  unicode: 'U+0029', decimal: 41, unicodeName: 'parenright'     },
  '[': { name: 'סוגריים מרובעים פתוח',   unicode: 'U+005B', decimal: 91, unicodeName: 'bracketleft'    },
  ']': { name: 'סוגריים מרובעים סגור',   unicode: 'U+005D', decimal: 93, unicodeName: 'bracketright'   },
  "'": { name: 'גרש',            unicode: 'U+0027', decimal: 39,   unicodeName: 'apostrophe'       },
  '"': { name: 'גרשיים',         unicode: 'U+0022', decimal: 34,   unicodeName: 'quotedbl'         },
  '״': { name: 'גרשיים עבריים', unicode: 'U+05F4', decimal: 1524, unicodeName: 'gereshayim-hb'    },
  '׳': { name: 'גרש עברי',      unicode: 'U+05F3', decimal: 1523, unicodeName: 'geresh-hb'        },
  '&': { name: 'אמפרסנד', unicode: 'U+0026', decimal: 38,  unicodeName: 'ampersand' },
  'a': { name: 'A', unicode: 'U+0061', decimal: 97,  unicodeName: 'a' },
  'b': { name: 'B', unicode: 'U+0062', decimal: 98,  unicodeName: 'b' },
  'c': { name: 'C', unicode: 'U+0063', decimal: 99,  unicodeName: 'c' },
  'd': { name: 'D', unicode: 'U+0064', decimal: 100, unicodeName: 'd' },
  'e': { name: 'E', unicode: 'U+0065', decimal: 101, unicodeName: 'e' },
  'f': { name: 'F', unicode: 'U+0066', decimal: 102, unicodeName: 'f' },
  'g': { name: 'G', unicode: 'U+0067', decimal: 103, unicodeName: 'g' },
  'h': { name: 'H', unicode: 'U+0068', decimal: 104, unicodeName: 'h' },
  'i': { name: 'I', unicode: 'U+0069', decimal: 105, unicodeName: 'i' },
  'j': { name: 'J', unicode: 'U+006A', decimal: 106, unicodeName: 'j' },
  'k': { name: 'K', unicode: 'U+006B', decimal: 107, unicodeName: 'k' },
  'l': { name: 'L', unicode: 'U+006C', decimal: 108, unicodeName: 'l' },
  'm': { name: 'M', unicode: 'U+006D', decimal: 109, unicodeName: 'm' },
  'n': { name: 'N', unicode: 'U+006E', decimal: 110, unicodeName: 'n' },
  'o': { name: 'O', unicode: 'U+006F', decimal: 111, unicodeName: 'o' },
  'p': { name: 'P', unicode: 'U+0070', decimal: 112, unicodeName: 'p' },
  'q': { name: 'Q', unicode: 'U+0071', decimal: 113, unicodeName: 'q' },
  'r': { name: 'R', unicode: 'U+0072', decimal: 114, unicodeName: 'r' },
  's': { name: 'S', unicode: 'U+0073', decimal: 115, unicodeName: 's' },
  't': { name: 'T', unicode: 'U+0074', decimal: 116, unicodeName: 't' },
  'u': { name: 'U', unicode: 'U+0075', decimal: 117, unicodeName: 'u' },
  'v': { name: 'V', unicode: 'U+0076', decimal: 118, unicodeName: 'v' },
  'w': { name: 'W', unicode: 'U+0077', decimal: 119, unicodeName: 'w' },
  'x': { name: 'X', unicode: 'U+0078', decimal: 120, unicodeName: 'x' },
  'y': { name: 'Y', unicode: 'U+0079', decimal: 121, unicodeName: 'y' },
  'z': { name: 'Z', unicode: 'U+007A', decimal: 122, unicodeName: 'z' },
  'A': { name: 'A', unicode: 'U+0041', decimal: 65,  unicodeName: 'A' },
  'B': { name: 'B', unicode: 'U+0042', decimal: 66,  unicodeName: 'B' },
  'C': { name: 'C', unicode: 'U+0043', decimal: 67,  unicodeName: 'C' },
  'D': { name: 'D', unicode: 'U+0044', decimal: 68,  unicodeName: 'D' },
  'E': { name: 'E', unicode: 'U+0045', decimal: 69,  unicodeName: 'E' },
  'F': { name: 'F', unicode: 'U+0046', decimal: 70,  unicodeName: 'F' },
  'G': { name: 'G', unicode: 'U+0047', decimal: 71,  unicodeName: 'G' },
  'H': { name: 'H', unicode: 'U+0048', decimal: 72,  unicodeName: 'H' },
  'I': { name: 'I', unicode: 'U+0049', decimal: 73,  unicodeName: 'I' },
  'J': { name: 'J', unicode: 'U+004A', decimal: 74,  unicodeName: 'J' },
  'K': { name: 'K', unicode: 'U+004B', decimal: 75,  unicodeName: 'K' },
  'L': { name: 'L', unicode: 'U+004C', decimal: 76,  unicodeName: 'L' },
  'M': { name: 'M', unicode: 'U+004D', decimal: 77,  unicodeName: 'M' },
  'N': { name: 'N', unicode: 'U+004E', decimal: 78,  unicodeName: 'N' },
  'O': { name: 'O', unicode: 'U+004F', decimal: 79,  unicodeName: 'O' },
  'P': { name: 'P', unicode: 'U+0050', decimal: 80,  unicodeName: 'P' },
  'Q': { name: 'Q', unicode: 'U+0051', decimal: 81,  unicodeName: 'Q' },
  'R': { name: 'R', unicode: 'U+0052', decimal: 82,  unicodeName: 'R' },
  'S': { name: 'S', unicode: 'U+0053', decimal: 83,  unicodeName: 'S' },
  'T': { name: 'T', unicode: 'U+0054', decimal: 84,  unicodeName: 'T' },
  'U': { name: 'U', unicode: 'U+0055', decimal: 85,  unicodeName: 'U' },
  'V': { name: 'V', unicode: 'U+0056', decimal: 86,  unicodeName: 'V' },
  'W': { name: 'W', unicode: 'U+0057', decimal: 87,  unicodeName: 'W' },
  'X': { name: 'X', unicode: 'U+0058', decimal: 88,  unicodeName: 'X' },
  'Y': { name: 'Y', unicode: 'U+0059', decimal: 89,  unicodeName: 'Y' },
  'Z': { name: 'Z', unicode: 'U+005A', decimal: 90,  unicodeName: 'Z' },
  's_alt': { name: 'S', unicode: 'U+0073', decimal: 115, unicodeName: 's.001' },
  'v_alt': { name: 'V', unicode: 'U+0076', decimal: 118, unicodeName: 'v.001' },
  'w_alt': { name: 'W', unicode: 'U+0077', decimal: 119, unicodeName: 'w.001' },
};

// ── DOM Population ────────────────────────────────────

function buildCharGrid() {
  const grid        = document.getElementById('char-grid');
  const gridNumbers = document.getElementById('char-grid-numbers');
  const gridMarks   = document.getElementById('char-grid-marks');
  const gridLatin   = document.getElementById('char-grid-latin');
  const gridAlts    = document.getElementById('char-grid-alternates');
  if (!grid) return;

  HEBREW_LETTERS.forEach(ch => {
    const span = document.createElement('span');
    span.className   = 'char-cell';
    span.textContent = ch;
    span.setAttribute('aria-hidden', 'true');
    grid.appendChild(span);
  });

  if (gridNumbers) {
    NUMBER_CHARS.forEach(ch => {
      const span = document.createElement('span');
      span.className   = 'char-cell';
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      gridNumbers.appendChild(span);
    });
  }

  if (gridMarks) {
    MARK_CHARS.forEach(ch => {
      const span = document.createElement('span');
      span.className   = 'char-cell';
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      gridMarks.appendChild(span);
    });
  }

  if (gridLatin) {
    LATIN_CHARS.forEach(ch => {
      const span = document.createElement('span');
      span.className   = 'char-cell';
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      gridLatin.appendChild(span);
    });
  }

  if (gridAlts) {
    function buildAltGroup(container, digits, ssKey, label) {
      const group = document.createElement('div');
      group.className = 'char-alt-group';

      const groupLabel = document.createElement('span');
      groupLabel.className = 'char-alt-group-label';
      groupLabel.textContent = label;
      group.appendChild(groupLabel);

      const grid = document.createElement('div');
      grid.className = 'char-grid';

      const glyphKeySuffix = ssKey === 'ss02' ? '_alt2' : '_alt';
      digits.forEach(digit => {
        const span = document.createElement('span');
        span.className = `char-cell char-cell--${ssKey}`;
        span.textContent = digit;
        span.dataset.glyphKey = digit + glyphKeySuffix;
        span.setAttribute('aria-hidden', 'true');
        grid.appendChild(span);
      });

      group.appendChild(grid);
      container.appendChild(group);
    }

    buildAltGroup(gridAlts, SS01_DIGITS, 'ss01', 'ss01');
    buildAltGroup(gridAlts, SS02_DIGITS, 'ss02', 'ss02');
  }
}

// ── Character Inspector ───────────────────────────────

/**
 * Left panel glyph inspector:
 *   - auto-cycles through wght axis to demonstrate range
 *   - click any grid cell → updates glyph + Unicode data
 *   - selected state synced across both grids
 */
function initCharInspector() {
  const glyphEl     = document.getElementById('charview-glyph');
  const nameEl      = document.getElementById('chardata-name');
  const hexEl       = document.getElementById('chardata-hex');
  const decEl       = document.getElementById('chardata-dec');
  const uNameEl     = document.getElementById('chardata-unicode-name');
  const weightEl    = document.getElementById('chardata-weight');
  if (!glyphEl) return;

  // Weight cycle — CSS transition handles the smooth glyph animation.
  // A parallel rAF counter makes the number display count smoothly too.
  const CYCLE = [500, 600, 700, 800, 900, 800, 700, 600];
  const STEP_MS = 1100;  // interval between weight changes
  const TRANS_MS = 950;  // must match the CSS transition duration
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

  function selectGlyph(ch, key) {
    const data = HEBREW_GLYPH_DATA[key || ch];
    if (!data) return;

    glyphEl.textContent = ch;
    if (nameEl)  nameEl.textContent  = data.name;
    if (hexEl)   hexEl.textContent   = data.unicode;
    if (decEl)   decEl.textContent   = data.decimal;
    if (uNameEl) uNameEl.textContent = data.unicodeName ?? '';

    document.querySelectorAll('.char-cell').forEach(cell => {
      const match = key
        ? cell.dataset.glyphKey === key
        : cell.textContent.trim() === ch && !cell.dataset.glyphKey;
      cell.classList.toggle('char-cell--selected', match);
    });
  }

  // Delegated hover on grid panel — updates on each new cell entered
  const panel = document.querySelector('.charview-grid-panel');
  if (panel) {
    let lastCell = null;
    panel.addEventListener('mouseover', e => {
      const cell = e.target.closest('.char-cell');
      if (cell && cell !== lastCell) {
        lastCell = cell;
        selectGlyph(cell.textContent.trim(), cell.dataset.glyphKey);
      }
    });
  }

  selectGlyph('א'); // default
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

      // Proximity: grey -> neon green with increasing opacity
      const alpha = (0.25 + t * 0.25).toFixed(2);
      cell.style.color = `rgba(57, 255, 20, ${alpha})`;
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

  window.addEventListener('mousemove', e => {
    const percent   = e.clientX / window.innerWidth;
    const weightHe  = Math.round(500 + percent * 400);
    const weightEn  = Math.round(900 - percent * 400);
    titleHe.style.fontVariationSettings = `'wght' ${weightHe}`;
    titleEn.style.fontVariationSettings = `'wght' ${weightEn}`;
    if (labelHe) labelHe.textContent = weightHe;
    if (labelEn) labelEn.textContent = weightEn;
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
  const NEON_COLORS = ['#39FF14', '#FF1493', '#FFFF00', '#FF5E00', '#FFFFFF'];
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
    let wordsPerBreak;
    if (shape === 'hero-icon-3')      wordsPerBreak = 3; // Horizontal
    else if (shape === 'hero-icon-2') wordsPerBreak = 2; // Square
    else                              wordsPerBreak = Math.random() < 0.5 ? 1 : 2; // Vertical

    const words = text.split(' ');
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
    if (len <= 8)       { size = Math.floor(Math.random() * 30) + 85; widthEm = 4.5; } // 85-114
    else if (len <= 14) { size = Math.floor(Math.random() * 25) + 60; widthEm = 5.5; } // 60-84
    else if (len <= 22) { size = Math.floor(Math.random() * 18) + 43; widthEm = 6.5; } // 43-60
    else                { size = Math.floor(Math.random() * 15) + 32; widthEm = 7.5; } // 32-46

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
    item.style.fontSize              = size + 'px';
    item.style.width                 = widthEm + 'em';
    item.style.fontVariationSettings = `'wght' ${randomWeight}`;

    // Resolve scroll position within the section's coordinate space
    const sectionTop      = section.getBoundingClientRect().top + window.scrollY;
    const scrollInSection = window.scrollY - sectionTop;

    // Horizontal: first 2 prints stay on left half; rest span full width
    const safeWidth = window.innerWidth - 300;
    const leftHalf  = window.innerWidth * 0.52;
    const maxX      = printCount < 2 ? Math.min(leftHalf, safeWidth) : safeWidth;

    // Vertical: keep stickers out of the lowest 10% of the viewport
    const minY = 60;
    const maxY = window.innerHeight * 0.9;

    const randomX = Math.random() * maxX;
    const randomY = scrollInSection + minY + Math.random() * (maxY - minY);

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

// ── Init ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildCharGrid();
  initSpecimenTitles();
  initSpecimenPrint();
  initCharProximity();
  initCharInspector();
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
    const titleAnimationDistance = titleAnimationStart;
    const titleProgress = clamp(
      (titleAnimationStart - titleRect.top) / titleAnimationDistance,
      0,
      1
    );

    const titleWeight = Math.round(lerp(500, 900, titleProgress));
    const locationWeight = Math.round(lerp(700, 500, titleProgress));

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
      (viewportHeight - sectionRect.top) / viewportHeight,
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
