
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Flashcard } from '@/services/claudeService';

interface FlashcardCardProps {
  flashcard: Flashcard;
  flipped: boolean;
  animating: boolean;
  onFlip: () => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  flashcard,
  flipped,
  animating,
  onFlip
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative mb-8" style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full h-80 md:h-96 transition-all duration-700 cursor-pointer ${
          flipped ? 'rotate-x-180' : ''
        } ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <Card 
          className="absolute inset-0 glassmorphism border-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardContent className="h-full flex flex-col items-center justify-center p-6 md:p-8">
            <h2 className="text-2xl md:text-4xl font-medium text-center mb-4">
              {flashcard.front}
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
              {flashcard.back}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardCard;
