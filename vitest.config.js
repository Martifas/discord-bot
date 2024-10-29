import path from 'node:path'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      exclude: [...configDefaults.exclude, '**/types', '**/model.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
})
