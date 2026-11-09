import type { Chapter } from '../data/chapters';
import { esc, eyebrow } from './html';
import type { Page } from './page';

export const hero = ({ c }: Page): string => {
  const intro = c.chapters.find((ch) => ch.id === 'intro');
  return `
<section class="hero" id="intro" data-chapter="00" data-chapter-title="${esc(intro?.title ?? 'Intro')}" data-stop>
  <div class="hero__sticky">
    <canvas class="hero__pixels" aria-hidden="true"></canvas>
    <div class="hero__content">
      ${eyebrow(c.t.hero.eyebrow, 'eyebrow hero__eyebrow')}
      <h1 class="hero__title"><span class="hero__title-text">ChatGPT</span></h1>
      <p class="hero__sub">${esc(c.t.hero.sub)}</p>
      <a class="pill-btn hero__cta" href="#history" data-nav-link>
        ${esc(c.t.hero.cta)}
        <span class="pill-btn__arrow" aria-hidden="true">↓</span>
      </a>
    </div>
    <p class="hero__manifesto">
      ${c.t.hero.manifesto}
      <span class="hero__manifesto-cta">${esc(c.t.hero.manifestoCta)}</span>
    </p>
    <p class="hero__scroll" aria-hidden="true"><span class="hero__scroll-bar"></span> ${esc(c.t.hero.scroll)}</p>
  </div>
</section>`;
};

/** Chapter cover: a sticky “portal” that the camera dives through on scroll. */
export const cover = ({ c }: Page, chapter: Chapter): string => `
<section class="cover" id="${chapter.id}" data-chapter="${chapter.number}" data-chapter-title="${esc(chapter.title)}" data-stop aria-labelledby="${chapter.id}-title">
  <div class="cover__sticky">
    <p class="cover__portal" aria-hidden="true">${chapter.number}</p>
    <div class="cover__content">
      ${eyebrow(c.t.chapter(chapter.number), 'eyebrow cover__eyebrow')}
      <h2 class="cover__title" id="${chapter.id}-title">${esc(chapter.title)}</h2>
      <p class="cover__lead">${esc(chapter.lead)}</p>
    </div>
  </div>
</section>`;
