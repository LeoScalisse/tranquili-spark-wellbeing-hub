
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeSync = () => {
  const { user } = useUser();
  const { emit } = useEventSystem();

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Iniciando sincronização em tempo real...');

    // Listener para mudanças no progresso do usuário
    const progressChannel = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📊 Progresso atualizado em tempo real:', payload);
          emit('progress_updated', payload);
        }
      )
      .subscribe();

    // Listener para novas conquistas
    const achievementsChannel = supabase
      .channel('user_achievements_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🏆 Nova conquista em tempo real:', payload);
          emit('achievement_unlocked_realtime', payload);
        }
      )
      .subscribe();

    // Listener para entradas de humor
    const moodChannel = supabase
      .channel('mood_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('😊 Humor atualizado em tempo real:', payload);
          emit('mood_updated_realtime', payload);
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Parando sincronização em tempo real...');
      progressChannel.unsubscribe();
      achievementsChannel.unsubscribe();
      moodChannel.unsubscribe();
    };
  }, [user?.id, emit]);
};
