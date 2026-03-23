import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite do aviso para 1000kb (1MB)
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Separa as bibliotecas grandes (node_modules) em arquivos menores
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor'; // O restante vai para um arquivo genérico
          }
        }
      }
    }
  }
})