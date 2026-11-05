import { clamp, qs, qsa } from '../core/dom';
import { DESKTOP_QUERY, prefersReducedMotion } from '../core/motion';
import { gsap, pageY, scrollToY, ScrollTrigger } from '../core/scroll';
import { registerStops } from '../core/stops';

export interface HScroll {
  section: HTMLElement;
  panels: HTMLElement[];
  /** Page Y at which `panel` is aligned to the left edge (or its top on mobile). */
  scrollYFor: (panel: HTMLElement) => number;
  /** Fires with the index of the panel closest to the viewport centre. */
  onActive: (fn: (index: number) => void) => void;
}

/**
 * Vertical scroll → horizontal travel (the Jailhouse Lawyers timeline mechanic).
 * The section is pinned and its track translated by exactly its overflow width.
 * Below the desktop breakpoint (or with reduced motion) the panels simply stack vertically.
 */
export const createHScroll = (section: HTMLElement): HScroll => {
  const track = qs('.hscroll__track', section);
  const panels = qsa('[data-panel]', track);
  const listeners: ((index: number) => void)[] = [];
  let tween: gsap.core.Tween | null = null;
  let active = -1;

  const overflow = (): number => Math.max(0, track.scrollWidth - window.innerWidth);

  const setActive = (index: number): void => {
    if (index === active) return;
    active = index;
    listeners.forEach((fn) => {
      fn(index);
    });
  };

  const horizontal = (): boolean => tween !== null;

  const scrollYFor = (panel: HTMLElement): number => {
    const st = tween?.scrollTrigger;
    if (!st || !horizontal()) return pageY(panel) - 64;
    // Centre the panel in the viewport, clamped to the track's travel range.
    const distance = overflow();
    const x = clamp(panel.offsetLeft + panel.offsetWidth / 2 - window.innerWidth / 2, 0, distance);
    const ratio = distance === 0 ? 0 : x / distance;
    return st.start + ratio * (st.end - st.start);
  };

  const mm = gsap.matchMedia();
  mm.add(DESKTOP_QUERY, () => {
    if (prefersReducedMotion()) return;
    section.classList.add('is-horizontal');

    tween = gsap.to(track, {
      x: () => -overflow(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.6,
        start: 'top top',
        end: () => `+=${overflow()}`,
        invalidateOnRefresh: true,
        onUpdate: (self: ScrollTrigger) => {
          const centre = self.progress * overflow() + window.innerWidth / 2;
          const index = panels.findIndex((p) => p.offsetLeft + p.offsetWidth > centre);
          setActive(index === -1 ? panels.length - 1 : index);
        },
      },
    });

    // Per-panel parallax: images drift against the travel direction.
    const containerAnimation = tween;
    for (const fig of qsa('[data-parallax] img', track)) {
      gsap.fromTo(
        fig,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: fig,
            containerAnimation,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        },
      );
    }

    return () => {
      section.classList.remove('is-horizontal');
      tween = null;
    };
  });

  // Mobile / reduced motion: track active panel by intersection.
  const io = new IntersectionObserver(
    (entries) => {
      if (horizontal()) return;
      const visible = entries.filter((e) => e.isIntersecting);
      const last = visible.at(-1);
      if (last) setActive(panels.indexOf(last.target as HTMLElement));
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  panels.forEach((p) => {
    io.observe(p);
  });

  registerStops(() => panels.map(scrollYFor));

  // Fixed chrome (header, rail) switches to dark ink while a light panel fills the screen.
  let inView = false;
  const syncSurface = (): void => {
    const panel = panels[active];
    const light = inView && panel?.matches('.panel--paper, .panel--sage, .panel--green') === true;
    if (light) document.body.dataset.surface = 'light';
    else delete document.body.dataset.surface;
  };
  listeners.push(syncSurface);
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => {
      inView = self.isActive;
      syncSurface();
    },
  });

  return {
    section,
    panels,
    scrollYFor,
    onActive: (fn) => {
      listeners.push(fn);
    },
  };
};

/** Timeline-specific chrome: bottom year navigation with a sliding dot. */
export const initTimelineNav = (hs: HScroll): void => {
  const nav = qs('.timeline__nav', hs.section);
  const scroller = qs('.timeline__nav-scroller', nav);
  const links = qsa<HTMLAnchorElement>('[data-panel-link]', nav);
  const dot = qs('.timeline__nav-dot', nav);

  hs.onActive((index) => {
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const link = links[index];
    if (!link) return;
    // Keep the active year centred when the list overflows (small laptops).
    scroller.scrollTo({ left: link.offsetLeft - scroller.clientWidth / 2, behavior: 'smooth' });
    gsap.to(dot, {
      x: link.offsetLeft + link.offsetWidth / 2,
      duration: 0.5,
      ease: 'power3.out',
    });
  });

  nav.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-panel-link]');
    if (!link) return;
    event.preventDefault();
    const panel = hs.panels.find((p) => p.id === link.dataset.panelLink);
    if (panel) scrollToY(hs.scrollYFor(panel));
  });
};
