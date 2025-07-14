
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';
import { Star, Calendar, Trophy, Zap, Target } from 'lucide-react';

const achievements = [
  {
    id: 'first_mood',
    title: 'Primeiro Registro',
    description: 'Registre seu primeiro humor',
    icon: <Star className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 1,
    checkCondition: (user: any) => user?.moods?.length >= 1
  },
  {
    id: 'mood_week',
    title: 'Semana Completa',
    description: 'Registre seu humor por 7 dias seguidos',
    icon: <Calendar className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 7,
    checkCondition: (user: any) => user?.streak >= 7
  },
  {
    id: 'mood_month',
    title: 'Mês Dedicado',
    description: 'Registre seu humor por 30 dias seguidos',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 30,
    checkCondition: (user: any) => user?.streak >= 30
  },
  {
    id: 'chat_start',
    title: 'Primeira Conversa',
    description: 'Inicie uma conversa com a Tranquilinha',
    icon: <Zap className="h-6 w-6" />,
    category: 'interaction' as const,
    requirement: 1,
    checkCondition: () => localStorage.getItem('has_chatted') === 'true'
  },
  {
    id: 'theme_explorer',
    title: 'Explorador de Temas',
    description: 'Experimente todos os 3 temas visuais',
    icon: <Target className="h-6 w-6" />,
    category: 'exploration' as const,
    requirement: 3,
    checkCondition: (user: any, usedThemes: string[]) => usedThemes?.length >= 3
  },
  {
    id: 'level_5',
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    icon: <Star className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 5,
    checkCondition: (user: any) => user?.level >= 5
  },
  {
    id: 'mood_50',
    title: 'Meio Século',
    description: 'Registre 50 humores',
    icon: <Trophy className="h-6 w-6" />,
    category: 'mood' as const,
    requirement: 50,
    checkCondition: (user: any) => user?.moods?.length >= 50
  },
  {
    id: 'streak_100',
    title: 'Centenário',
    description: 'Mantenha uma sequência de 100 dias',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak' as const,
    requirement: 100,
    checkCondition: (user: any) => user?.streak >= 100
  }
];

export const useReactiveAchievements = () => {
  const { user, unlockAchievement } = useUser();
  const { usedThemes } = useTheme();
  const { subscribe } = useEventSystem();
  const { showAchievementAnimation } = useAchievementAnimation();

  const checkAchievements = () => {
    if (!user) return;

    console.log('🏆 Verificando conquistas automaticamente...');
    
    achievements.forEach(achievement => {
      const isUnlocked = user.achievements.includes(achievement.id);
      if (!isUnlocked) {
        const shouldUnlock = achievement.checkCondition(user, usedThemes);
        
        if (shouldUnlock) {
          console.log(`🎉 Desbloqueando conquista: ${achievement.title}`);
          unlockAchievement(achievement.id);
          showAchievementAnimation(achievement);
        }
      }
    });
  };

  useEffect(() => {
    if (!user) return;

    // Verificar conquistas imediatamente
    checkAchievements();

    // Inscrever em eventos relevantes
    const unsubscribers = [
      subscribe('mood_registered', checkAchievements),
      subscribe('level_up', checkAchievements),
      subscribe('streak_updated', checkAchievements),
      subscribe('theme_changed', checkAchievements),
      subscribe('chat_started', checkAchievements),
      subscribe('xp_gained', checkAchievements)
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [user, usedThemes.length]);

  return { checkAchievements };
};
