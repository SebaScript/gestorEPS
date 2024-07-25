import { defineConfig } from 'vite';

export default defineConfig({
  root: './src', // Establece el directorio raíz en 'src'
  build: {
    outDir: '../dist', // Salida de la compilación en 'dist' en la raíz del proyecto
  },
});
