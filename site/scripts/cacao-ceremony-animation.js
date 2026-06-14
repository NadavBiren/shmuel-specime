function initCacaoCeremonyAnimation(root = document) {
  const section = root.querySelector
    ? root.querySelector("#cacaoCeremonySection")
    : document.querySelector("#cacaoCeremonySection");

  if (!section) return;

  const left = section.querySelector("#cacaoCeremonyLeft");
  const right = section.querySelector("#cacaoCeremonyRight");

  if (!left || !right) return;

  const titleContainer = section.querySelector(".cacao-ceremony-title");
  if (!titleContainer) return;

  const titleSpans = section.querySelectorAll(".cacao-ceremony-title span");
  const locationSpans = section.querySelectorAll(".cacao-ceremony-location span");

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

function updateAnimation() {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  /*
    progress:
    0 = כשראש הסקשן מגיע למרכז המסך
    1 = כשראש הסקשן עבר מרכז המסך לחלוטין
  */
  const startY = viewportHeight * 0.5;
  const progress = clamp((startY - rect.top) / startY, 0, 1);

  const leftX = lerp(-38, 0, progress);
  const rightX = lerp(38, 0, progress);
  const cacaoTitleWeight = Math.round(lerp(500, 900, progress));

  left.style.transform = `translate3d(${leftX}%, 0, 0)`;
  right.style.transform = `translate3d(${rightX}%, 0, 0)`;
  section.style.setProperty("--cacao-title-weight", cacaoTitleWeight);

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
