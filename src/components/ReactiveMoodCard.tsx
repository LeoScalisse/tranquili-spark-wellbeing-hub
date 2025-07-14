
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { useEventSystem } from '@/contexts/EventSystemContext';
import { useMoodScheduler } from '@/hooks/useMoodScheduler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import AIAdviceModal from './AIAdviceModal';

interface Mood {
  id: 'happy' | 'sad' | 'calm' | 'anxious' | 'angry' | 'thoughtful';
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const moods: Mood[] = [
  { id: 'happy', name: 'Feliz', emoji: '😊', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { id: 'sad', name: 'Triste', emoji: '😢', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'calm', name: 'Calmo', emoji: '😌', color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'anxious', name: 'Ansioso', emoji: '😰', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { id: 'angry', name: 'Irritado', emoji: '😠', color: 'text-red-600', bgColor: 'bg-red-100' },
  { id: 'thoughtful', name: 'Pensativo', emoji: '🤔', color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

const ReactiveMoodCard = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const { user, addXP, addMood, updateStreak } = useUser();
  const { playMoodSound, playMoodConfirmation } = useAudio();
  const { emit } = useEventSystem();
  const { canRegisterMood, timeUntilNextUnlock, formatTimeUntilUnlock } = useMoodScheduler();

  const handleMoodSelect = (mood: Mood) => {
    if (!canRegisterMood) {
      toast.error('Você já registrou seu humor hoje. Volte amanhã!');
      return;
    }
    
    setSelectedMood(mood);
    playMoodSound(mood.id);
  };

  const handleRegisterMood = async () => {
    if (!selectedMood || !user || !canRegisterMood) return;

    const today = new Date().toDateString();
    
    const moodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.name,
      emoji: selectedMood.emoji,
      color: selectedMood.color,
      date: today,
      timestamp: Date.now()
    };

    try {
      await addMood(moodEntry);
      await addXP(10);
      await updateStreak();
      
      // Salvar data do último registro
      localStorage.setItem('last_mood_date', today);
      
      playMoodConfirmation();
      
      // Emitir eventos reativos
      emit('mood_registered', { mood: moodEntry, xpGained: 10 });
      emit('xp_gained', { amount: 10, source: 'mood_registration' });
      emit('streak_updated', { newStreak: (user.streak || 0) + 1 });
      
      toast.success('Humor registrado! +10 XP', {
        icon: selectedMood.emoji,
      });
      
      setSelectedMood(null);
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast.error('Erro ao registrar humor. Tente novamente.');
    }
  };

  const getTodayMood = () => {
    if (!user) return null;
    const today = new Date().toDateString();
    return user.moods.find(m => m.date === today);
  };

  const todayMood = getTodayMood();

  // Calcular progresso do tempo até próximo desbloqueio
  const timeProgress = 100 - (timeUntilNextUnlock / (24 * 60 * 60 * 1000)) * 100;

  return (
    <>
      <Card className="glassmorphism animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            😊 Como você está se sentindo?
            {!canRegisterMood && (
              <Badge variant="secondary" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Bloqueado
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {canRegisterMood 
              ? "Registre seu humor diário e ganhe XP para subir de nível!"
              : `Próximo registro disponível em: ${formatTimeUntilUnlock()}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!canRegisterMood && !todayMood && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Tempo até próximo registro</span>
                <span>{formatTimeUntilUnlock()}</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                O sistema de humor é desbloqueado automaticamente a cada novo dia
              </p>
            </div>
          )}

          {todayMood ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{todayMood.emoji}</div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Hoje você está: {todayMood.mood}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Humor já registrado hoje! Volte amanhã para continuar sua sequência.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Próximo registro em:</span>
                  <span className="font-mono">{formatTimeUntilUnlock()}</span>
                </div>
                <Progress value={timeProgress} className="h-2" />
              </div>
              <Button 
                onClick={() => setShowAdviceModal(true)}
                className="mt-4"
                variant="outline"
              >
                💡 Receber Conselho da Tranquilinha
              </Button>
            </div>
          ) : canRegisterMood ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    className={`
                      mood-option p-4 rounded-lg text-center transition-all duration-300
                      ${mood.bgColor} ${mood.color}
                      ${selectedMood?.id === mood.id ? 'selected ring-2 ring-accent' : ''}
                      hover:scale-105 hover:shadow-lg
                    `}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <p className="text-sm font-medium">{mood.name}</p>
                  </button>
                ))}
              </div>
              
              {selectedMood && (
                <div className="text-center space-y-4 animate-fade-in">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    Selecionado: {selectedMood.emoji} {selectedMood.name}
                  </Badge>
                  
                  <Button 
                    onClick={handleRegisterMood}
                    className="w-full"
                    size="lg"
                  >
                    ✨ Registrar Humor (+10 XP)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold mb-2">Sistema Bloqueado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Aguarde até amanhã para registrar seu próximo humor
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeUntilUnlock()}</span>
                </div>
                <Progress value={timeProgress} className="h-2 max-w-xs mx-auto" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AIAdviceModal
        isOpen={showAdviceModal}
        onClose={() => setShowAdviceModal(false)}
        mood={selectedMood || (todayMood ? {
          id: 'thoughtful' as const,
          name: todayMood.mood,
          emoji: todayMood.emoji,
          color: todayMood.color,
          bgColor: 'bg-gray-100'
        } : null)}
      />
    </>
  );
};

export default ReactiveMoodCard;
