// ======================== TIPOS E INTERFACES DO SISTEMA ========================
// Define todas as estruturas de dados usadas na aplicação

// ======================== AUTENTICAÇÃO ========================

/**
 * Credenciais de login do usuário
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Dados do usuário retornados no login
 */
export interface User {
  username: string;
  role: string;
}

/**
 * Resposta da API de login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// ======================== PACOTES E EVENTOS ========================

/**
 * Status possíveis de um evento de rastreamento.
 * ✅ DEVE ser idêntico ao enum EventStatus.java do backend
 */
export enum EventStatus {
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  IN_TRANSIT = 'IN_TRANSIT',
  UNDELIVERED = 'UNDELIVERED',
  DELIVERED = 'DELIVERED',
}

/**
 * Evento de rastreamento (versão DTO).
 * ✅ ATUALIZADO: Agora corresponde ao EventResponseDTO.java do backend
 *
 * MUDANÇA IMPORTANTE:
 * - ANTES: Tinha packageEntity?: Package (causava referência circular)
 * - AGORA: Tem apenas trackingCode: string (quebra o loop)
 */
export interface Event {
  id?: number;
  eventTimestamp: string; // ISO 8601 date string
  status: EventStatus;
  description?: string;
  trackingCode: string; // ✅ NOVO: Apenas a string, não o objeto Package completo
}

/**
 * Pacote completo com eventos.
 * Corresponde ao PackageResponseDTO.java do backend
 */
export interface Package {
  trackingCode: string; // Primary Key
  clientName: string;
  deliveryAddress: string;
  events: Event[]; // ✅ Lista de eventos (DTOs, não entidades)
}

// ======================== DTOs (Data Transfer Objects) ========================

/**
 * DTO para criação de novo pacote
 */
export interface CreatePackageDTO {
  trackingCode: string;
  clientName: string;
  deliveryAddress: string;
}

/**
 * DTO para criação de novo evento
 */
export interface CreateEventDTO {
  status: EventStatus;
  description?: string;
  eventTimestamp?: string; // ISO 8601 date string
}

// ======================== RESPOSTAS DE ERRO ========================

/**
 * Estrutura de erro retornada pela API
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

// ======================== TIPOS UTILITÁRIOS ========================

/**
 * Mapeamento de status para cores do Tailwind
 */
export const STATUS_COLORS: Record<EventStatus, string> = {
  [EventStatus.OUT_FOR_DELIVERY]: 'bg-purple-500',
  [EventStatus.IN_TRANSIT]: 'bg-yellow-500',
  [EventStatus.UNDELIVERED]: 'bg-red-500',
  [EventStatus.DELIVERED]: 'bg-green-500',
};

/**
 * Mapeamento de status para ícones
 */
export const STATUS_ICONS: Record<EventStatus, string> = {
  [EventStatus.OUT_FOR_DELIVERY]: '🏃',
  [EventStatus.IN_TRANSIT]: '🚚',
  [EventStatus.UNDELIVERED]: '❌',
  [EventStatus.DELIVERED]: '✅',
};

/**
 * Traduções de status para português
 */
export const STATUS_TRANSLATIONS: Record<EventStatus, string> = {
  [EventStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [EventStatus.IN_TRANSIT]: 'Em Trânsito',
  [EventStatus.UNDELIVERED]: 'Não Entregue',
  [EventStatus.DELIVERED]: 'Entregue',
};
