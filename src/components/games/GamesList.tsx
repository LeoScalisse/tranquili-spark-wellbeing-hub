
import { Brain, Puzzle, Sparkles, Flower, Grid3X3, Building } from 'lucide-react';
import GameCard from './GameCard';
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

interface GamesListProps {
  filteredGames: Game[];
  onGameSelect: (gameId: string) => void;
}

export const games: Game[] = [
  {
    id: 'color-confusion',
    title: 'Cor ou Confusão?',
    description: 'Baseado no Efeito Stroop. Identifique se o significado da palavra corresponde à cor apresentada.',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'Médio',
    estimatedTime: '3-5 min',
    benefits: ['Concentração', 'Atenção', 'Controle cognitivo'],
    categories: ['attention', 'inhibition', 'processing']
  },
  {
    id: 'memory-fragments',
    title: 'Fragmentos da Tranquilidade',
    description: 'Jogo de memória onde você combina fragmentos de texto para formar histórias relaxantes.',
    icon: <Puzzle className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '5-10 min',
    benefits: ['Memória', 'Relaxamento', 'Criatividade'],
    categories: ['memory', 'working-memory', 'flexibility']
  },
  {
    id: 'tranquili-match',
    title: 'TranquiliMatch+',
    description: 'Jogo match-3 relaxante com peças sensoriais. Combine elementos da natureza em fases infinitas e tranquilas.',
    icon: <Sparkles className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '5-15 min',
    benefits: ['Relaxamento', 'Concentração', 'Bem-estar'],
    categories: ['attention', 'relaxation', 'mindfulness']
  },
  {
    id: 'botanical-garden',
    title: 'Jardim Musical Relaxante',
    description: 'Crie melodias plantando elementos botânicos musicais em um jardim virtual. Cada planta emite sons únicos quando tocada.',
    icon: <Flower className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '10-20 min',
    benefits: ['Mindfulness', 'Criatividade musical', 'Relaxamento'],
    categories: ['relaxation', 'mindfulness', 'creativity']
  },
  {
    id: 'tetris-tranquilo',
    title: 'Tetris Tranquilo',
    description: 'Uma versão zen do clássico Tetris em tons rosa pastel. Encaixe blocos enquanto cultiva mindfulness e relaxamento.',
    icon: <Grid3X3 className="h-8 w-8" />,
    difficulty: 'Médio',
    estimatedTime: '10-30 min',
    benefits: ['Estado de Flow', 'Concentração', 'Relaxamento'],
    categories: ['attention', 'relaxation', 'mindfulness', 'flow']
  },
  {
    id: 'bamboo-tower',
    title: 'Torre de Bambu',
    description: 'Empilhe blocos de bambu com precisão em uma experiência zen. Cada movimento requer foco e paciência para construir a torre mais alta.',
    icon: <Building className="h-8 w-8" />,
    difficulty: 'Médio',
    estimatedTime: '5-15 min',
    benefits: ['Estado de Flow', 'Foco e Precisão', 'Controle Emocional'],
    categories: ['attention', 'mindfulness', 'flow', 'precision']
  }
];

const GamesList: React.FC<GamesListProps> = ({ filteredGames, onGameSelect }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-6 ${
      isMobile 
        ? 'grid-cols-1' 
        : 'grid-cols-1 md:grid-cols-2'
    }`}>
      {filteredGames.map((game) => (
        <GameCard 
          key={game.id}
          game={game}
          onGameSelect={onGameSelect}
        />
      ))}
    </div>
  );
};

export default GamesList;
