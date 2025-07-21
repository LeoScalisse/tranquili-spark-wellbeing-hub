
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateXPRequirement } from '@/utils/xpSystem';

const Header = () => {
  const { user, logout } = useUser();
  const { playClickSound } = useAudio();
  const { getUserName } = useOnboarding();
  const navigate = useNavigate();

  const handleLogout = () => {
    playClickSound();
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  const xpRequired = calculateXPRequirement(user.level);
  const xpPercentage = (user.currentLevelXP / xpRequired) * 100;

  return (
    <header className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-xl glassmorphism animate-fade-in">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Tranquili<span className="tranquili-plus">+</span>
          </h1>
          <Badge variant="secondary" className="text-sm">
            Olá, {getUserName()}! 👋
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-medium">Nível {user.level}</p>
            <div className="w-24 mt-1">
              <Progress value={xpPercentage} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.currentLevelXP}/{xpRequired} XP
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-medium">🔥 {user.streak}</p>
            <p className="text-xs text-muted-foreground">dias seguidos</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="glassmorphism"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
