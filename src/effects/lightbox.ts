import { stopScroll } from '../core/scroll';
import { rt } from '../i18n/runtime';

/** Drawn as two strokes in a 24×24 box so it sits exactly centred in the round button. */
const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

/**
 * Mark each zoomable image once loaded, so tinted frames only show their colour overlay
 * over a real picture (never as a flat block while the image is still downloading).
 */
const markLoaded = (): void => {
  document.querySelectorAll<HTMLImageElement>('[data-zoom] img').forEach((img) => {
    const done = (): void => {
      img.dataset.loaded = '';
    };
    if (img.complete && img.naturalWidth > 0) done();
    else img.addEventListener('load', done, { once: true });
  });
};

/**
 * Click-to-zoom for every `[data-zoom]` image button.
 * Opens instantly: a full-screen dialog shows the image uncropped and in full colour,
 * centred by CSS. Click anywhere, press Esc, or use the close button to dismiss.
 */
export const initLightbox = (): void => {
  markLoaded();

  const root = document.createElement('div');
  root.className = 'lightbox';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', rt().enlargedImage);
  root.innerHTML = `
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__caption">
        <span class="lightbox__title"></span><span class="lightbox__credit"></span>
      </figcaption>
    </figure>
    <button class="lightbox__close" type="button" aria-label="${rt().closeImage}">${CLOSE_ICON}</button>`;
  document.body.append(root);

  const image = root.querySelector<HTMLImageElement>('.lightbox__img');
  const title = root.querySelector<HTMLElement>('.lightbox__title');
  const credit = root.querySelector<HTMLElement>('.lightbox__credit');
  const closeButton = root.querySelector<HTMLButtonElement>('.lightbox__close');
  if (!image || !title || !credit || !closeButton) return;

  let trigger: HTMLButtonElement | null = null;

  const open = (button: HTMLButtonElement): void => {
    const source = button.querySelector('img');
    if (!source) return;
    trigger = button;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    title.textContent = button.dataset.caption ?? '';
    credit.innerHTML = button.dataset.credit ?? ''; // repo-authored attribution markup
    root.hidden = false;
    document.body.classList.add('is-lightbox-open');
    stopScroll(true);
    closeButton.focus({ preventScroll: true });
  };

  const close = (): void => {
    if (root.hidden) return;
    root.hidden = true;
    document.body.classList.remove('is-lightbox-open');
    stopScroll(false);
    trigger?.focus({ preventScroll: true });
    trigger = null;
  };

  document.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-zoom]');
    if (button) open(button);
  });
  root.addEventListener('click', (event) => {
    // Credit links stay clickable; anything else closes.
    if ((event.target as Element).closest('a')) return;
    close();
  });
  window.addEventListener('keydown', (event) => {
    if (root.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      event.preventDefault(); // single focusable control: keep focus inside the dialog
      closeButton.focus();
    }
  });
};
