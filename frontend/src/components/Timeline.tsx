// ======================== COMPONENTE TIMELINE ========================
// Exibe a linha do tempo de eventos de rastreamento de um pacote
// Mostra eventos ordenados cronologicamente (mais recente primeiro)

'use client';

import { Event } from '@/types/models';
import { formatDateTime, translateStatus, getStatusColor } from '@/utils/formatters';

// ======================== INTERFACE DAS PROPS ========================

/**
 * Props do componente Timeline
 */
interface TimelineProps {
  events: Event[]; // Array de eventos a serem exibidos
}

// ======================== COMPONENTE TIMELINE ========================

/**
 * Componente que renderiza uma timeline vertical de eventos
 * Cada evento mostra: status, descrição, data/hora
 */
export default function Timeline({ events }: TimelineProps) {
  // Se não houver eventos, exibir mensagem informativa
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">Nenhum evento registrado para este pacote.</p>
      </div>
    );
  }

  // Ordenar eventos por eventTimestamp decrescente (mais recente primeiro)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.eventTimestamp).getTime() - new Date(a.eventTimestamp).getTime();
  });

  return (
    <div className="relative">
      {/* Linha vertical da timeline */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

      {/* Lista de eventos */}
      <div className="space-y-6">
        {sortedEvents.map((event, index) => (
          <div key={event.id || index} className="relative pl-12 fade-in">
            {/* Círculo indicador na linha do tempo */}
            <div
              className={`absolute left-0 w-8 h-8 rounded-full ${getStatusColor(
                event.status
              )} flex items-center justify-center shadow-lg`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>

            {/* Card do evento */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              {/* Cabeçalho: Status e Data */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                    event.status
                  )}`}
                >
                  {translateStatus(event.status)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(event.eventTimestamp)}
                </span>
              </div>

              {/* Descrição do evento */}
              {event.description && (
                <p className="text-gray-700 mt-2">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
