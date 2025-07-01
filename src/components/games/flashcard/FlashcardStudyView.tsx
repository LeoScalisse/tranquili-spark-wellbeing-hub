
import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Flashcard } from '@/services/claudeService';
import FlashcardCard from './FlashcardCard';

interface FlashcardStudyViewProps {
  flashcards: Flashcard[];
  currentIndex: number;
  flipped: boolean;
  animating: boolean;
  studyStats: { cardsStudied: number; timeSpent: number };
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinishStudy: () => void;
  onCreateNew: () => void;
}

const FlashcardStudyView: React.FC<FlashcardStudyViewProps> = ({
  flashcards,
  currentIndex,
  flipped,
  animating,
  studyStats,
  onFlip,
  onNext,
  onPrevious,
  onFinishStudy,
  onCreateNew
}) => {
  const isMobile = useIsMobile();
  const currentCard = flashcards[currentIndex];

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') onPrevious();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      onFlip();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, flashcards.length, flipped, animating]);

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
        <FlashcardCard
          flashcard={currentCard}
          flipped={flipped}
          animating={animating}
          onFlip={onFlip}
        />
        
        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
            {!isMobile && <span className="ml-2">Anterior</span>}
          </Button>
          
          <Button
            onClick={onNext}
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
              onClick={onFinishStudy}
              className="bg-green-600 hover:bg-green-700"
            >
              ✅ Finalizar Estudo
            </Button>
          )}
          
          <Button
            onClick={onCreateNew}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            📝 Criar Novos Cartões
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudyView;
