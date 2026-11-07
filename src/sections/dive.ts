import { qsa } from '../core/dom';
import { DESKTOP_QUERY, MOBILE_QUERY, prefersReducedMotion } from '../core/motion';
import { gsap, layoutY } from '../core/scroll';
import { registerStops } from '../core/stops';

/**
 * Depth transitions for content slides (`[data-dive]`): each slide rises out of the distance
 * (small, tilted, transparent) and, on desktop, recedes past the camera as you leave.
 * No CSS `filter` here on purpose: animating blur on full-viewport slides is the most
 * expensive thing a scroll site can do.
 * `[data-reveal]` items fade up in a stagger, grouped by their parent element.
 */
export const initDive = (): void => {
  const slides = qsa('[data-dive]');
  registerStops(() => slides.map((el) => layoutY(el) - 72));

  if (prefersReducedMotion()) return;

  const mm = gsap.matchMedia();

  mm.add(DESKTOP_QUERY, () => {
    for (const slide of slides) {
      // Origin at the top edge: `top`-based trigger positions stay exact while the slide is scaled.
      gsap.set(slide, { transformOrigin: '50% 0%', transformPerspective: 1200 });

      gsap.fromTo(
        slide,
        { opacity: 0, scale: 0.9, y: 40, rotateX: 6 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: slide, start: 'top 95%', end: 'top 45%', scrub: true },
        },
      );

      // Explicit from-values + no immediate render: the exit must never inherit the entry's
      // initial (invisible) state, which previously made slides snap from opacity 1 to 0.
      // The start uses the layout height (offsetHeight ignores transforms) instead of `bottom`.
      gsap.fromTo(
        slide,
        { opacity: 1, scale: 1 },
        {
          opacity: 0.15,
          scale: 1.04,
          ease: 'power1.in',
          immediateRender: false,
          scrollTrigger: {
            trigger: slide,
            start: () => `top+=${slide.offsetHeight} 40%`,
            end: () => `top+=${slide.offsetHeight} top`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
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
