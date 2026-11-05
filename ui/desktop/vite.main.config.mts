import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    'process.env.GITHUB_OWNER': JSON.stringify(process.env.GITHUB_OWNER || 'aaif-arakan'),
    'process.env.GITHUB_REPO': JSON.stringify(process.env.GITHUB_REPO || 'arakan'),
    'process.env.ARAKAN_BUNDLE_NAME': JSON.stringify(process.env.ARAKAN_BUNDLE_NAME || 'Arakan'),
  },
});
