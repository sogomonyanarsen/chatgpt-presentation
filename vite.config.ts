import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { renderApp } from './src/templates/app';

const page = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

/**
 * Pre-renders all presentation content into each HTML entry at build/dev time:
 * `/index.html` in English, `/hy/index.html` in Armenian.
 * Content is in the HTML on first paint (fast, crawlable, works without JS);
 * TypeScript modules then progressively enhance it with motion and live demos.
 */
const prerenderContent = (): Plugin => ({
  name: 'prerender-content',
  transformIndexHtml: {
    order: 'pre',
    handler: (html, ctx) => {
      const lang = /[\\/]hy[\\/]index\.html$/.test(ctx.filename) ? 'hy' : 'en';
      return html.replace('<!--app-->', renderApp(lang));
    },
  },
});

export default defineConfig({
  // Relative base: works on GitHub Pages sub-paths and any static host.
  base: './',
  plugins: [prerenderContent()],
  build: {
    target: 'es2022',
    // The only large chunk is the lazily-loaded o200k tokenizer vocabulary (~2 MB, fetched on demand).
    chunkSizeWarningLimit: 2200,
    rolldownOptions: {
      input: { en: page('./index.html'), hy: page('./hy/index.html') },
    },
  },
});
