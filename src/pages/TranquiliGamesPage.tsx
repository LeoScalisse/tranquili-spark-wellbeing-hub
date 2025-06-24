
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import OnboardingManager from '@/components/games/OnboardingManager';
import GameIntroRenderer from '@/components/games/GameIntroRenderer';
import GameRenderer from '@/components/games/GameRenderer';
import GamesMenu from '@/components/games/GamesMenu';
import { games } from '@/components/games/GamesList';
import { useState, useEffect } from 'react';

const TranquiliGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameIntro, setShowGameIntro] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredGames, setFilteredGames] = useState(games);
  const { playGameSound } = useAudio();
  const navigate = useNavigate();

  // Load saved categories on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('tranquili-games-categories');
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      setSelectedCategories(categories);
      filterGamesByCategories(categories);
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

  const handleCategoriesUpdate = (categories: string[]) => {
    setSelectedCategories(categories);
    filterGamesByCategories(categories);
  };

  const handleGameSelect = (gameId: string) => {
    playGameSound('click');
    
    // Para o jardim botânico, ir direto para o jogo sem introdução
    if (gameId === 'botanical-garden') {
      setSelectedGame(gameId);
    } else {
      setShowGameIntro(gameId);
    }
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
    setFilteredGames(games);
    playGameSound('click');
    // Force page reload to show onboarding
    window.location.reload();
  };

  const handleBackClick = () => {
    playGameSound('click');
    navigate('/');
  };

  return (
    <OnboardingManager onComplete={handleCategoriesUpdate}>
      {/* Show game introductions */}
      {showGameIntro && (
        <GameIntroRenderer
          gameIntro={showGameIntro}
          onPlay={handlePlayGame}
          onBack={handleBackToGameList}
        />
      )}

      {/* Show selected games */}
      {selectedGame && (
        <GameRenderer
          selectedGame={selectedGame}
          onBack={handleBackToMenu}
        />
      )}

      {/* Show games menu */}
      {!showGameIntro && !selectedGame && (
        <GamesMenu
          selectedCategories={selectedCategories}
          filteredGames={filteredGames}
          onGameSelect={handleGameSelect}
          onBackClick={handleBackClick}
          onResetOnboarding={resetOnboarding}
        />
      )}
    </OnboardingManager>
  );
};

export default TranquiliGamesPage;
