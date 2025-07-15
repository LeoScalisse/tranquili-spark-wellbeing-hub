
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserActions } from '@/hooks/useUserActions';
import { calculateLevelFromXP } from '@/utils/xpSystem';

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
  const [isLoading, setIsLoading] = useState(true);

  const { login, register } = useAuth(setUser, setIsAuthenticated);
  const { addXP, addMood, unlockAchievement, updateStreak, updateGameProgress, logout } = useUserActions(
    user,
    setUser,
    setIsAuthenticated
  );

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        
        // Timeout reduzido para 5 segundos
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na sessão')), 5000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && isMounted) {
          console.log('👤 Usuário encontrado na sessão:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('❌ Nenhuma sessão ativa encontrada');
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        
        // Retry lógico para problemas de rede
        if (retryCount < maxRetries && error.message?.includes('Timeout')) {
          retryCount++;
          console.log(`🔄 Tentativa ${retryCount}/${maxRetries} de reconexão...`);
          setTimeout(initializeAuth, 2000 * retryCount);
          return;
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Mudança de estado de auth:', event);
        
        if (event === 'SIGNED_IN' && session?.user && isMounted) {
          console.log('✅ Usuário logado:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT' && isMounted) {
          console.log('🚪 Usuário deslogado');
          setUser(null);
          setIsAuthenticated(false);
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('📊 Buscando perfil do usuário:', userId);
      
      // Buscar dados com timeout otimizado
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const progressPromise = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      const achievementsPromise = supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      const moodsPromise = supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Timeout reduzido para 7 segundos
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na busca de dados')), 7000)
      );

      const [profileResult, progressResult, achievementsResult, moodsResult] = await Promise.race([
        Promise.all([profilePromise, progressPromise, achievementsPromise, moodsPromise]),
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

      if (progressError) {
        console.error('❌ Erro ao buscar progresso:', progressError);
        // Se não encontrar progresso, criar um novo
        if (progressError.code === 'PGRST116') {
          console.log('📝 Criando novo progresso para o usuário');
          const { error: insertError } = await supabase
            .from('user_progress')
            .insert({ user_id: userId, level: 1, xp: 0, streak: 0 });
          
          if (insertError) {
            console.error('❌ Erro ao criar progresso:', insertError);
            throw insertError;
          }
          
          // Tentar buscar novamente com timeout
          const newProgressPromise = supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          const { data: newProgress, error: newProgressError } = await Promise.race([
            newProgressPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ]) as any;
            
          if (newProgressError) {
            throw newProgressError;
          }
          
          progress = newProgress;
        } else {
          throw progressError;
        }
      }

      if (profile && progress) {
        // Usar o novo sistema de XP progressivo
        const { level, currentLevelXP, xpToNextLevel } = calculateLevelFromXP(progress.xp || 0);
        
        const userData: User = {
          id: profile.id,
          name: profile.name || 'Usuário',
          email: profile.email || '',
          level,
          xp: progress.xp || 0,
          xpToNextLevel,
          currentLevelXP,
          streak: progress.streak || 0,
          lastMoodDate: progress.last_mood_date,
          achievements: achievements?.map(a => a.achievement_id) || [],
          moods: moods?.map(mood => ({
            id: mood.id,
            mood: mood.mood,
            emoji: mood.emoji,
            color: mood.color,
            date: mood.date,
            timestamp: mood.timestamp
          })) || []
        };

        console.log('✅ Dados do usuário carregados:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Profile ou progress não encontrados');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil do usuário:', error);
      
      // Para erros de timeout, não fazer logout automático
      if (error instanceof Error && error.message.includes('Timeout')) {
        console.log('⏰ Timeout detectado - mantendo sessão parcial');
        // Definir um usuário mínimo para continuar funcionando
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
        setIsAuthenticated(true);
        return;
      }
      
      // Para outros erros, limpar a sessão
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
    unlockAchievement,
    updateStreak,
    updateGameProgress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
