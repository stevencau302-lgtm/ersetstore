import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path: '/ersetstore/' for GitHub Pages, '/' for Vercel/local
const base = process.env.GITHUB_ACTIONS ? '/ersetstore/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
