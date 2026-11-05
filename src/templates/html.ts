/**
 * Tiny string-templating helpers used at build time (see vite.config.ts → prerender plugin).
 * Plain strings are escaped with `esc`; fields typed `Rich` are trusted, repo-authored HTML.
 */
const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const esc = (value: string): string => value.replace(/[&<>"']/g, (ch) => ENTITIES[ch] ?? ch);

export const each = <T>(items: readonly T[], render: (item: T, index: number) => string): string =>
  items.map(render).join('');

/** Wrap text in `{ … }` braces — the recurring “digital” eyebrow motif. */
export const eyebrow = (text: string, className = 'eyebrow'): string =>
  `<p class="${className}"><span aria-hidden="true">{ </span>${esc(text)}<span aria-hidden="true"> }</span></p>`;
