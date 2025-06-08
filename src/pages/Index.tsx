
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">
          Tranquili<span className="tranquili-plus">+</span>
        </div>
        <p className="text-xl text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
