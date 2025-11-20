/** @type {import('tailwindcss').Config} */
export default {
  // CRÍTICO: Esta línea le dice a Tailwind dónde buscar las clases (en .html, .ts, .tsx, .jsx, etc.)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Configuraciones personalizadas para la estética de Base (opcional pero recomendado)
      colors: {
        'base-blue': '#0052FF',
      },
      fontFamily: {
        // Aseguramos que 'Inter' sea la fuente predeterminada
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}