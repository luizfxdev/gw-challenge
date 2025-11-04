// ======================== APP COMPONENT ========================
// Root component of Next.js application
// Wraps all pages and loads global styles
// This component is responsible for:
// 1. Loading global CSS (globals.css with Tailwind directives)
// 2. Protecting routes with authentication check
// 3. Logging CSS loading status for debugging

import '../styles/globals.css'; // Relative path to global styles
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Main application component
 * Renders all pages with global configurations
 */
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  /**
   * Effect: Check authentication on protected routes
   * Runs every time the route changes
   */
  useEffect(() => {
    // Lista de rotas públicas que não precisam de autenticação
    const publicRoutes = ['/login'];
    const currentPath = router.pathname;

    // Log para debug: rota atual
    console.log('[_app.tsx] Current route:', currentPath);

    // Se não está em rota pública, verificar autenticação
    if (!publicRoutes.includes(currentPath)) {
      const token = localStorage.getItem('authToken');

      // Log para debug: status do token
      console.log('[_app.tsx] Auth token exists:', !!token);

      if (!token) {
        console.log('[_app.tsx] No token found, redirecting to /login');
        router.push('/login');
      } else {
        console.log('[_app.tsx] Token found, user authenticated');
      }
    }
  }, [router.pathname]);

  /**
   * Effect: Verify CSS loading on mount
   * Checks if Tailwind classes are being applied correctly
   */
  useEffect(() => {
    // Log para debug: verificar se o CSS foi carregado
    console.log('[_app.tsx] Component mounted, checking CSS...');

    // Verificar se as stylesheets foram carregadas
    const stylesheets = document.styleSheets;
    console.log('[_app.tsx] Total stylesheets loaded:', stylesheets.length);

    // Listar todas as stylesheets carregadas
    Array.from(stylesheets).forEach((sheet, index) => {
      try {
        console.log(`[_app.tsx] Stylesheet ${index}:`, sheet.href || '(inline)');
        console.log(`[_app.tsx] Stylesheet ${index} rules:`, sheet.cssRules?.length || 0);
      } catch (e) {
        console.warn(`[_app.tsx] Cannot access stylesheet ${index} (CORS):`, sheet.href);
      }
    });

    // Verificar computed styles do body (para ver se Tailwind está ativo)
    const bodyStyles = window.getComputedStyle(document.body);
    console.log('[_app.tsx] Body font-family:', bodyStyles.fontFamily);
    console.log('[_app.tsx] Body background:', bodyStyles.backgroundColor);

    // Criar elemento de teste para verificar se classes Tailwind funcionam
    const testDiv = document.createElement('div');
    testDiv.className = 'bg-blue-600 text-white p-4';
    testDiv.style.position = 'fixed';
    testDiv.style.bottom = '10px';
    testDiv.style.right = '10px';
    testDiv.style.zIndex = '9999';
    testDiv.textContent = 'Tailwind Test';
    document.body.appendChild(testDiv);

    // Verificar se os estilos foram aplicados
    setTimeout(() => {
      const testStyles = window.getComputedStyle(testDiv);
      console.log('[_app.tsx] Test div background:', testStyles.backgroundColor);
      console.log('[_app.tsx] Test div color:', testStyles.color);
      console.log('[_app.tsx] Test div padding:', testStyles.padding);

      // Se o background não for azul, Tailwind não está funcionando
      if (testStyles.backgroundColor !== 'rgb(37, 99, 235)') {
        console.error('[_app.tsx] ❌ TAILWIND NOT WORKING! Background should be blue.');
      } else {
        console.log('[_app.tsx] ✅ Tailwind is working correctly!');
      }

      // Remover elemento de teste após 3 segundos
      setTimeout(() => {
        document.body.removeChild(testDiv);
      }, 3000);
    }, 100);
  }, []);

  return <Component {...pageProps} />;
}
