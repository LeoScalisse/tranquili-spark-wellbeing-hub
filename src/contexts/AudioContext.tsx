import React, { createContext, useContext } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { AudioContextType } from '@/types/audio';
import { createAudioEffects } from '@/utils/audioEffects';
import { createAudioSynths } from '@/utils/audioSynths';
import { useAudioSounds } from '@/hooks/useAudioSounds';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundOn, setIsSoundOn] = useState(() => {
    // Recuperar preferência salva
    const saved = localStorage.getItem('tranquili-sound-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [soundProfile, setSoundProfile] = useState(() => {
    return localStorage.getItem('tranquili-sound-profile') || 'zen';
  });

  const platform = usePlatformDetection();
  const audioSystem = useAudioSystem();
  
  // Refs para efeitos e sintetizadores
  const effectsRef = useRef<ReturnType<typeof createAudioEffects> | null>(null);
  const synthsRef = useRef<ReturnType<typeof createAudioSynths> | null>(null);
  const isAudioInitializedRef = useRef(false);

  // Função para inicializar recursos de áudio após sistema estar pronto
  const initializeAudioResources = useCallback(async () => {
    if (isAudioInitializedRef.current || !audioSystem.isReady) {
      return;
    }

    try {
      console.log('🎼 Inicializando recursos de áudio...');
      
      // Só criar recursos se o método for Tone.js
      if (audioSystem.method === 'tone') {
        // Criar efeitos
        effectsRef.current = createAudioEffects();
        
        // Aguardar carregamento do reverb
        if (effectsRef.current.reverb) {
          console.log('⏳ Carregando reverb...');
          await effectsRef.current.reverb.generate();
          console.log('✅ Reverb carregado');
        }
        
        // Criar sintetizadores
        synthsRef.current = createAudioSynths(effectsRef.current.effectChain);
        
        console.log('✅ Recursos de áudio Tone.js criados');
      } else {
        console.log(`ℹ️ Método ${audioSystem.method} - recursos básicos inicializados`);
      }
      
      isAudioInitializedRef.current = true;
      
    } catch (error) {
      console.error('❌ Erro ao inicializar recursos de áudio:', error);
    }
  }, [audioSystem.isReady, audioSystem.method]);

  // Inicializar recursos quando o sistema estiver pronto
  useEffect(() => {
    if (audioSystem.isReady && !isAudioInitializedRef.current) {
      initializeAudioResources();
    }
  }, [audioSystem.isReady, initializeAudioResources]);

  // Função melhorada para iniciar o sistema de áudio
  const initializeAudio = useCallback(async () => {
    console.log('🎵 Solicitando inicialização do sistema de áudio...');
    const success = await audioSystem.initialize();
    
    if (success) {
      console.log('✅ Sistema de áudio inicializado com sucesso');
      // Recursos serão inicializados pelo useEffect acima
    } else {
      console.error('❌ Falha na inicialização do sistema de áudio');
    }
    
    return success;
  }, [audioSystem]);

  // Toggle do som com persistência
  const toggleSound = useCallback(() => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);
    localStorage.setItem('tranquili-sound-enabled', newState.toString());
    console.log(`🔊 Som ${newState ? 'habilitado' : 'desabilitado'}`);
  }, [isSoundOn]);

  // Atualizar perfil sonoro com persistência
  const updateSoundProfile = useCallback((profile: string) => {
    setSoundProfile(profile);
    localStorage.setItem('tranquili-sound-profile', profile);
    console.log(`🎨 Perfil sonoro alterado para: ${profile}`);
  }, []);

  // Hook para sons com verificação de sistema
  const audioSounds = useAudioSounds(
    isSoundOn && audioSystem.isReady, 
    synthsRef.current, 
    initializeAudio,
    audioSystem.method || 'fallback'
  );

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      console.log('🧹 Limpando AudioProvider...');
      try {
        synthsRef.current?.synth?.dispose();
        synthsRef.current?.fmSynth?.dispose();
        synthsRef.current?.polySynth?.dispose();
        synthsRef.current?.noiseSynth?.dispose();
        effectsRef.current?.reverb?.dispose();
        effectsRef.current?.delay?.dispose();
        effectsRef.current?.filter?.dispose();
      } catch (error) {
        console.error('❌ Erro no cleanup:', error);
      }
    };
  }, []);

  // Valores do contexto
  const value = {
    // Estados básicos
    isSoundOn,
    toggleSound,
    soundProfile,
    setSoundProfile: updateSoundProfile,
    
    // Estados do sistema de áudio
    isAudioReady: audioSystem.isReady,
    needsUserInteraction: audioSystem.needsUserInteraction,
    audioError: audioSystem.error,
    audioMethod: audioSystem.method,
    
    // Funções de controle
    initializeAudio,
    resetAudio: audioSystem.reset,
    testAudio: audioSystem.testAudio,
    
    // Informações de debug
    getAudioDebugInfo: audioSystem.getDebugInfo,
    platformInfo: platform,
    
    // Legacy compatibility
    isAudioEnabled: isSoundOn,
    toggleAudio: toggleSound,
    
    // Sons
    ...audioSounds,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
