
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSecureSession } from '@/hooks/useSecureSession';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const { sessionError, clearSessionError } = useSecureSession();
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  useEffect(() => {
    if (sessionError) {
      setShowSecurityAlert(true);
      // Auto-hide alert after 5 seconds
      const timer = setTimeout(() => {
        setShowSecurityAlert(false);
        clearSessionError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [sessionError, clearSessionError]);

  if (showSecurityAlert && sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-4xl font-bold mb-4">
            Tranquili<span className="tranquili-plus">+</span>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <div className="text-red-600">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Sessão Invalidada
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {sessionError}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => {
                setShowSecurityAlert(false);
                clearSessionError();
                window.location.href = '/auth';
              }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Ir para Login
            </button>
          </div>
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
