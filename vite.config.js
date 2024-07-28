import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './src/public/.env') });

export default defineConfig({
  root: './src', // Establece la raíz del proyecto a 'src'
  build: {
    outDir: '../dist', // Salida de la compilación en 'dist' en la raíz del proyecto
  },
  server: {
    fs: {
      strict: false, // Permitir acceso a archivos fuera de la raíz del proyecto
    },
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
