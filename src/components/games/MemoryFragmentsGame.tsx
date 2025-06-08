
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Clock, Target, Sparkles } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

interface MemoryFragmentsGameProps {
  onBack: () => void;
}

interface Story {
  title: string;
  fragments: string[];
  fullStory: string;
}

const stories: Story[] = [
  {
    title: "O Jardim Secreto",
    fragments: [
      "Um jardim escondido", "entre as árvores antigas", "flores coloridas dançam", "ao vento suave", 
      "borboletas voam livremente", "criando um espetáculo", "de paz e harmonia", "onde o tempo para"
    ],
    fullStory: "Um jardim escondido entre as árvores antigas, onde flores coloridas dançam ao vento suave. Borboletas voam livremente, criando um espetáculo de paz e harmonia onde o tempo para."
  },
  {
    title: "Noite Estrelada",
    fragments: [
      "Sob o manto", "da noite serena", "estrelas brilham", "como diamantes", 
      "a lua ilumina", "suavemente a terra", "criando sombras dançantes", "que embalam os sonhos"
    ],
    fullStory: "Sob o manto da noite serena, estrelas brilham como diamantes. A lua ilumina suavemente a terra, criando sombras dançantes que embalam os sonhos."
  },
  {
    title: "Praia Tranquila",
    fragments: [
      "Ondas suaves", "beijam a areia", "dourada e morna", "gaivotas voam", 
      "em círculos preguiçosos", "o sol se põe", "pintando o céu", "de cores suaves"
    ],
    fullStory: "Ondas suaves beijam a areia dourada e morna. Gaivotas voam em círculos preguiçosos enquanto o sol se põe, pintando o céu de cores suaves."
  }
];

const MemoryFragmentsGame: React.FC<MemoryFragmentsGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [shuffledFragments, setShuffledFragments] = useState<string[]>([]);
  const [selectedFragments, setSelectedFragments] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  const { playGameSound, playSuccessSound } = useAudio();
  const { addXP } = useUser();

  useEffect(() => {
    const saved = localStorage.getItem('memory-fragments-best');
    if (saved) {
      setBestTime(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setTimeout(() => {
        setTimeElapsed(timeElapsed + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeElapsed]);

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startGame = () => {
    const story = stories[Math.floor(Math.random() * stories.length)];
    setCurrentStory(story);
    
    // Create pairs of fragments for memory game
    const fragmentPairs = [...story.fragments, ...story.fragments];
    setShuffledFragments(shuffleArray(fragmentPairs));
    
    setGameState('playing');
    setSelectedFragments([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setTimeElapsed(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedCards;
      const firstFragment = shuffledFragments[first];
      const secondFragment = shuffledFragments[second];

      if (firstFragment === secondFragment) {
        // Match found
        setMatchedPairs([...matchedPairs, first, second]);
        setScore(score + 10);
        playGameSound('correct');
        
        // Check if game is complete
        if (matchedPairs.length + 2 === shuffledFragments.length) {
          setTimeout(() => {
            endGame();
          }, 500);
        }
        
        setFlippedCards([]);
      } else {
        // No match
        playGameSound('incorrect');
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const endGame = () => {
    setGameState('finished');
    
    const timeBonus = Math.max(0, 120 - timeElapsed);
    const moveBonus = Math.max(0, 50 - moves);
    const finalScore = score + timeBonus + moveBonus;
    setScore(finalScore);
    
    if (timeElapsed < bestTime || bestTime === 0) {
      setBestTime(timeElapsed);
      localStorage.setItem('memory-fragments-best', timeElapsed.toString());
      playSuccessSound();
    }
    
    // Award XP
    const xpEarned = Math.floor(finalScore / 5);
    if (xpEarned > 0) {
      addXP(xpEarned);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentStory(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glassmorphism">
            <CardHeader className="flex-row items-center space-y-0 pb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  🧩 Fragmentos da Tranquilidade
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Jogo de memória com histórias relaxantes
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Como Jogar</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Encontre os pares de fragmentos de texto iguais. Quando completar todos os pares, 
                  você poderá ler a história completa e relaxante que se forma com eles.
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p>🎯 <strong>Objetivo:</strong> Encontrar todos os pares de fragmentos</p>
                <p>⭐ <strong>Pontuação:</strong> +10 por par + bônus de tempo + bônus de movimentos</p>
                <p>🧘 <strong>Benefício:</strong> Exercita a memória enquanto relaxa com histórias bonitas</p>
              </div>
              
              {bestTime > 0 && (
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm">
                    🏆 Melhor Tempo: <strong>{formatTime(bestTime)}</strong>
                  </p>
                </div>
              )}
              
              <Button onClick={startGame} className="w-full" size="lg">
                🎮 Começar Jogo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {score} pontos
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeElapsed)}
            </Badge>
            
            <Badge variant="outline">
              {moves} movimentos
            </Badge>
          </div>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {currentStory?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Encontre os pares de fragmentos para revelar a história completa
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shuffledFragments.map((fragment, index) => {
                  const isFlipped = flippedCards.includes(index) || matchedPairs.includes(index);
                  const isMatched = matchedPairs.includes(index);
                  
                  return (
                    <Card
                      key={index}
                      className={`
                        h-24 cursor-pointer transition-all duration-300 transform
                        ${isMatched ? 'bg-accent/20 border-accent' : 'glassmorphism hover:scale-105'}
                        ${!isFlipped ? 'hover:bg-secondary/70' : ''}
                      `}
                      onClick={() => handleCardClick(index)}
                    >
                      <CardContent className="p-3 h-full flex items-center justify-center">
                        {isFlipped ? (
                          <p className="text-xs text-center leading-tight">
                            {fragment}
                          </p>
                        ) : (
                          <div className="text-2xl">🌸</div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Pares encontrados: {matchedPairs.length / 2}/{shuffledFragments.length / 2}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glassmorphism">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl mb-4">
                {timeElapsed < bestTime || bestTime === timeElapsed ? '🏆' : '🎉'}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {timeElapsed === bestTime ? 'Novo Recorde!' : 'Parabéns!'}
                </h2>
                <p className="text-lg">
                  Você fez <strong>{score}</strong> pontos
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p>⏱️ Tempo: {formatTime(timeElapsed)}</p>
                <p>🎯 Movimentos: {moves}</p>
                <p>🏆 Melhor tempo: {formatTime(bestTime)}</p>
                {score > 0 && (
                  <p>✨ XP ganho: +{Math.floor(score / 5)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {currentStory?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed italic">
                "{currentStory?.fullStory}"
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Uma pequena história para relaxar sua mente ✨
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Jogar Novamente
            </Button>
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MemoryFragmentsGame;
