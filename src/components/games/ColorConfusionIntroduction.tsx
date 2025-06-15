
import { Target } from 'lucide-react';
import GameIntroduction from './GameIntroduction';

interface ColorConfusionIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const ColorConfusionIntroduction: React.FC<ColorConfusionIntroductionProps> = ({
  onPlay,
  onBack
}) => {
  const gameStats = {
    currentLevel: 'Iniciante',
    nextLevel: 'Principiante',
    objective: 'Pontue acima de 1280 em Cor ou Confusão',
    bestScore: 0,
    icon: <Target className="h-16 w-16" />
  };

  const howToPlay = [
    'Leia a palavra no topo da tela',
    'Observe a cor da palavra embaixo',
    'Decida se a cor corresponde ao significado',
    'Toque ✓ se corresponder ou ✕ se não corresponder',
    'Seja rápido e preciso para mais pontos'
  ];

  const colorScheme = {
    primary: 'bg-green-500',
    secondary: 'bg-green-400',
    gradient: 'from-green-400 to-green-600',
    background: 'bg-gradient-to-br from-green-400 to-green-600'
  };

  return (
    <GameIntroduction
      gameId="color-confusion"
      title="Cor ou Confusão?"
      subtitle="Raciocínio"
      colorScheme={colorScheme}
      stats={gameStats}
      howToPlay={howToPlay}
      onPlay={onPlay}
      onBack={onBack}
    />
  );
};

export default ColorConfusionIntroduction;
