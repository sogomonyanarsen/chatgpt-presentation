import { credits } from '../data/sources';
import type { Figure } from '../data/types';
import { esc } from './html';

/** Attribution line for a figure. Throws at build time if a credit is missing. */
export const creditLine = (fig: Figure): string => {
  const credit = credits[fig.credit];
  if (!credit) throw new Error(`Missing credit "${fig.credit}" for ${fig.src}`);
  return `<a href="${credit.url}" target="_blank" rel="noopener noreferrer">${esc(credit.author)}</a>, ${esc(credit.license)}`;
};

/**
 * An image wrapped in a button that opens the zoom lightbox (effects/lightbox.ts).
 * The button keeps it keyboard-accessible; `data-credit` travels with it into the lightbox.
 */
export const zoomableImage = (fig: Figure): string => `
  <button class="zoomable" type="button" data-zoom data-caption="${esc(fig.caption ?? fig.alt)}" data-credit="${esc(creditLine(fig))}" aria-label="Enlarge image: ${esc(fig.alt)}">
    <img src="${fig.src}" width="${fig.width}" height="${fig.height}" alt="${esc(fig.alt)}"${fig.focus ? ` style="object-position: ${esc(fig.focus)}"` : ''} loading="lazy" decoding="async" />
  </button>`;
