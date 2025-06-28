import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        search: './search.html',
        searchGifts: './search-gifts.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
