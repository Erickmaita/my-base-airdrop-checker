import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  // AÑADIDO: Deshabilitar la inyección de CSS para evitar que Tailwind se compile
  // de forma masiva en la memoria al inicio, lo que causa el error "out of memory".
  css: {
    devSourcemap: true,
  },
  build: {
    // Esto es temporal si la solución anterior no funciona, pero es menos probable.
    // sourcemap: true, 
  }
})