
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { AudioContextType } from '@/types/audio';
import { createAudioEffects } from '@/utils/audioEffects';
import { createAudioSynths } from '@/utils/audioSynths';
import { useAudioSounds } from '@/hooks/useAudioSounds';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [soundProfile, setSoundProfile] = useState('default');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs para efeitos e sintetizadores
  const effectsRef = useRef<ReturnType<typeof createAudioEffects> | null>(null);
  const synthsRef = useRef<ReturnType<typeof createAudioSynths> | null>(null);
  const isToneStartedRef = useRef(false);

  // Inicialização otimizada dos sintetizadores
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        console.log('🎵 Inicializando sistema de áudio...');
        
        // Criar efeitos
        effectsRef.current = createAudioEffects();
        
        // Aguardar carregamento do reverb antes de criar sintetizadores
        if (effectsRef.current.reverb) {
          console.log('⏳ Aguardando carregamento do reverb...');
          await effectsRef.current.reverb.generate();
          console.log('✅ Reverb carregado');
        }
        
        // Criar sintetizadores apenas após reverb estar pronto
        synthsRef.current = createAudioSynths(effectsRef.current.effectChain);
        
        setIsInitialized(true);
        console.log('✅ Sistema de áudio inicializado com sucesso');
        
      } catch (error) {
        console.error('❌ Erro na inicialização do áudio:', error);
        setIsInitialized(false);
      }
    };

    initializeAudio();

    return () => {
      console.log('🧹 Limpando recursos de áudio...');
      // Cleanup otimizado
      try {
        synthsRef.current?.synth?.dispose();
        synthsRef.current?.fmSynth?.dispose();
        synthsRef.current?.polySynth?.dispose();
        synthsRef.current?.noiseSynth?.dispose();
        effectsRef.current?.reverb?.dispose();
        effectsRef.current?.delay?.dispose();
        effectsRef.current?.filter?.dispose();
      } catch (error) {
        console.error('❌ Erro no cleanup de áudio:', error);
      }
    };
  }, []);

  // Função melhorada para iniciar o Tone.js
  const startToneIfNeeded = useCallback(async () => {
    try {
      if (!isToneStartedRef.current && Tone.context.state !== 'running') {
        console.log('🎵 Iniciando contexto Tone.js...');
        await Tone.start();
        isToneStartedRef.current = true;
        console.log('✅ Contexto Tone.js ativo:', Tone.context.state);
      }
    } catch (error) {
      console.error('❌ Erro ao iniciar Tone.js:', error);
      throw error;
    }
  }, []);

  // Toggle do som com feedback
  const toggleSound = useCallback(() => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);
    console.log(`🔊 Som ${newState ? 'habilitado' : 'desabilitado'}`);
  }, [isSoundOn]);

  // Hook para sons com verificação de inicialização
  const audioSounds = useAudioSounds(
    isSoundOn && isInitialized, 
    synthsRef.current, 
    startToneIfNeeded
  );

  // Legacy functions for backward compatibility
  const toggleAudio = toggleSound;
  const isAudioEnabled = isSoundOn;

  const value = {
    isSoundOn,
    toggleSound,
    isAudioEnabled,
    toggleAudio,
    soundProfile,
    setSoundProfile,
    ...audioSounds,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
