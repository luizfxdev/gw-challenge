// ======================== UTILITÁRIOS DE AUTENTICAÇÃO ========================

/**
 * Verifica se o código está sendo executado no cliente (browser)
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Obtém o token de autenticação do localStorage
 */
export const getAuthToken = (): string | null => {
  if (!isClient()) return null;
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};

/**
 * Salva o token de autenticação no localStorage
 */
export const setAuthToken = (token: string): void => {
  if (!isClient()) {
    console.warn('setAuthToken chamado no servidor - ignorando');
    return;
  }
  try {
    localStorage.setItem('authToken', token);
    console.log('Token salvo com sucesso');
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

/**
 * Remove o token de autenticação do localStorage
 */
export const removeAuthToken = (): void => {
  if (!isClient()) return;
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Erro ao remover token:', error);
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};
