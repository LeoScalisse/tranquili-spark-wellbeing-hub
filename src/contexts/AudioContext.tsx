
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
  
  // Refs para efeitos e sintetizadores
  const effectsRef = useRef<ReturnType<typeof createAudioEffects> | null>(null);
  const synthsRef = useRef<ReturnType<typeof createAudioSynths> | null>(null);
  const isToneStartedRef = useRef(false);

  // Inicialização dos sintetizadores com configurações mais suaves
  useEffect(() => {
    const initializeAudio = async () => {
      // Criar efeitos
      effectsRef.current = createAudioEffects();
      
      // Aguardar carregamento do reverb
      if (effectsRef.current.reverb) {
        await effectsRef.current.reverb.generate();
      }
      
      // Criar sintetizadores
      synthsRef.current = createAudioSynths(effectsRef.current.effectChain);
    };

    initializeAudio();

    return () => {
      // Cleanup
      synthsRef.current?.synth?.dispose();
      synthsRef.current?.fmSynth?.dispose();
      synthsRef.current?.polySynth?.dispose();
      synthsRef.current?.noiseSynth?.dispose();
      effectsRef.current?.reverb?.dispose();
      effectsRef.current?.delay?.dispose();
      effectsRef.current?.filter?.dispose();
    };
  }, []);

  // Função para iniciar o Tone.js
  const startToneIfNeeded = useCallback(async () => {
    if (!isToneStartedRef.current && Tone.context.state !== 'running') {
      await Tone.start();
      isToneStartedRef.current = true;
    }
  }, []);

  // Toggle do som
  const toggleSound = useCallback(() => {
    setIsSoundOn(prev => !prev);
  }, []);

  // Hook para sons
  const audioSounds = useAudioSounds(isSoundOn, synthsRef.current, startToneIfNeeded);

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
