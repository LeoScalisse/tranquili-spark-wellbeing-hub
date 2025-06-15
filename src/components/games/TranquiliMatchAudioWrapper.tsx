
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface TranquiliMatchAudioWrapperProps {
  children: React.ReactNode;
}

const TranquiliMatchAudioWrapper: React.FC<TranquiliMatchAudioWrapperProps> = ({ children }) => {
  const { startGameAmbient, stopGameAmbient } = useAudio();

  useEffect(() => {
    // Iniciar som ambiente relaxante específico para TranquiliMatch+
    startGameAmbient('memory'); // Usar o ambiente mais relaxante disponível

    // Limpar som ambiente quando o componente for desmontado
    return () => {
      stopGameAmbient();
    };
  }, [startGameAmbient, stopGameAmbient]);

  return <>{children}</>;
};

export default TranquiliMatchAudioWrapper;
