import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants.ts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@seo': path.resolve(__dirname, './src/seo.ts'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      exclude: [
        'dist/**',
        'coverage/**',
        'src/test/**',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
    env: {
      VITE_BACKEND_URL: '/v1',
      VITE_BOARD_IMAGES_BUCKET: 'https://cdn.example.com/board/',
      VITE_EVENT_FLYERS_BUCKET: 'https://cdn.example.com/events/',
    },
  },
});
