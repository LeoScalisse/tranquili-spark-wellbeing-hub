
import { User } from '@/types/user';
import { useSecureAuth } from './useSecureAuth';

export const useAuth = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const { secureLogin, secureRegister, isLoading } = useSecureAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await secureLogin(email, password);
    
    if (result.success) {
      // User state will be updated by the session handler
      return true;
    } else {
      console.error('❌ Login falhou:', result.error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const result = await secureRegister(name, email, password);
    
    if (result.success) {
      // User state will be updated by the session handler
      return true;
    } else {
      console.error('❌ Registro falhou:', result.error);
      return false;
    }
  };

  return { login, register, isLoading };
};
