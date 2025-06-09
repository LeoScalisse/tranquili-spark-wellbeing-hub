
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Clock, Target, Zap } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

interface ColorConfusionGameProps {
  onBack: () => void;
}

interface GameRound {
  topWord: string;
  bottomWord: string;
  bottomColor: string;
  correctAnswer: boolean;
}

const colors = [
  { name: 'VERMELHO', color: 'text-red-500', value: 'red' },
  { name: 'AZUL', color: 'text-blue-500', value: 'blue' },
  { name: 'VERDE', color: 'text-green-500', value: 'green' },
  { name: 'AMARELO', color: 'text-yellow-500', value: 'yellow' },
  { name: 'ROXO', color: 'text-purple-500', value: 'purple' },
  { name: 'LARANJA', color: 'text-orange-500', value: 'orange' },
  { name: 'ROSA', color: 'text-pink-500', value: 'pink' }
];

const ColorConfusionGame: React.FC<ColorConfusionGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalRounds] = useState(10);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const { playGameSound, playSuccessSound } = useAudio();
  const { addXP } = useUser();

  useEffect(() => {
    const saved = localStorage.getItem('color-confusion-best');
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const generateRound = (): GameRound => {
    const topColor = colors[Math.floor(Math.random() * colors.length)];
    const bottomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      topWord: topColor.name,
      bottomWord: bottomColor.name,
      bottomColor: bottomColor.color,
      correctAnswer: topColor.value === bottomColor.value
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(0);
    setStreak(0);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20);
    nextRound();
  };

  const nextRound = () => {
    if (round < totalRounds) {
      setCurrentRound(generateRound());
      setRound(round + 1);
    } else {
      endGame();
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    if (!currentRound) return;

    const correct = userAnswer === currentRound.correctAnswer;
    
    if (correct) {
      const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      setScore(score + points);
      setStreak(streak + 1);
      playGameSound('correct');
    } else {
      setStreak(0);
      playGameSound('incorrect');
    }

    setTimeout(() => {
      nextRound();
    }, 500);
  };

  const endGame = () => {
    setGameState('finished');
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('color-confusion-best', score.toString());
      playSuccessSound();
    }
    
    const xpEarned = Math.floor(score * 2);
    if (xpEarned > 0) {
      addXP(xpEarned);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentRound(null);
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
                  🧠 Cor ou Confusão?
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Teste sua concentração com o Efeito Stroop
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Como Jogar</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Você verá uma palavra no topo e outra palavra colorida embaixo. 
                  Sua missão é identificar se a <strong>cor da palavra de baixo</strong> corresponde 
                  ao <strong>significado da palavra de cima</strong>.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Selecione a Dificuldade:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level)}
                      className="glassmorphism"
                    >
                      {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                    </Button>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Fácil:</strong> 45 segundos, +1 ponto por acerto</p>
                  <p>• <strong>Médio:</strong> 30 segundos, +2 pontos por acerto</p>
                  <p>• <strong>Difícil:</strong> 20 segundos, +3 pontos por acerto</p>
                </div>
              </div>
              
              {bestScore > 0 && (
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm">
                    🏆 Melhor Pontuação: <strong>{bestScore}</strong>
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
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {score} pontos
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeLeft}s
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {streak} seguidas
            </Badge>
          </div>

          <Card className="glassmorphism">
            <CardContent className="p-8 text-center space-y-8">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Rodada {round}/{totalRounds}
                </p>
                <h2 className="text-lg font-semibold mb-6">
                  Cor ou Confusão?
                </h2>
                
                <div className="flex justify-end mb-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    Iniciante
                  </Button>
                </div>
              </div>
              
              {currentRound && (
                <div className="space-y-8">
                  {/* Palavra de cima (em preto) */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="text-5xl font-bold text-foreground">
                      {currentRound.topWord}
                    </div>
                  </div>
                  
                  {/* Palavra de baixo (colorida) */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className={`text-5xl font-bold ${currentRound.bottomColor}`}>
                      {currentRound.bottomWord}
                    </div>
                  </div>
                  
                  {/* Botões de resposta */}
                  <div className="flex justify-center gap-8">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-200 hover:scale-110"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-200 hover:scale-110"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Pontos: <strong>{score}</strong> | Tempo: <strong>{timeLeft}s</strong> | Sequência: <strong>{streak}</strong> 🔥
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
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto">
          <Card className="glassmorphism">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl mb-4">
                {score > bestScore ? '🏆' : score >= totalRounds * 2 ? '🎉' : '👏'}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {score > bestScore ? 'Novo Recorde!' : 'Jogo Finalizado!'}
                </h2>
                <p className="text-lg">
                  Você fez <strong>{score}</strong> pontos
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p>🎯 Acertos: {score}/{totalRounds}</p>
                <p>🏆 Melhor pontuação: {bestScore}</p>
                {score > 0 && (
                  <p>✨ XP ganho: +{Math.floor(score * 2)}</p>
                )}
              </div>
              
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default ColorConfusionGame;
