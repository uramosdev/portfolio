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
      hmr: {
        // Forzamos a que el cliente se conecte a la URL de Railway en el puerto estándar
        clientPort: 443, 
        host: 'uramosdev.up.railway.app', // Tu dominio de Railway
        protocol: 'wss',
      },
      // Asegúrate de que el servidor escuche en 0.0.0.0
    host: true,
    port: parseInt(process.env.PORT || '5173'),
  },

  };
});
