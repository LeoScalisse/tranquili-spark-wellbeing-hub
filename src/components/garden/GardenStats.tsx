
import { GameStats } from '@/types/botanicalGarden';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flower, Music, Clock, Leaf } from 'lucide-react';

interface GardenStatsProps {
  stats: GameStats;
  progressPercentage: number;
  unlockedCount: number;
  totalElements: number;
}

const GardenStats: React.FC<GardenStatsProps> = ({
  stats,
  progressPercentage,
  unlockedCount,
  totalElements
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Progresso Principal */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Progresso do Jardim</span>
              <span className="text-sm text-green-600">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas em Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="bg-white border-pink-200">
          <CardContent className="p-3 text-center">
            <Flower className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <div className="text-lg font-bold text-pink-700">{stats.plantsPlanted}</div>
            <div className="text-xs text-pink-600">Plantas</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200">
          <CardContent className="p-3 text-center">
            <Music className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-lg font-bold text-purple-700">{stats.melodiesCreated}</div>
            <div className="text-xs text-purple-600">Melodias</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-blue-200">
          <CardContent className="p-3 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold text-blue-700">{formatTime(stats.timeSpent)}</div>
            <div className="text-xs text-blue-600">Relaxamento</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-200">
          <CardContent className="p-3 text-center">
            <Leaf className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold text-green-700">{unlockedCount}/{totalElements}</div>
            <div className="text-xs text-green-600">Desbloqueados</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GardenStats;
