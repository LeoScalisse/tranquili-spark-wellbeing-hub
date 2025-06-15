
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  MoodEntry,
  UserContextType,
} from "./user/userTypes";
import * as auth from "./user/auth";
import * as actions from "./user/userActions";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("tranquili-user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Auth functions wrap underlying logic but wire in context state
  const login = (email: string, password: string) =>
    auth.login(email, password, setUser, setIsAuthenticated);

  const register = (name: string, email: string, password: string) =>
    auth.register(name, email, password, setUser, setIsAuthenticated);

  const logout = () => auth.logout(setUser, setIsAuthenticated);

  // user actions logic
  const addXP = (amount: number) => actions.addXP(user, setUser, amount);

  const addMood = (mood: MoodEntry) => actions.addMood(user, setUser, mood);

  const unlockAchievement = (achievementId: string) =>
    actions.unlockAchievement(user, setUser, achievementId, addXP);

  const updateStreak = () => actions.updateStreak(user, setUser);

  const value: UserContextType = {
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
