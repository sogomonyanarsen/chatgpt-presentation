import { esc } from './html';

/**
 * Minimal build-time syntax highlighter for the TS/JSON/Markdown snippets on the page.
 * Deliberately tiny — no runtime dependency, no client JS. Each token is escaped individually.
 */
const KEYWORDS = new Set(
  'const let var await async for of if else return new import from export type interface function true false null break continue'.split(
    ' ',
  ),
);

const TS_PATTERN =
  /(\/\/[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

const span = (cls: string, text: string): string => `<span class="tok-${cls}">${esc(text)}</span>`;

const highlightTs = (source: string): string => {
  let out = '';
  let last = 0;
  for (const m of source.matchAll(TS_PATTERN)) {
    const [text, comment, str, num, fn, ident] = m;
    out += esc(source.slice(last, m.index));
    if (comment) out += span('c', text);
    else if (str) out += span('s', text);
    else if (num) out += span('n', text);
    else if (fn) out += KEYWORDS.has(fn) ? span('k', text) : span('f', text);
    else if (ident && KEYWORDS.has(ident)) out += span('k', text);
    else out += esc(text);
    last = m.index + text.length;
  }
  return out + esc(source.slice(last));
};

const highlightMd = (source: string): string =>
  source
    .split('\n')
    .map((line) =>
      line.startsWith('#')
        ? span('k', line)
        : esc(line).replace(/`([^`]+)`/g, '<span class="tok-s">`$1`</span>'),
    )
    .join('\n');

export const highlight = (source: string, lang: string): string => {
  if (lang === 'ts' || lang === 'json') return highlightTs(source);
  if (lang === 'md') return highlightMd(source);
  return esc(source);
};
