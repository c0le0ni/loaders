import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The published package: ES modules, React left to the app that installs it.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: { index: resolve(import.meta.dirname, 'src/index.ts'), html: resolve(import.meta.dirname, 'src/html.ts') },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
