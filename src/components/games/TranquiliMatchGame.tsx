
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';

interface TranquiliMatchGameProps {
  onBack: () => void;
}

type PieceType = 'bubble' | 'leaf' | 'drop' | 'moon' | null;

interface GamePiece {
  type: PieceType;
  id: string;
  isMatched: boolean;
  isSpecial: boolean;
}

interface GameState {
  board: GamePiece[][];
  score: number;
  moves: number;
  maxMoves: number;
  level: number;
  target: number;
  collected: { [key in PieceType]: number };
  targetType: PieceType;
  isCompleted: boolean;
  isGameOver: boolean;
}

const BOARD_SIZE = 8;
const PIECE_TYPES: PieceType[] = ['bubble', 'leaf', 'drop', 'moon'];

const pieceEmojis = {
  bubble: '🫧',
  leaf: '🍃', 
  drop: '💧',
  moon: '🌙'
};

const pieceColors = {
  bubble: 'bg-blue-200 border-blue-300',
  leaf: 'bg-green-200 border-green-300',
  drop: 'bg-yellow-200 border-yellow-300',
  moon: 'bg-purple-200 border-purple-300'
};

const TranquiliMatchGame: React.FC<TranquiliMatchGameProps> = ({ onBack }) => {
  const { user, addXP } = useUser();
  const { playGameSound } = useAudio();

  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  function initializeGame(): GameState {
    const savedProgress = localStorage.getItem(`tranquili-match-${user?.id}`);
    const currentLevel = savedProgress ? JSON.parse(savedProgress).level || 1 : 1;
    
    const board = createBoard();
    const targetType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    const target = Math.min(15 + currentLevel * 2, 50);
    const maxMoves = Math.max(20, 35 - Math.floor(currentLevel / 3));

    return {
      board,
      score: 0,
      moves: 0,
      maxMoves,
      level: currentLevel,
      target,
      collected: { bubble: 0, leaf: 0, drop: 0, moon: 0 },
      targetType,
      isCompleted: false,
      isGameOver: false
    };
  }

  function createBoard(): GamePiece[][] {
    const board: GamePiece[][] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        board[row][col] = createRandomPiece();
      }
    }
    return board;
  }

  function createRandomPiece(): GamePiece {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    return {
      type,
      id: Math.random().toString(36).substr(2, 9),
      isMatched: false,
      isSpecial: false
    };
  }

  const saveProgress = useCallback(() => {
    if (!user) return;
    
    const progress = {
      level: gameState.level,
      score: gameState.score,
      lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem(`tranquili-match-${user.id}`, JSON.stringify(progress));
  }, [user, gameState.level, gameState.score]);

  const handlePieceClick = (row: number, col: number) => {
    if (isAnimating || gameState.isCompleted || gameState.isGameOver) return;

    playGameSound('click');

    if (!selectedPiece) {
      setSelectedPiece({ row, col });
      return;
    }

    if (selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null);
      return;
    }

    // Check if pieces are adjacent
    const isAdjacent = Math.abs(selectedPiece.row - row) + Math.abs(selectedPiece.col - col) === 1;
    
    if (isAdjacent) {
      swapPieces(selectedPiece.row, selectedPiece.col, row, col);
    }
    
    setSelectedPiece(null);
  };

  const swapPieces = (row1: number, col1: number, row2: number, col2: number) => {
    setIsAnimating(true);
    
    const newBoard = [...gameState.board];
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;

    // Check for matches
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      playGameSound('correct');
      processMatches(newBoard, matches);
    } else {
      // Swap back if no matches
      const revertBoard = [...newBoard];
      revertBoard[row1][col1] = revertBoard[row2][col2];
      revertBoard[row2][col2] = temp;
      setGameState(prev => ({ ...prev, board: revertBoard }));
      playGameSound('incorrect');
    }

    setGameState(prev => ({ ...prev, moves: prev.moves + 1 }));
    setIsAnimating(false);
  };

  const findMatches = (board: GamePiece[][]): {row: number, col: number}[] => {
    const matches: {row: number, col: number}[] = [];
    const visited = new Set<string>();

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (board[row][col].type && 
            board[row][col].type === board[row][col + 1].type && 
            board[row][col].type === board[row][col + 2].type) {
          
          for (let i = col; i < BOARD_SIZE && board[row][i].type === board[row][col].type; i++) {
            const key = `${row}-${i}`;
            if (!visited.has(key)) {
              matches.push({ row, col: i });
              visited.add(key);
            }
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        if (board[row][col].type && 
            board[row][col].type === board[row + 1][col].type && 
            board[row][col].type === board[row + 2][col].type) {
          
          for (let i = row; i < BOARD_SIZE && board[i][col].type === board[row][col].type; i++) {
            const key = `${i}-${col}`;
            if (!visited.has(key)) {
              matches.push({ row: i, col });
              visited.add(key);
            }
          }
        }
      }
    }

    return matches;
  };

  const processMatches = (board: GamePiece[][], matches: {row: number, col: number}[]) => {
    const newBoard = [...board];
    const newCollected = { ...gameState.collected };
    let scoreBonus = 0;

    matches.forEach(({ row, col }) => {
      const pieceType = newBoard[row][col].type;
      if (pieceType) {
        newCollected[pieceType]++;
        scoreBonus += 10;
        newBoard[row][col] = { ...newBoard[row][col], isMatched: true };
      }
    });

    // Remove matched pieces and apply gravity
    setTimeout(() => {
      applyGravity(newBoard);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        score: prev.score + scoreBonus,
        collected: newCollected
      }));
    }, 300);
  };

  const applyGravity = (board: GamePiece[][]) => {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Remove matched pieces
      const newColumn = board.map(row => row[col]).filter(piece => !piece.isMatched);
      
      // Add new pieces at the top
      while (newColumn.length < BOARD_SIZE) {
        newColumn.unshift(createRandomPiece());
      }
      
      // Update the board
      for (let row = 0; row < BOARD_SIZE; row++) {
        board[row][col] = newColumn[row];
      }
    }
  };

  const resetLevel = () => {
    playGameSound('click');
    setGameState(initializeGame());
    setSelectedPiece(null);
  };

  const nextLevel = () => {
    playGameSound('victory');
    addXP(50);
    
    const newLevel = gameState.level + 1;
    const targetType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    const target = Math.min(15 + newLevel * 2, 50);
    const maxMoves = Math.max(20, 35 - Math.floor(newLevel / 3));

    setGameState({
      board: createBoard(),
      score: gameState.score,
      moves: 0,
      maxMoves,
      level: newLevel,
      target,
      collected: { bubble: 0, leaf: 0, drop: 0, moon: 0 },
      targetType,
      isCompleted: false,
      isGameOver: false
    });
  };

  // Check win/lose conditions
  useEffect(() => {
    const targetCollected = gameState.collected[gameState.targetType!] || 0;
    
    if (targetCollected >= gameState.target) {
      setGameState(prev => ({ ...prev, isCompleted: true }));
    } else if (gameState.moves >= gameState.maxMoves) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  }, [gameState.collected, gameState.target, gameState.targetType, gameState.moves, gameState.maxMoves]);

  // Save progress
  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  const targetCollected = gameState.collected[gameState.targetType!] || 0;
  const progress = Math.min((targetCollected / gameState.target) * 100, 100);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
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
                <Sparkles className="h-5 w-5 text-blue-500" />
                TranquiliMatch+ - Fase {gameState.level}
              </CardTitle>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetLevel}
              className="ml-4"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </CardHeader>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glassmorphism text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
              <div className="text-sm text-muted-foreground">Pontos</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{gameState.maxMoves - gameState.moves}</div>
              <div className="text-sm text-muted-foreground">Movimentos</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="pt-4">
              <div className="text-2xl">
                {gameState.targetType ? pieceEmojis[gameState.targetType] : '🎯'}
              </div>
              <div className="text-sm text-muted-foreground">Meta</div>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">
                {targetCollected}/{gameState.target}
              </div>
              <div className="text-sm text-muted-foreground">Coletados</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="glassmorphism">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Fase</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card className="glassmorphism">
          <CardContent className="pt-6">
            <div className="grid grid-cols-8 gap-1 max-w-lg mx-auto">
              {gameState.board.map((row, rowIndex) => 
                row.map((piece, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}-${piece.id}`}
                    className={`
                      aspect-square rounded-lg border-2 text-2xl transition-all duration-200
                      ${piece.type ? pieceColors[piece.type] : 'bg-gray-100 border-gray-200'}
                      ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex 
                        ? 'ring-4 ring-blue-400 scale-110' 
                        : 'hover:scale-105'
                      }
                      ${piece.isMatched ? 'opacity-50 scale-75' : ''}
                      ${isAnimating ? 'pointer-events-none' : ''}
                    `}
                    onClick={() => handlePieceClick(rowIndex, colIndex)}
                    disabled={isAnimating}
                  >
                    {piece.type ? pieceEmojis[piece.type] : ''}
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Win/Lose Modal */}
        {(gameState.isCompleted || gameState.isGameOver) && (
          <Card className="glassmorphism">
            <CardContent className="pt-6 text-center space-y-4">
              {gameState.isCompleted ? (
                <>
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600">Fase Concluída!</h2>
                  <p className="text-muted-foreground">
                    Respira e vai... você conseguiu! ✨
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={onBack} variant="outline">
                      <Home className="h-4 w-4 mr-2" />
                      Menu Principal
                    </Button>
                    <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600">
                      <Target className="h-4 w-4 mr-2" />
                      Próxima Fase
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl">🧘‍♀️</div>
                  <h2 className="text-2xl font-bold text-blue-600">Respire e tente novamente</h2>
                  <p className="text-muted-foreground">
                    Sem pressa, sem estresse. Você pode tentar quantas vezes quiser! 💙
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={onBack} variant="outline">
                      <Home className="h-4 w-4 mr-2" />
                      Menu Principal
                    </Button>
                    <Button onClick={resetLevel} className="bg-blue-500 hover:bg-blue-600">
                      <Zap className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranquiliMatchGame;
