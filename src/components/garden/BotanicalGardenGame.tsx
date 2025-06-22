
import { useBotanicalGarden } from '@/hooks/useBotanicalGarden';
import { botanicalElements } from '@/data/botanicalElements';
import GardenGrid from './GardenGrid';
import GardenStats from './GardenStats';
import GameModeSelector from './GameModeSelector';
import MilestoneNotification from './MilestoneNotification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Home } from 'lucide-react';

interface BotanicalGardenGameProps {
  onBack?: () => void;
}

const BotanicalGardenGame: React.FC<BotanicalGardenGameProps> = ({ onBack }) => {
  const {
    gameState,
    plantElement,
    touchPlant,
    changeGameMode,
    resetGarden,
    showMilestone,
    availableElements,
    progressPercentage
  } = useBotanicalGarden();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                  🌸 Jardim Musical Relaxante
                </CardTitle>
                <p className="text-green-600 text-sm mt-1">
                  Plante elementos botânicos e crie melodias harmoniosas
                </p>
              </div>
              <div className="flex gap-2">
                {onBack && (
                  <Button variant="outline" onClick={onBack} size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={resetGarden}
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas */}
        <GardenStats
          stats={gameState.stats}
          progressPercentage={progressPercentage}
          unlockedCount={availableElements.length}
          totalElements={botanicalElements.length}
        />

        {/* Seletor de Modo */}
        <GameModeSelector
          currentMode={gameState.mode}
          onModeChange={changeGameMode}
        />

        {/* Grid do Jardim */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-800 text-center">
              Seu Jardim Musical
            </CardTitle>
            <p className="text-sm text-green-600 text-center">
              Clique nos espaços vazios para plantar, nas plantas para ouvir sua melodia
            </p>
          </CardHeader>
          <CardContent>
            <GardenGrid
              grid={gameState.grid}
              onPlantClick={plantElement}
              onTouchPlant={touchPlant}
              className="max-w-4xl mx-auto"
            />
          </CardContent>
        </Card>

        {/* Elementos Disponíveis */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-800">
              Elementos Desbloqueados ({availableElements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {availableElements.map((element) => (
                <div
                  key={element.id}
                  className="aspect-square bg-white rounded-lg border-2 border-green-200 flex items-center justify-center text-xl hover:scale-105 transition-transform cursor-help shadow-sm"
                  title={element.name}
                >
                  {element.icon}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-700">
              💡 <strong>Dica:</strong> Cada planta emite um som único quando tocada. 
              Combine diferentes elementos para criar suas próprias melodias relaxantes!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notificação de Marco */}
      <MilestoneNotification milestoneId={showMilestone} />
    </div>
  );
};

export default BotanicalGardenGame;
