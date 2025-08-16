
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/hooks/useOnboarding';

const Index = () => {
  const { isAuthenticated } = useUser();
  const { hasCompletedOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log('🏠 Index - Estado de autenticação:', isAuthenticated);
    
    if (isRedirecting) return;
    
    const timeout = setTimeout(() => {
      setIsRedirecting(true);
      
      if (isAuthenticated) {
        console.log('✅ Usuário autenticado');
        if (hasCompletedOnboarding) {
          console.log('✅ Onboarding completo - redirecionando para home');
          navigate('/home', { replace: true });
        } else {
          console.log('⚠️ Onboarding pendente - redirecionando para onboarding');
          navigate('/onboarding', { replace: true });
        }
      } else {
        console.log('❌ Usuário não autenticado - redirecionando para welcome');
        navigate('/welcome', { replace: true });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, hasCompletedOnboarding, navigate, isRedirecting]);

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
