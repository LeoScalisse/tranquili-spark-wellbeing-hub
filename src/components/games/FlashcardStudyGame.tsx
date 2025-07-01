import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { claudeService, type Flashcard } from '@/services/claudeService';

interface FlashcardStudyGameProps {
  onBack: () => void;
}

const FlashcardStudyGame: React.FC<FlashcardStudyGameProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'create' | 'loading' | 'study'>('create');
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<'describe' | 'paste'>('describe');
  const [animating, setAnimating] = useState(false);
  const [studyStats, setStudyStats] = useState({ cardsStudied: 0, timeSpent: 0 });
  const [startTime, setStartTime] = useState<number>(0);
  const [error, setError] = useState<string>('');
  
  const { playGameSound, playCardSound } = useAudio();
  const { addXP, updateGameProgress } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (mode === 'study' && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [mode, startTime]);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    
    setMode('loading');
    setError('');
    playGameSound('click');
    
    try {
      console.log('Starting flashcard generation...');
      const generatedFlashcards = await claudeService.generateFlashcards(topic);
      
      console.log('Generated flashcards:', generatedFlashcards);
      
      if (generatedFlashcards && generatedFlashcards.length > 0) {
        setFlashcards(generatedFlashcards);
        setCurrentIndex(0);
        setFlipped(false);
        setMode('study');
        playGameSound('correct');
      } else {
        throw new Error('Nenhum flashcard foi gerado');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setError('Erro ao gerar flashcards. Tente novamente.');
      setMode('create');
      playGameSound('error');
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    playCardSound('flip');
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1 && !animating) {
      setAnimating(true);
      playGameSound('click');
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex + 1);
        setStudyStats(prev => ({ ...prev, cardsStudied: prev.cardsStudied + 1 }));
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      playGameSound('click');
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handleFinishStudy = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const xpGained = Math.min(flashcards.length * 5, 50); // 5 XP por cartão, máximo 50
    
    addXP(xpGained);
    updateGameProgress('flashcardStudy', {
      cardsStudied: studyStats.cardsStudied + 1,
      totalTimeSpent: timeSpent,
      lastStudyDate: new Date().toISOString()
    });
    
    playGameSound('victory');
    setMode('create');
    setTopic('');
    setFlashcards([]);
    setStudyStats({ cardsStudied: 0, timeSpent: 0 });
    setStartTime(0);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (mode === 'study') {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode, currentIndex, flashcards.length, flipped, animating]);

  if (mode === 'create') {
    return (
      <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              onClick={onBack}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              {isMobile && <span className="ml-2">Voltar</span>}
            </Button>
            <h1 className="text-white text-2xl md:text-4xl font-bold flex-1 text-center">
              📚 Cartões de Estudo IA
            </h1>
          </div>
          
          {/* Error Message */}
          {error && (
            <Card className="glassmorphism border-0 mb-6">
              <CardContent className="p-4">
                <p className="text-red-600 text-center">{error}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Tab Selection */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-1 rounded-full inline-flex">
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                  activeTab === 'paste' 
                    ? 'bg-white text-gray-700 shadow-md' 
                    : 'text-white hover:text-white/90'
                }`}
              >
                Colar Texto
              </button>
              <button
                onClick={() => setActiveTab('describe')}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                  activeTab === 'describe' 
                    ? 'bg-white text-gray-700 shadow-md' 
                    : 'text-white hover:text-white/90'
                }`}
              >
                Descrever Tópico
              </button>
            </div>
          </div>
          
          {/* Input Area */}
          <Card className="glassmorphism border-0">
            <CardContent className="p-6 md:p-8">
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={activeTab === 'describe' 
                  ? "Descreva um tópico para gerar cartões de estudo com IA...\n\nEx: História do Brasil\nEx: Fórmulas de matemática básica\nEx: Vocabulário em inglês\nEx: Conceitos de biologia"
                  : "Cole seu texto aqui para gerar flashcards automáticos..."
                }
                className="min-h-[200px] text-base md:text-lg border-0 focus:ring-0 resize-none"
              />
            </CardContent>
          </Card>
          
          <Button
            onClick={generateFlashcards}
            disabled={!topic.trim()}
            className="w-full mt-6 py-4 text-lg font-medium"
            size="lg"
          >
            🤖 Gerar Cartões com IA
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-white text-2xl md:text-3xl font-medium mb-4">
            Claude IA está gerando seus cartões...
          </h2>
          <p className="text-white/80 text-lg">
            Isso pode levar alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'study') {
    const currentCard = flashcards[currentIndex];
    
    return (
      <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="secondary" className="text-sm">
              Cartão {currentIndex + 1} de {flashcards.length}
            </Badge>
            <Badge variant="outline" className="text-white border-white/50">
              {studyStats.cardsStudied} estudados
            </Badge>
          </div>
          
          {/* Flashcard */}
          <div className="relative mb-8" style={{ perspective: '1000px' }}>
            <div
              className={`relative w-full h-80 md:h-96 transition-all duration-700 cursor-pointer ${
                flipped ? 'rotate-x-180' : ''
              } ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
              onClick={handleFlip}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <Card 
                className="absolute inset-0 glassmorphism border-0 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-6 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-medium text-center mb-4">
                    {currentCard.front}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-auto">
                    {isMobile ? 'Toque para virar' : 'Use ↑↓ ou clique para virar'}
                  </p>
                </CardContent>
              </Card>
              
              {/* Back */}
              <Card 
                className="absolute inset-0 glassmorphism border-0 rotate-x-180 backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)'
                }}
              >
                <CardContent className="h-full flex items-center justify-center p-6 md:p-8">
                  <p className="text-lg md:text-xl text-center leading-relaxed">
                    {currentCard.back}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              {!isMobile && <span className="ml-2">Anterior</span>}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              {!isMobile && <span className="mr-2">Próximo</span>}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Actions */}
          <div className="text-center space-y-4">
            {currentIndex === flashcards.length - 1 && (
              <Button
                onClick={handleFinishStudy}
                className="bg-green-600 hover:bg-green-700"
              >
                ✅ Finalizar Estudo
              </Button>
            )}
            
            <Button
              onClick={() => {
                setMode('create');
                setTopic('');
                setFlashcards([]);
              }}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              📝 Criar Novos Cartões
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FlashcardStudyGame;
