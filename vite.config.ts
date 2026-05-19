import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use '/ersetstore/' for GitHub Pages, '/' for Vercel/custom domain
const base = process.env.GITHUB_ACTIONS ? '/ersetstore/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
});
