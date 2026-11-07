import { clamp, qs, qsa } from '../core/dom';
import { DESKTOP_QUERY, prefersReducedMotion } from '../core/motion';
import { gsap, isSmoothScrolling, pageY, scrollToY, ScrollTrigger } from '../core/scroll';
import { registerStops } from '../core/stops';

export interface HScroll {
  section: HTMLElement;
  panels: HTMLElement[];
  /** Page Y at which `panel` is centred in the viewport (or its top on mobile). */
  scrollYFor: (panel: HTMLElement) => number;
  /** Fires with the index of the panel closest to the viewport centre. */
  onActive: (fn: (index: number) => void) => void;
}

/** Panel themes with light backgrounds: fixed chrome must switch to dark ink over them. */
const LIGHT_PANELS = '.panel--paper, .panel--sage, .panel--green';

/** Header regions whose ink is resolved independently (brand left, chapter centre, menu + rail right). */
const REGIONS = ['left', 'center', 'right'] as const;
type Region = (typeof REGIONS)[number];

const SURFACE_ATTR: Record<Region, string> = {
  left: 'data-surface-left',
  center: 'data-surface-center',
  right: 'data-surface-right',
};

const setSurface = (region: Region, light: boolean): void => {
  document.body.toggleAttribute(SURFACE_ATTR[region], false);
  if (light) document.body.setAttribute(SURFACE_ATTR[region], 'light');
};

const clearSurfaces = (): void => {
  REGIONS.forEach((region) => {
    setSurface(region, false);
  });
};

/** Layout width without the scrollbar — what the pinned track actually spans. */
const viewportWidth = (): number => document.documentElement.clientWidth;

/**
 * Vertical scroll → horizontal travel (the Jailhouse Lawyers timeline mechanic).
 * The section is pinned and its track translated by exactly its overflow width.
 * Below the desktop breakpoint (or with reduced motion) the panels simply stack vertically.
 */
export interface HScrollOptions {
  /** Called while pinned with whether an opaque panel fully covers the starfield backdrop. */
  onBackdropHidden?: (hidden: boolean) => void;
}

export const createHScroll = (section: HTMLElement, options: HScrollOptions = {}): HScroll => {
  const track = qs('.hscroll__track', section);
  const panels = qsa('[data-panel]', track);
  const listeners: ((index: number) => void)[] = [];
  const isLight = panels.map((p) => p.matches(LIGHT_PANELS));
  const isOpaque = panels.map((p) => !p.matches('.panel--void, .trend'));
  let tween: gsap.core.Tween | null = null;
  let active = -1;

  // Layout is measured once per ScrollTrigger refresh, never inside scroll callbacks.
  let overflow = 0;
  let edges: { left: number; right: number }[] = [];
  const measure = (): void => {
    overflow = Math.max(0, track.scrollWidth - viewportWidth());
    edges = panels.map((p) => ({ left: p.offsetLeft, right: p.offsetLeft + p.offsetWidth }));
  };
  measure();

  const panelAt = (trackX: number): number => {
    const index = edges.findIndex((e) => e.right > trackX);
    return index === -1 ? panels.length - 1 : index;
  };

  const setActive = (index: number): void => {
    if (index === active) return;
    active = index;
    listeners.forEach((fn) => {
      fn(index);
    });
  };

  /** Resolve active panel + per-region chrome ink for a given pin progress. */
  const sync = (self: ScrollTrigger): void => {
    const offset = self.progress * overflow;
    const vw = viewportWidth();
    setActive(panelAt(offset + vw / 2));
    // Inclusive range: at exactly `start` (e.g. a #y2017 deep link) ScrollTrigger reports inactive.
    const y = window.scrollY;
    const pinned = y >= self.start - 1 && y <= self.end + 1;
    // Opaque panels hide the starfield entirely, so let it stop drawing.
    options.onBackdropHidden?.(
      pinned && isOpaque[panelAt(offset)] === true && isOpaque[panelAt(offset + vw)] === true,
    );
    if (!pinned) {
      clearSurfaces();
      return;
    }
    const gutter = 40;
    const points: Record<Region, number> = { left: gutter, center: vw / 2, right: vw - gutter };
    REGIONS.forEach((region) => {
      setSurface(region, isLight[panelAt(offset + points[region])] === true);
    });
  };

  const scrollYFor = (panel: HTMLElement): number => {
    const st = tween?.scrollTrigger;
    if (!st) return pageY(panel) - 64;
    const index = panels.indexOf(panel);
    const edge = edges[index] ?? { left: panel.offsetLeft, right: panel.offsetLeft };
    // Centre the panel in the viewport, clamped to the track's travel range.
    const x = clamp((edge.left + edge.right) / 2 - viewportWidth() / 2, 0, overflow);
    const ratio = overflow === 0 ? 0 : x / overflow;
    // Stay 1px inside the pin range so its callbacks fire even for the first/last panel.
    return clamp(st.start + ratio * (st.end - st.start), st.start + 1, st.end - 1);
  };

  const mm = gsap.matchMedia();
  mm.add(DESKTOP_QUERY, () => {
    if (prefersReducedMotion()) return;
    section.classList.add('is-horizontal');
    measure();

    tween = gsap.to(track, {
      x: () => -overflow,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        // Pins change the layout below them, so they must be measured before other triggers.
        refreshPriority: 1,
        // Lenis already smooths the scroll; extra scrub lag would make stops overshoot.
        scrub: isSmoothScrolling() ? true : 0.4,
        start: 'top top',
        end: () => `+=${overflow}`,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: sync,
        onUpdate: sync,
        onToggle: sync,
      },
    });

    // Per-panel parallax: images drift against the travel direction.
    const containerAnimation = tween;
    for (const img of qsa('[data-parallax] img', track)) {
      gsap.fromTo(
        img,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            containerAnimation,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        },
      );
    }

    // Keyboard users tabbing into an off-screen panel: scroll the pin there instead of
    // letting the browser scroll the clipped section sideways (which would desync the track).
    const onFocus = (event: FocusEvent): void => {
      const panel = (event.target as Element).closest<HTMLElement>('[data-panel]');
      if (panel) scrollToY(scrollYFor(panel));
    };
    track.addEventListener('focusin', onFocus);

    return () => {
      track.removeEventListener('focusin', onFocus);
      section.classList.remove('is-horizontal');
      clearSurfaces();
      tween = null;
    };
  });

  // Mobile / reduced motion: panels stack. Track the panel under the centre (active) and the
  // panel under the fixed header (chrome ink) with two thin observer strips.
  const centreObserver = new IntersectionObserver(
    (entries) => {
      if (tween) return;
      const hit = entries.filter((e) => e.isIntersecting).at(-1);
      if (hit) setActive(panels.indexOf(hit.target as HTMLElement));
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  const headerObserver = new IntersectionObserver(
    (entries) => {
      if (tween) return;
      for (const entry of entries) {
        const index = panels.indexOf(entry.target as HTMLElement);
        if (entry.isIntersecting) {
          REGIONS.forEach((region) => {
            setSurface(region, isLight[index] === true);
          });
        } else if (index === 0 || index === panels.length - 1) {
          clearSurfaces(); // left the stacked timeline at either end
        }
      }
    },
    { rootMargin: '0px 0px -95% 0px' },
  );
  panels.forEach((p) => {
    centreObserver.observe(p);
    headerObserver.observe(p);
  });

  registerStops(() => panels.map(scrollYFor));

  return {
    section,
    panels,
    scrollYFor,
    onActive: (fn) => {
      listeners.push(fn);
      if (active >= 0) fn(active); // late subscribers get the current state immediately
    },
  };
};

/** Timeline-specific chrome: bottom year navigation with a sliding dot, themed by the active panel. */
export const initTimelineNav = (hs: HScroll): void => {
  const nav = qs('.timeline__nav', hs.section);
  const scroller = qs('.timeline__nav-scroller', nav);
  const links = qsa<HTMLAnchorElement>('[data-panel-link]', nav);
  const dot = qs('.timeline__nav-dot', nav);
  const themes = hs.panels.map((p) => /panel--(\w+)/.exec(p.className)?.[1] ?? 'void');

  hs.onActive((index) => {
    nav.dataset.theme = themes[index] ?? 'void';
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const link = links[index];
    if (!link) return;
    // Keep the active year centred when the list overflows (small laptops).
    scroller.scrollTo({ left: link.offsetLeft - scroller.clientWidth / 2, behavior: 'smooth' });
    gsap.to(dot, { x: link.offsetLeft + link.offsetWidth / 2, duration: 0.5, ease: 'power3.out' });
  });

  nav.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-panel-link]');
    if (!link) return;
    event.preventDefault();
    const panel = hs.panels.find((p) => p.id === link.dataset.panelLink);
    if (panel) scrollToY(hs.scrollYFor(panel));
  });
};
