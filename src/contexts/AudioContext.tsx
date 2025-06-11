
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  playMoodSound: (moodType: string) => void;
  playSuccessSound: () => void;
  playTransitionSound: () => void;
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
  const [keyboardSynth, setKeyboardSynth] = useState<Tone.Synth | null>(null);
  const [crystalSynth, setCrystalSynth] = useState<Tone.FMSynth | null>(null);
  const [reverb, setReverb] = useState<Tone.Reverb | null>(null);
  const [deepReverb, setDeepReverb] = useState<Tone.Reverb | null>(null);
  const [delay, setDelay] = useState<Tone.PingPongDelay | null>(null);

  useEffect(() => {
    // Reverb suave para profundidade natural
    const reverbInstance = new Tone.Reverb({
      decay: 3.5,
      wet: 0.4,
      preDelay: 0.1
    }).toDestination();

    // Reverb profundo e envolvente para transições especiais
    const deepReverbInstance = new Tone.Reverb({
      decay: 6,
      wet: 0.6,
      preDelay: 0.2
    }).toDestination();

    // Delay sutil para espacialidade
    const delayInstance = new Tone.PingPongDelay({
      delayTime: '8n',
      feedback: 0.2,
      wet: 0.1
    }).connect(reverbInstance);

    // Sintetizador principal melhorado - sons mais orgânicos
    const synthInstance = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.5,
        decay: 1.2,
        sustain: 0.3,
        release: 2.0
      }
    }).connect(delayInstance);

    // Sintetizador de sino tibetano aprimorado
    const bellInstance = new Tone.MetalSynth({
      envelope: {
        attack: 0.05,
        decay: 2.0,
        release: 3.0
      },
      harmonicity: 2.1,
      modulationIndex: 12,
      resonance: 3000,
      octaves: 1.2
    }).connect(reverbInstance);

    // Sintetizador pad para ambientes relaxantes
    const padInstance = new Tone.Synth({
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 1.5,
        decay: 0.8,
        sustain: 0.7,
        release: 3.0
      }
    }).connect(deepReverbInstance);

    // Sintetizador para teclas de computador relaxantes
    const keyboardInstance = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.2,
        release: 0.3
      }
    }).connect(reverbInstance);

    // Sintetizador cristalino para jogos
    const crystalInstance = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.4,
        release: 1.2
      },
      modulation: {
        type: 'sine'
      },
      modulationEnvelope: {
        attack: 0.2,
        decay: 0.2,
        sustain: 0.8,
        release: 0.5
      }
    }).connect(reverbInstance);

    setSynth(synthInstance);
    setBellSynth(bellInstance);
    setPadSynth(padInstance);
    setKeyboardSynth(keyboardInstance);
    setCrystalSynth(crystalInstance);
    setReverb(reverbInstance);
    setDeepReverb(deepReverbInstance);
    setDelay(delayInstance);

    return () => {
      synthInstance.dispose();
      bellInstance.dispose();
      padInstance.dispose();
      keyboardInstance.dispose();
      crystalInstance.dispose();
      reverbInstance.dispose();
      deepReverbInstance.dispose();
      delayInstance.dispose();
    };
  }, []);

  const startAudio = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  };

  // Sons de humor aprimorados com frequências específicas e mais expressivos
  const playMoodSound = async (moodType: string) => {
    if (!isAudioEnabled || !synth || !padSynth || !bellSynth) return;
    
    await startAudio();
    
    const moodSounds: { [key: string]: () => void } = {
      happy: () => {
        // Progressão alegre com acordes maiores - mais melodiosa
        const happyProgression = [
          { notes: ['C4', 'E4'], delay: 0 },
          { notes: ['G4', 'B4'], delay: 0.4 },
          { notes: ['C5'], delay: 0.8 },
          { notes: ['E5'], delay: 1.0 }
        ];
        
        happyProgression.forEach(({ notes, delay }) => {
          notes.forEach((note, i) => {
            synth.triggerAttackRelease(note, '1.0', `+${delay + i * 0.1}`);
          });
        });
      },
      sad: () => {
        // Melodia contemplativa mais profunda e expressiva
        const sadNotes = [
          { note: 'Dm3', duration: '2.0', delay: 0 },
          { note: 'F3', duration: '1.8', delay: 0.8 },
          { note: 'Am3', duration: '2.2', delay: 1.8 },
          { note: 'C3', duration: '3.0', delay: 3.0 }
        ];
        
        sadNotes.forEach(({ note, duration, delay }) => {
          padSynth.triggerAttackRelease(note, duration, `+${delay}`);
        });
      },
      calm: () => {
        // Frequências zen com tons tibetanos (396Hz + 528Hz)
        bellSynth.triggerAttackRelease(396, '3.0'); // Libertação do medo
        bellSynth.triggerAttackRelease(528, '2.5', '+1.0'); // Frequência do amor
        
        // Harmônicos zen de apoio
        setTimeout(() => {
          synth.triggerAttackRelease('C3', '2.0');
        }, 2000);
      },
      anxious: () => {
        // Sequência respiratória sonora mais longa que acalma gradualmente
        const breathingSequence = [
          { note: 'G4', duration: '1.0', delay: 0 }, // Inspirar
          { note: 'F4', duration: '1.2', delay: 1.5 }, // Segurar
          { note: 'E4', duration: '1.8', delay: 3.0 }, // Expirar longo
          { note: 'D4', duration: '1.5', delay: 5.0 }, // Descansar
          { note: 'C4', duration: '2.5', delay: 6.5 }  // Paz final
        ];
        
        breathingSequence.forEach(({ note, duration, delay }) => {
          synth.triggerAttackRelease(note, duration, `+${delay}`);
        });
      },
      excited: () => {
        // Energia controlada com arpejos mais melodiosos
        const excitedArpeggio = ['C4', 'E4', 'G4', 'C5', 'E5'];
        excitedArpeggio.forEach((note, index) => {
          synth.triggerAttackRelease(note, '0.6', `+${index * 0.15}`);
          if (index % 2 === 0) {
            bellSynth.triggerAttackRelease(note, '0.4', `+${index * 0.15 + 0.1}`);
          }
        });
      },
      angry: () => {
        // Progressão mais longa e eficaz para dissipar raiva
        const calmingProgression = [
          { note: 'G4', duration: '1.0', delay: 0 },
          { note: 'F4', duration: '1.2', delay: 1.0 },
          { note: 'E4', duration: '1.4', delay: 2.2 },
          { note: 'D4', duration: '1.6', delay: 3.6 },
          { note: 'C4', duration: '2.0', delay: 5.2 },
          { note: 'G3', duration: '2.5', delay: 7.2 } // Tom final muito baixo e relaxante
        ];
        
        calmingProgression.forEach(({ note, duration, delay }) => {
          padSynth.triggerAttackRelease(note, duration, `+${delay}`);
        });
      }
    };
    
    const moodSound = moodSounds[moodType] || moodSounds.calm;
    moodSound();
  };

  // Som de sucesso mais sutil e satisfatório
  const playSuccessSound = async () => {
    if (!isAudioEnabled || !bellSynth || !crystalSynth) return;
    
    await startAudio();
    
    // Chime cristalino principal
    crystalSynth.triggerAttackRelease('C5', '1.2');
    
    // Harmônicos suaves de apoio
    setTimeout(() => {
      bellSynth.triggerAttackRelease(528, '0.8');
    }, 200);
    
    setTimeout(() => {
      crystalSynth.triggerAttackRelease('G5', '0.6');
    }, 400);
  };

  // Som de transição como acorde de harpa mais suave e envolvente
  const playTransitionSound = async () => {
    if (!isAudioEnabled || !bellSynth || !synth || !padSynth) return;
    
    await startAudio();
    
    // Acorde de harpa celestial - sequência mais longa e envolvente
    const harpProgression = [
      { note: 'C4', delay: 0, duration: '4.0' },
      { note: 'E4', delay: 0.15, duration: '3.8' },
      { note: 'G4', delay: 0.3, duration: '3.6' },
      { note: 'C5', delay: 0.45, duration: '3.4' },
      { note: 'E5', delay: 0.6, duration: '3.2' },
      { note: 'G5', delay: 0.75, duration: '3.0' },
      { note: 'C6', delay: 0.9, duration: '2.8' }
    ];
    
    // Tocar progressão principal
    harpProgression.forEach(({ note, delay, duration }) => {
      setTimeout(() => {
        bellSynth.triggerAttackRelease(note, duration);
      }, delay * 150);
    });
    
    // Camada harmônica profunda com fade gradual
    setTimeout(() => {
      padSynth.triggerAttackRelease('C2', '5.0');
    }, 500);
    
    setTimeout(() => {
      padSynth.triggerAttackRelease('G2', '4.5');
    }, 1000);
    
    // Frequências solfeggio para máximo relaxamento
    setTimeout(() => {
      bellSynth.triggerAttackRelease(396, '3.0'); // Libertação
    }, 1500);
    
    setTimeout(() => {
      bellSynth.triggerAttackRelease(528, '2.5'); // Amor
    }, 2500);
    
    // Fade final com quinta perfeita
    setTimeout(() => {
      synth.triggerAttackRelease('C4', '3.0');
      synth.triggerAttackRelease('G4', '3.0', '+0.2');
    }, 3500);
  };

  // Click sound como gota de orvalho
  const playClickSound = async () => {
    if (!isAudioEnabled || !crystalSynth) return;
    
    await startAudio();
    
    // Som de gota cristalina
    crystalSynth.triggerAttackRelease('E5', '0.15');
    crystalSynth.triggerAttackRelease('C5', '0.1', '+0.05');
  };

  // Som de digitação como teclas mecânicas relaxantes
  const playTypingSound = async () => {
    if (!isAudioEnabled || !keyboardSynth) return;
    
    await startAudio();
    
    // Simula teclas mecânicas premium com variação sutil
    const keyNotes = ['F#4', 'G4', 'G#4', 'A4'];
    const randomNote = keyNotes[Math.floor(Math.random() * keyNotes.length)];
    
    // Som principal da tecla
    keyboardSynth.triggerAttackRelease(randomNote, '0.08');
    
    // Harmônico sutil para realismo
    setTimeout(() => {
      keyboardSynth.triggerAttackRelease(randomNote, '0.04', undefined, 0.3);
    }, 10);
  };

  // Som de conquista como carrilhão de vitória
  const playAchievementSound = async () => {
    if (!isAudioEnabled || !bellSynth || !crystalSynth || !synth) return;
    
    await startAudio();
    
    // Carrilhão principal de conquista
    const achievementChimes = [
      { note: 528, delay: 0, duration: '2.0' }, // Frequência do amor
      { note: 'C5', delay: 0.3, duration: '1.8' },
      { note: 'G5', delay: 0.6, duration: '1.6' },
      { note: 'C6', delay: 0.9, duration: '1.4' }
    ];
    
    achievementChimes.forEach(({ note, delay, duration }) => {
      setTimeout(() => {
        if (typeof note === 'number') {
          bellSynth.triggerAttackRelease(note, duration);
        } else {
          crystalSynth.triggerAttackRelease(note, duration);
        }
      }, delay * 1000);
    });
    
    // Harmônicos de celebração
    setTimeout(() => {
      synth.triggerAttackRelease('C4', '2.5');
      synth.triggerAttackRelease('E4', '2.3', '+0.2');
      synth.triggerAttackRelease('G4', '2.1', '+0.4');
    }, 1200);
  };

  // Sons para jogos mais calmantes e terapêuticos
  const playGameSound = async (type: 'correct' | 'incorrect') => {
    if (!isAudioEnabled || !crystalSynth || !padSynth) return;
    
    await startAudio();
    
    if (type === 'correct') {
      // Som de acerto mais calmo e satisfatório
      crystalSynth.triggerAttackRelease('C5', '0.8');
      setTimeout(() => {
        crystalSynth.triggerAttackRelease('G5', '0.6');
      }, 200);
      setTimeout(() => {
        crystalSynth.triggerAttackRelease('E5', '0.4');
      }, 500);
    } else {
      // Som de erro gentil e não punitivo - como almofada suave
      padSynth.triggerAttackRelease('F3', '0.6');
      setTimeout(() => {
        padSynth.triggerAttackRelease('D3', '0.8');
      }, 300);
      setTimeout(() => {
        padSynth.triggerAttackRelease('Bb2', '1.0');
      }, 700);
    }
  };

  // Sons para respiração guiada aprimorados
  const playBreathingSound = async (type: 'inhale' | 'exhale') => {
    if (!isAudioEnabled || !padSynth || !synth) return;
    
    await startAudio();
    
    if (type === 'inhale') {
      // Som ascendente mais suave e longo para inspiração
      padSynth.triggerAttackRelease('C3', '3.0');
      synth.triggerAttackRelease('G3', '2.8', '+0.3');
      synth.triggerAttackRelease('C4', '2.5', '+0.8');
    } else {
      // Som descendente mais relaxante para expiração
      padSynth.triggerAttackRelease('C4', '4.0');
      synth.triggerAttackRelease('G3', '3.8', '+0.5');
      synth.triggerAttackRelease('C3', '3.5', '+1.0');
    }
  };

  // Som de notificação muito sutil
  const playNotificationSound = async () => {
    if (!isAudioEnabled || !crystalSynth) return;
    
    await startAudio();
    
    // Som cristalino muito suave para não incomodar
    crystalSynth.triggerAttackRelease(396, '0.8'); // Frequência de libertação
    setTimeout(() => {
      crystalSynth.triggerAttackRelease(528, '0.6');
    }, 300);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const value = {
    playMoodSound,
    playSuccessSound,
    playTransitionSound,
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
