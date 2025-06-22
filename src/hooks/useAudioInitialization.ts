
import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

export const useAudioInitialization = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true);

  const initializeAudio = useCallback(async () => {
    try {
      console.log('🎵 Inicializando sistema de áudio...');
      
      // Verificar se o contexto já está rodando
      const currentState = Tone.context.state;
      if (currentState === 'running') {
        console.log('✅ Contexto de áudio já está ativo');
        setIsAudioReady(true);
        setNeedsUserInteraction(false);
        return true;
      }

      // Tentar iniciar o Tone.js
      await Tone.start();
      console.log('✅ Tone.js iniciado com sucesso');
      
      // Verificar se realmente funcionou
      const newState = Tone.context.state;
      if (newState === 'running') {
        setIsAudioReady(true);
        setNeedsUserInteraction(false);
        setAudioError(null);
        return true;
      } else {
        throw new Error('Contexto de áudio não está rodando após inicialização');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio:', error);
      setAudioError(error instanceof Error ? error.message : 'Erro desconhecido');
      setIsAudioReady(false);
      return false;
    }
  }, []);

  // Verificar estado do áudio periodicamente
  useEffect(() => {
    const checkAudioState = () => {
      const contextState = Tone.context.state;
      const isRunning = contextState === 'running';
      
      if (isRunning !== isAudioReady) {
        console.log(`🔄 Estado do áudio mudou: ${contextState}`);
        setIsAudioReady(isRunning);
        setNeedsUserInteraction(!isRunning);
      }
    };

    const interval = setInterval(checkAudioState, 1000);
    return () => clearInterval(interval);
  }, [isAudioReady]);

  const forceReinitialize = useCallback(async () => {
    console.log('🔄 Forçando reinicialização do áudio...');
    setIsAudioReady(false);
    setAudioError(null);
    return await initializeAudio();
  }, [initializeAudio]);

  return {
    isAudioReady,
    audioError,
    needsUserInteraction,
    initializeAudio,
    forceReinitialize
  };
};
