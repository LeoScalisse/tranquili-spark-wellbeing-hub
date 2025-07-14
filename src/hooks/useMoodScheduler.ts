
import { useState, useEffect, useCallback } from 'react';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { toast } from 'sonner';

interface MoodSchedulerState {
  canRegisterMood: boolean;
  timeUntilNextUnlock: number;
  nextUnlockTime: Date | null;
}

export const useMoodScheduler = () => {
  const { emit } = useEventSystem();
  const [state, setState] = useState<MoodSchedulerState>({
    canRegisterMood: false,
    timeUntilNextUnlock: 0,
    nextUnlockTime: null
  });

  const checkMoodAvailability = useCallback(() => {
    const now = new Date();
    const today = now.toDateString();
    const lastMoodDate = localStorage.getItem('last_mood_date');
    
    const canRegister = lastMoodDate !== today;
    
    if (canRegister && !state.canRegisterMood) {
      console.log('✨ Sistema de humor desbloqueado!');
      emit('mood_unlocked', { date: today });
      toast.success('🌅 Novo dia! Registre como você está se sentindo hoje!', {
        icon: '🌟',
        duration: 5000
      });
    }

    // Calcular próximo desbloqueio (meia-noite do próximo dia)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilUnlock = tomorrow.getTime() - now.getTime();

    setState({
      canRegisterMood: canRegister,
      timeUntilNextUnlock: timeUntilUnlock,
      nextUnlockTime: tomorrow
    });
  }, [state.canRegisterMood, emit]);

  useEffect(() => {
    // Verificar imediatamente
    checkMoodAvailability();

    // Verificar a cada minuto
    const interval = setInterval(checkMoodAvailability, 60000);

    // Verificar especificamente à meia-noite
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0); // 1 segundo após meia-noite

    const timeToMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimeout = setTimeout(() => {
      checkMoodAvailability();
      toast.success('🌅 Novo dia começou! Sistema de humor desbloqueado!', {
        icon: '✨',
        duration: 6000
      });
    }, timeToMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, [checkMoodAvailability]);

  const formatTimeUntilUnlock = () => {
    const hours = Math.floor(state.timeUntilNextUnlock / (1000 * 60 * 60));
    const minutes = Math.floor((state.timeUntilNextUnlock % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return {
    ...state,
    formatTimeUntilUnlock,
    checkMoodAvailability
  };
};
