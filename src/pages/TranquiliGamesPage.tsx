
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gamepad2, Brain, Puzzle, Clock, Trophy, Zap } from 'lucide-react';
import ColorConfusionGame from '@/components/games/ColorConfusionGame';
import MemoryFragmentsGame from '@/components/games/MemoryFragmentsGame';
import TranquiliRunGame from '@/components/games/TranquiliRunGame';
import GameAudioWrapper from '@/components/GameAudioWrapper';
import { useState } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estimatedTime: string;
  benefits: string[];
}

const games: Game[] = [
  {
    id: 'tranquili-run',
    title: 'Tranquili Run+',
    description: 'Runner infinito relaxante com Tranquilinho. Corra por paisagens zen coletando calma e evitando estresse.',
    icon: <Zap className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '5-15 min',
    benefits: ['Reflexos', 'Concentração', 'Relaxamento', 'Diversão zen']
  },
  {
    id: 'color-confusion',
    title: 'Cor ou Confusão?',
    description: 'Baseado no Efeito Stroop. Identifique se o significado da palavra corresponde à cor apresentada.',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'Médio',
    estimatedTime: '3-5 min',
    benefits: ['Concentração', 'Atenção', 'Controle cognitivo']
  },
  {
    id: 'memory-fragments',
    title: 'Fragmentos da Tranquilidade',
    description: 'Jogo de memória onde você combina fragmentos de texto para formar histórias relaxantes.',
    icon: <Puzzle className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '5-10 min',
    benefits: ['Memória', 'Relaxamento', 'Criatividade']
  }
];

const TranquiliGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { playGameSound } = useAudio();
  const navigate = useNavigate();

  const handleGameSelect = (gameId: string) => {
    playGameSound('click');
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    playGameSound('click');
    setSelectedGame(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500';
      case 'Médio': return 'bg-yellow-500';
      case 'Difícil': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (selectedGame === 'tranquili-run') {
    return (
      <GameAudioWrapper gameType="runner">
        <TranquiliRunGame onBack={handleBackToMenu} />
      </GameAudioWrapper>
    );
  }

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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                playGameSound('click');
                navigate('/');
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                TranquiliGames
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Mini-jogos relaxantes para exercitar sua mente
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id}
              className="glassmorphism hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleGameSelect(game.id)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-accent mx-auto w-fit mb-4">
                    {game.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDifficultyColor(game.difficulty)} text-white border-0`}
                  >
                    {game.difficulty}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {game.estimatedTime}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Benefícios:</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  🎮 Jogar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Sobre os TranquiliGames
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">🧠 Benefícios Cognitivos</h4>
                <p className="leading-relaxed">
                  Nossos jogos são projetados para exercitar diferentes aspectos da mente: 
                  concentração, memória, atenção e controle cognitivo, sempre de forma relaxante.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">😌 Foco no Bem-estar</h4>
                <p className="leading-relaxed">
                  Diferente de jogos tradicionais, os TranquiliGames priorizam o relaxamento 
                  e a redução do stress, criando uma experiência divertiva e terapêutica.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-accent/20">
              <h4 className="font-medium mb-2">💡 Dica de Uso</h4>
              <p className="text-sm">
                Para obter o máximo benefício, jogue por alguns minutos quando se sentir 
                estressado ou ansioso. Os jogos podem ajudar a redirecionar sua atenção 
                e promover um estado mental mais calmo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranquiliGamesPage;
