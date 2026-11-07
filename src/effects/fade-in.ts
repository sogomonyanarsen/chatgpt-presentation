import { prefersReducedMotion } from '../core/motion';

/**
 * Headings marked `[data-fade-in]` fade in the first time they enter the viewport.
 * Pure CSS transition driven by one class; the text itself never changes.
 * Without JS or with reduced motion the headings are simply visible (see _ui.scss).
 */
export const initFadeIn = (): void => {
  const headings = document.querySelectorAll('[data-fade-in]');
  if (prefersReducedMotion()) {
    headings.forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        entry.target.classList.add('is-visible');
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  headings.forEach((el) => {
    io.observe(el);
  });
};
