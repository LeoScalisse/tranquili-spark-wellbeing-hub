
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) return;
    
    const timeout = setTimeout(() => {
      setIsRedirecting(true);
      
      // Verificar se o onboarding já foi visto
      const onboardingViewed = localStorage.getItem('onboarding_viewed');
      
      if (!onboardingViewed) {
        console.log('🎯 Primeira visita - redirecionando para onboarding');
        navigate('/onboarding', { replace: true });
        return;
      }
      
      // Se onboarding já foi visto, seguir fluxo de autenticação
      if (isAuthenticated) {
        console.log('✅ Usuário autenticado - redirecionando para home');
        navigate('/home', { replace: true });
      } else {
        console.log('❌ Usuário não autenticado - redirecionando para auth');
        navigate('/auth', { replace: true });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, navigate, isRedirecting]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">
          Tranquili<span className="tranquili-plus">+</span>
        </div>
        <p className="text-xl text-muted-foreground">
          {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
        </p>
      </div>
    </div>
  );
};

export default Index;
