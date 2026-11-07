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
    <h3 class="demo__title" id="${id}-title" data-fade-in>${esc(title)}</h3>
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
    'AI models don’t read letters or words. They read <strong>tokens</strong>: common chunks of text, each with a number. Type below to see how ChatGPT really splits your text (this uses the <strong>real</strong> GPT vocabulary).',
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
    'Common English words are usually one token. Rare words, code, emoji and Armenian text take more.',
    '<strong>Prices and length limits are counted in tokens</strong>, not characters.',
    'This is why AI can miscount the letters in “strawberry”: it never sees single letters.',
  ],
});

const sampling = demo({
  id: 'demo-sampling',
  index: '2.2',
  title: 'Guessing the next word',
  intro:
    'At every step the model gives each possible next word a <strong>chance</strong>, then picks one, a bit like a weighted dice roll. It adds that word and repeats. Press <em>Sample</em> to roll the dice.',
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
    '<strong>Low temperature</strong> = safe and predictable (always the favourite). <strong>High temperature</strong> = more creative and random.',
    '<strong>top-p</strong> throws away the unlikely options before rolling, so answers don’t go off the rails.',
    'The numbers here are made up for the demo. A real model scores all ~200,000 tokens at every step.',
  ],
});

const attention = demo({
  id: 'demo-attention',
  index: '2.3',
  title: 'Attention: which words matter',
  intro:
    'To understand a word, the model looks back at the other words and decides which ones matter most. That’s <strong>attention</strong>. <strong>Hover over a word</strong> to see where it looks. Thicker line = more important.',
  stage: `
    <div class="attention" data-demo="attention">
      <div class="attention__sentence" data-sentence role="group" aria-label="Sentence tokens"></div>
      <svg class="attention__arcs" data-arcs aria-hidden="true"></svg>
      <p class="attention__readout" data-readout aria-live="polite">Pick a token to see where it attends.</p>
    </div>`,
  notes: [
    'Try <strong>“it”</strong>: does it mean the bug or the build? Attention is how the model figures that out.',
    'Words can only look <em>back</em>, never ahead. That’s because the model writes one word at a time.',
    'Real models do this in many layers at once, each noticing different things (grammar, meaning, position).',
  ],
});

const stages = [
  [
    '01',
    'Pre-training',
    'Reads a huge part of the internet, books and code, guessing the next word over and over. Result: a model that knows a lot but just rambles.',
    'months · thousands of GPUs',
  ],
  [
    '02',
    'Learning by example',
    'Studies thousands of good example conversations written by people, so it learns to behave like a helpful assistant.',
    'good examples',
  ],
  [
    '03',
    'Human feedback',
    'People compare answers and pick the better one. The model is trained to give the kind of answers people prefer.',
    '👍 / 👎',
  ],
  [
    '04',
    'Practice problems',
    'Solves maths and coding problems with checkable answers, and gets rewarded when its step-by-step thinking reaches the right result.',
    'right / wrong',
  ],
  [
    '05',
    'Deployment',
    'The app around the model: instructions, web search, memory, safety filters and the fast/thinking switch. Together, that’s “ChatGPT”.',
    'the product',
  ],
] as const;

const training = demo({
  id: 'demo-training',
  index: '2.4',
  wide: true,
  title: 'How a model becomes ChatGPT',
  intro:
    'An assistant is built in stages. The first stage gives it knowledge, and the later ones teach it how to behave.',
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
    'What it “knows” stops at the date of stage 01. For anything newer it needs web search.',
    'Its personality (tone, politeness, formatting) mostly comes from stages 02 and 03.',
  ],
});

const streaming = demo({
  id: 'demo-streaming',
  index: '2.5',
  title: 'Why the text “types itself”',
  intro:
    'The model creates its answer one piece at a time, so the server sends each piece the moment it’s ready (using <strong>Server-Sent Events</strong>). The page adds them as they arrive, which is why the text appears to type itself. Press Send and watch the network messages on the right.',
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
    'Showing the first words quickly makes AI <em>feel</em> fast, even if the full answer takes a while. Always stream.',
    'Treat AI output like user input: <strong>sanitise it</strong> before putting it in the page.',
    'The code above is simplified to show the idea.',
  ],
});

export const hoodSection = (): string => `
<section class="hood" aria-label="Under the hood demos">
  ${eyebrow('runs locally · no API key', 'eyebrow hood__eyebrow')}
  ${tokenizer}${sampling}${attention}${training}${streaming}
</section>`;
