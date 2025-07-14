
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useReactiveAchievements } from '@/hooks/useReactiveAchievements';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { useAutoLevelUp } from '@/hooks/useAutoLevelUp';
import Header from '@/components/Header';
import ReactiveMoodCard from '@/components/ReactiveMoodCard';
import DiaryCard from '@/components/DiaryCard';
import ServicesCarousel from '@/components/ServicesCarousel';
import QuickActions from '@/components/QuickActions';

const HomePage = () => {
  const { user } = useUser();
  
  // Inicializar sistemas reativos
  useReactiveAchievements();
  useRealTimeSync();
  useAutoLevelUp();

  useEffect(() => {
    console.log('🏠 HomePage carregada com sistema de reatividade completo');
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="floating-particles" style={{ top: '15%', left: '10%' }}></div>
      <div className="floating-particles" style={{ top: '30%', right: '15%' }}></div>
      <div className="floating-particles" style={{ bottom: '25%', left: '20%' }}></div>
      <div className="floating-particles" style={{ bottom: '40%', right: '10%' }}></div>
      
      <Header />
      
      <div className="max-w-6xl mx-auto mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReactiveMoodCard />
          <DiaryCard />
        </div>
        
        <ServicesCarousel />
        
        <QuickActions />
      </div>
    </div>
  );
};

export default HomePage;
