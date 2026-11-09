import type { Trend } from '../data/future';
import { credits, sources } from '../data/sources';
import { highlight } from './highlight';
import { each, esc, eyebrow } from './html';
import type { Page } from './page';

const STREAM_SNIPPET = `import OpenAI from 'openai';

// Runs on our backend: never put the API key in frontend code.
const client = new OpenAI();

const stream = await client.responses.create({
  model: 'gpt-5.5',
  instructions: 'You write accessible Angular components with SCSS + BEM.',
  input: 'Create an <app-rating> component with full keyboard support.',
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') res.write(event.delta); // → SSE to the UI
}`;

const STRUCTURED_SNIPPET = `import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

const DesignTokens = z.object({
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  spacing: z.array(z.number()),
});

const res = await client.responses.parse({
  model: 'gpt-5.5',
  input: [{ role: 'user', content: [
    { type: 'input_text', text: 'Extract design tokens from this mock-up.' },
    { type: 'input_image', image_url: screenshotDataUrl },
  ] }],
  text: { format: zodTextFormat(DesignTokens, 'design_tokens') },
});

res.output_parsed?.colors; // ← typed JSON in exactly the shape we asked for`;

export const playbookSection = ({ c }: Page): string => {
  const p = c.t.playbook;
  return `
<section class="playbook" aria-label="${esc(p.aria)}">
  <article class="playbook__block" id="playbook-prompt" data-stop data-dive aria-labelledby="pb-prompt">
    ${eyebrow(p.promptEyebrow, 'eyebrow')}
    <h3 class="playbook__title" id="pb-prompt" data-fade-in>${esc(p.promptTitle)}</h3>
    <p class="playbook__intro">${p.promptIntro}</p>
    <div class="anatomy" data-demo="anatomy">
      <ul class="anatomy__legend">
        ${each(
          c.promptAnatomy,
          (part) =>
            `<li><button class="anatomy__key anatomy__key--${part.key}" type="button" data-part="${part.key}">${esc(part.label)}</button></li>`,
        )}
      </ul>
      <p class="anatomy__prompt">
        ${each(c.promptAnatomy, (part) => `<span class="anatomy__part anatomy__part--${part.key}" data-part-text="${part.key}">${esc(part.text)}</span> `)}
      </p>
    </div>
  </article>

  <article class="playbook__block" id="playbook-api" data-stop data-dive aria-labelledby="pb-api">
    ${eyebrow(p.apiEyebrow, 'eyebrow')}
    <h3 class="playbook__title" id="pb-api" data-fade-in>${esc(p.apiTitle)}</h3>
    <p class="playbook__intro">${p.apiIntro}</p>
    <div class="playbook__code-grid">
      <figure class="cap__code">
        <figcaption class="cap__code-label">${esc(p.streamLabel)}</figcaption>
        <pre class="code-block" data-lenis-prevent data-lang="ts"><code>${highlight(STREAM_SNIPPET, 'ts')}</code></pre>
      </figure>
      <figure class="cap__code">
        <figcaption class="cap__code-label">${esc(p.structuredLabel)}</figcaption>
        <pre class="code-block" data-lenis-prevent data-lang="ts"><code>${highlight(STRUCTURED_SNIPPET, 'ts')}</code></pre>
      </figure>
    </div>
  </article>

  <article class="playbook__block" id="playbook-checklist" data-stop data-dive aria-labelledby="pb-check">
    ${eyebrow(p.checklistEyebrow, 'eyebrow')}
    <h3 class="playbook__title" id="pb-check" data-fade-in>${esc(p.checklistTitle)}</h3>
    <ol class="checklist">${each(c.checklist, (item) => `<li class="checklist__item" data-reveal><span>${item}</span></li>`)}</ol>
  </article>
</section>`;
};

const trendCard = (trend: Trend, index: number, forUs: string): string => `
  <li class="trend" id="trend-${index + 1}" data-panel>
    <p class="trend__num">${String(index + 1).padStart(2, '0')}</p>
    <h3 class="trend__title">${esc(trend.title)}</h3>
    <p class="trend__body">${trend.body}</p>
    <p class="trend__for-us"><span class="trend__for-us-label">${esc(forUs)}</span><span>${trend.forUs}</span></p>
  </li>`;

export const futureSection = ({ c }: Page): string => `
<section class="hscroll future" aria-label="${esc(c.t.future.aria)}" data-hscroll="future">
  <div class="hscroll__viewport">
    <ol class="hscroll__track future__track">${each(c.trends, (trend, i) => trendCard(trend, i, c.t.future.forUs))}</ol>
  </div>
</section>`;

export const outroSection = ({ c }: Page): string => {
  const o = c.t.outro;
  const chapter = c.chapters.find((ch) => ch.id === 'outro');
  return `
<section class="outro" id="outro" data-chapter="06" data-chapter-title="${esc(chapter?.title ?? '')}" data-stop aria-labelledby="outro-title">
  <div class="outro__stage">
    ${eyebrow(o.eyebrow, 'eyebrow outro__eyebrow')}
    <h2 class="outro__title" id="outro-title" data-fade-in>${esc(o.title)}</h2>
    <p class="outro__lead">${esc(o.lead)}</p>
  </div>
  <div class="outro__refs">
    <details class="refs">
      <summary class="refs__summary">${esc(o.sources)} (${sources.length})</summary>
      <ol class="refs__list" lang="en">
        ${each(sources, (s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`)}
      </ol>
    </details>
    <details class="refs">
      <summary class="refs__summary">${esc(o.credits)} (${Object.keys(credits).length})</summary>
      <ol class="refs__list" lang="en">
        ${each(
          Object.values(credits),
          (cr) =>
            `<li><a href="${cr.url}" target="_blank" rel="noopener noreferrer">${esc(cr.title)}</a> · ${esc(cr.author)} · ${esc(cr.license)}</li>`,
        )}
      </ol>
    </details>
    <p class="outro__note">${esc(o.note)}</p>
  </div>
</section>`;
};
