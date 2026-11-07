import { highlight } from './highlight';
import { esc, eyebrow } from './html';

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
  title: string;
  intro: string;
  stage: string;
  notes: string[];
  /** Stack head/stage/notes vertically on desktop (for wide stages). */
  wide?: boolean;
}

const demo = ({ id, index, title, intro, stage, notes, wide = false }: DemoShell): string => `
<article class="demo${wide ? ' demo--wide' : ''}" id="${id}" data-stop data-dive aria-labelledby="${id}-title">
  <header class="demo__head">
    <p class="demo__index">${index}</p>
    <h3 class="demo__title" id="${id}-title" data-scramble>${esc(title)}</h3>
    <p class="demo__intro">${intro}</p>
  </header>
  <div class="demo__stage">${stage}</div>
  <ul class="demo__notes">${notes.map((n) => `<li>${n}</li>`).join('')}</ul>
</article>`;

const tokenizer = demo({
  id: 'demo-tokens',
  index: '2.1',
  title: 'Tokens, not words',
  intro:
    'Before the model sees your prompt, a tokenizer splits it into sub-word pieces and maps each one to an integer ID. This demo runs the <strong>real</strong> <code>o200k_base</code> vocabulary used by modern GPT models (~200k tokens).',
  stage: `
    <div class="tokenizer" data-demo="tokenizer">
      <label class="field-label" for="tokenizer-input">Type anything</label>
      <textarea id="tokenizer-input" class="tokenizer__input" rows="3" spellcheck="false">SoftConstruct engineers ship &lt;button&gt;s, not buttons. Unbelievably, “strawberry” is just tokens to GPT. Բարև 👋</textarea>
      <div class="tokenizer__meta">
        <p><span class="tokenizer__count" data-token-count>–</span> tokens</p>
        <p><span data-char-count>–</span> characters</p>
        <p><span data-ratio>–</span> chars / token</p>
        <label class="switch"><input type="checkbox" data-show-ids /> <span>show IDs</span></label>
      </div>
      <div class="tokenizer__output" data-token-output data-lenis-prevent aria-live="polite">
        <p class="tokenizer__loading">Loading vocabulary…</p>
      </div>
    </div>`,
  notes: [
    'An English word is ~1.3 tokens on average. Code, emoji and non-Latin scripts such as Armenian use more.',
    '<strong>Pricing and context limits are counted in tokens</strong>, not characters.',
    'Why can models miscount letters in “strawberry”? They never see letters, only token IDs.',
  ],
});

const sampling = demo({
  id: 'demo-sampling',
  index: '2.2',
  title: 'One token at a time',
  intro:
    'The network outputs a score (<em>logit</em>) for every token in its vocabulary. <code>softmax(logits / T)</code> turns those scores into probabilities, then one token is <strong>sampled</strong>. It is appended to the input and the whole process repeats.',
  stage: `
    <div class="sampler" data-demo="sampling">
      <p class="sampler__prompt"><span class="sampler__prompt-label">prompt →</span> The best way to style a component is with<span class="sampler__picked" data-picked></span><span class="caret" aria-hidden="true"></span></p>
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
      <ol class="sampler__bars" data-bars aria-label="Next-token probabilities"></ol>
    </div>`,
  notes: [
    '<strong>T → 0</strong>: always take the top token (deterministic, can get repetitive). <strong>T &gt; 1</strong>: flatter distribution, more surprising output.',
    '<strong>top-p</strong> keeps the smallest set of tokens whose probabilities add up to p, and drops the long tail of unlikely tokens.',
    'Illustrative logits. A real model scores all ~200k tokens on every step.',
  ],
});

const attention = demo({
  id: 'demo-attention',
  index: '2.3',
  title: 'Attention: who looks at whom',
  intro:
    'Each token produces a <em>query</em>, a <em>key</em> and a <em>value</em>. A token’s query is compared with every key, and the resulting weights decide how much of each value flows into that token’s new representation. <strong>Hover or focus a token</strong>.',
  stage: `
    <div class="attention" data-demo="attention">
      <div class="attention__sentence" data-sentence role="group" aria-label="Sentence tokens"></div>
      <svg class="attention__arcs" data-arcs aria-hidden="true"></svg>
      <p class="attention__readout" data-readout aria-live="polite">Pick a token to see where it attends.</p>
      <pre class="attention__formula"><code>weights = softmax(q · Kᵀ / √d)    out = weights · V</code></pre>
    </div>`,
  notes: [
    'Try <strong>“it”</strong>: the model has to decide whether it refers to the bug or the build.',
    'Real models run dozens of attention <em>heads</em> per layer and stack 100+ layers. Each head learns different relations (syntax, coreference, position).',
    'Attention cost grows with the <strong>square of the context length</strong>, which is why long context is expensive.',
  ],
});

const stages = [
  [
    '01',
    'Pre-training',
    'Next-token prediction over trillions of tokens of web, books and code. Produces a “base model” that can continue any text.',
    'weeks · thousands of GPUs',
  ],
  [
    '02',
    'Supervised fine-tuning',
    'Trained on curated conversations written or checked by people, so it learns the assistant format.',
    'demonstrations',
  ],
  [
    '03',
    'RLHF',
    'A reward model learned from human rankings scores answers, and RL pushes the model toward helpful, honest and harmless responses.',
    'preferences',
  ],
  [
    '04',
    'Reasoning RL',
    'Rewards chains of thought that reach verifiably correct results in maths, code and tool use.',
    'verifiable rewards',
  ],
  [
    '05',
    'Deployment',
    'System prompt, tools, memory, safety classifiers and the router are added around the model. This is what you call “ChatGPT”.',
    'product layer',
  ],
] as const;

const training = demo({
  id: 'demo-training',
  index: '2.4',
  wide: true,
  title: 'How a model becomes ChatGPT',
  intro:
    'A modern assistant is built in stages. Each stage changes <em>behaviour</em> far more than it changes <em>knowledge</em>.',
  stage: `
    <ol class="pipeline">
      ${stages
        .map(
          ([n, title, body, meta]) => `
        <li class="pipeline__step" data-reveal>
          <span class="pipeline__num">${n}</span>
          <h4 class="pipeline__title">${title}</h4>
          <p class="pipeline__body">${body}</p>
          <p class="pipeline__meta">${meta}</p>
        </li>`,
        )
        .join('')}
    </ol>`,
  notes: [
    'The knowledge cut-off comes from stage 01. Anything newer needs search or tools.',
    'The <em>personality</em> (tone, refusals, formatting) mostly comes from stages 02–03.',
  ],
});

const streaming = demo({
  id: 'demo-streaming',
  index: '2.5',
  title: 'Why the text “types itself”',
  intro:
    'Tokens are generated one after another, so the API streams them as <strong>Server-Sent Events</strong> as soon as each is ready. The UI appends each delta, which is why answers seem to type. Press send and watch the wire.',
  stage: `
    <div class="stream" data-demo="streaming">
      <div class="stream__chat">
        <p class="stream__bubble stream__bubble--user">Explain CSS specificity in one paragraph.</p>
        <p class="stream__bubble stream__bubble--ai" data-stream-output aria-live="polite"></p>
        <div class="stream__actions">
          <button class="pill-btn pill-btn--small" type="button" data-stream-start>Send</button>
          <button class="pill-btn pill-btn--small pill-btn--ghost" type="button" data-stream-abort disabled>Stop (AbortController)</button>
        </div>
      </div>
      <div class="stream__wire">
        <p class="stream__wire-head">network · text/event-stream</p>
        <ol class="stream__log" data-stream-log data-lenis-prevent></ol>
      </div>
    </div>
    <pre class="code-block" data-lenis-prevent data-lang="ts"><code>${highlight(SSE_SNIPPET, 'ts')}</code></pre>`,
  notes: [
    'Time to first token is what makes a model <em>feel</em> fast. Stream every answer.',
    'Render Markdown incrementally and sanitise it. Model output is <strong>untrusted input</strong>.',
    'Production code also buffers partial lines across chunks. The loop above is simplified.',
  ],
});

export const hoodSection = (): string => `
<section class="hood" aria-label="Under the hood demos">
  ${eyebrow('runs locally · no API key', 'eyebrow hood__eyebrow')}
  ${tokenizer}${sampling}${attention}${training}${streaming}
</section>`;
