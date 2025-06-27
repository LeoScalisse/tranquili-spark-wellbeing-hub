
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GamesHeaderProps {
  onBackClick: () => void;
  onResetOnboarding: () => void;
}

const GamesHeader: React.FC<GamesHeaderProps> = ({ onBackClick, onResetOnboarding }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="glassmorphism">
      <CardHeader className={`${isMobile ? 'pb-3 px-4' : 'pb-4'}`}>
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'flex-row'} space-y-0`}>
          <div className={`flex items-center ${isMobile ? 'w-full justify-between' : 'flex-1'}`}>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              onClick={onBackClick}
              className={`${isMobile ? 'px-3' : 'mr-4'} min-h-[44px]`}
            >
              <ArrowLeft className="h-4 w-4" />
              {isMobile && <span className="ml-2 text-sm">Voltar</span>}
            </Button>
            
            <div className={`${isMobile ? 'text-center' : 'flex-1'}`}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg justify-center' : ''}`}>
                <Gamepad2 className="h-5 w-5" />
                TranquiliGames
              </CardTitle>
              {!isMobile && (
                <p className="text-sm text-muted-foreground">
                  Mini-jogos relaxantes para exercitar sua mente
                </p>
              )}
            </div>

            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetOnboarding}
                className="ml-4"
              >
                ⚙️ Revisar Objetivos
              </Button>
            )}
          </div>

          {isMobile && (
            <div className="w-full">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Mini-jogos relaxantes para exercitar sua mente
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetOnboarding}
                className="w-full min-h-[44px]"
              >
                ⚙️ Revisar Objetivos
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default GamesHeader;
