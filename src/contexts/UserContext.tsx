
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserActions } from '@/hooks/useUserActions';
import { useSecureSession } from '@/hooks/useSecureSession';
import { calculateLevelFromXP } from '@/utils/xpSystem';
import { sanitizeInput } from '@/utils/securityUtils';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user: sessionUser, session, isAuthenticated: sessionAuth, isLoading: sessionLoading } = useSecureSession();
  const { login, register } = useAuth(setUser, setIsAuthenticated);
  const { addXP, addMood, updateMood, unlockAchievement, updateStreak, updateGameProgress, logout } = useUserActions(
    user,
    setUser,
    setIsAuthenticated
  );

  useEffect(() => {
    setIsAuthenticated(sessionAuth);
    setIsLoading(sessionLoading);

    if (sessionUser && session) {
      fetchUserProfile(sessionUser.id);
    } else if (!sessionAuth && !sessionLoading) {
      setUser(null);
    }
  }, [sessionUser, session, sessionAuth, sessionLoading]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('📊 Buscando perfil do usuário:', userId);
      
      // Fetch user data with timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na busca de dados')), 10000)
      );

      const dataPromises = Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_progress').select('*').eq('user_id', userId).single(),
        supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
        supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
      ]);

      const [profileResult, progressResult, achievementsResult, moodsResult] = await Promise.race([
        dataPromises,
        timeout
      ]) as any;

      const { data: profile, error: profileError } = profileResult;
      let { data: progress, error: progressError } = progressResult;
      const { data: achievements, error: achievementsError } = achievementsResult;
      const { data: moods, error: moodsError } = moodsResult;

      if (profileError) {
        console.error('❌ Erro ao buscar profile:', profileError);
        throw profileError;
      }

      // Create progress if it doesn't exist
      if (progressError && progressError.code === 'PGRST116') {
        console.log('📝 Criando novo progresso para o usuário');
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({ user_id: userId, level: 1, xp: 0, streak: 0 });
        
        if (insertError) {
          console.error('❌ Erro ao criar progresso:', insertError);
          throw insertError;
        }
        
        const { data: newProgress, error: newProgressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();
            
        if (newProgressError) {
          throw newProgressError;
        }
        
        progress = newProgress;
      } else if (progressError) {
        throw progressError;
      }

      if (profile && progress) {
        const { level, currentLevelXP, xpToNextLevel } = calculateLevelFromXP(progress.xp || 0);
        
        // Sanitize user data
        const userData: User = {
          id: profile.id,
          name: sanitizeInput(profile.name || 'Usuário'),
          email: sanitizeInput(profile.email || ''),
          level,
          xp: progress.xp || 0,
          xpToNextLevel,
          currentLevelXP,
          streak: progress.streak || 0,
          lastMoodDate: progress.last_mood_date,
          achievements: achievements?.map(a => sanitizeInput(a.achievement_id)) || [],
          moods: moods?.map(mood => ({
            id: mood.id,
            mood: sanitizeInput(mood.mood),
            emoji: sanitizeInput(mood.emoji),
            color: sanitizeInput(mood.color),
            date: mood.date,
            timestamp: mood.timestamp
          })) || []
        };

        console.log('✅ Dados do usuário carregados com segurança:', userData);
        setUser(userData);
      } else {
        throw new Error('Profile ou progress não encontrados');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil do usuário:', error);
      
      // For timeout errors, provide minimal user data
      if (error instanceof Error && error.message.includes('Timeout')) {
        console.log('⏰ Timeout detectado - definindo usuário mínimo');
        setUser({
          id: userId,
          name: 'Usuário',
          email: '',
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          currentLevelXP: 0,
          streak: 0,
          achievements: [],
          moods: []
        });
        return;
      }
      
      // For other errors, sign out user
      setUser(null);
      setIsAuthenticated(false);
      await supabase.auth.signOut();
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
    updateMood,
    unlockAchievement,
    updateStreak,
    updateGameProgress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
