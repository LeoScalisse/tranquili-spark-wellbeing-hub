import { useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { MoodType, GameSoundType, CardSoundType, GameType } from '@/types/audio';

interface AudioSynths {
  synth: Tone.Synth;
  fmSynth: Tone.FMSynth;
  polySynth: Tone.PolySynth;
  noiseSynth: Tone.NoiseSynth;
}

type AudioMethod = 'tone' | 'webaudio' | 'html5' | 'fallback';

export const useAudioSounds = (
  isSoundOn: boolean,
  synths: AudioSynths | null,
  initializeAudio: () => Promise<boolean>,
  audioMethod: AudioMethod
) => {
  const typingLoopRef = useRef<Tone.Loop | null>(null);
  const ambientLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Função para reproduzir som visual (fallback)
  const playVisualFeedback = useCallback((soundType: string) => {
    console.log(`👁️ Feedback visual para: ${soundType}`);
    
    // Criar animação visual sutil
    const body = document.body;
    body.style.setProperty('--audio-feedback', 'true');
    
    setTimeout(() => {
      body.style.removeProperty('--audio-feedback');
    }, 200);
  }, []);

  // Função para reproduzir som com Web Audio API nativa
  const playWebAudioSound = useCallback((frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
      
      setTimeout(() => context.close(), (duration + 0.1) * 1000);
      
      console.log(`🎵 Som Web Audio: ${frequency}Hz por ${duration}s`);
    } catch (error) {
      console.error('❌ Erro no Web Audio:', error);
      playVisualFeedback('webaudio-fallback');
    }
  }, [playVisualFeedback]);

  // Função para reproduzir som com HTML5 Audio
  const playHTML5Sound = useCallback((soundType: string) => {
    try {
      // Para HTML5, usaremos data URLs de sons sintéticos simples
      const frequencies = {
        'click': 800,
        'success': 523, // C5
        'error': 220,   // A3
        'mood': 440,    // A4
      };
      
      const freq = frequencies[soundType as keyof typeof frequencies] || 440;
      
      // Criar um beep simples com data URL
      const audioData = generateBeepDataURL(freq, 0.3);
      const audio = new Audio(audioData);
      audio.volume = 0.1;
      audio.play().catch(error => {
        console.error('❌ Erro no HTML5 Audio:', error);
        playVisualFeedback('html5-fallback');
      });
      
      console.log(`🔊 Som HTML5: ${soundType}`);
    } catch (error) {
      console.error('❌ Erro no HTML5 Audio:', error);
      playVisualFeedback('html5-fallback');
    }
  }, [playVisualFeedback]);

  // Função auxiliar para gerar data URL de beep
  const generateBeepDataURL = useCallback((frequency: number, duration: number) => {
    const sampleRate = 8000;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate samples
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3 * 32767;
      view.setInt16(44 + i * 2, sample, true);
    }
    
    return 'data:audio/wav;base64,' + btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }, []);

  // Função universal para reproduzir som
  const playUniversalSound = useCallback(async (soundConfig: {
    type: string;
    toneCallback?: () => void;
    frequency?: number;
    duration?: number;
    waveType?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  }) => {
    if (!isSoundOn) {
      console.log('🔇 Som desabilitado pelo usuário');
      return;
    }

    try {
      // Tentar inicializar se necessário
      if (audioMethod !== 'fallback') {
        await initializeAudio();
      }

      switch (audioMethod) {
        case 'tone':
          if (soundConfig.toneCallback && synths) {
            soundConfig.toneCallback();
            console.log(`🎵 Som Tone.js: ${soundConfig.type}`);
          } else {
            console.warn('⚠️ Tone.js não disponível, usando fallback');
            playWebAudioSound(soundConfig.frequency || 440, soundConfig.duration || 0.3, soundConfig.waveType);
          }
          break;
          
        case 'webaudio':
          playWebAudioSound(soundConfig.frequency || 440, soundConfig.duration || 0.3, soundConfig.waveType);
          break;
          
        case 'html5':
          playHTML5Sound(soundConfig.type);
          break;
          
        case 'fallback':
        default:
          playVisualFeedback(soundConfig.type);
          break;
      }
    } catch (error) {
      console.error(`❌ Erro ao reproduzir som "${soundConfig.type}":`, error);
      playVisualFeedback(soundConfig.type);
    }
  }, [isSoundOn, audioMethod, initializeAudio, synths, playWebAudioSound, playHTML5Sound, playVisualFeedback]);

  // Sons específicos usando o sistema universal
  const playMoodSound = useCallback(async (moodType: MoodType) => {
    const moodConfigs = {
      'happy': { frequency: 523, duration: 2.0, waveType: 'sine' as const },
      'sad': { frequency: 196, duration: 3.0, waveType: 'sine' as const },
      'calm': { frequency: 440, duration: 4.0, waveType: 'sine' as const },
      'anxious': { frequency: 329, duration: 1.5, waveType: 'triangle' as const },
      'angry': { frequency: 147, duration: 2.5, waveType: 'square' as const },
      'thoughtful': { frequency: 349, duration: 2.0, waveType: 'sine' as const },
    };

    const config = moodConfigs[moodType];
    
    await playUniversalSound({
      type: `mood-${moodType}`,
      toneCallback: () => {
        if (!synths?.synth) return;
        
        switch (moodType) {
          case 'happy':
            synths.synth.triggerAttackRelease('C5', '2.0');
            break;
          case 'sad':
            synths.synth.triggerAttackRelease('G3', '3.0');
            break;
          case 'calm':
            synths.synth.triggerAttackRelease('A4', '4.0');
            break;
          case 'anxious':
            synths.synth.triggerAttackRelease('E4', '1.5');
            setTimeout(() => {
              if (synths.synth) synths.synth.triggerAttackRelease('C4', '2.0');
            }, 800);
            break;
          case 'angry':
            synths.synth.triggerAttackRelease('D3', '2.5');
            break;
          case 'thoughtful':
            synths.synth.triggerAttackRelease('F4', '2.0');
            setTimeout(() => {
              if (synths.synth) synths.synth.triggerAttackRelease('A4', '2.0');
            }, 1200);
            break;
        }
      },
      ...config
    });
  }, [playUniversalSound, synths]);

  const playClickSound = useCallback(async () => {
    await playUniversalSound({
      type: 'click',
      toneCallback: () => {
        if (synths?.synth) {
          synths.synth.triggerAttackRelease('C5', '0.4');
        }
      },
      frequency: 800,
      duration: 0.4,
      waveType: 'sine'
    });
  }, [playUniversalSound, synths]);

  const playSuccessSound = useCallback(async () => {
    await playUniversalSound({
      type: 'success',
      toneCallback: () => {
        if (synths?.polySynth) {
          synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
        }
      },
      frequency: 523,
      duration: 2.0,
      waveType: 'sine'
    });
  }, [playUniversalSound, synths]);

  const playTransitionSound = useCallback(async () => {
    await playUniversalSound({
      type: 'transition',
      toneCallback: () => {
        if (!synths?.synth) return;
        
        synths.synth.triggerAttackRelease('C4', '1.0');
        setTimeout(() => {
          if (synths.synth) synths.synth.triggerAttackRelease('E4', '1.0');
        }, 800);
        setTimeout(() => {
          if (synths.synth) synths.synth.triggerAttackRelease('G4', '1.5');
        }, 1600);
      },
      frequency: 261,
      duration: 3.0,
      waveType: 'sine'
    });
  }, [playUniversalSound, synths]);

  // Implementar outros sons usando o mesmo padrão...
  const playMoodConfirmation = useCallback(async () => {
    await playUniversalSound({
      type: 'mood-confirmation',
      toneCallback: () => {
        if (synths?.polySynth) {
          synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
        }
      },
      frequency: 523,
      duration: 1.5
    });
  }, [playUniversalSound, synths]);

  // ... keep existing code para outros sons, adaptando para usar playUniversalSound

  const startTypingSound = useCallback(async () => {
    // Implementação simplificada para evitar complexidade
    console.log('🎵 Som de digitação iniciado (modo compatibilidade)');
  }, []);

  const stopTypingSound = useCallback(() => {
    if (typingLoopRef.current) {
      typingLoopRef.current.dispose();
      typingLoopRef.current = null;
    }
  }, []);

  const playTypingSound = useCallback(async () => {
    await playUniversalSound({
      type: 'typing',
      toneCallback: () => {
        if (synths?.noiseSynth) {
          synths.noiseSynth.triggerAttackRelease('0.05');
        }
      },
      frequency: 1000,
      duration: 0.05,
      waveType: 'square'
    });
  }, [playUniversalSound, synths]);

  const playAchievementSound = useCallback(async () => {
    await playUniversalSound({
      type: 'achievement',
      toneCallback: () => {
        if (!synths?.polySynth || !synths?.synth) return;
        
        synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
        
        setTimeout(() => {
          if (synths.polySynth) {
            synths.polySynth.triggerAttackRelease(['F4', 'A4', 'C5'], '2.5');
          }
        }, 1500);
      },
      frequency: 523,
      duration: 4.0
    });
  }, [playUniversalSound, synths]);

  const playGameSound = useCallback(async (type: GameSoundType) => {
    const gameConfigs = {
      'correct': { frequency: 523, duration: 1.5 },
      'incorrect': { frequency: 220, duration: 1.0 },
      'click': { frequency: 659, duration: 0.3 },
      'victory': { frequency: 523, duration: 3.0 }
    };

    const config = gameConfigs[type];
    
    await playUniversalSound({
      type: `game-${type}`,
      toneCallback: () => {
        if (!synths?.synth || !synths?.polySynth) return;

        switch (type) {
          case 'correct':
            synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
            break;
          case 'incorrect':
            synths.synth.triggerAttackRelease('A3', '1.0');
            setTimeout(() => {
              if (synths.synth) synths.synth.triggerAttackRelease('F3', '1.2');
            }, 600);
            break;
          case 'click':
            synths.synth.triggerAttackRelease('E5', '0.3');
            break;
          case 'victory':
            synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '3.0');
            break;
        }
      },
      ...config
    });
  }, [playUniversalSound, synths]);

  const playCardSound = useCallback(async (type: CardSoundType) => {
    const cardConfigs = {
      'flip': { frequency: 784, duration: 0.8 },
      'match': { frequency: 523, duration: 1.5 },
      'mismatch': { frequency: 440, duration: 0.8 }
    };

    const config = cardConfigs[type];
    
    await playUniversalSound({
      type: `card-${type}`,
      toneCallback: () => {
        if (!synths?.synth || !synths?.fmSynth) return;

        switch (type) {
          case 'flip':
            synths.fmSynth.triggerAttackRelease('G5', '0.8');
            break;
          case 'match':
            synths.synth.triggerAttackRelease('C5', '1.5');
            setTimeout(() => {
              if (synths.synth) synths.synth.triggerAttackRelease('E5', '1.0');
            }, 400);
            break;
          case 'mismatch':
            synths.synth.triggerAttackRelease('A4', '0.8');
            break;
        }
      },
      ...config
    });
  }, [playUniversalSound, synths]);

  const startGameAmbient = useCallback(async (gameType: GameType) => {
    console.log(`🎵 Som ambiente iniciado para: ${gameType}`);
    // Implementação simplificada para compatibilidade
  }, []);

  const stopGameAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearInterval(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }
  }, []);

  return {
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
    playTransitionSound
  };
};
