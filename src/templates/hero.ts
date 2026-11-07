import type { Chapter } from '../data/chapters';
import { eyebrow, esc } from './html';

export const hero = (): string => `
<section class="hero" id="intro" data-chapter="00" data-chapter-title="Intro" data-stop>
  <div class="hero__sticky">
    <canvas class="hero__pixels" aria-hidden="true"></canvas>
    <div class="hero__content">
      ${eyebrow('SoftConstruct · UI engineering talk · Nov 2026', 'eyebrow hero__eyebrow')}
      <h1 class="hero__title"><span class="hero__title-text">ChatGPT</span></h1>
      <p class="hero__sub">Origins, capabilities and what comes next, explained for people who build interfaces.</p>
      <a class="pill-btn hero__cta" href="#history" data-nav-link>
        Start the dive
        <span class="pill-btn__arrow" aria-hidden="true">↓</span>
      </a>
    </div>
    <p class="hero__manifesto">
      In <strong>2017</strong> it was an idea in a research paper. By <strong>2026</strong> nearly
      <strong>a billion people</strong> use it every week, and it builds UIs, writes code and browses the web on its own.
      <span class="hero__manifesto-cta">Let’s look at how.</span>
    </p>
    <p class="hero__scroll" aria-hidden="true"><span class="hero__scroll-bar"></span> scroll</p>
  </div>
</section>`;

/** Chapter cover: a sticky “portal” that the camera dives through on scroll. */
export const cover = (chapter: Chapter): string => `
<section class="cover" id="${chapter.id}" data-chapter="${chapter.number}" data-chapter-title="${esc(chapter.title)}" data-stop aria-labelledby="${chapter.id}-title">
  <div class="cover__sticky">
    <p class="cover__portal" aria-hidden="true">${chapter.number}</p>
    <div class="cover__content">
      ${eyebrow(`Chapter ${chapter.number}`, 'eyebrow cover__eyebrow')}
      <h2 class="cover__title" id="${chapter.id}-title">${esc(chapter.title)}</h2>
      <p class="cover__lead">${esc(chapter.lead)}</p>
    </div>
  </div>
</section>`;
