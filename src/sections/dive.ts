import { qsa } from '../core/dom';
import { DESKTOP_QUERY, MOBILE_QUERY, prefersReducedMotion } from '../core/motion';
import { gsap, layoutY } from '../core/scroll';
import { registerStops } from '../core/stops';

/**
 * Depth transitions for content slides (`[data-dive]`): each slide rises out of the distance
 * (small, blurred, transparent) and, on desktop, recedes past the camera as you leave.
 * `[data-reveal]` items fade up in a stagger, grouped by their parent element.
 */
export const initDive = (): void => {
  const slides = qsa('[data-dive]');
  registerStops(() => slides.map((el) => layoutY(el) - 72));

  if (prefersReducedMotion()) return;

  const mm = gsap.matchMedia();

  mm.add(DESKTOP_QUERY, () => {
    for (const slide of slides) {
      gsap.fromTo(
        slide,
        { opacity: 0, scale: 0.86, filter: 'blur(10px)', transformPerspective: 1200, rotateX: 6 },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          rotateX: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: slide, start: 'top 95%', end: 'top 45%', scrub: true },
        },
      );
      gsap.to(slide, {
        opacity: 0.15,
        scale: 1.06,
        filter: 'blur(4px)',
        ease: 'power1.in',
        scrollTrigger: { trigger: slide, start: 'bottom 40%', end: 'bottom top', scrub: true },
      });
    }
  });

  mm.add(MOBILE_QUERY, () => {
    for (const slide of slides) {
      gsap.from(slide, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: slide, start: 'top 85%', once: true },
      });
    }
  });

  for (const group of new Set(qsa('[data-reveal]').map((el) => el.parentElement))) {
    if (!group) continue;
    gsap.from(qsa(':scope > [data-reveal]', group), {
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
    });
  }
};
