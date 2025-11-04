// ======================== PÁGINA DE REGISTRO DE EVENTO ========================
// Página onde o usuário busca um pacote e registra novos eventos de rastreamento
// Fluxo: Buscar pacote → Exibir informações → Registrar evento
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getPackageByTrackingCode } from '@/services/api';
import { Package } from '@/types/models';
import EventForm from '@/components/EventForm';
import { formatTrackingCode } from '@/utils/formatters';

// ======================== INTERFACE DO FORMULÁRIO ========================
interface SearchFormData {
  trackingCode: string;
}

// ======================== COMPONENTE DA PÁGINA ========================
export default function RegisterEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  // ======================== EFEITO: VERIFICAR CARREGAMENTO DE CSS ========================
  useEffect(() => {
    console.log('[register-event.tsx] Componente montado');
    setTimeout(() => {
      const rootDiv = document.querySelector('.min-h-screen');
      if (rootDiv) {
        const styles = window.getComputedStyle(rootDiv);
        console.log('[register-event.tsx] Altura mínima da div raiz:', styles.minHeight);
        console.log('[register-event.tsx] Background da div raiz:', styles.backgroundColor);
        if (styles.minHeight !== '100vh') {
          console.error(
            '[register-event.tsx] ❌ Classes Tailwind NÃO aplicadas! min-height deveria ser 100vh'
          );
        } else {
          console.log('[register-event.tsx] ✅ Classes Tailwind aplicadas corretamente');
        }
      } else {
        console.error(
          '[register-event.tsx] ❌ Elemento raiz com classe "min-h-screen" não encontrado!'
        );
      }
      const header = document.querySelector('header');
      if (header) {
        const headerStyles = window.getComputedStyle(header);
        console.log('[register-event.tsx] Background do header:', headerStyles.backgroundColor);
        if (headerStyles.backgroundColor !== 'rgb(37, 99, 235)') {
          console.error(
            '[register-event.tsx] ❌ Background do header NÃO é azul! Tailwind não funcionando'
          );
        } else {
          console.log('[register-event.tsx] ✅ Header estilizado corretamente');
        }
      }
    }, 500);
  }, []);

  // ======================== FUNÇÃO: LOGOUT ========================
  const handleLogout = () => {
    console.log('[register-event.tsx] Logout acionado');
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  // ======================== FUNÇÃO: SUBMETER FORMULÁRIO DE BUSCA ========================
  const onSubmit = async (data: SearchFormData) => {
    console.log('[register-event.tsx] Formulário de busca submetido:', data);
    setIsLoading(true);
    setErrorMessage('');
    setPackageData(null);
    try {
      const trackingCode = data.trackingCode.toUpperCase().trim();
      console.log('[register-event.tsx] Procurando por código de rastreio:', trackingCode);
      const result = await getPackageByTrackingCode(trackingCode);
      console.log('[register-event.tsx] Pacote encontrado:', result);
      setPackageData(result);
    } catch (error) {
      console.error('[register-event.tsx] Erro ao buscar pacote:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Pacote não encontrado');
    } finally {
      setIsLoading(false);
    }
  };

  // ======================== FUNÇÃO: CALLBACK DE SUCESSO DO EVENTO ========================
  const handleEventSuccess = () => {
    console.log('[register-event.tsx] Evento registrado com sucesso!');
    if (packageData) {
      onSubmit({ trackingCode: packageData.trackingCode });
    }
  };

  return (
    <>
      <Head>
        <title>Registrar Evento - GW Sistemas</title>
        <meta name="description" content="Registre novos eventos de rastreamento" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* ======================== HEADER ======================== */}
        <header className="bg-blue-600 shadow-lg flex-shrink-0">
          <div className="container-gw py-6">
            <div className="flex items-center justify-between">
              {/* ======================== LOGO E TÍTULO ======================== */}
              <div className="flex items-center space-x-4">
                <img
                  src="/logo.png"
                  alt="GW Sistemas Logo"
                  className="h-12 w-auto object-contain"
                />
                <h1 className="text-2xl font-bold text-white">Registrar Evento</h1>
              </div>

              {/* ======================== BOTÕES DE NAVEGAÇÃO ======================== */}
              <div className="flex items-center space-x-4">
                {/* Botão para ir para página principal */}
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-all"
                >
                  Rastrear
                </button>

                {/* Botão para ir para página de criação de pacote */}
                <button
                  onClick={() => router.push('/create-package')}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-all"
                >
                  Criar Pacote
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

        {/* ======================== MAIN CONTENT ======================== */}
        <main className="flex-1 flex flex-col justify-center py-20">
          <div className="container-gw">
            <div className="max-w-4xl mx-auto w-full">
              {/* ======================== FORMULÁRIO DE BUSCA ======================== */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Buscar Pacote</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register('trackingCode', {
                          required: 'Código de rastreio é obrigatório',
                          minLength: {
                            value: 3,
                            message: 'Código deve ter no mínimo 3 caracteres',
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Digite o código de rastreio (ex: GWTEST0003)"
                        disabled={isLoading}
                      />
                      {errors.trackingCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.trackingCode.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? 'BUSCANDO...' : 'BUSCAR'}
                    </button>
                  </div>
                </form>

                {/* ======================== MENSAGEM DE ERRO ======================== */}
                {errorMessage && (
                  <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-700 px-4 py-3 rounded fade-in">
                    <p className="text-sm font-semibold">❌ {errorMessage}</p>
                  </div>
                )}
              </div>

              {/* ======================== RESULTADO DA BUSCA ======================== */}
              {packageData && (
                <div className="fade-in space-y-8 max-w-4xl mx-auto w-full">
                  {/* ======================== CARD: INFORMAÇÕES DO PACOTE ======================== */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pacote Selecionado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* ======================== CÓDIGO DE RASTREIO ======================== */}
                      <div>
                        <p className="text-sm text-gray-600">Código de Rastreio</p>
                        <p className="text-base font-semibold text-gray-800">
                          {formatTrackingCode(packageData.trackingCode)}
                        </p>
                      </div>

                      {/* ======================== DESTINATÁRIO ======================== */}
                      <div>
                        <p className="text-sm text-gray-600">Destinatário</p>
                        <p className="text-base font-semibold text-gray-800">
                          {packageData.clientName}
                        </p>
                      </div>

                      {/* ======================== ENDEREÇO DE ENTREGA ======================== */}
                      <div>
                        <p className="text-sm text-gray-600">Endereço</p>
                        <p className="text-base font-semibold text-gray-800">
                          {packageData.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ======================== CARD: HISTÓRICO DE EVENTOS ======================== */}
                  {packageData.events && packageData.events.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Histórico de Eventos
                      </h3>
                      <div className="space-y-4">
                        {packageData.events.map((event) => (
                          <div key={event.id} className="border-l-4 border-blue-600 pl-4 py-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-600">
                                  {new Date(event.eventTimestamp).toLocaleString('pt-BR')}
                                </p>
                                <p className="text-base font-bold text-gray-800 mt-1">
                                  {event.status}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ======================== FORMULÁRIO DE REGISTRO DE EVENTO ======================== */}
                  {packageData.trackingCode && (
                    <EventForm
                      trackingCode={packageData.trackingCode}
                      onSuccess={handleEventSuccess}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ======================== FOOTER ======================== */}
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
