
import ColorConfusionIntroduction from '@/components/games/ColorConfusionIntroduction';
import MemoryFragmentsIntroduction from '@/components/games/MemoryFragmentsIntroduction';
import TranquiliMatchIntroduction from '@/components/games/TranquiliMatchIntroduction';
import TetrisTranquiloIntroduction from '@/components/games/TetrisTranquiloIntroduction';
import BambooTowerIntroduction from '@/components/games/BambooTowerIntroduction';

interface GameIntroRendererProps {
  gameIntro: string;
  onPlay: (gameId: string) => void;
  onBack: () => void;
}

const GameIntroRenderer: React.FC<GameIntroRendererProps> = ({ gameIntro, onPlay, onBack }) => {
  switch (gameIntro) {
    case 'color-confusion':
      return (
        <ColorConfusionIntroduction
          onPlay={() => onPlay('color-confusion')}
          onBack={onBack}
        />
      );

    case 'memory-fragments':
      return (
        <MemoryFragmentsIntroduction
          onPlay={() => onPlay('memory-fragments')}
          onBack={onBack}
        />
      );

    case 'tranquili-match':
      return (
        <TranquiliMatchIntroduction
          onPlay={() => onPlay('tranquili-match')}
          onBack={onBack}
        />
      );

    case 'tetris-tranquilo':
      return (
        <TetrisTranquiloIntroduction
          onPlay={() => onPlay('tetris-tranquilo')}
          onBack={onBack}
        />
      );

    case 'bamboo-tower':
      return (
        <BambooTowerIntroduction
          onPlay={() => onPlay('bamboo-tower')}
          onBack={onBack}
        />
      );

    default:
      return null;
  }
};

export default GameIntroRenderer;
