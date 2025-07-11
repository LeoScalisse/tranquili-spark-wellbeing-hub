
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  sanitizeInput, 
  validateEmail, 
  validatePassword, 
  validateName,
  validateRedirectUrl,
  generateSessionFingerprint,
  rateLimiter,
  getSecureErrorMessage
} from '@/utils/securityUtils';

interface AuthResult {
  success: boolean;
  error?: string;
}

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const secureLogin = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      // Rate limiting - max 5 attempts per 15 minutes
      const rateLimitKey = `login_${sanitizeInput(email)}`;
      if (!rateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) {
        return { 
          success: false, 
          error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' 
        };
      }

      // Input validation
      const cleanEmail = sanitizeInput(email).toLowerCase();
      if (!validateEmail(cleanEmail)) {
        return { success: false, error: 'Por favor, insira um e-mail válido' };
      }

      if (!password || password.length < 8) {
        return { success: false, error: 'Senha inválida' };
      }

      console.log('🔐 Tentativa de login seguro para:', cleanEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        return { 
          success: false, 
          error: getSecureErrorMessage(error.message) 
        };
      }

      if (data.user) {
        console.log('✅ Login seguro bem-sucedido para:', data.user.email);
        rateLimiter.clear(rateLimitKey); // Clear rate limit on success
        return { success: true };
      }

      return { success: false, error: 'Erro na autenticação' };
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return { 
        success: false, 
        error: getSecureErrorMessage(error) 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const secureRegister = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      // Rate limiting - max 3 attempts per hour
      const rateLimitKey = `register_${sanitizeInput(email)}`;
      if (!rateLimiter.isAllowed(rateLimitKey, 3, 60 * 60 * 1000)) {
        return { 
          success: false, 
          error: 'Muitas tentativas de registro. Tente novamente em 1 hora.' 
        };
      }

      // Input validation
      const cleanName = sanitizeInput(name);
      const cleanEmail = sanitizeInput(email).toLowerCase();
      
      const nameValidation = validateName(cleanName);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }

      if (!validateEmail(cleanEmail)) {
        return { success: false, error: 'Por favor, insira um e-mail válido' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { 
          success: false, 
          error: passwordValidation.errors[0] 
        };
      }

      console.log('📝 Tentativa de registro seguro para:', cleanEmail);
      
      // Generate secure redirect URL
      const redirectUrl = `${window.location.origin}/`;
      if (!validateRedirectUrl(redirectUrl)) {
        return { 
          success: false, 
          error: 'Erro de configuração. Contate o suporte.' 
        };
      }

      const fingerprint = generateSessionFingerprint();
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: cleanName,
            fingerprint
          },
        },
      });

      if (error) {
        console.error('❌ Erro no registro:', error.message);
        return { 
          success: false, 
          error: getSecureErrorMessage(error.message) 
        };
      }

      if (data.user) {
        console.log('✅ Registro seguro bem-sucedido para:', data.user.email);
        rateLimiter.clear(rateLimitKey); // Clear rate limit on success
        return { success: true };
      }

      return { success: false, error: 'Erro na criação da conta' };
    } catch (error) {
      console.error('❌ Erro inesperado no registro:', error);
      return { 
        success: false, 
        error: getSecureErrorMessage(error) 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    secureLogin,
    secureRegister,
    isLoading
  };
};
