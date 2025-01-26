import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    outDir: 'dist',  // Ensure this points to your build folder
    copyPublicDir: true, // Ensures public files (like _redirects) are copied to dist
  },
});
