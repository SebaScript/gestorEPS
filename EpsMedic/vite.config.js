import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';  

dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

export default defineConfig({
  root: './src', // 
  build: {
    outDir: '../dist', // Salida de la compilación en 'dist' en la raíz del proyecto
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
