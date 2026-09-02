import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['lead-engine/**/*.test.ts'],
    environment: 'node',
  },
});
