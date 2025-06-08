
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastMoodDate?: string;
  achievements: string[];
  moods: MoodEntry[];
}

export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  color: string;
  date: string;
  timestamp: number;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addXP: (amount: number) => void;
  addMood: (mood: MoodEntry) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;
  return { level, xpToNextLevel };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('tranquili-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem('tranquili-user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const { level, xpToNextLevel } = calculateLevel(existingUser.xp);
      const userData: User = {
        ...existingUser,
        level,
        xpToNextLevel
      };
      saveUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      streak: 0,
      achievements: [],
      moods: []
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
    
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      level: newUser.level,
      xp: newUser.xp,
      xpToNextLevel: newUser.xpToNextLevel,
      streak: newUser.streak,
      achievements: newUser.achievements,
      moods: newUser.moods
    };
    
    saveUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('tranquili-user');
    setUser(null);
    setIsAuthenticated(false);
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
    
    // Update saved users
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { ...savedUsers[userIndex], xp: newXP, level };
      localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
    }
  };

  const addMood = (mood: MoodEntry) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      moods: [...user.moods, mood],
      lastMoodDate: mood.date
    };
    
    saveUser(updatedUser);
    
    // Update saved users
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { 
        ...savedUsers[userIndex], 
        moods: updatedUser.moods,
        lastMoodDate: mood.date
      };
      localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user || user.achievements.includes(achievementId)) return;
    
    const updatedUser = {
      ...user,
      achievements: [...user.achievements, achievementId]
    };
    
    saveUser(updatedUser);
    
    // Update saved users
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { 
        ...savedUsers[userIndex], 
        achievements: updatedUser.achievements
      };
      localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
    }
  };

  const updateStreak = () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = user.streak;
    
    if (user.lastMoodDate === today) {
      // Already logged today, no change
      return;
    } else if (user.lastMoodDate === yesterday) {
      // Continuing streak
      newStreak += 1;
    } else {
      // Breaking streak or starting new
      newStreak = 1;
    }
    
    const updatedUser = {
      ...user,
      streak: newStreak
    };
    
    saveUser(updatedUser);
    
    // Update saved users
    const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { 
        ...savedUsers[userIndex], 
        streak: newStreak
      };
      localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    addXP,
    addMood,
    unlockAchievement,
    updateStreak,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
