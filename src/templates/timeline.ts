import type { Figure, Stat, TimelineEntry } from '../data/types';
import { creditLine, zoomableImage } from './figure';
import { each, esc, eyebrow } from './html';
import type { Page } from './page';

const figure = (page: Page, fig: Figure, modifier: string): string => `
  <figure class="panel__figure panel__figure--${modifier} panel__figure--${fig.kind}"${fig.kind === 'photo' ? ' data-parallax' : ''}>
    <div class="panel__figure-frame">${zoomableImage(page, fig)}</div>
    <figcaption class="panel__credit">
      ${fig.caption ? `<span class="panel__caption">${esc(fig.caption)}</span>` : ''}
      ${creditLine(fig)}
    </figcaption>
  </figure>`;

const stat = (s: Stat): string => `
  <div class="panel__stat">
    <dt class="panel__stat-label">${esc(s.label)}</dt>
    <dd class="panel__stat-value">${esc(s.value)}</dd>
  </div>`;

const mockBar = (title: string): string =>
  `<div class="mock__bar"><span></span><span></span><span></span><p>${esc(title)}</p></div>`;

/** Illustrative mocks (clearly labelled) for the eras that have no archival photography. */
const mock = ({ c }: Page, kind: NonNullable<TimelineEntry['mock']>): string => {
  const { agentMock, genuiMock, illustration } = c.t.timeline;
  if (kind === 'agent') {
    const states = ['is-done', 'is-done', 'is-active', '', 'is-gated'];
    return `
  <figure class="mock mock--agent">
    ${mockBar(agentMock.title)}
    <ol class="mock__plan">
      ${each(agentMock.items, (item, i) => `<li${states[i] ? ` class="${states[i]}"` : ''}>${item}</li>`)}
    </ol>
    <figcaption class="mock__caption">${esc(illustration)}</figcaption>
  </figure>`;
  }
  const versions = ['1.0', '1.1', '1.2', '2.0'];
  return `
  <figure class="mock mock--genui">
    ${mockBar(genuiMock.title)}
    <p class="mock__msg">${esc(genuiMock.message)}</p>
    <div class="mock__chart" role="img" aria-label="${esc(genuiMock.chartAria)}">
      ${[182, 176, 161, 129]
        .map(
          (kb, i) =>
            `<span style="--h:${(kb / 182).toFixed(2)}"><b>${kb}</b><i>v${versions[i] ?? ''}</i></span>`,
        )
        .join('')}
    </div>
    <div class="mock__chips">${each(genuiMock.chips, (chip) => `<span>${esc(chip)}</span>`)}</div>
    <figcaption class="mock__caption">${esc(illustration)}</figcaption>
  </figure>`;
};

const panel = (page: Page, entry: TimelineEntry): string => {
  const main = entry.figures?.find((f) => !f.polaroid);
  const polaroid = entry.figures?.find((f) => f.polaroid);
  const { t } = page.c;
  return `
  <li class="panel panel--${entry.theme}" id="${entry.id}" data-panel data-nav-label="${esc(entry.navLabel)}">
    <article class="panel__inner" aria-labelledby="${entry.id}-title">
      <div class="panel__main">
        <p class="panel__date">${esc(entry.date)}</p>
        <h3 class="panel__title" id="${entry.id}-title">${esc(entry.title)}</h3>
        ${main ? figure(page, main, 'main') : ''}
        ${entry.mock ? mock(page, entry.mock) : ''}
        <p class="panel__tag"><span>${esc(entry.tag)}</span></p>
        <p class="panel__lead">${entry.lead}</p>
        ${entry.stats ? `<dl class="panel__stats">${each(entry.stats, stat)}</dl>` : ''}
      </div>
      <aside class="panel__hood" aria-label="${esc(t.timeline.underHood)}">
        ${eyebrow(t.timeline.underHood, 'eyebrow panel__hood-eyebrow')}
        <h4 class="panel__hood-title">${esc(entry.hood.title)}</h4>
        <p class="panel__hood-body">${entry.hood.body}</p>
        ${entry.hood.code ? `<pre class="panel__code"><code>${esc(entry.hood.code)}</code></pre>` : ''}
      </aside>
      ${polaroid ? figure(page, polaroid, 'polaroid') : ''}
    </article>
  </li>`;
};

export const timelineSection = (page: Page): string => {
  const { c } = page;
  return `
<section class="hscroll timeline" aria-label="${esc(c.t.timeline.aria)}" data-hscroll="timeline">
  <div class="hscroll__viewport">
    <ol class="hscroll__track timeline__track">${each(c.timeline, (entry) => panel(page, entry))}</ol>
  </div>
  <nav class="timeline__nav" aria-label="${esc(c.t.timeline.navAria)}">
    <div class="timeline__nav-scroller">
      <ol class="timeline__nav-list">
        ${each(
          c.timeline,
          (entry) =>
            `<li><a class="timeline__nav-link" href="#${entry.id}" data-panel-link="${entry.id}">${esc(entry.navLabel)}</a></li>`,
        )}
      </ol>
      <span class="timeline__nav-dot" aria-hidden="true"></span>
    </div>
  </nav>
</section>`;
};
