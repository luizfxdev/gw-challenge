// ======================== FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO ========================
// Este arquivo contém funções auxiliares para formatação de dados exibidos na interface

import { EventStatus } from '@/types/models';

/**
 * Formata o código de rastreio para exibição
 * Adiciona espaços ou hífens para melhor legibilidade
 * 
 * Exemplo: "GW123456789" → "GW-123456789"
 * 
 * @param trackingCode - Código de rastreio bruto
 * @returns Código formatado
 */
export const formatTrackingCode = (trackingCode: string): string => {
  if (!trackingCode) return '';
  
  // Se começar com "GW", adicionar hífen após as duas primeiras letras
  if (trackingCode.startsWith('GW')) {
    return `${trackingCode.slice(0, 2)}-${trackingCode.slice(2)}`;
  }
  
  return trackingCode;
};

/**
 * Traduz o status do evento de inglês para português
 * Utilizado para exibir status legíveis ao usuário final
 * 
 * @param status - EventStatus enum do backend
 * @returns String traduzida em português
 */
export const translateStatus = (status: EventStatus): string => {
  const translations: Record<EventStatus, string> = {
    [EventStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
    [EventStatus.IN_TRANSIT]: 'Em Trânsito',
    [EventStatus.UNDELIVERED]: 'Não Entregue',
    [EventStatus.DELIVERED]: 'Entregue',
  };

  return translations[status] || status;
};

/**
 * Formata data/hora ISO 8601 para formato brasileiro legível
 * 
 * Entrada: "2025-01-03T18:30:00Z"
 * Saída: "03/01/2025 às 18:30"
 * 
 * @param isoDate - String de data no formato ISO 8601
 * @returns Data formatada em português brasileiro
 */
export const formatDateTime = (isoDate: string): string => {
  if (!isoDate) return '';

  try {
    const date = new Date(isoDate);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return isoDate; // Retornar original se inválida
    }

    // Formatar data: DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Formatar hora: HH:MM
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  } catch (error) {
    // Em caso de erro, retornar string original
    return isoDate;
  }
};

/**
 * Formata apenas a data (sem hora) no formato brasileiro
 * 
 * Entrada: "2025-01-03T18:30:00Z"
 * Saída: "03/01/2025"
 * 
 * @param isoDate - String de data no formato ISO 8601
 * @returns Data formatada (DD/MM/YYYY)
 */
export const formatDate = (isoDate: string): string => {
  if (!isoDate) return '';

  try {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      return isoDate;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return isoDate;
  }
};

/**
 * Formata apenas a hora (sem data)
 * 
 * Entrada: "2025-01-03T18:30:00Z"
 * Saída: "18:30"
 * 
 * @param isoDate - String de data no formato ISO 8601
 * @returns Hora formatada (HH:MM)
 */
export const formatTime = (isoDate: string): string => {
  if (!isoDate) return '';

  try {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      return isoDate;
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch (error) {
    return isoDate;
  }
};

/**
 * Retorna a cor CSS correspondente ao status do evento
 * Utilizado para estilização condicional de badges/tags
 * 
 * @param status - EventStatus enum
 * @returns String com classe CSS do Tailwind
 */
export const getStatusColor = (status: EventStatus): string => {
  const colors: Record<EventStatus, string> = {
    [EventStatus.OUT_FOR_DELIVERY]: 'bg-blue-500',
    [EventStatus.IN_TRANSIT]: 'bg-yellow-500',
    [EventStatus.UNDELIVERED]: 'bg-red-500',
    [EventStatus.DELIVERED]: 'bg-green-500',
  };

  return colors[status] || 'bg-gray-500';
};

/**
 * Calcula o status atual do pacote baseado no último evento
 * (O backend Java não retorna currentStatus, então calculamos aqui)
 * 
 * @param events - Array de eventos do pacote
 * @returns EventStatus do evento mais recente
 */
export const getCurrentStatus = (events: any[]): EventStatus | null => {
  if (!events || events.length === 0) {
    return null;
  }

  // Ordenar eventos por eventTimestamp decrescente (mais recente primeiro)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime();
  });

  // Retornar status do evento mais recente
  return sortedEvents[0].status;
};
