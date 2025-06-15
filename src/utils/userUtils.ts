
import { User } from '@/types/user';

export const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;
  return { level, xpToNextLevel };
};

export const saveUserToStorage = (userData: User) => {
  localStorage.setItem('tranquili-user', JSON.stringify(userData));
};

export const getUserFromStorage = (): User | null => {
  const savedUser = localStorage.getItem('tranquili-user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export const updateUserInStorage = (userId: string, updates: Partial<User>) => {
  const savedUsers = JSON.parse(localStorage.getItem('tranquili-users') || '[]');
  const userIndex = savedUsers.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    savedUsers[userIndex] = { ...savedUsers[userIndex], ...updates };
    localStorage.setItem('tranquili-users', JSON.stringify(savedUsers));
  }
};
