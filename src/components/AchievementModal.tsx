import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration' | 'games' | 'social';
  requirement: number;
}

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  isUnlocked: boolean;
  progress: number;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ 
  isOpen, 
  onClose, 
  achievement, 
  isUnlocked, 
  progress 
}) => {
  if (!achievement) return null;

  const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism max-w-md text-center">
        {isUnlocked && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full animate-pulse bg-accent/10 rounded-lg"></div>
          </div>
        )}
        
        <DialogHeader className="space-y-4">
          <div className={`
            ${isUnlocked ? getCategoryColor(achievement.category) : 'text-muted-foreground'}
            mx-auto w-fit text-6xl
            ${isUnlocked ? 'animate-bounce-soft' : ''}
          `}>
            {isUnlocked ? achievement.icon : <Lock className="h-16 w-16" />}
          </div>
          
          <DialogTitle className="text-2xl">
            {achievement.title}
          </DialogTitle>
          
          <DialogDescription className="text-base">
            {achievement.description}
          </DialogDescription>
          
          <Badge 
            variant={isUnlocked ? "default" : "outline"} 
            className="mx-auto w-fit"
          >
            {getCategoryName(achievement.category)}
          </Badge>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {isUnlocked ? (
            <div className="space-y-2">
              <div className="text-6xl animate-zoom-in">🎉</div>
              <h3 className="text-xl font-semibold text-accent">
                Parabéns! Conquista Desbloqueada!
              </h3>
              <p className="text-sm text-muted-foreground">
                Você está fazendo um ótimo progresso na sua jornada de bem-estar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{progress}/{achievement.requirement}</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Continue sua jornada para desbloquear esta conquista!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;
