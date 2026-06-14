/* ══════════════════════════════════════════════════════════════
   SHMUEL — Canvas 2D Hero
   Three-layer reveal via mouse-driven circle clips.

   Layer order (back → front):
     1. texture1_scan.jpg     — base, always visible
     2. texture2_calligraphy  — revealed inside ECHO circles
     3. texture3_vector.png   — revealed inside MAIN circle

   Interaction model:
     • Main circle: tight lerp toward mouse — the leader
     • Echo chain: echo[0] → main, echo[1] → echo[0], echo[2] → echo[1]
       progressively slower lerp creates a cascading trail
     • Echo scale: 1.0× when close to main (hidden), up to 1.3× when far
       each echo scales independently based on its own dist to main
     • All circles: crisp clip, no blur, orange stroke border
══════════════════════════════════════════════════════════════ */

window.initHeroWebGL = function (mountContainer) {

  /* ── ① PARAMETERS — tune freely ─────────────────────────────── */
  const CONFIG = {

    BG_COLOR: '#c0c0c0',

    STROKE_COLOR: '#FF5E00',
    STROKE_WIDTH: 1.5,

    MAIN_RADIUS: 120,
    MAIN_LERP:   0.1,

    /* Echo circles:
       • lerp: base speed when far from target
       • proximitySpeed: acceleration boost as it closes in (0 = none, 1 = instant snap)
       • scaleMax: max scale multiplier when trailing far */
    ECHOES: [
      { lerp: 0.05,  proximitySpeed: 0.2, scaleMax: 1.35 },
      { lerp: 0.075, proximitySpeed: 0.4, scaleMax: 1.40 },
      { lerp: 0.1,   proximitySpeed: 0.6, scaleMax: 1.5  },
    ],

    ECHO_DIST_MAX:   160,
    ECHO_SCALE_LERP: 0.08,

    PATHS: {
      scan:         'assets/images/hero/texture1_scan.jpg',
      calligraphyA: 'assets/images/hero/texture2_calligraphy-a.jpg',
      calligraphyB: 'assets/images/hero/texture2_calligraphy-b.jpg',
      calligraphyC: 'assets/images/hero/texture2_calligraphy-c.jpg',
      vector:       'assets/images/hero/texture3_vector.jpg',
    },
  };


  /* ── ② IMAGE LOADING ─────────────────────────────────────────── */

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });
  }

  async function loadAllTextures() {
    const [scan, calligraphyA, calligraphyB, calligraphyC, vector] = await Promise.all([
      loadImage(CONFIG.PATHS.scan),
      loadImage(CONFIG.PATHS.calligraphyA),
      loadImage(CONFIG.PATHS.calligraphyB),
      loadImage(CONFIG.PATHS.calligraphyC),
      loadImage(CONFIG.PATHS.vector),
    ]);
    return { scan, calligraphyA, calligraphyB, calligraphyC, vector };
  }


  /* ── ③ DRAW HELPERS ──────────────────────────────────────────── */

  function containRect(imgW, imgH, canvasW, canvasH) {
    const scale = Math.min(canvasW / imgW, canvasH / imgH);
    const dw = imgW * scale;
    const dh = imgH * scale;
    const dx = (canvasW - dw) / 2;
    const dy = (canvasH - dh) / 2;
    return { dx, dy, dw, dh };
  }

  function drawContain(ctx, img, canvasW, canvasH) {
    const { dx, dy, dw, dh } = containRect(img.naturalWidth, img.naturalHeight, canvasW, canvasH);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawCircleReveal(ctx, img, cx, cy, radius, canvasW, canvasH) {
    if (!img) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = CONFIG.BG_COLOR;
    ctx.fill();

    ctx.globalCompositeOperation = 'multiply';
    drawContain(ctx, img, canvasW, canvasH);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = CONFIG.STROKE_COLOR;
    ctx.lineWidth   = CONFIG.STROKE_WIDTH;
    ctx.stroke();
    ctx.restore();
  }


  /* ── ④ HERO CLASS ────────────────────────────────────────────── */

  class Hero2D {

    constructor(canvas) {
      this.canvas = canvas;
      this.ctx    = canvas.getContext('2d');

      const initX = window.innerWidth  / 2;
      const initY = window.innerHeight / 2;

      this.mouse  = { x: initX, y: initY };
      this.main   = { x: initX, y: initY };
      this.echoes = CONFIG.ECHOES.map(() => ({ x: initX, y: initY, scaleMult: 1.0 }));

      this.textures = null;
      this.rafId    = null;
      this._visible = true;
      this._observer = null;

      this._onMouseMove = this._onMouseMove.bind(this);
      this._onResize    = this._onResize.bind(this);
    }

    async init() {
      this.resize();
      this.textures = await loadAllTextures();

      document.addEventListener('mousemove', this._onMouseMove, { passive: true });
      window.addEventListener('resize',     this._onResize,    { passive: true });

      this._setupVisibilityObserver();
      this.rafId = requestAnimationFrame(ts => this._frame(ts));
    }

    _setupVisibilityObserver() {
      this._observer = new IntersectionObserver(entries => {
        const { isIntersecting } = entries[0];
        this._visible = isIntersecting;
        if (isIntersecting && !this.rafId) {
          this.rafId = requestAnimationFrame(ts => this._frame(ts));
        } else if (!isIntersecting && this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }, { threshold: 0 });

      this._observer.observe(this.canvas);
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w   = this.canvas.offsetWidth;
      const h   = this.canvas.offsetHeight;
      this.canvas.width  = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.scale(dpr, dpr);
      this.dpr = dpr;
    }

    _onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }

    _onResize() {
      this.resize();
    }

    static lerp(a, b, t) {
      return a + (b - a) * t;
    }

    _frame(ts = 0) {
      if (!this._visible) {
        this.rafId = null;
        return;
      }
      this.rafId = requestAnimationFrame(ts => this._frame(ts));

      if (!this.textures) return;

      const { ctx, mouse, main, echoes } = this;
      const { scan, calligraphyA, calligraphyB, calligraphyC, vector } = this.textures;
      const echoTextures = [calligraphyC, calligraphyB, calligraphyA];
      const L = Hero2D.lerp;

      main.x = L(main.x, mouse.x, CONFIG.MAIN_LERP);
      main.y = L(main.y, mouse.y, CONFIG.MAIN_LERP);

      const breathScale = 1.05 + 0.05 * Math.sin(ts * 0.00075);

      for (let i = 0; i < echoes.length; i++) {
        const target = i === 0 ? main : echoes[i - 1];

        let lerpFactor = CONFIG.ECHOES[i].lerp;

        const distToTarget   = Math.hypot(target.x - echoes[i].x, target.y - echoes[i].y);
        const proximityFactor = Math.min(1, distToTarget / CONFIG.ECHO_DIST_MAX);
        const speedBoost     = CONFIG.ECHOES[i].proximitySpeed;
        lerpFactor *= (1 - speedBoost) + (speedBoost * proximityFactor);

        echoes[i].x = L(echoes[i].x, target.x, lerpFactor);
        echoes[i].y = L(echoes[i].y, target.y, lerpFactor);

        const distToMain  = Math.hypot(main.x - echoes[i].x, main.y - echoes[i].y);
        const scaleFactor = Math.min(1, distToMain / CONFIG.ECHO_DIST_MAX);
        const targetScale = breathScale + (CONFIG.ECHOES[i].scaleMax - breathScale) * scaleFactor;
        echoes[i].scaleMult = L(echoes[i].scaleMult, targetScale, CONFIG.ECHO_SCALE_LERP);
      }

      const cw = this.canvas.width  / this.dpr;
      const ch = this.canvas.height / this.dpr;

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = CONFIG.BG_COLOR;
      ctx.fillRect(0, 0, cw, ch);

      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      drawContain(ctx, scan, cw, ch);
      ctx.restore();

      for (let i = echoes.length - 1; i >= 0; i--) {
        drawCircleReveal(
          ctx,
          echoTextures[i],
          echoes[i].x,
          echoes[i].y,
          CONFIG.MAIN_RADIUS * echoes[i].scaleMult,
          cw, ch
        );
      }

      drawCircleReveal(ctx, vector, main.x, main.y, CONFIG.MAIN_RADIUS, cw, ch);
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this._observer) this._observer.disconnect();
      document.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('resize', this._onResize);
    }
  }


  /* ── ⑤ BOOTSTRAP ─────────────────────────────────────────────── */
  const canvas = mountContainer.querySelector('#hero-canvas');
  if (!canvas) return;

  const hero = new Hero2D(canvas);
  hero.init().catch(err => {
    console.warn('[Hero2D] Texture load failed:', err.message);
  });

}; // end initHeroWebGL
