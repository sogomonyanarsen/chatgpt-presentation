import type { Chapter } from '../data/chapters';
import { getContent } from '../i18n/content';
import type { Lang } from '../i18n/types';
import { capabilitiesSection } from './capabilities';
import { futureSection, outroSection, playbookSection } from './closing';
import { cover, hero } from './hero';
import { hoodSection } from './hood';
import { header, keysHint, menu, rail } from './layout';
import type { Page } from './page';
import { timelineSection } from './timeline';

const chapter = (page: Page, id: string): Chapter => {
  const found = page.c.chapters.find((ch) => ch.id === id);
  if (!found) throw new Error(`Unknown chapter "${id}"`);
  return found;
};

/**
 * Renders the complete page body for one language.
 * Called at build time by the Vite prerender plugin, once per HTML entry (/ and /hy/).
 */
export const renderApp = (lang: Lang): string => {
  const page: Page = { c: getContent(lang), base: lang === 'en' ? '' : '../' };
  return `
<a class="skip-link" href="#main">${page.c.t.skip}</a>
<canvas class="starfield" aria-hidden="true"></canvas>
<div class="scanlines" aria-hidden="true"></div>
${header(page)}
${menu(page)}
${rail()}
<main id="main">
  ${hero(page)}
  ${cover(page, chapter(page, 'history'))}
  ${timelineSection(page)}
  ${cover(page, chapter(page, 'hood'))}
  ${hoodSection(page)}
  ${cover(page, chapter(page, 'capabilities'))}
  ${capabilitiesSection(page)}
  ${cover(page, chapter(page, 'playbook'))}
  ${playbookSection(page)}
  ${cover(page, chapter(page, 'future'))}
  ${futureSection(page)}
  ${outroSection(page)}
</main>
${keysHint(page)}`;
};
