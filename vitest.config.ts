import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vitest/config';

// Votre configuration Vite standard
const viteConfig = defineConfig({
  plugins: [react()],
  // ...autres configurations
});

// Votre configuration spécifique à Vitest
const vitestConfig = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // ...autres paramètres de test
  },
});

// Fusion des deux configurations
export default mergeConfig(viteConfig, vitestConfig);
