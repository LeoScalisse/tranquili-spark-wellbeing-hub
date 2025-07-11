
import { useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { MoodType, GameSoundType, CardSoundType, GameType } from '@/types/audio';

interface AudioSynths {
  synth: Tone.Synth;
  fmSynth: Tone.FMSynth;
  polySynth: Tone.PolySynth;
  noiseSynth: Tone.NoiseSynth;
}

export const useAudioSounds = (
  isSoundOn: boolean,
  synths: AudioSynths | null,
  startToneIfNeeded: () => Promise<void>
) => {
  const typingLoopRef = useRef<Tone.Loop | null>(null);
  const ambientLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Função auxiliar para verificar se o áudio está pronto
  const isAudioReady = useCallback(() => {
    if (!isSoundOn) {
      console.log('🔇 Som desabilitado pelo usuário');
      return false;
    }
    
    if (!synths) {
      console.log('❌ Sintetizadores não inicializados');
      return false;
    }
    
    if (Tone.context.state !== 'running') {
      console.log('❌ Contexto de áudio não está rodando:', Tone.context.state);
      return false;
    }
    
    return true;
  }, [isSoundOn, synths]);

  // Função auxiliar para reproduzir som com tratamento de erro
  const playSoundSafely = useCallback(async (soundFn: () => void, soundName: string) => {
    try {
      if (!isAudioReady()) return;
      
      await startToneIfNeeded();
      
      if (Tone.context.state !== 'running') {
        console.warn(`⚠️ Não foi possível reproduzir som "${soundName}": contexto não ativo`);
        return;
      }
      
      soundFn();
      console.log(`🎵 Som reproduzido: ${soundName}`);
    } catch (error) {
      console.error(`❌ Erro ao reproduzir som "${soundName}":`, error);
    }
  }, [isAudioReady, startToneIfNeeded]);

  // Sons de humor da página inicial - com tratamento de erro
  const playMoodSound = useCallback(async (moodType: MoodType) => {
    await playSoundSafely(() => {
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
    }, `mood-${moodType}`);
  }, [playSoundSafely, synths]);

  // Som de confirmação
  const playMoodConfirmation = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.polySynth) return;
      synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
    }, 'mood-confirmation');
  }, [playSoundSafely, synths]);

  // Som de digitação
  const startTypingSound = useCallback(async () => {
    if (!isAudioReady() || typingLoopRef.current) return;
    
    await playSoundSafely(() => {
      if (!synths?.noiseSynth) return;
      
      typingLoopRef.current = new Tone.Loop((time) => {
        synths.noiseSynth?.triggerAttackRelease('0.08', time);
      }, '0.4').start(0);
      
      Tone.Transport.start();
    }, 'typing-start');
  }, [isAudioReady, playSoundSafely, synths]);

  const stopTypingSound = useCallback(() => {
    if (typingLoopRef.current) {
      typingLoopRef.current.dispose();
      typingLoopRef.current = null;
      Tone.Transport.stop();
      console.log('🎵 Som de digitação parado');
    }
  }, []);

  const playTypingSound = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.noiseSynth) return;
      synths.noiseSynth.triggerAttackRelease('0.05');
    }, 'typing-single');
  }, [playSoundSafely, synths]);

  // Som de conquista
  const playAchievementSound = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.polySynth || !synths?.synth) return;
      
      synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
      
      setTimeout(() => {
        if (synths.polySynth) {
          synths.polySynth.triggerAttackRelease(['F4', 'A4', 'C5'], '2.5');
        }
      }, 1500);
      
      setTimeout(() => {
        if (synths.polySynth) {
          synths.polySynth.triggerAttackRelease(['G4', 'B4', 'D5'], '3.0');
        }
      }, 3000);
      
      setTimeout(() => {
        if (synths.synth) {
          synths.synth.triggerAttackRelease('C6', '4.0');
        }
      }, 4500);
    }, 'achievement');
  }, [playSoundSafely, synths]);

  // Sons dos jogos
  const playGameSound = useCallback(async (type: GameSoundType) => {
    await playSoundSafely(() => {
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
          setTimeout(() => {
            if (synths.polySynth) {
              synths.polySynth.triggerAttackRelease(['F4', 'A4', 'C5', 'F5'], '2.5');
            }
          }, 1800);
          break;
      }
    }, `game-${type}`);
  }, [playSoundSafely, synths]);

  // Sons das cartas
  const playCardSound = useCallback(async (type: CardSoundType) => {
    await playSoundSafely(() => {
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
    }, `card-${type}`);
  }, [playSoundSafely, synths]);

  // Som ambiente dos jogos
  const startGameAmbient = useCallback(async (gameType: GameType) => {
    if (!isAudioReady()) return;
    
    await startToneIfNeeded();
    
    const playAmbientTone = () => {
      if (!synths?.synth || !isSoundOn) return;
      
      try {
        if (gameType === 'color') {
          const notes = ['C3', 'E3', 'G3', 'B3'];
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          synths.synth.triggerAttackRelease(randomNote, '6.0');
        } else {
          const notes = ['F3', 'A3', 'C4', 'E4'];
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          synths.synth.triggerAttackRelease(randomNote, '5.0');
        }
        console.log(`🎵 Som ambiente: ${gameType}`);
      } catch (error) {
        console.error('❌ Erro no som ambiente:', error);
      }
    };
    
    playAmbientTone();
    ambientLoopRef.current = setInterval(playAmbientTone, 8000);
  }, [isAudioReady, startToneIfNeeded, synths, isSoundOn]);

  const stopGameAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearInterval(ambientLoopRef.current);
      ambientLoopRef.current = null;
      console.log('🎵 Som ambiente parado');
    }
  }, []);

  // Sons adicionais
  const playClickSound = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.synth) return;
      synths.synth.triggerAttackRelease('C5', '0.4');
    }, 'click');
  }, [playSoundSafely, synths]);

  const playSuccessSound = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.polySynth) return;
      synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
    }, 'success');
  }, [playSoundSafely, synths]);

  const playTransitionSound = useCallback(async () => {
    await playSoundSafely(() => {
      if (!synths?.synth) return;
      
      synths.synth.triggerAttackRelease('C4', '1.0');
      setTimeout(() => {
        if (synths.synth) synths.synth.triggerAttackRelease('E4', '1.0');
      }, 800);
      setTimeout(() => {
        if (synths.synth) synths.synth.triggerAttackRelease('G4', '1.5');
      }, 1600);
    }, 'transition');
  }, [playSoundSafely, synths]);

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
