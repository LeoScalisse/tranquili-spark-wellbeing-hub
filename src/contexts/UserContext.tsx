
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/user';
import { getUserFromStorage } from '@/utils/userUtils';
import { useAuth } from '@/hooks/useAuth';
import { useUserActions } from '@/hooks/useUserActions';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login, register } = useAuth(setUser, setIsAuthenticated);
  const { addXP, addMood, unlockAchievement, updateStreak, updateGameProgress, logout } = useUserActions(
    user,
    setUser,
    setIsAuthenticated
  );

  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

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
    updateGameProgress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
