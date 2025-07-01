
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface GameAudioWrapperProps {
  gameType: 'color' | 'memory';
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
