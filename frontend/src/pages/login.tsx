// ======================== PÁGINA DE LOGIN ========================
// Esta é a página principal de autenticação do sistema
// Renderiza um formulário de login com background customizado em tela cheia

import Head from 'next/head';
import LoginForm from '@/components/LoginForm';

/**
 * Componente da página de login
 * Responsável por renderizar a interface de autenticação com background em tela cheia
 */
export default function LoginPage() {
  return (
    <>
      {/* Head: Define metadados, título da página e favicon */}
      <Head>
        <title>Login - GW Sistemas TMS</title>
        <meta name="description" content="Sistema de Rastreamento de Encomendas - GW Sistemas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Container principal com background image preenchendo toda a tela */}
      <div
        style={{
          // Background image armazenada em public/background.jpg (1808464 bytes)
          backgroundImage: 'url(/background.jpg)',
          // Garantir que o background preencha toda a viewport
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          // Altura mínima de 100vh para preencher toda a tela
          minHeight: '100vh',
          // Largura total
          width: '100%',
          // Flexbox para centralizar o container de login
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Remover margens e padding
          margin: 0,
          padding: 0,
        }}
      >
        {/* Componente do formulário de login com container transparente */}
        <LoginForm />
      </div>
    </>
  );
}
