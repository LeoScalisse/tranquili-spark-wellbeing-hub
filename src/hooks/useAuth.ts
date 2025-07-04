
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Tentando fazer login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido para:', data.user.email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 Tentando registrar usuário:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('❌ Erro no registro:', error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Registro bem-sucedido para:', data.user.email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erro inesperado no registro:', error);
      return false;
    }
  };

  return { login, register };
};
