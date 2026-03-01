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
  server: {
    host: '0.0.0.0', // Esto permite conexiones externas
    port: Number(process.env.PORT) || 5173,
    strictPort: true, // Evita que Vite intente usar otro puerto si este falla
  },hmr: {
      // Aquí SI va tu dominio para que el navegador sepa a dónde reconectar
      host: 'uramosdev.up.railway.app', 
      clientPort: 443,
      protocol: 'wss',
    },
};
});