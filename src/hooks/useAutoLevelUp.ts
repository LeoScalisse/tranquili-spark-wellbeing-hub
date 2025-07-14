
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { useAudio } from '@/contexts/AudioContext';
import { toast } from 'sonner';

export const useAutoLevelUp = () => {
  const { user } = useUser();
  const { subscribe } = useEventSystem();
  const { playLevelUpSound } = useAudio();
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    // Detectar mudança de nível
    if (previousLevel !== null && user.level > previousLevel) {
      console.log(`🎉 LEVEL UP! ${previousLevel} → ${user.level}`);
      
      // Celebrar subida de nível
      playLevelUpSound?.();
      
      toast.success(`🎉 Parabéns! Você subiu para o nível ${user.level}!`, {
        icon: '⭐',
        duration: 6000,
        description: `Continue registrando seus humores para evoluir ainda mais!`
      });

      // Emitir evento de level up para outros sistemas
      // emit('level_up', { oldLevel: previousLevel, newLevel: user.level });
    }

    setPreviousLevel(user.level);
  }, [user?.level, previousLevel, playLevelUpSound]);

  // Listener para ganho de XP
  useEffect(() => {
    const unsubscribe = subscribe('xp_gained', (data) => {
      if (data?.amount) {
        toast.success(`+${data.amount} XP`, {
          icon: '✨',
          duration: 2000
        });
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    currentLevel: user?.level || 1,
    previousLevel
  };
};
