import { defineConfig } from 'vitest/config'

// User GitHub Pages site: smishr16.github.io → base must be '/'
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/codemirror') || id.includes('node_modules/@codemirror') || id.includes('node_modules/@lezer')) {
            return 'codemirror'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
