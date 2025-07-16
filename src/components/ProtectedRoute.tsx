
import { useUser } from '@/contexts/UserContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOnboarding } from '@/hooks/useOnboarding';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const { hasCompletedOnboarding } = useOnboarding();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔐 Verificando autenticação no ProtectedRoute:', !!session);
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Mostrar opção de retry após 8 segundos
    timeoutId = setTimeout(() => {
      if (isCheckingAuth) {
        setShowRetry(true);
      }
    }, 8000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCheckingAuth]);

  const handleRetry = () => {
    setIsCheckingAuth(true);
    setShowRetry(false);
    window.location.reload();
  };

  const handleForceLogout = () => {
    supabase.auth.signOut();
    window.location.href = '/auth';
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold mb-4">
            Tranquili<span className="tranquili-plus">+</span>
          </div>
          <p className="text-xl text-muted-foreground">Carregando...</p>
          
          {showRetry && (
            <div className="space-y-2 mt-6">
              <p className="text-sm text-muted-foreground">
                Está demorando mais que o normal?
              </p>
              <div className="space-x-2">
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Tentar Novamente
                </button>
                <button 
                  onClick={handleForceLogout}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Ir para Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Se o usuário está autenticado mas não completou o onboarding
  // e não está na página de onboarding, redirecionar
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Se o usuário já completou o onboarding mas está na página de onboarding
  // redirecionar para home
  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
