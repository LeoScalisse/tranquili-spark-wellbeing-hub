import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { generateSessionFingerprint } from '@/utils/securityUtils';

interface SessionState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionError: string | null;
}

export const useSecureSession = () => {
  const [sessionState, setSessionState] = useState<SessionState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    sessionError: null
  });

  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout>();
  const currentFingerprintRef = useRef<string>();

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  
  // Session check interval (every 5 minutes)
  const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    sessionTimeoutRef.current = setTimeout(async () => {
      console.log('🕐 Sessão expirada por inatividade');
      await supabase.auth.signOut();
      setSessionState(prev => ({
        ...prev,
        sessionError: 'Sessão expirada por inatividade. Faça login novamente.'
      }));
    }, SESSION_TIMEOUT);
  }, []);

  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session) return false;

    try {
      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.log('🚨 Sessão expirada');
        return false;
      }

      // Validate session fingerprint if available
      const currentFingerprint = generateSessionFingerprint();
      const sessionFingerprint = session.user.user_metadata?.fingerprint;
      
      if (sessionFingerprint && currentFingerprintRef.current) {
        if (sessionFingerprint !== currentFingerprint) {
          console.log('🚨 Fingerprint da sessão não confere - possível sequestro');
          return false;
        }
      }
      
      currentFingerprintRef.current = currentFingerprint;

      // Verify session with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
      
      if (error || !user) {
        console.log('🚨 Sessão inválida no servidor');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erro na validação da sessão:', error);
      return false;
    }
  }, []);

  const forceLogout = useCallback(async (reason?: string) => {
    console.log('🚪 Logout forçado:', reason);
    
    // Clear timeouts
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
    }

    await supabase.auth.signOut();
    
    setSessionState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      sessionError: reason || 'Sessão invalidada'
    });
  }, []);

  const handleSessionChange = useCallback(async (event: string, session: Session | null) => {
    console.log('🔄 Mudança de sessão:', event);

    if (event === 'SIGNED_IN' && session) {
      const isValid = await validateSession(session);
      
      if (isValid) {
        setSessionState({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
          sessionError: null
        });
        
        resetSessionTimeout();
        
        // Start periodic session validation
        if (sessionCheckIntervalRef.current) {
          clearInterval(sessionCheckIntervalRef.current);
        }
        
        sessionCheckIntervalRef.current = setInterval(async () => {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          const isStillValid = await validateSession(currentSession);
          
          if (!isStillValid) {
            await forceLogout('Sessão invalidada durante verificação periódica');
          }
        }, SESSION_CHECK_INTERVAL);
        
      } else {
        await forceLogout('Sessão inválida detectada');
      }
    } else if (event === 'SIGNED_OUT') {
      setSessionState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        sessionError: null
      });
      
      // Clear timeouts
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    } else if (event === 'TOKEN_REFRESHED' && session) {
      // Validate refreshed token
      const isValid = await validateSession(session);
      
      if (isValid) {
        setSessionState(prev => ({
          ...prev,
          session,
          user: session.user
        }));
        resetSessionTimeout();
      } else {
        await forceLogout('Token renovado é inválido');
      }
    }
  }, [validateSession, resetSessionTimeout, forceLogout]);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          if (isMounted) {
            setSessionState(prev => ({
              ...prev,
              isLoading: false,
              sessionError: 'Erro ao carregar sessão'
            }));
          }
          return;
        }

        if (session && isMounted) {
          await handleSessionChange('SIGNED_IN', session);
        } else if (isMounted) {
          setSessionState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('❌ Erro na inicialização da sessão:', error);
        if (isMounted) {
          setSessionState(prev => ({
            ...prev,
            isLoading: false,
            sessionError: 'Erro na inicialização'
          }));
        }
      }
    };

    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleSessionChange);

    // Activity tracking for session timeout
    const resetTimeout = () => resetSessionTimeout();
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, resetTimeout, { passive: true }));

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
      
      events.forEach(event => document.removeEventListener(event, resetTimeout));
    };
  }, [handleSessionChange, resetSessionTimeout]);

  const clearSessionError = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      sessionError: null
    }));
  }, []);

  return {
    ...sessionState,
    forceLogout,
    clearSessionError,
    validateSession: () => validateSession(sessionState.session)
  };
};
