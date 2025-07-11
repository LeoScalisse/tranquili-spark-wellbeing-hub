
import { User, MoodEntry } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { calculateLevelFromXP, getXPForAction } from '@/utils/xpSystem';
import { sanitizeInput } from '@/utils/securityUtils';

export const useUserActions = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const addXP = async (amount: number, action?: string) => {
    if (!user) return;
    
    // Calcular XP baseado no nível atual e ação
    const xpToAdd = action ? getXPForAction(action, user.level) : amount;
    const newTotalXP = user.xp + xpToAdd;
    
    // Calcular novo nível usando o sistema progressivo
    const { level, currentLevelXP, xpToNextLevel } = calculateLevelFromXP(newTotalXP);
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({ xp: newTotalXP, level })
        .eq('user_id', user.id);

      if (!error) {
        const updatedUser = {
          ...user,
          xp: newTotalXP,
          level,
          currentLevelXP,
          xpToNextLevel
        };
        setUser(updatedUser);
        
        // Se subiu de nível, log especial
        if (level > user.level) {
          console.log(`🎉 Nível UP! Novo nível: ${level}`);
        }
      }
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  const addMood = async (mood: MoodEntry) => {
    if (!user) return;
    
    try {
      // Sanitize mood data
      const sanitizedMood = {
        user_id: user.id,
        mood: sanitizeInput(mood.mood),
        emoji: sanitizeInput(mood.emoji),
        color: sanitizeInput(mood.color),
        date: mood.date,
        timestamp: mood.timestamp
      };

      // Check for duplicate mood entry on the same day to prevent spam
      const { data: existingMood } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', mood.date)
        .single();

      if (existingMood) {
        console.log('🚨 Tentativa de entrada de humor duplicada detectada');
        return;
      }

      const { error: moodError } = await supabase
        .from('mood_entries')
        .insert(sanitizedMood);

      const { error: progressError } = await supabase
        .from('user_progress')
        .update({ last_mood_date: mood.date })
        .eq('user_id', user.id);

      if (!moodError && !progressError) {
        const updatedUser = {
          ...user,
          moods: [...user.moods, {
            ...mood,
            mood: sanitizedMood.mood,
            emoji: sanitizedMood.emoji,
            color: sanitizedMood.color
          }],
          lastMoodDate: mood.date
        };
        setUser(updatedUser);
        
        // Adicionar XP por registrar humor
        await addXP(0, 'mood_entry');
      }
    } catch (error) {
      console.error('Error adding mood:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user || user.achievements.includes(achievementId)) return;
    
    try {
      const sanitizedAchievementId = sanitizeInput(achievementId);
      
      // Check for duplicate achievement to prevent race conditions
      const { data: existingAchievement } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', sanitizedAchievementId)
        .single();

      if (existingAchievement) {
        console.log('🚨 Tentativa de conquista duplicada detectada');
        return;
      }

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: sanitizedAchievementId
        });

      if (!error) {
        const updatedUser = {
          ...user,
          achievements: [...user.achievements, sanitizedAchievementId]
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
      const sanitizedGameId = sanitizeInput(gameId);
      const sanitizedProgress = JSON.stringify(progress); // Basic JSON sanitization
      
      const { error } = await supabase
        .from('game_progress')
        .upsert({
          user_id: user.id,
          game_id: sanitizedGameId,
          progress: JSON.parse(sanitizedProgress)
        });

      if (!error) {
        const updatedUser = {
          ...user,
          gameProgress: {
            ...user.gameProgress,
            [sanitizedGameId]: progress
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
