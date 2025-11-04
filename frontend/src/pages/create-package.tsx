// ======================== PÁGINA DE CRIAÇÃO DE PACOTE ========================
// Página para cadastrar novas encomendas no sistema TMS.
// Responsabilidades:
//  - Validar campos do formulário (trackingCode, clientName, deliveryAddress)
//  - Chamar endpoint POST /api/packages via serviço createPackage
//  - Exibir mensagens de sucesso/erro
//  - Redirecionar para register-event após criação bem-sucedida
//  - Manter layout consistente com as outras páginas (header, footer, flex layout)

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { createPackage } from '@/services/api';

// ======================== INTERFACE DO FORMULÁRIO ========================
// Define a estrutura dos dados que serão preenchidos no formulário
interface CreatePackageForm {
  trackingCode: string; // Código único de rastreio (ex: GW123456789)
  clientName: string; // Nome do cliente/destinatário
  deliveryAddress: string; // Endereço completo de entrega
}

// ======================== COMPONENTE DA PÁGINA ========================
// Componente funcional que renderiza a página de criação de pacote
export default function CreatePackagePage() {
  // Hook do Next.js para acesso ao roteador
  const router = useRouter();

  // Estado para controlar se o formulário está sendo enviado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para armazenar mensagens de erro da API
  const [apiError, setApiError] = useState<string | null>(null);

  // Estado para armazenar mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Configuração do React Hook Form para gerenciar o formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePackageForm>();

  // ======================== EFEITO: VERIFICAR CARREGAMENTO DE CSS ========================
  // Este efeito verifica se o Tailwind CSS foi aplicado corretamente ao componente
  // Executa uma única vez quando o componente é montado
  useEffect(() => {
    console.log('[create-package.tsx] Componente montado');

    // Aguarda 500ms para garantir que o DOM foi totalmente renderizado
    setTimeout(() => {
      // Procura pelo elemento raiz com classe Tailwind
      const rootDiv = document.querySelector('.min-h-screen');
      if (rootDiv) {
        // Obtém os estilos computados do elemento
        const styles = window.getComputedStyle(rootDiv);
        console.log('[create-package.tsx] Altura mínima da div raiz:', styles.minHeight);
        console.log('[create-package.tsx] Background da div raiz:', styles.backgroundColor);

        // Verifica se a altura mínima é 100vh (indicador de que Tailwind funcionou)
        if (styles.minHeight !== '100vh') {
          console.error(
            '[create-package.tsx] ❌ Classes Tailwind NÃO aplicadas! min-height deveria ser 100vh'
          );
        } else {
          console.log('[create-package.tsx] ✅ Classes Tailwind aplicadas corretamente');
        }
      } else {
        console.error(
          '[create-package.tsx] ❌ Elemento raiz com classe "min-h-screen" não encontrado!'
        );
      }

      // Verifica se o header foi estilizado corretamente
      const header = document.querySelector('header');
      if (header) {
        const headerStyles = window.getComputedStyle(header);
        console.log('[create-package.tsx] Background do header:', headerStyles.backgroundColor);

        // Verifica se o background é azul (rgb(37, 99, 235) = bg-blue-600 do Tailwind)
        if (headerStyles.backgroundColor !== 'rgb(37, 99, 235)') {
          console.error(
            '[create-package.tsx] ❌ Background do header NÃO é azul! Tailwind não funcionando'
          );
        } else {
          console.log('[create-package.tsx] ✅ Header estilizado corretamente');
        }
      }
    }, 500);
  }, []);

  // ======================== FUNÇÃO: LOGOUT ========================
  // Remove o token de autenticação e redireciona para a página de login
  const handleLogout = () => {
    console.log('[create-package.tsx] Logout acionado');
    // Remove o token do localStorage
    localStorage.removeItem('authToken');
    // Redireciona para a página de login
    router.push('/login');
  };

  // ======================== FUNÇÃO: SUBMETER FORMULÁRIO ========================
  // Função executada quando o formulário é submetido
  // Valida os dados e chama a API para criar o pacote
  const onSubmit = async (data: CreatePackageForm) => {
    console.log('[create-package.tsx] Formulário submetido:', data);

    // Ativa o estado de envio
    setIsSubmitting(true);

    // Limpa mensagens anteriores
    setApiError(null);
    setSuccessMessage(null);

    try {
      // Normaliza os dados antes de enviar (maiúscula, remove espaços)
      const payload = {
        trackingCode: data.trackingCode.toUpperCase().trim(),
        clientName: data.clientName.trim(),
        deliveryAddress: data.deliveryAddress.trim(),
      };

      console.log('[create-package.tsx] Enviando payload:', payload);

      // Chamada ao serviço para criar o pacote
      const created = await createPackage(payload);
      console.log('[create-package.tsx] Pacote criado com sucesso:', created);

      // Exibe mensagem de sucesso
      setSuccessMessage('Pacote criado com sucesso! Redirecionando...');

      // Limpa o formulário
      reset();

      // Aguarda 1.5 segundos e redireciona para a página de registro de eventos
      setTimeout(() => {
        router.push('/register-event');
      }, 1500);
    } catch (err: any) {
      // Captura e registra o erro
      console.error('[create-package.tsx] Erro ao criar pacote:', err);

      // Extrai mensagem de erro da resposta ou usa mensagem genérica
      const message = err?.message || 'Erro ao criar pacote. Tente novamente.';
      setApiError(message);
    } finally {
      // Desativa o estado de envio independentemente do resultado
      setIsSubmitting(false);
    }
  };

  // ======================== FUNÇÃO: RESETAR FORMULÁRIO ========================
  // Limpa o formulário e as mensagens de erro/sucesso
  const handleReset = () => {
    console.log('[create-package.tsx] Formulário resetado');
    reset();
    setApiError(null);
    setSuccessMessage(null);
  };

  return (
    <>
      {/* ======================== HEAD: METADADOS DA PÁGINA ======================== */}
      {/* Define o título, descrição e favicon da página */}
      <Head>
        <title>Criar Pacote - GW Sistemas TMS</title>
        <meta name="description" content="Cadastrar nova encomenda - GW Sistemas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ======================== CONTAINER PRINCIPAL ======================== */}
      {/* 
        Estrutura principal da página usando Flexbox:
        - flex: Ativa o layout Flexbox
        - flex-col: Posiciona elementos em coluna (vertical)
        - min-h-screen: Altura mínima de 100vh (altura total da tela)
        - bg-gray-50: Background cinza claro
        
        Esta estrutura garante que o footer fique sempre na parte inferior,
        mesmo que o conteúdo seja menor que a altura da tela
      */}
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* ======================== HEADER ======================== */}
        {/* 
          Header fixo no topo com:
          - bg-blue-600: Background azul principal
          - shadow-lg: Sombra para destaque
          - flex-shrink-0: Garante que o header não encolha
          - py-6: Padding vertical
        */}
        <header className="bg-blue-600 shadow-lg flex-shrink-0">
          <div className="container-gw py-6">
            <div className="flex items-center justify-between">
              {/* ======================== LOGO E TÍTULO ======================== */}
              {/* Container com logo e título da página */}
              <div className="flex items-center space-x-4">
                {/* Logo da empresa */}
                <img
                  src="/logo.png"
                  alt="GW Sistemas Logo"
                  className="h-12 w-auto object-contain"
                />
                {/* Título da página */}
                <h1 className="text-2xl font-bold text-white">Criar Pacote</h1>
              </div>

              {/* ======================== BOTÕES DE NAVEGAÇÃO ======================== */}
              {/* Container com botões de navegação e logout */}
              <div className="flex items-center space-x-4">
                {/* Botão para ir para página de rastreamento */}
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-all"
                >
                  Rastrear
                </button>

                {/* Botão para ir para página de registro de eventos */}
                <button
                  onClick={() => router.push('/register-event')}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-all"
                >
                  Registrar Evento
                </button>

                {/* Botão de logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-all"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ======================== MAIN: CONTEÚDO PRINCIPAL ======================== */}
        {/* 
          Main com:
          - flex-1: Ocupa todo o espaço disponível entre header e footer
          - flex flex-col justify-center: Centraliza conteúdo verticalmente
          - items-center: Centraliza horizontalmente
          - py-20: Padding vertical (aprox. 20% mais para baixo)
        */}
        <main className="flex-1 flex flex-col justify-center items-center py-20">
          <div className="container-gw max-w-2xl w-full">
            {/* ======================== CARD DO FORMULÁRIO ======================== */}
            {/* 
              Card com:
              - bg-white: Background branco
              - rounded-lg: Bordas arredondadas
              - shadow-md: Sombra suave
              - p-8: Padding interno
            */}
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Título do card */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Nova Encomenda</h2>

              {/* ======================== FORMULÁRIO ======================== */}
              {/* Formulário com validação usando React Hook Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* ======================== CAMPO: TRACKING CODE ======================== */}
                <div>
                  {/* Label do campo */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Rastreio
                  </label>

                  {/* Input com validação */}
                  <input
                    type="text"
                    // Registro do campo no React Hook Form com validações
                    {...register('trackingCode', {
                      required: 'Código de rastreio é obrigatório',
                      minLength: {
                        value: 3,
                        message: 'Mínimo 3 caracteres',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: GW123456789"
                    disabled={isSubmitting}
                  />

                  {/* Exibe mensagem de erro se houver validação falha */}
                  {errors.trackingCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.trackingCode.message}</p>
                  )}
                </div>

                {/* ======================== CAMPO: CLIENT NAME ======================== */}
                <div>
                  {/* Label do campo */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente
                  </label>

                  {/* Input com validação */}
                  <input
                    type="text"
                    // Registro do campo no React Hook Form com validações
                    {...register('clientName', {
                      required: 'Nome do cliente é obrigatório',
                      minLength: {
                        value: 3,
                        message: 'Mínimo 3 caracteres',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: João Silva"
                    disabled={isSubmitting}
                  />

                  {/* Exibe mensagem de erro se houver validação falha */}
                  {errors.clientName && (
                    <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>
                  )}
                </div>

                {/* ======================== CAMPO: DELIVERY ADDRESS ======================== */}
                <div>
                  {/* Label do campo */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço de Entrega
                  </label>

                  {/* Textarea com validação */}
                  <textarea
                    // Registro do campo no React Hook Form com validações
                    {...register('deliveryAddress', {
                      required: 'Endereço é obrigatório',
                      minLength: {
                        value: 10,
                        message: 'Mínimo 10 caracteres',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Rua, número, cidade - Ex: Rua das Flores, 123, São Paulo, SP"
                    rows={3}
                    disabled={isSubmitting}
                  />

                  {/* Exibe mensagem de erro se houver validação falha */}
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>
                  )}
                </div>

                {/* ======================== BOTÕES DE AÇÃO ======================== */}
                <div className="flex items-center justify-between gap-4 pt-4">
                  {/* Botão de submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {/* Texto do botão muda durante envio */}
                    {isSubmitting ? 'CRIANDO...' : 'CRIAR PACOTE'}
                  </button>

                  {/* Botão de reset */}
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-100 text-gray-800 font-bold rounded hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    LIMPAR
                  </button>
                </div>

                {/* ======================== MENSAGEM DE ERRO ======================== */}
                {/* Exibe mensagem de erro se houver */}
                {apiError && (
                  <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-700 px-4 py-3 rounded fade-in">
                    <p className="text-sm font-semibold">{apiError}</p>
                  </div>
                )}

                {/* ======================== MENSAGEM DE SUCESSO ======================== */}
                {/* Exibe mensagem de sucesso se houver */}
                {successMessage && (
                  <div className="mt-4 bg-green-500 bg-opacity-20 border border-green-500 text-green-700 px-4 py-3 rounded fade-in">
                    <p className="text-sm font-semibold">{successMessage}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>

        {/* ======================== FOOTER ======================== */}
        {/* 
          Footer sempre na parte inferior com:
          - bg-gray-800: Background escuro
          - text-white: Texto branco
          - py-6: Padding vertical
          - flex-shrink-0: Garante que o footer não encolha
          - mt-auto: Empurra o footer para o final
          
          O footer sempre fica na parte inferior da página,
          mesmo que o conteúdo seja menor que a altura da tela
        */}
        <footer className="bg-gray-800 text-white py-6 flex-shrink-0 mt-auto">
          <div className="container-gw text-center">
            <p className="text-sm">
              © 2025 GW Sistemas - A Tecnologia para sua Gestão de Transportes
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
