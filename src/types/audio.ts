
export type MoodType = 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful';
export type GameSoundType = 'correct' | 'incorrect' | 'click' | 'victory';
export type CardSoundType = 'flip' | 'match' | 'mismatch';
export type GameType = 'color' | 'memory';
export type AudioMethod = 'tone' | 'webaudio' | 'html5' | 'fallback';

export interface PlatformInfo {
  isPWA: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  userAgent: string;
  supportsWebAudio: boolean;
  requiresUserGesture: boolean;
}

export interface AudioContextType {
  // Controles globais
  isSoundOn: boolean;
  toggleSound: () => void;
  
  // Estados do sistema de áudio
  isAudioReady: boolean;
  needsUserInteraction: boolean;
  audioError: string | null;
  audioMethod: AudioMethod | null;
  
  // Funções de controle do sistema
  initializeAudio: () => Promise<boolean>;
  resetAudio: () => Promise<void>;
  testAudio: () => Promise<boolean>;
  
  // Informações de debug e plataforma
  getAudioDebugInfo: () => string[];
  platformInfo: PlatformInfo;
  
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
  
  // Sons ambiente dos jogos
  startGameAmbient: (gameType: GameType) => void;
  stopGameAmbient: () => void;
  
  // Additional sound functions used by components
  playClickSound: () => void;
  playSuccessSound: () => void;
  playTransitionSound: () => void;
}
