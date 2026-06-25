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

  // mousemove → clip-path wipe: right half = scan, left half = font
  // splitPct = percentage from left edge (0 = scan fills all, 100 = font fills all, 50 = equal split)
  let splitPct = 50;
  let leaveRAF = null;

  function applyClip(slide, pct) {
    const scanEl = slide.querySelector('.source-slide__scan');
    const fontEl = slide.querySelector('.source-slide__font');
    if (scanEl) scanEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    if (fontEl) fontEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }

  viewer.addEventListener('mousemove', e => {
    if (leaveRAF) { cancelAnimationFrame(leaveRAF); leaveRAF = null; }
    const rect = viewer.getBoundingClientRect();
    splitPct = (e.clientX - rect.left) / rect.width * 100;
    const slide = getSlide(activeId);
    if (!slide) return;
    applyClip(slide, splitPct);
    if (line) line.style.left = (e.clientX - rect.left) + 'px';
  });

  viewer.addEventListener('mouseleave', () => {
    const slide = getSlide(activeId);
    if (!slide) return;
    const rect = viewer.getBoundingClientRect();
    const startSplit = splitPct;
    const lineStartPx = line ? parseFloat(line.style.left) || rect.width / 2 : 0;
    const lineTargetPx = rect.width / 2;
    const duration = 300;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const ease = p * (2 - p); // ease-out quad
      splitPct = startSplit + (50 - startSplit) * ease;
      applyClip(slide, splitPct);
      if (line) line.style.left = (lineStartPx + (lineTargetPx - lineStartPx) * ease) + 'px';
      if (p < 1) { leaveRAF = requestAnimationFrame(step); }
      else {
        splitPct = 50;
        const scanEl = slide.querySelector('.source-slide__scan');
        const fontEl = slide.querySelector('.source-slide__font');
        if (scanEl) scanEl.style.clipPath = '';
        if (fontEl) fontEl.style.clipPath = '';
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

  const originalTabs = document.querySelectorAll('.rs-tab-bar .rs-tab:not(.rs-tab-00)');
  const clones = [];

  originalTabs.forEach((tab, index) => {
    if (index === 0) return; // skip rs-tab-0 (section 0 visible right after hero)

    const clone = tab.cloneNode(true);
    clone.onclick = tab.onclick;
    bottomRail.appendChild(clone);

    // Flat layout: track the section the tab represents, not the shared tab bar
    const idxMatch = Array.from(tab.classList).find(c => /^rs-tab-\d+$/.test(c));
    const sectionIdx = idxMatch ? idxMatch.replace('rs-tab-', '') : null;
    const section = sectionIdx != null
      ? document.querySelector(`.rs-section[data-idx="${sectionIdx}"]`)
      : null;

    clones.push({ cloneEl: clone, section });
  });

  function updateBottomTabs() {
    const viewportBottom = window.innerHeight;

    clones.forEach(item => {
      if (!item.section) return;
      const rect = item.section.getBoundingClientRect();
      // Hide bottom clone once its section enters (or passes) the viewport
      item.cloneEl.classList.toggle('is-hidden', rect.top <= viewportBottom);
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

  const STEP_DELAY = 750;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();

      colRight.classList.add('is-visible');
      setTimeout(() => colLeft.classList.add('is-visible'), STEP_DELAY);
      setTimeout(() => colMiddle.classList.add('is-visible'), STEP_DELAY * 2);
    });
  }, { threshold: 0.3 });

  observer.observe(container);
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

  // Click-and-drag scrubbing — coexists with the CSS auto-scroll animation
  // by manipulating its currentTime via the Web Animations API.
  const wrapper = track.closest('.carousel-wrapper');
  let isDragging = false;
  let startX = 0;
  let startTime = 0;

  wrapper.addEventListener('pointerdown', (e) => {
    const anim = track.getAnimations()[0];
    if (!anim) return;
    isDragging = true;
    startX = e.clientX;
    startTime = anim.currentTime;
    wrapper.classList.add('is-dragging');
    anim.pause();
    wrapper.setPointerCapture(e.pointerId);
  });

  wrapper.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const anim = track.getAnimations()[0];
    if (!anim) return;
    const deltaX = e.clientX - startX;
    const trackHalfWidth = track.scrollWidth / 2;
    const durationMs = 60000;
    let newTime = startTime - (deltaX / trackHalfWidth) * durationMs;
    newTime = ((newTime % durationMs) + durationMs) % durationMs;
    anim.currentTime = newTime;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-dragging');
    const anim = track.getAnimations()[0];
    if (anim) anim.play();
  }
  wrapper.addEventListener('pointerup', endDrag);
  wrapper.addEventListener('pointercancel', endDrag);

  const durationMs = 60000;
  const carouselNextBtn = wrapper.querySelector('.carousel-btn-next');
  const carouselPrevBtn = wrapper.querySelector('.carousel-btn-prev');

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      const anim = track.getAnimations()[0];
      if (!anim) return;
      anim.currentTime = ((anim.currentTime + 5000) % durationMs + durationMs) % durationMs;
    });
    carouselNextBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      const anim = track.getAnimations()[0];
      if (!anim) return;
      anim.currentTime = ((anim.currentTime - 5000) % durationMs + durationMs) % durationMs;
    });
    carouselPrevBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
}


/* ── SKETCH SEQUENCE ───────────────────────────────────────────
   Mousemove over #sketch-sequence cycles through 13 font-version
   images, updating the scrubber thumb and version label.
─────────────────────────────────────────────────────────────── */
function initSketchSequence() {
  const module = document.getElementById('sketch-sequence');
  if (!module) return;

  const wrapper = module.querySelector('.sketch-seq__img-wrapper');
  const thumb = document.getElementById('sketch-seq-thumb');
  const label = document.getElementById('sketch-seq-label');
  const BASE = 'assets/images/03-sketching/compering-ver/font-ver';
  const TOTAL = 12;

  const imgs = [];
  for (let i = 1; i <= TOTAL; i++) {
    const el = document.createElement('img');
    el.src = `${BASE}${i}.jpg`;
    el.alt = `סקיצה של הפונט — גירסה ${i}`;
    el.className = 'sketch-seq__img';
    if (i === 1) el.classList.add('is-active');
    wrapper.appendChild(el);
    imgs.push(el);
  }

  let prevIndex = 0;

  module.addEventListener('mousemove', (e) => {
    const rect = module.getBoundingClientRect();
    let normX = 1 - ((e.clientX - rect.left) / rect.width);
    normX = Math.max(0, Math.min(1, normX));
    const frameIndex = Math.floor(normX * 11.99);

    if (frameIndex === prevIndex) return;

    imgs.forEach((img, i) => {
      img.classList.remove('is-active', 'is-prev');
      if (i === frameIndex) img.classList.add('is-active');
      else if (i === prevIndex) img.classList.add('is-prev');
    });

    prevIndex = frameIndex;
    thumb.style.right = `${(frameIndex / 11) * 100}%`;

    const versionText = frameIndex === 11 ? 'סופי' : 'v.0' + String(frameIndex + 1).padStart(2, '0');
    label.innerHTML = `גירסה: <span dir="ltr">${versionText}</span>`;
  });
}


/* ── STICKY TABS BREADCRUMB — single active tab tracks scroll ────
   Observes .rs-section elements. As the user scrolls and a section
   becomes the primary reading area (top 35% of viewport), its
   corresponding .rs-tab gets .is-active; all others revert to grey.
─────────────────────────────────────────────────────────────── */
function initStickyTabsBreadcrumbs() {
  const sections = Array.from(document.querySelectorAll('.rs-section'));
  const tabs = document.querySelectorAll('.rs-tab-bar .rs-tab:not(.rs-tab-00)');
  if (!sections.length || !tabs.length) return;

  function setActiveTab(idx) {
    document.querySelectorAll('.rs-tab').forEach(t => t.classList.remove('is-active'));
    document.querySelectorAll(`.rs-tab-${idx}`).forEach(t => {
      t.classList.add('is-active');
      t.classList.add('is-stuck'); // accumulates — never removed; height controlled by is-stuck
    });
    if (window._setGlobalActiveColor) window._setGlobalActiveColor(Number(idx));
  }

  const visibleSections = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleSections.add(entry.target);
      } else {
        visibleSections.delete(entry.target);
      }
    });

    for (const section of sections) {
      if (visibleSections.has(section)) {
        setActiveTab(section.dataset.idx);
        break;
      }
    }
  }, {
    rootMargin: '-30px 0px -80% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
  if (sections.length) setActiveTab(sections[0].dataset.idx);
}


/* ── STICKY TAB COLOR ──────────────────────────────────────────
   Flat layout: all 6 tabs live in one .rs-tab-bar.
   No per-tab sentinels needed — breadcrumbs set the active tab.
   Only responsibility: expose _setGlobalActiveColor for the
   breadcrumbs function to call and set --global-active-color.
─────────────────────────────────────────────────────────────── */
function initStickyTabShrink() {
  const SECTION_COLORS = {
    '0': 'var(--color-orange)',
    '1': 'var(--color-green)',
    '2': 'var(--color-pink)',
    '3': 'var(--color-yellow)',
    '4': 'var(--color-white)',
  };

  window._setGlobalActiveColor = function(idx) {
    const color = (idx >= 0 && SECTION_COLORS[String(idx)])
      ? SECTION_COLORS[String(idx)]
      : 'var(--color-grey)';
    document.body.style.setProperty('--global-active-color', color);
  };

  window._setGlobalActiveColor(-1); // grey until first section fires
}


/* ── INIT ──────────────────────────────────────────────────────
─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollWeight();
  initHeaderWeightScroll();
  initStickyTabShrink();       // must run first — exposes _setGlobalActiveColor
  initStickyTabsBreadcrumbs(); // uses _setGlobalActiveColor on each setActiveTab call

  const tab00 = document.getElementById('rs-tab-00');
  if (tab00) {
    tab00.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  initSourcesSection();
  initBottomAccordion();
  initScriptComparisonScroll();
  initInfiniteCarousel();
  initSketchSequence();
  /* initSourcesMagnet — removed: CSS scroll-snap handles this */

  const heroEl = document.getElementById('heroWebglMount');
  const updateRailVisibility = () => {
    document.body.classList.toggle('is-past-hero',
      heroEl ? window.scrollY >= heroEl.offsetHeight - 10 : false);
  };
  window.addEventListener('scroll', updateRailVisibility, { passive: true });
  updateRailVisibility();

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });

    const updateThemeBtnVisibility = () => {
      const pastHero = !heroEl || window.scrollY >= heroEl.offsetHeight - 10;
      themeBtn.classList.toggle('is-visible', pastHero);
    };
    window.addEventListener('scroll', updateThemeBtnVisibility, { passive: true });
    updateThemeBtnVisibility();
  }
});
