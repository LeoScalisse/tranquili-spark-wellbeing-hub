
import GamesHeader from '@/components/games/GamesHeader';
import SelectedCategoriesDisplay from '@/components/games/SelectedCategoriesDisplay';
import GamesList from '@/components/games/GamesList';
import GamesInfo from '@/components/games/GamesInfo';

interface GamesMenuProps {
  selectedCategories: string[];
  filteredGames: any[];
  onGameSelect: (gameId: string) => void;
  onBackClick: () => void;
  onResetOnboarding: () => void;
}

const GamesMenu: React.FC<GamesMenuProps> = ({
  selectedCategories,
  filteredGames,
  onGameSelect,
  onBackClick,
  onResetOnboarding
}) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GamesHeader 
          onBackClick={onBackClick}
          onResetOnboarding={onResetOnboarding}
        />

        <SelectedCategoriesDisplay selectedCategories={selectedCategories} />

        <GamesList 
          filteredGames={filteredGames}
          onGameSelect={onGameSelect}
        />

        <GamesInfo />
      </div>
    </div>
  );
};

export default GamesMenu;
