/* Fingers animation component
   docs/scripts/fingers-animation.js
*/

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

// אם ה־component כבר קיים בעמוד בזמן הטעינה, זה יאתחל אותו אוטומטית.
document.addEventListener("DOMContentLoaded", () => {
  initFingersAnimation(document);
});
