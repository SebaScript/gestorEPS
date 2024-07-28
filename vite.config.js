import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './src/pages/main.html',
        newAppointment: './src/pages/new-appointment.html',
        login: './login.html'
      }
    }
  }
})
