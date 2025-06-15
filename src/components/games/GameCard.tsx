
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

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
      className="glassmorphism hover:scale-105 transition-transform cursor-pointer"
      onClick={() => onGameSelect(game.id)}
    >
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className="text-accent mx-auto w-fit mb-4">
            {game.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {game.description}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${getDifficultyColor(game.difficulty)} text-white border-0`}
          >
            {game.difficulty}
          </Badge>
          
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {game.estimatedTime}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Benefícios:</h4>
          <div className="flex flex-wrap gap-1">
            {game.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button className="w-full mt-4">
          🎮 Jogar Agora
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
