
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gamepad2, Brain, Puzzle, Clock, Trophy } from 'lucide-react';
import ColorConfusionGame from '@/components/games/ColorConfusionGame';
import MemoryFragmentsGame from '@/components/games/MemoryFragmentsGame';
import TrainingObjectives from '@/components/games/TrainingObjectives';
import GameAudioWrapper from '@/components/GameAudioWrapper';
import { useState, useEffect } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estimatedTime: string;
  benefits: string[];
  categories: string[];
}

const games: Game[] = [
  {
    id: 'color-confusion',
    title: 'Cor ou Confusão?',
    description: 'Baseado no Efeito Stroop. Identifique se o significado da palavra corresponde à cor apresentada.',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'Médio',
    estimatedTime: '3-5 min',
    benefits: ['Concentração', 'Atenção', 'Controle cognitivo'],
    categories: ['attention', 'inhibition', 'processing']
  },
  {
    id: 'memory-fragments',
    title: 'Fragmentos da Tranquilidade',
    description: 'Jogo de memória onde você combina fragmentos de texto para formar histórias relaxantes.',
    icon: <Puzzle className="h-8 w-8" />,
    difficulty: 'Fácil',
    estimatedTime: '5-10 min',
    benefits: ['Memória', 'Relaxamento', 'Criatividade'],
    categories: ['memory', 'working-memory', 'flexibility']
  }
];

const TranquiliGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
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
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    playGameSound('click');
    setSelectedGame(null);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('tranquili-games-onboarding');
    localStorage.removeItem('tranquili-games-categories');
    setSelectedCategories([]);
    setShowOnboarding(true);
    setFilteredGames(games);
    playGameSound('click');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500';
      case 'Médio': return 'bg-yellow-500';
      case 'Difícil': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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

            <Button
              variant="outline"
              size="sm"
              onClick={resetOnboarding}
              className="ml-4"
            >
              ⚙️ Revisar Objetivos
            </Button>
          </CardHeader>
        </Card>

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Suas áreas de treino selecionadas:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => (
                  <Badge key={categoryId} variant="secondary" className="text-xs">
                    {categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGames.map((game) => (
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
