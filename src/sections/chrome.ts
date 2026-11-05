import { clamp, qs, qsa } from '../core/dom';
import { layoutY, pageY, scrollTarget, scrollToY, ScrollTrigger, stopScroll } from '../core/scroll';
import { allStops } from '../core/stops';

/** Header chapter indicator + right-hand progress rail with chapter ticks. */
export const initProgress = (): void => {
  const chapterSections = qsa('[data-chapter]');
  const numEl = qs('[data-chapter-num]');
  const titleEl = qs('[data-chapter-title]');
  const fill = qs('.rail__fill');
  const cursor = qs('.rail__cursor');
  const ticks = qs('.rail__ticks');

  const maxScroll = (): number => document.documentElement.scrollHeight - window.innerHeight;

  const drawTicks = (): void => {
    ticks.innerHTML = chapterSections
      .map(
        (s) =>
          `<span class="rail__tick" style="top:${(clamp(pageY(s) / maxScroll(), 0, 1) * 100).toFixed(2)}%"></span>`,
      )
      .join('');
  };

  const update = (): void => {
    const progress = clamp(window.scrollY / Math.max(1, maxScroll()), 0, 1);
    fill.style.transform = `scaleY(${progress})`;
    document.body.classList.toggle('is-past-intro', window.scrollY > window.innerHeight * 0.5);
    cursor.style.top = `${progress * 100}%`;

    const probe = window.scrollY + window.innerHeight * 0.5;
    let current = chapterSections[0];
    for (const s of chapterSections) if (pageY(s) <= probe) current = s;
    if (current && numEl.textContent !== current.dataset.chapter) {
      numEl.textContent = current.dataset.chapter ?? '';
      titleEl.textContent = current.dataset.chapterTitle ?? '';
    }
  };

  // ScrollTrigger's refresh briefly scrolls the page while measuring, so re-sync afterwards.
  ScrollTrigger.addEventListener('refresh', () => {
    drawTicks();
    update();
  });
  window.addEventListener('scroll', update, { passive: true });
  drawTicks();
  update();
};

/** Full-screen chapter menu with focus management and Esc-to-close. */
export const initMenu = (): { toggle: (open?: boolean) => void } => {
  const button = qs<HTMLButtonElement>('.menu-toggle');
  const menu = qs('#menu');
  const links = qsa<HTMLAnchorElement>('.menu__link', menu);

  const isOpen = (): boolean => menu.hidden === false;

  const toggle = (open = !isOpen()): void => {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-menu-open', open);
    stopScroll(open);
    if (open) links[0]?.focus();
    else button.focus();
  };

  button.addEventListener('click', () => {
    toggle();
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
  return { toggle };
};

/** Scroll so a section reads well: covers park on their legible title, others clear the header. */
export const scrollToSection = (target: HTMLElement, immediate = false): void => {
  const y = target.classList.contains('cover')
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
  document.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
    if (!button) return;
    void navigator.clipboard.writeText(button.dataset.copy ?? '').then(
      () => {
        button.textContent = 'Copied ✓';
        window.setTimeout(() => (button.textContent = 'Copy'), 1600);
      },
      () => {
        button.textContent = 'Select & copy';
      },
    );
  });
};
