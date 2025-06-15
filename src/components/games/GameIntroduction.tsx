
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, Brain, Zap, Clock, Star } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

interface GameStats {
  currentLevel: string;
  nextLevel: string;
  objective: string;
  bestScore: number;
  icon: React.ReactNode;
}

interface GameIntroductionProps {
  gameId: string;
  title: string;
  subtitle: string;
  colorScheme: {
    primary: string;
    secondary: string;
    gradient: string;
    background: string;
  };
  stats: GameStats;
  howToPlay: string[];
  onPlay: () => void;
  onBack: () => void;
}

const GameIntroduction: React.FC<GameIntroductionProps> = ({
  gameId,
  title,
  subtitle,
  colorScheme,
  stats,
  howToPlay,
  onPlay,
  onBack
}) => {
  const [bestScore, setBestScore] = useState(stats.bestScore);
  const { playGameSound } = useAudio();
  const { user } = useUser();

  useEffect(() => {
    const saved = localStorage.getItem(`${gameId}-best`);
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, [gameId]);

  const handlePlay = () => {
    playGameSound('click');
    onPlay();
  };

  const handleBack = () => {
    playGameSound('click');
    onBack();
  };

  return (
    <div className={`min-h-screen ${colorScheme.background} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 text-9xl text-white/20">
          {stats.icon}
        </div>
        <div className="absolute bottom-20 left-10 text-6xl text-white/10">
          <Brain />
        </div>
      </div>

      <div className="relative z-10 p-4 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-white text-lg font-medium">19:18</div>
        </div>

        {/* Game Title */}
        <div className="text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-xl opacity-90">{subtitle}</p>
        </div>

        {/* Game Pattern/Icon */}
        <div className="flex justify-end mb-8">
          <div className="text-8xl text-white/30">
            {stats.icon}
          </div>
        </div>

        {/* Player Stats Card */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {/* Current Level */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Classificação Atual</p>
                <p className="text-xl font-bold text-gray-800">{stats.currentLevel}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Próximo Nível</p>
                <p className="text-xl font-bold text-gray-400">{stats.nextLevel}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${colorScheme.primary} rounded-full flex items-center justify-center text-white`}>
                <Star className="h-6 w-6" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className={`h-full ${colorScheme.primary} rounded-full w-1/3`} />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-gray-400" />
              </div>
            </div>

            {/* Objective */}
            <div>
              <p className="text-gray-500 text-sm mb-2">Objetivo 0/1</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium">{stats.objective}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Score Card */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colorScheme.primary} rounded-full flex items-center justify-center`}>
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Melhor Pontuação</p>
                  <p className="text-2xl font-bold text-gray-800">{bestScore}</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Play */}
        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-white font-semibold">Como Jogar</h3>
            </div>
            <div className="space-y-2">
              {howToPlay.map((instruction, index) => (
                <p key={index} className="text-white/90 text-sm">
                  • {instruction}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Help Section */}
        <div className="text-white">
          <p className="text-lg font-medium mb-4">Ajuda você a treinar</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm">Raciocínio</p>
              <p className="text-sm">Quantitativo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm">Planejamento</p>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <Button
          onClick={handlePlay}
          className="w-full h-14 bg-white text-gray-800 hover:bg-gray-100 rounded-full text-lg font-semibold"
        >
          Jogar
        </Button>
      </div>
    </div>
  );
};

export default GameIntroduction;
