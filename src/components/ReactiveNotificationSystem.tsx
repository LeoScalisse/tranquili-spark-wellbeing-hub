
import { useEffect } from 'react';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { useAudio } from '@/contexts/AudioContext';
import { toast } from 'sonner';
import { Trophy, Star, Zap, Target } from 'lucide-react';

const ReactiveNotificationSystem = () => {
  const { subscribe } = useEventSystem();
  const { playSuccessSound, playAchievementSound } = useAudio();

  useEffect(() => {
    console.log('🔔 Sistema de notificações reativas iniciado');

    const unsubscribers = [
      // Notificações de conquistas
      subscribe('achievement_unlocked_realtime', (data) => {
        playAchievementSound?.();
        toast.success('🏆 Nova conquista desbloqueada!', {
          icon: <Trophy className="h-4 w-4" />,
          duration: 5000,
          description: 'Confira suas conquistas para ver o que desbloqueou!'
        });
      }),

      // Notificações de level up
      subscribe('level_up', (data) => {
        const { newLevel } = data || {};
        toast.success(`🎉 Parabéns! Você subiu para o nível ${newLevel}!`, {
          icon: <Star className="h-4 w-4" />,
          duration: 6000,
          description: 'Continue evoluindo na sua jornada de bem-estar!'
        });
      }),

      // Notificações de XP
      subscribe('xp_gained', (data) => {
        const { amount, source } = data || {};
        if (amount >= 50) { // Só mostrar para grandes ganhos de XP
          toast.success(`✨ +${amount} XP`, {
            duration: 2000
          });
        }
      }),

      // Notificações de sequência
      subscribe('streak_updated', (data) => {
        const { newStreak } = data || {};
        if (newStreak && newStreak % 7 === 0) { // A cada 7 dias
          toast.success(`🔥 ${newStreak} dias consecutivos!`, {
            icon: <Zap className="h-4 w-4" />,
            duration: 4000,
            description: 'Incrível consistência! Continue assim!'
          });
        }
      }),

      // Notificações de desbloqueio de humor
      subscribe('mood_unlocked', () => {
        playSuccessSound?.();
        toast.success('🌅 Novo dia! Sistema de humor desbloqueado!', {
          icon: <Target className="h-4 w-4" />,
          duration: 5000,
          description: 'Registre como você está se sentindo hoje!'
        });
      }),

      // Notificações de progresso em tempo real
      subscribe('progress_updated', (data) => {
        console.log('📊 Progresso atualizado:', data);
        // Aqui poderia mostrar notificações sutis de sincronização
      }),

      // Notificações de humor registrado
      subscribe('mood_registered', (data) => {
        const { xpGained } = data || {};
        toast.success(`Humor registrado! +${xpGained} XP`, {
          duration: 3000
        });
      }),

      // Notificações de chat iniciado
      subscribe('chat_started', () => {
        toast.success('💬 Primeira conversa iniciada!', {
          duration: 3000,
          description: 'Continue explorando o app para mais conquistas!'
        });
      }),

      // Notificações de mudança de tema
      subscribe('theme_changed', (data) => {
        const { themeName } = data || {};
        toast.success(`🎨 Tema alterado para ${themeName}`, {
          duration: 2000
        });
      })
    ];

    return () => {
      console.log('🔔 Parando sistema de notificações reativas');
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe, playSuccessSound, playAchievementSound]);

  return null; // Componente invisível, apenas lógica
};

export default ReactiveNotificationSystem;
