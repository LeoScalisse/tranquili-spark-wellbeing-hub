
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  // Controles globais
  isSoundOn: boolean;
  toggleSound: () => void;
  
  // Sons da página inicial
  playMoodSound: (moodType: 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful') => void;
  playMoodConfirmation: () => void;
  
  // Sons do chat
  startTypingSound: () => void;
  stopTypingSound: () => void;
  
  // Som de conquista
  playAchievementSound: () => void;
  
  // Sons dos jogos
  playGameSound: (type: 'correct' | 'incorrect' | 'click' | 'victory') => void;
  playCardSound: (type: 'flip' | 'match' | 'mismatch') => void;
  
  // Sons ambiente dos jogos
  startGameAmbient: (gameType: 'color' | 'memory') => void;
  stopGameAmbient: () => void;
}

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
  
  // Refs para instâncias dos sintetizadores
  const synthRef = useRef<Tone.Synth | null>(null);
  const fmSynthRef = useRef<Tone.FMSynth | null>(null);
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const noiseSynthRef = useRef<Tone.NoiseSynth | null>(null);
  const ambientPlayerRef = useRef<Tone.Player | null>(null);
  
  // Refs para controle
  const isToneStartedRef = useRef(false);
  const typingLoopRef = useRef<Tone.Loop | null>(null);
  const ambientLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Inicialização dos sintetizadores
  useEffect(() => {
    // Sintetizador principal
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 }
    }).toDestination();

    // FM Synth para sons complexos
    fmSynthRef.current = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.5 }
    }).toDestination();

    // PolySynth para acordes
    polySynthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.0 }
    }).toDestination();

    // Noise Synth para efeitos
    noiseSynthRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.01 }
    }).toDestination();

    return () => {
      // Cleanup
      synthRef.current?.dispose();
      fmSynthRef.current?.dispose();
      polySynthRef.current?.dispose();
      noiseSynthRef.current?.dispose();
      ambientPlayerRef.current?.dispose();
      typingLoopRef.current?.dispose();
      if (ambientLoopRef.current) {
        clearInterval(ambientLoopRef.current);
      }
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

  // Sons de humor da página inicial
  const playMoodSound = useCallback(async (moodType: 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful') => {
    if (!isSoundOn || !synthRef.current || !fmSynthRef.current) return;
    
    await startToneIfNeeded();

    switch (moodType) {
      case 'happy':
        // Som agudo e limpo - triangle, C5
        synthRef.current.oscillator.type = 'triangle';
        synthRef.current.triggerAttackRelease('C5', '0.5');
        break;
        
      case 'sad':
        // Som grave e suave - sine, A3, duração longa
        synthRef.current.oscillator.type = 'sine';
        synthRef.current.triggerAttackRelease('A3', '1.5');
        break;
        
      case 'calm':
        // Som puro e sustentado - sine, G4, longa duração
        synthRef.current.oscillator.type = 'sine';
        synthRef.current.triggerAttackRelease('G4', '2.0');
        break;
        
      case 'anxious':
        // Som rápido e trêmulo - FM Synth, duas notas rápidas
        fmSynthRef.current.triggerAttackRelease('F#5', '0.2');
        fmSynthRef.current.triggerAttackRelease('G5', '0.2', '+0.1');
        break;
        
      case 'angry':
        // Som curto e "eletrônico" - square, D5
        synthRef.current.oscillator.type = 'square';
        synthRef.current.triggerAttackRelease('D5', '0.3');
        break;
        
      case 'thoughtful':
        // Som texturizado - sawtooth, A4, volume baixo
        synthRef.current.oscillator.type = 'sawtooth';
        synthRef.current.volume.value = -10;
        synthRef.current.triggerAttackRelease('A4', '0.8');
        setTimeout(() => {
          if (synthRef.current) synthRef.current.volume.value = 0;
        }, 1000);
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Som de confirmação de registro de humor
  const playMoodConfirmation = useCallback(async () => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();
    
    // Ping rápido e agudo - triangle, C6
    synthRef.current.oscillator.type = 'triangle';
    synthRef.current.triggerAttackRelease('C6', '0.2');
  }, [isSoundOn, startToneIfNeeded]);

  // Som de digitação da IA
  const startTypingSound = useCallback(async () => {
    if (!isSoundOn || !noiseSynthRef.current || typingLoopRef.current) return;
    
    await startToneIfNeeded();
    
    // Loop de ruído branco em pulsos
    typingLoopRef.current = new Tone.Loop((time) => {
      noiseSynthRef.current?.triggerAttackRelease('0.02', time);
    }, '0.1').start(0);
    
    Tone.Transport.start();
  }, [isSoundOn, startToneIfNeeded]);

  const stopTypingSound = useCallback(() => {
    if (typingLoopRef.current) {
      typingLoopRef.current.dispose();
      typingLoopRef.current = null;
      Tone.Transport.stop();
    }
  }, []);

  // Som de conquista
  const playAchievementSound = useCallback(async () => {
    if (!isSoundOn || !polySynthRef.current) return;
    
    await startToneIfNeeded();
    
    // Acorde maior celebratório - C4, E4, G4, C5
    polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '2.0');
  }, [isSoundOn, startToneIfNeeded]);

  // Sons dos jogos
  const playGameSound = useCallback(async (type: 'correct' | 'incorrect' | 'click' | 'victory') => {
    if (!isSoundOn || !synthRef.current || !polySynthRef.current) return;
    
    await startToneIfNeeded();

    switch (type) {
      case 'correct':
        // Som agudo e positivo - sine, G5
        synthRef.current.oscillator.type = 'sine';
        synthRef.current.triggerAttackRelease('G5', '0.5');
        break;
        
      case 'incorrect':
        // Som grave e dissonante - sawtooth, A2
        synthRef.current.oscillator.type = 'sawtooth';
        synthRef.current.triggerAttackRelease('A2', '0.6');
        break;
        
      case 'click':
        // Som de interface neutro - triangle, E5
        synthRef.current.oscillator.type = 'triangle';
        synthRef.current.triggerAttackRelease('E5', '0.1');
        break;
        
      case 'victory':
        // Acorde maior - triangle
        polySynthRef.current.set({ oscillator: { type: 'triangle' } });
        polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '3.0');
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Sons das cartas (jogo da memória)
  const playCardSound = useCallback(async (type: 'flip' | 'match' | 'mismatch') => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();

    switch (type) {
      case 'flip':
        // Som rápido e agudo - triangle, F#5
        synthRef.current.oscillator.type = 'triangle';
        synthRef.current.triggerAttackRelease('F#5', '0.2');
        break;
        
      case 'match':
        // Som suave e positivo - sine, C5
        synthRef.current.oscillator.type = 'sine';
        synthRef.current.triggerAttackRelease('C5', '0.8');
        break;
        
      case 'mismatch':
        // Som ríspido e grave - square, C3
        synthRef.current.oscillator.type = 'square';
        synthRef.current.triggerAttackRelease('C3', '0.4');
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Som ambiente dos jogos
  const startGameAmbient = useCallback(async (gameType: 'color' | 'memory') => {
    if (!isSoundOn) return;
    
    await startToneIfNeeded();
    
    // Simulação de ambiente com tons contínuos
    const playAmbientTone = () => {
      if (!synthRef.current || !isSoundOn) return;
      
      if (gameType === 'color') {
        // Trilha relaxante para jogo de cores
        synthRef.current.oscillator.type = 'sine';
        synthRef.current.volume.value = -20;
        synthRef.current.triggerAttackRelease('C3', '4.0');
      } else {
        // Sons de natureza simulados para jogo da memória
        synthRef.current.oscillator.type = 'triangle';
        synthRef.current.volume.value = -18;
        synthRef.current.triggerAttackRelease('G3', '3.0');
      }
    };
    
    // Iniciar loop ambiente
    playAmbientTone();
    ambientLoopRef.current = setInterval(playAmbientTone, 5000);
  }, [isSoundOn, startToneIfNeeded]);

  const stopGameAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearInterval(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }
    // Restaurar volume normal
    if (synthRef.current) {
      synthRef.current.volume.value = 0;
    }
  }, []);

  const value = {
    isSoundOn,
    toggleSound,
    playMoodSound,
    playMoodConfirmation,
    startTypingSound,
    stopTypingSound,
    playAchievementSound,
    playGameSound,
    playCardSound,
    startGameAmbient,
    stopGameAmbient,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
