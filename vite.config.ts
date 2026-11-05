import { defineConfig, type Plugin } from 'vite';
import { renderApp } from './src/templates/app';

/**
 * Pre-renders all presentation content into index.html at build/dev time.
 * Result: content is in the HTML on first paint (fast, crawlable, works without JS);
 * TypeScript modules then progressively enhance it with motion and live demos.
 */
const prerenderContent = (): Plugin => ({
  name: 'prerender-content',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace('<!--app-->', renderApp()),
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
  },
});
