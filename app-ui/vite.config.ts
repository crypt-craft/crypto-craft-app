import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // Дозволяємо роботу за нестандартними хостами (через nginx)
    allowedHosts: (process.env.VITE_ALLOWED_HOSTS || 'localhost,127.0.0.1,app.crypto-craft.local,app.crypto-craft.net')
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean),
    host: true, // слухати всі інтерфейси в контейнері
    port: 5173,
    strictPort: true,
    hmr: {
      host: process.env.VITE_HMR_HOST || 'app.crypto-craft.local',
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT || '443'),
      protocol: process.env.VITE_HMR_PROTOCOL || 'wss',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});