import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    'process.env.ARAKAN_TUNNEL': JSON.stringify(process.env.ARAKAN_TUNNEL !== 'no' && process.env.ARAKAN_TUNNEL !== 'none'),
  },

  plugins: [tailwindcss()],

  // Vite caches a copy of @aaif/arakan-acp-client and doesn't notice when we rebuild it
  // locally, so it serves stale code until you clear node_modules/.vite by hand.
  // Excluding it makes Vite always read the latest ui/arakan-acp-client/dist build.
  // Dev-server only — release builds ignore optimizeDeps.
  optimizeDeps: {
    exclude: ['@aaif/arakan-acp-client'],
  },

  build: {
    target: 'esnext'
  },
});
