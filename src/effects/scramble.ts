const GLYPHS = '01<>/{}[]#*+=_-%$@&';

/**
 * Decodes a heading from random glyphs into its real text — a small “digital” flourish.
 * Accessibility: the real text is exposed via aria-label for the whole animation.
 */
export const scramble = (el: HTMLElement, duration = 700): void => {
  const finalText = el.dataset.text ?? el.textContent;
  el.dataset.text = finalText;
  el.setAttribute('aria-label', finalText);

  const start = performance.now();
  const frame = (now: number): void => {
    const progress = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(progress * finalText.length);
    let out = finalText.slice(0, revealed);
    for (let i = revealed; i < finalText.length; i++) {
      const ch = finalText.charAt(i);
      out += ch === ' ' ? ' ' : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
    }
    el.textContent = out;
    if (progress < 1) requestAnimationFrame(frame);
    else el.removeAttribute('aria-label');
  };
  requestAnimationFrame(frame);
};

/** Scramble every `[data-scramble]` heading the first time it scrolls into view. */
export const initScramble = (): void => {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        scramble(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    io.observe(el);
  });
};
