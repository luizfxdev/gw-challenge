/** @type {import('tailwindcss').Config} */
/**
 * Configuração do Tailwind CSS
 *
 * content: Define quais arquivos o Tailwind deve escanear para encontrar classes
 * theme.extend: Estende o tema padrão com cores e fontes customizadas
 * plugins: Array de plugins do Tailwind (vazio por enquanto)
 */
module.exports = {
  // Arquivos que o Tailwind deve escanear para encontrar classes CSS
  // IMPORTANTE: Todos os arquivos .tsx/.jsx devem estar listados aqui
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Incluído para compatibilidade futura com App Router
  ],

  // Configuração do tema
  theme: {
    extend: {
      // Cores customizadas que estendem a paleta padrão do Tailwind
      colors: {
        primary: '#4F95DA', // Azul primário GW
        secondary: '#91C9FF', // Azul secundário GW
        dark: '#1a1a1a', // Cor escura para textos
        light: '#f5f5f5', // Cor clara para backgrounds
      },
      // Fontes customizadas
      fontFamily: {
        lato: ['Lato', 'sans-serif'], // Fonte Lato como opção
      },
    },
  },

  // Plugins do Tailwind (vazio por enquanto)
  plugins: [],
};
