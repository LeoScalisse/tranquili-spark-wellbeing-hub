
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Target, Brain, Sparkles, Heart, Infinity } from 'lucide-react';

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  categories: string[];
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  duration: string;
  benefits: string[];
}

export const games: Game[] = [
  {
    id: 'color-confusion',
    title: 'Confusão de Cores',
    description: 'Teste sua atenção seletiva e concentração com este desafio cognitivo inspirado no teste de Stroop.',
    icon: <Brain className="h-6 w-6" />,
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    categories: ['Foco', 'Atenção', 'Cognição'],
    difficulty: 'Médio',
    duration: '5-15 min',
    benefits: ['Melhora concentração', 'Exercita atenção seletiva', 'Fortalece controle inibitório']
  },
  {
    id: 'memory-fragments',
    title: 'Fragmentos da Memória',
    description: 'Desafie sua memória de trabalho reproduzindo sequências de cores progressivamente mais complexas.',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    categories: ['Memória', 'Sequência', 'Cognição'],
    difficulty: 'Médio',
    duration: '3-10 min',
    benefits: ['Fortalece memória de trabalho', 'Melhora capacidade sequencial', 'Exercita concentração']
  },
  {
    id: 'tranquili-match',
    title: 'TranquiliMatch+',
    description: 'Um jogo match-3 relaxante com fases infinitas, design sensorial e trilha sonora calmante para promover bem-estar.',
    icon: <Heart className="h-6 w-6" />,
    color: 'bg-gradient-to-br from-blue-300 via-green-300 to-purple-300',
    categories: ['Relaxamento', 'Bem-estar', 'Infinito'],
    difficulty: 'Fácil',
    duration: 'Ilimitado',
    benefits: ['Reduz estresse', 'Promove relaxamento', 'Melhora humor', 'Experiência sensorial']
  }
];

interface GamesListProps {
  filteredGames: Game[];
  onGameSelect: (gameId: string) => void;
}

const GamesList: React.FC<GamesListProps> = ({ filteredGames, onGameSelect }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-600 bg-green-100';
      case 'Médio': return 'text-yellow-600 bg-yellow-100';
      case 'Difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGameIcon = (gameId: string) => {
    switch (gameId) {
      case 'tranquili-match':
        return <Infinity className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGames.map((game) => (
        <Card key={game.id} className="glassmorphism hover:scale-105 transition-all duration-300 cursor-pointer">
          <CardHeader className="space-y-4">
            <div className={`${game.color} p-4 rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {game.icon}
            </div>
            
            <div>
              <CardTitle className="text-xl">{game.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {game.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {game.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {getGameIcon(game.id)}
                <span>{game.duration}</span>
              </div>
              <Badge className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                {game.difficulty}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Benefícios:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {game.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={() => onGameSelect(game.id)}
              className="w-full mt-4"
            >
              Jogar Agora
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GamesList;
