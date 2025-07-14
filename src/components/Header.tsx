
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Sparkles, LogOut } from 'lucide-react';
import { calculateXPRequirement } from '@/utils/xpSystem';
import { getFirstName } from '@/utils/userUtils';

const Header = () => {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { playClickSound } = useAudio();

  const handleLogout = () => {
    playClickSound();
    logout();
    // Usar window.location ao invés de navigate para evitar problemas de context
    window.location.href = '/auth';
  };

  const handleThemeToggle = () => {
    playClickSound();
    toggleTheme();
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'tranquili':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'tranquili':
        return 'Tranquili';
      default:
        return 'Claro';
    }
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
            Olá, {getFirstName(user.name)}! 👋
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
            onClick={handleThemeToggle}
            className="glassmorphism"
          >
            {getThemeIcon()}
            <span className="ml-2 hidden sm:inline">{getThemeLabel()}</span>
          </Button>
          
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
