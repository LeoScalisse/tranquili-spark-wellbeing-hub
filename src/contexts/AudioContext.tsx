
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  // Controles globais
  isSoundOn: boolean;
  toggleSound: () => void;
  
  // Legacy properties for backward compatibility
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  soundProfile: string;
  setSoundProfile: (profile: string) => void;
  
  // Sons da página inicial
  playMoodSound: (moodType: 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful') => void;
  playMoodConfirmation: () => void;
  
  // Sons do chat
  startTypingSound: () => void;
  stopTypingSound: () => void;
  playTypingSound: () => void;
  
  // Som de conquista
  playAchievementSound: () => void;
  
  // Sons dos jogos
  playGameSound: (type: 'correct' | 'incorrect' | 'click' | 'victory') => void;
  playCardSound: (type: 'flip' | 'match' | 'mismatch') => void;
  
  // Sons ambiente dos jogos
  startGameAmbient: (gameType: 'color' | 'memory') => void;
  stopGameAmbient: () => void;
  
  // Additional sound functions used by components
  playClickSound: () => void;
  playSuccessSound: () => void;
  playTransitionSound: () => void;
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
  const [soundProfile, setSoundProfile] = useState('default');
  
  // Refs para instâncias dos sintetizadores aprimorados
  const synthRef = useRef<Tone.Synth | null>(null);
  const fmSynthRef = useRef<Tone.FMSynth | null>(null);
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const noiseSynthRef = useRef<Tone.NoiseSynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  
  // Refs para controle
  const isToneStartedRef = useRef(false);
  const typingLoopRef = useRef<Tone.Loop | null>(null);
  const ambientLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Inicialização dos sintetizadores com configurações mais suaves
  useEffect(() => {
    const initializeAudio = async () => {
      // Reverb suave para criar atmosfera
      reverbRef.current = new Tone.Reverb({
        decay: 3,
        wet: 0.3,
        preDelay: 0.1
      });

      // Delay sutil para profundidade
      delayRef.current = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.2,
        wet: 0.15
      });

      // Filtro passa-baixas para suavizar
      filterRef.current = new Tone.Filter({
        frequency: 3000,
        type: 'lowpass',
        rolloff: -12
      });

      // Conectar efeitos em cadeia
      const effectChain = filterRef.current.connect(delayRef.current).connect(reverbRef.current).toDestination();

      // Sintetizador principal - configuração ultra suave
      synthRef.current = new Tone.Synth({
        oscillator: { 
          type: 'sine',
          partialCount: 3
        },
        envelope: { 
          attack: 0.8, 
          decay: 1.2, 
          sustain: 0.3, 
          release: 2.5 
        },
        volume: -15
      }).connect(effectChain);

      // FM Synth para texturas suaves
      fmSynthRef.current = new Tone.FMSynth({
        harmonicity: 1.5,
        modulationIndex: 2,
        oscillator: { type: 'sine' },
        modulation: { type: 'sine' },
        envelope: { 
          attack: 1.0, 
          decay: 1.5, 
          sustain: 0.4, 
          release: 3.0 
        },
        volume: -18
      }).connect(effectChain);

      // PolySynth para acordes harmônicos
      polySynthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { 
          type: 'sine',
          partialCount: 2
        },
        envelope: { 
          attack: 1.2, 
          decay: 2.0, 
          sustain: 0.5, 
          release: 4.0 
        },
        volume: -20
      }).connect(effectChain);

      // Noise Synth extremamente suave para texturas
      noiseSynthRef.current = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { 
          attack: 0.5, 
          decay: 0.8, 
          sustain: 0.1, 
          release: 1.5 
        },
        volume: -25
      }).connect(filterRef.current).connect(delayRef.current).toDestination();

      // Aguardar carregamento do reverb
      if (reverbRef.current) {
        await reverbRef.current.generate();
      }
    };

    initializeAudio();

    return () => {
      // Cleanup
      synthRef.current?.dispose();
      fmSynthRef.current?.dispose();
      polySynthRef.current?.dispose();
      noiseSynthRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();
      filterRef.current?.dispose();
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

  // Legacy functions for backward compatibility
  const toggleAudio = toggleSound;
  const isAudioEnabled = isSoundOn;

  // Sons de humor da página inicial - frequências terapêuticas
  const playMoodSound = useCallback(async (moodType: 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful') => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();

    switch (moodType) {
      case 'happy':
        // Frequência 528 Hz (Love frequency) - tom alegre mas suave
        synthRef.current.triggerAttackRelease('C5', '2.0');
        break;
        
      case 'sad':
        // Frequência 396 Hz (Liberation) - tom acolhedor
        synthRef.current.triggerAttackRelease('G3', '3.0');
        break;
        
      case 'calm':
        // Frequência 432 Hz (Natural harmony) - máxima tranquilidade
        synthRef.current.triggerAttackRelease('A4', '4.0');
        break;
        
      case 'anxious':
        // Sequência suave descendente para acalmar
        synthRef.current.triggerAttackRelease('E4', '1.5');
        setTimeout(() => {
          if (synthRef.current) synthRef.current.triggerAttackRelease('C4', '2.0');
        }, 800);
        break;
        
      case 'angry':
        // Tom grave e envolvente para acalmar a raiva
        synthRef.current.triggerAttackRelease('D3', '2.5');
        break;
        
      case 'thoughtful':
        // Progressão contemplativa suave
        synthRef.current.triggerAttackRelease('F4', '2.0');
        setTimeout(() => {
          if (synthRef.current) synthRef.current.triggerAttackRelease('A4', '2.0');
        }, 1200);
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Som de confirmação ultra suave
  const playMoodConfirmation = useCallback(async () => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();
    
    // Acorde suave de confirmação
    if (polySynthRef.current) {
      polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Som de digitação ultra discreto
  const startTypingSound = useCallback(async () => {
    if (!isSoundOn || !noiseSynthRef.current || typingLoopRef.current) return;
    
    await startToneIfNeeded();
    
    // Ruído rosa muito suave em pulsos longos
    typingLoopRef.current = new Tone.Loop((time) => {
      noiseSynthRef.current?.triggerAttackRelease('0.08', time);
    }, '0.4').start(0);
    
    Tone.Transport.start();
  }, [isSoundOn, startToneIfNeeded]);

  const stopTypingSound = useCallback(() => {
    if (typingLoopRef.current) {
      typingLoopRef.current.dispose();
      typingLoopRef.current = null;
      Tone.Transport.stop();
    }
  }, []);

  // Função de digitação única mais suave
  const playTypingSound = useCallback(async () => {
    if (!isSoundOn || !noiseSynthRef.current) return;
    
    await startToneIfNeeded();
    noiseSynthRef.current.triggerAttackRelease('0.05');
  }, [isSoundOn, startToneIfNeeded]);

  // Som de conquista celestial e inspirador
  const playAchievementSound = useCallback(async () => {
    if (!isSoundOn || !polySynthRef.current || !synthRef.current) return;
    
    await startToneIfNeeded();
    
    // Progressão harmônica celestial
    // Primeiro acorde - base estável
    polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
    
    // Segundo acorde - elevação suave
    setTimeout(() => {
      if (polySynthRef.current) {
        polySynthRef.current.triggerAttackRelease(['F4', 'A4', 'C5'], '2.5');
      }
    }, 1500);
    
    // Terceiro acorde - resolução inspiradora
    setTimeout(() => {
      if (polySynthRef.current) {
        polySynthRef.current.triggerAttackRelease(['G4', 'B4', 'D5'], '3.0');
      }
    }, 3000);
    
    // Nota final etérea
    setTimeout(() => {
      if (synthRef.current) {
        synthRef.current.triggerAttackRelease('C6', '4.0');
      }
    }, 4500);
  }, [isSoundOn, startToneIfNeeded]);

  // Sons dos jogos - todos suavizados
  const playGameSound = useCallback(async (type: 'correct' | 'incorrect' | 'click' | 'victory') => {
    if (!isSoundOn || !synthRef.current || !polySynthRef.current) return;
    
    await startToneIfNeeded();

    switch (type) {
      case 'correct':
        // Acorde maior suave - validação positiva
        polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
        break;
        
      case 'incorrect':
        // Tom descendente suave - redirecionamento gentil
        synthRef.current.triggerAttackRelease('A3', '1.0');
        setTimeout(() => {
          if (synthRef.current) synthRef.current.triggerAttackRelease('F3', '1.2');
        }, 600);
        break;
        
      case 'click':
        // Som de interface minimalista
        synthRef.current.triggerAttackRelease('E5', '0.3');
        break;
        
      case 'victory':
        // Progressão de vitória serena
        polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '3.0');
        setTimeout(() => {
          if (polySynthRef.current) {
            polySynthRef.current.triggerAttackRelease(['F4', 'A4', 'C5', 'F5'], '2.5');
          }
        }, 1800);
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Sons das cartas ultra suaves
  const playCardSound = useCallback(async (type: 'flip' | 'match' | 'mismatch') => {
    if (!isSoundOn || !synthRef.current || !fmSynthRef.current) return;
    
    await startToneIfNeeded();

    switch (type) {
      case 'flip':
        // Som cristalino muito suave
        fmSynthRef.current.triggerAttackRelease('G5', '0.8');
        break;
        
      case 'match':
        // Harmonia de confirmação
        synthRef.current.triggerAttackRelease('C5', '1.5');
        setTimeout(() => {
          if (synthRef.current) synthRef.current.triggerAttackRelease('E5', '1.0');
        }, 400);
        break;
        
      case 'mismatch':
        // Tom neutro de redirecionamento
        synthRef.current.triggerAttackRelease('A4', '0.8');
        break;
    }
  }, [isSoundOn, startToneIfNeeded]);

  // Som ambiente dos jogos - atmosferas relaxantes
  const startGameAmbient = useCallback(async (gameType: 'color' | 'memory') => {
    if (!isSoundOn) return;
    
    await startToneIfNeeded();
    
    const playAmbientTone = () => {
      if (!synthRef.current || !isSoundOn) return;
      
      if (gameType === 'color') {
        // Atmosfera de cores - tons suaves intercalados
        const notes = ['C3', 'E3', 'G3', 'B3'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        synthRef.current.triggerAttackRelease(randomNote, '6.0');
      } else {
        // Atmosfera de memória - tons contemplativos
        const notes = ['F3', 'A3', 'C4', 'E4'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        synthRef.current.triggerAttackRelease(randomNote, '5.0');
      }
    };
    
    // Iniciar ambiente suave
    playAmbientTone();
    ambientLoopRef.current = setInterval(playAmbientTone, 8000);
  }, [isSoundOn, startToneIfNeeded]);

  const stopGameAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearInterval(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }
  }, []);

  // Sons adicionais suavizados
  const playClickSound = useCallback(async () => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();
    synthRef.current.triggerAttackRelease('C5', '0.4');
  }, [isSoundOn, startToneIfNeeded]);

  const playSuccessSound = useCallback(async () => {
    if (!isSoundOn || !polySynthRef.current) return;
    
    await startToneIfNeeded();
    polySynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
  }, [isSoundOn, startToneIfNeeded]);

  const playTransitionSound = useCallback(async () => {
    if (!isSoundOn || !synthRef.current) return;
    
    await startToneIfNeeded();
    
    // Progressão ascendente suave
    synthRef.current.triggerAttackRelease('C4', '1.0');
    setTimeout(() => {
      if (synthRef.current) synthRef.current.triggerAttackRelease('E4', '1.0');
    }, 800);
    setTimeout(() => {
      if (synthRef.current) synthRef.current.triggerAttackRelease('G4', '1.5');
    }, 1600);
  }, [isSoundOn, startToneIfNeeded]);

  const value = {
    isSoundOn,
    toggleSound,
    isAudioEnabled,
    toggleAudio,
    soundProfile,
    setSoundProfile,
    playMoodSound,
    playMoodConfirmation,
    startTypingSound,
    stopTypingSound,
    playTypingSound,
    playAchievementSound,
    playGameSound,
    playCardSound,
    startGameAmbient,
    stopGameAmbient,
    playClickSound,
    playSuccessSound,
    playTransitionSound,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
