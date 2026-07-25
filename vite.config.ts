import { defineConfig } from 'vitest/config'

// User GitHub Pages site: smishr16.github.io → base must be '/'
export default defineConfig({
  base: '/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
