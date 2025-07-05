
export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentLevelXP: number;
  streak: number;
  lastMoodDate?: string;
  achievements: string[];
  moods: MoodEntry[];
  gameProgress?: {
    tranquiliMatch?: {
      currentLevel: number;
      highestLevel: number;
      totalMatches: number;
      timePlayedToday: number;
      lastPlayDate: string;
    };
    flashcardStudy?: {
      cardsStudied: number;
      totalTimeSpent: number;
      lastStudyDate: string;
    };
  };
}

export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  color: string;
  date: string;
  timestamp: number;
}

export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addXP: (amount: number) => void;
  addMood: (mood: MoodEntry) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  updateGameProgress: (gameId: string, progress: any) => void;
}
