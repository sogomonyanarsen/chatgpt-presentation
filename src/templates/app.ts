import { chapters, type Chapter } from '../data/chapters';
import { capabilitiesSection } from './capabilities';
import { futureSection, outroSection, playbookSection } from './closing';
import { cover, hero } from './hero';
import { hoodSection } from './hood';
import { header, keysHint, menu, rail } from './layout';
import { timelineSection } from './timeline';

const chapter = (id: string): Chapter => {
  const found = chapters.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown chapter "${id}"`);
  return found;
};

/** Renders the complete page body. Called once at build time by the Vite prerender plugin. */
export const renderApp = (): string => `
<a class="skip-link" href="#main">Skip to content</a>
<canvas class="starfield" aria-hidden="true"></canvas>
<div class="scanlines" aria-hidden="true"></div>
${header()}
${menu()}
${rail()}
<main id="main">
  ${hero()}
  ${cover(chapter('history'))}
  ${timelineSection()}
  ${cover(chapter('hood'))}
  ${hoodSection()}
  ${cover(chapter('capabilities'))}
  ${capabilitiesSection()}
  ${cover(chapter('playbook'))}
  ${playbookSection()}
  ${cover(chapter('future'))}
  ${futureSection()}
  ${outroSection()}
</main>
${keysHint()}`;
