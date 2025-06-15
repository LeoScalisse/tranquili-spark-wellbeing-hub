
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { GameType } from '@/types/audio';

interface GameAudioWrapperProps {
  gameType: GameType;
  children: React.ReactNode;
}

const GameAudioWrapper: React.FC<GameAudioWrapperProps> = ({ gameType, children }) => {
  const { startGameAmbient, stopGameAmbient } = useAudio();

  useEffect(() => {
    // Iniciar som ambiente quando o jogo começar
    startGameAmbient(gameType);

    // Limpar som ambiente quando o componente for desmontado
    return () => {
      stopGameAmbient();
    };
  }, [gameType, startGameAmbient, stopGameAmbient]);

  return <>{children}</>;
};

export default GameAudioWrapper;
