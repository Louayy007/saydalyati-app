import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './backend/certs/private-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './backend/certs/certificate.pem')),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
