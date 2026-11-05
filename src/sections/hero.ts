import { qs } from '../core/dom';
import { prefersReducedMotion } from '../core/motion';
import { gsap, pageY, ScrollTrigger } from '../core/scroll';
import { registerStops } from '../core/stops';
import { PixelTitle } from '../effects/pixel-title';
import type { Starfield } from '../effects/starfield';

const FONT = '"Silkscreen"';

/**
 * Hero “dive”: the pixel word assembles, then scrolling flies the camera through it
 * while the manifesto line fades in from the depth behind — the Fantik-style entry.
 */
export const initHero = async (starfield: Starfield): Promise<void> => {
  const hero = qs('.hero');
  const canvas = qs<HTMLCanvasElement>('.hero__pixels', hero);
  const anchor = qs('.hero__title-text', hero);
  const reduced = prefersReducedMotion();

  // Second stop parks on the manifesto (≈78% through the pinned range).
  registerStops(() => [0, pageY(hero) + (hero.offsetHeight - window.innerHeight) * 0.78]);

  await document.fonts.load(`100px ${FONT}`);
  const title = new PixelTitle(canvas, { text: 'ChatGPT', font: FONT, anchor }, !reduced);
  hero.classList.add('is-canvas-ready');

  if (reduced) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self: ScrollTrigger) => {
        title.setProgress(self.progress / 0.7);
        starfield.setBoost(Math.sin(Math.min(1, self.progress / 0.7) * Math.PI) * 0.6);
      },
    },
  });

  timeline
    .to(
      '.hero__content',
      { opacity: 0, scale: 1.4, filter: 'blur(6px)', ease: 'power2.in', duration: 0.3 },
      0,
    )
    .to('.hero__scroll', { opacity: 0, duration: 0.1 }, 0)
    .fromTo(
      '.hero__manifesto',
      { opacity: 0, scale: 0.6, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.35 },
      0.55,
    )
    .to(
      '.hero__manifesto',
      { opacity: 0, scale: 1.6, filter: 'blur(8px)', ease: 'power2.in', duration: 0.2 },
      1.05,
    );
};
