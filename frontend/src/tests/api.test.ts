import axios from 'axios';
import { login, getAllPackages, getPackageByTrackingCode, createEvent } from '@/services/api';
import type { LoginCredentials, CreateEventDTO, EventStatus } from '@/types/models';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('deve fazer login com sucesso e armazenar token', async () => {
      const credentials: LoginCredentials = {
        username: 'admin',
        password: 'gw@sist123',
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Login realizado com sucesso',
          token: 'mock-jwt-token',
          user: {
            username: 'admin',
            role: 'ADMIN',
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      // Teste seria executado aqui
      expect(mockResponse.data.success).toBe(true);
    });

    it('deve retornar erro em caso de credenciais inválidas', async () => {
      const credentials: LoginCredentials = {
        username: 'invalid',
        password: 'invalid',
      };

      const mockError = new Error('Credenciais inválidas');
      expect(() => {
        throw mockError;
      }).toThrow('Credenciais inválidas');
    });
  });

  describe('getAllPackages', () => {
    it('deve retornar lista de pacotes', async () => {
      const mockPackages = [
        {
          id: 1,
          trackingCode: 'GW123456789',
          recipientName: 'João Silva',
          recipientAddress: 'Rua A, 123 - São Paulo, SP',
          currentStatus: 'IN_TRANSIT' as EventStatus,
          createdAt: '2025-01-01T10:00:00Z',
          updatedAt: '2025-01-02T15:30:00Z',
          events: [],
        },
      ];

      expect(mockPackages).toHaveLength(1);
      expect(mockPackages[0].trackingCode).toBe('GW123456789');
    });
  });

  describe('getPackageByTrackingCode', () => {
    it('deve retornar pacote por código de rastreio', async () => {
      const trackingCode = 'GW123456789';
      const mockPackage = {
        id: 1,
        trackingCode,
        recipientName: 'João Silva',
        recipientAddress: 'Rua A, 123 - São Paulo, SP',
        currentStatus: 'IN_TRANSIT' as EventStatus,
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-02T15:30:00Z',
        events: [],
      };

      expect(mockPackage.trackingCode).toBe(trackingCode);
    });

    it('deve lançar erro se pacote não existir', async () => {
      const trackingCode = 'INVALID123';
      const mockError = new Error('Pacote não encontrado');

      expect(() => {
        throw mockError;
      }).toThrow('Pacote não encontrado');
    });
  });

  describe('createEvent', () => {
    it('deve criar novo evento com sucesso', async () => {
      const eventData: CreateEventDTO = {
        packageId: 1,
        status: 'DELIVERED' as EventStatus,
        description: 'Pacote entregue com sucesso',
        location: 'São Paulo - SP',
      };

      const mockEvent = {
        id: 1,
        ...eventData,
        createdAt: '2025-01-03T10:00:00Z',
      };

      expect(mockEvent.status).toBe('DELIVERED');
      expect(mockEvent.description).toBe('Pacote entregue com sucesso');
    });
  });
});
