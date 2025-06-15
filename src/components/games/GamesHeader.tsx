
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

interface GamesHeaderProps {
  onBackClick: () => void;
  onResetOnboarding: () => void;
}

const GamesHeader: React.FC<GamesHeaderProps> = ({ onBackClick, onResetOnboarding }) => {
  return (
    <Card className="glassmorphism">
      <CardHeader className="flex-row items-center space-y-0 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            TranquiliGames
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mini-jogos relaxantes para exercitar sua mente
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetOnboarding}
          className="ml-4"
        >
          ⚙️ Revisar Objetivos
        </Button>
      </CardHeader>
    </Card>
  );
};

export default GamesHeader;
