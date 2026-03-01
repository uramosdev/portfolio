import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';



export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // vite.config.ts
  server: {
    host: '0.0.0.0', // Permite que Railway vea el servidor interno
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    // AQUÍ ESTÁ LA SOLUCIÓN AL ERROR DE "BLOCKED REQUEST"
    allowedHosts: [
      'uramosdev.up.railway.app',
      '.railway.app' // Esto permite cualquier subdominio de railway
    ],
    hmr: {
      host: 'uramosdev.up.railway.app',
      clientPort: 443,
      protocol: 'wss',
    },
  },
  };
});

