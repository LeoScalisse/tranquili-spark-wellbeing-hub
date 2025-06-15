
import { Brain } from 'lucide-react';
import GameIntroduction from './GameIntroduction';

interface MemoryFragmentsIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const MemoryFragmentsIntroduction: React.FC<MemoryFragmentsIntroductionProps> = ({
  onPlay,
  onBack
}) => {
  const gameStats = {
    currentLevel: 'Iniciante',
    nextLevel: 'Principiante',
    objective: 'Complete 5 sequências perfeitas consecutivas',
    bestScore: 0,
    icon: <Brain className="h-16 w-16" />
  };

  const howToPlay = [
    'Observe a sequência de cores que aparece',
    'Memorize a ordem exata das cores',
    'Repita a sequência tocando nas cores',
    'Cada nível adiciona uma nova cor',
    'Mantenha a concentração para sequências longas'
  ];

  const colorScheme = {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-400',
    gradient: 'from-blue-400 to-blue-600',
    background: 'bg-gradient-to-br from-blue-400 to-blue-600'
  };

  return (
    <GameIntroduction
      gameId="memory-fragments"
      title="Fragmentos"
      subtitle="Memória"
      colorScheme={colorScheme}
      stats={gameStats}
      howToPlay={howToPlay}
      onPlay={onPlay}
      onBack={onBack}
    />
  );
};

export default MemoryFragmentsIntroduction;
