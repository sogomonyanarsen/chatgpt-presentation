import { qs } from '../core/dom';

const TOKENS = [
  'The',
  'developer',
  'fixed',
  'the',
  'bug',
  'because',
  'it',
  'crashed',
  'the',
  'build',
  '.',
];

/**
 * Hand-tuned, illustrative attention weights (query → key). Keys not listed share the remaining mass.
 * GPT models use *causal* attention: a token may only attend to itself and earlier tokens.
 */
const SALIENT: Record<number, Record<number, number>> = {
  1: { 0: 0.35, 1: 0.65 },
  2: { 1: 0.55, 2: 0.35 },
  3: { 2: 0.4, 3: 0.6 },
  4: { 2: 0.45, 3: 0.2, 4: 0.3 },
  5: { 2: 0.35, 4: 0.25, 5: 0.35 },
  6: { 4: 0.52, 1: 0.18, 6: 0.15, 5: 0.08 },
  7: { 6: 0.38, 4: 0.3, 7: 0.22 },
  8: { 7: 0.4, 8: 0.55 },
  9: { 7: 0.42, 9: 0.3, 8: 0.13 },
  10: { 2: 0.15, 7: 0.2, 9: 0.25, 10: 0.2 },
};

const weightsFor = (query: number): number[] => {
  const salient = SALIENT[query] ?? { [query]: 1 };
  const assigned = Object.values(salient).reduce((a, b) => a + b, 0);
  const others = Array.from({ length: query + 1 }, (_, k) => k).filter((k) => !(k in salient));
  const share = others.length ? Math.max(0, 1 - assigned) / others.length : 0;
  return TOKENS.map((_, k) => (k > query ? 0 : (salient[k] ?? share)));
};

export const initAttention = (root: HTMLElement): void => {
  const sentence = qs('[data-sentence]', root);
  const svg = qs<SVGSVGElement>('[data-arcs]', root);
  const readout = qs('[data-readout]', root);

  sentence.innerHTML = TOKENS.map(
    (t, i) =>
      `<button type="button" class="attn-token" data-i="${i}" aria-pressed="false">${t}</button>`,
  ).join('');
  const buttons = Array.from(sentence.children) as HTMLButtonElement[];
  let current = 6;

  const draw = (): void => {
    const weights = weightsFor(current);
    const box = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

    const anchor = (el: Element): { x: number; y: number } => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top };
    };
    const from = anchor(buttons[current] as Element);

    svg.innerHTML = weights
      .map((w, k) => {
        if (k === current || w < 0.02) return '';
        const to = anchor(buttons[k] as Element);
        const lift = Math.min(90, 18 + Math.abs(from.x - to.x) * 0.35);
        return `<path d="M${from.x},${from.y} Q${(from.x + to.x) / 2},${from.y - lift} ${to.x},${to.y}"
          stroke-width="${(1 + w * 9).toFixed(1)}" stroke-opacity="${(0.25 + w * 0.75).toFixed(2)}" />`;
      })
      .join('');

    buttons.forEach((b, k) => {
      b.style.setProperty('--w', (weights[k] ?? 0).toFixed(3));
      b.setAttribute('aria-pressed', String(k === current));
      b.classList.toggle('is-future', k > current);
    });

    const top = weights
      .map((w, k) => ({ w, k }))
      .filter(({ k }) => k !== current)
      .sort((a, b) => b.w - a.w)
      .slice(0, 2)
      .map(({ w, k }) => `“${TOKENS[k] ?? ''}” ${(w * 100).toFixed(0)}%`)
      .join(', ');
    readout.textContent = `“${TOKENS[current] ?? ''}” attends most to ${top || 'itself'}. Greyed-out words come later, so it can’t see them yet.`;
  };

  const select = (event: Event): void => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.attn-token');
    if (!button) return;
    current = Number(button.dataset.i);
    draw();
  };

  sentence.addEventListener('pointerover', select);
  sentence.addEventListener('focusin', select);
  new ResizeObserver(draw).observe(root);
  draw();
};
