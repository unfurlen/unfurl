import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/unfurl/',
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        oxo: resolve(import.meta.dirname, 'oxo/index.html'),
        carto: resolve(import.meta.dirname, 'carto/index.html'),
      },
    },
  },
})
