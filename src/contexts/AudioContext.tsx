
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  playMoodSound: (moodType: string) => void;
  playSuccessSound: () => void;
  playClickSound: () => void;
  playTypingSound: () => void;
  playAchievementSound: () => void;
  playGameSound: (type: 'correct' | 'incorrect') => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
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
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    const synthInstance = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();
    
    setSynth(synthInstance);

    return () => {
      synthInstance.dispose();
    };
  }, []);

  const startAudio = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  };

  const playMoodSound = async (moodType: string) => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    const moodNotes: { [key: string]: string } = {
      happy: 'C5',
      sad: 'F3',
      calm: 'G4',
      anxious: 'D#4',
      excited: 'A5',
      angry: 'C#3'
    };
    
    const note = moodNotes[moodType] || 'C4';
    synth.triggerAttackRelease(note, '0.3');
  };

  const playSuccessSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    // Play a happy melody
    const melody = ['C5', 'E5', 'G5'];
    melody.forEach((note, index) => {
      synth.triggerAttackRelease(note, '0.1', `+${index * 0.1}`);
    });
  };

  const playClickSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    synth.triggerAttackRelease('C4', '0.05');
  };

  const playTypingSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    synth.triggerAttackRelease('A4', '0.03');
  };

  const playAchievementSound = async () => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    // Play a triumphant melody
    const melody = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'];
    melody.forEach((note, index) => {
      synth.triggerAttackRelease(note, '0.2', `+${index * 0.1}`);
    });
  };

  const playGameSound = async (type: 'correct' | 'incorrect') => {
    if (!isAudioEnabled || !synth) return;
    
    await startAudio();
    
    if (type === 'correct') {
      synth.triggerAttackRelease('G5', '0.2');
    } else {
      synth.triggerAttackRelease('C3', '0.3');
    }
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
    isAudioEnabled,
    toggleAudio,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
