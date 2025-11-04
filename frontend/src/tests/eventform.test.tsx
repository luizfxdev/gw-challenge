import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from '@/components/EventForm';
import { createEvent } from '@/services/api';
import { EventStatus } from '@/types/models';

// Mock do serviço de API
jest.mock('@/services/api');
const mockedCreateEvent = createEvent as jest.MockedFunction<typeof createEvent>;

describe('EventForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de evento', () => {
    render(<EventForm packageId={1} />);

    expect(screen.getByText('Registrar Novo Evento')).toBeInTheDocument();
    expect(screen.getByLabelText('Status do Evento')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Localização (Opcional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /REGISTRAR EVENTO/i })).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<EventForm packageId={1} />);

    const submitButton = screen.getByRole('button', { name: /REGISTRAR EVENTO/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve criar evento com sucesso', async () => {
    mockedCreateEvent.mockResolvedValue({
      id: 1,
      packageId: 1,
      status: EventStatus.IN_TRANSIT,
      description: 'Pacote em trânsito',
      location: 'São Paulo - SP',
      eventDate: '2025-01-02T15:00:00Z',
      createdAt: '2025-01-02T15:00:00Z',
    });

    const onSuccess = jest.fn();
    render(<EventForm packageId={1} onSuccess={onSuccess} />);

    const descriptionInput = screen.getByPlaceholderText(
      'Descreva o evento (ex: Pacote saiu do centro de distribuição)'
    );
    const locationInput = screen.getByPlaceholderText('Ex: São Paulo - SP');
    const submitButton = screen.getByRole('button', { name: /REGISTRAR EVENTO/i });

    await userEvent.type(descriptionInput, 'Pacote em trânsito para o destino');
    await userEvent.type(locationInput, 'São Paulo - SP');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Evento registrado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro em caso de falha', async () => {
    mockedCreateEvent.mockRejectedValue(new Error('Erro ao registrar evento'));

    render(<EventForm packageId={1} />);

    const descriptionInput = screen.getByPlaceholderText(
      'Descreva o evento (ex: Pacote saiu do centro de distribuição)'
    );
    const submitButton = screen.getByRole('button', { name: /REGISTRAR EVENTO/i });

    await userEvent.type(descriptionInput, 'Pacote em trânsito para o destino');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao registrar evento')).toBeInTheDocument();
    });
  });
});
