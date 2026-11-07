import { clamp, qs, qsa } from '../core/dom';
import { layoutY, pageY, scrollTarget, scrollToY, ScrollTrigger, stopScroll } from '../core/scroll';
import { prefersReducedMotion } from '../core/motion';
import { allStops } from '../core/stops';

/**
 * Header chapter indicator + right-hand progress rail with chapter ticks.
 * All layout reads (section offsets, rail height) happen on ScrollTrigger refresh; the scroll
 * handler only does arithmetic and transform writes, so it never forces a synchronous layout.
 */
export const initProgress = (): void => {
  const chapterSections = qsa('[data-chapter]');
  const numEl = qs('[data-chapter-num]');
  const titleEl = qs('[data-chapter-title]');
  const rail = qs('.rail');
  const fill = qs('.rail__fill');
  const cursor = qs('.rail__cursor');
  const ticks = qs('.rail__ticks');

  let maxScroll = 1;
  let railHeight = 0;
  let sectionTops: number[] = [];
  let current = -1;

  const measure = (): void => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    railHeight = rail.offsetHeight;
    sectionTops = chapterSections.map((s) => layoutY(s));
    ticks.innerHTML = sectionTops
      .map(
        (top) =>
          `<span class="rail__tick" style="top:${(clamp(top / maxScroll, 0, 1) * 100).toFixed(2)}%"></span>`,
      )
      .join('');
  };

  const update = (): void => {
    const y = window.scrollY;
    const progress = clamp(y / maxScroll, 0, 1);
    fill.style.transform = `scaleY(${progress})`;
    cursor.style.transform = `translateY(${(progress * railHeight).toFixed(1)}px) translateY(-50%)`;
    document.body.classList.toggle('is-past-intro', y > window.innerHeight * 0.5);

    const probe = y + window.innerHeight * 0.5;
    let index = 0;
    sectionTops.forEach((top, i) => {
      if (top <= probe) index = i;
    });
    const section = chapterSections[index];
    if (index !== current && section) {
      current = index;
      numEl.textContent = section.dataset.chapter ?? '';
      titleEl.textContent = section.dataset.chapterTitle ?? '';
    }
  };

  // ScrollTrigger's refresh changes pin spacing (and briefly scrolls while measuring): re-sync.
  ScrollTrigger.addEventListener('refresh', () => {
    measure();
    update();
  });
  window.addEventListener('scroll', update, { passive: true });
  measure();
  update();
};

/**
 * Full-screen chapter menu, behaving as a modal dialog: the page behind is inert,
 * Tab cycles between the toggle and the links, and Esc closes it from anywhere.
 */
export const initMenu = (): { toggle: (open?: boolean) => void } => {
  const button = qs<HTMLButtonElement>('.menu-toggle');
  const menu = qs('#menu');
  const links = qsa<HTMLAnchorElement>('.menu__link', menu);
  const background = [qs('main'), qs('.rail'), qs('.keys-hint'), qs('.site-header__brand')];

  const isOpen = (): boolean => menu.hidden === false;

  const toggle = (open = !isOpen()): void => {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-menu-open', open);
    background.forEach((el) => {
      el.inert = open;
    });
    stopScroll(open);
    if (open) links[0]?.focus();
    else button.focus();
  };

  button.addEventListener('click', () => {
    toggle();
  });

  window.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      toggle(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const cycle = [button, ...links];
    const first = cycle[0];
    const last = cycle.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });
  return { toggle };
};

/** Scroll so a section reads well: covers park on their legible title, others clear the header. */
export const scrollToSection = (target: HTMLElement, immediate = false): void => {
  const animatedCover = target.classList.contains('cover') && !prefersReducedMotion();
  const y = animatedCover
    ? pageY(target) - window.innerHeight + target.offsetHeight * 0.48
    : layoutY(target) - (target.id === 'intro' ? 0 : 72);
  scrollToY(y, immediate);
};

/** In-page links (`[data-nav-link]`) go through the smooth scroller and close the menu. */
export const initNavLinks = (closeMenu: () => void): void => {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-nav-link]');
    const id = link?.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!link || !target) return;
    event.preventDefault();
    if (qs('#menu').hidden === false) closeMenu();
    scrollToSection(target);
    history.replaceState(null, '', `#${id}`);
  });
};

const isTyping = (el: EventTarget | null): boolean =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/**
 * Presenter keyboard: ←/→ and PageUp/PageDown (what most clickers send) jump between stops.
 * ↑/↓ and Space keep their native scrolling behaviour.
 */
export const initKeyboard = (menu: { toggle: (open?: boolean) => void }): void => {
  window.addEventListener('keydown', (event) => {
    if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
    if (document.body.classList.contains('is-lightbox-open')) return; // lightbox owns the keys

    if (event.key === 'm' || event.key === 'M') {
      menu.toggle();
      return;
    }
    if (qs('#menu').hidden === false) return;

    const forward = event.key === 'ArrowRight' || event.key === 'PageDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'PageUp';
    if (!forward && !backward) return;

    event.preventDefault();
    document.body.classList.add('has-used-keys');
    const stops = allStops();
    const y = scrollTarget();
    const target = forward ? stops.find((s) => s > y + 8) : stops.findLast((s) => s < y - 8);
    if (target !== undefined) scrollToY(target);
  });
};

/** Copy-to-clipboard buttons for the “try it” prompts. */
export const initCopyButtons = (): void => {
  const resetTimers = new WeakMap<HTMLButtonElement, number>();

  const flash = (button: HTMLButtonElement, label: string): void => {
    window.clearTimeout(resetTimers.get(button));
    button.textContent = label;
    resetTimers.set(
      button,
      window.setTimeout(() => {
        button.textContent = 'Copy';
      }, 1600),
    );
  };

  document.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
    if (!button) return;
    // `navigator.clipboard` is undefined on insecure origins (e.g. presenting from a LAN IP).
    if (!window.isSecureContext || !('clipboard' in navigator)) {
      flash(button, 'Select & copy');
      return;
    }
    navigator.clipboard.writeText(button.dataset.copy ?? '').then(
      () => {
        flash(button, 'Copied ✓');
      },
      () => {
        flash(button, 'Select & copy');
      },
    );
  });
};
