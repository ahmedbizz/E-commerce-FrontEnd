import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,               
    port: 5173,              
    strictPort: true,       
    hmr: {
      host: '10.17.34.232',
      port: 5173,            
    },
    historyApiFallback: true,
  },

})
