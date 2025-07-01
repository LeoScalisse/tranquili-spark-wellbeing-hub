
import React from 'react';
import { useFlashcardGame } from '@/hooks/useFlashcardGame';
import FlashcardCreateForm from './flashcard/FlashcardCreateForm';
import FlashcardLoadingScreen from './flashcard/FlashcardLoadingScreen';
import FlashcardStudyView from './flashcard/FlashcardStudyView';

interface FlashcardStudyGameProps {
  onBack: () => void;
}

const FlashcardStudyGame: React.FC<FlashcardStudyGameProps> = ({ onBack }) => {
  const {
    mode,
    topic,
    setTopic,
    flashcards,
    currentIndex,
    flipped,
    activeTab,
    setActiveTab,
    animating,
    studyStats,
    error,
    generateFlashcards,
    handleFlip,
    handleNext,
    handlePrevious,
    handleFinishStudy,
    resetToCreate
  } = useFlashcardGame();

  if (mode === 'create') {
    return (
      <FlashcardCreateForm
        topic={topic}
        setTopic={setTopic}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        error={error}
        onGenerateFlashcards={generateFlashcards}
        onBack={onBack}
      />
    );
  }

  if (mode === 'loading') {
    return <FlashcardLoadingScreen />;
  }

  if (mode === 'study') {
    return (
      <FlashcardStudyView
        flashcards={flashcards}
        currentIndex={currentIndex}
        flipped={flipped}
        animating={animating}
        studyStats={studyStats}
        onFlip={handleFlip}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onFinishStudy={handleFinishStudy}
        onCreateNew={resetToCreate}
      />
    );
  }

  return null;
};

export default FlashcardStudyGame;
