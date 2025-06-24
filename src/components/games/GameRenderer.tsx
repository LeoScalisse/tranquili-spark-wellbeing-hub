
import ColorConfusionGame from '@/components/games/ColorConfusionGame';
import MemoryFragmentsGame from '@/components/games/MemoryFragmentsGame';
import TranquiliMatchGame from '@/components/games/TranquiliMatchGame';
import TetrisTranquiloGame from '@/components/games/TetrisTranquiloGame';
import BotanicalGardenGame from '@/components/garden/BotanicalGardenGame';
import GameAudioWrapper from '@/components/GameAudioWrapper';

interface GameRendererProps {
  selectedGame: string;
  onBack: () => void;
}

const GameRenderer: React.FC<GameRendererProps> = ({ selectedGame, onBack }) => {
  switch (selectedGame) {
    case 'color-confusion':
      return (
        <GameAudioWrapper gameType="color">
          <ColorConfusionGame onBack={onBack} />
        </GameAudioWrapper>
      );

    case 'memory-fragments':
      return (
        <GameAudioWrapper gameType="memory">
          <MemoryFragmentsGame onBack={onBack} />
        </GameAudioWrapper>
      );

    case 'tranquili-match':
      return (
        <GameAudioWrapper gameType="memory">
          <TranquiliMatchGame onBack={onBack} />
        </GameAudioWrapper>
      );

    case 'tetris-tranquilo':
      return <TetrisTranquiloGame onBack={onBack} />;

    case 'botanical-garden':
      return <BotanicalGardenGame onBack={onBack} />;

    default:
      return null;
  }
};

export default GameRenderer;
