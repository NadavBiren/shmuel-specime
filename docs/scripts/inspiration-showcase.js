const BASE = 'assets/images/from-Inspiration-to-font/';
const SLOT_COUNT = 14;

const paths = {
  scans: {
    base:    id => `${BASE}scans-to-font-insperation-${id}.jpg`,
    hover:   id => `${BASE}scans-to-font-insperation-hover-${id}.jpg`,
    overlay: id => `${BASE}scans_bg-hover-${id}.png`,
  },
  fonts: {
    base:    id => `${BASE}font-to-font-insperation-${id}.jpg`,
    hover:   id => `${BASE}font-to-font-insperation-hover-${id}.jpg`,
    overlay: id => `${BASE}fonts_bg-hover-${id}.png`,
  },
};

// Each entry is a slot id (1–14), 'btn-scans', 'btn-fonts', or 'empty'
const GRID_LAYOUT = [
  [1, 2, 3, 4, 5, 6],
  [7, 'btn-scans', 'empty', 'empty', 'btn-fonts', 8],
  [9, 10, 11, 12, 13, 14],
];

const BTN_CONFIG = {
  'btn-scans': { mode: 'scans', label: 'סריקות' },
  'btn-fonts': { mode: 'fonts', label: 'דיגיטציה' },
};

const showcase = document.getElementById('inspirationShowcase');
const overlay  = document.getElementById('inspirationOverlay');
const grid     = document.getElementById('inspirationGrid');

function currentMode() {
  return showcase.dataset.mode;
}

// ─── DOM generation ──────────────────────────────────

function buildGrid() {
  for (const row of GRID_LAYOUT) {
    for (const cell of row) {
      if (typeof cell === 'number') {
        grid.appendChild(createImageItem(cell));
      } else if (cell in BTN_CONFIG) {
        grid.appendChild(createButtonCell(cell));
      } else {
        const empty = document.createElement('div');
        empty.className = 'grid-empty-cell';
        grid.appendChild(empty);
      }
    }
  }
}

function createImageItem(slotId) {
  const mode = currentMode();

  const item = document.createElement('div');
  item.className = 'grid-item';
  item.dataset.slot = slotId;

  const base = document.createElement('img');
  base.className = 'item-base';
  base.src = paths[mode].base(slotId);
  base.alt = '';
  base.draggable = false;

  const hover = document.createElement('img');
  hover.className = 'item-hover';
  hover.src = paths[mode].hover(slotId);
  hover.alt = '';
  hover.draggable = false;

  item.appendChild(base);
  item.appendChild(hover);

  item.addEventListener('mouseenter', () => onItemEnter(item, slotId));
  item.addEventListener('mouseleave', () => onItemLeave(item));

  return item;
}

function createButtonCell(key) {
  const { mode, label } = BTN_CONFIG[key];

  const cell = document.createElement('div');
  cell.className = 'grid-btn-cell';

  const btn = document.createElement('button');
  btn.className = 'mode-btn';
  btn.dataset.target = mode;
  btn.textContent = label;
  btn.type = 'button';
  btn.addEventListener('click', () => switchMode(mode));

  cell.appendChild(btn);
  return cell;
}

// ─── Hover interaction ───────────────────────────────

function onItemEnter(item, slotId) {
  item.classList.add('is-hovered');
  overlay.style.backgroundImage = `url('${paths[currentMode()].overlay(slotId)}')`;
  overlay.classList.add('is-visible');
}

function onItemLeave(item) {
  item.classList.remove('is-hovered');
  overlay.classList.remove('is-visible');
}

// ─── Mode switching ──────────────────────────────────

function switchMode(newMode) {
  if (currentMode() === newMode) return;

  showcase.dataset.mode = newMode;

  document.querySelectorAll('.grid-item').forEach(item => {
    const id = parseInt(item.dataset.slot, 10);
    item.querySelector('.item-base').src  = paths[newMode].base(id);
    item.querySelector('.item-hover').src = paths[newMode].hover(id);
  });
}

// ─── Preloading ──────────────────────────────────────

function preloadImages() {
  const init = currentMode();

  ['scans', 'fonts'].forEach(mode => {
    for (let id = 1; id <= SLOT_COUNT; id++) {
      new Image().src = paths[mode].hover(id);
      new Image().src = paths[mode].overlay(id);
      if (mode !== init) {
        new Image().src = paths[mode].base(id);
      }
    }
  });
}

// ─── Init ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  preloadImages();
});
