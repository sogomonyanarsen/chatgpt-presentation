import type { DemoCopy } from '../i18n/types';
import { highlight } from './highlight';
import { each, esc, eyebrow } from './html';
import type { Page } from './page';

const SSE_SNIPPET = `const res = await fetch('/api/chat', { method: 'POST', body, signal: ctrl.signal });
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  for (const line of value.split('\\n')) {
    if (!line.startsWith('data: ')) continue;
    const event = JSON.parse(line.slice(6));
    if (event.type === 'response.output_text.delta') output.append(event.delta);
  }
}`;

interface DemoShell {
  id: string;
  index: string;
  copy: DemoCopy;
  stage: string;
  /** Stack head/stage/notes vertically on desktop (for wide stages). */
  wide?: boolean;
}

const demo = ({ id, index, copy, stage, wide = false }: DemoShell): string => `
<article class="demo${wide ? ' demo--wide' : ''}" id="${id}" data-stop data-dive aria-labelledby="${id}-title">
  <header class="demo__head">
    <p class="demo__index">${index}</p>
    <h3 class="demo__title" id="${id}-title" data-fade-in>${esc(copy.title)}</h3>
    <p class="demo__intro">${copy.intro}</p>
  </header>
  <div class="demo__stage">${stage}</div>
  <ul class="demo__notes">${each(copy.notes, (n) => `<li>${n}</li>`)}</ul>
</article>`;

export const hoodSection = ({ c }: Page): string => {
  const h = c.t.hood;

  const tokenizer = demo({
    id: 'demo-tokens',
    index: '2.1',
    copy: h.tokens,
    stage: `
    <div class="tokenizer" data-demo="tokenizer">
      <label class="field-label" for="tokenizer-input">${esc(h.tokens.inputLabel)}</label>
      <textarea id="tokenizer-input" class="tokenizer__input" rows="3" spellcheck="false">${h.tokens.sample}</textarea>
      <div class="tokenizer__meta">
        <p><span class="tokenizer__count" data-token-count>–</span> ${esc(h.tokens.tokens)}</p>
        <p><span data-char-count>–</span> ${esc(h.tokens.characters)}</p>
        <p><span data-ratio>–</span> ${esc(h.tokens.ratio)}</p>
        <label class="switch"><input type="checkbox" data-show-ids /> <span>${esc(h.tokens.showIds)}</span></label>
      </div>
      <div class="tokenizer__output" data-token-output data-lenis-prevent aria-live="polite">
        <p class="tokenizer__loading">${esc(h.tokens.loading)}</p>
      </div>
    </div>`,
  });

  // The sampling sentence and its candidate tokens stay in English: they are real GPT tokens.
  const sampling = demo({
    id: 'demo-sampling',
    index: '2.2',
    copy: h.sampling,
    stage: `
    <div class="sampler" data-demo="sampling">
      <p class="sampler__prompt" lang="en"><span class="sampler__prompt-label">prompt →</span> The best way to style a component is with<span class="sampler__picked" data-picked></span><span class="caret" aria-hidden="true"></span></p>
      <div class="sampler__controls">
        <label class="slider">
          <span class="slider__label">temperature <output data-temp-out>1.00</output></span>
          <input type="range" min="0" max="2" step="0.05" value="1" data-temp />
        </label>
        <label class="slider">
          <span class="slider__label">top-p <output data-topp-out>1.00</output></span>
          <input type="range" min="0.05" max="1" step="0.05" value="1" data-topp />
        </label>
        <div class="sampler__buttons">
          <button class="pill-btn pill-btn--small" type="button" data-sample="1">Sample ×1</button>
          <button class="pill-btn pill-btn--small pill-btn--ghost" type="button" data-sample="100">Sample ×100</button>
        </div>
      </div>
      <ol class="sampler__bars" data-bars aria-label="${esc(h.sampling.barsAria)}"></ol>
    </div>`,
  });

  const attention = demo({
    id: 'demo-attention',
    index: '2.3',
    copy: h.attention,
    stage: `
    <div class="attention" data-demo="attention">
      <div class="attention__sentence" data-sentence role="group" lang="en" aria-label="${esc(h.attention.sentenceAria)}"></div>
      <svg class="attention__arcs" data-arcs aria-hidden="true"></svg>
      <p class="attention__readout" data-readout aria-live="polite">${esc(h.attention.readout)}</p>
    </div>`,
  });

  const training = demo({
    id: 'demo-training',
    index: '2.4',
    wide: true,
    copy: h.training,
    stage: `
    <ol class="pipeline">
      ${each(
        h.training.stages,
        ([title, body, meta], i) => `
        <li class="pipeline__step" data-reveal>
          <span class="pipeline__num">${String(i + 1).padStart(2, '0')}</span>
          <h4 class="pipeline__title">${esc(title)}</h4>
          <p class="pipeline__body">${esc(body)}</p>
          <p class="pipeline__meta">${esc(meta)}</p>
        </li>`,
      )}
    </ol>`,
  });

  const streaming = demo({
    id: 'demo-streaming',
    index: '2.5',
    copy: h.streaming,
    stage: `
    <div class="stream" data-demo="streaming">
      <div class="stream__chat">
        <p class="stream__bubble stream__bubble--user">${esc(h.streaming.question)}</p>
        <p class="stream__bubble stream__bubble--ai" data-stream-output aria-live="polite"></p>
        <div class="stream__actions">
          <button class="pill-btn pill-btn--small" type="button" data-stream-start>${esc(h.streaming.send)}</button>
          <button class="pill-btn pill-btn--small pill-btn--ghost" type="button" data-stream-abort disabled>${esc(h.streaming.stop)}</button>
        </div>
      </div>
      <div class="stream__wire">
        <p class="stream__wire-head">network · text/event-stream</p>
        <ol class="stream__log" data-stream-log data-lenis-prevent></ol>
      </div>
    </div>
    <pre class="code-block" data-lenis-prevent data-lang="ts"><code>${highlight(SSE_SNIPPET, 'ts')}</code></pre>`,
  });

  return `
<section class="hood" aria-label="${esc(h.aria)}">
  ${eyebrow(h.eyebrow, 'eyebrow hood__eyebrow')}
  ${tokenizer}${sampling}${attention}${training}${streaming}
</section>`;
};
