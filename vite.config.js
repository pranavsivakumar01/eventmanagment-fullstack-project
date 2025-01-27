import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    outDir: 'dist', // Vercel deploys from the "dist" folder
    copyPublicDir: true, // Ensures public files like _redirects are copied
  },
  server: {
    open: true, // Opens the app in the browser when starting the dev server
  },
});
