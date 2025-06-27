
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estimatedTime: string;
  benefits: string[];
  categories: string[];
}

interface GameCardProps {
  game: Game;
  onGameSelect: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameSelect }) => {
  const isMobile = useIsMobile();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500';
      case 'Médio': return 'bg-yellow-500';
      case 'Difícil': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={`glassmorphism hover:scale-105 transition-transform cursor-pointer ${
        isMobile ? 'active:scale-95' : ''
      }`}
      onClick={() => onGameSelect(game.id)}
    >
      <CardContent className={`${isMobile ? 'p-4 space-y-3' : 'p-6 space-y-4'}`}>
        <div className="text-center">
          <div className={`text-accent mx-auto w-fit ${isMobile ? 'mb-3' : 'mb-4'}`}>
            {game.icon}
          </div>
          <h3 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            {game.title}
          </h3>
          <p className={`text-muted-foreground leading-relaxed ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            {game.description}
          </p>
        </div>
        
        <div className={`flex items-center justify-center gap-2 ${
          isMobile ? 'flex-wrap' : ''
        }`}>
          <Badge 
            variant="outline" 
            className={`${isMobile ? 'text-xs px-2 py-1' : 'text-xs'} ${getDifficultyColor(game.difficulty)} text-white border-0`}
          >
            {game.difficulty}
          </Badge>
          
          <Badge variant="outline" className={`${isMobile ? 'text-xs px-2 py-1' : 'text-xs'}`}>
            <Clock className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} mr-1`} />
            {game.estimatedTime}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Benefícios:
          </h4>
          <div className="flex flex-wrap gap-1">
            {game.benefits.slice(0, isMobile ? 2 : 3).map((benefit, index) => (
              <Badge key={index} variant="secondary" className={`${
                isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'
              }`}>
                {benefit}
              </Badge>
            ))}
            {isMobile && game.benefits.length > 2 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                +{game.benefits.length - 2}
              </Badge>
            )}
          </div>
        </div>
        
        <Button className={`w-full ${isMobile ? 'mt-3 min-h-[44px] text-sm' : 'mt-4'}`}>
          🎮 Jogar Agora
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
