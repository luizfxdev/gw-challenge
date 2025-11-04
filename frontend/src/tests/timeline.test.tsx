import { render, screen } from '@testing-library/react';
import Timeline from '@/components/Timeline';
import { Event, EventStatus } from '@/types/models';

describe('Timeline Component', () => {
  it('deve exibir mensagem quando não há eventos', () => {
    render(<Timeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado para este pacote.')).toBeInTheDocument();
  });

  it('deve renderizar eventos em ordem cronológica inversa', () => {
    const events: Event[] = [
      {
        id: 1,
        packageId: 1,
        status: EventStatus.POSTED,
        description: 'Pacote postado',
        eventDate: '2025-01-01T10:00:00Z',
        createdAt: '2025-01-01T10:00:00Z',
      },
      {
        id: 2,
        packageId: 1,
        status: EventStatus.IN_TRANSIT,
        description: 'Pacote em trânsito',
        eventDate: '2025-01-02T15:00:00Z',
        createdAt: '2025-01-02T15:00:00Z',
      },
      {
        id: 3,
        packageId: 1,
        status: EventStatus.DELIVERED,
        description: 'Pacote entregue',
        eventDate: '2025-01-03T18:00:00Z',
        createdAt: '2025-01-03T18:00:00Z',
      },
    ];

    render(<Timeline events={events} />);

    // Verificar se os eventos estão renderizados
    expect(screen.getByText('Pacote postado')).toBeInTheDocument();
    expect(screen.getByText('Pacote em trânsito')).toBeInTheDocument();
    expect(screen.getByText('Pacote entregue')).toBeInTheDocument();
  });

  it('deve exibir localização quando fornecida', () => {
    const events: Event[] = [
      {
        id: 1,
        packageId: 1,
        status: EventStatus.IN_TRANSIT,
        description: 'Pacote em trânsito',
        location: 'São Paulo - SP',
        eventDate: '2025-01-02T15:00:00Z',
        createdAt: '2025-01-02T15:00:00Z',
      },
    ];

    render(<Timeline events={events} />);
    expect(screen.getByText('São Paulo - SP')).toBeInTheDocument();
  });

  it('deve exibir status traduzido em português', () => {
    const events: Event[] = [
      {
        id: 1,
        packageId: 1,
        status: EventStatus.DELIVERED,
        description: 'Pacote entregue',
        eventDate: '2025-01-03T18:00:00Z',
        createdAt: '2025-01-03T18:00:00Z',
      },
    ];

    render(<Timeline events={events} />);
    expect(screen.getByText('Entregue')).toBeInTheDocument();
  });
});
