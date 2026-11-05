import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

type VelocityListener = (velocity: number) => void;

let lenis: Lenis | null = null;
const velocityListeners = new Set<VelocityListener>();

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger and Lenis share one RAF loop.
 * Under reduced motion we keep native scrolling and skip Lenis entirely.
 */
export const initScroll = (): void => {
  if (prefersReducedMotion()) return;

  lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 0.9 });
  lenis.on('scroll', (instance: Lenis) => {
    ScrollTrigger.update();
    velocityListeners.forEach((fn) => {
      fn(instance.velocity);
    });
  });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
};

export const onScrollVelocity = (fn: VelocityListener): void => {
  velocityListeners.add(fn);
};

/** Scroll to an absolute Y position or element, smoothly when allowed. */
export const scrollToY = (y: number, immediate = false): void => {
  if (lenis && !immediate) {
    lenis.scrollTo(y, { duration: 1.4 });
    return;
  }
  // Instant jumps go native; Lenis re-syncs from the resulting scroll event.
  window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'instant' : 'smooth' });
};

/** Where the page is heading (Lenis target while animating), so rapid key presses chain correctly. */
export const scrollTarget = (): number => lenis?.targetScroll ?? window.scrollY;

export const pageY = (el: Element): number => el.getBoundingClientRect().top + window.scrollY;

/** Document Y of an element's layout box, ignoring CSS transforms (e.g. a slide mid-“dive”). */
export const layoutY = (el: HTMLElement): number => {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    y += node.offsetTop;
  }
  return y;
};

export const stopScroll = (stopped: boolean): void => {
  if (!lenis) return;
  if (stopped) lenis.stop();
  else lenis.start();
};

export { gsap, ScrollTrigger };
