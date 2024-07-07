import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },

  server: {
    port: 3000,
    open: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/styles/scss/main";
      `,
      },
      modules: {
        scopeBehaviour: 'local',
      },
    },
  },
});