import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pause, RotateCcw, Sparkles, Heart } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

interface TranquiliMatchGameProps {
  onBack: () => void;
}

type PieceType = 'bubble' | 'leaf' | 'drop' | 'moon' | 'special';

interface Piece {
  id: string;
  type: PieceType;
  row: number;
  col: number;
  isSelected: boolean;
  isMatched: boolean;
  isSpecial: boolean;
  isMoving: boolean;
  isNewPiece: boolean;
}

interface GameState {
  level: number;
  moves: number;
  maxMoves: number;
  goal: number;
  collected: number;
  targetType: PieceType;
  isCompleted: boolean;
  isPaused: boolean;
  isZenMode: boolean;
}

const BOARD_SIZE = 7;
const PIECE_TYPES: PieceType[] = ['bubble', 'leaf', 'drop', 'moon'];

const TranquiliMatchGame: React.FC<TranquiliMatchGameProps> = ({ onBack }) => {
  const { playGameSound, playCardSound, playMoodSound, startGameAmbient, stopGameAmbient } = useAudio();
  const { user, addXP, updateGameProgress } = useUser();
  
  const [board, setBoard] = useState<Piece[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    moves: 0,
    maxMoves: 20,
    goal: 15,
    collected: 0,
    targetType: 'bubble',
    isCompleted: false,
    isPaused: false,
    isZenMode: false
  });

  // Inicializar som ambiente
  useEffect(() => {
    startGameAmbient('memory');
    
    return () => {
      stopGameAmbient();
    };
  }, [startGameAmbient, stopGameAmbient]);

  // Inicializar tabuleiro
  const initializeBoard = useCallback(() => {
    const newBoard: Piece[][] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      newBoard[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        newBoard[row][col] = {
          id: `${row}-${col}`,
          type: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
          row,
          col,
          isSelected: false,
          isMatched: false,
          isSpecial: false,
          isMoving: false,
          isNewPiece: true
        };
      }
    }
    setBoard(newBoard);

    // Remover flag de nova peça após animação
    setTimeout(() => {
      setBoard(prevBoard => 
        prevBoard.map(row => 
          row.map(piece => ({ ...piece, isNewPiece: false }))
        )
      );
    }, 800);
  }, []);

  // Verificar matches
  const findMatches = useCallback((board: Piece[][]) => {
    const matches: Piece[] = [];
    
    // Verificar matches horizontais
    for (let row = 0; row < BOARD_SIZE; row++) {
      let count = 1;
      let currentType = board[row][0].type;
      for (let col = 1; col < BOARD_SIZE; col++) {
        if (board[row][col].type === currentType && !board[row][col].isMatched) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.push(board[row][i]);
            }
          }
          count = 1;
          currentType = board[row][col].type;
        }
      }
      if (count >= 3) {
        for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
          matches.push(board[row][i]);
        }
      }
    }

    // Verificar matches verticais
    for (let col = 0; col < BOARD_SIZE; col++) {
      let count = 1;
      let currentType = board[0][col].type;
      for (let row = 1; row < BOARD_SIZE; row++) {
        if (board[row][col].type === currentType && !board[row][col].isMatched) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.push(board[i][col]);
            }
          }
          count = 1;
          currentType = board[row][col].type;
        }
      }
      if (count >= 3) {
        for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
          matches.push(board[i][col]);
        }
      }
    }

    return matches;
  }, []);

  // Trocar peças com animação
  const swapPieces = useCallback((row1: number, col1: number, row2: number, col2: number) => {
    // Som suave de movimento
    playMoodSound('calm');
    
    // Marcar peças como em movimento
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      newBoard[row1][col1].isMoving = true;
      newBoard[row2][col2].isMoving = true;
      return newBoard;
    });

    // Aguardar animação e depois trocar
    setTimeout(() => {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        const temp = newBoard[row1][col1].type;
        newBoard[row1][col1].type = newBoard[row2][col2].type;
        newBoard[row2][col2].type = temp;
        
        // Remover flag de movimento
        newBoard[row1][col1].isMoving = false;
        newBoard[row2][col2].isMoving = false;
        
        return newBoard;
      });
    }, 300);
  }, [playMoodSound]);

  // Fazer peças caírem com animação
  const dropPieces = useCallback(() => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      
      for (let col = 0; col < BOARD_SIZE; col++) {
        let emptySpaces = 0;
        
        // Contar espaços vazios de baixo para cima
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
          if (newBoard[row][col].isMatched) {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            // Mover peça para baixo
            const newRow = row + emptySpaces;
            newBoard[newRow][col] = { 
              ...newBoard[row][col], 
              row: newRow,
              isMoving: true 
            };
            newBoard[row][col] = {
              id: `empty-${row}-${col}`,
              type: 'bubble',
              row,
              col,
              isSelected: false,
              isMatched: true,
              isSpecial: false,
              isMoving: false,
              isNewPiece: false
            };
          }
        }
        
        // Preencher espaços vazios no topo
        for (let row = 0; row < emptySpaces; row++) {
          newBoard[row][col] = {
            id: `new-${row}-${col}-${Date.now()}`,
            type: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
            row,
            col,
            isSelected: false,
            isMatched: false,
            isSpecial: false,
            isMoving: false,
            isNewPiece: true
          };
        }
      }
      
      return newBoard;
    });

    // Som de peças caindo
    playCardSound('flip');
    
    // Remover flags de movimento e nova peça após animação
    setTimeout(() => {
      setBoard(prevBoard => 
        prevBoard.map(row => 
          row.map(piece => ({ 
            ...piece, 
            isMoving: false, 
            isNewPiece: false 
          }))
        )
      );
    }, 600);
  }, [playCardSound]);

  // Lidar com clique na peça
  const handlePieceClick = useCallback((row: number, col: number) => {
    if (gameState.isPaused || gameState.isCompleted) return;

    // Som de toque suave
    playCardSound('flip');

    if (!selectedPiece) {
      setSelectedPiece({row, col});
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => r.map(c => ({...c, isSelected: false})));
        newBoard[row][col].isSelected = true;
        return newBoard;
      });
    } else {
      const { row: selectedRow, col: selectedCol } = selectedPiece;
      
      // Verificar se é uma peça adjacente
      const isAdjacent = 
        (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
        (Math.abs(col - selectedCol) === 1 && row === selectedRow);

      if (isAdjacent) {
        swapPieces(selectedRow, selectedCol, row, col);
        
        // Verificar matches após o movimento
        setTimeout(() => {
          const matches = findMatches(board);
          if (matches.length > 0) {
            playGameSound('correct');
            
            // Contar peças coletadas do tipo objetivo
            const targetMatches = matches.filter(piece => piece.type === gameState.targetType);
            
            setGameState(prev => ({
              ...prev,
              moves: prev.moves + 1,
              collected: prev.collected + targetMatches.length
            }));

            // Marcar matches para remoção com animação
            setBoard(prevBoard => {
              const newBoard = prevBoard.map(row => [...row]);
              matches.forEach(match => {
                newBoard[match.row][match.col].isMatched = true;
              });
              return newBoard;
            });

            // Fazer peças caírem após um delay
            setTimeout(() => {
              dropPieces();
            }, 400);

            // Adicionar XP
            addXP(matches.length * 5);
          } else {
            // Desfazer movimento se não houver matches
            setTimeout(() => {
              swapPieces(row, col, selectedRow, selectedCol);
            }, 300);
          }
          
          setGameState(prev => ({ ...prev, moves: prev.moves + 1 }));
        }, 350);
      }

      setSelectedPiece(null);
      setBoard(prevBoard => prevBoard.map(r => r.map(c => ({...c, isSelected: false}))));
    }
  }, [selectedPiece, gameState.isPaused, gameState.isCompleted, gameState.targetType, board, playCardSound, playGameSound, swapPieces, findMatches, addXP, dropPieces]);

  // Verificar vitória
  useEffect(() => {
    if (gameState.collected >= gameState.goal && !gameState.isCompleted) {
      setGameState(prev => ({ ...prev, isCompleted: true }));
      playGameSound('victory');
      addXP(100);
      
      // Salvar progresso
      if (user) {
        updateGameProgress('tranquiliMatch', {
          currentLevel: gameState.level,
          highestLevel: Math.max(gameState.level, user.gameProgress?.tranquiliMatch?.highestLevel || 0),
          totalMatches: (user.gameProgress?.tranquiliMatch?.totalMatches || 0) + gameState.collected,
          timePlayedToday: (user.gameProgress?.tranquiliMatch?.timePlayedToday || 0) + 1,
          lastPlayDate: new Date().toISOString().split('T')[0]
        });
      }
      
      // Próximo nível após 2 segundos
      setTimeout(() => {
        const nextLevel = gameState.level + 1;
        const isZenMode = nextLevel % 10 === 0;
        
        setGameState({
          level: nextLevel,
          moves: 0,
          maxMoves: isZenMode ? 999 : Math.min(15 + Math.floor(nextLevel / 3), 30),
          goal: isZenMode ? 0 : Math.min(10 + Math.floor(nextLevel * 1.5), 50),
          collected: 0,
          targetType: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
          isCompleted: false,
          isPaused: false,
          isZenMode
        });
        
        initializeBoard();
      }, 2000);
    }
  }, [gameState.collected, gameState.goal, gameState.isCompleted, gameState.level, playGameSound, addXP, initializeBoard, user, updateGameProgress]);

  // Inicializar jogo
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const getPieceIcon = (type: PieceType) => {
    switch (type) {
      case 'bubble':
        return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-lg border-2 border-white/50"></div>;
      case 'leaf':
        return <div className="w-10 h-8 bg-gradient-to-br from-green-300 to-green-500 shadow-lg border-2 border-white/50 rounded-full transform rotate-45"></div>;
      case 'drop':
        return <div className="w-8 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg border-2 border-white/50 rounded-full"></div>;
      case 'moon':
        return <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-purple-500 shadow-lg border-2 border-white/50 rounded-tl-full rounded-br-full"></div>;
      default:
        return <Sparkles className="h-8 w-8 text-pink-400" />;
    }
  };

  const getPieceTypeName = (type: PieceType) => {
    switch (type) {
      case 'bubble': return 'Bolhas de Calma';
      case 'leaf': return 'Folhas Zen';
      case 'drop': return 'Gotas de Chá';
      case 'moon': return 'Luas do Sono';
      default: return 'Especial';
    }
  };

  const handleBack = () => {
    playGameSound('click');
    onBack();
  };

  const handlePause = () => {
    playGameSound('click');
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleRestart = () => {
    playGameSound('click');
    setGameState(prev => ({
      ...prev,
      moves: 0,
      collected: 0,
      isCompleted: false,
      isPaused: false
    }));
    initializeBoard();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <CardTitle className="text-lg">TranquiliMatch+</CardTitle>
              <p className="text-sm text-muted-foreground">
                {gameState.isZenMode ? '🧘 Modo Zen' : `Nível ${gameState.level}`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handlePause}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        {!gameState.isZenMode && (
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-sm">
                <div className="text-center">
                  <div className="font-medium">Objetivo</div>
                  <div className="flex items-center gap-1">
                    {getPieceIcon(gameState.targetType)}
                    <span>{gameState.collected}/{gameState.goal}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-medium">Movimentos</div>
                  <div className="text-lg font-bold text-[#38B6FF]">
                    {gameState.maxMoves - gameState.moves}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-medium">Nível</div>
                  <div className="text-lg font-bold text-[#CDB4DB]">
                    {gameState.level}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modo Zen Info */}
        {gameState.isZenMode && (
          <Card className="glassmorphism bg-gradient-to-r from-purple-100 to-pink-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🧘‍♀️</div>
              <h3 className="font-medium text-purple-700">Momento Zen</h3>
              <p className="text-sm text-purple-600">
                Relaxe e combine livremente. Sem metas, apenas tranquilidade.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <Card className="glassmorphism bg-gradient-to-br from-blue-100/50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 bg-blue-200/30 p-2 rounded-xl">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                  <div
                    key={piece.id}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg cursor-pointer
                      transition-all duration-300 ease-out
                      ${piece.isSelected ? 'ring-2 ring-accent scale-110 animate-pulse' : ''}
                      ${piece.isMatched ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                      ${piece.isMoving ? 'animate-[spin_0.5s_ease-in-out]' : ''}
                      ${piece.isNewPiece ? 'animate-[fade-in_0.8s_ease-out]' : ''}
                      bg-white/40 backdrop-blur-sm hover:scale-105 hover:bg-white/60
                      transform-gpu will-change-transform
                    `}
                    onClick={() => handlePieceClick(rowIndex, colIndex)}
                    style={{
                      animationDelay: piece.isNewPiece ? `${(rowIndex + colIndex) * 0.1}s` : '0s'
                    }}
                  >
                    {getPieceIcon(piece.type)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Victory Message */}
        {gameState.isCompleted && (
          <Card className="glassmorphism bg-gradient-to-r from-green-100 to-blue-100 animate-fade-in">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-6xl animate-bounce">✨</div>
              <h3 className="text-xl font-medium text-green-700">
                {gameState.isZenMode ? 'Momento Zen Concluído!' : 'Nível Completo!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {gameState.isZenMode 
                  ? 'Você encontrou sua tranquilidade interior' 
                  : `Parabéns! Você coletou ${gameState.goal} ${getPieceTypeName(gameState.targetType)}`
                }
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 animate-scale-in">
                  <Heart className="h-3 w-3 mr-1" />
                  +100 XP
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pause Overlay */}
        {gameState.isPaused && (
          <Card className="glassmorphism bg-gradient-to-r from-blue-100 to-purple-100">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl animate-pulse">⏸️</div>
              <h3 className="text-lg font-medium">Jogo Pausado</h3>
              <p className="text-sm text-muted-foreground">
                Respire fundo e volte quando estiver pronto
              </p>
              <Button onClick={handlePause} className="bg-[#38B6FF] hover:bg-[#38B6FF]/90">
                Continuar Jornada
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranquiliMatchGame;
