import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const lib = (f: string) => resolve(import.meta.dirname, 'packages/loaders/src', f);

/** in development, a Portuguese loader page (/pt/arc/) gets pt/index.html, as it does on the server */
const portuguesePages: Plugin = {
  name: 'portuguese-pages',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && /^\/pt\/[a-z0-9-]+\/?(\?.*)?$/.test(req.url)) req.url = '/pt/index.html';
      next();
    });
  },
};

// The site: English at /, Portuguese at /pt/. It imports the package from its
// source, so the site always shows exactly what gets published.
export default defineConfig({
  plugins: [react(), tailwindcss(), portuguesePages],
  resolve: {
    alias: [
      { find: /^@coleoni\/loaders\/html$/, replacement: lib('html.ts') },
      { find: /^@coleoni\/loaders$/, replacement: lib('index.ts') },
    ],
  },
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        en: resolve(import.meta.dirname, 'index.html'),
        pt: resolve(import.meta.dirname, 'pt/index.html'),
      },
    },
  },
  test: { include: ['test/**/*.test.{ts,tsx}'] },
} as never);
