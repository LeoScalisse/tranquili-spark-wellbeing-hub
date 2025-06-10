
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  playMoodSound: (moodType: string) => void;
  playSuccessSound: () => void;
  playClickSound: () => void;
  playTypingSound: () => void;
  playAchievementSound: () => void;
  playGameSound: (type: 'correct' | 'incorrect') => void;
  playBreathingSound: (type: 'inhale' | 'exhale') => void;
  playNotificationSound: () => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  soundProfile: 'zen' | 'nature' | 'minimal' | 'crystals';
  setSoundProfile: (profile: 'zen' | 'nature' | 'minimal' | 'crystals') => void;
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
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [soundProfile, setSoundProfile] = useState<'zen' | 'nature' | 'minimal' | 'crystals'>('zen');
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [bellSynth, setBellSynth] = useState<Tone.MetalSynth | null>(null);
  const [padSynth, setPadSynth] = useState<Tone.Synth | null>(null);
  const [reverb, setReverb] = useState<Tone.Reverb | null>(null);

  useEffect(() => {
    // Cria um reverb natural para profundidade
    const reverbInstance = new Tone.Reverb({
      decay: 4,
      wet: 0.3
    }).toDestination();

    // Sintetizador principal com envelope suave
    const synthInstance = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.3,
        decay: 0.8,
        sustain: 0.4,
        release: 1.2
      }
    }).connect(reverbInstance);

    // Sintetizador de sino tibetano para sucessos
    const bellInstance = new Tone.MetalSynth({
      frequency: 528, // Frequência de cura
      envelope: {
        attack: 0.1,
        decay: 1.4,
        release: 2.0
      },
      harmonicity: 3.1,
      modulationIndex: 16,
      resonance: 4000,
      octaves: 1.5
    }).connect(reverbInstance);

    // Sintetizador pad para sons ambiente
    const padInstance = new Tone.Synth({
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 1.0,
        decay: 0.5,
        sustain: 0.8,
        release: 2.0
      }
    }).connect(reverbInstance);

    setSynth(synthInstance);
    setBellSynth(bellInstance);
    setPadSynth(padInstance);
    setReverb(reverbInstance);

    return () => {
      synthInstance.dispose();
      bellInstance.dispose();
      padInstance.dispose();
      reverbInstance.dispose();
    };
  }, []);

  const startAudio = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  };

  // Sons de humor mais relaxantes e terapêuticos
  const playMoodSound = async (moodType: string) => {
    if (!isAudioEnabled || !synth || !padSynth) return;
    
    await startAudio();
    
    const moodSounds: { [key: string]: () => void } = {
      happy: () => {
        // Melodia ascendente suave com acordes maiores
        const happyNotes = ['C4', 'E4', 'G4'];
        happyNotes.forEach((note, index) => {
          synth.triggerAttackRelease(note, '0.8', `+${index * 0.3}`);
        });
      },
      sad: () => {
        // Sons contemplativos com reverb
        padSynth.triggerAttackRelease('F3', '2.0');
        synth.triggerAttackRelease('Ab3', '1.5', '+0.5');
      },
      calm: () => {
        // Tons zen com frequências baixas
        const calmNotes = ['C3', 'G3'];
        calmNotes.forEach((note, index) => {
          synth.triggerAttackRelease(note, '1.5', `+${index * 0.8}`);
        });
      },
      anxious: () => {
        // Sons que acalmam ansiedade - respiração sonora
        synth.triggerAttackRelease('G4', '0.8');
        synth.triggerAttackRelease('F4', '1.2', '+1.0');
        synth.triggerAttackRelease('E4', '1.5', '+2.0');
      },
      excited: () => {
        // Energia controlada com arpejos suaves
        const excitedNotes = ['C4', 'E4', 'G4', 'C5'];
        excitedNotes.forEach((note, index) => {
          synth.triggerAttackRelease(note, '0.4', `+${index * 0.2}`);
        });
      },
      angry: () => {
        // Sons que dissipam raiva - progressão descendente relaxante
        const calmingNotes = ['G4', 'F4', 'E4', 'D4', 'C4'];
        calmingNotes.forEach((note, index) => {
          synth.triggerAttackRelease(note, '0.8', `+${index * 0.4}`);
        });
      }
    };
    
    const moodSound = moodSounds[moodType] || moodSounds.calm;
    moodSound();
  };

  // Som de sucesso como carrilhão harmônico
  const playSuccessSound = async () => {
    if (!isAudioEnabled || !bellSynth) return;
    
    await startAudio();
    
    // Carrilhão harmônico ascendente (singing bowls style)
    const successNotes = [264, 297, 330, 396]; // Frequências solfeggio
    successNotes.forEach((freq, index) => {
      bellSynth.triggerAttackRelease(freq, '1.2', `+${index * 0.2}`);
    });
  };

  // Click sound como gota d'água suave
  const playClickSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    // Som de gota d'água suave
    synth.triggerAttackRelease('E5', '0.1');
    synth.triggerAttackRelease('E4', '0.05', '+0.05');
  };

  // Som de digitação como folhas rustling
  const playTypingSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    // Som muito sutil de folhas
    const randomNote = ['F#5', 'G5', 'G#5'][Math.floor(Math.random() * 3)];
    synth.triggerAttackRelease(randomNote, '0.02');
  };

  // Som de conquista como sino de meditação
  const playAchievementSound = async () => {
    if (!isAudioEnabled || !bellSynth || !synth) return;
    
    await startAudio();
    
    // Sino de meditação principal
    bellSynth.triggerAttackRelease(528, '3.0'); // Frequência de cura
    
    // Harmônicos suaves
    setTimeout(() => {
      synth.triggerAttackRelease('C5', '2.0');
    }, 500);
    
    setTimeout(() => {
      synth.triggerAttackRelease('G5', '1.5');
    }, 1000);
  };

  // Sons para jogos mais terapêuticos
  const playGameSound = async (type: 'correct' | 'incorrect') => {
    if (!isAudioEnabled || !synth || !bellSynth) return;
    
    await startAudio();
    
    if (type === 'correct') {
      // Som de cristal harmônico (528 Hz - frequência de cura)
      bellSynth.triggerAttackRelease(528, '0.8');
    } else {
      // Som de almofada suave (não punitivo)
      synth.triggerAttackRelease('F3', '0.5');
      synth.triggerAttackRelease('C3', '0.3', '+0.2');
    }
  };

  // Novos sons para respiração guiada
  const playBreathingSound = async (type: 'inhale' | 'exhale') => {
    if (!isAudioEnabled || !padSynth) return;
    
    await startAudio();
    
    if (type === 'inhale') {
      // Som ascendente suave para inspiração
      padSynth.triggerAttackRelease('C3', '2.0');
      padSynth.triggerAttackRelease('G3', '2.0', '+0.5');
    } else {
      // Som descendente suave para expiração  
      padSynth.triggerAttackRelease('G3', '2.5');
      padSynth.triggerAttackRelease('C3', '2.5', '+0.5');
    }
  };

  // Som de notificação relaxante
  const playNotificationSound = async () => {
    if (!isAudioEnabled || !bellSynth) return;
    
    await startAudio();
    
    // Som suave de sino para alertas sem stress
    bellSynth.triggerAttackRelease(396, '1.0'); // Frequência de libertação
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const value = {
    playMoodSound,
    playSuccessSound,
    playClickSound,
    playTypingSound,
    playAchievementSound,
    playGameSound,
    playBreathingSound,
    playNotificationSound,
    isAudioEnabled,
    toggleAudio,
    soundProfile,
    setSoundProfile,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
