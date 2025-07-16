import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Loader2 } from 'lucide-react';

const OnboardingPage = () => {
  const { isAuthenticated } = useUser();
  const { hasCompletedOnboarding } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não estiver autenticado, redirecionar para auth
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    // Se já completou o onboarding, redirecionar para home
    if (hasCompletedOnboarding) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  // Loading state enquanto verifica a autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg text-foreground/70">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <OnboardingFlow />;
};

export default OnboardingPage;