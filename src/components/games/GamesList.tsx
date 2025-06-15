
import { Brain, Puzzle, Sparkles } from 'lucide-react';
import GameCard from './GameCard';

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
  }
];

const GamesList: React.FC<GamesListProps> = ({ filteredGames, onGameSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
