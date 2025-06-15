
import { calculateLevel, saveUser, updateSavedUsers } from "./userUtils";
import { User, MoodEntry } from "./userTypes";

export const addXP = (user: User | null, setUser: (u: User) => void, amount: number) => {
  if (!user) return;
  const newXP = user.xp + amount;
  const { level, xpToNextLevel } = calculateLevel(newXP);
  const updatedUser = { ...user, xp: newXP, level, xpToNextLevel };
  saveUser(updatedUser);
  updateSavedUsers(user, { xp: newXP, level });
  setUser(updatedUser);
};

export const addMood = (user: User | null, setUser: (u: User) => void, mood: MoodEntry) => {
  if (!user) return;
  const updatedUser = {
    ...user,
    moods: [...user.moods, mood],
    lastMoodDate: mood.date,
  };
  saveUser(updatedUser);
  updateSavedUsers(user, { moods: updatedUser.moods, lastMoodDate: mood.date });
  setUser(updatedUser);
};

export const unlockAchievement = (
  user: User | null,
  setUser: (u: User) => void,
  achievementId: string,
  addXPFn: (a: number) => void
) => {
  if (!user || user.achievements.includes(achievementId)) return;
  const updatedUser = {
    ...user,
    achievements: [...user.achievements, achievementId],
  };
  saveUser(updatedUser);
  updateSavedUsers(user, { achievements: updatedUser.achievements });
  setUser(updatedUser);

  // XP for achievement
  addXPFn(25);
};

export const updateStreak = (user: User | null, setUser: (u: User) => void) => {
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

  const updatedUser = { ...user, streak: newStreak };
  saveUser(updatedUser);
  updateSavedUsers(user, { streak: newStreak });
  setUser(updatedUser);
};
