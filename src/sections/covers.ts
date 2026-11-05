import { qs, qsa } from '../core/dom';
import { prefersReducedMotion } from '../core/motion';
import { gsap, pageY, ScrollTrigger } from '../core/scroll';
import { registerStops } from '../core/stops';
import type { Starfield } from '../effects/starfield';

/**
 * Chapter covers: a giant pixel chapter number acts as a portal.
 * Scrolling scales it toward the camera until we pass through it, with a starfield warp boost.
 */
export const initCovers = (starfield: Starfield): void => {
  const covers = qsa('.cover');

  // The trigger spans [top - 100vh, top + height - 100vh]; stop at 48% where the title is fully legible.
  const LEGIBLE_AT = 0.48;
  registerStops(() =>
    covers.map((cover) => pageY(cover) - window.innerHeight + cover.offsetHeight * LEGIBLE_AT),
  );

  if (prefersReducedMotion()) return;

  for (const cover of covers) {
    const portal = qs('.cover__portal', cover);
    const content = qs('.cover__content', cover);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: cover,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self: ScrollTrigger) => {
            // Warp peaks while the portal engulfs the screen.
            const p = self.progress;
            starfield.setBoost(p > 0.55 ? Math.sin(((p - 0.55) / 0.45) * Math.PI) : 0);
          },
        },
      })
      .fromTo(
        portal,
        { scale: 0.35, opacity: 0 },
        { scale: 1, opacity: 0.16, ease: 'none', duration: 0.35 },
      )
      .fromTo(
        content,
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.2 },
        0.18,
      )
      .to(
        content,
        { opacity: 0, scale: 1.25, filter: 'blur(6px)', ease: 'power2.in', duration: 0.2 },
        0.62,
      )
      .to(portal, { scale: 28, opacity: 0.9, ease: 'power3.in', duration: 0.45 }, 0.55)
      .to(portal, { opacity: 0, duration: 0.08 }, 0.92);
  }
};
