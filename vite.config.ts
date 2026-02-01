import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '$src': '/src',
    },
  },
  base: process.env.BASE_PATH || '/',
})
