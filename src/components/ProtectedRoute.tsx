
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showRetry, setShowRetry] = useState(false);

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

  return <>{children}</>;
};

export default ProtectedRoute;
