/* =====================================================
   SHMUEL — Research Page Interactions
   research.js
   ===================================================== */

'use strict';


/* ── TAB CLICK → SMOOTH SCROLL ────────────────────────────────
   Global function — called from inline onclick on .rs-tab.
   CSS sticky physics handle the accumulation; no JS needed.
─────────────────────────────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}


/* ── SCROLL WEIGHT ─────────────────────────────────────────────
   Maps total-page scroll progress (0 → 1) to --scroll-weight
   (300 → 900) on :root.
─────────────────────────────────────────────────────────────── */
function initScrollWeight() {
  function update() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(1, window.scrollY / maxScroll);
    document.documentElement.style.setProperty(
      '--scroll-weight',
      Math.round(500 + progress * 400)
    );
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ── SOURCES SECTION (02) ──────────────────────────────────────
   טוען sources.json, בונה את ה-UI, ומנהל:
   1. grid בחירת מקור
   2. שכבות תמונה + מעבר opacity לפי עכבר
   3. עדכון פרטי מקור
─────────────────────────────────────────────────────────────── */
async function initSourcesSection() {
  const IMG_BASE = 'assets/images/scan-to-font/';

  const selector   = document.getElementById('sources-selector');
  const viewer     = document.getElementById('sources-viewer');
  const track      = document.getElementById('sources-viewer-track');
  const lettersImg = document.getElementById('sources-letters-img');
  const metaEls  = {
    name:   document.getElementById('smeta-name'),
    year:   document.getElementById('smeta-year'),
    writer: document.getElementById('smeta-writer'),
    place:  document.getElementById('smeta-place'),
    style:  document.getElementById('smeta-style'),
  };

  if (!selector || !viewer || !track) return;

  let sources;
  try {
    const res = await fetch('assets/data/sources.json');
    sources = await res.json();
  } catch (e) {
    console.warn('sources.json failed to load', e);
    return;
  }

  // בניית slides
  sources.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'source-slide';
    slide.dataset.id = src.id;

    const imgScan = document.createElement('img');
    imgScan.className = 'source-slide__scan';
    imgScan.src = IMG_BASE + src.images.scan;
    imgScan.alt = `סריקה — ${src.sourceName}`;

    const imgFont = document.createElement('img');
    imgFont.className = 'source-slide__font';
    imgFont.src = IMG_BASE + src.images.digitization;
    imgFont.alt = `דיגיטציה — ${src.sourceName}`;

    slide.appendChild(imgScan);
    slide.appendChild(imgFont);
    track.appendChild(slide);
  });

  // בניית selector buttons
  sources.forEach(src => {
    const btn = document.createElement('button');
    btn.className = 'src-btn';
    btn.dataset.id = src.id;
    btn.type = 'button';
    btn.textContent = String(src.id).padStart(2, '0');
    selector.appendChild(btn);
  });

  let activeId = sources[0].id;

  function getSlide(id) {
    return track.querySelector(`.source-slide[data-id="${id}"]`);
  }

  function activateSource(id) {
    track.querySelectorAll('.source-slide').forEach(s => s.classList.remove('is-active'));
    const slide = getSlide(id);
    if (slide) slide.classList.add('is-active');

    selector.querySelectorAll('.src-btn').forEach(b => b.classList.remove('is-active'));
    const btn = selector.querySelector(`.src-btn[data-id="${id}"]`);
    if (btn) btn.classList.add('is-active');

    const src = sources.find(s => s.id === id);
    if (!src) return;
    metaEls.name.textContent   = src.sourceName;
    metaEls.year.textContent   = src.year;
    metaEls.writer.textContent = src.writer;
    metaEls.place.textContent  = src.place;
    metaEls.style.textContent  = src.writingStyle;

    if (lettersImg) {
      lettersImg.src = `assets/images/digitize-letters/scan-to-font-letters-${id}.jpg`;
      lettersImg.alt = `סט אותיות ממקור ${id}`;
    }

    activeId = id;
  }

  selector.addEventListener('click', e => {
    const btn = e.target.closest('.src-btn');
    if (!btn) return;
    activateSource(parseInt(btn.dataset.id, 10));
  });

  const line = document.getElementById('sources-viewer-line');

  const prevBtn = viewer.querySelector('.src-nav-prev');
  const nextBtn = viewer.querySelector('.src-nav-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const currentIndex = sources.findIndex(s => s.id === activeId);
      // Right arrow goes forward: next index, loop to beginning if at the end
      const nextIndex = (currentIndex + 1) % sources.length;
      activateSource(sources[nextIndex].id);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentIndex = sources.findIndex(s => s.id === activeId);
      // Left arrow goes backward: previous index, loop to end if at the beginning
      const prevIndex = (currentIndex - 1 + sources.length) % sources.length;
      activateSource(sources[prevIndex].id);
    });
  }

  // mousemove → crossfade scan ↔ font + move separator line
  // RTL: X=0 = קצה ימני, normalizedX=0 scan שולט, =1 font שולט
  let leaveRAF = null;

  viewer.addEventListener('mousemove', e => {
    if (leaveRAF) { cancelAnimationFrame(leaveRAF); leaveRAF = null; }
    const rect = viewer.getBoundingClientRect();
    const normalizedX = 1 - (e.clientX - rect.left) / rect.width;
    const slide = getSlide(activeId);
    if (!slide) return;
    slide.style.setProperty('--img-scan-opacity', 1 - normalizedX);
    slide.style.setProperty('--img-font-opacity', normalizedX);
    if (line) line.style.left = (e.clientX - rect.left) + 'px';
  });

  viewer.addEventListener('mouseleave', () => {
    const slide = getSlide(activeId);
    if (!slide) return;
    const rect = viewer.getBoundingClientRect();
    const scanStart = parseFloat(slide.style.getPropertyValue('--img-scan-opacity') || '0.5');
    const fontStart = parseFloat(slide.style.getPropertyValue('--img-font-opacity') || '0.5');
    const lineStartPx = line ? parseFloat(line.style.left) || rect.width / 2 : 0;
    const lineTargetPx = rect.width / 2;
    const duration = 300;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const ease = p * (2 - p); // ease-out quad
      slide.style.setProperty('--img-scan-opacity', scanStart + (0.5 - scanStart) * ease);
      slide.style.setProperty('--img-font-opacity', fontStart + (0.5 - fontStart) * ease);
      if (line) line.style.left = (lineStartPx + (lineTargetPx - lineStartPx) * ease) + 'px';
      if (p < 1) { leaveRAF = requestAnimationFrame(step); }
      else {
        slide.style.removeProperty('--img-scan-opacity');
        slide.style.removeProperty('--img-font-opacity');
        if (line) line.style.left = '';
      }
    }
    leaveRAF = requestAnimationFrame(step);
  });

  activateSource(activeId);
}


/* ── HEADER WEIGHT SCROLL ──────────────────────────────────────────
   Maps each .rs-section__title through wght 500→900 as it scrolls
   from entering the viewport (bottom) to exiting the top.
─────────────────────────────────────────────────────────────── */
function initHeaderWeightScroll() {
  const headers = document.querySelectorAll('.rs-section__title');
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



/* ── SOURCES MAGNET SCROLL — REMOVED ──────────────────────────────
   JS scroll hijacking replaced by native CSS scroll-snap-type.
   See: research.css → .rs-section { scroll-snap-align: start; }
─────────────────────────────────────────────────────────────── */


/* ── BOTTOM ACCORDION TABS (SEAMLESS SWAP) ───────────────────── */
function initBottomAccordion() {
  const bottomRail = document.createElement('div');
  bottomRail.className = 'bottom-tabs-rail';
  document.body.appendChild(bottomRail);

  const originalTabs = document.querySelectorAll('.rs-tab-bar .rs-tab');
  const clones = [];

  originalTabs.forEach((tab, index) => {
    if (index === 0) return;

    const clone = tab.cloneNode(true);
    clone.onclick = tab.onclick;
    bottomRail.appendChild(clone);

    clones.push({
      cloneEl: clone,
      parentBar: tab.closest('.rs-tab-bar')
    });
  });

  function updateBottomTabs() {
    const viewportBottom = window.innerHeight;

    clones.forEach(item => {
      const rect = item.parentBar.getBoundingClientRect();
      if (rect.top <= viewportBottom - 30) {
        item.cloneEl.classList.add('is-hidden');
      } else {
        item.cloneEl.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('scroll', updateBottomTabs, { passive: true });
  updateBottomTabs();
}



/* ── SCRIPT COMPARISON SCROLL ─────────────────────────────────
─────────────────────────────────────────────────────────────── */
function initScriptComparisonScroll() {
  const container = document.querySelector('.scroll-container');
  if (!container) return;

  const colRight  = container.querySelector('.comp-col:nth-child(1)');
  const colMiddle = container.querySelector('.comp-col:nth-child(2)');
  const colLeft   = container.querySelector('.comp-col:nth-child(3)');

  function update() {
    const rect = container.getBoundingClientRect();
    const scrolledPx = Math.max(0, -rect.top);
    const vh = window.innerHeight;

    colRight.classList.toggle('is-visible',  scrolledPx >= vh * 0.5);
    colLeft.classList.toggle('is-visible',   scrolledPx >= vh * 1.0);
    colMiddle.classList.toggle('is-visible', scrolledPx >= vh * 1.5);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ── INFINITE CAROUSEL ────────────────────────────────────────── */
function initInfiniteCarousel() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  const numImages = 18;
  const basePath = 'assets/images/digitize-letters/';

  function createSet() {
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= numImages; i++) {
      const item = document.createElement('div');
      item.className = 'marquee-item';

      const base = document.createElement('img');
      base.className = 'img-base';
      base.src = `${basePath}scan-to-font-document${i}.jpg`;
      base.alt = '';

      const hover = document.createElement('img');
      hover.className = 'img-hover';
      hover.src = `${basePath}scan-to-font-document-hover${i}.jpg`;
      hover.alt = '';

      item.appendChild(base);
      item.appendChild(hover);
      frag.appendChild(item);
    }
    return frag;
  }

  track.appendChild(createSet());
  track.appendChild(createSet()); // duplicate for seamless loop

  track.addEventListener('mouseenter', () => {
    track.getAnimations().forEach(anim => anim.playbackRate = 0.25);
  });
  track.addEventListener('mouseleave', () => {
    track.getAnimations().forEach(anim => anim.playbackRate = 1);
  });
}


/* ── INIT ──────────────────────────────────────────────────────
─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollWeight();
  initHeaderWeightScroll();
  initSourcesSection();
  initBottomAccordion();
  initScriptComparisonScroll();
  initInfiniteCarousel();
  /* initSourcesMagnet — removed: CSS scroll-snap handles this */

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }
});
