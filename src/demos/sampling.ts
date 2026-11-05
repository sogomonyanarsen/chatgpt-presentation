import { qs } from '../core/dom';

interface Candidate {
  token: string;
  logit: number;
}

/** Illustrative next-token logits for “The best way to style a component is with…”. */
const CANDIDATES: Candidate[] = [
  { token: ' CSS', logit: 3.2 },
  { token: ' SCSS', logit: 2.9 },
  { token: ' Tailwind', logit: 2.6 },
  { token: ' a', logit: 2.1 },
  { token: ' BEM', logit: 1.7 },
  { token: ' styled', logit: 1.3 },
  { token: ' care', logit: 0.6 },
  { token: ' inline', logit: 0.2 },
  { token: ' love', logit: -0.4 },
  { token: ' Comic Sans', logit: -1.6 },
];

/** softmax(logits / T). T → 0 collapses to argmax (greedy decoding). */
export const softmax = (logits: number[], temperature: number): number[] => {
  if (temperature < 0.01) {
    const max = Math.max(...logits);
    return logits.map((l) => (l === max ? 1 : 0));
  }
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - max)); // subtract max for numerical stability
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
};

/** Nucleus filter: keep the smallest high-probability set whose mass ≥ p, then renormalise. */
export const topP = (probs: number[], p: number): number[] => {
  const order = probs.map((prob, i) => ({ prob, i })).sort((a, b) => b.prob - a.prob);
  const keep = new Set<number>();
  let mass = 0;
  for (const { prob, i } of order) {
    keep.add(i);
    mass += prob;
    if (mass >= p) break;
  }
  const kept = probs.map((prob, i) => (keep.has(i) ? prob : 0));
  const total = kept.reduce((a, b) => a + b, 0);
  return kept.map((prob) => prob / total);
};

const sample = (probs: number[]): number => {
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i] ?? 0;
    if (r <= 0) return i;
  }
  return probs.length - 1;
};

export const initSampling = (root: HTMLElement): void => {
  const temp = qs<HTMLInputElement>('[data-temp]', root);
  const topp = qs<HTMLInputElement>('[data-topp]', root);
  const tempOut = qs('[data-temp-out]', root);
  const toppOut = qs('[data-topp-out]', root);
  const bars = qs('[data-bars]', root);
  const picked = qs('[data-picked]', root);

  let counts = new Array<number>(CANDIDATES.length).fill(0);
  let probs: number[] = [];

  bars.innerHTML = CANDIDATES.map(
    (c) => `
    <li class="bar">
      <span class="bar__token">${c.token.replace(/ /g, '·')}</span>
      <span class="bar__track"><span class="bar__fill"></span><span class="bar__hits"></span></span>
      <span class="bar__value"></span>
    </li>`,
  ).join('');
  const rows = Array.from(bars.children) as HTMLElement[];

  const render = (): void => {
    const t = Number(temp.value);
    const p = Number(topp.value);
    tempOut.textContent = t.toFixed(2);
    toppOut.textContent = p.toFixed(2);
    probs = topP(
      softmax(
        CANDIDATES.map((c) => c.logit),
        t,
      ),
      p,
    );
    const totalHits = counts.reduce((a, b) => a + b, 0) || 1;

    rows.forEach((row, i) => {
      const prob = probs[i] ?? 0;
      row.classList.toggle('is-cut', prob === 0);
      qs('.bar__fill', row).style.transform = `scaleX(${prob})`;
      qs('.bar__hits', row).style.transform = `scaleX(${(counts[i] ?? 0) / totalHits})`;
      qs('.bar__value', row).textContent = `${(prob * 100).toFixed(1)}%`;
    });
  };

  const resetCounts = (): void => {
    counts = counts.map(() => 0);
    render();
  };

  temp.addEventListener('input', resetCounts);
  topp.addEventListener('input', resetCounts);

  root.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-sample]');
    if (!button) return;
    const n = Number(button.dataset.sample);
    let last = 0;
    for (let k = 0; k < n; k++) {
      last = sample(probs);
      counts[last] = (counts[last] ?? 0) + 1;
    }
    picked.textContent = CANDIDATES[last]?.token ?? '';
    picked.classList.remove('is-new');
    picked.getBoundingClientRect(); // force reflow so the highlight animation restarts
    picked.classList.add('is-new');
    render();
  });

  render();
};
