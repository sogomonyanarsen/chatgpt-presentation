import { capabilities } from '../data/capabilities';
import type { Capability } from '../data/types';
import { creditLine, zoomableImage } from './figure';
import { glyph } from './glyphs';
import { highlight } from './highlight';
import { each, esc, eyebrow } from './html';

const flow = (nodes: string[]): string => `
  <ol class="flow" aria-label="Data flow">
    ${each(nodes, (node) => `<li class="flow__node">${esc(node)}</li>`)}
  </ol>`;

const codeBlock = (code: NonNullable<Capability['code']>): string => `
  <figure class="cap__code">
    <figcaption class="cap__code-label">${esc(code.label)}</figcaption>
    <pre class="code-block" data-lenis-prevent data-lang="${esc(code.lang)}"><code>${highlight(code.source, code.lang)}</code></pre>
  </figure>`;

const tryPrompt = (prompt: string): string => `
  <div class="try">
    <p class="try__label">try it</p>
    <p class="try__prompt">${esc(prompt)}</p>
    <button class="try__copy" type="button" data-copy="${esc(prompt)}">Copy</button>
  </div>`;

const capability = (cap: Capability): string => `
<article class="cap" id="cap-${cap.id}" data-stop data-dive aria-labelledby="cap-${cap.id}-title">
  <header class="cap__head">
    <p class="cap__index">${cap.index}<span>/10</span></p>
    ${glyph(cap.glyph, 'glyph cap__glyph')}
    <h3 class="cap__name" id="cap-${cap.id}-title" data-fade-in>${esc(cap.name)}</h3>
    <p class="cap__tagline">${esc(cap.tagline)}</p>
    <p class="cap__what">${cap.what}</p>
    ${
      cap.image
        ? `<figure class="cap__figure">
            <div class="cap__figure-frame">${zoomableImage(cap.image)}</div>
            <figcaption class="cap__credit">${creditLine(cap.image)}</figcaption>
          </figure>`
        : ''
    }
  </header>
  <section class="cap__how" aria-label="How to use it">
    ${eyebrow('how to use', 'eyebrow cap__eyebrow')}
    <ol class="cap__steps">${each(cap.steps, (step) => `<li>${step}</li>`)}</ol>
    ${cap.tryPrompt ? tryPrompt(cap.tryPrompt) : ''}
  </section>
  <section class="cap__hood" aria-label="Under the hood">
    ${eyebrow('under the hood', 'eyebrow cap__eyebrow')}
    <p class="cap__hood-body">${cap.hood}</p>
    ${cap.flow ? flow(cap.flow) : ''}
    ${cap.code ? codeBlock(cap.code) : ''}
  </section>
  ${cap.devTip ? `<p class="cap__tip"><span class="cap__tip-label">dev tip</span>${cap.devTip}</p>` : ''}
</article>`;

export const capabilitiesSection = (): string => `
<section class="caps" aria-label="ChatGPT capabilities">
  ${each(capabilities, capability)}
</section>`;
