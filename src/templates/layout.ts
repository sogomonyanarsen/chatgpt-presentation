import type { Chapter } from '../data/chapters';
import { LANGS, type Lang } from '../i18n/types';
import { each, esc } from './html';
import type { Page } from './page';

const LANG_LABEL: Record<Lang, string> = { en: 'EN', hy: 'ՀԱՅ' };

/** Relative link from the current page to the other language's page. */
const langHref = (from: Lang, to: Lang): string => {
  if (from === to) return './';
  return to === 'en' ? '../' : `${to}/`;
};

const langSwitch = ({ c }: Page): string => `
  <nav class="lang-switch" aria-label="${esc(c.t.language)}">
    ${LANGS.map(
      (lang) =>
        `<a class="lang-switch__link" href="${langHref(c.lang, lang)}" hreflang="${lang}" lang="${lang}" data-lang-link${lang === c.lang ? ' aria-current="true"' : ''}>${LANG_LABEL[lang]}</a>`,
    ).join('<span class="lang-switch__sep" aria-hidden="true">/</span>')}
  </nav>`;

export const header = (page: Page): string => {
  const { c } = page;
  const intro = c.chapters.find((ch) => ch.id === 'intro');
  return `
<header class="site-header">
  <a class="site-header__brand" href="#intro" data-nav-link>
    <span aria-hidden="true">{</span> ${c.t.brand} <span aria-hidden="true">}</span>
  </a>
  <p class="site-header__chapter" aria-live="polite">
    <span class="site-header__chapter-num" data-chapter-num>00</span>
    <span data-chapter-title>${esc(intro?.title ?? '')}</span>
  </p>
  <div class="site-header__actions">
    ${langSwitch(page)}
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">
      <span class="menu-toggle__label">${esc(c.t.chapters)}</span>
      <span class="menu-toggle__icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </button>
  </div>
</header>`;
};

const menuItem = (chapter: Chapter): string => `
  <li class="menu__item">
    <a class="menu__link" href="#${chapter.id}" data-nav-link>
      <span class="menu__num">${chapter.number}</span>
      <span class="menu__title">${esc(chapter.title)}</span>
    </a>
  </li>`;

export const menu = ({ c }: Page): string => `
<nav id="menu" class="menu" role="dialog" aria-modal="true" aria-label="${esc(c.t.chapters)}" data-lenis-prevent hidden>
  <ol class="menu__list">${each(c.chapters, menuItem)}</ol>
  <p class="menu__hint">${c.t.menuHint}</p>
</nav>`;

export const rail = (): string => `
<div class="rail" aria-hidden="true">
  <div class="rail__track"><div class="rail__fill"></div></div>
  <div class="rail__ticks"></div>
  <div class="rail__cursor"></div>
</div>`;

export const keysHint = ({ c }: Page): string => `
<p class="keys-hint" role="note">${c.t.keysHint}</p>`;
