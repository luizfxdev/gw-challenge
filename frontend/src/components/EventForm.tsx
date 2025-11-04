// ======================== COMPONENTE EVENT FORM ========================
// Formulário para registrar novos eventos de rastreamento
// Permite selecionar status e adicionar descrição
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createEvent } from '@/services/api';
import { EventStatus, CreateEventDTO } from '@/types/models';
import { translateStatus } from '@/utils/formatters';

// ======================== INTERFACE DAS PROPS ========================
/**
 * Props do componente EventForm
 */
interface EventFormProps {
  trackingCode: string; // Código de rastreio do pacote
  onSuccess?: () => void; // Callback executado após sucesso
}

/**
 * Interface dos dados do formulário
 */
interface EventFormData {
  status: EventStatus; // Status do evento
  description: string; // Descrição do evento
  eventTimestamp: string; // Data e hora do evento
}

// ======================== COMPONENTE EVENT FORM ========================
/**
 * Componente de formulário para criar novos eventos
 * Valida campos e envia para API
 */
export default function EventForm({ trackingCode, onSuccess }: EventFormProps) {
  // Estado para controlar loading
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mensagens de sucesso
  const [successMessage, setSuccessMessage] = useState('');
  // Estado para mensagens de erro
  const [errorMessage, setErrorMessage] = useState('');

  // Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    defaultValues: {
      status: EventStatus.IN_TRANSIT, // Status padrão
      description: '',
      // Define a data/hora atual como padrão no formato ISO
      eventTimestamp: new Date().toISOString().slice(0, 16), // Formato: YYYY-MM-DDTHH:mm
    },
  });

  /**
   * Função executada ao submeter o formulário
   * Envia dados para API e exibe feedback
   */
  const onSubmit = async (data: EventFormData) => {
    console.log('[EventForm] Formulário submetido:', data);
    console.log('[EventForm] trackingCode recebido nas props:', trackingCode);

    // Validar trackingCode
    if (!trackingCode || trackingCode === 'undefined') {
      console.error('[EventForm] ❌ trackingCode inválido:', trackingCode);
      setErrorMessage('Código de rastreio inválido. Por favor, busque um pacote primeiro.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Converter a data do input (YYYY-MM-DDTHH:mm) para ISO string completo
      const eventDateTime = new Date(data.eventTimestamp);

      // Validar se a data é válida
      if (isNaN(eventDateTime.getTime())) {
        throw new Error('Data e hora inválidas');
      }

      // Preparar DTO para enviar à API
      // O backend espera: { status, description, eventTimestamp }
      const eventData: CreateEventDTO = {
        status: data.status,
        description: data.description,
        eventTimestamp: eventDateTime.toISOString(), // Converter para ISO string completo
      };

      console.log('[EventForm] Enviando dados para API:', eventData);
      console.log('[EventForm] Com trackingCode:', trackingCode);

      // Fazer requisição POST para criar evento
      await createEvent(trackingCode, eventData);

      console.log('[EventForm] ✅ Evento criado com sucesso');

      // Exibir mensagem de sucesso
      setSuccessMessage('✅ Evento registrado com sucesso!');

      // Limpar formulário com valores padrão
      reset({
        status: EventStatus.IN_TRANSIT,
        description: '',
        eventTimestamp: new Date().toISOString().slice(0, 16),
      });

      // Executar callback de sucesso (se fornecido)
      if (onSuccess) {
        setTimeout(() => {
          console.log('[EventForm] Executando callback de sucesso');
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      // Log do erro para debug
      console.error('[EventForm] ❌ Erro ao registrar evento:', error);

      // Exibir mensagem de erro
      const errorMsg = error instanceof Error ? error.message : 'Erro ao registrar evento';
      setErrorMessage(`❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Registrar Novo Evento</h3>

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-700 px-4 py-3 rounded mb-4 fade-in">
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-700 px-4 py-3 rounded mb-4 fade-in">
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo: Data e Hora do Evento */}
        <div>
          <label
            htmlFor="eventTimestamp"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Data e Hora do Evento
          </label>
          <input
            id="eventTimestamp"
            type="datetime-local"
            {...register('eventTimestamp', {
              required: 'Data e hora são obrigatórias',
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />
          {errors.eventTimestamp && (
            <p className="text-red-500 text-xs mt-1">{errors.eventTimestamp.message}</p>
          )}
        </div>

        {/* Campo: Status do Evento */}
        <div>
          <label htmlFor="status" className="block text-gray-700 text-sm font-semibold mb-2">
            Status do Evento
          </label>
          <select
            id="status"
            {...register('status', {
              required: 'Status é obrigatório',
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          >
            {Object.values(EventStatus).map((status) => (
              <option key={status} value={status}>
                {translateStatus(status)}
              </option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        {/* Campo: Descrição */}
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', {
              required: 'Descrição é obrigatória',
              minLength: {
                value: 10,
                message: 'Descrição deve ter no mínimo 10 caracteres',
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Descreva o evento (ex: Pacote saiu do centro de distribuição)"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? 'REGISTRANDO...' : 'REGISTRAR EVENTO'}
        </button>
      </form>
    </div>
  );
}
