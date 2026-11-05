import '@fontsource/silkscreen/400.css';
import '@fontsource/anton/400.css';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import './styles/main.scss';

import { qs, qsa, whenNearViewport } from './core/dom';
import { prefersReducedMotion } from './core/motion';
import { initScroll, onScrollVelocity, ScrollTrigger, scrollToY } from './core/scroll';
import { initAnatomy } from './demos/anatomy';
import { initAttention } from './demos/attention';
import { initSampling } from './demos/sampling';
import { initStreaming } from './demos/streaming';
import { initScramble } from './effects/scramble';
import { Starfield } from './effects/starfield';
import {
  initCopyButtons,
  initKeyboard,
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
  document.documentElement.classList.add('js');
  if (prefersReducedMotion()) document.documentElement.classList.add('reduced-motion');

  initScroll();

  const starfield = new Starfield(qs<HTMLCanvasElement>('.starfield'), !prefersReducedMotion());
  onScrollVelocity((v) => {
    starfield.setVelocity(v);
  });

  // Section choreography. Modules create triggers by type, not in page order, so we
  // ScrollTrigger.sort() below: pins must refresh top-to-bottom for correct spacing.
  const heroReady = initHero(starfield);
  initCovers(starfield);
  const scrollers = qsa('[data-hscroll]').map((section) => {
    const hs = createHScroll(section);
    if (section.dataset.hscroll === 'timeline') initTimelineNav(hs);
    return hs;
  });
  initDive();
  initScramble();

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
  initProgress();

  await heroReady;
  await document.fonts.ready;
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  watchLayout();

  // Deep links (e.g. …/#capabilities) land correctly once pin spacing exists. Wait for `load`:
  // the browser performs its own fragment scroll then, which would otherwise override ours.
  if (document.readyState !== 'complete') {
    await new Promise((resolve) => {
      window.addEventListener('load', resolve, { once: true });
    });
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  }); // after the browser's own fragment scroll
  const hashTarget = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (hashTarget) {
    const owner = scrollers.find((hs) => hs.panels.includes(hashTarget));
    if (owner) scrollToY(owner.scrollYFor(hashTarget), true);
    else scrollToSection(hashTarget, true);
  }
};

void boot();
