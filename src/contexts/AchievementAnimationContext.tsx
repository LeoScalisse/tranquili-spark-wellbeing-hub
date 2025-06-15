
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAudio } from './AudioContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration';
}

interface AchievementAnimationContextType {
  showAchievementAnimation: (achievement: Achievement) => void;
  hideAchievementAnimation: () => void;
  currentAchievement: Achievement | null;
  isAnimationVisible: boolean;
}

const AchievementAnimationContext = createContext<AchievementAnimationContextType | undefined>(undefined);

export const useAchievementAnimation = () => {
  const context = useContext(AchievementAnimationContext);
  if (context === undefined) {
    throw new Error('useAchievementAnimation must be used within an AchievementAnimationProvider');
  }
  return context;
};

export const AchievementAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const { playAchievementSound } = useAudio();

  const showAchievementAnimation = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setIsAnimationVisible(true);
    playAchievementSound();
  };

  const hideAchievementAnimation = () => {
    setIsAnimationVisible(false);
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 300);
  };

  const value = {
    showAchievementAnimation,
    hideAchievementAnimation,
    currentAchievement,
    isAnimationVisible,
  };

  return (
    <AchievementAnimationContext.Provider value={value}>
      {children}
    </AchievementAnimationContext.Provider>
  );
};
