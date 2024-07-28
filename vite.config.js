import { defineConfig } from 'vite'

export default defineConfig({
  root: './src', // Cambia el directorio raíz a la carpeta src
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        login: './login.html',
        main: './pages/main.html'
      }
    }
  }
})
