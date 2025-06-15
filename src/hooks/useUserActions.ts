
import { useState } from 'react';
import { User, MoodEntry } from '@/types/user';
import { calculateLevel, saveUserToStorage, updateUserInStorage } from '@/utils/userUtils';

export const useUserActions = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const saveUser = (userData: User) => {
    saveUserToStorage(userData);
    setUser(userData);
  };

  const addXP = (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const { level, xpToNextLevel } = calculateLevel(newXP);
    
    const updatedUser = {
      ...user,
      xp: newXP,
      level,
      xpToNextLevel
    };
    
    saveUser(updatedUser);
    updateUserInStorage(user.id, { xp: newXP, level });
  };

  const addMood = (mood: MoodEntry) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      moods: [...user.moods, mood],
      lastMoodDate: mood.date
    };
    
    saveUser(updatedUser);
    updateUserInStorage(user.id, { 
      moods: updatedUser.moods,
      lastMoodDate: mood.date
    });
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user || user.achievements.includes(achievementId)) return;
    
    const updatedUser = {
      ...user,
      achievements: [...user.achievements, achievementId]
    };
    
    saveUser(updatedUser);
    updateUserInStorage(user.id, { achievements: updatedUser.achievements });
  };

  const updateStreak = () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = user.streak;
    
    if (user.lastMoodDate === today) {
      return;
    } else if (user.lastMoodDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
    
    const updatedUser = {
      ...user,
      streak: newStreak
    };
    
    saveUser(updatedUser);
    updateUserInStorage(user.id, { streak: newStreak });
  };

  const updateGameProgress = (gameId: string, progress: any) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      gameProgress: {
        ...user.gameProgress,
        [gameId]: progress
      }
    };
    
    saveUser(updatedUser);
    updateUserInStorage(user.id, { gameProgress: updatedUser.gameProgress });
  };

  const logout = () => {
    localStorage.removeItem('tranquili-user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    addXP,
    addMood,
    unlockAchievement,
    updateStreak,
    updateGameProgress,
    logout
  };
};
