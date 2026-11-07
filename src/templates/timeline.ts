import { timeline } from '../data/timeline';
import type { Figure, Stat, TimelineEntry } from '../data/types';
import { creditLine, zoomableImage } from './figure';
import { each, esc, eyebrow } from './html';

const figure = (fig: Figure, modifier: string): string => `
  <figure class="panel__figure panel__figure--${modifier} panel__figure--${fig.kind}"${fig.kind === 'photo' ? ' data-parallax' : ''}>
    <div class="panel__figure-frame">${zoomableImage(fig)}</div>
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

/** Illustrative mocks (clearly labelled) for the eras that have no archival photography. */
const MOCKS: Record<NonNullable<TimelineEntry['mock']>, string> = {
  agent: `
  <figure class="mock mock--agent">
    <div class="mock__bar"><span></span><span></span><span></span><p>ChatGPT Work · plan</p></div>
    <ol class="mock__plan">
      <li class="is-done">Pull last sprint’s tickets from Jira</li>
      <li class="is-done">Run Lighthouse on staging, 3 viewports</li>
      <li class="is-active">Draft QA report with screenshots</li>
      <li>Build slides for Friday demo</li>
      <li class="is-gated">Post summary to #ui-team <em>needs approval</em></li>
    </ol>
    <figcaption class="mock__caption">Illustration · not a real screenshot</figcaption>
  </figure>`,
  genui: `
  <figure class="mock mock--genui">
    <div class="mock__bar"><span></span><span></span><span></span><p>ChatGPT · Intelligent UI</p></div>
    <p class="mock__msg">Your bundle got 29% smaller since v1.0:</p>
    <div class="mock__chart" role="img" aria-label="Bar chart: 182, 176, 161 and 129 KB">
      ${[182, 176, 161, 129]
        .map(
          (kb, i) =>
            `<span style="--h:${(kb / 182).toFixed(2)}"><b>${kb}</b><i>v${['1.0', '1.1', '1.2', '2.0'][i] ?? ''}</i></span>`,
        )
        .join('')}
    </div>
    <div class="mock__chips"><span>gzip</span><span>brotli</span><span>per route</span></div>
    <figcaption class="mock__caption">Illustration · not a real screenshot</figcaption>
  </figure>`,
};

const panel = (entry: TimelineEntry): string => {
  const main = entry.figures?.find((f) => !f.polaroid);
  const polaroid = entry.figures?.find((f) => f.polaroid);
  return `
  <li class="panel panel--${entry.theme}" id="${entry.id}" data-panel data-nav-label="${esc(entry.navLabel)}">
    <article class="panel__inner" aria-labelledby="${entry.id}-title">
      <div class="panel__main">
        <p class="panel__date">${esc(entry.date)}</p>
        <h3 class="panel__title" id="${entry.id}-title">${esc(entry.title)}</h3>
        ${main ? figure(main, 'main') : ''}
        ${entry.mock ? MOCKS[entry.mock] : ''}
        <p class="panel__tag"><span>${esc(entry.tag)}</span></p>
        <p class="panel__lead">${entry.lead}</p>
        ${entry.stats ? `<dl class="panel__stats">${each(entry.stats, stat)}</dl>` : ''}
      </div>
      <aside class="panel__hood" aria-label="Under the hood">
        ${eyebrow('under the hood', 'eyebrow panel__hood-eyebrow')}
        <h4 class="panel__hood-title">${esc(entry.hood.title)}</h4>
        <p class="panel__hood-body">${entry.hood.body}</p>
        ${entry.hood.code ? `<pre class="panel__code"><code>${esc(entry.hood.code)}</code></pre>` : ''}
      </aside>
      ${polaroid ? figure(polaroid, 'polaroid') : ''}
    </article>
  </li>`;
};

export const timelineSection = (): string => `
<section class="hscroll timeline" aria-label="Timeline, 2017 to 2026" data-hscroll="timeline">
  <div class="hscroll__viewport">
    <ol class="hscroll__track timeline__track">${each(timeline, panel)}</ol>
  </div>
  <nav class="timeline__nav" aria-label="Timeline years">
    <div class="timeline__nav-scroller">
    <ol class="timeline__nav-list">
      ${each(
        timeline,
        (entry) =>
          `<li><a class="timeline__nav-link" href="#${entry.id}" data-panel-link="${entry.id}">${esc(entry.navLabel)}</a></li>`,
      )}
    </ol>
    <span class="timeline__nav-dot" aria-hidden="true"></span>
    </div>
  </nav>
</section>`;
