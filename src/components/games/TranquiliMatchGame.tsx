
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart, Sparkles, Target, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';

// Tipos de peças do jogo
type PieceType = 'calm-bubble' | 'zen-leaf' | 'tea-drop' | 'moon-dream' | 'empty';

interface GamePiece {
  type: PieceType;
  id: string;
  x: number;
  y: number;
  isSelected: boolean;
  isMatched: boolean;
  isSpecial: boolean;
}

interface GameState {
  board: GamePiece[][];
  level: number;
  score: number;
  moves: number;
  maxMoves: number;
  target: number;
  collected: number;
  isZenMode: boolean;
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
}

interface TranquiliMatchGameProps {
  onBack: () => void;
}

const BOARD_SIZE = 8;
const PIECE_TYPES: PieceType[] = ['calm-bubble', 'zen-leaf', 'tea-drop', 'moon-dream'];

const TranquiliMatchGame: React.FC<TranquiliMatchGameProps> = ({ onBack }) => {
  const { user, addXP } = useUser();
  const { playGameSound, isSoundOn, toggleSound } = useAudio();
  const { showAchievementAnimation } = useAchievementAnimation();

  const [gameState, setGameState] = useState<GameState>({
    board: [],
    level: 1,
    score: 0,
    moves: 0,
    maxMoves: 20,
    target: 15,
    collected: 0,
    isZenMode: false,
    gameStatus: 'playing'
  });

  const [selectedPieces, setSelectedPieces] = useState<{x: number, y: number}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Carregar progresso salvo
  useEffect(() => {
    const savedProgress = localStorage.getItem(`tranquili-match-progress-${user?.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setGameState(prev => ({
        ...prev,
        level: progress.level || 1,
        score: progress.score || 0
      }));
    }
  }, [user?.id]);

  // Salvar progresso
  const saveProgress = useCallback(() => {
    if (user?.id) {
      const progress = {
        level: gameState.level,
        score: gameState.score,
        lastPlayed: Date.now()
      };
      localStorage.setItem(`tranquili-match-progress-${user.id}`, JSON.stringify(progress));
    }
  }, [user?.id, gameState.level, gameState.score]);

  // Inicializar tabuleiro
  const initializeBoard = useCallback(() => {
    const newBoard: GamePiece[][] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      newBoard[y] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        const randomType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
        newBoard[y][x] = {
          type: randomType,
          id: `${x}-${y}-${Date.now()}`,
          x,
          y,
          isSelected: false,
          isMatched: false,
          isSpecial: false
        };
      }
    }
    return newBoard;
  }, []);

  // Inicializar jogo
  useEffect(() => {
    const board = initializeBoard();
    setGameState(prev => ({
      ...prev,
      board,
      moves: 0,
      collected: 0,
      maxMoves: Math.min(20 + prev.level * 2, 40),
      target: Math.min(15 + prev.level * 3, 50),
      isZenMode: prev.level % 10 === 0,
      gameStatus: 'playing'
    }));
  }, [gameState.level, initializeBoard]);

  // Obter emoji da peça
  const getPieceEmoji = (type: PieceType): string => {
    switch (type) {
      case 'calm-bubble': return '🫧';
      case 'zen-leaf': return '🍃';
      case 'tea-drop': return '💧';
      case 'moon-dream': return '🌙';
      default: return '';
    }
  };

  // Obter cor da peça
  const getPieceColor = (type: PieceType): string => {
    switch (type) {
      case 'calm-bubble': return 'bg-blue-200 border-blue-300';
      case 'zen-leaf': return 'bg-green-200 border-green-300';
      case 'tea-drop': return 'bg-yellow-200 border-yellow-300';
      case 'moon-dream': return 'bg-purple-200 border-purple-300';
      default: return 'bg-gray-100';
    }
  };

  // Verificar combinações válidas
  const findMatches = useCallback((board: GamePiece[][]) => {
    const matches: {x: number, y: number}[] = [];
    
    // Verificar horizontalmente
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        const type = board[y][x].type;
        if (type !== 'empty' && 
            board[y][x + 1].type === type && 
            board[y][x + 2].type === type) {
          let count = 3;
          matches.push({x, y}, {x: x + 1, y}, {x: x + 2, y});
          
          // Verificar se há mais peças na sequência
          while (x + count < BOARD_SIZE && board[y][x + count].type === type) {
            matches.push({x: x + count, y});
            count++;
          }
          x += count - 1;
        }
      }
    }

    // Verificar verticalmente
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        const type = board[y][x].type;
        if (type !== 'empty' && 
            board[y + 1][x].type === type && 
            board[y + 2][x].type === type) {
          let count = 3;
          matches.push({x, y}, {x, y: y + 1}, {x, y: y + 2});
          
          while (y + count < BOARD_SIZE && board[y + count][x].type === type) {
            matches.push({x, y: y + count});
            count++;
          }
          y += count - 1;
        }
      }
    }

    return matches;
  }, []);

  // Manipular clique na peça
  const handlePieceClick = useCallback((x: number, y: number) => {
    if (isAnimating || gameState.gameStatus !== 'playing') return;

    const piece = gameState.board[y][x];
    if (!piece || piece.type === 'empty') return;

    playGameSound('click');

    // Se não há peças selecionadas, selecionar a primeira
    if (selectedPieces.length === 0) {
      setSelectedPieces([{x, y}]);
      return;
    }

    // Se já está selecionada, desselecionar
    const isAlreadySelected = selectedPieces.some(p => p.x === x && p.y === y);
    if (isAlreadySelected) {
      setSelectedPieces([]);
      return;
    }

    // Verificar se é adjacente à peça selecionada
    const lastSelected = selectedPieces[selectedPieces.length - 1];
    const isAdjacent = Math.abs(lastSelected.x - x) + Math.abs(lastSelected.y - y) === 1;
    
    if (isAdjacent) {
      // Trocar peças
      swapPieces(lastSelected.x, lastSelected.y, x, y);
      setSelectedPieces([]);
    } else {
      // Selecionar nova peça
      setSelectedPieces([{x, y}]);
    }
  }, [gameState.board, selectedPieces, isAnimating, gameState.gameStatus, playGameSound]);

  // Trocar peças
  const swapPieces = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    setIsAnimating(true);
    
    const newBoard = [...gameState.board];
    const temp = newBoard[y1][x1];
    newBoard[y1][x1] = newBoard[y2][x2];
    newBoard[y2][x2] = temp;

    // Verificar se a troca resulta em combinações
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      // Troca válida
      playGameSound('correct');
      processMatches(newBoard, matches);
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moves: prev.moves + 1
      }));
    } else {
      // Troca inválida - reverter
      playGameSound('incorrect');
      setIsAnimating(false);
    }
  }, [gameState.board, findMatches, playGameSound]);

  // Processar combinações
  const processMatches = useCallback((board: GamePiece[][], matches: {x: number, y: number}[]) => {
    // Marcar peças combinadas
    matches.forEach(({x, y}) => {
      board[y][x].isMatched = true;
    });

    setTimeout(() => {
      // Remover peças combinadas
      matches.forEach(({x, y}) => {
        board[y][x].type = 'empty';
        board[y][x].isMatched = false;
      });

      // Fazer peças caírem
      for (let x = 0; x < BOARD_SIZE; x++) {
        let writeIndex = BOARD_SIZE - 1;
        for (let y = BOARD_SIZE - 1; y >= 0; y--) {
          if (board[y][x].type !== 'empty') {
            if (y !== writeIndex) {
              board[writeIndex][x] = board[y][x];
              board[y][x].type = 'empty';
            }
            writeIndex--;
          }
        }

        // Preencher espaços vazios com novas peças
        for (let y = writeIndex; y >= 0; y--) {
          const randomType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
          board[y][x] = {
            type: randomType,
            id: `${x}-${y}-${Date.now()}`,
            x,
            y,
            isSelected: false,
            isMatched: false,
            isSpecial: false
          };
        }
      }

      setGameState(prev => ({
        ...prev,
        board: [...board],
        collected: prev.collected + matches.length,
        score: prev.score + matches.length * 10
      }));

      // Verificar novas combinações
      setTimeout(() => {
        const newMatches = findMatches(board);
        if (newMatches.length > 0) {
          processMatches(board, newMatches);
        } else {
          setIsAnimating(false);
          checkGameStatus();
        }
      }, 300);
    }, 500);
  }, [findMatches]);

  // Verificar status do jogo
  const checkGameStatus = useCallback(() => {
    if (gameState.isZenMode) return; // Modo zen não tem condições de vitória/derrota

    if (gameState.collected >= gameState.target) {
      // Vitória
      setGameState(prev => ({ ...prev, gameStatus: 'won' }));
      playGameSound('victory');
      addXP(50);
      saveProgress();
      
      // Conquistas
      if (gameState.level === 1) {
        showAchievementAnimation({
          id: 'tranquili_first_match',
          title: 'Primeira Combinação',
          description: 'Complete sua primeira fase no TranquiliMatch+',
          icon: <Heart className="h-6 w-6" />,
          category: 'games'
        });
      }
    } else if (gameState.moves >= gameState.maxMoves) {
      // Derrota
      setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
    }
  }, [gameState.collected, gameState.target, gameState.moves, gameState.maxMoves, gameState.isZenMode, gameState.level, playGameSound, addXP, saveProgress, showAchievementAnimation]);

  // Próxima fase
  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      gameStatus: 'playing'
    }));
    playGameSound('click');
  };

  // Tentar novamente
  const retryLevel = () => {
    setGameState(prev => ({
      ...prev,
      moves: 0,
      collected: 0,
      gameStatus: 'playing'
    }));
    const board = initializeBoard();
    setGameState(prev => ({ ...prev, board }));
    playGameSound('click');
  };

  const progressPercent = gameState.isZenMode ? 100 : (gameState.collected / gameState.target) * 100;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="glassmorphism mb-6">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  TranquiliMatch+
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {gameState.isZenMode ? 'Modo Zen - Relaxe livremente' : `Fase ${gameState.level}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSound}>
                {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Badge variant="secondary">
                Pontos: {gameState.score}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Game Info */}
        {!gameState.isZenMode && (
          <Card className="glassmorphism mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Objetivo</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {gameState.collected}/{gameState.target} combinações
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Movimentos</span>
                  </div>
                  <p className="text-lg font-bold text-center">
                    {gameState.maxMoves - gameState.moves}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    restantes
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-medium">Próxima Fase</span>
                  </div>
                  <p className="text-lg font-bold text-center">
                    {gameState.level % 10 === 9 ? 'Zen' : gameState.level + 1}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    em breve
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <Card className="glassmorphism mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-8 gap-1 max-w-md mx-auto">
              {gameState.board.map((row, y) =>
                row.map((piece, x) => {
                  const isSelected = selectedPieces.some(p => p.x === x && p.y === y);
                  return (
                    <button
                      key={piece.id}
                      onClick={() => handlePieceClick(x, y)}
                      disabled={isAnimating}
                      className={`
                        aspect-square rounded-lg border-2 text-lg transition-all duration-200
                        hover:scale-110 active:scale-95 flex items-center justify-center
                        ${getPieceColor(piece.type)}
                        ${isSelected ? 'ring-2 ring-accent scale-110' : ''}
                        ${piece.isMatched ? 'animate-bounce' : ''}
                        ${piece.type === 'empty' ? 'opacity-0' : ''}
                      `}
                    >
                      {getPieceEmoji(piece.type)}
                    </button>
                  );
                })
              )}
            </div>
            
            {gameState.isZenMode && (
              <div className="text-center mt-6">
                <div className="text-4xl mb-2">🧘‍♀️</div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Modo Zen Ativado</h3>
                <p className="text-sm text-muted-foreground">
                  Relaxe e combine peças livremente. Sem pressão, apenas paz.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Over Screen */}
        {gameState.gameStatus === 'won' && (
          <Card className="glassmorphism">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Fase Concluída!</h2>
              <p className="text-muted-foreground mb-6">
                Parabéns! Você completou a fase {gameState.level} com {gameState.score} pontos.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600">
                  Próxima Fase
                </Button>
                <Button variant="outline" onClick={onBack}>
                  Voltar ao Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gameState.gameStatus === 'lost' && (
          <Card className="glassmorphism">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🌸</div>
              <h2 className="text-2xl font-bold mb-2">Respire e Tente Novamente</h2>
              <p className="text-muted-foreground mb-6">
                Não se preocupe! O TranquiliMatch+ é sobre relaxar e se divertir.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={retryLevel} className="bg-blue-500 hover:bg-blue-600">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={onBack}>
                  Voltar ao Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranquiliMatchGame;
