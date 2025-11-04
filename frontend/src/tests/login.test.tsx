import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';
import { login } from '@/services/api';

// Mock do serviço de API
jest.mock('@/services/api');
const mockedLogin = login as jest.MockedFunction<typeof login>;

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(<LoginForm />);

    expect(screen.getByText('Sistema de Rastreamento')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTRAR/i })).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /ENTRAR/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve fazer login com sucesso', async () => {
    mockedLogin.mockResolvedValue({
      success: true,
      message: 'Login realizado com sucesso',
      token: 'mock-token',
      user: {
        username: 'admin',
        role: 'ADMIN',
      },
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Digite seu usuário');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /ENTRAR/i });

    await userEvent.type(usernameInput, 'admin');
    await userEvent.type(passwordInput, 'gw@sist123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        username: 'admin',
        password: 'gw@sist123',
      });
    });
  });

  it('deve exibir mensagem de erro em caso de falha', async () => {
    mockedLogin.mockRejectedValue(new Error('Credenciais inválidas'));

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Digite seu usuário');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /ENTRAR/i });

    await userEvent.type(usernameInput, 'invalid');
    await userEvent.type(passwordInput, 'invalid');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
});
