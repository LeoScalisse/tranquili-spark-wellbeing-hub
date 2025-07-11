
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit2, Check, X } from 'lucide-react';
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

const MoodCard = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const { user, addXP, addMood, updateMood, updateStreak } = useUser();
  const { playMoodSound, playMoodConfirmation } = useAudio();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    playMoodSound(mood.id);
  };

  const handleRegisterMood = async () => {
    if (!selectedMood || !user) return;

    const today = new Date().toDateString();
    
    // Check if mood already registered today and not editing
    const todayMood = user.moods.find(m => m.date === today);
    if (todayMood && !isEditing) {
      toast.error('Você já registrou seu humor hoje!');
      return;
    }

    const moodEntry = {
      id: isEditing ? todayMood!.id : Date.now().toString(),
      mood: selectedMood.name,
      emoji: selectedMood.emoji,
      color: selectedMood.color,
      date: today,
      timestamp: Date.now()
    };

    try {
      if (isEditing) {
        await updateMood(moodEntry);
        toast.success('Humor corrigido com sucesso! ✨', {
          icon: selectedMood.emoji,
        });
      } else {
        await addMood(moodEntry);
        addXP(10);
        updateStreak();
        toast.success('Humor registrado! +10 XP', {
          icon: selectedMood.emoji,
        });
      }
      
      setIsEditing(false);
      setSelectedMood(null);
      playMoodConfirmation();
    } catch (error) {
      toast.error('Erro ao registrar humor. Tente novamente.');
      console.error('Error registering mood:', error);
    }
  };

  const handleEditMood = () => {
    const todayMood = getTodayMood();
    if (todayMood) {
      const currentMood = moods.find(m => m.name === todayMood.mood);
      setSelectedMood(currentMood || null);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMood(null);
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
  const canRegisterToday = !todayMood || isEditing;

  return (
    <>
      <Card className="glassmorphism animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            😊 Como você está se sentindo?
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Corrija seu humor de hoje'
              : 'Registre seu humor diário e ganhe XP para subir de nível!'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {todayMood && !isEditing ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{todayMood.emoji}</div>
              <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                Hoje você está: {todayMood.mood}
              </Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Humor já registrado hoje! Volte amanhã para continuar sua sequência.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleEditMood}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Corrigir Humor
                </Button>
                <Button 
                  onClick={handleGetAdvice}
                  variant="outline"
                >
                  💡 Receber Conselho da Tranquilinha
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Edit2 className="h-4 w-4" />
                    <span className="font-medium">Modo de Correção</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Selecione o humor correto para hoje. Você poderá fazer isso apenas uma vez.
                  </p>
                </div>
              )}

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
                  
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={handleRegisterMood}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Check className="h-4 w-4" />
                      {isEditing ? 'Corrigir Humor' : '✨ Registrar Humor (+10 XP)'}
                    </Button>
                    
                    {isEditing && (
                      <Button 
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
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

export default MoodCard;
