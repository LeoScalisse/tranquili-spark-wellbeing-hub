
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

  // Sons de humor da página inicial - frequências terapêuticas
  const playMoodSound = useCallback(async (moodType: MoodType) => {
    if (!isSoundOn || !synths?.synth) return;
    
    await startToneIfNeeded();

    switch (moodType) {
      case 'happy':
        // Frequência 528 Hz (Love frequency) - tom alegre mas suave
        synths.synth.triggerAttackRelease('C5', '2.0');
        break;
        
      case 'sad':
        // Frequência 396 Hz (Liberation) - tom acolhedor
        synths.synth.triggerAttackRelease('G3', '3.0');
        break;
        
      case 'calm':
        // Frequência 432 Hz (Natural harmony) - máxima tranquilidade
        synths.synth.triggerAttackRelease('A4', '4.0');
        break;
        
      case 'anxious':
        // Sequência suave descendente para acalmar
        synths.synth.triggerAttackRelease('E4', '1.5');
        setTimeout(() => {
          if (synths.synth) synths.synth.triggerAttackRelease('C4', '2.0');
        }, 800);
        break;
        
      case 'angry':
        // Tom grave e envolvente para acalmar a raiva
        synths.synth.triggerAttackRelease('D3', '2.5');
        break;
        
      case 'thoughtful':
        // Progressão contemplativa suave
        synths.synth.triggerAttackRelease('F4', '2.0');
        setTimeout(() => {
          if (synths.synth) synths.synth.triggerAttackRelease('A4', '2.0');
        }, 1200);
        break;
    }
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Som de confirmação ultra suave
  const playMoodConfirmation = useCallback(async () => {
    if (!isSoundOn || !synths?.polySynth) return;
    
    await startToneIfNeeded();
    
    // Acorde suave de confirmação
    synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '1.5');
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Som de digitação ultra discreto
  const startTypingSound = useCallback(async () => {
    if (!isSoundOn || !synths?.noiseSynth || typingLoopRef.current) return;
    
    await startToneIfNeeded();
    
    // Ruído rosa muito suave em pulsos longos
    typingLoopRef.current = new Tone.Loop((time) => {
      synths.noiseSynth?.triggerAttackRelease('0.08', time);
    }, '0.4').start(0);
    
    Tone.Transport.start();
  }, [isSoundOn, startToneIfNeeded, synths]);

  const stopTypingSound = useCallback(() => {
    if (typingLoopRef.current) {
      typingLoopRef.current.dispose();
      typingLoopRef.current = null;
      Tone.Transport.stop();
    }
  }, []);

  // Função de digitação única mais suave
  const playTypingSound = useCallback(async () => {
    if (!isSoundOn || !synths?.noiseSynth) return;
    
    await startToneIfNeeded();
    synths.noiseSynth.triggerAttackRelease('0.05');
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Som de conquista celestial e inspirador
  const playAchievementSound = useCallback(async () => {
    if (!isSoundOn || !synths?.polySynth || !synths?.synth) return;
    
    await startToneIfNeeded();
    
    // Progressão harmônica celestial
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
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Sons dos jogos - todos suavizados
  const playGameSound = useCallback(async (type: GameSoundType) => {
    if (!isSoundOn || !synths?.synth || !synths?.polySynth) return;
    
    await startToneIfNeeded();

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
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Sons das cartas ultra suaves
  const playCardSound = useCallback(async (type: CardSoundType) => {
    if (!isSoundOn || !synths?.synth || !synths?.fmSynth) return;
    
    await startToneIfNeeded();

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
  }, [isSoundOn, startToneIfNeeded, synths]);

  // Som ambiente dos jogos - atmosferas relaxantes
  const startGameAmbient = useCallback(async (gameType: GameType) => {
    if (!isSoundOn) return;
    
    await startToneIfNeeded();
    
    const playAmbientTone = () => {
      if (!synths?.synth || !isSoundOn) return;
      
      if (gameType === 'color') {
        const notes = ['C3', 'E3', 'G3', 'B3'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        synths.synth.triggerAttackRelease(randomNote, '6.0');
      } else {
        const notes = ['F3', 'A3', 'C4', 'E4'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        synths.synth.triggerAttackRelease(randomNote, '5.0');
      }
    };
    
    playAmbientTone();
    ambientLoopRef.current = setInterval(playAmbientTone, 8000);
  }, [isSoundOn, startToneIfNeeded, synths]);

  const stopGameAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearInterval(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }
  }, []);

  // Sons adicionais suavizados
  const playClickSound = useCallback(async () => {
    if (!isSoundOn || !synths?.synth) return;
    
    await startToneIfNeeded();
    synths.synth.triggerAttackRelease('C5', '0.4');
  }, [isSoundOn, startToneIfNeeded, synths]);

  const playSuccessSound = useCallback(async () => {
    if (!isSoundOn || !synths?.polySynth) return;
    
    await startToneIfNeeded();
    synths.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '2.0');
  }, [isSoundOn, startToneIfNeeded, synths]);

  const playTransitionSound = useCallback(async () => {
    if (!isSoundOn || !synths?.synth) return;
    
    await startToneIfNeeded();
    
    synths.synth.triggerAttackRelease('C4', '1.0');
    setTimeout(() => {
      if (synths.synth) synths.synth.triggerAttackRelease('E4', '1.0');
    }, 800);
    setTimeout(() => {
      if (synths.synth) synths.synth.triggerAttackRelease('G4', '1.5');
    }, 1600);
  }, [isSoundOn, startToneIfNeeded, synths]);

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
