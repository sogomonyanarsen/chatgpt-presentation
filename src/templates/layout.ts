import { chapters, type Chapter } from '../data/chapters';
import { each, esc } from './html';

export const header = (): string => `
<header class="site-header">
  <a class="site-header__brand" href="#intro" data-nav-link>
    <span aria-hidden="true">{</span> ChatGPT <span class="site-header__slash">//</span> Field Guide <span aria-hidden="true">}</span>
  </a>
  <p class="site-header__chapter" aria-live="polite">
    <span class="site-header__chapter-num" data-chapter-num>00</span>
    <span data-chapter-title>Intro</span>
  </p>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">
    <span class="menu-toggle__label">Chapters</span>
    <span class="menu-toggle__icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
  </button>
</header>`;

const menuItem = (chapter: Chapter): string => `
  <li class="menu__item">
    <a class="menu__link" href="#${chapter.id}" data-nav-link>
      <span class="menu__num">${chapter.number}</span>
      <span class="menu__title">${esc(chapter.title)}</span>
    </a>
  </li>`;

export const menu = (): string => `
<nav id="menu" class="menu" aria-label="Chapters" data-lenis-prevent hidden>
  <ol class="menu__list">${each(chapters, menuItem)}</ol>
  <p class="menu__hint">
    <kbd>→</kbd> / <kbd>PgDn</kbd> next stop · <kbd>←</kbd> / <kbd>PgUp</kbd> previous · <kbd>M</kbd> menu · <kbd>Esc</kbd> close
  </p>
</nav>`;

export const rail = (): string => `
<div class="rail" aria-hidden="true">
  <div class="rail__track"><div class="rail__fill"></div></div>
  <div class="rail__ticks"></div>
  <div class="rail__cursor"></div>
</div>`;

export const keysHint = (): string => `
<p class="keys-hint" role="note">
  <kbd>←</kbd><kbd>→</kbd> navigate <span class="keys-hint__sep">·</span> <kbd>M</kbd> chapters
</p>`;
