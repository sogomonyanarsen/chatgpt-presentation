import { qs } from '../core/dom';

const PALETTE_SIZE = 6;

/** Render one token as a chip. Whitespace is made visible so students can see leading spaces. */
const chip = (text: string, id: number, index: number): HTMLElement => {
  const el = document.createElement('span');
  el.className = `token token--c${index % PALETTE_SIZE}`;
  el.dataset.id = String(id);
  el.textContent = text.replace(/ /g, '·').replace(/\n/g, '↵');
  el.title = `id ${id}`;
  return el;
};

/**
 * Live tokenizer using the real o200k_base BPE vocabulary.
 * The vocabulary (~2 MB) is code-split and only fetched when this demo nears the viewport.
 */
export const initTokenizer = async (root: HTMLElement): Promise<void> => {
  const input = qs<HTMLTextAreaElement>('textarea', root);
  const output = qs('[data-token-output]', root);
  const count = qs('[data-token-count]', root);
  const chars = qs('[data-char-count]', root);
  const ratio = qs('[data-ratio]', root);
  const showIds = qs<HTMLInputElement>('[data-show-ids]', root);

  const { encode, decode } = await import('gpt-tokenizer/encoding/o200k_base');
  const segmenter = new Intl.Segmenter();

  let frame = 0;
  const render = (): void => {
    const text = input.value;
    const ids = encode(text);
    const fragment = document.createDocumentFragment();

    // Multi-byte characters (emoji, Armenian) can be split mid-character; decode each token
    // and fall back to the replacement char so the UI never shows broken surrogates.
    ids.forEach((id, i) => {
      const piece = decode([id]);
      fragment.append(chip(piece.includes('�') ? '�' : piece, id, i));
    });

    output.replaceChildren(fragment);
    const graphemes = [...segmenter.segment(text)].length;
    count.textContent = String(ids.length);
    chars.textContent = String(graphemes);
    ratio.textContent = ids.length ? (graphemes / ids.length).toFixed(2) : '–';
  };

  input.addEventListener('input', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  });
  showIds.addEventListener('change', () => {
    root.classList.toggle('is-showing-ids', showIds.checked);
  });
  render();
};
