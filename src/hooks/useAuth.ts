
import { User } from '@/types/user';
import { calculateLevel, saveUserToStorage } from '@/utils/userUtils';

export const useAuth = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
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
      saveUserToStorage(userData);
      setUser(userData);
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
    
    saveUserToStorage(userData);
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  return { login, register };
};
