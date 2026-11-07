import { prefersReducedMotion } from '../core/motion';
import { gsap, stopScroll } from '../core/scroll';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const MARGIN = 0.08; // fraction of the viewport kept free around the zoomed image

/** Largest box with the image's aspect ratio that fits the viewport, centred. */
const fitToViewport = (img: HTMLImageElement): Box => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ratio = img.naturalWidth / img.naturalHeight || img.width / img.height;
  const maxW = vw * (1 - MARGIN * 2);
  const maxH = vh * (1 - MARGIN * 2) - 48; // room for the caption
  const width = Math.min(maxW, maxH * ratio);
  const height = width / ratio;
  return { left: (vw - width) / 2, top: (vh - height - 48) / 2, width, height };
};

const boxOf = (el: Element): Box => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/**
 * Click-to-zoom for every `[data-zoom]` image button.
 *
 * FLIP-style: a fixed “frame” starts exactly over the clicked thumbnail (cropped like it,
 * via `object-fit: cover`) and grows to the centre of the screen, where its aspect ratio
 * matches the image so the crop disappears. While open, the image drifts against the
 * pointer for a subtle parallax depth. Click, Esc or the close button reverses it.
 */
export const initLightbox = (): void => {
  const reduced = prefersReducedMotion();

  const root = document.createElement('div');
  root.className = 'lightbox';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Enlarged image');
  root.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__frame"><img class="lightbox__img" alt="" /></div>
    <p class="lightbox__caption"><span class="lightbox__title"></span><span class="lightbox__credit"></span></p>
    <button class="lightbox__close" type="button" aria-label="Close image">×</button>`;
  document.body.append(root);

  const backdrop = root.querySelector<HTMLElement>('.lightbox__backdrop');
  const frame = root.querySelector<HTMLElement>('.lightbox__frame');
  const image = root.querySelector<HTMLImageElement>('.lightbox__img');
  const caption = root.querySelector<HTMLElement>('.lightbox__caption');
  const title = root.querySelector<HTMLElement>('.lightbox__title');
  const credit = root.querySelector<HTMLElement>('.lightbox__credit');
  const closeButton = root.querySelector<HTMLButtonElement>('.lightbox__close');
  if (!backdrop || !frame || !image || !caption || !title || !credit || !closeButton) return;

  let trigger: HTMLButtonElement | null = null;
  let animating = false;

  const onPointer = (e: PointerEvent): void => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    gsap.to(image, { x: x * -36, y: y * -28, duration: 0.8, ease: 'power3.out' });
  };

  const open = (button: HTMLButtonElement): void => {
    const source = button.querySelector('img');
    if (!source || animating) return;
    trigger = button;
    animating = true;

    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    title.textContent = button.dataset.caption ?? '';
    credit.innerHTML = button.dataset.credit ?? ''; // repo-authored attribution markup

    const from = boxOf(button);
    const to = fitToViewport(source);
    root.hidden = false;
    document.body.classList.add('is-lightbox-open');
    stopScroll(true);
    button.style.visibility = 'hidden';
    closeButton.focus({ preventScroll: true });

    const tl = gsap.timeline({
      onComplete: () => {
        animating = false;
        if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });
      },
    });
    tl.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: reduced ? 0 : 0.5, ease: 'power2.out' },
      0,
    )
      .fromTo(frame, from, { ...to, duration: reduced ? 0 : 0.75, ease: 'expo.inOut' }, 0)
      // Starts slightly zoomed so the parallax drift never reveals the frame edge.
      .fromTo(
        image,
        { scale: 1, x: 0, y: 0 },
        { scale: 1.08, duration: reduced ? 0 : 1.1, ease: 'power3.out' },
        0.2,
      )
      .fromTo(
        [caption, closeButton],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: reduced ? 0 : 0.4, stagger: 0.05 },
        reduced ? 0 : 0.55,
      );
  };

  const close = (): void => {
    if (!trigger || animating) return;
    const button = trigger;
    animating = true;
    window.removeEventListener('pointermove', onPointer);

    gsap
      .timeline({
        onComplete: () => {
          root.hidden = true;
          button.style.visibility = '';
          document.body.classList.remove('is-lightbox-open');
          stopScroll(false);
          button.focus({ preventScroll: true });
          trigger = null;
          animating = false;
        },
      })
      .to([caption, closeButton], { opacity: 0, duration: reduced ? 0 : 0.2 }, 0)
      .to(image, { scale: 1, x: 0, y: 0, duration: reduced ? 0 : 0.5, ease: 'power2.inOut' }, 0)
      .to(frame, { ...boxOf(button), duration: reduced ? 0 : 0.65, ease: 'expo.inOut' }, 0)
      .to(backdrop, { opacity: 0, duration: reduced ? 0 : 0.5 }, 0.15);
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
  window.addEventListener('resize', () => {
    if (!root.hidden && !animating && trigger) {
      const img = trigger.querySelector('img');
      if (img) gsap.set(frame, fitToViewport(img));
    }
  });
};
