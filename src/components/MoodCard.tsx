
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AIAdviceModal from './AIAdviceModal';

interface Mood {
  id: string;
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
  { id: 'excited', name: 'Animado', emoji: '🤩', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'angry', name: 'Irritado', emoji: '😠', color: 'text-red-600', bgColor: 'bg-red-100' },
];

const MoodCard = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodRegistered, setMoodRegistered] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const { user, addXP, addMood, updateStreak } = useUser();
  const { playMoodSound, playSuccessSound } = useAudio();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    playMoodSound(mood.id);
  };

  const handleRegisterMood = () => {
    if (!selectedMood || !user) return;

    const today = new Date().toDateString();
    
    // Check if mood already registered today
    const todayMood = user.moods.find(m => m.date === today);
    if (todayMood) {
      toast.error('Você já registrou seu humor hoje!');
      return;
    }

    const moodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.name,
      emoji: selectedMood.emoji,
      color: selectedMood.color,
      date: today,
      timestamp: Date.now()
    };

    addMood(moodEntry);
    addXP(10);
    updateStreak();
    setMoodRegistered(true);
    playSuccessSound();
    
    toast.success('Humor registrado! +10 XP', {
      icon: selectedMood.emoji,
    });
  };

  const handleGetAdvice = () => {
    setShowAdviceModal(true);
  };

  const getTodayMood = () => {
    if (!user) return null;
    const today = new Date().toDateString();
    return user.moods.find(m => m.date === today);
  };

  const todayMood = getTodayMood();

  return (
    <>
      <Card className="glassmorphism animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            😊 Como você está se sentindo?
          </CardTitle>
          <CardDescription>
            Registre seu humor diário e ganhe XP para subir de nível!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {todayMood ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{todayMood.emoji}</div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Hoje você está: {todayMood.mood}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Humor já registrado hoje! Volte amanhã para continuar sua sequência.
              </p>
              <Button 
                onClick={handleGetAdvice}
                className="mt-4"
                variant="outline"
              >
                💡 Receber Conselho da Tranquilinha
              </Button>
            </div>
          ) : (
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
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handleRegisterMood}
                      className="w-full"
                      size="lg"
                    >
                      ✨ Registrar Humor (+10 XP)
                    </Button>
                    
                    {moodRegistered && (
                      <Button 
                        onClick={handleGetAdvice}
                        variant="outline"
                        className="w-full"
                      >
                        💡 Receber Conselho da Tranquilinha
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AIAdviceModal
        isOpen={showAdviceModal}
        onClose={() => setShowAdviceModal(false)}
        mood={selectedMood || (todayMood ? {
          id: 'today',
          name: todayMood.mood,
          emoji: todayMood.emoji,
          color: todayMood.color,
          bgColor: 'bg-gray-100'
        } : null)}
      />
    </>
  );
};

export default MoodCard;
