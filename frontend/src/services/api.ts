// ======================== SERVIÇO DE COMUNICAÇÃO COM A API ========================
// Este arquivo centraliza todas as chamadas HTTP para o backend usando Axios
// Implementa interceptors para autenticação e tratamento de erros
import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Package,
  Event,
  CreatePackageDTO,
  CreateEventDTO,
  LoginCredentials,
  LoginResponse,
  ApiError,
} from '@/types/models';

// ======================== CONFIGURAÇÃO BASE DO AXIOS ========================
/**
 * Instância configurada do Axios para comunicação com o backend
 * A URL base é obtida da variável de ambiente NEXT_PUBLIC_API_URL
 * Se não estiver definida, usa http://localhost:8080/api como padrão
 */
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // Timeout de 10 segundos para requisições
  headers: {
    'Content-Type': 'application/json', // Todas as requisições enviam JSON
  },
});

// ======================== INTERCEPTORS ========================
/**
 * Interceptor de requisição: Adiciona automaticamente o token no header
 * Executado ANTES de cada requisição ser enviada ao backend
 */
api.interceptors.request.use(
  (config) => {
    // Verificar se está no ambiente do navegador (não no SSR)
    if (typeof window !== 'undefined') {
      // Buscar token armazenado no localStorage
      const token = localStorage.getItem('authToken');
      // Se token existir, adicionar no header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta: Trata erros globalmente
 * Executado DEPOIS que a resposta é recebida do backend
 */
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida (status 2xx), retornar normalmente
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Tratar erro de autenticação (401 Unauthorized)
    if (error.response?.status === 401) {
      // Remover token inválido do localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Redirecionar para página de login
        window.location.href = '/login';
      }
    }
    // Extrair mensagem de erro da resposta ou usar mensagem padrão
    const errorMessage =
      error.response?.data?.message || error.message || 'Erro desconhecido na API';
    // Retornar erro formatado
    return Promise.reject(new Error(errorMessage));
  }
);

// ======================== SERVIÇOS DE AUTENTICAÇÃO ========================
/**
 * Realizar login no sistema
 * Endpoint: POST /api/auth/login
 * @param credentials - Objeto contendo username e password
 * @returns Promise com resposta de login (token, usuário, etc.)
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Fazer requisição POST para /api/auth/login
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    // Se login for bem-sucedido e retornar token
    if (response.data.success && response.data.token) {
      // Armazenar token no localStorage para uso futuro
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    // Propagar erro para ser tratado pelo componente
    throw error;
  }
};

/**
 * Realizar logout do sistema
 * Remove o token do localStorage
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// ======================== SERVIÇOS DE PACOTES ========================
/**
 * Buscar todos os pacotes cadastrados
 * Endpoint: GET /api/packages
 * @returns Promise com array de pacotes
 */
export const getAllPackages = async (): Promise<Package[]> => {
  const response = await api.get<Package[]>('/packages');
  return response.data;
};

/**
 * Buscar pacote específico por código de rastreio
 * Endpoint: GET /api/packages/{trackingCode}
 * @param trackingCode - Código de rastreio único (ex: GW123456789)
 * @returns Promise com dados completos do pacote (incluindo eventos)
 */
export const getPackageByTrackingCode = async (trackingCode: string): Promise<Package> => {
  console.log('[api.ts] Buscando pacote com código:', trackingCode);
  const response = await api.get<Package>(`/packages/${trackingCode}`);
  return response.data;
};

/**
 * Criar novo pacote no sistema
 * Endpoint: POST /api/packages
 * @param packageData - Dados do novo pacote (trackingCode, clientName, deliveryAddress)
 * @returns Promise com pacote criado
 */
export const createPackage = async (packageData: CreatePackageDTO): Promise<Package> => {
  const response = await api.post<Package>('/packages', packageData);
  return response.data;
};

/**
 * Deletar pacote por trackingCode
 * Endpoint: DELETE /api/packages/{trackingCode}
 * @param trackingCode - Código de rastreio do pacote a ser deletado
 */
export const deletePackage = async (trackingCode: string): Promise<void> => {
  await api.delete(`/packages/${trackingCode}`);
};

// ======================== SERVIÇOS DE EVENTOS ========================
/**
 * Buscar todos os eventos de um pacote específico
 * Endpoint: GET /api/events/package/{trackingCode}
 * @param trackingCode - Código de rastreio do pacote
 * @returns Promise com array de eventos ordenados por data
 */
export const getEventsByTrackingCode = async (trackingCode: string): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/events/package/${trackingCode}`);
  return response.data;
};

/**
 * Criar novo evento/ocorrência para um pacote
 * Endpoint: POST /api/events/package/{trackingCode}
 * @param trackingCode - Código de rastreio do pacote (OBRIGATÓRIO)
 * @param eventData - Dados do novo evento (status, description, eventTimestamp)
 * @returns Promise com evento criado (incluindo ID e timestamps)
 */
export const createEvent = async (
  trackingCode: string,
  eventData: CreateEventDTO
): Promise<Event> => {
  // Log para debug
  console.log('[api.ts] createEvent chamado com:');
  console.log('[api.ts] trackingCode:', trackingCode);
  console.log('[api.ts] eventData:', eventData);
  // Validar se trackingCode foi passado
  if (!trackingCode || trackingCode === 'undefined') {
    console.error('[api.ts] ❌ trackingCode inválido ou undefined!');
    throw new Error('Código de rastreio inválido ou não fornecido');
  }
  // Construir URL
  const url = `/events/package/${trackingCode}`;
  console.log('[api.ts] URL da requisição:', url);
  try {
    const response = await api.post<Event>(url, eventData);
    console.log('[api.ts] ✅ Evento criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('[api.ts] ❌ Erro ao criar evento:', error);
    throw error;
  }
};

/**
 * Deletar evento por ID
 * Endpoint: DELETE /api/events/{id}
 * @param id - ID do evento a ser deletado
 */
export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

// Exportar instância do Axios para uso direto se necessário
export default api;
