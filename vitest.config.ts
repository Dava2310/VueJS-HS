import path from 'node:path';
import { defineConfig, defaultExclude } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...defaultExclude, '**/e2e/**'],
  },
});
