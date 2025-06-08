
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Lock, Calendar, Star, Target, Zap } from 'lucide-react';
import AchievementModal from '@/components/AchievementModal';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration';
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
  }
];

const AchievementsPage = () => {
  const { user, unlockAchievement } = useUser();
  const { playClickSound, playAchievementSound } = useAudio();
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
        return user.moods.length;
      case 'streak':
        return user.streak;
      case 'interaction':
        // This would track chat interactions - for now, we'll assume they've chatted if they visited the page
        return localStorage.getItem('has_chatted') ? 1 : 0;
      case 'exploration':
        // This would track theme changes - for now, we'll check if they've changed themes
        return localStorage.getItem('themes_used') ? parseInt(localStorage.getItem('themes_used') || '1') : 1;
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    return user?.achievements.includes(achievement.id) || false;
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return;

    achievements.forEach(achievement => {
      const progress = getProgress(achievement);
      const shouldUnlock = progress >= achievement.requirement && !isUnlocked(achievement);
      
      if (shouldUnlock) {
        unlockAchievement(achievement.id);
        playAchievementSound();
        // Show achievement unlock animation
        setSelectedAchievement(achievement);
        setShowModal(true);
      }
    });
  };

  useEffect(() => {
    checkAndUnlockAchievements();
  }, [user]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mood': return 'text-blue-500';
      case 'streak': return 'text-green-500';
      case 'interaction': return 'text-purple-500';
      case 'exploration': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'mood': return 'Humor';
      case 'streak': return 'Sequência';
      case 'interaction': return 'Interação';
      case 'exploration': return 'Exploração';
      default: return 'Geral';
    }
  };

  const handleAchievementClick = (achievement: Achievement) => {
    playClickSound();
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
              onClick={() => {
                playClickSound();
                navigate('/');
              }}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-500 mb-2">💙 Humor</h4>
                <p>Registre seu humor diariamente para desbloquear conquistas relacionadas ao bem-estar emocional.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-green-500 mb-2">🔥 Sequência</h4>
                <p>Mantenha uma rotina consistente de registro para construir sequências longas.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-500 mb-2">💬 Interação</h4>
                <p>Converse com a Tranquilinha e explore as funcionalidades do aplicativo.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-500 mb-2">🎨 Exploração</h4>
                <p>Experimente diferentes temas e explore todas as seções do app.</p>
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
