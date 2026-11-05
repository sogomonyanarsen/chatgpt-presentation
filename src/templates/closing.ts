import { checklist, promptAnatomy, trends, type Trend } from '../data/future';
import { credits, sources } from '../data/sources';
import { highlight } from './highlight';
import { each, esc, eyebrow } from './html';

const STREAM_SNIPPET = `import OpenAI from 'openai';

// Server-side only: never ship OPENAI_API_KEY to the browser.
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

res.output_parsed?.colors; // ← fully typed, schema-guaranteed JSON`;

export const playbookSection = (): string => `
<section class="playbook" aria-label="Playbook for UI engineers">
  <article class="playbook__block" data-stop data-dive aria-labelledby="pb-prompt">
    ${eyebrow('4.1 · prompt anatomy', 'eyebrow')}
    <h3 class="playbook__title" id="pb-prompt" data-scramble>A prompt is a spec</h3>
    <p class="playbook__intro">The model only knows what is in its context. Good prompts read like a good ticket: context, task, constraints, format and an example.</p>
    <div class="anatomy" data-demo="anatomy">
      <ul class="anatomy__legend">
        ${each(
          promptAnatomy,
          (part) =>
            `<li><button class="anatomy__key anatomy__key--${part.key}" type="button" data-part="${part.key}">${esc(part.label)}</button></li>`,
        )}
      </ul>
      <p class="anatomy__prompt">
        ${each(promptAnatomy, (part) => `<span class="anatomy__part anatomy__part--${part.key}" data-part-text="${part.key}">${esc(part.text)}</span> `)}
      </p>
    </div>
  </article>

  <article class="playbook__block" data-stop data-dive aria-labelledby="pb-api">
    ${eyebrow('4.2 · the API in 15 lines', 'eyebrow')}
    <h3 class="playbook__title" id="pb-api" data-scramble>Build it into our products</h3>
    <p class="playbook__intro">The <strong>Responses API</strong> is what ChatGPT-style features are built on. Stream from your backend to the UI, and use <strong>Structured Outputs</strong> when you need JSON you can render without parsing guesswork.</p>
    <div class="playbook__code-grid">
      <figure class="cap__code">
        <figcaption class="cap__code-label">streaming (Node / BFF)</figcaption>
        <pre class="code-block" data-lang="ts"><code>${highlight(STREAM_SNIPPET, 'ts')}</code></pre>
      </figure>
      <figure class="cap__code">
        <figcaption class="cap__code-label">structured outputs + vision</figcaption>
        <pre class="code-block" data-lang="ts"><code>${highlight(STRUCTURED_SNIPPET, 'ts')}</code></pre>
      </figure>
    </div>
  </article>

  <article class="playbook__block" data-stop data-dive aria-labelledby="pb-check">
    ${eyebrow('4.3 · start on monday', 'eyebrow')}
    <h3 class="playbook__title" id="pb-check" data-scramble>Team checklist</h3>
    <ol class="checklist">${each(checklist, (item) => `<li class="checklist__item" data-reveal><span>${item}</span></li>`)}</ol>
  </article>
</section>`;

const trendCard = (trend: Trend, index: number): string => `
  <li class="trend" data-panel>
    <p class="trend__num">${String(index + 1).padStart(2, '0')}</p>
    <h3 class="trend__title">${esc(trend.title)}</h3>
    <p class="trend__body">${trend.body}</p>
    <p class="trend__for-us"><span class="trend__for-us-label">for UI devs</span><span>${trend.forUs}</span></p>
  </li>`;

export const futureSection = (): string => `
<section class="hscroll future" aria-label="Future trends" data-hscroll="future">
  <div class="hscroll__viewport">
    <ol class="hscroll__track future__track">${each(trends, trendCard)}</ol>
  </div>
</section>`;

export const outroSection = (): string => `
<section class="outro" id="outro" data-chapter="06" data-chapter-title="Q &amp; A" data-stop aria-labelledby="outro-title">
  <div class="outro__stage">
    ${eyebrow('thank you', 'eyebrow outro__eyebrow')}
    <h2 class="outro__title" id="outro-title" data-scramble>Questions?</h2>
    <p class="outro__lead">Bring a real task from your sprint and we will try it live.</p>
  </div>
  <div class="outro__refs">
    <details class="refs">
      <summary class="refs__summary">Sources (${sources.length})</summary>
      <ol class="refs__list">
        ${each(sources, (s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`)}
      </ol>
    </details>
    <details class="refs">
      <summary class="refs__summary">Image credits (${Object.keys(credits).length})</summary>
      <ol class="refs__list">
        ${each(
          Object.values(credits),
          (c) =>
            `<li><a href="${c.url}" target="_blank" rel="noopener noreferrer">${esc(c.title)}</a> · ${esc(c.author)} · ${esc(c.license)}</li>`,
        )}
      </ol>
    </details>
    <p class="outro__note">Facts current as of November 2026. Product details change quickly, so check the release notes before quoting.</p>
  </div>
</section>`;
