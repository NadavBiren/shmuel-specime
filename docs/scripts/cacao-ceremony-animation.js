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
