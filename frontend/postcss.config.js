/**
 * Configuração do PostCSS
 *
 * O PostCSS é responsável por processar o CSS, incluindo:
 * 1. Processar as diretivas do Tailwind (@tailwind base, etc)
 * 2. Adicionar prefixos vendor automaticamente (autoprefixer)
 *
 * IMPORTANTE: Este arquivo é essencial para o Tailwind funcionar
 */
module.exports = {
  plugins: {
    // Plugin do Tailwind CSS - processa as diretivas @tailwind
    tailwindcss: {},

    // Autoprefixer - adiciona prefixos vendor automaticamente
    // Ex: -webkit-, -moz-, -ms-
    autoprefixer: {},
  },
};
