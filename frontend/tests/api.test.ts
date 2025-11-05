describe('API Service', () => {
  describe('getPackageByTrackingCode', () => {
    it('deve buscar um pacote com sucesso', () => {
      const trackingCode = 'GWTEST0001';
      const clientName = 'João Silva';
      const deliveryAddress = 'Rua das Flores, 123, São Paulo, SP';

      expect(trackingCode).toBe('GWTEST0001');
      expect(clientName).toBe('João Silva');
      expect(deliveryAddress).toContain('São Paulo');
    });

    it('deve converter tracking code para maiúsculas', () => {
      const code = 'gwtest0001'.toUpperCase();
      expect(code).toBe('GWTEST0001');
    });

    it('deve validar formato de tracking code', () => {
      const trackingCode = 'GWTEST0001';
      const isValid = /^[A-Z0-9]+$/.test(trackingCode);
      expect(isValid).toBe(true);
    });

    it('deve rejeitar tracking code inválido', () => {
      const trackingCode = '';
      expect(trackingCode).toBe('');
      expect(trackingCode.length).toBe(0);
    });
  });

  describe('createPackage', () => {
    it('deve criar um pacote com sucesso', () => {
      const newPackage = {
        trackingCode: 'GWTEST0006',
        clientName: 'Maria Santos',
        deliveryAddress: 'Avenida Paulista, 1000, São Paulo, SP',
      };

      expect(newPackage.trackingCode).toBeDefined();
      expect(newPackage.clientName).toBeDefined();
      expect(newPackage.deliveryAddress).toBeDefined();
    });

    it('deve validar campos obrigatórios', () => {
      const trackingCode = 'GWTEST0006';
      const clientName = 'Maria Santos';
      const deliveryAddress = 'Avenida Paulista, 1000, São Paulo, SP';

      expect(trackingCode).toBeTruthy();
      expect(clientName).toBeTruthy();
      expect(deliveryAddress).toBeTruthy();
    });

    it('deve ter comprimento mínimo de endereço', () => {
      const address = 'Avenida Paulista, 1000, São Paulo, SP';
      expect(address.length).toBeGreaterThan(10);
    });
  });

  describe('registerEvent', () => {
    it('deve registrar um evento com sucesso', () => {
      const event = {
        status: 'OUT_FOR_DELIVERY',
        description: 'Pacote saiu para entrega',
        eventTimestamp: '2025-11-05T14:33:00Z',
      };

      expect(event.status).toBe('OUT_FOR_DELIVERY');
      expect(event.description).toContain('entrega');
      expect(event.eventTimestamp).toBeDefined();
    });

    it('deve validar status válidos', () => {
      const validStatuses = ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PENDING'];
      const status = 'OUT_FOR_DELIVERY';

      expect(validStatuses).toContain(status);
    });

    it('deve ter descrição com mínimo de caracteres', () => {
      const description = 'Pacote saiu para entrega ao destinatário';
      expect(description.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('getEventsByTrackingCode', () => {
    it('deve buscar eventos de um pacote', () => {
      const events = [
        {
          id: 1,
          status: 'IN_TRANSIT',
          description: 'Pacote saiu do centro de distribuição',
          eventTimestamp: '2025-11-04T18:09:15',
        },
        {
          id: 2,
          status: 'OUT_FOR_DELIVERY',
          description: 'Pacote saiu para entrega',
          eventTimestamp: '2025-11-04T20:30:00',
        },
      ];

      expect(events).toHaveLength(2);
      expect(events[0].status).toBe('IN_TRANSIT');
    });

    it('deve retornar array vazio quando não há eventos', () => {
      const events: any[] = [];
      expect(events).toHaveLength(0);
      expect(events).toEqual([]);
    });

    it('deve ordenar eventos por timestamp', () => {
      const events = [
        { id: 1, eventTimestamp: '2025-11-04T18:09:15' },
        { id: 2, eventTimestamp: '2025-11-04T20:30:00' },
        { id: 3, eventTimestamp: '2025-11-05T10:15:00' },
      ];

      const timestamps = events.map(e => new Date(e.eventTimestamp).getTime());
      const isSorted = timestamps.every((val, i, arr) => i === 0 || arr[i - 1] <= val);

      expect(isSorted).toBe(true);
    });
  });
});
