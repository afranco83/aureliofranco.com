import { defineConfig } from 'vitest/config';
import { aliases } from './aliases.mjs';

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: aliases,
  },
});
