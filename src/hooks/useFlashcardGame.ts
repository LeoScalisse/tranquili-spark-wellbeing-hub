
import { useState, useEffect, useCallback } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';
import { claudeService, type Flashcard } from '@/services/claudeService';

export const useFlashcardGame = () => {
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
      playGameSound('incorrect');
    }
  };

  const handleFlip = useCallback(() => {
    setFlipped(!flipped);
    playCardSound('flip');
  }, [flipped, playCardSound]);

  const handleNext = useCallback(() => {
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
  }, [currentIndex, flashcards.length, animating, playGameSound]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      playGameSound('click');
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  }, [currentIndex, animating, playGameSound]);

  const handleFinishStudy = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const xpGained = Math.min(flashcards.length * 5, 50);
    
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
  }, [startTime, flashcards.length, studyStats.cardsStudied, addXP, updateGameProgress, playGameSound]);

  const resetToCreate = useCallback(() => {
    setMode('create');
    setTopic('');
    setFlashcards([]);
  }, []);

  return {
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
  };
};
