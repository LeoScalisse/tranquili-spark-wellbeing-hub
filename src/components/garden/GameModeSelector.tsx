
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameMode } from '@/types/botanicalGarden';
import { Flower, Music, Wind } from 'lucide-react';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  const modes = [
    {
      id: 'free' as GameMode,
      name: 'Modo Livre',
      description: 'Experimentação sem metas',
      icon: Flower,
      color: 'green'
    },
    {
      id: 'harmony' as GameMode,
      name: 'Modo Harmonia',
      description: 'Criação de sequências harmoniosas',
      icon: Music,
      color: 'blue'
    },
    {
      id: 'flow' as GameMode,
      name: 'Modo Flow',
      description: 'Composição musical fluida',
      icon: Wind,
      color: 'purple'
    }
  ];

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Modos de Jogo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            
            return (
              <Button
                key={mode.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => onModeChange(mode.id)}
                className={`flex flex-col items-center p-3 h-auto ${
                  isActive 
                    ? `bg-${mode.color}-500 hover:bg-${mode.color}-600 text-white` 
                    : `hover:bg-${mode.color}-50 border-${mode.color}-200`
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{mode.name}</span>
                <span className="text-xs opacity-75 text-center mt-1">
                  {mode.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameModeSelector;
