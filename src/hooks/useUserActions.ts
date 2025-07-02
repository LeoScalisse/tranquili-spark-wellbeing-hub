
import { User, MoodEntry } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

export const useUserActions = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const addXP = async (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const level = Math.floor(newXP / 100) + 1;
    const xpToNextLevel = (level * 100) - newXP;
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({ xp: newXP, level })
        .eq('user_id', user.id);

      if (!error) {
        const updatedUser = {
          ...user,
          xp: newXP,
          level,
          xpToNextLevel
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  const addMood = async (mood: MoodEntry) => {
    if (!user) return;
    
    try {
      const { error: moodError } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: mood.mood,
          emoji: mood.emoji,
          color: mood.color,
          date: mood.date,
          timestamp: mood.timestamp
        });

      const { error: progressError } = await supabase
        .from('user_progress')
        .update({ last_mood_date: mood.date })
        .eq('user_id', user.id);

      if (!moodError && !progressError) {
        const updatedUser = {
          ...user,
          moods: [...user.moods, mood],
          lastMoodDate: mood.date
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error adding mood:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user || user.achievements.includes(achievementId)) return;
    
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId
        });

      if (!error) {
        const updatedUser = {
          ...user,
          achievements: [...user.achievements, achievementId]
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const updateStreak = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let newStreak = user.streak;
    
    if (user.lastMoodDate === today) {
      return;
    } else if (user.lastMoodDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({ streak: newStreak })
        .eq('user_id', user.id);

      if (!error) {
        const updatedUser = {
          ...user,
          streak: newStreak
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const updateGameProgress = async (gameId: string, progress: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('game_progress')
        .upsert({
          user_id: user.id,
          game_id: gameId,
          progress
        });

      if (!error) {
        const updatedUser = {
          ...user,
          gameProgress: {
            ...user.gameProgress,
            [gameId]: progress
          }
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating game progress:', error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
