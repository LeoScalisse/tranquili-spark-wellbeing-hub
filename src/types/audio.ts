
export type MoodType = 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful';
export type GameSoundType = 'correct' | 'incorrect' | 'click' | 'victory';
export type CardSoundType = 'flip' | 'match' | 'mismatch';
export type GameType = 'color' | 'memory' | 'bamboo';
export type BambooSoundType = 'place' | 'perfect' | 'fall' | 'wind' | 'bell';

export interface AudioContextType {
  // Controles globais
  isSoundOn: boolean;
  toggleSound: () => void;
  
  // Legacy properties for backward compatibility
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  soundProfile: string;
  setSoundProfile: (profile: string) => void;
  
  // Sons da página inicial
  playMoodSound: (moodType: MoodType) => void;
  playMoodConfirmation: () => void;
  
  // Sons do chat
  startTypingSound: () => void;
  stopTypingSound: () => void;
  playTypingSound: () => void;
  
  // Som de conquista
  playAchievementSound: () => void;
  
  // Sons dos jogos
  playGameSound: (type: GameSoundType) => void;
  playCardSound: (type: CardSoundType) => void;
  playBambooSound: (type: BambooSoundType) => void;
  
  // Sons ambiente dos jogos
  startGameAmbient: (gameType: GameType) => void;
  stopGameAmbient: () => void;
  
  // Additional sound functions used by components
  playClickSound: () => void;
  playSuccessSound: () => void;
  playTransitionSound: () => void;
}
