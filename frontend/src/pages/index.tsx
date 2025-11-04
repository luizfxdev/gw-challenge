// ======================== PÁGINA PRINCIPAL - RASTREAMENTO ========================
// Página principal do sistema onde usuários consultam pacotes por código de rastreio
// Exibe informações do pacote e timeline completa de eventos
// Inclui logs extensivos para debug de carregamento de CSS

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getPackageByTrackingCode } from '@/services/api';
import { Package } from '@/types/models';
import Timeline from '@/components/Timeline';
import { formatTrackingCode, translateStatus, getCurrentStatus } from '@/utils/formatters';

// ======================== INTERFACE DO FORMULÁRIO ========================
// Interface que define a estrutura dos dados do formulário de busca
interface TrackingFormData {
  trackingCode: string; // Código de rastreio a ser pesquisado
}

// ======================== COMPONENTE DA PÁGINA ========================
// Componente funcional que renderiza a página principal de rastreamento
export default function HomePage() {
  // Hook do Next.js para acesso ao roteador
  const router = useRouter();

  // Estado para controlar se está carregando dados da API
  const [isLoading, setIsLoading] = useState(false);

  // Estado que armazena os dados do pacote encontrado
  const [packageData, setPackageData] = useState<Package | null>(null);

  // Estado para armazenar mensagens de erro
  const [errorMessage, setErrorMessage] = useState('');

  // Configuração do React Hook Form para gerenciar o formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormData>();

  // ======================== EFEITO: VERIFICAR CARREGAMENTO DE CSS ========================
  // Este efeito verifica se o Tailwind CSS foi aplicado corretamente ao componente
  // Executa uma única vez quando o componente é montado
  useEffect(() => {
    console.log('[index.tsx] Componente montado');

    // Aguarda 500ms para garantir que o DOM foi totalmente renderizado
    setTimeout(() => {
      // Procura pelo elemento raiz com classe Tailwind
      const rootDiv = document.querySelector('.min-h-screen');
      if (rootDiv) {
        // Obtém os estilos computados do elemento
        const styles = window.getComputedStyle(rootDiv);
        console.log('[index.tsx] Altura mínima da div raiz:', styles.minHeight);
        console.log('[index.tsx] Background da div raiz:', styles.backgroundColor);

        // Verifica se a altura mínima é 100vh (indicador de que Tailwind funcionou)
        if (styles.minHeight !== '100vh') {
          console.error(
            '[index.tsx] ❌ Classes Tailwind NÃO aplicadas! min-height deveria ser 100vh'
          );
        } else {
          console.log('[index.tsx] ✅ Classes Tailwind aplicadas corretamente');
        }
      } else {
        console.error('[index.tsx] ❌ Elemento raiz com classe "min-h-screen" não encontrado!');
      }

      // Verifica se o header foi estilizado corretamente
      const header = document.querySelector('header');
      if (header) {
        const headerStyles = window.getComputedStyle(header);
        console.log('[index.tsx] Background do header:', headerStyles.backgroundColor);

        // Verifica se o background é azul (rgb(37, 99, 235) = bg-blue-600 do Tailwind)
        if (headerStyles.backgroundColor !== 'rgb(37, 99, 235)') {
          console.error('[index.tsx] ❌ Background do header NÃO é azul! Tailwind não funcionando');
        } else {
          console.log('[index.tsx] ✅ Header estilizado corretamente');
        }
      }
    }, 500);
  }, []);

  // ======================== FUNÇÃO: LOGOUT ========================
  // Remove o token de autenticação e redireciona para a página de login
  const handleLogout = () => {
    console.log('[index.tsx] Logout acionado');
    // Remove o token do localStorage
    localStorage.removeItem('authToken');
    // Redireciona para a página de login
    router.push('/login');
  };

  // ======================== FUNÇÃO: SUBMETER FORMULÁRIO ========================
  // Função executada quando o formulário de busca é submetido
  // Busca o pacote na API pelo código de rastreio
  const onSubmit = async (data: TrackingFormData) => {
    console.log('[index.tsx] Formulário submetido:', data);

    // Ativa o estado de carregamento
    setIsLoading(true);

    // Limpa mensagens de erro anteriores
    setErrorMessage('');

    // Limpa dados de pacote anterior
    setPackageData(null);

    try {
      // Normaliza o código de rastreio (maiúscula e remove espaços)
      const trackingCode = data.trackingCode.toUpperCase().trim();
      console.log('[index.tsx] Procurando por código de rastreio:', trackingCode);

      // Faz a requisição à API para buscar o pacote
      const result = await getPackageByTrackingCode(trackingCode);
      console.log('[index.tsx] Pacote encontrado:', result);

      // Armazena os dados do pacote no estado
      setPackageData(result);
    } catch (error) {
      // Captura e registra o erro
      console.error('[index.tsx] Erro ao buscar pacote:', error);

      // Define a mensagem de erro a ser exibida
      setErrorMessage(error instanceof Error ? error.message : 'Pacote não encontrado');
    } finally {
      // Desativa o estado de carregamento independentemente do resultado
      setIsLoading(false);
    }
  };

  // ======================== CÁLCULO: STATUS ATUAL DO PACOTE ========================
  // Calcula o status atual do pacote baseado no último evento
  // Retorna null se não houver dados de pacote
  const currentStatus = packageData ? getCurrentStatus(packageData.events) : null;

  return (
    <>
      {/* ======================== HEAD: METADADOS DA PÁGINA ======================== */}
      {/* Define o título, descrição e favicon da página */}
      <Head>
        <title>Rastrear - GW Sistemas TMS</title>
        <meta name="description" content="Sistema de Rastreamento de Encomendas - GW Sistemas" />
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
                <h1 className="text-2xl font-bold text-white">Rastrear Pacote</h1>
              </div>

              {/* ======================== BOTÕES DE NAVEGAÇÃO ======================== */}
              {/* Container com botões de navegação e logout */}
              <div className="flex items-center space-x-4">
                {/* Botão para ir para página de criação de pacote */}
                <button
                  onClick={() => router.push('/create-package')}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-all"
                >
                  Criar Pacote
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
          - py-20: Padding vertical (aprox. 20% mais para baixo)
        */}
        <main className="flex-1 flex flex-col justify-center py-20">
          <div className="container-gw">
            {/* ======================== CARD DE BUSCA ======================== */}
            {/* 
              Card com:
              - bg-white: Background branco
              - rounded-lg: Bordas arredondadas
              - shadow-md: Sombra suave
              - p-8: Padding interno
              - mb-8: Margin bottom para espaço
              - max-w-4xl: Largura máxima
              - mx-auto: Centralizado horizontalmente
            */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 max-w-4xl mx-auto w-full">
              {/* Título do card */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Consultar Rastreamento</h2>

              {/* ======================== FORMULÁRIO DE BUSCA ======================== */}
              {/* Formulário com validação usando React Hook Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Container para input e botão lado a lado */}
                <div className="flex gap-4">
                  {/* Container do input (ocupa espaço disponível) */}
                  <div className="flex-1">
                    {/* Input de texto para código de rastreio */}
                    <input
                      type="text"
                      // Registro do campo no React Hook Form com validações
                      {...register('trackingCode', {
                        required: 'Código de rastreio é obrigatório',
                        minLength: {
                          value: 3,
                          message: 'Código deve ter no mínimo 3 caracteres',
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Digite o código de rastreio (ex: GW123456789)"
                      disabled={isLoading}
                    />

                    {/* Exibe mensagem de erro se houver validação falha */}
                    {errors.trackingCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.trackingCode.message}</p>
                    )}
                  </div>

                  {/* Botão de submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {/* Texto do botão muda durante carregamento */}
                    {isLoading ? 'BUSCANDO...' : 'BUSCAR'}
                  </button>
                </div>
              </form>

              {/* ======================== MENSAGEM DE ERRO ======================== */}
              {/* Exibe mensagem de erro se houver */}
              {errorMessage && (
                <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-700 px-4 py-3 rounded fade-in">
                  <p className="text-sm font-semibold">{errorMessage}</p>
                </div>
              )}
            </div>

            {/* ======================== RESULTADO DA BUSCA ======================== */}
            {/* 
              Seção de resultados que só aparece se houver dados de pacote
              Usa a classe fade-in para animação suave de entrada
            */}
            {packageData && (
              <div className="space-y-8 fade-in max-w-4xl mx-auto w-full">
                {/* ======================== CARD: INFORMAÇÕES DO PACOTE ======================== */}
                {/* Card com informações principais do pacote */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  {/* Título do card */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Informações do Pacote</h3>

                  {/* Grid responsivo com informações do pacote */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ======================== CÓDIGO DE RASTREIO ======================== */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Código de Rastreio</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTrackingCode(packageData.trackingCode)}
                      </p>
                    </div>

                    {/* ======================== STATUS ATUAL ======================== */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status Atual</p>
                      {/* Badge de status com cor dinâmica baseada no status */}
                      {currentStatus && (
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${
                            currentStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        >
                          {translateStatus(currentStatus)}
                        </span>
                      )}
                    </div>

                    {/* ======================== NOME DO CLIENTE ======================== */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Destinatário</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {packageData.clientName}
                      </p>
                    </div>

                    {/* ======================== ENDEREÇO DE ENTREGA ======================== */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Endereço de Entrega</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {packageData.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ======================== CARD: TIMELINE DE EVENTOS ======================== */}
                {/* Card com histórico de rastreamento (timeline) */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  {/* Título do card */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Histórico de Rastreamento
                  </h3>
                  {/* Componente Timeline que exibe os eventos do pacote */}
                  <Timeline events={packageData.events} />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ======================== FOOTER ======================== */}
        {/* 
          Footer sempre na parte inferior com:
          - bg-gray-800: Background escuro
          - text-white: Texto branco
          - py-6: Padding vertical
          - flex-shrink-0: Garante que o footer não encolha
          - mt-auto: Empurra o footer para o final (alternativa ao flex-1 no main)
          
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
