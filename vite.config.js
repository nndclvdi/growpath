import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
export default defineConfig({
  plugins: [react()],
  server: {
    // 👇 INI TRIKNYA: Menyambungkan 5173 langsung ke 5000
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
>>>>>>> 897df25ea1dfa544a23ae9de78c005ceb797c597
