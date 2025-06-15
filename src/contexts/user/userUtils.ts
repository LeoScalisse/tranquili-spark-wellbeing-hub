
import { User } from "./userTypes";

export const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = level * 100 - xp;
  return { level, xpToNextLevel };
};

export const saveUser = (userData: User) => {
  localStorage.setItem("tranquili-user", JSON.stringify(userData));
};

export const updateSavedUsers = (user: User, updatedPartial: Partial<User>) => {
  const savedUsers = JSON.parse(localStorage.getItem("tranquili-users") || "[]");
  const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
  if (userIndex !== -1) {
    savedUsers[userIndex] = { ...savedUsers[userIndex], ...updatedPartial };
    localStorage.setItem("tranquili-users", JSON.stringify(savedUsers));
  }
};
