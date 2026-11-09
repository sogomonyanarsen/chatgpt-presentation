import type { Capability } from '../data/types';
import { creditLine, zoomableImage } from './figure';
import { glyph } from './glyphs';
import { highlight } from './highlight';
import { each, esc, eyebrow } from './html';
import type { Page } from './page';

const flow = (nodes: string[], label: string): string => `
  <ol class="flow" aria-label="${esc(label)}">
    ${each(nodes, (node) => `<li class="flow__node">${esc(node)}</li>`)}
  </ol>`;

const codeBlock = (code: NonNullable<Capability['code']>): string => `
  <figure class="cap__code">
    <figcaption class="cap__code-label">${esc(code.label)}</figcaption>
    <pre class="code-block" data-lenis-prevent data-lang="${esc(code.lang)}"><code>${highlight(code.source, code.lang)}</code></pre>
  </figure>`;

const tryPrompt = ({ c }: Page, prompt: string): string => `
  <div class="try">
    <p class="try__label">${esc(c.t.caps.tryIt)}</p>
    <p class="try__prompt">${esc(prompt)}</p>
    <button class="try__copy" type="button" data-copy="${esc(prompt)}">${esc(c.t.caps.copy)}</button>
  </div>`;

const capability = (page: Page, cap: Capability): string => {
  const t = page.c.t.caps;
  return `
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
            <div class="cap__figure-frame">${zoomableImage(page, cap.image)}</div>
            <figcaption class="cap__credit">${creditLine(cap.image)}</figcaption>
          </figure>`
        : ''
    }
  </header>
  <section class="cap__how" aria-label="${esc(t.howToAria)}">
    ${eyebrow(t.howTo, 'eyebrow cap__eyebrow')}
    <ol class="cap__steps">${each(cap.steps, (step) => `<li>${step}</li>`)}</ol>
    ${cap.tryPrompt ? tryPrompt(page, cap.tryPrompt) : ''}
  </section>
  <section class="cap__hood" aria-label="${esc(t.underHood)}">
    ${eyebrow(t.underHood, 'eyebrow cap__eyebrow')}
    <p class="cap__hood-body">${cap.hood}</p>
    ${cap.flow ? flow(cap.flow, t.flowAria) : ''}
    ${cap.code ? codeBlock(cap.code) : ''}
  </section>
  ${cap.devTip ? `<p class="cap__tip"><span class="cap__tip-label">${esc(t.devTip)}</span>${cap.devTip}</p>` : ''}
</article>`;
};

export const capabilitiesSection = (page: Page): string => `
<section class="caps" aria-label="${esc(page.c.t.caps.aria)}">
  ${each(page.c.capabilities, (cap) => capability(page, cap))}
</section>`;
