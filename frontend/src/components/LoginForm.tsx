// ======================== COMPONENTE DE FORMULÁRIO DE LOGIN ========================
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { login } from '@/services/api';
import { setAuthToken } from '@/utils/auth';
import type { LoginCredentials } from '@/types/models';

// ======================== INTERFACE DO FORMULÁRIO ========================
interface LoginFormData {
  username: string;
  password: string;
}

// ======================== COMPONENTE LOGIN FORM ========================
export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  /**
   * Função executada ao submeter o formulário de login
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const credentials: LoginCredentials = {
        username: data.username,
        password: data.password,
      };
      const response = await login(credentials);
      if (response.success && response.token) {
        // Salvar token usando utilitário
        setAuthToken(response.token);
        // Opcional: salvar dados do usuário
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        // Aguardar para garantir que o token foi salvo
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Redirecionar para home
        router.push('/');
      } else {
        setErrorMessage(response.message || 'Falha no login');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ======================== ESTILOS CSS CUSTOMIZADOS ======================== */}
      <style jsx>{`
        .login-container {
          width: 450px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
          margin: 0 auto;
        }
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }
        .logo-container img {
          width: 128px;
          height: 113px;
          object-fit: contain;
        }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .input-field:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.25);
        }
        .btn-login {
          width: 180px;
          height: 60px;
          cursor: pointer;
          background: transparent;
          border: 1px solid #91c9ff;
          outline: none;
          transition: 1s ease-in-out;
          position: relative;
          margin: 0 auto;
          display: block;
        }
        .btn-login:hover {
          transition: 1s ease-in-out;
          background: #4f95da;
        }
        .btn-login:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-login svg {
          position: absolute;
          left: 0;
          top: 0;
          fill: none;
          stroke: #fff;
          stroke-dasharray: 150 480;
          stroke-dashoffset: 150;
          transition: 1s ease-in-out;
        }
        .btn-login:hover svg {
          stroke-dashoffset: -480;
        }
        .btn-login span {
          color: white;
          font-size: 18px;
          font-weight: 100;
          position: relative;
          z-index: 1;
        }
        .title {
          color: white;
          font-size: 28px;
          font-weight: 300;
          text-align: center;
          margin-bottom: 30px;
        }
        .label {
          color: white;
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 8px;
          display: block;
        }
        .error-message {
          color: #ff6b6b;
          font-size: 12px;
          margin-top: 5px;
        }
        .error-box {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid #ff6b6b;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: white;
          font-size: 14px;
        }
        .credentials-info {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          margin-top: 20px;
        }
        .credentials-info strong {
          color: white;
        }
      `}</style>
      {/* ======================== CONTAINER DO FORMULÁRIO ======================== */}
      <div className="login-container">
        {/* ======================== LOGO DA EMPRESA ======================== */}
        <div className="logo-container">
          <img src="/logo.png" alt="GW Sistemas Logo" />
        </div>
        {/* ======================== TÍTULO ======================== */}
        <h2 className="title">Sistema de Rastreamento</h2>
        {/* ======================== MENSAGEM DE ERRO ======================== */}
        {errorMessage && <div className="error-box">{errorMessage}</div>}
        {/* ======================== FORMULÁRIO ======================== */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ======================== CAMPO DE USUÁRIO ======================== */}
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Usuário</label>
            <input
              type="text"
              className="input-field"
              placeholder="Digite seu usuário"
              disabled={isLoading}
              {...register('username', {
                required: 'Usuário é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Usuário deve ter no mínimo 3 caracteres',
                },
              })}
            />
            {errors.username && <p className="error-message">{errors.username.message}</p>}
          </div>
          {/* ======================== CAMPO DE SENHA ======================== */}
          <div style={{ marginBottom: '30px' }}>
            <label className="label">Senha</label>
            <input
              type="password"
              className="input-field"
              placeholder="Digite sua senha"
              disabled={isLoading}
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres',
                },
              })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          {/* ======================== BOTÃO ANIMADO ======================== */}
          <button type="submit" className="btn-login" disabled={isLoading}>
            <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
            </svg>
            <span>{isLoading ? 'ENTRANDO...' : 'ENTRAR'}</span>
          </button>
        </form>
        {/* ======================== INFORMAÇÃO DE CREDENCIAIS PADRÃO ======================== */}
        <div className="credentials-info">
          <p style={{ marginBottom: '5px' }}>Credenciais padrão:</p>
          <p>
            Usuário: <strong>admin</strong> | Senha: <strong>gw@sist123</strong>
          </p>
        </div>
      </div>
    </>
  );
}
