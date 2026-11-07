import { prefersReducedMotion } from '../core/motion';

/** Uppercase pool with similar advance widths in the display face, so lines don't re-wrap. */
const GLYPHS = 'ABCDEFGHKMNOPRSTUVXYZ0123456789#%&@';
const DURATION_MS = 900;
const SWAP_EVERY_MS = 45;

const randomGlyph = (): string => GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));

/** Keep spaces and punctuation stable: only letters/digits scramble, so word lengths never change. */
const isScramblable = (ch: string): boolean => /[\p{L}\p{N}]/u.test(ch);

/**
 * Decodes a heading from random glyphs into its real text, left to right.
 *
 * The real text never changes: it stays in place (transparent) and keeps the layout box fixed,
 * while an `aria-hidden` overlay positioned over it shows the scrambled glyphs. So there is
 * no reflow per frame, no final “snap”, and the accessible name is untouched.
 */
export const scramble = (el: HTMLElement): void => {
  const text = el.textContent;
  const overlay = document.createElement('span');
  overlay.className = 'scramble';
  overlay.setAttribute('aria-hidden', 'true');
  el.classList.add('is-scrambling');
  el.append(overlay);

  // Grapheme-safe split (emoji, combining marks) — as the lint rule requires.
  const chars = Array.from(new Intl.Segmenter().segment(text), (g) => g.segment);
  let start = 0;
  let lastSwap = -Infinity;

  const frame = (now: number): void => {
    start ||= now;
    const t = Math.min(1, (now - start) / DURATION_MS);
    if (t === 1) {
      overlay.remove();
      el.classList.remove('is-scrambling');
      return;
    }
    if (now - lastSwap >= SWAP_EVERY_MS) {
      lastSwap = now;
      // Ease-out reveal: quick start, gentle settle on the last few characters.
      const revealed = Math.floor((1 - (1 - t) ** 2) * chars.length);
      overlay.textContent = chars
        .map((ch, i) => (i < revealed || !isScramblable(ch) ? ch : randomGlyph()))
        .join('');
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

/** Scramble every `[data-scramble]` heading once, when it is comfortably inside the viewport. */
export const initScramble = (): void => {
  if (prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        scramble(entry.target as HTMLElement);
      }
    },
    // Start only once the heading is past the lower third: by then dive/cover fades are mostly done.
    { rootMargin: '0px 0px -35% 0px', threshold: 1 },
  );
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    io.observe(el);
  });
};
