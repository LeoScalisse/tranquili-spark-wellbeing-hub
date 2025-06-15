
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import ColorConfusionGame from '@/components/games/ColorConfusionGame';
import ColorConfusionIntroduction from '@/components/games/ColorConfusionIntroduction';
import MemoryFragmentsGame from '@/components/games/MemoryFragmentsGame';
import MemoryFragmentsIntroduction from '@/components/games/MemoryFragmentsIntroduction';
import TrainingObjectives from '@/components/games/TrainingObjectives';
import GameAudioWrapper from '@/components/GameAudioWrapper';
import GamesHeader from '@/components/games/GamesHeader';
import SelectedCategoriesDisplay from '@/components/games/SelectedCategoriesDisplay';
import GamesList, { games } from '@/components/games/GamesList';
import GamesInfo from '@/components/games/GamesInfo';
import { useState, useEffect } from 'react';

const TranquiliGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameIntro, setShowGameIntro] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredGames, setFilteredGames] = useState(games);
  const { playGameSound } = useAudio();
  const navigate = useNavigate();

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('tranquili-games-onboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      const savedCategories = localStorage.getItem('tranquili-games-categories');
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        setSelectedCategories(categories);
        filterGamesByCategories(categories);
      }
    }
  }, []);

  const filterGamesByCategories = (categories: string[]) => {
    if (categories.length === 0) {
      setFilteredGames(games);
      return;
    }

    const filtered = games.filter(game => 
      game.categories.some(category => categories.includes(category))
    );
    setFilteredGames(filtered);
  };

  const handleOnboardingComplete = (categories: string[]) => {
    setSelectedCategories(categories);
    setShowOnboarding(false);
    
    // Save to localStorage
    localStorage.setItem('tranquili-games-onboarding', 'true');
    localStorage.setItem('tranquili-games-categories', JSON.stringify(categories));
    
    filterGamesByCategories(categories);
    playGameSound('victory');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('tranquili-games-onboarding', 'true');
    playGameSound('click');
  };

  const handleGameSelect = (gameId: string) => {
    playGameSound('click');
    setShowGameIntro(gameId);
  };

  const handlePlayGame = (gameId: string) => {
    setShowGameIntro(null);
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    playGameSound('click');
    setSelectedGame(null);
    setShowGameIntro(null);
  };

  const handleBackToGameList = () => {
    playGameSound('click');
    setShowGameIntro(null);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('tranquili-games-onboarding');
    localStorage.removeItem('tranquili-games-categories');
    setSelectedCategories([]);
    setShowOnboarding(true);
    setFilteredGames(games);
    playGameSound('click');
  };

  const handleBackClick = () => {
    playGameSound('click');
    navigate('/');
  };

  // Show onboarding
  if (showOnboarding) {
    return (
      <TrainingObjectives
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // Show game introduction
  if (showGameIntro === 'color-confusion') {
    return (
      <ColorConfusionIntroduction
        onPlay={() => handlePlayGame('color-confusion')}
        onBack={handleBackToGameList}
      />
    );
  }

  if (showGameIntro === 'memory-fragments') {
    return (
      <MemoryFragmentsIntroduction
        onPlay={() => handlePlayGame('memory-fragments')}
        onBack={handleBackToGameList}
      />
    );
  }

  // Show selected game
  if (selectedGame === 'color-confusion') {
    return (
      <GameAudioWrapper gameType="color">
        <ColorConfusionGame onBack={handleBackToMenu} />
      </GameAudioWrapper>
    );
  }

  if (selectedGame === 'memory-fragments') {
    return (
      <GameAudioWrapper gameType="memory">
        <MemoryFragmentsGame onBack={handleBackToMenu} />
      </GameAudioWrapper>
    );
  }

  // Show games menu
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GamesHeader 
          onBackClick={handleBackClick}
          onResetOnboarding={resetOnboarding}
        />

        <SelectedCategoriesDisplay selectedCategories={selectedCategories} />

        <GamesList 
          filteredGames={filteredGames}
          onGameSelect={handleGameSelect}
        />

        <GamesInfo />
      </div>
    </div>
  );
};

export default TranquiliGamesPage;
