import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';
import Header from '@/components/Header';
import MoodCard from '@/components/MoodCard';
import DiaryCard from '@/components/DiaryCard';
import ServicesCarousel from '@/components/ServicesCarousel';
import QuickActions from '@/components/QuickActions';
import { Star, Calendar, Trophy, Zap, Target } from 'lucide-react';

// Definição das conquistas
const achievements = [
  {
    id: 'first_mood',
    title: 'Primeiro Registro',
    description: 'Registre seu primeiro humor',
    icon: <Star className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 1
  },
  {
    id: 'mood_week',
    title: 'Semana Completa',
    description: 'Registre seu humor por 7 dias seguidos',
    icon: <Calendar className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 7
  },
  {
    id: 'mood_month',
    title: 'Mês Dedicado',
    description: 'Registre seu humor por 30 dias seguidos',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 30
  },
  {
    id: 'chat_start',
    title: 'Primeira Conversa',
    description: 'Inicie uma conversa com a Tranquilinha',
    icon: <Zap className="h-6 w-6" />,
    category: 'interaction' as const,
    requirement: 1
  },
  {
    id: 'theme_explorer',
    title: 'Explorador de Temas',
    description: 'Experimente todos os 3 temas visuais',
    icon: <Target className="h-6 w-6" />,
    category: 'exploration' as const,
    requirement: 3
  },
  {
    id: 'level_5',
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    icon: <Star className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 5
  },
  {
    id: 'mood_50',
    title: 'Meio Século',
    description: 'Registre 50 humores',
    icon: <Trophy className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 50
  },
  {
    id: 'streak_100',
    title: 'Centenário',
    description: 'Mantenha uma sequência de 100 dias',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 100
  }
];

const HomePage = () => {
  const { user, unlockAchievement } = useUser();
  const { theme, usedThemes } = useTheme();
  const { showAchievementAnimation } = useAchievementAnimation();

  const getProgress = (achievement: typeof achievements[0]): number => {
    if (!user) return 0;

    switch (achievement.category) {
      case 'mood':
        if (achievement.id === 'level_5') {
          return user.level;
        }
        return user.moods.length;
      case 'streak':
        return user.streak;
      case 'interaction':
        return localStorage.getItem('has_chatted') ? 1 : 0;
      case 'exploration':
        console.log('Verificando temas usados:', usedThemes, 'Total:', usedThemes.length);
        return usedThemes.length;
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: typeof achievements[0]): boolean => {
    return user?.achievements.includes(achievement.id) || false;
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return;

    const achievementToUnlock = achievements.find(achievement => {
      const progress = getProgress(achievement);
      console.log(`Verificando conquista ${achievement.id}: progresso ${progress}/${achievement.requirement}, desbloqueada: ${isUnlocked(achievement)}`);
      return progress >= achievement.requirement && !isUnlocked(achievement);
    });
    
    if (achievementToUnlock) {
      console.log('Desbloqueando conquista:', achievementToUnlock.title);
      unlockAchievement(achievementToUnlock.id);
      showAchievementAnimation(achievementToUnlock);
    }
  };

  useEffect(() => {
    checkAndUnlockAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.moods.length, user?.streak, user?.level, usedThemes.length]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="floating-particles" style={{ top: '15%', left: '10%' }}></div>
      <div className="floating-particles" style={{ top: '30%', right: '15%' }}></div>
      <div className="floating-particles" style={{ bottom: '25%', left: '20%' }}></div>
      <div className="floating-particles" style={{ bottom: '40%', right: '10%' }}></div>
      
      <Header />
      
      <div className="max-w-6xl mx-auto mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodCard />
          <DiaryCard />
        </div>
        
        <ServicesCarousel />
        
        <QuickActions />
      </div>
    </div>
  );
};

export default HomePage;
