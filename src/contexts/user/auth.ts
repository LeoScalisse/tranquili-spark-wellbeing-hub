
import { calculateLevel, saveUser } from "./userUtils";
import { User } from "./userTypes";

export const login = async (
  email: string,
  password: string,
  setUser: (u: User) => void,
  setIsAuthenticated: (a: boolean) => void
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const savedUsers = JSON.parse(localStorage.getItem("tranquili-users") || "[]");
  const existingUser = savedUsers.find(
    (u: any) => u.email === email && u.password === password
  );
  if (existingUser) {
    const { level, xpToNextLevel } = calculateLevel(existingUser.xp);
    const userData = { ...existingUser, level, xpToNextLevel };
    saveUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  }
  return false;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  setUser: (u: User) => void,
  setIsAuthenticated: (a: boolean) => void
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const savedUsers = JSON.parse(localStorage.getItem("tranquili-users") || "[]");
  const existingUser = savedUsers.find((u: any) => u.email === email);

  if (existingUser) {
    return false;
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
    moods: [],
  };

  savedUsers.push(newUser);
  localStorage.setItem("tranquili-users", JSON.stringify(savedUsers));
  const { level, xpToNextLevel } = calculateLevel(newUser.xp);
  const userData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    level,
    xp: newUser.xp,
    xpToNextLevel,
    streak: newUser.streak,
    achievements: newUser.achievements,
    moods: newUser.moods,
  };
  saveUser(userData);
  setUser(userData);
  setIsAuthenticated(true);
  return true;
};

export const logout = (
  setUser: (u: User | null) => void,
  setIsAuthenticated: (a: boolean) => void
) => {
  localStorage.removeItem("tranquili-user");
  setUser(null);
  setIsAuthenticated(false);
};
