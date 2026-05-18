import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path. Repo: stevencau302-lgtm/ersetstore
export default defineConfig({
  plugins: [react()],
  base: '/ersetstore/',
});
