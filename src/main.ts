import '@fontsource/silkscreen/400.css';
import '@fontsource/anton/400.css';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
// Armenian glyphs only (unicode-range): downloaded just when Armenian text is on screen.
import '@fontsource-variable/noto-sans-armenian/wdth.css';
import './styles/main.scss';

import { qs, qsa, whenNearViewport } from './core/dom';
import { prefersReducedMotion } from './core/motion';
import { initScroll, onScrollVelocity, ScrollTrigger, scrollToY } from './core/scroll';
import { initAnatomy } from './demos/anatomy';
import { initAttention } from './demos/attention';
import { initSampling } from './demos/sampling';
import { initStreaming } from './demos/streaming';
import { initFadeIn } from './effects/fade-in';
import { initLightbox } from './effects/lightbox';
import { Starfield } from './effects/starfield';
import {
  initCopyButtons,
  initKeyboard,
  initLangSwitch,
  initMenu,
  initNavLinks,
  initProgress,
  scrollToSection,
} from './sections/chrome';
import { initCovers } from './sections/covers';
import { initDive } from './sections/dive';
import { initHero } from './sections/hero';
import { createHScroll, initTimelineNav } from './sections/hscroll';

const DEMOS: Record<string, (root: HTMLElement) => void | Promise<void>> = {
  tokenizer: (root) => import('./demos/tokenizer').then(({ initTokenizer }) => initTokenizer(root)),
  sampling: initSampling,
  attention: initAttention,
  streaming: initStreaming,
  anatomy: initAnatomy,
};

/**
 * Lazy demos (tokenizer output, streamed text) and late-loading assets change the page height.
 * Re-measure triggers when that happens so pins and stops never drift.
 */
const watchLayout = (): void => {
  let timer = 0;
  let lastHeight = document.body.scrollHeight;
  new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const height = document.body.scrollHeight;
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      ScrollTrigger.refresh();
    }, 200);
  }).observe(document.body);
};

const boot = async (): Promise<void> => {
  // We restore position ourselves once pin spacing exists; native restoration would land mid-animation.
  history.scrollRestoration = 'manual';
  // Take over deep links: strip the hash so the browser stops re-anchoring to the fragment
  // while pins change the layout; we scroll there ourselves (and restore the hash) below.
  const deepLink = location.hash.slice(1);
  if (deepLink) history.replaceState(null, '', location.pathname + location.search);
  document.documentElement.classList.add('js');
  if (prefersReducedMotion()) document.documentElement.classList.add('reduced-motion');

  initScroll();

  const starfield = new Starfield(qs<HTMLCanvasElement>('.starfield'), !prefersReducedMotion());
  onScrollVelocity((v) => {
    starfield.setVelocity(v);
  });

  // Section choreography. Pinned sections declare `refreshPriority` so they are measured first
  // regardless of creation order (see hscroll.ts).
  const heroReady = initHero(starfield);
  initCovers(starfield);
  const scrollers = qsa('[data-hscroll]').map((section) => {
    const hs = createHScroll(section, {
      onBackdropHidden: (hidden) => {
        starfield.setPaused(hidden);
      },
    });
    if (section.dataset.hscroll === 'timeline') initTimelineNav(hs);
    return hs;
  });
  initDive();
  initFadeIn();
  initLightbox();

  // Live demos boot lazily as they approach the viewport.
  for (const root of qsa('[data-demo]')) {
    const init = DEMOS[root.dataset.demo ?? ''];
    if (init) whenNearViewport(root, () => void init(root));
  }

  const menu = initMenu();
  initNavLinks(() => {
    menu.toggle(false);
  });
  initKeyboard(menu);
  initCopyButtons();
  initLangSwitch();
  initProgress();

  await heroReady;
  await document.fonts.ready;
  ScrollTrigger.refresh();
  watchLayout();

  // Deep links (e.g. …/#capabilities) land correctly once pin spacing exists.
  const goTo = (id: string, immediate: boolean): void => {
    const target = document.getElementById(id);
    if (!target) return;
    const owner = scrollers.find((hs) => hs.panels.includes(target));
    if (owner) scrollToY(owner.scrollYFor(target), immediate);
    else scrollToSection(target, immediate);
  };
  if (deepLink) {
    goTo(deepLink, true);
    history.replaceState(null, '', `#${deepLink}`);
  }
  // Hash edits on the same page (typed in the URL bar, or back/forward).
  window.addEventListener('hashchange', () => {
    goTo(location.hash.slice(1), false);
  });
};

void boot();
