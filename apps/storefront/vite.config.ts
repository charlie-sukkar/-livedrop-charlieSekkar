import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { configDefaults } from 'vitest/config'; // ✅ Add this


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
test: {
  ...configDefaults,
  include: ['src/**/*.test.tsx'],
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./vitest.setup.ts'],
},

  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
  }

})
