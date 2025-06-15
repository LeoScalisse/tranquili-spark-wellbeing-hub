import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Lock, Calendar, Star, Target, Zap, Heart, Gamepad2, BarChart3, Palette, Volume2, MessageCircle, Gift, Crown, Flame } from 'lucide-react';
import AchievementModal from '@/components/AchievementModal';
import AchievementUnlockAnimation from '@/components/AchievementUnlockAnimation';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration' | 'games' | 'social';
  requirement: number;
  currentProgress?: number;
}

const achievements: Achievement[] = [
  {
    id: 'first_mood',
    title: 'Primeiro Registro',
    description: 'Registre seu primeiro humor',
    icon: <Star className="h-6 w-6" />,
    category: 'mood',
    requirement: 1
  },
  {
    id: 'mood_week',
    title: 'Semana Completa',
    description: 'Registre seu humor por 7 dias seguidos',
    icon: <Calendar className="h-6 w-6" />,
    category: 'streak',
    requirement: 7
  },
  {
    id: 'mood_month',
    title: 'Mês Dedicado',
    description: 'Registre seu humor por 30 dias seguidos',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak',
    requirement: 30
  },
  {
    id: 'chat_start',
    title: 'Primeira Conversa',
    description: 'Inicie uma conversa com a Tranquilinha',
    icon: <Zap className="h-6 w-6" />,
    category: 'interaction',
    requirement: 1
  },
  {
    id: 'theme_explorer',
    title: 'Explorador de Temas',
    description: 'Experimente todos os 3 temas visuais',
    icon: <Target className="h-6 w-6" />,
    category: 'exploration',
    requirement: 3
  },
  {
    id: 'level_5',
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    icon: <Star className="h-6 w-6" />,
    category: 'mood',
    requirement: 5
  },
  {
    id: 'mood_50',
    title: 'Meio Século',
    description: 'Registre 50 humores',
    icon: <Trophy className="h-6 w-6" />,
    category: 'mood',
    requirement: 50
  },
  {
    id: 'streak_100',
    title: 'Centenário',
    description: 'Mantenha uma sequência de 100 dias',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak',
    requirement: 100
  },

  {
    id: 'mood_master',
    title: 'Mestre do Humor',
    description: 'Registre todos os 8 tipos de humor disponíveis',
    icon: <Heart className="h-6 w-6" />,
    category: 'mood',
    requirement: 8
  },
  {
    id: 'games_beginner',
    title: 'Jogador Iniciante',
    description: 'Jogue qualquer jogo da Tranquili Games pela primeira vez',
    icon: <Gamepad2 className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'games_enthusiast',
    title: 'Entusiasta dos Jogos',
    description: 'Jogue todos os jogos disponíveis pelo menos uma vez',
    icon: <Crown className="h-6 w-6" />,
    category: 'games',
    requirement: 2
  },
  {
    id: 'report_viewer',
    title: 'Analista de Bem-estar',
    description: 'Visualize seu relatório de humor pela primeira vez',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'exploration',
    requirement: 1
  },
  {
    id: 'audio_explorer',
    title: 'Maestro dos Sons',
    description: 'Experimente diferentes configurações de áudio',
    icon: <Volume2 className="h-6 w-6" />,
    category: 'exploration',
    requirement: 1
  },
  {
    id: 'chat_conversationalist',
    title: 'Conversador Dedicado',
    description: 'Tenha 10 conversas diferentes com a Tranquilinha',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'interaction',
    requirement: 10
  },
  {
    id: 'daily_warrior',
    title: 'Guerreiro Diário',
    description: 'Complete uma sequência de 14 dias registrando humor',
    icon: <Flame className="h-6 w-6" />,
    category: 'streak',
    requirement: 14
  },
  {
    id: 'theme_designer',
    title: 'Designer de Temas',
    description: 'Altere entre temas mais de 5 vezes em uma sessão',
    icon: <Palette className="h-6 w-6" />,
    category: 'exploration',
    requirement: 5
  },
  {
    id: 'achievement_hunter',
    title: 'Caçador de Conquistas',
    description: 'Desbloqueie 5 conquistas diferentes',
    icon: <Gift className="h-6 w-6" />,
    category: 'social',
    requirement: 5
  },
  {
    id: 'tranquili_veteran',
    title: 'Veterano Tranquili',
    description: 'Use o app por 7 dias diferentes (não consecutivos)',
    icon: <Crown className="h-6 w-6" />,
    category: 'social',
    requirement: 7
  },
  {
    id: 'tranquili_first_match',
    title: 'Primeira Combinação',
    description: 'Complete sua primeira fase no TranquiliMatch+',
    icon: <Heart className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'tranquili_zen_master',
    title: 'Mestre Zen',
    description: 'Complete sua primeira Fase Zen no TranquiliMatch+',
    icon: <Crown className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'tranquili_marathonist',
    title: 'Maratonista Tranquilo',
    description: 'Complete 25 fases no TranquiliMatch+',
    icon: <Flame className="h-6 w-6" />,
    category: 'games',
    requirement: 25
  },
  {
    id: 'tranquili_collector',
    title: 'Colecionador de Calma',
    description: 'Colete 500 peças no TranquiliMatch+',
    icon: <Gift className="h-6 w-6" />,
    category: 'games',
    requirement: 500
  }
];

const AchievementsPage = () => {
  const { user, unlockAchievement } = useUser();
  const { usedThemes } = useTheme();
  const { playAchievementSound } = useAudio();
  const { showAchievementAnimation } = useAchievementAnimation();
  const navigate = useNavigate();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getProgress = (achievement: Achievement): number => {
    if (!user) return 0;

    switch (achievement.category) {
      case 'mood':
        if (achievement.id === 'level_5') {
          return user.level;
        }
        if (achievement.id === 'mood_master') {
          // Contar quantos tipos únicos de humor foram registrados
          const uniqueMoods = new Set(user.moods.map(mood => mood.mood));
          return uniqueMoods.size;
        }
        return user.moods.length;
      case 'streak':
        return user.streak;
      case 'interaction':
        if (achievement.id === 'chat_conversationalist') {
          return parseInt(localStorage.getItem('chat_conversations_count') || '0');
        }
        return localStorage.getItem('has_chatted') ? 1 : 0;
      case 'exploration':
        if (achievement.id === 'theme_explorer') {
          return usedThemes.length;
        }
        if (achievement.id === 'report_viewer') {
          return localStorage.getItem('has_viewed_report') ? 1 : 0;
        }
        if (achievement.id === 'audio_explorer') {
          return localStorage.getItem('has_changed_audio') ? 1 : 0;
        }
        if (achievement.id === 'theme_designer') {
          return parseInt(localStorage.getItem('theme_changes_count') || '0');
        }
        return usedThemes.length;
      case 'games':
        if (achievement.id === 'games_beginner') {
          return localStorage.getItem('has_played_games') ? 1 : 0;
        }
        if (achievement.id === 'games_enthusiast') {
          const playedGames = JSON.parse(localStorage.getItem('played_games') || '[]');
          return playedGames.length;
        }
        if (achievement.id === 'tranquili_first_match') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          return progress ? 1 : 0;
        }
        if (achievement.id === 'tranquili_zen_master') {
          return parseInt(localStorage.getItem(`tranquili-zen-completed-${user.id}`) || '0');
        }
        if (achievement.id === 'tranquili_marathonist') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          if (progress) {
            const data = JSON.parse(progress);
            return data.level || 0;
          }
          return 0;
        }
        if (achievement.id === 'tranquili_collector') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          if (progress) {
            const data = JSON.parse(progress);
            return data.totalCollected || 0;
          }
          return 0;
        }
        return 0;
      case 'social':
        if (achievement.id === 'achievement_hunter') {
          return user.achievements.length;
        }
        if (achievement.id === 'tranquili_veteran') {
          const usageDays = JSON.parse(localStorage.getItem('app_usage_days') || '[]');
          return usageDays.length;
        }
        return 0;
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    return user?.achievements.includes(achievement.id) || false;
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return;

    const achievementToUnlock = achievements.find(achievement => {
      const progress = getProgress(achievement);
      return progress >= achievement.requirement && !isUnlocked(achievement);
    });
    
    if (achievementToUnlock) {
      unlockAchievement(achievementToUnlock.id);
      showAchievementAnimation(achievementToUnlock);
    }
  };

  useEffect(() => {
    checkAndUnlockAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, usedThemes.length]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mood': return 'text-blue-500';
      case 'streak': return 'text-green-500';
      case 'interaction': return 'text-purple-500';
      case 'exploration': return 'text-orange-500';
      case 'games': return 'text-red-500';
      case 'social': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'mood': return 'Humor';
      case 'streak': return 'Sequência';
      case 'interaction': return 'Interação';
      case 'exploration': return 'Exploração';
      case 'games': return 'Jogos';
      case 'social': return 'Social';
      default: return 'Geral';
    }
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  const unlockedCount = achievements.filter(a => isUnlocked(a)).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Conquistas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Seus progressos e desbloqueios na jornada de bem-estar
              </p>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement);
            const progress = getProgress(achievement);
            const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);

            return (
              <Card
                key={achievement.id}
                className={`
                  glassmorphism transition-all duration-300 cursor-pointer
                  ${unlocked 
                    ? 'border-accent shadow-lg hover:scale-105' 
                    : 'opacity-60 hover:opacity-80'
                  }
                `}
                onClick={() => handleAchievementClick(achievement)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`
                    ${unlocked ? getCategoryColor(achievement.category) : 'text-muted-foreground'}
                    mx-auto w-fit
                  `}>
                    {unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(achievement.category)}
                    </Badge>
                  </div>
                  
                  {!unlocked && (
                    <div className="space-y-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-accent rounded-full h-2 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {progress}/{achievement.requirement}
                      </p>
                    </div>
                  )}
                  
                  {unlocked && (
                    <Badge variant="default" className="w-full">
                      ✨ Desbloqueado!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Dicas para Conquistar</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-500 mb-2">💙 Humor</h4>
                <p>Registre seu humor diariamente e experimente todos os tipos disponíveis.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-green-500 mb-2">🔥 Sequência</h4>
                <p>Mantenha uma rotina consistente de registro para construir sequências longas.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-500 mb-2">💬 Interação</h4>
                <p>Converse frequentemente com a Tranquilinha e explore funcionalidades.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-500 mb-2">🎨 Exploração</h4>
                <p>Experimente temas, visualize relatórios e configure áudio.</p>
              </div>

              <div>
                <h4 className="font-medium text-red-500 mb-2">🎮 Jogos</h4>
                <p>Jogue todos os mini-games disponíveis na Tranquili Games.</p>
              </div>

              <div>
                <h4 className="font-medium text-pink-500 mb-2">👥 Social</h4>
                <p>Use o app regularmente e desbloqueie outras conquistas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AchievementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        achievement={selectedAchievement}
        isUnlocked={selectedAchievement ? isUnlocked(selectedAchievement) : false}
        progress={selectedAchievement ? getProgress(selectedAchievement) : 0}
      />
    </div>
  );
};

export default AchievementsPage;
